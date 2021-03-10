<template>
  <div class="score">
    <header>
      <div class="tr-head"></div>
      <div v-for="player in players" :key="player.uid" class="tr-body">
        {{ player.name }}
      </div>
    </header>
    <v-divider style="opacity: 0.5"></v-divider>
    <body>
      <div v-for="index in gameNumber" :key="index">
        <v-list-item class="body__row pa-0" @click="changeScore(index)">
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
        </v-list-item>
        <v-divider style="opacity: 0.5"></v-divider>
      </div>
    </body>

    <footer>
      <div class="footer__row">
        <div class="tr-head">計</div>
        <div
          v-for="(player, idx) in players"
          :key="player.uid"
          class="tr-body"
          :class="{ minus: results[idx].totalPt < 0 }"
        >
          {{ results[idx].totalPt }}
        </div>
      </div>
      <v-divider></v-divider>
      <div class="footer__row">
        <div class="tr-head">
          <v-badge overlap color="error" :value="totalChip !== 0">
            <template #badge>!</template>
            <Casino-chip></Casino-chip>
          </v-badge>
        </div>
        <div v-for="(player, idx) in players" :key="player.uid" class="tr-body">
          <v-edit-dialog @open="onDialogOpened()" @close="onDialogClosed()">
            <v-chip
              v-if="results[idx].chip || results[idx].chip === 0"
              color="orange"
              small
              class="px-2"
            >
              {{ results[idx].chip | chip }}
            </v-chip>
            <template #input>
              <v-text-field
                style="width: 60px"
                type="number"
                single-line
                :value="results[idx].chip"
                suffix="枚"
                @change="v => onChipChange(v, player)"
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </div>
      </div>
      <v-divider></v-divider>
      <div class="footer__row">
        <div class="tr-head">￥</div>
        <div
          v-for="(player, idx) in players"
          :key="player.uid"
          class="tr-body"
          :class="{ minus: results[idx].yen < 0 }"
        >
          {{ results[idx].yen }}
        </div>
      </div>
    </footer>

    <v-btn
      class="btn"
      absolute
      fab
      color="primary"
      @click.stop="openScoresModal"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <ScoreChange ref="scoreChange" />
    <div v-if="isDialogOpened" class="dialog-overlay"></div>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";

import { ScoreBoard, UserInfo } from "@/models";
import { scoreBoardResult } from "@/utils";

import ScoreChange from "@/components/scoreBoard/ScoreChange.vue";
import CasinoChip from "@/components/shared/Casino-chip.vue";

@Component({
  components: {
    ScoreChange,
    CasinoChip
  },
  filters: {
    chip: (v: number | null): string => {
      if (v === null) {
        return "";
      } else {
        return `${v > 0 ? "+" : ""}${v}`;
      }
    }
  }
})
export default class Score extends BaseComponent {
  $refs!: {
    scoreChange: ScoreChange;
  };
  isDialogOpened = false;
  gameNumber = 100;
  get scoreBoard(): ScoreBoard {
    return this.$store.getters["scoreBoard/scoreBoard"];
  }

  get players() {
    return this.scoreBoard.players || [];
  }

  get scoress() {
    return this.scoreBoard.scoress || [];
  }

  get results() {
    return scoreBoardResult(this.scoreBoard);
  }

  get totalChip(): number {
    return this.results.reduce((acc: number, cur) => {
      return acc + (cur.chip || 0);
    }, 0);
  }

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

  onDialogOpened() {
    this.isDialogOpened = true;
  }
  onDialogClosed() {
    this.isDialogOpened = false;
  }

  onChipChange(value: string, player: UserInfo) {
    let v = null;
    if (value !== "") {
      v = Number(value);
    }
    this.$store.dispatch("scoreBoard/changeChip", {
      value: v,
      uid: player.uid
    });
  }
}
</script>

<style lang="scss" scoped>
$padding: 10px;
$tr-head: 30px;
$tr-body: 75px;

.score {
  position: relative;
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
  padding: 15px $padding;
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
    &:last-of-type {
      border: none;
    }
  }
}

footer {
  display: flex;
  flex-flow: column;
  padding: 0 $padding;
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
  $right-sp: 18px;
  $size-sp: 45px;
  $right-lg: 28px;

  right: $right-lg;
  bottom: 138px;

  @include sp {
    right: $right-sp;
    width: $size-sp;
    height: $size-sp;
  }
}

.minus {
  color: red;
}

.dialog-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
}
</style>
<style lang="scss">
.score {
  .v-small-dialog__activator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
