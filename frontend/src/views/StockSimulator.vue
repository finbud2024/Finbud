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
      <stockScreener @applyFilter="stockFilterHandler" />

      <div class="stockDisplayContainer" v-if="count">
        <CompanyCard
          v-for="(item, idx) in displayStock"
          :key="idx"
          :companyName="item.ticker"
          :width="`80%`"
        />
      </div>
    </section>

    <section v-if="activeSection === 'portfolio'" class="portfolio-section">
      <div class="portfolio-container">
        <div class="portfolio-header">
          <h2>Your Investment Portfolio</h2>
          <div class="portfolio-actions">
            <button class="refresh-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path
                  d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                ></path>
              </svg>
              Refresh
            </button>
            <button class="export-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export
            </button>
          </div>
        </div>

        <div class="portfolio-overview">
          <div class="overview-card total">
            <div class="overview-title">Total Portfolio Value</div>
            <div class="overview-value">$24,892.31</div>
            <div class="overview-change positive">+$3,892.31 (18.5%)</div>
          </div>

          <div class="overview-card">
            <div class="overview-title">Stocks</div>
            <div class="overview-value">$16,453.79</div>
            <div class="overview-change positive">+$2,731.42 (19.9%)</div>
          </div>

          <div class="overview-card">
            <div class="overview-title">Cash</div>
            <div class="overview-value">$8,438.52</div>
            <div class="overview-change neutral">+$0.00 (0.0%)</div>
          </div>
        </div>

        <div class="portfolio-content">
          <PortfolioPerformance />
        </div>

        <div class="holdings-section">
          <h3>Your Holdings</h3>
          <div class="holdings-table">
            <table>
              <thead>
                <tr>
                  <th>Stock Ticker</th>
                  <!-- <th>Company Name</th> -->
                  <th>Share Quantity</th>
                  <th>Current Price per Share</th>
                  <th>Total Purchased Value</th>
                  <th>Current Market Value</th>
                  <th>Gain/Loss</th>
                  <th>% Change</th>
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
import QuizRewards from "../components/QuizRewards.vue";
import { showReward } from "../utils/utils";

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
      typingSpeed: 30,
      showChatBubble: true,
      todaysChange: "+$23.45",
      annualReturn: "12.5",
      headerChatbotMessage: "",
      headerPartialMessage: "",
      headerTypingComplete: false,
      headerTypingInterval: null,
      headerBotVisible: true,
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
      portfolioTypingSpeed: 20, // ms per character
      portfolioWordByWordTyping: true,
      portfolioBotHideTimeout: null,
      userHoldings: [],
      loadingHoldings: false,
      holdingsError: null,
    };
  },
  methods: {
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

      // Format the message for better readability
      const lines = [
        `Hey ${userName}, here's my quick take on these stock stats:`,
        `- The Open at $${this.stockData.open} and Prev Close at $${this.stockData.close} show it's starting today just a bit lower than yesterday, pretty stable so far.`,
        `- The 52 Week High of $${this.stockData.high} and Low of $${this.stockData.low} mean it's near the bottom of its yearly range, but still has room to climb.`,
        `- That Market Cap of $${this.stockData.marketCap} is huge, marking it as a major player, way bigger than smaller stocks.`,
      ];

      // Modified typing logic to create "upward" typing effect
      // Start with the last line and work backward to create the upward effect
      let lineIndex = lines.length - 1;
      let linesTyped = [];

      const typeLine = () => {
        if (lineIndex >= 0) {
          // Add the current line to the beginning of our array
          linesTyped.unshift(lines[lineIndex]);

          // Update the partial message with all currently typed lines
          this.headerPartialMessage = linesTyped.join("<br>");

          // Move to the previous line (going upward)
          lineIndex--;

          // Delay before typing the next line
          this.headerTypingInterval = setTimeout(typeLine, 500);
        } else {
          // Typing is complete
          this.headerTypingComplete = true;
          this.headerTypingInterval = null;
        }
      };
      // Start typing
      typeLine();

      // Ensure the bot is visible
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
          let charIndex = 0;

          if (this.typingInterval) {
            clearInterval(this.typingInterval);
          }
          this.typingInterval = setInterval(() => {
            if (charIndex < message.length) {
              this.partialMessage += message.charAt(charIndex);
              charIndex++;
            } else {
              clearInterval(this.typingInterval);
              this.typingInterval = null;
              this.chatbotMessage = message;
              this.typingComplete = true;
            }
          }, this.typingSpeed);
        } catch (error) {
          console.log("Error getting message balance", error);
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
            // No valid price field found or price is NaN
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
        quantity: Math.abs(this.quantity),
        price: this.estimatedPrice,
        userId: this.fixedUserId,
      };

      try {
        await axios.post(
          `${process.env.VUE_APP_DEPLOY_URL}/stock-transactions`,
          transactionData
        );
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
        toast.error("Order submitted unsuccessfully", { autoClose: 1000 });
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
        }, 1000);

        this.scheduleHidePortfolioBot();
      }, 500);
    },

    startPortfolioWordByWordTyping() {
      this.currentPortfolioTypedMessage = "";
      const words = this.portfolioBotMessage.split(" ");
      let wordIndex = 0;

      const typeNextWord = () => {
        if (wordIndex < words.length) {
          this.currentPortfolioTypedMessage += words[wordIndex] + " ";
          wordIndex++;
          const delay = Math.random() * 100 + 50;
          setTimeout(typeNextWord, delay);
        } else {
          this.isPortfolioTyping = false;
        }
      };

      typeNextWord();
    },

    startPortfolioCharacterByCharacterTyping() {
      this.currentPortfolioTypedMessage = "";
      let charIndex = 0;

      const typeNextChar = () => {
        if (charIndex < this.portfolioBotMessage.length) {
          this.currentPortfolioTypedMessage +=
            this.portfolioBotMessage.charAt(charIndex);
          charIndex++;
          setTimeout(typeNextChar, this.portfolioTypingSpeed);
        } else {
          this.isPortfolioTyping = false;
        }
      };

      typeNextChar();
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
        }, 500);
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
          }, 500);
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
              holding.purchasePrice * (1 + (Math.random() * 0.4 - 0.1)), // Temporary: use current price or generate one with random variation
          }));

          this.updateCurrentPrices();
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
      handler(newSection) {
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
          this.showPortfolioMessage = false; // <-- Reset message state
          this.hidingPortfolioMessage = false; // <-- Reset message state
          this.portfolioMessageManuallyToggled = false; // <-- Reset toggle state

          // Force show the bot with a slight delay
          setTimeout(() => {
            console.log("Showing portfolio bot now");
            this.showPortfolioBot = true;
            this.hidingPortfolioBot = false;

            setTimeout(() => {
              this.showPortfolioMessage = true;
              this.hidingPortfolioMessage = false;
              this.isPortfolioTyping = true;

              // Start typing animation
              setTimeout(() => {
                if (this.portfolioWordByWordTyping) {
                  this.startPortfolioWordByWordTyping();
                } else {
                  this.startPortfolioCharacterByCharacterTyping();
                }
              }, 500);
            }, 300);
          }, 500);

          console.log("Fetching user holdings...");
          this.fetchUserHoldings();
        } else if (this.showPortfolioBot) {
          this.hidePortfolioBot();
        }
      },
      immediate: true, // Make it run immediately on component creation
    },
  },
  async mounted() {
    setTimeout(() => {
      this.startHeaderTypingEffect();
    }, 500);

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
      }, 1000);
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

    // If portfolio is the initial section, show the bot after a delay
    if (this.activeSection === "portfolio") {
      setTimeout(() => {
        console.log("Portfolio is initial section, showing bot");
        this.startPortfolioBotAnimation();
      }, 1000);
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
</style>
