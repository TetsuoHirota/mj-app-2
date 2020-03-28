<template>
<div class="friends pa-4">
  <h2 class="headline grey--text">フレンド</h2>
  <v-subheader>フレンド一覧</v-subheader>
  <v-list
    style="overflow-y: auto"
    class="divider px-3"
  >
    <v-list-item
      v-for="friend in friends"
      :key="friend.mid"
    >
      <v-list-item-avatar>
        <v-icon>{{ icons.mdiAccount }}</v-icon>
      </v-list-item-avatar>
      <v-list-item-content class="ma-0 pa-0">
        <v-list-item-title v-text="friend.name"></v-list-item-title>
        <v-list-item-subtitle v-text="'ID: ' + friend.mid"></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
  <v-row
    justify="center"
    align="center"
  >
    <v-btn
      dark
      color="deep-purple accent-4"
      height="45px"
      @click="showFriendsAdd = true"
    >
      <v-icon class="mr-3">{{ icons.mdiAccountPlus }}</v-icon>
      フレンド追加
    </v-btn>
    
    <FriendsAdd @dialog="changeShowFriendsAdd" :parentShow="showFriendsAdd"/>
  </v-row>

</div>  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mdiAccount, mdiAccountPlus } from '@mdi/js'

import FriendsAdd from '@/components/FriendsAdd.vue'

@Component({
  components: {
    FriendsAdd
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

  changeShowFriendsAdd(value: any) {
    this.showFriendsAdd = value
  }

}
</script>

<style lang="scss" scoped>
.friends {
  display: grid;
  grid-template-rows: auto auto 1fr 100px;
}

.divider {
  >div {
    border-bottom: 1px solid rgba(0,0,0,.12);
    &:first-of-type {
      border-top: 1px solid rgba(0,0,0,.12);
    }
  }
}

</style>