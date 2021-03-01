<template>
  <div class="scoreboards">
    <template v-if="skeleton">
      <v-skeleton-loader type="card" class="ma-3"></v-skeleton-loader>
    </template>
    <template v-else>
      <template v-if="scoreBoards.length !== 0">
        <transition-group name="tr-card">
          <v-lazy
            v-for="scoreBoard in scoreBoards"
            :key="scoreBoard.id"
            min-height="200"
          >
            <v-card class="ma-3" @click="toScoreBoard(scoreBoard.id)">
              <v-sheet color="cyan">
                <v-sparkline
                  :value="value"
                  color="white"
                  line-width="2"
                  padding="16"
                  auto-draw
                  :auto-draw-duration="3000"
                ></v-sparkline>
              </v-sheet>
              <v-card-text class="pb-0">
                <div class="date">
                  <span>{{ scoreBoard.createdAt.getFullYear() }}</span>
                  <span>/</span>
                  <span>{{ scoreBoard.createdAt.getMonth() + 1 }}</span>
                  <span>/</span>
                  <span>{{ scoreBoard.createdAt.getDate() }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
                <v-row class="cardinfo" no-gutters align="center">
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
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="cyan" text>
                  成績表を見る
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-lazy>
        </transition-group>
      </template>
      <template v-else>
        <div class="grey--text pa-4">
          まだ成績表がありません。右下のアイコンからゲームを開始してください。
        </div>
      </template>
    </template>
    <v-fab-transition>
      <v-btn
        v-show="showAddButton"
        class="o-button-add"
        color="pink"
        fab
        large
        dark
        @click="openRuleSet()"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <RuleSet ref="ruleSet"></RuleSet>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import { ScoreBoard } from "@/models";
import RuleSet from "@/components/scoreBoard/RuleSet.vue";
import { getPlayerResults } from "@/utils/scoreBoard";

@Component({
  components: {
    RuleSet
  }
})
export default class ScoreBoards extends BaseComponent {
  $refs!: {
    ruleSet: RuleSet;
  };
  value = [200, 675, 410, 390, 310, 460, 250, 240];
  skeleton = true;
  showAddButton = false;

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
        this._error(err);
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

  openRuleSet() {
    this.$refs.ruleSet.open();
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
  overflow-y: auto;
}

.v-sheet--offset {
  position: relative;
  top: -20px;
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
