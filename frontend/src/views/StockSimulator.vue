<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <CompanyCard :companyName="bannerDisplayStock" :width='`80%`' />
    </header>
    <div class="main-content">
      <section class="key-statistics">
        <h3>Key Statistics</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="label">Open:</span>
            <span class="value">{{ stockData.open }}</span>
          </div>
          <div class="stat">
            <span class="label">Close:</span>
            <span class="value">{{ stockData.close }}</span>
          </div>
          <div class="stat">
            <span class="label">52 Week High:</span>
            <span class="value">{{ stockData.high }}</span>
          </div>
          <div class="stat">
            <span class="label">52 Week Low:</span>
            <span class="value">{{ stockData.low }}</span>
          </div>
          <div class="stat">
            <span class="label">Market Cap:</span>
            <span class="value">{{ stockData.marketCap }}</span>
          </div>
          <div class="stat">
            <span class="label">Volume:</span>
            <span class="value">{{ stockData.volume }}</span>
          </div>
        </div>
      </section>
      <section class="actions">
        <h3>Actions</h3>
        <div class="action-form">
          <input v-model="stockSymbol" type="text" placeholder="Enter stock symbol" />
          <input v-model="quantity" type="number" placeholder="Quantity" />
          <select v-model="action">
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <div class="buttons">
            <button class="clear-btn" @click="clearForm">CLEAR</button>
            <button class="preview-btn" @click="showModal = true">Preview Order</button>
          </div>
        </div>
      </section>
    </div>
    <section class="account-info">
      <h3>Your account:</h3>
      <div class="account-stats">
        <div class="account-stat">
          <span class="label">ACCOUNT BALANCE</span>
          <span class="value">{{accountBalance}}</span>
        </div>
        <div class="account-stat">
          <span class="label">CASH BALANCE</span>
          <span class="value">{{cashBalance}}</span>
        </div>
        <div class="account-stat">
          <span class="label">PORTFOLIO VALUE</span>
          <span class="value">{{portfolioValue}}</span>
        </div>
      </div>
    </section>
    <section class="transaction-history">
      <TransactionHistory />
    </section>
    <stockScreener @applyFilter="stockFilterHandler"/>
    <div class="stockDisplayContainer" v-if="count">
      <CompanyCard v-for="(item,idx) in displayStock" :key="idx" :companyName="item.ticker" :width="`80%`" />
    </div>
    <PreviewOrderModal 
      v-if="showModal" 
      :stockSymbol="stockSymbol" 
      :quantity="quantity" 
      :estimatedPrice="estimatedPrice" 
      :remainingBalance="calculateRemainingBalance(action, estimatedPrice, quantity)"
      @close="showModal = false"  
      @clear-order="clearOrder"  
      @submit-order="submitOrder(action)" 
    />
  </div>
</template>

<script>
import StockScreener from '../components/StockScreener.vue';
import CompanyCard from '@/components/CompanyCard.vue';
import stockData from './hardcodeData/StockData.js';
import PreviewOrderModal from '../components/StockSimulatorPage/PreviewOrderModal.vue';
import TransactionHistory from '../components/StockSimulatorPage/TransactionHistory.vue';
import axios from 'axios';

