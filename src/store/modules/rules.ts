import { db } from '@/firebase'

let unsubscribe: any = null

const state = {
  rules: []
}

const mutations = {
  setRules: (state: any, rules: any) => {
    state.rules = rules
  },

  addRule: (state: any, rule: any) => {
    state.rules.push(rule)
  },

  deleteRule: (state: any, id: string) => {
    state.rules = state.rules.filter((rule: any) => {
      return rule.id !== id
    })
  }
}

const actions = {
  startListener: ({ commit, rootGetters }: any) => {
    const me = rootGetters["User/user"]
    unsubscribe = db.collection("users").doc(me.uid).collection("rules").onSnapshot(async (querySnapshot) => {
      const rules: any = []
      querySnapshot.forEach(doc => {
        const rule = doc.data()
        rule.id = doc.id
        rules.push(rule)
      })
      commit("setRules", rules)
    })
  },

  stopListener: () => {
    unsubscribe()
  },

  addRule: ({ rootGetters }: any, rule: any) => {
    const me = rootGetters["User/user"]
    rule.lastUse = String(new Date())
    db.collection("users").doc(me.uid).collection("rules").add(rule)
  },
  
  deleteRule: ({ rootGetters }: any, id: string) => {
    const me = rootGetters["User/user"]
    db.collection("users").doc(me.uid).collection("rules").doc(id).delete()
  },
  
  changeRule: ({ rootGetters }: any, rule: any) => {
    const me = rootGetters["User/user"]
    rule.lastUse = String(new Date())
    db.collection("users").doc(me.uid).collection("rules").doc(rule.id).update(rule)
  },
}

const getters = {
  rules: (state: any) => {
    return state.rules.sort((a: any, b: any) => {
      if (new Date(a.lastUse) < new Date(b.lastUse)) {
        return 1;
      } else {
        return -1;
      }
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}