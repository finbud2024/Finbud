<template>
  <div class="stock-simulator">
    <!-- Navigation Header -->
    <header class="simulator-header">
      <h1 class="page-title">
        <font-awesome-icon icon="fa-solid fa-chart-line" />
        {{ $t("appTitle") }}
      </h1>
      
      <nav class="tab-navigation">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['nav-tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <font-awesome-icon :icon="tab.icon" />
          <span>{{ $t(tab.label) }}</span>
        </button>
      </nav>
    </header>

    <!-- Content Sections -->
    <main class="simulator-content">
      <!-- Investment Section -->
      <section v-if="activeTab === 'investment'" class="content-section">
        <div class="investment-layout">
          <!-- Main Trading Area -->
          <div class="trading-area">
            <div class="chart-section">
              <StockChart :stockCode="selectedStock" timeRange="3M" />
            </div>
            
            <div class="stock-info-section">
              <BannerCardSimulator :stockCode="selectedStock" />
            </div>
          </div>

          <!-- Trading Panel -->
          <div class="trading-panel">
            <TradingForm 
              @submit="handleTradeSubmit"
              @preview="handleTradePreview"
              :loading="isSubmittingOrder"
            />
            
            <AccountSummary 
              :balance="accountBalance"
              :cash="cash"
              :stockValue="stockValue"
              :todaysChange="todaysChange"
              :annualReturn="annualReturn"
            />
          </div>
        </div>

        <!-- Transaction History -->
        <div class="transactions-section">
          <TransactionHistory :key="transactionKey" />
        </div>

        <!-- Performance Chart -->
        <div class="performance-section">
          <PerformanceChart
            :performanceData="performanceData"
            @timeframeChanged="updatePerformanceData"
          />
        </div>
      </section>

      <!-- Portfolio Section -->
      <section v-if="activeTab === 'portfolio'" class="content-section">
        <PortfolioOverview 
          :holdings="userHoldings"
          :loading="loadingHoldings"
          :error="holdingsError"
          :accountBalance="accountBalance"
          :cash="cash"
          :stockValue="stockValue"
        />
      </section>

      <!-- Filters Section -->
      <section v-if="activeTab === 'filters'" class="content-section">
        <StockScreener @applyFilter="stockFilterHandler" />
        <div v-if="displayStock.length" class="filtered-stocks">
          <CompanyCard
            v-for="(stock, idx) in displayStock"
            :key="idx"
            :companyName="stock.ticker"
            :width="'100%'"
          />
        </div>
      </section>

      <!-- Quiz Section -->
      <section v-if="activeTab === 'quiz'" class="content-section">
        <TradingQuiz 
          :currentQuestion="currentQuestion"
          @answer="handleQuizAnswer"
        />
      </section>

      <!-- Predictive Calculator -->
      <section v-if="activeTab === 'predictiveCalc'" class="content-section">
        <PredicitveCalc />
      </section>
    </main>

    <!-- Modals and Overlays -->
    <PreviewOrderModal
      v-if="showModal"
      :stockSymbol="stockSymbol"
      :quantity="quantity"
      :estimatedPrice="estimatedPrice"
      :remainingBalance="calculateRemainingBalance(action, estimatedPrice, quantity)"
      :isSubmittingOrder="isSubmittingOrder"
      @close="showModal = false"
      @clear-order="clearForm"
      @submit-order="submitOrder"
    />

    <QuizRewards 
      v-if="showingReward" 
      :reward-amount="rewardAmount" 
      @close="showingReward = false"
    />

    <!-- Smart Assistant Bot -->
    <SmartAssistant 
      :section="activeTab"
      :data="getAssistantData()"
      @refresh="refreshInsights"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { toast } from 'vue3-toastify'

// Components
import StockChart from '@/components/StockChart.vue'
import BannerCardSimulator from '@/components/BannerCardSimulator.vue'
import TradingForm from '@/components/FinInvest/StockSimulator/TradingForm.vue'
import AccountSummary from '@/components/FinInvest/StockSimulator/AccountSummary.vue'
import TransactionHistory from '@/components/FinInvest/StockSimulatorPage/TransactionHistory.vue'
import PerformanceChart from '@/components/PerformanceChart.vue'
import PortfolioOverview from '@/components/FinInvest/StockSimulator/PortfolioOverview.vue'
import StockScreener from '@/components/Stock/StockScreener.vue'
import CompanyCard from '@/components/CompanyCard.vue'
import TradingQuiz from '@/components/FinInvest/StockSimulator/TradingQuiz.vue'
import PredicitveCalc from '@/components/FinInvest/StockSimulatorPage/PredicitveCalc.vue'
import PreviewOrderModal from '@/components/FinInvest/StockSimulatorPage/PreviewOrderModal.vue'
import QuizRewards from '@/components/FinEdu/Quiz/QuizRewards.vue'
import SmartAssistant from '@/components/FinInvest/StockSimulator/SmartAssistant.vue'

// Services
import { fetchSimBannerStockData } from '@/services/stockServices'
import { gptServices } from '@/services/gptServices'

// Icons
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faChartLine, 
  faBriefcase, 
  faFilter, 
  faGraduationCap, 
  faCalculator 
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faChartLine, faBriefcase, faFilter, faGraduationCap, faCalculator)

