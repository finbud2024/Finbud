<template>
  <div class="predictive-chart">
    <div v-if="isLoading" class="chart-loading">
      <div class="loading-spinner"></div>
      <p>Loading chart...</p>
    </div>
    <div v-else-if="hasError" class="chart-error">
      <div class="error-icon">📊</div>
      <p>Unable to render chart</p>
      <button @click="retryChart" class="retry-btn">Retry</button>
    </div>
    <div v-else-if="!hasValidData" class="chart-empty">
      <div class="empty-icon">📈</div>
      <p>No data available</p>
    </div>
    <div v-else class="chart-wrapper">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  models: {
    type: Array,
    default: () => []
  },
  confidenceLevel: {
    type: Number,
    default: 0.95
  }
})

const chartCanvas = ref(null)
const chartInstance = ref(null)
const isLoading = ref(false)
const hasError = ref(false)

const modelColors = {
  lr: '#000000',
  rf: '#333333',
  xgb: '#666666',
  lstm: '#000000',
  transformer: '#333333',
  ensemble: '#666666'
}

const hasValidData = computed(() => {
  return props.data && props.data.length > 0 && props.models && props.models.length > 0
})

const retryChart = () => {
  hasError.value = false
  initChart()
}

const initChart = async () => {
  if (!chartCanvas.value || !hasValidData.value) return

  try {
    isLoading.value = true
    hasError.value = false
    
    await nextTick()

    // Destroy existing chart
    if (chartInstance.value) {
      chartInstance.value.destroy()
      chartInstance.value = null
    }

    const ctx = chartCanvas.value.getContext('2d')
    
    // Prepare data for Chart.js with validation
    const historicalData = props.data.filter(item => 
      item && item.type === 'historical' && item.datetime && typeof item.close === 'number'
    )
    const predictionData = props.data.filter(item => 
      item && item.type === 'prediction' && item.datetime
    )
    
    const datasets = []

    // Historical data
    if (historicalData.length > 0) {
      datasets.push({
        label: 'Historical Price',
        data: historicalData.map(item => ({
          x: new Date(item.datetime),
          y: item.close
        })),
        borderColor: '#1f2937',
        backgroundColor: '#1f2937',
        borderWidth: 2,
        fill: false,
        pointRadius: 1,
        pointHoverRadius: 5,
        tension: 0.1,
        order: 1
      })
    }

    // Prediction data for each model
    props.models.forEach((model, index) => {
      const modelPredictions = predictionData.filter(item => 
        item[model] !== undefined && typeof item[model] === 'number' && !isNaN(item[model])
      )
      
      if (modelPredictions.length > 0) {
        datasets.push({
          label: getModelName(model),
          data: modelPredictions.map(item => ({
            x: new Date(item.datetime),
            y: item[model]
          })),
          borderColor: modelColors[model] || `hsl(${index * 60}, 70%, 50%)`,
          backgroundColor: modelColors[model] || `hsl(${index * 60}, 70%, 50%)`,
          borderWidth: 2.5,
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.1,
          borderDash: [8, 4],
          order: 2 + index
        })
      }
    })

    if (datasets.length === 0) {
      throw new Error('No valid datasets to display')
    }

    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              color: '#374151',
              boxWidth: 12,
              boxHeight: 12
            }
          },
          tooltip: {
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            titleColor: '#1f2937',
            bodyColor: '#1f2937',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            bodyFont: {
              family: 'Inter, system-ui, sans-serif',
              size: 13
            },
            titleFont: {
              family: 'Inter, system-ui, sans-serif',
              size: 14,
              weight: 600
            },
            callbacks: {
              title: function(tooltipItems) {
                if (tooltipItems && tooltipItems[0]) {
                  return new Date(tooltipItems[0].parsed.x).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                }
                return ''
              },
              label: function(context) {
                const value = context.parsed.y
                if (typeof value === 'number' && !isNaN(value)) {
                  return `${context.dataset.label}: $${value.toFixed(2)}`
                }
                return `${context.dataset.label}: N/A`
              }
            }
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM dd',
                week: 'MMM dd',
                month: 'MMM yyyy'
              }
            },
            grid: {
              color: '#f3f4f6',
              drawBorder: false,
              drawOnChartArea: true
            },
            ticks: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 11
              },
              color: '#6b7280',
              maxTicksLimit: 8
            },
            title: {
              display: true,
              text: 'Date',
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 12,
                weight: 600
              },
              color: '#374151'
            }
          },
          y: {
            beginAtZero: false,
            grid: {
              color: '#f3f4f6',
              drawBorder: false,
              drawOnChartArea: true
            },
            ticks: {
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 11
              },
              color: '#6b7280',
              callback: function(value) {
                if (typeof value === 'number' && !isNaN(value)) {
                  return '$' + value.toFixed(2)
                }
                return value
              },
              maxTicksLimit: 8
            },
            title: {
              display: true,
              text: 'Price (USD)',
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 12,
                weight: 600
              },
              color: '#374151'
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        },
        elements: {
          line: {
            borderJoinStyle: 'round',
            borderCapStyle: 'round'
          },
          point: {
            hoverBorderWidth: 3
          }
        }
      }
    })

    isLoading.value = false
  } catch (error) {
    console.error('Error initializing chart:', error)
    hasError.value = true
    isLoading.value = false
  }
}

const getModelName = (modelKey) => {
  const names = {
    lr: 'Linear Regression',
    rf: 'Random Forest',
    xgb: 'XGBoost',
    lstm: 'LSTM',
    transformer: 'Transformer',
    ensemble: 'Ensemble'
  }
  return names[modelKey] || modelKey.toUpperCase()
}

// Handle window resize
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

// Watch for data changes
watch(() => props.data, () => {
  if (hasValidData.value) {
    initChart()
  }
}, { deep: true })

watch(() => props.models, () => {
  if (hasValidData.value) {
    initChart()
  }
}, { deep: true })

onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (hasValidData.value) {
    initChart()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }
})
</script>

<style scoped>
.predictive-chart {
  width: 100%;
  height: 450px;
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.chart-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.chart-loading,
.chart-error,
.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon,
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: #000000;
  transform: translateY(-1px);
}

canvas {
  max-width: 100%;
  max-height: 100%;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .predictive-chart {
    height: 350px;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .predictive-chart {
    height: 300px;
    padding: 0.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .predictive-chart {
    background: #1e293b;
    border-color: #334155;
  }
  
  .chart-loading,
  .chart-error,
  .chart-empty {
    color: #cbd5e1;
  }
}

.section-divider {
  border-top: 3px solid #000000;
  margin: 0 0 2rem 0;
}

.filter-btn {
  background: #000000;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: #333333;
}
</style> 