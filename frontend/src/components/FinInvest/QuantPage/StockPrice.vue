<template>
    <CanvasJSStockChart :options="options" :style="styleOptions" />
  </template>
  
  <script>
  import CanvasJS from "@canvasjs/stockcharts";
  
  export default {
    name: "StockPrice",
    props: ['data'],
    computed: {
      options() {
        const dps1 = this.data.map(d => ({ x: d.x, y: d.y }));
        const dps2 = this.data.map(d => ({ x: d.x, y: d.volume }));
        const dps3 = this.data.map(d => ({ x: d.x, y: d.close }));
        return {
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
        };
      }
    },
    methods: {
      addSymbols(e) {
        var suffixes = ["", "K", "M", "B", "T"];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
  
        if (order > suffixes.length - 1) order = suffixes.length - 1;
  
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
      },
    },
    data() {
      return {
        styleOptions: {
          width: "100%",
          height: "450px",
        },
      };
    },
  };
  </script>
  
  <style scoped>
  /* Your existing CSS */
  </style>
  