<template>
  <div class="earnings-calendar">
    <!-- Header -->
    <div class="calendar-header">
      <div class="header-info">
        <h2>Earnings Calendar</h2>
        <p>Upcoming earnings releases and corporate events</p>
      </div>
      <div class="header-controls">
        <div class="time-filter">
          <button 
            v-for="period in timePeriods" 
            :key="period.id"
            @click="selectedPeriod = period.id"
            :class="['period-btn', { active: selectedPeriod === period.id }]"
          >
            {{ period.label }}
          </button>
        </div>
        <div class="view-controls">
          <button @click="viewMode = 'list'" :class="['view-btn', { active: viewMode === 'list' }]">
            <font-awesome-icon icon="fa-solid fa-list" />
            List
          </button>
          <button @click="viewMode = 'calendar'" :class="['view-btn', { active: viewMode === 'calendar' }]">
            <font-awesome-icon icon="fa-solid fa-calendar" />
            Calendar
          </button>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-if="viewMode === 'list'" class="list-view">
      <div class="earnings-list">
        <div v-for="earning in filteredEarnings" :key="earning.id" class="earning-item">
          <div class="earning-header">
            <div class="company-info">
              <img :src="earning.logo" :alt="earning.company" class="company-logo" />
              <div class="company-details">
                <h4 class="company-name">{{ earning.company }}</h4>
                <span class="ticker">{{ earning.ticker }}</span>
              </div>
            </div>
            <div class="earning-meta">
              <div class="earning-date">{{ formatDate(earning.date) }}</div>
              <div class="earning-time">{{ earning.time }}</div>
              <div :class="['earning-type', earning.type]">{{ earning.type.toUpperCase() }}</div>
            </div>
          </div>
          
          <div class="earning-details">
            <div class="estimates">
              <div class="estimate-item">
                <span class="label">EPS Estimate:</span>
                <span class="value">${{ earning.epsEstimate }}</span>
              </div>
              <div class="estimate-item">
                <span class="label">Revenue Estimate:</span>
                <span class="value">${{ formatRevenue(earning.revenueEstimate) }}</span>
              </div>
              <div v-if="earning.actualEps" class="estimate-item">
                <span class="label">Actual EPS:</span>
                <span :class="['value', getEpsClass(earning.actualEps, earning.epsEstimate)]">
                  ${{ earning.actualEps }}
                </span>
              </div>
            </div>
            
            <div class="earning-actions">
              <button @click="addToWatchlist(earning)" class="action-btn">
                <font-awesome-icon icon="fa-solid fa-star" />
                Watch
              </button>
              <button @click="viewAnalysis(earning)" class="action-btn">
                <font-awesome-icon icon="fa-solid fa-chart-line" />
                Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Calendar View -->
    <div v-if="viewMode === 'calendar'" class="calendar-view">
      <!-- Calendar Navigation -->
      <div class="calendar-nav">
        <button @click="previousMonth" class="nav-btn">
          <font-awesome-icon icon="fa-solid fa-chevron-left" />
        </button>
        <h3 class="month-year">{{ formatMonthYear(currentDate) }}</h3>
        <button @click="nextMonth" class="nav-btn">
          <font-awesome-icon icon="fa-solid fa-chevron-right" />
        </button>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <!-- Weekday Headers -->
        <div v-for="day in weekdays" :key="day" class="weekday-header">
          {{ day }}
        </div>
        
        <!-- Calendar Days -->
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          :class="['calendar-day', { 
            'other-month': !day.currentMonth,
            'today': day.isToday,
            'has-earnings': day.earnings.length > 0
          }]"
          @click="selectDay(day)"
        >
          <div class="day-number">{{ day.day }}</div>
          <div v-if="day.earnings.length > 0" class="earnings-indicators">
            <div 
              v-for="earning in day.earnings.slice(0, 2)" 
              :key="earning.id"
              :class="['earning-dot', earning.type]"
              :title="`${earning.company} - ${earning.type}`"
            ></div>
            <div v-if="day.earnings.length > 2" class="more-indicator">
              +{{ day.earnings.length - 2 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Day Modal -->
    <div v-if="selectedDay" class="modal-overlay" @click="selectedDay = null">
      <div class="day-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ formatDate(selectedDay.date) }}</h3>
          <button @click="selectedDay = null" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        <div class="modal-content">
          <div v-if="selectedDay.earnings.length === 0" class="no-earnings">
            No earnings scheduled for this day.
          </div>
          <div v-else class="day-earnings">
            <div v-for="earning in selectedDay.earnings" :key="earning.id" class="modal-earning">
              <div class="modal-earning-header">
                <img :src="earning.logo" :alt="earning.company" class="modal-logo" />
                <div>
                  <h4>{{ earning.company }} ({{ earning.ticker }})</h4>
                  <p>{{ earning.time }} - {{ earning.type.toUpperCase() }}</p>
                </div>
              </div>
              <div class="modal-estimates">
                <div>EPS: ${{ earning.epsEstimate }}</div>
                <div>Revenue: ${{ formatRevenue(earning.revenueEstimate) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="summary-stats">
      <div class="stat-card">
        <div class="stat-value">{{ upcomingCount }}</div>
        <div class="stat-label">This Week</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ bigTechCount }}</div>
        <div class="stat-label">Big Tech</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ afterHoursCount }}</div>
        <div class="stat-label">After Hours</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ preMarketCount }}</div>
        <div class="stat-label">Pre-Market</div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faCalendar, faList, faChevronLeft, faChevronRight,
  faStar, faChartLine, faTimes
} from '@fortawesome/free-solid-svg-icons';

