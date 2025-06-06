<template>
  <div>
    <div class="stock-watch animate__animated animate__fadeIn">
      <div class="market-summary">
        <h3>Market Summary</h3>
        <!-- only render the HTML when we actually have markdown -->
        <div v-if="marketSummary" v-html="renderedSummary"></div>

        <!-- otherwise show your fallback -->
        <p v-else>Loading summary…</p>
      </div>
      <div class="header">
        <!--<h2>VIETNAM STOCKS</h2>-->
      </div>
      <div class="stock-table-wrapper">
        <!-- Loading overlay that appears over the existing content -->
        <div v-if="loading && rows.length > 0" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>

        <!-- Show loading state only for initial load -->
        <div v-if="loading && rows.length === 0" class="loading-state">
          <p>Đang tải dữ liệu cổ phiếu...</p>
        </div>
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>
        <div v-else class="stock-table">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex">
            <div class="stock-row">
              <div class="stock-item animate__animated animate__fadeInUp" v-for="stock in row" :key="stock.symbol"
                @click="showPopup(stock)">
                <div :class="['stock-bar', {
                  'positive-bar': stock.change > 0,
                  'negative-bar': stock.change < 0,
                  'neutral-bar': stock.change === 0
                }]"></div>
                <div class="stock-info">
                  <!-- Company name and details in a flex row layout -->
                  <div class="card-content">
                    <div class="stock-company">
                      <h3 class="company-name">{{ stock.organ_name || 'Chưa có tên công ty' }}</h3>
                    </div>

                    <!-- Key-value pairs for details -->
                    <div class="stock-details">
                      <p class="detail-item">
                        <span class="detail-key">Mã CP:</span>
                        <span class="symbol-value">{{ stock.symbol }}</span>
                      </p>

                      <p class="detail-item price-item">
                        <span class="detail-key">Giá:</span>
                        <span class="price-value">{{ formatPrice(stock.price) }}</span>
                      </p>

                      <p class="detail-item">
                        <span class="detail-key">Thay đổi:</span>
                        <span :class="{
                          'positive': stock.change > 0,
                          'negative': stock.change < 0,
                          'neutral': stock.change === 0
                        }">
                          <i v-if="stock.change > 0" class="arrow up"></i>
                          <i v-if="stock.change < 0" class="arrow down"></i>
                          <i v-if="stock.change === 0" class="neutral-icon"></i>
                          {{ stock.change.toFixed(2) }}
                        </span>
                      </p>

                      <p class="detail-item">
                        <span class="detail-key">Thay đổi (%):</span>
                        <span :class="{
                          'positive': stock.change_percent > 0,
                          'negative': stock.change_percent < 0,
                          'neutral': stock.change_percent === 0
                        }">
                          <i v-if="stock.change_percent > 0" class="arrow up"></i>
                          <i v-if="stock.change_percent < 0" class="arrow down"></i>
                          <i v-if="stock.change_percent === 0" class="neutral-icon"></i>
                          {{ stock.change_percent > 0 ? '+' : '' }}{{ stock.change_percent.toFixed(2) }}%
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pagination-wrapper">
        <div class="pagination-container">
          <button @click="prevPage" :disabled="currentPage <= 1 || loading" class="pagination-button"
            :class="{ 'loading-button': loading }">
            <span v-if="loading && navigationDirection === 'prev'" class="button-loader"></span>
            <span v-else>Trước</span>
          </button>
          <span class="page-info">Trang {{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage >= totalPages || loading" class="pagination-button"
            :class="{ 'loading-button': loading }">
            <span v-if="loading && navigationDirection === 'next'" class="button-loader"></span>
            <span v-else>Sau</span>
          </button>
        </div>
      </div>
    </div>
    <VNStockPopup v-if="showStockPopup" :stock="selectedStock" @close="showStockPopup = false" />
  </div>
</template>

<script>
import axios from 'axios';
import VNStockPopup from './VNStockPopup.vue';
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html:        true,        // allow inline HTML
  linkify:     true,        // autolink URLs
  typographer: true,
})

