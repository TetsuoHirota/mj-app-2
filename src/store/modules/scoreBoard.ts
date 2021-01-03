import Vue from 'vue';
import { db } from '@/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

import { ScoreBoard, Rule, InputMode } from '@/models/scoreBoard';
import { UserInfo } from '@/models/user';

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
  inputMode: InputMode
}

const state = () => ({
  scoreBoards: [],
  scoreBoard: {},
  inputMode: localStorage.getItem('inputMode') || 'pt'
})

const mutations = {
  setScoreBoards: (state: State, scoreBoards: ScoreBoard[]) => {
    state.scoreBoards = scoreBoards;
  },

  setScoreBoard: (state: State, scoreBoard: ScoreBoard) => {
    state.scoreBoard = scoreBoard;
  },

  changeInputMode: (state: State, inputMode: InputMode) => {
    state.inputMode = inputMode;
  },

  resetScoreBoard: (state: any) => {
    state.id = ""
    state.players = []
    state.rule = {}
    state.scores = []
    state.chips = []
  },

  setScoreBoardId: (state: any, id: string) => {
    state.scoreboard.id = id
  },

  changePlayers: (state: any, players: any) => {
    state.players = players
  },

  changePlayer: (state: any, { player, index }: any) => {
    Vue.set(state.players, index, player)
  },

  addPlayer: (state: any, player: any) => {
    state.players.push(player)
  },

  deletePlayer: (state: any, index: number) => {
    state.players.splice(index, 1)
  },

  changeRule: (state: any, rule: any) => {
    state.rule = rule
  },

  changeAllScores: (state: any, scores: any) => {
    state.scores = scores
  },

  changeScores: (state: any, data: any) => {
    const length = state.scores.length
    if (length < data.index) {
      state.scores.push(data.scores)
    } else {
      Vue.set(state.scores, data.index - 1, data.scores)
    }
  },

  deleteScores: (state: any, index: number) => {
    state.scores.splice(index - 1, 1)
  },

  changeChips: (state: any, chips: any) => {
    state.chips = chips
  },

}

