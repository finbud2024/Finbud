<template>
  <div class="dashboard">
    <header>
      <h1>{{ t('quantPage.StockPortfolioDashboard') }}</h1>
    </header>
    <section class="current-holding">
      <input
      class="ticker-search"
      type="text"
      v-model="tickerSearch"
      :placeholder="t('quantPage.TickerNameSearch')"
      
    />
      
      <div class="margin-box-content">
        <div>
          <div class="scrollable-table">
          <table>
            <thead>
            <tr>
              <th>{{ t('quantPage.StockTicker') }}</th>
              <th>Logo</th>
              <!--<th>Currency Code</th>-->
              <th>{{ t('quantPage.CloseValue') }}</th>
              <!--<th>Price Currency</th>-->
              <th>{{ t('quantPage.PriceChange') }}</th>
              <th>{{ t('quantPage.RelativeVolume') }}</th>
              <th>{{ t('quantPage.PERatio') }}</th>
              <th>{{ t('quantPage.EPSDistributed') }}</th>
              <th>{{ t('quantPage.DividendYield') }}</th>
              <!--<th>Exchange</th>-->
              <th>{{ t('quantPage.IndustrySector') }}</th>
            </tr>
            </thead>

            <tbody v-if="filteredCryptoList.length">
              
            <tr v-for="crypto in filteredCryptoList" :key="crypto.name">
              <td>{{ crypto.name }}</td>
              <td><img :src="`https://s3-symbol-logo.tradingview.com/${crypto.logo}.svg`"
                       :alt="`${crypto.logo} logo`"/></td>
              <!--<td>{{ crypto.currency }}</td>-->
              <td>{{ crypto.close }} </td>
              <!--<td>{{ crypto.priceCurrency }} </td>-->
              <td>{{ formatNumber(crypto.priceChange) }} </td>
              <td>{{ formatNumber(crypto.relativeVolume) }}</td>
              <td>{{ formatNumber(crypto.PERatio) }} </td>
              <td>{{ formatNumber(crypto.EPS) }} </td>
              <td>{{ formatNumber(crypto.dividendYield) }} </td>
              <!--<td>{{ crypto.market }} </td>-->
              <td>{{ crypto.sector }} </td>
            </tr>
            </tbody>
          
          </table>
<!--         <Pagination :currentPage.sync="currentCryptoPage" :totalPages="cryptoTotalPages" @update:currentPage="updateCryptoCurrentPage" />--> 
        </div>
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
  },
};
</script>

<style scoped>
/* Add your styles here */
.scrollable-table {
  max-height: 400px; /* Set the maximum height for the table container */
  overflow-y: auto; /* Enable vertical scrolling */
  border: 1px solid #ccc; /* Optional: Add a border for better visibility */
  margin-top: 10px; /* Add some spacing above the table */
}
.dashboard {
  width: 100%;
  padding: 20px;
  position: relative;
}

.dashboard.loading {
  pointer-events: none;
  opacity: 0.6;
}

.loader {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  perspective: 800px;
  margin: auto;
}

.loader2 {
  position: absolute;
  margin-top: 50px;
  margin-bottom: 50px;
  left: calc(50% - 32px);
  width: 64px;
  height: 64px;
  border-radius: 50%;
  perspective: 800px;
}

.inner {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;  
}

.inner.one {
  left: 0%;
  top: 0%;
  animation: rotate-one 1s linear infinite;
  border-bottom: 3px solid #2a2a5f;
}

.inner.two {
  right: 0%;
  top: 0%;
  animation: rotate-two 1s linear infinite;
  border-right: 3px solid #2a2a5f;
}

.inner.three {
  right: 0%;
  bottom: 0%;
  animation: rotate-three 1s linear infinite;
  border-top: 3px solid #2a2a5f;
}

@keyframes rotate-one {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes rotate-two {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes rotate-three {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}

header {
  background-color:var(--quant-background);
  color: var(--quant-text-color);
  text-align: center;
  padding: 10px;
}

.loading-section {
  text-align: center;
  margin-top: 50px;
}

.current-holding {
  margin-top: 20px;
  background-color:var(--quant-card-background);
  align-content: center;
}

h2 {
  color: var(--quant-card-background);
  font-size: 24px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}
th {
  position: sticky; /* Make the header sticky */
  top: 0; /* Stick the header to the top of the container */
  background-color:var(--quant-card-background); /* Background color for the header */
  color: var(--quant-text-color); /* Text color for the header */
  z-index: 1; /* Ensure the header stays above the table rows */
}

th, td {
  padding: 10px;
  text-align: center;
}

th {

  font-weight: bold;
}

td {
  background-color: #f9f9f9;
}

.industry-comparison {
  margin-top: 10px;
}

.comparison-header {
  align-items: center;
  margin-bottom: 20px;
}

/* --------BOLLINGER CHART--------- */
.Bollinger-placeholder {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  margin: 0 auto;
}

/* --------INDUSTRY CHART--------- */
.Industry-chart {
  width: 100%;
  height: 400px;
  background-color: #e0e0e0;
  margin-bottom: 20px;
}
.industry-chart-placeholder {
  width: 100%;
  height: 300px;
  background-color: #e0e0e0;
}

/* --------X-AXIS CHART--------- */
.xAxis-charts {
  display: block; /* Ensure vertical stacking */
}

.xAxis-chart-placeholder {
  width: 100%;
  height: 200px;
  background-color: #e0e0e0;
  margin-bottom: 20px; /* Space between charts */
}

.comparison-section {
  padding: 20px;
  background-color: #f0f0f0;
}

.industry-selection {
  width: 20%;
  margin-bottom: 20px;
}

.controls {
  width: 20%;
  margin-bottom: 20px;
}

.stock-dropdown {
  width: 15%;
}

label {
  display: block;
  margin-bottom: 10px;
  color: #0033cc;
}
.search-input {
  width: 300px;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.ticker-search {
  display: block; /* Center the input horizontally */
  margin: 20px auto; /* Add spacing and center it */
  padding: 10px 15px; /* Add padding for better appearance */
  width: 50%; /* Make the input longer */
  font-size: 16px; /* Increase font size for readability */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 8px; /* Round the corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
  transition: all 0.3s ease; /* Smooth transition for hover effects */
}

.ticker-search:focus {
  outline: none; /* Remove the default outline */
  border-color: #0073e6; /* Change border color on focus */
  box-shadow: 0 4px 8px rgba(0, 115, 230, 0.2); /* Enhance shadow on focus */
}
</style>
