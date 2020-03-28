import { db } from '@/firebase'

let unsubscribe: any = null

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
  scores: [],
  chips: [],
  rule: {},
  players: [],
}

const mutations = {
  setRule: (state: any, rule: any) => {
    state.rule = rule
  },

  changeId: (state: any, id: string) => {
    state.id = id
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

  changeData: (state: any, data: any) => {
    state.scores = Object.keys(data.scores).map(k => data.scores[k])
    state.chips = data.chips
    state.rule = data.rule
    state.players = data.players
  }
}

const actions = {
  startListener: ({ commit, state }: any) => {
    unsubscribe = db.collection("scores").doc(state.id).onSnapshot(doc => {
      commit("changeData", doc.data())
    })
  },

  stopListener: () => {
    unsubscribe()
  },

  setRule: ({ commit }: any, rule: any) => {
    commit("setRule", rule)
  },

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

  newGame: ({ commit, rootGetters }: any, rule: any) => {
    const me = rootGetters["User/user"]
    const players = [{
      uid: me.uid,
      name: me.name,
      isLinked: true
    }]
    for (let i = 1; i < rule.players; i ++) {
      players.push({
        uid: "player" + i,
        name: "player" + i,
        isLinked: false
      })
    }
    const data = {
      rule: rule,
      players: players,
      scores: [],
      chips: []
    }
    db.collection("scores").add(data).then(doc => {
      commit("changeData", data)
      commit("changeId", doc.id)
    })
  }
}

const getters = {
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