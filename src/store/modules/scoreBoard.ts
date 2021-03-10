import Vue from "vue";
import { db } from "@/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

import { Score, ScoreBoard, Rule, InputMode, UserInfo } from "@/models";

// firestoreのための配列→オブジェクト変換
function formatNestedArray(arr: any) {
  interface Obj {
    [key: string]: any;
  }
  const obj: Obj = {};
  for (let i = 0; i < arr.length; i++) {
    obj[i] = arr[i];
  }
  return obj;
}

let unsubscribeScoreBoardIds: any = null;
let unsubscribeScoreBoards: any = null;
let unsubscribeScoreBoard: any = null;

interface State {
  scoreBoards: ScoreBoard[];
  scoreBoard: ScoreBoard;
  inputMode: InputMode;
}

const state = () => ({
  scoreBoards: [],
  scoreBoard: {},
  inputMode: localStorage.getItem("inputMode") || "pt"
});

const mutations = {
  setScoreBoards: (state: State, scoreBoards: ScoreBoard[]) => {
    state.scoreBoards = scoreBoards;
  },

  setScoreBoard: (state: State, scoreBoard: ScoreBoard) => {
    state.scoreBoard = scoreBoard;
  },

  changeInputMode: (state: State, inputMode: InputMode) => {
    state.inputMode = inputMode;
  }
};

