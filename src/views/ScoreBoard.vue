<template>
<div class="scoreBoard">
  
  <!-- ナビゲーション -->
  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-btn icon :to="{ name: 'Home'}">
      <v-icon large>{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>
    <v-toolbar-title class="pl-1">成績表</v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- メニュー -->
    <v-menu
      left
      bottom
      :close-on-content-click="false"
      v-model="showMenu"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
        </v-btn>
      </template>
      <v-list
        tile
        flat
        width="180px"
        class="scoreBoard-menu-list pa-0"
        min-height="0"
      >
        <v-list-item class="d-flex flex-column py-5">
          ポイント入力
          <v-row class="mt-2">
            <v-switch
              v-model="isPtMode"
              hide-details
              class="ma-0 pa-0"
              :label="isPtMode ? 'ON' : 'OFF'"
            ></v-switch>
          </v-row>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="openPlayersModal"
          class="py-3"
        >
          <v-icon>{{ icons.mdiAccount }}</v-icon>
          <div class="list-title">プレイヤー変更</div>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="openRuleModal"
          class="py-3"
        >
          <v-icon>{{ icons.mdiCog }}</v-icon>
          <div class="list-title">ルール変更</div>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="deleteScoreBoard"
          class="py-3"
        >
          <v-icon>{{ icons.mdiDelete }}</v-icon>
          <div class="list-title">削除</div>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="endScoreBoard"
          class="py-3"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
          <div class="list-title">終了</div>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

  <!-- カルーセル -->
  <v-content style="height: 100%">
    <v-container
      fluid
      class="pa-0"
      style="height: 100%"
    >
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
          <Score/>
        </v-carousel-item>
        <v-carousel-item>
          <Data/>
        </v-carousel-item>
        <v-carousel-item>
          <Graph/>
        </v-carousel-item>
      </v-carousel>
    </v-container>
  </v-content>

  <!-- ナビゲーション -->
  <v-bottom-navigation
    v-model="nav"
    grow
    app
    color="teal"
  >
    <v-btn>
      <span>成績表</span>
      <v-icon>{{ icons.mdiFormatListNumbered }}</v-icon>
    </v-btn>
    <v-btn>
      <span>集計</span>
      <v-icon>{{ icons.mdiChartBar }}</v-icon>
    </v-btn>
    <v-btn>
      <span>グラフ</span>
      <v-icon>{{ icons.mdiChartTimelineVariant }}</v-icon>
    </v-btn>
  </v-bottom-navigation>

  <!-- モーダル -->
  <PlayersChange ref="playersChange"/>
  <RuleChange ref="ruleChange" :rule="ruleChange" @changeRule="getEditedRule"/>

</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Score from '@/components/ScoreBoard/Score.vue'
import Data from '@/components/ScoreBoard/Data.vue'
import Graph from '@/components/ScoreBoard/Graph.vue'
import PlayersChange from '@/components/ScoreBoard/PlayersChange.vue'
import RuleChange from '@/components/Rules/RuleChange.vue'
import {
  mdiChevronLeft,
  mdiFormatListNumbered,
  mdiChartBar,
  mdiChartTimelineVariant,
  mdiDotsVertical,
  mdiCog,
  mdiAccount,
  mdiDelete,
  mdiClose
} from '@mdi/js';

@Component({
  components: {
    Score,
    Data,
    Graph,
    PlayersChange,
    RuleChange
  }
})
export default class ScoreBoard extends Vue {
  icons = {
    mdiChevronLeft,
    mdiFormatListNumbered,
    mdiChartBar,
    mdiChartTimelineVariant,
    mdiDotsVertical,
    mdiCog,
    mdiAccount,
    mdiDelete,
    mdiClose
  }

  showMenu = false
  nav = 0

  // ポイント入力
  isPtMode = this.$store.getters["ScoreBoard/isPtMode"]

  // ルール変更用
  ruleChange = {}

  @Watch('isPtMode')
  changeIsPtMode() {
    this.$store.dispatch("ScoreBoard/changeIsPtMode", this.isPtMode)
  }

  get isLogin() {
    return this.$store.getters["User/user"].isLogin
  }

  openPlayersModal() {
    (this.$refs as any).playersChange.open()
    this.showMenu = false
  }

  deleteScoreBoard() {
    const result = confirm("本当に削除しますか？")
    if (result) {
      this.$store.dispatch("ScoreBoard/deleteScoreBoard");
      this.$router.push({ name: 'Home'})
    }
  }

  endScoreBoard() {
    this.$store.dispatch("ScoreBoard/endScoreBoard");
    this.$router.push({ name: 'Home'})
  }

  openRuleModal() {
    this.ruleChange = this.$store.getters["ScoreBoard/rule"];
    (this.$refs as any).ruleChange.open()
  }

  getEditedRule() {
    this.$store.dispatch("ScoreBoard/changeRule", this.ruleChange)
  }
}
</script>

<style lang="scss" scoped>
.scoreBoard {
  height: 100%;
}

</style>
<style lang="scss">
.scoreBoard-menu-list {
  .v-list-item {
    text-align: center;
    display: flex;
    .v-icon {
      position: relative;
      top: -1px;
    }
    .list-title {
      margin-left: 10px;
      flex: 1;
    }
    &--active {
      .v-icon {
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }
    &:hover {
      background: rgba(0,0,0,.05);
      @include sp {
        background: none;
      }
    }
    &::after {
      min-height: 0;
    }
  }
}
</style>