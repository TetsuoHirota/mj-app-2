<template>
  <div class="scoreboards">
    <div class="list">
      <template v-if="skeleton">
        <v-skeleton-loader type="card" tile></v-skeleton-loader>
      </template>
      <template v-else>
        <template v-if="scoreBoards.length !== 0">
          <transition-group name="tr-card">
            <div v-for="scoreBoard in scoreBoards" :key="scoreBoard.id">
              <v-card
                flat
                class="ma-2 mt-12"
                @click="toScoreBoard(scoreBoard.id)"
              >
                <v-sheet
                  class="v-sheet--offset mx-auto"
                  color="cyan"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :labels="labels"
                    :value="value"
                    :gradient="['#f72047', '#ffd200', '#1feaea']"
                    line-width="2"
                    padding="16"
                    auto-draw
                  ></v-sparkline>
                </v-sheet>
                <v-card-text class="pt-0">
                  <div class="date text-subtitle-2">
                    <span>{{ scoreBoard.createdAt.getFullYear() }}</span>
                    <span>/</span>
                    <span>{{ scoreBoard.createdAt.getMonth() + 1 }}</span>
                    <span>/</span>
                    <span>{{ scoreBoard.createdAt.getDate() }}</span>
                  </div>
                  <v-col>
                    <v-row class="cardinfo">
                      <div class="cardinfo__title">メンバー</div>
                      <div class="cardinfo__colon">:</div>
                      <div class="cardinfo__text">
                        <span
                          v-for="(player, index) in scoreBoard.players"
                          :key="index"
                          class="mr-1"
                        >
                          {{ player.name }}
                        </span>
                      </div>
                    </v-row>
                    <v-row class="cardinfo">
                      <div class="cardinfo__title">平均順位</div>
                      <div class="cardinfo__colon">:</div>
                      <div class="cardinfo__text">
                        {{ getRankAvarage(scoreBoard) }}
                      </div>
                    </v-row>
                  </v-col>
                </v-card-text>
              </v-card>
              <!-- <v-divider></v-divider> -->
            </div>
          </transition-group>
        </template>
        <template v-else>
          <div class="grey--text pa-4">
            まだ成績表がありません。右下のアイコンからゲームを開始してください。
          </div>
        </template>
      </template>
    </div>
    <v-fab-transition>
      <v-btn
        v-show="showAddButton"
        class="add-button"
        color="pink"
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
import { ScoreBoard } from "@/models/scoreBoard";
import RuleAddCard from "@/components/shared/RuleAddCard.vue";
import { getPlayerResults } from "@/utils/scoreBoard";

@Component({
  components: {
    RuleAddCard
  }
})
export default class ScoreBoards extends Vue {
  labels = ["12am", "3am", "6am", "9am", "12pm", "3pm", "6pm", "9pm"];
  value = [200, 675, 410, 390, 310, 460, 250, 240];
  skeleton = false;
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
    this.$store
      .dispatch("scoreBoard/startScoreBoardsListener")
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

  destroyed() {
    this.$store.dispatch("scoreBoard/stopScoreBoardsListener");
  }

  openAddRule() {
    this.showRuleAddModal = true;
  }

  getRankAvarage(scoreBoard: ScoreBoard) {
    return getPlayerResults(scoreBoard);
  }

  toScoreBoard(id: string | undefined) {
    if (!id) {
      return;
    }
    this.$router.push({
      name: "scoreBoard",
      params: { id }
    });
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

.v-sheet--offset {
  position: relative;
  top: -24px;
}

.cardinfo {
  flex-wrap: nowrap;
}

.cardinfo__title {
  flex: 0 0 60px;
}

.cardinfo__colon {
  margin-right: 5px;
  margin-left: 3px;
}

.cardinfo__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