library.add(faCalendar, faList, faChevronLeft, faChevronRight, faStar, faChartLine, faTimes);

export default {
  name: 'EarningsCalendar',
  components: { FontAwesomeIcon },
  data() {
    return {
      viewMode: 'list',
      selectedPeriod: 'week',
      currentDate: new Date(),
      selectedDay: null,
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      timePeriods: [
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'quarter', label: 'This Quarter' }
      ],
      earningsData: [
        {
          id: 1,
          company: 'Apple Inc.',
          ticker: 'AAPL',
          date: new Date(2024, 1, 29),
          time: 'After Market Close',
          type: 'earnings',
          epsEstimate: 2.18,
          revenueEstimate: 117500000000,
          actualEps: null,
          logo: 'https://logo.clearbit.com/apple.com'
        },
        {
          id: 2,
          company: 'Microsoft Corporation',
          ticker: 'MSFT',
          date: new Date(2024, 1, 30),
          time: 'After Market Close',
          type: 'earnings',
          epsEstimate: 2.78,
          revenueEstimate: 60500000000,
          actualEps: null,
          logo: 'https://logo.clearbit.com/microsoft.com'
        },
        {
          id: 3,
          company: 'Amazon.com Inc.',
          ticker: 'AMZN',
          date: new Date(2024, 2, 1),
          time: 'After Market Close',
          type: 'earnings',
          epsEstimate: 0.84,
          revenueEstimate: 166000000000,
          actualEps: null,
          logo: 'https://logo.clearbit.com/amazon.com'
        },
        {
          id: 4,
          company: 'Alphabet Inc.',
          ticker: 'GOOGL',
          date: new Date(2024, 2, 5),
          time: 'Pre-Market',
          type: 'earnings',
          epsEstimate: 1.51,
          revenueEstimate: 76000000000,
          actualEps: null,
          logo: 'https://logo.clearbit.com/google.com'
        },
        {
          id: 5,
          company: 'Tesla Inc.',
          ticker: 'TSLA',
          date: new Date(2024, 2, 7),
          time: 'After Market Close',
          type: 'earnings',
          epsEstimate: 0.65,
          revenueEstimate: 25500000000,
          actualEps: null,
          logo: 'https://logo.clearbit.com/tesla.com'
        },
        {
          id: 6,
          company: 'Meta Platforms Inc.',
          ticker: 'META',
          date: new Date(2024, 2, 8),
          time: 'After Market Close',
          type: 'earnings',
          epsEstimate: 4.91,
          revenueEstimate: 36800000000,
          actualEps: null,
          logo: 'https://logo.clearbit.com/meta.com'
        }
      ]
    };
  },
  
  computed: {
    calendarDays() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());
      
      const days = [];
      const today = new Date();
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        const dayEarnings = this.earningsData.filter(earning => 
          earning.date.toDateString() === date.toDateString()
        );
        
        days.push({
          date: new Date(date),
          day: date.getDate(),
          currentMonth: date.getMonth() === month,
          isToday: date.toDateString() === today.toDateString(),
          earnings: dayEarnings
        });
      }
      
      return days;
    },
    
    filteredEarnings() {
      const now = new Date();
      return this.earningsData.filter(earning => {
        if (this.selectedPeriod === 'week') {
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return earning.date >= now && earning.date <= weekFromNow;
        } else if (this.selectedPeriod === 'month') {
          const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
          return earning.date >= now && earning.date <= monthFromNow;
        } else {
          const quarterFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
          return earning.date >= now && earning.date <= quarterFromNow;
        }
      }).sort((a, b) => a.date - b.date);
    },
    
    upcomingCount() {
      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return this.earningsData.filter(e => e.date >= now && e.date <= weekFromNow).length;
    },
    
    bigTechCount() {
      const bigTech = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'];
      return this.filteredEarnings.filter(e => bigTech.includes(e.ticker)).length;
    },
    
    afterHoursCount() {
      return this.filteredEarnings.filter(e => e.time.includes('After')).length;
    },
    
    preMarketCount() {
      return this.filteredEarnings.filter(e => e.time.includes('Pre')).length;
    }
  },
  
  methods: {
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    },
    
    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    },
    
    selectDay(day) {
      if (day.earnings.length > 0) {
        this.selectedDay = day;
      }
    },
    
    formatMonthYear(date) {
      return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    },
    
    formatRevenue(revenue) {
      if (revenue >= 1e9) return `${(revenue / 1e9).toFixed(1)}B`;
      if (revenue >= 1e6) return `${(revenue / 1e6).toFixed(1)}M`;
      return revenue.toLocaleString();
    },
    
    getEpsClass(actual, estimate) {
      if (actual > estimate) return 'beat';
      if (actual < estimate) return 'miss';
      return 'meet';
    },
    
    addToWatchlist(earning) {
      console.log('Added to watchlist:', earning.ticker);
    },
    
    viewAnalysis(earning) {
      console.log('View analysis for:', earning.ticker);
    }
  }
};
</script>

