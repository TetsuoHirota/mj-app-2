<template>
  <div class="home">
    <AppBar is-drawer-active></AppBar>
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

    <v-bottom-navigation v-model="nav" app grow color="indigo">
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
import AppBar from "@/components/shared/AppBar.vue";
import ScoreBoards from "@/views/home/ScoreBoards.vue";

@Component({
  components: {
    AppBar,
    ScoreBoards
  }
})
export default class Home extends Vue {
  nav = 0;
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.v-crousel {
  flex: 1;
}

.v-btn:hover::before,
.v-btn:focus-within::before,
.v-btn:focus::before {
  @include sp {
    opacity: 0 !important;
  }
}
</style>
