<template>
<v-dialog
  v-model="show"
  max-width="220px"
>
  <v-card class="pa-3">
    <v-col align="center" class="indigo--text">
      <h3>{{ friend.name }}</h3>
      <h4>ID : {{ friend.mid }}</h4>
      <v-btn
        color="error"
        class="mt-5"
        @click="deleteFriend"
      >
        削除
      </v-btn>
    </v-col>
  </v-card>
</v-dialog>
  
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class FriendDelete extends Vue {
  show = false
  friend = {}

  open (friend: any) {
    this.friend = friend;
    this.show = true;
  }

  deleteFriend () {
    this.$store.dispatch("Friends/deleteFriend", this.friend)
    this.show = false;
  }
}
</script>

<style lang="scss" scoped>

</style>