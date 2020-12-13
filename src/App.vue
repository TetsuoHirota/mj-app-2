<template>
  <v-app>
    <v-progress-linear v-if="isLoading" indeterminate></v-progress-linear>
    <v-app-bar
      color="indigo"
      dark
    >
      <v-toolbar-title>麻雀成績管理</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {

  get isLoading() {
    return this.$store.getters['loading/isLoading']
  }

}
</script>