export default {
  name: 'StockSimulatorPage',
  components: {
    FontAwesomeIcon,
    StockChart,
    BannerCardSimulator,
    TradingForm,
    AccountSummary,
    TransactionHistory,
    PerformanceChart,
    PortfolioOverview,
    StockScreener,
    CompanyCard,
    TradingQuiz,
    PredicitveCalc,
    PreviewOrderModal,
    QuizRewards,
    SmartAssistant
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()

    // Reactive state
    const activeTab = ref('investment')
    const selectedStock = ref('AAPL')
    const displayStock = ref([])
    const userHoldings = ref([])
    const loadingHoldings = ref(false)
    const holdingsError = ref(null)
    const currentQuestion = ref(null)
    const transactionKey = ref(0)
    const performanceData = ref([])
    
    // Trading state
    const stockSymbol = ref('')
    const quantity = ref('')
    const action = ref('buy')
    const showModal = ref(false)
    const estimatedPrice = ref(0)
    const isSubmittingOrder = ref(false)
    
    // Account data
    const accountData = reactive({
      balance: 0,
      cash: 0,
      stockValue: 0,
      todaysChange: '+$0.00',
      annualReturn: '0.0'
    })
    
    // Rewards
    const showingReward = ref(false)
    const rewardAmount = ref(0)

    // Navigation tabs configuration
    const tabs = computed(() => [
      { key: 'investment', label: 'navigation.investment', icon: 'fa-solid fa-chart-line' },
      { key: 'portfolio', label: 'navigation.portfolio', icon: 'fa-solid fa-briefcase' },
      { key: 'filters', label: 'navigation.filters', icon: 'fa-solid fa-filter' },
      { key: 'quiz', label: 'navigation.quiz', icon: 'fa-solid fa-graduation-cap' },
      { key: 'predictiveCalc', label: 'navigation.predictiveCalc', icon: 'fa-solid fa-calculator' }
    ])

    // Computed properties
    const accountBalance = computed(() => accountData.balance)
    const cash = computed(() => accountData.cash)
    const stockValue = computed(() => accountData.stockValue)
    const todaysChange = computed(() => accountData.todaysChange)
    const annualReturn = computed(() => accountData.annualReturn)

    // Methods
    const loadAccountData = async () => {
      try {
        // Load account data from API
        const userId = store.getters['users/userId']
        if (!userId) return

        // Fetch account balance, holdings, etc.
        // Implementation would go here
        accountData.balance = 10000 // Placeholder
        accountData.cash = 5000
        accountData.stockValue = 5000
      } catch (error) {
        console.error('Error loading account data:', error)
        toast.error('Failed to load account data')
      }
    }

    const loadHoldings = async () => {
      loadingHoldings.value = true
      holdingsError.value = null
      
      try {
        // Load user holdings from API
        // Implementation would go here
        userHoldings.value = [] // Placeholder
      } catch (error) {
        console.error('Error loading holdings:', error)
        holdingsError.value = 'Failed to load holdings'
      } finally {
        loadingHoldings.value = false
      }
    }

    const handleTradeSubmit = (tradeData) => {
      stockSymbol.value = tradeData.symbol
      quantity.value = tradeData.quantity
      action.value = tradeData.action
      // Process trade submission
    }

    const handleTradePreview = (tradeData) => {
      stockSymbol.value = tradeData.symbol
      quantity.value = tradeData.quantity
      action.value = tradeData.action
      estimatedPrice.value = tradeData.estimatedPrice
      showModal.value = true
    }

    const submitOrder = async () => {
      isSubmittingOrder.value = true
      try {
        // Submit order to API
        // Implementation would go here
        
        toast.success('Order submitted successfully!')
        showModal.value = false
        clearForm()
        transactionKey.value++
        await loadAccountData()
      } catch (error) {
        console.error('Error submitting order:', error)
        toast.error('Failed to submit order')
      } finally {
        isSubmittingOrder.value = false
      }
    }

    const clearForm = () => {
      stockSymbol.value = ''
      quantity.value = ''
      action.value = 'buy'
    }

    const calculateRemainingBalance = (actionType, price, qty) => {
      const total = price * qty
      return actionType === 'buy' ? accountData.cash - total : accountData.cash + total
    }

    const stockFilterHandler = (filteredStocks) => {
      displayStock.value = filteredStocks
    }

    const handleQuizAnswer = (answer) => {
      // Handle quiz answer
      // Implementation would go here
    }

    const updatePerformanceData = (timeframe) => {
      // Update performance data based on timeframe
      // Implementation would go here
    }

    const getAssistantData = () => {
      return {
        activeTab: activeTab.value,
        accountBalance: accountData.balance,
        holdings: userHoldings.value,
        selectedStock: selectedStock.value
      }
    }

    const refreshInsights = () => {
      // Refresh AI insights
      // Implementation would go here
    }

    // Lifecycle
    onMounted(async () => {
      await Promise.all([
        loadAccountData(),
        loadHoldings()
      ])
    })

    // Watchers
    watch(activeTab, (newTab) => {
      if (newTab === 'portfolio') {
        loadHoldings()
      }
    })

    return {
      // Reactive refs
      activeTab,
      selectedStock,
      displayStock,
      userHoldings,
      loadingHoldings,
      holdingsError,
      currentQuestion,
      transactionKey,
      performanceData,
      stockSymbol,
      quantity,
      action,
      showModal,
      estimatedPrice,
      isSubmittingOrder,
      showingReward,
      rewardAmount,
      
      // Computed
      tabs,
      accountBalance,
      cash,
      stockValue,
      todaysChange,
      annualReturn,
      
      // Methods
      handleTradeSubmit,
      handleTradePreview,
      submitOrder,
      clearForm,
      calculateRemainingBalance,
      stockFilterHandler,
      handleQuizAnswer,
      updatePerformanceData,
      getAssistantData,
      refreshInsights
    }
  }
}
</script>

