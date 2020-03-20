<template>
<div class="login">
  <!-- ナビゲーション -->
  <v-app-bar
    color="indigo"
    dark
  >
    <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
  </v-app-bar>

  <v-row class="ma-0" align="center" justify="center" style="position: relative">
    <v-row justify="end" class="ma-5" style="position: absolute; top: 0; right: 0;">
      <v-menu offset-x offset-y class="help">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon large>{{ icons.mdiHelpCircle }}</v-icon>
          </v-btn>
        </template>
        <span>アカウントを作成する場合は、「メールでログイン」を選択後、登録したいアドレスを入力してください。</span>
      </v-menu>
    </v-row>
    <div id="firebaseui-auth-container"></div>
    <v-progress-circular id="loader" indeterminate color="prime"></v-progress-circular>
  </v-row>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui-ja'
import { ui, db } from '@/firebase'
import 'firebaseui-ja/dist/firebaseui.css'
import { mdiEmail, mdiLock, mdiHelpCircle } from '@mdi/js'

@Component({
  components: {
    },
})
export default class Login extends Vue {
  uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult: any) => {
        const user = authResult.user
        const info = authResult.additionalUserInfo
        const userInfo = {
          uid: user.uid,
          email: user.email,
          isAnonymous: user.isAnonymous,
          isNewUser: info.isNewUser
        }
        if (!userInfo.isAnonymous && userInfo.isNewUser) {
          this.addNewUser(userInfo)
          this.nextStep()
          return false
        }
        return true
      },
      uiShown: function() {
        (document.getElementById('loader') as HTMLElement).style.display = 'none';
      }
    },
    signInSuccessUrl: '/',
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ],
  };

  icons = {
    mdiEmail,
    mdiLock,
    mdiHelpCircle
  }

  mounted() {
    ui.start('#firebaseui-auth-container', this.uiConfig);
  }

  nextStep() {
    this.$router.push({name: 'Profile'})
  }

  addNewUser(userInfo: any) {
    db.collection("users").doc(userInfo.uid).set({
      uid: userInfo.uid,
      email: userInfo.email,
    })
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
}

.v-menu__content {
  color: white;
  padding: 10px;
  font-size: 14px;
  background: rgba(0,0,0,0.6);
}
</style>