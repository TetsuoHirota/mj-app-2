<template>
  <div class="score">

    <!-- ヘッダー -->
    <header>
      <div class="tr-head"></div>
      <div
        class="tr-body"
        v-for="player in players"
        :key="player.uid"
      >
        <v-btn
          class="name-btn"
          text
          @click="openPlayersModal"
          :color="player.isLinked ? 'teal' : ''"
        >
          {{ player.name }}
        </v-btn>
      </div>
    </header>

    <!-- ボディ -->
    <body>
      <div
        class="body__row"
        v-for="index in games"
        :key="index"
      >
        <div class="tr-head">{{ index }}</div>
        <div
          class="tr-body"
          v-for="player in players"
          :key="player.uid"
          :class="{ 'minus': getScore(index, player.uid) < 0}"
        >
          {{ getScore(index, player.uid) }}
        </div>
        <v-btn
          absolute
          text
          tile
          color="#DDD"
          height="100%"
          width="100%"
          @click="changeScore(index)"
        >
        </v-btn>
      </div>
    </body>

    <!-- フッター -->
    <footer>
      <div class="footer__row">
        <div class="tr-head">計</div>
        <div
          class="tr-body"
          v-for="player in players"
          :key="player.uid"
          :class="{ 'minus': getTotal(player.uid) < 0}"
        >
          {{ getTotal(player.uid) }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="footer__row">
        <div class="tr-head">
          <img class="casino-chip" src="@/assets/svgs/casino-chip.svg" alt="">
        </div>
        <div
          class="tr-body"
          v-for="player in players"
          :key="player.uid"
        >
          <v-chip
            v-if="getChip(player.uid) || getChip(player.uid) === 0"
            color="orange"
            dark
            small
            class="px-2"
          >
            ￥ {{ getChip(player.uid) > 0 ? '+' : '' }}{{ getChip(player.uid) }}
          </v-chip>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="footer__row">
        <div class="tr-head">￥</div>
        <div
          class="tr-body"
          v-for="player in players"
          :key="player.uid"
          :class="{ 'minus': getYen(player.uid) < 0}"
        >
          {{ getYen(player.uid) }}
        </div>
      </div>
    </footer>

    <!-- ボタン -->
    <v-btn
      class="btn btn__player"
      absolute
      fab
      dark
      color="pink"
      @click="openPlayersModal"
    >
      <v-icon>{{ icons.mdiAccount }}</v-icon>
    </v-btn>
    <v-btn
      class="btn btn__chip"
      absolute
      fab
      color="orange"
      @click="openChipsModal"
    >
      <img style="height: 20px;" src="@/assets/svgs/casino-chip-white.svg" alt="">
    </v-btn>
    <v-btn
      class="btn btn__score"
      absolute
      fab
      color="primary"
      @click="openScoresModal"
    >
      <v-icon>{{ icons.mdiPlus }}</v-icon>
    </v-btn>

    <!-- モーダル -->
    <ScoreChange ref="scoreChange"/>
    <PlayersChange ref="playersChange"/>
    <ChipsChange ref="chipsChange"/>

  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import scoreClac from '@/mixins/scoreCalc'
import Utilities from '@/mixins/utilities'
import { mdiPlus, mdiAccount } from '@mdi/js'
import ScoreChange from './ScoreChange.vue'
import PlayersChange from './PlayersChange.vue'
import ChipsChange from './ChipsChange.vue'

@Component({
  components: {
    ScoreChange,
    PlayersChange,
    ChipsChange
  }
})
export default class Score extends Mixins(scoreClac, Utilities) {
  icons = {
    mdiPlus,
    mdiAccount,
  }

  games = 100

  changeScore(index: number) {
    (this.$refs as any).scoreChange.open(index)
  }

  openPlayersModal() {
    (this.$refs as any).playersChange.open()
  }

  openChipsModal() {
    (this.$refs as any).chipsChange.open()
  }

  openScoresModal() {
    const length = this.scores.length;
    (this.$refs as any).scoreChange.open(length + 1)
  }
}

</script>

<style lang="scss" scoped>
$padding: 10px;
$tr-head: 30px;
$tr-body: 75px;

.score {
  height: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-rows: auto 1fr auto;
  font-size: .9rem;
}

.tr-head {
  flex: 0 0 $tr-head;
  min-width: $tr-head;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tr-body {
  flex: 1 0 $tr-body;
  min-width: $tr-body;
  display: flex;
  justify-content: center;
  align-items: center;
}

header {
  padding: $padding;
  border-bottom: 1px solid rgba(0,0,0,0.12);
  box-shadow: 0px -1px 10px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  .tr-body {
    .v-btn {
      padding: 0 !important;
      margin: 0 4px;
      font-size: 0.875rem;
      overflow: hidden;
      text-transform: none;
      width: calc(100% - 8px);
      max-width: 200px;
      min-width: 0;
    }
  }
}

body {
  height: 100%;
  padding: 0 $padding;
  overflow-y: auto;
  display: flex;
  flex-flow: column;
  &::-webkit-scrollbar {
    @media (min-width: $sp) {
      display: none;
    }
  }
  .body__row {
    display: flex;
    min-height: 30px;
    border-bottom: 1px solid rgba(0,0,0,0.12);
    position: relative;
    &:last-of-type {
      border: none;
    }
  }
}

footer {
  display: flex;
  flex-flow: column;
  padding: 0 $padding;
  border-top: 1px solid rgba(0,0,0,0.12);
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  .footer__row {
    display: flex;
    min-height: 40px;
  }
  .casino-chip {
    height: 19px;
  }
}

.btn {
  bottom: 138px;

  $right-sp: 18px;
  $distance-sp: 58px;
  $size-sp: 45px;

  $right-lg: 28px;
  $distance-lg: 80px;

  @include sp {
    height: $size-sp;
    width: $size-sp;
  }
  &__player {
    right: calc(#{$right-lg} + (#{$distance-lg} * 2));
    @include sp {
      right: calc(#{$right-sp} + (#{$distance-sp} * 2));
    }
  }
  &__chip {
    right: calc(#{$right-lg} + #{$distance-lg});
    @include sp {
      right: calc(#{$right-sp} + #{$distance-sp});
    }
  }
  &__score {
    right: $right-lg;
    @include sp {
      right: $right-sp;
    }
  }
}

.minus {
  color: red;
}

</style>