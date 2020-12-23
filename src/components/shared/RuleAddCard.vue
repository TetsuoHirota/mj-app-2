<template>
  <v-card class="py-3">
    <v-card-title>
      ルール設定
    </v-card-title>

    <v-card-text class="px-6 py-3">
      <v-form ref="form">
        <v-row dense align="center">
          <v-col cols="5">ゲームモード</v-col>
          <v-col align="center">
            <v-btn-toggle
              mandatory
              v-model="playerNumber"
              dense
              color="primary"
            >
              <v-btn
                v-for="(playerNumber, index) in ruleConfig.playerNumber"
                :value="playerNumber.value"
                :key="index"
                >{{ playerNumber.label }}</v-btn
              >
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="5">レート</v-col>
          <v-col>
            <v-select
              hide-details="auto"
              v-model="rate"
              :items="ruleConfig.rate"
              item-text="label"
              item-value="value"
              required
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="5">チップ</v-col>
          <v-col>
            <v-select
              hide-details="auto"
              v-model="chip"
              :items="ruleConfig.chip"
              item-text="label"
              item-value="value"
              required
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="5">ウマ</v-col>
          <v-col>
            <v-select
              hide-details="auto"
              v-model="uma"
              :items="playerNumber === 4 ? ruleConfig.uma4 : ruleConfig.uma3"
              item-text="label"
              item-value="value"
              required
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="5">飛び賞</v-col>
          <v-col>
            <v-select
              hide-details="auto"
              v-model="tobisyou"
              :items="ruleConfig.tobisyou"
              item-text="label"
              item-value="value"
              required
            >
            </v-select>
          </v-col>
        </v-row>
        <v-row dense align="center" justify="center">
          <v-expansion-panels flat tile class="mt-2">
            <v-expansion-panel>
              <v-expansion-panel-header class="pa-0"
                >詳細設定</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <v-row align="center">
                  <v-col cols="5">清算方法</v-col>
                  <v-col>
                    <v-select
                      hide-details="auto"
                      v-model="round"
                      :items="ruleConfig.round"
                      item-text="label"
                      item-value="value"
                      required
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="5">持ち点</v-col>
                  <v-col>
                    <v-select
                      hide-details="auto"
                      v-model="defaultScore"
                      :items="ruleConfig.defaultScore"
                      item-text="label"
                      item-value="value"
                      required
                    >
                    </v-select>
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="5">オカ</v-col>
                  <v-col>
                    <v-select
                      hide-details="auto"
                      v-model="oka"
                      :items="ruleConfig.oka"
                      item-text="label"
                      item-value="value"
                      required
                    >
                    </v-select>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-btn color="blue darken-1" text @click="close">キャンセル</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" dark @click="start">開始</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { ruleConfig } from "@/config/rule";
import { Rule } from "@/models/scoreBoard";

@Component({
  components: {},
})
export default class RuleAdd extends Vue {
  ruleConfig = ruleConfig;

  playerNumber = ruleConfig.playerNumber[0].value;
  rate = ruleConfig.rate[0].value;
  chip = ruleConfig.chip[0].value;
  uma = ruleConfig.uma[0].value;
  tobisyou = ruleConfig.tobisyou[0].value;
  round = ruleConfig.round[0].value;
  defaultScore = ruleConfig.defaultScore[0].value;
  oka = ruleConfig.oka[1].value;

  @Watch("playerNumber")
  setRule(newNum: number) {
    if (newNum === ruleConfig.playerNumber[0].value) {
      this.setRuleFor4();
    } else {
      this.setRuleFor3();
    }
  }

  setRuleFor4() {
    this.rate = ruleConfig.rate[0].value;
    this.chip = ruleConfig.chip[0].value;
    this.uma = ruleConfig.uma[0].value;
    this.tobisyou = ruleConfig.tobisyou[0].value;
    this.round = ruleConfig.round[0].value;
    this.defaultScore = ruleConfig.defaultScore[0].value;
    this.oka = ruleConfig.oka[1].value;
  }

  setRuleFor3() {
    this.rate = ruleConfig.rate[0].value;
    this.chip = ruleConfig.chip[0].value;
    this.uma = ruleConfig.uma[0].value;
    this.tobisyou = ruleConfig.tobisyou[0].value;
    this.round = ruleConfig.round[0].value;
    this.defaultScore = ruleConfig.defaultScore[2].value;
    this.oka = ruleConfig.oka[3].value;
  }

  close() {
    this.setRuleFor4();
    this.$emit("request-close");
  }

  async start() {
    this.$store.dispatch("app/isLoading", true);
    const rule: Rule = {
      playerNumber: this.playerNumber,
      rate: this.rate,
      chip: this.chip,
      uma: this.uma,
      tobisyou: this.tobisyou,
      round: this.round,
      defaultScore: this.defaultScore,
      oka: this.oka,
    };
    if ((this.$refs.form as HTMLFormElement).validate()) {
      await this.$store
        .dispatch("scoreBoard/createScoreBoard", rule)
        .then((id) => {
          console.log(id);
        })
        .catch((err) => {
          this.$store.dispatch("app/error", err);
        });
      this.$store.dispatch("app/isLoading", false);
      this.setRuleFor4();
    } else {
      this.$store.dispatch("app/error", "入力に不備があります");
      this.$store.dispatch("app/isLoading", false);
    }
  }

  save() {}
}
</script>

<style lang="scss">
.v-text-field {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

.v-expansion-panel {
  color: inherit !important;
}

.v-expansion-panel-header {
  font-size: 14px !important;
  justify-content: flex-end !important;
}

.v-expansion-panel-header__icon {
  margin-left: 10px !important;
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
