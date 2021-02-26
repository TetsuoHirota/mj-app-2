<template>
  <div class="rules pa-5" @click="mode = 'normal'">
    <h2>成績表</h2>
    <v-subheader>ルールを選択してゲーム開始</v-subheader>

    <v-alert
      v-if="rules.length == 0"
      color="#2A3B4D"
      :icon="icons.mdiPencil"
      dense
      class="ma-3"
    >
      右下の＋マークからルールを追加すると、ゲームを開始できます。
    </v-alert>

    <v-btn
      v-if="isPreviousGame"
      absolute
      top
      right
      class="btn__previous-game"
      color="blue-grey"
      :to="{ name: 'ScoreBoard' }"
    >
      前回の続き
      <v-icon>{{ icons.mdiPlay }}</v-icon>
    </v-btn>

    <!-- ルールカード -->
    <transition-group tag="div" class="cards" name="tr-card">
      <v-card
        v-for="rule in rules"
        :key="rule.id"
        color="teal darken-2"
        class="card ma-1 ma-sm-2"
      >
        <v-card-title class="py-3 px-4">
          <h3 class="display-2 mr-3">{{ playersLabel(rule.players) }}</h3>
          <h4 class="display-1">{{ rateLabel(rule.rate) }}</h4>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="body-2">
          <v-row>
            <v-col>チップ :</v-col>
            <v-col>{{ chipLabel(rule.chip) }}</v-col>
          </v-row>
          <v-row>
            <v-col>ウマ :</v-col>
            <v-col>{{ umaLabel(rule.uma) }}</v-col>
          </v-row>
          <v-row>
            <v-col>飛び賞 :</v-col>
            <v-col>{{ tobisyouLabel(rule.tobisyou) }}</v-col>
          </v-row>
          <v-row>
            <v-col>清算 :</v-col>
            <v-col>{{ roundLabel(rule.round) }}</v-col>
          </v-row>
          <v-row>
            <v-col>持ち点 :</v-col>
            <v-col>{{ defaultScoreLabel(rule.defaultScore) }}</v-col>
          </v-row>
          <v-row>
            <v-col>返し :</v-col>
            <v-col>{{ okaLabel(rule.oka) }}</v-col>
          </v-row>
        </v-card-text>

        <!-- クリック用オーバーレイボタン -->
        <v-btn
          v-if="mode == 'normal'"
          absolute
          style="top: 0; left: 0; padding: 0"
          height="100%"
          width="100%"
          color="transparent"
          @click="startNewGame(rule)"
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
        ></v-btn>

        <!-- 編集ボタン  -->
        <transition name="btn">
          <v-btn
            v-if="mode == 'edit'"
            fab
            small
            absolute
            style="top: -15px; right: -15px; z-index: 202"
            color="green"
            @click="editRule(rule)"
          >
            <v-icon>{{ icons.mdiPencil }}</v-icon>
          </v-btn>
        </transition>

        <!-- 削除モード用オーバーレイボタン -->
        <v-overlay v-if="mode == 'delete'" absolute></v-overlay>

        <!-- 削除ボタン  -->
        <transition name="btn">
          <v-btn
            v-if="mode == 'delete'"
            fab
            small
            absolute
            style="top: -15px; right: -15px; z-index: 202"
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
      <template #activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab">{{ icons.mdiClose }}</v-icon>
          <v-icon v-else>{{ icons.mdiPlus }}</v-icon>
        </v-btn>
      </template>
      <v-btn
        class="speed-dial__add"
        fab
        small
        color="indigo"
        @click="openRuleAdd()"
      >
        <v-icon>{{ icons.mdiPlus }}</v-icon>
      </v-btn>
      <v-btn
        class="speed-dial__edit"
        fab
        small
        color="green"
        @click.stop="(mode = 'edit'), (fab = false)"
      >
        <v-icon>{{ icons.mdiPencil }}</v-icon>
      </v-btn>
      <v-btn
        class="speed-dial__delete"
        fab
        small
        color="red"
        @click.stop="(mode = 'delete'), (fab = false)"
      >
        <v-icon>{{ icons.mdiDelete }}</v-icon>
      </v-btn>
    </v-speed-dial>

    <!-- 追加、編集コンポーネント -->
    <RuleAdd ref="ruleAdd" />
    <RuleChange
      ref="ruleChange"
      :rule="ruleChange"
      @changeRule="getEditedRule"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import RuleAdd from "@/components/Rules/RuleAdd.vue";
import RuleChange from "@/components/Rules/RuleChange.vue";
import RuleConfig from "@/mixins/ruleConfig";

@Component({
  components: {
    RuleAdd,
    RuleChange
  }
})
export default class Rules extends Mixins(RuleConfig) {
  // 表示関連
  fab = false;
  mode = "normal";

  // ルール変更用
  ruleChange = {};

  get isLogin() {
    return this.$store.getters["User/user"].isLogin;
  }

  get isPreviousGame() {
    return this.$store.getters["ScoreBoard/id"] !== "";
  }

  get rules() {
    return this.$store.getters["Rules/rules"];
  }

  mounted() {
    if (this.isLogin) this.$store.dispatch("Rules/startListener");
  }

  destroyed() {
    if (this.isLogin) this.$store.dispatch("Rules/stopListener");
  }

  openRuleAdd() {
    (this.$refs as any).ruleAdd.open();
  }

  deleteRule(id: string) {
    this.$store.dispatch("Rules/deleteRule", id);
  }

  editRule(rule: any) {
    this.ruleChange = { ...rule };
    (this.$refs as any).ruleChange.open();
  }

  getEditedRule() {
    this.$store.dispatch("Rules/changeRule", this.ruleChange);
  }

  startNewGame(rule: any) {
    this.$store.dispatch("Rules/changeRule", rule); // lastUse更新
    this.$store.dispatch("ScoreBoard/newGame", rule);
    this.$router.push({ name: "ScoreBoard" });
  }
}
</script>

<style lang="scss" scoped>
.rules {
  height: 100%;
  overflow-y: auto;
}

.btn__previous-game {
  margin: 10px 20px;
  @include sp {
    height: 30px !important;
    margin: 8px 0;
    font-size: 0.9rem;
  }
}

.cards {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 500px));
  justify-content: center;
}

.card {
  min-width: 300px;
  .col {
    padding: 0;
  }
  .v-card__text {
    display: grid;
    grid-template-rows: repeat(3, auto);
    grid-template-columns: repeat(2, 1fr);
    grid-auto-flow: column;
  }
}

.fab-comment {
  position: absolute;
  top: 50%;
  left: -22px;
  padding: 0 5px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.9);
  transform: translate(-50%, -50%);
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    content: "";
    background: rgba(255, 255, 255, 0.8);
    filter: blur(2px);
    border-radius: 5px;
  }
}

.btn {
  &-enter-active,
  &-leave-active {
    position: absolute;
    transition: transform opacity;
  }
  &-enter,
  &-leave-to {
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
        position: absolute;
        right: 48px;
        padding: 5px 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
        content: "追加";
        background: rgba(255, 255, 255, 0.8);
        border-radius: 5px;
        box-shadow: none;
      }
      &__edit::after {
        position: absolute;
        right: 48px;
        padding: 5px 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
        content: "編集";
        background: rgba(255, 255, 255, 0.8);
        border-radius: 5px;
        box-shadow: none;
      }
      &__delete::after {
        position: absolute;
        right: 48px;
        padding: 5px 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.8);
        content: "削除";
        background: rgba(255, 255, 255, 0.8);
        border-radius: 5px;
        box-shadow: none;
      }
    }
  }
}
</style>
