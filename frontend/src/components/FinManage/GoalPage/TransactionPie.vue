<template>
  <div class="pie-chart-container">
    <div class="pie-chart-wrapper">
      <canvas ref="pieCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default {
  name: "TransactionPie",
  data() {
    return {
      _chartInstance: null
    };
  },
  props: {
    transactions: {
      type: Array,
      required: true,
    },
    chartType: {
      type: String, // "Income" or "Expense"
      required: true,
    },
  },
  watch: {
    transactions: {
      handler(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.renderPieChart();
        }
      },
      deep: true
    },
    chartType() {
      this.renderPieChart();
    }
  },
  mounted() {
    this.renderPieChart();
  },
  methods: {
    renderPieChart() {
      const filtered = this.transactions.filter(
        (tx) => tx.type === this.chartType
      );

      if (filtered.length === 0) return;

      const categorySums = {};
      filtered.forEach((tx) => {
        const category = tx.category || "Uncategorized";
        categorySums[category] = (categorySums[category] || 0) + Math.abs(tx.amount);
      });

      const labels = Object.keys(categorySums);
      const data = Object.values(categorySums);

      const colors = labels.map((_, i) =>
        `hsl(${(i * 360) / labels.length}, 70%, 60%)`
      );

      const ctx = this.$refs.pieCanvas.getContext("2d");

      // ✅ destroy previous chart instance if exists
      if (this._chartInstance) {
        this._chartInstance.destroy();
      }

      this._chartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: colors,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            title: {
              display: true,
              text: `${this.chartType} by Category`,
            },
          },
        },
      });
    },
  },
  beforeUnmount() {
    if (this._chartInstance) {
      this._chartInstance.destroy();
    }
  }
};
</script>

<style scoped>
.pie-chart-container {
  aspect-ratio: 1 / 1 !important;
  width: 100%;
  max-width: 400px;
  height: 400px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
