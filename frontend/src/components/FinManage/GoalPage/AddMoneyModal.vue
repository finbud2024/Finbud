<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <div class="goal-icon">
            <font-awesome-icon :icon="getCategoryIcon(goal.category)" />
          </div>
          <div class="goal-info">
            <h2>Add Money to Goal</h2>
            <p class="goal-title">{{ goal.title }}</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>

      <div class="modal-body">
        <!-- Current Progress -->
        <div class="progress-section">
          <div class="progress-overview">
            <div class="amount-item">
              <span class="label">Current</span>
              <span class="value">${{ formatNumber(goal.currentAmount) }}</span>
            </div>
            <div class="amount-item">
              <span class="label">Target</span>
              <span class="value">${{ formatNumber(goal.targetAmount) }}</span>
            </div>
            <div class="amount-item">
              <span class="label">Remaining</span>
              <span class="value">${{ formatNumber(goal.targetAmount - goal.currentAmount) }}</span>
            </div>
          </div>
          
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: getProgressPercentage(goal) + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ getProgressPercentage(goal) }}% Complete</span>
          </div>
        </div>

        <!-- Add Money Form -->
        <form @submit.prevent="handleSubmit" class="add-money-form">
          <div class="form-group">
            <label for="amount" class="form-label">
              <font-awesome-icon icon="fa-solid fa-dollar-sign" />
              Amount to Add *
            </label>
            <div class="amount-input-container">
              <div class="amount-input">
                <span class="currency-symbol">$</span>
                <input
                  id="amount"
                  v-model.number="amount"
                  type="number"
                  class="form-input"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                  @input="updatePreview"
                />
              </div>
              <div class="quick-amounts">
                <button
                  v-for="quickAmount in quickAmounts"
                  :key="quickAmount"
                  type="button"
                  class="quick-amount-btn"
                  @click="setQuickAmount(quickAmount)"
                >
                  ${{ quickAmount }}
                </button>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="note" class="form-label">
              <font-awesome-icon icon="fa-solid fa-sticky-note" />
              Note (Optional)
            </label>
            <input
              id="note"
              v-model="note"
              type="text"
              class="form-input"
              placeholder="e.g., Salary bonus, side income, etc."
              maxlength="100"
            />
            <div class="input-help">{{ note.length }}/100 characters</div>
          </div>

          <!-- Preview Section -->
          <div v-if="amount > 0" class="preview-section">
            <h4>Preview After Addition</h4>
            <div class="preview-grid">
              <div class="preview-item">
                <span class="preview-label">New Total</span>
                <span class="preview-value success">${{ formatNumber(goal.currentAmount + amount) }}</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Progress</span>
                <span class="preview-value">{{ getNewProgressPercentage() }}%</span>
              </div>
              <div class="preview-item">
                <span class="preview-label">Remaining</span>
                <span class="preview-value">
                  ${{ formatNumber(Math.max(0, goal.targetAmount - (goal.currentAmount + amount))) }}
                </span>
              </div>
            </div>
            
            <!-- Achievement Message -->
            <div v-if="willCompleteGoal" class="achievement-preview">
              <div class="achievement-icon">🎉</div>
              <div class="achievement-text">
                <h5>Congratulations!</h5>
                <p>This addition will complete your goal!</p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary" 
          @click="handleSubmit"
          :disabled="!amount || amount <= 0"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          Add ${{ formatNumber(amount || 0) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faDollarSign, faStickyNote, faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faTimes, faDollarSign, faStickyNote, faPlus)

export default {
  name: 'AddMoneyModal',
  components: {
    FontAwesomeIcon
  },
  props: {
    goal: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'submit'],
  data() {
    return {
      amount: null,
      note: '',
      quickAmounts: [10, 25, 50, 100, 250, 500]
    }
  },
  computed: {
    willCompleteGoal() {
      return this.amount && (this.goal.currentAmount + this.amount >= this.goal.targetAmount)
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value || 0)
    },
    getProgressPercentage(goal) {
      return Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
    },
    getNewProgressPercentage() {
      if (!this.amount) return this.getProgressPercentage(this.goal)
      const newAmount = this.goal.currentAmount + this.amount
      return Math.min(Math.round((newAmount / this.goal.targetAmount) * 100), 100)
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
    setQuickAmount(amount) {
      this.amount = amount
      this.updatePreview()
    },
    updatePreview() {
      // Force reactivity update
      this.$forceUpdate()
    },
    handleSubmit() {
      if (!this.amount || this.amount <= 0) return
      
      this.$emit('submit', this.amount)
      this.$emit('close')
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
  max-width: 500px;
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
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #10b981, #047857);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: white;
}

.goal-info h2 {
  margin: 0;
  color: #1a1a1a;
  font-size: 1.5rem;
  font-weight: 700;
}

.goal-title {
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

.progress-section {
  margin-bottom: 2rem;
}

.progress-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.amount-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.amount-item .label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.amount-item .value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.progress-bar-container {
  margin-bottom: 1rem;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #047857);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #10b981;
}

.add-money-form {
  background: #fafbfc;
  border-radius: 16px;
  padding: 1.5rem;
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

.amount-input-container {
  display: flex;
  flex-direction: column;
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.amount-input .form-input {
  padding-left: 2rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.quick-amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-amount-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  color: #64748b;
}

.quick-amount-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.input-help {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.preview-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 2px solid #e2e8f0;
}

.preview-section h4 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.1rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.preview-item {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.preview-label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.preview-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.preview-value.success {
  color: #10b981;
}

.achievement-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border: 2px solid #10b981;
}

.achievement-icon {
  font-size: 2rem;
}

.achievement-text h5 {
  margin: 0;
  color: #047857;
  font-size: 1.1rem;
}

.achievement-text p {
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
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
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
  
  .progress-overview,
  .preview-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-amounts {
    grid-template-columns: repeat(3, 1fr);
    display: grid;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
</style> 