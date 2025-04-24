<template>
  <div class="GoalDashBoardContainer">
    <!-- Bot Chat Component - Updated with toggle functionality -->
    <div
      class="bot-chat-container"
      :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }"
    >
      <img
        class="bot-image"
        src="@/assets/botrmbg.png"
        alt="Bot"
        @click="toggleBotMessage"
        :class="{ clickable: showBot }"
      />
      <div
        class="bot-message"
        :class="{
          'message-visible': showMessage,
          'message-hidden': hidingMessage,
        }"
      >
        <div v-if="isTyping" class="typing-animation">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div v-else class="typed-message" v-html="typedContent"></div>
      </div>
    </div>

    <div class="leftPanel">
      <div class="leftPanelHeader">
        <img class="profilePic" :src="profilePic" alt="profilePic" />
        <div class="headerText">
          <div class="greeting">
            {{
              ((h) =>
                h < 12
                  ? "Good Morning "
                  : h < 18
                  ? "Good Afternoon "
                  : "Good Evening ")(new Date().getHours())
            }}{{ displayName }}
          </div>
          <div class="slogan">
            {{ $t('dashboardSlogan') }}
          </div>
        </div>
      </div>
      <button 
        v-if="accountNotConnected === true" 
        @click="openPlaidLink" 
        :class="['add-goal-button', disabledConnect ? 'disabled' : null]"
      >
        Connect Your Bank Account
      </button>
      <div class="revenue-expense">
        <div class="total-spend revenue-card">
          <h2>
            {{
              selectedCurrency === "USD"
                ? formatCurrency(totalRevenue)
                : formatCurrency(convertToVND(totalRevenue))
            }}
          </h2>
          <p>Total Income</p>
        </div>

        <div class="total-spend expense-card">
          <h2>-{{
                  selectedCurrency === "USD"
                    ? formatCurrency(totalExpense)
                    : formatCurrency(convertToVND(totalExpense))
                }}</h2>
          <p>{{ $t('totalExpenseLabel') }}</p>
        </div>

        <div class="total-spend">
          <div class="balance-header">
            <h2>
              {{
                selectedCurrency === "USD"
                  ? formatCurrency(accountBalanceTotal)
                  : formatCurrency(convertToVND(accountBalanceTotal))
              }}
            </h2>
            <select
              v-model="selectedCurrency"
              @change="updateCurrency"
              class="selectoutside"
            >
              <option value="USD">USD</option>
              <option value="VND">VND</option>
            </select>
          </div>
          <p>{{ $t('accountBalanceLabel') }}</p>
        </div>
      </div>

      <div v-if="transactions && transactions.length > 0">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
          <label style="font-weight: bold; margin-right: 10px;">Show Forecast</label>
          <input type="checkbox" v-model="showForecast" />
        </div>

        <div class="chart-container">
          <TransactionLine
            :transactions="transactions"
            :showForecast="showForecast"
            :key="`transaction-line-${transactions.length}-${showForecast}`" 
          />
        </div>
      </div>
      <!-- TransactionPie -->
      <div
        class="pie-chart-row"
        v-if="transactions && transactions.length > 0"
      >
        <TransactionPie :transactions="transactions" chartType="Income" />
        <TransactionPie :transactions="transactions" chartType="Expense" />
      </div>
      <div class="chart-container no-data" v-else>
        <div class="no-data-message">
          <p>No transaction data available to display.</p>
        </div>
      </div>
      <section class="transactions">
        <div class="headline-buttons">
          <h2>{{ $t('dailyTransactionsTitle') }}</h2>
          <div class="buttons">
              <button @click="openModal" style="font-weight: bold;">{{ $t('addButton') }}</button>
              <button @click="showResetConfirmationModal = true" style="font-weight: bold;">
                {{ $t('resetButton') }}
              </button>
            </div>
        </div>
        <div class="transaction-box">
          <TransactionModal
            v-if="showModal"
            :transaction="transaction"
            :selectedCurrency="selectedCurrency"
            :recommendations="recommendations"
            :recommendationsVisible="recommendationsVisible"
            :highlightedIndex="highlightedIndex"
            @update:selectedCurrency="selectedCurrency = $event"  
            @close="closeModal"
            @submit="addTransaction"
            @generate-recommendations="generateRecommendations"
            @select-recommendation="selectRecommendation"
            @show-recommendations="showRecommendations"
            @hide-recommendations="hideRecommendations"
          />
        </div>
        <TransactionTable
          :transactions="transactions"
          :selectedCurrency="selectedCurrency"
          @edit="editTransaction"
          @remove="removeTransaction"
        />
      </section>
    </div>

      <div class="rightPanel">
        <section class="financial-goals" ref="financialGoalsSection">
          <div class="goal-upper-part">
            <h3 class="goal-section-title">{{ $t('goalsSectionTitle') }}</h3>
            <button class="add-goal-button" @click="showAddGoalModal = true" style="font-weight: bold;">{{ $t('addGoalButton') }}</button>
            </div>

        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search goals..."
            class="search-input"
          />
        </div>

            <div class="goals">
            <div v-for="goal in filteredGoals" :key="goal._id" class="goal" @click="showGoalProgress(goal)">
                <img src="../assets/financial-goal-mockup.jpg" alt="Goal Image" class="goal-image" />
                <div class="goal-content">
                <div class="goal-icon">
                    <i :class="goal.icon"></i>
                </div>
                <div class="goal-info">
                  <h3>{{ goal.title }}</h3>
                  <p>{{ $t('categoryLabel') }}: {{ goal.category }}</p>
                  <p>{{ $t('totalLabel') }}: {{ goal.targetAmount }} USD</p>
                  <p>{{ $t('savedLabel') }}: {{ goal.currentAmount }} USD</p>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" :style="{ width: (goal.currentAmount / goal.targetAmount * 100) + '%' }"></div>
                </div>
                </div>
            </div>
            </div>


            <div v-if="showAddGoalModal" class="modal" @click="showAddGoalModal = false">
              <div class="modal-content" @click.stop>
                <div class="modal-text-content">
                  <h3>{{ $t('addNewGoalTitle') }}</h3>
                  <div class="form-group">
                    <label for="goalTitle">{{ $t('goalTitleLabel') }}</label>
                    <input id="goalTitle" type="text" :placeholder="$t('goalTitlePlaceholder')" v-model="newGoal.title" required>
                  </div>
                  <div class="form-group">
                    <label for="goalDescription">{{ $t('descriptionLabel') }} ({{ $t('optionalLabel') }})</label>
                    <textarea 
                      id="goalDescription" 
                      :placeholder="$t('descriptionPlaceholder')" 
                      v-model="newGoal.description" 
                      maxlength="500" 
                      @input="updateDescriptionCount"></textarea>
                    <div class="character-counter">{{ descriptionCharCount }} / 500 {{ $t('charactersLabel') }}</div>
                  </div>
                  <div class="form-group">
                    <label for="targetAmount">{{ $t('totalMoneyNeededLabel') }}</label>
                    <div class="currency-input">
                      <input id="targetAmount" type="number" :placeholder="$t('totalMoneyNeededPlaceholder')" v-model="newGoal.targetAmount" required>
                      <select>
                        <option value="USD">USD</option>
                        <option value="VND">VND</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="currentAmount">{{ $t('moneyHaveLabel') }}</label>
                    <input id="currentAmount" type="number" :placeholder="$t('moneyHavePlaceholder')" v-model="newGoal.currentAmount">
                  </div>
                  <div class="form-group">
                    <label for="startDate">{{ $t('startDateLabel') }}</label>
                    <input id="startDate" type="date" v-model="newGoal.startDate" required>
                  </div>
                  <div class="form-group">
                    <label for="endDate">{{ $t('endDateLabel') }}</label>
                    <input id="endDate" type="date" v-model="newGoal.endDate" required>
                  </div>
                  <div class="form-group">
                    <label for="goalCategory">{{ $t('categoryLabel') }}</label>
                    <select id="goalCategory" v-model="selectedCategory">
                      <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                      </option>
                      <option value="new">{{ $t('addNewCategoryOption') }}</option>
                    </select>
                  </div>
                  <div v-if="selectedCategory === 'new'" class="form-group">
                    <label for="newCategory">{{ $t('newCategoryLabel') }}</label>
                    <input id="newCategory" type="text" :placeholder="$t('newCategoryPlaceholder')" v-model="newCategory">
                  </div>
                  <button class="add-goal-button" @click="addGoal">{{ $t('addGoalButton') }}</button>
                </div>
              </div>
            </div>
          </section>
        </div>
        <goalNotiModal
          :isVisible="showNoti"
          :message="notiMessage"
          @close="showNoti = false"
        />
        <!-- Reset Confirmation Modal -->
        <div v-if="showResetConfirmationModal" class="modal">
          <div class="modal-content">
            <h3>{{ $t('resetAccountTitle') }}</h3>
            <p>{{ $t('resetAccountMessage') }}</p>
            <button @click="showResetConfirmationModal = false" style="margin-right: 10px">
              {{ $t('noButton') }}
            </button>
            <button @click="resetAccountBalance">
              {{ $t('yesButton') }}
            </button>
          </div>
        </div>
      </div>
    </template>

