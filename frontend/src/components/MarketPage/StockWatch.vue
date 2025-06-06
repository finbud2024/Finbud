<template>
  <div>
    <div class="stock-watch animate__animated animate__fadeIn">
      <div class="header">
        <!--<h2>STOCKS</h2>-->
      </div>
      <div class="stock-table-wrapper">
      <div class="market-summary">
        <h3>Market Summary</h3>
        <!-- only render the HTML when we actually have markdown -->
        <div v-if="marketSummary" v-html="renderedSummary"></div>

        <!-- otherwise show your fallback -->
        <p v-else>Loading summary…</p>
      </div>
      
        <div class="stock-table">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex">
            <div class="stock-row">
              <div class="stock-item animate__animated animate__fadeInUp" v-for="stock in row"
                :key="stock['01. symbol']" @click="showPopup(stock)">
                <div
                  :class="['stock-bar', { 'positive-bar': parseFloat(stock['09. change']) > 0, 'negative-bar': parseFloat(stock['09. change']) < 0 }]">
                </div>
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
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html:        true,        // allow inline HTML
  linkify:     true,        // autolink URLs
  typographer: true,
})

const apiKey = process.env.VUE_APP_STOCK_KEY;

export default {
  name: 'StockWatch',
  props: {
    marketSummary: {
      type: String,
      default: ''
    }
  },
  computed: {
    renderedSummary() {
      return md.render(this.marketSummary)
    }
  },
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
      
      this.loading = true;
      this.error = null;
      
      try {
        // Import the updated market data service
        const { fetchStockQuote } = await import('@/services/marketDataService.js');
        const stockData = await fetchStockQuote(symbols);
        
        // Transform the data to match the expected format
        this.stockQuotes = stockData.map(stock => ({
          '01. symbol': stock.symbol,
          '05. price': stock.price.toFixed(2),
          '09. change': stock.change.toFixed(2),
          '10. change percent': `${stock.changePercent.toFixed(2)}%`,
          'name': this.getStockName(stock.symbol)
        }));
        
        this.distributeStocks();
        this.loading = false;
      } catch (error) {
        console.error('Error fetching stock data:', error);
        this.error = 'Unable to load stock data. Please try again later.';
        this.loading = false;
        
        // Provide fallback data to prevent empty display
        this.stockQuotes = this.getFallbackQuotes();
        this.distributeStocks();
      }
    },
    
    getStockName(symbol) {
      const stockNames = {
        'IBM': 'International Business Machines',
        'AAPL': 'Apple Inc.',
        'GOOGL': 'Alphabet Inc.',
        'MSFT': 'Microsoft Corporation',
        'AMZN': 'Amazon.com Inc.',
        'META': 'Meta Platforms Inc.',
        'TSLA': 'Tesla Inc.',
        'NFLX': 'Netflix Inc.',
        'NVDA': 'NVIDIA Corporation',
        'INTC': 'Intel Corporation',
        'CSCO': 'Cisco Systems Inc.',
        'ORCL': 'Oracle Corporation',
        'ADBE': 'Adobe Inc.',
        'CRM': 'Salesforce Inc.',
        'PYPL': 'PayPal Holdings Inc.',
        'AMD': 'Advanced Micro Devices',
        'QCOM': 'QUALCOMM Incorporated',
        'TXN': 'Texas Instruments',
        'AVGO': 'Broadcom Inc.',
        'SHOP': 'Shopify Inc.'
      };
      return stockNames[symbol] || symbol;
    },
    
    getFallbackQuotes() {
      return [
        { '01. symbol': 'AAPL', '05. price': '175.84', '09. change': '1.34', '10. change percent': '0.77%', 'name': 'Apple Inc.' },
        { '01. symbol': 'MSFT', '05. price': '338.11', '09. change': '2.44', '10. change percent': '0.73%', 'name': 'Microsoft Corporation' },
        { '01. symbol': 'GOOGL', '05. price': '129.85', '09. change': '0.93', '10. change percent': '0.72%', 'name': 'Alphabet Inc.' },
        { '01. symbol': 'AMZN', '05. price': '140.75', '09. change': '1.54', '10. change percent': '1.11%', 'name': 'Amazon.com Inc.' },
        { '01. symbol': 'TSLA', '05. price': '248.42', '09. change': '2.75', '10. change percent': '1.12%', 'name': 'Tesla Inc.' },
        { '01. symbol': 'META', '05. price': '326.08', '09. change': '1.76', '10. change percent': '0.54%', 'name': 'Meta Platforms Inc.' },
      ];
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
  color: #000000;
  opacity: 1;
  text-align: left;
  margin-bottom: 20px;
  animation: fadeInDown 0.5s;
}

.market-summary {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.stock-table-wrapper {
  overflow-x: auto;
  overflow-y: hidden;
  /* Hide vertical overflow */
  white-space: nowrap;
}

.stock-table {
  display: flex;
  flex-direction: column;
  width: max-content;
  /* Ensure the table takes the necessary width for scrolling */
}

.stock-row {
  display: flex;
  margin-bottom: 20px;
}

.stock-item {
  display: flex;
  border: 1px solid transparent;
  padding: 8px;
  width: 350px;
  /* Set a fixed width for each item */
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
  white-space: normal;
  /* Ensure text wraps within the item */
  overflow: hidden;
  /* Prevent overflow */
  word-wrap: break-word;
  /* Break words that are too long */
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
  justify-content: space-between;
  /* Distribute space between children */
  align-items: center;
  width: 100%;
  /* Make sure it takes the full width of the container */
  padding-left: 10px;
}

.stock-symbol {
  flex: 1;
  /* Take all the available space on the left */
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
  word-wrap: break-word;
  /* Ensure long words break to the next line */
  white-space: normal;
  /* Ensure text wraps */
  overflow-wrap: break-word;
  /* Ensure text wraps */
}

.stock-price {
  flex-shrink: 0;
  /* Prevent shrinking */
  text-align: center;
  /* Center align the text */
  font-size: 0.9em;
}

.stock-price .price {
  font-weight: bold;
}

.stock-change {
  flex: 1;
  /* Take all the available space on the right */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  /* Align to the right */
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
  width: 100%;
  /* Ensure the divider spans the entire width of the scrolling area */
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
