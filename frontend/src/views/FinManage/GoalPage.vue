<template>
  <div class="connect-button-wrapper">
    <button
      @click="openPlaidLink"
      :class="['add-goal-button', disabledConnect ? 'disabled' : null]"
      class="connect-button"
    >
    {{ $t('connect') }}
    </button>
  </div>
  
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
      <!-- <div class="leftPanelHeader"> -->
        <!-- <img class="profilePic" :src="profilePic" alt="profilePic" />
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
            Manage your wallet wisely to reach your goals with ease.
          </div>
        </div>
      </div> -->

      <div class="revenue-expense">
        <div class="total-spend transaction-card">
          <h2>{{ transactions.length }}</h2>
          <p>{{ $t('totalTransactions') }}</p>
        </div>

        <div class="total-spend revenue-card">
          <h2>
            {{
              selectedCurrency === "USD"
                ? formatCurrency(totalRevenue)
                : formatCurrency(convertToVND(totalRevenue))
            }}
          </h2>
          <p>{{ $t('totalIncome') }}</p>
        </div>

        <div class="total-spend expense-card">
          <h2>
            -{{
              selectedCurrency === "USD"
                ? formatCurrency(totalExpense)
                : formatCurrency(convertToVND(totalExpense))
            }}
          </h2>
          <p>{{ $t('totalExpense') }}</p>
        </div>

        <div class="total-spend balance-card">
          <div class="balance-header">
            <h2>
              {{
                selectedCurrency === "USD"
                  ? formatCurrency(accountBalance)
                  : formatCurrency(convertToVND(accountBalance))
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
          <p>{{ $t('accountBalance') }}</p>
        </div>

      </div>
      <div v-if="transactions && transactions.length > 0 && showForecast !== undefined">
        <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
          <label style="font-weight: bold; margin-right: 10px;">{{ $t('showForecast') }}</label>
          <input type="checkbox" v-model="showForecast" />
        </div>

        <!-- Chart container with loading state -->
        <div class="chart-container">
          <div v-if="isChartLoading" class="chart-loading"></div>
          <TransactionLine
            v-if="transactions && transactions.length > 0"
            :transactions="transactions"
            :showForecast="showForecast"
            :key="`transaction-line-${transactions.length}-${showForecast}`" 
          />
          <div v-else class="no-data-message">
            <p>{{ $t('noTransactionData') }}</p>
          </div>
        </div>
      </div>
      <!-- TransactionPie -->
      <!-- <div
        class="pie-chart-row"
        v-if="transactions && transactions.length > 0"
      >
        <TransactionPie :transactions="transactions" chartType="Income" />
        <TransactionPie :transactions="transactions" chartType="Expense" />
      </div> -->
      <div class="chart-container no-data" v-else>
        <div class="no-data-message">
          <p>{{ $t('noTransactionData') }}</p>
        </div>
      </div>
      <section class="transactions">
        <div class="headline-buttons">
          <h2>{{ $t('dailyTransactions') }}</h2>
          <div class="buttons">
            <button @click="openModal" style="font-weight: bold">{{ $t('add') }}</button>
            <button
              @click="showResetConfirmationModal = true"
              style="font-weight: bold"
            >
            {{ $t('reset') }}
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
      <div class="pie-chart-card">
        <div class="pie-chart-header">
          <h3 for="chartToggle">{{ $t('transactionChart') }}</h3>
          <select id="chartToggle" v-model="activePieChart">
            <option value="Income">{{ $t('income') }}</option>
            <option value="Expense">{{ $t('expense') }}</option>
          </select>
        </div>
        <TransactionPie :transactions="transactions" :chartType="activePieChart" />
      </div>
      <!-- Goals section -->
      <section class="financial-goals" ref="financialGoalsSection">
        <div class="goal-upper-part">
          <h3 class="goal-section-title">{{ $t('goals') }}</h3>
          <button class="add-goal-button" @click="showAddGoalModal = true">
            <i class="fas fa-plus"></i>
            {{ $t('addGoal') }}
          </button>
        </div>

        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            :placeholder="$t('searchGoals')"
            class="search-input"
          />
        </div>

        <div class="goals">
          <div
            v-for="goal in filteredGoals"
            :key="goal._id"
            class="goal"
            :class="{ 'achieved': goal.currentAmount >= goal.targetAmount }"
          >
            <div class="goal-header">
              <div class="goal-icon">
                <i :class="getCategoryIcon(goal.category)"></i>
              </div>
              <div class="goal-info">
                <h3>{{ goal.title }}</h3>
                <p>{{ goal.category }}</p>
              </div>
            </div>

            <div class="goal-content">
              <div class="goal-amounts">
                <p>{{ $t('saved') }}: {{ formatCurrency(goal.currentAmount) }}</p>
                <p>{{ $t('target') }}: {{ formatCurrency(goal.targetAmount) }}</p>
              </div>

              <div class="progress-bar-container">
                <div 
                  class="progress-bar"
                  :style="{ width: (goal.currentAmount / goal.targetAmount * 100) + '%' }"
                ></div>
                <span class="progress-text">
                  {{ Math.round(goal.currentAmount / goal.targetAmount * 100) }}%
                </span>
              </div>

              <div class="goal-actions">
                <button class="action-button add-money-btn" @click.stop="openAddMoneyModal(goal)">
                  <i class="fas fa-plus"></i>
                  {{ $t('addMoney') }}
                </button>
                <button class="action-button view-details-btn" @click.stop="showGoalDetails(goal)">
                  <i class="fas fa-eye"></i>
                  {{ $t('details') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- Ghost div for chatbot trigger - placed at the very end of the page -->
    <div ref="chatbotTriggerPoint" class="chatbot-trigger"></div>
  </div>
  <div v-if="showResetConfirmationModal" class="modal">
    <div class="modal-content">
      <h3>{{ $t('resetTitle') }}</h3>
      <p>
        {{ $t('resetConfirmation') }}
      </p>
      <button
        @click="showResetConfirmationModal = false"
        style="margin-right: 10px"
      >
      {{ $t('no') }}
      </button>
      <button @click="resetAccountBalance">{{ $t('yes') }}</button>
    </div>
    
  </div>

  <!-- Add Goal Modal -->
  <div class="modal" :class="{ 'show': showAddGoalModal }" @click="closeAddGoalModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ $t('addNewGoal') }}</h3>
      </div>

      <div class="form-group">
        <label for="goalTitle">{{ $t('goalTitle') }}</label>
        <input
          id="goalTitle"
          type="text"
          v-model="newGoal.title"
          :placeholder="$t('enterGoalTitle')"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="goalDescription">{{ $t('description') }}</label>
        <textarea
          id="goalDescription"
          v-model="newGoal.description"
          :placeholder="$t('describeYourGoal')"
          class="form-input"
          rows="4"
          maxlength="500"
          @input="updateDescriptionCount"
        ></textarea>
        <div class="character-counter">
          {{ descriptionCharCount }} / 500
        </div>
      </div>

      <div class="form-group">
        <label for="targetAmount">{{ $t('totalNeeded') }}</label>
        <div class="currency-input">
          <input
            id="targetAmount"
            type="number"
            v-model="newGoal.targetAmount"
            :placeholder="$t('enterAmount')"
            class="form-input"
            required
          />
          <select class="form-input" v-model="selectedCurrency">
            <option value="USD">USD</option>
            <option value="VND">VND</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="currentAmount">{{ $t('alreadyHave') }}</label>
        <input
          id="currentAmount"
          type="number"
          v-model="newGoal.currentAmount"
          :placeholder="$t('enterCurrentAmount')"
          class="form-input"
        />
      </div>

      <div class="form-group">
        <label for="startDate">{{ $t('startDate') }}</label>
        <input
          id="startDate"
          type="date"
          v-model="newGoal.startDate"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="endDate">{{ $t('endDate') }}</label>
        <input
          id="endDate"
          type="date"
          v-model="newGoal.endDate"
          class="form-input"
          required
        />
      </div>

      <div class="form-group">
        <label for="goalCategory">{{ $t('category') }}</label>
        <select id="goalCategory" v-model="selectedCategory" class="form-input">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
          <option value="new">{{ $t('addNewCategory') }}</option>
        </select>
      </div>

      <div v-if="selectedCategory === 'new'" class="form-group">
        <label for="newCategory">{{ $t('newCategory') }}</label>
        <input
          id="newCategory"
          type="text"
          v-model="newCategory"
          :placeholder="$t('enterNewCategory')"
          class="form-input"
        />
      </div>

      <div class="modal-footer">
        <button class="modal-btn secondary" @click="closeAddGoalModal">
          {{ $t('cancel') }}
        </button>
        <button class="modal-btn primary" @click="addGoal">
          {{ $t('addGoal') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast" :class="{ 'show': showToast }">
    <div class="toast-icon">
      <i class="fas fa-check"></i>
    </div>
    <div class="toast-message">{{ toastMessage }}</div>
  </div>

  <!-- Add Money Modal -->
  <div class="modal" :class="{ 'show': showAddMoneyModal }" @click="closeAddMoneyModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ $t('addMoneyToGoal') }}</h3>
      </div>

      <div class="form-group">
        <label for="addAmount">{{ $t('amount') }}</label>
        <input
          id="addAmount"
          type="number"
          v-model="addAmount"
          :placeholder="$t('enterAmount')"
          class="form-input"
          required
        />
      </div>

      <div class="modal-footer">
        <button class="modal-btn secondary" @click="closeAddMoneyModal">
          {{ $t('cancel') }}
        </button>
        <button class="modal-btn primary" @click="addMoneyToGoal">
          {{ $t('add') }}
        </button>
      </div>
    </div>
  </div>

  <!-- Goal Details Modal -->
  <div class="modal" :class="{ 'show': showGoalDetailsModal }" @click="closeGoalDetailsModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ selectedGoal ? selectedGoal.title : '' }}</h3>
      </div>

      <div class="goal-details">
        <p class="goal-description">{{ selectedGoal ? selectedGoal.description : '' }}</p>
        
        <div class="goal-progress">
          <div class="progress-bar-container">
            <div 
              class="progress-bar"
              :style="{ width: selectedGoal ? (selectedGoal.currentAmount / selectedGoal.targetAmount * 100) + '%' : '0%' }"
            ></div>
            <span class="progress-text">
              {{ selectedGoal ? Math.round(selectedGoal.currentAmount / selectedGoal.targetAmount * 100) : 0 }}%
            </span>
          </div>
        </div>

        <div class="goal-info-grid">
          <div class="info-item">
            <span class="label">{{ $t('category') }}</span>
            <span class="value">{{ selectedGoal ? selectedGoal.category : '' }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('saved') }}</span>
            <span class="value">{{ selectedGoal ? formatCurrency(selectedGoal.currentAmount) : '' }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('target') }}</span>
            <span class="value">{{ selectedGoal ? formatCurrency(selectedGoal.targetAmount) : '' }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('startDate') }}</span>
            <span class="value">{{ selectedGoal ? formatDate(selectedGoal.startDate) : '' }}</span>
          </div>
          <div class="info-item">
            <span class="label">{{ $t('endDate') }}</span>
            <span class="value">{{ selectedGoal ? formatDate(selectedGoal.endDate) : '' }}</span>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="modal-btn secondary" @click="closeGoalDetailsModal">
          {{ $t('close') }}
        </button>
        <button class="modal-btn primary" @click="openAddMoneyModal(selectedGoal)">
          {{ $t('addMoney') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TransactionLine from "@/components/FinManage/GoalPage/TransactionLine.vue";
import TransactionTable from "@/components/FinManage/GoalPage/TransactionTable.vue";
import TransactionModal from "@/components/FinManage/GoalPage/TransactionModal.vue";
import TransactionPie from "@/components/FinManage/GoalPage/TransactionPie.vue";
import ChatBotTyping from "@/components/FinInvest/QuantPage/ChatBotTyping.vue";
import goalNotiModal from "@/components/Notification/goalNotiModal.vue";
export default {
  name: "GoalPage",
  components: {
    ChatBotTyping,
    TransactionLine,
    TransactionTable,
    TransactionModal,
    TransactionPie
  },
  // watch: {
  //   showForecast(newVal) {
  //     console.log("showForecast changed to:", newVal);
  //     this.reinitializeChart();
  //   }
  // },
  data() {
    return {
      // Bot Chat data
      showBot: false,
      hidingBot: false,
      showMessage: false,
      hidingMessage: false,
      isTyping: false,
      botMessage: "",
      typedContent: "", // Add this for the typing effect
      botObserver: null,
      botHideTimer: null,
      words: [], // For word-by-word typing
      currentWordIndex: 0,
      typingSpeed: 50, // milliseconds between words
      typingTimer: null,
      messageManuallyToggled: false, // Add this new property to track if the message was manually toggled
      activePieChart: "Income",
      showForecast: false,

      userId: this.$store.getters["users/userId"],
      firstName:
        this.$store.getters["users/currentUser"]?.identityData?.firstName || "",
      displayName: this.$store.getters["users/userDisplayName"],
      profilePic: this.$store.getters["users/userProfileImage"],
      templateChat: "", // Will be set dynamically
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
      'Savings', 
      'Investment', 
      'Entertainment',
      'Education',
      'Emergency Fund',
      'Vehicle',
      'Vacation',
      'Health'
      ],
      selectedCategory: '',
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
      serverAccountBalance: 0, // New state to store account balance from server
      showToast: false,
      toastMessage: "",
      showAddMoneyModal: false,
      showGoalDetailsModal: false,
      selectedGoal: null,
      isChartLoading: false, // New state to track chart loading
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
        .filter((transaction) => {
          // Income có amount âm
          return (
            transaction.type === "Income" ||
            (transaction.type === "revenue" && transaction.amount < 0)
          );
        })
        .reduce(
          (total, transaction) => total + Math.abs(transaction.amount),
          0
        ); // Luôn dùng giá trị tuyệt đối
    },

    totalExpense() {
      return this.transactions
        .filter((transaction) => {
          // Expense có amount dương
          return (
            transaction.type === "Expense" ||
            (transaction.type === "revenue" && transaction.amount > 0)
          );
        })
        .reduce(
          (total, transaction) => total + Math.abs(transaction.amount),
          0
        ); // Luôn dùng giá trị tuyệt đối
    },

    // Sửa cách tính accountBalance để lấy từ trường balance của transaction mới nhất
    accountBalance() {
      return this.totalRevenue - this.totalExpense;
    },
  },
  
  mounted() {
    // if (!this.isAuthenticated) {
    //   this.$router.push("/");
      // return;
    // }


    this.retrieveGoals();

    // Lấy account balance từ server
    this.getAccountBalance();

    // Fetch transactions và đảm bảo nó hoàn thành trước khi thực hiện các bước tiếp theo
    this.fetchTransactions().then(() => {
      // Xử lý URL params sau khi đã có dữ liệu
      this.processURLParams();

      // Thiết lập bot observer sau khi dữ liệu đã được tải
      this.$nextTick(() => {
        this.setupBotObserver();
      });
    });

    // Thiết lập auto-refresh
    this.refreshInterval = setInterval(() => {
      this.refreshData();
      this.getAccountBalance(); // Cập nhật account balance mỗi lần refresh
    }, 10000);

    this.templateChat = this.generateBotMessage();
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
  methods: {
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
        const userId = this.$store.getters["users/userId"];
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/users/${userId}`
        );

        if (response && response.data && response.data.bankingAccountData) {
          // Update accountBalance từ dữ liệu server
          // Lưu vào biến riêng để đảm bảo không bị ảnh hưởng bởi computed property
          this.serverAccountBalance =
            response.data.bankingAccountData.accountBalance || 0;
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
            this.showToast = true;
            this.toastMessage = this.$t('goalAddedSuccessfully');
          })
          .catch((error) => {
            console.error("Error adding goal:", error);
            this.showToast = true;
            this.toastMessage = this.$t('errorAddingGoal');
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
      try {
        this.isChartLoading = true;
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`
        );
        
        if (response && response.data) {
          const sortedTransactions = this.sortTransactionsByDate(response.data);
          this.transactions = sortedTransactions.filter(
            (tx) => tx.amount != null && !isNaN(tx.amount) && tx.date
          );
          
          // Nếu có transactions, thì recalculate balance để đảm bảo tính đúng
          if (sortedTransactions.length > 0) {
            this.recalculateBalances();
          }
        }
        // Update chatbot message after transactions are loaded
        this.templateChat = this.generateBotMessage();
        return response; // Trả về response để có thể sử dụng .then()
      } catch (error) {
        console.error("Error fetching transactions:", error);
        this.transactions = []; // Đặt mảng rỗng nếu có lỗi
        this.templateChat = this.generateBotMessage();
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

            userId: this.userId,
            type: type,
          }
        );

        // Update local state with the response data
        this.transactions.push(response.data);
        this.accountBalance = parseFloat(this.initialBalance); // Update the account balance
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
        this.accountBalance = 0;
        this.initialBalanceSet = false;
        this.showResetConfirmationModal = false;
      } catch (error) {
        console.error("Error resetting account balance:", error);
      }
    },
    editTransaction(trans) {
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
        // Save the access token and item ID as required
        this.fetchPlaidTransactions(access_token);
      } catch (error) {
        console.error("Error exchanging token", error);
      }
    },

    // Phương thức làm mới dữ liệu từ server
    async refreshData() {
      try {
        // Lấy account balance từ server trước
        await this.getAccountBalance();

        // Gọi API transaction thông thường
        await this.fetchTransactions();

        // Đợi một chút để đảm bảo dữ liệu đã được cập nhật
        setTimeout(() => {
          // Kiểm tra lại để đảm bảo transactions đã được cập nhật
          if (this.transactions && this.transactions.length > 0) {
            // Recalculate balances sau khi fetch data mới
            this.recalculateBalances();
          }
        }, 100);
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
    },
    generateBotMessage() {
      const name = this.displayName || "there";
      let summary = "";

      if (this.transactions && this.transactions.length > 0) {
        // Summarize top expense and income categories
        const expenses = this.transactions.filter(tx => tx.type === "Expense");
        const incomes = this.transactions.filter(tx => tx.type === "Income");

        // Top expense category
        const expenseCategoryTotals = {};
        for (const tx of expenses) {
          expenseCategoryTotals[tx.category] = (expenseCategoryTotals[tx.category] || 0) + Math.abs(tx.amount);
        }
        const topExpense = Object.entries(expenseCategoryTotals).sort((a, b) => b[1] - a[1])[0];

        // Top income category
        const incomeCategoryTotals = {};
        for (const tx of incomes) {
          incomeCategoryTotals[tx.category] = (incomeCategoryTotals[tx.category] || 0) + Math.abs(tx.amount);
        }
        const topIncome = Object.entries(incomeCategoryTotals).sort((a, b) => b[1] - a[1])[0];

        summary += `You have ${this.transactions.length} transactions. `;
        if (topExpense) {
          summary += `You spent the most on "${topExpense[0]}" ($${topExpense[1].toFixed(2)}). `;
        }
        if (topIncome) {
          summary += `You saved/earned the most from "${topIncome[0]}" ($${topIncome[1].toFixed(2)}). `;
        }
        summary += `Tip: Try to set a monthly budget for your top spending category, and review your savings goals regularly!`;
      } else {
        summary = 'No transactions yet. Start adding your income and expenses!';
      }

      return `Hey ${name}! 😊\nHere's your financial summary:\n\n${summary}\n\nKeep it up, ${name}, and let's make smarter financial moves together!`;
    },
    getCategoryIcon(category) {
      switch (category) {
        case 'Savings':
          return 'fas fa-piggy-bank';
        case 'Investment':
          return 'fas fa-chart-line';
        case 'Entertainment':
          return 'fas fa-film';
        case 'Education':
          return 'fas fa-book';
        case 'Emergency Fund':
          return 'fas fa-hospital';
        case 'Vehicle':
          return 'fas fa-car';
        case 'Vacation':
          return 'fas fa-plane';
        case 'Health':
          return 'fas fa-heart';
        default:
          return 'fas fa-question';
      }
    },
    openAddMoneyModal(goal) {
      this.selectedGoal = goal;
      this.showAddMoneyModal = true;
    },
    closeAddGoalModal() {
      this.showAddGoalModal = false;
    },
    closeAddMoneyModal() {
      this.showAddMoneyModal = false;
    },
    showGoalDetails(goal) {
      this.selectedGoal = goal;
      this.showGoalDetailsModal = true;
    },
    closeGoalDetailsModal() {
      this.showGoalDetailsModal = false;
    },
  },
};
</script>
<style scoped>
.GoalDashBoardContainer {
  display: flex;
  flex-direction: row;
  width: calc(100vw - 48px) !important;
  margin: 24px !important;
  padding: 32px !important;
  box-sizing: border-box;
  border-radius: 32px;
  background: var(--bg-primary);
  box-shadow: 
    0 8px 24px rgba(0,0,0,0.08),
    0 2px 8px rgba(0,0,0,0.04);
  flex-wrap: wrap;
  gap: 32px;
}

