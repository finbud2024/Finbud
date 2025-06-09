<template>
    <div class="flex-container">
      <!-- Sidebar Container -->
      <div class="sidebar">
        <aside class="sidebar-content">
          <div>
            <h1 class="title">FinBud</h1>
            <p class="subtitle">{{ $t('finCompare.title') }}</p>
            <div>
              <p class="filter-label">{{ $t('finCompare.filterByPriority') }}</p>
              <div class="filter-options">
                <label class="radio-option">
                  <input type="radio" name="priority" v-model="selectedPriority" value="savings" /> {{ $t('finCompare.priorities.maxSavings') }}
                </label>
                <label class="radio-option">
                  <input type="radio" name="priority" v-model="selectedPriority" value="fees" /> {{ $t('finCompare.priorities.lowestFees') }}
                </label>
                <label class="radio-option">
                  <input type="radio" name="priority" v-model="selectedPriority" value="flexible" /> {{ $t('finCompare.priorities.flexibleConditions') }}
                </label>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <!-- Main Content Container -->
      <div class="main-content">
        <main>
          <h2 class="main-title">{{ $t('finCompare.compare') }}</h2>
          <div v-if="loading" class="loading">{{ $t('finCompare.loading') }}</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="comparison-table-container">
            <div class="table-wrapper">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th class="table-header">{{ $t('finCompare.table.bank') }}</th>
                    <th class="table-header">{{ $t('finCompare.table.interestRate') }}</th>
                    <th class="table-header">{{ $t('finCompare.table.issuanceFee') }}</th>
                    <th class="table-header">{{ $t('finCompare.table.maxLoanTerm') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bank in banks" :key="bank.bank" :class="{ 'best-choice': isBestChoice(bank) }">
                    <td class="table-row-title">
                      {{ bank.bank }}
                      <span v-if="isBestChoice(bank)" class="best-choice-label">{{ $t('finCompare.bestChoice') }}</span>
                    </td>
                    <td class="table-row">{{ bank.rate || 'N/A' }}</td>
                    <td class="table-row">{{ bank.issuanceFee || 'N/A' }}</td>
                    <td class="table-row">{{ bank.maxLoanTerm || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="suggestedBank" class="suggested">
              <strong>{{ $t('finCompare.suggested') }}:</strong> {{ suggestedBank.bank }} {{ $t('finCompare.for') }} {{ getPriorityText(selectedPriority) }}
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>

  <script>
  import axios from 'axios';
  
  export default {
    name: 'FinCompare',
    data() {
      return {
        banks: [],
        loading: true,
        error: null,
        selectedPriority: 'savings'
      };
    },
    computed: {
      suggestedBank() {
        if (!this.banks.length) return null;
        
        switch (this.selectedPriority) {
          case 'savings':
            return this.banks.reduce((best, current) => {
              const bestRate = parseFloat(best.rate) || 0;
              const currentRate = parseFloat(current.rate) || 0;
              return currentRate > bestRate ? current : best;
            });
          case 'fees':
            return this.banks.reduce((best, current) => {
              const bestFee = parseFloat(best.issuanceFee) || Infinity;
              const currentFee = parseFloat(current.issuanceFee) || Infinity;
              return currentFee < bestFee ? current : best;
            });
          case 'flexible':
            return this.banks.reduce((best, current) => {
              const bestTerm = parseFloat(best.maxLoanTerm) || 0;
              const currentTerm = parseFloat(current.maxLoanTerm) || 0;
              return currentTerm > bestTerm ? current : best;
            });
          default:
            return null;
        }
      }
    },
    methods: {
      async loadData() {
        try {
          this.loading = true;
          const cachedData = localStorage.getItem('bankData');

          if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            this.banks = parsedData;
          } else {
            const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/api/banks`);
            this.banks = response.data;
            localStorage.setItem('bankData', JSON.stringify(response.data));
          }
        } catch (error) {
          this.error = this.$t('finCompare.error');
          console.error('Error loading bank data:', error);
        } finally {
          this.loading = false;
        }
      },
      isBestChoice(bank) {
        if (!this.suggestedBank) return false;
        return bank.bank === this.suggestedBank.bank;
      },
      getPriorityText(priority) {
        switch (priority) {
          case 'savings':
            return this.$t('finCompare.priorityTexts.highestRate');
          case 'fees':
            return this.$t('finCompare.priorityTexts.lowestFees');
          case 'flexible':
            return this.$t('finCompare.priorityTexts.flexibleTerms');
          default:
            return '';
        }
      }
    },
    mounted() {
      this.loadData();
    },
    watch: {
      selectedPriority() {
        // Clear any existing error when priority changes
        this.error = null;
      }
    }
  };
  </script>

  <style scoped>
  /* Flexbox layout for the containers */
  .flex-container {
    display: flex;
    min-height: 100vh;
    background: var(--bg-primary);
  }
  
  .sidebar {
    width: 300px;
    background: linear-gradient(to bottom, #000, #1a1a1a);
    color: white;
    padding: 2rem;
    position: sticky;
    top: 0;
    height: 100vh;
    box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  }
  
  .sidebar-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(45deg, #fff, #ccc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .subtitle {
    font-size: 1rem;
    color: #ccc;
    margin-bottom: 2rem;
  }
  
  .filter-label {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #fff;
  }
  
  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .radio-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    min-height: 44px; /* Touch target minimum */
  }
  
  .radio-option:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .radio-option input[type="radio"] {
    width: 16px;
    height: 16px;
    min-width: 16px;
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .main-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
    background: linear-gradient(45deg, #1a1a1a, #4a4a4a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: fadeIn 1s ease;
  }
  
  .comparison-table-container {
    background: var(--bg-primary);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    animation: slideIn 0.5s ease;
  }
  
  .table-wrapper {
    overflow-x: auto;
    border-radius: 12px;
    -webkit-overflow-scrolling: touch;
  }
  
  .comparison-table {
    width: 100%;
    min-width: 600px;
    border-collapse: separate;
    border-spacing: 0;
  }
  
  .table-header {
    padding: 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    background: var(--bg-secondary);
    border-bottom: 2px solid var(--border-color);
    text-align: left;
    position: sticky;
    top: 0;
    z-index: 10;
    white-space: nowrap;
  }
  
  .table-row-title {
    padding: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    min-width: 150px;
  }
  
  .table-row {
    padding: 1rem;
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    transition: all 0.3s ease;
    white-space: nowrap;
  }
  
  tr {
    transition: all 0.3s ease;
  }
  
  tr:hover {
    background: var(--hover-bg);
    transform: translateX(5px);
  }
  
  .best-choice {
    background: var(--primary-color);
    color: white;
  }
  
  .best-choice td {
    color: white;
  }
  
  .best-choice-label {
    display: inline-block;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    margin-left: 0.5rem;
  }
  
  .suggested {
    margin-top: 1.5rem;
    background: var(--primary-color);
    color: white;
    padding: 1rem;
    border-radius: 12px;
    animation: fadeIn 0.5s ease;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    font-size: 1.2rem;
    color: var(--text-primary);
  }
  
  .loading::after {
    content: '';
    width: 2rem;
    height: 2rem;
    border: 3px solid var(--border-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    margin-left: 0.5rem;
    animation: spin 1s linear infinite;
  }
  
  .error {
    text-align: center;
    padding: 2rem;
    color: #dc2626;
    background: #fee2e2;
    border-radius: 12px;
    margin-bottom: 1rem;
    animation: shake 0.5s ease;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  /* Dark mode specific styles */
  :root[data-theme="dark"] .table-row,
  :root[data-theme="dark"] .table-header {
    color: #000;
    background: #fff;
  }
  
  :root[data-theme="dark"] .best-choice {
    background: var(--primary-color);
    color: white;
  }
  
  :root[data-theme="dark"] .best-choice td {
    color: white;
  }

  /* Responsive Design */
  @media (max-width: 1200px) {
    .sidebar {
      width: 250px;
      padding: 1.5rem;
    }
    
    .main-content {
      padding: 1.5rem;
    }
    
    .main-title {
      font-size: 2.2rem;
    }
    
    .comparison-table-container {
      padding: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .flex-container {
      flex-direction: column;
    }
    
    .sidebar {
      width: 100%;
      height: auto;
      position: static;
      padding: 1.5rem 1rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    
    .sidebar-content {
      gap: 1.5rem;
    }
    
    .title {
      font-size: 1.8rem;
      text-align: center;
    }
    
    .subtitle {
      font-size: 0.9rem;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .filter-options {
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
    }
    
    .radio-option {
      flex: 1 1 auto;
      min-width: 140px;
      justify-content: center;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      font-size: 0.9rem;
    }
    
    .main-content {
      padding: 1rem;
    }
    
    .main-title {
      font-size: 1.8rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }
    
    .comparison-table-container {
      padding: 1rem;
      border-radius: 12px;
    }
    
    .table-header,
    .table-row,
    .table-row-title {
      padding: 0.75rem 0.5rem;
      font-size: 0.9rem;
    }
    
    .comparison-table {
      min-width: 500px;
    }
    
    .suggested {
      padding: 0.75rem;
      font-size: 0.9rem;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    .sidebar {
      padding: 1rem 0.75rem;
    }
    
    .title {
      font-size: 1.5rem;
    }
    
    .subtitle {
      font-size: 0.85rem;
    }
    
    .filter-options {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .radio-option {
      min-width: auto;
      padding: 0.625rem 0.75rem;
      font-size: 0.85rem;
    }
    
    .main-content {
      padding: 0.75rem;
    }
    
    .main-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .comparison-table-container {
      padding: 0.75rem;
    }
    
    .table-header,
    .table-row,
    .table-row-title {
      padding: 0.5rem 0.375rem;
      font-size: 0.8rem;
    }
    
    .comparison-table {
      min-width: 450px;
    }
    
    .best-choice-label {
      font-size: 0.65rem;
      padding: 0.2rem 0.5rem;
      margin-left: 0.25rem;
    }
    
    .suggested {
      padding: 0.625rem;
      font-size: 0.85rem;
      margin-top: 1rem;
    }
    
    tr:hover {
      transform: none;
    }
  }

  @media (max-width: 320px) {
    .sidebar {
      padding: 0.75rem 0.5rem;
    }
    
    .title {
      font-size: 1.3rem;
    }
    
    .subtitle {
      font-size: 0.8rem;
    }
    
    .radio-option {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
    
    .main-content {
      padding: 0.5rem;
    }
    
    .main-title {
      font-size: 1.3rem;
      margin-bottom: 0.75rem;
    }
    
    .comparison-table-container {
      padding: 0.5rem;
    }
    
    .table-header,
    .table-row,
    .table-row-title {
      padding: 0.375rem 0.25rem;
      font-size: 0.75rem;
    }
    
    .comparison-table {
      min-width: 400px;
    }
    
    .best-choice-label {
      font-size: 0.6rem;
      padding: 0.15rem 0.4rem;
    }
    
    .suggested {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
    
    .loading {
      font-size: 1rem;
      min-height: 150px;
    }
    
    .error {
      padding: 1rem;
      font-size: 0.9rem;
    }
  }

  /* Touch improvements */
  @media (hover: none) and (pointer: coarse) {
    tr:hover {
      background: transparent;
      transform: none;
    }
    
    .radio-option:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    
    .radio-option:active {
      transform: scale(0.98);
      background: rgba(255, 255, 255, 0.2);
    }
  }
  </style>