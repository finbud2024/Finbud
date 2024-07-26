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

const API_KEY = process.env.VUE_APP_CRYPTO_KEY;

export default {
  name: 'CryptoPopup',
  props: {
    crypto: {
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
    crypto: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.uuid) {
          this.fetchChartData(newValue.uuid);
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
          timePeriod: '1y' // Fetch data for the last month
        }
      });

      let data = response.data.data.history.map(item => {
        const timestampInSeconds = item.timestamp; // Use the timestamp as is (in seconds)
        return {
          time: timestampInSeconds, // Use the timestamp as is
          value: parseFloat(item.price)
        };
      });

      // Sort data by time in ascending order
      data = data.sort((a, b) => a.time - b.time);

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
            timePeriod: '1d' // Fetch the last hour to get real-time updates
          }
        });

        const latestData = response.data.data.history.map(item => {
          const timestampInSeconds = item.timestamp; // Use the timestamp as is (in seconds)
          return {
            time: timestampInSeconds, // Use the timestamp as is
            value: parseFloat(item.price)
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

    // Resize the chart when the window size changes
    window.addEventListener('resize', this.resizeChart);
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

