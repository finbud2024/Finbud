<template>
    <div class="chart-container">
      <div v-if="loading || error" class="chart-skeleton">
        <div class="skeleton-content">
          <div class="skeleton-text">
            {{ error ? `Failed to load ${stockCode} Chart: ${errorMessage}` : `Loading ${stockCode} Chart...` }}
          </div>
          <div class="skeleton-animation">
            <div 
              v-for="i in 8" 
              :key="i" 
              class="skeleton-bar"
              :style="{ height: `${Math.random() * 70 + 30}%`, backgroundColor: error ? '#f8d7da' : '#e9ecef' }"
            ></div>
          </div>
        </div>
      </div>
      <div v-else class="chart-canvas-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js'
  import 'chartjs-adapter-date-fns'; // Import date adapter
  import { enUS } from 'date-fns/locale'; // Import locale if needed
  import axios from 'axios'
  Chart.register(...registerables)
  
  export default {
    name: 'StockChart',
    props: {
      stockCode: {
        type: String,
        default: 'AAPL'
      },
      timeRange: {
        type: String,
        default: '1M',
        validator: value => ['1W', '1M', '3M', '6M', '1Y', 'ALL'].includes(value)
      }
    },
    data() {
      return {
        loading: true,
        error: false,
        errorMessage: '',
        chart: null,
        resizeObserver: null,
        isDestroyed: false,
        chartData: {
          labels: [],
          datasets: [{
            label: '',
            data: [],
            borderColor: '#3a86ff',
            backgroundColor: 'rgba(58, 134, 255, 0.1)',
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.2,
            fill: {
              target: 'origin',
              above: 'rgba(58, 134, 255, 0.05)'
            }
          }]
        },
      }
    },
    computed: {
      chartOptions() {
        return {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 800, // Slightly faster animation
            easing: 'easeOutCubic'
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleFont: { size: 14, weight: '600' },
              bodyFont: { size: 12 },
              padding: 12,
              cornerRadius: 6,
              displayColors: false,
              callbacks: {
                title: function(tooltipItems) {
                  if (tooltipItems.length > 0) {
                    const date = new Date(tooltipItems[0].parsed.x);
                    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
                  }
                  return '';
                },
                label: function(context) {
                  return `${this.stockCode}: $${context.parsed.y.toFixed(2)}`;
                }.bind(this) // Bind 'this' to access stockCode
              }
            }
          },
          scales: {
            x: {
              type: 'time', // Use time scale
              time: {
                unit: this.getXAxisUnit(),
                tooltipFormat: 'MMM dd, yyyy', // e.g., Aug 20, 2023
                displayFormats: {
                  millisecond: 'HH:mm:ss.SSS',
                  second: 'HH:mm:ss',
                  minute: 'HH:mm',
                  hour: 'HH:mm',
                  day: 'MMM dd',
                  week: 'MMM dd',
                  month: 'MMM yyyy',
                  quarter: 'qqq yyyy',
                  year: 'yyyy',
                }
              },
              grid: { display: false, drawBorder: false },
              ticks: { color: '#6c757d', maxRotation: 0, autoSkipPadding: 20 }
            },
            y: {
              grid: { color: 'rgba(0, 0, 0, 0.08)', drawBorder: false },
              ticks: {
                color: '#6c757d',
                callback: value => '$' + value.toFixed(2),
                padding: 10,
              }
            }
          },
          interaction: { mode: 'nearest', axis: 'x', intersect: false },
          elements: { 
            point: { 
              radius: 0, // No points by default
              hoverRadius: 5,
              hitRadius: 10,
            },
            line: { 
              borderJoinStyle: 'round', 
              borderCapStyle: 'round',
              tension: 0.1, // Smoother lines
              borderWidth: 2,
            } 
          }
        };
      }
    },
    async mounted() {
      this.isDestroyed = false;
      await this.loadChartData();
      this.setupResizeObserver();
    },
    beforeUnmount() {
      this.cleanup();
    },
    methods: {
      getXAxisUnit() {
        switch (this.timeRange) {
          case '1W': return 'day';
          case '1M': return 'day';
          case '3M': return 'week';
          case '6M': return 'month';
          case '1Y': return 'month';
          case 'ALL': return 'year';
          default: return 'day';
        }
      },
      async loadChartData() {
        if (this.isDestroyed) return;
        this.loading = true;
        this.error = false;
        this.errorMessage = '';
        try {
          const apiKey = process.env.VUE_APP_STOCK_API_KEY_FINNHUB;
          if (!apiKey) {
            throw new Error('Finnhub API key not configured. Please set VUE_APP_STOCK_API_KEY_FINNHUB in your .env file.');
          }

          const { to, from, resolution } = this.calculateTimeParams();
          // Ensure 'to' is not in the future beyond what Finnhub allows (usually current time)
          const currentTimestamp = Math.floor(Date.now() / 1000);
          const adjustedTo = Math.min(to, currentTimestamp);
          
          // Ensure 'from' is not earlier than 'to'
          if (from >= adjustedTo) {
               throw new Error('Invalid time range: "from" date is not earlier than "to" date.');
          }

          const url = `https://finnhub.io/api/v1/stock/candle?symbol=${this.stockCode}&resolution=${resolution}&from=${from}&to=${adjustedTo}&token=${apiKey}`;
          
          const response = await axios.get(url);
          const data = response.data;

          if (data.s !== 'ok' && data.s !== 'no_data') {
            throw new Error(data.errmsg || `Finnhub API error for ${this.stockCode}`);
          }
          if (data.s === 'no_data' || !data.c || data.c.length === 0) {
            // console.warn(\`No data available for ${this.stockCode} in the selected range.\`);
            this.initChartWithData({ labels: [], dataPoints: [] }); // Initialize with empty data
            return; // Exit early, no error state, just empty chart
          }
          
          const chartData = {
            labels: data.t.map(timestamp => new Date(timestamp * 1000)), // Timestamps
            datasets: [{
              label: this.stockCode,
              data: data.c, // Close prices
              borderColor: '#3a86ff',
              backgroundColor: 'rgba(58, 134, 255, 0.1)',
              fill: {
                target: 'origin',
                above: 'rgba(58, 134, 255, 0.05)'
              }
            }]
          };
          this.initChartWithData(chartData);

        } catch (error) {
          console.error('Error fetching or processing chart data:', error);
          this.error = true;
          this.errorMessage = error.message || 'Could not load chart data.';
          // Attempt to destroy chart if it exists, to prevent errors on re-render
          if (this.chart) {
              try {
                  this.chart.destroy();
                  this.chart = null;
              } catch (e) {
                  console.error("Error destroying chart during error handling:", e);
              }
          }
        } finally {
          if (!this.isDestroyed) {
            this.loading = false;
          }
        }
      },
      calculateTimeParams() {
        const now = Math.floor(Date.now() / 1000); // Current timestamp in seconds
        let from;
        let resolution = 'D'; // Daily by default

        switch (this.timeRange) {
          case '1W':
            from = now - (7 * 24 * 60 * 60);
            resolution = '60'; // Hourly data for 1 week
            break;
          case '1M':
            from = now - (30 * 24 * 60 * 60);
            resolution = 'D';
            break;
          case '3M':
            from = now - (90 * 24 * 60 * 60);
            resolution = 'D';
            break;
          case '6M':
            from = now - (180 * 24 * 60 * 60);
            resolution = 'D';
            break;
          case '1Y':
            from = now - (365 * 24 * 60 * 60);
            resolution = 'D';
            break;
          case 'ALL':
            // Finnhub might have limits, let's go back 5 years as a practical 'ALL'
            from = now - (5 * 365 * 24 * 60 * 60); 
            resolution = 'W'; // Weekly for very long ranges
            break;
          default:
            from = now - (30 * 24 * 60 * 60); // Default to 1M
        }
        return { to: now, from, resolution };
      },
      initChartWithData(chartData) {
        if (this.isDestroyed || !this.$refs.chartCanvas) return;
        
        if (this.chart) {
          try {
              this.chart.destroy();
              this.chart = null;
          } catch(e) {
              console.error("Error destroying previous chart instance:", e);
          }
        }
        
        const ctx = this.$refs.chartCanvas.getContext('2d');
        if (!ctx) {
            console.error("Canvas context not found");
            this.error = true;
            this.errorMessage = "Chart rendering error.";
            return;
        }
        
        try {
          this.chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: this.chartOptions
          });
        } catch(e) {
          console.error("Error creating new Chart instance:", e);
          this.error = true;
          this.errorMessage = "Chart initialization failed.";
        }
      },
      setupResizeObserver() {
        if (this.isDestroyed || !this.$el) return;
        if (this.resizeObserver) { // Disconnect previous if any
            this.resizeObserver.disconnect();
        }
        this.resizeObserver = new ResizeObserver(entries => {
          if (this.isDestroyed || !entries || !entries.length || !this.chart) return;
          // Use requestAnimationFrame for smoother resize handling
          requestAnimationFrame(() => {
            if (!this.isDestroyed && this.chart) {
              try {
                  this.chart.resize();
              } catch(e) {
                  console.warn("Error resizing chart:", e);
              }
            }
          });
        });
        this.resizeObserver.observe(this.$el);
      },
      cleanup() {
        this.isDestroyed = true;
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
          this.resizeObserver = null;
        }
        if (this.chart) {
          try {
              this.chart.destroy();
          } catch(e) {
              console.error("Error destroying chart during cleanup:", e);
          }
          this.chart = null;
        }
      }
    },
    watch: {
      stockCode: {
        immediate: false, // Don't run on initial mount if mounted already fetches
        handler(newVal, oldVal) {
          if (newVal !== oldVal && !this.isDestroyed) {
            this.loadChartData();
          }
        }
      },
      timeRange: {
        immediate: false,
        handler(newVal, oldVal) {
          if (newVal !== oldVal && !this.isDestroyed) {
            this.loadChartData();
          }
        }
      }
    }
  }
  </script>  
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 100%; /* Ensure it takes parent width */
    height: 350px; /* Or a more dynamic height */
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    overflow: hidden; /* Prevents skeleton from overflowing */
  }
  
  .chart-canvas-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px; /* Add some padding around the canvas */
  }
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  .chart-skeleton {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
  
  .skeleton-content {
    text-align: center;
    width: 100%;
  }
  
  .skeleton-text {
    margin-bottom: 20px;
    color: #6c757d;
    font-size: 0.9em;
  }
  
  .skeleton-animation {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 150px; /* Adjust height of skeleton bars area */
    width: 100%;
    max-width: 300px; /* Limit width of animation */
    margin: 0 auto;
    opacity: 0.7;
  }
  
  .skeleton-bar {
    width: 10%; /* Width of individual bars */
    background-color: #e9ecef; /* Default skeleton color */
    animation: skeleton-pulse 1.5s ease-in-out infinite;
    border-radius: 3px;
  }
  
  .skeleton-bar:nth-child(odd) {
    animation-delay: 0.25s;
  }
  
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  </style>
  