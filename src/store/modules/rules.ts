import { db } from '@/firebase'

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
  getRules: ({ rootGetters, commit }: any) => {
    const me = rootGetters["User/user"]
    db.collection("users").doc(me.uid).collection("rules").get().then(querySnapshot => {
      const rules: any = []
      querySnapshot.forEach(doc => {
        const rule = doc.data()
        rule.id = doc.id
        rules.push(rule)
      })
      commit("setRules", rules)
    })
  },

  addRule: ({ rootGetters, dispatch }: any, rule: any) => {
    const me = rootGetters["User/user"]
    db.collection("users").doc(me.uid).collection("rules").add(rule)
    dispatch("getRules")
  },
  
  deleteRule: ({ rootGetters, dispatch }: any, id: string) => {
    const me = rootGetters["User/user"]
    db.collection("users").doc(me.uid).collection("rules").doc(id).delete()
    dispatch("getRules")
  },
  
  changeRule: ({ rootGetters, dispatch }: any, rule: any) => {
    const me = rootGetters["User/user"]
    rule.lastUse = String(new Date())
    db.collection("users").doc(me.uid).collection("rules").doc(rule.id).update(rule).then(() => {
      dispatch("getRules")
    })
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