.leftPanel {
  flex: 1;
  min-width: 640px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 0;
  background-color: transparent;
}

.rightPanel {
  width: 380px;
  min-width: 380px;
  max-width: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: transparent;
}

.revenue-expense {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  width: 100%;
}

.total-spend {
  width: 100%;
  padding: 24px;
  border-radius: 20px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

.total-spend:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.total-spend h2 {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 8px 0;
  background: linear-gradient(45deg, var(--link-color), #5c6bc0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.total-spend p {
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0;
}

.total-spend transaction-card {
  background-color: var(--card-bg);
  border: 1px solid #2596be;
  border-bottom: 6px solid #2596be;
  border-radius: 8px;
}

.total-spend transaction-card:hover {
  background-color: rgba(37, 150, 190, 0.1); 
}

.total-spend revenue-card {
  background-color: var(--card-bg);
  border: 1px solid #4caf50;
  border-bottom: 6px solid #4caf50;
  border-radius: 8px;
}

.total-spend revenue-card:hover {
  background-color: rgba(76, 175, 80, 0.1); 
}

.total-spend expense-card {
  background-color: var(--card-bg);
  border: 1px solid #f44336;
  border-bottom: 6px solid #f44336;
  border-radius: 8px;
}

.total-spend expense-card:hover {
  background-color: rgba(244, 67, 54, 0.1); 
}

.total-spend balance-card {
  background-color: var(--card-bg);
  border: 1px solid orange;
  border-bottom: 8px solid orange;
  border-radius: 5px;
}

.total-spend balance-card:hover {
  background-color: rgba(255, 165, 0, 0.1); 
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
  flex-wrap: wrap;
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
  position: relative;
  width: 100%;
  height: 350px;
  min-height: 300px;
  box-sizing: border-box;
  border: 2px solid var(--border-color);
  border-radius: 16px;
  background: var(--card-bg);
  margin-bottom: 20px;
  overflow: hidden;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--card-bg);
  z-index: 10;
}

.chart-loading::after {
  content: "";
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--link-color);
  border-radius: 50%;
  animation: loading-spin 1s linear infinite;
}

