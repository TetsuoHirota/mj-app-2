<template>
<div class="login">

  <h1 class="ml-5">ログイン</h1>

  <!-- firebaseui -->
  <div class="firebaseui">
    <div id="firebaseui-auth-container"></div>
  </div>

  <v-subheader class="my-9 mx-3">アカウントを作成する場合は、「メールでログイン」を選択後、登録したいアドレスを入力してください。</v-subheader>
    
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import firebase from 'firebase/app';
import firebaseui from 'firebaseui-ja';
import 'firebaseui-ja/dist/firebaseui.css';
import { UserInfo } from '@/models/user';

import { mdiHelpCircle } from '@mdi/js'

@Component
export default class Login extends Vue {

  ui = new firebaseui.auth.AuthUI(firebase.auth());

  uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult: any) => {
        const user = authResult.user
        const info = authResult.additionalUserInfo
        const userInfo: UserInfo = {
          uid: user.uid,
          email: user.email,
          mid: '',
          name: '',
        }
        info.isNewUser ? this.signUp(userInfo) : this.login();
        return false;
      },
      uiShown: function() {
        // (document.getElementById('loader') as HTMLElement).style.display = 'none';
      }
    },
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };

  icons = {
    mdiHelpCircle
  }

  mounted() {
    this.ui.start('#firebaseui-auth-container', this.uiConfig);
  }

  signUp(userInfo: UserInfo) {
    this.$store.dispatch('user/signUp', userInfo)
      .then(() => {
        this.$router.push({ name: 'home'});
      })
      .catch(err => {
        throw new Error(err);
      })
  }

  login() {
    this.$store.dispatch("user/login")
      .then(() => {
        this.$router.push({ name: 'home'})
      })
      .catch(err => {
        throw new Error(err);
      })
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
  margin: 0 20px;
}

.v-subheader {
  justify-self: center;
}
</style>
