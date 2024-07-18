<template>
  <div>
    <h1>Monte Carlo Simulation of a Stock Portfolio</h1>
    <div id="chartContainer" style="height: 370px; width: 100%;"></div>
  </div>
</template>

<script>
import axios from 'axios';
import * as CanvasJS from 'canvasjs';

export default {
  name: 'MonteCarloChart',
  data() {
    return {
      portfolioSims: [],
      tickers: ['GOOGL', 'AAPL', 'MSFT', 'TSLA'],
    };
  },
  mounted() {
    this.loadData().then(() => {
      this.runMonteCarloSimulation();
      this.renderChart();
    });
  },
  methods: {
    async loadData() {
      const requests = this.tickers.map(ticker => axios.get(`/${ticker}.csv`));
      const responses = await Promise.all(requests);
      const stockData = responses.map(response => this.parseCSV(response.data));
      
      this.returns = this.calculateReturns(stockData);
      this.meanReturns = this.returns.map(this.calculateMeanReturns);
      this.covMatrix = this.calculateCovMatrix(this.returns);
    },
    parseCSV(data) {
      const lines = data.split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => line.split(','));
      const closeIndex = headers.indexOf('Close');

      return rows.map(row => parseFloat(row[closeIndex]));
    },
    calculateReturns(data) {
      return data.map(prices => {
        const returns = [];
        for (let i = 1; i < prices.length; i++) {
          returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
        }
        return returns;
      });
    },
    calculateMeanReturns(returns) {
      return returns.reduce((acc, r) => acc + r, 0) / returns.length;
    },
    calculateCovMatrix(returns) {
      const covMatrix = [];
      for (let i = 0; i < returns.length; i++) {
        covMatrix[i] = [];
        for (let j = 0; j < returns.length; j++) {
          const cov = returns[i].map((r, idx) => (r - this.meanReturns[i]) * (returns[j][idx] - this.meanReturns[j])).reduce((acc, r) => acc + r, 0) / (returns[i].length - 1);
          covMatrix[i][j] = cov;
        }
      }
      return covMatrix;
    },
    runMonteCarloSimulation() {
      const weights = Array(this.returns.length).fill(0).map(() => Math.random());
      const sumWeights = weights.reduce((acc, w) => acc + w, 0);
      weights.forEach((w, i, arr) => arr[i] = w / sumWeights);

      const initialPortfolio = 10000;
      const mc_sims = 400;
      const T = 100;
      this.portfolioSims = [];

      for (let m = 0; m < mc_sims; m++) {
        const dailyReturns = [];
        for (let t = 0; t < T; t++) {
          const dailyReturn = weights.reduce((acc, w, i) => acc + w * this.returns[i][Math.floor(Math.random() * this.returns[i].length)], 0);
          dailyReturns.push(dailyReturn);
        }
        let portfolioValue = initialPortfolio;
        this.portfolioSims[m] = dailyReturns.map(r => portfolioValue *= (1 + r));
      }
    },
    renderChart() {
      const dataSeries = this.portfolioSims.map((sim, index) => ({
        type: "line",
        showInLegend: false,
        dataPoints: sim.map((value, day) => ({ x: day, y: value }))
      }));

      const chart = new CanvasJS.Chart("chartContainer", {
        title: {
          text: "Monte Carlo Simulation of a Stock Portfolio"
        },
        axisY: {
          title: "Portfolio Value ($)"
        },
        axisX: {
          title: "Days"
        },
        data: dataSeries
      });

      chart.render();
    }
  }
};
</script>

<style scoped>
#chartContainer {
  height: 370px;
  width: 100%;
}
</style>
