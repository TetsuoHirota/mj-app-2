<template>
  <v-app>
    <Drawer v-model="isDrawerOpened"></Drawer>
    <v-progress-linear v-if="isLoading" indeterminate></v-progress-linear>
    <v-app-bar color="indigo" dark>
      <v-app-bar-nav-icon
        @click.stop="handleClickNavIcon"
        v-if="routeName !== 'login'"
      ></v-app-bar-nav-icon>
      <v-toolbar-title class="pl-2">{{ title }}</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container fluid fill-height class="pa-0">
        <router-view></router-view>
      </v-container>
    </v-main>
    <v-snackbar app color="error" :value="errorMessage" :timeout="4000">
      <v-row dense class="flex-nowrap">
        <v-icon class="mr-4">mdi-alert</v-icon>
        {{ errorMessage }}
      </v-row>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Drawer from "@/components/shared/Drawer.vue";

const rounteNameToTitle: { [key: string]: string } = {
  login: "ログイン",
  home: "麻雀成績管理",
};

@Component({
  components: {
    Drawer,
  },
})
export default class App extends Vue {
  title = "麻雀成績管理";
  isDrawerOpened = false;
  routeName = "";

  @Watch("$route")
  handleChangeRoute() {
    this.fetchRoute();
  }

  get isLoading() {
    return this.$store.getters["app/isLoading"];
  }

  get errorMessage() {
    return this.$store.getters["app/error"];
  }

  fetchRoute() {
    const route = this.$route;
    if (!route.name) {
      return;
    }
    this.routeName = route.name;
    this.title = rounteNameToTitle[route.name];
  }

  handleClickNavIcon() {
    this.isDrawerOpened = !this.isDrawerOpened;
  }
}
</script>

<style lang="scss" scoped>
.v-application {
  height: 100%;
  font-family: "Noto Sans CJK JP Subset", Roboto, sans-serif;
}

.v-app-bar {
  flex-grow: 0;
}
</style>
