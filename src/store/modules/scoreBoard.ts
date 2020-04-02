import { db } from '@/firebase'
import * as firebase from 'firebase/app'

// let unsubscribe: any = null

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

const state = {
  id: "",
  players: [],
  rule: {},
  scores: [],
  chips: [],
}

const mutations = {
  resetScoreBoard: (state: any) => {
    state.id = ""
    state.players = []
    state.rule = {}
    state.scores = []
    state.chips = []
  },

  changeId: (state: any, id: string) => {
    state.id = id
  },

  changePlayers: (state: any, players: any) => {
    state.players = players
  },
  
  changeRule: (state: any, rule: any) => {
    state.rule = rule
  },
  
  changeScores: (state: any, data: any) => {
    if (state.scores.length < data.index) {
      state.scores[state.scores.length] = data.scores
    } else {
      state.scores[data.index - 1] = data.scores
    }
  },

  deleteScores: (state: any, index: number) => {
    state.scores.splice( index - 1, 1)
  },
}

const actions = {

  // 成績表関連
  newGame: ({ commit, rootGetters, dispatch }: any, rule: any) => {
    const me = rootGetters["User/user"]
    const players: any = []
    const data: any = {
      rule: rule,
      players: players,
      scores: [],
      chips: []
    }
    // player設定
    for (let i = 1; i <= rule.players; i ++) {
      data.players.push({
        uid: "player" + i,
        name: "player" + i,
        isLinked: false
      })
    }
    // ログイン状態で分岐
    if (me.isLogin) {
      data.players[0] = {
        uid: me.uid,
        name: me.name,
        isLinked: true
      }
      commit("changeRule", data.rule)
      commit("changePlayers", data.players)
      db.collection("scores").add(data).then(doc => {
        data.id = doc.id
        commit("changeId", data.id)
        dispatch("addPlayerScoreBoardId", { playerId: me.uid, ScoreBoardId: doc.id })
      })
    } else {
      commit("changeId", String(new Date()))
      commit("changeRule", data.rule)
      commit("changePlayers", data.players)
    }
  },

  deleteScoreBoard: ({ commit, state, rootGetters }: any) => {
    const me = rootGetters["User/user"]
    if (me.isLogin) db.collection("scores").doc(state.id).delete()
    commit("resetScoreBoard")
  },

  endScoreBoard: ({ commit }: any) => {
    commit("resetScoreBoard")
  },

  // リスナー関連
  // startListener: ({ commit, state }: any) => {
  //   unsubscribe = db.collection("scores").doc(state.id).onSnapshot(doc => {
  //     // commit("changeData", doc.data())
  //     console.log(doc.data());
  //   })
  // },

  // stopListener: () => {
  //   unsubscribe()
  // },

  // プレイヤーの打った成績表のIDを記録
  addPlayerScoreBoardId: ({ commit }: any, { playerId, ScoreBoardId }: any) => {
    db.collection("users").doc(playerId).update({
      scoreBoards: firebase.firestore.FieldValue.arrayUnion(ScoreBoardId)
    })
  },
  
  // ルール関連
  setRule: ({ commit }: any, rule: any) => {
    commit("setRule", rule)
  },

  // スコア関連
  changeScore: ({ commit, state }: any, { index, scores }: any) => {
    commit("changeScores", { index: index, scores: scores })
    db.collection("scores").doc(state.id).update({
      scores: formatNestedArray(state.scores)
    })
  },

  deleteScore: ({ commit, state }: any, index: number) => {
    commit("deleteScores", index)
    db.collection("scores").doc(state.id).update({
      scores: formatNestedArray(state.scores)
    })
  },
}

const getters = {
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}