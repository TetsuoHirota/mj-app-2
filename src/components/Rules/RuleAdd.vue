<template>
  <v-dialog v-model="show" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <h3 class="display-1">新規ルール作成</h3>
      </v-card-title>

      <v-form ref="newRuleForm">
        <!-- 画面1  -->
        <div v-if="state === 0">
          <v-card-text class="pt-0">
            <v-subheader>プレイ人数を選択してください</v-subheader>
            <v-row justify="space-around">
              <v-btn
                dark
                color="indigo"
                width="40%"
                x-large
                @click="(newRule.players = 3), (state = 1)"
              >
                三麻
              </v-btn>
              <v-btn
                dark
                color="indigo"
                width="40%"
                x-large
                @click="(newRule.players = 4), (state = 1)"
              >
                四麻
              </v-btn>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close"> 閉じる </v-btn>
          </v-card-actions>
        </div>

        <!-- 画面2 -->
        <div v-if="state === 1">
          <v-card-text class="pt-0">
            <v-col>
              <v-select
                v-model="newRule.rate"
                label="レート"
                :items="ruleItems.rate"
                item-text="label"
                item-value="value"
                :rules="[v => !!v || v == 0 || 'レートを選択してください']"
                required
              >
              </v-select>
              <v-select
                v-model="newRule.chip"
                label="チップ"
                :items="ruleItems.chip"
                item-text="label"
                item-value="value"
                :rules="[v => !!v || v == 0 || 'チップを選択してください']"
                required
              >
              </v-select>
              <v-select
                v-model="newRule.uma"
                label="ウマ"
                :items="newRule.players === 4 ? ruleItems.uma4 : ruleItems.uma3"
                item-text="label"
                item-value="value"
                :rules="[v => !!v || v == 0 || 'ウマを選択してください']"
                required
              >
              </v-select>
              <v-select
                v-model="newRule.tobisyou"
                label="飛び賞"
                :items="ruleItems.tobisyou"
                item-text="label"
                item-value="value"
                :rules="[v => !!v || v == 0 || '飛び賞を選択してください']"
                required
              >
              </v-select>
              <v-select
                v-model="newRule.round"
                label="清算方法"
                :items="ruleItems.round"
                item-text="label"
                item-value="value"
                :rules="[v => !!v || v == 0 || '清算方法を選択してください']"
                required
              >
              </v-select>
              <v-select
                v-model="newRule.defaultScore"
                label="持ち点"
                :items="ruleItems.defaultScore"
                item-text="label"
                item-value="value"
                suffix="持ち"
                :rules="[v => !!v || v == 0 || '持ち点を選択してください']"
                required
              >
              </v-select>
              <v-select
                v-model="newRule.oka"
                label="オカ"
                :items="ruleItems.oka"
                item-text="label"
                item-value="value"
                suffix="返し"
                :rules="[v => !!v || v == 0 || 'オカを選択してください']"
                required
              >
              </v-select>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="back">戻る</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">閉じる</v-btn>
            <v-btn color="blue darken-1" text @click="save">保存</v-btn>
          </v-card-actions>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import RuleConfig from "@/mixins/ruleConfig";

@Component({
  components: {}
})
export default class RuleAdd extends Mixins(RuleConfig) {
  show = false;
  state = 0;

  newRule = {
    players: null,
    rate: null,
    chip: null,
    uma: null,
    tobisyou: null,
    round: null,
    oka: null,
    defaultScore: null
  };

  open() {
    this.show = true;
  }

  close() {
    this.show = false;
    this.back();
  }

  back() {
    (this.$refs.newRuleForm as HTMLFormElement).reset();
    this.state = 0;
  }

  save() {
    if ((this.$refs.newRuleForm as HTMLFormElement).validate()) {
      const rule = JSON.parse(JSON.stringify(this.newRule));
      this.$store.dispatch("Rules/addRule", rule);
      this.close();
    }
  }
}
</script>
