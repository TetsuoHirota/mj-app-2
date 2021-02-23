import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
const vuetify =
  process.env.NODE_ENV === "production"
    ? require("./plugins/vuetify").default
    : require("./plugins/vuetify-dev").default;

import "./assets/font/NotoSansCJKjp/NotoSansCJKjp.scss";

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
