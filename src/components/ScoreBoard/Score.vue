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
          @click="changePlayer(player)"
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
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import scoreClac from '@/mixins/scoreCalc'
import Utilities from '@/mixins/utilities'
import { mdiPlus, mdiAccount } from '@mdi/js'
import ScoreChange from './ScoreChange.vue'
import PlayersChange from './PlayersChange.vue'

@Component({
  components: {
    ScoreChange,
    PlayersChange
  }
})
export default class Score extends Mixins(scoreClac, Utilities) {
  icons = {
    mdiPlus,
    mdiAccount,
  }

  games = 200

  mounted() {

    // 長い名前の文字サイズ変更
    const a = document.getElementsByClassName("name-btn")
    for (let i = 0; i < a.length; i++) {
      const length = this.getLength((a[i] as any).innerText)
      if (length > 9) (a[i] as HTMLElement).style.fontSize = "0.8rem"
    }

  }

  get chips() {
    return this.$store.getters["ScoreBoard/chips"]
  }

  getScore(index: number, uid: string) {
    const game = this.scores[index - 1]
    if (!game) return null
    else {
      const score = game.find((score: any) => {
        return score.uid === uid;
      });
      return !score ? null : score.pt
    }
  }

  getChip(uid: string) {
    return null
  }

  changePlayer(player: any) {
    // this.showPlayerChange = true
  }

  changeScore(index: number) {
    (this.$refs as any).scoreChange.open(index)
  }

  openPlayersModal() {
    (this.$refs as any).playersChange.open()
  }

  openChipsModal() {
    
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
$tr-body: 70px;

.score {
  height: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-rows: auto 1fr auto;
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
      font-size: 0.9rem;
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
  @include sp {
    height: 40px;
    width: 40px;
  }
  &__player {
    right: 188px;
    @include sp {
      right: 118px;
    }
  }
  &__chip {
    right: 108px;
    @include sp {
      right: 68px;
    }
  }
  &__score {
    right: 28px;
    @include sp {
      right: 18px;
    }
  }
}

.minus {
  color: red;
}

</style>