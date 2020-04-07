import Vue from 'vue'
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
  isPtMode: false
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

  changeIsPtMode: (state: any, isPtMode: boolean) => {
    state.isPtMode = isPtMode
  }
}

const actions = {

  // 成績表関連
  newGame: ({ commit, rootGetters, dispatch }: any, rule: any) => {
    commit("resetScoreBoard")
    const me = rootGetters["User/user"]
    const players: any = []
    let id = ""

    // player設定
    for (let i = 1; i <= rule.players; i ++) {
      players.push({
        uid: "player" + i,
        name: "player" + i,
        isLinked: false
      })
    }

    // ログイン状態で分岐
    if (me.isLogin) {
      players[0] = {
        uid: me.uid,
        name: me.name,
        isLinked: true
      }
    }

    db.collection("scores").add({
      players: players,
      rule: rule,
      scores: {},  //object変換してから代入する
      chips: []
    }).then(doc => {
      id = doc.id
      if (me.isLogin) dispatch("addPlayerScoreBoardId", { playerId: me.uid, scoreBoardId: doc.id })
      console.log(id);
      commit("changeId", id)
    })
    
    commit("changePlayers", players)
    commit("changeRule", rule)
  },

  deleteScoreBoard: ({ commit, state, rootGetters }: any) => {
    const me = rootGetters["User/user"]
    db.collection("scores").doc(state.id).delete()
    commit("resetScoreBoard")
  },

  endScoreBoard: ({ commit }: any) => {
    commit("resetScoreBoard")
  },

  // リスナー関連
  // startListener: ({ commit, state }: any) => {
  //   console.log("listen");
  //   unsubscribe = db.collection("scores").doc(state.id).onSnapshot((doc: any) => {
  //     // commit("changeChips", doc.data().chips)
  //     // commit("changePlayers", doc.data().players)
  //     // commit("changeRule", doc.data().rule)
  //     // commit("changeAllScores", doc.data().scores)
  //   })
  // },

  // stopListener: () => {
  //   unsubscribe()
  // },

  // プレイヤーの打った成績表のIDを記録
  addPlayerScoreBoardId: ({ commit }: any, { playerId, scoreBoardId }: any) => {
    db.collection("users").doc(playerId).update({
      scoreBoards: firebase.firestore.FieldValue.arrayUnion(scoreBoardId)
    })
  },

  deletePlayerScoreBoardId: ({ commit }: any, { playerId, scoreBoardId }: any) => {
    db.collection("users").doc(playerId).update({
      scoreBoards: firebase.firestore.FieldValue.arrayRemove(scoreBoardId)
    })
  },
  
  // ルール関連
  setRule: ({ commit }: any, rule: any) => {
    commit("setRule", rule)
  },

  //プレイヤー関連
  addPlayer: ({ commit, state, dispatch }: any, player: any) => {
    commit("addPlayer", player)
    db.collection("scores").doc(state.id).update({
      players: state.players
    })
    if (player.isLinked) dispatch("addPlayerScoreBoardId", { playerId: player.uid, scoreBoardId: state.id })
  },
  
  deletePlayer: ({ commit, state, dispatch }: any, { player, index }: any) => {
    commit("deletePlayer", index)
    db.collection("scores").doc(state.id).update({
      players: state.players
    })
    if (player.isLinked) dispatch("deletePlayerScoreBoardId", { playerId: player.uid, scoreBoardId: state.id })
  },
  
  changePlayer: ({ commit, state, dispatch }: any, { player, index }: any) => {
    commit("changePlayer", { player: player, index: index })
    db.collection("scores").doc(state.id).update({
      players: state.players
    })
    if (state.players[index].isLinked) dispatch("deletePlayerScoreBoardId", { playerId: state.players[index].uid, scoreBoardId: state.id })
    if (player.isLinked) dispatch("addPlayerScoreBoardId", { playerId: player.uid, scoreBoardId: state.id })
  },

  // スコア関連
  changeScores: ({ commit, state }: any, { index, scores }: any) => {
    commit("changeScores", { index: index, scores: scores })
    db.collection("scores").doc(state.id).update({
      scores: formatNestedArray(state.scores)
    })
  },

  deleteScores: ({ commit, state }: any, index: number) => {
    commit("deleteScores", index)
    db.collection("scores").doc(state.id).update({
      scores: formatNestedArray(state.scores)
    })

  },

  // 入力モード切り替え
  changeIsPtMode: ({ commit }: any, isPtMode: boolean) => {
    commit("changeIsPtMode", isPtMode)
  }
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
  },

  isPtMode: (state: any) => {
    return state.isPtMode
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}