<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <CompanyCard :companyName="bannerDisplayStock" :width="`80%`" />
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

    <div class="account-performance">
      <section class="account-info">
        <h3>Your account:</h3>
        <div class="account-grid">
          <div class="stat">
            <span class="label">ACCOUNT BALANCE:</span>
            <span class="value">{{ accountBalance }}</span>
          </div>
          <div class="stat">
            <span class="label">CASH BALANCE:</span>
            <span class="value">{{ cash }}</span>
          </div>
          <div class="stat">
            <span class="label">STOCK VALUE:</span>
            <span class="value">{{ stockValue }}</span>
          </div>
          <div class="stat">
            <span class="label">TODAY'S CHANGE:</span>
            <span class="value">{{ todaysChange }}</span>
          </div>
          <div class="stat">
            <span class="label">ANNUAL RETURN:</span>
            <span class="value">{{ annualReturn }}%</span>
          </div>
        </div>
      </section>

      <!-- Use the new PerformanceChart component -->
      <PerformanceChart 
        :performanceData="performanceData"
        @timeframeChanged="updatePerformanceData"
      />
    </div>

    <section class="transaction-history">
      <TransactionHistory />
    </section>

    <stockScreener @applyFilter="stockFilterHandler" />

    <div class="stockDisplayContainer" v-if="count">
      <CompanyCard v-for="(item, idx) in displayStock" :key="idx" :companyName="item.ticker" :width="`80%`" />
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
import PerformanceChart from '../components/PerformanceChart.vue'; 
import axios from 'axios';

export default {
  name: 'StockDashboard',
  components: {
    StockScreener,
    CompanyCard,
    PreviewOrderModal,
    TransactionHistory,
    PerformanceChart
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
      stockValue: 0,
      cash: 0,
      performanceData: [], // Add performance data here
      stockData: {
        open: '',
        close: '',
        high: '',
        low: '',
        marketCap: '',
        volume: ''
      },
      fixedUserId: localStorage.getItem('token'),
      action: 'buy',
      selectedTimeFrame: '1W' 
    };
  },
  methods: {
    setTimeFrame(timeframe) {
      this.selectedTimeFrame = timeframe;
      this.updatePerformanceData(timeframe); 
    },
        updatePerformanceData(timeframe) {
      const performanceData = [];
      const startDate = new Date();
      
      // Generate data for 30 days
      for (let i = 0; i < 30; i++) {
        // Calculate the date for the past 30 days
        const date = new Date();
        date.setDate(startDate.getDate() - i);

        // Generate a random stock value between 100 and 150
        const value = (Math.random() * 50 + 100).toFixed(2);
        
        performanceData.push({
          date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          value: parseFloat(value)
        });
      }
      
      // Reverse the array to start from the oldest date to the most recent
      this.performanceData = performanceData.reverse();
    },
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
      return this.cash - (action === 'buy' ? total : -total);
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
        this.updatePerformanceData(this.selectedTimeFrame); // Update chart with fetched data
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      }
    }
  },
  computed: {
    accountBalance() {
      return this.cash + this.stockValue;
    } 
  },
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
    }
    const userData = JSON.parse(localStorage.getItem('user'));
    this.accountBalance = userData.bankingAccountData.accountBalance;
    this.cash = userData.bankingAccountData.cash;
    this.stockValue = userData.bankingAccountData.stockValue;
    this.fetchTransactions();
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

.key-statistics h3, .actions h3, .account-info h3, .transaction-history h3, .performance-chart h3 {
  margin-bottom: 20px;
  color: #007bff;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.account-performance {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  gap: 10px; /* Space between account and performance sections */
}

.account-info {
  width: 24%; /* Left side 30% */
}

.performance-chart {
  width: 70%; /* Right side 70% */
  background-color: #e9ecef;
  padding: 20px;
  border-radius: 5px;
  position: relative; /* For positioning the buttons */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90%; /* Make the height equal to account-info */
  min-height: 500px; /* Optional: Set a minimum height if needed */
}

.chart-controls {
  display: flex;
  justify-content: space-between; /* Ensures buttons are evenly spaced */
  align-items: center;
  margin-bottom: 20px; /* Space between buttons and chart content */
  width: 100%; /* Full width of the performance chart */
}

.timeframe-btn {
  background-color: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 10px 20px;
  font-weight: bold;
  text-align: center;
  flex-grow: 1; /* Make each button take up an equal amount of space */
  height: 50px; /* Adjusted height for a larger button */
  line-height: 30px; /* Center text vertically */
  margin: 0 5px; /* Space between each button */
  border-radius: 5px; /* Rounded corners for buttons */
  transition: background-color 0.3s, border-color 0.3s; /* Smooth transition */
}

.timeframe-btn.active {
  background-color: #dfe6f1;
  border: 2px solid #2e5cb8;
  color: #2e5cb8;
}

.timeframe-btn:hover {
  background-color: #dfe6f1;
  border-radius: 5px;
}

.chart-placeholder {
  background-color: #e9ecef;
  padding: 20px;
  text-align: center;
  border-radius: 5px;
  border: 1px dashed #ced4da;
  flex-grow: 1; /* Ensures the placeholder takes up the remaining space */
}

.performance-history {
  margin-top: auto;
}

.performance-history-btn {
  background-color: #2e5cb8;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
}

.performance-history-btn:hover {
  background-color: #1d3e8e;
}

.stat {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  margin-bottom: 10px; /* Add space between each stat for the account grid */
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

.transaction-history {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .account-performance {
    flex-direction: column;
    align-items: center;
  }

  .key-statistics,
  .actions,
  .account-info,
  .performance-chart {
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
