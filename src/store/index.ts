import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import User from './modules/user'
import Display from './modules/display'
import Friends from './modules/friends'
import Rules from './modules/rules'
import ScoreBoard from './modules/scoreBoard'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    User,
    Display,
    Friends,
    Rules,
    ScoreBoard
  },
  plugins: [ createPersistedState() ]
})