export default {
  name: 'StockDashboard',
  components: {
    StockScreener,
    CompanyCard,
    PreviewOrderModal,
    TransactionHistory
  },
  data() {
    return {
      bannerDisplayStock: "AAPL",
      displayStock: [],
      count: 1,
      stockSymbol: '', 
      quantity: '',
      showModal: false,
      estimatedPrice: 15, 
      accountBalance: 0,
      portfolioValue: 0,
      cashBalance: 0,
      stockData: {
        open: '',
        close: '',
        high: '',
        low: '',
        marketCap: '',
        volume: ''
      },
      fixedUserId: '66974fea75fa96762507ca06',
      action: 'buy' 
    };
  },
  methods: {
    async stockFilterHandler(screenerFilter) {
      const appliedFilter = stockData
        .filter((data) => data.eps && data.eps <= screenerFilter.eps[1] && data.eps >= screenerFilter.eps[0])
        .filter((data) => data.pe && data.pe <= screenerFilter.pe[1] && data.pe >= screenerFilter.pe[0])
        .filter((data) => data.pbr && data.pbr <= screenerFilter.pbr[1] && data.pbr >= screenerFilter.pbr[0])
        .filter((data) => data.beta && data.beta <= screenerFilter.beta[1] && data.beta >= screenerFilter.beta[0])
        .filter((data) => data.regularPrice && data.regularPrice <= screenerFilter.regularPrice[1] && data.regularPrice >= screenerFilter.regularPrice[0])
        .filter((data) => data.priceSales && data.priceSales <= screenerFilter.priceSales[1] && data.priceSales >= screenerFilter.priceSales[0]);
      
      this.displayStock = [];
      await new Promise(r => setTimeout(r, 500));
      
      if (appliedFilter.length > 10) {
        let temp = appliedFilter.slice().sort(() => 0.5 - Math.random());
        this.displayStock = temp.slice(0, 10);
      } else {
        this.displayStock = appliedFilter;
      }
      this.count++;
    },
    calculateTotal(action, price, quantity) {
      const total = price * quantity;
      const fee = 0.01 * total;
      return action === 'buy' ? total + fee : total - fee;
    },
    calculateRemainingBalance(action, price, quantity) {
      const total = this.calculateTotal(action, price, quantity);
      return this.cashBalance - (action === 'buy' ? total : -total);
    },
    clearForm() {
      this.stockSymbol = '';
      this.quantity = '';
      this.action = 'buy';
    },
    submitOrder(action) {
      const transactionData = {
        stockSymbol: this.stockSymbol,
        type: action,
        quantity: Math.abs(this.quantity),
        price: this.estimatedPrice,
        userId: this.fixedUserId
      };

      axios.post(`${process.env.VUE_APP_DEPLOY_URL}/stock-transactions`, transactionData)
        .then(response => {
          console.log('Order submitted successfully:', response.data);
          this.showModal = false;
          this.fetchTransactions(); // Re-fetch transactions to update the table
        })
        .catch(error => {
          console.error('Error submitting order:', error);
        });
    },
    async fetchTransactions() {
      const userId = this.fixedUserId;
      try {
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/stock-transactions/u/${userId}`);
        this.transactions = response.data;
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      }
    }
  },
  computed: {},
  watch: {
    '$route.query': {
      immediate: true,
      handler(newQuery) {
        this.stockSymbol = newQuery.symbol || '';
        this.quantity = newQuery.quantity || '';
        this.bannerDisplayStock = newQuery.symbol || "AAPL";
      }
    },
    displayStock(newVal) {
      console.log(newVal);
    }
  },
  mounted() {
    const shuffledStock = stockData.slice().sort(() => 0.5 - Math.random());
    this.displayStock = shuffledStock.slice(0, 10);

    if (this.$route.query.symbol && this.$route.query.quantity) {
      this.bannerDisplayStock = this.$route.query.symbol;
    } else {
      alert("direct");
    }
    this.fetchTransactions(); // Fetch transactions when the component is mounted
  }
};
</script>

<style scoped>
.stockDisplayContainer {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px; /* Add padding on both sides */
}

.dashboard {
  font-family: 'Space Grotesk', sans-serif;
  color: #333;
}

.dashboard-header {
  padding: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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

.key-statistics h3, .actions h3, .account-info h3, .transaction-history h3 {
  margin-bottom: 20px;
  color: #007bff;
  font-size: 1.5rem;
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
  gap: 10px;
}

.actions input,
.actions select {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  color: #495057;
  background-color: #fff;
}

.actions select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 7L10 10L13 7' stroke='%236c757d' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.clear-btn,
.preview-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
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

  .key-statistics,
  .actions {
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
