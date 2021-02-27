import { Vue } from "vue-property-decorator";

export default class BaseComponent extends Vue {
  _error(message: string) {
    this.$store.dispatch("app/error", message);
  }

  _success(message: string) {
    this.$store.dispatch("app/success", message);
  }

  _loading(isLoading: boolean) {
    this.$store.dispatch("app/isLoading", isLoading);
  }
}
