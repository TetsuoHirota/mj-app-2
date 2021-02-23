<template>
  <v-dialog v-model="show" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <h3 class="display-1">ルール変更</h3>
      </v-card-title>

      <v-card-text class="pt-0">
        <v-col class="form">
          <v-form ref="newRuleForm">
            <v-row>
              <v-col class="form__title">
                <v-subheader>プレイ人数</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.players"
                  :items="ruleItems.players"
                  item-text="label"
                  item-value="value"
                  :rules="[
                    v => !!v || v == 0 || 'プレイ人数を選択してください'
                  ]"
                  required
                  @change="rule.uma = null"
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="form__title">
                <v-subheader>レート</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.rate"
                  :items="ruleItems.rate"
                  item-text="label"
                  item-value="value"
                  :rules="[v => !!v || v == 0 || 'レートを選択してください']"
                  required
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="form__title">
                <v-subheader>チップ</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.chip"
                  :items="ruleItems.chip"
                  item-text="label"
                  item-value="value"
                  :rules="[v => !!v || v == 0 || 'チップを選択してください']"
                  required
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="form__title">
                <v-subheader>ウマ</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.uma"
                  :items="rule.players === 4 ? ruleItems.uma4 : ruleItems.uma3"
                  item-text="label"
                  item-value="value"
                  :rules="[v => !!v || v == 0 || 'ウマを選択してください']"
                  required
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="form__title">
                <v-subheader>飛び賞</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.tobisyou"
                  :items="ruleItems.tobisyou"
                  item-text="label"
                  item-value="value"
                  :rules="[v => !!v || v == 0 || '飛び賞を選択してください']"
                  required
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="form__title">
                <v-subheader>清算方法</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.round"
                  :items="ruleItems.round"
                  item-text="label"
                  item-value="value"
                  :rules="[v => !!v || v == 0 || '清算方法を選択してください']"
                  required
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="form__title">
                <v-subheader>持ち点</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.defaultScore"
                  :items="ruleItems.defaultScore"
                  item-text="label"
                  item-value="value"
                  suffix="持ち"
                  :rules="[v => !!v || v == 0 || '持ち点を選択してください']"
                  required
                >
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="form__title">
                <v-subheader>オカ</v-subheader>
              </v-col>
              <v-col class="form__value">
                <v-select
                  v-model="rule.oka"
                  :items="ruleItems.oka"
                  item-text="label"
                  item-value="value"
                  suffix="返し"
                  :rules="[v => !!v || v == 0 || 'オカを選択してください']"
                  required
                >
                </v-select>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">閉じる</v-btn>
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Prop } from "vue-property-decorator";
import RuleConfig from "@/mixins/ruleConfig";

@Component({
  components: {}
})
export default class RulesAdd extends Mixins(RuleConfig) {
  show = false;

  @Prop() rule: any;

  open() {
    this.show = true;
  }

  close() {
    this.show = false;
  }

  save() {
    if ((this.$refs.newRuleForm as HTMLFormElement).validate()) {
      this.$emit("changeRule");
      this.show = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  .col {
    display: flex;
    align-items: center;
    padding: 0;
    margin: 0;
  }
  .v-subheader {
    padding: 0;
  }
  &__title {
    flex-grow: 1;
  }
  &__value {
    flex-grow: 2;
  }
}
</style>
