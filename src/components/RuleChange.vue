<template>
<v-dialog
  v-model="show"
  persistent
  max-width="400px"
>
  <v-card>
    <v-card-title>
      <span class="headline">ルール変更</span>
    </v-card-title>

    <v-form ref="newRuleForm">
      <v-card-text class="pt-0">
        <v-col class="form">

          <v-row>
            <v-col class="form__title">
              <v-subheader>プレイ人数</v-subheader>
            </v-col>
            <v-col class="form__value">
              <v-select
                v-model="oldRule.players"
                :items="formItems.players"
                item-text="label"
                item-value="value"
                :rules="[v => !!v || v == 0 || 'プレイ人数を選択してください']"
                required
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
                v-model="oldRule.rate"
                :items="formItems.rate"
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
                v-model="oldRule.chip"
                :items="formItems.chip"
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
                v-model="oldRule.uma"
                :items="oldRule.players === 4 ? formItems.uma4 : formItems.uma3"
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
                v-model="oldRule.tobisyou"
                :items="formItems.tobisyou"
                suffix="pt"
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
                v-model="oldRule.round"
                :items="formItems.round"
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
                v-model="oldRule.default"
                :items="formItems.default"
                suffix="点持ち"
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
                v-model="oldRule.oka"
                :items="formItems.oka"
                suffix="点返し"
                :rules="[v => !!v || v == 0 || 'オカを選択してください']"
                required
              >
              </v-select>
            </v-col>
          </v-row>

        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close">閉じる</v-btn>
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-card-actions>

    </v-form>
  </v-card>
</v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { mjRound, mjPlayers, mjRate, formItems } from './RuleConfig'

@Component({
  components: {}
})
export default class RulesAdd extends Vue {
  // 表示非表示切り替え
  @Prop() parentShow: any
  get show() {
    return this.parentShow
  }
  set show(value) {
    this.$emit("show", value)
  }

  @Prop() oldRule: any

  // newRule = {
  //   players: null,
  //   rate: null,
  //   chip: null,
  //   uma: null,
  //   tobisyou: null,
  //   round: null,
  //   oka: null,
  //   default: null,
  //   lastUse: new Date()
  // }

  // newRule = this.oldRule

  formItems = formItems

  mjPlayers(players: number) {
    return mjPlayers[players]
  }

  mjRate(rate: number) {
    return mjRate[rate]
  }

  mjRound(round: number) {
    return mjRound[round]
  }

  close() {
    this.show = false
  }

  save() {
    if ((this.$refs.newRuleForm as HTMLFormElement).validate()) {
      this.$emit("newRule", this.oldRule)
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
}

.form {
  .col {
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
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