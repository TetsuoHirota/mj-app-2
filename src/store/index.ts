import Vue from "vue";
import Vuex from "vuex";

import App from "./modules/app";
import User from "./modules/user";
import ScoreBoard from "./modules/scoreBoard";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user: User,
    app: App,
    scoreBoard: ScoreBoard
  }
});
