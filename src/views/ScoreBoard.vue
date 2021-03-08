<template>
  <div class="scoreBoard">
    <v-overlay :value="showMenu"></v-overlay>
    <AppBar title="成績表" is-back-active>
      <v-menu v-model="showMenu" left bottom :close-on-content-click="false">
        <template #activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list tile flatclass="menu__list">
          <v-list-item>
            <v-list-item-title class="mr-5">ポイント入力</v-list-item-title>
            <v-switch
              v-model="isPtMode"
              dense
              inset
              hide-details
              class="ma-0 pa-0"
            ></v-switch>
          </v-list-item>
          <v-list-item @click="openPlayersChangeModal()">
            <v-list-item-title>プレイヤー変更</v-list-item-title>
          </v-list-item>
          <v-list-item @click="deleteScoreBoard()">
            <v-list-item-title>削除</v-list-item-title>
          </v-list-item>
          <v-list-item @click="finishScoreBoard()">
            <v-list-item-title>終了</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </AppBar>

    <!-- カルーセル -->
    <v-main>
      <v-carousel
        v-model="nav"
        :continuous="false"
        :hide-delimiters="true"
        :show-arrows="false"
        height="100%"
        touchless
        :dark="$vuetify.theme.dark"
        :light="!$vuetify.theme.dark"
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

    <v-bottom-navigation v-model="nav" grow app color="primary" shift>
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

    <PlayersChange ref="playersChange" @closed="onPlayersChangeClosed()" />
  </div>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import AppBar from "@/components/shared/AppBar.vue";
import Score from "@/views/scoreBoard/Score.vue";
// import Data from "@/components/ScoreBoard/Data.vue";
// import Graph from "@/components/ScoreBoard/Graph.vue";
import PlayersChange from "@/components/scoreBoard/PlayersChange.vue";
import { ScoreBoard, UserInfo } from "@/models";

@Component({
  components: {
    AppBar,
    Score,
    // Data,
    // Graph,
    PlayersChange
  }
})
export default class ScoreBoardPage extends BaseComponent {
  $refs!: {
    playersChange: PlayersChange;
  };
  showMenu = false;
  nav = 0;

  isPtMode = this.$store.getters["scoreBoard/inputMode"] === "pt";

  get scoreBoard(): ScoreBoard {
    return this.$store.getters["scoreBoard/scoreBoard"];
  }

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
      .catch(err => {
        this._error(err);
      });
  }

  mounted() {
    if (this.$route.query.new) {
      this.$refs.playersChange.open();
    }
  }

  openPlayersChangeModal() {
    this.$refs.playersChange.open();
    this.showMenu = false;
  }

  onPlayersChangeClosed() {
    if (this.$route.query.new) {
      this.$router.replace({ query: {} });
    }
  }

  deleteScoreBoard() {
    const createdBy = this.scoreBoard.createdBy;
    const user = this.$store.state.user;
    if (createdBy !== user.uid) {
      this._error("この成績表の作成者以外削除できません");
      return;
    }
    const result = confirm("本当に削除しますか？この操作は取り消せません。");
    if (result) {
      this.$store
        .dispatch("scoreBoard/delete")
        .then(() => {
          this.$router.push({ name: "home" });
        })
        .catch(err => this._error(err));
    }
  }

  finishScoreBoard() {
    this.$router.push({ name: "home" });
  }
}
</script>

<style lang="scss" scoped>
.scoreBoard {
  width: 100%;
  height: 100%;
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
