import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import colors from "vuetify/lib/util/colors";

Vue.use(Vuetify);

export default new Vuetify({
  /* vuetifyのオプション */
  theme: {
    dark: true,
    themes: {
      dark: {
        "line-primary": colors.grey.lighten1
      }
    }
  }
});
