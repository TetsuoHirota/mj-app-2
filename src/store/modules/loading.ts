const state = () => ({
  isLoading: false
})

const mutations = {
  changeIsLoading: (state: any, isLoading: boolean) => {
    state.isLoading = isLoading;
  }
}

const actions = {
  changeIsLoading: ({commit}: any, isLoading: boolean) => {
    commit('changeIsLoading', isLoading)
  }
}

const getters = {
  isLoading: (state: any) => {
    return state.isLoading
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
