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
                    <p>{{ stock['05. price'] }}</p>
                  </div>
                  <div class="stock-price">
                    <p class="price">${{ stock['05. price'] }}</p>
                  </div>
                  <div class="stock-change">
                    <p :class="{'positive': parseFloat(stock['10. change percent']) > 0, 'negative': parseFloat(stock['10. change percent']) < 0}">
                      {{ parseFloat(stock['10. change percent']) > 0 ? '+' : '' }}{{ parseFloat(stock['10. change percent']).toFixed(2) }}%
                    </p>
                    <p :class="{'positive': parseFloat(stock['09. change']) > 0, 'negative': parseFloat(stock['09. change']) < 0}">
                      {{ parseFloat(stock['09. change']) > 0 ? '+' : '' }}{{ parseFloat(stock['09. change']).toFixed(2) }}
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

const apiKey = 'BS4H8D1PZ63W5IC0';

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
      const symbols = ['IBM', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NFLX', 'NVDA', 'INTC', 'CSCO', 'ORCL', 'ADBE', 'CRM', 'PYPL', 'AMD', 'QCOM', 'TXN', 'AVGO', 'SHOP'];
      try {
        const requests = symbols.map(symbol => {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
          return axios.get(url);
        });

        const responses = await Promise.all(requests);
        this.stockQuotes = responses.map(response => {
          const quote = response.data['Global Quote'];
          if (quote && Object.keys(quote).length > 0) {
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

body {
  font-family: 'Segoe UI', Arial, sans-serif;
}

.stock-watch {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  min-width: 363px;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
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
  font-size: 1.2em;
  font-weight: bold;
}

.stock-symbol p {
  margin: 0;
  font-size: 0.9em;
  color: #666;
}

.stock-price {
  flex-shrink: 0; /* Prevent shrinking */
  text-align: center; /* Center align the text */
}

.stock-price .price {
  font-size: 1em;
  font-weight: bold;
}

.stock-change {
  flex: 1; /* Take all the available space on the right */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align to the right */
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
</style>
