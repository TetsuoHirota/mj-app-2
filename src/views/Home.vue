<template>
  <div class="home">
    <AppBar is-drawer-active :title="titles[nav]"></AppBar>
    <v-carousel
      v-model="nav"
      :continuous="false"
      hide-delimiters
      :show-arrows="false"
      height="100%"
      :dark="$vuetify.theme.dark"
      :light="!$vuetify.theme.dark"
    >
      <v-carousel-item>
        <ScoreBoards></ScoreBoards>
      </v-carousel-item>
      <v-carousel-item>
        <Friends></Friends>
      </v-carousel-item>
      <v-carousel-item>c</v-carousel-item>
    </v-carousel>

    <v-bottom-navigation v-model="nav" app grow color="primary">
      <v-btn>
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>mdi-account-multiple</v-icon>
      </v-btn>
      <v-btn>
        <v-icon>mdi-chart-bar</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import AppBar from "@/components/shared/AppBar.vue";
import ScoreBoards from "@/views/home/ScoreBoards.vue";
import Friends from "@/views/home/Friends.vue";

@Component({
  components: {
    AppBar,
    ScoreBoards,
    Friends
  }
})
export default class Home extends BaseComponent {
  nav = 1;
  titles = ["成績表", "フレンド", "データ"];
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
