<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-bullseye" />
          Create New Goal
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
            @input="suggestCategory"
          />
          <div class="input-help">{{ form.title.length }}/100 characters</div>
        </div>

        <!-- Category with AI Suggestions -->
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
            <div v-if="suggestedCategory && form.category !== suggestedCategory" 
                 class="ai-suggestion">
              <span>AI suggests: </span>
              <button type="button" @click="form.category = suggestedCategory" class="suggestion-btn">
                {{ suggestedCategory }}
              </button>
            </div>
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
              :min="today"
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
              :min="form.startDate || today"
              required
            />
          </div>
        </div>

        <!-- Goal Progress Calculation -->
        <div v-if="form.targetAmount && form.endDate" class="goal-insights">
          <h4>Goal Insights</h4>
          <div class="insights-grid">
            <div class="insight-item">
              <span class="insight-label">Monthly Target</span>
              <span class="insight-value">${{ monthlyTarget }}</span>
            </div>
            <div class="insight-item">
              <span class="insight-label">Weekly Target</span>
              <span class="insight-value">${{ weeklyTarget }}</span>
            </div>
            <div class="insight-item">
              <span class="insight-label">Days to Goal</span>
              <span class="insight-value">{{ daysToGoal }} days</span>
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

        <!-- Motivation Section -->
        <div class="motivation-section">
          <h4>
            <font-awesome-icon icon="fa-solid fa-heart" />
            What motivates you?
          </h4>
          <div class="motivation-tags">
            <button
              v-for="motivation in motivationOptions"
              :key="motivation"
              type="button"
              class="motivation-tag"
              :class="{ active: selectedMotivations.includes(motivation) }"
              @click="toggleMotivation(motivation)"
            >
              {{ motivation }}
            </button>
          </div>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" @click="handleSubmit" :disabled="!isFormValid">
          <font-awesome-icon icon="fa-solid fa-plus" />
          Create Goal
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBullseye, faTimes, faTag, faFolder, faPiggyBank,
  faCalendarStart, faCalendarCheck, faFileAlt, faHeart, faPlus
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faBullseye, faTimes, faTag, faFolder, faPiggyBank,
  faCalendarStart, faCalendarCheck, faFileAlt, faHeart, faPlus
)

export default {
  name: 'AddGoalModal',
  components: {
    FontAwesomeIcon
  },
  props: {
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
      customCategory: '',
      suggestedCategory: '',
      selectedMotivations: [],
      motivationOptions: [
        'Financial Security',
        'Family',
        'Personal Growth',
        'Adventure',
        'Independence',
        'Retirement',
        'Health',
        'Education'
      ]
    }
  },
  computed: {
    today() {
      return new Date().toISOString().split('T')[0]
    },
    isFormValid() {
      return this.form.title && 
             (this.form.category && this.form.category !== 'custom' || this.customCategory) && 
             this.form.targetAmount && 
             this.form.startDate && 
             this.form.endDate
    },
    daysToGoal() {
      if (!this.form.startDate || !this.form.endDate) return 0
      const start = new Date(this.form.startDate)
      const end = new Date(this.form.endDate)
      const diffTime = Math.abs(end - start)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    monthlyTarget() {
      if (!this.form.targetAmount || !this.daysToGoal) return '0.00'
      const remaining = this.form.targetAmount - (this.form.currentAmount || 0)
      const months = this.daysToGoal / 30.44 // Average days per month
      return (remaining / months).toFixed(2)
    },
    weeklyTarget() {
      if (!this.form.targetAmount || !this.daysToGoal) return '0.00'
      const remaining = this.form.targetAmount - (this.form.currentAmount || 0)
      const weeks = this.daysToGoal / 7
      return (remaining / weeks).toFixed(2)
    }
  },
  methods: {
    suggestCategory() {
      // AI category suggestion based on title
      const title = this.form.title.toLowerCase()
      const suggestions = {
        'emergency': 'Emergency Fund',
        'vacation': 'Vacation',
        'trip': 'Vacation',
        'travel': 'Vacation',
        'car': 'Vehicle',
        'house': 'Home',
        'home': 'Home',
        'education': 'Education',
        'school': 'Education',
        'college': 'Education',
        'health': 'Health',
        'medical': 'Health',
        'retirement': 'Retirement',
        'invest': 'Investment',
        'business': 'Business',
        'wedding': 'Life Events',
        'baby': 'Life Events'
      }
      
      for (const [keyword, category] of Object.entries(suggestions)) {
        if (title.includes(keyword)) {
          this.suggestedCategory = category
          break
        }
      }
    },
    toggleMotivation(motivation) {
      const index = this.selectedMotivations.indexOf(motivation)
      if (index > -1) {
        this.selectedMotivations.splice(index, 1)
      } else {
        this.selectedMotivations.push(motivation)
      }
    },
    handleSubmit() {
      if (!this.isFormValid) return

      const goalData = {
        ...this.form,
        category: this.form.category === 'custom' ? this.customCategory : this.form.category,
        motivations: this.selectedMotivations
      }

      this.$emit('submit', goalData)
      this.$emit('close')
    }
  },
  mounted() {
    // Set default start date to today
    this.form.startDate = this.today
    
    // Set default end date to 1 year from now
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)
    this.form.endDate = nextYear.toISOString().split('T')[0]
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

.ai-suggestion {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #0369a1;
}

.suggestion-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-left: 0.5rem;
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
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
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

.motivation-section {
  background: #fafbfc;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.motivation-section h4 {
  margin: 0 0 1rem 0;
  color: #374151;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.motivation-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.motivation-tag {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.motivation-tag:hover {
  border-color: #3b82f6;
}

.motivation-tag.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
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
  
  .insights-grid {
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