const actions = {
  create: async ({ rootGetters, dispatch }: any, rule: Rule) => {
    const me: UserInfo = rootGetters["user/user"];
    const players: UserInfo[] = [me];
    for (let i = 1; i < rule.playerNumber; i++) {
      players.push({
        uid: `player${i}`,
        name: `player${i}`,
        mid: "",
        email: "",
        scoreBoardIds: []
      });
    }
    let id = "";
    const scoreBoard: ScoreBoard = {
      players: players,
      rule: rule,
      scoress: [],
      chips: [],
      createdAt: new Date(),
      createdBy: me.uid
    };
    await db
      .collection("scores")
      .add({
        ...scoreBoard,
        scoress: {},
        createdAt: firebase.firestore.Timestamp.fromDate(new Date())
      })
      .then(doc => {
        id = doc.id;
        return dispatch("addPlayerScoreBoardId", {
          uid: me.uid,
          scoreBoardId: doc.id
        });
      });
    return id;
  },

  delete: async ({ state }: { state: State }) => {
    return db.collection("scores").doc(state.scoreBoard.id).delete();
  },

  // プレイヤーの打った成績表のIDを記録
  addPlayerScoreBoardId: (
    { commit }: any,
    { uid, scoreBoardId }: { uid: string; scoreBoardId: string }
  ) => {
    return db
      .collection("users")
      .doc(uid)
      .update({
        scoreBoardIds: firebase.firestore.FieldValue.arrayUnion(scoreBoardId)
      });
  },

  startScoreBoardsListener: ({ rootGetters, commit }: any) => {
    return new Promise((resolve, reject) => {
      const user: UserInfo = rootGetters["user/user"];
      unsubscribeScoreBoardIds = db
        .collection("users")
        .doc(user.uid)
        .onSnapshot(
          (doc: any) => {
            const scoreBoardIds: string[] = doc.data().scoreBoardIds;
            const scoreBoards: ScoreBoard[] = [];
            unsubscribeScoreBoards = db.collection("scores").onSnapshot(
              snapshot => {
                snapshot.docChanges().forEach((change: any) => {
                  const id = change.doc.id;
                  const data = change.doc.data();
                  if (scoreBoardIds.includes(id))
                    [
                      scoreBoards.push({
                        ...data,
                        createdAt: data.createdAt.toDate(),
                        id
                      })
                    ];
                });
                resolve(scoreBoards);
                commit("setScoreBoards", scoreBoards);
              },
              error => {
                reject(error);
              }
            );
          },
          error => {
            reject(error);
          }
        );
    });
  },

  stopScoreBoardsListener: () => {
    unsubscribeScoreBoards();
    unsubscribeScoreBoardIds();
  },

  startScoreBoardListener: ({ commit }: any, id: string) => {
    return new Promise((resolve, reject) => {
      unsubscribeScoreBoard = db
        .collection("scores")
        .doc(id)
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (!data) {
              reject("データが存在しません");
            } else {
              commit("setScoreBoard", {
                ...data,
                createdAt: data.createdAt.toDate(),
                id: id,
                scoress: Object.values(data.scoress)
              });
              resolve(doc);
            }
          } else {
            reject("成績表が見つかりません");
          }
        });
    });
  },

  stopScoreBoardListener: () => {
    unsubscribeScoreBoard();
  },

  changeInputMode: ({ commit }: any, inputMode: InputMode) => {
    localStorage.setItem("inputMode", inputMode);
    commit("changeInputMode", inputMode);
  },

  //プレイヤー関連
  addPlayer: async ({ state }: { state: State }, player: UserInfo) => {
    return db
      .collection("scores")
      .doc(state.scoreBoard.id)
      .update({
        players: firebase.firestore.FieldValue.arrayUnion(player)
      });
  },

  deletePlayer: ({ state }: { state: State }, idx: number) => {
    const players = state.scoreBoard.players;
    players.splice(idx, 1);
    db.collection("scores").doc(state.scoreBoard.id).update({ players });
  },

  changePlayer: (
    { state }: { state: State },
    { idx, player }: { idx: number; player: UserInfo }
  ) => {
    const players = state.scoreBoard.players;
    players[idx] = player;
    db.collection("scores").doc(state.scoreBoard.id).update({
      players
    });
  },

  endScoreBoard: ({ commit }: any) => {
    commit("resetScoreBoard");
  },

  deletePlayerScoreBoardId: (
    { rootGetters }: any,
    { playerId, scoreBoardId }: any
  ) => {
    const me = rootGetters["User/user"];
    if (me.isLogin)
      db.collection("users")
        .doc(playerId)
        .update({
          scoreBoards: firebase.firestore.FieldValue.arrayRemove(scoreBoardId)
        });
  },

  // ルール関連
  changeRule: ({ commit, state, rootGetters }: any, rule: any) => {
    const me = rootGetters["User/user"];
    commit("changeRule", rule);
    if (me.isLogin)
      db.collection("scores").doc(state.id).update({
        rule: rule
      });
  },

  // スコア関連
  saveScores: async (
    { state }: { state: State },
    { index, scores }: { index: number; scores: Score[] }
  ) => {
    const scoress = [...state.scoreBoard.scoress];
    scoress[index - 1] = scores;
    return db
      .collection("scores")
      .doc(state.scoreBoard.id)
      .update({
        scoress: formatNestedArray(scoress)
      });
  },

  deleteScores: ({ state }: { state: State }, index: number) => {
    const scoress = [...state.scoreBoard.scoress];
    scoress.splice(index - 1, 1);
    console.debug(scoress);
    console.debug(state.scoreBoard.id);

    db.collection("scores")
      .doc(state.scoreBoard.id)
      .update({
        scoress: formatNestedArray(scoress)
      });
  },

  // チップ関連
  changeChip: (
    { state }: { state: State },
    { value, uid }: { value: number | null; uid: string }
  ) => {
    const chips = state.scoreBoard.chips;
    const chip = chips.find(c => c.uid === uid);
    if (chip) {
      chip.chip = value;
    } else {
      chips.push({
        chip: value,
        uid
      });
    }
    db.collection("scores").doc(state.scoreBoard.id).update({
      chips
    });
  }
};

const getters = {
  scoreBoards: (state: State) => {
    return state.scoreBoards;
  },

  scoreBoard: (state: State) => {
    return state.scoreBoard;
  },

  inputMode: (state: State) => {
    return state.inputMode;
  },

  state: (state: any) => {
    return state;
  },

  id: (state: any) => {
    return state.id;
  },

  scores: (state: any) => {
    return state.scores;
  },

  chips: (state: any) => {
    return state.chips;
  },

  rule: (state: any) => {
    return state.rule;
  },

  players: (state: any) => {
    return state.players;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
