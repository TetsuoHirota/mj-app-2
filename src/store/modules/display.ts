const state = {
  homeNav: 0,
}

const mutations = {
  changeHomeNav: (state: any, nav: number) => {
    state.homeNav = nav;
  }
}

const actions = {
  changeHomeNav: ({commit}: any, nav: number) => {
    commit('changeHomeNav', nav);
  }
}

const getters = {
  homeNav: (state: any) => {
    return state.homeNav;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}