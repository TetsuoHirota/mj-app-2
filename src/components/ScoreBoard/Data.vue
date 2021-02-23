<template>
  <div class="data pa-6">
    <v-card
      v-for="player in players"
      :key="player.uid"
      class="my-2 pa-1"
      max-width="400px"
      width="100%"
    >
      <v-card-title class="pa-2 pb-0">
        <v-chip small dark color="indigo">{{ player.name }}</v-chip>
      </v-card-title>

      <v-card-text class="body-2 pb-0">
        <v-row class="average my-3">
          <div class="average__text">平均順位</div>
          <div class="average__value">{{ getRank(player.uid).average }}</div>
        </v-row>
        <v-divider></v-divider>
        <v-col class="pa-2">
          <v-row class="rank">
            <div v-for="index in rule.players" :key="index" class="rank__text">
              {{ index }}位
            </div>
          </v-row>
          <v-row class="rank">
            <div v-for="index in rule.players" :key="index" class="rank__value">
              <span>{{ getRank(player.uid).rank[index - 1] }}</span
              >回
            </div>
          </v-row>
          <v-row class="rank">
            <div v-for="index in rule.players" :key="index" class="rank__value">
              <span>{{ getRank(player.uid).percent[index - 1] }}</span
              >%
            </div>
          </v-row>
        </v-col>
      </v-card-text>
    </v-card>
  </div>
</template>
<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import ScoreCalc from "@/mixins/scoreCalc";

@Component({
  components: {}
})
export default class Data extends Mixins(ScoreCalc) {}
</script>

<style lang="scss" scoped>
.data {
  display: flex;
  flex-flow: column;
  align-items: center;
  height: 100%;
  overflow-y: auto;
}

.v-card__text {
  .average {
    > div {
      display: flex;
      flex: 1;
      justify-content: center;
    }
    &__text {
      color: rgba(0, 0, 0, 0.5);
    }
    &__value {
      font-size: 1.2rem;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
      color: teal;
    }
  }

  .rank {
    > div {
      display: flex;
      flex: 1;
      justify-content: center;
      margin: 0px 0;
    }
    &__text {
      color: rgba(0, 0, 0, 0.5);
    }
    &__value {
      font-size: 0.6rem;
      span {
        margin-right: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.87);
        color: teal;
      }
    }
  }
}
</style>
