<template>
  <div class="stock-simulator">
    <!-- Header -->
    <header class="simulator-header">
      <h1 class="page-title">
        <font-awesome-icon icon="fa-solid fa-chart-line" />
        {{ $t("stockSimulator.pageTitle") }}
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
            <div class="chart-container" :class="{ 'mobile-chart': isMobile }">
              <!-- Mobile Chart Toggle Button -->
              <button
                v-if="isMobile"
                @click="openMobileChart"
                class="mobile-chart-toggle"
              >
                <font-awesome-icon icon="fa-solid fa-chart-line" />
                <span>{{ $t("stockSimulator.trading.viewChart") }}</span>
                <font-awesome-icon icon="fa-solid fa-external-link-alt" />
              </button>

              <!-- Desktop Chart -->
              <div v-if="!isMobile" class="chart-wrapper">
                <TradingViewChart :symbol="selectedStock" theme="light" />
              </div>

              <!-- Mobile Chart Placeholder -->
              <div v-else class="chart-placeholder">
                <div class="placeholder-content">
                  <font-awesome-icon
                    icon="fa-solid fa-chart-area"
                    class="placeholder-icon"
                  />
                  <h4>{{ selectedStock }} Chart</h4>
                  <p>{{ $t("stockSimulator.trading.tapToViewChart") }}</p>
                </div>
              </div>
            </div>
            <div class="stock-info">
              <BannerCardSimulator :stockCode="selectedStock" />
            </div>
          </div>

          <!-- Trading Panel -->
          <div class="trading-panel">
            <div class="trade-form">
              <h3>{{ $t("stockSimulator.trading.quickTrade") }}</h3>
              <!-- Enhanced Stock Search -->
              <div class="stock-search-wrapper">
                <label class="form-label">{{
                  $t("stockSimulator.trading.stockSymbol")
                }}</label>
                <StockSearchInput
                  v-model="stockSymbol"
                  :placeholder="
                    $t('stockSimulator.trading.stockSymbolPlaceholder')
                  "
                  @stock-selected="handleStockSelection"
                  @search="handleStockSearch"
                />
              </div>
              <input
                v-model="quantity"
                type="number"
                :placeholder="$t('stockSimulator.trading.quantity')"
                class="input"
              />
              <select v-model="action" class="input">
                <option value="buy">
                  {{ $t("stockSimulator.trading.buy") }}
                </option>
                <option value="sell">
                  {{ $t("stockSimulator.trading.sell") }}
                </option>
              </select>
              <div class="form-buttons">
                <button @click="clearForm" class="btn btn-secondary">
                  {{ $t("stockSimulator.trading.clear") }}
                </button>
                <button @click="previewOrder" class="btn btn-primary">
                  {{
                    action === "buy"
                      ? $t("stockSimulator.trading.buy")
                      : $t("stockSimulator.trading.sell")
                  }}
                </button>
              </div>
            </div>

            <!-- Account Summary -->
            <div class="account-summary">
              <h3>{{ $t("stockSimulator.account.summary") }}</h3>
              <div class="summary-grid">
                <div class="stat">
                  <span class="label">{{
                    $t("stockSimulator.account.balance")
                  }}</span>
                  <span class="value">${{ formatNumber(accountBalance) }}</span>
                </div>
                <div class="stat">
                  <span class="label">{{
                    $t("stockSimulator.account.cash")
                  }}</span>
                  <span class="value">${{ formatNumber(cash) }}</span>
                </div>
                <div class="stat">
                  <span class="label">{{
                    $t("stockSimulator.account.stocks")
                  }}</span>
                  <span class="value">${{ formatNumber(stockValue) }}</span>
                </div>
                <div class="stat">
                  <span class="label">{{
                    $t("stockSimulator.account.todayChange")
                  }}</span>
                  <span class="value" :class="getChangeClass(todaysChange)">{{
                    todaysChange
                  }}</span>
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
              <div class="card-title">
                {{ $t("stockSimulator.portfolio.totalPortfolio") }}
              </div>
              <div class="card-value">${{ formatNumber(accountBalance) }}</div>
            </div>
            <div class="overview-card">
              <div class="card-title">
                {{ $t("stockSimulator.account.stocks") }}
              </div>
              <div class="card-value">${{ formatNumber(stockValue) }}</div>
            </div>
            <div class="overview-card">
              <div class="card-title">
                {{ $t("stockSimulator.account.cash") }}
              </div>
              <div class="card-value">${{ formatNumber(cash) }}</div>
            </div>
          </div>
        </div>

        <PortfolioPerformance />

        <div class="holdings-section">
          <h3>{{ $t("stockSimulator.portfolio.holdings") }}</h3>
          <div v-if="loadingHoldings" class="loading">
            {{ $t("stockSimulator.portfolio.loading") }}
          </div>
          <div v-else-if="holdingsError" class="error">{{ holdingsError }}</div>
          <div v-else-if="userHoldings.length === 0" class="empty">
            {{ $t("stockSimulator.portfolio.noHoldings") }}
          </div>
          <div v-else class="holdings-table-container">
            <table class="holdings-table">
              <thead>
                <tr>
                  <th>{{ $t("stockSimulator.portfolio.table.symbol") }}</th>
                  <th>{{ $t("stockSimulator.portfolio.table.shares") }}</th>
                  <th>
                    {{ $t("stockSimulator.portfolio.table.currentPrice") }}
                  </th>
                  <th>
                    {{ $t("stockSimulator.portfolio.table.marketValue") }}
                  </th>
                  <th>{{ $t("stockSimulator.portfolio.table.gainLoss") }}</th>
                  <th>{{ $t("stockSimulator.portfolio.table.change") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="holding in userHoldings" :key="holding.symbol">
                  <td class="symbol">{{ holding.symbol }}</td>
                  <td>{{ holding.quantity }}</td>
                  <td>
                    ${{
                      formatNumber(
                        holding.currentPrice || holding.purchasePrice
                      )
                    }}
                  </td>
                  <td>${{ formatNumber(calculateMarketValue(holding)) }}</td>
                  <td :class="getGainLossClass(holding)">
                    {{ formatGainLoss(calculateGainLoss(holding)) }}
                  </td>
                  <td :class="getGainLossClass(holding)">
                    {{ formatPercentage(calculatePercentChange(holding)) }}
                  </td>
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
          <h2>{{ $t("stockSimulator.quiz.title") }}</h2>
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
          <div v-else class="loading">
            {{ $t("stockSimulator.quiz.loading") }}
          </div>
        </div>
      </section>
    </main>

    <!-- Mobile Chart Modal -->
    <div
      v-if="showMobileChart"
      class="mobile-chart-modal"
      @click="closeMobileChart"
    >
      <div class="mobile-chart-content" @click.stop>
        <div class="mobile-chart-header">
          <h3>{{ selectedStock }} Chart</h3>
          <div class="chart-controls">
            <button @click="toggleOrientation" class="orientation-btn">
              <font-awesome-icon
                :icon="
                  isLandscape
                    ? 'fa-solid fa-mobile-alt'
                    : 'fa-solid fa-tablet-alt'
                "
              />
              <span>{{ isLandscape ? "Portrait" : "Landscape" }}</span>
            </button>
            <button @click="closeMobileChart" class="close-btn">
              <font-awesome-icon icon="fa-solid fa-times" />
            </button>
          </div>
        </div>
        <div
          class="mobile-chart-body"
          :class="{ 'landscape-mode': isLandscape }"
        >
          <TradingViewChart
            :symbol="selectedStock"
            theme="light"
            :key="chartKey"
          />
        </div>
      </div>
    </div>

    <!-- Modals -->
    <PreviewOrderModal
      v-if="showModal"
      :stockSymbol="stockSymbol"
      :quantity="quantity"
      :estimatedPrice="estimatedPrice"
      :remainingBalance="
        calculateRemainingBalance(action, estimatedPrice, quantity)
      "
      :isSubmittingOrder="isSubmittingOrder"
      @close="showModal = false"
      @clear-order="clearForm"
      @submit-order="submitOrder(action)"
    />

    <QuizRewards v-if="showingReward" :reward-amount="rewardAmount" />

    <!-- Smart Assistant -->
    <div class="assistant-container" v-if="showAssistant">
      <div class="assistant-bubble" @click="toggleAssistant">
        <img
          src="@/assets/botrmbg.png"
          alt="Assistant"
          class="assistant-avatar"
        />
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faChartLine,
  faBriefcase,
  faFilter,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import api from "@/utils/api";

// Components
// import StockChart from '@/components/StockChart.vue'
import BannerCardSimulator from "@/components/BannerCardSimulator.vue";
import TransactionHistory from "@/components/FinInvest/StockSimulatorPage/TransactionHistory.vue";
import PerformanceChart from "@/components/PerformanceChart.vue";
import PortfolioPerformance from "@/components/FinInvest/StockSimulatorPage/PortfolioPerformance.vue";
import stockScreener from "@/components/Stock/StockScreener.vue";
import CompanyCard from "@/components/CompanyCard.vue";
import PreviewOrderModal from "@/components/FinInvest/StockSimulatorPage/PreviewOrderModal.vue";
import QuizRewards from "@/components/FinEdu/Quiz/QuizRewards.vue";
import StockSearchInput from "@/components/FinInvest/StockSimulatorPage/StockSearchInput.vue";
import TradingViewChart from "@/components/TradingViewChart.vue";

library.add(faChartLine, faBriefcase, faFilter, faGraduationCap);

export default {
  name: "StockSimulatorPage",
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
    TradingViewChart,
  },
  data() {
    return {
      activeTab: "investment",
      selectedStock: "NASDAQ:AAPL", // Use full TradingView format
      stockSymbol: "",
      quantity: 1,
      action: "buy",
      showModal: false,
      estimatedPrice: 0,
      isSubmittingOrder: false,
      accountBalance: 0,
      cash: 0,
      stockValue: 0,
      todaysChange: "+$0.00",
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
      assistantMessage: "",
      loadingFinancialData: true,
      tabs: [
        {
          key: "investment",
          label: "Investment",
          icon: "fa-solid fa-chart-line",
        },
        { key: "portfolio", label: "Portfolio", icon: "fa-solid fa-briefcase" },
        { key: "filters", label: "Filters", icon: "fa-solid fa-filter" },
        { key: "quiz", label: "Quiz", icon: "fa-solid fa-graduation-cap" },
      ],
      isMobile: false,
      showMobileChart: false,
      isLandscape: true,
      chartKey: 0,
    };
  },
  async mounted() {
    // Fetch financial data from API
    await this.fetchFinancialData();

    // Load initial stock data for filters
    await this.loadInitialStocks();

    // Listen for stock buy and sell requests from chatbot
    if (this.$eventBus) {
      this.$eventBus.$on("stock-buy-request", this.handleStockBuyRequest);
      this.$eventBus.$on("stock-sell-request", this.handleStockSellRequest);
    }
    this.generateAssistantMessage();

    // Check if mobile
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  beforeDestroy() {
    // Clean up event listener
    if (this.$eventBus) {
      this.$eventBus.$off("stock-buy-request", this.handleStockBuyRequest);
      this.$eventBus.$off("stock-sell-request", this.handleStockSellRequest);
    }
    window.removeEventListener("resize", this.checkMobile);
  },
  methods: {
    async fetchFinancialData() {
      try {
        this.loadingFinancialData = true;

        // Ensure user data is loaded
        await this.$store.dispatch("users/fetchCurrentUser");
        const userData = this.$store.getters["users/currentUser"];

        if (!userData) {
          console.error("User data not available");
          return;
        }

        // Fetch user's account balance from API
        const response = await api.get(`/users/${userData._id}`);
        const data = response.data;

        // Update financial data with real values from database
        this.accountBalance = data.bankingAccountData.accountBalance || 0;
        this.stockValue = data.bankingAccountData.stockValue || 0;
        this.cash = data.bankingAccountData.cash || 0;

        // Calculate today's change (you can expand this logic)
        const change = this.accountBalance - (this.stockValue + this.cash);
        this.todaysChange =
          change >= 0
            ? `+$${Math.abs(change).toFixed(2)}`
            : `-$${Math.abs(change).toFixed(2)}`;
      } catch (error) {
        console.error("Error fetching financial data:", error);
        // Keep default values if API fails
        this.accountBalance = 10000;
        this.cash = 5000;
        this.stockValue = 5000;
      } finally {
        this.loadingFinancialData = false;
      }
    },
    formatNumber(value) {
      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0);
    },
    getChangeClass(change) {
      const value = parseFloat(String(change).replace(/[$+,]/g, ""));
      return value >= 0 ? "positive" : "negative";
    },
    clearForm() {
      this.stockSymbol = "";
      this.quantity = 1;
      this.estimatedPrice = 0;
      this.action = "buy";
      this.showModal = false;
    },
    previewOrder() {
      if (!this.stockSymbol || !this.quantity) return;
      this.showModal = true;
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
          userId: this.$store.getters["users/userId"],
        };

        await this.processOrder(order);

        // Close modal and reset form
        this.showModal = false;
        this.clearForm();

        // Show success notification with translation
        this.$notify({
          type: "success",
          title: this.$t("stockSimulator.notifications.orderSuccess"),
          text: this.$t(`stockSimulator.notifications.${action}Success`, {
            quantity: this.quantity,
            symbol: this.stockSymbol,
          }),
        });
      } catch (error) {
        console.error("Error submitting order:", error);
        // Show error notification with translation
        this.$notify({
          type: "error",
          title: this.$t("stockSimulator.notifications.orderError"),
          text: this.$t(
            `stockSimulator.notifications.${error.code || "networkError"}`
          ),
        });
      } finally {
        this.isSubmittingOrder = false;
      }
    },
    async processOrder(order) {
      try {
        // Make API call to process the order
        const response = await api.post("/trading/execute-order", {
          userId: order.userId,
          symbol: order.symbol,
          quantity: order.quantity,
          price: order.price,
          action: order.action,
        });

        if (response.data.success) {
          // Update local financial data
          await this.fetchFinancialData();

          // Refresh transaction history
          this.transactionKey++;

          return response.data;
        } else {
          throw new Error(response.data.message || "Order execution failed");
        }
      } catch (error) {
        console.error("Error processing order:", error);
        throw error;
      }
    },
    async fetchStockPrice(symbol) {
      try {
        const response = await api.get(`/market/stock-price/${symbol}`);
        return {
          price: response.data.price || 100, // fallback price
          symbol: symbol,
        };
      } catch (error) {
        console.error("Error fetching stock price:", error);
        // Return fallback price if API fails
        return {
          price: 100,
          symbol: symbol,
        };
      }
    },
    calculateRemainingBalance(action, price, quantity) {
      const total = price * quantity;
      return action === "buy" ? this.cash - total : this.cash + total;
    },
    async stockFilterHandler(filterData) {
      try {
        // Show loading state
        this.displayStock = [];

        if (filterData.results) {
          // Use results from the new screener
          this.displayStock = filterData.results;
        } else {
          // Fallback API call for backward compatibility
          const response = await api.post("/market/filter-stocks", {
            filters: filterData.filters || filterData,
          });

          if (response.data && response.data.stocks) {
            this.displayStock = response.data.stocks;
          } else {
            // Enhanced fallback with more realistic mock data
            this.displayStock = this.getEnhancedMockStocks(filterData.filters);
          }
        }
      } catch (error) {
        console.error("Error filtering stocks:", error);
        // Enhanced fallback to mock data on error
        this.displayStock = this.getEnhancedMockStocks(filterData.filters);
      }
    },
    getEnhancedMockStocks(filters) {
      // Enhanced mock data based on filters
      const allStocks = [
        {
          ticker: "AAPL",
          name: "Apple Inc.",
          price: 150.0,
          change: "+2.5%",
          pe: 25.5,
          marketCap: 2500000000000,
          sector: "technology",
          beta: 1.2,
          dividendYield: 0.5,
        },
        {
          ticker: "GOOGL",
          name: "Alphabet Inc.",
          price: 2800.0,
          change: "+1.2%",
          pe: 22.1,
          marketCap: 1800000000000,
          sector: "technology",
          beta: 1.1,
          dividendYield: 0,
        },
        {
          ticker: "MSFT",
          name: "Microsoft Corp.",
          price: 310.0,
          change: "-0.8%",
          pe: 28.3,
          marketCap: 2300000000000,
          sector: "technology",
          beta: 0.9,
          dividendYield: 0.7,
        },
        {
          ticker: "TSLA",
          name: "Tesla Inc.",
          price: 800.0,
          change: "+3.2%",
          pe: 45.2,
          marketCap: 800000000000,
          sector: "consumer_discretionary",
          beta: 2.1,
          dividendYield: 0,
        },
        {
          ticker: "AMZN",
          name: "Amazon.com Inc.",
          price: 3300.0,
          change: "+0.5%",
          pe: 35.8,
          marketCap: 1700000000000,
          sector: "consumer_discretionary",
          beta: 1.3,
          dividendYield: 0,
        },
        {
          ticker: "META",
          name: "Meta Platforms Inc.",
          price: 320.0,
          change: "+1.8%",
          pe: 18.5,
          marketCap: 850000000000,
          sector: "technology",
          beta: 1.4,
          dividendYield: 0,
        },
        {
          ticker: "NVDA",
          name: "NVIDIA Corp.",
          price: 220.0,
          change: "+4.2%",
          pe: 55.2,
          marketCap: 550000000000,
          sector: "technology",
          beta: 1.8,
          dividendYield: 0.1,
        },
        {
          ticker: "NFLX",
          name: "Netflix Inc.",
          price: 400.0,
          change: "-1.1%",
          pe: 28.9,
          marketCap: 180000000000,
          sector: "consumer_discretionary",
          beta: 1.2,
          dividendYield: 0,
        },
        {
          ticker: "JPM",
          name: "JPMorgan Chase & Co.",
          price: 140.0,
          change: "+0.8%",
          pe: 12.5,
          marketCap: 420000000000,
          sector: "financials",
          beta: 1.1,
          dividendYield: 2.8,
        },
        {
          ticker: "JNJ",
          name: "Johnson & Johnson",
          price: 165.0,
          change: "+0.3%",
          pe: 16.2,
          marketCap: 435000000000,
          sector: "healthcare",
          beta: 0.7,
          dividendYield: 2.6,
        },
        {
          ticker: "PG",
          name: "Procter & Gamble Co.",
          price: 155.0,
          change: "+0.1%",
          pe: 24.8,
          marketCap: 370000000000,
          sector: "consumer_staples",
          beta: 0.5,
          dividendYield: 2.4,
        },
        {
          ticker: "KO",
          name: "The Coca-Cola Company",
          price: 58.0,
          change: "+0.2%",
          pe: 26.1,
          marketCap: 250000000000,
          sector: "consumer_staples",
          beta: 0.6,
          dividendYield: 3.1,
        },
      ];

      if (!filters) return allStocks;

      return allStocks.filter((stock) => {
        // Apply price range filter
        if (
          filters.priceRange &&
          (stock.price < filters.priceRange[0] ||
            stock.price > filters.priceRange[1])
        ) {
          return false;
        }

        // Apply P/E ratio filter
        if (
          filters.peRatio &&
          (stock.pe < filters.peRatio[0] || stock.pe > filters.peRatio[1])
        ) {
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
        if (
          filters.beta &&
          (stock.beta < filters.beta[0] || stock.beta > filters.beta[1])
        ) {
          return false;
        }

        // Apply dividend yield filter
        if (
          filters.dividendYield &&
          (stock.dividendYield < filters.dividendYield[0] ||
            stock.dividendYield > filters.dividendYield[1])
        ) {
          return false;
        }

        return true;
      });
    },
    getMarketCapCategory(marketCap) {
      if (marketCap > 200000000000) return "mega";
      if (marketCap > 10000000000) return "large";
      if (marketCap > 2000000000) return "mid";
      if (marketCap > 300000000) return "small";
      return "micro";
    },
    updatePerformanceData(timeframe) {
      // Update performance data
    },
    handleQuizOption(option) {
      // Handle quiz option
    },
    toggleAssistant() {
      this.showAssistantMessage = !this.showAssistantMessage;
      if (this.showAssistantMessage && !this.assistantMessage) {
        this.generateAssistantMessage();
      }
    },
    generateAssistantMessage() {
      this.assistantTyping = true;
      setTimeout(() => {
        this.assistantTyping = false;
        this.assistantMessage = `Hi! I'm here to help with your trading. Your portfolio is performing well with a total value of $${this.formatNumber(
          this.accountBalance
        )}. Consider diversifying your holdings for better risk management.`;
      }, 1500);
    },
    calculateMarketValue(holding) {
      return (holding.currentPrice || holding.purchasePrice) * holding.quantity;
    },
    calculateGainLoss(holding) {
      return (
        this.calculateMarketValue(holding) -
        holding.purchasePrice * holding.quantity
      );
    },
    calculatePercentChange(holding) {
      const gainLoss = this.calculateGainLoss(holding);
      const purchaseValue = holding.purchasePrice * holding.quantity;
      return (gainLoss / purchaseValue) * 100;
    },
    getGainLossClass(holding) {
      const gainLoss = this.calculateGainLoss(holding);
      return gainLoss >= 0 ? "positive" : "negative";
    },
    formatGainLoss(value) {
      const sign = value >= 0 ? "+" : "";
      return `${sign}$${this.formatNumber(Math.abs(value))}`;
    },
    formatPercentage(value) {
      const sign = value >= 0 ? "+" : "";
      return `${sign}${value.toFixed(2)}%`;
    },
    handleStockBuyRequest(data) {
      console.log("Received stock buy request:", data);
      this.stockSymbol = data.symbol;
      this.quantity = data.quantity;
      this.action = data.action;
      this.previewOrder();
    },
    handleStockSellRequest(data) {
      console.log("Received stock sell request:", data);
      this.stockSymbol = data.symbol;
      this.quantity = data.quantity;
      this.action = "sell";
      this.previewOrder();
    },
    async previewOrder() {
      try {
        // Get current stock price
        const response = await this.fetchStockPrice(this.stockSymbol);
        this.estimatedPrice = response.price;
        this.showModal = true;
      } catch (error) {
        console.error("Error fetching stock price:", error);
        // Show error notification
      }
    },
    async loadInitialStocks() {
      try {
        // Fetch popular stocks by default
        const response = await api.get("/market/popular-stocks");

        if (response.data && response.data.stocks) {
          this.displayStock = response.data.stocks;
        } else {
          // Load with default popular stocks if API fails
          this.displayStock = [
            {
              ticker: "AAPL",
              name: "Apple Inc.",
              price: 150.0,
              change: "+2.5%",
            },
            {
              ticker: "GOOGL",
              name: "Alphabet Inc.",
              price: 2800.0,
              change: "+1.2%",
            },
            {
              ticker: "MSFT",
              name: "Microsoft Corp.",
              price: 310.0,
              change: "-0.8%",
            },
            {
              ticker: "TSLA",
              name: "Tesla Inc.",
              price: 800.0,
              change: "+3.2%",
            },
            {
              ticker: "AMZN",
              name: "Amazon.com Inc.",
              price: 3300.0,
              change: "+0.5%",
            },
            {
              ticker: "META",
              name: "Meta Platforms Inc.",
              price: 320.0,
              change: "+1.8%",
            },
            {
              ticker: "NVDA",
              name: "NVIDIA Corp.",
              price: 220.0,
              change: "+4.2%",
            },
            {
              ticker: "NFLX",
              name: "Netflix Inc.",
              price: 400.0,
              change: "-1.1%",
            },
          ];
        }
      } catch (error) {
        console.error("Error loading initial stocks:", error);
        // Fallback to mock popular stocks
        this.displayStock = [
          { ticker: "AAPL", name: "Apple Inc.", price: 150.0, change: "+2.5%" },
          {
            ticker: "GOOGL",
            name: "Alphabet Inc.",
            price: 2800.0,
            change: "+1.2%",
          },
          {
            ticker: "MSFT",
            name: "Microsoft Corp.",
            price: 310.0,
            change: "-0.8%",
          },
          { ticker: "TSLA", name: "Tesla Inc.", price: 800.0, change: "+3.2%" },
          {
            ticker: "AMZN",
            name: "Amazon.com Inc.",
            price: 3300.0,
            change: "+0.5%",
          },
        ];
      }
    },
    handleStockSelection(stock) {
      console.log("handleStockSelection called with:", stock); // Debug log
      this.stockSymbol = stock.symbol;
      this.selectedStock = stock.symbol;
      console.log("Updated selectedStock to:", this.selectedStock); // Debug log
      // Optionally update the main chart view
    },
    handleStockSearch(query) {
      // Handle stock search logic if needed
      console.log("Searching for:", query);
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    openMobileChart() {
      this.showMobileChart = true;
    },
    closeMobileChart() {
      this.showMobileChart = false;
    },
    toggleOrientation() {
      this.isLandscape = !this.isLandscape;
      this.chartKey++;
    },
  },
};
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
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
.typing-dots span:nth-child(3) {
  animation-delay: 0s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 1200px) {
  .investment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .simulator-content {
    padding: 0 1rem;
  }

  .investment-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
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
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .tab-nav {
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .tab-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }

  .tab-btn span {
    display: none;
  }

  .tab-btn i {
    font-size: 1.1rem;
  }

  /* Mobile Investment Grid - Single Column */
  .investment-grid {
    display: block; /* Use block for simpler stacking */
  }

  .main-panel,
  .trading-panel {
    width: 100%;
    margin-bottom: 1rem; /* Replaces gap */
  }

  .main-panel {
    display: block;
    order: 0; /* Reset order */
  }

  .trading-panel {
    order: 0; /* Reset order */
  }

  .chart-container,
  .stock-info {
    margin-bottom: 1rem;
  }

  .form-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .overview-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .overview-card {
    padding: 1rem;
  }

  .filtered-results {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .assistant-container {
    bottom: 1rem;
    right: 1rem;
  }

  .assistant-message {
    max-width: calc(100vw - 6rem);
    font-size: 0.875rem;
  }

  .trade-form {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  /* Ensure trading form is accessible on mobile */
  .trade-form h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .input {
    width: 100%;
    margin-bottom: 0.75rem;
    font-size: 16px; /* Prevent iOS zoom */
    min-height: 44px; /* Touch-friendly */
  }

  .btn {
    min-height: 44px;
    width: 100%;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .stock-simulator {
    padding: 0.25rem;
  }

  .simulator-header {
    padding: 0.75rem;
    border-radius: 12px;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .tab-nav {
    overflow-x: auto;
    padding: 0.25rem;
    gap: 0.125rem;
  }

  .tab-btn {
    padding: 0.5rem;
    min-width: 44px;
    white-space: nowrap;
  }

  .chart-container,
  .stock-info,
  .trading-panel,
  .transactions-container,
  .performance-container {
    padding: 0.75rem;
    border-radius: 12px;
  }

  .input {
    padding: 0.625rem;
    font-size: 16px; /* Prevent zoom on iOS */
  }

  .btn {
    padding: 0.75rem;
    font-size: 0.875rem;
  }

  .overview-card {
    padding: 0.75rem;
  }

  .assistant-avatar {
    width: 50px;
    height: 50px;
  }

  .assistant-message {
    max-width: calc(100vw - 4rem);
    padding: 0.75rem;
    font-size: 0.8rem;
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

/* Dark mode */
.dark-mode .stock-simulator {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
}

.dark-mode .simulator-header,
.dark-mode .chart-container,
.dark-mode .stock-info,
.dark-mode .trading-panel,
.dark-mode .transactions-container,
.dark-mode .performance-container {
  background: #2d3748;
  border: 1px solid #4a5568;
}

.dark-mode .page-title {
  color: #e2e8f0;
}

.dark-mode .tab-nav {
  background: #4a5568;
}

.dark-mode .tab-btn {
  color: #a0aec0;
}

.dark-mode .tab-btn:hover {
  background: #718096;
  color: #e2e8f0;
}

.dark-mode .tab-btn.active {
  background: #ffffff;
  color: #000000;
}

/* Enhanced Responsive Design */
@media (max-width: 1400px) {
  .simulator-content {
    max-width: 1200px;
    padding: 0 1.5rem;
  }

  .investment-grid {
    grid-template-columns: 1.8fr 1fr;
    gap: 1.5rem;
  }

  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 1200px) {
  .stock-simulator {
    padding: 0.75rem;
  }

  .simulator-header {
    padding: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .page-title {
    font-size: 1.75rem;
    margin-bottom: 1.25rem;
  }

  .tab-nav {
    gap: 0.375rem;
    padding: 0.375rem;
  }

  .tab-btn {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }

  .investment-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .chart-container,
  .stock-info,
  .trading-panel,
  .transactions-container,
  .performance-container {
    padding: 1.25rem;
  }

  .overview-cards {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filtered-results {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 1024px) {
  .simulator-content {
    padding: 0 1rem;
  }

  .investment-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .overview-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .trade-form {
    padding: 1.5rem;
  }

  .form-buttons {
    gap: 0.5rem;
  }
}

@media (max-width: 968px) {
  .simulator-header {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  .tab-nav {
    justify-content: center;
    gap: 0.25rem;
    padding: 0.25rem;
  }

  .tab-btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
  }

  .main-panel {
    gap: 1.25rem;
  }

  .trading-panel {
    gap: 1.25rem;
  }

  .overview-cards {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }

  .overview-card {
    padding: 1.25rem;
  }

  .card-title {
    font-size: 0.9rem;
  }

  .card-value {
    font-size: 1.5rem;
  }
}

/* Enhanced Mobile Chart and Responsive Design */
.mobile-chart-toggle {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 2px dashed #cbd5e0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
  font-weight: 600;
  margin: 0;
  padding: 1rem;
}

.mobile-chart-toggle:hover {
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  border-color: #a0aec0;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.mobile-chart-toggle svg:first-child {
  font-size: 2rem;
  color: #3182ce;
}

.mobile-chart-toggle svg:last-child {
  font-size: 0.875rem;
  margin-left: 0.5rem;
}

.chart-placeholder {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
}

.placeholder-content {
  text-align: center;
  color: #718096;
}

.placeholder-icon {
  font-size: 3rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.placeholder-content h4 {
  margin: 0.5rem 0;
  color: #4a5568;
  font-weight: 600;
}

.placeholder-content p {
  margin: 0;
  font-size: 0.875rem;
  color: #a0aec0;
}

/* Mobile Chart Modal */
.mobile-chart-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
}

.mobile-chart-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 100%;
  max-height: 90%;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.mobile-chart-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
}

.mobile-chart-header h3 {
  margin: 0;
  color: #2d3748;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.orientation-btn,
.close-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.orientation-btn:hover,
.close-btn:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.close-btn {
  color: #e53e3e;
  border-color: #fed7d7;
}

.close-btn:hover {
  background: #fed7d7;
  border-color: #feb2b2;
}

.mobile-chart-body {
  padding: 1rem;
  height: 400px;
  transition: all 0.3s ease;
}

.mobile-chart-body.landscape-mode {
  height: calc(100vh - 120px);
  width: 100%;
  padding: 0.5rem;
}

/* Landscape mode specific styles */
@media screen and (orientation: landscape) and (max-height: 500px) {
  .mobile-chart-modal {
    padding: 0.25rem;
  }

  .mobile-chart-content {
    max-height: 98%;
    border-radius: 8px;
  }

  .mobile-chart-header {
    padding: 0.5rem 1rem;
  }

  .mobile-chart-header h3 {
    font-size: 1rem;
  }

  .mobile-chart-body {
    height: calc(100vh - 80px);
    padding: 0.25rem;
  }

  .mobile-chart-body.landscape-mode {
    height: calc(100vh - 80px);
  }
}

/* Chart wrapper for proper sizing */
.chart-wrapper {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    height: 350px;
  }
}

@media (max-width: 968px) {
  .chart-container.mobile-chart {
    min-height: 200px;
  }

  .mobile-chart-toggle {
    height: 180px;
  }

  .chart-placeholder {
    height: 180px;
  }

  .mobile-chart-modal {
    padding: 0.5rem;
  }

  .mobile-chart-content {
    max-height: 95%;
    border-radius: 12px;
  }

  .mobile-chart-header {
    padding: 0.75rem 1rem;
  }

  .mobile-chart-header h3 {
    font-size: 1.1rem;
  }

  .orientation-btn,
  .close-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }

  .mobile-chart-body {
    padding: 0.75rem;
    height: 350px;
  }

  .mobile-chart-body.landscape-mode {
    height: 250px;
  }
}

@media (max-width: 768px) {
  .stock-simulator {
    padding: 0.5rem;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  }

  .simulator-header {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 12px;
  }

  .page-title {
    font-size: 1.5rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .page-title svg {
    font-size: 1.5rem;
  }

  .tab-nav {
    gap: 0.25rem;
    padding: 0.25rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .tab-nav::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    min-width: 60px;
    flex-shrink: 0;
  }

  .tab-btn span {
    display: none;
  }

  .tab-btn i {
    font-size: 1.1rem;
  }

  .simulator-content {
    max-width: 100%;
    padding: 0;
  }

  .investment-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .main-panel {
    gap: 1rem;
  }

  .chart-container,
  .stock-info,
  .trading-panel,
  .transactions-container,
  .performance-container {
    padding: 1rem;
    border-radius: 12px;
  }

  /* Mobile chart specific styles */
  .mobile-chart-toggle {
    height: 160px;
    font-size: 0.9rem;
  }

  .chart-placeholder {
    height: 160px;
  }

  .placeholder-icon {
    font-size: 2.5rem;
  }

  .mobile-chart-modal {
    padding: 0.25rem;
  }

  .mobile-chart-header {
    padding: 0.5rem 0.75rem;
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }

  .chart-controls {
    justify-content: center;
    width: 100%;
  }

  .orientation-btn,
  .close-btn {
    flex: 1;
    justify-content: center;
    max-width: 120px;
  }

  .mobile-chart-body {
    padding: 0.5rem;
    height: 300px;
  }

  .mobile-chart-body.landscape-mode {
    height: 220px;
  }
}

.trading-panel {
  gap: 1rem;
}

.trade-form {
  padding: 1rem;
  margin-bottom: 1rem;
}

.trade-form h3 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.stock-search-wrapper {
  margin-bottom: 0.75rem;
}

.form-label {
  font-size: 0.8rem;
  margin-bottom: 0.375rem;
}

.input {
  padding: 0.75rem;
  font-size: 16px; /* Prevent iOS zoom */
  border-radius: 8px;
  min-height: 44px; /* Touch target minimum */
}

.form-buttons {
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn {
  min-height: 44px;
  font-size: 1rem;
  border-radius: 8px;
}

.summary-grid {
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.summary-item {
  padding: 1rem;
  min-height: auto;
}

.summary-label {
  font-size: 0.8rem;
}

.summary-value {
  font-size: 1.25rem;
}

.overview-cards {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.overview-card {
  padding: 1rem;
  min-height: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.overview-card.total {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
}

.card-title {
  font-size: 0.875rem;
  color: inherit;
  margin-bottom: 0.5rem;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: inherit;
}

.filtered-results {
  grid-template-columns: 1fr;
  gap: 1rem;
}

.assistant-container {
  bottom: 1rem;
  right: 1rem;
  z-index: 1000;
}

.assistant-toggle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #000000;
  color: white;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.assistant-toggle:hover {
  transform: scale(1.05);
}

.assistant-message {
  max-width: calc(100vw - 6rem);
  font-size: 0.875rem;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  margin-bottom: 1rem;
  line-height: 1.4;
}

/* Scrollable table for mobile */
.table-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.table-container table {
  min-width: 600px;
}

/* Mobile-friendly chart container */
.chart-container {
  position: relative;
  min-height: 300px;
  overflow: hidden;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;
}

.chart-container.mobile-chart {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border: 2px solid #e2e8f0;
  min-height: 200px;
}

/* Touch-friendly elements */
button,
.btn,
.tab-btn,
.input,
select {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .stock-simulator {
    padding: 0.25rem;
  }

  .simulator-header {
    padding: 0.875rem;
    margin-bottom: 0.875rem;
  }

  .page-title {
    font-size: 1.375rem;
  }

  .tab-btn {
    padding: 0.375rem 0.5rem;
    min-width: 50px;
  }

  .chart-container,
  .stock-info,
  .trading-panel,
  .transactions-container,
  .performance-container {
    padding: 0.875rem;
  }

  .trade-form {
    padding: 0.875rem;
  }

  .trade-form h3 {
    font-size: 1rem;
  }

  .input {
    padding: 0.625rem;
  }

  .btn {
    padding: 0.625rem 1rem;
    font-size: 0.9rem;
  }

  .overview-card {
    padding: 0.875rem;
  }

  .card-value {
    font-size: 1.375rem;
  }

  .assistant-toggle {
    width: 50px;
    height: 50px;
    font-size: 1.125rem;
  }

  .assistant-message {
    font-size: 0.8rem;
    padding: 0.875rem;
  }
}

@media (max-width: 480px) {
  .stock-simulator {
    padding: 0.125rem;
  }

  .simulator-header {
    padding: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .tab-nav {
    padding: 0.125rem;
  }

  .tab-btn {
    padding: 0.25rem 0.375rem;
    min-width: 44px;
  }

  .tab-btn i {
    font-size: 1rem;
  }

  .chart-container,
  .stock-info,
  .trading-panel,
  .transactions-container,
  .performance-container {
    padding: 0.75rem;
  }

  .trade-form {
    padding: 0.75rem;
  }

  .input {
    padding: 0.5rem;
  }

  .btn {
    padding: 0.5rem 0.875rem;
    font-size: 0.875rem;
  }

  .overview-card {
    padding: 0.75rem;
  }

  .card-title {
    font-size: 0.8rem;
  }

  .card-value {
    font-size: 1.25rem;
  }

  .assistant-container {
    bottom: 0.75rem;
    right: 0.75rem;
  }

  .assistant-toggle {
    width: 44px;
    height: 44px;
    font-size: 1rem;
  }

  .assistant-message {
    max-width: calc(100vw - 4rem);
    font-size: 0.75rem;
    padding: 0.75rem;
  }

  .chart-container {
    min-height: 250px;
  }
}

@media (max-width: 320px) {
  .simulator-header {
    padding: 0.5rem;
  }

  .page-title {
    font-size: 1.125rem;
  }

  .tab-btn {
    padding: 0.25rem;
    min-width: 40px;
  }

  .chart-container,
  .stock-info,
  .trading-panel,
  .transactions-container,
  .performance-container {
    padding: 0.5rem;
  }

  .trade-form {
    padding: 0.5rem;
  }

  .trade-form h3 {
    font-size: 0.9rem;
  }

  .input {
    padding: 0.375rem;
    font-size: 16px;
  }

  .btn {
    padding: 0.375rem 0.625rem;
    font-size: 0.8rem;
  }

  .overview-card {
    padding: 0.5rem;
  }

  .card-title {
    font-size: 0.75rem;
  }

  .card-value {
    font-size: 1.125rem;
  }

  .assistant-message {
    max-width: calc(100vw - 3rem);
    font-size: 0.7rem;
    padding: 0.5rem;
  }

  .chart-container {
    min-height: 200px;
  }
}

/* Landscape mobile specific adjustments */
@media (max-height: 500px) and (orientation: landscape) {
  .page-title {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .tab-nav {
    margin-bottom: 0.5rem;
  }

  .chart-container {
    min-height: 200px;
  }

  .assistant-container {
    display: none; /* Hide on landscape mobile to save space */
  }
}

/* High DPI displays */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .page-title svg,
  .tab-btn i {
    transform: translateZ(0); /* Force hardware acceleration */
  }
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .section,
  .tab-btn,
  .btn,
  .assistant-toggle {
    transition: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}

/* Dark mode mobile adjustments */
@media (max-width: 768px) {
  .dark-mode .stock-simulator {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
  }

  .dark-mode .overview-card {
    background: #2d3748;
    color: #e2e8f0;
  }

  .dark-mode .overview-card.total {
    background: linear-gradient(135deg, #ffffff, #f0f0f0);
    color: #000000;
  }

  .dark-mode .assistant-message {
    background: #2d3748;
    color: #e2e8f0;
  }

  .dark-mode .assistant-toggle {
    background: #ffffff;
    color: #000000;
  }
}
</style>
