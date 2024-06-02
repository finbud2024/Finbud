Here is the combined code:

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>APPLE INC</h1>
      <h2>{{ SYMBOL }} <span class="market">Nasdaq Stock Market</span></h2>
      <div class="stock-prices">
        <span class="current-price">{{ appleData.price }} USD</span>
        <span class="price-change">{{ appleData.priceChange }}</span>
        <span class="post-market">{{ appleData.postMarket }}</span>
      </div>
      <div class="stock-info">
        
        <span class="eps">{{ appleData.eps }} EPS</span>
        <span class="market-cap">{{ appleData.marketCap }} MARKET CAP</span>
        <span class="div-yield">{{ appleData.divYield }} DIV YIELD</span>
        <span class="pe-ratio">{{ appleData.peRatio }} P/E</span>
      </div>
    </header>
    <div class="main-content">
      <section class="key-statistics">
        <h3>Key Statistics</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="label">Open:</span>
            <span class="value">{{ appleData.open }}</span>
          </div>
          <div class="stat">
            <span class="label">Close:</span>
            <span class="value">{{ appleData.previousClose }}</span>
          </div>
          <div class="stat">
            <span class="label">52 Week High:</span>
            <span class="value">{{ appleData.high }}</span>
          </div>
          <div class="stat">
            <span class="label">52 Week Low:</span>
            <span class="value">{{ appleData.low }}</span>
          </div>
          <div class="stat">
            <span class="label">Market Cap:</span>
            <span class="value">{{ appleData.marketCap }}</span>
          </div>
          <div class="stat">
            <span class="label">Volume:</span>
            <span class="value">{{ appleData.volume }}</span>
          </div>
        </div>
      </section>
      <section class="actions">
        <h3>Actions</h3>
        <div class="action-form">
          <input type="text" placeholder="Enter stock symbol" />
          <input type="number" placeholder="Quantity" />
          <div class="buttons">
            <button class="clear-btn">CLEAR</button>
            <button class="preview-btn">PREVIEW ORDER</button>
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
</template>

<script>
import StockScreener from '../components/StockScreener.vue';
import axios from 'axios';

const SYMBOL = 'AAPL'; // Define the constant symbol

export default {
  name: 'StockDashboard',
  components: {
    StockScreener
  },
  data() {
    return {
      SYMBOL, // Bind the symbol to the template
      appleData: {
        price: '',
        open: '',
        high: '',
        low: '',
        previousClose: '',
        volume: '',
        priceChange: '',
        postMarket: '',
        earningsDate: '',
        eps: '',
        marketCap: '',
        divYield: '',
        peRatio: ''
      }
    };
  },
  methods: {
    fetchAppleData() {
      const apiKey = 'KAK6FUFDSN3RKLGT'; // Replace this with your actual Alpha Vantage API key
      const SYMBOL = 'AAPL'; // Define the constant symbol
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${SYMBOL}&apikey=${apiKey}`;
      const earningsUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${SYMBOL}&apikey=${apiKey}`;

      axios.get(url)
        .then(response => {
          if (response.data['Global Quote']) {
            const quote = response.data['Global Quote'];
            this.appleData.price = quote['05. price'];
            this.appleData.open = quote['02. open'];
            this.appleData.high = quote['03. high'];
            this.appleData.low = quote['04. low'];
            this.appleData.previousClose = quote['08. previous close'];
            this.appleData.volume = quote['06. volume'];
            this.appleData.priceChange = `${quote['09. change']} (${quote['10. change percent']})`;
          }
        })
        .catch(error => {
          console.error('Error fetching Apple data:', error);
        });

      axios.get(earningsUrl)
        .then(response => {
          if (response.data) {
            const overview = response.data;
            this.appleData.earningsDate = 'July 24'; // Replace with the actual date if available from the API
            this.appleData.eps = overview.EPS;
            this.appleData.marketCap = (overview.MarketCapitalization / 1e12).toFixed(3) + 'T';
            this.appleData.divYield = (overview.DividendYield * 100).toFixed(2) + '%';
            this.appleData.peRatio = overview.PERatio;
          }
        })
        .catch(error => {
          console.error('Error fetching Apple overview data:', error);
        });
    },
  },
  mounted() {
    this.fetchAppleData();
  }
};
</script>

<style scoped>
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
  justify-content: space-between;
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
