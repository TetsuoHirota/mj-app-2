<template>
<div class="homeNav">

  <!-- カルーセル -->
  <v-carousel
    v-model="nav"
    :continuous="false"
    hide-delimiters
    :show-arrows="false"
    light
    height="100%"
  >
    <v-carousel-item>
      <Rules/>
    </v-carousel-item>
    <v-carousel-item>
      <Free/>
    </v-carousel-item>
    <v-carousel-item>
      <History/>
    </v-carousel-item>
    <v-carousel-item>
      <Data/>
    </v-carousel-item>
  </v-carousel>
  
  <!-- ナビゲーション -->
  <v-bottom-navigation
    v-model="nav"
    grow
    color="indigo"
  >
    <v-btn>
      <span>成績表</span>
      <v-icon>{{ icons.mdiPencil }}</v-icon>
    </v-btn>
    <v-btn>
      <span>フリー</span>
      <v-icon>{{ icons.mdiStore }}</v-icon>
    </v-btn>
    <v-btn>
      <span>履歴</span>
      <v-icon>{{ icons.mdiHistory }}</v-icon>
    </v-btn>
    <v-btn>
      <span>データ</span>
      <v-icon>{{ icons.mdiChartBar }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</div>  
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  mdiPencil,
  mdiStore,
  mdiHistory,
  mdiChartBar,
} from '@mdi/js';

import Data from '@/components/Home/Data.vue'
import Free from '@/components/Home/Free.vue'
import History from '@/components/Home/History.vue'
import Rules from '@/components/Home/Rules.vue'

@Component({
  components: {
    Data,
    Free,
    History,
    Rules
  }
})
export default class HomeNav extends Vue {
  icons = {
    mdiPencil,
    mdiStore,
    mdiHistory,
    mdiChartBar
  }
  
  nav = 0

  created() {
    this.nav = this.$store.getters['Display/homeNav'];
  }

  @Watch('nav')
  changeNav() {
    this.$store.dispatch('Display/changeHomeNav', this.nav)
  }

}
</script>

<style lang="scss" scoped>
.homeNav {
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-rows: 1fr max-content;
}
</style>