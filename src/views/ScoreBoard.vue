<template>
<div class="scoreBoard">
  
  <!-- ナビゲーション -->
  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-btn
      icon
      to="/"
    >
      <v-icon large>{{ icons.mdiChevronLeft }}</v-icon>
    </v-btn>
    <v-toolbar-title class="pl-1">成績表</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>{{ icons.mdiDotsVertical }}</v-icon>
        </v-btn>
      </template>

      <v-list>

        <v-list-item @click="changeRule">
          <v-list-item-action>
            <v-icon>{{ icons.mdiCog }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>ルール</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="changeRule">
          <v-list-item-action>
            <v-icon>{{ icons.mdiAccount }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>プレイヤー</v-list-item-title>
          </v-list-item-content>
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
import { Component, Vue } from 'vue-property-decorator';
import {
  mdiChevronLeft,
  mdiFormatListNumbered,
  mdiChartBar,
  mdiChartTimelineVariant,
  mdiDotsVertical,
  mdiCog,
  mdiAccount
} from '@mdi/js';
import Score from '@/components/ScoreBoard/Score.vue'

@Component({
  components: {
    Score
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
    mdiAccount
  }

  nav = 0

  changeRule() {
    // console.log("changeRule");
  }

  mounted() {
    console.log("mpounted");
    this.$store.dispatch("ScoreBoard/startListener")
  }

  destroyed() {
    this.$store.dispatch("ScoreBoard/stopListener")
  }
}
</script>

<style lang="scss" scoped>
.scoreBoard {
  height: 100%;
  // display: grid;
  // grid-template-rows: max-content 1fr;
}

.row {
  margin: 0;
}
</style>