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
                />
              </td>
              <td>{{ row.industry }}</td>
              <td>{{ row.units }}</td>
              <td>{{ row.current_price }}</td>
              <td>{{ row.today_change }}</td>
              <td>{{ row.gain_loss }}</td>
              <td>
                <div class="Bollinger-placeholder"></div>
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
          <div class="controls">
            <Multiselect v-model="selectedIndustry" :options="IndustryOptions" placeholder="Pick industry..." />
          </div>
          <div class="Industry-chart">
            <div class="industry-chart-placeholder"></div>
          </div>
          <div class="controls">
            <Multiselect v-model="selectedXAxis" :options="xAxisOptions" placeholder="Pick your x-axis..." />
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
  import allTickers from './all_tickers_NYSE.xlsx'; // Adjust the path if necessary
  import { debounce } from 'lodash';
  
  export default {
    name: 'PortfolioDashboard',
    components: {
      Multiselect,
    },
    data() {
      return {
        options: [],
        IndustryOptions: [],
        xAxisOptions: ['P/E', 'P/B'],
        tickerIndustryPairs: {},
        selectedXAxis: null,
        selectedIndustry: null,
        rows: new Array(4).fill({}).map(() => ({ selectedStock: null, industry: 'null', units: 'null', current_price: 'null', today_change: 'null', gain_loss: 'null' })),
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
          fetch(allTickers)
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
  
        console.log("stock", this.options);
        console.log("industry", this.IndustryOptions);
        console.log("pair", this.tickerIndustryPairs);
      },
      async fetchStockData(ticker) {
        const apiKey = process.env.VUE_APP_STOCK_KEY;
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${ticker}&interval=1min&apikey=${apiKey}`;
  
        try {
          const response = await fetch(url);
          const data = await response.json();
          const timeSeries = data['Time Series (1min)'];
          const latestTimestamp = Object.keys(timeSeries)[0];
          const latestData = timeSeries[latestTimestamp];
  
          const currentPrice = parseFloat(latestData['4. close']);
          const previousPrice = parseFloat(Object.values(timeSeries)[1]['4. close']);
          const todayChange = ((currentPrice - previousPrice) / previousPrice * 100).toFixed(2);
  
          return { currentPrice, todayChange };
        } catch (error) {
          console.error('Error fetching stock data:', error);
          return { currentPrice: 'N/A', todayChange: 'N/A' };
        }
      },
      async handleSelection(selectedStock, row) {
        row.selectedStock = selectedStock;
        row.industry = this.tickerIndustryPairs[selectedStock] || 'Unknown';
        
        const stockData = await this.fetchStockData(selectedStock);
        row.current_price = stockData.currentPrice;
        row.today_change = stockData.todayChange;
        
        this.$forceUpdate(); // Force Vue to re-render the table
      },
      debouncedHandleSelection: debounce(function(selectedStock, row) {
        this.handleSelection(selectedStock, row);
      }, 300), // Debounce time in milliseconds
    },
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  .dashboard {
    width: 100%;
    padding: 20px;
    font-family: Arial, sans-serif;
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
  