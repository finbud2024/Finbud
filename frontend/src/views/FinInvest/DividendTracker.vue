<template>
  <div class="dividend-tracker">
    <!-- Header Section -->
    <div class="tracker-header">
      <div class="container">
        <h1 class="page-title">{{ $t('dividendTracker.title') }}</h1>
        <p class="page-subtitle">{{ $t('dividendTracker.subtitle') }}</p>
        
        <!-- Quick Stats -->
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">
              <font-awesome-icon icon="fa-solid fa-dollar-sign" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ formatCurrency(totalDividends) }}</div>
              <div class="stat-label">{{ $t('dividendTracker.totalDividends') }}</div>
            </div>
          </div>
          8%] building (365/873 modules)
[38%] building (379/913 modules)
✘ [ERROR] Could not resolve "../../Database%20Schema/finData/CompanySchema.js"

    backend/Endpoints/finData/transactionRoute.js:3:20:
      3 │ import Company from '../../Database%20Schema/finData/CompanySchema.js';
        ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

✘ [ERROR] Could not resolve "../../Database%20Schema/finData/FilingsSchema.js"

    backend/Endpoints/finData/transactionRoute.js:4:20:
      4 │ import Filings from '../../Database%20Schema/finData/FilingsSchema.js';
        ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

✘ [ERROR] Could not resolve "../../Database%20Schema/finData/TransactionSchema.js"

    backend/Endpoints/finData/transactionRoute.js:7:31:
      7 │ import InsiderTransaction from '../../Database%20Schema/finData/TransactionSchema.js';
        ╵                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

[38%] building (400/962 modules)
✘ [ERROR] Could not resolve "../../Database%20Schema/finData/CompanySchema.js"

    backend/Endpoints/finData/filingsRoute.js:3:20:
      3 │ import Company from '../../Database%20Schema/finData/CompanySchema.js';
        ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

✘ [ERROR] Could not resolve "../../Database%20Schema/finData/FilingsSchema.js"

    backend/Endpoints/finData/filingsRoute.js:5:20:
      5 │ import Filings from '../../Database%20Schema/finData/FilingsSchema.js';
        ╵                     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

✘ [ERROR] Could not resolve "../../Database%20Schema/finData/EarningCalendar.js"

    backend/Endpoints/finData/filingsRoute.js:8:28:
      8 │ import EarningCalendar from '../../Database%20Schema/finData/EarningCalendar.js';
        ╵                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

