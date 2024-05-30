Here is the combined code:

<template>
  <div class="wrap-recommend">

    <div class="company-container">
        <div class="company-cards">
        <h1 v-if="searchedStocks && similarStocks && count === 5">
            We found 5 alternatives
        </h1>
        <CompanyCard
            v-for="stock in similarStocks"
            :key="stock.symbol"
            :companyName="stock.symbol"
        />
        </div>
        <div class="searched-company">
        <h1 v-if="similarStocks && searchedStocks && count === 5">
            You searched for:
        </h1>
        <SmallCompanyCard
            v-if="similarStocks && searchedStocks && count === 5"
            :companyName="searchedStocks"
            :width="350"
        />
        <TechAnalysis
            v-if="similarStocks && searchedStocks && count === 5"
            :companyName="searchedStocks"
            :width="350"
            :height="400"
        />
        </div>
    </div>
    <div class="dashboard">
      <header class="dashboard-header">
        <h1>{{ stockName }}</h1>
        <h2>{{ stockSymbol }} <span class="market">Nasdaq Stock Market</span></h2>
        <div class="stock-prices">
          <span class="current-price">190.90 USD</span>
          <span class="price-change">-1.45 (-0.75%)</span>
          <span class="post-market">190.37 -0.53 (-0.28%)</span>
        </div>
        <div class="stock-info">
          <span class="earnings-date">July 24 UPCOMING EARNINGS</span>
          <span class="eps">6.46 EPS</span>
          <span class="market-cap">2.927T MARKET CAP</span>
          <span class="div-yield">0.52% DIV YIELD</span>
          <span class="pe-ratio">29.91 P/E</span>
        </div>
      </header>
      <div class="main-content">
        <section class="key-statistics">
          <h3>Key Statistics</h3>
          <div class="stats-grid">
            <div class="stat">
              <span class="label">Open:</span>
              <span class="value"></span>
            </div>
            <div class="stat">
              <span class="label">Close:</span>
              <span class="value"></span>
            </div>
            <div class="stat">
              <span class="label">52 Week High:</span>
              <span class="value"></span>
            </div>
            <div class="stat">
              <span class="label">52 Week Low:</span>
              <span class="value"></span>
            </div>
            <div class="stat">
              <span class="label">Market Cap:</span>
              <span class="value"></span>
            </div>
            <div class="stat">
              <span class="label">Volume:</span>
              <span class="value"></span>
            </div>
          </div>
        </section>
        <section class="actions">
          <h3>Actions</h3>
          <div class="action-form">
            <input type="text" placeholder="Enter stock symbol" v-model="stockSymbol" />
            <input type="number" placeholder="Quantity" v-model.number="quantity" />
            <div class="buttons">
              <button class="clear-btn" @click="clearForm">CLEAR</button>
              <button class="preview-btn" @click="previewOrder">{{ actionLabel }}</button>
            </div>
          </div>
        </section>
      </div>
      <section class="account-info">
        <h3>Your account:</h3>
        <div class="account-stats">
          <div class="account-stat">
            <span class="label">ACCOUNT VALUE</span>
            <span class="value">99860.35</span>
          </div>
          <div class="account-stat">
            <span class="label">BUYING POWER</span>
            <span class="value">99770.35</span>
          </div>
          <div class="account-stat">
            <span class="label">CASH</span>
            <span class="value">99680.4</span>
          </div>
        </div>
      </section>
      <stock-screener></stock-screener>
    </div>
    <div class="content">
      <div class="header-recommend">
        <h1>Get Similar Stocks & Stock Dashboard</h1>
        <h2>Enter a Stock Symbol to Generate Recommendations and View Dashboard. Reset before Searching Again.</h2>
      </div>
      <div class="bar">
        <input
          class="searchbar"
          type="text"
          placeholder="i.e. AAPL"
          v-model="query"
        />
      </div>
      <div class="buttons">
        <button
          class="button"
          @click="handleSearch"
          :disabled="searching"
        >
          Find Similar Stocks
        </button>
        <button class="button" @click="reset">
          Reset and Search Again
        </button>
      </div>
    </div>
    <div v-if="count !== 5" class="recommend-warning">
      <div class="warning">
        <h3>
          If you see no result, you may have entered an invalid stock symbol
        </h3>
      </div>
      <div class="wrapper">
        <div class="pie spinner"></div>
        <div class="pie filler"></div>
        <div class="mask"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CompanyCard from '@/components/CompanyCard.vue';
import SmallCompanyCard from '@/components/dashboard/SmallCompanyCard.vue';
import TechAnalysis from '@/components/dashboard/TechAnalysis.vue';
import StockScreener from '../components/StockScreener.vue';

