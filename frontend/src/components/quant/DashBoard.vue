<template>
  <div class="dashboard">
    <header>
      <h1>Personal Stock Portfolio Dashboard</h1>
    </header>
    <section class="current-holding">
      <h2>Current Holding</h2>
      <table>
        <thead>
          <tr>
            <th>Stock (Exchange: Ticker)</th>
            <th>Industry</th>
            <th>Units</th>
            <th>Current Price</th>
            <th>Today Change</th>
            <th>Gain/Loss</th>
            <th>Bollinger Bands over 12 months</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in rows" :key="index">
            <td class="stock-dropdown">
              <Multiselect 
                :options="options" 
                placeholder="Select..." 
                v-model="row.selectedStock"
                @update:modelValue="debouncedHandleSelection($event, row)"
                :disabled="isLoading || row.loading"
              />
            </td>
            <td>
              <div v-if="row.loading" class="loader">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
              <div v-else>{{ row.industry }}</div>
            </td>
            <td>
              <div v-if="row.loading" class="loader">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
              <div v-else>{{ row.units }}</div>
            </td>
            <td>
              <div v-if="row.loading" class="loader">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
              <div v-else>{{ row.current_price }}</div>
            </td>
            <td>
              <div v-if="row.loading" class="loader">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
              <div v-else>{{ row.today_change }}</div>
            </td>
            <td>
              <div v-if="row.loading" class="loader">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
              <div v-else>{{ row.gain_loss }}</div>
            </td>
            <td>
              <div v-if="row.loading" class="loader">
                <div class="inner one"></div>
                <div class="inner two"></div>
                <div class="inner three"></div>
              </div>
              <div v-else>
                <BollingerBands 
                  :selectedStock="row.selectedStock" 
                  @updatePrice="updatePrice" 
                  :onLoadComplete="() => row.loading = false"
                  :onError="() => row.loading = false"
                  v-if="row.selectedStock"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="industry-comparison">
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
    </section>
  </div>
</template>

<script>
import Multiselect from '@vueform/multiselect';
import '@vueform/multiselect/themes/default.css';
import * as XLSX from 'xlsx';
import { debounce } from 'lodash';
import VueApexCharts from 'vue3-apexcharts';
import BollingerBands from './BollingerBands.vue';

export default {
  name: 'PortfolioDashboard',
  components: {
    Multiselect,
    apexchart: VueApexCharts,
    BollingerBands
  },
  data() {
    return {
      options: [],
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
      chartOptions: null,
      chartSeries: null,
      processedData: null,
      isLoading: false, // Loading state
    };
  },
  mounted() {
    this.loadData();
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
    }, 300) // Debounce time in milliseconds
  },
};
</script>

<style scoped>
/* Add your styles here */
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
  background-color: #0033cc;
  color: white;
  text-align: center;
  padding: 10px;
}

.loading-section {
  text-align: center;
  margin-top: 50px;
}

.current-holding {
  margin-top: 20px;
  background-color: rgb(94, 169, 212);
  align-content: center;
}

h2 {
  color: #0033cc;
  font-size: 24px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: center;
}

th {
  background-color: #0073e6;
  color: white;
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
</style>
