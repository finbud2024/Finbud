<template>
  <div>
    <div class="Navigation" :style="navStyle">
      <div class="animate__animated animate__fadeInLeft">
        <h1 class="start" :style="headerStyle">Dashboard</h1>
        <h6 :style="labelStyle">Time Period</h6>
        <v-select
          v-model="timePeriod"
          :options="timePeriodOptions"
          placeholder="Time Period"
          :value="timePeriod"
        ></v-select>
        <br />
        <h6 :style="labelStyle">Technical Indicators</h6>
        <v-select
          v-model="indicators"
          :options="indicatorOptions"
          placeholder="Indicator"
          :value="indicators"
        ></v-select>
        <br />
        <h6 :style="labelStyle">Returns</h6>
        <v-select
          v-model="returns"
          :options="returnsOptions"
          placeholder="Returns"
          :value="returns"
        ></v-select>
      </div>
    </div>
    <br /><br />
    <div class="Panel1" :style="panelStyle">
      <div id="main-content" class="panel animate__animated animate__fadeInUp">
        <v-select
          v-model="dropdownTickers"
          :options="tickerOptions"
          placeholder="Select Stock"
          :style="dropdownStyle"
        ></v-select>
        <div id="c_graph">
          <v-chart :options="cGraphOptions"></v-chart>
        </div>
        <div id="graphs">
          <v-chart :options="graphsOptions"></v-chart>
        </div>
        <br />
        <h4 :style="headerCenterStyle">Past Trend vs. Future Projections</h4>
        <h5 :style="headerCenterStyle">Closing Prices</h5>
        <div id="gbm_graph">
          <v-chart :options="gbmGraphOptions"></v-chart>
        </div>
        <br />
        <h5 :style="headerCenterStyle">Daily Volatility (%)</h5>
        <div id="garch_graph">
          <v-chart :options="garchGraphOptions"></v-chart>
        </div>
        <br />
        <h4 :style="headerCenterStyle">Risk Ratios</h4>
        <div>
          <div :style="inlineBlockStyle">
            <h6>Alpha (NIFTY 50)</h6>
            <div id="a_val">{{ aVal }}</div>
          </div>
          <div :style="inlineBlockStyle">
            <h6>Beta (NIFTY 50)</h6>
            <div id="b_val">{{ bVal }}</div>
          </div>
        </div>
        <div>
          <div :style="inlineBlockStyle">
            <h6>Sharpe Ratio</h6>
            <div id="sr_val">{{ srVal }}</div>
          </div>
          <div :style="inlineBlockStyle">
            <h6>Sortino Ratio</h6>
            <div id="sor_val">{{ sorVal }}</div>
          </div>
        </div>
        <div>
          <h6>Standard Deviation</h6>
          <div id="sd_val">{{ sdVal }}</div>
        </div>
      </div>
    </div>
    <div class="Panel2" :style="panelStyle">
      <div id="main-content2" class="panel animate__animated animate__fadeInUp">
        <v-select
          v-model="dropdownTickers2"
          :options="tickerOptions"
          placeholder="Select Stock"
          :style="dropdownStyle"
        ></v-select>
        <div id="c_graph2">
          <v-chart :options="cGraphOptions2"></v-chart>
        </div>
        <div id="graphs2">
          <v-chart :options="graphsOptions2"></v-chart>
        </div>
        <br />
        <h4 :style="headerCenterStyle">Past Trend vs. Future Projections</h4>
        <h5 :style="headerCenterStyle">Closing Prices</h5>
        <div id="gbm_graph2">
          <v-chart :options="gbmGraphOptions2"></v-chart>
        </div>
        <br />
        <h5 :style="headerCenterStyle">Daily Volatility (%)</h5>
        <div id="garch_graph2">
          <v-chart :options="garchGraphOptions2"></v-chart>
        </div>
        <br />
        <h4 :style="headerCenterStyle">Risk Ratios</h4>
        <div>
          <div :style="inlineBlockStyle">
            <h6>Alpha (NIFTY 50)</h6>
            <div id="a_val2">{{ aVal2 }}</div>
          </div>
          <div :style="inlineBlockStyle">
            <h6>Beta (NIFTY 50)</h6>
            <div id="b_val2">{{ bVal2 }}</div>
          </div>
        </div>
        <div>
          <div :style="inlineBlockStyle">
            <h6>Sharpe Ratio</h6>
            <div id="sr_val2">{{ srVal2 }}</div>
          </div>
          <div :style="inlineBlockStyle">
            <h6>Sortino Ratio</h6>
            <div id="sor_val2">{{ sorVal2 }}</div>
          </div>
        </div>
        <div>
          <h6>Standard Deviation</h6>
          <div id="sd_val2">{{ sdVal2 }}</div>
        </div>
      </div>
    </div>
    <br />
    <div class="Panels animate__animated animate__fadeInRight" :style="interpretationStyle">
      <h3 :style="headerCenterStyle">Interpretation</h3>
      <h5>Technical indicators</h5>
      <ul>
        <li>
          Bollinger Bands is a measure of volatility. High volatility is signified
          by wide bands while low volatility is signified by narrow bands.
          Generally, high volatility is followed by low volatility
        </li>
        <li>
          RSI or Relative Strength Index, is a measure to evaluate overbought and
          oversold conditions.
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
          reversal unless there are crossovers. The market is bullish when signal
          line crosses above blue line, bearish when signal line crosses below
          blue line
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
          Sharpe Ratio: Returns generated per unit of risk - the higher the better
        </li>
        <li>Sortino Ratio: Returns as compared to only downside risk</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  alphaBeta,
  sharpeSortino,
  MACD,
  RSI,
  BB,
  SMA,
  EMA,
  getStockPriceFig,
  changeGraph,
  gbm,
  garch,
  N50,
} from "../components/Functions.vue";
import axios from "axios";
import * as d3 from "d3";
import vSelect from "vue-select";
import vChart from "vue-chart";

