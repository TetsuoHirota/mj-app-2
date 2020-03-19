<template>
<div class="home">
  <!-- メニュー -->
  <v-navigation-drawer
    v-model="drawer"
    disable-resize-watcher
    absolute
  >
    <div
      class="menu-account indigo darken-4"
    >
      <v-col class="pa-6 white--text">
        <v-row class="font mb-3">
          <v-icon dark size="50">{{ accountIcon }}</v-icon>
        </v-row>
        <template v-if="user.isLogin === true">
          <v-row class="white--text headline">
            {{ user.name }}
          </v-row>
          <v-row class="" style="opacity: .5">
            {{ user.mailAddress }}
          </v-row>
        </template>
        <template v-if="user.isLogin === false">
          <v-row class="white--text headline">
            ユーザー情報なし
          </v-row>
          <v-row class="overline" style="opacity: .5">
            ログインするとすべての機能が使えます
          </v-row>
          <v-row class="justify-center mt-5">
            <v-btn color="primary">
              新規アカウント作製
            </v-btn>
          </v-row>
        </template>
      </v-col>
    </div>

    <v-list dense flat>
      <v-list-item-group>

        <v-list-item v-if="user.isLogin === true" @click="signOut">
          <v-list-item-action>
            <v-icon>{{ icons.mdiAccountCog }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>プロフィール変更</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.isLogin === true" @click="signOut">
          <v-list-item-action>
            <v-icon>{{ icons.mdiAccountGroup }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>フレンド</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.isLogin === true" @click="logout">
          <v-list-item-action>
            <v-icon>{{ icons.mdiLogoutVariant }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.isLogin === false" @click="login">
          <v-list-item-action>
            <v-icon>{{ icons.mdiLoginVariant }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>ログイン</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
  
  <!-- ナビゲーション -->
  <v-app-bar
    color="indigo"
    dark
  >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon v-if="friendRequest === true" class="friendRequest">
      <v-badge dot color="red">
        <v-icon>{{ icons.mdiAccountPlus }}</v-icon>
      </v-badge>
    </v-btn>
    <v-btn icon v-if="user.isLogin === false" @click="login">
      <v-icon>{{ icons.mdiLoginVariant }}</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- カルーセル -->
  <v-carousel
    v-model="nav"
    :continuous="false"
    :hide-delimiters="true"
    :show-arrows="false"
    height="100%"
  >
  {{user}}
    <!-- <v-carousel-item>
      <Rules/>
    </v-carousel-item>
    <v-carousel-item>
      <Free/>
    </v-carousel-item>
    <v-carousel-item>
      <History/>
    </v-carousel-item>
    <v-carousel-item>
      <Data/>
    </v-carousel-item> -->
  </v-carousel>
  
  <!-- ナビゲーション -->
  <v-bottom-navigation
    v-model="nav"
    grow
    color="indigo"
  >
    <v-btn>
      <span>ScoreBoard</span>
      <v-icon>{{ icons.mdiPencil }}</v-icon>
    </v-btn>
    <v-btn>
      <span>Free</span>
      <v-icon>{{ icons.mdiStore }}</v-icon>
    </v-btn>
    <v-btn>
      <span>History</span>
      <v-icon>{{ icons.mdiHistory }}</v-icon>
    </v-btn>
    <v-btn>
      <span>Data</span>
      <v-icon>{{ icons.mdiChartBar }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { auth } from '@/firebase'
import Data from '../components/Data.vue'
import Free from '../components/Free.vue'
import History from '../components/History.vue'
import Rules from '../components/Rules.vue'
import {
  mdiLogoutVariant,
  mdiLoginVariant,
  mdiAccountCircle,
  mdiAccountAlert,
  mdiAccountGroup,
  mdiAccountPlus,
  mdiAccountCog,
  mdiPencil,
  mdiStore,
  mdiHistory,
  mdiChartBar
} from '@mdi/js';

@Component({
  components: {
    Data,
    Free,
    History,
    Rules,
  }
})
export default class Home extends Vue {
  icons = {
    mdiLogoutVariant,
    mdiLoginVariant,
    mdiAccountGroup,
    mdiAccountCog,
    mdiAccountPlus,
    mdiPencil,
    mdiStore,
    mdiHistory,
    mdiChartBar
  }

  get accountIcon() {
    if (this.user.isLogin === true) {
      return mdiAccountCircle
    } else {
      return mdiAccountAlert
    }
  }

  drawer = false;
  nav = 0;
  friendRequest = false;

  @Watch('nav')
  changeNav() {
    this.$store.dispatch('Display/changeHomeNav', this.nav)
  }

  get user() {
    return this.$store.getters['User/user']
  }

  created() {
    this.nav = this.$store.getters['Display/homeNav'];
  }

  login() {
    this.$router.push({name: 'Login'})
  }

  logout() {
    const result = confirm("本当にログアウトしますか？")
    if (result) {
      this.$store.dispatch("User/logout")
      this.$router.push({name: 'Home'})
    }
  }

  signOut() {
    this.$router.push({name: 'Login'})
    // const result = confirm("本当にログアウトしますか？")
    // if (result) {
    //   this.$store.dispatch('User/signOut').then(() => {
    //     this.$router.push('/login');
    //   })
    // }
  }

  clear() {
    const result = confirm("リセットします。データは消えません。")
    if (result) {
      this.$store.dispatch('User/signOut').then(() => {
        this.$router.push('/login');
        localStorage.clear();
        location.reload();
      })
    }
  }


}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr max-content;
}

@keyframes grow {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.2);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.2);
  }
  70% {
    transform: scale(1);
  }
}

.friendRequest {
  animation: grow 2000ms ease infinite
}

.v-btn:hover:before,
.v-btn:hover::before,
.v-btn:focus-within:before,
.v-btn:focus:before,
.v-btn:focus::before{
  opacity: 0 !important;
}

</style>