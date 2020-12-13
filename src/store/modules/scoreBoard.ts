import Vue from 'vue'
import { db } from '@/firebase'
import firebase from 'firebase/app'

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
      db.collection("scores").add({
        players: players,
        rule: rule,
        scores: {},
        chips: [],
        date: String(new Date())
      }).then(doc => {
        dispatch("addPlayerScoreBoardId", { playerId: me.uid, scoreBoardId: doc.id })
        commit("changeId", doc.id)
      })
    } else commit("changeId", String(new Date()))

    commit("changePlayers", players)
    commit("changeRule", rule)
  },

  deleteScoreBoard: ({ commit, state, rootGetters }: any) => {
    const me = rootGetters["User/user"]
    if (me.isLogin) db.collection("scores").doc(state.id).delete()
    commit("resetScoreBoard")
  },

  endScoreBoard: ({ commit }: any) => {
    commit("resetScoreBoard")
  },

  // プレイヤーの打った成績表のIDを記録
  addPlayerScoreBoardId: ({ rootGetters }: any, { playerId, scoreBoardId }: any) => {
    const me = rootGetters["User/user"]
    if (me.isLogin) db.collection("users").doc(playerId).update({
      scoreBoards: firebase.firestore.FieldValue.arrayUnion(scoreBoardId)
    })
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
  changeScores: ({ commit, state, rootGetters }: any, { index, scores }: any) => {
    const me = rootGetters["User/user"]
    commit("changeScores", { index: index, scores: scores })
    if (me.isLogin) db.collection("scores").doc(state.id).update({
      scores: formatNestedArray(state.scores)
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
