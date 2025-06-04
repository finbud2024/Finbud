<template>
  <div class="transaction-category-chart">
    <div class="chart-header">
      <div class="header-content">
        <h3>
          <font-awesome-icon icon="fa-solid fa-chart-pie" />
          Spending by Category
        </h3>
        <p>{{ timeRange }} overview</p>
      </div>
      
      <div class="header-controls">
        <div class="chart-type-switcher">
          <button 
            @click="chartType = 'pie'"
            :class="{ active: chartType === 'pie' }"
            class="chart-btn"
          >
            <font-awesome-icon icon="fa-solid fa-chart-pie" />
            Pie
          </button>
          <button 
            @click="chartType = 'bar'"
            :class="{ active: chartType === 'bar' }"
            class="chart-btn"
          >
            <font-awesome-icon icon="fa-solid fa-chart-bar" />
            Bar
          </button>
          <button 
            @click="chartType = 'donut'"
            :class="{ active: chartType === 'donut' }"
            class="chart-btn"
          >
            <font-awesome-icon icon="fa-solid fa-circle-notch" />
            Donut
          </button>
        </div>
        
        <select v-model="selectedTimeRange" class="time-range-select">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
        
        <select v-model="transactionType" class="type-select">
          <option value="Expense">Expenses Only</option>
          <option value="Income">Income Only</option>
          <option value="both">Both</option>
        </select>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card total">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-calculator" />
        </div>
        <div class="stat-content">
          <h4>${{ formatNumber(totalAmount) }}</h4>
          <p>Total {{ transactionType === 'both' ? 'Amount' : transactionType }}</p>
        </div>
      </div>
      
      <div class="stat-card categories">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-tags" />
        </div>
        <div class="stat-content">
          <h4>{{ categoryData.length }}</h4>
          <p>Active Categories</p>
        </div>
      </div>
      
      <div class="stat-card top">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-crown" />
        </div>
        <div class="stat-content">
          <h4>{{ topCategory?.name || 'N/A' }}</h4>
          <p>Top Category</p>
        </div>
      </div>
      
      <div class="stat-card transactions">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-list" />
        </div>
        <div class="stat-content">
          <h4>{{ totalTransactions }}</h4>
          <p>Transactions</p>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="chart-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading chart data...</p>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="categoryData.length === 0" class="empty-state">
        <font-awesome-icon icon="fa-solid fa-chart-pie" />
        <h4>No data available</h4>
        <p>No transactions found for the selected period</p>
      </div>

      <!-- Pie Chart -->
      <div v-else-if="chartType === 'pie'" class="pie-chart-container">
        <svg viewBox="0 0 200 200" class="pie-chart">
          <g class="pie-slices">
            <path
              v-for="(slice, index) in pieSlices"
              :key="slice.category"
              :d="slice.path"
              :fill="slice.color"
              :stroke="'white'"
              :stroke-width="2"
              class="pie-slice"
              @mouseover="hoveredSlice = index"
              @mouseleave="hoveredSlice = -1"
              :class="{ 'slice-hovered': hoveredSlice === index }"
            />
          </g>
          
          <!-- Center Info -->
          <text x="100" y="95" text-anchor="middle" class="center-text-title">
            {{ transactionType === 'both' ? 'Total' : transactionType }}
          </text>
          <text x="100" y="110" text-anchor="middle" class="center-text-amount">
            ${{ formatNumber(totalAmount) }}
          </text>
        </svg>
        
        <!-- Pie Chart Legend -->
        <div class="chart-legend">
          <div 
            v-for="(item, index) in categoryData" 
            :key="item.category"
            class="legend-item"
            @mouseover="hoveredSlice = index"
            @mouseleave="hoveredSlice = -1"
            :class="{ 'legend-hovered': hoveredSlice === index }"
          >
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <div class="legend-content">
              <div class="legend-category">
                <font-awesome-icon :icon="getCategoryIcon(item.category)" />
                {{ item.category }}
              </div>
              <div class="legend-amount">${{ formatNumber(Math.abs(item.amount)) }}</div>
              <div class="legend-percentage">{{ item.percentage.toFixed(1) }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Donut Chart -->
      <div v-else-if="chartType === 'donut'" class="donut-chart-container">
        <svg viewBox="0 0 200 200" class="donut-chart">
          <g class="donut-slices">
            <path
              v-for="(slice, index) in donutSlices"
              :key="slice.category"
              :d="slice.path"
              :fill="slice.color"
              :stroke="'white'"
              :stroke-width="2"
              class="donut-slice"
              @mouseover="hoveredSlice = index"
              @mouseleave="hoveredSlice = -1"
              :class="{ 'slice-hovered': hoveredSlice === index }"
            />
          </g>
          
          <!-- Center Content -->
          <circle cx="100" cy="100" r="45" fill="white" />
          <text x="100" y="90" text-anchor="middle" class="donut-center-title">
            {{ hoveredSlice >= 0 ? categoryData[hoveredSlice].category : (transactionType === 'both' ? 'Total' : transactionType) }}
          </text>
          <text x="100" y="105" text-anchor="middle" class="donut-center-amount">
            ${{ formatNumber(hoveredSlice >= 0 ? Math.abs(categoryData[hoveredSlice].amount) : totalAmount) }}
          </text>
          <text x="100" y="118" text-anchor="middle" class="donut-center-percentage">
            {{ hoveredSlice >= 0 ? categoryData[hoveredSlice].percentage.toFixed(1) + '%' : '100%' }}
          </text>
        </svg>
        
        <!-- Donut Legend -->
        <div class="chart-legend compact">
          <div 
            v-for="(item, index) in categoryData" 
            :key="item.category"
            class="legend-item compact"
            @mouseover="hoveredSlice = index"
            @mouseleave="hoveredSlice = -1"
            :class="{ 'legend-hovered': hoveredSlice === index }"
          >
            <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
            <span class="legend-text">{{ item.category }}</span>
          </div>
        </div>
      </div>

      <!-- Bar Chart -->
      <div v-else-if="chartType === 'bar'" class="bar-chart-container">
        <div class="bar-chart">
          <div 
            v-for="(item, index) in sortedCategoryData" 
            :key="item.category"
            class="bar-item"
            @mouseover="hoveredBar = index"
            @mouseleave="hoveredBar = -1"
            :class="{ 'bar-hovered': hoveredBar === index }"
          >
            <div class="bar-info">
              <div class="bar-category">
                <font-awesome-icon :icon="getCategoryIcon(item.category)" />
                {{ item.category }}
              </div>
              <div class="bar-amount">${{ formatNumber(Math.abs(item.amount)) }}</div>
            </div>
            <div class="bar-track">
              <div 
                class="bar-fill"
                :style="{ 
                  width: item.percentage + '%', 
                  backgroundColor: item.color,
                  animation: `barGrow 1s ease-out ${index * 0.1}s both`
                }"
              ></div>
            </div>
            <div class="bar-percentage">{{ item.percentage.toFixed(1) }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Breakdown -->
    <div class="detailed-breakdown">
      <h4>Category Breakdown</h4>
      <div class="breakdown-list">
        <div 
          v-for="item in sortedCategoryData" 
          :key="item.category"
          class="breakdown-item"
        >
          <div class="breakdown-header">
            <div class="breakdown-info">
              <div class="breakdown-color" :style="{ backgroundColor: item.color }"></div>
              <font-awesome-icon :icon="getCategoryIcon(item.category)" />
              <span class="breakdown-category">{{ item.category }}</span>
            </div>
            <div class="breakdown-stats">
              <span class="breakdown-amount">${{ formatNumber(Math.abs(item.amount)) }}</span>
              <span class="breakdown-percentage">{{ item.percentage.toFixed(1) }}%</span>
            </div>
          </div>
          <div class="breakdown-transactions">
            {{ item.count }} transaction{{ item.count !== 1 ? 's' : '' }}
            • Avg: ${{ formatNumber(Math.abs(item.amount) / item.count) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faChartPie, faChartBar, faCircleNotch, faCalculator, faTags, faCrown, faList,
  faUtensils, faHome, faCar, faMedkit, faGamepad, faGraduationCap, faPlane,
  faGift, faMoneyBillWave, faHandHoldingDollar, faCoins, faShoppingCart
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChartPie, faChartBar, faCircleNotch, faCalculator, faTags, faCrown, faList,
  faUtensils, faHome, faCar, faMedkit, faGamepad, faGraduationCap, faPlane,
  faGift, faMoneyBillWave, faHandHoldingDollar, faCoins, faShoppingCart
)

export default {
  name: 'TransactionCategoryChart',
  components: {
    FontAwesomeIcon
  },
  props: {
    transactions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      chartType: 'pie',
      selectedTimeRange: 'month',
      transactionType: 'Expense',
      hoveredSlice: -1,
      hoveredBar: -1,
      loading: false,
      colors: [
        '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
        '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
        '#14b8a6', '#eab308', '#a855f7', '#22c55e', '#f43f5e'
      ]
    }
  },
  computed: {
    timeRange() {
      const ranges = {
        'week': 'This Week',
        'month': 'This Month',
        'quarter': 'This Quarter',
        'year': 'This Year',
        'all': 'All Time'
      }
      return ranges[this.selectedTimeRange]
    },
    filteredTransactions() {
      let filtered = [...this.transactions]

      // Filter by time range
      if (this.selectedTimeRange !== 'all') {
        const now = new Date()
        const startDate = new Date()

        switch (this.selectedTimeRange) {
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(now.getMonth() - 1)
            break
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3)
            break
          case 'year':
            startDate.setFullYear(now.getFullYear() - 1)
            break
        }

        filtered = filtered.filter(t => new Date(t.date) >= startDate)
      }

      // Filter by transaction type
      if (this.transactionType !== 'both') {
        filtered = filtered.filter(t => t.type === this.transactionType)
      }

      return filtered
    },
    categoryData() {
      const categoryMap = new Map()

      this.filteredTransactions.forEach(transaction => {
        const category = transaction.category
        const amount = Math.abs(transaction.amount)

        if (categoryMap.has(category)) {
          const existing = categoryMap.get(category)
          existing.amount += amount
          existing.count += 1
        } else {
          categoryMap.set(category, {
            category,
            amount,
            count: 1,
            color: this.colors[categoryMap.size % this.colors.length]
          })
        }
      })

      const total = Array.from(categoryMap.values()).reduce((sum, item) => sum + item.amount, 0)

      return Array.from(categoryMap.values())
        .map(item => ({
          ...item,
          percentage: total > 0 ? (item.amount / total) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount)
    },
    sortedCategoryData() {
      return [...this.categoryData].sort((a, b) => b.amount - a.amount)
    },
    totalAmount() {
      return this.categoryData.reduce((sum, item) => sum + item.amount, 0)
    },
    totalTransactions() {
      return this.filteredTransactions.length
    },
    topCategory() {
      return this.categoryData.length > 0 ? this.categoryData[0] : null
    },
    pieSlices() {
      return this.generatePieSlices(90) // Outer radius 90
    },
    donutSlices() {
      return this.generatePieSlices(90, 50) // Outer radius 90, inner radius 50
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value || 0)
    },
    generatePieSlices(outerRadius, innerRadius = 0) {
      const slices = []
      let currentAngle = 0
      const centerX = 100
      const centerY = 100

      this.categoryData.forEach(item => {
        const angle = (item.percentage / 100) * 2 * Math.PI
        const endAngle = currentAngle + angle

        const x1 = centerX + outerRadius * Math.cos(currentAngle)
        const y1 = centerY + outerRadius * Math.sin(currentAngle)
        const x2 = centerX + outerRadius * Math.cos(endAngle)
        const y2 = centerY + outerRadius * Math.sin(endAngle)

        const largeArcFlag = angle > Math.PI ? 1 : 0

        let path
        if (innerRadius > 0) {
          // Donut slice
          const x3 = centerX + innerRadius * Math.cos(endAngle)
          const y3 = centerY + innerRadius * Math.sin(endAngle)
          const x4 = centerX + innerRadius * Math.cos(currentAngle)
          const y4 = centerY + innerRadius * Math.sin(currentAngle)

          path = [
            `M ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            `L ${x3} ${y3}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
            'Z'
          ].join(' ')
        } else {
          // Pie slice
          path = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ')
        }

        slices.push({
          category: item.category,
          path,
          color: item.color,
          percentage: item.percentage
        })

        currentAngle = endAngle
      })

      return slices
    },
    getCategoryIcon(category) {
      const icons = {
        'Food & Groceries': 'fa-solid fa-utensils',
        'Housing & Utilities': 'fa-solid fa-home',
        'Transportation': 'fa-solid fa-car',
        'Health & Wellness': 'fa-solid fa-medkit',
        'Lifestyle & Subscriptions': 'fa-solid fa-gamepad',
        'Education': 'fa-solid fa-graduation-cap',
        'Travel': 'fa-solid fa-plane',
        'Gift': 'fa-solid fa-gift',
        'Salary': 'fa-solid fa-money-bill-wave',
        'Freelance & Side Job': 'fa-solid fa-hand-holding-dollar',
        'Investment Return': 'fa-solid fa-coins',
        'Allowance': 'fa-solid fa-gift',
        'Refund': 'fa-solid fa-hand-holding-dollar'
      }
      return icons[category] || 'fa-solid fa-shopping-cart'
    }
  }
}
</script>

<style scoped>
.transaction-category-chart {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.chart-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-content p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.chart-type-switcher {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 0.25rem;
}

.chart-btn {
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.chart-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.time-range-select,
.type-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
}

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #f1f5f9;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
}

.stat-card.total .stat-icon { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.stat-card.categories .stat-icon { background: linear-gradient(135deg, #10b981, #047857); }
.stat-card.top .stat-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-card.transactions .stat-icon { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

.stat-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.stat-content p {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

/* Chart Container */
.chart-container {
  padding: 1.5rem;
  min-height: 400px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #94a3b8;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Pie Chart */
.pie-chart-container {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.pie-chart {
  width: 300px;
  height: 300px;
  flex-shrink: 0;
}

.pie-slice,
.donut-slice {
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: center;
}

.pie-slice:hover,
.donut-slice:hover,
.slice-hovered {
  filter: brightness(1.1);
  transform: scale(1.05);
}

.center-text-title,
.donut-center-title {
  font-size: 12px;
  font-weight: 500;
  fill: #64748b;
}

.center-text-amount,
.donut-center-amount {
  font-size: 16px;
  font-weight: 600;
  fill: #1a1a1a;
}

.donut-center-percentage {
  font-size: 10px;
  fill: #64748b;
}

/* Chart Legend */
.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
}

.chart-legend.compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.legend-item:hover,
.legend-hovered {
  background: #f8fafc;
}

.legend-item.compact {
  gap: 0.5rem;
  padding: 0.25rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.legend-category {
  font-weight: 500;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-amount {
  font-weight: 600;
  color: #374151;
}

.legend-percentage {
  font-size: 0.85rem;
  color: #64748b;
}

.legend-text {
  font-size: 0.85rem;
  color: #374151;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.bar-item:hover,
.bar-hovered {
  background: #f8fafc;
  transform: translateX(4px);
}

.bar-info {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bar-category {
  font-weight: 500;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bar-amount {
  font-size: 0.85rem;
  color: #64748b;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

@keyframes barGrow {
  from { width: 0%; }
  to { width: var(--final-width); }
}

.bar-percentage {
  min-width: 50px;
  text-align: right;
  font-weight: 500;
  color: #374151;
}

/* Detailed Breakdown */
.detailed-breakdown {
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

.detailed-breakdown h4 {
  margin: 0 0 1rem 0;
  color: #1a1a1a;
  font-size: 1.1rem;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #f1f5f9;
}

.breakdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.breakdown-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breakdown-color {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.breakdown-category {
  font-weight: 500;
  color: #1a1a1a;
}

.breakdown-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.breakdown-amount {
  font-weight: 600;
  color: #374151;
}

.breakdown-percentage {
  font-size: 0.85rem;
  color: #64748b;
}

.breakdown-transactions {
  font-size: 0.8rem;
  color: #64748b;
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .pie-chart-container {
    flex-direction: column;
    align-items: center;
  }
  
  .pie-chart {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 768px) {
  .chart-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-controls {
    flex-wrap: wrap;
    width: 100%;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .chart-legend.compact {
    grid-template-columns: 1fr;
  }
}
</style> 