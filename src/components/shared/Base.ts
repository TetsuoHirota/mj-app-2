import { Vue } from "vue-property-decorator";

export default class BaseComponent extends Vue {
  _error(error: string) {
    this.$store.dispatch("app/error", error);
  }
}
