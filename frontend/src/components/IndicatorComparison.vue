<template>
  <div>
    <div v-for="(chart, index) in charts" :key="index" class="chart-container">
      <h3>{{ chart.title }}</h3>
      <canvas :ref="'chart' + index"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import csvData from "./assets/economic_indicators.csv";

export default {
  name: "IndicatorComparison",
  data() {
    return {
      charts: [
        {
          title: "Stock Market vs House Prices",
          x: "House Prices",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Bond Yields",
          x: "Bond Yields",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Production and Manufacturing Statistics",
          x: "Production and Manufacturing Statistics",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Retail Sales",
          x: "Retail Sales",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Interest Rates",
          x: "Interest Rates",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs GDP Growth Rates",
          x: "GDP Growth Rates",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Consumer Price Index (CPI)",
          x: "Consumer Price Index (CPI)",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Currency Strength and Stability",
          x: "Currency Strength and Stability",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Labour Market Statistics",
          x: "Labour Market Statistics",
          y: "Stock Market",
        },
        {
          title: "Stock Market vs Commodity Prices",
          x: "Commodity Prices",
          y: "Stock Market",
        },
      ],
    };
  },
  mounted() {
    this.createCharts();
  },
  methods: {
    createCharts() {
      this.charts.forEach((chart, index) => {
        const ctx = this.$refs["chart" + index][0].getContext("2d");
        const chartData = this.parseCSVData(chart.x, chart.y);

        new Chart(ctx, {
          type: "scatter",
          data: {
            datasets: [
              {
                label: chart.title,
                data: chartData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: chart.x,
                },
              },
              y: {
                title: {
                  display: true,
                  text: chart.y,
                },
              },
            },
          },
        });
      });
    },
    parseCSVData(xColumn, yColumn) {
      return csvData.slice(1).map((row) => ({
        x: parseFloat(row[xColumn]),
        y: parseFloat(row[yColumn]),
      }));
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 45%;
  margin: 20px;
  display: inline-block;
}
</style>
