<template>
  <div class="transaction-history">
    <h3>Transaction History</h3>
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
        <tr v-for="transaction in transactions" :key="transaction._id">
          <td>{{ transaction.stockSymbol }}</td>
          <td>{{ transaction.quantity }}</td>
          <td>{{ transaction.type }}</td>
          <td :class="transaction.type === 'buy' ? 'minus' : 'plus'">
            {{ transaction.type === 'buy' ? '-' : '+' }}${{ calculateTotal(transaction.type, transaction.price, transaction.quantity).toFixed(2) }}
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
      transactions: []
    };
  },
  methods: {
    fetchTransactions() {
      const userId = '66974fea75fa96762507ca06';
      axios.get(`${process.env.VUE_APP_DEPLOY_URL}/stock-transactions/u/${userId}`)
        .then(response => {
          this.transactions = response.data;
        })
        .catch(error => {
          console.error('Error fetching transaction history:', error);
        });
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
  padding: 0 20px; /* Add padding for better alignment */
}

.transaction-history h3 {
  margin-bottom: 10px;
  color: #007bff; /* Match the styling of other headers */
  font-size: 1.5rem; /* Match the font size of other headers */
}

.transaction-history table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px; /* Add margin to separate from the header */
}

.transaction-history th, .transaction-history td {
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
</style>
