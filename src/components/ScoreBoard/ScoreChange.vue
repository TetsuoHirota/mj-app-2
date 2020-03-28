<template>
  <v-dialog
    v-model="show"
    max-width="400px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{index}}半荘目</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row class="d-flex align-center">
            <v-spacer></v-spacer>
            <!-- <v-switch
            v-model="scoreModalSwitch"
            :label="'点数入力'">
            </v-switch> -->
          </v-row>
          <v-row
          class="d-flex flex-nowrap align-center"
          v-for="(player, index) in scores"
          :key="player.uid">
            <div class="subtitle-2" style="width: 150px">{{player.name}}</div>
            <v-text-field
            type="number"
            v-model.number="scores[index].score"
            class="mx-5"
            required
            suffix="点">
            </v-text-field>
            <v-btn
            color="primary"
            class="pa-1"
            small
            >
              残り自動入力
            </v-btn>
          </v-row>
          <v-row
          class="d-flex flex-nowrap align-center"
          >
            <div class="subtitle-2" style="width: 150px">飛ばし</div>
            <v-select
            v-model="tobashiId"
            :items="players"
            item-text="name"
            item-value="uid"
            class="mx-5"
            required>
            </v-select>
          </v-row>
        </v-form>
        <v-alert
        type="error"
        class="py-2"
        v-if="errorMessage"
        >{{errorMessage}}</v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="red" text @click="deleteScore()">Delete</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="show = false">Close</v-btn>
        <v-btn color="blue darken-1" text @click="saveScore()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {

} from '@mdi/js';

@Component({
  components: {
  }
})
export default class ScoreChange extends Vue {
  show = false
  scores: any[] = []
  tobashiId = ""
  index = 0
  errorMessage = ""

  get players() {
    ("get");
    return this.$store.getters["ScoreBoard/players"]
  }

  get rule() {
    return this.$store.getters["ScoreBoard/rule"]
  }

  open(index: number) {
    this.show = true
    this.index = index
    const scores = this.$store.getters["ScoreBoard/scores"][index - 1]
    const newScores = []

    for (let i = 0; i < this.players.length; i ++) {
      let score = null
      if (scores) {
        const personalScore = scores.find((e: any) => {
          return e.uid === this.players[i].uid
        })
        if (personalScore) {
          score = personalScore.score
        }
      }
      newScores.push({
        uid: this.players[i].uid,
        name: this.players[i].name,
        score: score,
        pt: null,
        rank: null
      })
      this.scores = newScores
    }
  }

  

  round(score: number): number {
    let rounded = 0;
    switch (this.rule.round) {
      case 0:
        rounded = this.gosyarokunyuu(score);
        break;
      case 1:
        rounded = this.sisyagonyuu(score);
        break;
      case 2:
        rounded =  this.kirisute(score);
        break;
      case 3:
        rounded = this.kiriage(score);
        break;
    }
    return rounded;
  }
  gosyarokunyuu(score: number): number {
    const int = Math.floor(score / 1000);
    const dec = score % 1000;
    let ans = 0;
    if (int >= 0) {
      if (dec >= 600) {
        ans = int + 1;
      } else {
        ans = int;
      }
    } else if (int < 0) {
      if (dec <= -600 || dec == 0) {
        ans = int;
      } else {
        ans = int + 1;
      }
    }
    return ans;
  }
  sisyagonyuu(score: number): number {
    const int = Math.floor(score / 1000);
    const dec = score % 1000;
    let ans = 0;
    if (int >= 0) {
      if (dec >= 500) {
        ans = int + 1;
      } else {
        ans = int;
      }
    } else if (int < 0) {
      if (dec <= -500 || dec == 0) {
        ans = int;
      } else {
        ans = int + 1;
      }
    }
    return ans;
  }
  kiriage(score: number): number {
    const int = Math.floor(score / 1000);
    const dec = score % 1000;
    let ans = 0;
    if (score > 0) {
      if (dec > 0) {
        ans = int +1;
      } else {
        ans = int;
      }
    } else if (score < 0) {
      if (dec >= 0) {
        ans = int;
      } else {
        ans = int + 1;
      }
    }
    return ans;
  }
  kirisute(score: number): number {
    const int = Math.floor(score / 1000);
    const dec = score % 1000;
    let ans = 0;
    if (score >= 0) {
      ans = int;
    } else if (score < 0) {
      if (dec > 0) {
        ans = int - 1;
      } else {
        ans = int;
      }
    }
    return ans;
  }

