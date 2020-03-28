<template>
<div class="login">

  <v-app-bar
    color="indigo"
    dark
  >
    <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
  </v-app-bar>

  <v-row
    class="ma-0"
    align="center"
    justify="center"
    style="position: relative"
  >

    <!-- help -->
    <v-row
      justify="end"
      class="ma-5"
      style="position: absolute; top: 0; right: 0;"
    >
      <v-menu
        offset-x
        offset-y
      >
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon large>{{ icons.mdiHelpCircle }}</v-icon>
          </v-btn>
        </template>
        <span>アカウントを作成する場合は、「メールでログイン」を選択後、登録したいアドレスを入力してください。</span>
      </v-menu>
    </v-row>

    <v-col align="center" class="pa-9">
      <!-- firebaseui -->
      <div id="firebaseui-auth-container"></div>

      <!-- loader -->
      <v-progress-circular
        id="loader"
        indeterminate
        color="primary"
      ></v-progress-circular>
    </v-col>
    

  </v-row>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as firebase from 'firebase/app'
import * as firebaseui from 'firebaseui-ja'
import { ui } from '@/firebase'
import 'firebaseui-ja/dist/firebaseui.css'
import { mdiHelpCircle } from '@mdi/js'

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
        if (!userInfo.isNewUser) {         //既存ユーザー
          this.login(userInfo)
          return false
        } else if (userInfo.isAnonymous) { //anonymous
          return true
        } else {                           //新規ユーザー  
          this.signup(userInfo)
          this.nextStep()
          return false
        }
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
    mdiHelpCircle
  }

  mounted() {
    ui.start('#firebaseui-auth-container', this.uiConfig);
  }

  nextStep() {
    this.$router.push({name: 'Profile'})
  }

  signup(userInfo: any) {
    this.$store.dispatch("User/signup", userInfo)
  }

  async login(userInfo: any) {
    await this.$store.dispatch("User/login", userInfo)
    this.$router.push('/')
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

.firebaseui-idp-list {
  padding-left: 0 !important;
}
</style>