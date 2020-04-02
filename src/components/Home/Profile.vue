<template>
<v-card class="py-5 px-7">
  <v-card-title class="pl-0">
    <h3 class="display-1">名前の変更</h3>
  </v-card-title>
  <v-form
    ref="form"
    @submit.prevent
  >
    <v-row>
      <v-text-field
        v-model="name"
        @keyup.enter="save"
        type="text"
        :rules="rule"
        :prepend-icon="icons.mdiAccount"
        label="名前"
        hint="成績表に表示される名前です"
      >
      </v-text-field>
    </v-row>
    <v-row
      justify="center"
      class="mt-3"
    >
      <v-btn
        text
        color="primary"
        @click.stop="close"
      >
        キャンセル
      </v-btn>
      <v-btn
        text
        color="primary"
        @click.stop="save"
      >
        決定
      </v-btn>
    </v-row>
  </v-form>
</v-card>
</template>

<script lang="ts">
import { Component, Mixins  } from 'vue-property-decorator'
import { mdiAccount } from '@mdi/js'
import Utilities from '@/mixins/utilities'

@Component({
  components: {}
})
export default class Profile extends Mixins(Utilities) {
  icons = { mdiAccount }
  name = ""
  rule = [
    (v: string) => !!v || '名前を入力してください',
    (v: string) => (v && this.getLength(v) < 11) || '長すぎます'
  ]

  save() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.$store.dispatch("User/changeName", this.name)
      this.$emit("close");
      (this.$refs.form as HTMLFormElement).reset()
    }
  }

  close() {
    this.$emit("close");
    (this.$refs.form as HTMLFormElement).reset()
  }
}
</script>