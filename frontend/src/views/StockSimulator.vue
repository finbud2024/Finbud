<template>
  <div class="dashboard">
    <!-- Combined header section with both dashboard header and chatbot side by side -->
    <h1>Stock Simulator</h1>
    <nav class="navbar">
      <ul>
        <li
          @click="activeSection = 'investment'"
          :class="{ active: activeSection === 'investment' }"
        >
          Investment
        </li>
        <li
          @click="activeSection = 'portfolio'"
          :class="{ active: activeSection === 'portfolio' }"
        >
          Your Portfolio
        </li>
        <li
          @click="activeSection = 'transactionHistory'"
          :class="{ active: activeSection === 'transactionHistory' }"
        >
          Transaction History
        </li>
        <li
          @click="activeSection = 'filters'"
          :class="{ active: activeSection === 'filters' }"
        >
          Filters
        </li>
        <li
          @click="activeSection = 'quiz'"
          :class="{ active: activeSection === 'quiz' }"
        >
          Quiz
        </li>
        <li
          @click="activeSection = 'predictiveCalc'"
          :class="{ active: activeSection === 'predictiveCalc' }"
        >
          Predictive Calculator
        </li>
      </ul>
    </nav>

    <section v-if="activeSection === 'investment'">
      <div class="header-container">
        <header class="dashboard-header">
          <BannerCardSimulator :stockCode="bannerDisplayStock" />
        </header>

        <!-- Repositioned header chatbot to be beside the dashboard header -->
        <div class="header-chatbot-container">
          <div class="header-finbudBot-container">
            <img
              class="header-finbudBot"
              src="../assets/botrmbg.png"
              alt="Finbud"
              @click="toggleHeaderChatBubble"
            />
          </div>
          <div class="header-chatbot-content">
            <div
              class="header-chat-message"
              v-html="
                formatChatMessage(
                  headerTypingComplete
                    ? headerChatbotMessage
                    : headerPartialMessage
                )
              "
            ></div>
            <span v-if="!headerTypingComplete" class="typing-cursor">|</span>
          </div>
        </div>
      </div>

      <div class="main-content">
        <section class="key-statistics">
          <h3>Key Statistics</h3>
          <div class="stats-grid">
            <div class="stat">
              <span class="label">Open: </span>
              <span class="value">${{ stockData.open }}</span>
            </div>
            <div class="stat">
              <span class="label">Prev Close: </span>
              <span class="value">${{ stockData.close }}</span>
            </div>
            <div class="stat">
              <span class="label">52 Week High: </span>
              <span class="value">${{ stockData.high }}</span>
            </div>
            <div class="stat">
              <span class="label">52 Week Low: </span>
              <span class="value">${{ stockData.low }}</span>
            </div>
            <div class="stat">
              <span class="label">Market Cap: </span>
              <span class="value">${{ stockData.marketCap }}</span>
            </div>
            <div class="stat">
              <span class="label">Volume: </span>
              <span class="value">{{ stockData.volume }} shares</span>
            </div>
          </div>
        </section>

        <section class="actions">
          <h3>Actions</h3>
          <div class="action-form">
            <input
              v-model="stockSymbol"
              type="text"
              placeholder="Enter stock symbol"
            />
            <input v-model="quantity" type="number" placeholder="Quantity" />
            <select v-model="action">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <div class="buttons">
              <button class="clear-btn" @click="clearForm">CLEAR</button>
              <button class="preview-btn" @click="previewOrder">
                Preview Order
              </button>
            </div>
          </div>
        </section>
      </div>

      <div class="account-performance">
        <section class="account-info">
          <div class="account-info-container">
            <div class="account-grid">
              <div class="stat">
                <span class="label">ACCOUNT BALANCE:</span>
                <span class="value">{{ accountBalance }}</span>
              </div>
              <div class="stat">
                <span class="label">CASH BALANCE:</span>
                <span class="value">{{ cash }}</span>
              </div>
              <div class="stat">
                <span class="label">STOCK VALUE:</span>
                <span class="value">{{ stockValue }}</span>
              </div>
              <div class="stat">
                <span class="label">TODAY'S CHANGE:</span>
                <span class="value">{{ todaysChange }}</span>
              </div>
              <div class="stat">
                <span class="label">ANNUAL RETURN:</span>
                <span class="value">{{ annualReturn }}%</span>
              </div>
            </div>
          </div>

          <div class="chat-bot-container">
            <div class="chatbot-content">
              <img
                v-if="showChatBubble"
                class="finbudBot"
                src="../assets/botrmbg.png"
                alt="Finbud"
                @click="toggleChatBubble"
              />
              <div v-if="isThinking" class="thinking-animation">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
              <div
                v-else-if="typingComplete"
                class="chat-message"
                v-html="formatChatMessage(chatbotMessage)"
              ></div>
              <div v-else class="chat-message typing">
                <span v-html="formatChatMessage(partialMessage)"></span>
                <span class="typing-cursor">|</span>
              </div>
            </div>
          </div>
        </section>

        <!-- </div>
          <div class="chat-bot-container">
            <div class="chatbot-content">
              <div v-if="typingComplete" class="chat-message" v-html="formatChatMessage(chatbotMessage)"></div>
              <div v-else class="chat-message typing">
                <span v-html="formatChatMessage(partialMessage)"></span>
                <span class="typing-cursor">|</span>
              </div>
            </div>
            <img v-if="showChatBubble" class="finbudBot" src="../assets/botrmbg.png" alt="Finbud" @click="toggleChatBubble" />
          </div>
        </section> -->

        <PerformanceChart
          :performanceData="performanceData"
          @timeframeChanged="updatePerformanceData"
          class="performance-chart"
        />
      </div>
    </section>

    <section v-if="activeSection === 'transactionHistory'">
      <section class="transaction-history">
        <TransactionHistory :key="transactionKey" />
      </section>
    </section>

    <section v-if="activeSection === 'filters'">
      <div class="stock-screener">
        <h1>Stock Screener</h1>
        <!-- Filters Assistant Bot -->
<div
  class="portfolio-bot-container"
  :class="{
    'bot-visible': showFiltersBot,
    'bot-hidden': hidingFiltersBot,
  }"
>
  <img
    class="bot-image"
    src="@/assets/botrmbg.png"
    alt="Bot"
    @click="toggleFiltersBotMessage"
    :class="{ clickable: showFiltersBot }"
  />
  <div
    class="bot-message"
    :class="{
      'message-visible': showFiltersMessage,
      'message-hidden': hidingFiltersMessage,
    }"
  >
    <div v-if="isFiltersTyping" class="typing-animation">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div
      v-else
      class="typed-message"
      v-html="currentFiltersTypedMessage"
      
    ></div>
  </div>
</div>

        <div class="filter-container">
          <!-- Multi-select for Countries -->
          <div class="filter-group">
  <label for="country">Country:</label>
  <select 
    id="country" 
    v-model="filters.country"
  >
    <option value="">All Countries</option>
    <option v-for="country in countries" :key="country" :value="country">
      {{ country }}
    </option>
  </select>

            <div class="toggle-group">
              <label for="excludeCountries">Exclude Countries</label>
              <input
                type="checkbox"
                id="excludeCountries"
                v-model="filters.excludeCountries"
              />
            </div>
          </div>
          <div class="filter-group">
              <label for="pageSize">Results per Page:</label>
              <select v-model="selectedPageSize" id="pageSize" @change="handlePageSizeChange">
                <option v-for="option in pageSizeOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
            </div>

          <!-- Multi-select for Exchanges -->
          <div class="filter-group">
  <label for="exchange">Exchange:</label>
  <select 
    id="exchange" 
    v-model="filters.exchange"
  >
    <option value="">All Exchanges</option>
    <option v-for="exchange in exchanges" :key="exchange" :value="exchange">
      {{ exchange }}
    </option>
  </select>
</div>


<div class="filter-group">
  <label for="sector">Sector:</label>
  <select 
    id="sector" 
    v-model="filters.sector"
  >
    <option value="">All Sectors</option>
    <option v-for="sector in sectors" :key="sector" :value="sector">
      {{ sector }}
    </option>
  </select>
</div>


          <div class="filter-group">
            <label for="marketCapMoreThan">Market Cap (Greater Than):</label>
            <input 
              type="number" 
              id="marketCapMoreThan" 
              placeholder="e.g. 1000000000" 
              v-model="filters.marketCapMoreThan"
            />
          </div>
          
          <div class="filter-group">
            <label for="priceMoreThan">Price (Greater Than):</label>
            <input 
              type="number" 
              id="priceMoreThan" 
              placeholder="e.g. 10" 
              v-model="filters.priceMoreThan"
            />
          </div>
          
          <div class="filter-group">
            <label for="priceLessThan">Price (Less Than):</label>
            <input 
              type="number" 
              id="priceLessThan" 
              placeholder="e.g. 100" 
              v-model="filters.priceLessThan"
            />
          </div>
          
          <div class="filter-group">
            <label for="dividendMoreThan">Dividend Yield (Greater Than %):</label>
            <input 
              type="number" 
              id="dividendMoreThan" 
              placeholder="e.g. 2" 
              v-model="filters.dividendMoreThan"
            />
          </div>
        </div>
        
        <div class="button-group">
          <button @click="fetchStocks" :disabled="loading" class="search-button">
            {{ loading ? 'Searching...' : 'Search Stocks' }}
          </button>
          <button @click="handleReset" class="reset-button">
            Reset Filters
          </button>
        </div>
        
        <div v-if="stocks.length > 0" class="results-container">
    <h2>Results ({{ stocks.length }} stocks found)</h2>
    <div class="table-container">
      <table>
    <thead>
        <tr>
            <th>Symbol</th>
            <th>Company Name</th>
            <th>Market Cap</th>
            <th>Sector</th>
            <th>Industry</th>
            <th>Price</th>
        </tr>
    </thead>
    <tbody>
      <tr v-for="stock in stocksToDisplay" :key="stock.symbol">
            <td>{{ stock.symbol }}</td>
            <td>{{ stock.companyName }}</td>
            <td>{{ formatMarketCap(stock.marketCap) }}</td>
            <td>{{ stock.sector || 'N/A' }}</td>
            <td>{{ stock.industry || 'N/A' }}</td>
            <td>{{ stock.price || 'N/A' }}</td>
        </tr>
    </tbody>
</table>
<div class="pagination-bar" v-if="stocks.length > selectedPageSize">
  <button @click="goToPrevPage" :disabled="currentPage === 1">← Prev</button>
  <span>Page {{ currentPage }} of {{ totalPages }}</span>
  <button @click="goToNextPage" :disabled="currentPage === totalPages">Next →</button>
</div>
    </div>
