<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script>
  import axios from 'axios';
  import { createChart } from 'lightweight-charts';
  
  const API_KEY = 'BS4H8D1PZ63W5IC0';
  
  export default {
    name: 'StockChart',
    props: {
      symbol: String,
    },
    data() {
      return {
        chart: null,
        lineSeries: null,
        updateInterval: null,
      };
    },
    watch: {
      symbol: {
        immediate: true,
        handler(newValue) {
          if (newValue) {
            this.fetchChartData(newValue);
          }
        },
      },
    },
    methods: {
      async fetchChartData(symbol) {
        try {
          const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
          const timeSeries = response.data['Time Series (Daily)'];
  
          if (!timeSeries) {
            console.error('Error: No time series data available in the API response:', response.data);
            return;
          }
  
          let data = Object.keys(timeSeries).map(date => {
            const timestampInSeconds = new Date(date).getTime() / 1000; // Convert date to timestamp in seconds
            return {
              time: timestampInSeconds,
              value: parseFloat(timeSeries[date]['4. close']),
            };
          });
  
          // Sort data by time in ascending order
          data = data.sort((a, b) => a.time - b.time);
  
          this.renderChart(data);
  
          // Set up real-time updates
          this.setupRealTimeUpdates(symbol);
        } catch (error) {
          console.error('Error fetching chart data:', error);
        }
      },
      setupRealTimeUpdates(symbol) {
        if (this.updateInterval) {
          clearInterval(this.updateInterval);
        }
  
        this.updateInterval = setInterval(async () => {
          try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${API_KEY}`);
            const timeSeries = response.data['Time Series (60min)'];
  
            if (!timeSeries) {
              console.error('Error: No time series data available in the API response:', response.data);
              return;
            }
  
            const latestData = Object.keys(timeSeries).map(date => {
              const timestampInSeconds = new Date(date).getTime() / 1000; // Convert date to timestamp in seconds
              return {
                time: timestampInSeconds,
                value: parseFloat(timeSeries[date]['4. close']),
              };
            }).sort((a, b) => a.time - b.time);
  
            // Merge and update the chart with new data, ensuring no duplicates
            const currentData = this.lineSeries.data();
            const mergedData = [...currentData, ...latestData]
              .reduce((acc, item) => {
                if (!acc.some(existing => existing.time === item.time)) {
                  acc.push(item);
                }
                return acc;
              }, [])
              .sort((a, b) => a.time - b.time);
  
            this.lineSeries.setData(mergedData);
          } catch (error) {
            console.error('Error fetching real-time data:', error);
          }
        }, 60000); // Update every minute
      },
      renderChart(data) {
        if (this.chart) {
          this.chart.remove();
        }
  
        this.chart = createChart(this.$refs.chartContainer, {
          width: this.$refs.chartContainer.clientWidth,
          height: this.$refs.chartContainer.clientHeight,
          layout: {
            backgroundColor: '#FFFFFF',
            textColor: '#333',
          },
          grid: {
            vertLines: {
              color: '#eee',
            },
            horzLines: {
              color: '#eee',
            },
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
        });
  
        this.lineSeries = this.chart.addLineSeries({
          color: '#4caf50',
          lineWidth: 2,
          crossHairMarkerVisible: true,
          crossHairMarkerRadius: 6,
        });
        this.lineSeries.setData(data);
  
        this.chart.subscribeCrosshairMove((param) => {
          if (!param || !param.time) {
            this.removeTooltip();
            return;
          }
  
          const point = data.find(item => item.time === param.time);
          if (point) {
            this.showTooltip(point, param);
          }
        });
      },
      showTooltip(point, param) {
        let date = new Date(point.time * 1000); // Convert back to milliseconds
        let dateString = date.toLocaleDateString(undefined, { timeZone: 'UTC' });
        let timeString = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  
        let tooltip = document.querySelector('.tooltip');
        if (!tooltip) {
          tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          this.$refs.chartContainer.appendChild(tooltip);
        }
  
        tooltip.innerHTML = `
          <div>${point.value.toFixed(2)}</div>
          <div>${dateString}</div>
          <div>${timeString}</div>
        `;
        tooltip.style.left = param.point.x + 'px';
        tooltip.style.top = param.point.y + 'px';
        tooltip.style.display = 'block';
      },
      removeTooltip() {
        let tooltip = document.querySelector('.tooltip');
        if (tooltip) {
          tooltip.style.display = 'none';
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.renderChart([]);
      });
    },
    beforeUnmount() {
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }
    }
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  .tooltip {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 3px;
    pointer-events: none;
    display: none;
  }
  </style>
  