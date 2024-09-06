<template>
  <div class="chart-wrapper">
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  name: 'LineChart',
  props: {
    data: {
      type: Array,
      required: true
    },
    xName: {
      type: String,
      required: true
    },
    yName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chart: null
    };
  },
  methods: {
    generateChart() {
      const ctx = this.$refs.lineChartCanvas.getContext('2d');

      const chartData = {
        labels: this.data.map(item => item.date),
        datasets: [{
          label: 'Performance',
          data: this.data.map(item => item.value),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false
        }]
      };

      const config = {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: this.xName
              }
            },
            y: {
              title: {
                display: true,
                text: this.yName
              }
            }
          }
        }
      };

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, config);
    }
  },
  watch: {
    data: {
      handler() {
        this.generateChart();
      },
      deep: true
    }
  },
  mounted() {
    this.generateChart();
  }
};
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
