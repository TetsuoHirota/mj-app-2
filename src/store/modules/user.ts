import { auth } from '@/firebase'

const state = {
  isLogin: false,
  uid: "",
  mid: "",
  email: "",
  name: "",
}

const mutations = {
  login: (state: any) => {
    state.isLogin = true
  },
  
  logout: (state: any) => {
    state.isLogin = false
    state.uid = ""
    state.mid = ""
    state.email = ""
    state.name = ""
  },
  
  changeProfile: (state: any, user: any) => {
    state.uid = user.uid
    state.mid = user.mid
    state.email = user.email
    state.name = user.name
  },
}

const actions = {
  login: ({commit}: any, user: any) => {
    commit("login")
    commit("changeProfile", user)
  },

  logout: ({commit}: any) => {
    commit("logout")
    auth.signOut()
  },

  changeProfile: ({commit}: any, user: any) => {
    commit("changeProfile", user)
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