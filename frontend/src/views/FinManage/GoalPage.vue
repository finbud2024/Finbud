<template>
  <div class="goals-page">
    <!-- Header Section -->
    <header class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <font-awesome-icon icon="fa-solid fa-bullseye" />
            Financial Goals
          </h1>
          <p class="page-subtitle">Track your progress towards achieving financial freedom</p>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-outline" @click="showAnalytics = !showAnalytics">
            <font-awesome-icon icon="fa-solid fa-chart-bar" />
            Analytics
          </button>
          <button class="btn btn-primary" @click="showAddGoalModal = true">
            <font-awesome-icon icon="fa-solid fa-plus" />
            Add Goal
          </button>
        </div>
      </div>
      
      <!-- Quick Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <font-awesome-icon icon="fa-solid fa-target" />
          </div>
          <div class="stat-content">
            <h3>{{ goals.length }}</h3>
            <p>Active Goals</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon success">
            <font-awesome-icon icon="fa-solid fa-check-circle" />
          </div>
          <div class="stat-content">
            <h3>{{ achievedGoalsCount }}</h3>
            <p>Completed</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon warning">
            <font-awesome-icon icon="fa-solid fa-piggy-bank" />
          </div>
          <div class="stat-content">
            <h3>${{ formatNumber(totalSavedAmount) }}</h3>
            <p>Total Saved</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon info">
            <font-awesome-icon icon="fa-solid fa-trophy" />
          </div>
          <div class="stat-content">
            <h3>${{ formatNumber(totalTargetAmount) }}</h3>
            <p>Total Target</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Analytics Section -->
    <section v-if="showAnalytics" class="analytics-section">
      <div class="analytics-grid">
        <div class="analytics-card">
          <h3>Goal Progress Overview</h3>
          <div class="progress-chart">
            <GoalProgressChart :goals="goals" />
          </div>
        </div>
        
        <div class="analytics-card">
          <h3>Category Distribution</h3>
          <div class="category-chart">
            <CategoryPieChart :goals="goals" />
          </div>
        </div>
        
        <div class="analytics-card">
          <h3>Monthly Savings Trend</h3>
          <div class="savings-chart">
            <SavingsTrendChart :goals="goals" />
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Filters & Search -->
      <div class="filters-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search goals..."
              class="search-input"
            />
          </div>
        </div>
        
        <div class="filter-controls">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          
          <select v-model="selectedStatus" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          
          <select v-model="sortBy" class="filter-select">
            <option value="created">Date Created</option>
            <option value="deadline">Deadline</option>
            <option value="progress">Progress</option>
            <option value="amount">Target Amount</option>
          </select>
        </div>
      </div>

      <!-- Goals Grid -->
      <div class="goals-section">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading your goals...</p>
        </div>
        
        <div v-else-if="filteredGoals.length === 0" class="empty-state">
          <div class="empty-icon">
            <font-awesome-icon icon="fa-solid fa-bullseye" />
          </div>
          <h3>No goals found</h3>
          <p>Start by creating your first financial goal to track your progress</p>
          <button class="btn btn-primary" @click="showAddGoalModal = true">
            <font-awesome-icon icon="fa-solid fa-plus" />
            Create Your First Goal
          </button>
        </div>
        
        <div v-else class="goals-grid">
          <div
            v-for="goal in filteredGoals"
            :key="goal._id"
            class="goal-card"
            :class="getGoalStatusClass(goal)"
            @click="showGoalDetails(goal)"
          >
            <!-- Goal Header -->
            <div class="goal-header">
              <div class="goal-icon">
                <font-awesome-icon :icon="getCategoryIcon(goal.category)" />
              </div>
              <div class="goal-menu">
                <button class="menu-btn" @click.stop="toggleGoalMenu(goal._id)">
                  <font-awesome-icon icon="fa-solid fa-ellipsis-v" />
                </button>
                <div v-if="activeMenuGoal === goal._id" class="menu-dropdown">
                  <button @click.stop="editGoal(goal)">
                    <font-awesome-icon icon="fa-solid fa-edit" />
                    Edit
                  </button>
                  <button @click.stop="duplicateGoal(goal)">
                    <font-awesome-icon icon="fa-solid fa-copy" />
                    Duplicate
                  </button>
                  <button @click.stop="deleteGoal(goal)" class="danger">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <!-- Goal Content -->
            <div class="goal-content">
              <h3 class="goal-title">{{ goal.title }}</h3>
              <p class="goal-category">{{ goal.category }}</p>
              
              <div class="goal-amounts">
                <div class="amount-item">
                  <span class="label">Saved</span>
                  <span class="value">${{ formatNumber(goal.currentAmount) }}</span>
                </div>
                <div class="amount-item">
                  <span class="label">Target</span>
                  <span class="value">${{ formatNumber(goal.targetAmount) }}</span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                    :style="{ width: getProgressPercentage(goal) + '%' }"
                  ></div>
                </div>
                <span class="progress-text">{{ getProgressPercentage(goal) }}%</span>
              </div>

              <!-- Time Info -->
              <div class="time-info">
                <div class="time-item">
                  <font-awesome-icon icon="fa-solid fa-calendar-start" />
                  <span>{{ formatDate(goal.startDate) }}</span>
                </div>
                <div class="time-item">
                  <font-awesome-icon icon="fa-solid fa-calendar-check" />
                  <span>{{ formatDate(goal.endDate) }}</span>
                </div>
              </div>

              <!-- Days Remaining -->
              <div class="days-remaining" :class="getDaysRemainingClass(goal)">
                <font-awesome-icon icon="fa-solid fa-clock" />
                {{ getDaysRemaining(goal) }}
              </div>
            </div>

            <!-- Goal Actions -->
            <div class="goal-actions">
              <button 
                class="action-btn secondary" 
                @click.stop="openAddMoneyModal(goal)"
              >
                <font-awesome-icon icon="fa-solid fa-plus" />
                Add Money
              </button>
              <button 
                class="action-btn primary" 
                @click.stop="showGoalDetails(goal)"
              >
                <font-awesome-icon icon="fa-solid fa-eye" />
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <AddGoalModal
      v-if="showAddGoalModal"
      :categories="categories"
      @close="showAddGoalModal = false"
      @submit="handleAddGoal"
    />

    <EditGoalModal
      v-if="showEditGoalModal && selectedGoal"
      :goal="selectedGoal"
      :categories="categories"
      @close="showEditGoalModal = false"
      @submit="handleEditGoal"
    />

    <GoalDetailsModal
      v-if="showGoalDetailsModal && selectedGoal"
      :goal="selectedGoal"
      @close="showGoalDetailsModal = false"
      @add-money="openAddMoneyModal"
      @edit="editGoal"
    />

    <AddMoneyModal
      v-if="showAddMoneyModal && selectedGoal"
      :goal="selectedGoal"
      @close="showAddMoneyModal = false"
      @submit="handleAddMoney"
    />

    <!-- Toast Notifications -->
    <Toast ref="toast" />

    <!-- Smart Assistant -->
    <div class="assistant-container" v-if="showAssistant">
      <div class="assistant-bubble" @click="toggleAssistant">
        <img src="@/assets/botrmbg.png" alt="Assistant" class="assistant-avatar" />
        <div v-if="showAssistantMessage" class="assistant-message">
          <div v-if="assistantTyping" class="typing-dots">
            <span></span><span></span><span></span>
          </div>
          <div v-else v-html="assistantMessage"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBullseye, faPlus, faChartBar, faTarget, faCheckCircle,
  faPiggyBank, faTrophy, faSearch, faEllipsisV, faEdit,
  faCopy, faTrash, faCalendarStart, faCalendarCheck,
  faClock, faEye
} from '@fortawesome/free-solid-svg-icons'

