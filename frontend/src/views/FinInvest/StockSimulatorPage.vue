<template>
  <div class="stock-simulator">
    <!-- Header -->
    <header class="simulator-header">
      <h1 class="page-title">
        <font-awesome-icon icon="fa-solid fa-chart-line" />
        {{ $t('stockSimulator.pageTitle') }}
      </h1>
      
      <nav class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          <font-awesome-icon :icon="tab.icon" />
          <span>{{ $t(`stockSimulator.tabs.${tab.key}`) }}</span>
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
              <TradingViewChart :symbol="selectedStock" theme="light"/>
            </div>
            <div class="stock-info">
              <BannerCardSimulator :stockCode="selectedStock" />
            </div>
          </div>

          <!-- Trading Panel -->
          <div class="trading-panel">
            <div class="trade-form">
              <h3>{{ $t('stockSimulator.trading.quickTrade') }}</h3>
              <!-- Enhanced Stock Search -->
              <div class="stock-search-wrapper">
                <label class="form-label">{{ $t('stockSimulator.trading.stockSymbol') }}</label>
                <StockSearchInput
                  v-model="stockSymbol"
                  :placeholder="$t('stockSimulator.trading.stockSymbolPlaceholder')"
                  @stock-selected="handleStockSelection"
                  @search="handleStockSearch"
                />
              </div>
              <input v-model="quantity" type="number" :placeholder="$t('stockSimulator.trading.quantity')" class="input" />
              <select v-model="action" class="input">
                <option value="buy">{{ $t('stockSimulator.trading.buy') }}</option>
                <option value="sell">{{ $t('stockSimulator.trading.sell') }}</option>
            </select>
              <div class="form-buttons">
                <button @click="clearForm" class="btn btn-secondary">{{ $t('stockSimulator.trading.clear') }}</button>
                <button @click="previewOrder" class="btn btn-primary">{{ action === 'buy' ? $t('stockSimulator.trading.buy') : $t('stockSimulator.trading.sell') }}</button>
        </div>
      </div>

            <!-- Account Summary -->
            <div class="account-summary">
              <h3>{{ $t('stockSimulator.account.summary') }}</h3>
              <div class="summary-grid">
              <div class="stat">
                  <span class="label">{{ $t('stockSimulator.account.balance') }}</span>
                  <span class="value">${{ formatNumber(accountBalance) }}</span>
              </div>
              <div class="stat">
                  <span class="label">{{ $t('stockSimulator.account.cash') }}</span>
                  <span class="value">${{ formatNumber(cash) }}</span>
              </div>
              <div class="stat">
                  <span class="label">{{ $t('stockSimulator.account.stocks') }}</span>
                  <span class="value">${{ formatNumber(stockValue) }}</span>
              </div>
              <div class="stat">
                  <span class="label">{{ $t('stockSimulator.account.todayChange') }}</span>
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
    </section>

      <!-- Portfolio Section -->
      <section v-if="activeTab === 'portfolio'" class="section">
        <div class="portfolio-overview">
          <div class="overview-cards">
          <div class="overview-card total">
              <div class="card-title">{{ $t('stockSimulator.portfolio.totalPortfolio') }}</div>
              <div class="card-value">${{ formatNumber(accountBalance) }}</div>
            </div>
          <div class="overview-card">
              <div class="card-title">{{ $t('stockSimulator.account.stocks') }}</div>
              <div class="card-value">${{ formatNumber(stockValue) }}</div>
          </div>
          <div class="overview-card">
              <div class="card-title">{{ $t('stockSimulator.account.cash') }}</div>
              <div class="card-value">${{ formatNumber(cash) }}</div>
          </div>
        </div>
        </div>

        <PortfolioPerformance />

        <div class="holdings-section">
          <h3>{{ $t('stockSimulator.portfolio.holdings') }}</h3>
          <div v-if="loadingHoldings" class="loading">{{ $t('stockSimulator.portfolio.loading') }}</div>
          <div v-else-if="holdingsError" class="error">{{ holdingsError }}</div>
          <div v-else-if="userHoldings.length === 0" class="empty">{{ $t('stockSimulator.portfolio.noHoldings') }}</div>
          <div v-else class="holdings-table-container">
            <table class="holdings-table">
              <thead>
                <tr>
                  <th>{{ $t('stockSimulator.portfolio.table.symbol') }}</th>
                  <th>{{ $t('stockSimulator.portfolio.table.shares') }}</th>
                  <th>{{ $t('stockSimulator.portfolio.table.currentPrice') }}</th>
                  <th>{{ $t('stockSimulator.portfolio.table.marketValue') }}</th>
                  <th>{{ $t('stockSimulator.portfolio.table.gainLoss') }}</th>
                  <th>{{ $t('stockSimulator.portfolio.table.change') }}</th>
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
            v-for="stock in displayStock" 
            :key="stock.ticker || stock.symbol" 
            :companyName="stock.ticker || stock.symbol"
            :stockData="stock"
            :width="'100%'"
          />
            </div>
      </section>

      <!-- Quiz Section -->
      <section v-if="activeTab === 'quiz'" class="section">
        <div class="quiz-container">
          <h2>{{ $t('stockSimulator.quiz.title') }}</h2>
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
          <div v-else class="loading">{{ $t('stockSimulator.quiz.loading') }}</div>
      </div>
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
import { faChartLine, faBriefcase, faFilter, faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import api from '@/utils/api'

// Components
// import StockChart from '@/components/StockChart.vue'
import BannerCardSimulator from '@/components/BannerCardSimulator.vue'
import TransactionHistory from '@/components/FinInvest/StockSimulatorPage/TransactionHistory.vue'
import PerformanceChart from '@/components/PerformanceChart.vue'
import PortfolioPerformance from '@/components/FinInvest/StockSimulatorPage/PortfolioPerformance.vue'
import stockScreener from '@/components/Stock/StockScreener.vue'
import CompanyCard from '@/components/CompanyCard.vue'
import PreviewOrderModal from '@/components/FinInvest/StockSimulatorPage/PreviewOrderModal.vue'
import QuizRewards from '@/components/FinEdu/Quiz/QuizRewards.vue'
import StockSearchInput from '@/components/FinInvest/StockSimulatorPage/StockSearchInput.vue'
import TradingViewChart from '@/components/TradingViewChart.vue'

library.add(faChartLine, faBriefcase, faFilter, faGraduationCap)

export default {
  name: 'StockSimulatorPage',
  components: {
    FontAwesomeIcon,
    // StockChart,
    BannerCardSimulator,
    TransactionHistory,
    PerformanceChart,
    PortfolioPerformance,
    stockScreener,
    CompanyCard,
    PreviewOrderModal,
    QuizRewards,
    StockSearchInput,
    TradingViewChart
  },
  data() {
    return {
      activeTab: 'investment',
      selectedStock: 'AAPL',
      stockSymbol: '',
      quantity: 1,
      action: 'buy',
      showModal: false,
      estimatedPrice: 0,
      isSubmittingOrder: false,
      accountBalance: 0,
      cash: 0,
      stockValue: 0,
      todaysChange: '+$0.00',
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
      loadingFinancialData: true,
      tabs: [
        { key: 'investment', label: 'Investment', icon: 'fa-solid fa-chart-line' },
        { key: 'portfolio', label: 'Portfolio', icon: 'fa-solid fa-briefcase' },
        { key: 'filters', label: 'Filters', icon: 'fa-solid fa-filter' },
        { key: 'quiz', label: 'Quiz', icon: 'fa-solid fa-graduation-cap' }
      ]
    }
  },
  async mounted() {
    // Fetch financial data from API
    await this.fetchFinancialData()
    
    // Load initial stock data for filters
    await this.loadInitialStocks()
    
    // Listen for stock buy and sell requests from chatbot
    if (this.$eventBus) {
      this.$eventBus.$on('stock-buy-request', this.handleStockBuyRequest);
      this.$eventBus.$on('stock-sell-request', this.handleStockSellRequest);
    }
    this.generateAssistantMessage()
  },
  beforeDestroy() {
    // Clean up event listener
    if (this.$eventBus) {
      this.$eventBus.$off('stock-buy-request', this.handleStockBuyRequest);
      this.$eventBus.$off('stock-sell-request', this.handleStockSellRequest);
    }
  },
  methods: {
    async fetchFinancialData() {
      try {
        this.loadingFinancialData = true
        
        // Ensure user data is loaded
        await this.$store.dispatch("users/fetchCurrentUser")
        const userData = this.$store.getters["users/currentUser"]

        if (!userData) {
          console.error('User data not available')
          return
        }

        // Fetch user's account balance from API
        const response = await api.get(`/users/${userData._id}`)
        const data = response.data

        // Update financial data with real values from database
        this.accountBalance = data.bankingAccountData.accountBalance || 0
        this.stockValue = data.bankingAccountData.stockValue || 0  
        this.cash = data.bankingAccountData.cash || 0
        
        // Calculate today's change (you can expand this logic)
        const change = this.accountBalance - (this.stockValue + this.cash)
        this.todaysChange = change >= 0 ? `+$${Math.abs(change).toFixed(2)}` : `-$${Math.abs(change).toFixed(2)}`
        
      } catch (error) {
        console.error('Error fetching financial data:', error)
        // Keep default values if API fails
        this.accountBalance = 10000
        this.cash = 5000  
        this.stockValue = 5000
      } finally {
        this.loadingFinancialData = false
      }
    },
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
      this.quantity = 1
      this.estimatedPrice = 0
      this.action = 'buy'
      this.showModal = false
    },
    previewOrder() {
      if (!this.stockSymbol || !this.quantity) return
      this.showModal = true
    },
    async submitOrder(action) {
      this.isSubmittingOrder = true;
      try {
        // Submit order logic here
        const order = {
          symbol: this.stockSymbol,
          quantity: this.quantity,
          price: this.estimatedPrice,
          action: action,
          userId: this.$store.getters['users/userId']
        };

        await this.processOrder(order);
        
        // Close modal and reset form
        this.showModal = false;
        this.clearForm();
        
        // Show success notification with translation
        this.$notify({
          type: 'success',
          title: this.$t('stockSimulator.notifications.orderSuccess'),
          text: this.$t(`stockSimulator.notifications.${action}Success`, {
            quantity: this.quantity,
            symbol: this.stockSymbol
          })
        });
      } catch (error) {
        console.error('Error submitting order:', error);
        // Show error notification with translation
        this.$notify({
          type: 'error',
          title: this.$t('stockSimulator.notifications.orderError'),
          text: this.$t(`stockSimulator.notifications.${error.code || 'networkError'}`)
        });
      } finally {
        this.isSubmittingOrder = false;
      }
    },
    async processOrder(order) {
      try {
        // Make API call to process the order
        const response = await api.post('/trading/execute-order', {
          userId: order.userId,
          symbol: order.symbol,
          quantity: order.quantity,
          price: order.price,
          action: order.action
        })

        if (response.data.success) {
          // Update local financial data
          await this.fetchFinancialData()
          
          // Refresh transaction history
        this.transactionKey++
          
          return response.data
        } else {
          throw new Error(response.data.message || 'Order execution failed')
        }
      } catch (error) {
        console.error('Error processing order:', error)
        throw error
      }
    },
    async fetchStockPrice(symbol) {
      try {
        const response = await api.get(`/market/stock-price/${symbol}`)
        return {
          price: response.data.price || 100, // fallback price
          symbol: symbol
        }
      } catch (error) {
        console.error('Error fetching stock price:', error)
        // Return fallback price if API fails
        return {
          price: 100,
          symbol: symbol
        }
      }
    },
    calculateRemainingBalance(action, price, quantity) {
      const total = price * quantity
      return action === 'buy' ? this.cash - total : this.cash + total
    },
    async stockFilterHandler(filterData) {
      try {
        // Show loading state
        this.displayStock = []
        
        if (filterData.results) {
          // Use results from the new screener
          this.displayStock = filterData.results
        } else {
          // Fallback API call for backward compatibility
          const response = await api.post('/market/filter-stocks', {
            filters: filterData.filters || filterData
          })
          
          if (response.data && response.data.stocks) {
            this.displayStock = response.data.stocks
          } else {
            // Enhanced fallback with more realistic mock data
            this.displayStock = this.getEnhancedMockStocks(filterData.filters)
          }
        }
      } catch (error) {
        console.error('Error filtering stocks:', error)
        // Enhanced fallback to mock data on error
        this.displayStock = this.getEnhancedMockStocks(filterData.filters)
      }
    },
    getEnhancedMockStocks(filters) {
      // Enhanced mock data based on filters
      const allStocks = [
        { ticker: 'AAPL', name: 'Apple Inc.', price: 150.00, change: '+2.5%', pe: 25.5, marketCap: 2500000000000, sector: 'technology', beta: 1.2, dividendYield: 0.5 },
        { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 2800.00, change: '+1.2%', pe: 22.1, marketCap: 1800000000000, sector: 'technology', beta: 1.1, dividendYield: 0 },
        { ticker: 'MSFT', name: 'Microsoft Corp.', price: 310.00, change: '-0.8%', pe: 28.3, marketCap: 2300000000000, sector: 'technology', beta: 0.9, dividendYield: 0.7 },
        { ticker: 'TSLA', name: 'Tesla Inc.', price: 800.00, change: '+3.2%', pe: 45.2, marketCap: 800000000000, sector: 'consumer_discretionary', beta: 2.1, dividendYield: 0 },
        { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 3300.00, change: '+0.5%', pe: 35.8, marketCap: 1700000000000, sector: 'consumer_discretionary', beta: 1.3, dividendYield: 0 },
        { ticker: 'META', name: 'Meta Platforms Inc.', price: 320.00, change: '+1.8%', pe: 18.5, marketCap: 850000000000, sector: 'technology', beta: 1.4, dividendYield: 0 },
        { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 220.00, change: '+4.2%', pe: 55.2, marketCap: 550000000000, sector: 'technology', beta: 1.8, dividendYield: 0.1 },
        { ticker: 'NFLX', name: 'Netflix Inc.', price: 400.00, change: '-1.1%', pe: 28.9, marketCap: 180000000000, sector: 'consumer_discretionary', beta: 1.2, dividendYield: 0 },
        { ticker: 'JPM', name: 'JPMorgan Chase & Co.', price: 140.00, change: '+0.8%', pe: 12.5, marketCap: 420000000000, sector: 'financials', beta: 1.1, dividendYield: 2.8 },
        { ticker: 'JNJ', name: 'Johnson & Johnson', price: 165.00, change: '+0.3%', pe: 16.2, marketCap: 435000000000, sector: 'healthcare', beta: 0.7, dividendYield: 2.6 },
        { ticker: 'PG', name: 'Procter & Gamble Co.', price: 155.00, change: '+0.1%', pe: 24.8, marketCap: 370000000000, sector: 'consumer_staples', beta: 0.5, dividendYield: 2.4 },
        { ticker: 'KO', name: 'The Coca-Cola Company', price: 58.00, change: '+0.2%', pe: 26.1, marketCap: 250000000000, sector: 'consumer_staples', beta: 0.6, dividendYield: 3.1 }
      ];

      if (!filters) return allStocks;

      return allStocks.filter(stock => {
        // Apply price range filter
        if (filters.priceRange && (stock.price < filters.priceRange[0] || stock.price > filters.priceRange[1])) {
          return false;
        }

        // Apply P/E ratio filter
        if (filters.peRatio && (stock.pe < filters.peRatio[0] || stock.pe > filters.peRatio[1])) {
          return false;
        }

        // Apply sector filter
        if (filters.sector && stock.sector !== filters.sector) {
          return false;
        }

        // Apply market cap filter
        if (filters.marketCap && filters.marketCap.length > 0) {
          const marketCapCategory = this.getMarketCapCategory(stock.marketCap);
          if (!filters.marketCap.includes(marketCapCategory)) {
            return false;
          }
        }

        // Apply beta filter
        if (filters.beta && (stock.beta < filters.beta[0] || stock.beta > filters.beta[1])) {
          return false;
        }

        // Apply dividend yield filter
        if (filters.dividendYield && (stock.dividendYield < filters.dividendYield[0] || stock.dividendYield > filters.dividendYield[1])) {
          return false;
        }

        return true;
      });
    },
    getMarketCapCategory(marketCap) {
      if (marketCap > 200000000000) return 'mega';
      if (marketCap > 10000000000) return 'large';
      if (marketCap > 2000000000) return 'mid';
      if (marketCap > 300000000) return 'small';
      return 'micro';
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
    },
    handleStockBuyRequest(data) {
      console.log('Received stock buy request:', data);
      this.stockSymbol = data.symbol;
      this.quantity = data.quantity;
      this.action = data.action;
      this.previewOrder();
    },
    handleStockSellRequest(data) {
      console.log('Received stock sell request:', data);
      this.stockSymbol = data.symbol;
      this.quantity = data.quantity;
      this.action = 'sell';
      this.previewOrder();
    },
    async previewOrder() {
      try {
        // Get current stock price
        const response = await this.fetchStockPrice(this.stockSymbol);
        this.estimatedPrice = response.price;
        this.showModal = true;
      } catch (error) {
        console.error('Error fetching stock price:', error);
        // Show error notification
      }
    },
    async loadInitialStocks() {
      try {
        // Fetch popular stocks by default
        const response = await api.get('/market/popular-stocks')
        
        if (response.data && response.data.stocks) {
          this.displayStock = response.data.stocks
        } else {
          // Load with default popular stocks if API fails
          this.displayStock = [
            { ticker: 'AAPL', name: 'Apple Inc.', price: 150.00, change: '+2.5%' },
            { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 2800.00, change: '+1.2%' },
            { ticker: 'MSFT', name: 'Microsoft Corp.', price: 310.00, change: '-0.8%' },
            { ticker: 'TSLA', name: 'Tesla Inc.', price: 800.00, change: '+3.2%' },
            { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 3300.00, change: '+0.5%' },
            { ticker: 'META', name: 'Meta Platforms Inc.', price: 320.00, change: '+1.8%' },
            { ticker: 'NVDA', name: 'NVIDIA Corp.', price: 220.00, change: '+4.2%' },
            { ticker: 'NFLX', name: 'Netflix Inc.', price: 400.00, change: '-1.1%' }
          ]
        }
      } catch (error) {
        console.error('Error loading initial stocks:', error)
        // Fallback to mock popular stocks
        this.displayStock = [
          { ticker: 'AAPL', name: 'Apple Inc.', price: 150.00, change: '+2.5%' },
          { ticker: 'GOOGL', name: 'Alphabet Inc.', price: 2800.00, change: '+1.2%' },
          { ticker: 'MSFT', name: 'Microsoft Corp.', price: 310.00, change: '-0.8%' },
          { ticker: 'TSLA', name: 'Tesla Inc.', price: 800.00, change: '+3.2%' },
          { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 3300.00, change: '+0.5%' }
        ]
      }
    },
    handleStockSelection(stock) {
      this.stockSymbol = stock.symbol;
      this.selectedStock = stock.symbol;
      // Optionally update the main chart view
    },
    handleStockSearch(query) {
      // Handle stock search logic if needed
      console.log('Searching for:', query);
    },
  },
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
  background: #000000;
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
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.stock-search-wrapper {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.trade-form h3 {
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-weight: 600;
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
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
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
  background: #000000;
  color: white;
}

.btn-primary:hover {
  background: #333333;
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
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
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
  color: #000000;
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
  border-color: #000000;
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
  background: #000000;
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

.control-btn {
  background: #000000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.trade-btn {
  background: #000000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tutorial-btn {
  background: #000000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}
</style>
