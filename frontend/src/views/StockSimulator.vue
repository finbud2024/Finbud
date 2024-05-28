<template>
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
</template>
  
<script>
import StockScreener from '../components/StockScreener.vue';

export default {
  name: 'StockDashboard',
  components: {
    StockScreener
  },
  data() {
    return {
      stockSymbol: '',
      stockName: '',
      quantity: 0,
    };
  },
  computed: {
    actionLabel() {
      return this.quantity >= 0 ? 'PREVIEW BUY ORDER' : 'PREVIEW SELL ORDER';
    }
  },
  methods: {
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
    }
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
