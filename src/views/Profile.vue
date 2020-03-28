<template>
<div class="profile">

  <v-app-bar color="indigo" dark>
    <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
  </v-app-bar>

  <v-row justify="center" align="center">
    <div>

      <!-- info -->
      <p class="mx-8">
        <span class="title font-weight-bold mr-2">{{email}}</span>さん
      </p>
      <p class="caption mx-8 my-0">あなたのプロフィールを設定してください。</p>
      <p class="caption mx-8 mb-10">名前は後から変更できます。</p>

      <!-- form -->
      <v-card class="py-5 px-7 mx-4">
        <v-form ref="form" @submit.prevent>
          <v-row>
            <v-text-field
              v-model="id"
              @keyup.enter="validate"
              type="text"
              :rules="formRules.id"
              :prepend-icon="icons.mdiCardAccountDetails"
              label="ID"
            >
            </v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              v-model="name"
              @keyup.enter="validate"
              type="text"
              :rules="formRules.name"
              :prepend-icon="icons.mdiAccount"
              label="名前"
              hint="成績表に表示される名前です"
            >
            </v-text-field>
          </v-row>
          <v-row
            justify="end"
            class="mt-4"
          >
            <v-btn
              color="primary"
              @click="validate"
            >
              決定
            </v-btn>

            <!-- 確認ダイアログ -->
            <v-dialog v-model="dialog">
              <v-card>
                <v-card-title>以下の内容でよろしいですか？</v-card-title>
                <v-card-text>IDは変更することができません</v-card-text>
                <v-card-text class="px-10 black--text">
                  <p>ID: {{ id }}</p>
                  <p>名前: {{ name }}</p>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="dialog = false"
                  >
                    キャンセル
                  </v-btn>

                  <v-btn
                    color="primary"
                    text
                    @click="save"
                  >
                    保存
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>
        </v-form>
      </v-card>
    </div>
  </v-row>

</div>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { db } from '@/firebase'
import { mdiAccount, mdiCardAccountDetails } from '@mdi/js'

@Component({
  components: {}
})
export default class Profile extends Vue {
  icons = {
    mdiAccount,
    mdiCardAccountDetails
  }
  dialog = false
  id = ""
  name = ""
  usedIds: string[] = []
  unsubscribe: any = null

  get email() {
    return this.$store.getters["User/user"].email
  }

  get formRules() {
    return {
      id: [
        (v: string) => !!v || 'IDを入力してください',
        (v: string) => (v && v.match(/^[0-9A-Za-z]*$/) !== null) || '半角英数字で入力してください',
        (v: string) => (v && v.length < 20) || '長すぎます',
        (v: string) => (v && v.length > 4) || '短すぎます',
        (v: string) => (v && this.usedIds.indexOf(v) == -1) || 'そのIDは既に存在しています'
      ],
      name: [
        (v: string) => !!v || '名前を入力してください',
        (v: string) => (v && this.getLength(v) < 11) || '長すぎます'
      ]
    }
  }

  mounted() {
    this.unsubscribe = db.collection("users").onSnapshot((querySnapshot) => {
      const ids: any = []
      querySnapshot.forEach((doc) => {
        ids.push(doc.data().mid)
      })
      this.usedIds = ids;
    })
  }

  destroyed() {
    this.unsubscribe()
  }

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

  validate() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.dialog = true
    }
  }

  save() {
    this.$store.dispatch("User/changeProfile", {
      mid: this.id,
      name: this.name
    })
    this.$router.push({name: 'Home'})
  }

}
</script>

<style lang="scss" scoped>
.profile {
  height: 100%;
  display: grid;
  grid-auto-rows: max-content 1fr;
}

.row {
  margin: 0;
}

p {
  word-break: break-all;
}
</style>