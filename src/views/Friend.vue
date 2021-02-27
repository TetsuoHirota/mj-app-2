<template>
  <div class="friend">
    <AppBar is-back-active title="フレンド追加"></AppBar>
    <div class="px-5">
      <v-subheader class="px-0 my-2">
        検索にはフレンドのIDが必要です。
      </v-subheader>
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
      <div v-if="user" class="user my-10">
        <v-avatar class="mb-3" color="grey" size="80">
          <v-icon dark size="60">mdi-account</v-icon>
        </v-avatar>
        <div class="mb-3 font-weight-bold">{{ user ? user.name : "" }}</div>
        <template
          v-if="me.friendIds && user && me.friendIds.includes(user.uid)"
        >
          <div>このユーザーは既にフレンドです</div>
        </template>
        <template v-else>
          <v-btn color="primary" width="120" @click="addFriend()">追加</v-btn>
        </template>
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

  get me(): UserInfo {
    return this.$store.getters["user/user"];
  }

  search() {
    this.$store
      .dispatch("friends/search", this.mid)
      .then(result => {
        this.user = result;
      })
      .catch(err => {
        this._error(err);
      });
  }

  addFriend() {
    if (!this.user) {
      this._error("選択されたユーザーがいません");
      return;
    }
    this.$store
      .dispatch("friends/add", this.user.uid)
      .then(() => {
        this._success("フレンドを追加しました");
        this.$router.go(-1);
        this.$store.dispatch("user/get").then(() => {
          this.$store.dispatch("friends/get");
        });
      })
      .catch(err => {
        this._error(err);
      });
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

.user {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
