<template>
<div class="homeNav">
  <!-- カルーセル -->
  <v-carousel
    v-model="nav"
    :continuous="false"
    :hide-delimiters="true"
    :show-arrows="false"
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
      <span>ScoreBoard</span>
      <v-icon>{{ icons.mdiPencil }}</v-icon>
    </v-btn>
    <v-btn>
      <span>Free</span>
      <v-icon>{{ icons.mdiStore }}</v-icon>
    </v-btn>
    <v-btn>
      <span>History</span>
      <v-icon>{{ icons.mdiHistory }}</v-icon>
    </v-btn>
    <v-btn>
      <span>Data</span>
      <v-icon>{{ icons.mdiChartBar }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</div>  
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import {
  mdiLogoutVariant,
  mdiLoginVariant,
  mdiAccountCircle,
  mdiAccountAlert,
  mdiAccountGroup,
  mdiAccountPlus,
  mdiAccountCog,
  mdiPencil,
  mdiStore,
  mdiHistory,
  mdiChartBar,
  mdiCardAccountDetails
} from '@mdi/js';

import Data from '@/components/Data.vue'
import Free from '@/components/Free.vue'
import History from '@/components/History.vue'
import Rules from '@/components/Rules.vue'

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
    mdiLogoutVariant,
    mdiLoginVariant,
    mdiAccountGroup,
    mdiAccountCog,
    mdiAccountPlus,
    mdiPencil,
    mdiStore,
    mdiHistory,
    mdiChartBar,
    mdiCardAccountDetails
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