[
          <div class="stat-card">
            <div class="stat-icon">
              <font-awesome-icon icon="fa-solid fa-chart-line" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ dividendYield.toFixed(2) }}%</div>
              <div class="stat-label">{{ $t('dividendTracker.avgYield') }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <font-awesome-icon icon="fa-solid fa-calendar" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ upcomingPayments }}</div>
              <div class="stat-label">{{ $t('dividendTracker.upcomingPayments') }}</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <font-awesome-icon icon="fa-solid fa-building" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ portfolio.length }}</div>
              <div class="stat-label">{{ $t('dividendTracker.holdings') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="tracker-content">
      <div class="container">
        <!-- Tabs Navigation -->
        <div class="tabs-nav">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
            @click="setActiveTab(tab.id)"
          >
            <font-awesome-icon :icon="tab.icon" />
            <span>{{ $t(`dividendTracker.tabs.${tab.id}`) }}</span>
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Portfolio Tab -->
          <div v-if="activeTab === 'portfolio'" class="portfolio-tab">
            <div class="tab-header">
              <h2>{{ $t('dividendTracker.portfolio.title') }}</h2>
              <button @click="showAddStockModal = true" class="add-btn">
                <font-awesome-icon icon="fa-solid fa-plus" />
                {{ $t('dividendTracker.portfolio.addStock') }}
              </button>
            </div>
            
            <div class="portfolio-grid">
              <div
                v-for="holding in portfolio"
                :key="holding.symbol"
                class="holding-card"
              >
                <div class="holding-header">
                  <div class="stock-info">
                    <h3>{{ holding.symbol }}</h3>
                    <p>{{ holding.name }}</p>
                  </div>
                  <div class="holding-actions">
                    <button @click="editHolding(holding)" class="edit-btn">
                      <font-awesome-icon icon="fa-solid fa-edit" />
                    </button>
                    <button @click="deleteHolding(holding.symbol)" class="delete-btn">
                      <font-awesome-icon icon="fa-solid fa-trash" />
                    </button>
                  </div>
                </div>
                
                <div class="holding-details">
                  <div class="detail-row">
                    <span>{{ $t('dividendTracker.portfolio.shares') }}:</span>
                    <span>{{ holding.shares.toLocaleString() }}</span>
                  </div>
                  <div class="detail-row">
                    <span>{{ $t('dividendTracker.portfolio.avgPrice') }}:</span>
                    <span>{{ formatCurrency(holding.avgPrice) }}</span>
                  </div>
                  <div class="detail-row">
                    <span>{{ $t('dividendTracker.portfolio.currentPrice') }}:</span>
                    <span>{{ formatCurrency(holding.currentPrice) }}</span>
                  </div>
                  <div class="detail-row">
                    <span>{{ $t('dividendTracker.portfolio.dividendYield') }}:</span>
                    <span class="yield-value">{{ holding.dividendYield }}%</span>
                  </div>
                  <div class="detail-row">
                    <span>{{ $t('dividendTracker.portfolio.annualDividend') }}:</span>
                    <span class="dividend-value">{{ formatCurrency(holding.annualDividend * holding.shares) }}</span>
                  </div>
                </div>
                
                <div class="holding-footer">
                  <div class="market-value">
                    <span>{{ $t('dividendTracker.portfolio.marketValue') }}: </span>
                    <span class="value">{{ formatCurrency(holding.currentPrice * holding.shares) }}</span>
                  </div>
                  <div class="gain-loss" :class="getGainLossClass(holding)">
                    {{ getGainLoss(holding) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Calendar Tab -->
          <div v-if="activeTab === 'calendar'" class="calendar-tab">
            <div class="calendar-header">
              <h2>{{ $t('dividendTracker.calendar.title') }}</h2>
              <div class="calendar-controls">
                <button @click="previousMonth" class="nav-btn">
                  <font-awesome-icon icon="fa-solid fa-chevron-left" />
                </button>
                <span class="current-month">{{ formatMonth(currentMonth) }}</span>
                <button @click="nextMonth" class="nav-btn">
                  <font-awesome-icon icon="fa-solid fa-chevron-right" />
                </button>
              </div>
            </div>
            
            <div class="calendar-grid">
              <div class="calendar-header-row">
                <div v-for="day in weekDays" :key="day" class="day-header">
                  {{ $t(`dividendTracker.calendar.days.${day}`) }}
                </div>
              </div>
              
              <div
                v-for="week in calendarWeeks"
                :key="`week-${week[0]?.date}`"
                class="calendar-week"
              >
                <div
                  v-for="day in week"
                  :key="day.date"
                  :class="['calendar-day', {
                    'other-month': !day.isCurrentMonth,
                    'has-dividends': day.dividends?.length > 0
                  }]"
                >
                  <div class="day-number">{{ day.date.getDate() }}</div>
                  <div v-if="day.dividends?.length" class="day-dividends">
                    <div
                      v-for="dividend in day.dividends.slice(0, 2)"
                      :key="`${dividend.symbol}-${day.date}`"
                      class="dividend-item"
                    >
                      <span class="symbol">{{ dividend.symbol }}</span>
                      <span class="amount">{{ formatCurrency(dividend.amount) }}</span>
                    </div>
                    <div v-if="day.dividends.length > 2" class="more-indicator">
                      +{{ day.dividends.length - 2 }} more
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Analytics Tab -->
          <div v-if="activeTab === 'analytics'" class="analytics-tab">
            <div class="analytics-header">
              <h2>{{ $t('dividendTracker.analytics.title') }}</h2>
              <div class="period-selector">
                <button
                  v-for="period in analyticsPeriods"
                  :key="period"
                  :class="['period-btn', { active: selectedPeriod === period }]"
                  @click="selectedPeriod = period"
                >
                  {{ $t(`dividendTracker.analytics.periods.${period}`) }}
                </button>
              </div>
            </div>
            
            <div class="analytics-grid">
              <div class="chart-container">
                <h3>{{ $t('dividendTracker.analytics.monthlyTrend') }}</h3>
                <div class="chart-placeholder">
                  <!-- Chart will be rendered here -->
                  <canvas ref="monthlyChart" width="400" height="200"></canvas>
                </div>
              </div>
              
              <div class="chart-container">
                <h3>{{ $t('dividendTracker.analytics.sectorBreakdown') }}</h3>
                <div class="chart-placeholder">
                  <canvas ref="sectorChart" width="400" height="200"></canvas>
                </div>
              </div>
              
              <div class="metrics-grid">
                <div class="metric-card">
                  <h4>{{ $t('dividendTracker.analytics.growth') }}</h4>
                  <div class="metric-value positive">+12.5%</div>
                  <div class="metric-subtitle">{{ $t('dividendTracker.analytics.yearOverYear') }}</div>
                </div>
                
                <div class="metric-card">
                  <h4>{{ $t('dividendTracker.analytics.consistency') }}</h4>
                  <div class="metric-value">85%</div>
                  <div class="metric-subtitle">{{ $t('dividendTracker.analytics.consistencyScore') }}</div>
                </div>
                
                <div class="metric-card">
                  <h4>{{ $t('dividendTracker.analytics.coverage') }}</h4>
                  <div class="metric-value">2.1x</div>
                  <div class="metric-subtitle">{{ $t('dividendTracker.analytics.coverageRatio') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- History Tab -->
          <div v-if="activeTab === 'history'" class="history-tab">
            <div class="history-header">
              <h2>{{ $t('dividendTracker.history.title') }}</h2>
              <div class="history-filters">
                <select v-model="historyFilter.year" class="filter-select">
                  <option value="">{{ $t('dividendTracker.history.allYears') }}</option>
                  <option v-for="year in availableYears" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
                <select v-model="historyFilter.symbol" class="filter-select">
                  <option value="">{{ $t('dividendTracker.history.allStocks') }}</option>
                  <option v-for="holding in portfolio" :key="holding.symbol" :value="holding.symbol">
                    {{ holding.symbol }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="history-table">
              <table>
                <thead>
                  <tr>
                    <th>{{ $t('dividendTracker.history.date') }}</th>
                    <th>{{ $t('dividendTracker.history.symbol') }}</th>
                    <th>{{ $t('dividendTracker.history.amount') }}</th>
                    <th>{{ $t('dividendTracker.history.shares') }}</th>
                    <th>{{ $t('dividendTracker.history.total') }}</th>
                    <th>{{ $t('dividendTracker.history.status') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in filteredHistory" :key="`${payment.symbol}-${payment.date}`">
                    <td>{{ formatDate(payment.date) }}</td>
                    <td class="symbol-cell">{{ payment.symbol }}</td>
                    <td>{{ formatCurrency(payment.amount) }}</td>
                    <td>{{ payment.shares.toLocaleString() }}</td>
                    <td class="total-cell">{{ formatCurrency(payment.total) }}</td>
                    <td>
                      <span :class="['status-badge', payment.status]">
                        {{ $t(`dividendTracker.history.statuses.${payment.status}`) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Stock Modal -->
    <div v-if="showAddStockModal" class="modal-overlay" @click="closeAddStockModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ $t('dividendTracker.addStock.title') }}</h2>
          <button @click="closeAddStockModal" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        
        <div class="modal-body">
          <form @submit.prevent="addStock">
            <div class="form-row">
              <div class="form-group">
                <label>{{ $t('dividendTracker.addStock.symbol') }}</label>
                <input
                  v-model="newStock.symbol"
                  type="text"
                  :placeholder="$t('dividendTracker.addStock.symbolPlaceholder')"
                  required
                />
              </div>
              <div class="form-group">
                <label>{{ $t('dividendTracker.addStock.shares') }}</label>
                <input
                  v-model.number="newStock.shares"
                  type="number"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>{{ $t('dividendTracker.addStock.avgPrice') }}</label>
                <input
                  v-model.number="newStock.avgPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div class="form-group">
                <label>{{ $t('dividendTracker.addStock.purchaseDate') }}</label>
                <input
                  v-model="newStock.purchaseDate"
                  type="date"
                  required
                />
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" @click="closeAddStockModal" class="cancel-btn">
                {{ $t('dividendTracker.addStock.cancel') }}
              </button>
              <button type="submit" class="submit-btn" :disabled="addingStock">
                <span v-if="addingStock">{{ $t('dividendTracker.addStock.adding') }}</span>
                <span v-else>{{ $t('dividendTracker.addStock.add') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DividendTracker',
  data() {
    return {
      activeTab: 'portfolio',
      currentMonth: new Date(),
      selectedPeriod: '1y',
      showAddStockModal: false,
      addingStock: false,
      
      tabs: [
        { id: 'portfolio', icon: 'fa-solid fa-briefcase' },
        { id: 'calendar', icon: 'fa-solid fa-calendar' },
        { id: 'analytics', icon: 'fa-solid fa-chart-bar' },
        { id: 'history', icon: 'fa-solid fa-history' }
      ],
      
      weekDays: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
      analyticsPeriods: ['3m', '6m', '1y', '2y', '5y'],
      
      newStock: {
        symbol: '',
        shares: 0,
        avgPrice: 0,
        purchaseDate: ''
      },
      
      historyFilter: {
        year: '',
        symbol: ''
      },
      
      portfolio: [
        {
          symbol: 'VCB',
          name: 'Vietcombank',
          shares: 100,
          avgPrice: 85000,
          currentPrice: 92000,
          dividendYield: 4.2,
          annualDividend: 3500,
          sector: 'Banking'
        },
        {
          symbol: 'VIC',
          name: 'Vingroup',
          shares: 200,
          avgPrice: 65000,
          currentPrice: 68500,
          dividendYield: 2.8,
          annualDividend: 1900,
          sector: 'Real Estate'
        },
        {
          symbol: 'HPG',
          name: 'Hoa Phat Group',
          shares: 500,
          avgPrice: 32000,
          currentPrice: 35500,
          dividendYield: 3.1,
          annualDividend: 1100,
          sector: 'Steel'
        }
      ],
      
      dividendHistory: [
        {
          date: new Date(2024, 2, 15),
          symbol: 'VCB',
          amount: 1750,
          shares: 100,
          total: 175000,
          status: 'received'
        },
        {
          date: new Date(2024, 5, 10),
          symbol: 'VIC',
          amount: 950,
          shares: 200,
          total: 190000,
          status: 'received'
        },
        {
          date: new Date(2024, 8, 5),
          symbol: 'HPG',
          amount: 550,
          shares: 500,
          total: 275000,
          status: 'pending'
        }
      ]
    };
  },
  
  computed: {
    totalDividends() {
      return this.portfolio.reduce((total, holding) => {
        return total + (holding.annualDividend * holding.shares);
      }, 0);
    },
    
    dividendYield() {
      const totalValue = this.portfolio.reduce((total, holding) => {
        return total + (holding.currentPrice * holding.shares);
      }, 0);
      return totalValue > 0 ? (this.totalDividends / totalValue) * 100 : 0;
    },
    
    upcomingPayments() {
      return this.dividendHistory.filter(payment => 
        payment.status === 'pending' || payment.date > new Date()
      ).length;
    },
    
    calendarWeeks() {
      const weeks = [];
      const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
      const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
      
      // Start from the first Sunday of the calendar view
      const startDate = new Date(startOfMonth);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      
      let currentDate = new Date(startDate);
      
      for (let week = 0; week < 6; week++) {
        const weekDays = [];
        for (let day = 0; day < 7; day++) {
          const dayData = {
            date: new Date(currentDate),
            isCurrentMonth: currentDate.getMonth() === this.currentMonth.getMonth(),
            dividends: this.getDividendsForDate(currentDate)
          };
          weekDays.push(dayData);
          currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(weekDays);
        
        // Stop if we've passed the end of the month and filled the week
        if (currentDate > endOfMonth && week >= 4) break;
      }
      
      return weeks;
    },
    
    filteredHistory() {
      return this.dividendHistory.filter(payment => {
        if (this.historyFilter.year && payment.date.getFullYear() !== parseInt(this.historyFilter.year)) {
          return false;
        }
        if (this.historyFilter.symbol && payment.symbol !== this.historyFilter.symbol) {
          return false;
        }
        return true;
      });
    },
    
    availableYears() {
      const years = [...new Set(this.dividendHistory.map(payment => payment.date.getFullYear()))];
      return years.sort((a, b) => b - a);
    }
  },
  
  methods: {
    setActiveTab(tabId) {
      this.activeTab = tabId;
    },
    
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('vi-VN').format(date);
    },
    
    formatMonth(date) {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long'
      }).format(date);
    },
    
    getGainLoss(holding) {
      const gainLoss = (holding.currentPrice - holding.avgPrice) * holding.shares;
      const percentage = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
      const sign = gainLoss >= 0 ? '+' : '';
      return `${sign}${this.formatCurrency(gainLoss)} (${sign}${percentage.toFixed(2)}%)`;
    },
    
    getGainLossClass(holding) {
      const gainLoss = (holding.currentPrice - holding.avgPrice) * holding.shares;
      return gainLoss >= 0 ? 'positive' : 'negative';
    },
    
    previousMonth() {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    },
    
    nextMonth() {
      this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    },
    
    getDividendsForDate(date) {
      return this.dividendHistory.filter(payment => {
        return payment.date.toDateString() === date.toDateString();
      });
    },
    
    closeAddStockModal() {
      this.showAddStockModal = false;
      this.resetNewStock();
    },
    
    resetNewStock() {
      this.newStock = {
        symbol: '',
        shares: 0,
        avgPrice: 0,
        purchaseDate: ''
      };
    },
    
    async addStock() {
      this.addingStock = true;
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add to portfolio (in real app, this would come from API)
        const newHolding = {
          ...this.newStock,
          name: `Company ${this.newStock.symbol}`,
          currentPrice: this.newStock.avgPrice * 1.1, // Mock current price
          dividendYield: 3.5, // Mock yield
          annualDividend: this.newStock.avgPrice * 0.035, // Mock annual dividend
          sector: 'Technology' // Mock sector
        };
        
        this.portfolio.push(newHolding);
        this.closeAddStockModal();
      } catch (error) {
        console.error('Error adding stock:', error);
      } finally {
        this.addingStock = false;
      }
    },
    
    editHolding(holding) {
      // TODO: Implement edit functionality
      console.log('Edit holding:', holding);
    },
    
    deleteHolding(symbol) {
      if (confirm(this.$t('dividendTracker.portfolio.confirmDelete'))) {
        this.portfolio = this.portfolio.filter(holding => holding.symbol !== symbol);
      }
    }
  },
  
  mounted() {
    // Initialize charts if needed
    this.$nextTick(() => {
      if (this.activeTab === 'analytics') {
        this.initializeCharts();
      }
    });
  },
  
  watch: {
    activeTab(newTab) {
      if (newTab === 'analytics') {
        this.$nextTick(() => {
          this.initializeCharts();
        });
      }
    }
  }
};
</script>

<style scoped>
.dividend-tracker {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.tracker-header {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 3rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.page-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  background: rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.tracker-content {
  padding: 3rem 0;
}

.tabs-nav {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
  font-weight: 500;
}

.tab-btn.active {
  background: #4facfe;
  color: white;
  transform: translateY(-2px);
}

.tab-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.tab-header h2 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.add-btn {
  background: #4facfe;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.add-btn:hover {
  background: #3d8bfe;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.holding-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.holding-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
}

.holding-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stock-info h3 {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #333;
}

.stock-info p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.holding-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  background: none;
  border: 1px solid #e0e0e0;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #f0f8ff;
  border-color: #4facfe;
  color: #4facfe;
}

.delete-btn:hover {
  background: #ffeef0;
  border-color: #ff4757;
  color: #ff4757;
}

.holding-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-row span:first-child {
  color: #666;
}

.detail-row span:last-child {
  font-weight: 500;
  color: #333;
}

.yield-value {
  color: #4facfe !important;
  font-weight: 600 !important;
}

.dividend-value {
  color: #27ae60 !important;
  font-weight: 600 !important;
}

.holding-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.market-value .value {
  font-weight: 600;
  color: #333;
}

.gain-loss {
  font-weight: 600;
  font-size: 0.9rem;
}

.gain-loss.positive {
  color: #27ae60;
}

.gain-loss.negative {
  color: #e74c3c;
}

/* Calendar Styles */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendar-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-btn {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: #4facfe;
  color: white;
  border-color: #4facfe;
}

.current-month {
  font-size: 1.2rem;
  font-weight: 600;
  min-width: 180px;
  text-align: center;
}

.calendar-grid {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
}

.calendar-header-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fa;
}

.day-header {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  color: #666;
  border-right: 1px solid #e0e0e0;
}

.day-header:last-child {
  border-right: none;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-bottom: 1px solid #e0e0e0;
}

.calendar-week:last-child {
  border-bottom: none;
}

.calendar-day {
  min-height: 100px;
  padding: 0.5rem;
  border-right: 1px solid #e0e0e0;
  position: relative;
}

.calendar-day:last-child {
  border-right: none;
}

.calendar-day.other-month {
  background: #fafafa;
  color: #ccc;
}

.calendar-day.has-dividends {
  background: #f0f8ff;
}

.day-number {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.day-dividends {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dividend-item {
  background: #4facfe;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  display: flex;
  justify-content: space-between;
}

.more-indicator {
  font-size: 0.7rem;
  color: #666;
  margin-top: 0.25rem;
}

/* History Table */
.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.history-filters {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.history-table {
  overflow-x: auto;
}

.history-table table {
  width: 100%;
  border-collapse: collapse;
}

.history-table th,
.history-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.history-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.symbol-cell {
  font-weight: 600;
  color: #4facfe;
}

.total-cell {
  font-weight: 600;
  color: #333;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.received {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.pending {
  background: #fff3e0;
  color: #f57c00;
}

/* Analytics */
.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.period-btn.active,
.period-btn:hover {
  background: #4facfe;
  color: white;
  border-color: #4facfe;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
}

.chart-container h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #333;
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: white;
  border-radius: 8px;
  border: 2px dashed #e0e0e0;
  color: #666;
}

.metrics-grid {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.metric-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  color: #666;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.metric-value.positive {
  color: #27ae60;
}

.metric-subtitle {
  font-size: 0.9rem;
  color: #666;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 0;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 0 1.5rem 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4facfe;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.submit-btn {
  background: #4facfe;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #3d8bfe;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .tabs-nav {
    flex-direction: column;
  }
  
  .tab-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .calendar-day {
    min-height: 80px;
  }
  
  .history-filters {
    flex-direction: column;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style> 