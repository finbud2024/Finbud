<template>
  <div class="dashboard">
    <header>
      <h1>{{ t('quantPage.StockPortfolioDashboard') }}</h1>
    </header>
    <section class="current-holding">
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
      
      <div class="margin-box-content">
        <!-- Grid View -->
        <div v-if="displayType === 'grid'" class="stock-grid">
          <div v-for="stock in paginatedStocks" :key="stock.symbol" class="stock-card">
            <div class="stock-header">
              <img :src="stock.logo" :alt="stock.name" class="stock-logo" v-if="stock.logo"/>
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
                <td><img :src="stock.logo" :alt="stock.name" class="table-logo" v-if="stock.logo"/></td>
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
        <div class="pagination">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>
          <button 
            v-for="page in totalPages" 
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
        crypto.name.toLowerCase().includes(searchTerm)
      );
    },
    paginatedStocks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCryptoList.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCryptoList.length / this.itemsPerPage);
    }
  }, 
  
  methods: {
    loadData() {
      const cachedData = localStorage.getItem('tickerData');

      if (cachedData) {
        const parsedData = JSON.parse(cachedData);
        this.processData(parsedData);
      } else {
        fetch('/mnt/data/all_tickers_NYSE.xlsx')
          .then(response => response.arrayBuffer())
          .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Cache the parsed data
            localStorage.setItem('tickerData', JSON.stringify(worksheet));
            this.processData(worksheet);
          })
          .catch(error => {
            console.error('Error loading the Excel file:', error);
          });
      }
    },
    processData(worksheet) {
      if (!Array.isArray(worksheet)) {
        console.error('Worksheet is not an array:', worksheet);
        return;
      }

      const optionsSet = new Set();
      const industrySet = new Set();
      const tickerIndustryPairs = {};

      worksheet.forEach(row => {
        const ticker = row.ticker_symbol;
        const industry = row.industry;
        optionsSet.add(ticker);
        industrySet.add(industry);
        tickerIndustryPairs[ticker] = industry;
      });

      this.options = Array.from(optionsSet);
      this.IndustryOptions = Array.from(industrySet);
      this.tickerIndustryPairs = tickerIndustryPairs;
      this.processedData = worksheet;

      console.log("stock", this.options);
      console.log("industry", this.IndustryOptions);
      console.log("pair", this.tickerIndustryPairs);
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
      const api = `${process.env.VUE_APP_DEPLOY_URL}/api/stocks`
      try {
        const res = await axios.get(api);
        this.cryptoList = res.data.stocks;
        this.loadingCrypto = false;
      } catch (error) {
        this.errorCrypto = 'Failed to fetch holding list';
        this.loadingCrypto = false;
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
</style>
