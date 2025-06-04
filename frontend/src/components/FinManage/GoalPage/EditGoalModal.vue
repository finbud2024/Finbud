<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-edit" />
          Edit Goal
        </h2>
        <button class="close-btn" @click="$emit('close')">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- Goal Title -->
        <div class="form-group">
          <label for="title" class="form-label">
            <font-awesome-icon icon="fa-solid fa-tag" />
            Goal Title *
          </label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            class="form-input"
            placeholder="e.g., Emergency Fund, Dream Vacation, New Car"
            required
            maxlength="100"
          />
          <div class="input-help">{{ form.title.length }}/100 characters</div>
        </div>

        <!-- Category -->
        <div class="form-group">
          <label for="category" class="form-label">
            <font-awesome-icon icon="fa-solid fa-folder" />
            Category *
          </label>
          <div class="category-input-container">
            <select
              id="category"
              v-model="form.category"
              class="form-input"
              required
            >
              <option value="">Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
              <option value="custom">+ Create Custom Category</option>
            </select>
          </div>
          
          <div v-if="form.category === 'custom'" class="custom-category">
            <input
              v-model="customCategory"
              type="text"
              class="form-input"
              placeholder="Enter custom category name"
              maxlength="50"
            />
          </div>
        </div>

        <!-- Amount Fields -->
        <div class="form-row">
          <div class="form-group">
            <label for="targetAmount" class="form-label">
              <font-awesome-icon icon="fa-solid fa-bullseye" />
              Target Amount *
            </label>
            <div class="amount-input">
              <span class="currency-symbol">$</span>
              <input
                id="targetAmount"
                v-model.number="form.targetAmount"
                type="number"
                class="form-input"
                placeholder="0.00"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="currentAmount" class="form-label">
              <font-awesome-icon icon="fa-solid fa-piggy-bank" />
              Current Amount
            </label>
            <div class="amount-input">
              <span class="currency-symbol">$</span>
              <input
                id="currentAmount"
                v-model.number="form.currentAmount"
                type="number"
                class="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <!-- Date Fields -->
        <div class="form-row">
          <div class="form-group">
            <label for="startDate" class="form-label">
              <font-awesome-icon icon="fa-solid fa-calendar-start" />
              Start Date *
            </label>
            <input
              id="startDate"
              v-model="form.startDate"
              type="date"
              class="form-input"
              required
            />
          </div>

          <div class="form-group">
            <label for="endDate" class="form-label">
              <font-awesome-icon icon="fa-solid fa-calendar-check" />
              Target Date *
            </label>
            <input
              id="endDate"
              v-model="form.endDate"
              type="date"
              class="form-input"
              :min="form.startDate"
              required
            />
          </div>
        </div>

        <!-- Goal Progress Calculation -->
        <div v-if="form.targetAmount && form.endDate" class="goal-insights">
          <h4>Updated Goal Insights</h4>
          <div class="insights-grid">
            <div class="insight-item">
              <span class="insight-label">Progress</span>
              <span class="insight-value">{{ currentProgress }}%</span>
            </div>
            <div class="insight-item">
              <span class="insight-label">Remaining</span>
              <span class="insight-value">${{ remainingAmount }}</span>
            </div>
            <div class="insight-item">
              <span class="insight-label">Days Left</span>
              <span class="insight-value">{{ daysRemaining }} days</span>
            </div>
          </div>
          
          <!-- Required Savings -->
          <div v-if="remainingAmount > 0" class="savings-required">
            <h5>Required Savings Rate</h5>
            <div class="savings-grid">
              <div class="savings-item">
                <span class="savings-label">Daily</span>
                <span class="savings-value">${{ requiredDaily }}</span>
              </div>
              <div class="savings-item">
                <span class="savings-label">Weekly</span>
                <span class="savings-value">${{ requiredWeekly }}</span>
              </div>
              <div class="savings-item">
                <span class="savings-label">Monthly</span>
                <span class="savings-value">${{ requiredMonthly }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="description" class="form-label">
            <font-awesome-icon icon="fa-solid fa-file-alt" />
            Description (Optional)
          </label>
          <textarea
            id="description"
            v-model="form.description"
            class="form-textarea"
            placeholder="Describe your goal, why it's important to you, or any notes..."
            rows="3"
            maxlength="500"
          ></textarea>
          <div class="input-help">{{ form.description.length }}/500 characters</div>
        </div>

        <!-- Status Warning -->
        <div v-if="isOverdue" class="status-warning">
          <div class="warning-icon">
            <font-awesome-icon icon="fa-solid fa-exclamation-triangle" />
          </div>
          <div class="warning-content">
            <h5>Goal Overdue</h5>
            <p>This goal's target date has passed. Consider extending the deadline or adjusting the target amount.</p>
          </div>
        </div>

        <!-- Achievement Notice -->
        <div v-if="isCompleted" class="achievement-notice">
          <div class="achievement-icon">🎉</div>
          <div class="achievement-content">
            <h5>Goal Completed!</h5>
            <p>Congratulations! You've successfully achieved this goal.</p>
          </div>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" @click="handleSubmit" :disabled="!isFormValid">
          <font-awesome-icon icon="fa-solid fa-save" />
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faEdit, faTimes, faTag, faFolder, faPiggyBank,
  faCalendarStart, faCalendarCheck, faFileAlt, faSave,
  faExclamationTriangle, faBullseye
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faEdit, faTimes, faTag, faFolder, faPiggyBank,
  faCalendarStart, faCalendarCheck, faFileAlt, faSave,
  faExclamationTriangle, faBullseye
)

