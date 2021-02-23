<script lang="ts">
import { Component, Prop, Mixins, Watch } from "vue-property-decorator";
import { Line, mixins } from "vue-chartjs";

@Component({
  components: {}
})
export default class GraphChartJs extends Mixins(Line, mixins.reactiveProp) {
  @Prop() chartData!: any;
  @Prop() chartOptions!: any;

  @Watch("chartData")
  function() {
    this.renderChart(this.chartData, this.chartOptions);
  }

  mounted() {
    this.renderChart(this.chartData, this.chartOptions);
  }
}
</script>