// Components
import AddGoalModal from '@/components/FinManage/GoalPage/AddGoalModal.vue'
import EditGoalModal from '@/components/FinManage/GoalPage/EditGoalModal.vue'
import GoalDetailsModal from '@/components/FinManage/GoalPage/GoalDetailsModal.vue'
import AddMoneyModal from '@/components/FinManage/GoalPage/AddMoneyModal.vue'
import GoalProgressChart from '@/components/FinManage/GoalPage/GoalProgressChart.vue'
import CategoryPieChart from '@/components/FinManage/GoalPage/CategoryPieChart.vue'
import SavingsTrendChart from '@/components/FinManage/GoalPage/SavingsTrendChart.vue'
import Toast from '@/components/FinManage/GoalPage/Toast.vue'

library.add(
  faBullseye, faPlus, faChartBar, faTarget, faCheckCircle,
  faPiggyBank, faTrophy, faSearch, faEllipsisV, faEdit,
  faCopy, faTrash, faCalendarStart, faCalendarCheck,
  faClock, faEye
)

export default {
  name: 'GoalPage',
  components: {
    FontAwesomeIcon,
    AddGoalModal,
    EditGoalModal,
    GoalDetailsModal,
    AddMoneyModal,
    GoalProgressChart,
    CategoryPieChart,
    SavingsTrendChart,
    Toast
  },
  data() {
    return {
      loading: false,
      goals: [],
      searchQuery: '',
      selectedCategory: '',
      selectedStatus: '',
      sortBy: 'created',
      showAnalytics: false,
      showAddGoalModal: false,
      showEditGoalModal: false,
      showGoalDetailsModal: false,
      showAddMoneyModal: false,
      selectedGoal: null,
      activeMenuGoal: null,
      categories: [
        'Emergency Fund',
        'Vacation',
        'Investment',
        'Education',
        'Health',
        'Vehicle',
        'Home',
        'Technology',
        'Business',
        'Retirement'
      ],
      showAssistant: true,
      showAssistantMessage: false,
      assistantTyping: false,
      assistantMessage: ''
    }
  },
  computed: {
    filteredGoals() {
      let filtered = [...this.goals]

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(goal =>
          goal.title.toLowerCase().includes(query) ||
          goal.category.toLowerCase().includes(query) ||
          goal.description?.toLowerCase().includes(query)
        )
      }

      // Category filter
      if (this.selectedCategory) {
        filtered = filtered.filter(goal => goal.category === this.selectedCategory)
      }

      // Status filter
      if (this.selectedStatus) {
        filtered = filtered.filter(goal => {
          const status = this.getGoalStatus(goal)
          return status === this.selectedStatus
        })
      }

      // Sort
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'deadline':
            return new Date(a.endDate) - new Date(b.endDate)
          case 'progress':
            return this.getProgressPercentage(b) - this.getProgressPercentage(a)
          case 'amount':
            return b.targetAmount - a.targetAmount
          default:
            return new Date(b.createdAt || b.startDate) - new Date(a.createdAt || a.startDate)
        }
      })

      return filtered
    },
    achievedGoalsCount() {
      return this.goals.filter(goal => goal.currentAmount >= goal.targetAmount).length
    },
    totalSavedAmount() {
      return this.goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
    },
    totalTargetAmount() {
      return this.goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value || 0)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    getProgressPercentage(goal) {
      return Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100)
    },
    getGoalStatus(goal) {
      if (goal.currentAmount >= goal.targetAmount) return 'completed'
      if (new Date(goal.endDate) < new Date()) return 'overdue'
      return 'active'
    },
    getGoalStatusClass(goal) {
      const status = this.getGoalStatus(goal)
      return {
        'goal-completed': status === 'completed',
        'goal-overdue': status === 'overdue',
        'goal-active': status === 'active'
      }
    },
    getDaysRemaining(goal) {
      const today = new Date()
      const endDate = new Date(goal.endDate)
      const diffTime = endDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'Overdue'
      if (diffDays === 0) return 'Due today'
      if (diffDays === 1) return '1 day left'
      return `${diffDays} days left`
    },
    getDaysRemainingClass(goal) {
      const today = new Date()
      const endDate = new Date(goal.endDate)
      const diffTime = endDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'overdue'
      if (diffDays <= 7) return 'urgent'
      if (diffDays <= 30) return 'warning'
      return 'normal'
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
    toggleGoalMenu(goalId) {
      this.activeMenuGoal = this.activeMenuGoal === goalId ? null : goalId
    },
    showGoalDetails(goal) {
      this.selectedGoal = goal
      this.showGoalDetailsModal = true
    },
    editGoal(goal) {
      this.selectedGoal = goal
      this.showEditGoalModal = true
      this.activeMenuGoal = null
    },
    duplicateGoal(goal) {
      const duplicated = {
        ...goal,
        title: `${goal.title} (Copy)`,
        currentAmount: 0,
        startDate: new Date().toISOString().split('T')[0]
      }
      delete duplicated._id
      this.handleAddGoal(duplicated)
      this.activeMenuGoal = null
    },
    deleteGoal(goal) {
      if (confirm(`Are you sure you want to delete "${goal.title}"?`)) {
        // API call to delete goal
        this.goals = this.goals.filter(g => g._id !== goal._id)
        this.showToast = true
        this.toastMessage = 'Goal deleted successfully'
        this.toastType = 'success'
      }
      this.activeMenuGoal = null
    },
    openAddMoneyModal(goal) {
      this.selectedGoal = goal
      this.showAddMoneyModal = true
    },
    handleAddGoal(goalData) {
      // Generate temporary ID for new goal
      const newGoal = {
        ...goalData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString()
      }
      
      this.goals.push(newGoal)
      
      // Show success toast
      this.$refs.toast.success(
        'Goal Created Successfully!',
        `Your goal "${goalData.title}" has been added to your list.`
      )
    },
    handleEditGoal(goalData) {
      // API call to update goal
      const index = this.goals.findIndex(g => g._id === goalData._id)
      if (index !== -1) {
        this.goals.splice(index, 1, goalData)
        
        // Show success toast
        this.$refs.toast.success(
          'Goal Updated Successfully!',
          `Your goal "${goalData.title}" has been updated.`
        )
      }
    },
    handleAddMoney(amount) {
      if (this.selectedGoal) {
        const updatedGoal = {
          ...this.selectedGoal,
          currentAmount: this.selectedGoal.currentAmount + amount
        }
        this.handleEditGoal(updatedGoal)
        
        if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
          this.showToast = true
          this.toastMessage = `🎉 Congratulations! You've achieved your goal "${updatedGoal.title}"!`
          this.toastType = 'success'
        }
      }
    },
    toggleAssistant() {
      this.showAssistantMessage = !this.showAssistantMessage
      if (this.showAssistantMessage && !this.assistantMessage) {
        this.generateAssistantMessage()
      }
    },
    generateAssistantMessage() {
      this.assistantTyping = true
      setTimeout(() => {
        this.assistantTyping = false
        const completedGoals = this.achievedGoalsCount
        const totalGoals = this.goals.length
        const averageProgress = this.goals.length ? 
          this.goals.reduce((sum, goal) => sum + this.getProgressPercentage(goal), 0) / this.goals.length : 0
        
        this.assistantMessage = `Hi! You have ${totalGoals} goals with ${completedGoals} completed. Your average progress is ${Math.round(averageProgress)}%. ${
          averageProgress > 70 ? "You're doing great! Keep it up!" : 
          averageProgress > 40 ? "Good progress! Consider increasing your savings rate." :
          "Let's work on your goals together! Start with small, consistent contributions."
        }`
      }, 1500)
    }
  },
  mounted() {
    // Load goals from API
    this.loading = true
    setTimeout(() => {
      // Simulated API call
      this.goals = [
        {
          _id: '1',
          title: 'Emergency Fund',
          description: 'Building 6 months of emergency savings',
          category: 'Emergency Fund',
          targetAmount: 10000,
          currentAmount: 6500,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          createdAt: '2024-01-01'
        },
        {
          _id: '2',
          title: 'Dream Vacation',
          description: 'Trip to Japan',
          category: 'Vacation',
          targetAmount: 5000,
          currentAmount: 2800,
          startDate: '2024-02-01',
          endDate: '2024-08-01',
          createdAt: '2024-02-01'
        }
      ]
      this.loading = false
    }, 1000)
    
    this.generateAssistantMessage()
  }
}
</script>

