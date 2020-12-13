import Vue from 'vue';
import Vuex from 'vuex';

import User from './modules/user';
import Loading from './modules/loading';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: User,
    loading: Loading
  }
});
