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
import ApexCharts from 'apexcharts';

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
            timePeriod: '1y' // Fetch data for the last year
          }
        });

        const data = response.data.data.history.map(item => {
          const timestampInMilliseconds = item.timestamp * 1000; // Convert to milliseconds
          return {
            x: new Date(timestampInMilliseconds),
            y: [
              parseFloat(item.price), // Open
              parseFloat(item.price) * 1.01, // High (sample logic for example)
              parseFloat(item.price) * 0.99, // Low (sample logic for example)
              parseFloat(item.price) // Close
            ]
          };
        });

        // Render the chart with the fetched data
        this.renderChart(data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    },
    renderChart(data) {
      if (this.chart) {
        this.chart.destroy();
      }

      const options = {
        chart: {
          type: 'candlestick',
          height: '100%',
          width: '100%',
        },
        series: [{
          data: data
        }],
        xaxis: {
          type: 'datetime',
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        },
        tooltip: {
          enabled: true,
          shared: true,
          x: {
            format: 'dd MMM yyyy'
          }
        },
        plotOptions: {
          candlestick: {
            colors: {
              upward: '#00B746',
              downward: '#EF403C'
            },
            wick: {
              useFillColor: true,
            }
          }
        }
      };

      this.chart = new ApexCharts(this.$refs.chartContainer, options);
      this.chart.render();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.renderChart([]);
    });
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
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
