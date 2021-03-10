<template>
  <div class="data">
    <div v-for="(player, idx) in players" :key="player.uid">
      <v-list-item class="px-0">
        <v-card tile flat class="pb-4">
          <v-card-title>
            {{ player.name }}
          </v-card-title>
          <v-col align="center">
            <v-row class="" align="center" justify="center">
              <div class="text-body-2 text--secondary mr-5">平均順位</div>
              <div class="text-h5 font-weight-medium">
                {{ results[idx].avarageRank }}
              </div>
            </v-row>
            <v-row class="ranks">
              <v-col v-for="n in rule.playerNumber" :key="n">
                <div class="text-body-2 text--secondary">{{ n }}位</div>
                <div class="text-h6 font-weight-medium">
                  {{ results[idx].rankCounts[n - 1] }}
                </div>
                <div class="text-subtitle-2 font-weight-medium pl-2">
                  <span>
                    {{ results[idx].rankPercentages[n - 1] }}
                    <span class="text-caption text--secondary">%</span>
                  </span>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-card>
      </v-list-item>
      <v-divider></v-divider>
    </div>
  </div>
</template>
<script lang="ts">
import { Component } from "vue-property-decorator";
import BaseComponent from "@/components/shared/Base";
import { Rule, ScoreBoard } from "@/models";
import { scoreBoardResult } from "@/utils";

@Component({
  components: {}
})
export default class Data extends BaseComponent {
  get scoreBoard(): ScoreBoard {
    return this.$store.getters["scoreBoard/scoreBoard"];
  }

  get players() {
    return this.scoreBoard.players || [];
  }

  get rule(): Rule {
    return this.scoreBoard.rule;
  }

  get results() {
    return scoreBoardResult(this.scoreBoard);
  }
}
</script>

<style lang="scss" scoped>
.data {
  height: 100%;
  overflow-y: auto;
}

.v-card {
  width: 100%;
}
</style>
