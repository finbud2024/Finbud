<!-- <template>
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
import { ref, onMounted, computed } from "vue";
import csvData from "./assets/economic_indicators.csv";
import IndicatorComparison from "@/components/IndicatorComparison.vue";
import StockPrice from "@/components/StockPrice.vue";
import Indicators from "@/components/Indicators.vue";
import CorrelationMatrix from "@/components/CorrelationMatrix.vue";

export default {
  components: {
    StockPrice,
    Indicators,
    IndicatorComparison,
    CorrelationMatrix,
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
</style> -->

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

<!-- -------------------ORIGINAL REPRESENTATION BEFORE CONVERTING-------------------- -->

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
      dashUrl: "http://127.0.0.1:8054/" // Ensure this URL matches where your Dash app is running
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

<!-- -------------------ALPHAVANTAGE (S&P 500 NOT SUPPORTED)-------------------- -->
<!-- <template>
  <div>
    <h1>Benchmark Data</h1>
    <p v-if="error">{{ error }}</p>
    <div v-else-if="benchmarkData">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in benchmarkData" :key="index">
            <td>{{ data.date }}</td>
            <td>{{ data['1. open'] }}</td>
            <td>{{ data['2. high'] }}</td>
            <td>{{ data['3. low'] }}</td>
            <td>{{ data['4. close'] }}</td>
            <td>{{ data['5. volume'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import alpha from 'alphavantage';

const alphaInstance = alpha({ key: process.env.VUE_APP_STOCK_KEY });

export default {
  name: 'BenchmarkData',
  data() {
    return {
      benchmarkData: null,
      error: null,
    };
  },
  methods: {
    async fetchBenchmarkData() {
      try {
        const data = await this.downloadBenchmarkData();
        if (data) {
          this.saveBenchmarkData(data);
        }
      } catch (error) {
        console.error('Error fetching benchmark data:', error);
        this.error = 'Error fetching benchmark data. Please try again later.';
      }
    },
    async downloadBenchmarkData() {
      try {
        const response = await alphaInstance.data.daily('AMZN', 'full', 'json');
        const timeSeries = response['Time Series (Daily)'];
        const data = Object.keys(timeSeries).map(date => ({
          date,
          ...timeSeries[date],
        }));
        return data;
      } catch (error) {
        console.error('Error fetching benchmark data:', error);
        this.error = 'Error fetching benchmark data. Please try again later.';
        return null;
      }
    },
    saveBenchmarkData(data) {
      if (data) {
        localStorage.setItem('benchmarkData', JSON.stringify(data));
        this.benchmarkData = data;
      }
    },
    loadBenchmarkData() {
      const storedData = localStorage.getItem('benchmarkData');
      if (storedData) {
        this.benchmarkData = JSON.parse(storedData);
      }
    },
  },
  created() {
    this.loadBenchmarkData();
    this.fetchBenchmarkData();
  },
};
</script>

<style scoped>
/* Your component styles here */
</style> -->

<!-- -------------------YAHOO FINANCE (S&P 500 SUPPORTED)-------------------- -->
<!-- <template>
  <div>
    <h1>Benchmark Data</h1>
    <p v-if="error">{{ error }}</p>
    <div v-else-if="benchmarkData">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, index) in benchmarkData" :key="index">
            <td>{{ data.date }}</td>
            <td>{{ data.open }}</td>
            <td>{{ data.high }}</td>
            <td>{{ data.low }}</td>
            <td>{{ data.close }}</td>
            <td>{{ data.volume }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BenchmarkData',
  data() {
    return {
      benchmarkData: null,
      error: null,
    };
  },
  methods: {
    async fetchBenchmarkData() {
      try {
        const data = await this.downloadBenchmarkData();
        if (data) {
          this.saveBenchmarkData(data);
        }
      } catch (error) {
        console.error('Error fetching benchmark data:', error);
        this.error = 'Error fetching benchmark data. Please try again later.';
      }
    },
    async downloadBenchmarkData() {
      const period1 = Math.floor(new Date('2020-01-01').getTime() / 1000);
      const period2 = Math.floor(Date.now() / 1000);
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/%5EGSPC?period1=${period1}&period2=${period2}&interval=1d`;
      const proxyUrl = 'https://corsproxy.io/?'; // CORS proxy URL

      try {
        const response = await fetch(proxyUrl + encodeURIComponent(url));
        const json = await response.json();
        const timeSeries = json.chart.result[0];
        const data = timeSeries.timestamp.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toLocaleDateString(),
          open: timeSeries.indicators.quote[0].open[index],
          high: timeSeries.indicators.quote[0].high[index],
          low: timeSeries.indicators.quote[0].low[index],
          close: timeSeries.indicators.quote[0].close[index],
          volume: timeSeries.indicators.quote[0].volume[index],
        }));
        return data;
      } catch (error) {
        console.error('Error fetching benchmark data:', error);
        this.error = 'Error fetching benchmark data. Please try again later.';
        return null;
      }
    },
    saveBenchmarkData(data) {
      if (data) {
        localStorage.setItem('benchmarkData', JSON.stringify(data));
        this.benchmarkData = data;
      }
    },
    loadBenchmarkData() {
      const storedData = localStorage.getItem('benchmarkData');
      if (storedData) {
        this.benchmarkData = JSON.parse(storedData);
      }
    },
  },
  created() {
    this.loadBenchmarkData();
    this.fetchBenchmarkData();
  },
};
</script>

<style scoped>
/* Your component styles here */
</style> -->

<!-- -------------------TESTING SPACE-------------------- -->

<template>
  <div class="container">
    <div class="Navigation">
      <div class="animated fadeInLeft">
        <h1 class="start">Dashboard</h1>
        <div class="form-group">
          <label>Time Period</label>
          <select v-model="timePeriod" class="dropdown">
            <option value="6m">6 Months</option>
            <option value="1y">1 year</option>
            <option value="3y">3 years</option>
            <option value="5y">5 years</option>
          </select>
        </div>
        <div class="form-group">
          <label>Technical Indicators</label>
          <select v-model="indicator" class="dropdown">
            <option value="RSI">RSI</option>
            <option value="SMA">SMA</option>
            <option value="EMA">EMA</option>
            <option value="MACD">MACD</option>
            <option value="Bollinger Bands">Bollinger Bands</option>
          </select>
        </div>
        <div class="form-group">
          <label>Returns</label>
          <select v-model="returns" class="dropdown">
            <option value="Daily Returns">Daily Returns</option>
            <option value="Cumulative Returns">Cumulative Returns</option>
          </select>
        </div>
      </div>
    </div>
    <br /><br />
    <div class="Panel-Frame">
      <div id="main-content" class="panel animate__animated animate__fadeInUp">
        <select v-model="selectedStock1" class="stock-box">
          <option value="AAPL">Apple Inc.</option>
          <option value="MSFT">Microsoft Corporation</option>
          <option value="AMZN">Amazon.com Inc.</option>
          <option value="TSLA">Tesla Inc.</option>
          <option value="GOOGL">Alphabet Inc. (Google)</option>
        </select>
        <div class="stock-value">
          <div class="change-index" id="c_graph">{{ cGraph }}</div>
          <div class="change-ratio" id="graphs">{{ graphs }}%</div>
        </div>
        <br />
        <div class="stock-graph">
          <div class="chart1">{{ chart1_1 }}</div>
          <div class="chart2">{{ chart1_2 }}</div>

          <div class="indicator-chart" id="indicator_graph">
            {{ IndicatorGraph1 }}
          </div>
          <div class="return-chart" id="return_graph">{{ ReturnGraph1 }}</div>
        </div>
        <br />
        <div class="trend">
          <h4>Past Trend vs. Future Projections</h4>
          <div class="closing-price">
            <h5>Closing Prices</h5>
            <div id="gbm_graph">{{ gbmGraph }}</div>
          </div>
          <br />
          <div class="daily-volatility">
            <h5>Daily Volatility (%)</h5>
            <div id="garch_graph">{{ garchGraph }}</div>
          </div>
        </div>
        <br />
        <div class="Risk-Ratios">
          <h4>Risk Ratios</h4>
          <div class="Risk-info">
            <div class="Risk-Block">
              <div>Alpha (NIFTY 50)</div>
              <p class="Risk-value" id="a_val">{{ alphaRatio }}</p>
              <div>Sharpe Ratio</div>
              <p class="Risk-value" id="sr_val">{{ sharpeRatio }}</p>
            </div>
            <div class="Risk-Block">
              <div>Beta (NIFTY 50)</div>
              <p class="Risk-value" id="b_val">{{ betaRatio }}</p>
              <div>Sortino Ratio</div>
              <p class="Risk-value" id="sor_val">{{ sortinoRatio }}</p>
            </div>
            <div>Standard Deviation</div>
            <p class="Risk-value" id="sd_val">{{ stdDeviation }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="Panel-Frame">
      <div id="main-content2" class="panel animate__animated animate__fadeInUp">
        <select v-model="selectedStock2" class="stock-box">
          <option value="AAPL">Apple Inc.</option>
          <option value="MSFT">Microsoft Corporation</option>
          <option value="AMZN">Amazon.com Inc.</option>
          <option value="TSLA">Tesla Inc.</option>
          <option value="GOOGL">Alphabet Inc. (Google)</option>
        </select>
        <div class="stock-value">
          <div class="change-index" id="c_graph">{{ cGraph2 }}</div>
          <div class="change-ratio" id="graphs">{{ graphs2 }}%</div>
        </div>
        <br />
        <div class="stock-graph">
          <div class="chart1">{{ chart2_1 }}</div>
          <div class="chart2">{{ chart2_2 }}</div>
          <div class="indicator-chart" id="indicator_graph">
            {{ IndicatorGraph2 }}
          </div>
          <div class="return-chart" id="return_graph">{{ ReturnGraph2 }}</div>
        </div>
        <br />
        <div class="trend">
          <h4>Past Trend vs. Future Projections</h4>
          <div class="closing-price">
            <h5>Closing Prices</h5>
            <div id="gbm_graph1">{{ gbmGraph2 }}</div>
          </div>
          <br />
          <div class="daily-volatility">
            <h5>Daily Volatility (%)</h5>
            <div id="garch_graph">{{ garchGraph2 }}</div>
          </div>
        </div>
        <br />
        <div class="Risk-Ratios">
          <h4>Risk Ratios</h4>
          <div class="Risk-info">
            <div class="Risk-Block">
              <div>Alpha (NIFTY 50)</div>
              <p class="Risk-value" id="a_val">{{ alphaRatio2 }}</p>
              <div>Sharpe Ratio</div>
              <p class="Risk-value" id="sr_val">{{ sharpeRatio2 }}</p>
            </div>
            <div class="Risk-Block">
              <div>Beta (NIFTY 50)</div>
              <p class="Risk-value" id="b_val">{{ betaRatio2 }}</p>
              <div>Sortino Ratio</div>
              <p class="Risk-value" id="sor_val">{{ sortinoRatio2 }}</p>
            </div>
            <div>Standard Deviation</div>
            <p class="Risk-value" id="sd_val">{{ stdDeviation2 }}</p>
          </div>
        </div>
      </div>
    </div>
    <br />
    <div
      class="Panels animate__animated animate__fadeInRight"
      style="width: 80%; margin: 0 auto"
    >
      <h3 style="text-align: center">Interpretation</h3>
      <h5>Technical indicators</h5>
      <ul>
        <li>
          Bollinger Bands is a measure of volatility. High volatility is
          signified by wide bands while low volatility is signified by narrow
          bands. Generally, high volatility is followed by low volatility
        </li>
        <li>
          RSI or Relative Strength Index, is a measure to evaluate overbought
          and oversold conditions.
        </li>
        <li>
          SMA or Simple Moving Average using 50 day (fast) and 200 day (slow)
          lines - short term going above long term is bullish trend. Short term
          going below long term is bearish
        </li>
        <li>
          EMA or Exponential Moving Average gives higher significance to recent
          price data
        </li>
        <li>
          MACD or Moving Average Convergence Divergence signifies no trend
          reversal unless there are crossovers. The market is bullish when
          signal line crosses above blue line, bearish when signal line crosses
          below blue line
        </li>
      </ul>
      <h5>Risk ratios</h5>
      <ul>
        <li>Alpha: Return performance as compared to benchmark of market</li>
        <li>
          Beta: Relative price movement of a stock to go up and down as compared
          to the market trend
        </li>
        <li>
          Sharpe Ratio: Returns generated per unit of risk - the higher the
          better
        </li>
        <li>Sortino Ratio: Returns as compared to only downside risk</li>
      </ul>
    </div>
  </div>

  <DashBoard />
  <MonteCarloSimulation />
</template>

<script>
import MonteCarloSimulation from "./MonteCarloSimulation.vue";
import DashBoard from "@/components/quant/DashBoard.vue";

export default {
  components: {
    DashBoard,
    MonteCarloSimulation,
  },
  data() {
    return {
      timePeriod: "1y",
      indicator: "Bollinger Bands",
      returns: "Daily Returns",
      selectedStock1: "",
      selectedStock2: "",
      cGraph: "",
      graphs: "",
      gbmGraph: "",
      garchGraph: "",
      alphaRatio: "",
      betaRatio: "",
      sharpeRatio: "",
      sortinoRatio: "",
      stdDeviation: "",
      cGraph2: "",
      graphs2: "",
      gbmGraph2: "",
      garchGraph2: "",
      alphaRatio2: "",
      betaRatio2: "",
      sharpeRatio2: "",
      sortinoRatio2: "",
      stdDeviation2: "",
      chart1_1: "",
      chart1_2: "",
      chart2_1: "",
      chart2_2: "",
      IndicatorGraph1: "",
      IndicatorGraph2: "",
      ReturnGraph1: "",
      ReturnGraph2: "",
    };
  },
  watch: {
    timePeriod: "updateBothData",
    indicator: "updateBothData",
    returns: "updateBothData",
    selectedStock1: "fetchData",
    selectedStock2: "fetchData2",
  },
  methods: {
    updateBothData() {
      this.fetchData();
      this.fetchData2();
    },
    fetchData() {
      // Update data based on selected options
      this.chart1_1 = `show chart 1 for ${this.selectedStock1}`;
      this.chart1_2 = `show chart 2 for ${this.selectedStock1}`;
      this.IndicatorGraph1 = `show indicator graph for ${this.selectedStock1}`;
      this.ReturnGraph1 = `show return graph for ${this.selectedStock1}`;
      this.cGraph = `478 for ${this.selectedStock1}`;
      this.graphs = `0.98 for ${this.selectedStock1}`;
      this.gbmGraph = `Updated GBM Graph for ${this.selectedStock1} in ${this.timePeriod} with ${this.indicator} and ${this.returns}`;
      this.garchGraph = `Updated GARCH Graph for ${this.selectedStock1} in ${this.timePeriod} with ${this.indicator} and ${this.returns}`;
      this.alphaRatio = `Updated Alpha Ratio for ${this.selectedStock1}`;
      this.betaRatio = `Updated Beta Ratio for ${this.selectedStock1}`;
      this.sharpeRatio = `Updated Sharpe Ratio for ${this.selectedStock1}`;
      this.sortinoRatio = `Updated Sortino Ratio for ${this.selectedStock1}`;
      this.stdDeviation = `Updated Standard Deviation for ${this.selectedStock1}`;
    },
    fetchData2() {
      // Update data based on selected options for the second panel
      this.chart2_1 = `show chart 1 for ${this.selectedStock2}`;
      this.chart2_2 = `show chart 2 for ${this.selectedStock2}`;
      this.IndicatorGraph2 = `show indicator graph for ${this.selectedStock2}`;
      this.ReturnGraph2 = `show return graph for ${this.selectedStock2}`;
      this.cGraph2 = `376 for ${this.selectedStock2}`;
      this.graphs2 = `0.76 for ${this.selectedStock2}`;
      this.gbmGraph2 = `Updated GBM Graph for ${this.selectedStock2} in ${this.timePeriod} with ${this.indicator} and ${this.returns}`;
      this.garchGraph2 = `Updated GARCH Graph for ${this.selectedStock2} in ${this.timePeriod} with ${this.indicator} and ${this.returns}`;
      this.alphaRatio2 = `Updated Alpha Ratio for ${this.selectedStock2}`;
      this.betaRatio2 = `Updated Beta Ratio for ${this.selectedStock2}`;
      this.sharpeRatio2 = `Updated Sharpe Ratio for ${this.selectedStock2}`;
      this.sortinoRatio2 = `Updated Sortino Ratio for ${this.selectedStock2}`;
      this.stdDeviation2 = `Updated Standard Deviation for ${this.selectedStock2}`;
    },
  },
};
</script>

<style scoped>
.Navigation {
  background-color: #2b2b2b;
  padding: 20px;
  border-radius: 10px;
  max-width: 100%;
  margin: 0 auto;
}

.animated {
  animation-duration: 1s;
}

.dropdown {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
  background-color: #fff;
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

h1 {
  text-align: center;
  color: rgba(255, 255, 255, 0.1);
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 30px;
}

label {
  display: block;
  color: white;
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.panel {
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.Panels {
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.Panel-Frame {
  width: 48%;
  display: inline-block;
  vertical-align: top;
  margin: 0 1%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.stock-box {
  width: 60%;
  margin: 0 auto;
  display: block;
  margin-bottom: 30px;
}

.stock-value {
  text-align: center;
}

.change-index {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.change-ratio {
  font-size: 1rem;
  color: green;
}

h4 {
  text-align: center;
  font-size: 1.5rem;
  /* margin-bottom: -5px; */
}

h5 {
  text-align: center;
  font-size: 1.2rem;
}

.Risk-info {
  margin-top: 0px;
}

.Risk-Block {
  width: 49%;
  display: inline-block;
}

.Risk-value {
  margin-top: 10px;
  font-size: 15px;
}

.stock-graph {
  align-items: center;
  justify-content: center;
  text-align: center;
}

.trend {
  align-items: center;
  justify-content: center;
  text-align: center;
}

@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
</style>
