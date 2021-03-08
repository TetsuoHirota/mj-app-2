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
          :class="{ minus: result.totalPts[idx] < 0 }"
        >
          {{ result.totalPts[idx] }}
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
          <v-edit-dialog
            :return-value.sync="a"
            @open="onDialogOpened()"
            @close="onDialogClosed()"
          >
            <v-chip
              v-if="result.chips[idx] || result.chips[idx] === 0"
              color="orange"
              small
              class="px-2"
            >
              {{ result.chips[idx] | chip }}
            </v-chip>
            <template #input>
              <v-text-field
                style="width: 60px"
                type="number"
                single-line
                :value="result.chips[idx]"
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
          :class="{ minus: result.yens[idx] < 0 }"
        >
          {{ result.yens[idx] }}
        </div>
      </div>
    </footer>

    <v-btn
      class="btn btn--chip"
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
      class="btn btn--score"
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
  isDialogOpened = false;
  a = "";

  $refs!: {
    scoreChange: ScoreChange;
  };
  gameNumber = 100;
  // get isPtMode() {
  //   return this.$store.getters["scoreBoard/inputMode"] === "pt";
  // }
  get scoreBoard(): ScoreBoard {
    return this.$store.getters["scoreBoard/scoreBoard"];
  }

  mounted() {
    setTimeout(() => {
      // console.debug(this.scoreBoard);
    }, 0);
  }

  get players() {
    return this.scoreBoard.players || [];
  }

  get scoress() {
    return this.scoreBoard.scoress || [];
  }

  get result() {
    return scoreBoardResult(this.scoreBoard);
  }

  get totalChip(): number {
    return this.result.chips.reduce((acc: number, cur) => {
      console.debug(this.result.chips);
      if (cur == null) {
        return acc;
      }

      return acc + cur;
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
    console.debug("open");
    this.isDialogOpened = true;
  }
  onDialogClosed() {
    this.isDialogOpened = false;
    console.debug("close");
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
  // border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  // box-shadow: 0px -1px 10px 0px rgba(0, 0, 0, 0.12);
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
    // border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    &:last-of-type {
      border: none;
    }
  }
}

footer {
  display: flex;
  flex-flow: column;
  padding: 0 $padding;
  // border-top: 1px solid rgba(0, 0, 0, 0.12);
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

  &--chip {
    right: calc(#{$right-lg} + #{$distance-lg});
    @include sp {
      right: calc(#{$right-sp} + #{$distance-sp});
    }
  }
  &--score {
    right: $right-lg;
    @include sp {
      right: $right-sp;
    }
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
