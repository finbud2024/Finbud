<template>
  <div class="container">
    <div class="Navigation animated fadeInLeft">
      <h1 class="start">Dashboard</h1>

      <div class="form-group">
        <label>Time Period</label>
        <select v-model="timePeriod" class="dropdown">
          <option value="6m">6 Months</option>
          <option value="1y">1 Year</option>
          <option value="3y">3 Years</option>
          <option value="5y">5 Years</option>
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

    <br><br>

    <div class="Panel-Frame">
      <div id="main-content" class="panel animate__fadeInUp">
        <select v-model="selectedStock1" class="stock-box" @change="fetchData1">
          <option value="">Select a stock</option>
          <option value="AAPL">Apple Inc.</option>
          <option value="MSFT">Microsoft Corporation</option>
          <option value="AMZN">Amazon.com Inc.</option>
          <option value="TSLA">Tesla Inc.</option>
          <option value="GOOGL">Alphabet Inc. (Google)</option>
        </select>

        <div class="stock-value" v-if="selectedStock1">
          <div class="change-index">{{ cGraph1 }}</div>
          <div class="change-ratio">{{ graphs1 }}%</div>
        </div>
        
        <br>
        
        <div class="stock-graph" v-if="selectedStock1">
          <h4>Stock Price</h4>
          <StockPrice :stockSymbol="selectedStock1" />
          <h4>Technical Indicators</h4>
          <Indicators :stockSymbol="selectedStock1" />
          <h4>Return Graph</h4>
          <div class="return-chart">{{ ReturnGraph1 }}</div>
        </div>
      </div>
    </div>

    <div class="Panel-Frame">
      <div id="main-content2" class="panel animate__fadeInUp">
        <select v-model="selectedStock2" class="stock-box" @change="fetchData2">
          <option value="">Select a stock</option>
          <option value="AAPL">Apple Inc.</option>
          <option value="MSFT">Microsoft Corporation</option>
          <option value="AMZN">Amazon.com Inc.</option>
          <option value="TSLA">Tesla Inc.</option>
          <option value="GOOGL">Alphabet Inc. (Google)</option>
        </select>

        <div class="stock-value" v-if="selectedStock2">
          <div class="change-index">{{ cGraph2 }}</div>
          <div class="change-ratio">{{ graphs2 }}%</div>
        </div>
        
        <br>
        
        <div class="stock-graph" v-if="selectedStock2">
          <h4>Stock Price</h4>
          <StockPrice :stockSymbol="selectedStock2" />
          <h4>Technical Indicators</h4>
          <Indicators :stockSymbol="selectedStock2" />
          <h4>Return Graph</h4>
          <div class="return-chart">{{ ReturnGraph2 }}</div>
        </div>
      </div>
    </div>

    <br>

    <div class="Panels animate__fadeInRight" style="width: 80%; margin: 0 auto;">
      <h3 style="text-align: center;">Interpretation</h3>

      <h5>Technical indicators</h5>
      <ul>
        <li>Bollinger Bands indicate volatility. Wide bands = high volatility; narrow bands = low volatility. High volatility is generally followed by low volatility.</li>
        <li>RSI (Relative Strength Index) evaluates overbought and oversold conditions.</li>
        <li>SMA (Simple Moving Average): 50-day (fast) above 200-day (slow) = bullish; below = bearish.</li>
        <li>EMA (Exponential Moving Average) gives higher significance to recent price data.</li>
        <li>MACD (Moving Average Convergence Divergence) indicates trend reversals at crossovers. Bullish = signal line above the MACD line; bearish = below.</li>
      </ul>

      <h5>Risk ratios</h5>
      <ul>
        <li>Alpha: Performance compared to the market benchmark.</li>
        <li>Beta: Price movement relative to the market trend.</li>
        <li>Sharpe Ratio: Returns per unit of risk—higher is better.</li>
        <li>Sortino Ratio: Returns compared to downside risk only.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import StockPrice from "@/components/StockPrice.vue";
import Indicators from "@/components/Indicators.vue";

export default {
  components: {
    StockPrice,
    Indicators,
  },
  data() {
    return {
      timePeriod: "1y",
      indicator: "Bollinger Bands",
      returns: "Daily Returns",

      // Data for the first stock
      selectedStock1: "",
      cGraph1: "",
      graphs1: "",
      IndicatorGraph1: "",
      ReturnGraph1: "",

      // Data for the second stock
      selectedStock2: "",
      cGraph2: "",
      graphs2: "",
      IndicatorGraph2: "",
      ReturnGraph2: "",
    };
  },

  watch: {
    timePeriod: "updateBothData",
    indicator: "updateBothData",
    returns: "updateBothData",
    selectedStock1: "fetchData1",
    selectedStock2: "fetchData2",
  },
  methods: {
    updateBothData() {
      this.fetchData1();
      this.fetchData2();
    },
    fetchData1() {
      this.clearChartData1();
      this.loadIndicatorsData1(this.selectedStock1);
    },
    fetchData2() {
      this.clearChartData2();
      this.loadIndicatorsData2(this.selectedStock2);
    },
    clearChartData1() {
      this.IndicatorGraph1 = "";
      this.ReturnGraph1 = "";
      this.cGraph1 = "";
      this.graphs1 = "";
    },
    clearChartData2() {
      this.IndicatorGraph2 = "";
      this.ReturnGraph2 = "";
      this.cGraph2 = "";
      this.graphs2 = "";
    },
    loadIndicatorsData1(stockSymbol) {
      // Update data based on selected options for the first panel
      this.IndicatorGraph1 = `show indicator graph for ${stockSymbol}`;
      this.ReturnGraph1 = `show return graph for ${stockSymbol}`;
      this.cGraph1 = `478 for ${stockSymbol}`;
      this.graphs1 = `0.98 for ${stockSymbol}`;
    },
    loadIndicatorsData2(stockSymbol) {
      // Update data based on selected options for the second panel
      this.IndicatorGraph2 = `show indicator graph for ${stockSymbol}`;
      this.ReturnGraph2 = `show return graph for ${stockSymbol}`;
      this.cGraph2 = `376 for ${stockSymbol}`;
      this.graphs2 = `0.76 for ${stockSymbol}`;
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

.Risk-Block{
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



@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
</style>
