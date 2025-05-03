<template>
    <CanvasJSStockChart :options="options" :style="styleOptions" />
  </template>
  
  <script>
  import CanvasJS from "@canvasjs/stockcharts";
  
  export default {
    name: "Indicators",
    props: ['data'],
    computed: {
      options() {
        const dps1 = this.data.map(d => ({ x: new Date(d.Date), y: [d.Open, d.High, d.Low, d.Close] }));
        const dps2 = this.data.map(d => ({ x: new Date(d.Date), y: d.Volume }));
  
        // Calculate Indicators
        const sma = this.SMA(this.data);
        const ema = this.EMA(this.data);
        const macd = this.MACD(this.data);
        const rsi = this.RSI(this.data);
        const bb = this.BB(this.data);
  
        return {
          theme: "light2",
          exportEnabled: true,
          title: {
            text: "Technical Indicators",
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
                {
                  showInLegend: true,
                  name: "SMA",
                  yValueFormatString: "$#,###.##",
                  type: "line",
                  dataPoints: sma,
                },
                {
                  showInLegend: true,
                  name: "EMA",
                  yValueFormatString: "$#,###.##",
                  type: "line",
                  dataPoints: ema,
                },
                {
                  showInLegend: true,
                  name: "Bollinger Bands Upper",
                  yValueFormatString: "$#,###.##",
                  type: "line",
                  dataPoints: bb.upper,
                },
                {
                  showInLegend: true,
                  name: "Bollinger Bands Lower",
                  yValueFormatString: "$#,###.##",
                  type: "line",
                  dataPoints: bb.lower,
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
            {
              height: 100,
              toolTip: {
                shared: true,
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
                  name: "RSI",
                  yValueFormatString: "$#,###.##",
                  type: "line",
                  dataPoints: rsi,
                },
                {
                  showInLegend: true,
                  name: "MACD",
                  yValueFormatString: "$#,###.##",
                  type: "line",
                  dataPoints: macd.macd,
                },
                {
                  showInLegend: true,
                  name: "Signal Line",
                  yValueFormatString: "$#,###.##",
                  type: "line",
                  dataPoints: macd.signal,
                },
              ],
            },
          ],
          navigator: {
            data: [
              {
                dataPoints: dps2,
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
      SMA(data, period = 100, column = 'Adj Close') {
        return data.map((d, i, arr) => {
          if (i < period) return { x: d.Date, y: null };
          const sum = arr.slice(i - period, i).reduce((acc, val) => acc + val[column], 0);
          return { x: d.Date, y: sum / period };
        });
      },
      EMA(data, period = 20, column = 'Adj Close') {
        const k = 2 / (period + 1);
        let emaArray = [data[0][column]];
        for (let i = 1; i < data.length; i++) {
          emaArray.push(data[i][column] * k + emaArray[i - 1] * (1 - k));
        }
        return data.map((d, i) => ({ x: d.Date, y: emaArray[i] }));
      },
      MACD(data, period_long = 26, period_short = 12, period_signal = 9, column = 'Adj Close') {
        const shortEMA = this.EMA(data, period_short, column);
        const longEMA = this.EMA(data, period_long, column);
        const macdArray = shortEMA.map((d, i) => ({ x: d.x, y: d.y - longEMA[i].y }));
        const signalArray = this.EMA(macdArray, period_signal, 'y');
        return { macd: macdArray, signal: signalArray };
      },
      RSI(data, period = 14, column = 'Adj Close') {
        const gains = data.map((d, i, arr) => (i > 0 && arr[i][column] > arr[i - 1][column]) ? arr[i][column] - arr[i - 1][column] : 0);
        const losses = data.map((d, i, arr) => (i > 0 && arr[i][column] < arr[i - 1][column]) ? arr[i - 1][column] - arr[i][column] : 0);
        const avgGain = this.SMA(gains, period);
        const avgLoss = this.SMA(losses, period);
        const rs = avgGain.map((g, i) => ({ x: g.x, y: g.y / avgLoss[i].y }));
        const rsiArray = rs.map((r) => ({ x: r.x, y: 100 - (100 / (1 + r.y)) }));
        return rsiArray;
      },
      BB(data, period = 20, column = 'Adj Close') {
        const tp = data.map((d) => (d[column] + d['Low'] + d['High']) / 3);
        const ma_tp = this.SMA(tp, period);
        const std_tp = tp.map((d, i, arr) => {
          if (i < period) return { x: data[i].Date, y: null };
          const sliced = arr.slice(i - period, i);
          const mean = sliced.reduce((acc, val) => acc + val, 0) / period;
          const variance = sliced.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / period;
          return { x: data[i].Date, y: Math.sqrt(variance) };
        });
        const bolu = ma_tp.map((m, i) => ({ x: m.x, y: m.y + 2 * std_tp[i].y }));
        const bold = ma_tp.map((m, i) => ({ x: m.x, y: m.y - 2 * std_tp[i].y }));
        return { upper: bolu, lower: bold };
      }
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
  