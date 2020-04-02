import { auth, db } from '@/firebase'

const state = {
  isLogin: false,
  uid: "",
  mid: "",
  email: "",
  name: "",
}

const mutations = {
  changeIsLogin: (state: any, isLogin: boolean) => {
    state.isLogin = isLogin
  },

  changeUid: (state: any, uid: string) => {
    state.uid = uid
  },

  changeMid: (state: any, mid: string) => {
    state.mid = mid
  },

  changeEmail: (state: any, email: string) => {
    state.email = email
  },

  changeName: (state: any, name: string) => {
    state.name = name
  },
}

const actions = {
  signup: ({ commit }: any, userInfo: any) => {
    const user = {
      uid: userInfo.uid,
      email: userInfo.email,
      mid: "",
      name: ""
    }
    db.collection("users").doc(user.uid).set(user)
    commit("changeIsLogin", true)
    commit("changeUid", user.uid)
    commit("changeEmail", user.email)
  },

  login: ({commit}: any, user: any) => {
    return new Promise((resolve) => {
      db.collection("users").doc(user.uid).get().then(doc => {
      const user: any = doc.data()
      commit("changeIsLogin", true)
      commit("changeUid", user.uid)
      commit("changeMid", user.mid)
      commit("changeEmail", user.email)
      commit("changeName", user.name)
      resolve()
    })})
  },

  logout: () => {
    auth.signOut()
    localStorage.clear()
  },

  changeProfile: ({ commit, state }: any, user: any) => {
    db.collection("users").doc(state.uid).update(user)
    commit("changeMid", user.mid)
    commit("changeName", user.name)
  },

  changeName: ({ commit, state }: any, name: string) => {
    db.collection("users").doc(state.uid).update({ name: name })
    commit("changeName", name)
  }
}

const getters = {
  user: (state: any) => {
    return state
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}