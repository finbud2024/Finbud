<template>
  <div class="stock-simulator">
    <!-- Header -->
    <header class="simulator-header">
      <h1 class="page-title">
        <font-awesome-icon icon="fa-solid fa-chart-line" />
        Stock Trading Simulator
      </h1>
      
      <nav class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <font-awesome-icon :icon="tab.icon" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>
    </header>

    <!-- Content -->
    <main class="simulator-content">
      <!-- Investment Section -->
      <section v-if="activeTab === 'investment'" class="section">
        <div class="investment-grid">
          <!-- Chart & Stock Info -->
          <div class="main-panel">
            <div class="chart-container">
              <StockChart :stockCode="selectedStock" timeRange="3M"/>
            </div>
            <div class="stock-info">
              <BannerCardSimulator :stockCode="selectedStock" />
            </div>
          </div>

          <!-- Trading Panel -->
          <div class="trading-panel">
            <div class="trade-form">
              <h3>Quick Trade</h3>
              <input v-model="stockSymbol" type="text" placeholder="Stock Symbol" class="input" />
              <input v-model="quantity" type="number" placeholder="Quantity" class="input" />
              <select v-model="action" class="input">
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
              <div class="form-buttons">
                <button @click="clearForm" class="btn btn-secondary">Clear</button>
                <button @click="previewOrder" class="btn btn-primary">{{ action === 'buy' ? 'Buy' : 'Sell' }}</button>
              </div>
            </div>

            <!-- Account Summary -->
            <div class="account-summary">
              <h3>Account Summary</h3>
              <div class="summary-grid">
                <div class="stat">
                  <span class="label">Balance</span>
                  <span class="value">${{ formatNumber(accountBalance) }}</span>
                </div>
                <div class="stat">
                  <span class="label">Cash</span>
                  <span class="value">${{ formatNumber(cash) }}</span>
                </div>
                <div class="stat">
                  <span class="label">Stocks</span>
                  <span class="value">${{ formatNumber(stockValue) }}</span>
                </div>
                <div class="stat">
                  <span class="label">Today's Change</span>
                  <span class="value" :class="getChangeClass(todaysChange)">{{ todaysChange }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transactions -->
        <div class="transactions-container">
          <TransactionHistory :key="transactionKey" />
        </div>

        <!-- Performance Chart -->
        <div class="performance-container">
          <PerformanceChart :performanceData="performanceData" @timeframeChanged="updatePerformanceData" />
        </div>
      </section>

      <!-- Portfolio Section -->
      <section v-if="activeTab === 'portfolio'" class="section">
        <div class="portfolio-overview">
          <div class="overview-cards">
            <div class="overview-card total">
              <div class="card-title">Total Portfolio</div>
              <div class="card-value">${{ formatNumber(accountBalance) }}</div>
            </div>
            <div class="overview-card">
              <div class="card-title">Stocks</div>
              <div class="card-value">${{ formatNumber(stockValue) }}</div>
            </div>
            <div class="overview-card">
              <div class="card-title">Cash</div>
              <div class="card-value">${{ formatNumber(cash) }}</div>
            </div>
          </div>
        </div>

        <PortfolioPerformance />

        <div class="holdings-section">
          <h3>Your Holdings</h3>
          <div v-if="loadingHoldings" class="loading">Loading holdings...</div>
          <div v-else-if="holdingsError" class="error">{{ holdingsError }}</div>
          <div v-else-if="userHoldings.length === 0" class="empty">No holdings found</div>
          <div v-else class="holdings-table-container">
            <table class="holdings-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Shares</th>
                  <th>Current Price</th>
                  <th>Market Value</th>
                  <th>Gain/Loss</th>
                  <th>Change %</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="holding in userHoldings" :key="holding.symbol">
                  <td class="symbol">{{ holding.symbol }}</td>
                  <td>{{ holding.quantity }}</td>
                  <td>${{ formatNumber(holding.currentPrice || holding.purchasePrice) }}</td>
                  <td>${{ formatNumber(calculateMarketValue(holding)) }}</td>
                  <td :class="getGainLossClass(holding)">{{ formatGainLoss(calculateGainLoss(holding)) }}</td>
                  <td :class="getGainLossClass(holding)">{{ formatPercentage(calculatePercentChange(holding)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Filters Section -->
      <section v-if="activeTab === 'filters'" class="section">
        <stockScreener @applyFilter="stockFilterHandler" />
        <div v-if="displayStock.length" class="filtered-results">
          <CompanyCard
            v-for="(stock, idx) in displayStock"
            :key="idx"
            :companyName="stock.ticker"
            :width="'100%'"
          />
        </div>
      </section>

      <!-- Quiz Section -->
      <section v-if="activeTab === 'quiz'" class="section">
        <div class="quiz-container">
          <h2>Trading Quiz</h2>
          <div v-if="currentQuestion" class="question-container">
            <p class="question">{{ currentQuestion.text }}</p>
            <div class="options">
              <button
                v-for="(option, index) in currentQuestion.options"
                :key="index"
                @click="handleQuizOption(option)"
                class="option-btn"
              >
                {{ option.text }}
              </button>
            </div>
          </div>
          <div v-else class="loading">Loading questions...</div>
        </div>
      </section>

      <!-- Predictive Calculator -->
      <section v-if="activeTab === 'predictiveCalc'" class="section">
        <PredicitveCalc />
      </section>
    </main>

    <!-- Modals -->
    <PreviewOrderModal
      v-if="showModal"
      :stockSymbol="stockSymbol"
      :quantity="quantity"
      :estimatedPrice="estimatedPrice"
      :remainingBalance="calculateRemainingBalance(action, estimatedPrice, quantity)"
      :isSubmittingOrder="isSubmittingOrder"
      @close="showModal = false"
      @clear-order="clearForm"
      @submit-order="submitOrder(action)"
    />

    <QuizRewards v-if="showingReward" :reward-amount="rewardAmount" />

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
import { faChartLine, faBriefcase, faFilter, faGraduationCap, faCalculator } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

// Components
import StockChart from '@/components/StockChart.vue'
import BannerCardSimulator from '@/components/BannerCardSimulator.vue'
import TransactionHistory from '@/components/FinInvest/StockSimulatorPage/TransactionHistory.vue'
import PerformanceChart from '@/components/PerformanceChart.vue'
import PortfolioPerformance from '@/components/FinInvest/StockSimulatorPage/PortfolioPerformance.vue'
import stockScreener from '@/components/Stock/StockScreener.vue'
import CompanyCard from '@/components/CompanyCard.vue'
import PredicitveCalc from '@/components/FinInvest/StockSimulatorPage/PredicitveCalc.vue'
import PreviewOrderModal from '@/components/FinInvest/StockSimulatorPage/PreviewOrderModal.vue'
import QuizRewards from '@/components/FinEdu/Quiz/QuizRewards.vue'

library.add(faChartLine, faBriefcase, faFilter, faGraduationCap, faCalculator)

export default {
  name: 'StockSimulatorPage',
  components: {
    FontAwesomeIcon,
    StockChart,
    BannerCardSimulator,
    TransactionHistory,
    PerformanceChart,
    PortfolioPerformance,
    stockScreener,
    CompanyCard,
    PredicitveCalc,
    PreviewOrderModal,
    QuizRewards
  },
  data() {
    return {
      activeTab: 'investment',
      selectedStock: 'AAPL',
      stockSymbol: '',
      quantity: '',
      action: 'buy',
      showModal: false,
      estimatedPrice: 150,
      isSubmittingOrder: false,
      accountBalance: 10000,
      cash: 5000,
      stockValue: 5000,
      todaysChange: '+$123.45',
      transactionKey: 0,
      performanceData: [],
      userHoldings: [],
      loadingHoldings: false,
      holdingsError: null,
      displayStock: [],
      currentQuestion: null,
      showingReward: false,
      rewardAmount: 0,
      showAssistant: true,
      showAssistantMessage: false,
      assistantTyping: false,
      assistantMessage: '',
      tabs: [
        { key: 'investment', label: 'Investment', icon: 'fa-solid fa-chart-line' },
        { key: 'portfolio', label: 'Portfolio', icon: 'fa-solid fa-briefcase' },
        { key: 'filters', label: 'Filters', icon: 'fa-solid fa-filter' },
        { key: 'quiz', label: 'Quiz', icon: 'fa-solid fa-graduation-cap' },
        { key: 'predictiveCalc', label: 'Calculator', icon: 'fa-solid fa-calculator' }
      ]
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      }).format(value || 0)
    },
    getChangeClass(change) {
      const value = parseFloat(String(change).replace(/[$+,]/g, ''))
      return value >= 0 ? 'positive' : 'negative'
    },
    clearForm() {
      this.stockSymbol = ''
      this.quantity = ''
      this.action = 'buy'
    },
    previewOrder() {
      if (!this.stockSymbol || !this.quantity) return
      this.showModal = true
    },
    submitOrder(action) {
      this.isSubmittingOrder = true
      setTimeout(() => {
        this.isSubmittingOrder = false
        this.showModal = false
        this.clearForm()
        this.transactionKey++
        this.$toast?.success?.('Order submitted successfully!')
      }, 1500)
    },
    calculateRemainingBalance(action, price, quantity) {
      const total = price * quantity
      return action === 'buy' ? this.cash - total : this.cash + total
    },
    stockFilterHandler(stocks) {
      this.displayStock = stocks
    },
    updatePerformanceData(timeframe) {
      // Update performance data
    },
    handleQuizOption(option) {
      // Handle quiz option
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
        this.assistantMessage = `Hi! I'm here to help with your trading. Your portfolio is performing well with a total value of $${this.formatNumber(this.accountBalance)}. Consider diversifying your holdings for better risk management.`
      }, 1500)
    },
    calculateMarketValue(holding) {
      return (holding.currentPrice || holding.purchasePrice) * holding.quantity
    },
    calculateGainLoss(holding) {
      return this.calculateMarketValue(holding) - (holding.purchasePrice * holding.quantity)
    },
    calculatePercentChange(holding) {
      const gainLoss = this.calculateGainLoss(holding)
      const purchaseValue = holding.purchasePrice * holding.quantity
      return (gainLoss / purchaseValue) * 100
    },
    getGainLossClass(holding) {
      const gainLoss = this.calculateGainLoss(holding)
      return gainLoss >= 0 ? 'positive' : 'negative'
    },
    formatGainLoss(value) {
      const sign = value >= 0 ? '+' : ''
      return `${sign}$${this.formatNumber(Math.abs(value))}`
    },
    formatPercentage(value) {
      const sign = value >= 0 ? '+' : ''
      return `${sign}${value.toFixed(2)}%`
    }
  },
  mounted() {
    this.generateAssistantMessage()
  }
}
</script>