export default {
  name: 'EditGoalModal',
  components: {
    FontAwesomeIcon
  },
  props: {
    goal: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      form: {
        title: '',
        category: '',
        description: '',
        targetAmount: null,
        currentAmount: 0,
        startDate: '',
        endDate: ''
      },
      customCategory: ''
    }
  },
  computed: {
    isFormValid() {
      return this.form.title && 
             (this.form.category && this.form.category !== 'custom' || this.customCategory) && 
             this.form.targetAmount && 
             this.form.startDate && 
             this.form.endDate
    },
    currentProgress() {
      if (!this.form.targetAmount) return 0
      return Math.min(Math.round((this.form.currentAmount / this.form.targetAmount) * 100), 100)
    },
    remainingAmount() {
      return Math.max(0, this.form.targetAmount - this.form.currentAmount).toFixed(2)
    },
    daysRemaining() {
      if (!this.form.endDate) return 0
      const today = new Date()
      const endDate = new Date(this.form.endDate)
      const diffTime = endDate - today
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    requiredDaily() {
      if (this.daysRemaining <= 0 || this.remainingAmount <= 0) return '0.00'
      return (this.remainingAmount / this.daysRemaining).toFixed(2)
    },
    requiredWeekly() {
      if (this.daysRemaining <= 0 || this.remainingAmount <= 0) return '0.00'
      const weeks = this.daysRemaining / 7
      return (this.remainingAmount / weeks).toFixed(2)
    },
    requiredMonthly() {
      if (this.daysRemaining <= 0 || this.remainingAmount <= 0) return '0.00'
      const months = this.daysRemaining / 30.44 // Average days per month
      return (this.remainingAmount / months).toFixed(2)
    },
    isOverdue() {
      return new Date(this.form.endDate) < new Date() && this.form.currentAmount < this.form.targetAmount
    },
    isCompleted() {
      return this.form.currentAmount >= this.form.targetAmount
    }
  },
  methods: {
    handleSubmit() {
      if (!this.isFormValid) return

      const goalData = {
        ...this.goal,
        ...this.form,
        category: this.form.category === 'custom' ? this.customCategory : this.form.category
      }

      this.$emit('submit', goalData)
      this.$emit('close')
    }
  },
  mounted() {
    // Pre-fill form with existing goal data
    this.form = {
      title: this.goal.title || '',
      category: this.goal.category || '',
      description: this.goal.description || '',
      targetAmount: this.goal.targetAmount || null,
      currentAmount: this.goal.currentAmount || 0,
      startDate: this.goal.startDate ? this.goal.startDate.split('T')[0] : '',
      endDate: this.goal.endDate ? this.goal.endDate.split('T')[0] : ''
    }

    // Handle custom category
    if (this.goal.category && !this.categories.includes(this.goal.category)) {
      this.form.category = 'custom'
      this.customCategory = this.goal.category
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  padding: 1.5rem 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fafbfc;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.amount-input {
  position: relative;
}

.currency-symbol {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-weight: 600;
}

.amount-input .form-input {
  padding-left: 2rem;
}

.input-help {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.category-input-container {
  position: relative;
}

.custom-category {
  margin-top: 0.5rem;
}

.goal-insights {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.goal-insights h4 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.1rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.insight-item {
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.insight-label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.insight-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #3b82f6;
}

.savings-required {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.savings-required h5 {
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 1rem;
}

.savings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.savings-item {
  text-align: center;
  padding: 0.75rem;
  background: #fff7ed;
  border-radius: 8px;
  border: 1px solid #fed7aa;
}

.savings-label {
  display: block;
  font-size: 0.75rem;
  color: #ea580c;
  margin-bottom: 0.25rem;
}

.savings-value {
  font-size: 1rem;
  font-weight: 700;
  color: #ea580c;
}

.status-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 12px;
  border: 2px solid #fca5a5;
  margin: 1.5rem 0;
}

.warning-icon {
  color: #dc2626;
  font-size: 1.5rem;
}

.warning-content h5 {
  margin: 0;
  color: #dc2626;
  font-size: 1.1rem;
}

.warning-content p {
  margin: 0.25rem 0 0 0;
  color: #ef4444;
  font-size: 0.9rem;
}

.achievement-notice {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border: 2px solid #10b981;
  margin: 1.5rem 0;
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-content h5 {
  margin: 0;
  color: #047857;
  font-size: 1.1rem;
}

.achievement-content p {
  margin: 0.25rem 0 0 0;
  color: #059669;
  font-size: 0.9rem;
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
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .insights-grid,
  .savings-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style> 