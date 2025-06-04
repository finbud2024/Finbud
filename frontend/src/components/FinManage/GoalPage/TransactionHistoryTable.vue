<template>
  <div class="transaction-history">
    <div class="table-header">
      <div class="header-info">
        <h3>
          <font-awesome-icon icon="fa-solid fa-list" />
          Transaction History
        </h3>
        <p>{{ filteredTransactions.length }} transactions found</p>
      </div>
      
      <div class="header-controls">
        <div class="filter-group">
          <select v-model="typeFilter" class="filter-select">
            <option value="">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          
          <select v-model="categoryFilter" class="filter-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          
          <select v-model="timeFilter" class="filter-select">
            <option value="">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
        
        <div class="search-box">
          <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search transactions..."
            class="search-input"
          />
        </div>
        
        <button class="export-btn" @click="exportTransactions">
          <font-awesome-icon icon="fa-solid fa-download" />
          Export
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="summary-card income">
        <div class="card-icon">
          <font-awesome-icon icon="fa-solid fa-arrow-up" />
        </div>
        <div class="card-content">
          <h4>${{ formatNumber(totalIncome) }}</h4>
          <p>Total Income</p>
        </div>
      </div>
      
      <div class="summary-card expense">
        <div class="card-icon">
          <font-awesome-icon icon="fa-solid fa-arrow-down" />
        </div>
        <div class="card-content">
          <h4>${{ formatNumber(Math.abs(totalExpense)) }}</h4>
          <p>Total Expense</p>
        </div>
      </div>
      
      <div class="summary-card net" :class="{ 'positive': netAmount >= 0, 'negative': netAmount < 0 }">
        <div class="card-icon">
          <font-awesome-icon :icon="netAmount >= 0 ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'" />
        </div>
        <div class="card-content">
          <h4>${{ formatNumber(netAmount) }}</h4>
          <p>Net Amount</p>
        </div>
      </div>
      
      <div class="summary-card balance">
        <div class="card-icon">
          <font-awesome-icon icon="fa-solid fa-wallet" />
        </div>
        <div class="card-content">
          <h4>${{ formatNumber(currentBalance) }}</h4>
          <p>Current Balance</p>
        </div>
      </div>
    </div>

    <!-- Transaction Table -->
    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading transactions...</p>
      </div>
      
      <div v-else-if="filteredTransactions.length === 0" class="empty-state">
        <font-awesome-icon icon="fa-solid fa-receipt" />
        <h4>No transactions found</h4>
        <p>{{ searchQuery || typeFilter || categoryFilter ? 'Try adjusting your filters' : 'Start by adding your first transaction via the chatbot' }}</p>
      </div>
      
      <table v-else class="transactions-table">
        <thead>
          <tr>
            <th @click="setSortField('date')" class="sortable">
              Date
              <font-awesome-icon 
                v-if="sortField === 'date'" 
                :icon="sortOrder === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down'"
              />
            </th>
            <th @click="setSortField('description')" class="sortable">
              Description
              <font-awesome-icon 
                v-if="sortField === 'description'" 
                :icon="sortOrder === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down'"
              />
            </th>
            <th @click="setSortField('category')" class="sortable">
              Category
              <font-awesome-icon 
                v-if="sortField === 'category'" 
                :icon="sortOrder === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down'"
              />
            </th>
            <th @click="setSortField('type')" class="sortable">
              Type
              <font-awesome-icon 
                v-if="sortField === 'type'" 
                :icon="sortOrder === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down'"
              />
            </th>
            <th @click="setSortField('amount')" class="sortable">
              Amount
              <font-awesome-icon 
                v-if="sortField === 'amount'" 
                :icon="sortOrder === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down'"
              />
            </th>
            <th @click="setSortField('balance')" class="sortable">
              Balance
              <font-awesome-icon 
                v-if="sortField === 'balance'" 
                :icon="sortOrder === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down'"
              />
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="transaction in paginatedTransactions" 
            :key="transaction._id"
            class="transaction-row"
            :class="{ 'income-row': transaction.type === 'Income', 'expense-row': transaction.type === 'Expense' }"
          >
            <td class="date-cell">
              <span class="date-main">{{ formatDate(transaction.date) }}</span>
              <span class="date-time">{{ formatTime(transaction.date) }}</span>
            </td>
            <td class="description-cell">
              <div class="description-content">
                <span class="description-text">{{ transaction.description }}</span>
                <div class="category-chip" :class="getCategoryClass(transaction.category)">
                  <font-awesome-icon :icon="getCategoryIcon(transaction.category, transaction.type)" />
                  {{ transaction.category }}
                </div>
              </div>
            </td>
            <td class="category-cell">
              {{ transaction.category }}
            </td>
            <td class="type-cell">
              <span class="type-badge" :class="transaction.type.toLowerCase()">
                <font-awesome-icon :icon="transaction.type === 'Income' ? 'fa-solid fa-plus' : 'fa-solid fa-minus'" />
                {{ transaction.type }}
              </span>
            </td>
            <td class="amount-cell" :class="{ 'positive': transaction.amount > 0, 'negative': transaction.amount < 0 }">
              <span class="amount-value">
                {{ transaction.amount > 0 ? '+' : '' }}${{ formatNumber(Math.abs(transaction.amount)) }}
              </span>
            </td>
            <td class="balance-cell">
              <span class="balance-value">${{ formatNumber(transaction.balance) }}</span>
            </td>
            <td class="actions-cell">
              <button class="action-btn edit" @click="editTransaction(transaction)" title="Edit">
                <font-awesome-icon icon="fa-solid fa-edit" />
              </button>
              <button class="action-btn delete" @click="deleteTransaction(transaction)" title="Delete">
                <font-awesome-icon icon="fa-solid fa-trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="currentPage = 1" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        First
      </button>
      <button 
        @click="currentPage--" 
        :disabled="currentPage === 1"
        class="page-btn"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-left" />
      </button>
      
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }} ({{ filteredTransactions.length }} transactions)
      </span>
      
      <button 
        @click="currentPage++" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        <font-awesome-icon icon="fa-solid fa-chevron-right" />
      </button>
      <button 
        @click="currentPage = totalPages" 
        :disabled="currentPage === totalPages"
        class="page-btn"
      >
        Last
      </button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faList, faSearch, faDownload, faArrowUp, faArrowDown, 
  faChartLine, faWallet, faReceipt, 
  faSortUp, faSortDown, faPlus, faMinus, faEdit, faTrash,
  faChevronLeft, faChevronRight, faMoneyBillWave, faShoppingCart,
  faHome, faCar, faUtensils, faGamepad, faGraduationCap,
  faMedkit, faPlane, faGift, faHandHoldingDollar, faCoins
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faList, faSearch, faDownload, faArrowUp, faArrowDown, 
  faChartLine, faWallet, faReceipt, 
  faSortUp, faSortDown, faPlus, faMinus, faEdit, faTrash,
  faChevronLeft, faChevronRight, faMoneyBillWave, faShoppingCart,
  faHome, faCar, faUtensils, faGamepad, faGraduationCap,
  faMedkit, faPlane, faGift, faHandHoldingDollar, faCoins
)

