<template>
  <div class="GoalDashBoardContainer">
    <div class="leftPanel">
      <div class="leftPanelHeader">
        <img class="profilePic" :src="profilePic" alt="profilePic" />
        <div class="headerText">
          <div class="greeting">
            {{ (h => h < 12 ? "Good Morning " : h < 18 ? "Good Afternoon " : "Good Evening ")(new Date().getHours()) }}{{ displayName }}
          </div>
          <div class="slogan">
            Manage your wallet wisely to reach your goals with ease.
          </div>
        </div>
      </div>
      <div class="revenue-expense">
        <div class="total-spend revenue-card">
          <h2>{{
                  selectedCurrency === "USD"
                    ? formatCurrency(totalRevenue)
                    : formatCurrency(convertToVND(totalRevenue))
                }}</h2>
          <p>Total Revenue</p>
        </div>

        <div class="total-spend expense-card">
          <h2>-{{
                  selectedCurrency === "USD"
                    ? formatCurrency(totalExpense)
                    : formatCurrency(convertToVND(totalExpense))
                }}</h2>
          <p>Total Expense</p>
        </div>

        <div class="total-spend">
          <div class="balance-header">
          <h2>{{
                  selectedCurrency === "USD"
                    ? formatCurrency(accountBalance)
                    : formatCurrency(convertToVND(accountBalance))
                }}</h2>
                <select
                  v-model="selectedCurrency"
                  @change="updateCurrency"
                  class="selectoutside"
                >
                  <option value="USD">USD</option>
                  <option value="VND">VND</option>
                </select>
          </div>
          <p>Account Balance</p>
        </div>
      </div>
      
      <div class="chart-container">
        <TransactionLine :transactions="transactions" />
      </div>
      <section class="transactions">
        <div class="headline-buttons">
          <h2>Daily Transactions</h2>
          <div class="buttons">
              <button @click="openModal" style="font-weight: bold;">Add</button>
              <button @click="showResetConfirmationModal = true" style="font-weight: bold;">
                Reset
              </button>
            </div>
        </div>
          <div class="transaction-box">
            <div v-if="showModal" class="modal-overlay">
              <div class="modal-content">
                <div class="modal-header">
                  <h3>Add Transaction</h3>
                </div>
                <div class="modal-body">
                  <div class="input-box">
                    <select
                      v-model="transaction.type"
                      class="input-box type-select"
                      required
                    >
                      <option value="" disabled class="input-box-placeholder">
                        Transaction Type
                      </option>
                      <option value="Income">Credited</option>
                      <option value="Expense">Debited</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Description"
                      v-model="transaction.description"
                      @input="generateRecommendations"
                      @keydown="generateRecommendations"
                      @focus="showRecommendations"
                      @blur="hideRecommendations"
                    />
                    <ul
                      v-if="recommendations.length && recommendationsVisible"
                      class="recommendation-list"
                      @mousedown.prevent
                    >
                      <li
                        v-for="(recommendation, index) in recommendations"
                        :key="index"
                        @click="selectRecommendation(recommendation)"
                        :class="{ highlighted: index === highlightedIndex }"
                      >
                        {{ recommendation }}
                      </li>
                    </ul>
                    <div class="currency-input">
                      <input
                        type="number"
                        placeholder="Amount"
                        v-model="transaction.amount"
                      />
                      <select v-model="selectedCurrency" class="selectinside">
                        <option value="USD">USD</option>
                        <option value="VND">VND</option>
                      </select>
                    </div>
                    <input
                      type="date"
                      placeholder="Date"
                      v-model="transaction.date"
                    />
                  </div>
                </div>
                <div class="modal-footer">
                  <button @click="closeModal" style="margin-right: 10px">
                    Cancel
                  </button>
                  <button @click="addTransaction">Add Transaction</button>
                </div>
              </div>
            </div>
          </div>
          <div class="transaction-list">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount ({{ selectedCurrency }})</th>
                  <th>Status</th>
                  <th>Transaction</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="trans in transactions"
                  :key="trans._id"
                  :class="{
                    income: trans.type === 'Income',
                    expense: trans.type === 'Expense',
                  }"
                >
                  <td>{{ trans.description }}</td>
                  <td>{{ formattedDate(trans.date) }}</td>
                  <td v-if="selectedCurrency === 'USD'">
                    {{ formatCurrency(trans.amount.toFixed(2)) }}
                  </td>
                  <td v-if="selectedCurrency === 'VND'">
                    {{ formatCurrency(convertToVND(trans.amount).toFixed(2)) }}
                  </td>
                  <td>
                    {{ trans.type === "Income" ? "Credited" : "Debited" }}
                  </td>
                  <td class="buttons">
                    <button
                      @click="editTransaction(trans)"
                      style="
                      margin-right: 10px;
                      padding: 6px 12px;
                      "
                    >
                      Edit
                    </button>
                    <button 
                      @click="removeTransaction(trans._id)"
                      style="
                      padding: 6px 12px;
                      "
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      </section>
    </div>

      <div class="rightPanel">
        <section class="financial-goals">
          <div class="goal-upper-part">
            <h3 class="goal-section-title">Goals</h3>
            <button class="add-goal-button" @click="showAddGoalModal = true" style="font-weight: bold;">Add Goal</button>
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
                    <p>Category: {{ goal.category }}</p>
                    <p>Total: {{ goal.targetAmount }} USD</p>
                    <p>Saved: {{ goal.currentAmount }} USD</p>
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
                        <h3>Add New Goal</h3>
                        <div class="form-group">
                            <label for="goalTitle">Goal Title</label>
                            <input id="goalTitle" type="text" placeholder="Enter your goal title" v-model="newGoal.title" required>
                        </div>
                        <div class="form-group">
                          <label for="goalDescription">Description (optional)</label>
                          <textarea 
                            id="goalDescription" 
                            placeholder="Describe your goal (max 500 words)" 
                            v-model="newGoal.description" 
                            maxlength="500" 
                            @input="updateDescriptionCount"></textarea>
                          <div class="character-counter">{{ descriptionCharCount }} / 500 characters</div>
                        </div>
                        <div class="form-group">
                            <label for="targetAmount">Total Money Needed</label>
                            <div class="currency-input">
                                <input id="targetAmount" type="number" placeholder="Total money needed" v-model="newGoal.targetAmount" required>
                                <select>
                                    <option value="USD">USD</option>
                                    <option value="VND">VND</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="currentAmount">Money Already Have</label>
                            <input id="currentAmount" type="number" placeholder="Money already have" v-model="newGoal.currentAmount">
                        </div>
                        <div class="form-group">
                            <label for="startDate">Start Date</label>
                            <input id="startDate" type="date" v-model="newGoal.startDate" required>
                        </div>
                        <div class="form-group">
                            <label for="endDate">End Date</label>
                            <input id="endDate" type="date" v-model="newGoal.endDate" required>
                        </div>
                        <div class="form-group">
                            <label for="goalCategory">Category</label>
                            <select id="goalCategory" v-model="selectedCategory">
                                <option v-for="category in categories" :key="category" :value="category">
                                    {{ category }}
                                </option>
                                <option value="new">Add New Category</option>
                            </select>
                        </div>
                        <div v-if="selectedCategory === 'new'" class="form-group">
                            <label for="newCategory">New Category</label>
                            <input id="newCategory" type="text" placeholder="Enter new category" v-model="newCategory">
                        </div>
                        <button class="add-goal-button" @click="addGoal">Add Goal</button>
                    </div>
                </div>
            </div>

        </section>
      </div>
      </div>
  <div v-if="showResetConfirmationModal" class="modal">
    <div class="modal-content">
      <h3>Reset Account Balance</h3>
      <p>
        Are you sure you want to reset your account balance? This action will
        delete all your transactions.
      </p>
      <button @click="showResetConfirmationModal = false" style="margin-right: 10px">No</button>
      <button @click="resetAccountBalance">
        Yes
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TransactionLine from "../components/goalPage/TransactionLine.vue";
import { toast } from 'vue3-toastify';
export default {
  name: 'GoalPage',
  components: {
    TransactionLine,
  },
  data() {
    return {
      userId: localStorage.getItem('token'),
      firstName: JSON.parse(localStorage.getItem('user')).identityData.firstName,
      displayName: JSON.parse(localStorage.getItem('user')).identityData.displayName,
      profilePic: JSON.parse(localStorage.getItem('user')).identityData.profilePicture,

      // goal data
      newGoal: {
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: 0,
        startDate: '',
        endDate: '',
        isAchieved: false,
        category: '',
      },
      showModal: false,
      showAddGoalModal: false,
      showAddMoneyForm: false,
      addAmount: 0,
      goalTitle: '',
      goalProgress: 0,
      categories: ['Savings', 'Investment', 'Emergency Fund', 'Vacation'],
      goals: [],
      selectedCategory: '',
      newCategory: '',
      searchQuery: '', 
      descriptionCharCount: 0,
      userId: localStorage.getItem("token"),
      firstName: JSON.parse(localStorage.getItem("user")).identityData
        .firstName,
      displayName: JSON.parse(localStorage.getItem("user")).identityData
        .displayName,
      profilePic: JSON.parse(localStorage.getItem("user")).identityData
        .profilePicture,
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
      totalRevenue: 0,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },

    // goal computed
    filteredGoals() {
      return this.goals.filter(goal => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          goal.title.toLowerCase().includes(searchLower) ||
          goal.category.toLowerCase().includes(searchLower)
        );
      });
    },

    
    totalRevenue() {
      return this.transactions
        .filter((transaction) => transaction.type === "Income") // Only "Income"
        .reduce((total, transaction) => total + transaction.amount, 0); // Sum amounts
    },
    totalExpense() {
      return this.transactions
        .filter((transaction) => transaction.type === "Expense") // Only "Expense"
        .reduce((total, transaction) => total + transaction.amount, 0); // Sum amounts
    },
  },
  methods: {
    async getAccountBalance() {
      try {
        const userId = localStorage.getItem('token');
        const api = `${process.env.VUE_APP_DEPLOY_URL}/users/${userId}`;
        const response = await axios.get(api);
        const data = response.data;
        console.log(data);
        
        this.accountBalance = data.bankingAccountData.accountBalance;
      } catch (error) {
        console.error('Error fetching financial data:', error);
        toast.error('Failed to load financial data', { autoClose: 1000 });
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
          console.error('Error fetching goals:', error);
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
          this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory;

        axios
          .post(`${process.env.VUE_APP_DEPLOY_URL}/goals`, {
            userId: this.userId,
            ...this.newGoal,
          })
          .then((response) => {
            this.goals.push(response.data);
            this.showAddGoalModal = false;
            this.newGoal = {
              title: '',
              description: '',
              targetAmount: '',
              currentAmount: 0,
              startDate: '',
              endDate: '',
              isAchieved: false,
              category: '',
            };
            this.selectedCategory = '';
            this.newCategory = '';
          })
          .catch((error) => {
            console.error('Error adding goal:', error);
          });
      } else {
        alert('Please fill in all required fields.');
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
    this.goalProgress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
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
          const response = await axios.put(`${process.env.VUE_APP_DEPLOY_URL}/goals/${this.goalId}`, {
            userId: this.userId, // Include necessary fields
            title: this.goalTitle,
            description: this.goalDescription,
            targetAmount: this.goalTargetAmount,
            currentAmount: updatedAmount,
            startDate: this.goalStartDate,
            endDate: this.goalEndDate,
            category: this.goalCategory,
            isAchieved: updatedAmount >= this.goalTargetAmount ? true : this.isAchieved, // Update isAchieved if the target is reached
          });

          // Update the local state with the new currentAmount and progress
          this.goalCurrentAmount = updatedAmount;
          this.goalProgress = ((updatedAmount / this.goalTargetAmount) * 100).toFixed(2);
          this.addAmount = 0; // Reset the input
          this.showAddMoneyForm = false; // Hide the form after adding money
          alert('Money added successfully!');
          this.retrieveGoals();
        } catch (error) {
          console.error('Error updating goal:', error);
          alert('An error occurred while adding money to the goal.');
        }
      } else {
        alert('Please enter a valid amount.');
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
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`
        );
        this.transactions = this.sortTransactionsByDate(response.data);
        if (this.transactions.length > 0) {
          this.accountBalance = this.transactions[0].balance; // Assuming the most recent transaction is the first one after sorting
          this.initialBalanceSet = true;
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
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
          let amountInUSD = this.transaction.amount;

          // Convert amount to USD if the selected currency is VND
          if (this.selectedCurrency === "VND") {
            amountInUSD = this.convertVNDToUSD(this.transaction.amount);
          }

          const latestTransaction =
            this.transactions.length > 0
              ? this.transactions[0] // After sorting, the latest transaction is at the beginning
              : null;
          const latestBalance = latestTransaction
            ? latestTransaction.balance
            : 0;

          const newBalance =
            latestBalance +
            (this.transaction.type === "Income" ? amountInUSD : -amountInUSD); // Subtract for Expense

          const response = await axios.post(
            `${process.env.VUE_APP_DEPLOY_URL}/transactions`,
            {
              ...this.transaction,
              amount: amountInUSD,
              balance: newBalance,
              userId: this.userId,
            }
          );

          // Insert the new transaction at the beginning of the array
          this.transactions.unshift(response.data);
          this.accountBalance = newBalance; // Update the balance with the new transaction
          this.transaction.description = "";
          this.transaction.amount = null;
          this.transaction.date = "";
          this.transaction.type = "";
        } catch (error) {
          console.error("Error adding transaction:", error);
        }
        this.showModal = false;
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
      this.showModal = true;
    },
    recalculateBalances() {
      let balance = 0;
      for (let transaction of this.transactions) {
        balance += transaction.amount;
        transaction.balance = balance;
      }
      this.accountBalance = balance;
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
  },
  mounted() {
    if (!this.isAuthenticated) {
      this.$router.push('/');
    }
    this.getAccountBalance();
    this.retrieveGoals();

    this.fetchTransactions();
    this.processURLParams();
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
  background-color: rgb(31, 126, 53);
}

.transactionContainer {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: auto;
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
  width: 100%;
  height: auto;
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

.modal-text-content {
  padding: 20px;
}

.add-money-form {
  margin-top: 20px;
}

.add-money-form input {
  margin-top: 10px;
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
  margin-bottom: 15px;
  font-family: 'Space Grotesk', sans-serif;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  font-family: 'Space Grotesk', sans-serif;
  transition: border-color 0.3s ease;
  resize: none;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: var(--link-color);
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.currency-input {
  display: flex;
  align-items: center;
}

.currency-input input {
  margin-right: 10px;
  flex: 1;
}

.currency-input select {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 16px;
  font-family: 'Space Grotesk', sans-serif;
  transition: border-color 0.3s ease;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.currency-input select:focus {
  border-color: var(--link-color);
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

#addAmount {
  margin-bottom: 10px;
}

.character-counter {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
  text-align: right;
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

  .leftPanel, .rightPanel {
    width: 100%;
    background-color: var(--bg-primary);
  }

  .leftPanelHeader, .panelOverview, .graphContainer, .transactionContainer {
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
  justify-content: center; /* Center items vertically */
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
  display:flex;
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

.chart-container {
  width: 100%;
  /* max-height: 800px;  */
  box-sizing: border-box;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background-color: var(--card-bg);
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
  margin-bottom: 20px;
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

.modal-content {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 500px;
}

.modal-content input {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  width: 100%;
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
  padding: 20px;
  border-radius: 5px;
  width: 500px;
  max-width: 90%;
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
  border: 1px solid #4CAF50;
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

/* Responsive Modal Adjustments */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-width: 400px;
    padding: 15px;
    margin: 10px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 8px;
    font-size: 14px;
  }

  .currency-input {
    flex-direction: column;
    gap: 10px;
  }

  .currency-input select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    max-width: 320px;
    padding: 10px;
    margin: 5px;
  }

  .form-group label {
    font-size: 14px;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 6px;
    font-size: 13px;
  }

  .modal-text-content h3 {
    font-size: 18px;
    margin-bottom: 10px;
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
</style>