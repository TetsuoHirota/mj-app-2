<template>
  <div class="login">
    <h1>麻雀成績管理 ver.2</h1>
    <img class="image" src="@/assets/imgs/tyun.jpg" alt="tyun" />
    <div class="firebaseui">
      <div id="firebaseui-auth-container"></div>
    </div>
    <v-subheader class="my-9 mx-3"
      >アカウントを作成する場合は、「メールでログイン」を選択後、登録したいアドレスを入力してください。</v-subheader
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import firebase from "firebase/app";
import firebaseui from "firebaseui-ja";
import "firebaseui-ja/dist/firebaseui.css";
import { UserInfo } from "@/models/user";

@Component
export default class Login extends Vue {
  ui =
    firebaseui.auth.AuthUI.getInstance() ||
    new firebaseui.auth.AuthUI(firebase.auth());

  uiConfig: firebaseui.auth.Config = {
    callbacks: {
      signInSuccessWithAuthResult: (authResult: any) => {
        console.debug("success");
        const user = authResult.user;
        const info = authResult.additionalUserInfo;
        const userInfo: UserInfo = {
          uid: user.uid,
          email: user.email,
          mid: "",
          name: "",
        };
        info.isNewUser ? this.signUp(userInfo) : this.login();
        return false;
      },
      uiShown: () => console.debug("uishown"),
    },
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };

  mounted() {
    this.ui.start("#firebaseui-auth-container", this.uiConfig);
  }

  signUp(userInfo: UserInfo) {
    this.$store
      .dispatch("user/signUp", userInfo)
      .then(() => {
        this.$router.push({ name: "home" });
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  login() {
    console.debug("login");
    this.$store
      .dispatch("user/login")
      .then(() => {
        console.debug("logined");
        this.$router.push({ name: "home" });
      })
      .catch((err) => {
        throw new Error(err);
      });
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
}
</style>

<style lang="scss" scoped>
.login {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.image {
  width: 130px;
  margin: 50px 0;
}

.firebaseui {
  align-self: center;
  margin: 0 20px;
}

.v-subheader {
  justify-self: center;
}
</style>
