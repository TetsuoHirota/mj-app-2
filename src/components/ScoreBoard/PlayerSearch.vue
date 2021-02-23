<template>
  <v-dialog v-model="show" max-width="380px">
    <v-card>
      <v-card-title>
        <h3 class="display-1 font-weight-medium grey--text">プレイヤー選択</h3>
      </v-card-title>

      <v-card-text>
        <v-subheader>フレンドから選ぶ</v-subheader>
        <v-alert v-if="!friends.length" type="info">
          フレンドがいません
        </v-alert>
        <v-list
          v-if="friends.length"
          max-height="400px"
          class="friend-list px-2"
        >
          <v-list-item
            v-for="friend in friends"
            :key="friend.uid"
            @click="selectFriend(friend)"
          >
            <v-list-item-avatar>
              <v-icon>{{ icons.mdiAccount }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="ma-0 pa-0">
              <v-list-item-title
                class="font-weight-medium"
                v-text="friend.name"
              ></v-list-item-title>
              <v-list-item-subtitle
                v-text="'ID: ' + friend.mid"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider class="mt-8"></v-divider>
        <v-subheader>プレイヤー名入力</v-subheader>
        <v-row align="center" style="flex-wrap: nowrap">
          <v-form ref="form">
            <v-text-field
              v-model="name"
              type="text"
              :rules="rule"
              :prepend-icon="icons.mdiAccount"
              label="名前"
              class="mx-3"
              @keyup.enter="saveNewName"
            ></v-text-field>
          </v-form>
          <v-btn color="primary" @click="saveNewName"> 決定 </v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Mixins, Watch } from "vue-property-decorator";
import Utilities from "@/mixins/utilities";

@Component({
  components: {}
})
export default class PlayerSearch extends Mixins(Utilities) {
  show = false;
  state = 1;

  // props
  isNewPlayer = false;
  index = -1;

  name = "";
  rule = [
    (v: string) => !!v || "名前を入力してください",
    (v: string) => (v && this.getLength(v) < 11) || "長すぎます"
  ];

  get friends() {
    const friends = this.$store.getters["Friends/friends"];
    const me = this.$store.getters["User/user"];
    if (me.isLogin) friends.push(me);
    return friends.filter((e: any) => this.playerUids.indexOf(e.uid) == -1);
  }

  get players() {
    return this.$store.getters["ScoreBoard/players"];
  }

  get playerUids() {
    return this.players.map((player: any) => player.uid);
  }

  open(isNewPlayer: boolean, index: number) {
    this.isNewPlayer = isNewPlayer;
    this.index = index;
    this.show = true;
  }

  @Watch("show")
  close() {
    if (this.show == false) (this.$refs.form as HTMLFormElement).reset();
  }

  selectFriend(friend: any) {
    const player = {
      uid: friend.uid,
      name: friend.name,
      isLinked: true
    };
    this.save(player);
  }

  saveNewName() {
    if ((this.$refs.form as HTMLFormElement).validate()) {
      if (this.playerUids.indexOf(this.name) !== -1)
        alert("その名前は使えません");
      else {
        const player = {
          uid: this.name,
          name: this.name,
          isLinked: false
        };
        this.save(player);
      }
    }
  }

  save(player: any) {
    // プレイヤー追加
    if (this.isNewPlayer) {
      this.$store.dispatch("ScoreBoard/addPlayer", player);

      // プレイヤー変更
    } else {
      this.$store.dispatch("ScoreBoard/changePlayer", {
        player: player,
        index: this.index
      });
    }
    this.show = false;
  }
}
</script>

<style lang="scss" scoped>
.friend-list {
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 0 3px 1px teal inset;
  .v-list-item {
    &:not(:last-of-type) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
