<template>
    <div ref="chartContainer" class="chart-container"></div>
  </template>
  
  <script>
  import axios from 'axios';
  import { createChart } from 'lightweight-charts';
  
  const API_KEY = 'coinranking687d4cc37a39468baeffcc6c0546f518c3c54b2b87e4f73a';
  
  export default {
    name: 'CryptoChart',
    props: {
      uuid: String,
    },
    data() {
      return {
        chart: null,
        lineSeries: null,
        updateInterval: null,
      };
    },
    watch: {
      uuid: {
        immediate: true,
        handler(newValue) {
          if (newValue) {
            this.fetchChartData(newValue);
          }
        },
      },
    },
    methods: {
        async fetchChartData(uuid) {
            try {
            const response = await axios.get(`https://api.coinranking.com/v2/coin/${uuid}/history`, {
                headers: {
                'Authorization': `Bearer ${API_KEY}`
                },
                params: {
                referenceCurrencyUuid: 'yhjMzLPhuIDl', // Assuming USD as the reference currency
                timePeriod: '30d' // Fetch data for the last month
                }
            });

            console.log('API Response:', response.data.data.history);

            let data = response.data.data.history.map(item => {
                const timestampInSeconds = item.timestamp; // Use the timestamp as is (in seconds)
                console.log('Timestamp:', item.timestamp, 'In seconds:', timestampInSeconds);
                return {
                time: timestampInSeconds, // Use the timestamp as is
                value: parseFloat(item.price)
                };
            });

            // Sort data by time in ascending order
            data = data.sort((a, b) => a.time - b.time);

            console.log('Processed Data:', data);
            this.renderChart(data);

            // Set up real-time updates
            this.setupRealTimeUpdates(uuid);
            } catch (error) {
            console.error('Error fetching chart data:', error);
            }
        },
        setupRealTimeUpdates(uuid) {
            if (this.updateInterval) {
            clearInterval(this.updateInterval);
            }

            this.updateInterval = setInterval(async () => {
            try {
                const response = await axios.get(`https://api.coinranking.com/v2/coin/${uuid}/history`, {
                headers: {
                    'Authorization': `Bearer ${API_KEY}`
                },
                params: {
                    referenceCurrencyUuid: 'yhjMzLPhuIDl',
                    timePeriod: '1h' // Fetch the last hour to get real-time updates
                }
                });

                const latestData = response.data.data.history.map(item => {
                const timestampInSeconds = item.timestamp; // Use the timestamp as is (in seconds)
                return {
                    time: timestampInSeconds, // Use the timestamp as is
                    value: parseFloat(item.price)
                };
                }).sort((a, b) => a.time - b.time);

                console.log('Latest Data:', latestData);

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
  
  <style>
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
  