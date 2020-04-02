<template>
<div class="home">

  <!-- ドロワー -->
  <v-navigation-drawer
    v-model="drawer"
    disable-resize-watcher
    app
  >
    <!-- ヘッダー -->
    <v-col class="pa-6">
      <v-row class="mb-3">
        <v-icon size="50">{{ accountIcon }}</v-icon>
      </v-row>

      <!-- ログイン中 -->
      <template v-if="user.isLogin">
        <h2 style="color: rgba(0,0,0,.87);">{{ user.name }}</h2>
        <h4 style="opacity: .6">{{ user.email }}</h4>
        <v-alert
          class="ma-0 mt-5 pa-3 pl-5 white--text"
          border="left"
          color="blue darken-1"
        >
          <v-row class="mb-2">
            <v-icon dark>{{ icons.mdiCardAccountDetails }}</v-icon><span class="mx-2">ID :</span>
          </v-row>
          <v-row>{{ user.mid }}</v-row>
        </v-alert>
      </template>

      <!-- ログアウト中 -->
      <template v-if="!user.isLogin">
        <v-alert type="info">ユーザー情報なし</v-alert>
        <p class="body-2 ma-0 mt-2" style="opacity: .5">
          ログインするとすべての機能が使えます。アカウント作成は「ログイン」から行ってください。
        </p>
      </template>
    </v-col>

    <v-divider></v-divider>

    <!-- メニューリスト -->
    <v-list dense flat>

      <v-list-item
        :to="{ name: 'Home' }"
        @click="drawer = false"
      >
        <v-icon>{{ icons.mdiHome }}</v-icon>
        <div class="list-title">ホーム</div>
      </v-list-item>

      <v-list-item
        :disabled="!user.isLogin"
        @click="profileDialog = true"
      >
        <v-icon>{{ icons.mdiAccountCog }}</v-icon>
        <div class="list-title">名前変更</div>
        <v-dialog
          v-model="profileDialog"
          max-width="290px"
          persistent
        >
          <Profile @close="profileDialog = false" />
        </v-dialog>
      </v-list-item>

      <v-list-item
        :disabled="!user.isLogin"
        :to="{ name: 'Friends' }"
        @click="drawer = false"
      >
        <v-icon>{{ icons.mdiAccountGroup }}</v-icon>
        <div class="list-title">フレンド</div>
      </v-list-item>

      <v-list-item
        v-if="user.isLogin"
        @click="logout"
      >
        <v-icon>{{ icons.mdiLogoutVariant }}</v-icon>
        <div class="list-title">ログアウト</div>
      </v-list-item>

      <v-list-item
        v-if="!user.isLogin"
        @click="login"
      >
        <v-icon>{{ icons.mdiLoginVariant }}</v-icon>
        <div class="list-title">ログイン</div>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
  
  <!-- アプリバー -->
  <v-app-bar
    app
    color="indigo"
    dark
  >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title class="pl-2">麻雀成績管理</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      icon
      v-if="!user.isLogin"
      @click="login"
    >
      <v-icon>{{ icons.mdiLoginVariant }}</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- ボディ -->
  <v-content style="height: 100%">
    <v-container
      fluid
      class="pa-0"
      style="height: 100%"
    >
      <router-view/>
    </v-container>
  </v-content>
  
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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

  // 表示関係
  drawer = false
  profileDialog = false

  get accountIcon() {
    if (this.user.isLogin) {
      return mdiAccountCircle
    } else {
      return mdiAccountAlert
    }
  }

  get user() {
    return this.$store.getters['User/user']
  }

  login() {
    localStorage.clear()
    this.$router.push({ name: 'Login' })
  }

  logout() {
    const result = confirm("本当にログアウトしますか？")
    if (result) {
      this.$store.dispatch("User/logout")
      if (this.$route.name !== 'Home') {
        this.$router.push({name: 'Home'})
        location.reload()
      } else {
        location.reload()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>

<style lang="scss">
.home {
  .v-list-item {
    height: 48px;
    .v-icon {
      position: relative;
      top: -1px;
    }
    .list-title {
      margin-left: 30px;
    }
    &--active {
      .v-icon {
        color: rgba(0, 0, 0, 0.54) !important;
      }
    }
    &:hover {
      background: rgba(0,0,0,.05);
      @include sp {
        background: none;
      }
    }
  }
}

</style>