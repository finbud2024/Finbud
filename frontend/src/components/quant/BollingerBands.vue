<template>
    <div>
      <div v-if="loading" class="loader">
        <div class="inner one"></div>
        <div class="inner two"></div>
        <div class="inner three"></div>
      </div>
      <div v-else>
        <apexchart v-if="chartOptions && chartSeries" type="line" height="200" width="100%" :options="chartOptions" :series="chartSeries" />
      </div>
    </div>
  </template>
  
  <script>
  import VueApexCharts from 'vue3-apexcharts';
  
  export default {
    name: 'BollingerBands',
    components: {
      apexchart: VueApexCharts,
    },
    props: {
      selectedStock: {
        type: String,
        required: true
      },
      onLoadComplete: Function,
      onError: Function
    },
    data() {
      return {
        chartOptions: null,
        chartSeries: null,
        apiKey: process.env.VUE_APP_STOCK_KEY, // Use environment variable for API key
        loading: true
      };
    },
    watch: {
      selectedStock(newStock) {
        if (newStock) {
          this.fetchStockData(newStock);
        }
      }
    },
    methods: {
      async fetchStockData(stock) {
        this.loading = true;
        const priceURL = `https://corsproxy.io/?https://query2.finance.yahoo.com/v8/finance/chart/${stock}?range=1y&interval=1d`;
        const bollingerUrl = `https://www.alphavantage.co/query?function=BBANDS&symbol=${stock}&interval=daily&time_period=20&series_type=close&apikey=${this.apiKey}`;
  
        try {
          // Fetch current price and today's change
          const priceResponse = await fetch(priceURL);
          const priceData = await priceResponse.json();
  
          if (!priceData.chart.result[0]) {
            console.error('No time series data available:', priceData);
            throw new Error('No time series data available');
          }
  
          const timeSeries = priceData.chart.result[0];
          const timestamps = timeSeries.timestamp;
          const indicators = timeSeries.indicators.quote[0];
          const yahooDates = timestamps.map(timestamp => {
            const date = new Date(timestamp * 1000); // Convert to milliseconds
            return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
          });
          const latestPrice = indicators.close[indicators.close.length - 1];
          const previousPrice = indicators.close[indicators.close.length - 2];
          const todayChange = ((latestPrice - previousPrice) / previousPrice * 100).toFixed(2);
  
          this.$emit('updatePrice', { stock, latestPrice, todayChange });
  
          // Fetch Bollinger Bands data
          const bollingerResponse = await fetch(bollingerUrl);
          const bollingerData = await bollingerResponse.json();
  
          if (!bollingerData['Technical Analysis: BBANDS']) {
            console.error('No Bollinger Bands data available:', bollingerData);
            throw new Error('No Bollinger Bands data available');
          }
  
          const bbands = bollingerData['Technical Analysis: BBANDS'];
          const bbDates = Object.keys(bbands).sort((a, b) => new Date(a) - new Date(b));
  
          const bbSeries = bbDates.map(date => {
            const index = yahooDates.indexOf(date);
            if (index === -1) {
              console.warn(`No matching date in Yahoo Finance data for date: ${date}`);
              return null;
            }
            return {
              x: date,
              y: indicators.close[index],
              upper: parseFloat(bbands[date]['Real Upper Band']),
              middle: parseFloat(bbands[date]['Real Middle Band']),
              lower: parseFloat(bbands[date]['Real Lower Band'])
            };
          }).filter(data => data !== null); // Filter out null values
  
          this.chartOptions = {
            chart: {
              height: 200,
              type: 'line'
            },
            title: {
              text: 'Bollinger Bands'
            },
            xaxis: {
              type: 'datetime',
              labels: {
                format: 'MMM dd'
              }
            },
            yaxis: {
              title: {
                text: 'Price'
              }
            },
            stroke: {
              curve: 'smooth'
            },
            tooltip: {
              shared: true
            }
          };
  
          this.chartSeries = [
            {
              name: 'Close',
              data: bbSeries.map(point => ({ x: point.x, y: point.y }))
            },
            {
              name: 'Upper Band',
              data: bbSeries.map(point => ({ x: point.x, y: point.upper }))
            },
            {
              name: 'Lower Band',
              data: bbSeries.map(point => ({ x: point.x, y: point.lower }))
            }
          ];
  
          this.loading = false;
          if (this.onLoadComplete) this.onLoadComplete(stock);
        } catch (error) {
          console.error('Error fetching stock data:', error);
          this.loading = false;
          if (this.onError) this.onError(stock);
        }
      }
    },
    mounted() {
      if (this.selectedStock) {
        this.fetchStockData(this.selectedStock);
      }
    }
  };
  </script>
  
  <style scoped>
  .loader {
    position: relative;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    perspective: 800px;
    margin: auto;
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
  </style>
  