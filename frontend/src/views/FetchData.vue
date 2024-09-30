<template>
  <div class="homepage">
    <header class="header">
      <div class="header-content">
        <div class="header-icons">
          <i class="fas fa-phone"></i>
          <i class="fas fa-bell"></i>
        </div>
        <div class="header-greeting">
          <h1>
            Hello, <span>{{ firstName }}</span>👋
          </h1>
          <p>A step towards financial freedom before the age of 30!</p>
        </div>
      </div>
    </header>
    <section class="assets">
      <div class="assets-value">
        <p>31,340.43 US$</p>
        <p>-$49.83 (-0.20%) Today</p>
      </div>
      <div class="assets-graph">
        <img src="@/assets/stockTri.png" alt="Assets Graph" />
        <p class="assets-description">
          At just 22 years old, <span>{{ displayName }}</span> from Vietnam has
          amassed an impressive $31,340.43 in assets. This remarkable
          achievement places him among the top 5% of his peers, demonstrating
          exceptional financial acumen and strategic foresight.
        </p>
      </div>
    </section>
    <section class="transactions">
      <h2>Daily Transactions</h2>
      <div class="transaction-container">
        <div class="transaction-box">
          <div class="input-box">
            <select v-model="transaction.type" class="input-box type-select" required>
              <option value="" disabled class="input-box-placeholder">Transaction Type</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Loan/Debt">Loan/Debt</option>
            </select>
            <input type="text" placeholder="Description" v-model="transaction.description"
              @input="generateRecommendations" @keydown="generateRecommendations" @focus="showRecommendations"
              @blur="hideRecommendations" />
            <ul v-if="recommendations.length && recommendationsVisible" class="recommendation-list" @mousedown.prevent>
              <li v-for="(recommendation, index) in recommendations" :key="index"
                @click="selectRecommendation(recommendation)" :class="{ highlighted: index === highlightedIndex }">
                {{ recommendation }}
              </li>
            </ul>
            <input type="number" placeholder="Amount" v-model="transaction.amount" />
            <input type="date" placeholder="Date" v-model="transaction.date" />
            <input type="notes" placeholder="Notes" v-model="transaction.notes" />
          </div>
          <div class="balance-and-button">
            <button @click="addTransaction">Add Transaction</button>
            <div class="balance">
              Account Balance: {{ formatCurrency(this.accountBalance) }}
            </div>
            <button @click="handleBalanceButtonClick">
              {{
                initialBalanceSet
                  ? "Reset Account Balance"
                  : "Set Your Account Balance"
              }}
            </button>
            <div class="currency-selector">
              <label for="currency">Choose Currency:</label>
              <select v-model="selectedCurrency" @change="updateCurrency">
                <option value="USD">USD</option>
                <option value="VND">VND</option>
              </select>
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
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trans in transactions" :key="trans._id" :class="{
                income: trans.type === 'Income',
                expense: trans.type === 'Expense',
                'loan-debt': trans.type === 'Loan/Debt'
              }">
                <td>{{ trans.description }}</td>
                <td>{{ formattedDate(trans.date) }}</td>
                <td v-if="selectedCurrency === 'USD'">
                  {{ formatCurrency(trans.amount.toFixed(2)) }}
                </td>
                <td v-if="selectedCurrency === 'VND'">
                  {{ formatCurrency(convertToVND(trans.amount).toFixed(2)) }}
                </td>
                <td>{{ trans.type }}</td>
                <td>
                  <button @click="editTransaction(trans)">Edit</button>
                  <button @click="removeTransaction(trans._id)">Remove</button>
                </td>
                <td>{{ trans.notes }}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </section>
    <div class="chart-toggle-buttons">
      <button @click="showLineChart = true" :class="{ active: showLineChart }">
        Line Chart
      </button>
      <button @click="showLineChart = false" :class="{ active: !showLineChart }">
        Bar Chart
      </button>
    </div>
    <section class="transaction-chart">
      <div class="chart-container">
        <TransactionLine v-if="showLineChart" :transactions="transactions" />
        <TransactionBar v-else :transactions="transactions" />
      </div>
    </section>
    <section class="financial-goals">
      <h2>Your Financial Goals</h2>
      <button class="add-goal-button" @click="showAddGoalModal = true">
        Add Goal
      </button>
      <div class="goals">
        <div class="goal" v-for="goal in goals" :key="goal.id" :style="goalStyle(goal.progress)"
          @click="showGoalProgress(goal.name, goal.progress)">
          <i :class="goal.icon"></i>
          <p>{{ goal.name }}<br />{{ goal.totalMoney }} VND</p>
        </div>
      </div>
    </section>
    <div v-if="showModal" class="modal" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <h3>{{ goalTitle }}</h3>
        <p>Completion: {{ goalProgress }}%</p>
        <div class="progress-bar">
          <div class="progress" :style="{ width: goalProgress + '%' }"></div>
        </div>
      </div>
    </div>
    <div v-if="showAddGoalModal" class="modal" @click="showAddGoalModal = false">
      <div class="modal-content" @click.stop>
        <h3>Add New Goal</h3>
        <input type="text" placeholder="Name of the goal" v-model="newGoal.name" />
        <input type="text" placeholder="Icon class (e.g., 'fas fa-home')" v-model="newGoal.icon" />
        <input type="number" placeholder="Total money needed" v-model="newGoal.totalMoney" />
        <input type="number" placeholder="Money already have" v-model="newGoal.moneyHave" />
        <button @click="addGoal">Add Goal</button>
      </div>
    </div>
    <div v-if="showEditTransactionModal" class="modal" @click="showEditTransactionModal = false">
      <div class="modal-content" @click.stop>
        <h3>Edit Transaction</h3>
        <input type="text" v-model="editTransactionData.description" />
        <input type="number" v-model="editTransactionData.amount" />
        <button @click="updateTransaction">Update Transaction</button>
      </div>
    </div>
    <div v-if="showSetBalanceModal" class="modal" @click="showSetBalanceModal = false">
      <div class="modal-content" @click.stop>
        <h3>Set Initial Balance</h3>
        <input type="number" placeholder="Initial Balance" v-model="initialBalance" />
        <button @click="setInitialBalance">Set Balance</button>
      </div>
    </div>
    <div v-if="showResetConfirmationModal" class="modal" @click="showResetConfirmationModal = false">
      <div class="modal-content" @click.stop>
        <h3>Reset Account Balance</h3>
        <p>
          Are you sure you want to reset your account balance? This action will
          delete all your transactions.
        </p>
        <button @click="resetAccountBalance">Yes</button>
        <button @click="showResetConfirmationModal = false">No</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TransactionLine from "../components/goalPage/TransactionLine.vue";
