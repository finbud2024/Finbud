<template>
  <div class="popup">
    <div class="popup-content">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <div class="timeframe-selector">
        <div class="button-group">
          <button
            v-for="(label, key) in timeframes"
            :key="key"
            @click="fetchCandlestickData(key)"
            :class="{ active: selectedTimeframe === key }"
          >
            {{ label }}
          </button>
        </div>
        <div class="dropdown-group">
          <select v-model="selectedTimeframe" @change="fetchCandlestickData(selectedTimeframe)">
            <option v-for="(label, key) in timeframes" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>
      </div>
      <div ref="chartContainer" class="chart-container"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { createChart } from 'lightweight-charts';

const BINANCE_API_KEY = process.env.VUE_APP_BINANCE_API_KEY;
const DEPLOY_URL = process.env.VUE_APP_DEPLOY_URL;


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
      candleSeries: null,
      selectedTimeframe: '1D',
      timeframes: {
        '1D': 'IN DAY (1D)',
        '7D': '7 DAY (7D)',          //
        '1M': '1 MONTH (1M)',
        '3M': '3 MONTH (3M)',        // 
        '6M': '6 MONTH (6M)',
        '1Y': '1 YEAR (1Y)',
        '3Y': '3 YEAR (3Y)',
      },
      intervalMap: {
        '1D': '1m',
        '7D': '1m',
        '1M': '1h',
        '3M': '1h',
        '6M': '3h',
        '1Y': '1d',
        '3Y': '1w',
      },
      limitMap: {
        '1D': 1440,   // 1440 minutes in a day
        '7D': 10080,  // 10080 minutes in 7 days
        '1M': 720,    // 720 hours in a 30-day month
        '3M': 2160,   // 2160 hours in 3 months (assuming 90 days)
        '6M': 1440,   // 1440 3-hour intervals in 6 months (assuming 180 days)
        '1Y': 365,    // 365 days in a year
        '3Y': 156,    // 156 weeks in 3 years (assuming 52 weeks per year)
      },
      updateInterval: null,
    };
  },
  watch: {
    crypto: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue.symbol) {
          this.fetchCandlestickData(this.selectedTimeframe);
        }
      },
    },
  },
  methods: {
    async fetchCandlestickData(timeframe) {
      this.selectedTimeframe = timeframe;

      try {
        const interval = this.intervalMap[timeframe];
        const limit = this.limitMap[timeframe];
        const symbol = this.crypto.symbol + 'USDT'; // Assuming USDT pairs

        const response = await axios.post(`${DEPLOY_URL}/proxy`, {
          url: `https://api.binance.com/api/v3/klines`,
          method: 'GET',
          headers: {
            'X-MBX-APIKEY': BINANCE_API_KEY,
          },
          params: {
            symbol,
            interval,
            limit,
          },
        });

        const data = response.data.map(candle => ({
          time: candle[0] / 1000, // Convert to seconds
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
        }));

        this.renderChart(data);
      } catch (error) {
        console.error('Error fetching candlestick data:', error);
      }
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

      this.candleSeries = this.chart.addCandlestickSeries({
        upColor: '#4caf50',
        downColor: '#ff5252',
        borderVisible: true,
        wickVisible: true,
        borderColor: '#333',
        wickColor: '#333',
      });

      this.candleSeries.setData(data);

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
  },
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
  max-width: 1600px;
  height: 80%; /* Set height to 50% of the viewport height */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.timeframe-selector {
  margin-top: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.dropdown-group {
  display: none;
}

.timeframe-selector button {
  background: none;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 5px 10px;
  margin-right: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.timeframe-selector button.active,
.timeframe-selector button:hover {
  background: #007bff;
  color: #fff;
}

@media (max-width: 992px) {
  .button-group {
    display: none;
  }
  .dropdown-group {
    display: block;
  }

  .dropdown-group select {
    padding: 5px 10px;
    border: 1px solid #007bff;
    color: #007bff;
    background: none;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
    width: 100%;
  }

  .dropdown-group select:focus {
    outline: none;
    border-color: #0056b3;
  }
}

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
  height: 90%;
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