const actions = {
  createScoreBoard: async ({ rootGetters, dispatch }: any, rule: Rule) => {
    const user: UserInfo = rootGetters['user/user'];
    const players: UserInfo[] = [user];
    for (let i = 1; i < rule.playerNumber; i++) {
      players.push({
        uid: `_player${i}`,
        name: `player${i}`,
        mid: `_player${i}`,
        email: "",
        scoreBoardIds: []
      })
    }
    let id = '';
    await db.collection("scores").add({
      players: players,
      rule: rule,
      scoress: [],
      chips: [],
      createdAt: firebase.firestore.Timestamp.fromDate(new Date())
    } as ScoreBoard).then(doc => {
      id = doc.id;
      return dispatch("addPlayerScoreBoardId", { uid: user.uid, scoreBoardId: doc.id })
    })
    return id;
  },

  // プレイヤーの打った成績表のIDを記録
  addPlayerScoreBoardId: ({ commit }: any, { uid, scoreBoardId }: { uid: string, scoreBoardId: string }) => {
    return db.collection("users").doc(uid).update({
      scoreBoardIds: firebase.firestore.FieldValue.arrayUnion(scoreBoardId)
    })
  },

  startScoreBoardsListener: ({ rootGetters, commit }: any) => {
    const user: UserInfo = rootGetters['user/user'];
    unsubscribeScoreBoardIds = db.collection('users').doc(user.uid).onSnapshot((doc: any) => {
      const scoreBoardIds: string[] = doc.data().scoreBoardIds;
      const scoreBoards: ScoreBoard[] = [];
      unsubscribeScoreBoards = db.collection('scores').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change: any) => {
          const id = change.doc.id;
          const data = change.doc.data();
          if (scoreBoardIds.includes(id)) [
            scoreBoards.push({
              ...data,
              createdAt: data.createdAt.toDate(),
              id: id
            })
          ]
        });
        commit('setScoreBoards', scoreBoards)
      });

    })
  },

  startScoreBoardListener: ({ commit }: any, id: string) => {
    return new Promise((resolve, reject) => {
      unsubscribeScoreBoard = db.collection('scores').doc(id).onSnapshot(doc => {
        if (doc.exists) {
          const data = doc.data();
          if (!data) {
            reject('データが存在しません')
          } else {
            commit('setScoreBoard', {
              ...data,
              createdAt: data.createdAt.toDate(),
              id: id
            });
            resolve(doc)
          }
        } else {
          reject('成績表が見つかりません')
        }
      })
    })
  },

  changeInputMode: ({ commit }: any, inputMode: InputMode) => {
    localStorage.setItem('inputMode', inputMode);
    commit('changeInputMode', inputMode);
  },

  deleteScoreBoard: ({ commit, state, rootGetters }: any) => {
    const me = rootGetters["User/user"]
    if (me.isLogin) db.collection("scores").doc(state.id).delete()
    commit("resetScoreBoard")
  },

  endScoreBoard: ({ commit }: any) => {
    commit("resetScoreBoard")
  },


  deletePlayerScoreBoardId: ({ rootGetters }: any, { playerId, scoreBoardId }: any) => {
    const me = rootGetters["User/user"]
    if (me.isLogin) db.collection("users").doc(playerId).update({
      scoreBoards: firebase.firestore.FieldValue.arrayRemove(scoreBoardId)
    })
  },

  // ルール関連
  changeRule: ({ commit, state, rootGetters }: any, rule: any) => {
    const me = rootGetters["User/user"]
    commit("changeRule", rule)
    if (me.isLogin) db.collection("scores").doc(state.id).update({
      rule: rule
    })
  },

  //プレイヤー関連
  addPlayer: ({ commit, state, dispatch, rootGetters }: any, player: any) => {
    const me = rootGetters["User/user"]
    commit("addPlayer", player)
    if (me.isLogin) db.collection("scores").doc(state.id).update({
      players: state.players
    })
    if (player.isLinked) dispatch("addPlayerScoreBoardId", { playerId: player.uid, scoreBoardId: state.id })
  },

  deletePlayer: ({ commit, state, dispatch, rootGetters }: any, { player, index }: any) => {
    const me = rootGetters["User/user"]
    commit("deletePlayer", index)
    if (me.isLogin) db.collection("scores").doc(state.id).update({
      players: state.players
    })
    if (player.isLinked) dispatch("deletePlayerScoreBoardId", { playerId: player.uid, scoreBoardId: state.id })
  },

  changePlayer: ({ commit, state, dispatch, rootGetters }: any, { player, index }: any) => {
    const me = rootGetters["User/user"]
    if (state.players[index].isLinked) dispatch("deletePlayerScoreBoardId", { playerId: state.players[index].uid, scoreBoardId: state.id })
    if (player.isLinked) dispatch("addPlayerScoreBoardId", { playerId: player.uid, scoreBoardId: state.id })
    commit("changePlayer", { player: player, index: index })
    if (me.isLogin) db.collection("scores").doc(state.id).update({
      players: state.players
    })
  },

  // スコア関連
  saveScores: ({ commit, state, rootGetters }: any, { index, scores }: any) => {
    // commit("changeScores", { index: index, scores: scores })
    console.debug(state.scoreBoard);
    const scoress = state.scoreBoard.scoress
    scoress[index - 1] = scores

    db.collection("scores").doc(state.scoreBoard.id).update({
      scoress: formatNestedArray(scoress)
    })
  },

  deleteScores: ({ commit, state, rootGetters }: any, index: number) => {
    const me = rootGetters["User/user"]
    commit("deleteScores", index)
    if (me.isLogin) db.collection("scores").doc(state.id).update({
      scores: formatNestedArray(state.scores)
    })

  },

  // チップ関連
  changeChips: ({ commit, state, rootGetters }: any, chips: any) => {
    const me = rootGetters["User/user"]
    commit("changeChips", chips)
    if (me.isLogin) db.collection("scores").doc(state.id).update({
      chips: chips
    })
  },

}

const getters = {
  scoreBoards: (state: State) => {
    return state.scoreBoards
  },

  scoreBoard: (state: State) => {
    return state.scoreBoard
  },

  inputMode: (state: State) => {
    return state.inputMode;
  },

  state: (state: any) => {
    return state
  },

  id: (state: any) => {
    return state.id
  },

  scores: (state: any) => {
    return state.scores
  },

  chips: (state: any) => {
    return state.chips
  },

  rule: (state: any) => {
    return state.rule
  },

  players: (state: any) => {
    return state.players
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
