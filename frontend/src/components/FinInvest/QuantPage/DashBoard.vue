<template>
  <div class="dashboard">
    <header>
      <h1>{{ t('quantPage.StockPortfolioDashboard') }}</h1>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading portfolio data...</p>
    </div>

    <!-- Main Content -->
    <section v-else class="current-holding">
      <div class="controls">
        <input
          class="ticker-search"
          type="text"
          v-model="tickerSearch"
          :placeholder="t('quantPage.TickerNameSearch')"
        />
        <button class="display-toggle" @click="toggleDisplayType">
          <i :class="displayType === 'grid' ? 'bi bi-grid' : 'bi bi-list'"></i>
        </button>
      </div>
      
      <!-- Empty State -->
      <div v-if="!cryptoList || cryptoList.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>No Portfolio Data Available</h3>
        <p>Unable to load portfolio information. Please try refreshing the page.</p>
        <button @click="loadData" class="retry-btn">Retry</button>
      </div>

      <!-- Data Display -->
      <div v-else class="margin-box-content">
        <!-- Portfolio Summary -->
        <div class="portfolio-summary">
          <div class="summary-card">
            <h4>Total Stocks</h4>
            <span class="summary-value">{{ cryptoList.length }}</span>
          </div>
          <div class="summary-card">
            <h4>Sectors</h4>
            <span class="summary-value">{{ IndustryOptions.length }}</span>
          </div>
          <div class="summary-card">
            <h4>Avg P/E Ratio</h4>
            <span class="summary-value">{{ averagePE }}</span>
          </div>
        </div>

        <!-- Grid View -->
        <div v-if="displayType === 'grid'" class="stock-grid">
          <div v-for="stock in paginatedStocks" :key="stock.symbol" class="stock-card">
            <div class="stock-header">
              <img 
                :src="stock.logo" 
                :alt="stock.name" 
                class="stock-logo" 
                @error="handleLogoError"
                v-if="stock.logo"
              />
              <div class="stock-title">
                <h3>{{ stock.symbol }}</h3>
                <p>{{ stock.name }}</p>
              </div>
            </div>
            <div class="stock-details">
              <div class="detail-row">
                <span class="label">Price</span>
                <span class="value">${{ formatNumber(stock.close) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Change</span>
                <span class="value" :class="stock.priceChange >= 0 ? 'positive' : 'negative'">
                  {{ formatNumber(stock.priceChange) }}%
                </span>
              </div>
              <div class="detail-row">
                <span class="label">Volume</span>
                <span class="value">{{ formatNumber(stock.relativeVolume) }}</span>
              </div>
              <div class="detail-row">
                <span class="label">P/E</span>
                <span class="value">{{ formatNumber(stock.peRatio) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="scrollable-table">
          <table>
            <thead>
            <tr>
              <th>{{ t('quantPage.StockTicker') }}</th>
              <th>Logo</th>
              <th>{{ t('quantPage.CloseValue') }}</th>
              <th>{{ t('quantPage.PriceChange') }}</th>
              <th>{{ t('quantPage.RelativeVolume') }}</th>
              <th>{{ t('quantPage.PERatio') }}</th>
              <th>{{ t('quantPage.EPSDistributed') }}</th>
              <th>{{ t('quantPage.DividendYield') }}</th>
              <th>{{ t('quantPage.IndustrySector') }}</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="stock in paginatedStocks" :key="stock.symbol">
                <td>{{ stock.symbol }}</td>
                <td>
                  <img 
                    :src="stock.logo" 
                    :alt="stock.name" 
                    class="table-logo" 
                    @error="handleLogoError"
                    v-if="stock.logo"
                  />
                </td>
                <td>${{ formatNumber(stock.close) }}</td>
                <td :class="stock.priceChange >= 0 ? 'positive' : 'negative'">
                  {{ formatNumber(stock.priceChange) }}%
                </td>
                <td>{{ formatNumber(stock.relativeVolume) }}</td>
                <td>{{ formatNumber(stock.peRatio) }}</td>
                <td>{{ formatNumber(stock.eps) }}</td>
                <td>{{ formatNumber(stock.dividendYield) }}%</td>
                <td>{{ stock.sector }}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            class="page-btn"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>
          <button 
            class="page-btn" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </section>

    <!--<section class="industry-comparison">
      <header>
        <h1>Portfolio By Industry</h1>
      </header>
      <section class="comparison-section">
        <div class="comparison-header">
          <h2>Comparison Stocks in the Industry Map</h2>
        </div>
        <div class="industry-selection">
          <Multiselect v-model="selectedIndustry" :options="IndustryOptions" placeholder="Pick industry..." @update:modelValue="debouncedGenerateBubbleChart" :disabled="isLoading" />
          <div v-if="isLoading" class="loader2">
            <div class="inner one"></div>
            <div class="inner two"></div>
            <div class="inner three"></div>
          </div>
        </div>
        <div id="chart" v-if="!isLoading">
          <apexchart v-if="chartOptions" type="bubble" height="400" :options="chartOptions" :series="chartSeries" />
        </div>
        <div class="controls">
          <Multiselect v-model="selectedXAxis" :options="xAxisOptions" placeholder="Pick your x-axis..." :disabled="isLoading" />
        </div>
        <div class="xAxis-charts">
          <div class="xAxis-chart-placeholder"></div>
          <div class="xAxis-chart-placeholder"></div>
        </div>
      </section>
    </section>-->
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import * as XLSX from 'xlsx';
import { debounce } from 'lodash';
import VueApexCharts from 'vue3-apexcharts';
import BollingerBands from './BollingerBands.vue';
import Pagination from "@/components/Risk&Chat/Pagination.vue";
import axios from "axios";
import { useI18n } from 'vue-i18n';
// Register Chart.js components

export default {
  name: 'PortfolioDashboard',
  components: {
    Pagination,
    Multiselect,
    apexchart: VueApexCharts,
    BollingerBands,
  },
  setup() {
    const { t } = useI18n(); // Initialize the translation function
    return { t };
  },
  data() {
    return {
      options: [],
      cryptoList: [],
      IndustryOptions: [],
      xAxisOptions: ['P/E', 'P/B'],
      tickerIndustryPairs: {},
      selectedXAxis: null,
      selectedIndustry: null,
      rows: new Array(4).fill({}).map(() => ({
        selectedStock: null,
        industry: 'null',
        units: 'null',
        current_price: 'null',
        today_change: 'null',
        gain_loss: 'null',
        loading: false,
      })),
      tickerSearch: '', 
      chartOptions: null,
      chartSeries: null,
      processedData: null,
      isLoading: false, // Loading state
      currentPage: 1,
      itemsPerPage: 20,
      displayType: 'grid', // 'grid' or 'table'
    };
  },
  mounted() {
    this.loadData();
    this.getCryptoPrice();
  },

  computed: {
    filteredCryptoList() {
      if (!this.tickerSearch) {
        return this.cryptoList;
      }
      const searchTerm = this.tickerSearch.toLowerCase();
      return this.cryptoList.filter(crypto =>
        crypto.name.toLowerCase().includes(searchTerm) ||
        crypto.symbol.toLowerCase().includes(searchTerm)
      );
    },
    paginatedStocks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCryptoList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCryptoList.length / this.itemsPerPage);
    },
    averagePE() {
      if (!this.cryptoList || this.cryptoList.length === 0) return '0.00';
      const validPEs = this.cryptoList
        .map(stock => parseFloat(stock.peRatio))
        .filter(pe => !isNaN(pe) && pe > 0);
      if (validPEs.length === 0) return '0.00';
      const average = validPEs.reduce((sum, pe) => sum + pe, 0) / validPEs.length;
      return average.toFixed(2);
    },
    visiblePages() {
      const maxVisible = 5;
      const total = this.totalPages;
      const current = this.currentPage;
      
      if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      
      const start = Math.max(1, current - Math.floor(maxVisible / 2));
      const end = Math.min(total, start + maxVisible - 1);
      
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  }, 
  
  methods: {
    async loadData() {
      this.isLoading = true;
      
      try {
        // First try to get data from our stocks API
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL || 'http://localhost:3000'}/api/stocks`);
        if (response.data && response.data.stocks && response.data.stocks.length > 0) {
          this.processAPIData(response.data.stocks);
          this.isLoading = false;
          return;
        }
      } catch (error) {
        console.warn('Failed to fetch from stocks API:', error);
      }

      // Fallback: Try cached data
      const cachedData = localStorage.getItem('tickerData');
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          this.processData(parsedData);
          this.isLoading = false;
          return;
        } catch (error) {
          console.warn('Failed to parse cached data:', error);
        }
      }

      // Final fallback: Use mock data
      console.warn('Using mock data for portfolio dashboard');
      this.generateMockData();
      this.isLoading = false;
    },

    processAPIData(stocksData) {
      // Transform API data to expected format
      const transformedData = stocksData.map(stock => ({
        symbol: stock.symbol || stock.ticker_symbol,
        name: stock.name || stock.symbol,
        close: parseFloat(stock.close) || Math.random() * 200 + 50,
        priceChange: parseFloat(stock.priceChange) || (Math.random() - 0.5) * 10,
        relativeVolume: parseFloat(stock.volume) || Math.floor(Math.random() * 10000000),
        peRatio: parseFloat(stock.peRatio) || Math.random() * 30 + 5,
        eps: parseFloat(stock.eps) || Math.random() * 5,
        dividendYield: parseFloat(stock.dividendYield) || Math.random() * 5,
        sector: stock.sector || 'Technology',
        logo: stock.logo || `https://logo.clearbit.com/${stock.symbol?.toLowerCase()}.com`,
        industry: stock.industry || 'Software'
      }));

      this.cryptoList = transformedData;
      
      // Process industry and ticker options
      const optionsSet = new Set();
      const industrySet = new Set();
      const tickerIndustryPairs = {};

      transformedData.forEach(stock => {
        optionsSet.add(stock.symbol);
        industrySet.add(stock.industry);
        tickerIndustryPairs[stock.symbol] = stock.industry;
      });

      this.options = Array.from(optionsSet);
      this.IndustryOptions = Array.from(industrySet);
      this.tickerIndustryPairs = tickerIndustryPairs;
      this.processedData = transformedData;

      // Cache the data
      localStorage.setItem('portfolioData', JSON.stringify(transformedData));
    },

    generateMockData() {
      const mockStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Software' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary', industry: 'E-commerce' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary', industry: 'Electric Vehicles' },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology', industry: 'Social Media' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', industry: 'Banking' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Pharmaceuticals' },
        { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services', industry: 'Payment Processing' },
        { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples', industry: 'Personal Care' },
        { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare', industry: 'Health Insurance' },
        { symbol: 'HD', name: 'The Home Depot Inc.', sector: 'Consumer Discretionary', industry: 'Home Improvement' },
        { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services', industry: 'Payment Processing' },
        { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services', industry: 'Banking' },
        { symbol: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services', industry: 'Entertainment' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', industry: 'Software' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology', industry: 'Cloud Computing' },
        { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services', industry: 'Streaming' },
        { symbol: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples', industry: 'Beverages' },
      ];

      const transformedMockData = mockStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        close: Math.random() * 300 + 50, // Random price between $50-$350
        priceChange: (Math.random() - 0.5) * 10, // Random change between -5% and +5%
        relativeVolume: Math.floor(Math.random() * 10000000) + 1000000, // Random volume
        peRatio: Math.random() * 40 + 5, // Random P/E ratio
        eps: Math.random() * 10 + 0.5, // Random EPS
        dividendYield: Math.random() * 5, // Random dividend yield
        sector: stock.sector,
        industry: stock.industry,
        logo: `https://logo.clearbit.com/${stock.symbol.toLowerCase()}.com`
      }));

      this.cryptoList = transformedMockData;
      
      // Process industry and ticker options
      const optionsSet = new Set();
      const industrySet = new Set();
      const tickerIndustryPairs = {};

      transformedMockData.forEach(stock => {
        optionsSet.add(stock.symbol);
        industrySet.add(stock.industry);
        tickerIndustryPairs[stock.symbol] = stock.industry;
      });

      this.options = Array.from(optionsSet);
      this.IndustryOptions = Array.from(industrySet);
      this.tickerIndustryPairs = tickerIndustryPairs;
      this.processedData = transformedMockData;
    },

    processData(worksheet) {
      if (!Array.isArray(worksheet)) {
        console.error('Worksheet is not an array:', worksheet);
        this.generateMockData();
        return;
      }

      const optionsSet = new Set();
      const industrySet = new Set();
      const tickerIndustryPairs = {};

      worksheet.forEach(row => {
        const ticker = row.ticker_symbol || row.symbol;
        const industry = row.industry;
        if (ticker) {
          optionsSet.add(ticker);
          industrySet.add(industry);
          tickerIndustryPairs[ticker] = industry;
        }
      });

      this.options = Array.from(optionsSet);
      this.IndustryOptions = Array.from(industrySet);
      this.tickerIndustryPairs = tickerIndustryPairs;
      this.processedData = worksheet;

      console.log("stocks loaded:", this.options.length);
      console.log("industries:", this.IndustryOptions.length);
    },
    async handleSelection(selectedStock, row) {
      if (!selectedStock) {
        // Reset row data if stock is deselected
        row.selectedStock = 'null';
        row.industry = 'null';
        row.units = 'null';
        row.current_price = 'null';
        row.today_change = 'null';
        row.gain_loss = 'null';
        row.loading = false;
        this.$forceUpdate(); // Force Vue to re-render the table
        return;
      }
      row.selectedStock = selectedStock;
      row.loading = true; // Start loading
      row.industry = this.tickerIndustryPairs[selectedStock] || 'Unknown';

      // Simulate a delay for fetching data
      setTimeout(() => {
        this.$forceUpdate(); // Force Vue to re-render the table
      }, 2000); // Adjust the delay as needed
    },
    debouncedHandleSelection: debounce(function(selectedStock, row) {
      this.handleSelection(selectedStock, row);
    }, 300), // Debounce time in milliseconds
    updatePrice({ stock, latestPrice, todayChange }) {
      const row = this.rows.find(row => row.selectedStock === stock);
      if (row) {
        row.current_price = `$${latestPrice.toFixed(2)}`;
        row.today_change = `${todayChange}%`;
        // Keep row.loading as true until BollingerBands component completes loading
      }
    },
    generateUniqueRandomColors(numColors) {
      const colors = new Set();
      while (colors.size < numColors) {
        colors.add(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
      }
      return Array.from(colors);
    },
    async generateBubbleChart() {
      if (!this.selectedIndustry) return;

      this.isLoading = true; // Start loading

      // Wrap the processing logic in a promise to handle asynchronous operations
      await new Promise(resolve => {
        setTimeout(() => {
          const industryStocks = this.processedData
            .filter(row => row.industry === this.selectedIndustry)
            .map(row => ({
              x: Math.random() * 70, // Randomly generated P/E
              y: Math.random() * 100, // Randomly generated EPS
              z: Math.random() * 1000, // Randomly generated market cap or size
              name: row.ticker_symbol
            }));

          const colors = this.generateUniqueRandomColors(industryStocks.length);

          const seriesData = industryStocks.map((stock, index) => ({
            name: stock.name,
            data: [{
              x: stock.x,
              y: stock.y,
              z: stock.z,
            }],
            color: colors[index]
          }));

          this.chartOptions = {
            chart: {
              height: 350,
              type: 'bubble',
            },
            dataLabels: {
              enabled: false
            },
            fill: {
              opacity: 0.8
            },
            title: {
              text: 'Stocks in Selected Industry'
            },
            xaxis: {
              tickAmount: 12,
              title: {
                text: 'P/E'
              },
              labels: {
                formatter: function(val) {
                  return parseFloat(val).toFixed(2);
                }
              }
            },
            yaxis: {
              max: 100,
              title: {
                text: 'EPS'
              },
              labels: {
                formatter: function(val) {
                  return parseFloat(val).toFixed(2);
                }
              }
            },
            legend: {
              position: 'right',
              formatter: function(seriesName, opts) {
                return [seriesName]
              }
            }
          };

          this.chartSeries = seriesData;

          this.isLoading = false; // End loading
          resolve(); // Resolve the promise
        }, 1000); // Simulate processing delay
      });
    },
    debouncedGenerateBubbleChart: debounce(function() {
      this.generateBubbleChart();
    }, 300), // Debounce time in milliseconds
    async getCryptoPrice() {
      // If we already have data, don't fetch again
      if (this.cryptoList && this.cryptoList.length > 0) {
        return;
      }

      const api = `${process.env.VUE_APP_DEPLOY_URL || 'http://localhost:3000'}/api/stocks`;
      try {
        this.isLoading = true;
        const res = await axios.get(api);
        if (res.data && res.data.stocks) {
          this.processAPIData(res.data.stocks);
        } else {
          this.generateMockData();
        }
      } catch (error) {
        console.error('Failed to fetch stock data:', error);
        // If API fails, try to use mock data
        this.generateMockData();
      } finally {
        this.isLoading = false;
      }
    },
    formatNumber(value) {
    if (value === null || value === undefined) return '-'; // handle empty or null
    const number = Number(value);
    if (isNaN(number)) return value; // if not a number, just return as-is
    return number.toFixed(2);
  },
    changePage(page) {
      this.currentPage = page;
    },
    toggleDisplayType() {
      this.displayType = this.displayType === 'grid' ? 'table' : 'grid';
    },
    handleLogoError() {
      // Handle logo error
      console.error('Failed to load logo');
    }
  },
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  background: var(--quant-background);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 1.5rem;
}

.ticker-search {
  width: 100%;
  max-width: 400px;
  padding: 12px 20px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  margin-bottom: 2rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.ticker-search:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.margin-box-content {
  background: var(--bg-primary);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.scrollable-table {
  overflow-x: auto;
  border-radius: 12px;
  background: var(--bg-primary);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 1rem;
}

th {
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 10;
}

td {
  padding: 1rem;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  transition: all 0.3s ease;
  }

tr {
  transition: all 0.3s ease;
  }

tr:hover {
  background: var(--hover-bg);
  transform: translateX(5px);
}

/* Dark mode specific styles */
:root[data-theme="dark"] td {
  color: #000;
  background: #fff;
  }

:root[data-theme="dark"] th {
  color: #000;
  background: #f0f0f0;
  }

/* Grid layout for stocks */
.stock-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
  }

.stock-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stock-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stock-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stock-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.table-logo {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.stock-title h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.stock-title p {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.stock-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.value {
  font-weight: 500;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: var(--hover-bg);
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stock-card {
  animation: fadeIn 0.3s ease forwards;
}

.stock-card:nth-child(n) {
  animation-delay: calc(n * 0.05s);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.display-toggle {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.display-toggle:hover {
  background: var(--hover-bg);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-align: center;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.retry-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: var(--hover-bg);
}

/* Portfolio Summary */
.portfolio-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.summary-card h4 {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  display: block;
}

/* Controls Enhancement */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.display-toggle {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.display-toggle:hover {
  background: var(--hover-bg);
  border-color: var(--primary-color);
}

.display-toggle i {
  font-size: 1.2rem;
}

/* Pagination Enhancement */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 40px;
  text-align: center;
}

.page-btn:hover:not(:disabled) {
  background: var(--hover-bg);
  border-color: var(--primary-color);
}

.page-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ticker-search {
    max-width: 100%;
  }
  
  .portfolio-summary {
    grid-template-columns: 1fr;
  }
  
  .stock-grid {
    grid-template-columns: 1fr;
  }
  
  .pagination {
    gap: 0.25rem;
  }
  
  .page-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .dashboard {
    padding: 1rem;
  }
  
  .summary-card {
    padding: 1rem;
  }
  
  .summary-value {
    font-size: 1.5rem;
  }
}
</style>
