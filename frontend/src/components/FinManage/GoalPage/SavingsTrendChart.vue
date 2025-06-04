<template>
  <div class="savings-trend-chart">
    <div class="chart-header">
      <h4>Monthly Savings Progress</h4>
      <div class="chart-controls">
        <select v-model="selectedPeriod" class="period-select">
          <option value="3">Last 3 months</option>
          <option value="6">Last 6 months</option>
          <option value="12">Last 12 months</option>
        </select>
      </div>
    </div>
    
    <div class="chart-container">
      <svg viewBox="0 0 400 200" class="line-chart">
        <!-- Grid lines -->
        <g class="grid-lines">
          <line
            v-for="i in 5"
            :key="'h' + i"
            :x1="40"
            :x2="360"
            :y1="(i - 1) * 40 + 20"
            :y2="(i - 1) * 40 + 20"
            stroke="#f1f5f9"
            stroke-width="1"
          />
          <line
            v-for="i in chartData.length"
            :key="'v' + i"
            :x1="40 + (i - 1) * (320 / (chartData.length - 1))"
            :x2="40 + (i - 1) * (320 / (chartData.length - 1))"
            :y1="20"
            :y2="180"
            stroke="#f1f5f9"
            stroke-width="1"
          />
        </g>
        
        <!-- Y-axis labels -->
        <g class="y-labels">
          <text
            v-for="(label, index) in yLabels"
            :key="'y' + index"
            :x="35"
            :y="25 + index * 40"
            text-anchor="end"
            class="axis-label"
          >
            ${{ label }}
          </text>
        </g>
        
        <!-- X-axis labels -->
        <g class="x-labels">
          <text
            v-for="(point, index) in chartData"
            :key="'x' + index"
            :x="40 + index * (320 / (chartData.length - 1))"
            :y="195"
            text-anchor="middle"
            class="axis-label"
          >
            {{ point.month }}
          </text>
        </g>
        
        <!-- Area under curve -->
        <path
          v-if="chartData.length > 1"
          :d="areaPath"
          fill="url(#gradient)"
          opacity="0.3"
        />
        
        <!-- Line -->
        <path
          v-if="chartData.length > 1"
          :d="linePath"
          fill="none"
          stroke="#3b82f6"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        
        <!-- Data points -->
        <g class="data-points">
          <circle
            v-for="(point, index) in chartData"
            :key="index"
            :cx="40 + index * (320 / (chartData.length - 1))"
            :cy="getYPosition(point.amount)"
            r="4"
            fill="#3b82f6"
            stroke="white"
            stroke-width="2"
            class="data-point"
            @mouseover="showTooltip(point, $event)"
            @mouseleave="hideTooltip"
          />
        </g>
        
        <!-- Gradient definition -->
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.5"/>
            <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
          </linearGradient>
        </defs>
      </svg>
      
      <!-- Tooltip -->
      <div
        v-if="tooltip.show"
        class="tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        <div class="tooltip-title">{{ tooltip.month }}</div>
        <div class="tooltip-value">${{ formatNumber(tooltip.amount) }}</div>
      </div>
    </div>
    
    <div class="chart-summary">
      <div class="summary-item">
        <span class="summary-label">Total Saved</span>
        <span class="summary-value">${{ formatNumber(totalSaved) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Average Monthly</span>
        <span class="summary-value">${{ formatNumber(averageMonthlySavings) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">Trend</span>
        <span class="summary-value" :class="trendClass">
          <font-awesome-icon :icon="trendIcon" />
          {{ trendText }}
        </span>
      </div>
    </div>
    
    <div v-if="goals.length === 0" class="empty-chart">
      <font-awesome-icon icon="fa-solid fa-chart-line" />
      <p>No savings data to display</p>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartLine, faArrowUp, faArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons'

library.add(faChartLine, faArrowUp, faArrowDown, faMinus)

export default {
  name: 'SavingsTrendChart',
  components: {
    FontAwesomeIcon
  },
  props: {
    goals: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectedPeriod: 6,
      tooltip: {
        show: false,
        x: 0,
        y: 0,
        month: '',
        amount: 0
      }
    }
  },
  computed: {
    chartData() {
      // Generate sample monthly savings data
      const months = this.getLastMonths(this.selectedPeriod)
      return months.map(month => ({
        month: month.short,
        fullMonth: month.full,
        amount: this.getMonthlySavings(month.date)
      }))
    },
    maxAmount() {
      if (this.chartData.length === 0) return 1000
      const max = Math.max(...this.chartData.map(d => d.amount))
      return Math.ceil(max / 100) * 100
    },
    yLabels() {
      const labels = []
      for (let i = 0; i <= 4; i++) {
        labels.push(Math.round(this.maxAmount - (i * this.maxAmount / 4)))
      }
      return labels
    },
    linePath() {
      if (this.chartData.length < 2) return ''
      
      let path = `M 40 ${this.getYPosition(this.chartData[0].amount)}`
      for (let i = 1; i < this.chartData.length; i++) {
        const x = 40 + i * (320 / (this.chartData.length - 1))
        const y = this.getYPosition(this.chartData[i].amount)
        path += ` L ${x} ${y}`
      }
      return path
    },
    areaPath() {
      if (this.chartData.length < 2) return ''
      
      let path = `M 40 180`
      path += ` L 40 ${this.getYPosition(this.chartData[0].amount)}`
      
      for (let i = 1; i < this.chartData.length; i++) {
        const x = 40 + i * (320 / (this.chartData.length - 1))
        const y = this.getYPosition(this.chartData[i].amount)
        path += ` L ${x} ${y}`
      }
      
      path += ` L ${40 + (this.chartData.length - 1) * (320 / (this.chartData.length - 1))} 180 Z`
      return path
    },
    totalSaved() {
      return this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    },
    averageMonthlySavings() {
      if (this.chartData.length === 0) return 0
      const total = this.chartData.reduce((sum, data) => sum + data.amount, 0)
      return total / this.chartData.length
    },
    trendClass() {
      if (this.chartData.length < 2) return ''
      const first = this.chartData[0].amount
      const last = this.chartData[this.chartData.length - 1].amount
      if (last > first) return 'trend-up'
      if (last < first) return 'trend-down'
      return 'trend-flat'
    },
    trendIcon() {
      if (this.chartData.length < 2) return 'fa-solid fa-minus'
      const first = this.chartData[0].amount
      const last = this.chartData[this.chartData.length - 1].amount
      if (last > first) return 'fa-solid fa-arrow-up'
      if (last < first) return 'fa-solid fa-arrow-down'
      return 'fa-solid fa-minus'
    },
    trendText() {
      if (this.chartData.length < 2) return 'No trend'
      const first = this.chartData[0].amount
      const last = this.chartData[this.chartData.length - 1].amount
      const change = ((last - first) / first * 100).toFixed(1)
      if (last > first) return `+${change}%`
      if (last < first) return `${change}%`
      return 'Stable'
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value || 0)
    },
    getLastMonths(count) {
      const months = []
      const today = new Date()
      
      for (let i = count - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
        months.push({
          date,
          short: date.toLocaleDateString('en-US', { month: 'short' }),
          full: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        })
      }
      
      return months
    },
    getMonthlySavings(date) {
      // Simulate monthly savings data based on goals
      // In a real app, this would come from actual transaction data
      const baseAmount = this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0) / 12
      const variation = Math.random() * 0.5 + 0.75 // 75% to 125% of base
      return Math.round(baseAmount * variation)
    },
    getYPosition(amount) {
      const ratio = amount / this.maxAmount
      return 180 - (ratio * 160) // 160 is the chart height minus padding
    },
    showTooltip(point, event) {
      const rect = event.target.getBoundingClientRect()
      const container = this.$el.querySelector('.chart-container').getBoundingClientRect()
      
      this.tooltip = {
        show: true,
        x: rect.left - container.left + 10,
        y: rect.top - container.top - 10,
        month: point.fullMonth,
        amount: point.amount
      }
    },
    hideTooltip() {
      this.tooltip.show = false
    }
  }
}
</script>

<style scoped>
.savings-trend-chart {
  height: 100%;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h4 {
  margin: 0;
  color: #1a1a1a;
  font-weight: 600;
}

.period-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
}

.chart-container {
  flex: 1;
  position: relative;
  background: #fafbfc;
  border-radius: 12px;
  padding: 1rem;
}

.line-chart {
  width: 100%;
  height: 100%;
}

.axis-label {
  font-size: 10px;
  fill: #64748b;
}

.data-point {
  cursor: pointer;
  transition: all 0.2s ease;
}

.data-point:hover {
  r: 6;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.tooltip {
  position: absolute;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 10;
}

.tooltip-title {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.tooltip-value {
  font-size: 1rem;
  font-weight: 600;
  color: #3b82f6;
}

.chart-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.summary-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.summary-label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.trend-up {
  color: #10b981;
}

.trend-down {
  color: #ef4444;
}

.trend-flat {
  color: #64748b;
}

.empty-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  gap: 1rem;
}

.empty-chart .fa-icon {
  font-size: 3rem;
}

.empty-chart p {
  margin: 0;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .chart-summary {
    grid-template-columns: 1fr;
  }
  
  .axis-label {
    font-size: 8px;
  }
}
</style> 