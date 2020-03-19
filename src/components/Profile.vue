<template>
<div class="profile">
  <!-- <h2>プロフィール</h2> -->
  <v-form ref="form">
    <v-row>
      <v-text-field
        v-model="id"
        type="text"
        :rules="formRules.id"
        :prepend-icon="icons.mdiCardAccountDetails"
        label="id"
      >
      </v-text-field>
    </v-row>
    <v-row>
      <v-text-field
        v-model="name"
        type="text"
        :rules="formRules.name"
        :prepend-icon="icons.mdiAccount"
        label="名前"
        hint="成績表に表示される名前です"
      >
      </v-text-field>
    </v-row>
    <v-row justify="end">
      <v-btn color="primary" @click="save">決定</v-btn>
    </v-row>
  </v-form>
</div>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { db } from '@/firebase'
import {
  mdiEmail,
  mdiLock,
  mdiAccount,
  mdiCardAccountDetails
} from '@mdi/js'


@Component({
  components: {}
})
export default class Profile extends Vue {
  icons = {
    mdiEmail,
    mdiLock,
    mdiAccount,
    mdiCardAccountDetails
  }
  id = ""
  name = ""
  loading = false;
  formRules = {
    email: [
      (v: string) => !!v || 'メールアドレスを入力してください',
    ],
    password: [
      (v: string) => !!v || 'パスワードを入力してください',
    ]
  }
  errorMessage = "";

  save() {
    const user = this.$store.getters["User/user"]
    const userInfo = {
      uid: user.uid,
      email: user.email,
      mid: this.id,
      name: this.name,
    }
    db.collection("users").doc(user.uid).update(userInfo)
    this.$store.dispatch("User/changeProfile", userInfo)
    this.$emit("save");
  }
}
</script>

<style lang="scss" scoped>

</style>