<style scoped>
.stock-simulator {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1rem;
}

/* Header Styles */
.simulator-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.page-title svg {
  color: #000000;
}

.tab-navigation {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 12px;
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-tab:hover {
  background: #e2e8f0;
  color: #374151;
}

.nav-tab.active {
  background: #000000;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

/* Content Styles */
.simulator-content {
  max-width: 1400px;
  margin: 0 auto;
}

.content-section {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Investment Layout */
.investment-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.trading-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-section,
.stock-info-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.trading-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.transactions-section,
.performance-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

/* Filtered Stocks */
.filtered-stocks {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .investment-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stock-simulator {
    padding: 0.5rem;
  }
  
  .simulator-header {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .nav-tab span {
    display: none;
  }
  
  .chart-section,
  .stock-info-section,
  .transactions-section,
  .performance-section {
    padding: 1rem;
  }
  
  .filtered-stocks {
    grid-template-columns: 1fr;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .stock-simulator {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }
  
  .simulator-header,
  .chart-section,
  .stock-info-section,
  .transactions-section,
  .performance-section {
    background: rgba(30, 41, 59, 0.8);
    backdrop-filter: blur(10px);
  }
  
  .page-title {
    color: white;
  }
  
  .tab-navigation {
    background: rgba(15, 23, 42, 0.5);
  }
  
  .nav-tab {
    color: #94a3b8;
  }
  
  .nav-tab:hover {
    background: rgba(51, 65, 85, 0.5);
    color: white;
  }
}
</style>
