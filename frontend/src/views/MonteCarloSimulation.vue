<template>
  <div>
    <h1>Monte Carlo Simulation of a Stock Portfolio</h1>
    <div id="chartContainer" style="height: 370px; width: 100%;"></div>
  </div>
</template>

<script>
import CanvasJS from '@canvasjs/charts';
import * as math from 'mathjs';
import AAPLData from '../views/hardcodeData/AAPL.csv';
import AMZNData from '../views/hardcodeData/AMZN.csv';
import MSFTData from '../views/hardcodeData/MSFT.csv';
import TSLAData from '../views/hardcodeData/TSLA.csv';

export default {
  name: 'MonteCarloChart',
  data() {
    return {
      portfolioSims: [],
      tickers: ['AAPL', 'AMZN', 'MSFT', 'TSLA'],
      meanReturns: [],
      covMatrix: [],
      returns: [],
      weights: [],
      initialPortfolio: 10000,
      staticL: [
        [0.1, 0, 0, 0],
        [0.02, 0.1, 0, 0],
        [0.01, 0.03, 0.1, 0],
        [0.02, 0.04, 0.05, 0.1]
      ]
    };
  },
  mounted() {
    window.CanvasJS = CanvasJS;
    this.loadData().then(() => {
      this.runMonteCarloSimulation();
      this.renderChart();
      this.calculateRiskMeasures();
    });
  },
  methods: {
    async loadData() {
      const csvData = [AAPLData, AMZNData, MSFTData, TSLAData];
      const stockData = csvData.map(data => this.parseCSV(data));
      if (stockData.some(data => data.length === 0)) {
        console.error('One or more CSV files did not contain valid data.');
        return;
      }
      this.returns = this.calculateReturns(stockData);
      this.meanReturns = this.calculateMeanReturns(this.returns);
      this.covMatrix = this.calculateCovMatrix(this.returns);
      if (this.returns.length > 0 && this.returns[0].length > 0) {
        this.initializeWeights();
        this.runMonteCarloSimulation();
        this.renderChart();
        this.calculateRiskMeasures();
      } else {
        console.error('Returns array is empty or malformed.');
      }
    },
    parseCSV(data) {
      const headers = data[0];
      const closeIndex = headers.indexOf('Close');
      if (closeIndex === -1) {
        console.error("CSV data does not have 'Close.svg' column");
        return [];
      }
      const rows = data.slice(1);
      return rows.map(row => parseFloat(row[closeIndex])).filter(val => !isNaN(val));
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
      return returns.map(stockReturns => stockReturns.reduce((acc, r) => acc + r, 0) / stockReturns.length);
    },
    calculateCovMatrix(returns) {
      if (returns.length === 0 || returns[0].length === 0) {
        console.error('Returns array is empty or malformed.');
        return [];
      }
      const matrix = math.transpose(returns);
      const n = matrix.length;
      const means = this.calculateMeanReturns(returns);
      const covMatrix = Array.from({ length: n }, () => Array(n).fill(0));

      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
          let cov = 0;
          for (let k = 0; k < matrix[i].length; k++) {
            cov += (matrix[i][k] - means[i]) * (matrix[j][k] - means[j]);
          }
          covMatrix[i][j] = cov / (matrix[i].length - 1);
          if (i !== j) {
            covMatrix[j][i] = covMatrix[i][j];
          }
        }
      }
      return covMatrix;
    },
    initializeWeights() {
      const numAssets = this.returns.length;
      this.weights = Array.from({ length: numAssets }, () => Math.random());
      const sumWeights = this.weights.reduce((acc, w) => acc + w, 0);
      this.weights = this.weights.map(w => w / sumWeights);
      console.log('Weights:', this.weights);
    },
    runMonteCarloSimulation() {
      const mc_sims = 400; // number of simulations
      const T = 100; // timeframe in days
      const meanM = Array(T).fill(this.meanReturns);
      const L = this.staticL; // Use static Cholesky-like matrix for testing
      this.portfolioSims = Array.from({ length: mc_sims }, () => Array(T).fill(0));

      for (let m = 0; m < mc_sims; m++) {
        let portfolioValue = this.initialPortfolio;
        for (let t = 0; t < T; t++) {
          const timeFactor = t / T;
          const volatility = 0.3 * (1 + timeFactor) * (math.random() - 0.5);
          const Z = Array.from({ length: this.meanReturns.length }, () => volatility);
          const dailyReturns = math.add(meanM[t], math.multiply(L, Z));
          portfolioValue *= (1 + math.dot(this.weights, dailyReturns));
          portfolioValue = Math.max(6000, Math.min(20000, portfolioValue));
          this.portfolioSims[m][t] = portfolioValue;
        }
      }

      console.log('Portfolio Simulations:', this.portfolioSims);
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
          title: "Portfolio Value ($)",
          minimum: 6000,
          maximum: 20000,
          interval: 2000
        },
        axisX: {
          title: "Days",
          interval: 20
        },
        data: dataSeries
      });

      chart.render();
    },
    calculateRiskMeasures() {
      const initialPortfolio = 10000;
      const portResults = this.portfolioSims.map(sim => sim[sim.length - 1]);
      const VaR = initialPortfolio - this.mcVaR(portResults, 5);
      const CVaR = initialPortfolio - this.mcCVaR(portResults, 5);

      console.log(`VaR $${VaR.toFixed(2)}`);
      console.log(`CVaR $${CVaR.toFixed(2)}`);
    },
    mcVaR(returns, alpha) {
      returns.sort((a, b) => a - b);
      return returns[Math.floor(alpha / 100 * returns.length)];
    },
    mcCVaR(returns, alpha) {
      const VaR = this.mcVaR(returns, alpha);
      const belowVaR = returns.filter(r => r <= VaR);
      return belowVaR.reduce((acc, val) => acc + val, 0) / belowVaR.length;
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
