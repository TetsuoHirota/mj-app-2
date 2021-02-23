<template>
  <div class="data pa-5">
    <h2>戦績</h2>
    <template v-if="isLogin"> 開発中。 。。。 </template>
    <template v-else>
      <v-alert type="info" class="ma-5">
        ログインすると機能が使えるようになります。
      </v-alert>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import PersonalData from "@/mixins/personalData";

@Component({
  components: {}
})
export default class Data extends Mixins(PersonalData) {
  get isLogin() {
    return this.$store.getters["User/user"].isLogin;
  }

  get scoreBoards() {
    return this.$store.getters["PersonalData/scoreBoards"];
  }

  get Data() {
    return this.getData(this.scoreBoards);
  }

  mounted() {
    if (this.isLogin) this.$store.dispatch("PersonalData/startListener");
  }

  destroyed() {
    if (this.isLogin) this.$store.dispatch("PersonalData/stopListener");
  }
}
</script>

<style lang="scss" scoped></style>
