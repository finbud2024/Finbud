<template>
  <div class="goal-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="page-title">
          <h1>
            <font-awesome-icon icon="fa-solid fa-chart-line" />
            {{ $t("financialDashboard") }}
          </h1>
          <p>{{ $t("trackTransactionsGoals") }}</p>
        </div>
        
        <div class="header-actions">
    <button
            @click="showAddTransactionModal = true"
            class="primary-btn"
    >
            <font-awesome-icon icon="fa-solid fa-plus" />
            {{ $t("addTransaction") }}
    </button>
          
          <button 
            @click="showAddGoalModal = true"
            class="secondary-btn"
          >
            <font-awesome-icon icon="fa-solid fa-bullseye" />
            {{ $t("addGoal") }}
          </button>
          
          <div class="view-toggle">
            <button 
              @click="activeView = 'transactions'"
              :class="{ active: activeView === 'transactions' }"
              class="toggle-btn"
            >
              {{ $t("transactions") }}
            </button>
            <button 
              @click="activeView = 'goals'"
              :class="{ active: activeView === 'goals' }"
              class="toggle-btn"
            >
              {{ $t("goals") }}
            </button>
        </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Dashboard -->
    <div class="quick-stats">
      <div class="stat-card balance">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-wallet" />
          </div>
        <div class="stat-content">
          <h3>${{ formatNumber(currentBalance) }}</h3>
          <p>{{ $t("currentBalance") }}</p>
          <span class="stat-change" :class="{ 'positive': balanceChange >= 0, 'negative': balanceChange < 0 }">
            {{ balanceChange >= 0 ? '+' : '' }}${{ formatNumber(Math.abs(balanceChange)) }} {{ $t("thisMonth") }}
          </span>
          </div>
        </div>
      
      <div class="stat-card income">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-arrow-up" />
        </div>
        <div class="stat-content">
          <h3>${{ formatNumber(monthlyIncome) }}</h3>
          <p>{{ $t("monthlyIncome") }}</p>
          <span class="stat-change positive">
            {{ incomeTransactions.length }} {{ $t("transactions") }}
          </span>
        </div>
        </div>

      <div class="stat-card expense">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-arrow-down" />
          </div>
        <div class="stat-content">
          <h3>${{ formatNumber(Math.abs(monthlyExpense)) }}</h3>
          <p>{{ $t("monthlyExpense") }}</p>
          <span class="stat-change negative">
            {{ expenseTransactions.length }} {{ $t("transactions") }}
          </span>
        </div>
        </div>

      <div class="stat-card goals">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-bullseye" />
      </div>
        <div class="stat-content">
          <h3>{{ achievedGoals }}/{{ goals.length }}</h3>
          <p>{{ $t("goalsAchieved") }}</p>
          <span class="stat-change" :class="{ 'positive': achievedGoals > 0 }">
            {{ Math.round(goals.length ? (achievedGoals / goals.length) * 100 : 0) }}% {{ $t("completion") }}
          </span>
        </div>
      </div>
        </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Transactions View (Priority) -->
      <div v-if="activeView === 'transactions'" class="transactions-view">
        <!-- Transaction Category Chart -->
        <div class="content-section">
          <TransactionCategoryChart :transactions="transactions" />
        </div>
        
        <!-- Transaction History Table -->
        <div class="content-section">
          <TransactionHistoryTable 
            :transactions="transactions"
            @edit-transaction="editTransaction"
            @delete-transaction="deleteTransaction"
          />
        </div>
        
        <!-- Smart Insights -->
        <div class="content-section">
          <div class="insights-card">
            <div class="insights-header">
              <h3>
                <font-awesome-icon icon="fa-solid fa-robot" />
                {{ $t("smartInsights") }}
              </h3>
              <p>{{ $t("aiPoweredAnalysis") }}</p>
      </div>
            
            <div class="insights-content">
              <div class="insight-item" v-for="insight in smartInsights" :key="insight.id">
                <div class="insight-icon" :class="insight.type">
                  <font-awesome-icon :icon="insight.icon" />
        </div>
                <div class="insight-text">
                  <h4>{{ insight.title }}</h4>
                  <p>{{ insight.description }}</p>
      </div>
                <div class="insight-action" v-if="insight.action">
                  <button class="insight-btn" @click="handleInsightAction(insight.action)">
                    {{ insight.actionText }}
            </button>
          </div>
        </div>
        </div>
          </div>
        </div>
    </div>

      <!-- Goals View -->
      <div v-else-if="activeView === 'goals'" class="goals-view">
        <!-- Goals Overview -->
        <div class="content-section">
          <div class="goals-header">
            <div class="goals-filters">
              <div class="filter-group">
                <select v-model="goalFilter.category" class="filter-select">
                  <option value="">{{ $t("allCategories") }}</option>
                  <option v-for="category in goalCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
                
                <select v-model="goalFilter.status" class="filter-select">
                  <option value="">{{ $t("allStatus") }}</option>
                  <option value="active">{{ $t("active") }}</option>
                  <option value="completed">{{ $t("completed") }}</option>
                  <option value="overdue">{{ $t("overdue") }}</option>
                </select>
                
                <select v-model="goalFilter.sortBy" class="filter-select">
                  <option value="progress">{{ $t("sortByProgress") }}</option>
                  <option value="endDate">{{ $t("sortByEndDate") }}</option>
                  <option value="amount">{{ $t("sortByAmount") }}</option>
                  <option value="created">{{ $t("sortByCreated") }}</option>
          </select>
        </div>
              
              <div class="search-box">
                <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
          <input
                  v-model="goalFilter.search"
            type="text"
            :placeholder="$t('searchGoalsPlaceholder')"
            class="search-input"
          />
              </div>
            </div>
        </div>

          <!-- Goals Grid -->
          <div class="goals-grid">
            <div v-if="filteredGoals.length === 0" class="empty-state">
              <font-awesome-icon icon="fa-solid fa-bullseye" />
              <h4>{{ $t("noGoalsFound") }}</h4>
              <p>{{ goalFilter.search || goalFilter.category || goalFilter.status ? 'Try adjusting your filters' : $t('createYourFirstGoal') }}</p>
              <button @click="showAddGoalModal = true" class="primary-btn">
                <font-awesome-icon icon="fa-solid fa-plus" />
                {{ $t("addGoal") }}
              </button>
            </div>
            
          <div
            v-for="goal in filteredGoals"
            :key="goal._id"
              class="goal-card"
              :class="{ 
                'completed': getProgressPercentage(goal) >= 100,
                'near-completion': getProgressPercentage(goal) >= 90 && getProgressPercentage(goal) < 100,
                'overdue': isOverdue(goal)
              }"
            >
              <div class="goal-header">
                <div class="goal-info">
              <div class="goal-icon">
                    <font-awesome-icon :icon="getCategoryIcon(goal.category)" />
              </div>
                  <div class="goal-details">
                    <h4>{{ goal.title }}</h4>
                    <p class="goal-category">{{ goal.category }}</p>
              </div>
                </div>
                
                <div class="goal-actions">
                  <button 
                    @click="openAddMoneyModal(goal)"
                    class="action-btn add-money"
                    :disabled="getProgressPercentage(goal) >= 100"
                  >
                    <font-awesome-icon icon="fa-solid fa-plus" />
                  </button>
                  <button 
                    @click="showGoalDetails(goal)"
                    class="action-btn view-details"
                  >
                    <font-awesome-icon icon="fa-solid fa-eye" />
                  </button>
                  <button 
                    @click="editGoal(goal)"
                    class="action-btn edit"
                  >
                    <font-awesome-icon icon="fa-solid fa-edit" />
                  </button>
                </div>
              </div>
              
              <div class="goal-progress">
                <div class="progress-info">
                  <span class="current-amount">${{ formatNumber(goal.currentAmount) }}</span>
                  <span class="target-amount">/ ${{ formatNumber(goal.targetAmount) }}</span>
                  <span class="progress-percentage">{{ getProgressPercentage(goal) }}%</span>
                </div>
                
                <div class="progress-bar">
                  <div 
                    class="progress-fill"
                  :style="{
                      width: Math.min(getProgressPercentage(goal), 100) + '%',
                      background: getProgressColor(goal)
                  }"
                ></div>
              </div>
            </div>
              
              <div class="goal-dates">
                <div class="date-info">
                  <font-awesome-icon icon="fa-solid fa-calendar-alt" />
                  <span>{{ formatDate(goal.startDate) }} - {{ formatDate(goal.endDate) }}</span>
                </div>
                <div class="days-remaining" :class="{ 'overdue': isOverdue(goal) }">
                  {{ getDaysRemaining(goal) }}
          </div>
        </div>

              <!-- Achievement Animation -->
              <div v-if="getProgressPercentage(goal) >= 100" class="achievement-celebration">
                <div class="celebration-emoji">🎉</div>
                <p>Goal Achieved!</p>
              </div>
                </div>
              </div>
                </div>
              </div>
              </div>

    <!-- Modals -->
    <AddGoalModal 
      v-if="showAddGoalModal"
      @close="showAddGoalModal = false"
      @goal-added="handleGoalAdded"
    />
    
    <EditGoalModal 
      v-if="showEditGoalModal && selectedGoal"
      :goal="selectedGoal"
      @close="closeEditGoalModal"
      @goal-updated="handleGoalUpdated"
    />
    
    <GoalDetailsModal 
      v-if="showGoalDetailsModal && selectedGoal"
      :goal="selectedGoal"
      @close="showGoalDetailsModal = false"
    />
    
    <AddMoneyModal 
      v-if="showAddMoneyModal && selectedGoal"
      :goal="selectedGoal"
      @close="showAddMoneyModal = false"
      @money-added="handleMoneyAdded"
    />

    <TransactionModal 
      v-if="showAddTransactionModal"
      :transaction="newTransaction"
      :selectedCurrency="selectedCurrency"
      :recommendations="transactionRecommendations"
      :recommendationsVisible="recommendationsVisible"
      :highlightedIndex="highlightedIndex"
      @close="showAddTransactionModal = false"
      @submit="handleTransactionSubmit"
      @update:selectedCurrency="selectedCurrency = $event"
      @generate-recommendations="generateTransactionRecommendations"
      @select-recommendation="selectTransactionRecommendation"
      @show-recommendations="recommendationsVisible = true"
      @hide-recommendations="recommendationsVisible = false"
    />

    <StockTradingModal 
      v-if="showStockTradingModal"
      :initialData="stockTradingData"
      @close="showStockTradingModal = false"
      @trade-executed="handleTradeExecuted"
    />

    <!-- Toast Notifications -->
    <Toast 
      v-if="showToast"
      :message="toastMessage"
      :type="toastType"
      @close="showToast = false"
    />
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBullseye, faPlus, faChartBar, faCheckCircle,
  faPiggyBank, faTrophy, faSearch, faEllipsisV, faEdit,
  faCopy, faTrash, faCalendarAlt,
  faClock, faEye, faShieldAlt, faPlane, faChartLine,
  faGraduationCap, faHeart, faCar, faHome, faLaptop,
  faBriefcase, faUserClock, faMoneyBill, faCoins,
  faDollarSign, faPercentage,
  faChartPie, faRobot, faTimes, faInfoCircle,
  faExclamationTriangle, faFilter, faSort, faWallet,
  faArrowUp, faArrowDown
} from '@fortawesome/free-solid-svg-icons'

