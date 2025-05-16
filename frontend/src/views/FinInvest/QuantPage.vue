
<template>
  <div class="container">
    <div class="Navigation">
      <div class="animated no-fade">
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
      <ChatBotTyping :message="technicalIndicators" />
      <ChatBotTyping :message="riskRatio" />
    </div>
  <StockComparision/>

  <DashBoard />
  <MonteCarloSimulation />

</div>
</template>

<script>
import MonteCarloSimulation from "./QuantMonteCarloSimulation.vue";
import DashBoard from "@/components/finInvest/quantPage/DashBoard.vue";
import ChatBotTyping from "@/components/finInvest/quantPage/ChatBotTyping.vue";
import StockComparision from "@/components/finInvest/quantPage/StockComparision.vue";
import IndicatorGraph from "@/components/finInvest/quantPage/IndicatorGraph.vue";
import ReturnGraph from "@/components/finInvest/quantPage/ReturnGraph.vue";
import GBMGraph from "@/components/finInvest/quantPage/GBMGraph.vue";
import GARCHGraph from "@/components/finInvest/quantPage/GARCHGraph.vue";
export default {
  components: {
    ChatBotTyping,
    DashBoard,
    MonteCarloSimulation,
    StockComparision,
    IndicatorGraph,
    ReturnGraph,
    GBMGraph,
    GARCHGraph,
  },
  data() {
    return {
      riskRatio: `<h5>Risk ratios</h5>
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
      </ul>`,
      technicalIndicators: `<h5>Technical indicators</h5>
  <ul>
    <li>
      Bollinger Bands is a measure of volatility. High volatility is
      signified by wide bands while low volatility is signified by narrow
      bands. Generally, high volatility is followed by low volatility.
    </li>
    <li>
      RSI or Relative Strength Index is a measure to evaluate overbought
      and oversold conditions.
    </li>
    <li>
      SMA or Simple Moving Average using 50-day (fast) and 200-day (slow)
      lines - short term going above long term is bullish; short term
      going below long term is bearish.
    </li>
    <li>
      EMA or Exponential Moving Average gives higher significance to recent
      price data.
    </li>
    <li>
      MACD or Moving Average Convergence Divergence signifies no trend
      reversal unless there are crossovers. The market is bullish when
      the signal line crosses above the blue line, and bearish when it crosses
      below.
    </li>
  </ul>`,
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
.container {
  background-color: var(--quant-background);
  padding: 20px;
  border-radius: 10px;
  max-width: 100%;
  margin: 0 auto;
}

.Navigation {
  background-color: var(--quant-section-background);
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
  border: 1px solid var(--quant-border-color);
  border-radius: 5px;
  font-size: 1rem;
  color: var(--quant-text-secondary);
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
  color: var(--quant-text-primary);
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 30px;
}

label {
  display: block;
  color: var(--quant-text-primary);
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.panel {
  background-color: var(--quant-section-background);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}



.Panel-Frame {
  width: 50%;
  display: inline-block;
  vertical-align: top;
  margin: 0;
}



.stock-box {
  width: 60%;
  margin: 0 auto;
  display: block;
  margin-bottom: 30px;
}

.stock-value {
  text-align: center;
  color: var(--quant-text-primary);
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
.Risk-Ratios{
  text-align: center;
  font-size: 1rem;
  margin-top: 20px;
  color: var(--quant-text-primary);
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
  color:var(--quant-text-primary);
}

.trend {
  align-items: center;
  justify-content: center;
  text-align: center;
  color:var(--quant-text-primary);
}

.no-fade {
  animation: none;       /* disables fade / opacity 0 → 1 */
  transform: translateX(0); /* keep it static */
}

@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
</style>