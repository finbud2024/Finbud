<script>
import btcDataCSV from "./assets/AAPL.csv";
import CanvasJS from "@canvasjs/stockcharts";
console.log(btcDataCSV);

export default {
  name: "StockPrice",
  data() {
    var dps1 = [],
      dps2 = [],
      dps3 = [];

    // Skip the first row as it contains column names
    btcDataCSV.slice(1).forEach((data) => {
      console.log(data["Date"], data["Open"]);
      // CSV loader will return an array for each row
      dps1.push({
        x: new Date(data["Date"]), // Date
        y: [
          parseFloat(data["Open"]), // Open
          parseFloat(data["High"]), // High
          parseFloat(data["Low"]), // Low
          parseFloat(data["Close"]), // Close.svg
        ],
      });
      dps2.push({
        x: new Date(data["Date"]), // Date
        y: parseFloat(data["Volume"]), // Volume
      });
      dps3.push({
        x: new Date(data["Date"]), // Date
        y: parseFloat(data["Close"]), // Close.svg
      });
    });
    return {
      chart: null,
      options: {
        theme: "light2",
        exportEnabled: true,
        title: {
          text: "Price & Volume",
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
      },
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
  },
};
</script>
<template>
  <CanvasJSStockChart :options="options" :style="styleOptions" />
</template>
