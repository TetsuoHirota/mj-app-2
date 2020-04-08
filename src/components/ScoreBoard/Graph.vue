<template>
<div class="graph">
  <GraphChartJs
    class="chartjs"
    :chartData="chartData"
    :chartOptions="chartOptions"/>
</div>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import GraphChartJs from './GraphChartJs.vue'
import ScoreCalc from '@/mixins/scoreCalc'

@Component({
  components: {
    GraphChartJs
  }
})
export default class Graph extends Mixins(ScoreCalc) {
  colors = [
    "#F44336",
    "#9C27B0",
    "#2196F3",
    "#4CAF50",
    "#FF9800",
    "#795548",
  ]

  get players() {
    return this.$store.getters['ScoreBoard/players']
  }

  get scores() {
    return this.$store.getters['ScoreBoard/scores']
  }

  get datasets() {
    const datasets: any[] = []
    this.players.forEach((player: any, index: number) => {
      const label = player.name
      let total = 0
      const data: number[] = []
      this.scores.forEach((score: any) => {
        const playerScore = score.find((e: any) => {
          return e.uid == player.uid
        })
        if (playerScore !== undefined) {
          total += playerScore.pt
          data.push(total)
        } else {
          data.push(total)
        }
      })
      const color = this.colors[index]
      datasets.push({
        label: label,
        data: data,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        lineTension: 0,
      })
    })
    return datasets
  }

  get labels() {
    const labels: number[] = []
    for (let i = 0; i < this.scores.length; i++) {
      labels.push(i + 1)
    }
    return labels
  }

  get chartData() {
    return {
      labels: this.labels,
      datasets: this.datasets,
    }
  }

  chartOptions = {
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 13,
        padding: 20,
      }
    },
    scales: {
      yAxes: [{
        scaleLabel: {
        },
        ticks: {
        },
        gridLines: {
          zeroLineWidth: 2,
        }
      }],
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: '半荘',
          padding: 0,
        },
        ticks: {
        }
      }],
    }
  }
}
</script>

<style lang="scss">
.graph {
  height: 100%;
  padding: 20px;
  .chartjs {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    canvas {
    max-height: 100%;
    max-width: 600px;
    }
  }
}

</style>