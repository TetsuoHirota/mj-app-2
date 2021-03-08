<template>
  <v-dialog
    v-model="show"
    max-width="400px"
    persistent
    @click:outside="close()"
  >
    <v-card class="score-change">
      <v-btn icon absolute top right @click="close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-title>{{ index }}半荘目</v-card-title>
      <v-col class="list px-10 py-3">
        <draggable
          v-model="data"
          :animation="200"
          :handle="'.handle'"
          ghost-class="list__item--drag"
        >
          <v-row
            v-for="item in data"
            :key="item.uid"
            class="list__item py-5"
            no-gutters
            align="center"
          >
            <transition name="tr-fade">
              <v-btn v-if="sameScore" icon class="handle handler">
                <v-icon>mdi-swap-vertical</v-icon>
              </v-btn>
            </transition>
            <div class="item__name">
              {{ item.name }}
            </div>
            <div class="item__input">
              <v-text-field
                hide-details
                type="number"
                :index="index"
                :value="
                  isPtMode
                    ? item.pt
                    : item.score
                    ? item.score / 100
                    : item.score
                "
                @input="value => handleInput(item, value)"
              >
                <template v-if="!isPtMode" slot="append">00</template>
              </v-text-field>
              <div class="input__append body-1">
                {{ isPtMode ? "pt" : "点" }}
              </div>
              <v-btn
                class="input__autoinput"
                icon
                color="primary"
                @click="inputAuto(item)"
              >
                <v-icon>mdi-circle-edit-outline</v-icon>
              </v-btn>
            </div>
          </v-row>
        </draggable>
        <transition name="tr-accordion">
          <v-row v-if="tobi" class="form__li mb-3">
            <div>飛ばした人</div>
            <v-select
              v-model="tobashiId"
              :items="data"
              item-text="name"
              item-value="uid"
              class="mx-2"
              clearable
            ></v-select>
          </v-row>
        </transition>
        <transition name="tr-accordion">
          <v-subheader v-if="sameScore" class="caption pa-0 my-5">
            ※同点の場合、上に名前のある人が高い順位になります。
          </v-subheader>
        </transition>
        <transition name="tr-accordion">
          <div v-if="errorMessage">
            <v-alert type="error" class="py-2 error">
              {{ errorMessage }}
            </v-alert>
          </div>
        </transition>
      </v-col>

      <v-card-actions class="pb-4">
        <v-btn color="error" text @click="deleteScore">削除</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" depressed @click="saveScore">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import { ScoreBoard, Score, UserInfo } from "@/models";
import { round } from "@/utils";
import draggable from "vuedraggable";

@Component({
  components: {
    draggable
  }
})
export default class ScoreChange extends BaseComponent {
  scoreBoard?: ScoreBoard;
  data: (Score & UserInfo)[] = [];

  show = false;
  index = 0;

  errorMessage = "";
  tobashiId = "";

  get isPtMode() {
    return this.$store.getters["scoreBoard/inputMode"] === "pt";
  }

  // フォームの情報
  get tobi() {
    return this.data.some((item: any) => {
      return item.score < 0;
    });
  }

  @Watch("tobi")
  clearTobi() {
    this.tobashiId = "";
  }

  get sameScore() {
    const scores: number[] = [];
    let result = false;
    this.data.forEach(item => {
      if (!this.isPtMode && item.score) {
        if (scores.includes(item.score)) {
          result = true;
        } else {
          scores.push(item.score);
        }
      }
    });
    return result;
  }

  // 関数
  open(index: number) {
    this.index = index;
    const scoreBoard: ScoreBoard = this.$store.state.scoreBoard.scoreBoard;
    this.scoreBoard = scoreBoard;
    if (!scoreBoard) {
      this._error("エラーが発生しました");
      return;
    }
    const scoress = scoreBoard.scoress;
    const players = scoreBoard.players;
    const scores = scoress[index - 1] || [];
    this.show = true;

    this.data = [];
    players.forEach((player: UserInfo) => {
      const score: Score = scores.find((score: Score) => {
        return score.uid === player.uid;
      }) || {
        uid: player.uid,
        pt: null,
        score: null,
        rank: null
      };
      this.data.push({
        ...player,
        ...score
      });
    });
  }

  close() {
    this.show = false;
    setTimeout(() => {
      this.data = [];
      this.index = 0;
      this.tobashiId = "";
      this.errorMessage = "";
    }, 500);
  }

  handleInput(item: Score & UserInfo, value: number) {
    const target = this.data.find(d => {
      return d.uid === item.uid;
    });
    if (!target) {
      return;
    }
    if (this.isPtMode) {
      target.pt = value;
    } else {
      target.score = value ? value * 100 : value;
    }
  }

  validate() {
    const { scoreBoard, data, isPtMode } = this;
    if (!scoreBoard) {
      this._error("成績表が見つかりません");
      return false;
    }
    const { id, players, scoress, rule, createdAt } = scoreBoard;

    const inputNumber = data.filter(item => {
      return Number.isFinite(isPtMode ? item.pt! : item.score!);
    }).length;

    if (inputNumber !== rule.playerNumber) {
      this.errorMessage = rule.playerNumber + "人分の数値を入力してください";
      return false;
    }

    const total = data.reduce((total: number, item: any) => {
      return Number(isPtMode ? item.pt : item.score) + total;
    }, 0);
    const totalToBe = isPtMode ? 0 : rule.playerNumber * rule.defaultScore;

    if (total !== totalToBe) {
      this.errorMessage = `合計が${totalToBe}${
        isPtMode ? "pt" : "点"
      }になるように入力してください (現在合計: ${total}${
        isPtMode ? "pt" : "点"
      })`;
      return false;
    }
    this.errorMessage = "";
    return true;
  }

