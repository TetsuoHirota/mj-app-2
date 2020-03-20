<template>
<v-card class="py-5 px-7">
  <v-card-title class="pl-0">名前の変更</v-card-title>
  <v-form ref="form" @submit.prevent>
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
    <v-row justify="end" class="my-3">
      <v-btn id="save" color="primary" @click.stop="save">決定</v-btn>
    </v-row>
  </v-form>
</v-card>
</template>

<script lang="ts">
import { Component, Vue, Emit } from 'vue-property-decorator'
import { db } from '@/firebase'
import { mdiAccount } from '@mdi/js'

@Component({
  components: {}
})
export default class Profile extends Vue {
  icons = { mdiAccount }
  name = ""
  unsubscribe: any = null
  rule = [
    (v: string) => !!v || '名前を入力してください',
    (v: string) => (v && this.getLength(v) < 11) || '長すぎます'
  ]

  getLength(str: string) {
    let result = 0;
    for(let i=0;i<str.length;i++){
      const chr = str.charCodeAt(i);
      if((chr >= 0x00 && chr < 0x81) ||
        (chr === 0xf8f0) ||
        (chr >= 0xff61 && chr < 0xffa0) ||
        (chr >= 0xf8f1 && chr < 0xf8f4)){
        //半角文字の場合は1を加算
        result += 1;
      }else{
        //それ以外の文字の場合は2を加算
        result += 2;
      }
    }
    //結果を返す
    return result;
  }

  save() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      const user = this.$store.getters["User/user"]
      db.collection("users").doc(user.uid).update({ name: this.name })
      this.$store.dispatch("User/changeProfile", {
        uid: user.uid,
        mid: user.mid,
        email: user.email,
        name: this.name
      });
      (this.$refs.form as HTMLFormElement).reset()
      this.$emit("save")
    }
  }
}
</script>

<style lang="scss" scoped>
.row {
  margin: 0;
}
</style>