// Components
import AddGoalModal from '@/components/FinManage/GoalPage/AddGoalModal.vue'
import EditGoalModal from '@/components/FinManage/GoalPage/EditGoalModal.vue'
import GoalDetailsModal from '@/components/FinManage/GoalPage/GoalDetailsModal.vue'
import AddMoneyModal from '@/components/FinManage/GoalPage/AddMoneyModal.vue'
import Toast from '@/components/FinManage/GoalPage/Toast.vue'
import TransactionHistoryTable from '@/components/FinManage/GoalPage/TransactionHistoryTable.vue'
import TransactionCategoryChart from '@/components/FinManage/GoalPage/TransactionCategoryChart.vue'
import TransactionModal from '@/components/FinManage/GoalPage/TransactionModal.vue'
import StockTradingModal from '@/components/FinManage/GoalPage/StockTradingModal.vue'

library.add(
  faBullseye, faPlus, faChartBar, faCheckCircle,
  faPiggyBank, faTrophy, faSearch, faEllipsisV, faEdit,
  faCopy, faTrash, faCalendarAlt,
  faClock, faEye, faShieldAlt, faPlane, faChartLine,
  faGraduationCap, faHeart, faCar, faHome, faLaptop,
  faBriefcase, faUserClock, faMoneyBill, faCoins,
  faDollarSign, faPercentage,
  faChartPie, faRobot, faTimes, faInfoCircle,
  faExclamationTriangle, faFilter, faSort, faWallet,
  faArrowUp, faArrowDown
)