<style scoped>
.goals-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1.5rem;
}

/* Header Styles */
.page-header {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.btn-outline {
  background: transparent;
  border: 2px solid #e2e8f0;
  color: #64748b;
}

.btn-outline:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; }
.stat-icon.success { background: linear-gradient(135deg, #10b981, #047857); color: white; }
.stat-icon.warning { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
.stat-icon.info { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }

.stat-content h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.stat-content p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

/* Analytics Section */
.analytics-section {
  margin-bottom: 2rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.analytics-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.analytics-card h3 {
  margin: 0 0 1rem 0;
  color: #1a1a1a;
  font-weight: 600;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-container {
  flex: 1;
  min-width: 300px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

/* Goals Grid */
.goals-section {
  margin-bottom: 2rem;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.goal-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.goal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #3b82f6;
}

.goal-card.goal-completed {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.goal-card.goal-overdue {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.goal-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.goal-menu {
  position: relative;
}

.menu-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8fafc;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 10;
  min-width: 120px;
}

.menu-dropdown button {
  width: 100%;
  padding: 0.5rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-dropdown button:hover {
  background: #f8fafc;
}

.menu-dropdown button.danger {
  color: #ef4444;
}

.goal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.goal-category {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.goal-amounts {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.amount-item {
  text-align: center;
}

.amount-item .label {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.amount-item .value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.progress-container {
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
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.goal-completed .progress-fill {
  background: linear-gradient(90deg, #10b981, #047857);
}

.goal-overdue .progress-fill {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.progress-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3b82f6;
}

.time-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.time-item {
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.days-remaining {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 8px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.days-remaining.normal { background: #f0f9ff; color: #0369a1; }
.days-remaining.warning { background: #fffbeb; color: #d97706; }
.days-remaining.urgent { background: #fef2f2; color: #dc2626; }
.days-remaining.overdue { background: #fef2f2; color: #dc2626; }

.goal-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.action-btn.secondary:hover {
  background: #f1f5f9;
}

/* Assistant */
.assistant-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.assistant-bubble {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  cursor: pointer;
}

.assistant-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.assistant-avatar:hover {
  transform: scale(1.1);
}

.assistant-message {
  background: white;
  border-radius: 16px 16px 4px 16px;
  padding: 1rem;
  max-width: 280px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
.typing-dots span:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .goals-page {
    padding: 1rem;
  }
  
  .page-header {
    padding: 1.5rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-wrap: wrap;
  }
  
  .goals-grid {
    grid-template-columns: 1fr;
  }
  
  .assistant-container {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>