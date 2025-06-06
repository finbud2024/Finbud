<template>
  <div class="popup">
    <div class="popup-content">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <div ref="chartContainer" class="chart-container"></div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { createChart } from 'lightweight-charts';

const API_KEY = process.env.VUE_APP_STOCK_KEY;

export default {
  name: 'StockPopup',
  props: {
    stock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      lineSeries: null,
      updateInterval: null,
    };
  },
  watch: {
    stock: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue['01. symbol']) {
          this.fetchChartData(newValue['01. symbol']);
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
    if (!this.$refs.chartContainer) {
      console.warn('Chart container not found');
      return;
    }

    try {
      // Remove old chart if exists
      if (this.chart) {
        this.chart.remove();
        this.chart = null;
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

      if (this.chart && data) {
        const lineSeries = this.chart.addLineSeries({
          color: '#4caf50',
          lineWidth: 2,
          crossHairMarkerVisible: true,
          crossHairMarkerRadius: 6,
        });
        lineSeries.setData(data);
      }
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  },
  resizeChart() {
    if (this.chart) {
      this.chart.resize(this.$refs.chartContainer.clientWidth, this.$refs.chartContainer.clientHeight);
    }
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

    // tooltip.innerHTML = `
    //   <div>${point.value.toFixed(2)}</div>
    //   <div>${dateString}</div>
    //   <div>${timeString}</div>
    // `;
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
  // Cleanup chart before component is destroyed
  if (this.chart) {
    this.chart.remove();
    this.chart = null;
  }
  // Clear any intervals
  if (this.updateInterval) {
    clearInterval(this.updateInterval);
  }
  window.removeEventListener('resize', this.resizeChart);
}
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure the popup appears above other content */
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 50%; /* Set height to 50% of the viewport height */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .popup-content {
    width: 90%;
    height: 55%;
  }
}

@media (max-width: 992px) {
  .popup-content {
    width: 80%;
    height: 60%;
  }
}

@media (max-width: 768px) {
  .popup-content {
    width: 80%;
    height: 60%;
  }

  .close-btn {
    top: 15px;
    right: 15px;
    font-size: 2em;
  }
}

@media (max-width: 576px) {
  .popup-content {
    width: 80%;
    height: 50%;
  }
}

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

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  z-index: 1001;
}
</style>