@keyframes loading-spin {
  to {
    transform: rotate(360deg);
  }
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

.revenue-expense {
  /* display: flex;
  gap: 40px; /* Adjust the gap between cards */
  /* margin-top: 0;
  margin-bottom: 20px; */
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
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

.transaction-card {
  background-color: var(--card-bg);
  border: 1px solid #2596be;
  border-bottom: 6px solid #2596be;
  border-radius: 8px;
}

.transaction-card:hover {
  background-color: rgba(37, 150, 190, 0.1); 
}

.revenue-card {
  background-color: var(--card-bg);
  border: 1px solid #4caf50;
  border-bottom: 6px solid #4caf50;
  border-radius: 8px;
}

.revenue-card:hover {
  background-color: rgba(76, 175, 80, 0.1); 
}

.expense-card {
  background-color: var(--card-bg);
  border: 1px solid #f44336;
  border-bottom: 6px solid #f44336;
  border-radius: 8px;
}

.expense-card:hover {
  background-color: rgba(244, 67, 54, 0.1); 
}

.balance-card {
  background-color: var(--card-bg);
  border: 1px solid orange;
  border-bottom: 8px solid orange;
  border-radius: 5px;
}

.balance-card:hover {
  background-color: rgba(255, 165, 0, 0.1); 
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
  .total-spend {
    flex: 1 1 100%; /* full width on mobile */
  }
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
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  padding: 16px 20px;
  border-radius: 18px;
  max-width: 280px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.1);
}

.bot-message::-webkit-scrollbar {
  width: 4px;
}

.bot-message::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
}

