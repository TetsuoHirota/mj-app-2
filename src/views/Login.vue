<template>
<div class="login">

  <v-app-bar
    color="indigo"
    dark
  >
    <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
  </v-app-bar>

  <h1>ログイン</h1>

  <!-- firebaseui -->
  <div class="firebaseui">
    <div id="firebaseui-auth-container"></div>
    <v-progress-circular
      id="loader"
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>

  <v-subheader class="my-9 mx-3">アカウントを作成する場合は、「メールでログイン」を選択後、登録したいアドレスを入力してください。</v-subheader>
    
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
        if (userInfo.isAnonymous) {         //anonymous
          return true
        } else if (!userInfo.isNewUser) {   //既存ユーザー
          this.login(userInfo)
          return false
        } else {                            //新規ユーザー  
          this.signup(userInfo)
          return true
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

  signup(userInfo: any) {
    this.$store.dispatch("User/signup", userInfo)
  }

  async login(userInfo: any) {
    await this.$store.dispatch("User/login", userInfo)
    this.$router.push('/')
  }
}
</script>

<style lang="scss">
.firebaseui {
  align-self: center;
  ul {
    list-style: none;
    padding: 0 !important;
  }
  button {
    transform: scale(1.1);
    @include tab {
      transform: scale(1);
    }
  }
}
</style>
<style lang="scss" scoped>
.login {
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr auto;

}

.firebaseui {
  align-self: center;
  margin: 0 auto;
  padding: 0 20px;
}

.v-subheader {
  justify-self: center;
}
</style>