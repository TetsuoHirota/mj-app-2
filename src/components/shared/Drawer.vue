<template>
  <v-navigation-drawer v-model="isOpened" app>
    <v-col class="py-12 px-7 teal darken-1">
      <v-row no-gutters align="center" class="white--text">
        <v-icon class="mr-2" color="white" size="40">mdi-account-circle</v-icon>
        <h2>{{ user.name }}</h2>
      </v-row>

      <v-alert class="ma-0 mt-5 pa-3 pl-5" border="left" color="teal lighten-5">
        <v-row align="center" class=" ">
          <span class="mx-2">ID :</span>
          <span class="font-weight-bold">{{ user.mid }}</span>
        </v-row>
      </v-alert>
    </v-col>

    <v-list flat>
      <v-list-item @click="onClickHome">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>ホーム</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="onClickSettings">
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>設定</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component
export default class Drawer extends Vue {
  @Prop()
  value = false;

  isOpened = this.value;

  @Watch("value")
  onChangeValue() {
    this.isOpened = this.value;
  }

  @Watch("isOpened")
  onChangeIsOpened() {
    this.$emit("input", this.isOpened);
  }

  get user() {
    return this.$store.getters["user/user"];
  }

  async logout() {
    this.$store.dispatch("app/isLoading", true);
    await this.$store.dispatch("user/logout");
    this.$store.dispatch("app/isLoading", false);
    this.$router.push({ name: "login" });
  }

  onClickHome() {
    this.isOpened = false;
    this.$router.push({ name: "home" });
  }

  onClickSettings() {
    this.isOpened = false;
    this.$router.push({ name: "settings" });
  }
}
</script>

<style lang="scss">
.v-navigation-drawer {
  width: 400px;
}

.v-list-item--active {
  color: none;
}
</style>
