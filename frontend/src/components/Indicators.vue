<template>
  <div>
    <div ref="chartContainer0" :style="styleOptions"></div>
    <div ref="chartContainer1" :style="styleOptions"></div>
    <div ref="chartContainer2" :style="styleOptions"></div>
    <div ref="chartContainer3" :style="styleOptions"></div>
    <div ref="chartContainer4" :style="styleOptions"></div>
    <div ref="chartContainer5" :style="styleOptions"></div>
  </div>
</template>

<script>
import AAPLDataCSV from "./assets/AAPL.csv";
import AMZNDataCSV from "./assets/AMZN.csv";
import MSFTDataCSV from "./assets/MSFT.csv";
import TSLADataCSV from "./assets/TSLA.csv";
import CanvasJS from "@canvasjs/stockcharts";

export default {
  name: "Indicators",
  props: {
    stockSymbol: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      stockData: [],
      rsi: [],
      ema: [],
      sma: [],
      macd: [],
      bb: [],
      dailyReturns: [],
      dailyVolatility: [],
      styleOptions: {
        width: "100%",
        height: "300px",
      },
    };
  },
  mounted() {
    window.CanvasJS = CanvasJS;
    this.loadData();
    this.renderCharts();
  },
  watch: {
    stockSymbol() {
      this.loadData();
      this.renderCharts();
    },
  },
  methods: {
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

      this.stockData = dataCSV.slice(1).map((data) => ({
        date: new Date(data["Date"]),
        open: parseFloat(data["Open"]),
        high: parseFloat(data["High"]),
        low: parseFloat(data["Low"]),
        close: parseFloat(data["Close"]),
        volume: parseFloat(data["Volume"]),
      }));

      this.calculateIndicators();
    },
    calculateIndicators() {
      this.calculateRSI();
      this.calculateEMA();
      this.calculateSMA();
      this.calculateMACD();
      this.calculateBB();
      this.calculateDailyReturns();
      this.calculateDailyVolatility();
    },
    calculateRSI(period = 14) {
      let gains = [],
        losses = [];
      for (let i = 1; i < this.stockData.length; i++) {
        const difference =
          this.stockData[i].close - this.stockData[i - 1].close;
        gains.push(Math.max(difference, 0));
        losses.push(Math.max(-difference, 0));
      }

      let avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
      let avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

      this.rsi = this.stockData.slice(period).map((data, i) => {
        if (i > 0) {
          avgGain = (avgGain * (period - 1) + gains[i + period - 1]) / period;
          avgLoss = (avgLoss * (period - 1) + losses[i + period - 1]) / period;
        }
        const rs = avgGain / avgLoss;
        return {
          x: data.date,
          y: 100 - 100 / (1 + rs),
        };
      });
    },
    calculateEMA(period = 12) {
      const k = 2 / (period + 1);
      let ema = this.stockData[0].close;
      this.ema = this.stockData.map((data) => {
        ema = data.close * k + ema * (1 - k);
        return { x: data.date, y: ema };
      });
    },
    calculateSMA(period = 20) {
      this.sma = this.stockData.slice(period - 1).map((data, i) => {
        const sum = this.stockData
          .slice(i, i + period)
          .reduce((sum, d) => sum + d.close, 0);
        return { x: data.date, y: sum / period };
      });
    },
    calculateMACD(shortPeriod = 12, longPeriod = 26, signalPeriod = 9) {
      const shortEMA = this.calculateEMAValues(shortPeriod);
      const longEMA = this.calculateEMAValues(longPeriod);
      const macdLine = shortEMA.map((v, i) => v - longEMA[i]);

      let signalLine = [];
      let ema = macdLine[0];
      const k = 2 / (signalPeriod + 1);
      macdLine.forEach((value) => {
        ema = value * k + ema * (1 - k);
        signalLine.push(ema);
      });

      this.macd = this.stockData.map((data, i) => ({
        x: data.date,
        y: [macdLine[i], signalLine[i], macdLine[i] - signalLine[i]],
      }));
    },
    calculateEMAValues(period) {
      const k = 2 / (period + 1);
      let ema = this.stockData[0].close;
      return this.stockData.map((data) => {
        ema = data.close * k + ema * (1 - k);
        return ema;
      });
    },
    calculateBB(period = 20, multiplier = 2) {
      this.bb = this.stockData.slice(period - 1).map((data, i) => {
        const slice = this.stockData.slice(i, i + period);
        const sma = slice.reduce((sum, d) => sum + d.close, 0) / period;
        const squareDiffs = slice.map((d) => Math.pow(d.close - sma, 2));
        const stdDev = Math.sqrt(
          squareDiffs.reduce((sum, sq) => sum + sq) / period
        );
        return {
          x: data.date,
          y: [sma + multiplier * stdDev, sma, sma - multiplier * stdDev],
        };
      });
    },
    calculateDailyReturns() {
      this.dailyReturns = this.stockData.slice(1).map((data, i) => ({
        x: data.date,
        y:
          ((data.close - this.stockData[i].close) / this.stockData[i].close) *
          100,
      }));
    },
    calculateDailyVolatility(period = 20) {
      const returns = this.stockData
        .slice(1)
        .map((data, i) => Math.log(data.close / this.stockData[i].close));
      this.dailyVolatility = this.stockData.slice(period).map((data, i) => {
        const slice = returns.slice(i, i + period);
        const mean = slice.reduce((sum, r) => sum + r, 0) / period;
        const variance =
          slice.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) /
          (period - 1);
        return {
          x: data.date,
          y: Math.sqrt(variance) * Math.sqrt(252) * 100, // Annualized volatility
        };
      });
    },
    renderCharts() {
      const charts = [
        {
          title: "Stock Price with BB",
          container: this.$refs.chartContainer0,
          data: [
            {
              type: "candlestick",
              name: "Stock Price",
              dataPoints: this.stockData.map((d) => ({
                x: d.date,
                y: [d.open, d.high, d.low, d.close],
              })),
            },
            {
              type: "line",
              name: "Upper BB",
              dataPoints: this.bb.map((d) => ({ x: d.x, y: d.y[0] })),
            },
            {
              type: "line",
              name: "Middle BB",
              dataPoints: this.bb.map((d) => ({ x: d.x, y: d.y[1] })),
            },
            {
              type: "line",
              name: "Lower BB",
              dataPoints: this.bb.map((d) => ({ x: d.x, y: d.y[2] })),
            },
          ],
        },
        {
          title: "RSI",
          axisY: { minimum: 0, maximum: 100 },
          container: this.$refs.chartContainer1,
          data: [
            { type: "line", name: "RSI", dataPoints: this.rsi },
            {
              type: "line",
              name: "Overbought",
              dataPoints: this.rsi.map((d) => ({ x: d.x, y: 70 })),
            },
            {
              type: "line",
              name: "Oversold",
              dataPoints: this.rsi.map((d) => ({ x: d.x, y: 30 })),
            },
          ],
        },
        {
          title: "EMA and SMA",
          container: this.$refs.chartContainer2,
          data: [
            { type: "line", name: "EMA", dataPoints: this.ema },
            { type: "line", name: "SMA", dataPoints: this.sma },
          ],
        },
        {
          title: "MACD",
          container: this.$refs.chartContainer3,
          data: [
            {
              type: "line",
              name: "MACD Line",
              dataPoints: this.macd.map((d) => ({ x: d.x, y: d.y[0] })),
            },
            {
              type: "line",
              name: "Signal Line",
              dataPoints: this.macd.map((d) => ({ x: d.x, y: d.y[1] })),
            },
            {
              type: "column",
              name: "MACD Histogram",
              dataPoints: this.macd.map((d) => ({ x: d.x, y: d.y[2] })),
            },
          ],
        },
        {
          title: "Daily Returns",
          container: this.$refs.chartContainer4,
          data: [
            {
              type: "column",
              name: "Daily Returns",
              dataPoints: this.dailyReturns,
            },
          ],
        },
        {
          title: "Daily Volatility Projection",
          container: this.$refs.chartContainer5,
          data: [
            {
              type: "line",
              name: "Daily Volatility",
              dataPoints: this.dailyVolatility,
            },
          ],
        },
      ];

      charts.forEach((chartData) => {
        new window.CanvasJS.Chart(chartData.container, {
          animationEnabled: true,
          theme: "light2",
          title: { text: chartData.title },
          axisX: { valueFormatString: "DD MMM" },
          axisY: chartData.axisY || {},
          toolTip: { shared: true },
          legend: { cursor: "pointer", itemclick: this.toggleDataSeries },
          data: chartData.data,
        }).render();
      });
    },
    toggleDataSeries(e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    },
  },
};
</script>

<style scoped>

</style>
