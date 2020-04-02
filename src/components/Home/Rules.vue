<template>
<div
  class="rules pa-5"
  @click="mode = 'normal'"
>
  <h2>成績表</h2>
  <v-subheader>ルールを選択してください</v-subheader>

  <v-alert
    v-if="rules.length == 0"
    color="#2A3B4D"
    dark
    :icon="icons.mdiPencil"
    dense
    class="ma-3"
  >
    右下の＋マークからルールを追加すると、ゲームを開始できます。
  </v-alert>
    
  <!-- ルールカード -->
  <transition-group
    tag="div"
    class="cards"
    name="tr-card"
  >
    <v-card
      v-for="rule in rules"
      :key="rule.id"
      color="teal darken-2"
      dark
      class="card ma-1 ma-sm-2"
    >

      <v-card-title class="py-3 px-4">
        <h3 class="display-2 mr-3">{{ playersLabel (rule.players) }}</h3>
        <h4 class="display-1">{{ rateLabel (rule.rate) }}</h4>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="body-2">
        <v-row>
          <v-col>チップ :</v-col>
          <v-col>{{ chipLabel (rule.chip) }}</v-col>
        </v-row>
        <v-row>
          <v-col>ウマ :</v-col>
          <v-col>{{ umaLabel (rule.uma) }}</v-col>
        </v-row>
        <v-row>
          <v-col>飛び賞 :</v-col>
          <v-col>{{ tobisyouLabel (rule.tobisyou) }}</v-col>
        </v-row>
        <v-row>
          <v-col>清算 :</v-col>
          <v-col>{{ roundLabel (rule.round) }}</v-col>
        </v-row>
        <v-row>
          <v-col>持ち点 :</v-col>
          <v-col>{{ defaultScoreLabel (rule.defaultScore) }}</v-col>
        </v-row>
        <v-row>
          <v-col>返し :</v-col>
          <v-col>{{ okaLabel (rule.oka) }}</v-col>
        </v-row>
      </v-card-text>

      <!-- クリック用オーバーレイボタン -->
      <v-btn
        v-if="mode == 'normal'"
        absolute
        style="top: 0; left: 0; padding: 0;"
        height="100%"
        width="100%"
        color="transparent"
        @click="selectRule(rule)"
      ></v-btn>

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

      <!-- 削除モード用オーバーレイボタン -->
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
    style="right: 30px; bottom: 30px"
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
      <v-btn
        class="speed-dial__add"
        fab
        dark
        small
        color="indigo"
        @click="openRuleAdd()"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
      <v-btn
        class="speed-dial__edit"
        fab
        dark
        small
        color="green"
        @click.stop="mode = 'edit', fab = false"
      >
        <v-icon>{{ icons.mdiPencil }}</v-icon>
      </v-btn>
      <v-btn
        class="speed-dial__delete"
        fab
        dark
        small
        color="red"
        @click.stop="mode = 'delete', fab = false"
      >
        <v-icon>{{ icons.mdiDelete }}</v-icon>
      </v-btn>
  </v-speed-dial>

  <!-- 確認ダイアログ -->
  <v-snackbar
    v-model="confirm"
    style="bottom: 100px"
    vertical
  >
    前回使用したデータが残っています。続きから始めますか？
    <v-row justify="center" class="mb-3">
      <v-btn
        class="mx-4"
        color="primary"
        @click="startPreviousGame()"
      >
        続きから
      </v-btn>
      <v-btn
        class="mx-4"
        color="primary"
        @click="startNewGame()"
      >
        新規ゲーム
      </v-btn>
    </v-row>
  </v-snackbar>

  <!-- 追加、編集コンポーネント -->
  <RuleAdd ref="ruleAdd"/>
  <RuleChange ref="ruleChange" :rule="ruleChange" @changeRule="getEditedRule"/>

</div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import { mdiPlus, mdiClose, mdiPencil, mdiDelete } from '@mdi/js'
import RuleAdd from '@/components/Rules/RuleAdd.vue'
import RuleChange from '@/components/Rules/RuleChange.vue'
import RuleConfig from '@/mixins/ruleConfig'

@Component({
  components: {
    RuleAdd,
    RuleChange
  }
})
export default class Rules extends Mixins(RuleConfig) {
  icons = {
    mdiPlus,
    mdiClose,
    mdiPencil,
    mdiDelete
  }

  // 表示関連
  fab = false
  mode = "normal"
  confirm = false

  // ルール変更用
  ruleChange = {}

  selectedRule = {}

  get rules() {
    return this.$store.getters["Rules/rules"]
  }

  mounted() {
    this.$store.dispatch("Rules/startListener")
  }

  destroyed() {
    this.$store.dispatch("Rules/stopListener")
  }

  openRuleAdd() {
    (this.$refs as any).ruleAdd.open()
  }

  deleteRule(id: string) {
    this.$store.dispatch("Rules/deleteRule", id)
  }

  editRule(rule: any) {
    this.ruleChange = rule;
    (this.$refs as any).ruleChange.open()
  }

  getEditedRule(rule: any) {
    this.$store.dispatch("Rules/changeRule", this.ruleChange)
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
}

.cards {
  position: relative;
  display: grid;
  justify-content: center;
  grid-template-columns: repeat(auto-fit, minmax(300px, 500px));
}

.card {
  min-width: 300px;
  .col {
    padding: 0;
  }
  .v-card__text {
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(3, auto);
    grid-template-columns: repeat(2, 1fr);
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

<style lang="scss">
.rules {
  .v-speed-dial__list {
    .speed-dial {
      &__add::after {
        content: "追加";
        position: absolute;
        right: 48px;
        color: rgba(0,0,0,.8);
        font-size: 14px;
        box-shadow: none;
        border-radius: 5px;
        background: rgba(255, 255, 255, .8);
        padding: 5px 10px;
      }
      &__edit::after {
        content: "編集";
        position: absolute;
        right: 48px;
        color: rgba(0,0,0,.8);
        font-size: 14px;
        box-shadow: none;
        border-radius: 5px;
        background: rgba(255, 255, 255, .8);
        padding: 5px 10px;
      }
      &__delete::after {
        content: "削除";
        position: absolute;
        right: 48px;
        color: rgba(0,0,0,.8);
        font-size: 14px;
        box-shadow: none;
        border-radius: 5px;
        background: rgba(255, 255, 255, .8);
        padding: 5px 10px;
      }
    }
  }
}
</style>