export default {
  components: {
    vSelect,
    vChart,
  },
  data() {
    return {
      timePeriod: "1y",
      indicators: "Bollinger Bands",
      returns: "Daily Returns",
      dropdownTickers: null,
      dropdownTickers2: null,
      cGraphOptions: {},
      graphsOptions: {},
      gbmGraphOptions: {},
      garchGraphOptions: {},
      aVal: null,
      bVal: null,
      srVal: null,
      sorVal: null,
      sdVal: null,
      cGraphOptions2: {},
      graphsOptions2: {},
      gbmGraphOptions2: {},
      garchGraphOptions2: {},
      aVal2: null,
      bVal2: null,
      srVal2: null,
      sorVal2: null,
      sdVal2: null,
      timePeriodOptions: [
        { label: "6 Months", value: "6m" },
        { label: "1 year", value: "1y" },
        { label: "3 years", value: "3y" },
        { label: "5 years", value: "5y" },
      ],
      indicatorOptions: [
        { label: "RSI", value: "RSI" },
        { label: "SMA", value: "SMA" },
        { label: "EMA", value: "EMA" },
        { label: "MACD", value: "MACD" },
        { label: "Bollinger Bands", value: "Bollinger Bands" },
      ],
      returnsOptions: [
        { label: "Daily Returns", value: "Daily Returns" },
        { label: "Weekly Returns", value: "Weekly Returns" },
        { label: "Monthly Returns", value: "Monthly Returns" },
      ],
      tickerOptions: [],
      navStyle: {
        padding: "20px",
        backgroundColor: "#f0f0f0",
      },
      headerStyle: {
        fontFamily: "Lobster",
        color: "#3E92CC",
      },
      labelStyle: {
        color: "#333",
      },
      panelStyle: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
      },
      dropdownStyle: {
        width: "200px",
        marginBottom: "10px",
      },
      headerCenterStyle: {
        textAlign: "center",
      },
      inlineBlockStyle: {
        display: "inline-block",
        width: "45%",
        textAlign: "center",
      },
      interpretationStyle: {
        padding: "20px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
        borderRadius: "10px",
      },
    };
  },
  watch: {
    timePeriod(newValue, oldValue) {
      this.updateCharts();
    },
    indicators(newValue, oldValue) {
      this.updateCharts();
    },
    returns(newValue, oldValue) {
      this.updateCharts();
    },
    dropdownTickers(newValue, oldValue) {
      this.updateCharts();
    },
    dropdownTickers2(newValue, oldValue) {
      this.updateCharts2();
    },
  },
  methods: {
    async fetchData(ticker, chartOptions, graphOptions, gbmOptions, garchOptions, a, b, sr, sor, sd) {
      const response = await axios.get(
        `/api/stock-data?ticker=${ticker}&timePeriod=${this.timePeriod}`
      );
      const data = response.data;
      chartOptions.series[0].data = data.closePrices;
      graphOptions.series[0].data = data.indicatorData;
      gbmOptions.series[0].data = data.gbmData;
      garchOptions.series[0].data = data.garchData;
      a = data.alpha;
      b = data.beta;
      sr = data.sharpeRatio;
      sor = data.sortinoRatio;
      sd = data.stdDev;
    },
    updateCharts() {
      if (this.dropdownTickers) {
        this.fetchData(
          this.dropdownTickers,
          this.cGraphOptions,
          this.graphsOptions,
          this.gbmGraphOptions,
          this.garchGraphOptions,
          this.aVal,
          this.bVal,
          this.srVal,
          this.sorVal,
          this.sdVal
        );
      }
    },
    updateCharts2() {
      if (this.dropdownTickers2) {
        this.fetchData(
          this.dropdownTickers2,
          this.cGraphOptions2,
          this.graphsOptions2,
          this.gbmGraphOptions2,
          this.garchGraphOptions2,
          this.aVal2,
          this.bVal2,
          this.srVal2,
          this.sorVal2,
          this.sdVal2
        );
      }
    },
  },
  mounted() {
    axios.get("/api/tickers").then((response) => {
      this.tickerOptions = response.data.map((ticker) => ({
        label: ticker,
        value: ticker,
      }));
    });
  },
};
</script>

<style scoped>
.Navigation {
  width: 20%;
  float: left;
}

.Panel1,
.Panel2 {
  width: 40%;
  float: left;
}

.Panels {
  clear: both;
}
</style>