  validate() {
    const total = this.scores.reduce((total, item) => {
      return item.score + total
    }, 0)
    const players = this.scores.reduce((count, item) => {
      const exist = item.score ? 1 : 0
      return exist + count
    }, 0)
    if (players !== this.rule.players) {
      this.errorMessage = this.rule.players + "人分の数値を入力してください"
    } else if (total !== this.rule.players * this.rule.default) {
      this.errorMessage = "収支が合いません"
    } else {
      this.errorMessage = ""
      return true
    }
  }

  getPtandRank() {
    const scores = this.scores.filter((score) => {
      return score.score
    })
    scores.sort((a: any, b: any) => b.score - a.score);
    let oka = 0
    let tobisyou = 0
    // 二位処理
    let second = this.round(scores[1].score - this.rule.oka) + this.rule.uma.second
    if (second < 0 && this.tobashiId !== "") {
      second -= this.rule.tobisyou;
      tobisyou += this.rule.tobisyou;
    }
    oka -= second
    // 三位処理
    let third = this.round(scores[2].score - this.rule.oka) + this.rule.uma.third
    if (third < 0 && this.tobashiId !== "") {
      third -= this.rule.tobisyou;
      tobisyou += this.rule.tobisyou;
    }
    oka -= third
    // 四位処理
    let fourth = this.round(scores[3].score - this.rule.oka) + this.rule.uma.fourth
    if (fourth < 0 && this.tobashiId !== "") {
      fourth -= this.rule.tobisyou;
      tobisyou += this.rule.tobisyou;
    }
    oka -= fourth
    // 一位処理
    const first = oka + tobisyou

    const secondPlayer = this.scores.find((score) => {
      return score.uid == scores[1].uid
    })
    secondPlayer.pt = second
    secondPlayer.rank = 2

    const thirdPlayer = this.scores.find((score) => {
      return score.uid == scores[2].uid
    })
    thirdPlayer.pt = third
    thirdPlayer.rank = 3

    const fourthPlayer = this.scores.find((score) => {
      return score.uid == scores[3].uid
    })
    fourthPlayer.pt = fourth
    fourthPlayer.rank = 4

    const firstPlayer = this.scores.find((score) => {
      return score.uid == scores[0].uid
    })
    firstPlayer.pt = first
    firstPlayer.rank = 1





    // for (let i = 1; i < this.rule.players; i++) {
    //   let rounded = this.round(scores[i].score - this.rule.oka) + this.rule.uma[i];
    //   oka -= rounded;
    //   if (scores[i].score < 0) {
    //     if (this.tobashiId !== "") {
    //       rounded -= this.rule.bonus;
    //       tobisyou += this.rule.bonus;
    //     }
    //   }
    //   scores[i].score = rounded;
    // }
    // scores[0].score = oka;
    // if (this.tobashiId !== "") {
    //   scores.find((score: any) => {
    //     return score.id == this.tobashiId
    //   }).score += tobisyou;
    // }
  }

  saveScore() {
    if (this.validate()) {
      this.getPtandRank()
      this.$store.dispatch("ScoreBoard/changeScore", { index: this.index, scores: this.scores})
      this.show = false
    }
    
    // if (this.validate() == 0) {

    //   console.log("0");
    // } else {
    //   console.log("not");
    // }
  }

  deleteScore() {
    this.$store.dispatch("ScoreBoard/deleteScore", this.index)
    this.show = false
  }

}
</script>

<style lang="scss" scoped>

</style>