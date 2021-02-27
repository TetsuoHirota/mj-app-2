<template>
  <div class="friend">
    <AppBar is-back-active title="フレンド追加"></AppBar>
    <div class="px-5">
      <v-subheader class="px-0">検索にはフレンドのIDが必要です。</v-subheader>
      <v-row class="flex-grow-0" no-gutters>
        <v-text-field
          v-model="mid"
          outlined
          clearable
          hide-details
          placeholder="idを入力してください"
          append-icon="mdi-magnify"
          @change="search()"
        ></v-text-field>
      </v-row>
      <div>
        <v-avatar color="grey" size="80">
          <v-icon dark size="60">mdi-account</v-icon>
        </v-avatar>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import AppBar from "@/components/shared/AppBar.vue";
import { UserInfo } from "@/models/user";

@Component({
  components: {
    AppBar
  }
})
export default class Friend extends BaseComponent {
  mid = "";
  user: UserInfo | null = null;

  search() {
    console.debug("d");
    this.$store
      .dispatch("friends/search", this.mid)
      .then(result => {
        this.user = result;
      })
      .catch(e => console.debug(e));

    // const me = this.$store.getters["User/user"];
    // const friends = this.$store.getters["Friends/friends"];
    // const friendMids = friends.map((friend: any) => {
    //   return friend.mid;
    // });

    // // 不適切ユーザーの除外
    // this.searchedUsers = this.users.filter(user => {
    //   return (
    //     (user.mid === this.filter || user.name === this.filter) && //全ユーザーの中に存在
    //     friendMids.indexOf(user.mid) < 0 && //フレンドにいない
    //     user.mid !== me.mid
    //   ); //自分ではない
    // });

    // const loader = document.getElementById("loader") as HTMLElement;
    // const noUser = document.getElementById("noUser") as HTMLElement;

    // // ローダー、該当なしの表示切り替え
    // if (this.searchedUsers.length > 0) {
    //   noUser.style.display = "none";
    // } else {
    //   noUser.style.display = "none";
    //   loader.style.display = "inline-block";
    //   setTimeout(() => {
    //     noUser.style.display = "block";
    //     loader.style.display = "none";
    //   }, 200);
    // }
  }

  addFriend(user: any) {
    // const userInfo = {
    //   mid: user.mid,
    //   mid: user.mid,
    //   email: user.email,
    //   name: user.name
    // };
    // this.$store.dispatch("Friends/addFriend", userInfo);
  }
}
</script>

<style lang="scss" scoped>
.friend {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
