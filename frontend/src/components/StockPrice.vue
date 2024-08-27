<template>
  <div ref="chartContainer" :style="styleOptions"></div>
</template>

<script>
import AAPLDataCSV from "./assets/AAPL.csv";
import AMZNDataCSV from "./assets/AMZN.csv";
import MSFTDataCSV from "./assets/MSFT.csv";
import TSLADataCSV from "./assets/TSLA.csv";
import CanvasJS from "@canvasjs/stockcharts";

export default {
  name: "StockPrice",
  props: {
    stockSymbol: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      options: null,
      styleOptions: {
        width: "100%",
        height: "450px",
      },
    };
  },
  methods: {
    addSymbols(e) {
      var suffixes = ["", "K", "M", "B"];
      var order = Math.max(
        Math.floor(Math.log(Math.abs(e.value)) / Math.log(1000)),
        0
      );
      if (order > suffixes.length - 1) order = suffixes.length - 1;
      var suffix = suffixes[order];
      return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    },
    loadData() {
      let dataCSV;
      switch (this.stockSymbol) {
        case "AAPL":
          dataCSV = AAPLDataCSV;
          break;
        case "AMZN":
          dataCSV = AMZNDataCSV;
          break;
        case "MSFT":
          dataCSV = MSFTDataCSV;
          break;
        case "TSLA":
          dataCSV = TSLADataCSV;
          break;
        default:
          console.error("Unknown stock symbol:", this.stockSymbol);
          return;
      }

      var dps1 = [],
        dps2 = [],
        dps3 = [];

      dataCSV.slice(1).forEach((data) => {
        dps1.push({
          x: new Date(data["Date"]),
          y: [
            parseFloat(data["Open"]),
            parseFloat(data["High"]),
            parseFloat(data["Low"]),
            parseFloat(data["Close"]),
          ],
        });
        dps2.push({
          x: new Date(data["Date"]),
          y: parseFloat(data["Volume"]),
        });
        dps3.push({
          x: new Date(data["Date"]),
          y: parseFloat(data["Close"]),
        });
      });

      this.options = {
        theme: "light2",
        exportEnabled: true,
        title: {
          text: `Stock Price & Volume`,
        },
        charts: [
          {
            toolTip: {
              shared: true,
            },
            axisX: {
              lineThickness: 5,
              tickLength: 0,
              labelFormatter: function (e) {
                return "";
              },
            },
            axisY: {
              prefix: "$",
            },
            legend: {
              verticalAlign: "top",
            },
            data: [
              {
                showInLegend: true,
                name: "Stock Price (in USD)",
                yValueFormatString: "$#,###.##",
                type: "candlestick",
                dataPoints: dps1,
              },
            ],
          },
          {
            height: 100,
            toolTip: {
              shared: true,
            },
            axisY: {
              prefix: "$",
              labelFormatter: this.addSymbols,
            },
            legend: {
              verticalAlign: "top",
            },
            data: [
              {
                showInLegend: true,
                name: "Volume",
                yValueFormatString: "$#,###.##",
                dataPoints: dps2,
              },
            ],
          },
        ],
        navigator: {
          data: [
            {
              dataPoints: dps3,
            },
          ],
          slider: {
            minimum: new Date(2018, 6, 1),
            maximum: new Date(2018, 8, 1),
          },
        },
      };
    },
    renderChart() {
      this.chart = new CanvasJS.StockChart(this.$refs.chartContainer, this.options);
      this.chart.render();
    },
  },
  mounted() {
    window.CanvasJS = CanvasJS;
    this.loadData();
    this.renderChart();
  },
  watch: {
    stockSymbol() {
      this.loadData();
      this.renderChart();
    },
  },
};
</script>

<style scoped>
/* Custom styles if needed */
</style>