export default {
  name: 'GoalPage',
  components: {
    FontAwesomeIcon,
    AddGoalModal,
    EditGoalModal,
    GoalDetailsModal,
    AddMoneyModal,
    Toast,
    TransactionHistoryTable,
    TransactionCategoryChart,
    TransactionModal,
    StockTradingModal
  },
  data() {
    return {
      activeView: 'transactions', // Priority: transactions first
      goals: [],
      transactions: [],
      loading: false,
      
      // Modal states
      showAddGoalModal: false,
      showEditGoalModal: false,
      showGoalDetailsModal: false,
      showAddMoneyModal: false,
      showAddTransactionModal: false,
      showStockTradingModal: false,
      selectedGoal: null,
      stockTradingData: {},
      
      // Toast states
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      
      // Filters
      goalFilter: {
        search: '',
        category: '',
        status: '',
        sortBy: 'progress'
      },
      
      // Transaction states
      newTransaction: {
        type: '',
        description: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0]
      },
      selectedCurrency: 'USD',
      transactionRecommendations: [],
      recommendationsVisible: false,
      highlightedIndex: -1
    }
  },
  computed: {
    // Transaction computations
    currentBalance() {
      return this.transactions.length > 0 ? 
        this.transactions[this.transactions.length - 1].balance : 0
    },
    
    monthlyTransactions() {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return this.transactions.filter(t => new Date(t.date) >= startOfMonth)
    },
    
    monthlyIncome() {
      return this.monthlyTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0)
    },
    
    monthlyExpense() {
      return this.monthlyTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0)
    },
    
    balanceChange() {
      return this.monthlyIncome + this.monthlyExpense // expense is negative
    },
    
    incomeTransactions() {
      return this.monthlyTransactions.filter(t => t.type === 'Income')
    },
    
    expenseTransactions() {
      return this.monthlyTransactions.filter(t => t.type === 'Expense')
    },
    
    // Goal computations
    achievedGoals() {
      return this.goals.filter(g => this.getProgressPercentage(g) >= 100).length
    },
    
    goalCategories() {
      return [...new Set(this.goals.map(g => g.category))].sort()
    },
    
    filteredGoals() {
      let filtered = [...this.goals]
      
      // Search filter
      if (this.goalFilter.search) {
        const query = this.goalFilter.search.toLowerCase()
        filtered = filtered.filter(g =>
          g.title.toLowerCase().includes(query) ||
          g.category.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query)
        )
      }
      
      // Category filter
      if (this.goalFilter.category) {
        filtered = filtered.filter(g => g.category === this.goalFilter.category)
      }
      
      // Status filter
      if (this.goalFilter.status) {
        filtered = filtered.filter(g => {
          const progress = this.getProgressPercentage(g)
          switch (this.goalFilter.status) {
            case 'active':
              return progress < 100 && !this.isOverdue(g)
            case 'completed':
              return progress >= 100
            case 'overdue':
              return this.isOverdue(g)
            default:
              return true
          }
        })
      }
      
      // Sort
      filtered.sort((a, b) => {
        switch (this.goalFilter.sortBy) {
          case 'progress':
            return this.getProgressPercentage(b) - this.getProgressPercentage(a)
          case 'endDate':
            return new Date(a.endDate) - new Date(b.endDate)
          case 'amount':
            return b.targetAmount - a.targetAmount
          case 'created':
            return new Date(b.createdAt) - new Date(a.createdAt)
          default:
            return 0
        }
      })
      
      return filtered
    },
    
    smartInsights() {
      const insights = []
      
      // Spending pattern insight
      if (this.expenseTransactions.length > 0) {
        const avgDailySpend = Math.abs(this.monthlyExpense) / new Date().getDate()
        if (avgDailySpend > 50) {
          insights.push({
            id: 'high-spending',
            type: 'warning',
            icon: 'fa-solid fa-exclamation-triangle',
            title: 'High Daily Spending',
            description: `You're spending an average of $${this.formatNumber(avgDailySpend)} per day this month.`,
            action: 'create-budget',
            actionText: 'Create Budget'
          })
        }
      }
      
      // Goal achievement insight
      const nearGoals = this.goals.filter(g => this.getProgressPercentage(g) >= 80 && this.getProgressPercentage(g) < 100)
      if (nearGoals.length > 0) {
        insights.push({
          id: 'near-goals',
          type: 'success',
          icon: 'fa-solid fa-bullseye',
          title: 'Goals Almost Achieved',
          description: `You have ${nearGoals.length} goal(s) that are almost complete!`,
          action: 'view-goals',
          actionText: 'View Goals'
        })
      }
      
      // Income opportunity insight
      if (this.monthlyIncome > 0 && Math.abs(this.monthlyExpense) > this.monthlyIncome * 0.8) {
        insights.push({
          id: 'income-opportunity',
          type: 'info',
          icon: 'fa-solid fa-chart-line',
          title: 'Consider Additional Income',
          description: 'Your expenses are high relative to income. Consider finding additional income sources.',
          action: 'explore-income',
          actionText: 'Learn More'
        })
      }
      
      return insights
    }
  },
  
  mounted() {
    this.checkMobile();
    this.loadTransactions();
    this.loadGoals();
    this.loadSmartInsights();
    window.addEventListener('resize', this.checkMobile);
    
    // Listen for transaction updates from chatbot
    if (this.$eventBus) {
      this.$eventBus.$on('transaction-added', this.handleExternalTransactionAdded);
      this.$eventBus.$on('stock-buy-request', this.handleStockBuyRequest);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
    
    // Remove event listeners
    if (this.$eventBus) {
      this.$eventBus.$off('transaction-added', this.handleExternalTransactionAdded);
      this.$eventBus.$off('stock-buy-request', this.handleStockBuyRequest);
    }
  },
  methods: {
    async loadTransactions() {
      try {
        const userId = this.$store.getters["users/userId"];
        if (!userId) return;

        const response = await fetch(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const transactions = await response.json();
          this.transactions = transactions;
          this.calculateMetrics();
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    },

    async loadGoals() {
      try {
        const userId = this.$store.getters["users/userId"];
        if (!userId) return;

        const response = await fetch(`${process.env.VUE_APP_DEPLOY_URL}/goals/u/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const goals = await response.json();
          this.goals = goals;
        }
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    },

    calculateMetrics() {
      if (!this.transactions.length) return;

      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthTransactions = this.transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      this.monthlyIncome = thisMonthTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

      this.monthlyExpense = thisMonthTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate current balance from latest transaction
      const sortedTransactions = [...this.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      this.currentBalance = sortedTransactions.length > 0 ? sortedTransactions[0].balance || 0 : 0;
    },

    loadSmartInsights() {
      // Generate AI insights based on transaction data
      this.smartInsights = [
        {
          id: 1,
          type: 'positive',
          icon: 'fa-solid fa-chart-line',
          title: this.$t('spendingTrend'),
          description: this.$t('spendingTrendDesc')
        },
        {
          id: 2,
          type: 'warning',
          icon: 'fa-solid fa-exclamation-triangle',
          title: this.$t('budgetAlert'),
          description: this.$t('budgetAlertDesc')
        }
      ];
    },

    // Goal methods
    getProgressPercentage(goal) {
      return goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0
    },
    
    getProgressColor(goal) {
      const percentage = this.getProgressPercentage(goal)
      if (percentage >= 100) return 'linear-gradient(90deg, #10b981, #047857)'
      if (percentage >= 70) return 'linear-gradient(90deg, #f59e0b, #d97706)'
      if (percentage >= 30) return 'linear-gradient(90deg, #000000, #000000)'
      return 'linear-gradient(90deg, #ef4444, #dc2626)'
    },
    
    isOverdue(goal) {
      return new Date(goal.endDate) < new Date() && this.getProgressPercentage(goal) < 100
    },
    
    getDaysRemaining(goal) {
      const today = new Date()
      const endDate = new Date(goal.endDate)
      const diffTime = endDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`
      } else if (diffDays === 0) {
        return 'Due today'
      } else {
        return `${diffDays} days remaining`
      }
    },
    
    getCategoryIcon(category) {
      const icons = {
        'Emergency Fund': 'fa-solid fa-shield-alt',
        'Travel': 'fa-solid fa-plane',
        'Investment': 'fa-solid fa-chart-line',
        'Education': 'fa-solid fa-graduation-cap',
        'Health': 'fa-solid fa-heart',
        'Car': 'fa-solid fa-car',
        'House': 'fa-solid fa-home',
        'Technology': 'fa-solid fa-laptop',
        'Business': 'fa-solid fa-briefcase',
        'Retirement': 'fa-solid fa-user-clock'
      }
      return icons[category] || 'fa-solid fa-bullseye'
    },
    
    // Modal handlers
    openAddMoneyModal(goal) {
      this.selectedGoal = goal
      this.showAddMoneyModal = true
    },
    
    showGoalDetails(goal) {
      this.selectedGoal = goal
      this.showGoalDetailsModal = true
    },
    
    editGoal(goal) {
      this.selectedGoal = goal
      this.showEditGoalModal = true
    },
    
    closeEditGoalModal() {
      this.showEditGoalModal = false
      this.selectedGoal = null
    },
    
    // Event handlers
    handleGoalAdded(goal) {
      this.goals.push(goal)
      this.showToastMessage('Goal added successfully!', 'success')
    },
    
    handleGoalUpdated(updatedGoal) {
      const index = this.goals.findIndex(g => g._id === updatedGoal._id)
      if (index !== -1) {
        this.goals.splice(index, 1, updatedGoal)
        this.showToastMessage('Goal updated successfully!', 'success')
      }
    },
    
    handleMoneyAdded(data) {
      const { goalId, amount } = data
      const goal = this.goals.find(g => g._id === goalId)
      if (goal) {
        goal.currentAmount += amount
        this.showToastMessage(`$${this.formatNumber(amount)} added to ${goal.title}!`, 'success')
      }
    },
    
    async handleTransactionSubmit(transaction) {
      try {
        const userId = this.$store.getters["users/userId"];
        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Calculate balance (you may need to implement this properly)
        let newBalance = this.currentBalance + (transaction.type === 'Income' ? transaction.amount : -transaction.amount);
        
        const transactionData = {
          ...transaction,
          userId,
          balance: newBalance,
          date: transaction.date || new Date().toISOString()
        };

        const response = await fetch(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(transactionData)
        })
        
        if (response.ok) {
          const newTransaction = await response.json()
          this.transactions.push(newTransaction)
          this.showToastMessage('Transaction added successfully!', 'success')
          this.showAddTransactionModal = false
          this.resetTransactionForm()
          // Reload transactions to get latest data
          await this.loadTransactions()
        } else {
          throw new Error('Failed to add transaction')
        }
      } catch (error) {
        console.error('Error adding transaction:', error)
        this.showToastMessage('Error adding transaction', 'error')
      }
    },
    
    editTransaction(transaction) {
      // Handle transaction editing
      console.log('Edit transaction:', transaction)
    },
    
    async deleteTransaction(transaction) {
      try {
        const response = await fetch(`${process.env.VUE_APP_DEPLOY_URL}/transactions/${transaction._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          this.transactions = this.transactions.filter(t => t._id !== transaction._id)
          this.showToastMessage('Transaction deleted successfully!', 'success')
        }
      } catch (error) {
        console.error('Error deleting transaction:', error)
        this.showToastMessage('Error deleting transaction', 'error')
      }
    },
    
    handleInsightAction(action) {
      switch (action) {
        case 'create-budget':
          // Navigate to budget creation
          break
        case 'view-goals':
          this.activeView = 'goals'
          break
        case 'explore-income':
          // Show income tips
          break
      }
    },
    
    // Utility methods
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
    
    showToastMessage(message, type = 'success') {
      this.toastMessage = message
      this.toastType = type
      this.showToast = true
      
      setTimeout(() => {
        this.showToast = false
      }, 4000)
    },
    
    // Transaction methods
    generateTransactionRecommendations(event) {
      const query = event.target.value.toLowerCase()
      const commonDescriptions = [
        'Grocery shopping', 'Gas station', 'Restaurant meal', 'Coffee shop',
        'Online purchase', 'Salary payment', 'Freelance work', 'Gift received',
        'Bill payment', 'Rent payment', 'Utilities', 'Internet subscription',
        'Phone bill', 'Transportation', 'Taxi ride', 'Medical expense'
      ]
      
      this.transactionRecommendations = commonDescriptions
        .filter(desc => desc.toLowerCase().includes(query))
        .slice(0, 5)
    },
    
    selectTransactionRecommendation(recommendation) {
      this.newTransaction.description = recommendation
      this.recommendationsVisible = false
    },
    
    resetTransactionForm() {
      this.newTransaction = {
        type: '',
        description: '',
        amount: 0,
        category: '',
        date: new Date().toISOString().split('T')[0]
      }
      this.transactionRecommendations = []
      this.recommendationsVisible = false
      this.highlightedIndex = -1
    },

    checkMobile() {
      // Implement mobile check logic
    },

    async handleGoalSubmit(goal) {
      try {
        const userId = this.$store.getters["users/userId"];
        if (!userId) {
          throw new Error("User not authenticated");
        }

        const goalData = {
          ...goal,
          userId,
          currentAmount: goal.currentAmount || 0,
          createdAt: new Date().toISOString()
        };

        const response = await fetch(`${process.env.VUE_APP_DEPLOY_URL}/goals`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(goalData)
        });

        if (response.ok) {
          const newGoal = await response.json();
          this.goals.push(newGoal);
          this.showToastMessage('Goal added successfully!', 'success');
          this.showAddGoalModal = false;
          // Reload goals to get latest data
          await this.loadGoals();
        } else {
          throw new Error('Failed to add goal');
        }
      } catch (error) {
        console.error('Error adding goal:', error);
        this.showToastMessage('Error adding goal', 'error');
      }
    },

    handleExternalTransactionAdded(transaction) {
      // Handle external transaction added
      console.log('External transaction added:', transaction);
      this.transactions.push(transaction);
      this.showToastMessage('External transaction added successfully!', 'success');
      this.showAddTransactionModal = false;
      this.resetTransactionForm();
      this.loadTransactions();
    },

    handleStockBuyRequest(data) {
      // Handle stock buy request
      console.log('Stock buy request:', data);
      this.stockTradingData = data;
      this.showStockTradingModal = true;
    },

    handleTradeExecuted(data) {
      // Handle trade executed
      console.log('Trade executed:', data);
      this.showToastMessage('Trade executed successfully!', 'success');
      this.showStockTradingModal = false;
      this.resetTransactionForm();
      this.loadTransactions();
    },
  }
}
</script>

<style scoped>
.goal-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  padding: 2rem;
}

/* Page Header */
.page-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.page-title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 1.1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.primary-btn {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  background: linear-gradient(135deg, #333333, #555555);
}

.secondary-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.secondary-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.view-toggle {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.25rem;
  backdrop-filter: blur(10px);
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.toggle-btn.active {
  background: white;
  color: #000000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Quick Stats */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-card.balance .stat-icon { background: linear-gradient(135deg, #000000, #333333); }
.stat-card.income .stat-icon { background: linear-gradient(135deg, #10b981, #047857); }
.stat-card.expense .stat-icon { background: linear-gradient(135deg, #ef4444, #dc2626); }
.stat-card.goals .stat-icon { background: linear-gradient(135deg, #000000, #444444); }

.stat-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  color: #64748b;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.stat-change {
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-change.positive { color: #10b981; }
.stat-change.negative { color: #ef4444; }

/* Main Content */
.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

/* Goals View */
.goals-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.goals-filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #1a1a1a;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #000000;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #1a1a1a;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #000000;
}

/* Goals Grid */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

.goal-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.goal-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  border-color: #000000;
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.goal-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.goal-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f8fafc;
  color: #64748b;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.goal-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #f1f5f9;
  color: #64748b;
}

.edit-btn:hover {
  background: #000000;
  color: white;
}

.delete-btn {
  background: #fef2f2;
  color: #ef4444;
}

.delete-btn:hover {
  background: #ef4444;
  color: white;
}

.goal-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.current-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.target-amount {
  font-size: 1rem;
  color: #64748b;
}

.goal-progress {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.progress-percentage {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a1a1a;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #000000, #333333);
}

.goal-dates {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: #64748b;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.days-remaining.overdue {
  color: #ef4444;
  font-weight: 600;
}

.achievement-celebration {
  position: absolute;
  top: 0;
  right: 0;
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
  padding: 0.5rem;
  border-radius: 0 12px 0 12px;
  text-align: center;
}

.celebration-emoji {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.achievement-celebration p {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Insights */
.insights-card {
  padding: 1.5rem;
}

.insights-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.insights-header p {
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

.insights-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.insight-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: white;
}

.insight-icon.warning { background: linear-gradient(135deg, #f59e0b, #d97706); }
.insight-icon.success { background: linear-gradient(135deg, #10b981, #047857); }
.insight-icon.info { background: linear-gradient(135deg, #000000, #333333); }

.insight-text {
  flex: 1;
}

.insight-text h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.insight-text p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.insight-btn {
  padding: 0.5rem 1rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s ease;
}

.insight-btn:hover {
  background: #333333;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
}

.empty-state svg {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  margin: 0 0 1.5rem 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .goal-page {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .header-actions {
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .goals-filters {
  flex-direction: column;
    gap: 1rem;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
  
  .search-input {
  width: 100%;
  }
  
  .goals-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
}
</style>