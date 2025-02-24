<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <!-- <CompanyCard :companyName="bannerDisplayStock" :width="`80%`" /> -->
      <BannerCardSimulator :stockCode="bannerDisplayStock" />
    </header>

    <div class="main-content">
      <section class="key-statistics">
        <h3>Key Statistics</h3>
        <div class="stats-grid">
          <div class="stat">
            <span class="label">Open: </span>
            <span class="value">${{ stockData.open }}</span>
          </div>
          <div class="stat">
            <span class="label">Prev Close: </span>
            <span class="value">${{ stockData.close }}</span>
          </div>
          <div class="stat">
            <span class="label">52 Week High: </span>
            <span class="value">${{ stockData.high }}</span>
          </div>
          <div class="stat">
            <span class="label">52 Week Low: </span>
            <span class="value">${{ stockData.low }}</span>
          </div>
          <div class="stat">
            <span class="label">Market Cap: </span>
            <span class="value">${{ stockData.marketCap }}</span>
          </div>
          <div class="stat">
            <span class="label">Volume: </span>
            <span class="value">{{ stockData.volume }} shares</span>
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
        <div class="account-info-container">
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
        </div>
        <div class="chat-bot-container">

        </div>

      </section>
     
     

      <PerformanceChart 
        :performanceData="performanceData"
        @timeframeChanged="updatePerformanceData"
      />
    </div>


    <section class="transaction-history">
      <TransactionHistory :key="transactionKey"/>
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
import { fetchSimBannerStockData, fetchSimBannerStockDatav2, fetchSimBannerStockDatav3 } from '../services/stockServices';
import StockScreener from '../components/StockScreener.vue';
import CompanyCard from '@/components/CompanyCard.vue';
import BannerCardSimulator from '@/components/BannerCardSimulator.vue';
import stockData from './hardcodeData/StockData.js';
import PreviewOrderModal from '../components/StockSimulatorPage/PreviewOrderModal.vue';
import TransactionHistory from '../components/StockSimulatorPage/TransactionHistory.vue';
import PerformanceChart from '../components/PerformanceChart.vue'; 
import { toast } from 'vue3-toastify';
import axios from 'axios';

export default {
  name: 'StockDashboard',
  components: {
    StockScreener,
    CompanyCard,
    PreviewOrderModal,
    TransactionHistory,
    PerformanceChart,
    BannerCardSimulator
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
      transactionKey: 0,
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
          toast.success('Order submitted successfully', { autoClose: 1000 });
          this.showModal = false;
          this.fetchBankingAccountBalance();
          this.fetchTransactions(); // Re-fetch transactions to update the table
          this.transactionKey++;
        })
        .catch(error => {
          this.showModal = false;
          console.error('Error submitting order:', error);
          toast.error('Order submitted unsuccessfully', {autoClose: 1000});
        });
    },
    async fetchBankingAccountBalance() {
      try {
        const userId = localStorage.getItem('token');
        const api = `${process.env.VUE_APP_DEPLOY_URL}/users/${userId}`;
        const response = await axios.get(api);
        const data = response.data;
        console.log(data);
        
        this.accountBalance = data.bankingAccountData.accountBalance;
        this.stockValue = data.bankingAccountData.stockValue;
        this.cash = data.bankingAccountData.cash;
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast.error('Failed to load financial data', { autoClose: 1000 });
      }
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
  watch: {
    "$route.query": {
      immediate: true,
      handler(newQuery) {
        this.stockSymbol = newQuery.symbol || "";
        this.quantity = newQuery.quantity ? parseInt(newQuery.quantity, 10) : 1;
        this.bannerDisplayStock = newQuery.symbol || "AAPL";
        // Ensure "action" gets updated in the dropdown
        if (newQuery.action === "sell" || newQuery.action === "buy") {
          this.action = newQuery.action;
        }
      }
    },

    async bannerDisplayStock(newSymbol) {
      const fetchedStock = await fetchSimBannerStockDatav3(newSymbol);
      if (fetchedStock) {
        this.stockData = {
          open: fetchedStock.open,
          close: fetchedStock.close,
          high: fetchedStock.high,
          low: fetchedStock.low,
          marketCap: fetchedStock.marketCap,
          volume: fetchedStock.volume
        };
      } else {
        console.error(`Failed to fetch stock data for ${newSymbol}`);
      }
    }
  },
  async mounted() {
    // UPDATED: Fetch key statistics using the API-based service instead of local hardcoded data
    const defaultTicker = this.bannerDisplayStock; // e.g. "AAPL"
    const fetchedStock = await fetchSimBannerStockDatav3(defaultTicker);
    if (fetchedStock) {
      this.stockData = {
        open: fetchedStock.open,
        close: fetchedStock.close,
        high: fetchedStock.high,
        low: fetchedStock.low,
        marketCap: fetchedStock.marketCap,
        volume: fetchedStock.volume
      };
    } else {
      console.error(`Failed to fetch stock data for default ticker: ${defaultTicker}`);
    }

    // Continue with remaining mounted logic
    const shuffledStock = stockData.slice().sort(() => 0.5 - Math.random());
    this.displayStock = shuffledStock.slice(0, 10);

    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get("symbol");
    const quantity = urlParams.get("quantity");
    const action = urlParams.get("action");

    if (symbol) this.stockSymbol = symbol;
    if (quantity) this.quantity = parseInt(quantity, 10);
    if (action === "sell" || action === "buy") {
      this.action = action;
    }
    if (this.stockSymbol && this.quantity) {
      setTimeout(() => {
        const previewButton = document.querySelector(".preview-btn");
        if (previewButton) {
          previewButton.click();
        }
      }, 1000); // Wait 1 second to ensure the form is populated before clicking
    }
    this.fetchBankingAccountBalance();
    this.fetchTransactions();
  }
};
</script>

