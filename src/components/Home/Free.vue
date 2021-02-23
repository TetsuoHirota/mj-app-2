<template>
  <div class="pa-5">
    <h2>フリー</h2>
    <template v-if="isLogin"> 開発中。 。。。 </template>
    <template v-else>
      <v-alert type="info" class="ma-5">
        ログインすると機能が使えるようになります。
      </v-alert>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Free extends Vue {
  get isLogin() {
    return this.$store.getters["User/user"].isLogin;
  }
}
</script>

<style lang="scss" scoped></style>
