

<template>
  
  <div class="container">
    <div class="Navigation">
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
  
    </div>
    
  
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
  <NewMonteCarloGraph/>
</template>

<script>
import MonteCarloSimulation from "./QuantMonteCarloSimulation.vue";
import DashBoard from "@/components/FinInvest/QuantPage/DashBoard.vue";
import ChatBotTyping from "@/components/FinInvest/QuantPage/ChatBotTyping.vue";
import StockComparision from "@/components/FinInvest/QuantPage/StockComparision.vue";
import StockHeatmap from "@/components/FinInvest/QuantPage/StockHeatmap.vue";
import LoadingPage from "../Home/LoadingPage.vue";
import NewMonteCarloGraph from "@/components/FinInvest/QuantPage/NewMonteCarloGraph.vue";
export default {
  components: {
    ChatBotTyping,
    DashBoard,
    MonteCarloSimulation,
    StockComparision,
    StockHeatmap,
    LoadingPage,
    NewMonteCarloGraph,
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
  background-color: grey;
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
