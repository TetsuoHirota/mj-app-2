<template>
  <div class="friends">
    <v-subheader>自分</v-subheader>
    <template v-if="skeleton">
      <v-skeleton-loader
        type="list-item-avatar-two-line"
        tile
      ></v-skeleton-loader>
    </template>
    <template v-else>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-avatar color="grey">
            <v-icon dark>mdi-account</v-icon>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ me.name }}</v-list-item-title>
          <v-list-item-subtitle>@{{ me.mid }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <v-subheader>フレンド - {{ friends.length }}</v-subheader>
    <template v-if="skeleton">
      <v-skeleton-loader
        type="list-item-avatar-two-line"
        tile
      ></v-skeleton-loader>
    </template>
    <template v-else>
      <transition-group name="tr-list">
        <v-list-item
          v-for="friend in friends"
          :key="friend.uid"
          @click="onFriendClick(friend)"
        >
          <v-list-item-avatar>
            <v-avatar color="grey">
              <v-icon dark>mdi-account</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ friend.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </transition-group>
      <v-navigation-drawer
        v-model="showDrawer"
        height="auto"
        absolute
        bottom
        class="px-3 py-5"
        floating
      >
        <v-list-item>
          <v-list-item-avatar size="60">
            <v-avatar color="grey" size="60">
              <v-icon dark x-large>mdi-account</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ selectedFriend ? selectedFriend.name : "" }}
            </v-list-item-title>
            <v-list-item-subtitle>
              @{{ selectedFriend ? selectedFriend.mid : "" }}
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon color="error" @click="onDeleteFriendClick()">
              <v-icon>mdi-account-remove</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-navigation-drawer>
    </template>
    <v-fab-transition>
      <v-btn
        v-show="showAddButton"
        class="o-button-add"
        color="pink"
        fab
        large
        dark
        @click="onAddFriendClick()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { UserInfo } from "@/models/user";

@Component({
  components: {}
})
export default class Friends extends Vue {
  skeleton = true;
  showFriendsAdd = false;
  showAddButton = false;
  showDrawer = false;
  selectedFriend: UserInfo | null = null;

  get me(): UserInfo {
    return this.$store.getters["user/user"];
  }

  get friends(): UserInfo[] {
    return this.$store.getters["friends/friends"];
  }

  created() {
    this.$store
      .dispatch("friends/getFriends")
      .then(() => {
        this.skeleton = false;
      })
      .catch(err => {
        this.$store.dispatch("app/error", err);
        this.skeleton = false;
      });
  }

  mounted() {
    setTimeout(() => {
      this.showAddButton = true;
    }, 100);
  }

  @Watch("showDrawer")
  onShowDrawerChange() {
    if (!this.showDrawer) {
      this.selectedFriend = null;
    }
  }

  onFriendClick(friend: UserInfo) {
    this.showDrawer = true;
    this.selectedFriend = friend;
  }

  onAddFriendClick() {
    this.$router.push({ name: "friend" });
  }

  onDeleteFriendClick() {
    if (!this.selectedFriend) {
      this.$store.dispatch("app/error", "エラーが発生しました");
      return;
    }
    this.$store
      .dispatch("friends/deleteFriend", this.selectedFriend.uid)
      .catch(err => {
        this.$store.dispatch("app/error", err);
      });
  }
}
</script>

<style lang="scss" scoped>
.friends {
  height: 100%;
  overflow-y: auto;
}

.v-navigation-drawer {
  border-radius: 20px 20px 0 0;
  border-image-width: 0;
  box-shadow: none;
}

// .v-list {
//   justify-self: center;
//   width: 100%;
//   overflow-y: auto;
//   .v-list-item {
//     &:hover {
//       background: rgba(0, 0, 0, 0.05);
//     }
//   }
// }
</style>
