<template>
  <div class="transaction-history">
    <div class="transaction-history-header">
      <h3>{{ $t('investment.transactionHistory') }}</h3>
      <div class="date-picker">
        <input 
          type="date" 
          v-model="startDate" 
          @change="filterTransactions"
          class="date-input"
        />
        <input 
          type="date" 
          v-model="endDate" 
          @change="filterTransactions"
          class="date-input"
        />
      </div>
    </div>
    
    <button class="view-all-btn" @click="goToTransactionHistory">
      {{ $t('investment.viewAllTransactions') }}
    </button>

    <div class="table-container">
      <div class="table-header">
        <table>
          <thead>
            <tr>
              <th>{{ $t('investment.table.stockName') }}</th>
              <th>{{ $t('investment.table.quantity') }}</th>
              <th>{{ $t('investment.table.action') }}</th>
              <th>{{ $t('investment.table.amount') }}</th>
              <th>{{ $t('investment.table.date') }}</th>
            </tr>
          </thead>
        </table>
      </div>

      <div class="table-body-scroll">
        <div v-if="isLoading" class="loading-state">
          <div v-for="i in 5" :key="i" class="loading-row">
            <div class="loading-cell"></div>
            <div class="loading-cell"></div>
            <div class="loading-cell"></div>
            <div class="loading-cell"></div>
            <div class="loading-cell"></div>
          </div>
        </div>
        
        <table v-else>
          <tbody>
            <tr v-for="transaction in filteredTransactions" 
                :key="transaction._id"
                class="transaction-row">
              <td class="stock-cell">{{ transaction.stockSymbol }}</td>
              <td class="quantity-cell">{{ transaction.quantity }}</td>
              <td class="action-cell">
                <span :class="['action-badge', transaction.type]">
                  {{ transaction.type }}
                </span>
              </td>
              <td :class="['amount-cell', transaction.type === 'buy' ? 'minus' : 'plus']">
                {{ transaction.type === 'buy' ? '-' : '+' }}${{ calculateTotal(transaction.type, transaction.price,
                  transaction.quantity).toFixed(2) }}
              </td>
              <td class="date-cell">{{ formatDate(transaction.date) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-history {
  padding: 20px;
}

.transaction-history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.transaction-history-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000000;
}

.date-picker {
  display: flex;
  gap: 10px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #000000;
  transition: all 0.3s ease;
}

.date-input:focus {
  border-color: #000000;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.view-all-btn {
  padding: 8px 16px;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.view-all-btn:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
}

.table-container {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.table-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
}

.table-body-scroll {
  max-height: 400px;
  overflow-y: auto;
}

.transaction-row {
  transition: all 0.3s ease;
}

.transaction-row:hover {
  background: #f9fafb;
}

td {
  padding: 12px 16px;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.action-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.action-badge.buy {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-badge.sell {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.amount-cell {
  font-weight: 600;
}

.amount-cell.minus {
  color: #ef4444;
}

.amount-cell.plus {
  color: #22c55e;
}

.date-cell {
  color: #6b7280;
}

/* Loading State */
.loading-state {
  padding: 16px;
}

.loading-row {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  animation: pulse 1.5s infinite;
}

.loading-cell {
  height: 20px;
  background: #f3f4f6;
  border-radius: 4px;
  flex: 1;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>

<script>
import { ref, onMounted } from 'vue';
import api from '@/utils/api';
import store from '@/store';

export default {
  name: 'TransactionHistory',
  setup() {
    const startDate = ref('');
    const endDate = ref('');
    const transactions = ref([]);
    const filteredTransactions = ref([]);
    const isLoading = ref(true);

    const fetchTransactions = async () => {
      isLoading.value = true;
      try {
        // Ensure user data is loaded
        await store.dispatch("users/fetchCurrentUser");
        const userData = store.getters["users/currentUser"];

        if (!userData) {
          console.error('User data not available');
          isLoading.value = false;
          return;
        }

        // Fetch user's transactions from API
        const response = await api.get(`/transactions/u/${userData._id}`, {
          withCredentials: true
        });
        
        transactions.value = response.data || [];
        filteredTransactions.value = response.data || [];
        isLoading.value = false;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        // Fallback to mock data if API fails
        transactions.value = [
          {
            _id: '1',
            stockSymbol: 'AAPL',
            quantity: 10,
            type: 'buy',
            price: 150.00,
            date: new Date().toISOString()
          },
          {
            _id: '2', 
            stockSymbol: 'GOOGL',
            quantity: 5,
            type: 'sell',
            price: 2800.00,
            date: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        filteredTransactions.value = transactions.value;
        isLoading.value = false;
      }
    };

    const filterTransactions = () => {
      if (!startDate.value || !endDate.value) {
        filteredTransactions.value = transactions.value;
        return;
      }

      const start = new Date(startDate.value);
      const end = new Date(endDate.value);

      filteredTransactions.value = transactions.value.filter(transaction => {
        const date = new Date(transaction.date);
        return date >= start && date <= end;
      });
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const calculateTotal = (action, price, quantity) => {
      const total = price * quantity;
      const fee = 0.01 * total;
      return action === 'buy' ? total + fee : total - fee;
    };

    const goToTransactionHistory = () => {
      window.location.href = "https://www.google.com/";
    };

    onMounted(() => {
      fetchTransactions();
    });

    return {
      startDate,
      endDate,
      filteredTransactions,
      isLoading,
      filterTransactions,
      formatDate,
      calculateTotal,
      goToTransactionHistory
    };
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
  --button-bg: #000000;
  --button-hover-bg: #333333;
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
  padding-bottom: 100px;
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
.table-body-scroll {
  max-height: 250px; /* Adjust depending on row height */
  overflow-y: auto;
}

</style>
