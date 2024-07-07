<template>
  <div>
    <h1>Stock Dashboard</h1>
    <div>
      <label for="stock-select">Select Stock:</label>
      <select id="stock-select" v-model="selectedStock" @change="fetchStockData">
        <option v-for="stock in stocks" :key="stock.value" :value="stock.value">{{ stock.label }}</option>
      </select>
    </div>
    <StockChart v-if="stockData" :stockData="stockData" />
  </div>
</template>

<script>
import StockChart from '@/components/StockChart.vue';

export default {
  components: {
    StockChart,
  },
  data() {
    return {
      selectedStock: 'AAPL',
      stockData: null,
      stocks: [
        { label: 'Apple Inc.', value: 'AAPL' },
        { label: 'Microsoft Corporation', value: 'MSFT' },
        { label: 'Amazon.com Inc.', value: 'AMZN' },
        { label: 'Tesla Inc.', value: 'TSLA' },
        { label: 'Alphabet Inc. (Google)', value: 'GOOGL' },
      ],
    };
  },
  mounted() {
    this.fetchStockData();
  },
  methods: {
    fetchStockData() {
      // Mock data for demonstration
      const mockData = [
        { date: '2023-01-01', close: 150 },
        { date: '2023-01-02', close: 152 },
        { date: '2023-01-03', close: 148 },
        { date: '2023-01-04', close: 155 },
        { date: '2023-01-05', close: 157 },
      ];
      this.stockData = {
        dates: mockData.map(item => item.date),
        prices: mockData.map(item => item.close),
      };
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
}

div {
  margin: 20px;
}
</style>

<!-- <script>
// Import necessary modules
const yahooFinance = require('yahoo-finance');
const fs = require('fs');
const path = require('path');

export default {
  name: 'YahooFinanceDownloader',
  methods: {
    async N50() {
      const now = new Date();
      const today345pm = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 45, 0, 0);
      
      const benchmarkFile = 'benchmark.csv';
      let beta_r = [];

      try {
        // Check if benchmark file exists
        if (fs.existsSync(benchmarkFile)) {
          // Read existing benchmark data
          beta_r = JSON.parse(fs.readFileSync(benchmarkFile, 'utf8'));

          // Check if data is not empty and update condition meets
          if (beta_r.length > 0) {
            const lastDate = beta_r[beta_r.length - 1].Date;
            if (lastDate !== new Date().toISOString().slice(0, 10) && now > today345pm) {
              // Download new data
              const data = await yahooFinance.historical({
                symbol: '^NSEI',
                from: '2020-01-01',
                to: new Date().toISOString().slice(0, 10)
              });

              // Append new data to existing
              beta_r.push(...data);
              fs.writeFileSync(benchmarkFile, JSON.stringify(beta_r, null, 2));
            }
          } else {
            // Download data if empty
            beta_r = await yahooFinance.historical({
              symbol: '^NSEI',
              from: '2020-01-01',
              to: new Date().toISOString().slice(0, 10)
            });

            fs.writeFileSync(benchmarkFile, JSON.stringify(beta_r, null, 2));
          }
        } else {
          // Download data if file doesn't exist
          beta_r = await yahooFinance.historical({
            symbol: '^NSEI',
            from: '2020-01-01',
            to: new Date().toISOString().slice(0, 10)
          });

          fs.writeFileSync(benchmarkFile, JSON.stringify(beta_r, null, 2));
        }
      } catch (error) {
        console.error('Error:', error);
      }

      return beta_r;
    }
  },
  async mounted() {
    // Call the N50 function on component mount
    const data = await this.N50();
    console.log('Downloaded data:', data);
  }
}
</script>

<style scoped>
/* Your component-specific styles */
</style> -->

<!-- <template>
  <div class="container">
    <div class="Navigation" style="background-color: #2b2b2b; padding: 20px; border-radius: 10px;">
      <div class="animate__animated animate__fadeInLeft">
        <h1 class="start" style="text-align: center;">Dashboard</h1>
        <h6 style="color: white;">Time Period</h6>
        <select v-model="timePeriod">
          <option value="6m">6 Months</option>
          <option value="1y">1 year</option>
          <option value="3y">3 years</option>
          <option value="5y">5 years</option>
        </select>
        <br><br>
        <h6 style="color: white;">Technical Indicators</h6>
        <select v-model="indicator">
          <option value="RSI">RSI</option>
          <option value="SMA">SMA</option>
          <option value="EMA">EMA</option>
          <option value="MACD">MACD</option>
          <option value="Bollinger Bands">Bollinger Bands</option>
        </select>
        <br><br>
        <h6 style="color: white;">Returns</h6>
        <select v-model="returns">
          <option value="Daily Returns">Daily Returns</option>
          <option value="Cumulative Returns">Cumulative Returns</option>
        </select>
      </div>
    </div>
    <br><br>
    <div class="Panel1" style="width: 48%; display: inline-block; vertical-align: top; margin: 0 1%;">
      <div id="main-content" class="panel animate__animated animate__fadeInUp">
        <select v-model="selectedStock1" style="width: 80%; margin: 0 auto;">
          <option value="AAPL">Apple Inc.</option>
          <option value="MSFT">Microsoft Corporation</option>
          <option value="AMZN">Amazon.com Inc.</option>
          <option value="TSLA">Tesla Inc.</option>
          <option value="GOOGL">Alphabet Inc. (Google)</option>
        </select>
        <div id="c_graph">{{ cGraph }}</div>
        <div id="graphs">{{ graphs }}</div>
        <br>
        <h4 style="text-align: center;">Past Trend vs. Future Projections</h4>
        <h5 style="text-align: center;">Closing Prices</h5>
        <div id="gbm_graph">{{ gbmGraph }}</div>
        <br>
        <h5 style="text-align: center;">Daily Volatility (%)</h5>
        <div id="garch_graph">{{ garchGraph }}</div>
        <br>
        <h4 style="text-align: center;">Risk Ratios</h4>
        <div style="width: 49%; display: inline-block;">
          <h6>Alpha (NIFTY 50)</h6>
          <div id="a_val">{{ alphaRatio }}</div>
        </div>
        <div style="width: 49%; display: inline-block;">
          <h6>Beta (NIFTY 50)</h6>
          <div id="b_val">{{ betaRatio }}</div>
        </div>
        <div style="width: 49%; display: inline-block;">
          <h6>Sharpe Ratio</h6>
          <div id="sr_val">{{ sharpeRatio }}</div>
        </div>
        <div style="width: 49%; display: inline-block;">
          <h6>Sortino Ratio</h6>
          <div id="sor_val">{{ sortinoRatio }}</div>
        </div>
        <div>
          <h6>Standard Deviation</h6>
          <div id="sd_val">{{ stdDeviation }}</div>
        </div>
      </div>
    </div>
    <div class="Panel2" style="width: 48%; display: inline-block; vertical-align: top; margin: 0 1%;">
      <div id="main-content2" class="panel animate__animated animate__fadeInUp">
        <select v-model="selectedStock2" style="width: 80%; margin: 0 auto;">
          <option value="AAPL">Apple Inc.</option>
          <option value="MSFT">Microsoft Corporation</option>
          <option value="AMZN">Amazon.com Inc.</option>
          <option value="TSLA">Tesla Inc.</option>
          <option value="GOOGL">Alphabet Inc. (Google)</option>
        </select>
        <div id="c_graph2">{{ cGraph2 }}</div>
        <div id="graphs2">{{ graphs2 }}</div>
        <br>
        <h4 style="text-align: center;">Past Trend vs. Future Projections</h4>
        <h5 style="text-align: center;">Closing Prices</h5>
        <div id="gbm_graph2">{{ gbmGraph2 }}</div>
        <br>
        <h5 style="text-align: center;">Daily Volatility (%)</h5>
        <div id="garch_graph2">{{ garchGraph2 }}</div>
        <br>
        <h4 style="text-align: center;">Risk Ratios</h4>
        <div style="width: 49%; display: inline-block;">
          <h6>Alpha (NIFTY 50)</h6>
          <div id="a_val2">{{ alphaRatio2 }}</div>
        </div>
        <div style="width: 49%; display: inline-block;">
          <h6>Beta (NIFTY 50)</h6>
          <div id="b_val2">{{ betaRatio2 }}</div>
        </div>
        <div style="width: 49%; display: inline-block;">
          <h6>Sharpe Ratio</h6>
          <div id="sr_val2">{{ sharpeRatio2 }}</div>
        </div>
        <div style="width: 49%; display: inline-block;">
          <h6>Sortino Ratio</h6>
          <div id="sor_val2">{{ sortinoRatio2 }}</div>
        </div>
        <div>
          <h6>Standard Deviation</h6>
          <div id="sd_val2">{{ stdDeviation2 }}</div>
        </div>
      </div>
    </div>
    <br>
    <div class="Panels animate__animated animate__fadeInRight" style="width: 80%; margin: 0 auto;">
      <h3 style="text-align: center;">Interpretation</h3>
      <h5>Technical indicators</h5>
      <ul>
        <li>Bollinger Bands is a measure of volatility. High volatility is signified by wide bands while low volatility is signified by narrow bands. Generally, high volatility is followed by low volatility</li>
        <li>RSI or Relative Strength Index, is a measure to evaluate overbought and oversold conditions.</li>
        <li>SMA or Simple Moving Average using 50 day (fast) and 200 day (slow) lines - short term going above long term is bullish trend. Short term going below long term is bearish</li>
        <li>EMA or Exponential Moving Average gives higher significance to recent price data</li>
        <li>MACD or Moving Average Convergence Divergence signifies no trend reversal unless there are crossovers. The market is bullish when signal line crosses above blue line, bearish when signal line crosses below blue line</li>
      </ul>
      <h5>Risk ratios</h5>
      <ul>
        <li>Alpha: Return performance as compared to benchmark of market</li>
        <li>Beta: Relative price movement of a stock to go up and down as compared to the market trend</li>
        <li>Sharpe Ratio: Returns generated per unit of risk - the higher the better</li>
        <li>Sortino Ratio: Returns as compared to only downside risk</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timePeriod: '1y',
      indicator: 'Bollinger Bands',
      returns: 'Daily Returns',
      selectedStock1: 'AAPL',
      selectedStock2: 'AAPL',
      cGraph: '',
      graphs: '',
      gbmGraph: '',
      garchGraph: '',
      alphaRatio: '',
      betaRatio: '',
      sharpeRatio: '',
      sortinoRatio: '',
      stdDeviation: '',
      cGraph2: '',
      graphs2: '',
      gbmGraph2: '',
      garchGraph2: '',
      alphaRatio2: '',
      betaRatio2: '',
      sharpeRatio2: '',
      sortinoRatio2: '',
      stdDeviation2: ''
    };
  },
  watch: {
    timePeriod: 'fetchData',
    selectedStock1: 'fetchData',
    indicator: 'fetchData',
    returns: 'fetchData',
    selectedStock2: 'fetchData2'
  },
  methods: {
    fetchData() {
      // Implement the logic to fetch data based on selected options
      // Need to adapt your Python functions to JavaScript equivalents
    },
    fetchData2() {
      // Implement the logic to fetch data based on selected options for the second panel
      // Need to adapt your Python functions to JavaScript equivalents
    }
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
</style> -->




<!-- <template>
  <div class="dash-embed">
    <iframe :src="dashUrl" frameborder="0" class="dash-iframe"></iframe>
  </div>
</template>

<script>
export default {
   name: 'QuantAnalysis',
  data() {
    return {
      dashUrl: "http://127.0.0.1:8051/" // Ensure this URL matches where your Dash app is running
    };
  }
};
</script>

<style scoped>
.dash-embed {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.dash-iframe {
  width: 100%;
  height: 100vh; /* Adjust height as needed */
  border: none;
}
</style> -->
