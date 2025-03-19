<template>
  <div class="transaction-history">
    <div class="transaction-history-header">
      <h3>Transaction History</h3>
      <div class="date-picker">
        <input type="date" v-model="startDate" @change="filterTransactions" />
        <input type="date" v-model="endDate" @change="filterTransactions" />
      </div>
    </div>
    <button class="transaction-btn" @click="goToTransactionHistory">All Transactions</button>
    <table>
      <thead>
        <tr>
          <th>Stock Name</th>
          <th>Quantity</th>
          <th>Action</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="transaction in filteredTransactions" :key="transaction._id">
          <td>{{ transaction.stockSymbol }}</td>
          <td>{{ transaction.quantity }}</td>
          <td>{{ transaction.type }}</td>
          <td :class="transaction.type === 'buy' ? 'minus' : 'plus'">
            {{ transaction.type === 'buy' ? '-' : '+' }}${{ calculateTotal(transaction.type, transaction.price,
              transaction.quantity).toFixed(2) }}
          </td>
          <td>{{ formatDate(transaction.date) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TransactionHistory',
  data() {
    return {
      transactions: [],
      filteredTransactions: [],
      startDate: '',
      endDate: ''
    };
  },
  methods: {
    fetchTransactions() {
      const userId = this.$store.getters['users/userId'];
      axios.get(`${process.env.VUE_APP_DEPLOY_URL}/stock-transactions/u/${userId}`)
        .then(response => {
          this.transactions = response.data;
          this.filteredTransactions = response.data; // Initialize filtered transactions
        })
        .catch(error => {
          console.error('Error fetching transaction history:', error);
        });
    },
    filterTransactions() {
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        this.filteredTransactions = this.transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= start && transactionDate <= end;
        });
      } else {
        this.filteredTransactions = this.transactions; // Reset to all transactions if dates are not set
      }
    },
    goToTransactionHistory() {
      // this.$router.push('stock-simulator')
      window.location.href = "https://www.google.com/";
    },
    calculateTotal(type, price, quantity) {
      const total = price * quantity;
      const fee = 0.01 * total;
      return type === 'buy' ? total + fee : total - fee;
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    this.fetchTransactions();
  }
};
</script>

<style scoped>
/* Light & Dark Mode Variables */
:root {
  --bg-primary: white;
  --text-primary: black;
  --table-border: #dee2e6;
  --table-header-bg: #f8f9fa;
  --table-row-bg: #f2f2f2;
  --hover-bg: #e9ecef;
  --button-bg: #007bff;
  --button-hover-bg: #0056b3;
  --date-picker-bg: white;
  --date-picker-border: #ced4da;
}

:root.dark-mode {
  --bg-primary: #121212;
  --text-primary: #f5f5f5;
  --table-border: #444;
  --table-header-bg: #1e1e1e;
  --table-row-bg: #2a2a2a;
  --hover-bg: #333;
  --button-bg: #0a84ff;
  --button-hover-bg: #0077cc;
  --date-picker-bg: #1e1e1e;
  --date-picker-border: #555;
}

/* Transaction History */
.transaction-history {
  margin: 20px 0;
  padding: 0 20px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Header */
.transaction-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.transaction-history h3 {
  color: var(--button-bg);
  font-size: 1.5rem;
}

/* Date Picker */
.date-picker {
  display: flex;
  gap: 10px;
}

.date-picker input[type="date"] {
  padding: 10px;
  border-radius: 10px;
  border: 5px solid var(--date-picker-border);
  background-color: var(--date-picker-bg);
  color: var(--text-primary);
}

/* Button */
.transaction-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
  background-color: var(--button-bg);
  color: white;
}

.transaction-btn:hover {
  background-color: var(--button-hover-bg);
}

/* Table */
.transaction-history table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.transaction-history th,
.transaction-history td {
  border: 1px solid var(--table-border);
  padding: 8px;
  text-align: left;
}

.transaction-history th {
  background-color: var(--table-header-bg);
  font-weight: bold;
}

.transaction-history tr:nth-child(even) {
  background-color: var(--table-row-bg);
}

.transaction-history tbody tr:hover {
  background-color: var(--hover-bg);
}

/* Buy/Sell Colors */
.transaction-history .minus {
  color: red;
}

.transaction-history .plus {
  color: green;
}

/* Responsive */
@media (max-width: 768px) {
  .transaction-history-header {
    flex-direction: column;
  }
}

</style>