import TransactionBar from "../components/goalPage/TransactionBar.vue";
import authStore from "@/authStore";

export default {
  name: "GoalPage",
  components: {
    TransactionLine,
    TransactionBar,
  },
  data() {
    return {
      firstName: authStore.isAuthenticated
        ? JSON.parse(localStorage.getItem("user")).identityData.firstName
        : "Guest",
      displayName: authStore.isAuthenticated
        ? JSON.parse(localStorage.getItem("user")).identityData.displayName
        : "Guest",
      showModal: false,
      showAddGoalModal: false,
      showEditTransactionModal: false,
      showSetBalanceModal: false,
      showResetConfirmationModal: false,
      goalTitle: "",
      goalProgress: 0,
      userId: localStorage.getItem("token"),
      transaction: {
        description: "",
        amount: null,
        date: "",
        notes: "",
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
      goals: [
        {
          id: 1,
          name: "Home Renovation",
          icon: "fas fa-home",
          totalMoney: "300-350 million",
          moneyHave: "150 million",
          progress: 50,
        },
        {
          id: 2,
          name: "New Sofa",
          icon: "fas fa-couch",
          totalMoney: "56-75 million",
          moneyHave: "22 million",
          progress: 30,
        },
        {
          id: 3,
          name: "Buy a Tesla",
          icon: "fas fa-car",
          totalMoney: "1.9 - 2 billion",
          moneyHave: "1.3 billion",
          progress: 70,
        },
      ],
      newGoal: {
        name: "",
        icon: "",
        totalMoney: "",
        moneyHave: 0,
      },
      initialBalance: null,
      accountBalance: 0,
      initialBalanceSet: false, // New state to track if initial balance is set
      showLineChart: true, // New state to toggle between line and bar chart
      selectedCurrency: "USD", // Default currency
    };
  },
  computed: {
    authStore() {
      return authStore;
    },
  },
  methods: {
    convertToVND(amount) {
      const exchangeRate = 23000; // Example exchange rate, 1 USD = 23,000 VND
      return amount * exchangeRate;
    },
    showGoalProgress(title, progress) {
      this.goalTitle = title;
      this.goalProgress = progress;
      this.showModal = true;
    },

    // Get the transaction data of a specific user by using user's userId to display user's transaction
    async fetchTransactions() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`
        );
        this.transactions = response.data;
        if (this.transactions.length > 0) {
          this.accountBalance =
            this.transactions[this.transactions.length - 1].balance;
          this.initialBalanceSet = true; // If there are transactions, initial balance is set
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },

    // add a transaction with userId to fetch by userId
    async addTransaction() {
      if (
        this.transaction.description &&
        this.transaction.amount !== null &&
        this.transaction.date &&
        this.transaction.type
      ) {
        try {
          const latestTransaction =
            this.transactions.length > 0
              ? this.transactions[this.transactions.length - 1]
              : null;
          const latestBalance = latestTransaction
            ? latestTransaction.balance
            : 0;

          const newBalance = latestBalance + (
            this.transaction.type === 'Income'
              ? this.transaction.amount
              : this.transaction.type === 'Expense'
                ? -this.transaction.amount
                : 0 // For 'Loan/Debt' or other types
          );
          console.log(newBalance);
          const response = await axios.post(
            `${process.env.VUE_APP_DEPLOY_URL}/transactions`,
            {
              ...this.transaction, // This should include date, description, amount
              balance: newBalance,
              userId: this.userId,
            }
          );

          console.log(
            "Date being sent:",
            this.transaction.date,
            "Description:",
            this.transaction.description
          ); // Debugging output
          this.transactions.push(response.data);
          this.accountBalance = newBalance;
          this.transaction.description = "";
          this.transaction.amount = null;
          this.transaction.date = ""; // Reset date after adding transaction
          this.transaction.notes = "";
          this.transaction.type = "";
        } catch (error) {
          console.error("Error adding transaction:", error);
        }
      } else {
        console.error("Transaction description, amount, and date are required");
      }
    },

    // add a InitialBalance with userId to fetch by userId
    async setInitialBalance() {
      if (this.initialBalance !== null) {
        try {
          const response = await axios.post(
            `${process.env.VUE_APP_DEPLOY_URL}/transactions`,
            {
              description: "Initial Balance",
              amount: this.initialBalance,
              date: this.transaction.date,
              balance: this.initialBalance,
              notes: this.transaction.notes,
              userId: this.userId,
              type: this.transaction.type,
            }
          );

          this.transactions.push(response.data);
          this.accountBalance = this.initialBalance; // Set the initial balance
          this.initialBalance = null;
          this.showSetBalanceModal = false;
          this.initialBalanceSet = true; // Mark initial balance as set
        } catch (error) {
          console.error("Error setting initial balance:", error);
        }
      } else {
        console.error("Initial balance is required");
      }
    },
    handleBalanceButtonClick() {
      if (this.initialBalanceSet) {
        this.showResetConfirmationModal = true;
      } else {
        this.showSetBalanceModal = true;
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
    recalculateBalances() {
      let balance = 0;
      for (let transaction of this.transactions) {
        balance += transaction.amount;
        transaction.balance = balance;
      }
      this.accountBalance = balance;
    },
    goalStyle(progress) {
      const green = Math.min(255, (progress / 100) * 255);
      const blue = Math.min(255, ((100 - progress) / 100) * 255);
      return {
        backgroundColor: `rgb(0, ${green}, ${blue})`,
        color: "white",
      };
    },
    addGoal() {
      const progress = (this.newGoal.moneyHave / this.newGoal.totalMoney) * 100;
      this.goals.push({
        id: this.goals.length + 1,
        name: this.newGoal.name,
        icon: this.newGoal.icon,
        totalMoney: this.newGoal.totalMoney,
        moneyHave: this.newGoal.moneyHave,
        progress: progress,
      });
      this.showAddGoalModal = false;
      this.newGoal = {
        name: "",
        icon: "",
        totalMoney: "",
        moneyHave: 0,
      };
    },
    formattedDate(dateString) {
      const datePart = dateString.split("T")[0];
      const [year, month, day] = datePart.split("-");
      return `${month}/${day}/${year}`;
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
      const notes = urlParams.get("notes");
      const type = urlParams.get("type");

      if (description && amount && action && date && notes && type === "add") {
        this.transaction.description = description;
        this.transaction.date = date;
        this.transaction.amount = parseInt(amount, 10);
        this.transaction.notes = notes;
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
    if (!authStore.isAuthenticated) {
      this.$router.push("/");
    }
    this.fetchTransactions();
    this.processURLParams();
  },
  computed: {
    authStore() {
      return authStore;
    },
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  },
};
</script>

<style scoped>
.input-container {
  position: relative;
  display: inline-block;
}

.dropdown {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  background-color: #fff;
  z-index: 1000;
}

.dropdown ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown li {
  padding: 8px;
}

.dropdown li a {
  text-decoration: none;
  color: #000;
  display: block;
}

.dropdown li a:hover {
  background-color: #ddd;
}

.quiz-container {
  padding: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 5%;
  background: #f4f4f4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: transform 0.3s ease;
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

/* Assets section */
.assets {
  text-align: center;
  margin-top: 40px;
}

.assets-value {
  font-size: 1.5em;
  margin: 20px 0;
  color: #003366;
}

.assets-graph {
  position: relative;
  width: 90%;
  margin: 0 auto;
}

.assets-graph img {
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.assets-graph img:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.assets-description {
  margin-top: 20px;
  font-size: 1.2em;
  color: #333;
}

/* Transactions section */
.transactions {
  margin-top: 40px;
  text-align: center;
  border: 2px solid #1e06fb;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.transaction-container {
  display: flex;
  flex-direction: column;
}

.transaction-box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 20px;
  width: 100%;
  margin-bottom: 20px;
  position: relative;
  border-radius: 5px;
  max-height: 300px;
}

.transaction-box input {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  /* Set to 100% width */
  box-sizing: border-box;
  /* Include padding and border in the element's total width and height */
}

.balance-and-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.balance {
  margin-left: 20px;
  font-size: 1.2em;
}

.transaction-box button {
  padding: 10px 20px;
  background-color: #003366;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.transaction-box button:hover {
  background-color: #005bb5;
}

.recommendation-list {
  position: absolute;
  top: 50px;
  /* Adjust this value based on your input field height */
  left: 0;
  right: 0;
  max-height: 150px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #ccc;
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
  background-color: #f0f0f0;
}

.transaction-list {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 30px;
}

.transaction-list table {
  width: 100%;
  border-collapse: collapse;
}

.transaction-list th,
.transaction-list td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.transaction-list th {
  background-color: #f2f2f2;
}

.expense {
  background-color: rgba(255, 0, 0, 0.5);
}

.income {
  background-color: rgba(0, 255, 0, 0.5);
}

.loan-debt {
  background-color: yellow;
}

.transaction-chart {
  margin-top: 30px;
  text-align: center;
  border: 2px solid #1e06fb;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  height: auto;
  max-height: 100%;
  box-sizing: border-box;
}

.chart-container {
  width: 100%;
  height: 100%;
  /* max-height: 800px;  */
  box-sizing: border-box;
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
  justify-content: center;
  margin-top: 30px;
}

.chart-toggle-buttons button {
  padding: 10px 20px;
  margin: 0 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
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

select:invalid {
  color: gray;
}

.type-select {
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  padding-left: 5px;
}

.chart-toggle-buttons button:hover {
  background-color: #005bb5;
}

.chart-toggle-buttons button.active {
  background-color: #005bb5;
}

/* Financial goals */
.financial-goals {
  margin-top: 40px;
}

.add-goal-button {
  margin-bottom: 20px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.goal {
  text-align: center;
  padding: 60px;
  margin: 10px;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
  background: #ffffff;
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
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.modal-content button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.modal-content button:hover {
  background-color: #005bb5;
}

.progress-bar {
  width: 100%;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 20px;
}

.progress {
  height: 20px;
  background: #007bff;
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

  .transaction-container {
    flex-direction: column;
  }

  .goal {
    flex: 1 1 100%;
  }

  .transaction-chart {
    padding: 10px;
  }

  .chart-wrapper {
    height: auto;
  }
}
</style>