.bot-message::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
}

.bot-message .typing-animation {
  display: flex;
  gap: 6px;
  padding: 4px;
}

.bot-message .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.8);
  opacity: 0.3;
}

.bot-message .typed-message {
  line-height: 1.6;
  font-size: 14px;
  color: rgba(255,255,255,0.9);
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

.form-group.description-group {
  display: block;
  flex-direction: unset;
  align-items: unset;
  gap: 0;
  margin-bottom: 16px;
}
.form-group.description-group label {
  display: block;
  width: 100%;
  margin-bottom: 2px;
  font-weight: 500;
  color: var(--text-primary);
  text-align: left;
}
.form-group.description-group textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  font-size: 15px;
  padding: 10px;
  margin-bottom: 4px;
}
.form-group.description-group .character-counter {
  margin-left: 0;
  text-align: right;
  color: #888;
  font-size: 13px;
  width: 100%;
}

.goal-details {
  padding: 24px 0;
}

.goal-description {
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
}

.goal-progress {
  margin-bottom: 32px;
}

.goal-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.info-item .value {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 600;
}

/* Toast animations */
@keyframes slideIn {
  from {
    transform: translateY(100px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100px);
    opacity: 0;
  }
}

.toast {
  animation: slideOut 0.3s ease forwards;
}

