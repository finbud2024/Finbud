<template>
  <div>
    <div id="chartContainer0" style="height: 300px; width: 100%"></div>
    <div id="chartContainer1" style="height: 300px; width: 100%"></div>
    <div id="chartContainer2" style="height: 300px; width: 100%"></div>
    <div id="chartContainer3" style="height: 300px; width: 100%"></div>
    <div id="chartContainer4" style="height: 300px; width: 100%"></div>
    <div id="chartContainer5" style="height: 300px; width: 100%"></div>
  </div>
</template>

<script>
import * as CanvasJS from '@canvasjs/charts';
import csv from 'csvtojson';
import AAPLData from '../../../../data/AAPL.csv';
import AMZNData from '../../../../data/AMZN.csv';
import MSFTData from '../../../../data/MSFT.csv';
import TSLAData from '../../../../data/TSLA.csv';

export default {
  name: 'MonteCarloChart',
  data() {
    return {
      stockData: [],
      returns: [],
      meanReturns: [],
      covMatrix: [],
      weights: [],
      portfolioSims: [],
      VaR: 0,
      CVaR: 0,
      tickers: ['AAPL', 'AMZN', 'GOOG', 'MSFT', 'TSLA'],
      csvData: [AAPLData, AMZNData, GOOGData, MSFTData, TSLAData],
    };
  },
  mounted() {
    window.CanvasJS = CanvasJS;
    this.loadCSVData();
  },
  methods: {
    async loadCSVData() {
      try {
        this.stockData = await Promise.all(this.csvData.map(file => this.parseCSV(file)));
        this.processData();
        this.monteCarloSimulation();
        this.renderCharts();
        this.calculateVaRCVaR();
      } catch (error) {
        console.error('Error loading CSV data:', error);
      }
    },
    async parseCSV(file) {
      const response = await fetch(file);
      const csvText = await response.text();
      return csv().fromString(csvText);
    },
    processData() {
      // Flatten the stockData arrays into a single array
      const flatStockData = this.stockData.flat();
      const groupedData = this.groupByDate(flatStockData);

      this.returns = this.calculateReturns(groupedData);
      this.meanReturns = this.calculateMeanReturns(this.returns);
      this.covMatrix = this.calculateCovMatrix(this.returns);
      this.initializeWeights();
    },
    groupByDate(data) {
      return data.reduce((acc, val) => {
        const date = new Date(val.date).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(val);
        return acc;
      }, {});
    },
    calculateReturns(groupedData) {
      const dates = Object.keys(groupedData).sort();
      let returns = [];
      for (let i = 1; i < dates.length; i++) {
        const previous = groupedData[dates[i - 1]].map(d => d.close);
        const current = groupedData[dates[i]].map(d => d.close);
        returns.push(current.map((c, idx) => (c - previous[idx]) / previous[idx]));
      }
      return returns;
    },
    calculateMeanReturns(returns) {
      const meanReturns = [];
      const numAssets = returns[0].length;
      for (let i = 0; i < numAssets; i++) {
        let sum = 0;
        for (let j = 0; j < returns.length; j++) {
          sum += returns[j][i];
        }
        meanReturns.push(sum / returns.length);
      }
      return meanReturns;
    },
    calculateCovMatrix(returns) {
      const covMatrix = [];
      const numAssets = returns[0].length;
      for (let i = 0; i < numAssets; i++) {
        const row = [];
        for (let j = 0; j < numAssets; j++) {
          let sum = 0;
          for (let k = 0; k < returns.length; k++) {
            sum += (returns[k][i] - this.meanReturns[i]) * (returns[k][j] - this.meanReturns[j]);
          }
          row.push(sum / (returns.length - 1));
        }
        covMatrix.push(row);
      }
      return covMatrix;
    },
    initializeWeights() {
      const numAssets = this.csvData.length;
      this.weights = Array.from({ length: numAssets }, () => Math.random());
      const sum = this.weights.reduce((acc, w) => acc + w, 0);
      this.weights = this.weights.map(w => w / sum);
    },
    monteCarloSimulation() {
      const mc_sims = 400;
      const T = 100;
      const meanM = Array(T).fill(this.meanReturns);
      const portfolio_sims = Array(T).fill(Array(mc_sims).fill(0));

      for (let m = 0; m < mc_sims; m++) {
        let Z = Array(T).fill(Array(this.weights.length).fill(0)).map(row => row.map(() => math.randomNormal()));
        let L = math.cholesky(this.covMatrix);
        let dailyReturns = meanM.map((row, i) => math.add(row, math.multiply(L, Z[i])));
        let cumReturns = Array(T).fill(0).map((_, i) => i === 0 ? 1 : dailyReturns[i - 1].reduce((acc, r, idx) => acc * (1 + r), 1));
        for (let t = 0; t < T; t++) {
          portfolio_sims[t][m] = math.dot(this.weights, cumReturns[t]);
        }
      }

      this.portfolioSims = portfolio_sims;
    },
    calculateVaRCVaR() {
      const finalValues = this.portfolioSims[this.portfolioSims.length - 1];
      const initialPortfolio = 10000;
      const portResults = finalValues.map(v => v * initialPortfolio);

      const alpha = 5;
      this.VaR = initialPortfolio - this.mcVaR(portResults, alpha);
      this.CVaR = initialPortfolio - this.mcCVaR(portResults, alpha);
    },
    mcVaR(returns, alpha) {
      return math.quantileSeq(returns, alpha / 100);
    },
    mcCVaR(returns, alpha) {
      const VaR = this.mcVaR(returns, alpha);
      const belowVaR = returns.filter(r => r <= VaR);
      return math.mean(belowVaR);
    },
    renderCharts() {
      const charts = [
        {
          title: "MC simulation of a stock portfolio",
          data: [
            {
              type: "line",
              name: "Portfolio Simulation",
              dataPoints: this.portfolioSims.map((p, idx) => ({ x: idx, y: p.reduce((a, b) => a + b, 0) / p.length })),
            },
          ],
        },
      ];

      charts.forEach((chartData, index) => {
        new window.CanvasJS.Chart(`chartContainer${index}`, {
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
#chartContainer0, #chartContainer1, #chartContainer2, #chartContainer3, #chartContainer4, #chartContainer5 {
  height: 300px;
  width: 100%;
}
</style>
