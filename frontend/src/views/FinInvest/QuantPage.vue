<template>
    <div class="Navigation">
      <div class="quant-header">
        <h1>{{ $t('quantAnalysisPage.title') }}</h1>
        <p>{{ $t('quantAnalysisPage.subtitle') }}</p>
      </div>

      <div class="quant-grid">
        <div class="chart-section">
          <div class="chart-container">
            <div class="chart-title">{{ $t('quantAnalysisPage.sections.marketAnalysis') }}</div>
            <div v-if="loading" class="chart-loading">
              <div class="loading-spinner"></div>
              <div class="loading-text">{{ $t('quantAnalysisPage.loading') }}</div>
            </div>
            <StockComparision
              v-else
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
              :height="'400px'"
              class="chart-component"
            />
          </div>
        </div>

        <div class="dashboard-section">
          <div class="chart-container">
            <div class="chart-title">{{ $t('quantAnalysisPage.sections.dashboard') }}</div>
            <DashBoard class="chart-component" />
          </div>
        </div>

        <div class="heatmap-section">
          <div class="chart-container">
            <div class="chart-title">{{ $t('quantAnalysisPage.sections.heatmap') }}</div>
            <div v-if="loading" class="chart-loading">
              <div class="loading-spinner"></div>
              <div class="loading-text">{{ $t('quantAnalysisPage.loadingHeatmap') }}</div>
            </div>
            <StockHeatmap v-else class="chart-component" />
          </div>
        </div>

        <div class="monte-carlo-section">
          <div class="chart-container">
            <div class="chart-title">{{ $t('quantAnalysisPage.sections.monteCarlo') }}</div>
            <div v-if="loading" class="chart-loading">
              <div class="loading-spinner"></div>
              <div class="loading-text">{{ $t('quantAnalysisPage.loadingMonteCarlo') }}</div>
            </div>
            <NewMonteCarloGraph v-else class="chart-component" />
          </div>
        </div>
      </div>

      <div class="Panels">
        <h3>{{ $t('quantAnalysisPage.interpretation') }}</h3>
        <ChatBotTyping :message="technicalIndicators" />
        <ChatBotTyping :message="riskRatio" />
      </div>
    </div>
</template>

<script>
import MonteCarloSimulation from "./QuantMonteCarloSimulation.vue";
import DashBoard from "@/components/FinInvest/QuantPage/DashBoard.vue";
import ChatBotTyping from "@/components/FinInvest/QuantPage/ChatBotTyping.vue";
import StockComparision from "@/components/FinInvest/QuantPage/StockComparision.vue";
import StockHeatmap from "@/components/FinInvest/QuantPage/StockHeatmap.vue";
import LoadingPage from "../Home/LoadingPage.vue";
import NewMonteCarloGraph from "@/components/FinInvest/QuantPage/NewMonteCarloGraph.vue";

const templateChat = `
<b>GBM vs. GARCH Models</b><br/><br/>
The chart above compares stock price simulations using two models:<br/><br/>
<ul>
  <li><b>GBM (Geometric Brownian Motion):</b> Assumes constant volatility and normally distributed returns. Commonly used in financial modeling for its simplicity.</li>
  <li><b>GARCH (Generalized Autoregressive Conditional Heteroskedasticity):</b> Accounts for changing (time-varying) volatility over time, making it more suitable for modeling real-world market behavior and shocks.</li>
</ul>
<br/>
Use this comparison to evaluate how volatility assumptions affect projected price paths over time.
`;

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
      loading: true,
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
      riskRatio: `Risk ratios
      
        <li>Alpha: Return performance as compared to benchmark of market</li>
        <li>Beta: Relative price movement of a stock to go up and down as compared to the market trend
        </li>
        <li>Sharpe Ratio: Returns generated per unit of risk - the higher the better
        </li>
        <li>Sortino Ratio: Returns as compared to only downside risk</li>
      `,
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
  mounted() {
    // Simulate loading time for demonstration
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  },
  watch: {
    selectedTickers() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    },
    indicator() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    },
    period() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1500);
    },
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
.Navigation {
  background: var(--bg-primary);
  padding: 2rem;
  max-width: 1800px;
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden; /* Prevent horizontal overflow */
}

.Navigation::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.03) 0%,
    transparent 70%
  );
  z-index: 0;
  animation: pulse 15s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.3; }
  100% { transform: scale(1); opacity: 0.5; }
}

.quant-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
}

.quant-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.quant-header p {
  font-size: 1.2rem;
  color: var(--text-secondary);
}

/* Force single column layout for all screen sizes */
.quant-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.chart-section,
.dashboard-section,
.heatmap-section,
.monte-carlo-section {
  position: relative;
  z-index: 1;
  width: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-container {
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  position: relative;
  height: 100%;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  box-sizing: border-box;
  overflow: hidden; /* Prevent content overflow */
}

.chart-container:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.chart-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--bg-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--bg-secondary);
  flex-shrink: 0;
}

.chart-component {
  flex: 1;
  width: 100%;
  height: auto;
  min-height: 300px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Panels Section */
.Panels {
  background: var(--text-primary);
  color: var(--bg-primary);
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.Panels h3 {
  color: var(--bg-primary);
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Loading States */
.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(var(--bg-primary-rgb), 0.9);
  backdrop-filter: blur(5px);
  border-radius: 15px;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--accent-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 1rem;
  color: var(--text-primary);
  font-size: 0.9rem;
}

/* Animations */
@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .Navigation {
    padding: 1.5rem;
  }

  .quant-header h1 {
    font-size: 2rem;
  }

  .quant-header p {
    font-size: 1rem;
  }

  .quant-grid {
    gap: 1.5rem;
  }

  .chart-container {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .Navigation {
    padding: 1rem;
  }

  .quant-header h1 {
    font-size: 1.8rem;
  }

  .chart-section,
  .dashboard-section,
  .heatmap-section,
  .monte-carlo-section {
    min-height: 300px;
  }

  .chart-container {
    padding: 1rem;
  }

  .Panels {
    padding: 1.5rem;
  }

  .Panels h3 {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .quant-header h1 {
    font-size: 1.5rem;
  }

  .chart-title {
    font-size: 1rem;
  }

  .chart-section,
  .dashboard-section,
  .heatmap-section,
  .monte-carlo-section {
    min-height: 250px;
  }

  .Panels h3 {
    font-size: 1.2rem;
  }
}
</style>