.toast.show {
  animation: slideIn 0.3s ease forwards;
}

/* Goal amounts */
.goal-amounts {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.goal-amounts p {
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.goal-amounts p:last-child {
  font-weight: 600;
}

/* Progress bar colors based on progress */
.progress-bar[style*="width: 100%"],
.progress-bar[style*="width:100%"] {
  background: linear-gradient(90deg, #4caf50, #8bc34a);
}

.progress-bar[style*="width: 7"],
.progress-bar[style*="width: 8"],
.progress-bar[style*="width: 9"] {
  background: linear-gradient(90deg, #ff9800, #ffc107);
}

.progress-bar[style*="width: 0"],
.progress-bar[style*="width: 1"],
.progress-bar[style*="width: 2"],
.progress-bar[style*="width: 3"],
.progress-bar[style*="width: 4"],
.progress-bar[style*="width: 5"],
.progress-bar[style*="width: 6"] {
  background: linear-gradient(90deg, #f44336, #ff5722);
}

/* Currency input styles */
.currency-input {
  display: flex;
  gap: 12px;
}

.currency-input input {
  flex: 2;
}

.currency-input select {
  flex: 1;
  min-width: 100px;
}

/* Character counter */
.character-counter {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
  margin-top: 4px;
}

/* Empty state */
.goals:empty::after {
  content: attr(data-empty-message);
  display: block;
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
  font-size: 15px;
  font-style: italic;
}

/* Loading state */
.goal.loading {
  pointer-events: none;
  opacity: 0.7;
}

.goal.loading::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: loading 1.5s infinite;
}

@keyframes loading {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.modal.show {
  opacity: 1;
  visibility: visible;
}

.modal-content {
  background: var(--card-bg);
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  transform: translateY(20px);
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  box-shadow: 0 24px 48px rgba(0,0,0,0.2);
}

.modal.show .modal-content {
  transform: translateY(0);
}

.modal-header {
  margin-bottom: 32px;
}

.modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  background: linear-gradient(45deg, var(--link-color), #5c6bc0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border-radius: 12px;
  border: 2px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: var(--link-color);
  box-shadow: 0 0 0 4px rgba(0,123,255,0.1);
  outline: none;
}

.modal-footer {
  margin-top: 32px;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
}

.modal-btn {
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.primary {
  background: var(--link-color);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0,123,255,0.2);
}

.modal-btn.primary:hover {
  background: var(--hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,123,255,0.3);
}

.modal-btn.secondary {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.modal-btn.secondary:hover {
  background: var(--border-color);
  transform: translateY(-2px);
}

/* Toast notification */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateY(100px);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
}

.toast.show {
  transform: translateY(0);
  opacity: 1;
}

.toast-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--link-color), #5c6bc0);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.toast-message {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
    padding: 24px;
  }

  .modal-footer {
    position: sticky;
    bottom: 0;
    background: var(--card-bg);
    padding: 16px 0;
    margin-top: 24px;
  }

  .toast {
    width: calc(100% - 48px);
    left: 24px;
    right: 24px;
  }
}
</style>