export default {
  name: 'TransactionHistoryTable',
  components: {
    FontAwesomeIcon
  },
  props: {
    transactions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      searchQuery: '',
      typeFilter: '',
      categoryFilter: '',
      timeFilter: '',
      sortField: 'date',
      sortOrder: 'desc',
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    categories() {
      const cats = new Set()
      this.transactions.forEach(t => cats.add(t.category))
      return Array.from(cats).sort()
    },
    filteredTransactions() {
      let filtered = [...this.transactions]

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(t =>
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query)
        )
      }

      // Type filter
      if (this.typeFilter) {
        filtered = filtered.filter(t => t.type === this.typeFilter)
      }

      // Category filter
      if (this.categoryFilter) {
        filtered = filtered.filter(t => t.category === this.categoryFilter)
      }

      // Time filter
      if (this.timeFilter) {
        const now = new Date()
        const startDate = new Date()

        switch (this.timeFilter) {
          case 'today':
            startDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setMonth(now.getMonth() - 1)
            break
          case 'quarter':
            startDate.setMonth(now.getMonth() - 3)
            break
        }

        filtered = filtered.filter(t => new Date(t.date) >= startDate)
      }

      // Sort
      filtered.sort((a, b) => {
        let aVal = a[this.sortField]
        let bVal = b[this.sortField]

        if (this.sortField === 'date') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }

        if (this.sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })

      return filtered
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredTransactions.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / this.itemsPerPage)
    },
    totalIncome() {
      return this.transactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0)
    },
    totalExpense() {
      return this.transactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0)
    },
    netAmount() {
      return this.totalIncome + this.totalExpense // expense is negative
    },
    currentBalance() {
      return this.transactions.length > 0 ? 
        this.transactions[this.transactions.length - 1].balance : 0
    }
  },
  methods: {
    formatNumber(value) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(value || 0)
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    },
    formatTime(date) {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    setSortField(field) {
      if (this.sortField === field) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortOrder = 'desc'
      }
      this.currentPage = 1
    },
    getCategoryClass(category) {
      const categoryMap = {
        'Food & Groceries': 'food',
        'Housing & Utilities': 'housing',
        'Transportation': 'transport',
        'Health & Wellness': 'health',
        'Lifestyle & Subscriptions': 'lifestyle',
        'Salary': 'salary',
        'Freelance & Side Job': 'freelance',
        'Allowance': 'allowance',
        'Investment Return': 'investment',
        'Gift': 'gift',
        'Refund': 'refund'
      }
      return categoryMap[category] || 'default'
    },
    getCategoryIcon(category, type) {
      const incomeIcons = {
        'Salary': 'fa-solid fa-money-bill-wave',
        'Freelance & Side Job': 'fa-solid fa-hand-holding-dollar',
        'Allowance': 'fa-solid fa-gift',
        'Investment Return': 'fa-solid fa-coins',
        'Gift': 'fa-solid fa-gift',
        'Refund': 'fa-solid fa-hand-holding-dollar'
      }

      const expenseIcons = {
        'Food & Groceries': 'fa-solid fa-utensils',
        'Housing & Utilities': 'fa-solid fa-home',
        'Transportation': 'fa-solid fa-car',
        'Health & Wellness': 'fa-solid fa-medkit',
        'Lifestyle & Subscriptions': 'fa-solid fa-gamepad'
      }

      if (type === 'Income') {
        return incomeIcons[category] || 'fa-solid fa-plus'
      } else {
        return expenseIcons[category] || 'fa-solid fa-shopping-cart'
      }
    },
    editTransaction(transaction) {
      this.$emit('edit-transaction', transaction)
    },
    deleteTransaction(transaction) {
      if (confirm(`Are you sure you want to delete this transaction: "${transaction.description}"?`)) {
        this.$emit('delete-transaction', transaction)
      }
    },
    exportTransactions() {
      const csvContent = this.generateCSV()
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    },
    generateCSV() {
      const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Balance']
      const rows = this.filteredTransactions.map(t => [
        this.formatDate(t.date),
        `"${t.description}"`,
        t.category,
        t.type,
        t.amount,
        t.balance
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
  },
  watch: {
    filteredTransactions() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.transaction-history {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.table-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-info h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-info p {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  min-width: 120px;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
}

.search-input {
  padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 200px;
}

.export-btn {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: background 0.2s ease;
}

.export-btn:hover {
  background: #2563eb;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #f1f5f9;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.summary-card.income .card-icon {
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
}

.summary-card.expense .card-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.summary-card.net.positive .card-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.summary-card.net.negative .card-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.summary-card.balance .card-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.card-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.card-content p {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
}

/* Table */
.table-container {
  min-height: 300px;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #94a3b8;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state svg {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  background: #f8fafc;
  color: #374151;
  font-weight: 600;
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
}

.transactions-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

.transactions-table th.sortable:hover {
  background: #f1f5f9;
}

.transaction-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s ease;
}

.transaction-row:hover {
  background: #f8fafc;
}

.transaction-row.income-row {
  border-left: 4px solid #10b981;
}

.transaction-row.expense-row {
  border-left: 4px solid #ef4444;
}

.transactions-table td {
  padding: 1rem;
  vertical-align: top;
}

.date-cell {
  min-width: 120px;
}

.date-main {
  display: block;
  font-weight: 500;
  color: #1a1a1a;
}

.date-time {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.description-cell {
  min-width: 200px;
}

.description-text {
  display: block;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.category-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.75rem;
  color: #64748b;
}

.category-chip.food { background: #fef3c7; color: #92400e; }
.category-chip.housing { background: #dbeafe; color: #1e40af; }
.category-chip.transport { background: #f3e8ff; color: #7c3aed; }
.category-chip.health { background: #dcfce7; color: #166534; }
.category-chip.lifestyle { background: #fce7f3; color: #be185d; }
.category-chip.salary { background: #d1fae5; color: #065f46; }
.category-chip.freelance { background: #ddd6fe; color: #5b21b6; }

.type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.type-badge.income {
  background: #dcfce7;
  color: #166534;
}

.type-badge.expense {
  background: #fee2e2;
  color: #991b1b;
}

.amount-cell.positive {
  color: #059669;
}

.amount-cell.negative {
  color: #dc2626;
}

.amount-value {
  font-weight: 600;
  font-size: 0.95rem;
}

.balance-value {
  font-weight: 500;
  color: #374151;
}

.actions-cell {
  width: 80px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.action-btn.edit {
  background: #f0f9ff;
  color: #0369a1;
}

.action-btn.edit:hover {
  background: #0369a1;
  color: white;
}

.action-btn.delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-btn.delete:hover {
  background: #dc2626;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  color: #374151;
  font-size: 0.9rem;
}

.page-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #64748b;
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .header-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .table-container {
    overflow-x: auto;
  }
  
  .transactions-table {
    min-width: 700px;
  }
}
</style> 