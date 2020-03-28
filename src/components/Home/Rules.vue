<template>
<div class="rules pa-5" @click="mode = 'default'">
  <span class="headline">成績表</span>
  <v-subheader>ルールを選択してください</v-subheader>
  <v-alert
    v-if="rules.length == 0"
    color="#2A3B4D"
    dark
    :icon="icons.mdiPencil"
    dense
    class="ma-3"
  >
    右下の＋マークからルールを追加すると、ゲームを開始できます。<div class=""></div>
  </v-alert>
    
  <!-- ルールカード -->
  <transition-group tag="div" class="cards" name="card">
    <v-card
      v-for="rule in rules"
      :key="rule.id"
      raised
      color="teal darken-2"
      dark
      class="my-2 card"
      width="100%"
    >
      <v-card-title>
        <div>
          <span class="card__players mr-3">{{ mjPlayers(rule.players) }}</span>
          <span class="card__rate">{{ mjRate(rule.rate) }}</span>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="4">チップ :</v-col>
              <v-col align="center"><span class="mr-2">{{ rule.chip }}</span>円</v-col>
            </v-row>
            <v-row>
              <v-col cols="4">ウマ :</v-col>
              <v-col align="center">
                <span class="mr-1">{{ rule.uma.first }}</span>
                <span class="mr-1">{{ rule.uma.second }}</span>
                <span class="mr-1">{{ rule.uma.third }}</span>
                <span class="" v-if="rule.players === 4">{{ rule.uma.fourth }}</span>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="4">飛び賞 :</v-col>
              <v-col align="center"><span class="mr-2">{{ rule.tobisyou }}</span>pt</v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="4">清算 :</v-col>
              <v-col align="center"><span class="">{{ mjRound(rule.round) }}</span></v-col>
            </v-row>
            <v-row>
              <v-col cols="4">持ち点 :</v-col>
              <v-col align="center"><span class="mr-2">{{ rule.default }}</span>点</v-col>
            </v-row>
            <v-row>
              <v-col cols="4">返し :</v-col>
              <v-col align="center"><span class="mr-2">{{ rule.oka }}</span>点</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- クリック用オーバーレイボタン -->
      <v-btn
        v-if="mode == 'default'"
        absolute
        style="top: 0; left: 0"
        height="100%"
        width="100%"
        color="transparent"
        @click="selectRule(rule)"
      >
      </v-btn>


      <!-- 編集用オーバーレイボタン -->
      <v-btn
        v-if="mode == 'edit'"
        absolute
        style="top: 0; left: 0"
        height="100%"
        width="100%"
        color="rgba(0,0,0,.3)"
        @click="editRule(rule)"
      >
      </v-btn>

      <!-- 編集ボタン  -->
      <transition name="btn">
        <v-btn
          v-if="mode == 'edit'"
          fab
          small
          absolute
          style="top: -15px; right: -15px; z-index: 202;"
          color="green"
          @click="editRule(rule)"
        >
          <v-icon>{{ icons.mdiPencil }}</v-icon>
        </v-btn>
      </transition>

      <!-- 削除モード用オーバーレイ -->
      <v-overlay
        v-if="mode == 'delete'"
        absolute
      >
      </v-overlay>

      <!-- 削除ボタン  -->
      <transition name="btn">
        <v-btn
          v-if="mode == 'delete'"
          fab
          small
          absolute
          style="top: -15px; right: -15px; z-index: 202;"
          color="red"
          @click="deleteRule(rule.id)"
        >
          <v-icon>{{ icons.mdiClose }}</v-icon>
        </v-btn>
      </transition>

    </v-card>
  </transition-group>

  <!-- アクションボタン -->
  <v-speed-dial
    v-model="fab"
    absolute
    bottom
    style="right: 20px; bottom: 20px"
    direction="top"
    transition="slide-y-reverse-transition"
  >
    <template v-slot:activator>
      <v-btn
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon v-if="fab">{{ icons.mdiClose }}</v-icon>
        <v-icon v-else>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </template>
    <v-row style="position: relative">
      <span class="fab-comment">追加</span>
      <v-btn
        fab
        dark
        small
        color="indigo"
        @click="changeShowRulesAdd(true)"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
    </v-row>
    <v-row style="position: relative">
      <span class="fab-comment">編集</span>
      <v-btn
        fab
        dark
        small
        color="green"
        @click.stop="mode = 'edit', fab = false"
      >
        <v-icon>{{ icons.mdiPencil }}</v-icon>
      </v-btn>
    </v-row>
    <v-row style="position: relative">
      <span class="fab-comment">削除</span>
      <v-btn
        fab
        dark
        small
        color="red"
        @click.stop="mode = 'delete', fab = false"
      >
        <v-icon>{{ icons.mdiDelete }}</v-icon>
      </v-btn>
    </v-row>
  </v-speed-dial>

  <v-snackbar
    v-model="confirm"
    style="bottom: 100px"
    vertical
  >
    前回使用したデータが残っています。続きから始めますか？
    <v-row>
      <v-spacer></v-spacer>
      <v-btn
        color="indigo"
        text
        class="font-weight-bold"
        @click="startNewGame()"
      >
        いいえ
      </v-btn>
      <v-btn
        color="indigo"
        text
        class="font-weight-bold"
        @click="startPreviousGame()"
      >
        はい
      </v-btn>
    </v-row>
    
  </v-snackbar>

  <RulesAdd @show="changeShowRulesAdd" :parentShow="showRulesAdd"/>
  <RuleChange @show="changeShowRuleChange" :parentShow="showRuleChange" :oldRule="oldRule" @newRule="getEditedRule"/>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  mdiPlus,
  mdiClose,
  mdiPencil,
  mdiDelete
} from '@mdi/js'
import RulesAdd from '@/components/RulesAdd.vue'
import RuleChange from '@/components/RuleChange.vue'
import { mjPlayers, mjRound, mjRateKanji } from '../RuleConfig'