</div>
        
        <div v-else-if="!loading" class="no-results">
          <p>Use the filters above to search for stocks</p>
        </div>
      </div>
    </section>

    <section v-if="activeSection === 'portfolio'" class="portfolio-section">
      <div class="portfolio-container">
        <div class="portfolio-header">
          <h2>{{ activeSection === 'portfolio' ? $t('investmentPortfolio') : 'Your Investment Portfolio' }}</h2>
          
          <!-- Add language switcher here -->
          <div class="portfolio-language-switcher">
            <button @click="switchLanguage('en')" :class="{ active: $i18n.locale === 'en' }">
              <img src="@/assets/us.png" alt="English" />
            </button>
            <button @click="switchLanguage('vi')" :class="{ active: $i18n.locale === 'vi' }">
              <img src="@/assets/vn.png" alt="Tiếng Việt" />
            </button>
          </div>
        </div>

        <div class="portfolio-overview">
          <div class="overview-card total">
            <div class="overview-title">{{ $t('totalPortfolioValue') }}</div>
            <div class="overview-value">${{ formatCurrency(accountBalance) }}</div>
          </div>

          <div class="overview-card">
            <div class="overview-title">{{ $t('stocks') }}</div>
            <div class="overview-value">${{ formatCurrency(stockValue) }}</div>
          </div>

          <div class="overview-card">
            <div class="overview-title">{{ $t('cash') }}</div>
            <div class="overview-value">${{ formatCurrency(cash) }}</div>
          </div>
        </div>
        <PortfolioPerformance :language="$i18n.locale"/>
        <div class="holdings-section">
          <h3>{{ $t('yourHoldings') }}</h3>
          <div class="holdings-table">
            <table>
              <thead>
                <tr>
                  <th>{{ $t('stockTicker') }}</th>
                  <!-- <th>Company Name</th> -->
                  <th>{{ $t('shareQuantity') }}</th>
                  <th>{{ $t('currentPricePerShare') }}</th>
                  <th>{{ $t('totalPurchasedValue') }}</th>
                  <th>{{ $t('currentMarketValue') }}</th>
                  <th>{{ $t('gainLoss') }}</th>
                  <th>{{ $t('percentChange') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="loadingHoldings">
                  <td colspan="8" class="loading-message">
                    Loading your holdings...
                  </td>
                </tr>
                <tr v-else-if="holdingsError">
                  <td colspan="8" class="error-message">{{ holdingsError }}</td>
                </tr>
                <tr v-else-if="userHoldings.length === 0">
                  <td colspan="8" class="empty-message">
                    No holdings found. Start investing to build your portfolio.
                  </td>
                </tr>
                <tr v-for="(holding, index) in userHoldings" :key="index">
                  <td class="symbol">{{ holding.symbol }}</td>
                  <!-- <td>{{ holding.name || holding.symbol + ' Inc.' }}</td> -->
                  <td>{{ holding.quantity }}</td>
                  <td>
                    ${{
                      formatNumber(
                        holding.currentPrice || holding.purchasePrice
                      )
                    }}
                  </td>
                  <td>${{ formatNumber(holding.purchasePrice) }}</td>
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

        <!-- Bot Trigger Element for Portfolio Section -->
        <div ref="portfolioBotTrigger" class="chatbot-trigger"></div>

        <!-- Investment Assistant Bot for Portfolio Section -->
        <div
          class="portfolio-bot-container"
          :class="{
            'bot-visible': showPortfolioBot,
            'bot-hidden': hidingPortfolioBot,
          }"
        >
          <img
            class="bot-image"
            src="@/assets/botrmbg.png"
            alt="Bot"
            @click="togglePortfolioBotMessage"
            :class="{ clickable: showPortfolioBot }"
          />
          <div
            class="bot-message"
            :class="{
              'message-visible': showPortfolioMessage,
              'message-hidden': hidingPortfolioMessage,
            }"
          >
            <div v-if="isPortfolioTyping" class="typing-animation">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
            <div
              v-else
              class="typed-message"
              v-html="currentPortfolioTypedMessage"
            ></div>
          </div>
          <div class="bot-controls" v-if="!isPortfolioTyping && showPortfolioMessage">
            <button class="refresh-insights" @click="refreshPortfolioInsights">
              <i class="fas fa-sync-alt"></i> Refresh Insights
            </button>
          </div>
        </div>
      </div>
    </section>

    <PreviewOrderModal
      v-if="showModal"
      :stockSymbol="stockSymbol"
      :quantity="quantity"
      :estimatedPrice="estimatedPrice"
      :remainingBalance="
        calculateRemainingBalance(action, estimatedPrice, quantity)
      "
      @close="showModal = false"
      @clear-order="clearForm"
      @submit-order="submitOrder(action)"
    />

    <QuizRewards v-if="showingReward" :reward-amount="rewardAmount" />

    <section v-if="activeSection === 'predictiveCalc'">
      <div class="predictive-calc">
        <PredicitveCalc />
      </div>
    </section>

    <section v-if="activeSection === 'quiz'" class="quiz-section">
      <div class="quiz-container">
        <h2>Trading Scenarios Quiz</h2>
        <div v-if="currentQuestion">
          <p>{{ currentQuestion.text }}</p>
          <div class="options">
            <button
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              @click="handleQuizOption(option)"
            >
              {{ option.text }}
            </button>
          </div>
        </div>
        <div v-else>
          <p>
            Loading more questions... (Reload if action take more than 1 minute)
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  fetchSimBannerStockData,
  fetchSimBannerStockDatav2,
  fetchSimBannerStockDatav3,
} from "../services/stockServices";
import StockScreener from "../components/StockScreener.vue";
import CompanyCard from "@/components/CompanyCard.vue";
import BannerCardSimulator from "@/components/BannerCardSimulator.vue";
import stockData from "./hardcodeData/StockData.js";
import PreviewOrderModal from "../components/StockSimulatorPage/PreviewOrderModal.vue";
import TransactionHistory from "../components/StockSimulatorPage/TransactionHistory.vue";
import PerformanceChart from "../components/PerformanceChart.vue";
import PredicitveCalc from "../components/StockSimulatorPage/PredicitveCalc.vue";
import PortfolioPerformance from "../components/StockSimulatorPage/PortfolioPerformance.vue";
import { toast } from "vue3-toastify";
import axios from "axios";
import { showReward } from "../utils/utils";
import { gptServices } from "@/services/gptServices";
import QuizRewards from "@/components/QuizRewards.vue";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import ChatBubble from '@/components/ChatBubble.vue'; 


