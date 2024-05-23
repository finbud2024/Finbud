<template>
  <div class="homepage">
    <header class="header">
      <div class="header-content">
        <div class="header-icons">
          <i class="fas fa-phone"></i>
          <i class="fas fa-bell"></i>
        </div>
        <div class="header-greeting">
          <h1>Hello, Trí <span>👋</span></h1>
          <p>A step towards financial freedom before the age of 30!</p>
        </div>
      </div>
    </header>
    <section class="assets">
      <div class="assets-value">
        <p>24,340.43 US$</p>
        <p>-$49.83 (-0.20%) Today</p>
      </div>
      <div class="assets-graph">
        <img src="@/assets/stockTri.png" alt="Assets Graph">
        <p class="assets-description">
          At just 22 years old, Trí Bui from Vietnam has amassed an impressive $24,340.43 in assets. This remarkable achievement places him among the top 5% of his peers, demonstrating exceptional financial acumen and strategic foresight.
        </p>
      </div>
    </section>
    <section class="transactions">
      <h2>Daily Transactions</h2>
      <div class="transaction-container">
        <div class="transaction-box">
          <input type="text" placeholder="Description" v-model="transaction.description">
          <input type="number" placeholder="Amount" v-model="transaction.amount">
          <button @click="addTransaction">Add Transaction</button>
        </div>
        <div class="transaction-list">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="trans in transactions" :key="trans.id" :class="{ 'high-spending': trans.amount > 100 }">
                <td>{{ trans.date }}</td>
                <td>{{ trans.description }}</td>
                <td>{{ trans.amount }}</td>
                <td>
                  <button @click="editTransaction(trans)">Edit</button>
                  <button @click="removeTransaction(trans.id)">Remove</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
    <section class="financial-goals">
      <h2>Your Financial Goals</h2>
      <button class="add-goal-button" @click="showAddGoalModal = true">Add Goal</button>
      <div class="goals">
        <div class="goal" v-for="goal in goals" :key="goal.id" :style="goalStyle(goal.progress)" @click="showGoalProgress(goal.name, goal.progress)">
          <i :class="goal.icon"></i>
          <p>{{ goal.name }}<br>{{ goal.totalMoney }} VND</p>
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
        <input type="text" placeholder="Name of the goal" v-model="newGoal.name">
        <input type="text" placeholder="Icon class (e.g., 'fas fa-home')" v-model="newGoal.icon">
        <input type="number" placeholder="Total money needed" v-model="newGoal.totalMoney">
        <input type="number" placeholder="Money already have" v-model="newGoal.moneyHave">
        <button @click="addGoal">Add Goal</button>
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
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      showModal: false,
      showAddGoalModal: false,
      showEditTransactionModal: false,
      goalTitle: '',
      goalProgress: 0,
      transaction: {
        description: '',
        amount: null,
      },
      editTransactionData: {
        id: null,
        description: '',
        amount: null,
      },
      transactions: [
        { id: 1, date: '2024-05-22', description: 'Groceries', amount: 120 },
        { id: 2, date: '2024-05-22', description: 'Transport', amount: 45 },
        { id: 3, date: '2024-05-21', description: 'Utilities', amount: 80 },
        { id: 4, date: '2024-05-21', description: 'Dining', amount: 60 },
        { id: 5, date: '2024-05-20', description: 'Subscription', amount: 15 },
        { id: 6, date: '2024-05-20', description: 'Coffee', amount: 5 },
        { id: 7, date: '2024-05-20', description: 'Shopping', amount: 150 },
        { id: 8, date: '2024-05-19', description: 'Rent', amount: 1000 },
        { id: 9, date: '2024-05-19', description: 'Gym', amount: 50 },
        { id: 10, date: '2024-05-19', description: 'Insurance', amount: 200 },
        { id: 11, date: '2024-05-19', description: 'Electronics', amount: 300 },
        { id: 12, date: '2024-05-19', description: 'Books', amount: 40 },
        { id: 13, date: '2024-05-19', description: 'Medical', amount: 100 },
        { id: 14, date: '2024-05-19', description: 'Parking', amount: 20 },
        { id: 15, date: '2024-05-19', description: 'Snacks', amount: 10 },
      ],
      goals: [
        { id: 1, name: 'Home Renovation', icon: 'fas fa-home', totalMoney: '300-350 million', moneyHave: '150 million', progress: 50 },
        { id: 2, name: 'New Sofa', icon: 'fas fa-couch', totalMoney: '56-75 million', moneyHave: '22 million', progress: 30 },
        { id: 3, name: 'Buy a Tesla', icon: 'fas fa-car', totalMoney: '1.9 - 2 billion', moneyHave: '1.3 billion', progress: 70 },
      ],
      newGoal: {
        name: '',
        icon: '',
        totalMoney: '',
        moneyHave: 0,
      },
    };
  },
  methods: {
    showGoalProgress(title, progress) {
      this.goalTitle = title;
      this.goalProgress = progress;
      this.showModal = true;
    },
    addTransaction() {
      if (this.transaction.description && this.transaction.amount) {
        this.transactions.push({
          id: this.transactions.length + 1,
          date: new Date().toISOString().split('T')[0],
          description: this.transaction.description,
          amount: this.transaction.amount,
        });
        this.transaction.description = '';
        this.transaction.amount = null;
      }
    },
    editTransaction(trans) {
      this.editTransactionData = { ...trans };
      this.showEditTransactionModal = true;
    },
    updateTransaction() {
      const index = this.transactions.findIndex(t => t.id === this.editTransactionData.id);
      if (index !== -1) {
        this.transactions.splice(index, 1, { ...this.editTransactionData });
        this.showEditTransactionModal = false;
      }
    },
    removeTransaction(id) {
      this.transactions = this.transactions.filter(trans => trans.id !== id);
    },
    goalStyle(progress) {
      const green = Math.min(255, (progress / 100) * 255);
      const blue = Math.min(255, ((100 - progress) / 100) * 255);
      return {
        backgroundColor: `rgb(0, ${green}, ${blue})`,
        color: 'white',
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
        name: '',
        icon: '',
        totalMoney: '',
        moneyHave: 0,
      };
    },
  },
};
</script>

<style scoped>
/* Basic styles */
.homepage {
  font-family: 'Space Grotesk', sans-serif;
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
}

.transaction-box input {
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 98%;
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

.high-spending {
  background-color: #ffcccc;
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

  .transaction-box, .transaction-list {
    width: 89%;
    padding: 5%;
  }

  .goal {
    flex: 1 1 100%;
  }
}
</style>