<style scoped>
.stock-simulator {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 1rem;
}

/* Header */
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

.tab-nav {
  display: flex;
  gap: 0.5rem;
  background: #f8fafc;
  border-radius: 12px;
  padding: 0.5rem;
}

.tab-btn {
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
}

.tab-btn:hover {
  background: #e2e8f0;
  color: #374151;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
}

/* Content */
.simulator-content {
  max-width: 1400px;
  margin: 0 auto;
}

.section {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Investment Grid */
.investment-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.main-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.chart-container,
.stock-info,
.trading-panel,
.transactions-container,
.performance-container {
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

/* Forms */
.trade-form h3,
.account-summary h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.trade-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s ease;
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
}

/* Account Summary */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat .label {
  font-weight: 500;
  color: #64748b;
}

.stat .value {
  font-weight: 600;
  color: #1a1a1a;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

/* Portfolio */
.portfolio-overview {
  margin-bottom: 2rem;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.overview-card.total {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 1.75rem;
  font-weight: 700;
}

/* Holdings Table */
.holdings-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.holdings-table-container {
  overflow-x: auto;
}

.holdings-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.holdings-table th,
.holdings-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.holdings-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #374151;
}

.holdings-table tr:hover td {
  background: #f8fafc;
}

.symbol {
  font-weight: 600;
  color: #3b82f6;
}

/* Quiz */
.quiz-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.question {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #374151;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-btn {
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

/* Filtered Results */
.filtered-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

/* Loading & Error States */
.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 1.1rem;
}

.error {
  color: #ef4444;
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
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
}

.assistant-avatar:hover {
  transform: scale(1.1);
}

.assistant-message {
  background: white;
  border-radius: 16px 16px 4px 16px;
  padding: 1rem;
  max-width: 300px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
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

/* Responsive */
@media (max-width: 1024px) {
  .investment-grid {
    grid-template-columns: 1fr;
  }
  
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stock-simulator {
    padding: 0.5rem;
  }
  
  .simulator-header {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .tab-btn span {
    display: none;
  }
  
  .form-buttons {
    flex-direction: column;
  }
  
  .overview-cards {
    grid-template-columns: 1fr;
  }
  
  .assistant-container {
    bottom: 1rem;
    right: 1rem;
  }
  
  .assistant-message {
    max-width: calc(100vw - 6rem);
  }
}
</style>