<script>
import axios from "axios";
import TransactionLine from "../components/goalPage/TransactionLine.vue";
import TransactionTable from "../components/goalPage/TransactionTable.vue";
import TransactionModal from "../components/goalPage/TransactionModal.vue";
import TransactionPie from "../components/goalPage/TransactionPie.vue";
import { toast } from "vue3-toastify";
import ChatBotTyping from "@/components/quant/ChatBotTyping.vue";
import goalNotiModal from "@/components/Notification/goalNotiModal.vue";
import { messageToOpenAIRole } from "@langchain/openai";
export default {
  name: "GoalPage",
  components: {
    ChatBotTyping,
    TransactionLine,
    TransactionTable,
    TransactionModal,
    TransactionPie
  },
  data() {
    return {
      // Bot Chat data
      showBot: false,
      hidingBot: false,
      showMessage: false,
      hidingMessage: false,
      isTyping: false,
      accountNotConnected: false,
      botMessage: "",
      typedContent: "", // Add this for the typing effect
      botObserver: null,
      botHideTimer: null,
      words: [], // For word-by-word typing
      currentWordIndex: 0,
      typingSpeed: 50, // milliseconds between words
      typingTimer: null,
      messageManuallyToggled: false, // Add this new property to track if the message was manually toggled
      showNoti: false,
      notiMessage: "",
      userId: this.$store.getters["users/userId"],
      firstName:
        this.$store.getters["users/currentUser"]?.identityData?.firstName || "",
      displayName: this.$store.getters["users/userDisplayName"],
      profilePic: this.$store.getters["users/userProfileImage"],
      templateChat: `Hey "Tri"! 😊 Here's a closer look at your spending:

📚 You spent $1,233 on books on 03/23/2333. If it's for learning, great! Otherwise, make sure it aligns with your financial goals.

🛒 You spent $425 on "shopping" across multiple entries on 09/07/2024 and 09/14/2024. Grouping these under one category might help track spending better.

🚗 A -$150 car expense—if it's a refund, labeling it clearly will help with accurate tracking.

Suggestions:

1. Set spending caps for categories like books or shopping.
2. Review high-cost purchases.
3. Use consistent labels for similar expenses.

Keep it chill, "Tri," and let's make smarter financial moves together!`,
      // goal data
      newGoal: {
        title: "",
        description: "",
        targetAmount: "",
        currentAmount: 0,
        startDate: "",
        endDate: "",
        isAchieved: false,
        category: "",
      },
      showModal: false,
      showAddGoalModal: false,
      showAddMoneyForm: false,
      addAmount: 0,
      goalTitle: "",
      goalProgress: 0,
      categories: [
        "Savings",
        "Investment",
        "Entertainment",
        "Education",
        "Emergency Fund",
        "Vehicle",
        "Vacation",
        "Health",
      ],
      selectedCategory: "",
      isAnalyzingCategory: false,
      userModifiedCategory: false,
      aiSuggestionUsed: false,
      debounceTimer: null,
      goals: [],
      selectedCategory: "",
      newCategory: "",
      searchQuery: "",
      descriptionCharCount: 0,
      showModal: false,
      showAddGoalModal: false,
      showEditTransactionModal: false,
      showSetBalanceModal: false,
      showResetConfirmationModal: false,
      goalTitle: "",
      goalProgress: 0,
      transaction: {
        description: "",
        amount: null,
        date: "",
        type: "",
      },
      editTransactionData: {
        _id: null,
        description: "",
        amount: null,
      },
      transactions: [], // Initialize transactions as an empty array
      recommendations: [],
      recommendationsVisible: false,
      highlightedIndex: -1,
      possibleRecommendations: [
        "Groceries",
        "Utilities",
        "Subscription",
        "Transport",
        "Dining",
        "Shopping",
        "Insurance",
        "Entertainment",
        "Healthcare",
        "Education",
        "Coffee",
        "Medical",
        "Rent",
        "Electronics",
        "Gym",
        "Books",
        "Snacks",
        "Meal",
        "Bill",
        "Travel",
      ],
      initialBalance: null,
      accountBalance: 0,
      initialBalanceSet: false, // New state to track if initial balance is set
      showLineChart: true, // New state to toggle between line and bar chart
      selectedCurrency: "USD", // Default currency
      // totalRevenue: 0,
      disabledConnect: false,
      refreshInterval: null,
      serverAccountBalance: null, // Biến lưu giá trị từ server
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },

    // goal computed
    filteredGoals() {
      return this.goals.filter((goal) => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          goal.title.toLowerCase().includes(searchLower) ||
          goal.category.toLowerCase().includes(searchLower)
        );
      });
    },

    totalRevenue() {
      return this.transactions
        .filter((transaction) => (transaction.amount < 0 || transaction.type === "Income")) // Only "Income"
        .reduce((total, transaction) => total + Math.abs(transaction.amount), 0); // Sum amounts
    },
    
    totalExpense() {
      return this.transactions
        .filter((transaction) => !(transaction.amount < 0 || transaction.type === "Income")) // Only "Expense"
        .reduce((total, transaction) => total + transaction.amount, 0); // Sum amounts
    },

    // Sửa cách tính accountBalance để lấy từ trường balance của transaction mới nhất
    accountBalance() {
      return this.totalRevenue - this.totalExpense;
    },
  },
  
  mounted() {
  },

  beforeUnmount() {
    // Clean up timers and observers when the component is destroyed
    this.cleanupResources();
  },
  beforeRouteLeave(to, from, next) {
    // Clean up resources trước khi rời khỏi trang
    this.cleanupResources();
    next();
  },

  async created() {
    // populate the flag as soon as the component mounts
    this.accountNotConnected = await this.fetchAccountStatus();
  },

  methods: {
    async fetchAccountStatus() {
      if (!this.userId) {
        console.error('User ID is not available.');
        return true;            // safest default
      }

      try {
        const { data: user } = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/users/${this.userId}`
        );

        return !user.bank_accounts || user.bank_accounts.length === 0;
      } catch (err) {
        console.error('Error fetching user data:', err);
        return true;            // safest default
      }
    },

    // ... existing methods ...

    // Phương thức mới để dọn dẹp tài nguyên
    cleanupResources() {
      // Hủy các observers và timers
      if (this.botObserver) {
        this.botObserver.disconnect();
        this.botObserver = null;
      }

      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
        this.typingTimer = null;
      }

      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
        this.botHideTimer = null;
      }

      // Hủy refresh interval
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    },

    // ... rest of your methods
    // ... existing code ...
    // Bot Chat methods
    setupBotObserver() {
      this.$nextTick(() => {
        // Create an observer to watch when the user scrolls to the bottom of the page
        this.botObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !this.showBot) {
                this.startBotAnimation();
                // Disconnect the observer after triggering to prevent multiple activations
                this.botObserver.disconnect();
              }
            });
          },
          { threshold: 0.9 }
        ); // Trigger when 50% of the element is visible

        // Observe the ghost div at the end of the page
        if (this.$refs.chatbotTriggerPoint) {
          this.botObserver.observe(this.$refs.chatbotTriggerPoint);
        }
      });
    },

    startBotAnimation() {
      // Reset any existing timers
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
      }

      // Reset states
      this.hidingBot = false;
      this.hidingMessage = false;
      this.typedContent = "";
      this.messageManuallyToggled = false; // Reset the toggle flag

      // First show the bot avatar sliding in
      this.showBot = true;

      // After bot slides in, show typing animation
      setTimeout(() => {
        this.showMessage = true;
        this.isTyping = true;

        // After typing animation, start actual message typing
        setTimeout(() => {
          this.isTyping = false;
          this.botMessage = this.templateChat;
          this.startWordByWordTyping();
        }, 1500);
      }, 800); // Wait for bot slide-in animation to complete
    },

    startWordByWordTyping() {
      // Split the message by spaces and newlines to get words
      // This regex splits by spaces but keeps newlines as separate "words"
      this.words = this.botMessage
        .split(/( |\n)/g)
        .filter((word) => word !== "");
      this.currentWordIndex = 0;
      this.typedContent = "";
      this.typeNextWord();
    },

    typeNextWord() {
      if (this.currentWordIndex < this.words.length) {
        const word = this.words[this.currentWordIndex];

        // Add the word to the content
        if (word === "\n") {
          this.typedContent += "<br>";
        } else {
          this.typedContent += word;
        }

        this.currentWordIndex++;

        // Schedule the next word with a delay
        this.typingTimer = setTimeout(() => {
          this.typeNextWord();
        }, this.typingSpeed * (word.length / 2 + 1)); // Delay proportional to word length
      } else {
        // Typing complete, schedule the hide after 1 minute
        this.scheduleHideBot();
      }
    },

    scheduleHideBot() {
      // Only schedule auto-hiding if the message wasn't manually toggled
      if (!this.messageManuallyToggled) {
        this.botHideTimer = setTimeout(() => {
          this.hideBot();
        }, 60000);
      }
    },

    hideBot() {
      // If manually toggled, only hide the message
      if (this.messageManuallyToggled) {
        this.hidingMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          this.hidingMessage = false;
        }, 500);
      } else {
        // Original behavior - hide both bot and message
        this.hidingMessage = true;
        setTimeout(() => {
          this.hidingBot = true;
          setTimeout(() => {
            this.showBot = false;
            this.showMessage = false;
            this.hidingBot = false;
            this.hidingMessage = false;
            this.typedContent = "";
          }, 1000);
        }, 500);
      }
    },

    async getAccountBalance() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/auth/current-user`
        );

        if (response && response.data && response.data.bankingAccountData) {
          // Cập nhật giá trị từ server
          this.serverAccountBalance =
            response.data.bankingAccountData.accountBalance || 0;
          console.log(
            "Account balance fetched from server:",
            this.serverAccountBalance
          );
        }
      } catch (error) {
        console.error("Error fetching account balance:", error);
      }
    },

    // Add this new method to toggle the message visibility
    toggleBotMessage() {
      // Only allow toggling if the bot is visible
      if (!this.showBot) return;

      this.messageManuallyToggled = true;

      // If hiding message timer is active, clear it
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
        this.botHideTimer = null;
      }

      if (this.showMessage) {
        // Hide the message
        this.hidingMessage = true;
        setTimeout(() => {
          this.showMessage = false;
          this.hidingMessage = false;
        }, 500);
      } else {
        // Show the message
        this.hidingMessage = false;
        this.showMessage = true;

        // If the typing was already completed
        if (!this.isTyping && this.typedContent) {
          // Message is already typed, just show it
        } else if (!this.isTyping && !this.typedContent) {
          // Start the typing animation again
          this.isTyping = true;
          setTimeout(() => {
            this.isTyping = false;
            this.botMessage = this.templateChat;
            this.startWordByWordTyping();
          }, 1500);
        }
      }
    },

    // goal methods
    retrieveGoals() {
      if (!this.userId) {
        console.error('User ID is not available.');
        return;
      }
      axios
        .get(`${process.env.VUE_APP_DEPLOY_URL}/goals/u/${this.userId}`)
        .then((response) => {
          this.goals = response.data;
        })
        .catch((error) => {
          console.error("Error fetching goals:", error);
          // Nếu lỗi 404, nghĩa là user chưa có goals nào
          if (error.response && error.response.status === 404) {
            this.goals = []; // Khởi tạo mảng rỗng để tránh lỗi
            console.log("User has no goals yet");
          }
        });
    },

    addGoal() {
      if (
        this.newGoal.title &&
        this.newGoal.targetAmount &&
        this.newGoal.startDate &&
        this.newGoal.endDate &&
        (this.selectedCategory || this.newCategory)
      ) {
        this.newGoal.category =
          this.selectedCategory === "new"
            ? this.newCategory
            : this.selectedCategory;

        axios
          .post(`${process.env.VUE_APP_DEPLOY_URL}/goals`, {
            userId: this.userId,
            ...this.newGoal,
          })
          .then((response) => {
            this.goals.push(response.data);
            this.showAddGoalModal = false;
            this.newGoal = {
              title: "",
              description: "",
              targetAmount: "",
              currentAmount: 0,
              startDate: "",
              endDate: "",
              isAchieved: false,
              category: "",
            };
            this.selectedCategory = "";
            this.newCategory = "";
          })
          .catch((error) => {
            console.error("Error adding goal:", error);
          });
      } else {
        alert("Please fill in all required fields.");
      }
    },

    showGoalProgress(goal) {
      this.goalId = goal._id;
      this.goalTitle = goal.title;
      this.goalDescription = goal.description;
      this.goalTargetAmount = goal.targetAmount;
      this.goalCurrentAmount = goal.currentAmount;
      this.goalStartDate = goal.startDate;
      this.goalEndDate = goal.endDate;
      this.isAchieved = goal.isAchieved;
      this.goalCategory = goal.category;
      this.goalProgress = (
        (goal.currentAmount / goal.targetAmount) *
        100
      ).toFixed(2);
      this.showAddMoneyForm = false;
      this.showModal = true;
    },

    toggleAddMoneyForm() {
      this.showAddMoneyForm = !this.showAddMoneyForm;
    },

    async addMoneyToGoal() {
      if (this.addAmount > 0) {
        const updatedAmount = this.goalCurrentAmount + this.addAmount;

        try {
          // Send a PUT request to update the goal's currentAmount
          const response = await axios.put(
            `${process.env.VUE_APP_DEPLOY_URL}/goals/${this.goalId}`,
            {
              userId: this.userId, // Include necessary fields
              title: this.goalTitle,
              description: this.goalDescription,
              targetAmount: this.goalTargetAmount,
              currentAmount: updatedAmount,
              startDate: this.goalStartDate,
              endDate: this.goalEndDate,
              category: this.goalCategory,
              isAchieved:
                updatedAmount >= this.goalTargetAmount ? true : this.isAchieved, // Update isAchieved if the target is reached
            }
          );

          // Update the local state with the new currentAmount and progress
          this.goalCurrentAmount = updatedAmount;
          this.goalProgress = (
            (updatedAmount / this.goalTargetAmount) *
            100
          ).toFixed(2);
          this.addAmount = 0; // Reset the input
          this.showAddMoneyForm = false; // Hide the form after adding money
          alert("Money added successfully!");
          this.retrieveGoals();
        } catch (error) {
          console.error("Error updating goal:", error);
          alert("An error occurred while adding money to the goal.");
        }
      } else {
        alert("Please enter a valid amount.");
      }
    },
    updateDescriptionCount() {
      this.descriptionCharCount = this.newGoal.description.length;
    },

    convertToVND(amount) {
      const exchangeRate = 23000; // Example exchange rate, 1 USD = 23,000 VND
      return amount * exchangeRate;
    },
    convertVNDToUSD(amount) {
      const exchangeRate = 23000; // Example exchange rate: 1 USD = 23,000 VND
      return amount / exchangeRate;
    },
    sortTransactionsByDate(transactions) {
      return transactions.sort((a, b) => {
        // Convert date strings to Date objects
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Sort by date in descending order
        return dateB - dateA;
      });
    },

    // Example usage of the sorting function
    async fetchTransactions() {
      if (!this.userId) {
        console.error('User ID is not available.');
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`
        );
        
        console.log("✅ API response:", response); // 🪵 Log full response
        console.log("✅ Raw data:", response.data); // 🪵 Log data array

        // Kiểm tra response đầy đủ trước khi cập nhật
        if (response && response.data) {
          // Sắp xếp transactions theo ngày mới nhất
          const sortedTransactions = this.sortTransactionsByDate(response.data);

          // Cập nhật mảng transactions
          this.transactions = sortedTransactions.filter(
            (tx) => tx.amount != null && !isNaN(tx.amount) && tx.date
          );
          
          // Nếu có transactions, thì recalculate balance để đảm bảo tính đúng
          if (sortedTransactions.length > 0) {
            this.recalculateBalances();
          }
        }
        return response; // Trả về response để có thể sử dụng .then()
      } catch (error) {
        console.error("Error fetching transactions:", error);
        this.transactions = []; // Đặt mảng rỗng nếu có lỗi
        return null; // Trả về null trong trường hợp lỗi
      }
    },

    async addTransaction() {

      if (
        this.transaction.description &&
        this.transaction.amount !== null &&
        this.transaction.date &&
        this.transaction.type
      ) {
        try {
          let amountInUSD = Math.abs(this.transaction.amount);

          // Convert to USD if needed
          if (this.selectedCurrency === "VND") {
            amountInUSD = this.convertVNDToUSD(amountInUSD);
          }
          
          let openNotification = false; // Flag to track if a notification should be shown
          if (this.transaction.type === "Expense") {
            
              const accountBalanceFormatted = this.formatCurrency(this.accountBalanceTotal);
              const amountFormatted = this.formatCurrency(amountInUSD);
              const percentSpent = ((amountInUSD / this.accountBalanceTotal) * 100).toFixed(1);
                      
              if (amountInUSD >= this.accountBalanceTotal) {
                this.notiMessage = `Warning: You are spending ${amountFormatted} which exceeds your current balance of ${accountBalanceFormatted}!`;
                openNotification = true;
              } else if (amountInUSD >= this.accountBalanceTotal * 0.75) {
                this.notiMessage = `Caution: This ${amountFormatted} expense represents ${percentSpent}% of your account balance (${accountBalanceFormatted})!`;
                openNotification = true;
              } else if (amountInUSD >= this.accountBalanceTotal * 0.5) {
                this.notiMessage = `Notice: You're spending ${amountFormatted}, which is ${percentSpent}% of your available funds (${accountBalanceFormatted}).`;
                openNotification = true;
              } else if (amountInUSD >= this.accountBalanceTotal * 0.25) {
                this.notiMessage = `FYI: This ${amountFormatted} transaction is ${percentSpent}% of your total balance (${accountBalanceFormatted}).`;
                openNotification = true;
              }
            }


          const signedAmount =
            this.transaction.type === "Income" ? -amountInUSD : amountInUSD;

          const response = await axios.post(
            `${process.env.VUE_APP_DEPLOY_URL}/transactions`,
            {
              description: this.transaction.description,
              amount: signedAmount,
              userId: this.userId,
              date: this.transaction.date || new Date().toISOString().split("T")[0],
              type: this.transaction.type,
              category: this.transaction.category || "Uncategorized"
            }
          );

          console.log("Transaction added:", response.data);
          this.transactions.unshift(response.data); 

          // Reset form
          this.transaction = {
            description: "",
            amount: null,
            date: "",
            type: "",
            category: ""
          };
          this.showModal = false;

          this.$nextTick(() => {
            this.recalculateBalances();
          });
          
          if (openNotification) {
            this.showNoti = true; // Show the notification if the flag is set
          }
        } catch (error) {
          console.error("Error adding transaction:", error);
        }
      } else {
        console.error("Transaction description, amount, and date are required");
      }
    },

    async setInitialBalance() {
      // Provide default values if they are not set
      const date =
        this.transaction.date || new Date().toISOString().slice(0, 10); // Use current date if not set
      const type = this.transaction.type || "Initial"; // Default type if not set

      try {
        // Send a POST request to set the initial balance
        const response = await axios.post(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions`,
          {
            description: "Initial Balance",
            amount: this.initialBalance,
            date: date,
            balance: this.initialBalance,
            source: "manual",
            userId: this.userId,
            type: type,
          }
        );

        // Update local state with the response data
        this.transactions.push(response.data);
        this.accountBalanceTotal = parseFloat(this.initialBalance); // Update the account balance
        this.initialBalance = null; // Reset the initial balance input field
        this.showSetBalanceModal = false; // Close the modal
        this.initialBalanceSet = true; // Mark initial balance as set
      } catch (error) {
        console.error("Error setting initial balance:", error);
      }
    },

    // reset transaction of a specific user by deleting all data corresponding to userId
    async resetAccountBalance() {
      try {
        await axios.delete(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`
        );
        this.transactions = [];
        this.accountBalanceTotal = 0;
        this.initialBalanceSet = false;
        this.showResetConfirmationModal = false;
      } catch (error) {
        console.error("Error resetting account balance:", error);
      }
    },

    async editTransaction(trans) {
      this.editTransactionData = { ...trans };
      this.showEditTransactionModal = true;
    },

    // edit a transaction by transactionId
    async updateTransaction() {
      try {
        const response = await axios.put(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/${this.editTransactionData._id}`,
          this.editTransactionData
        );
        const index = this.transactions.findIndex(
          (t) => t._id === this.editTransactionData._id
        );
        if (index !== -1) {
          this.transactions.splice(index, 1, response.data.updatedTransaction);
          this.transactions = response.data.transactions; // Update the entire transactions list with recalculated balances
          this.recalculateBalances();
          this.showEditTransactionModal = false;
        }
      } catch (error) {
        console.error("Error updating transaction:", error);
      }
    },

    // delete a transaction by transactionId
    async removeTransaction(id) {
      try {
        await axios.delete(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/${id}`
        );
        this.transactions = this.transactions.filter(
          (trans) => trans._id !== id
        );
        this.recalculateBalances();
      } catch (error) {
        console.error("Error removing transaction:", error);
      }
    },
    openModal() {
      const today = new Date().toISOString().split("T")[0]; // format: YYYY-MM-DD
      this.transaction = {
        description: "",
        amount: null,
        date: today,
        type: "",
        category: ""
      };
      this.recommendations = [];
      this.recommendationsVisible = false;
      this.highlightedIndex = -1;
      this.showModal = true;
    },

    recalculateBalances() {
      // Kiểm tra nếu không có transactions thì trả về
      if (!this.transactions || this.transactions.length === 0) {
        return;
      }

      // Sắp xếp giao dịch theo ngày tăng dần để tính balance đúng
      const sortedTransactions = [...this.transactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      // Bắt đầu từ serverAccountBalance nếu có, nếu không thì từ 0
      let balance = this.serverAccountBalance || 0;

      for (let transaction of sortedTransactions) {
        // Giá trị amount đúng (âm cho Income, dương cho Expense)
        // Balance giảm khi amount dương (Expense) và tăng khi amount âm (Income)
        if (transaction.amount) {
          balance -= transaction.amount;
          transaction.balance = balance;
        }
      }

      // Cập nhật lại mảng transactions với dữ liệu đã tính toán lại
      this.$nextTick(() => {
        this.transactions = this.sortTransactionsByDate(sortedTransactions);
      });
    },
    formattedDate(dateString) {
      const datePart = dateString.split("T")[0];
      const [year, month, day] = datePart.split("-");
      return `${month}/${day}/${year}`;
    },
    closeModal() {
      this.showModal = false;
    },
    formatCurrency(amount) {
      // Access the selectedCurrency property directly from the Vue instance
      const currency = this.selectedCurrency;

      // Format the number using Intl.NumberFormat
      let formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);

      // Adjust the position of the currency symbol based on the selected currency
      if (currency === "USD") {
        // For USD, remove the $ symbol (if present) and return the formatted amount
        formattedAmount = formattedAmount.replace("USD", "").trim();
      } else if (currency === "VND") {
        // For VND, remove the $ symbol (if present) and add ₫ after the number
        formattedAmount =
          formattedAmount.replace("₫", "").replace("USD", "").trim() + "₫";
      }

      return formattedAmount;
    },
    async processURLParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const description = urlParams.get("description");
      const amount = urlParams.get("amount");
      const action = urlParams.get("action");
      const date = urlParams.get("date");

      const type = urlParams.get("type");

      if (description && amount && action && date && type === "add") {
        this.transaction.description = description;
        this.transaction.date = date;
        this.transaction.amount = parseInt(amount, 10);
        this.transaction.type = type;
        await this.addTransaction();
      }
    },
    generateRecommendations(event) {
      const input = this.transaction.description.toLowerCase();
      if (input.length === 0) {
        this.recommendations = [];
        return;
      }
      this.recommendations = this.possibleRecommendations.filter((item) =>
        item.toLowerCase().includes(input)
      );
      if (
        event.key === "ArrowDown" &&
        this.highlightedIndex < this.recommendations.length - 1
      ) {
        this.highlightedIndex++;
      } else if (event.key === "ArrowUp" && this.highlightedIndex > 0) {
        this.highlightedIndex--;
      } else if (event.key === "Enter" && this.highlightedIndex >= 0) {
        this.selectRecommendation(this.recommendations[this.highlightedIndex]);
      }
    },
    selectRecommendation(recommendation) {
      this.transaction.description = recommendation;
      this.recommendations = [];
      this.highlightedIndex = -1;
    },
    showRecommendations() {
      this.recommendationsVisible = true;
    },
    hideRecommendations() {
      setTimeout(() => {
        this.recommendationsVisible = false;
      }, 100); //delay
    },
    async openPlaidLink() {
      try {
        const plaid = await this.loadPlaidScript();
        await this.createLinkToken();
      } catch (error) {
        console.error("Error loading Plaid script:", error);
      }
    },
    loadPlaidScript() {
      return new Promise((resolve, reject) => {
        if (window.Plaid) {
          resolve(window.Plaid);
        } else {
          const script = document.createElement("script");
          script.src =
            "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
          script.onload = () => resolve(window.Plaid);
          script.onerror = reject;
          document.body.appendChild(script);
        }
      });
    },
    async createLinkToken() {
      try {
        // Make an API call to your backend to create a link token
        const response = await axios.post(
          `${process.env.VUE_APP_DEPLOY_URL}/api/plaid/create-link-token`
        );
        const linkToken = response.data.link_token;

        // Initialize Plaid Link with the generated link token
        const plaidLink = new window.Plaid.create({
          token: linkToken,
          onSuccess: (public_token, metadata) => {
            // Handle the success scenario, exchange the public token
            this.exchangeToken(public_token);
          },
          onExit: (err, metadata) => {
            // Handle the exit scenario
            console.error("Plaid Link exited", err);
          },
        });
        plaidLink.open(); // Open Plaid Link
      } catch (error) {
        console.error("Error creating link token", error);
      }
    },

    async exchangeToken(publicToken) {
      try {
        // Send the public token to the backend to exchange it for an access token
        const response = await axios.post(
          `${process.env.VUE_APP_DEPLOY_URL}/api/plaid/exchange-token`,
          {
            public_token: publicToken,
          }
        );

        const { access_token, item_id } = response.data;
        console.log("Access token:", access_token);
        // Save the access token and item ID as required
        await axios.put(`${process.env.VUE_APP_DEPLOY_URL}/users/${this.userId}`, 
        {
          bank_accounts: access_token,
        },
        { withCredentials: true }
      );
        const user = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/users/${this.userId}`);
        this.reloadTransactions(access_token);
        this.accountNotConnected = await this.fetchAccountStatus();
      } catch (error) {
        console.error("Error exchanging token", error);
      }
    },

    async reloadTransactions(access_token) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/api/plaid/transactions`, {
          params: { access_token },
        });
        const currentTransactions = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`);
        if (currentTransactions.data.length > 0) {
          await axios.delete(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`, {
            data: { source: 'bank' }
          });
        }
        const transactions = response.data.latest_transactions;
        await Promise.all(transactions.map(async (transaction) => {
          await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
            description: transaction.name,
            amount: transaction.amount,
            date: transaction.date,
            type: transaction.category[0],
            balance: transaction.amount,
            userId: this.userId,
            source: 'bank'
          });
          console.log("added transaction", transaction);
        }));
        
        console.log("Fetched transactions:", this.transactions);
        await this.fetchTransactions();
      }
      catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },
    // Sửa phương thức refreshData
    async refreshData() {
      try {
        // Lấy account balance từ server trước
        await this.getAccountBalance();

        // Gọi API transaction
        await this.fetchTransactions();
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    },

    // Tạo hàm Plaid fetchTransactions riêng biệt để tránh nhầm lẫn
    async fetchPlaidTransactions(access_token) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/api/plaid/transactions`,
          {
            params: { access_token },
          }
        );

        // Update your local transactions state with the latest transactions
        this.transactions = response.data.latest_transactions;
        console.log("Fetched Plaid transactions:", this.transactions);
      } catch (error) {
        console.error("Error fetching Plaid transactions:", error);
      }
    },
    activated() {
      if (this.transactions.length === 0) {
        this.fetchTransactions();
      }
    }
  },
};
</script>
<style scoped>
.GoalDashBoardContainer {
  width: 100vw;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow-x: hidden;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.leftPanel {
  width: 70%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-top: 0;
  background-color: var(--bg-primary);
}

.leftPanelHeader {
  max-width: 100%;
  height: 5%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
  margin-bottom: 0;
  padding-bottom: 5px;
  color: var(--text-primary);
}

.profilePic {
  height: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  max-width: 100%;
}

.headerText {
  margin-left: 10px;
}

.greeting {
  font-weight: 600;
  font-size: 22px;
  color: var(--text-primary);
}

.slogan {
  font-size: 14px;
  color: var(--text-primary);
  opacity: 0.7;
}

.panelOverview {
  width: 100%;
  height: 15%;
  background-color: blue;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.graphContainer {
  width: 100%;
  height: 45%;
  display: flex;
  justify-content: center;
  align-items: center;

}

.transactionContainer {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
}

.pie-chart-row {
  display: flex;
  justify-content: center;
  align-items: stretch; 
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-bottom: 40px;
}

.pie-chart-row > * {
  flex: 1 1 45%;
  max-width: 45%;
  min-width: 320px;
}

/* Right Panel - Financial goals */
.rightPanel {
  width: 30%;
  max-height: none;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--bg-primary);
}

/* Goals styles */
.financial-goals {
  text-align: center;
  height: 100%;
  width: 100%;
}

.goal-image {
  z-index: 20;
  width: 100%;
  height: auto;
  border-radius: 10px 10px 0 0;
  margin-bottom: -20px; /* Overlap with goal-content */
}

.goal-upper-part {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.goal-section-title {
  margin-bottom: 0px;
  margin-top: 0px;
  font-size: 2em;
  color: var(--text-primary);
}

.add-goal-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-goal-button:hover {
  background-color: #005bb5;
}

.goals {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.goal {
  background-color: var(--card-bg);
  border-radius: 10px;
  box-shadow: 0 8px 16px var(--shadow-color);
  cursor: pointer;
  margin: 10px;
  flex: 1 1 calc(100% - 20px);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
  color: var(--text-primary);
}

.goal:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.goal-image {
  width: 50%;
  height: 50%;
  margin: auto;
  border-radius: 10px 10px 0 0;
}

.goal-content {
  background-color: var(--card-bg);
  border-radius: 10px;
  margin-top: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: var(--bg-primary);
}

.goal-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #007bff;
}

.goal-info h3 {
  margin: 10px 0;
  font-size: 1.5em;
  color: var(--text-primary);
}

.goal-info p {
  margin: 5px 0;
  font-size: 1em;
  color: var(--text-primary) !important;
}

.progress-bar-container {
  width: 100%;
  background-color: var(--progress-color);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 20px;
  height: 20px;
}

.progress-bar {
  height: 100%;
  background-color: var(--link-color);
  transition: width 0.5s ease-in-out;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 10px;
  box-shadow: 0 4px 8px var(--shadow-color);
  width: 90%;
  max-width: 500px;
  max-height: 90vh; /* Limit height to 90% of viewport */
  overflow-y: auto; /* Add scroll for overflow content */
  padding: 20px;
}

.modal-content img {
  width: 100%;
  height: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.search-container {
  margin: 20px 0;
  text-align: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--border-color);
  font-size: 16px;
  box-sizing: border-box;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Add Goal Modal Styles */
.form-group {
  margin-bottom: 10px;
  font-family: "Space Grotesk", sans-serif;
}

#goalCategory {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

#goalCategory:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.category-loading {
  font-size: 0.8em;
  color: #666;
  margin-top: 5px;
}

.loading-spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #007bff;
  animation: spin 1s linear infinite;
  margin-right: 5px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile-specific styles */
@media (max-width: 1024px) {
  .GoalDashBoardContainer {
    flex-direction: column;
    height: auto;
    width: 100vw;
    max-width: 100%;
    background-color: var(--bg-primary);
  }

  .leftPanel,
  .rightPanel {
    width: 100%;
    background-color: var(--bg-primary);
  }

  .leftPanelHeader,
  .panelOverview,
  .graphContainer,
  .transactionContainer {
    width: 100%;
    max-width: 100%;
  }
}

.financial-goals {
  text-align: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.rightPanel {
  width: 30%;
  max-height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.profilePic {
  height: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  max-width: 100px !important;
}

.headerText {
  margin-left: 10px;
}

.greeting {
  font-weight: 600;
  font-size: 22px;
}

.slogan {
  font-size: 14px;
  color: #aaa;
}

/* Basic styles */
.homepage {
  color: #333;
  padding: 20px;
  background-color: #f9f9f9;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e06fb;
  color: #ffffff;
  padding: 20px 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header-icons i {
  font-size: 2em;
  margin-left: 20px;
  cursor: pointer;
}

.header-greeting h1 {
  font-size: 2em;
  margin: 0;
  animation: fadeIn 2s;
}

.header-greeting p {
  font-size: 1.2em;
  margin: 10px 0 0;
  animation: fadeIn 2s;
}

.alldata1 {
  padding: 20px;
  display: flex;
  background-color: #f9f9f9; /* Light background color */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 42px;
  justify-content: space-between;
  width: 40%;
  flex-wrap: wrap; /* Allow wrapping to a new line */
}

.total-spend {
  display: flex; /* Use flexbox for alignment */
  flex-direction: column; /* Stack elements vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Align items to the top */
  margin-left: 0; /* Push to the far right within the wrapper */
  padding: 10px;
  border-radius: 9px;
  background-color: var(--card-bg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  transition: background-color 0.3s, box-shadow 0.3s;
  height: auto;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  height: auto;
}

.selectoutside {
  padding: 5px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  height: 33px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

hr {
  width: 100%; /* Make the <hr> span the full width of its container */
  border: 0; /* Remove default border */
  height: 0.5px; /* Set the height of the line */
  background: #ccc; /* Set the color of the line */
  margin: 20px 0; /* Add space above and below the line */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

.total-spend:hover {
  background-color: #ddd; /* Change to your hover background color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.total-spend h2 {
  margin: 0;
}

.total-spend p {
  margin: 0;
}

.categories-container {
  align-items: flex-start; /* Align items to the start */
  width: fit-content; /* Container width fits the content */
}

.categories-container h2 {
  margin: 0; /* Remove default margins */
  padding-bottom: 10px; /* Space between heading and icons */
}

.category-icon {
  width: 50px;
  height: 50px;
  display: inline-flex;
  margin: 10px;
  margin-top: -5px;
  margin-left: 7px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f0f0f0; /* Change to your desired background color */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  color: #333; /* Icon color */
  transition: background-color 0.3s, box-shadow 0.3s;
}

.category-icon:hover {
  background-color: #ddd; /* Change to your hover background color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.amount-popup {
  display: none;
  position: absolute;
  bottom: -30px; /* Adjust as needed */
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.category-container:hover .amount-popup {
  display: block;
}

/* Transactions section */
.transactions {
  margin-top: 20px;
  text-align: center;
  border: 2px solid var(--border-color);
  padding: 20px;
  padding-top: 0px;
  border-radius: 10px;
  box-shadow: 0 8px 16px var(--shadow-color);
  background-color: var(--card-bg);
}

.headline-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 10px;
}

.headline-buttons h2 {
  width: fit-content;
  margin: 0;
}

.buttons {
  display: flex;
  flex-direction: row;
  gap: 20px;
  height: 100%;
  margin: 0;
}
.buttons button {
  height: 100%;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: var(--link-color);
  color: white;
  border: none;
  cursor: pointer;
}

.buttons button:hover {
  background-color: var(--hover-bg);
}

.transaction-box input {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  width: 100%;
  /* Set to 100% width */
  box-sizing: border-box;
  /* Include padding and border in the element's total width and height */
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.transaction-box button {
  padding: 10px 20px;
  background-color: var(--link-color);
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.transaction-box button:hover {
  background-color: var(--bg-primary);
}

.recommendation-list {
  position: absolute;
  top: 50px;
  /* Adjust this value based on your input field height */
  left: 0;
  right: 0;
  max-height: 150px;
  overflow-y: auto;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 5px;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.recommendation-list li {
  padding: 10px;
  cursor: pointer;
}

.recommendation-list li:hover,
.recommendation-list li.highlighted {
  background-color: var(--hover-bg);
}

.transaction-list table {
  width: 100%;
  border-collapse: collapse;
  color: var(--text-primary);
}

.transaction-list th,
.transaction-list td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.transaction-list th {
  background-color: var(--bg-primary);
}

.expense {
  background-color: rgba(244, 67, 54, 0.1);
}

.income {
  background-color: rgba(76, 175, 80, 0.1);
}

.transaction-list td.buttons {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 5px;
  gap: 5px;
}

.transaction-list td.buttons button {
  padding: 6px 12px;
  border-radius: 5px;
  background-color: var(--link-color);
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: auto;
  min-width: 80px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.transaction-list td.buttons button:hover {
  background-color: var(--button-hover-bg, #005bb5);
  transform: translateY(-1px);
}

.chart-container {
  width: 100%;
  height: 350px;
  min-height: 300px;
  box-sizing: border-box;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--card-bg);
  margin-bottom: 20px;
  overflow: hidden;
  position: relative;
}

/* Đảm bảo biểu đồ hiển thị đúng trên các trình duyệt khác nhau */
.chart-container > * {
  width: 100%;
  height: 100%;
}

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.chart-wrapper canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-toggle-buttons {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  align-items: center; /* Center buttons horizontally */
  margin-top: 3px;
  height: 100%; /* Adjust height as needed */
}

.chart-toggle-buttons button {
  padding: 10px 20px;
  margin: 5px 0; /* Adjust margin to space buttons vertically */
  background-color: var(--link-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-width: 150px; /* Ensure both buttons have the same minimum width */
  text-align: center; /* Center text inside buttons */
}

.chart-toggle-buttons button.active {
  background-color: var(--hover-bg);
}

.input-box {
  width: 100%;
  /* Same width as its parent, the transaction box */
  padding: 10px;
  /* Optional: Add padding as needed */
  box-sizing: border-box;
  /* Ensures padding and border are included in the width */
  border: none;
  /* Optional: Add a border if needed */
  position: relative;
  /* Allows absolute positioning of child inputs */
}

.selectinside {
  padding: 9px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 15px;
  transition: border-color 0.3s ease;
  margin-left: 10px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.type-select {
  border: 1px solid var(--border-color);
  border-radius: 5px;
  margin-bottom: 10px;
  padding-left: 5px;
}

.chart-toggle-buttons button:hover {
  background-color: var(--hover-bg);
}

.chart-toggle-buttons button.active {
  background-color: var(--hover-bg);
}

/* Financial goals */
.financial-goals {
  margin-top: 40px;
}

.add-goal-button {
  padding: 10px 20px;
  background-color: var(--link-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-goal-button:hover {
  background-color: var(--hover-bg);
}

.goals {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.goal {
  text-align: center;
  padding: 60px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 8px 16px var(--shadow-color);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  animation: slideIn 1s;
  flex: 1 1 calc(33.333% - 20px);
}

.goal:hover {
  transform: scale(1.1) rotateY(15deg);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
}

.goal p {
  color: white;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.modal-content input {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  width: 80%;
}

.modal-content button {
  padding: 10px 20px;
  background-color: var(--link-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: var(--hover-bg);
}

.progress-bar {
  width: 100%;
  background: var(--hover-bg);
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
}

.currency-input {
  display: flex;
  align-items: center;
}

.progress {
  height: 20px;
  background: var(--link-color);
}

/* Footer navigation */
.footer-nav {
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  background-color: #003366;
  padding: 20px;
  border-radius: 10px;
  color: #ffffff;
}

.nav-item {
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 5px;
  width: 500px;
  max-width: 90%;
  height: 630px;
  margin-top: 80px;
}

.modal-header {
  align-items: center;
  margin-bottom: 10px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.modal-footer button {
  margin-left: 10px;
}

.revenue-expense {
  display: flex;
  gap: 40px; /* Adjust the gap between cards */
  margin-top: 0;
  margin-bottom: 20px;
}

.total-spend {
  width: 27%;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0 2px 10px var(--shadow-color);
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the start (left) */
  justify-content: flex-start; /* Align items to the top */
  margin: 10px;
}

.total-spend h2 {
  margin: 0;
  margin-bottom: 10px;
}

.revenue-card {
  background-color: var(--card-bg);
  border: 1px solid #4caf50;
}

.expense-card {
  background-color: var(--card-bg);
  border: 1px solid #f44336;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-icons {
    margin-top: 10px;
  }

  .header-greeting h1 {
    font-size: 1.5em;
  }

  .header-greeting p {
    font-size: 1em;
  }

  .assets-value {
    font-size: 1.2em;
  }

  .goal {
    flex: 1 1 100%;
  }

  .chart-wrapper {
    height: auto;
  }
}

/* Scrollbar Customization */
/* For Webkit browsers (Chrome, Safari, newer Edge) */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--link-color);
}

/* For Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) var(--bg-primary);
}

/* Apply to specific scrollable containers */
.modal-content,
.rightPanel,
.transaction-list {
  /* Inherit the global scrollbar styles */
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) var(--bg-primary);
}

/* Bot Chat Styles */
.bot-chat-container {
  position: fixed; /* Fixed positioning relative to viewport */
  left: -350px; /* Start off-screen to the left */
  bottom: 30px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 100;
  transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 1s ease;
  opacity: 0;
  transform: translateX(0);
  pointer-events: none; /* Prevents interaction with elements behind it */
}

.bot-chat-container.bot-visible {
  transform: translateX(350px); /* Move to the right */
  opacity: 1;
  pointer-events: auto; /* Re-enable interaction when visible */
}

.bot-chat-container.bot-hidden {
  transform: translateX(350px) translateY(50px);
  opacity: 0;
  transition: transform 1s ease, opacity 1s ease;
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
  margin-bottom: 10px;
  margin-left: 10px;
  background: #007bff;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 280px;
  max-height: 200px;
  overflow-y: auto; /* Enable vertical scrolling */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0; /* Start hidden */
  transform: scale(0.8) translateY(10px); /* Start slightly smaller and lower */
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.3s; /* Reduced delay for smoother appearance */
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

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
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

@media screen and (max-width: 768px) {
  /* ...existing code... */

  /* For mobile, position the bot at the bottom of the screen */
  .bot-chat-container {
    left: auto;
    right: -300px;
    bottom: 20px;
  }

  .bot-chat-container.bot-visible {
    transform: translateX(-310px);
  }

  .bot-chat-container.bot-hidden {
    transform: translateX(-310px) translateY(50px);
  }
}

/* Ghost div for chatbot trigger */
.chatbot-trigger {
  height: 20px; /* Small height to be less intrusive */
  width: 100%;
  opacity: 0; /* Invisible */
  pointer-events: none; /* Won't interfere with user interaction */
  position: relative;
  margin-top: 20px; /* Space after the last visible element */
  margin-bottom: 20px; /* Space at the bottom of the page */
}

/* Ghost div for chatbot trigger - truly invisible */
.chatbot-trigger {
  height: 1px; /* Minimal height */
  width: 1px; /* Minimal width */
  opacity: 0; /* Invisible */
  pointer-events: none; /* Won't interfere with user interaction */
  position: absolute; /* Take out of normal document flow */
  bottom: 20px; /* Position near the bottom of the container */
  left: 0; /* Align to the left */
  margin: 0; /* Remove margins */
  padding: 0; /* Remove padding */
  border: none; /* Remove borders */
  background: transparent; /* Transparent background */
}

/* ...existing code... */
.bot-image.clickable {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.bot-image.clickable:hover {
  transform: scale(1.1);
}

.chart-container.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 350px;
}

.no-data-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #666;
  font-size: 16px;
  text-align: center;
}

</style>