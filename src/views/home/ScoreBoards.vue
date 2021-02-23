<template>
  <div class="scoreboards">
    <v-col class="pa-5 list">
      <transition-group name="tr-card">
        <v-card
          v-for="scoreBoard in scoreBoards"
          :key="scoreBoard.id"
          :color="'teal darken-1'"
          class="my-2"
          dark
        >
          <v-card-title class="headline font-weight-medium py-2">
            <v-icon class="mr-2">mdi-text-box-outline</v-icon>
            <span>{{ scoreBoard.createdAt.getFullYear() }}</span>
            <span>/</span>
            <span>{{ scoreBoard.createdAt.getMonth() + 1 }}</span>
            <span>/</span>
            <span>{{ scoreBoard.createdAt.getDate() }}</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-0">
            <v-col>
              <v-row class="cardinfo">
                <div class="cardinfo__title">メンバー :</div>
                <div class="cardinfo__text">
                  <span
                    v-for="(player, index) in scoreBoard.players"
                    :key="index"
                    class="ml-1"
                  >
                    {{ player.name }}
                  </span>
                </div>
              </v-row>
              <v-row class="cardinfo">
                <div class="cardinfo__title">平均順位</div>
                <div class="cardinfo__text">
                  {{ getRankAvarage(scoreBoard) }}
                </div>
              </v-row>
            </v-col>
          </v-card-text>
          <!-- {{ getRank(getRanks(item)).rank }}
          {{ getRank(getRanks(item)).average }} -->
        </v-card>
      </transition-group>
    </v-col>
    <v-fab-transition>
      <v-btn
        v-show="showAddButton"
        class="add-button"
        color="pink"
        dark
        fab
        large
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
import { ScoreBoard, Score } from "@/models/scoreBoard";
import RuleAddCard from "@/components/shared/RuleAddCard.vue";
import { getPlayerResults } from "@/utils/scoreBoard";
import scoreBoard from "@/store/modules/scoreBoard";

@Component({
  components: {
    RuleAddCard
  }
})
export default class ScoreBoards extends Vue {
  showAddButton = false;
  showRuleAddModal = false;

  get scoreBoards(): ScoreBoard[] {
    return this.$store.getters["scoreBoard/scoreBoards"].sort(
      (a: any, b: any) => {
        if (new Date(a.createdAt) < new Date(b.createdAt)) {
          return 1;
        } else {
          return -1;
        }
      }
    );
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

  getRankAvarage(scoreBoard: ScoreBoard) {
    return getPlayerResults(scoreBoard);
  }
}
</script>

<style lang="scss" scoped>
.scoreboards {
  position: relative;
  height: 100%;
}

.list {
  height: 100%;
  overflow: auto;
}

.add-button {
  position: absolute;
  right: 25px;
  bottom: 25px;
}

.cardinfo {
  flex-wrap: nowrap;
}

.cardinfo__title {
  flex: 0 0 auto;
}

.cardinfo__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
