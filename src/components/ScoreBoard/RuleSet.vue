<template>
  <v-dialog
    v-model="show"
    max-width="400px"
    persistent
    @click:outside="close()"
  >
    <v-card>
      <v-btn icon absolute top right @click="close()">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-title>新規ゲーム開始</v-card-title>
      <v-card-text class="px-6 py-6">
        <v-form ref="form">
          <v-row dense align="center">
            <v-col cols="5">ゲームモード</v-col>
            <v-col align="center">
              <v-btn-toggle
                v-model="playerNumber"
                mandatory
                dense
                color="primary"
              >
                <v-btn
                  v-for="(playerNumber, index) in ruleConfig.playerNumber"
                  :key="index"
                  :value="playerNumber.value"
                >
                  {{ playerNumber.label }}
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="5">レート</v-col>
            <v-col>
              <v-select
                v-model="rate"
                hide-details="auto"
                :items="ruleConfig.rate"
                item-text="label"
                item-value="value"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="5">チップ</v-col>
            <v-col>
              <v-select
                v-model="chip"
                hide-details="auto"
                :items="ruleConfig.chip"
                item-text="label"
                item-value="value"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="5">ウマ</v-col>
            <v-col>
              <v-select
                v-model="uma"
                hide-details="auto"
                :items="playerNumber === 4 ? ruleConfig.uma4 : ruleConfig.uma3"
                item-text="label"
                item-value="value"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row align="center">
            <v-col cols="5">飛び賞</v-col>
            <v-col>
              <v-select
                v-model="tobisyou"
                hide-details="auto"
                :items="ruleConfig.tobisyou"
                item-text="label"
                item-value="value"
                required
              ></v-select>
            </v-col>
          </v-row>
          <v-row dense align="center" justify="center">
            <v-expansion-panels flat tile class="mt-2">
              <v-expansion-panel>
                <v-expansion-panel-header class="pa-0">
                  詳細設定
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row align="center">
                    <v-col cols="5">清算方法</v-col>
                    <v-col>
                      <v-select
                        v-model="round"
                        hide-details="auto"
                        :items="ruleConfig.round"
                        item-text="label"
                        item-value="value"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="5">持ち点</v-col>
                    <v-col>
                      <v-select
                        v-model="defaultScore"
                        hide-details="auto"
                        :items="ruleConfig.defaultScore"
                        item-text="label"
                        item-value="value"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col cols="5">オカ</v-col>
                    <v-col>
                      <v-select
                        v-model="oka"
                        hide-details="auto"
                        :items="ruleConfig.oka"
                        item-text="label"
                        item-value="value"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-row>
        </v-form>
      </v-card-text>
      <v-subheader>※この設定は後から変更できません。</v-subheader>
      <v-card-actions class="pb-4">
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="start()">このルールで開始</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Watch } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import { ruleConfig } from "@/config/rule";
import { Rule } from "@/models";

@Component({
  components: {}
})
export default class RuleSet extends BaseComponent {
  show = false;
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

  open() {
    this.show = true;
  }

  close() {
    this.show = false;
    this.setRuleFor4();
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

  start() {
    this._loading(true);
    const rule: Rule = {
      playerNumber: this.playerNumber,
      rate: this.rate,
      chip: this.chip,
      uma: this.uma,
      tobisyou: this.tobisyou,
      round: this.round,
      defaultScore: this.defaultScore,
      oka: this.oka
    };
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.close();
      this.$store
        .dispatch("scoreBoard/create", rule)
        .then(id => {
          this._loading(false);
          this.$router.push({ name: "scoreBoard", params: { id: id } });
        })
        .catch(err => {
          this._error(err);
        });
    } else {
      this.close();
      this._error("入力に不備があります");
      this._loading(false);
    }
  }
}
</script>

<style lang="scss">
.v-text-field {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

.v-expansion-panel {
  color: inherit !important;
}

.v-expansion-panel-header {
  justify-content: flex-end !important;
  font-size: 14px !important;
}

.v-expansion-panel-header__icon {
  margin-left: 10px !important;
}

.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
