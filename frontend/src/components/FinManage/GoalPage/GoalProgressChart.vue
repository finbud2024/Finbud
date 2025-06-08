<template>
  <div class="progress-chart">
    <div class="chart-container">
      <div v-for="goal in goals" :key="goal._id" class="goal-progress-item">
        <div class="goal-info">
          <div class="goal-icon">
            <font-awesome-icon :icon="getCategoryIcon(goal.category)" />
          </div>
          <div class="goal-details">
            <h4>{{ goal.title }}</h4>
            <p>{{ goal.category }}</p>
          </div>
          <div class="goal-percentage">
            {{ getProgressPercentage(goal) }}%
          </div>
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill"
            :style="{ 
              width: getProgressPercentage(goal) + '%',
              background: getProgressColor(goal)
            }"
          ></div>
        </div>
        <div class="goal-amounts">
          <span class="current">${{ formatNumber(goal.currentAmount) }}</span>
          <span class="target">${{ formatNumber(goal.targetAmount) }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="goals.length === 0" class="empty-chart">
      <font-awesome-icon icon="fa-solid fa-chart-bar" />
      <p>No goals to display</p>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faChartBar, faShieldAlt, faPlane, faChartLine,
  faGraduationCap, faHeart, faCar, faHome, faLaptop,
  faBriefcase, faUserClock, faBullseye
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faChartBar, faShieldAlt, faPlane, faChartLine,
  faGraduationCap, faHeart, faCar, faHome, faLaptop,
  faBriefcase, faUserClock, faBullseye
)

export default {
  name: 'GoalProgressChart',
  components: {
    FontAwesomeIcon
  },
  props: {
    goals: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value || 0)
    },
    getProgressPercentage(goal) {
      return Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
    },
    getProgressColor(goal) {
      const percentage = this.getProgressPercentage(goal)
      if (percentage >= 100) return 'linear-gradient(90deg, #10b981, #047857)'
      if (percentage >= 75) return 'linear-gradient(90deg, #059669, #047857)'
      if (percentage >= 50) return 'linear-gradient(90deg, #000000, #333333)'
      if (percentage >= 25) return 'linear-gradient(90deg, #f59e0b, #d97706)'
      return 'linear-gradient(90deg, #ef4444, #dc2626)'
    },
    getCategoryIcon(category) {
      const icons = {
        'Emergency Fund': 'fa-solid fa-shield-alt',
        'Vacation': 'fa-solid fa-plane',
        'Investment': 'fa-solid fa-chart-line',
        'Education': 'fa-solid fa-graduation-cap',
        'Health': 'fa-solid fa-heart',
        'Vehicle': 'fa-solid fa-car',
        'Home': 'fa-solid fa-home',
        'Technology': 'fa-solid fa-laptop',
        'Business': 'fa-solid fa-briefcase',
        'Retirement': 'fa-solid fa-user-clock'
      }
      return icons[category] || 'fa-solid fa-bullseye'
    }
  }
}
</script>

<style scoped>
.progress-chart {
  height: 100%;
  min-height: 300px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;
}

.goal-progress-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.goal-progress-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.goal-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.goal-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #000000, #333333);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  flex-shrink: 0;
}

.goal-details {
  flex: 1;
}

.goal-details h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.goal-details p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}

.goal-percentage {
  font-size: 1.1rem;
  font-weight: 700;
  color: #000000;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.goal-amounts {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.current {
  color: #10b981;
  font-weight: 600;
}

.target {
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
</style> 