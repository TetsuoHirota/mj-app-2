<template>
  <div class="history pa-5">
    <h2>履歴</h2>

    <template v-if="isLogin">
      <v-col class="pa-0">
        <transition-group name="tr-card">
          <v-card
            v-for="item in items"
            :key="item.date"
            :color="item.parlor ? 'purple darken-1' : 'teal darken-1'"
            class="my-2"
            dark
          >
            <v-card-title class="headline font-weight-medium py-2">
              <v-icon class="mr-2">mdi-account-multiple</v-icon>
              {{ item.date | date }}
            </v-card-title>
            <v-divider></v-divider>
            {{ item.players[0] }}
            {{ getRank(getRanks(item)).rank }}
            {{ getRank(getRanks(item)).average }}
          </v-card>
        </transition-group>
      </v-col>
    </template>
    <template v-else>
      <v-alert type="info" class="ma-5">
        ログインすると機能が使えるようになります。
      </v-alert>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import PersonalData from "@/mixins/personalData";

@Component({
  components: {},
  filters: {
    date(value: string) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year} / ${month} / ${day}`;
    }
  }
})
export default class History extends Mixins(PersonalData) {
  get isLogin() {
    return this.$store.getters["User/user"].isLogin;
  }

  get items() {
    return this.$store.getters["PersonalData/scoreBoards"];
  }

  mounted() {
    if (this.isLogin) this.$store.dispatch("PersonalData/startListener");
  }
}
</script>

<style lang="scss" scoped>
.history {
  height: 100%;
  overflow-y: auto;
}
</style>
