<template>
<div class="scoreBoard">
  
  <!-- ナビゲーション -->
  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-btn icon to="/">
      <v-icon large>{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>
    <v-toolbar-title class="pl-1">成績表</v-toolbar-title>
    <v-spacer></v-spacer>

    <!-- メニュー -->
    <v-menu
      left
      bottom
      :close-on-content-click="false"
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
            ></v-switch>
            {{ isPtMode ? 'ON' : 'OFF'}}
          </v-row>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="deleteScoreBoard"
          class="d-flex justify-center py-3"
        >
          <v-icon>{{ icons.mdiDelete }}</v-icon>
          <div class="list-title">削除</div>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-item
          @click="endScoreBoard"
          class="d-flex justify-center py-3"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
          <div class="list-title">終了</div>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>

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

  <v-bottom-navigation
    v-model="nav"
    grow
    app
    color="teal"
  >
    <v-btn>
      <span>Score</span>
      <v-icon>{{ icons.mdiFormatListNumbered }}</v-icon>
    </v-btn>
    <v-btn>
      <span>Data</span>
      <v-icon>{{ icons.mdiChartBar }}</v-icon>
    </v-btn>
    <v-btn>
      <span>Graph</span>
      <v-icon>{{ icons.mdiChartTimelineVariant }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
  
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Score from '@/components/ScoreBoard/Score.vue'
import Data from '@/components/ScoreBoard/Data.vue'
import Graph from '@/components/ScoreBoard/Graph.vue'
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
    Graph
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

  nav = 0

  // ポイント入力
  isPtMode = false

  // get isLogin() {
  //   return this.$store.getters["User/user"].isLogin
  // }

  deleteScoreBoard() {
    this.$store.dispatch("ScoreBoard/deleteScoreBoard");
    this.$router.push({ name: 'Home'})
  }

  endScoreBoard() {
    this.$store.dispatch("ScoreBoard/endScoreBoard");
    this.$router.push({ name: 'Home'})
  }

  // mounted() {
  //   if (this.isLogin) this.$store.dispatch("ScoreBoard/startListener")
  // }

  // destroyed() {
  //   if (this.isLogin) this.$store.dispatch("ScoreBoard/stopListener")
  // }
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
    .v-icon {
      position: relative;
      top: -1px;
    }
    .list-title {
      margin-left: 20px;
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