<template>
  <div>
    <div class="stock-watch animate__animated animate__fadeIn">
      <div class="header">
        <!--<h2>VIETNAM STOCKS</h2>-->
      </div>
      <div class="stock-table-wrapper">
        <div v-if="loading" class="loading-state">
          <p>Loading stocks data...</p>
        </div>
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>
        <div v-else class="stock-table">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex">
            <div class="stock-row">
              <div 
                class="stock-item animate__animated animate__fadeInUp" 
                v-for="stock in row" 
                :key="stock.symbol"
                @click="showPopup(stock)"
              >
                <div :class="['stock-bar', { 'positive-bar': stock.change > 0, 'negative-bar': stock.change < 0 }]"></div>
                <div class="stock-info">
                  <div class="stock-symbol">
                    <h3>{{ stock.symbol }}</h3>
                  </div>
                  <div class="stock-price">
                    <p class="price">{{ formatPrice(stock.price) }}</p>
                  </div>
                  <div class="stock-change">
                    <p :class="{'positive': stock.change_percent > 0, 'negative': stock.change_percent < 0}">
                      {{ stock.change_percent > 0 ? '+' : '' }}{{ stock.change_percent.toFixed(2) }}%
                    </p>
                    <p :class="{'positive': stock.change > 0, 'negative': stock.change < 0}">
                      {{ stock.change.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="rowIndex < rows.length - 1" class="row-divider"></div>
          </div>
        </div>
      </div>
      <div class="pagination-container">
        <button 
          @click="prevPage" 
          :disabled="currentPage <= 1"
          class="pagination-button"
        >
          Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="nextPage" 
          :disabled="currentPage >= totalPages"
          class="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
    <StockPopup v-if="showStockPopup" :stock="selectedStock" @close="showStockPopup = false" />
  </div>
</template>

<script>
import axios from 'axios';
import StockPopup from './StockPopup.vue';

export default {
  name: 'VietnamStockWatch',
  components: {
    StockPopup,
  },
  data() {
    return {
      loading: true,
      error: null,
      stockSymbols: [],
      stockQuotes: [],
      rows: [[], [], []], // Divide stocks into 3 rows
      showStockPopup: false,
      selectedStock: null,
      currentPage: 1,
      pageSize: 15, // Number of stocks to display per page
      totalPages: 1
    };
  },
  mounted() {
    this.fetchStockSymbols();
  },
  methods: {
    async fetchStockSymbols() {
      try {
        const response = await axios.get(`http://localhost:8000/api/vn-stock/symbols?page=${this.currentPage}&page_size=${this.pageSize}`);
        
        if (response.data && response.data.data) {
          this.stockSymbols = response.data.data;
          this.totalPages = Math.ceil(response.data.total / this.pageSize);
          
          // Extract symbols to query prices
          const symbols = this.stockSymbols.map(s => s.symbol).join(',');
          await this.fetchStockPrices(symbols);
        } else {
          this.error = 'Invalid response format from API';
          this.loading = false;
        }
      } catch (error) {
        this.error = 'Failed to fetch stock symbols: ' + (error.message || 'Unknown error');
        console.error('Error fetching stock symbols:', error);
        this.loading = false;
      }
    },
    async fetchStockPrices(symbols) {
      try {
        const response = await axios.get(`http://localhost:8000/api/vn-stock/prices?symbols=${symbols}`);
        
        if (response.data && response.data.data) {
          this.stockQuotes = response.data.data.filter(stock => stock.price > 0); // Filter out stocks with no price
          this.distributeStocks();
          this.loading = false;
        } else {
          this.error = 'Invalid response format from prices API';
          this.loading = false;
        }
      } catch (error) {
        this.error = 'Failed to fetch stock prices: ' + (error.message || 'Unknown error');
        console.error('Error fetching stock prices:', error);
        this.loading = false;
      }
    },
    distributeStocks() {
      // Clear previous rows
      this.rows = [[], [], []];
      
      // Distribute stocks across 3 rows
      for (let i = 0; i < this.stockQuotes.length; i++) {
        this.rows[i % 3].push(this.stockQuotes[i]);
      }
    },
    showPopup(stock) {
      this.selectedStock = {
        '01. symbol': stock.symbol,
        '05. price': this.formatPrice(stock.price),
        '09. change': stock.change.toString(),
        '10. change percent': stock.change_percent.toString(),
        'volume': stock.volume.toString(),
        'high': stock.high.toString(),
        'low': stock.low.toString()
      };
      this.showStockPopup = true;
    },
    formatPrice(price) {
      return price ? price.toLocaleString() : '0';
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.loading = true;
        this.fetchStockSymbols();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loading = true;
        this.fetchStockSymbols();
      }
    }
  },
};
</script>

<style scoped>
@import 'animate.css';

.stock-watch {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  overflow: hidden;
}

.header {
  color: #007bff;
  opacity: 1;
  text-align: left;
  margin-bottom: 20px;
  animation: fadeInDown 0.5s;
}

.stock-table-wrapper {
  overflow-x: auto;
  overflow-y: hidden; /* Hide vertical overflow */
  white-space: nowrap; 
}

.stock-table {
  display: flex;
  flex-direction: column;
  width: max-content; /* Ensure the table takes the necessary width for scrolling */
}

.stock-row {
  display: flex;
  margin-bottom: 20px;
}

.stock-item {
  display: flex;
  border: 1px solid transparent;
  padding: 8px;
  width: 350px; /* Set a fixed width for each item */
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
  white-space: normal; /* Ensure text wraps within the item */
  overflow: hidden; /* Prevent overflow */
  word-wrap: break-word; /* Break words that are too long */
}

.stock-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.stock-bar {
  width: 5px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.positive-bar {
  background-color: green;
}

.negative-bar {
  background-color: red;
}

.stock-info {
  display: flex;
  justify-content: space-between; /* Distribute space between children */
  align-items: center;
  width: 100%; /* Make sure it takes the full width of the container */
  padding-left: 10px;
}

.stock-symbol {
  flex: 1; /* Take all the available space on the left */
  display: flex;
  flex-direction: column;
}

.stock-symbol h3 {
  margin: 0;
  font-size: 1.0em;
  font-weight: bold;
}

.stock-symbol p {
  margin: 0;
  font-size: 0.9em;
  color: #666;
  word-wrap: break-word; /* Ensure long words break to the next line */
  white-space: normal; /* Ensure text wraps */
  overflow-wrap: break-word; /* Ensure text wraps */
}

.stock-price {
  flex-shrink: 0; /* Prevent shrinking */
  text-align: center; /* Center align the text */
  font-size: 0.9em;
}

.stock-price .price {
  font-weight: bold;
}

.stock-change {
  flex: 1; /* Take all the available space on the right */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align to the right */
  font-size: 0.9em;
}

.stock-change p {
  margin: 0;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.row-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%; /* Ensure the divider spans the entire width of the scrolling area */
  margin: 10px 0;
}

.loading-state, .error-state {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
  color: #666;
}

.error-state {
  color: #d9534f;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 15px;
}

.pagination-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.9em;
  color: #666;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stock-item {
    width: 363px;
  }
}

@media (max-width: 992px) {
  .stock-item {
    width: 500px;
  }
}

@media (max-width: 768px) {
  .stock-item {
    width: 350px;
  }
}
</style> 