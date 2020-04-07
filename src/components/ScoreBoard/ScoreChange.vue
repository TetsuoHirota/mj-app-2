<template>
  <v-dialog
    v-model="show"
    max-width="400px"
    persistent
  >
    <v-card>

      <v-card-title>
        <h3 class="display-2 font-weight-medium">{{ index }}半荘目</h3>
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-spacer></v-spacer>
          <v-subheader class="autoInput-nav">自動入力</v-subheader>
        </v-row>
        <v-row
          v-for="(score, index) in scores"
          :key="score.uid"
          class="form__li"
        >
          <h4>{{ players[index].name }}</h4>
          <v-text-field
            type="number"
            :value="isPtMode ? scores[index].pt : scores[index].score"
            @input="value => changeInput(index, value)"
            class="mx-2"
            :suffix="isPtMode ? 'pt' : '点'"
          >
          </v-text-field>
          <v-btn
            icon
            color="indigo"
            @click="inputAuto(index)"
          >
            <v-icon>{{ icons.mdiCircleEditOutline }}</v-icon>
          </v-btn>
        </v-row>
        <transition name="tobashi">
          <v-row
            v-if="tobi"
            class="form__li"
          >
            <h5>飛ばした人</h5>
            <v-select
              v-model="tobashiId"
              :items="players"
              item-text="name"
              item-value="uid"
              class="mx-2"
              hint="飛ばした人がいない場合は入力しないでください"
              persistent-hint
            >
            </v-select>
          </v-row>
        </transition>
        <v-subheader class="caption pa-0 mt-3">※同点の場合、上に名前のある人が高い順位になります。</v-subheader>
        <transition name="error">
          <v-alert
            type="error"
            class="py-2 error"
            v-if="errorMessage"
          >
            {{ errorMessage }}
          </v-alert>
        </transition>
      </v-card-text>

      <v-card-actions>
        <v-btn color="red" text @click="deleteScore">削除</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
        <v-btn color="blue darken-1" text @click="saveScore">保存</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import RuleConfig from '@/mixins/ruleConfig'
import { mdiCircleEditOutline } from '@mdi/js'

@Component({
  components: {
  }
})
export default class ScoreChange extends Mixins(RuleConfig) {
  icons = {
    mdiCircleEditOutline
  }

  show = false
  index = 0

  errorMessage = ""
  tobashiId = ""
  scores: any = [] //playersと同じplayerIndexを持つ

  // コンポーネント全体の情報
  get players() {
    return this.$store.getters["ScoreBoard/players"]
  }

  get rule() {
    return this.$store.getters["ScoreBoard/rule"]
  }

  get isPtMode() {
    return this.$store.getters["ScoreBoard/isPtMode"]
  }

  // フォームの情報
  get tobi() {
    let result = false
    if (!this.isPtMode) {
      this.scores.forEach((item: any) => {
        if (item.score < 0) result = true
      })
    }
    return result
  }

  get totalInput(): number {
    return this.scores.reduce((total: number, item: any) => {
      return Number(this.isPtMode ? item.pt : item.score) + total
    }, 0)
  }

  get playersInput(): number {
    return this.scores.reduce((total: number, item: any) => {
      const value = this.isPtMode ? item.pt : item.score
      const exist = value ? 1 : value === 0 ? 1 : 0
      return exist + total
    }, 0)
  }

  get totalInputToBe(): number {
    return this.isPtMode ? 0 : this.rule.players * this.rule.defaultScore
  }

  // 関数
  open(index: number) {
    this.show = true
    this.index = index
    const scores = this.$store.getters["ScoreBoard/scores"][index - 1]
    const newScores = []
    for (let i = 0; i < this.players.length; i ++) {
      let score = null
      let pt = null
      if (scores) {
        const personalScore = scores.find((e: any) => e.uid === this.players[i].uid)
        if (personalScore) {
          score = personalScore.score
          pt = personalScore.pt
        }
      }
      newScores.push({
        uid: this.players[i].uid,
        score: score,
        pt: pt,
        rank: null
      })
      this.scores = newScores
    }
  }

