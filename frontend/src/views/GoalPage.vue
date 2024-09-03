<template>
  <div class="homepage">
    <header class="header">
      <div class="header-content">
        <div class="header-icons">
          <i class="fas fa-phone"></i>
          <i class="fas fa-bell"></i>
        </div>
        <div class="header-greeting">
          <h1>Hello, <span>{{firstName}}</span>👋</h1>
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
        <img src="@/assets/stockTri.png" alt="Assets Graph">
        <p class="assets-description">
          At just 22 years old, <span>{{displayName}}</span> from Vietnam has amassed an impressive $31,340.43 in assets. This remarkable achievement places him among the top 5% of his peers, demonstrating exceptional financial acumen and strategic foresight.
        </p>
      </div>
    </section>
    <section class="transactions">
      <h2>Daily Transactions</h2>
      <div class="transaction-container">
        <div class="transaction-box">
          <input type="text" placeholder="Description" v-model="transaction.description" @input="generateRecommendations" @keydown="generateRecommendations" @focus="showRecommendations" @blur="hideRecommendations">
          <ul v-if="recommendations.length && recommendationsVisible" class="recommendation-list" @mousedown.prevent>
            <li v-for="(recommendation, index) in recommendations" :key="index" @click="selectRecommendation(recommendation)" :class="{ highlighted: index === highlightedIndex }">
              {{ recommendation }}
            </li>
          </ul>
          <input type="number" placeholder="Amount" v-model="transaction.amount">
          <div class="balance-and-button">
            <button @click="addTransaction">Add Transaction</button>
            <div class="balance">
              Account Balance: {{ displayBalance }} {{ selectedCurrency }}
            </div>
            <button @click="handleBalanceButtonClick">
              {{ initialBalanceSet ? 'Reset Account Balance' : 'Set Your Account Balance' }}
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
                <th>Date</th>
                <th>Description</th>
                <th>Amount (USD)</th>
                <th>Amount (VND)</th>
                <th>Transaction</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trans in transactions" :key="trans._id" :class="{ 'receiving': trans.amount > 0, 'spending': trans.amount < 0 }">
                <td>{{ formatDate(trans.date) }}</td>
                <td>{{ trans.description }}</td>
                <td v-if="selectedCurrency === 'USD'">{{ trans.amount.toFixed(2) }} USD</td>
                <td v-if="selectedCurrency === 'VND'">{{ convertToVND(trans.amount).toFixed(2) }} VND</td>
                <td>{{ trans.amount > 0 ? 'Receiving' : 'Spending' }}</td>
                <td>
                  <button @click="editTransaction(trans)">Edit</button>
                  <button @click="removeTransaction(trans._id)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <div class="chart-toggle-buttons">
        <button @click="showLineChart = true" :class="{ active: showLineChart }">Line Chart</button>
        <button @click="showLineChart = false" :class="{ active: !showLineChart }">Bar Chart</button>
      </div>
    <section class="transaction-chart">
      <div class="chart-container">
        <TransactionLine v-if="showLineChart" :transactions="transactions" />
        <TransactionBar v-else :transactions="transactions" />
      </div>
    </section>


    
    <section class="financial-goals">
      <h2 class="goal-section-title">Your Financial Goals</h2>
      <button class="add-goal-button" @click="showAddGoalModal = true">Add Goal</button>
      <div class="goals">
      <div v-for="goal in goals" :key="goal._id" class="goal" @click="showGoalProgress(goal)">
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

    </section>


    <div v-if="showModal" class="modal" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <div>
          <img src="../assets/financial-goal-mockup.jpg" alt="">
        </div>
        <div class="modal-text-content">
            <h3>{{ goalTitle }}</h3>
            <p>{{ goalDescription }}</p>
            <p>Total: {{ goalTargetAmount }} USD</p>
            <p>Saved: {{ goalCurrentAmount }} USD</p>
            <p>Completion: {{ goalProgress }}%</p>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: goalProgress + '%' }"></div>
            </div>

            <!-- Button to show the Add Money form -->
            <button class="add-goal-button" @click="toggleAddMoneyForm">
              {{ showAddMoneyForm ? 'Cancel' : 'Add Money' }}
            </button>

            <!-- Add Money form, hidden initially -->
            <div v-if="showAddMoneyForm" class="form-group add-money-form">
              <label for="addAmount">Add Money to Goal</label>
              <input id="addAmount" type="number" v-model="addAmount" placeholder="Enter amount to add">
              <button class="add-goal-button" @click="addMoneyToGoal">Add Money</button>
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
            <textarea id="goalDescription" placeholder="Describe your goal" v-model="newGoal.description"></textarea>
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
                <!-- Add more currencies as needed -->
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



    <div v-if="showEditTransactionModal" class="modal" @click="showEditTransactionModal = false">
      <div class="modal-content" @click.stop>
        <h3>Edit Transaction</h3>
        <input type="text" v-model="editTransactionData.description">
        <input type="number" v-model="editTransactionData.amount">
        <button @click="updateTransaction">Update Transaction</button>
      </div>
    </div>
    <div v-if="showSetBalanceModal" class="modal" @click="showSetBalanceModal = false">
      <div class="modal-content" @click.stop>
        <h3>Set Initial Balance</h3>
        <input type="number" placeholder="Initial Balance" v-model="initialBalance">
        <button @click="setInitialBalance">Set Balance</button>
      </div>
    </div>
    <div v-if="showResetConfirmationModal" class="modal" @click="showResetConfirmationModal = false">
      <div class="modal-content" @click.stop>
        <h3>Reset Account Balance</h3>
        <p>Are you sure you want to reset your account balance? This action will delete all your transactions.</p>
        <button @click="resetAccountBalance">Yes</button>
        <button @click="showResetConfirmationModal = false">No</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment-timezone';