  // scorePt変換
  getPt(): (Score & UserInfo)[] {
    const { scoreBoard, data, isPtMode } = this;
    if (!scoreBoard) {
      this._error("成績表が見つかりません");
      return [];
    }
    const { rule } = scoreBoard;
    // 入力のあるitemのみの配列にへんかん
    const scores = data.filter((item: any) => {
      return isFinite(isPtMode ? item.pt : item.score);
    });
    if (isPtMode) {
      return scores;
    }
    // スコアの高い順に並び替え
    scores.sort((a: any, b: any) => b.score - a.score);
    let firstBonus = 0; //一位に追加されるpt
    let tobiBonus = scores.reduce(
      (acc, cur) => acc + (cur.score && cur.score < 0 ? rule.tobisyou : 0),
      0
    );
    for (let i = 1; i < scores.length; i++) {
      const score = scores[i].score;
      if (score == null) {
        this._error("計算でエラーが発生しました");
        return [];
      }
      let calculatedScore = score - rule.oka;
      // 飛ばし処理
      if (this.tobashiId && score < 0) {
        calculatedScore -= rule.tobisyou;
        tobiBonus += rule.tobisyou;
      }
      if (this.tobashiId === scores[i].uid) {
        calculatedScore += tobiBonus;
      }
      let uma = 0;
      if (rule.playerNumber === 4) {
        uma =
          i === 1 ? rule.uma[0] : i === 2 ? rule.uma[0] * -1 : rule.uma[1] * -1;
      } else {
        uma = i === 1 ? rule.uma[0] : rule.uma[1] * -1;
      }
      const pt = round(rule.round, calculatedScore) + uma;
      firstBonus -= pt;
      scores[i].rank = i + 1;
      scores[i].pt = pt;
    }

    scores[0].rank = 1;
    scores[0].pt = firstBonus;
    return scores;
  }

  inputAuto(item: Score & UserInfo) {
    const { scoreBoard, data, isPtMode } = this;
    if (!scoreBoard) {
      return;
    }
    const { rule } = scoreBoard;

    const playerData = data.find(d => {
      return d.uid === item.uid;
    });
    if (!playerData) {
      return;
    }
    playerData.pt = null;
    playerData.score = null;
    const totalToBe = isPtMode ? 0 : rule.playerNumber * rule.defaultScore;
    const total = data.reduce((total: number, item: any) => {
      return Number(isPtMode ? item.pt : item.score) + total;
    }, 0);
    if (isPtMode) {
      playerData.pt = totalToBe - total;
    } else {
      playerData.score = totalToBe - total;
    }
  }

  saveScore() {
    const { data, isPtMode } = this;
    if (this.validate()) {
      const scores: Score[] = this.getPt().map(e => {
        const score: Score = {
          uid: e.uid,
          pt: e.pt,
          score: e.score,
          rank: e.rank
        };
        return score;
      });
      this.$store.dispatch("scoreBoard/saveScores", {
        index: this.index,
        scores: scores
      });
      this.close();
    }
  }

  deleteScore() {
    const result = confirm("本当に削除しますか？");
    if (result) {
      this.$store.dispatch("scoreBoard/deleteScores", this.index);
      this.close();
    }
  }
}
</script>

<style lang="scss" scoped>
.tr-accordion {
  $sec: 0.3s;
  &-enter {
    &-active {
      max-height: 0;
      overflow: hidden;
      transition: all $sec linear;
    }
    &-to {
      max-height: 100px;
    }
  }
  &-leave {
    &-active {
      max-height: 100px;
      overflow: hidden;
      transition: all $sec linear;
    }
    &-to {
      max-height: 0;
    }
  }
}

.handler {
  margin-right: 5px;
  margin-left: -15px;
}
</style>
<style lang="scss">
.score-change {
  .list__item {
    flex-wrap: nowrap;
    &--drag {
      opacity: 0;
    }
    .item__name {
      flex: 1 1 auto;
      @include text-ellipsis;
    }
    .item__input {
      display: flex;
      flex: 0 0 auto;
      justify-content: center;
      font-size: 20px;
      .v-input {
        width: 80px;
        input {
          font-size: 20px;
          text-align: center;
        }
      }
      .v-input__append-inner {
        align-items: flex-end;
        align-self: stretch;
        padding: 4px 0;
        margin: 0;
        font-size: 16px;
        opacity: 0.5;
      }
      .input__append {
        display: flex;
        align-items: center;
        margin-left: 10px;
      }
      .input__autoinput {
        position: relative;
        display: flex;
        justify-content: center;
        padding: 0;
        margin-left: 15px;
        font-size: 10px;
      }
    }
    &:first-of-type .input__autoinput::after {
      position: absolute;
      bottom: 40px;
      content: "自動入力";
    }
  }
}
</style>