export default {
  name: 'VietnamStockWatch',
  props: {
    marketSummary: {
      type: String,
      default: ''
    }
  },
  components: {
    VNStockPopup,
  },
  data() {
    return {
      loading: true,
      error: null,
      stockSymbols: [],
      stockQuotes: [],
      rows: [], // Will be organized as 5 rows of 3 items each
      showStockPopup: false,
      selectedStock: null,
      currentPage: 1,
      pageSize: 15, // 15 stocks per page (3 items per row, 5 rows)
      totalPages: 1,
      navigationDirection: null, // To track which direction we're navigating
    };
  },
  computed: {
    renderedSummary() {
      // convert your Markdown string into safe HTML
      return md.render(this.marketSummary)
    }
  },
  mounted() {
    this.fetchStockSymbols();
  },
  methods: {
    async fetchStockSymbols() {
      try {
        const response = await axios.get(`https://highs-latest-obituaries-thriller.trycloudflare.com/api/vn-stock/symbols?page=${this.currentPage}&page_size=${this.pageSize}`);

        if (response.data && response.data.stocks) {
          this.stockSymbols = response.data.stocks;
          this.totalPages = Math.ceil(response.data.pagination.total_pages);

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
        const response = await axios.get(`https://highs-latest-obituaries-thriller.trycloudflare.com/api/vn-stock/prices?symbols=${symbols}`);

        if (response.data && response.data.data) {
          // Create a map of symbols to organ_names
          const symbolToOrganMap = {};
          this.stockSymbols.forEach(stock => {
            symbolToOrganMap[stock.symbol] = stock.organ_name;
          });

          // Add organ_name to each stock price data
          this.stockQuotes = response.data.data.map(stock => ({
            ...stock,
            organ_name: symbolToOrganMap[stock.symbol] || ''
          }));

          this.distributeStocks();
          this.loading = false;
          this.navigationDirection = null; // Reset direction after loading
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
      this.rows = [];

      // Distribute stocks across 3 columns, 5 rows
      // Create rows of 3 items each
      for (let i = 0; i < this.stockQuotes.length; i += 3) {
        const row = this.stockQuotes.slice(i, i + 3);
        this.rows.push(row);
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
        'low': stock.low.toString(),
        'name': stock.organ_name
      };
      this.showStockPopup = true;
    },
    formatPrice(price) {
      return price ? price.toLocaleString() : '0';
    },
    prevPage() {
      if (this.currentPage > 1 && !this.loading) {
        this.loading = true;
        this.navigationDirection = 'prev';
        this.currentPage--;
        this.fetchStockSymbols();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages && !this.loading) {
        this.loading = true;
        this.navigationDirection = 'next';
        this.currentPage++;
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
  /* Adjusted for 3 columns */
  overflow: hidden;
  margin: 0 auto;
  /* Center the container */
  padding: 0 15px;
  /* Add padding for mobile */
  box-sizing: border-box;
}

.header {
  color: #000000;
  opacity: 1;
  text-align: left;
  margin-bottom: 20px;
  animation: fadeInDown 0.5s;
}

.stock-table-wrapper {
  overflow: visible;
  /* No need for horizontal scrolling */
  white-space: normal;
  position: relative;
  /* For absolute positioning of loading overlay */
  min-height: 200px;
  /* Ensure minimum height for proper loading state */
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 123, 255, 0.3);
  border-radius: 50%;
  border-top-color: #000000;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.stock-table {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.stock-row {
  display: flex;
  justify-content: space-between;
  /* Evenly distribute the 3 items */
  margin-bottom: 25px;
  gap: 20px;
  /* Gap between items */
}

.stock-item {
  display: flex;
  border: 1px solid #858585;
  padding: 8px;
  width: calc(33.333% - 14px);
  /* 3 items per row with gap taken into account */
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: normal;
  overflow: hidden;
  word-wrap: break-word;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
}

.stock-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
  background-color: #f5f5f5;
  border-color: #ccc;
}

.stock-bar {
  width: 6px;
  /* Slightly wider bar */
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.positive-bar {
  background-color: #28a745;
  /* Brighter green */
}

.negative-bar {
  background-color: #dc3545;
  /* Brighter red */
}

.neutral-bar {
  background-color: #f0ad4e;
  /* More distinct yellow */
}

.stock-info {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 12px;
}

.card-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: 140px;
  /* Increased minimum height */
}

.stock-company {
  width: 45%;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Center vertically */
}

.company-name {
  margin: 0;
  font-size: 1.1em;
  font-weight: 700;
  color: #333;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  /* Increased from 3 to 4 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: auto;
  max-height: 5.2em;
  /* Increased max height */
  letter-spacing: -0.01em;
}

.stock-details {
  width: 55%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  /* Center vertically */
  gap: 4px;
  border-left: 1px solid #eee;
  padding-left: 10px;
}

.detail-item {
  margin: 0;
  font-size: 0.9em;
  text-align: left;
  width: 100%;
  padding: 2px 0;
  display: flex;
  align-items: center;
}

.detail-key {
  font-weight: 600;
  margin-right: 4px;
  color: #444;
  min-width: 80px;
  /* Slightly wider for better spacing */
  font-size: 0.9em;
}

.symbol-value {
  font-weight: 600;
  color: #555;
}

.price-item {
  margin-bottom: 2px;
  /* Reduced margin */
}

.price-value {
  font-weight: 600;
  font-size: 1em;
  color: #212529;
}

.positive {
  color: #28a745;
  /* Brighter green for better visibility */
  font-weight: 600;
}

.negative {
  color: #dc3545;
  /* Brighter red for better visibility */
  font-weight: 600;
}

.neutral {
  color: #f0ad4e;
  /* More distinct yellow */
  font-weight: 600;
}

/* Arrow indicators - making them slightly smaller */
.arrow {
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 3px;
  vertical-align: middle;
}

.arrow.up {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #28a745;
}

.arrow.down {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #dc3545;
}

.neutral-icon {
  display: inline-block;
  width: 6px;
  height: 2px;
  background-color: #f0ad4e;
  margin-right: 3px;
  vertical-align: middle;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 25px;
  font-size: 1.1em;
  color: #666;
}

.error-state {
  color: #dc3545;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 15px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.pagination-button {
  padding: 8px 20px;
  background-color: #171717;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-button:hover:not(:disabled) {
  background-color: #333333;
}

.pagination-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-button {
  opacity: 0.8;
}

.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.page-info {
  font-size: 0.95em;
  color: #555;
  font-weight: 500;
}

/* Responsive Design - Updated for 3 columns layout */
@media (max-width: 1200px) {
  .stock-item {
    width: calc(33.333% - 14px);
  }
}

@media (max-width: 992px) {
  .stock-item {
    width: calc(33.333% - 14px);
  }
}

@media (max-width: 768px) {
  .stock-watch {
    padding: 0 10px;
  }

  .stock-row {
    flex-direction: column;
    gap: 15px;
    margin-bottom: 15px;
    width: 100%;
  }

  .stock-item {
    width: 100%;
    margin-bottom: 0;
    min-height: auto;
    box-sizing: border-box;
  }

  .card-content {
    flex-direction: row;
    min-height: auto;
    padding: 8px 0;
    width: 100%;
  }

  .stock-company {
    width: 40%;
    padding-right: 10px;
  }

  .stock-details {
    width: 60%;
    padding-left: 10px;
  }

  .detail-key {
    min-width: 70px;
    font-size: 0.85em;
  }

  .pagination-container {
    gap: 10px;
  }

  .pagination-button {
    min-width: 80px;
    padding: 6px 12px;
    font-size: 0.9em;
  }

  .page-info {
    font-size: 0.85em;
  }
}

@media (max-width: 480px) {
  .stock-watch {
    padding: 0 8px;
  }

  .stock-item {
    padding: 8px;
  }

  .card-content {
    flex-direction: column;
    gap: 10px;
  }

  .stock-company {
    width: 100%;
    padding-right: 0;
    margin-bottom: 8px;
  }

  .stock-details {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
    padding-left: 0;
    padding-top: 8px;
  }

  .company-name {
    font-size: 0.95em;
    text-align: left;
    -webkit-line-clamp: 2;
    max-height: 2.6em;
  }

  .detail-item {
    justify-content: space-between;
    font-size: 0.85em;
    padding: 3px 0;
  }

  .detail-key {
    min-width: auto;
    margin-right: 8px;
  }

  .pagination-container {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }
}

@media (max-width: 360px) {
  .stock-watch {
    padding: 0 5px;
  }

  .stock-item {
    padding: 6px;
  }

  .company-name {
    font-size: 0.9em;
  }

  .detail-item {
    font-size: 0.8em;
  }
}

@media (max-width: 576px) {
  .stock-item {
    width: 100%;
    /* 1 item per row on very small screens */
  }
}
</style>