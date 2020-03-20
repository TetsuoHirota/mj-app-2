<template>
<div class="home">

  <!-- メニュー -->
  <v-navigation-drawer
    v-model="drawer"
    disable-resize-watcher
    absolute
  >
    <div class="menu-account indigo darken-4">
      <v-col class="pa-6 white--text">
        <v-row class="mb-3">
          <v-icon dark size="50">{{ accountIcon }}</v-icon>
        </v-row>
        <template v-if="user.isLogin">
          <v-row class="headline my-1">
            {{ user.name }}
          </v-row>
          <v-row class="my-1" style="opacity: .5">
            {{ user.email }}
          </v-row>
          <v-row class="mt-6">
            <v-alert
              class="pa-3 pl-5 white--text"
              border="left"
              color="deep-orange lighten-1"
              width="100%"
            >
              <v-row class="mb-2">
                <v-icon dark>{{ icons.mdiCardAccountDetails }}</v-icon><span class="mx-2">ID</span>
              </v-row>
              <v-row>
                {{ user.mid }}
              </v-row>
            </v-alert>
          </v-row>
        </template>
        <template v-if="!user.isLogin">
          <v-row class="white--text headline">
            ユーザー情報なし
          </v-row>
          <v-row class="overline" style="opacity: .5">
            ログインするとすべての機能が使えます。アカウント作成は「ログイン」から行ってください。
          </v-row>
        </template>
      </v-col>
    </div>

    <v-list dense flat>
      <v-list-item-group>

        <v-list-item @click="toHome">
          <v-list-item-action>
            <v-icon>{{ icons.mdiHome }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>ホーム</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          :disabled="!user.isLogin"
          @click="profileDialog = true"
        >
          <v-list-item-action>
            <v-icon>{{ icons.mdiAccountCog }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>名前変更</v-list-item-title>
          </v-list-item-content>
          <v-dialog
            v-model="profileDialog"
            max-width="290px"
          >
            <Profile @close="profileDialog = false" />
          </v-dialog>
        </v-list-item>

        <v-list-item
          :disabled="!user.isLogin"
          @click="toFriends"
        >
          <v-list-item-action>
            <v-icon>{{ icons.mdiAccountGroup }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>フレンド</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="user.isLogin === true"
          @click="logout"
        >
          <v-list-item-action>
            <v-icon>{{ icons.mdiLogoutVariant }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>ログアウト</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          v-if="user.isLogin === false"
          @click="login"
        >
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
    <v-btn
      icon
      v-if="user.isLogin === false"
      @click="login"
    >
      <v-icon>{{ icons.mdiLoginVariant }}</v-icon>
    </v-btn>
  </v-app-bar>

  <router-view/>
  
</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Data from '@/components/Data.vue'
import Free from '@/components/Free.vue'
import History from '@/components/History.vue'
import Rules from '@/components/Rules.vue'
import Profile from '@/components/Home/Profile.vue'
import {
  mdiAccountCircle,
  mdiAccountAlert,
  mdiCardAccountDetails,
  mdiHome,
  mdiAccountCog,
  mdiAccountGroup,
  mdiLogoutVariant,
  mdiLoginVariant,
} from '@mdi/js';

@Component({
  components: {
    Data,
    Free,
    History,
    Rules,
    Profile
  }
})
export default class Home extends Vue {
  icons = {
    mdiLogoutVariant,
    mdiLoginVariant,
    mdiAccountGroup,
    mdiAccountCog,
    mdiCardAccountDetails,
    mdiHome
  }

  get accountIcon() {
    if (this.user.isLogin === true) {
      return mdiAccountCircle
    } else {
      return mdiAccountAlert
    }
  }

  drawer = false
  profileDialog = false

  get user() {
    return this.$store.getters['User/user']
  }

  login() {
    this.$router.push({name: 'Login'})
  }

  logout() {
    const result = confirm("本当にログアウトしますか？")
    if (result) {
      this.$store.dispatch("User/logout")
      if (this.$route.name !== 'Home') {
        this.$router.push({name: 'Home'})
      }
    }
  }

  toHome() {
    if (this.$route.name !== 'Home') {
      this.$router.push({name: 'Home'})
    }
    this.drawer = false
  }

  toProfile() {
    this.$router.push({name: 'Profile'})
  }

  toFriends() {
    if (this.$route.name !== 'Friends') {
      this.$router.push({name: 'Friends'})
    }
    this.drawer = false
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
}

.row {
  margin: 0;
}

.v-list-item {
  &__action {
    margin-right: 25px !important;
  }
  &__title {
    display: flex;
    align-items: center;
  }
  .v-icon {
    position: relative;
    top: -1px;
  }
}
</style>