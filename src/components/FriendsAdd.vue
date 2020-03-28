<template>
<v-dialog
  v-model="dialog"
  persistent
  max-width="370px"
>
<v-card>

  <!-- header -->
  <header class="pa-5">
    <h3 style="color: white">フレンド追加</h3>
  </header>

  <!-- input -->
  <v-row class="ma-0 my-4 px-6 align-center">
    <v-col cols="10" class="pa-0">
      <v-text-field
        v-model="filter"
        @keyup.enter="search"
        dense
        color="#2196F3"
        outlined
        clearable
        hide-details
        placeholder="idもしくは名前を入力"
      >
      </v-text-field>
    </v-col>
    <v-col cols="2" class="pa-0 px-3">
      <v-btn
        icon
        @click="search"
      >
        <v-icon color="blue darken-2">{{icons.mdiMagnify}}</v-icon>
      </v-btn>
    </v-col>
  </v-row>

  <!-- list -->
  <v-list
    class="mx-4 text-center"
    height="230px"
    style="overflow: auto;"
  >
    <!-- loader -->
    <v-progress-circular
      id="loader"
      indeterminate
      color="primary"
      style="display: none"
    ></v-progress-circular>

    <!-- noUser -->
    <v-subheader
      style="display: none"
      id="noUser"
    >
      該当するユーザーが<br>見つかりませんでした。
    </v-subheader>

    <!-- list-item -->
    <v-list-item
      v-for="user in searchedUsers"
      :key="user.uid"
      class="justify-center"
    >
      <v-col align="center">
        <v-avatar size="70">
          <v-icon>{{ icons.mdiAccountCircle }}</v-icon>
        </v-avatar>
        <h3 class="headline font-weight-bold">{{ user.name }}</h3>
        <p style="color: rgba(0,0,0,.5)">{{ user.mid }}</p>
        <v-btn
          @click="addFriend(user)"
          color="blue darken-2"
          dark
          height="30px"
          width="140px"
        >
          追加
        </v-btn>
      </v-col>
    </v-list-item>

  </v-list>

  <!-- button -->
  <v-card-actions>
    <v-spacer></v-spacer>
    <v-btn
      color="blue darken-2"
      text
      @click="close"
    >
    閉じる
    </v-btn>
  </v-card-actions>
</v-card>
</v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { db } from '@/firebase'
import { mdiMagnify, mdiAccountCircle } from '@mdi/js'

@Component({
  components: {}
})
export default class FriendsAdd extends Vue {
  // 表示非表示切り替え
  @Prop() parentShow: any
  get dialog() {
    return this.parentShow
  }
  set dialog(value) {
    this.$emit("dialog", value)
  }

  icons = {
    mdiMagnify,
    mdiAccountCircle
  }
  unsubscribe: any = null //リスナー
  filter = ""
  users: any[] = []
  searchedUsers: any = []

  mounted() {
    this.unsubscribe = db.collection("users").onSnapshot((querySnapShot) => {
      const users: any = []
      querySnapShot.forEach((doc) => {
        users.push(doc.data())
      })
      this.users = users
    })
    this.$store.dispatch("Friends/getFriends")
  }

  destroyed() {
    this.unsubscribe()
  }

  search() {
    const me = this.$store.getters["User/user"]
    const friends = this.$store.getters["Friends/friends"]
    const friendMids = friends.map((friend: any) => {
      return friend.mid
    })
    this.searchedUsers = this.users.filter( user => {
      return (user.mid === this.filter || user.name === this.filter) && //全ユーザーの中に存在
        friendMids.indexOf(user.mid) < 0 &&  //フレンドにいない
        user.mid !== me.mid  //自分ではない
    })
    const loader = (document.getElementById("loader") as HTMLElement)
    const noUser = (document.getElementById("noUser") as HTMLElement)
    if (this.searchedUsers.length > 0) {
      noUser.style.display = 'none'
    } else {
      noUser.style.display = 'none'
      loader.style.display = 'inline-block'
      setTimeout(() => {
        noUser.style.display = 'block'
        loader.style.display = 'none'
      }, 200);
    }
  }

  addFriend(user: any) {
    const userInfo = {
      uid: user.uid,
      mid: user.mid,
      email: user.email,
      name: user.name
    }
    this.$store.dispatch("Friends/addFriend", userInfo)
    this.close()
  }

  close() {
    this.dialog = false
    this.filter = ""
    this.searchedUsers = [];
    (document.getElementById("noUser") as HTMLElement).style.display = 'none'
  }
}
</script>

<style lang="scss" scoped>
header {
  background: #2196F3;
}
</style>