interface State {
  isLoading: boolean,
  errorMessage: string
}

const state = (): State => ({
  isLoading: false,
  errorMessage: ''
})

const mutations = {
  changeIsLoading: (state: State, isLoading: boolean) => {
    state.isLoading = isLoading;
  },

  changeErrorMessage: (state: State, errorMessage: string) => {
    state.errorMessage = errorMessage;
  }
}

const actions = {
  isLoading: ({ commit }: any, isLoading: boolean) => {
    commit('changeIsLoading', isLoading)
  },

  error: ({ commit }: any, errorMessage: string) => {
    commit('changeErrorMessage', errorMessage)
  }
}

const getters = {
  isLoading: (state: State) => {
    return state.isLoading
  },

  error: (state: State) => {
    return state.errorMessage
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
