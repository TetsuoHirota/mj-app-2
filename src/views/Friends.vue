<template>
<div class="friends pa-4">

  <h2>フレンド</h2>

  <v-subheader>フレンド一覧</v-subheader>

  <v-list
    class="px-3"
    max-width="500px"
    flat
  >
    <v-divider></v-divider>
    <transition-group name="tr-list">
      <div
        v-for="friend in friends"
        :key="friend.mid"
      >
        <v-list-item @click="openFriendDelete(friend)">
          <v-list-item-avatar>
            <v-icon>{{ icons.mdiAccount }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content class="ma-0 pa-0">
            <v-list-item-title v-text="friend.name" class="font-weight-medium"></v-list-item-title>
            <v-list-item-subtitle v-text="'ID: ' + friend.mid"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </div>
    </transition-group>
  </v-list>

  <v-row
    justify="center"
    align="center"
  >
    <v-btn
      dark
      color="deep-purple accent-4"
      height="45px"
      @click="openFriendAdd"
    >
      <v-icon class="mr-3">{{ icons.mdiAccountPlus }}</v-icon>
      フレンド追加
    </v-btn>
    
    <FriendAdd ref="friendAdd"/>
    <FriendDelete ref="friendDelete"/>
  </v-row>

</div>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mdiAccount, mdiAccountPlus } from '@mdi/js'

import FriendAdd from '@/components/Friends/FriendAdd.vue'
import FriendDelete from '@/components/Friends/FriendDelete.vue'

@Component({
  components: {
    FriendAdd,
    FriendDelete
  }
})
export default class Friends extends Vue {
  icons = {
    mdiAccount,
    mdiAccountPlus
  }
  showFriendsAdd = false

  get friends() {
    return this.$store.getters["Friends/friends"]
  }

  openFriendAdd() {
    (this.$refs as any).friendAdd.open()
  }

  openFriendDelete(friend: any) {
    (this.$refs as any).friendDelete.open(friend)
  }

}
</script>

<style lang="scss" scoped>
.friends {
  height: 100%;
  display: grid;
  grid-template-rows: auto auto 1fr 100px;
}

.v-list {
  width: 100%;
  overflow-y: auto;
  justify-self: center;
  .v-list-item {
    &:hover {
      background: rgba(0,0,0,.05);
    }
  }
}
</style>