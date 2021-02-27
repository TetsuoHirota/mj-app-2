interface State {
  isLoading: boolean;
  errorMessage: string;
  successMessage: string;
}

const state = (): State => ({
  isLoading: false,
  errorMessage: "",
  successMessage: ""
});

const mutations = {
  changeIsLoading: (state: State, isLoading: boolean) => {
    state.isLoading = isLoading;
  },

  changeErrorMessage: (state: State, errorMessage: string) => {
    state.errorMessage = errorMessage;
  },

  changeSuccessMessage: (state: State, successMessage: string) => {
    state.successMessage = successMessage;
  },

  resetMessages: (state: State) => {
    console.debug("reset");

    state.errorMessage = "";
    state.successMessage = "";
  }
};

const actions = {
  isLoading: ({ commit }: any, isLoading: boolean) => {
    commit("changeIsLoading", isLoading);
  },

  error: ({ commit }: any, errorMessage: string) => {
    commit("changeErrorMessage", errorMessage);
  },

  success: ({ commit }: any, successMessage: string) => {
    commit("changeSuccessMessage", successMessage);
  },

  resetMessages: ({ commit }: any) => {
    commit("resetMessages");
  }
};

const getters = {
  isLoading: (state: State) => {
    return state.isLoading;
  },

  error: (state: State) => {
    return state.errorMessage;
  },

  success: (state: State) => {
    return state.successMessage;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