import TransactionLine from '../components/goalPage/TransactionLine.vue';
import TransactionBar from '../components/goalPage/TransactionBar.vue';
import authStore from '@/authStore';



export default {
  name: 'GoalPage',
  components: {
    TransactionLine,
    TransactionBar
  },
  data() {
    return {
      userId: localStorage.getItem('token'),
      firstName: authStore.isAuthenticated ? JSON.parse(localStorage.getItem('user')).identityData.firstName : 'Guest',
      displayName: authStore.isAuthenticated ? JSON.parse(localStorage.getItem('user')).identityData.displayName : 'Guest',
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
      showAddMoneyForm: false, // Controls the visibility of the Add Money form
      addAmount: 0,
      showEditTransactionModal: false,
      showSetBalanceModal: false,
      showResetConfirmationModal: false,
      goalTitle: '',
      goalProgress: 0,
      categories: ['Savings', 'Investment', 'Emergency Fund', 'Vacation'], // Predefined categories
      transaction: {
        description: '',
        amount: null,
      },
      editTransactionData: {
        _id: null,
        description: '',
        amount: null,
      },
      transactions: [], // Initialize transactions as an empty array
      recommendations: [],
      recommendationsVisible: false,
      highlightedIndex: -1,
      possibleRecommendations: ['Groceries', 'Utilities', 'Subscription', 'Transport', 'Dining',
      'Shopping', 'Insurance', 'Entertainment', 'Healthcare', 'Education', 'Coffee', 'Medical', 'Rent', 'Electronics',
      'Gym', 'Books', 'Snacks', 'Meal', 'Bill', 'Travel'],
      goals: [],
      
      initialBalance: null,
      accountBalance: 0,
      initialBalanceSet: false, // New state to track if initial balance is set
      showLineChart: true, // New state to toggle between line and bar chart
      selectedCurrency: 'USD' // Default currency
    };
  },
  computed: {
    authStore(){
      return authStore;
    }
  },
  methods: {
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
        // Use new category if added, otherwise use selected category
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
      } catch (error) {
        console.error('Error updating goal:', error);
        alert('An error occurred while adding money to the goal.');
      }
    } else {
      alert('Please enter a valid amount.');
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
    async fetchTransactions() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`);
        this.transactions = response.data;
        if (this.transactions.length > 0) {
          this.accountBalance = this.transactions[this.transactions.length - 1].balance;
          this.initialBalanceSet = true; // If there are transactions, initial balance is set
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    },

    // add a transaction with userId to fetch by userId
    async addTransaction() {
      if (this.transaction.description && this.transaction.amount !== null) {
        try {
          // Fetch the last transaction to get the latest balance
          const latestTransaction = this.transactions.length > 0 ? this.transactions[this.transactions.length - 1] : null;
          const latestBalance = latestTransaction ? latestTransaction.balance : 0;

          // Calculate the new balance
          const newBalance = latestBalance + this.transaction.amount;

          const response = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
            ...this.transaction,
            date: moment().tz("America/New_York").format(), // Save the date in UTC-4
            balance: newBalance, // Add the balance field
            userId: this.userId
          });

          this.transactions.push(response.data);
          this.accountBalance = newBalance; // Update account balance
          this.transaction.description = '';
          this.transaction.amount = null;
        } catch (error) {
          console.error('Error adding transaction:', error);
        }
      } else {
        console.error('Transaction description and amount are required');
      }
    },

    // add a InitialBalance with userId to fetch by userId
    async setInitialBalance() {
      if (this.initialBalance !== null) {
        try {
          const response = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
            description: 'Initial Balance',
            amount: this.initialBalance,
            date: moment().tz("America/New_York").format(), // Save the date in UTC-4
            balance: this.initialBalance,
            userId: this.userId
          });

          this.transactions.push(response.data);
          this.accountBalance = this.initialBalance; // Set the initial balance
          this.initialBalance = null;
          this.showSetBalanceModal = false;
          this.initialBalanceSet = true; // Mark initial balance as set
        } catch (error) {
          console.error('Error setting initial balance:', error);
        }
      } else {
        console.error('Initial balance is required');
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
        await axios.delete(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${this.userId}`);
        this.transactions = [];
        this.accountBalance = 0;
        this.initialBalanceSet = false;
        this.showResetConfirmationModal = false;
      } catch (error) {
        console.error('Error resetting account balance:', error);
      }
    },
    editTransaction(trans) {
      this.editTransactionData = { ...trans };
      this.showEditTransactionModal = true;
    },

    // edit a transaction by transactionId
    async updateTransaction() {
      try {
        const response = await axios.put(`${process.env.VUE_APP_DEPLOY_URL}/transactions/${this.editTransactionData._id}`, this.editTransactionData);
        const index = this.transactions.findIndex(t => t._id === this.editTransactionData._id);
        if (index !== -1) {
          this.transactions.splice(index, 1, response.data.updatedTransaction);
          this.transactions = response.data.transactions; // Update the entire transactions list with recalculated balances
          this.recalculateBalances();
          this.showEditTransactionModal = false;
        }
      } catch (error) {
        console.error('Error updating transaction:', error);
      }
    },

    // delete a transaction by transactionId
    async removeTransaction(id) {
      try {
        await axios.delete(`${process.env.VUE_APP_DEPLOY_URL}/transactions/${id}`);
        this.transactions = this.transactions.filter(trans => trans._id !== id);
        this.recalculateBalances();
      } catch (error) {
        console.error('Error removing transaction:', error);
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
    goalStyle(currentAmount, targetAmount) {
      const progress = (currentAmount / targetAmount) * 100;
      return {
        width: `${Math.min(progress, 100)}%`,
      };
    },
    formatDate(dateString) {
      const date = moment(dateString).tz("America/New_York"); // Convert to Washington D.C. time zone
      return date.format("YYYY-MM-DD HH:mm");
    },
    async processURLParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const description = urlParams.get('description');
      const amount = urlParams.get('amount');
      const action = urlParams.get('action');

      if (description && amount && action === 'add') {
        this.transaction.description = description;
        this.transaction.amount = parseInt(amount, 10);
        await this.addTransaction();
      }
    },
    generateRecommendations(event) {
      const input = this.transaction.description.toLowerCase();
      if (input.length === 0) {
        this.recommendations = [];
        return;
      }
      this.recommendations = this.possibleRecommendations.filter(item => item.toLowerCase().includes(input));
      if (event.key === 'ArrowDown' && this.highlightedIndex < this.recommendations.length - 1) {
        this.highlightedIndex++;
      } else if (event.key === 'ArrowUp' && this.highlightedIndex > 0) {
        this.highlightedIndex--;
      } else if (event.key === 'Enter' && this.highlightedIndex >= 0) {
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
      this.$router.push('/');
    }
    this.fetchTransactions();
    this.processURLParams();
    this.retrieveGoals();
  },

  computed: {
    authStore(){
      return authStore;
    }
  },
  beforeUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
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

/* Header section */
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
  box-sizing: border-box;
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

/* Recommendations list */
.recommendation-list {
  position: absolute;
  top: 50px;
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

/* Transactions table */
.transaction-list {
  width: 100%;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.transaction-list table {
  width: 100%;
  border-collapse: collapse;
}

.transaction-list th, .transaction-list td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.transaction-list th {
  background-color: #f2f2f2;
}

.spending {
  background-color: rgba(255, 0, 0, 0.5);
}

.receiving {
  background-color: rgba(0, 255, 0, 0.5);
}

/* Transaction chart */
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

.chart-toggle-buttons button:hover {
  background-color: #005bb5;
}

.chart-toggle-buttons button.active {
  background-color: #005bb5;
}

/* Financial goals */
.financial-goals {
  margin-top: 40px;
  text-align: center;
}

.goal-section-title {
  margin-bottom: 0px;
  font-size: 2em;
  color: #333;
}

.add-goal-button {
  margin-top: 20px;
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
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin: 10px;
  flex: 1 1 calc(33.333% - 20px);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.goal:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.goal-image {
  z-index: 20;
  width: 100%;
  height: auto;
  border-radius: 10px 10px 0 0;
  margin-bottom: -20px; /* Overlap with goal-content */
}

.goal-content {
  background-color: #ffffff;
  border-radius: 10px;
  margin-top: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.goal-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #007bff;
}

.goal-info h3 {
  margin: 10px 0;
  font-size: 1.5em;
  color: #333;
}

.goal-info p {
  margin: 5px 0;
  font-size: 1em;
  color: #666;
}
#goalCategory{
  width: 100%;
}

.progress-bar-container {
  width: 100%;
  background-color: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
  height: 20px;
}

.progress-bar {
  height: 100%;
  background-color: #007bff;
  transition: width 0.5s ease-in-out;
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
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 500px;
  font-family: 'Space Grotesk', sans-serif;
  overflow: hidden;
}
.modal-content img {
  width: 100%;
  height: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.modal-text-content {
  padding: 20px;
}

/* Form styles */
.form-group {
  margin-bottom: 15px;
  font-family: 'Space Grotesk', sans-serif;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  font-family: 'Space Grotesk', sans-serif;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.form-group textarea {
  height: 60px;
  resize: vertical;
}

.add-money-form {
  margin-top: 20px;
  transition: all 0.3s ease-in-out;
}

.add-money-form-enter-active, .add-money-form-leave-active {
  transition: opacity 0.5s;
}

.add-money-form-enter, .add-money-form-leave-to {
  opacity: 0;
}

/* Currency input styles */
.currency-input {
  display: flex;
  align-items: center;
}

.currency-input input {
  margin-right: 10px;
  flex: 1;
}

select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  font-family: 'Space Grotesk', sans-serif;
  transition: border-color 0.3s ease;
}

.currency-input select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
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