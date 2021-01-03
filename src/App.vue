<template>
  <v-app>
    <v-progress-linear v-if="isLoading" indeterminate></v-progress-linear>
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

@Component
export default class App extends Vue {
  get isLoading() {
    return this.$store.getters["app/isLoading"];
  }

  get errorMessage() {
    return this.$store.getters["app/error"];
  }
}
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
.v-application {
  height: 100%;
  min-height: 0;
  // font-family: "Noto Sans CJK JP Subset", Roboto, sans-serif;
}

.v-app-bar {
  flex-grow: 0;
}

.v-main {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
