<template>
  <div class="transaction-history">
    <div class="transaction-history-header">
      <h3>Transaction History</h3>
      <div class="date-picker">
        <input type="date" v-model="startDate" @change="filterTransactions" />
        <input type="date" v-model="endDate" @change="filterTransactions" />
      </div>
    </div>

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
      const userId = '66974fea75fa96762507ca06';
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
.transaction-history {
  margin: 20px 0;
  padding: 0 20px;
  /* Add padding for better alignment */
}

.transaction-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.transaction-history h3 {
  color: #007bff; /* Match the styling of other headers */
  font-size: 1.5rem; /* Match the font size of other headers */
}

.date-picker {
  display: flex;
  gap: 10px;
}

.date-picker input[type="date"] {
  padding: 10px;
  border-radius: 10px;
  border: 5px solid #ced4da;
  background-color: #fff;
}

.transaction-history table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  /* Add margin to separate from the header */
}

.transaction-history th,
.transaction-history td {
  border: 1px solid #dee2e6;
  padding: 8px;
  text-align: left;
}

.transaction-history th {
  background-color: #f8f9fa;
  font-weight: bold;
}

.transaction-history tr:nth-child(even) {
  background-color: #f2f2f2;
}

.transaction-history .minus {
  color: red;
}

.transaction-history .plus {
  color: green;
}

.transaction-history tbody tr:hover {
  background-color: #e9ecef;
}

@media (max-width: 768px) {
  .transaction-history-header {
    flex-direction: column;
  }
}
</style>
