<template>
  <div class="home">
    <v-carousel
      v-model="nav"
      :continuous="false"
      hide-delimiters
      :show-arrows="false"
      light
      height="100%"
    >
      <v-carousel-item>
        <ScoreBoards></ScoreBoards>
      </v-carousel-item>
      <v-carousel-item>
        b
        <!-- <Free /> -->
      </v-carousel-item>
      <v-carousel-item>
        c
        <!-- <History /> -->
      </v-carousel-item>
      <v-carousel-item>
        d
        <!-- <Data /> -->
      </v-carousel-item>
    </v-carousel>

    <v-bottom-navigation app v-model="nav" grow color="indigo">
      <v-btn>
        <span>成績表</span>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn>
        <span>フレンド</span>
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
      <v-btn>
        <span>戦績</span>
        <v-icon>mdi-chart-bar</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import ScoreBoards from "@/pages/ScoreBoards.vue";

@Component({
  components: {
    ScoreBoards,
  },
})
export default class Home extends Vue {
  nav = 0;
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
}

.v-btn:hover::before,
.v-btn:focus-within::before,
.v-btn:focus::before {
  @include sp {
    opacity: 0 !important;
  }
}
</style>
