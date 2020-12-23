<template>
  <div class="scoreboards pa-5">
    <v-col class="pa-0">
      <transition-group name="tr-card">
        <v-card
          v-for="scoreBoard in scoreBoards"
          :key="scoreBoard.id"
          :color="'teal darken-1'"
          class="my-2"
          dark
        >
          <!-- <v-card-title class="headline font-weight-medium py-2">
            <v-icon class="mr-2">mdi-account-multiple</v-icon>
            {{ item.date | date }}
          </v-card-title>
          <v-divider></v-divider>
          {{ item.players[0] }}
          {{ getRank(getRanks(item)).rank }}
          {{ getRank(getRanks(item)).average }} -->
        </v-card>
      </transition-group>
    </v-col>
    <v-fab-transition>
      <v-btn
        class="add-button"
        v-show="showAddButton"
        color="pink"
        dark
        fab
        large
        absolute
        @click="openAddRule"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="showRuleAddModal" max-width="600px">
      <RuleAddCard @request-close="showRuleAddModal = false"></RuleAddCard>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ScoreBoard } from "@/models/scoreBoard";
import RuleAddCard from "@/components/shared/RuleAddCard.vue";

@Component({
  components: {
    RuleAddCard,
  },
})
export default class ScoreBoards extends Vue {
  showAddButton = false;
  showRuleAddModal = false;

  get scoreBoards(): ScoreBoard[] {
    return this.$store.getters["scoreBoard/scoreBoards"];
  }

  created() {
    this.$store.dispatch("scoreBoard/startScoreBoardsListener");
  }

  mounted() {
    setTimeout(() => {
      this.showAddButton = true;
    }, 100);
  }

  openAddRule() {
    this.showRuleAddModal = true;
  }
}
</script>

<style lang="scss" scoped>
.scoreboards {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.add-button {
  bottom: 25px;
  right: 25px;
}
</style>