<style scoped>
.stockDisplayContainer {
  /* 40px of padding*/
  width: calc(100%-40px);
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
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 20px;
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
  margin-top: -50px;
}

.key-statistics {
  width: 48%;
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.key-statistics h3 {
  margin-top: 30px;
  margin-bottom: 20px;
  color: #007bff;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 10px;
}

.stat {
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.stat .label {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.stat .value {
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
}

.account-performance {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
  min-height: 520px;  /* Increased to match performance chart */
}

.account-info {
  width: 24%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.account-info-container {
  background-color: #f8f9fa;
  padding: 33px;  /* Reduced from 15px */
  border-radius: 5px;
  border: 1px solid #dee2e6;
  width: 100%;
  min-height: 150px;  /* Reduced from 180px */
}

.chat-bot-container {
  background-color: #f8f9fa;
  padding: 33px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  width: 100%;
  min-height: 180px;  /* Set specific height for chat bot */
}

.performance-chart {
  width: 70%;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  min-height: 520px;  /* Match parent container height */
  display: flex;
  flex-direction: column;
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;    /* Reduced from 8px */
  padding: 4px;  /* Reduced from 6px */
}

.account-stat {
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.account-stat .label {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 8px;
  display: block;
}

.account-stat .value {
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
}

.actions {
  width: 48%;
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  box-sizing: border-box; /* Add this to include padding in width calculation */
}

.actions .action-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 100%;
  padding: 10px;
  box-sizing: border-box; /* Add this to include padding in width calculation */
}

.actions input,
.actions select {
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  font-size: 1.1rem;
  width: calc(100% - 24px); /* Adjust width to account for padding */
  height: 45px;
  box-sizing: border-box; /* Add this to include padding in width calculation */
}

.buttons {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  width: calc(100% - 24px); /* Adjust width to account for padding */
  margin-top: 10px;
  box-sizing: border-box; /* Add this to include padding in width calculation */
}

.clear-btn,
.preview-btn {
  flex: 1;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1.1rem;
  height: 45px;
  box-sizing: border-box; /* Add this to include padding in width calculation */
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

  .finbudBot {
  position: fixed;
  width: 60px;
  aspect-ratio: 1;
  right: 3.125vw;
  bottom: 20px;
  z-index: 9998;
}
  
}

.new-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  width: 100%;
  box-sizing: border-box;
}

.new-section h3 {
  margin-bottom: 20px;
  color: #007bff;
  font-size: 1.5rem;
}

.new-section-content {
  display: flex;
  gap: 20px;
  padding: 10px;
}

/* Make the stats more compact */
.account-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px;    /* Reduced from 8px */
  padding: 4px;  /* Reduced from 6px */
}

.stat {
  padding: 6px;  /* Reduced from 8px */
  background-color: white;
  border-radius: 4px;  /* Reduced from 5px */
  border: 1px solid #dee2e6;
}

.stat .label {
  font-size: 0.8rem;  /* Reduced from 0.9rem */
  color: #555;
  margin-bottom: 2px;  /* Reduced from 4px */
  display: block;
}

.stat .value {
  font-size: 0.95rem;  /* Reduced from 1.1rem */
  font-weight: 500;
  color: #333;
}

/* Adjust the title */
.account-info-container h3 {
  font-size: 0.9rem;  /* Reduced from 1rem */
  margin-bottom: 4px;  /* Reduced from 6px */
  color: #007bff;
}

.actions h3 {
  margin-top: 20px;
  margin-bottom: 20px;
  color: #007bff;
  font-size: 1.5rem;
}
</style>
