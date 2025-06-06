<template>
  <div class="monte-carlo-container">
    <div class="header">
    <h1>Monte Carlo Simulation of a Stock Portfolio</h1>
      <div class="controls">
        <div class="control-group">
          <label>Portfolio Value:</label>
          <input type="number" v-model="initialPortfolio" min="1000" step="1000" />
        </div>
        <div class="control-group">
          <label>Simulations:</label>
          <input type="number" v-model="mcSims" min="100" max="1000" step="100" />
        </div>
        <div class="control-group">
          <label>Time Period (days):</label>
          <input type="number" v-model="timePeriod" min="30" max="365" step="30" />
        </div>
        <button @click="runSimulation" :disabled="isLoading" class="run-btn">
          {{ isLoading ? 'Running...' : 'Run Simulation' }}
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>{{ loadingMessage }}</p>
    </div>

    <div v-else-if="hasError" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Simulation Error</h3>
      <p>{{ errorMessage }}</p>
      <button @click="runSimulation" class="retry-btn">Retry</button>
    </div>

    <div v-else class="results-container">
      <div id="chartContainer" class="chart-container"></div>
      
      <div class="risk-metrics" v-if="riskMeasures">
        <h3>Risk Analysis</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <h4>Value at Risk (VaR 95%)</h4>
            <span class="metric-value negative">${{ riskMeasures.VaR.toFixed(2) }}</span>
          </div>
          <div class="metric-card">
            <h4>Conditional VaR (CVaR 95%)</h4>
            <span class="metric-value negative">${{ riskMeasures.CVaR.toFixed(2) }}</span>
          </div>
          <div class="metric-card">
            <h4>Expected Return</h4>
            <span class="metric-value positive">${{ riskMeasures.expectedReturn.toFixed(2) }}</span>
          </div>
          <div class="metric-card">
            <h4>Portfolio Volatility</h4>
            <span class="metric-value">{{ riskMeasures.volatility.toFixed(2) }}%</span>
          </div>
        </div>
      </div>

      <div class="portfolio-composition">
        <h3>Portfolio Composition</h3>
        <div class="weights-container">
          <div v-for="(weight, index) in weights" :key="tickers[index]" class="weight-item">
            <span class="ticker">{{ tickers[index] }}</span>
            <div class="weight-bar">
              <div class="weight-fill" :style="{ width: weight * 100 + '%' }"></div>
            </div>
            <span class="weight-value">{{ (weight * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CanvasJS from '@canvasjs/charts';
import * as math from 'mathjs';
import axios from 'axios';

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
      mcSims: 400,
      timePeriod: 100,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      loadingMessage: 'Initializing simulation...',
      riskMeasures: null,
      chart: null
    };
  },
  mounted() {
    window.CanvasJS = CanvasJS;
    this.runSimulation();
  },
  beforeUnmounted() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    async runSimulation() {
      this.isLoading = true;
      this.hasError = false;
      this.riskMeasures = null;
      
      try {
        await this.loadData();
        this.runMonteCarloSimulation();
        await this.renderChart();
        this.calculateRiskMeasures();
      } catch (error) {
        console.error('Simulation error:', error);
        this.hasError = true;
        this.errorMessage = error.message || 'Failed to run simulation';
      } finally {
        this.isLoading = false;
      }
    },

    async loadData() {
      this.loadingMessage = 'Loading market data...';
      
      try {
        // Try to fetch real data from API
        const responses = await Promise.all(
          this.tickers.map(ticker => 
            axios.get(`${process.env.VUE_APP_DEPLOY_URL || 'http://localhost:3000'}/api/historical/${ticker}`)
              .catch(() => null)
          )
        );

        const stockData = responses.map((response, index) => {
          if (response && response.data) {
            return this.parseAPIData(response.data);
          } else {
            // Generate mock data for this ticker
            return this.generateMockPriceData(this.tickers[index]);
          }
        });

      if (stockData.some(data => data.length === 0)) {
          throw new Error('Failed to load sufficient market data');
      }

        this.loadingMessage = 'Calculating returns and correlations...';
      this.returns = this.calculateReturns(stockData);
      this.meanReturns = this.calculateMeanReturns(this.returns);
      this.covMatrix = this.calculateCovMatrix(this.returns);
        
        if (this.returns.length === 0 || this.returns[0].length === 0) {
          throw new Error('Insufficient return data for analysis');
        }

        this.initializeWeights();
      } catch (error) {
        console.warn('Using mock data for simulation:', error);
        this.generateAllMockData();
      }
    },

    parseAPIData(data) {
      // Parse API response to extract closing prices
      if (Array.isArray(data)) {
        return data.map(item => parseFloat(item.close)).filter(val => !isNaN(val));
      }
        return [];
    },

    generateMockPriceData(ticker) {
      // Generate realistic mock price data
      const numDays = 252; // One year of trading days
      const prices = [];
      let currentPrice = this.getBasePrice(ticker);
      
      for (let i = 0; i < numDays; i++) {
        // Use random walk with drift
        const dailyReturn = (Math.random() - 0.5) * 0.04 + 0.0003; // ~8% annual return with 20% volatility
        currentPrice *= (1 + dailyReturn);
        prices.push(currentPrice);
      }
      
      return prices;
    },

    getBasePrice(ticker) {
      const basePrices = {
        'AAPL': 150,
        'AMZN': 120,
        'MSFT': 280,
        'TSLA': 200
      };
      return basePrices[ticker] || 100;
    },

    generateAllMockData() {
      const stockData = this.tickers.map(ticker => this.generateMockPriceData(ticker));
      this.returns = this.calculateReturns(stockData);
      this.meanReturns = this.calculateMeanReturns(this.returns);
      this.covMatrix = this.calculateCovMatrix(this.returns);
      this.initializeWeights();
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
      return returns.map(stockReturns => 
        stockReturns.reduce((acc, r) => acc + r, 0) / stockReturns.length
      );
    },

    calculateCovMatrix(returns) {
      if (returns.length === 0 || returns[0].length === 0) {
        throw new Error('Returns array is empty or malformed');
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
      // Use equal weights for simplicity, or optimize later
      const numAssets = this.returns.length;
      this.weights = Array(numAssets).fill(1 / numAssets);
      console.log('Portfolio weights:', this.weights);
    },

    runMonteCarloSimulation() {
      this.loadingMessage = 'Running Monte Carlo simulation...';
      
      const T = this.timePeriod;
      this.portfolioSims = Array.from({ length: this.mcSims }, () => Array(T).fill(0));

      // Cholesky decomposition for correlated random variables
      const L = this.choleskyDecomposition(this.covMatrix);

      for (let m = 0; m < this.mcSims; m++) {
        let portfolioValue = this.initialPortfolio;
        
        for (let t = 0; t < T; t++) {
          // Generate correlated random shocks
          const Z = Array.from({ length: this.meanReturns.length }, () => 
            this.normalRandom() * Math.sqrt(1/252) // Daily scaling
          );
          
          const correlatedZ = math.multiply(L, Z);
          const dailyReturns = math.add(
            this.meanReturns.map(r => r / 252), // Annualized to daily
            correlatedZ
          );
          
          portfolioValue *= (1 + math.dot(this.weights, dailyReturns));
          this.portfolioSims[m][t] = Math.max(0, portfolioValue); // Prevent negative values
        }
      }

      console.log('Monte Carlo simulation completed');
    },

    choleskyDecomposition(matrix) {
      const n = matrix.length;
      const L = Array.from({ length: n }, () => Array(n).fill(0));

      for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
          if (i === j) {
            let sum = 0;
            for (let k = 0; k < j; k++) {
              sum += L[i][k] * L[i][k];
            }
            L[i][j] = Math.sqrt(Math.max(0.01, matrix[i][i] - sum)); // Ensure positive
          } else {
            let sum = 0;
            for (let k = 0; k < j; k++) {
              sum += L[i][k] * L[j][k];
            }
            L[i][j] = (matrix[i][j] - sum) / L[j][j];
        }
      }
      }
      return L;
    },

    normalRandom() {
      // Box-Muller transformation for normal distribution
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    },

    async renderChart() {
      this.loadingMessage = 'Rendering chart...';
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow UI update

      // Destroy existing chart
      if (this.chart) {
        this.chart.destroy();
      }

      const dataSeries = this.portfolioSims.slice(0, 50).map((sim, index) => ({
        type: "line",
        name: `Simulation ${index + 1}`,
        showInLegend: false,
        lineThickness: 1,
        markerSize: 0,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`,
        dataPoints: sim.map((value, day) => ({ x: day, y: value }))
      }));

      // Add mean path
      const meanPath = Array.from({ length: this.timePeriod }, (_, day) => {
        const values = this.portfolioSims.map(sim => sim[day]);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        return { x: day, y: mean };
      });

      dataSeries.push({
        type: "line",
        name: "Mean Path",
        showInLegend: true,
        lineThickness: 3,
        color: "#ff6b6b",
        dataPoints: meanPath
      });

      this.chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
          text: `Monte Carlo Simulation (${this.mcSims} paths, ${this.timePeriod} days)`,
          fontSize: 18
        },
        axisY: {
          title: "Portfolio Value ($)",
          labelFormatter: function(e) {
            return "$" + e.value.toLocaleString();
          }
        },
        axisX: {
          title: "Days",
          interval: Math.max(1, Math.floor(this.timePeriod / 10))
        },
        legend: {
          cursor: "pointer",
          verticalAlign: "top",
          horizontalAlign: "right"
        },
        data: dataSeries
      });

      this.chart.render();
    },

    calculateRiskMeasures() {
      const finalValues = this.portfolioSims.map(sim => sim[sim.length - 1]);
      const sortedValues = [...finalValues].sort((a, b) => a - b);
      
      // Calculate risk metrics
      const VaR95 = this.initialPortfolio - sortedValues[Math.floor(0.05 * sortedValues.length)];
      const CVaR95 = this.initialPortfolio - sortedValues.slice(0, Math.floor(0.05 * sortedValues.length))
        .reduce((sum, val) => sum + val, 0) / Math.floor(0.05 * sortedValues.length);
      
      const expectedFinalValue = finalValues.reduce((sum, val) => sum + val, 0) / finalValues.length;
      const expectedReturn = expectedFinalValue - this.initialPortfolio;
      
      const variance = finalValues.reduce((sum, val) => sum + Math.pow(val - expectedFinalValue, 2), 0) / finalValues.length;
      const volatility = Math.sqrt(variance) / this.initialPortfolio * 100;

      this.riskMeasures = {
        VaR: Math.max(0, VaR95),
        CVaR: Math.max(0, CVaR95),
        expectedReturn,
        volatility
      };

      console.log('Risk measures calculated:', this.riskMeasures);
    }
  }
};
</script>

<style scoped>
#chartContainer {
  height: 370px;
  width: 100%;
}

.monte-carlo-container {
  padding: 20px;
}

.header {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 10px;
}

.control-group {
  display: flex;
  flex-direction: column;
}

.run-btn {
  margin-top: 10px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #000000;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.retry-btn {
  margin-top: 10px;
}

.results-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-container {
  flex: 1;
  height: 370px;
}

.risk-metrics {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.metrics-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.metric-card {
  flex: 1;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.metric-card h4 {
  margin-top: 0;
  margin-bottom: 5px;
}

.metric-card .metric-value {
  font-size: 1.2em;
  font-weight: bold;
}

.metric-card .negative {
  color: #dc3545;
}

.metric-card .positive {
  color: #28a745;
}

.portfolio-composition {
  flex: 1;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.weights-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.weight-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ticker {
  margin-bottom: 5px;
}

.weight-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
}

.weight-fill {
  height: 100%;
  background-color: #000000;
}

.weight-value {
  margin-top: 5px;
}
</style>
