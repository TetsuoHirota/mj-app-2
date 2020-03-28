<template>
  <div class="score">
    <header>
      <div class="header__head"></div>
      <div
        class="header__body px-1"
        v-for="player in players"
        :key="player.uid"
      >
        <v-btn
          :class="{ 'isLinked' :player.isLinked }"
          :text="!player.isLinked"
          :color="player.isLinked ? 'teal' : ''"
          :dark="player.isLinked"
          style="text-transform: none; font-weight: 700;"
          @click="changePlayer(player)"
        >
          {{ player.name }}
        </v-btn>
      </div>
    </header>

    <body>
      <div
        class="body__row"
        v-for="index in games"
        :key="index"
        style="position: relative"
      >
        <div class="body__index">{{ index }}</div>
        <div
          class="body__score"
          v-for="player in players"
          :key="player.uid"
          :class="{ 'minus': getScore(player.uid, index) < 0}"
        >
          {{ getScore(player.uid, index) }}
        </div>
        <v-btn
          absolute
          text
          tile
          height="100%"
          width="100%"
          @click="changeScore(index)"
        >
        </v-btn>
      </div>
    </body>

    <footer>
      <div class="footer__row">
        <div class="footer__head">計</div>
        <div
          class="footer__body"
          v-for="player in players"
          :key="player.uid"
          :class="{ 'minus': getTotal(player.uid) < 0}"
        >
          {{ getTotal(player.uid) }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="footer__row">
        <div class="footer__head">￥</div>
        <div
          class="footer__body"
          v-for="player in players"
          :key="player.uid"
          :class="{ 'minus': getYen(player.uid) < 0}"
        >
          {{ getYen(player.uid) }}
        </div>
      </div>
    </footer>


    <!-- モーダル -->
    <ScoreChange ref="scoreChange"/>
    <!-- <PlayerChange @show="showPlayerChange = $event" :parentShow="showPlayerChange" /> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {

} from '@mdi/js';
import ScoreChange from './ScoreChange.vue'
import PlayerChange from './PlayerChange.vue'

@Component({
  components: {
    ScoreChange,
    PlayerChange
  }
})
export default class Score extends Vue {
  games = 50

  get players() {
    return this.$store.getters["ScoreBoard/players"]
  }

  get rule() {
    return this.$store.getters["ScoreBoard/rule"]
  }

  get scores() {
    return this.$store.getters["ScoreBoard/scores"]
  }

  get chips() {
    return this.$store.getters["ScoreBoard/chips"]
  }

  getScore(uid: string, index: number) {
    const game = this.scores[index-1]
    if (!game) {
      return null;
    } else {
      const score = game.find((score: any) => {
        return score.uid === uid;
      });
      if (!score){
        return null;
      } else {
        return score.pt;
      }
    }
  }

  getTotal(uid: string) {
    return -3
  }

  getYen(uid: string) {
    return -5
  }

  changePlayer(player: any) {
    // this.showPlayerChange = true
  }

  changeScore(index: number) {
    (this.$refs as any).scoreChange.open(index)
  }
}

</script>

<style lang="scss" scoped>
$table-head: 40px;
$table-body: 60px;

.score {
  height: 100%;
  overflow-x: auto;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

header {
  padding: 10px;
  display: flex;
  border-bottom: 2px solid rgba(0,0,0,0.12);
  .header__head {
    min-width: $table-head;
  }
  .header__body {
    min-width: $table-body;
    flex: 1;
    display: flex;
    justify-content: center;
    .v-btn {
      padding: 0;
      width: 100%;
    }
  }
}

body {
  height: 100%;
  margin: 0 10px;
  overflow-y: auto;
  display: flex;
  flex-flow: column;
  .body__row {
    display: flex;
    min-height: 30px;
    border-bottom: 1px solid rgba(0,0,0,0.12);
    &:last-of-type {
      border: none;
    }
    .body__index {
      min-width: $table-head;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .body__score {
      min-width: $table-body;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

footer {
  display: flex;
  flex-flow: column;
  padding: 0 10px;
  border-top: 2px solid rgba(0,0,0,0.12);
  .footer__row {
    display: flex;
    min-height: 40px;
    .footer__head {
      min-width: $table-head;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .footer__body {
      min-width: $table-body;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.minus {
  color: red;
}

</style>