export default {
  name: 'RecommendationGeneratorAndDashboard',
  components: {
    CompanyCard,
    SmallCompanyCard,
    TechAnalysis,
    StockScreener,
  },
  data() {
    return {
      query: '',
      similarStocks: [],
      searchedStocks: '',
      searching: false,
      count: 0,
      stockSymbol: '',
      stockName: '',
      quantity: 0,
    };
  },
  computed: {
    actionLabel() {
      return this.quantity >= 0 ? 'PREVIEW BUY ORDER' : 'PREVIEW SELL ORDER';
    },
  },
  methods: {
    async searchSimilarStocks() {
      const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-recommendations?symbol=${this.query}`;
      try {
        const res = await axios.get(url, {
          headers: {
            'x-rapidapi-key': 'a48948c3dbmsh0752220de3da440p119094jsnf7916aa82678',
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
          },
        });
        this.similarStocks = res.data.finance.result[0].quotes;
        this.count = res.data.finance.result[0].count;
      } catch (err) {
        console.log(err);
      }
    },
    handleSearch() {
      this.searching = true;
      this.searchedStocks = this.query;
      this.stockSymbol = this.query;
      this.searchSimilarStocks();
    },
    reset() {
      this.searching = false;
      this.searchedStocks = '';
      this.similarStocks = [];
      this.query = '';
      this.count = 0;
      this.stockSymbol = '';
      this.stockName = '';
      this.quantity = 0;
    },
    clearForm() {
      this.stockSymbol = '';
      this.quantity = 0;
    },
    previewOrder() {
      console.log(`Previewing order: ${this.quantity >= 0 ? 'buy' : 'sell'} ${Math.abs(this.quantity)} shares of ${this.stockSymbol}`);
      // TODO: Trigger/redirect to order preview
    },
    async fetchStockName(stockSymbol) {
      // Fetch the stock name using the stock symbol
      // For this example, let's assume the stock name is fetched successfully
      this.stockName = 'APPLE INC';  // TODO: This would be fetched dynamically
    },
  },
  async mounted() {
    // Get query params
    const urlParams = new URLSearchParams(window.location.search);
    this.stockSymbol = urlParams.get('stock') || '';
    this.quantity = parseInt(urlParams.get('quantity'), 10) || 0;

    // Fetch the stock name
    if (this.stockSymbol) {
      await this.fetchStockName(this.stockSymbol);
    }

    // Automatically trigger the preview order if parameters are present
    if (this.stockSymbol && this.quantity !== 0) {
      this.previewOrder();
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');

.wrap-recommend {
  background-color: white;
  color: #1e06fb;
  font-family: 'Space Grotesk', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  overflow-x:

 hidden;
  padding: 20px;
}

.header-recommend h1,
.header-recommend h2 {
  text-align: center;
  margin: 10px 0;
}

.bar {
  margin: 20px auto;
  width: 100%;
  max-width: 800px;
  border-radius: 40px;
  border: 1px solid #dcdcdc;
  background: white;
  transition: box-shadow 0.3s;
}

.bar:hover,
.bar:focus-within {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
}

.searchbar {
  height: 60px;
  border: none;
  width: calc(100% - 60px);
  font-size: 18px;
  outline: none;
  margin: 0 30px;
}


.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.button {
  background-color: #1e06fb;
  border: none;
  color: white;
  font-size: 15px;
  padding: 12px 20px;
  margin: 5px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.button:hover {
  background-color: #0d04a7;
  transform: translateY(-3px);
}

.button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.recommend-warning {
  text-align: center;
  margin-top: 20px;
}

.wrapper {
  position: relative;
  margin: 40px auto;
  background: white;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
}

.wrapper .pie {
  width: 50%;
  height: 100%;
  transform-origin: 100% 50%;
  position: absolute;
  background: #1e06fb;
}

.wrapper .spinner {
  border-radius: 100% 0 0 100% / 50% 0 0 50%;
  z-index: 200;
  border-right: none;
  animation: rota 5s linear infinite;
}

.wrapper:hover .spinner,
.wrapper:hover .filler,
.wrapper:hover .mask {
  animation-play-state: running;
}

.wrapper .filler {
  border-radius: 0 100% 100% 0 / 0 50% 50% 0;
  left: 50%;
  opacity: 0;
  z-index: 100;
  animation: opa 5s steps(1, end) infinite reverse;
  border-left: none;
}

.wrapper .mask {
  width: 50%;
  height: 100%;
  position: absolute;
  background: inherit;
  opacity: 1;
  z-index: 300;
  animation: opa 5s steps(1, end) infinite;
}

@keyframes rota {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes opa {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.company-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.company-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.searched-company {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
}

@media (min-width: 768px) {
  .company-container {
    flex-direction: row;
    justify-content: space-between;
  }

  .company-cards {
    flex: 2;
  }

  .searched-company {
    flex: 1;
    margin-top: 0;
  }
}

.dashboard {
  font-family: 'Space Grotesk', sans-serif;
  color: #333;
}

.dashboard-header {
  background-color: #1e06fb;
  color: white;
  padding: 20px;
  text-align: center;
}

.dashboard-header h1, .dashboard-header h2 {
  margin: 0;
}

.market {
  font-size: 0.8rem;
  color: #00aaff;
}

.stock-prices {
  margin-top: 10px;
  font-size: 1.2rem;
}

.stock-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  font-size: 0.9rem;
}

.main-content {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;
}

.key-statistics, .actions {
  width: 48%;
}

.key-statistics h3, .actions h3, .account-info h3 {
  margin-bottom: 20px;
  color: #007bff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.stat {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.stat .label {
  font-weight: bold;
}

.actions .action-form {
  display: flex;
  flex-direction: column;
}

.actions input {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
}

.buttons {
  display: flex;
}

.clear-btn, .preview-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.clear-btn {
  background-color: #6c757d;
  color: white;
}

.clear-btn:hover {
  background-color: #5a6268;
}

.preview-btn {
  background-color: #007bff;
  color: white;
}

.preview-btn:hover {
  background-color: #0056b3;
}

.account-info {
  padding: 20px;
}

.account-stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.account-stat {
  text-align: center;
  flex: 1;
  margin: 10px;
}

.account-stat .label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .key-statistics, .actions {
    width: 100%;
    margin-bottom: 20px;
  }

  .stock-info {
    flex-direction: column;
    align-items: center;
  }

  .account-stats {
    flex-direction: column;
    align-items: center;
  }

  .account-stat {
    margin: 5px 0;
  }
}
</style>
```