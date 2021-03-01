<template>
  <div class="score">
    <header>
      <div class="tr-head"></div>
      <div v-for="(player, idx) in players" :key="player.uid" class="tr-body">
        <v-btn class="name-btn" text @click="onPlayerClick(idx)">
          {{ player.name }}
        </v-btn>
      </div>
    </header>

    <body>
      <div v-for="index in gameNumber" :key="index" class="body__row">
        <div class="tr-head">{{ index }}</div>
        <div
          v-for="player in players"
          :key="player.uid"
          class="tr-body"
          :class="{
            minus: getPtFromScores(index, player.uid).isMinus
          }"
        >
          {{ getPtFromScores(index, player.uid).pt }}
        </div>
        <v-btn
          absolute
          text
          tile
          color="#DDD"
          height="100%"
          width="100%"
          @click="changeScore(index)"
        ></v-btn>
      </div>
    </body>

    <!-- <footer>
      <div class="footer__row">
        <div class="tr-head">計</div>
        <div
          class="tr-body"
          v-for="player in players"
          :key="player.uid"
          :class="{ minus: getTotal(player.uid) < 0 }"
        >
          {{ getTotal(player.uid) }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="footer__row">
        <div class="tr-head">
          <img class="casino-chip" src="@/assets/svgs/casino-chip.svg" alt="" />
        </div>
        <div class="tr-body" v-for="player in players" :key="player.uid">
          <v-chip
            v-if="getChip(player.uid) || getChip(player.uid) === 0"
            color="orange"
            small
            class="px-2"
          >
            ￥ {{ getChip(player.uid) > 0 ? "+" : "" }}{{ getChip(player.uid) }}
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
          :class="{ minus: getYen(player.uid) < 0 }"
        >
          {{ getYen(player.uid) }}
        </div>
      </div>
    </footer> -->

    <!-- ボタン -->
    <v-btn
      class="btn btn__player"
      absolute
      fab
      color="pink"
      @click.stop="openPlayersModal"
    >
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <v-btn
      class="btn btn__chip"
      absolute
      fab
      color="orange"
      @click.stop="openChipsModal"
    >
      <img
        style="height: 20px"
        src="@/assets/svgs/casino-chip-white.svg"
        alt=""
      />
    </v-btn>
    <v-btn
      class="btn btn__score"
      absolute
      fab
      color="primary"
      @click.stop="openScoresModal"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <ScoreChange ref="scoreChange" />
    <!-- <PlayersChange ref="playersChange" />
    <ChipsChange ref="chipsChange" /> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import scoreClac from "@/mixins/scoreCalc";
import Utilities from "@/mixins/utilities";
import { ScoreBoard } from "@/models";

import ScoreChange from "@/components/scoreBoard/ScoreChange.vue";
// import PlayersChange from "@/components/socreBoard/PlayersChange.vue";
// import ChipsChange from "@/components/socreBoard/ChipsChange.vue";

@Component({
  components: {
    ScoreChange
    // PlayersChange,
    // ChipsChange,
  }
})
export default class Score extends Vue {
  get scoreBoard(): ScoreBoard {
    return this.$store.getters["scoreBoard/scoreBoard"];
  }

  get players() {
    return this.scoreBoard.players || [];
  }

  get scoress() {
    return this.scoreBoard.scoress || [];
  }

  gameNumber = 100;

  getPtFromScores(
    index: number,
    uid: string
  ): {
    pt: number | null;
    isMinus: boolean;
  } {
    let pt: number | null = null;
    let isMinus = false;
    const scores = this.scoress[index - 1];
    if (scores) {
      const score = scores.find((score: any) => {
        return score.uid === uid;
      });
      if (score) {
        pt = score.pt || null;
        if (pt) {
          isMinus = pt < 0;
        }
      }
    }
    return {
      pt: pt,
      isMinus: isMinus
    };
  }

  changeScore(index: number) {
    (this.$refs as any).scoreChange.open(index);
  }

  onPlayerClick(idx: number) {
    this.$emit("request-player-change", idx);
  }

  openPlayersModal() {
    (this.$refs as any).playersChange.open();
  }

  openChipsModal() {
    (this.$refs as any).chipsChange.open();
  }

  openScoresModal() {
    const scoreBoard = this.$store.state.scoreBoard.scoreBoard;
    const length = scoreBoard.scoress ? scoreBoard.scoress.length : 0;
    (this.$refs.scoreChange as ScoreChange).open(length + 1);
  }
}
</script>

<style lang="scss" scoped>
$padding: 10px;
$tr-head: 30px;
$tr-body: 75px;

.score {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  overflow-x: auto;
  font-size: 0.9rem;
}

.tr-head {
  display: flex;
  flex: 0 0 $tr-head;
  align-items: center;
  justify-content: center;
  min-width: $tr-head;
}

.tr-body {
  display: flex;
  flex: 1 0 $tr-body;
  align-items: center;
  justify-content: center;
  min-width: $tr-body;
}

header {
  display: flex;
  padding: $padding;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 0px -1px 10px 0px rgba(0, 0, 0, 0.12);
  .tr-body {
    .v-btn {
      width: calc(100% - 8px);
      min-width: 0;
      max-width: 200px;
      padding: 0 !important;
      margin: 0 4px;
      overflow: hidden;
      font-size: 0.875rem;
      text-transform: none;
    }
  }
}

body {
  display: flex;
  flex-flow: column;
  height: 100%;
  padding: 0 $padding;
  overflow-y: auto;
  &::-webkit-scrollbar {
    @media (min-width: $sp) {
      display: none;
    }
  }
  .body__row {
    position: relative;
    display: flex;
    min-height: 30px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    &:last-of-type {
      border: none;
    }
  }
}

footer {
  display: flex;
  flex-flow: column;
  padding: 0 $padding;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
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
    width: $size-sp;
    height: $size-sp;
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