<style scoped>
.earnings-calendar {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
}

.header-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.header-info p {
  margin: 0;
  color: #6b7280;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.time-filter {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.25rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  color: #6b7280;
  transition: all 0.2s ease;
}

.period-btn.active {
  background: white;
  color: #1a1a1a;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.view-btn.active {
  background: #1a1a1a;
  color: white;
  border-color: #1a1a1a;
}

.list-view {
  padding: 1.5rem;
}

.earnings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.earning-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  background: white;
  transition: all 0.2s ease;
}

.earning-item:hover {
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.earning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: contain;
}

.company-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.ticker {
  color: #6b7280;
  font-weight: 600;
}

.earning-meta {
  text-align: right;
}

.earning-date {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.earning-time {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.earning-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #d1fae5;
  color: #065f46;
}

.earning-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.estimates {
  display: flex;
  gap: 2rem;
}

.estimate-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.estimate-item .label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 600;
}

.estimate-item .value {
  font-weight: 700;
  color: #1a1a1a;
}

.estimate-item .value.beat {
  color: #10b981;
}

.estimate-item .value.miss {
  color: #ef4444;
}

.earning-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: #374151;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f3f4f6;
}

.calendar-view {
  padding: 1.5rem;
}

.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.nav-btn {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  color: #6b7280;
}

.month-year {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.weekday-header {
  background: #f3f4f6;
  padding: 0.75rem;
  text-align: center;
  font-weight: 700;
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
}

.calendar-day {
  background: white;
  min-height: 80px;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s ease;
}

.calendar-day:hover {
  background: #f8f9fa;
}

.calendar-day.other-month {
  background: #f9fafb;
  color: #9ca3af;
}

.calendar-day.today {
  background: #eff6ff;
  border: 2px solid #3b82f6;
}

.calendar-day.has-earnings {
  background: #fef3c7;
}

.day-number {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.earnings-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.earning-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.more-indicator {
  font-size: 0.7rem;
  color: #6b7280;
  font-weight: 600;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.day-modal {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.close-btn {
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #6b7280;
  border-radius: 8px;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-content {
  padding: 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.no-earnings {
  text-align: center;
  color: #6b7280;
  padding: 2rem;
}

.modal-earning {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.modal-earning:last-child {
  margin-bottom: 0;
}

.modal-earning-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.modal-logo {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: contain;
}

.modal-earning-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.modal-earning-header p {
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
  color: #6b7280;
}

.modal-estimates {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #374151;
  font-weight: 600;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 600;
}

@media (max-width: 768px) {
  .calendar-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .estimates {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .earning-details {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
}
</style> 