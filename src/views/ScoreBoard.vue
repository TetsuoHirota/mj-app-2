<template>
  <div class="scoreBoard">
    <v-overlay :value="showMenu"></v-overlay>
    <AppBar title="成績表" is-back-active>
      <v-menu left bottom :close-on-content-click="false" v-model="showMenu">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list tile flatclass="menu__list">
          <v-list-item>
            <v-list-item-title class="mr-5">
              ポイント入力
            </v-list-item-title>
            <v-switch
              dense
              v-model="isPtMode"
              inset
              hide-details
              class="ma-0 pa-0"
            ></v-switch>
          </v-list-item>
          <v-list-item @click="openPlayersModal">
            <v-list-item-title>
              プレイヤー変更
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="deleteScoreBoard">
            <v-list-item-title>
              削除
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="endScoreBoard">
            <v-list-item-title>
              終了
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </AppBar>

    <!-- カルーセル -->
    <v-main>
      <v-carousel
        light
        v-model="nav"
        :continuous="false"
        :hide-delimiters="true"
        :show-arrows="false"
        height="100%"
        touchless
      >
        <v-carousel-item>
          <Score></Score>
        </v-carousel-item>
        <v-carousel-item>
          <!-- <Data /> -->
        </v-carousel-item>
        <v-carousel-item>
          <!-- <Graph /> -->
        </v-carousel-item>
      </v-carousel>
    </v-main>
    <!-- <v-container fluid class="pa-0" style="height: 100%">
    </v-container> -->

    <v-bottom-navigation v-model="nav" grow app color="teal">
      <v-btn>
        <span>成績表</span>
        <v-icon>mdi-format-list-numbered</v-icon>
      </v-btn>
      <v-btn>
        <span>集計</span>
        <v-icon>mdi-chart-bar</v-icon>
      </v-btn>
      <v-btn>
        <span>グラフ</span>
        <v-icon>mdi-chart-timeline-variant</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <!-- <PlayersChange ref="playersChange" /> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import AppBar from "@/components/shared/AppBar.vue";
import Score from "@/views/scoreBoard/Score.vue";
// import Data from "@/components/ScoreBoard/Data.vue";
// import Graph from "@/components/ScoreBoard/Graph.vue";
// import PlayersChange from "@/components/ScoreBoard/PlayersChange.vue";

import { ScoreBoard } from "@/models/scoreBoard";

@Component({
  components: {
    AppBar,
    Score,
    // Data,
    // Graph,
    // PlayersChange,
  },
})
export default class ScoreBoardPage extends Vue {
  showMenu = false;
  nav = 0;

  isPtMode = this.$store.getters["scoreBoard/inputMode"] === "pt";

  // get scoreBoard() {
  //   return this.$store.getters["scoreBoard/scoreBoard"];
  // }

  @Watch("isPtMode")
  changeIsPtMode() {
    this.$store.dispatch(
      "scoreBoard/changeInputMode",
      this.isPtMode ? "pt" : "score"
    );
  }

  created() {
    this.$store
      .dispatch("scoreBoard/startScoreBoardListener", this.$route.params.id)
      .catch((err) => {
        this.$store.dispatch("app/error", err);
      });
  }

  openPlayersModal() {
    (this.$refs as any).playersChange.open();
    this.showMenu = false;
  }

  deleteScoreBoard() {
    const result = confirm("本当に削除しますか？");
    if (result) {
      this.$store.dispatch("ScoreBoard/deleteScoreBoard");
      this.$router.push({ name: "Home" });
    }
  }

  endScoreBoard() {
    this.$store.dispatch("ScoreBoard/endScoreBoard");
    this.$router.push({ name: "Home" });
  }
}
</script>

<style lang="scss" scoped>
.scoreBoard {
  height: 100%;
  width: 100%;
}
.menu__list {
  .v-list-item {
    &:hover {
      background: rgba(0, 0, 0, 0.05);
      @include sp {
        background: none;
      }
    }
    &::after {
      min-height: 0;
    }
  }
}

.v-main {
  height: 100%;
}
</style>
