

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
    <StockComparision
      v-model:selectedTickers="selectedTickers"
      :indicator="indicator"
      :period="period"
      :returnType="returnType"
           
    :dataSource="'SPX500'"
    :grouping="'sector'"
    :blockSize="'market_cap_basic'"
    :blockColor="'change'"
    :colorTheme="'light'"
    :width="'100%'"
    :height="'600px'"/>
  
    <br /><br />

    <br />
    <div
      class="Panels animate__animated animate__fadeInRight"
      style="width: 80%; margin: 0 auto"
    >
      <h3 style="text-align: center">Interpretation</h3>
      <ChatBotTyping :message="technicalIndicators" />
      <ChatBotTyping :message="riskRatio" />
    </div>
  </div>

<DashBoard/>
<div class="container">
  <StockHeatmap      
  :width="'100%'" 
  :height="'1000px'" />
</div>
  <MonteCarloSimulation />
</template>

<script>
import MonteCarloSimulation from "./QuantMonteCarloSimulation.vue";
import DashBoard from "@/components/FinInvest/QuantPage/DashBoard.vue";
import ChatBotTyping from "@/components/FinInvest/QuantPage/ChatBotTyping.vue";
import StockComparision from "@/components/FinInvest/QuantPage/StockComparision.vue";
import StockHeatmap from "@/components/FinInvest/QuantPage/StockHeatmap.vue";
export default {
  components: {
    ChatBotTyping,
    DashBoard,
    MonteCarloSimulation,
    StockComparision,
    StockHeatmap,
  },
  data() {
    return {
    selectedTickers: ['AAPL', 'MSFT'],  // or empty: []
    indicator: 'RSI',                   // default indicator
    period: '1y',                       // default time period
    returnType: 'Daily Returns',        // or 'Cumulative Returns'
      stockData: [
        { symbol: 'AAPL', change: 0.0234 },
        { symbol: 'MSFT', change: -0.0156 },
        { symbol: 'GOOGL', change: 0.0567 },
        { symbol: 'AMZN', change: -0.0321 },
        { symbol: 'TSLA', change: 0.1123 },
        { symbol: 'FB', change: -0.0089 },
        { symbol: 'NVDA', change: 0.0456 },
        { symbol: 'PYPL', change: -0.0678 },
        // Add more stocks as needed
      ],
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
    handleStockClick(stock) {
      console.log('Stock clicked:', stock);
      // You can navigate to stock details or show a modal here
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
  width: 100%;
  height: 100%;
  padding:20px;
  align:center;
}
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

.no-fade {
  animation: none;       /* disables fade / opacity 0 → 1 */
  transform: translateX(0); /* keep it static */
}

@import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
</style>