  close() {
    this.show = false
    this.tobashiId = ""
    this.errorMessage = ""
    this.scores = []
  }

  validate() {
    if (this.playersInput !== this.rule.players) {
      this.errorMessage = this.rule.players + "人分の数値を入力してください"
    } else if (this.totalInput !== this.totalInputToBe) {
      this.errorMessage = `合計が${this.totalInputToBe}${this.isPtMode ? 'pt' : '点'}になるように入力してください (現在合計: ${this.totalInput}${this.isPtMode ? 'pt' : '点'})`
    } else {
      this.errorMessage = ""
      return true
    }
  }

  // ScorePt変換
  getPt() {

    // 入力のあるitemのみの配列にへんかん
    const scores = this.scores.filter((item: any) => {
      const value = this.isPtMode ? item.pt : item.score
      return value ? true : value === 0 ? true : false
    })
    
    // スコアの高い順に並び替え
    scores.sort((a: any, b: any) => this.isPtMode ? b.pt - a.pt : b.score - a.score)
    let first = 0       //一位に追加されるpt
    let tobisyou = 0  //飛ばした人に追加されるpt

    for (let i = 1; i < this.scores.length; i ++) {
      const uma =
        i === 1 ? this.rule.uma.second :
        i === 2 ? this.rule.uma.third :
        i === 3 ? this.rule.uma.fourth : 0
      let calculatedScore = scores[i].score - this.rule.oka

      // 飛ばし処理
      if (this.tobashiId && scores[i].score < 0) {
        calculatedScore -= this.rule.tobisyou
        tobisyou += this.rule.tobisyou
      }
      if (this.tobashiId === scores[i].uid) calculatedScore += tobisyou
      const pt = this.round(this.rule.round, calculatedScore) + uma

      first -= pt
      scores[i].rank = i + 1
      scores[i].pt = pt
    }

    scores[0].rank = 1
    scores[0].pt = first
    return scores
  }


  changeInput(index: number, value: string) {
    const number = value ? Number(value) : null
    if (this.isPtMode) this.scores[index].pt = number
    else this.scores[index].score = number
  }

  inputAuto(index: number) {
    const playerScore = this.scores[index]
    playerScore.pt = 0
    playerScore.score = 0
    const value: number = this.totalInputToBe - this.totalInput
    if (this.isPtMode) playerScore.pt = value
    else playerScore.score = value
  }

  saveScore() {
    if (this.validate()) {
      
      // 前データ削除
      this.scores.forEach((e: any) => {
        e.rank = null
        if (this.isPtMode) this.scores.forEach((e: any) => e.score = null)
        else this.scores.forEach((e: any) => e.pt = null)
      })

      let scores = this.scores
      if (!this.isPtMode) scores = this.getPt()
      this.$store.dispatch("ScoreBoard/changeScores", { index: this.index, scores: scores })
      this.close()
    }
  }

  deleteScore() {
    const result = confirm("本当に削除しますか？")
    if (result) {
      this.$store.dispatch("ScoreBoard/deleteScores", this.index)
      this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.form__li {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  align-items: center;
}

.autoInput-nav {
  height: 0;
  font-size: 10px;
  position: relative;
  left: 16px;
}

.tobashi {
  $sec: .5s;
  &-enter {
    &-active {
      overflow: hidden;
      height: 0;
      transition: all $sec ease;
    }
    &-to {
      height: 70px;
    }
  }
  &-leave {
    &-active {
      overflow: hidden;
      height: 70px;
      transition: all $sec ease;
    }
    &-to {
      height: 0;
    }
  }
}

.error {
  &-enter-active, &-leave-active {
    transition: all .5s;
  }
  &-enter, &-leave-to {
    opacity: 0;
  }
}

</style>