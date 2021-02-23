<template>
  <div class="profile">
    <v-app-bar color="indigo" dark>
      <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
    </v-app-bar>

    <v-row justify="center" align="center">
      <v-col class="px-8" align="center">
        <!-- 情報 -->
        <p>
          <span class="display-2 font-weight-medium mr-2">{{ email }}</span
          >さん
        </p>
        <v-subheader style="width: fit-content; text-align: start">
          あなたのプロフィールを完成させてください。名前は後から変更できます。
        </v-subheader>

        <!-- フォーム -->
        <v-card class="my-9 pa-2" max-width="400px">
          <v-form ref="form" @submit.prevent>
            <v-col>
              <v-text-field
                v-model="id"
                label="ID"
                type="text"
                :rules="formRules.id"
                :prepend-icon="icons.mdiCardAccountDetails"
                @keyup.enter="validate"
              >
              </v-text-field>
              <v-text-field
                v-model="name"
                label="名前"
                type="text"
                :rules="formRules.name"
                :prepend-icon="icons.mdiAccount"
                hint="成績表に表示される名前です"
                @keyup.enter="validate"
              >
              </v-text-field>
              <v-row>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="validate"> 決定 </v-btn>
              </v-row>
            </v-col>
          </v-form>
        </v-card>

        <!-- 確認ダイアログ -->
        <v-dialog v-model="dialog" max-width="380px">
          <v-card>
            <v-card-title>
              <h2>以下の内容でよろしいですか？</h2>
              <v-subheader>IDは変更することができません</v-subheader>
            </v-card-title>
            <v-card-text
              class="px-10 font-weight-medium"
              style="color: rgba(0, 0, 0, 0.87)"
            >
              <p>ID: {{ id }}</p>
              <p>名前: {{ name }}</p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="dialog = false">
                キャンセル
              </v-btn>

              <v-btn color="primary" text @click="save"> 保存 </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import { db } from "@/firebase";
import Utilities from "@/mixins/utilities.ts";

@Component({
  components: {}
})
export default class Profile extends Mixins(Utilities) {
  dialog = false;

  // フォーム
  id = "";
  name = "";

  // 既存ユーザーID
  usedIds: string[] = [];

  // リスナー停止
  unsubscribe: any = null;

  get email() {
    return this.$store.getters["User/user"].email;
  }

  get formRules() {
    return {
      id: [
        (v: string) => !!v || "IDを入力してください",
        (v: string) =>
          (v && v.match(/^[0-9A-Za-z]*$/) !== null) ||
          "半角英数字で入力してください",
        (v: string) => (v && v.length < 20) || "長すぎます",
        (v: string) => (v && v.length > 4) || "短すぎます",
        (v: string) =>
          (v && this.usedIds.indexOf(v) == -1) || "そのIDは既に存在しています"
      ],
      name: [
        (v: string) => !!v || "名前を入力してください",
        (v: string) => (v && this.getLength(v) < 11) || "長すぎます"
      ]
    };
  }

  mounted() {
    this.unsubscribe = db.collection("users").onSnapshot(querySnapshot => {
      const ids: any = [];
      querySnapshot.forEach(doc => {
        ids.push(doc.data().mid);
      });
      this.usedIds = ids;
    });
  }

  destroyed() {
    this.unsubscribe();
  }

  validate() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      this.dialog = true;
    }
  }

  save() {
    this.$store.dispatch("User/changeProfile", {
      mid: this.id,
      name: this.name
    });
    this.$router.push({ name: "Home" });
  }
}
</script>

<style lang="scss" scoped>
.profile {
  display: grid;
  grid-auto-rows: max-content 1fr;
  height: 100%;
}
</style>
