<template>
<div class="data pa-6">
  <v-card
    class="my-2 pa-1"
    v-for="player in players"
    :key="player.uid"
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
          <div
            class="rank__text"
            v-for="index in rule.players"
            :key="index"
          >
            {{ index }}位
          </div>
        </v-row>
        <v-row class="rank">
          <div
            class="rank__value"
            v-for="index in rule.players"
            :key="index"
          >
            <span>{{ getRank(player.uid).rank[index - 1] }}</span>回
          </div>
        </v-row>
        <v-row class="rank">
          <div
            class="rank__value"
            v-for="index in rule.players"
            :key="index"
          >
            <span>{{ getRank(player.uid).percent[index - 1] }}</span>%
          </div>
        </v-row>
      </v-col>
    </v-card-text>
  </v-card>
</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ScoreCalc from '@/mixins/scoreCalc'

@Component({
  components: {
  }
})
export default class Data extends Mixins(ScoreCalc) {
}
</script>

<style lang="scss" scoped>
.data {
  height: 100%;
  display: flex;
  flex-flow: column;
  align-items: center;
  overflow-y: auto;
}

.v-card__text {
  .average {
    >div {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    &__text {
      color: rgba(0,0,0,.5);
    }
    &__value {
      color: rgba(0,0,0,.87);
      color: teal;
      font-weight: 500;
      font-size: 1.2rem;
    }
  }

  .rank {
    >div {
      flex: 1;
      display: flex;
      justify-content: center;
      margin: 0px 0;
    }
    &__text {
      color: rgba(0,0,0,.5);
    }
    &__value {
      font-size: 0.6rem;
      span {
        font-size: 0.875rem;
        margin-right: 4px;
        color: rgba(0,0,0,.87);
        font-weight: 500;
        color: teal;
      }
    }
  }
}

</style>