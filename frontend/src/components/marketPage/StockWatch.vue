<template>
  <div>
    <div class="stock-watch animate__animated animate__fadeIn">
      <div class="header">
        <!--<h2>STOCKS</h2>-->
      </div>
      <div class="stock-table-wrapper">
        <div class="stock-table">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex">
            <div class="stock-row">
              <div 
                class="stock-item animate__animated animate__fadeInUp" 
                v-for="stock in row" 
                :key="stock['01. symbol']"
                @click="showPopup(stock)"
              >
                <div :class="['stock-bar', { 'positive-bar': parseFloat(stock['09. change']) > 0, 'negative-bar': parseFloat(stock['09. change']) < 0 }]"></div>
                <div class="stock-info">
                  <div class="stock-symbol">
                    <h3>{{ stock['01. symbol'] }}</h3>
                    <p>{{ stock['name'] }}</p> <!-- Display stock name here -->
                  </div>
                  <div class="stock-price">
                    <p class="price">${{ stock['05. price'] }}</p>
                  </div>
                  <div class="stock-change">
                    <p :class="{'positive': parseFloat(stock['10. change percent']) > 0, 'negative': parseFloat(stock['10. change percent']) < 0}">
                      {{ parseFloat(stock['10. change percent']) > 0 ? '+' : '' }}{{ parseFloat(stock['10. change percent']).toFixed(2) }}%
                    </p>
                    <p :class="{'positive': parseFloat(stock['09. change']) > 0, 'negative': parseFloat(stock['09. change']) < 0}">
                      {{ parseFloat(stock['09. change']).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="rowIndex < rows.length - 1" class="row-divider"></div>
          </div>
        </div>
      </div>
    </div>
    <StockPopup v-if="showStockPopup" :stock="selectedStock" @close="showStockPopup = false" />
  </div>
</template>

<script>
import axios from 'axios';
import StockPopup from './StockPopup.vue';

const apiKey = process.env.VUE_APP_STOCK_KEY;

export default {
  name: 'StockWatch',
  components: {
    StockPopup,
  },
  data() {
    return {
      loading: true,
      error: null,
      stockQuotes: [],
      rows: [[], [], []], // Divide stocks into 3 rows
      showStockPopup: false,
      selectedStock: null,
    };
  },
  mounted() {
    this.fetchStockQuote();
  },
  methods: {
    async fetchStockQuote() {
      const symbols = [
        'IBM', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA', 'NFLX', 'NVDA', 
        'INTC', 'CSCO', 'ORCL', 'ADBE', 'CRM', 'PYPL', 'AMD', 'QCOM', 'TXN', 
        'AVGO', 'SHOP'
      ];
      try {
        const requests = symbols.map(symbol => {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
          return axios.get(url);
        });

        const responses = await Promise.all(requests);
        this.stockQuotes = responses.map(response => {
          const quote = response.data['Global Quote'];
          if (quote && Object.keys(quote).length > 0) {
            quote['name'] = symbols.find(sym => sym === quote['01. symbol']); // Add stock name
            return quote;
          } else {
            return null; 
          }
        }).filter(quote => quote !== null);
        this.distributeStocks();
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to fetch stock quotes';
        console.error('Error:', error);
        this.loading = false;
      }
    },
    distributeStocks() {
      for (let i = 0; i < this.stockQuotes.length; i++) {
        this.rows[i % 3].push(this.stockQuotes[i]);
      }
    },
    showPopup(stock) {
      this.selectedStock = stock;
      this.showStockPopup = true;
    },
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
