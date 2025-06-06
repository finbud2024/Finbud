<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="goal-icon">
            <font-awesome-icon :icon="getCategoryIcon(goal.category)" />
          </div>
          <div class="goal-info">
            <h2>{{ goal.title }}</h2>
            <p class="goal-category">{{ goal.category }}</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>

      <div class="modal-body">
        <!-- Progress Overview -->
        <div class="progress-section">
          <div class="progress-header">
            <h3>Progress Overview</h3>
            <span class="progress-percentage">{{ getProgressPercentage(goal) }}%</span>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: getProgressPercentage(goal) + '%' }"
              ></div>
            </div>
          </div>

          <div class="amount-overview">
            <div class="amount-card">
              <span class="amount-label">Saved</span>
              <span class="amount-value">${{ formatNumber(goal.currentAmount) }}</span>
            </div>
            <div class="amount-card">
              <span class="amount-label">Remaining</span>
              <span class="amount-value">${{ formatNumber(goal.targetAmount - goal.currentAmount) }}</span>
            </div>
            <div class="amount-card">
              <span class="amount-label">Target</span>
              <span class="amount-value">${{ formatNumber(goal.targetAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Timeline Information -->
        <div class="timeline-section">
          <h3>Timeline</h3>
          <div class="timeline-grid">
            <div class="timeline-item">
              <span class="timeline-label">Started</span>
              <span class="timeline-value">{{ formatDate(goal.startDate) }}</span>
            </div>
            <div class="timeline-item">
              <span class="timeline-label">Target Date</span>
              <span class="timeline-value">{{ formatDate(goal.endDate) }}</span>
            </div>
            <div class="timeline-item">
              <span class="timeline-label">Days Remaining</span>
              <span class="timeline-value">{{ getDaysRemaining(goal) }}</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="goal.description" class="description-section">
          <h3>Description</h3>
          <p class="goal-description">{{ goal.description }}</p>
        </div>

        <!-- Savings Analysis -->
        <div class="analysis-section">
          <h3>Savings Analysis</h3>
          <div class="analysis-grid">
            <div class="analysis-card">
              <span class="analysis-label">Required Monthly</span>
              <span class="analysis-value">${{ getRequiredMonthly(goal) }}</span>
            </div>
            <div class="analysis-card">
              <span class="analysis-label">Required Weekly</span>
              <span class="analysis-value">${{ getRequiredWeekly(goal) }}</span>
            </div>
            <div class="analysis-card">
              <span class="analysis-label">Required Daily</span>
              <span class="analysis-value">${{ getRequiredDaily(goal) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('edit', goal)">
          <font-awesome-icon icon="fa-solid fa-edit" />
          Edit Goal
        </button>
        <button 
          v-if="goal.currentAmount < goal.targetAmount"
          class="btn btn-primary" 
          @click="$emit('add-money', goal)"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          Add Money
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faTimes, faEdit, faPlus)

export default {
  name: 'GoalDetailsModal',
  components: {
    FontAwesomeIcon
  },
  props: {
    goal: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'add-money', 'edit'],
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value || 0)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    },
    getProgressPercentage(goal) {
      return Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
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
    },
    getDaysRemaining(goal) {
      const today = new Date()
      const end = new Date(goal.endDate)
      const diffTime = end - today
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (days < 0) return 'Overdue'
      if (days === 0) return 'Due today'
      if (days === 1) return '1 day left'
      return `${days} days left`
    },
    getRequiredMonthly(goal) {
      const remaining = goal.targetAmount - goal.currentAmount
      const today = new Date()
      const end = new Date(goal.endDate)
      const monthsRemaining = (end - today) / (1000 * 60 * 60 * 24 * 30.44)
      if (monthsRemaining <= 0) return '0.00'
      return (remaining / monthsRemaining).toFixed(2)
    },
    getRequiredWeekly(goal) {
      const remaining = goal.targetAmount - goal.currentAmount
      const today = new Date()
      const end = new Date(goal.endDate)
      const weeksRemaining = (end - today) / (1000 * 60 * 60 * 24 * 7)
      if (weeksRemaining <= 0) return '0.00'
      return (remaining / weeksRemaining).toFixed(2)
    },
    getRequiredDaily(goal) {
      const remaining = goal.targetAmount - goal.currentAmount
      const today = new Date()
      const end = new Date(goal.endDate)
      const daysRemaining = (end - today) / (1000 * 60 * 60 * 24)
      if (daysRemaining <= 0) return '0.00'
      return (remaining / daysRemaining).toFixed(2)
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.goal-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #000000, #333333);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.goal-info h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.75rem;
  font-weight: 700;
}

.goal-category {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f8fafc;
  border-radius: 10px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #ef4444;
  color: white;
}

.modal-body {
  padding: 2rem;
}

.progress-section,
.timeline-section,
.description-section,
.analysis-section {
  margin-bottom: 2rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.progress-header h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.25rem;
}

.progress-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #000000;
}

.progress-bar-container {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 12px;
  background: #f1f5f9;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #000000, #333333);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.amount-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.amount-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.amount-label {
  display: block;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.amount-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
}

.timeline-section h3,
.description-section h3,
.analysis-section h3 {
  margin: 0 0 1rem 0;
  color: #1a1a1a;
  font-size: 1.25rem;
}

.timeline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.timeline-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.timeline-label {
  display: block;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.timeline-value {
  font-weight: 600;
  color: #1a1a1a;
}

.goal-description {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.analysis-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.analysis-label {
  display: block;
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.analysis-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000000;
}

.modal-footer {
  padding: 1rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary {
  background: #f8fafc;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-primary {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

@media (max-width: 768px) {
  .modal-container {
    margin: 1rem;
  }
  
  .amount-overview,
  .timeline-grid,
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style> 