export default {
  name: "StockDashboard",
  components: {
    StockScreener,
    CompanyCard,
    PreviewOrderModal,
    TransactionHistory,
    PerformanceChart,
    BannerCardSimulator,
    QuizRewards,
    PredicitveCalc,
    PortfolioPerformance,
    Multiselect,
    ChatBubble,
  },
  data() {
    return {
      activeSection: "investment",
      bannerDisplayStock: "AAPL",
      displayStock: [],
      count: 1,
      stockSymbol: "",
      quantity: "",
      showModal: false,
      estimatedPrice: 15,
      accountBalance: 0,
      stockValue: 0,
      cash: 0,
      pastBalanceInsight: "",
      transactionKey: 0,
      performanceData: [],
      stockData: {
        open: "",
        close: "",
        high: "",
        low: "",
        marketCap: "",
        volume: "",
      },
      fixedUserId: this.$store.getters["users/userId"] || null,
      action: "buy",
      selectedTimeFrame: "1W",
      chatbotTriggeredByScroll: false,
      chatbotMessage: "",
      partialMessage: "",
      isThinking: true,
      typingComplete: false,
      typingSpeed: 10, // Updated from 30 to 10 (faster)
      showChatBubble: true,
      todaysChange: "+$23.45",
      annualReturn: "12.5",
      headerChatbotMessage: "",
      headerPartialMessage: "",
      headerTypingComplete: false,
      headerTypingInterval: null,
      headerBotVisible: true,
      chatbotTransactionMessage: "",
      showChatTransactionBubble: true,
      showingReward: false,
      rewardAmount: 1,

      // New Portfolio Bot related data
      showPortfolioBot: false,
      hidingPortfolioBot: false,
      showPortfolioMessage: false,
      hidingPortfolioMessage: false,
      isPortfolioTyping: false,
      portfolioMessageManuallyToggled: false,
      currentPortfolioTypedMessage: "",
      portfolioBotObserver: null,
      portfolioBotMessage: `📊 <strong>Portfolio Analysis:</strong><br><br>
Your portfolio is showing impressive performance with a total value of $24,892.31 and overall gain of 18.5%.<br><br>
<strong>Strengths:</strong><br>
✅ Strong tech sector allocation (AAPL, MSFT, GOOGL) driving growth<br>
✅ All positions showing positive returns (17.5%-26.7%)<br>
✅ Healthy cash position of $8,438.52 (33.9% of portfolio)<br><br>
<strong>Suggestions:</strong><br>
1. Consider diversifying beyond tech to reduce sector risk<br>
2. Look into dividend-paying stocks to balance growth<br>
3. Set up regular investment schedule to optimize dollar-cost averaging`,
      portfolioTypingSpeed: 5,
      portfolioWordByWordTyping: true,
      portfolioBotHideTimeout: null,
      userHoldings: [],
      loadingHoldings: false,
      holdingsError: null,
      currentQuestion: null,
      questions: [],
      sectors: [],
      stocks: [],
      loading: false,
      filters: {
        country: [],
        industry: [],
        exchanges: [],
        sector: '',
        marketCapMoreThan: '',
        priceMoreThan: '',
        priceLessThan: '',
        dividendMoreThan: '',
      },
      countries: [
        "US", "VN", "JP", "CN", "UK", "FR", "DE", "CA", "AU", "SG", "KR", 
        "IN", "BR", "IT", "ES", "MX", "NL", "CH", "HK", "SE"
      ],
      exchanges: ["NYSE", "NASDAQ", "AMEX", "TSX", "LSE", "HKEX", "SSE", "ASX"],
      industries: ["Oil, Gas and Consumable Fuels", "Technology", "Healthcare"],
      pageSizeOptions: [25, 50, 100],
      selectedPageSize: 25,
      sectors: [
        "Communication Services",
        "Consumer Discretionary",
        "Consumer Staples",
        "Energy",
        "Financials",
        "Health Care",
        "Industrials",
        "Information Technology",
        "Materials",
        "Real Estate",
        "Utilities"
      ],
      currentPage: 1,
      showFiltersBot: true,
      currentFiltersTypedMessage: "",
      filtersBotMessage: `📌 <strong>Filter Usage Guide:</strong><br>
      • Select your desired <strong>country</strong>, <strong>exchange</strong>, and financial criteria like <strong>Revenue</strong> or <strong>P/E Ratio</strong>.<br>
      • Click <strong>Search Stocks</strong> to filter.<br>
      • Use <strong>Reset</strong> to clear all filters.`,
      isFiltersTyping: true
    };
  },
  
  computed: {
        totalPages() {
          return Math.ceil(this.stocks.length / this.selectedPageSize);
        },
        stocksToDisplay() {
          const start = (this.currentPage - 1) * this.selectedPageSize;
          const end = start + this.selectedPageSize;
          return this.stocks.slice(start, end);
        }
      },

  methods: {
    goToPrevPage() {
    if (this.currentPage > 1) this.currentPage--;
  },
  goToNextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  },
  handlePageSizeChange() {
    this.fetchStocks(); 
  },

async fetchStocks() {
  try {
    const payload = { ...this.filters };

    if (payload.countries && payload.countries.length > 0) {
      payload.country = payload.countries[0];
    }
    delete payload.countries;

    if (payload.exchanges && payload.exchanges.length > 0) {
      payload.exchange = payload.exchanges;
    } else {
      delete payload.exchanges;
    }

    let url = `https://financialmodelingprep.com/api/v3/stock-screener?apikey=jT0palmVejg7FZjX75aZYnQPC0Qackka&pageSize=${this.selectedPageSize}`;

    if (payload.sector) {
      url += `&sector=${payload.sector.replace(/\s+/g, '+')}`;
    }
    if (payload.country) {
      url += `&country=${payload.country}`;
    }
    if (payload.exchange) {
      url += `&exchange=${payload.exchange}`;
    }
    if (payload.marketCapMoreThan) {
      url += `&marketCapMoreThan=${payload.marketCapMoreThan}`;
    }
    if (payload.priceMoreThan) {
      url += `&priceMoreThan=${payload.priceMoreThan}`;
    }
    if (payload.priceLessThan) {
      url += `&priceLessThan=${payload.priceLessThan}`;
    }
    if (payload.dividendMoreThan) {
      url += `&dividendMoreThan=${payload.dividendMoreThan}`;
    }

    const response = await axios.get(url);  

    let stocks = response.data;

    if (this.filters.industries && this.filters.industries.length > 0) {
      stocks = stocks.filter(stock =>
        stock.industry && this.filters.industries.includes(stock.industry)
      );
    }
    this.stocks = stocks;
    this.currentPage = 1;

  } catch (error) {
    console.error("Error fetching stocks:", error.response ? error.response.data : error.message);
  }
},


    handleReset() {
        this.filters = {
            countries: [],
            excludeCountries: false,
            industries: [],
            excludeIndustries: false,
            exchanges: [],
            excludeExchanges: false,
            sector: '',
            marketCapMoreThan: '',
            priceMoreThan: '',
            priceLessThan: '',
            dividendMoreThan: '',
        };
        this.stocks = [];
    },
    formatMarketCap(value) {
        if (!value) return 'N/A';
        if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
        return value.toLocaleString();
    },
    // Add the adjustChartHeight method here
    adjustChartHeight() {
      this.$nextTick(() => {
        const accountInfo = document.querySelector(".account-info");
        const performanceChart = document.querySelector(".performance-chart");

        if (accountInfo && performanceChart) {
          const accountInfoHeight = accountInfo.offsetHeight;
          performanceChart.style.height = `${accountInfoHeight}px`;
        }
      });
    },
    formatChatMessage(message) {
      if (!message) {
        return "";
      }
      const sentences = message
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .split(/(?<=[.!?])\s+/);
      return sentences.map((sentence) => `<div>${sentence}</div>`).join("");
    },
    startHeaderTypingEffect() {
      // Reset typing process
      if (this.headerTypingInterval) {
        clearInterval(this.headerTypingInterval);
      }

      this.headerTypingComplete = false;
      this.headerPartialMessage = "";
      this.headerChatbotMessage = ""; // Reset full message

      const userName = this.$store.getters["users/userDisplayName"] || "there";

      // Store the complete message we want to display
      const fullMessage = `Hey ${userName}, here's my quick take on these stock stats:<br>- The Open at $${this.stockData.open} and Prev Close at $${this.stockData.close} show it's starting today just a tad lower than yesterday—pretty stable so far.<br>- The 52 Week High of $${this.stockData.high} and Low of $${this.stockData.low} mean it's near the bottom of its yearly range, but still has room to climb.<br>- That Market Cap of $${this.stockData.marketCap} is huge, marking it as a major player, way bigger than smaller stocks.`;

      this.headerChatbotMessage = fullMessage; // Store the full message for later

      // Create a more natural typing effect
      const sentences = [
        `Hey ${userName}, here's my quick take on these stock stats:`,
        `- The Open at $${this.stockData.open} and Prev Close at $${this.stockData.close} show it's starting today just a tad lower than yesterday—pretty stable so far.`,
        `- The 52 Week High of $${this.stockData.high} and Low of $${this.stockData.low} mean it's near the bottom of its yearly range, but still has room to climb.`,
        `- That Market Cap of $${this.stockData.marketCap} is huge, marking it as a major player, way bigger than smaller stocks.`,
      ];

      let currentSentenceIndex = 0;
      let currentCharIndex = 0;
      let displayText = "";

      // Enhanced typing function with variable speeds and occasional pauses
      const typeCharacter = () => {
        if (currentSentenceIndex >= sentences.length) {
          // Typing complete
          this.headerTypingComplete = true;
          return;
        }

        const currentSentence = sentences[currentSentenceIndex];

        if (currentCharIndex < currentSentence.length) {
          // Add the next character
          displayText += currentSentence.charAt(currentCharIndex);
          this.headerPartialMessage = displayText;
          currentCharIndex++;

          // Determine the next typing delay
          let nextDelay;

          // Create pauses at punctuation marks for more realistic typing
          const currentChar = currentSentence.charAt(currentCharIndex - 1);
          if ([",", ".", "!", "?", ":"].includes(currentChar)) {
            // Longer pause after punctuation
            nextDelay = Math.random() * 80 + 60;
          } else if (currentChar === " ") {
            // Slight pause between words
            nextDelay = Math.random() * 40 + 10;
          } else {
            // Variable typing speed
            nextDelay = Math.random() * 15 + 8;
          }

          // Occasional "thinking" pause (2% chance)
          if (Math.random() < 0.02) {
            nextDelay += Math.random() * 120 + 80;
          }

          this.headerTypingInterval = setTimeout(typeCharacter, nextDelay);
        } else {
          // Move to next sentence
          if (currentSentenceIndex < sentences.length - 1) {
            displayText += "<br>";
            this.headerPartialMessage = displayText;
            currentSentenceIndex++;
            currentCharIndex = 0;

            // Pause between sentences
            const betweenSentenceDelay = Math.random() * 150 + 100;
            this.headerTypingInterval = setTimeout(
              typeCharacter,
              betweenSentenceDelay
            );
          } else {
            // All sentences complete
            this.headerTypingComplete = true;
          }
        }
      };

      // Start typing with a small initial delay
      this.headerTypingInterval = setTimeout(typeCharacter, 150);

      this.headerBotVisible = true;
    },
    toggleHeaderChatBubble() {
      // Reset and restart the typing effect when bot is clicked
      this.startHeaderTypingEffect();
    },
    async startTypingEffect() {
      this.typingComplete = false;
      this.partialMessage = "";
      this.isThinking = true;
      this.$nextTick(async () => {
        try {
          const message = await this.generateBalanceInsights(); // Ensure this is awaited!

          console.log("Message received:", message); // Debugging
          if (!message || message.trim() === "") {
            console.warn(
              "No valid message received from generateBalanceInsights()"
            );
            this.partialMessage =
              "No insights available. Currently API may have some problem";
            this.isThinking = false;
            return;
          }

          this.isThinking = false;

          // Clear any existing typing interval
          if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
          }

          // Break message into sentences for more natural typing
          const sentences = message.split(/(?<=[.!?])\s+/);
          let currentSentenceIndex = 0;
          let currentCharIndex = 0;

          const typeNextCharacter = () => {
            if (currentSentenceIndex >= sentences.length) {
              // All sentences typed
              this.chatbotMessage = message;
              this.typingComplete = true;
              return;
            }

            const currentSentence = sentences[currentSentenceIndex];

            if (currentCharIndex < currentSentence.length) {
              // Add the next character to the partial message
              this.partialMessage += currentSentence.charAt(currentCharIndex);
              currentCharIndex++;

              // Calculate the delay for the next character
              let nextDelay;

              // Get the character just typed
              const currentChar = currentSentence.charAt(currentCharIndex - 1);

              // Vary typing speed based on punctuation
              if ([".", "!", "?"].includes(currentChar)) {
                // End of sentence
                nextDelay = Math.random() * 120 + 80;
              } else if ([",", ":", ";"].includes(currentChar)) {
                // Mid-sentence break
                nextDelay = Math.random() * 60 + 40;
              } else if (currentChar === " ") {
                // Space between words
                nextDelay = Math.random() * 30 + 15;
              } else {
                // Regular character - variable typing speed
                nextDelay = Math.random() * 15 + 5;
              }

              // Occasional "thinking" pause (1% chance)
              if (Math.random() < 0.01) {
                nextDelay += Math.random() * 150 + 50;
              }

              // Occasionally type faster in bursts (15% chance)
              if (Math.random() < 0.15) {
                nextDelay *= 0.5;
              }

              // Numbers often typed slower as people double-check them
              if (!isNaN(parseInt(currentChar))) {
                nextDelay *= 0.8; // Make numbers faster (was 1.2)
              }

              setTimeout(typeNextCharacter, nextDelay);
            } else {
              // Move to next sentence
              currentSentenceIndex++;
              currentCharIndex = 0;

              // Pause between sentences
              const betweenSentenceDelay = Math.random() * 150 + 100;
              setTimeout(typeNextCharacter, betweenSentenceDelay);
            }
          };

          // Start typing with an initial delay
          setTimeout(typeNextCharacter, 150);
        } catch (error) {
          console.log("Error getting message balance", error);
          this.isThinking = false;
          this.partialMessage = "Unable to retrieve insights at this time.";
          this.typingComplete = true;
        }
      });
    },

    toggleChatBubble() {
      this.chatbotTriggeredByScroll = false;
      this.startTypingEffect();
    },

    async generateBalanceInsights() {
      try {
        const pastResponse = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/all-responses/${this.fixedUserId}`
        );
        this.pastBalanceInsight = pastResponse.data[0].response;
        console.log("past insights", this.pastBalanceInsight);
      } catch (error) {
        console.log("error getting past insights", error);
      }
      const url = "https://openrouter.ai/api/v1/chat/completions";
      try {
        const response = await axios.post(
          url,
          {
            model: "deepseek/deepseek-chat:free",
            messages: [
              {
                role: "system",
                content:
                  "You are financial expert providing comparision to past insights",
              },
              {
                role: "user",
                content: `Compare to past insights:
              - Cash balance: ${this.cash}
              - Account balance: ${this.accountBalance}
              - Stock value: ${this.stockValue}
              - Past insights: ${this.pastBalanceInsight}
              Generate 3 sentences providing comparision. Keep it interesting and concise.
              `,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.VUE_APP_DEEPSEEK_API_KEY}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
        const newResponse = response.data.choices[0].message.content;
        try {
          await axios.post(
            `${process.env.VUE_APP_DEPLOY_URL}/update-response/`,
            {
              userId: this.fixedUserId,
              newMessage: newResponse,
            }
          );
          console.log("Updating response success");
        } catch (error) {
          console.log("error updating response from frontend", error);
        }
        return newResponse;
      } catch (error) {
        console.log("Error giving insights", error);
      }
    },
    async GeneratePortfolioInsights() {
  try {
    // Check if there are any holdings to analyze
    if (!this.userHoldings || this.userHoldings.length === 0) {
      this.portfolioBotMessage = this.$i18n.locale === 'vi' 
        ? "Tôi không thấy cổ phiếu nào trong danh mục đầu tư của bạn. Khi bạn mua cổ phiếu đầu tiên, tôi sẽ cung cấp thông tin chi tiết ở đây!"
        : "I don't see any stocks in your portfolio yet. When you make your first purchase, I'll provide personalized insights here!";
      return this.portfolioBotMessage;
    }
    
    // Set initial loading message
    this.portfolioBotMessage = this.$i18n.locale === 'vi'
      ? "Đang phân tích danh mục đầu tư của bạn..."
      : "Analyzing your portfolio...";
    
    // Format holdings data for the API
    const portfolioData = this.userHoldings.map(holding => ({
      symbol: holding.symbol,
      quantity: holding.quantity,
      purchasePrice: holding.purchasePrice,
      currentPrice: holding.currentPrice,
      percentChange: ((holding.currentPrice - holding.purchasePrice) / holding.purchasePrice * 100).toFixed(2)
    }));
    
    const url = "https://openrouter.ai/api/v1/chat/completions";
    
    // Determine language and set appropriate system message and user prompt
    const isVietnamese = this.$i18n.locale === 'vi';
    
    // Define the correct system message and user prompt based on language
    let systemMessage, userPrompt;
    
    if (isVietnamese) {
      systemMessage = "Bạn là FinBud, một trợ lý đầu tư thân thiện. Hãy phân tích dữ liệu danh mục đầu tư của người dùng và đưa ra những nhận xét cá nhân hóa ngắn gọn. Định dạng phản hồi của bạn bằng Markdown: sử dụng ### cho tiêu đề, **in đậm** để nhấn mạnh, và danh sách đánh số cho các đề xuất. Tập trung vào đa dạng hóa, xu hướng hiệu suất, đánh giá rủi ro và 1-2 đề xuất cải thiện cụ thể. Giữ phân tích của bạn dưới 30 từ và sử dụng giọng điệu hội thoại.";
      userPrompt = `Phân tích danh mục đầu tư của tôi và đưa ra nhận xét: ${JSON.stringify(portfolioData)}`;
    } else {
      systemMessage = "You are FinBud, a friendly investment assistant. Analyze the user's portfolio data and provide concise, personalized insights. Format your response with Markdown: use ### for headings, **bold** for emphasis, and numbered lists for recommendations. Focus on diversification, performance trends, risk assessment, and 1-2 specific improvement suggestions. Keep your analysis under 30 words and use a conversational tone.";
      userPrompt = `Analyze my investment portfolio and provide insights: ${JSON.stringify(portfolioData)}`;
    }
    
    // Make a single API call in the user's language
    const response = await axios.post(
      url,
      {
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VUE_APP_DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        }
      }
    );

    // Process the response
    if (response && response.data && response.data.choices && response.data.choices[0]) {
      const insights = response.data.choices[0].message.content;
      this.portfolioBotMessage = this.formatPortfolioInsights(insights);
      console.log("Portfolio insights generated successfully");
      return this.portfolioBotMessage;
    } else {
      console.error("Invalid API response format:", response);
      throw new Error("Invalid API response format");
    }
  } catch (error) {
    console.log("Error generating portfolio insights:", error);
    
    // Handle rate limit errors or other issues with simple error messages
    this.portfolioBotMessage = this.$i18n.locale === 'vi'
      ? "<h3 class='insight-heading'>Không thể tạo thông tin chi tiết</h3><p class='insight-paragraph'>Tôi đang gặp sự cố khi phân tích danh mục đầu tư của bạn. Điều này có thể do đã đạt đến giới hạn API. Vui lòng thử lại sau.</p>"
      : "<h3 class='insight-heading'>Unable to Generate Insights</h3><p class='insight-paragraph'>I'm having trouble analyzing your portfolio right now. This may be due to API rate limits. Please try again later.</p>";
    
    return this.portfolioBotMessage;
  }
},
    handleScroll() {
      if (this.chatbotTriggeredByScroll) return;

      const chatbotContainer = document.querySelector(".chat-bot-container");
      if (!chatbotContainer) return;

      const rect = chatbotContainer.getBoundingClientRect();
      const isVisible =
        rect.top >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (isVisible) {
        this.startTypingEffect();
        this.chatbotTriggeredByScroll = true;
      }
    },

    setTimeFrame(timeframe) {
      this.selectedTimeFrame = timeframe;
      this.updatePerformanceData(timeframe);
    },
    updatePerformanceData(timeframe) {
      const performanceData = [];
      const startDate = new Date();

      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(startDate.getDate() - i);
        const value = (Math.random() * 50 + 100).toFixed(2);

        performanceData.push({
          date: date.toISOString().split("T")[0],
          value: parseFloat(value),
        });
      }

      this.performanceData = performanceData.reverse();

      // Add height adjustment after updating chart data
      this.$nextTick(() => {
        this.adjustChartHeight();
      });
    },
    async stockFilterHandler(screenerFilter) {
      const appliedFilter = stockData
        .filter(
          (data) =>
            data.eps &&
            data.eps <= screenerFilter.eps[1] &&
            data.eps >= screenerFilter.eps[0]
        )
        .filter(
          (data) =>
            data.pe &&
            data.pe <= screenerFilter.pe[1] &&
            data.pe >= screenerFilter.pe[0]
        )
        .filter(
          (data) =>
            data.pbr &&
            data.pbr <= screenerFilter.pbr[1] &&
            data.pbr >= screenerFilter.pbr[0]
        )
        .filter(
          (data) =>
            data.beta &&
            data.beta <= screenerFilter.beta[1] &&
            data.beta >= screenerFilter.beta[0]
        )
        .filter(
          (data) =>
            data.regularPrice &&
            data.regularPrice <= screenerFilter.regularPrice[1] &&
            data.regularPrice >= screenerFilter.regularPrice[0]
        )
        .filter(
          (data) =>
            data.priceSales &&
            data.priceSales <= screenerFilter.priceSales[1] &&
            data.priceSales >= screenerFilter.priceSales[0]
        );

      this.displayStock = [];
      await new Promise((r) => setTimeout(r, 500));

      if (appliedFilter.length > 10) {
        let temp = appliedFilter.slice().sort(() => 0.5 - Math.random());
        this.displayStock = temp.slice(0, 10);
      } else {
        this.displayStock = appliedFilter;
      }
      this.count++;
    },
    calculateTotal(action, price, quantity) {
      const total = price * quantity;
      const fee = 0.01 * total;
      return action === "buy" ? total + fee : total - fee;
    },
    calculateRemainingBalance(action, price, quantity) {
      const total = this.calculateTotal(action, price, quantity);
      return this.cash - (action === "buy" ? total : -total);
    },
    clearForm() {
      this.stockSymbol = "";
      this.quantity = "";
      this.action = "buy";
    },
    async updateEstimatedPrice(symbol) {
      if (!symbol) return false;

      try {
        const stockData = await fetchSimBannerStockDatav3(symbol);

        if (stockData) {
          let price =
            stockData.regularPrice || stockData.currentPrice || stockData.close;

          if (price && !isNaN(parseFloat(price))) {
            this.estimatedPrice = parseFloat(price);
            return true;
          } else {
            alert(
              `Sorry, we couldn't find valid price data for ${symbol.toUpperCase()}.`
            );
            console.warn(`Invalid price data for ${symbol}:`, price);
            return false;
          }
        } else {
          alert(`Stock symbol ${symbol.toUpperCase()} not found or invalid.`);
          console.error(`No stock data returned for ${symbol}`);
          return false;
        }
      } catch (error) {
        alert(`Stock symbol ${symbol.toUpperCase()} not found or invalid.`);
        console.error(`Error fetching price for ${symbol}:`, error);
        return false;
      }
    },

    async previewOrder() {
      // Validate required fields
      if (!this.stockSymbol) {
        alert("Please enter a stock symbol");
        return;
      }

      if (!this.quantity || this.quantity <= 0) {
        alert("Please enter a valid quantity");
        return;
      }

      try {
        const success = await this.updateEstimatedPrice(this.stockSymbol);
        if (success) {
          this.showModal = true;
        }
      } catch (error) {
        console.error("Error in preview order:", error);
      }
    },

    async submitOrder(action) {
      const transactionData = {
        stockSymbol: this.stockSymbol,
        type: action,
        quantity: Math.abs(parseInt(this.quantity) || 1),
        price: this.estimatedPrice,
        userId: this.fixedUserId,
      };

      console.log("Submitting order with data:", transactionData);

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_DEPLOY_URL}/stock-transactions`,
          transactionData
        );
        console.log("Order response:", response);

        toast.success("Order submitted successfully", { autoClose: 1000 });
        this.showModal = false;
        this.fetchBankingAccountBalance();
        this.fetchTransactions();
        this.transactionKey++;

        // Award 1 FinCoin for executing a trade
        await this.$store.dispatch("finCoin/earnFinCoins", {
          amount: 1,
          source: "trade_execution",
          description: `${action} ${Math.abs(this.quantity)} ${
            this.stockSymbol
          }`,
        });

        // Use the dedicated method for showing reward
        showReward(this, 1, "trade");
      } catch (error) {
        this.showModal = false;
        console.error("Error submitting order:", error);
        console.error("Error details:", error.response?.data);

        // Toast error but don't show it for quiz flow - we handle that in the caller
        if (!this.currentQuestion) {
          toast.error(
            `Order failed: ${error.response?.data || "Unknown error"}`,
            { autoClose: 2000 }
          );
        }

        // Re-throw the error so the caller can handle it specifically for quiz flow
        throw error;
      }
    },
    async fetchBankingAccountBalance() {
      try {
        const userId = this.$store.getters["users/userId"];
        const api = `${process.env.VUE_APP_DEPLOY_URL}/users/${userId}`;
        const response = await axios.get(api);
        const data = response.data;

        this.accountBalance = data.bankingAccountData.accountBalance;
        this.stockValue = data.bankingAccountData.stockValue;
        this.cash = data.bankingAccountData.cash;

        this.startTypingEffect();
      } catch (error) {
        console.error("Error fetching financial data:", error);
        toast.error("Failed to load financial data", { autoClose: 1000 });
      }
    },

    async fetchTransactions() {
      const userId = this.fixedUserId;
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/stock-transactions/u/${userId}`
        );
        this.transactions = response.data;
        this.updatePerformanceData(this.selectedTimeFrame);
      } catch (error) {
        console.error("Error fetching transaction history:", error);
      }
    },
    // Portfolio Bot Methods
    setupPortfolioBotObserver() {
      // Using watcher instead
    },

    startPortfolioBotAnimation() {
      this.showPortfolioBot = true;
      this.hidingPortfolioBot = false;

      setTimeout(() => {
        this.showPortfolioMessage = true;
        this.hidingPortfolioMessage = false;
        this.isPortfolioTyping = true;

        setTimeout(() => {
          if (this.portfolioWordByWordTyping) {
            this.startPortfolioWordByWordTyping();
          } else {
            this.startPortfolioCharacterByCharacterTyping();
          }
        }, 300); // Faster (was 1000)

        this.scheduleHidePortfolioBot();
      }, 200); // Faster (was 500)
    },

    startPortfolioWordByWordTyping() {
      this.currentPortfolioTypedMessage = "";
      const words = this.portfolioBotMessage.split(/\s+/);
      let wordIndex = 0;
      let isBackspacing = false;
      let mistakeWordIndex = -1;

      // Randomly select 1-2 positions where we'll simulate a "mistake"
      const mistakePositions = [];
      if (words.length > 10) {
        // Only add mistakes if the message is long enough
        const numMistakes = Math.floor(Math.random() * 2) + 1; // 1 or 2 mistakes
        for (let i = 0; i < numMistakes; i++) {
          // Avoid first few words and last few words
          const pos = Math.floor(Math.random() * (words.length - 6)) + 3;
          if (!mistakePositions.includes(pos)) {
            mistakePositions.push(pos);
          }
        }
      }

      const typeNextWord = () => {
        // Handle backspacing (simulating error correction)
        if (isBackspacing) {
          // Remove the last character
          this.currentPortfolioTypedMessage =
            this.currentPortfolioTypedMessage.slice(0, -1);

          // If we've backspaced enough characters
          if (
            !this.currentPortfolioTypedMessage.endsWith(
              words[wordIndex - 1] + " "
            )
          ) {
            isBackspacing = false;
            // Short pause after backspacing before starting to type the correct word
            setTimeout(typeNextWord, Math.random() * 100 + 80);
          } else {
            // Continue backspacing
            setTimeout(typeNextWord, Math.random() * 15 + 10);
          }
          return;
        }

        if (wordIndex < words.length) {
          let word = words[wordIndex];
          const nextWord =
            wordIndex + 1 < words.length ? words[wordIndex + 1] : "";

          // Check if we should simulate a typing mistake
          if (mistakePositions.includes(wordIndex) && word.length > 3) {
            // Create a "mistake" version of the word (swap or add a character)
            const mistakeType = Math.random();
            let mistakeWord;

            if (mistakeType < 0.5 && word.length > 3) {
              // Swap two adjacent characters
              const pos = Math.floor(Math.random() * (word.length - 2)) + 1;
              mistakeWord =
                word.substring(0, pos) +
                word.charAt(pos + 1) +
                word.charAt(pos) +
                word.substring(pos + 2);
            } else {
              // Add an extra character
              const pos = Math.floor(Math.random() * word.length);
              const extraChar = "aeiourstln"[Math.floor(Math.random() * 10)];
              mistakeWord =
                word.substring(0, pos) + extraChar + word.substring(pos);
            }

            // Use the mistake word instead
            word = mistakeWord;
            mistakeWordIndex = wordIndex;
          }

          // Add the word to the message
          this.currentPortfolioTypedMessage += word + " ";
          wordIndex++;

          // Determine next delay based on various factors
          let delay;

          // If we just typed a mistake word, we'll need to backspace after a short pause
          if (wordIndex - 1 === mistakeWordIndex) {
            delay = Math.random() * 150 + 150; // Pause before noticing the "mistake"
            isBackspacing = true;
            mistakeWordIndex = -1; // Reset so we don't try to correct it again
          } else {
            // Normal word typing
            // Longer words should take proportionally longer to type
            const baseDelay = Math.random() * 30 + 40;

            // Add pauses at punctuation or line breaks
            const lastChar = word.charAt(word.length - 1);
            if ([".", "!", "?"].includes(lastChar)) {
              // End of sentence pause
              delay = baseDelay + Math.random() * 120 + 80;
            } else if ([",", ":", ";"].includes(lastChar)) {
              // Mid-sentence punctuation pause
              delay = baseDelay + Math.random() * 60 + 50;
            } else if (word.includes("<br>") || word.includes("</")) {
              // Line break or HTML tag pause
              delay = baseDelay + Math.random() * 80 + 60;
            } else if (word.startsWith("<")) {
              // Beginning of HTML tag, type faster
              delay = baseDelay * 0.4;
            } else {
              // Regular word
              delay = baseDelay;
            }

            // Occasional "thinking" pause (2% chance)
            if (
              Math.random() < 0.02 &&
              ![".", ",", ";", ":"].includes(lastChar)
            ) {
              delay += Math.random() * 150 + 80;
            }

            // Type common short words faster
            if (
              [
                "a",
                "an",
                "the",
                "of",
                "to",
                "in",
                "is",
                "and",
                "or",
                "with",
              ].includes(word.toLowerCase())
            ) {
              delay *= 0.6;
            }

            // Handle numbers differently
            if (!isNaN(parseFloat(word))) {
              // Numbers often take longer to type as people check them
              delay *= 1.3;
            }
          }

          setTimeout(typeNextWord, delay);
        } else {
          this.isPortfolioTyping = false;
        }
      };

      // Start typing after a short initial delay
      setTimeout(typeNextWord, 400);
    },

    startFiltersWordByWordTyping() {
      this.currentFiltersTypedMessage = "";
      const words = this.filtersBotMessage.split(/\s+/);
      let index = 0;

      const typeNext = () => {
        if (index < words.length) {
          this.currentFiltersTypedMessage += words[index] + " ";
          index++;
          setTimeout(typeNext, 50);
        } else {
          this.isFiltersTyping = false;
        }
      };

      typeNext();
    },

    startPortfolioCharacterByCharacterTyping() {
      this.currentPortfolioTypedMessage = "";
      let charIndex = 0;

      const typeNextChar = () => {
        if (charIndex < this.portfolioBotMessage.length) {
          this.currentPortfolioTypedMessage +=
            this.portfolioBotMessage.charAt(charIndex);
          charIndex++;

          // Determine the next typing delay based on the current character
          let nextDelay;

          // Current character (the one we just added)
          const currentChar = this.portfolioBotMessage.charAt(charIndex - 1);

          // Create natural pauses at punctuation marks
          if ([".", "!", "?"].includes(currentChar)) {
            // Longer pause after end of sentences
            nextDelay = Math.random() * 100 + 60;
          } else if ([",", ":", ";", "-"].includes(currentChar)) {
            // Medium pause after commas and other mid-sentence punctuation
            nextDelay = Math.random() * 50 + 30;
          } else if (currentChar === " ") {
            // Brief pause between words
            nextDelay = Math.random() * 20 + 10;
          } else if (
            currentChar === "<" &&
            this.portfolioBotMessage.substring(charIndex - 4, charIndex) ===
              "<br>"
          ) {
            // Pause at line breaks
            nextDelay = Math.random() * 80 + 60;
          } else {
            // Variable typing speed for normal characters
            nextDelay = Math.random() * 8 + 4;
          }

          // Occasional "thinking" pause (1% chance)
          if (Math.random() < 0.01) {
            nextDelay += Math.random() * 100 + 50;
          }

          // If typing a number, go a bit faster
          if (!isNaN(parseInt(currentChar))) {
            nextDelay *= 0.6;
          }

          // Bursty typing - occasionally type a few characters very quickly
          if (Math.random() < 0.15) {
            nextDelay *= 0.4;
          }

          setTimeout(typeNextChar, nextDelay);
        } else {
          this.isPortfolioTyping = false;
        }
      };

      // Start with a small initial delay
      setTimeout(typeNextChar, 150);
    },

    scheduleHidePortfolioBot() {
      if (this.portfolioBotHideTimeout) {
        clearTimeout(this.portfolioBotHideTimeout);
      }

      if (!this.portfolioMessageManuallyToggled) {
        this.portfolioBotHideTimeout = setTimeout(() => {
          this.hidePortfolioBot();
        }, 60000);
      }
    },

    hidePortfolioBot() {
      // If manually toggled, only hide the message
      if (this.portfolioMessageManuallyToggled) {
        this.hidingPortfolioMessage = true;
        setTimeout(() => {
          this.showPortfolioMessage = false;
          this.hidingPortfolioMessage = false;
        }, 500);
      } else {
        // Original behavior - hide both bot and message
        this.hidingPortfolioMessage = true;
        setTimeout(() => {
          this.hidingPortfolioBot = true;
          this.showPortfolioMessage = false;

          setTimeout(() => {
            this.showPortfolioBot = false;
            this.hidingPortfolioBot = false;
            this.hidingPortfolioMessage = false;
            // Reset toggle state
            this.portfolioMessageManuallyToggled = false;
          }, 1000);
        }, 500);
      }
    },

    togglePortfolioBotMessage() {
      if (!this.showPortfolioBot) return;

      this.portfolioMessageManuallyToggled = true;

      if (this.portfolioBotHideTimeout) {
        clearTimeout(this.portfolioBotHideTimeout);
        this.portfolioBotHideTimeout = null;
      }

      if (this.showPortfolioMessage) {
        this.hidingPortfolioMessage = true;

        setTimeout(() => {
          this.showPortfolioMessage = false;
          this.hidingPortfolioMessage = false;
        }, 250); // Faster (was 500)
      } else {
        this.hidingPortfolioMessage = false;
        this.showPortfolioMessage = true;

        if (this.currentPortfolioTypedMessage === "") {
          this.isPortfolioTyping = true;

          setTimeout(() => {
            if (this.portfolioWordByWordTyping) {
              this.startPortfolioWordByWordTyping();
            } else {
              this.startPortfolioCharacterByCharacterTyping();
            }
          }, 250); // Faster (was 500)
        } else {
          this.isPortfolioTyping = false;
        }
      }
    },

    async fetchUserHoldings() {
      this.loadingHoldings = true;
      this.holdingsError = null;

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/holdings/${this.fixedUserId}`
        );
        console.log(response.data.stocks);
        if (response.data.stocks) {
          // Map the API response to our UI format
          this.userHoldings = response.data.stocks.map((holding) => ({
            symbol: holding.stockSymbol,
            name: holding.stockSymbol + " Inc.",
            quantity: holding.quantity,
            purchasePrice: holding.purchasePrice,
            currentPrice:
              holding.currentPrice ||
              holding.purchasePrice * (1 + (Math.random() * 0.4 - 0.1)),
          }));

          this.updateCurrentPrices();
          
          // Don't show the bot message yet - GeneratePortfolioInsights will be called separately
        } else {
          this.userHoldings = [];
        }
      } catch (error) {
        console.error("Error fetching holdings:", error);
        this.holdingsError =
          "Could not load your investment holdings. Please try again later.";
      } finally {
        this.loadingHoldings = false;
      }
    },

    async updateCurrentPrices() {
      const symbols = [...new Set(this.userHoldings.map((h) => h.symbol))];
      if (symbols.length === 0) return;

      try {
        for (const symbol of symbols) {
          try {
            const stockData = await fetchSimBannerStockDatav3(symbol);
            if (stockData) {
              const currentPrice =
                stockData.regularPrice ||
                stockData.currentPrice ||
                stockData.close;

              this.userHoldings = this.userHoldings.map((holding) => {
                if (holding.symbol === symbol) {
                  return {
                    ...holding,
                    currentPrice: currentPrice,
                  };
                }
                return holding;
              });
            }
          } catch (err) {
            console.warn(`Could not fetch current price for ${symbol}:`, err);
          }
        }
      } catch (error) {
        console.error("Error updating current prices:", error);
      }
    },

    calculateMarketValue(holding) {
      return holding.quantity * (holding.currentPrice || holding.purchasePrice);
    },

    calculateGainLoss(holding) {
      const currentValue = this.calculateMarketValue(holding);
      const costBasis = holding.purchasePrice;
      return currentValue - costBasis;
    },

    calculatePercentChange(holding) {
      const gainLoss = this.calculateGainLoss(holding);
      const costBasis = holding.quantity * holding.purchasePrice;
      return (gainLoss / costBasis) * 100;
    },

    getGainLossClass(holding) {
      const gainLoss = this.calculateGainLoss(holding);
      return gainLoss > 0 ? "positive" : gainLoss < 0 ? "negative" : "";
    },

    formatNumber(value) {
      if (!value) return "0.00";
      return parseFloat(value).toFixed(2);
    },

    formatGainLoss(value) {
      if (!value) return "+$0.00";
      const prefix = value >= 0 ? "+" : "-";
      return `${prefix}$${Math.abs(value).toFixed(2)}`;
    },

    formatPercentage(value) {
      if (!value) return "0.0%";
      const prefix = value >= 0 ? "+" : "-";
      return `${prefix}${Math.abs(value).toFixed(1)}%`;
    },

    formatCurrency(value) {
      if (!value && value !== 0) return '0.00';
      return parseFloat(value).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },

    async generateTradingQuestions() {
      console.log("Generating trading questions...");
      try {
        // First, ensure we have the latest user data
        await this.fetchBankingAccountBalance();
        await this.fetchUserHoldings();

        // Create a summary of user's financial situation
        const userFinancialSummary = {
          cash: this.cash,
          stockValue: this.stockValue,
          totalBalance: this.accountBalance,
          holdings: this.userHoldings.map((h) => ({
            symbol: h.symbol,
            quantity: h.quantity,
            currentPrice: h.currentPrice,
          })),
        };

        console.log(
          "User financial data for quiz generation:",
          userFinancialSummary
        );

        // Create a prompt that includes the user's financial data
        const response = await gptServices([
          {
            role: "system",
            content:
              "You are a financial assistant generating quiz questions. Use actual S&P 500 company names and tickers in your scenarios.",
          },
          {
            role: "user",
            content: `Generate 5 trading scenarios quiz using REAL S&P 500 companies like Apple (AAPL), Microsoft (MSFT), Amazon (AMZN), Google/Alphabet (GOOGL), Tesla (TSLA), JPMorgan Chase (JPM), etc.

                    USER'S FINANCIAL INFORMATION:
                    Available Cash: $${this.cash.toFixed(2)}
                    Stock Holdings: ${JSON.stringify(
                      this.userHoldings.map(
                        (h) =>
                          `${h.quantity} shares of ${
                            h.symbol
                          } at $${h.currentPrice.toFixed(2)} per share`
                      )
                    )}

                    IMPORTANT GUIDELINES:
                    - For BUY options, suggest amounts the user can afford. The maximum single purchase should be no more than 80% of available cash.
                    - For SELL options, only suggest selling stocks the user actually owns and in quantities they possess.
                    - If the user has no significant stock holdings, focus more on affordable buy scenarios.
                    - Always include at least one "Do Nothing" option in each question.
                    
                    For each question:
                    - Use a real S&P 500 company name and its ticker symbol in the scenario
                    - Reference actual recent or plausible company events (product launches, earnings reports, etc.)
                    - Provide a clear and concise question, along with five answer options
                    - Only one option should be "Do Nothing" or something similar, 2 options are buy and 2 options are sell
                    - The format must be exactly as follows:
                    
                    Question: <question about a specific real S&P 500 company>
                    A. <option1>
                    B. <option2>
                    C. <option3>
                    D. <option4>
                    E. <option5>
                    
                    Important: Always use real company names and tickers - never use placeholders like "Company XYZ".`,
          },
        ]);

        console.log("API Response:", response);

        // Parse the text response
        if (response && typeof response === "string") {
          const questionBlocks = response
            .split(/Question: /)
            .filter((block) => block.trim());
          const parsedQuestions = questionBlocks.map((block) => {
            // Extract the question text (everything before the first option)
            const questionText = block.split(/\nA\./)[0].trim();

            // Extract all options
            const optionsRegex = /([A-E])\. ([^\n]+)/g;
            const options = [];
            let match;
            while ((match = optionsRegex.exec(block)) !== null) {
              const letter = match[1];
              const text = match[2].trim();

              // Determine action and amount based on option text
              let action = "none";
              let amount = 0;

              if (text.toLowerCase().includes("buy")) {
                action = "buy";
                const amountMatch = text.match(/\d+/);
                amount = amountMatch ? parseInt(amountMatch[0]) : 0;
              } else if (text.toLowerCase().includes("sell")) {
                action = "sell";
                const amountMatch = text.match(/\d+/);
                amount = amountMatch ? parseInt(amountMatch[0]) : 0;
              }

              options.push({ text, action, amount });
            }

            return {
              text: questionText,
              options: options,
            };
          });

          this.questions = parsedQuestions;
          console.log("Questions generated:", this.questions);

          if (this.questions.length > 0) {
            this.currentQuestion = this.questions[0];
          } else {
            console.warn("No questions were generated.");
          }
        } else if (response.data && response.data.questions) {
          // Handle case where response is already structured (original code)
          this.questions = response.data.questions.map((question) => ({
            text: question.text,
            options: question.options.map((option) => ({
              text: option.text,
              action: option.action,
              amount: option.amount,
            })),
          }));

          if (this.questions.length > 0) {
            this.currentQuestion = this.questions[0];
          }
        } else {
          console.error("Invalid response structure:", response);
        }
      } catch (error) {
        console.error("Error generating questions:", error);
      }
    },
    async handleQuizOption(option) {
      if (option.action !== "none") {
        try {
          // Extract stock symbol from the question (e.g., "AAPL")
          const symbolMatch = this.currentQuestion.text.match(/\(([A-Z]+)\)/);
          const stockSymbol = symbolMatch ? symbolMatch[1] : "AAPL"; // Default to AAPL if no symbol found

          // Save values to component data
          this.stockSymbol = stockSymbol;
          this.quantity = option.amount || 1; // Ensure quantity is not 0
          this.action = option.action;

          // Fetch the current price for this stock
          const success = await this.updateEstimatedPrice(stockSymbol);

          if (success) {
            // Now try to submit the real order through the API
            try {
              await this.submitOrder(option.action);
              // If successful, the transaction will appear in history automatically
              toast.success(
                `Successfully ${option.action === "buy" ? "bought" : "sold"} ${
                  this.quantity
                } shares of ${stockSymbol}`,
                { autoClose: 2000 }
              );
            } catch (error) {
              console.log("Quiz trade API error:", error);

              // Handle specific error cases with user-friendly messages
              if (error.response?.data?.includes("Insufficient cash")) {
                toast.warning(
                  `You don't have enough cash to buy ${this.quantity} shares of ${stockSymbol}. The quiz will continue.`,
                  { autoClose: 3000 }
                );
              } else if (error.response?.data?.includes("Not enough stock")) {
                toast.warning(
                  `You don't own enough shares of ${stockSymbol} to sell. The quiz will continue.`,
                  { autoClose: 3000 }
                );
              } else {
                toast.warning(
                  `Couldn't execute this trade: ${
                    error.response?.data || error.message
                  }. The quiz will continue.`,
                  { autoClose: 3000 }
                );
              }
            }
          } else {
            console.error("Could not get price for", stockSymbol);
            toast.error(`Could not get current price for ${stockSymbol}`, {
              autoClose: 1000,
            });
          }
        } catch (error) {
          console.error("Error processing quiz option:", error);
        }
      } else {
        // For "do nothing" options, show a message
        toast.info("You chose to take no action for this scenario", {
          autoClose: 1500,
        });
      }

      // Move to next question regardless of outcome
      this.nextQuestion();
    },
    updateBalances(option) {
      if (option.action === "none") return;

      const total = option.amount * this.estimatedPrice;
      if (option.action === "buy") {
        // Simulate purchase
        this.cash -= total;
        this.stockValue += total;
      } else if (option.action === "sell") {
        // Simulate sale
        this.cash += total;
        this.stockValue -= total;
      }

      // Update total balance
      this.accountBalance = this.cash + this.stockValue;
    },
    nextQuestion() {
      const currentIndex = this.questions.indexOf(this.currentQuestion);
      if (currentIndex < this.questions.length - 1) {
        this.currentQuestion = this.questions[currentIndex + 1];
      } else {
        this.currentQuestion = null;
        console.log("No more questions available.");
      }
    },
    async refreshPortfolioInsights() {
      // Show loading state
      this.isPortfolioTyping = true;
      this.currentPortfolioTypedMessage = "";
      this.portfolioBotMessage = "Refreshing your portfolio insights...";
      
      // Wait a moment to show the loading message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate new insights
      await this.GeneratePortfolioInsights();
      
      // Display new insights
      if (this.portfolioWordByWordTyping) {
        this.startPortfolioWordByWordTyping();
      } else {
        this.startPortfolioCharacterByCharacterTyping();
      }
    },
    formatPortfolioInsights(text) {
      if (!text) return '';
      
      // Format headings (### Heading)
      text = text.replace(/### (.*?)(?:\n|$)/g, '<h3 class="insight-heading">$1</h3>');
      
      // Format bold text (**text**)
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="highlight">$1</strong>');
      
      // Format numbered lists (1. Item)
      text = text.replace(/(\d+)\. (.*?)(?:\n|$)/g, '<div class="insight-item"><span class="insight-number">$1.</span> $2</div>');
      
      // Add paragraph styling
      const paragraphs = text.split('\n\n');
      return paragraphs.map(p => {
        if (!p.includes('insight-item') && !p.includes('insight-heading')) {
          return `<p class="insight-paragraph">${p}</p>`;
        }
        return p;
      }).join('');
    },
    switchLanguage(lang) {
 
      if (this.$i18n.locale !== lang) {
     
        this.$i18n.locale = lang;
        
        
        if (this.activeSection === 'portfolio' && this.userHoldings && this.userHoldings.length > 0) {
          
          this.isPortfolioTyping = true;
          this.currentPortfolioTypedMessage = "";
          this.portfolioBotMessage = this.$i18n.locale === 'vi' 
            ? "Đang cập nhật phân tích..."
            : "Updating analysis...";
          
          
          this.currentPortfolioTypedMessage = this.portfolioBotMessage;
          
        
          setTimeout(async () => {
          
            await this.GeneratePortfolioInsights();
            
          
            if (this.portfolioWordByWordTyping) {
              this.startPortfolioWordByWordTyping();
            } else {
              this.startPortfolioCharacterByCharacterTyping();
            }
          }, 500);
        }
      }
    },
    async handleSearch() {
      await this.fetchStocks();
    try {
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/api/screener`, {
            params: this.filters, 
        });
        console.log("API Response:", response.data); 
        this.stocks = response.data; 
    } catch (error) {
        console.error("Error fetching stocks:", error.response ? error.response.data : error.message);
    } finally {
        this.loading = false;
    }
},
    handleReset() {
      this.filters = {
        countries: [],
        excludeCountries: false,
        industries: [],
        excludeIndustries: false,
        exchanges: [],
        excludeExchanges: false,
        sector: '',
        marketCapMoreThan: '',
        priceMoreThan: '',
        priceLessThan: '',
        dividendMoreThan: '',
      };
      this.stocks = [];
    },
    formatMarketCap(value) {
      if (!value) return 'N/A';
      if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
      return value.toLocaleString();
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(newQuery) {
        this.stockSymbol = newQuery.symbol || "";
        this.quantity = newQuery.quantity ? parseInt(newQuery.quantity, 10) : 1;
        this.bannerDisplayStock = newQuery.symbol || "AAPL";
        if (newQuery.action === "sell" || newQuery.action === "buy") {
          this.action = newQuery.action;
        }
      },
    },

    async bannerDisplayStock(newSymbol) {
      const fetchedStock = await fetchSimBannerStockDatav3(newSymbol);
      if (fetchedStock) {
        this.stockData = {
          open: fetchedStock.open,
          close: fetchedStock.close,
          high: fetchedStock.high,
          low: fetchedStock.low,
          marketCap: fetchedStock.marketCap,
          volume: fetchedStock.volume,
        };
        // Start the header typing animation when stock data is updated
        this.startHeaderTypingEffect();
      } else {
        console.error(`Failed to fetch stock data for ${newSymbol}`);
      }
    },
    activeSection: {
      async handler(newSection, oldSection) {
        console.log("Active section changed to:", newSection);

        // Clear any existing timers to prevent conflicts
        if (this.portfolioBotHideTimeout) {
          clearTimeout(this.portfolioBotHideTimeout);
        }

        if (newSection === "portfolio") {
          console.log("Portfolio section activated");

          // Reset bot states to ensure it can appear
          this.showPortfolioBot = false;
          this.hidingPortfolioBot = false;
          this.showPortfolioMessage = false;
          this.hidingPortfolioMessage = false;
          this.portfolioMessageManuallyToggled = false;

          // Fetch holdings first to load data
          await this.fetchUserHoldings();
          
          // Now show the bot (but not the message yet)
          setTimeout(() => {
            console.log("Showing portfolio bot now");
            this.showPortfolioBot = true;
            this.hidingPortfolioBot = false;
            
            // Generate insights and only show message when complete
            this.isPortfolioTyping = true;
            
            // First show the bot with "thinking" animation
            this.showPortfolioMessage = true;
            this.hidingPortfolioMessage = false;
            
            // Now generate insights
            this.GeneratePortfolioInsights().then(() => {
              // After insights are generated, start typing animation
              if (this.portfolioWordByWordTyping) {
                this.startPortfolioWordByWordTyping();
              } else {
                this.startPortfolioCharacterByCharacterTyping();
              }
            });
          }, 500);
        } else if (this.showPortfolioBot) {
          this.hidePortfolioBot();
          
        } else if (newSection === 'quiz') {
          this.generateTradingQuestions();
        }
        else if (newSection === 'filters') {
            this.showFiltersBot = true;
            this.hidingFiltersBot = false;
            this.showFiltersMessage = true;
            this.hidingFiltersMessage = false;
            this.isFiltersTyping = true;

            setTimeout(() => {
              this.startFiltersWordByWordTyping();
            }, 300);
          }


        // Add this to reset language to English when leaving Portfolio section
        if (oldSection === 'portfolio' && newSection !== 'portfolio') {
          this.$i18n.locale = 'en';
        }
      },
      immediate: true,
    },
  },
  async mounted() {
    setTimeout(() => {
      this.startHeaderTypingEffect();
    }, 200); // Faster initial delay (was 500)

    this.startTypingEffect();

    const defaultTicker = this.bannerDisplayStock;
    const fetchedStock = await fetchSimBannerStockDatav3(defaultTicker);
    if (fetchedStock) {
      this.stockData = {
        open: fetchedStock.open,
        close: fetchedStock.close,
        high: fetchedStock.high,
        low: fetchedStock.low,
        marketCap: fetchedStock.marketCap,
        volume: fetchedStock.volume,
      };
    } else {
      console.error(
        `Failed to fetch stock data for default ticker: ${defaultTicker}`
      );
    }

    const shuffledStock = stockData.slice().sort(() => 0.5 - Math.random());
    this.displayStock = shuffledStock.slice(0, 10);

    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get("symbol");
    const quantity = urlParams.get("quantity");
    const action = urlParams.get("action");

    if (symbol) this.stockSymbol = symbol;
    if (quantity) this.quantity = parseInt(quantity, 10);
    if (action === "sell" || action === "buy") {
      this.action = action;
    }
    if (this.stockSymbol && this.quantity) {
      setTimeout(() => {
        const previewButton = document.querySelector(".preview-btn");
        if (previewButton) {
          previewButton.click();
        }
      }, 500); // Faster click (was 1000)
    }
    this.fetchBankingAccountBalance();
    this.fetchTransactions();

    window.addEventListener("scroll", this.handleScroll);

    // Add window resize listener
    window.addEventListener("resize", this.adjustChartHeight);

    // Call adjustChartHeight after everything is loaded
    this.$nextTick(() => {
      this.handleScroll();
      this.adjustChartHeight();
    });
    this.filtersBotMessage = this.$i18n.locale === 'vi'
      ? `📌 <strong>Hướng dẫn sử dụng bộ lọc:</strong><br>
    • Chọn <strong>quốc gia</strong>, <strong>sàn giao dịch</strong>, và các điều kiện như <strong>doanh thu</strong> hoặc <strong>P/E</strong>.<br>
    • Bấm <strong>Tìm kiếm cổ phiếu</strong> để lọc.<br>
    • Dùng <strong>Reset</strong> để xoá điều kiện lọc.`
      : `📌 <strong>Filter Usage Guide:</strong><br>
    • Select your desired <strong>country</strong>, <strong>exchange</strong>, and financial criteria like <strong>Revenue</strong> or <strong>P/E Ratio</strong>.<br>
    • Click <strong>Search Stocks</strong> to filter.<br>
    • Use <strong>Reset</strong> to clear all filters.`;

    // If portfolio is the initial section, show the bot after a delay
    if (this.activeSection === "portfolio") {
      setTimeout(() => {
        console.log("Portfolio is initial section, showing bot");
        this.startPortfolioBotAnimation();
      }, 500); // Faster (was 1000)
    }

    // Ensure the method is called when the component is mounted
    if (this.activeSection === "quiz") {
      this.generateTradingQuestions();
    }
  },
  beforeUnmount() {
    // Clean up all event listeners
    window.removeEventListener("resize", this.adjustChartHeight);
    window.removeEventListener("scroll", this.handleScroll);
    if (this.headerTypingInterval) {
      clearInterval(this.headerTypingInterval);
    }
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }

    // Clean up portfolio bot resources
    if (this.portfolioBotObserver) {
      this.portfolioBotObserver.disconnect();
    }
    if (this.portfolioBotHideTimeout) {
      clearTimeout(this.portfolioBotHideTimeout);
    }
  },
  
};
</script>

<style scoped>
.stockDisplayContainer {
  width: calc(100%- 40px);
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.dashboard {
  color: #333;
}

/* Thinking animation */
.thinking-animation {
  display: flex;
  gap: 4px;
  margin-top: 26px;
  margin-left: 20px;
  padding: 4px;
  background-color: #2196f3;
  width: fit-content;
  border-radius: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.3;
}

.dot:nth-child(1) {
  animation: thinking 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: thinking 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: thinking 1s infinite 0.4s;
}

@keyframes thinking {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* New container to hold both header elements side by side */
.header-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: stretch; /* Changed from flex-start to stretch for equal height */
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  gap: 20px; /* Added gap for consistent spacing */
}

.dashboard-header {
  display: flex;
  flex-direction: column; /* Changed to column for better content alignment */
  justify-content: flex-start;
  align-items: stretch;
  min-height: 120px;
  width: 50%; /* Adjusted for more equal space distribution */
  margin-right: 0; /* Removed margin-right and using gap instead */
  background-color: #f8f9fa; /* Added background to match other containers */
  border-radius: 10px; /* Added border-radius to match other containers */
  padding: 15px; /* Added padding to match other containers */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); /* Added shadow to match */
  border: 1px solid #dee2e6;
  overflow: hidden;
}

/* Add new style to ensure BannerCardSimulator is properly contained */
.dashboard-header :deep(.banner-card) {
  width: 100%;
  height: 100%;
  margin: 0;
}

/* Ensure any direct children of dashboard-header take full width */
.dashboard-header > * {
  width: 100%;
  box-sizing: border-box;
}

/* Updated header chatbot container to be side-by-side with header */
.header-chatbot-container {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  width: 50%; /* Equal width with dashboard-header */
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #dee2e6;
}

.header-chatbot-content {
  display: flex;
  flex-direction: column;
  margin-right: 20px;
  flex-grow: 1;
  position: relative;
}

.header-chat-message {
  background-color: #2196f3;
  color: white;
  border-radius: 15px;
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  font-size: 0.9rem;
  line-height: 1.4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  width: 100%;
  margin-top: 30px;
}

/* Updated FinBudBot styles */
.header-finbudBot-container {
  display: flex;
  align-items: flex-start;
  margin-left: 10px;
}

.header-finbudBot {
  width: 40px;
  height: auto;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.header-finbudBot:hover {
  transform: scale(1.1);
}

.market {
  font-size: 0.8rem;
  color: #00aaff;
}

.stock-prices {
  margin-top: 10px;
  font-size: 1.2rem;
}

.stock-info {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
  font-size: 0.9rem;
}

.main-content {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;
  gap: 20px;
  max-width: 100%;
  box-sizing: border-box;
}

.key-statistics,
.actions {
  width: calc(50% - 10px); /* Adjusted to ensure exact 50% minus half the gap */
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 350px; /* Set fixed height instead of min-height for better alignment */
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
}

.key-statistics h3,
.actions h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #007bff;
  font-size: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px;
  flex-grow: 1;
}

.stat {
  background-color: white;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.stat .label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
}

.stat .value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.action-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  flex-grow: 1;
}

.action-form input,
.action-form select {
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  font-size: 1rem;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.clear-btn,
.preview-btn {
  padding: 12px 20px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #555;
}

.preview-btn {
  background-color: #007bff;
  color: white;
}

.clear-btn:hover {
  background-color: #e9ecef;
}

.preview-btn:hover {
  background-color: #0069d9;
}

.account-performance {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  gap: 20px;
  min-height: 400px;
}

.account-info {
  width: 28%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: fit-content;
}

.account-info-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  min-height: 240px;
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  padding: 5px;
}

.stat {
  background-color: white;
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
}

.stat .label {
  font-size: 0.9rem;
  color: #555;
  font-weight: 600;
  margin-bottom: 5px;
  display: block;
}

.stat .value {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.chat-bot-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  min-height: 200px;
  height: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chatbot-content {
  display: flex;
  flex-direction: column;
}

.chat-message {
  background-color: #2196f3;
  color: white;
  border-radius: 15px;
  padding: 12px 15px;
  border: 1px solid #dee2e6;
  max-width: 85%;
  align-self: flex-start;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-left: 10px;
  margin-top: 30px;
}

.chat-message strong {
  font-weight: 600;
  color: #007bff;
}

.typing-cursor {
  animation: blink 1s infinite;
  font-weight: bold;
  display: inline;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.finbudBot {
  width: 40px;
  aspect-ratio: 1;
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.finbudBot:hover {
  transform: scale(1.1);
}

.performance-chart {
  width: 70%;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  /* Mobile styling for header container */
  .header-container {
    flex-direction: column;
    gap: 15px;
  }

  .dashboard-header,
  .header-chatbot-container {
    width: 100%;
    margin-bottom: 0; /* Removed margin-bottom and using gap instead */
  }

  .main-content {
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .key-statistics,
  .actions {
    width: 100%;
    margin-bottom: 0; /* Using gap instead */
    height: auto; /* Allow height to adjust on mobile */
  }
  .account-performance {
    flex-direction: column;
  }

  .account-info,
  .performance-chart {
    width: 100%;
    height: auto !important; /* Override any JS-set height on mobile */
    min-height: 400px;
  }
}

.new-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 5px;
  border: 1px solid;
}

h1 {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 0px;
}

.navbar {
  display: flex;
  justify-content: center;
  background: white;
  padding: 0px 0;
  border-bottom: 2px solid #ddd;
}
.navbar ul {
  list-style-type: none;
  display: flex;
  gap: 10px;
  background: #f8f9fa;
  padding: 10px;
  border-radius: 15px;
  border: 2px solid #ddd;
}
.navbar li {
  cursor: pointer;
  padding: 15px 50px;
  color: #333;
  transition: background 0.3s, color 0.3s;
  border-radius: 10px;
  font-size: 1.1rem;
}

.navbar li:hover {
  color: #007bff;
  background: #e9f0fc;
}

.navbar li.active {
  font-weight: bold;
  background: #007bff;
  color: white;
}
.content {
  padding: 20px;
}
.portfolio-section {
  padding: 20px;
}

.portfolio-container {
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.portfolio-container h2 {
  color: #007bff;
  margin-top: 0;
  margin-bottom: 20px;
}

.portfolio-content {
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  border: 1px solid #dee2e6;
  min-height: 300px;
}

.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.portfolio-actions {
  display: flex;
  gap: 10px;
}

.refresh-btn,
.export-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.refresh-btn:hover,
.export-btn:hover {
  background-color: #e9ecef;
}

.portfolio-overview {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.quiz-container {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.quiz-container h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 25px;
  text-align: center;
}

.quiz-container p {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  min-height: 100px;
  display: flex;
  align-items: center;
  font-weight: 500;
  text-align: left;
  font-family: sans-serif;
  font-size: 1.2rem;
  color: var(--text-primary); /* Thay #2c3e50 */
}

.options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 20px;
}

.options button {
  background: #f5f7fa;
  border: none;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  color: #333;
  transition: all 0.3s;
  text-align: left;
  min-height: 60px;
}

.options button:hover {
  background: var(--hover-bg);
  transform: translateY(-2px);
}

.options button:active {
  transform: translateY(0);
  color: var(--text-primary);
}

.overview-card {
  flex: 1;
  background-color: white;
  border-radius: 5px;
  padding: 20px;
  border: 1px solid #dee2e6;
  text-align: center;
}

.overview-title {
  font-size: 1rem;
  color: #555;
  margin-bottom: 10px;
}

.overview-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.overview-change {
  font-size: 1rem;
}

.overview-change.positive {
  color: #28a745;
}

.overview-change.negative {
  color: #dc3545;
}

.overview-change.neutral {
  color: #6c757d;
}

.holdings-section {
  margin-top: 20px;
}

.holdings-table {
  overflow-x: auto;
}

.holdings-table table {
  width: 100%;
  border-collapse: collapse;
}

.holdings-table th,
.holdings-table td {
  padding: 12px 15px;
  border: 1px solid #dee2e6;
  text-align: left;
}

.holdings-table th {
  background-color: #f8f9fa;
  color: #333;
}

.holdings-table td {
  background-color: white;
}

.holdings-table .symbol {
  font-weight: bold;
}

.holdings-table .positive {
  color: #28a745;
}

.holdings-table .negative {
  color: #dc3545;
}

/* Bot Chat Styles for Portfolio Section */
.chatbot-trigger {
  position: relative;
  height: 20px;
  opacity: 0;
  pointer-events: none;
}

/* Keep just the left-side positioning styles (around lines 1809-1825) */
.portfolio-bot-container {
  position: fixed;
  left: 20px; /* Change from -350px to visible on page load */
  bottom: 30px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 1000;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.5s ease;
  pointer-events: all;
}

.portfolio-bot-container.bot-visible {
  opacity: 1;
  transform: translateX(0); /* Don't move, just fade in */
}

.portfolio-bot-container.bot-hidden {
  opacity: 0;
  transform: translateX(-50px);
  pointer-events: none;
}

@keyframes botSlideIn {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes botSlideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100px);
    opacity: 0;
  }
}

.bot-image {
  width: 60px;
  height: auto;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.5s ease;
  border-radius: 50%;
}

.bot-visible .bot-image {
  animation: botBounce 1s ease-out;
}

@keyframes botBounce {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  60% {
    transform: translateY(-5px);
  }
  80% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.bot-message {
  margin-top: 10px;
  margin-left: 10px;
  background: #007bff;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 280px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.3s;
  font-size: 0.85rem;
  line-height: 1; 
}

.bot-message.message-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* Typing animation */
.typing-animation {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.3;
}

.dot:nth-child(1) {
  animation: typing 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: typing 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: typing 1s infinite 0.4s;
}

@keyframes typing {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.bot-image.clickable {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.bot-image.clickable:hover {
  transform: scale(1.1);
}

/* Mobile adjustments */
@media screen and (max-width: 768px) {
  .portfolio-bot-container {
    left: -300px;
    bottom: 20px;
  }

  .portfolio-bot-container.bot-visible {
    transform: translateX(310px);
  }

  .portfolio-bot-container.bot-hidden {
    transform: translateX(310px) translateY(50px);
  }
}

.loading-message,
.error-message,
.empty-message {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}

.error-message {
  color: #dc3545;
}

.bot-controls {
  margin-top: 10px;
  text-align: center;
}

.refresh-insights {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s;
}

.refresh-insights:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Add these to your existing styles */

.typed-message {
  line-height: 1.4;
}

.insight-heading {
  margin: 8px 0 4px;
  color: #ffffff;
  font-size: 0.95rem; /* Reduced from 1rem */
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 2px;
}

.insight-item {
  margin: 5px 0;
  padding-left: 18px;
  position: relative;
}

.insight-number {
  position: absolute;
  left: 0;
  font-weight: 600;
}

.highlight {
  color: #ffeb3b;
  font-weight: 600;
}

.insight-paragraph {
  margin: 8px 0;
}

/* Fix v-html styling issue by targeting the container */
.bot-message :deep(.insight-heading),
.bot-message :deep(.insight-item),
.bot-message :deep(.insight-number),
.bot-message :deep(.highlight),
.bot-message :deep(.insight-paragraph) {
  color: inherit;
}

.bot-message :deep(.highlight) {
  color: #ffeb3b;
}

/* Add at the appropriate location in your CSS */
.portfolio-language-switcher {
  display: flex;
  gap: 10px;
}

.portfolio-language-switcher button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.portfolio-language-switcher button img {
  width: 40px;
  height: auto;
  transition: transform 0.2s ease;
  border-radius: 4px;
  border: 2px solid transparent;
}

.portfolio-language-switcher button:hover img {
  transform: scale(1.1);
}

.portfolio-language-switcher button.active img {
  border-color: #007bff;
}

/* Update portfolio header to accommodate language switcher */
.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 24px;
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.filter-group {
  flex: 1 1 220px; 
  min-width: 220px;
}
.filter-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.filter-group input,
.filter-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}

.search-button, .reset-button {
  background-color: #000; 
  color: white; 
  border: none;
  padding: 6px 20px; 
  border-radius: 12px; 
  font-size: 14px; 
  font-weight: 600; 
  line-height: 1; 
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.search-button:hover, .reset-button:hover {
  background-color: #333333; 
}

.results-container {
  margin-top: 20px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tbody tr:hover {
  background-color: #f5f5f5;
}

.no-results {
  text-align: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 8px;
  color: #6c757d;
}

.pagination-bar button {
  padding: 6px 12px;
  border: none;
  background-color: black;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.pagination-bar button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.filters-bot-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 16px 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #ddd;
  max-width: 800px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.bot-image {
  width: 32px;
  height: 32px;
}

.bot-message {
  background-color: black;
  color: white;
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 14px;
  max-width: 350px;
  line-height: 1.4;
}


</style>
