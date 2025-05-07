<template>
    <div class="chart-container">
      <div v-if="loading || error" class="chart-skeleton">
        <div class="skeleton-content">
          <div class="skeleton-text">
            {{ error ? `Failed to load ${stockCode} Chart.` : `Loading ${stockCode} Chart...` }}
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
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1000,
            easing: 'easeOutQuart'
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              titleFont: { size: 12, weight: 'bold' },
              bodyFont: { size: 12 },
              padding: 10,
              cornerRadius: 4,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false, drawBorder: false },
              ticks: { color: '#6c757d' }
            },
            y: {
              grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
              ticks: {
                color: '#6c757d',
                callback: value => '$' + value.toFixed(2)
              }
            }
          },
          interaction: { mode: 'nearest', axis: 'x', intersect: false },
          elements: { line: { borderJoinStyle: 'round', borderCapStyle: 'round' } }
        }
      }
    },
    async mounted() {
      await this.fetchChartData()
      if (!this.isDestroyed && !this.error) {
        this.initChart()
        this.setupResizeObserver()
      }
    },
    beforeUnmount() {
      this.cleanup()
    },
    methods: {
      async fetchChartData() {
        try {
          this.error = false
          const apiKey = process.env.VUE_APP_STOCK_API_KEY_FINNHUB
          if (!apiKey) {
            throw new Error('Finnhub API key not configured')
          }
  
          // Use FREE /quote endpoint
          const url = `https://finnhub.io/api/v1/quote?symbol=${this.stockCode}&token=${apiKey}`
          const response = await axios.get(url)
          const data = response.data
  
          console.log("Quote data:", data)
  
          if (data && data.c && data.o && data.h && data.l) {
            this.formatChartData(data)
          } else {
            throw new Error('Invalid data format')
          }
        } catch (error) {
          console.error('Error fetching chart data:', error)
          this.error = true
        } finally {
          this.loading = false
        }
      },
  
      formatChartData(apiData) {
        const now = new Date()
        const times = [
          new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3h ago
          new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h ago
          new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1h ago
          now
        ]
  
        this.chartData.labels = times.map(t => t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
        this.chartData.datasets[0].data = [
          apiData.o, 
          apiData.h, 
          apiData.l, 
          apiData.c
        ]
        this.chartData.datasets[0].label = this.stockCode
      },
  
      initChart() {
        if (this.isDestroyed) return
        if (this.chart) {
          this.chart.destroy()
        }
        const ctx = this.$refs.chartCanvas?.getContext('2d')
        if (!ctx) return
        this.chart = new Chart(ctx, {
          type: 'line',
          data: this.chartData,
          options: this.chartOptions
        })
      },
  
      setupResizeObserver() {
        if (this.isDestroyed) return
        this.resizeObserver = new ResizeObserver(entries => {
          if (!entries || !entries.length || this.isDestroyed) return
          if (this.chart) {
            requestAnimationFrame(() => {
              if (!this.isDestroyed && this.chart) {
                this.chart.resize()
              }
            })
          }
        })
        if (this.$el) {
          this.resizeObserver.observe(this.$el)
        }
      },
  
      cleanup() {
        this.isDestroyed = true
        if (this.resizeObserver) {
          this.resizeObserver.disconnect()
          this.resizeObserver = null
        }
        if (this.chart) {
          this.chart.destroy()
          this.chart = null
        }
      }
    },
    watch: {
      stockCode: {
        immediate: false,
        async handler() {
          this.loading = true
          await this.fetchChartData()
          if (!this.isDestroyed && !this.error) {
            this.initChart()
          }
        }
      },
      timeRange: {
        immediate: false,
        async handler() {
          this.loading = true
          await this.fetchChartData()
          if (!this.isDestroyed && !this.error) {
            this.initChart()
          }
        }
      }
    }
  }
  </script>  
  
  <style scoped>
  .chart-container {
    position: relative;
    width: 102%;
    height: 110%;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .chart-canvas-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 15px;
  }
  
  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  .chart-skeleton {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    z-index: 10;
  }
  
  .skeleton-content {
    width: 80%;
    max-width: 400px;
    text-align: center;
  }
  
  .skeleton-text {
    margin-bottom: 20px;
    color: #6c757d;
    font-size: 1rem;
    font-weight: 500;
  }
  
  .skeleton-animation {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 180px;
    width: 100%;
  }
  
  .skeleton-bar {
    flex: 1;
    max-width: 30px;
    background: #e9ecef;
    border-radius: 4px 4px 0 0;
    margin: 0 2px;
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  </style>
  