@Component({
  components: {
    RulesAdd,
    RuleChange
  }
})
export default class Rules extends Vue {
  icons = {
    mdiPlus,
    mdiClose,
    mdiPencil,
    mdiDelete
  }
  fab = false
  mode = "default"
  showRulesAdd = false
  showRuleChange = false
  oldRule: any = {}
  confirm = false
  selectedRule = {}

  get rules() {
    return this.$store.getters["Rules/rules"]
  }

  mounted() {
    this.$store.dispatch("Rules/getRules")
  }

  mjPlayers(players: number) {
    return mjPlayers[players]
  }

  mjRate(rate: number) {
    return mjRateKanji[rate]
  }

  mjRound(round: number) {
    return mjRound[round]
  }

  changeShowRulesAdd(value: boolean) {
    this.showRulesAdd = value
  }

  changeShowRuleChange(value: boolean) {
    this.showRuleChange = value
  }

  deleteRule(id: string) {
    this.$store.dispatch("Rules/deleteRule", id)
  }

  editRule(rule: any) {
    this.oldRule = rule
    this.showRuleChange = true
  }

  getEditedRule(rule: any) {
    const newRule = JSON.parse(JSON.stringify(rule))
    this.$store.dispatch("Rules/changeRule", newRule)
  }

  selectRule(rule: any) {
    this.selectedRule = rule
    if (this.$store.getters["ScoreBoard/id"] == "") {
      this.startNewGame()
    } else {
      this.confirm = true
    }
  }

  startPreviousGame() {
    this.$store.dispatch("Rules/changeRule", this.selectedRule)
    this.$router.push({name: 'ScoreBoard'})
  }

  startNewGame() {
    this.$store.dispatch("Rules/changeRule", this.selectedRule)
    this.$store.dispatch("ScoreBoard/newGame", this.selectedRule)
    this.$router.push({name: 'ScoreBoard'})
  }

}
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
}

.rules {
  height: 100%;
  overflow-y: auto;
  // display: grid;
  // grid-template-rows: auto auto 1fr;
}

.cards {
  margin: 0 10px;
  position: relative;
}

.card {
  .col {
    padding: 0;
  }
  &__players {
    font-size: 30px;
    font-family: serif;
    font-weight: 500;
  }
  &__rate {
    font-size: 20px;
    font-family: serif;
  }
  .v-card__text {
    >.row >.col >.row >.col {
      font-size: 13px;
    }
  }
}

.fab-comment {
  position: absolute;
  padding: 0 5px;
  transform: translate(-50%, -50%);
  top: 50%;
  left: -22px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0,0,0,.9);
  &::before {
    content: "";
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 5px;
    background: rgba(255, 255, 255, .8);
    filter: blur(2px);
  }
}

.card {
  &-move {
    transition: transform 1s;
  }
  // 要素が入るときのアニメーション
  &-enter {
    // アニメーションの初期設定（初期値とtransitionを設定する）
    &-active {
      opacity: 0;
      transition: opacity 1s;
    }
    // アニメーション開始（目標のプロパティ値を設定する）
    &-to {
      opacity: 1;
    }
  }

  // 要素が消える時のアニメーション
  &-leave {
    // アニメーションの初期設定
    &-active {
      // 要素が消える場合はabsoluteにする（重要！）
      position: absolute;
      transition: all 1s;
    }
    &-to {
      opacity: 0;
      transform: translateX(1000px);
    }
  }
}

.btn {
  &-enter-active, &-leave-active {
    transition: transform opacity;
    position: absolute;
  }
  &-enter, &-leave-to {
    opacity: 0;
    transform: scale(0);
  }
}
</style>