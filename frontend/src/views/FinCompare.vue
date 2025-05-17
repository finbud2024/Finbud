<template>
    <div class="flex-container">
      <!-- Sidebar Container -->
      <div class="sidebar">
        <aside class="sidebar-content">
          <div>
            <h1 class="title">FinBud</h1>
            <p class="subtitle">Smart Financial Product Comparison</p>
            <div>
              <p class="filter-label">Filter by priority</p>
              <div class="filter-options">
                <label class="radio-option">
                  <input type="radio" name="priority" v-model="selectedPriority" value="savings" /> Maximum savings
                </label>
                <label class="radio-option">
                  <input type="radio" name="priority" v-model="selectedPriority" value="fees" /> Lowest fees
                </label>
                <label class="radio-option">
                  <input type="radio" name="priority" v-model="selectedPriority" value="flexible" /> Flexible conditions
                </label>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <!-- Main Content Container -->
      <div class="main-content">
        <main>
          <h2 class="main-title">Compare Financial Products</h2>
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="error" class="error">{{ error }}</div>
          <div v-else class="comparison-table-container">
            <div class="table-wrapper">
              <table class="comparison-table">
                <thead>
                  <tr>
                    <th class="table-header">Bank</th>
                    <th class="table-header">Interest Rate</th>
                    <th class="table-header">Issuance Fee</th>
                    <th class="table-header">Max Loan Term</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bank in banks" :key="bank.bank" :class="{ 'best-choice': isBestChoice(bank) }">
                    <td class="table-row-title">
                      {{ bank.bank }}
                      <span v-if="isBestChoice(bank)" class="best-choice-label">Best choice</span>
                    </td>
                    <td class="table-row">{{ bank.rate || 'N/A' }}</td>
                    <td class="table-row">{{ bank.issuanceFee || 'N/A' }}</td>
                    <td class="table-row">{{ bank.maxLoanTerm || 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="suggestedBank" class="suggested">
              <strong>Suggested:</strong> {{ suggestedBank.bank }} for {{ getPriorityText(selectedPriority) }}
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
      async fetchData() {
        try {
          this.loading = true;
          this.error = null;
          const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/banks`);
          this.banks = response.data;
        } catch (err) {
          this.error = 'Failed to load bank data. Please try again later.';
          console.error('Error fetching bank data:', err);
        } finally {
          this.loading = false;
        }
      },
      isBestChoice(bank) {
        return this.suggestedBank && bank.bank === this.suggestedBank.bank;
      },
      getPriorityText(priority) {
        const texts = {
          savings: 'maximum savings',
          fees: 'lowest fees',
          flexible: 'flexible conditions'
        };
        return texts[priority] || '';
      }
    },
    mounted() {
      this.fetchData();
    }
  };
  </script>

  <style scoped>
  /* Flexbox layout for the containers */
  .flex-container {
    display: flex;
    min-height: 100vh;
  }
  
  .sidebar {
    width: 256px;
    background-color: #1e3a8a;
    color: white;
    display: flex;
    flex-shrink: 0;
  }
  
  .sidebar-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 16px;
  }
  
  .subtitle {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 32px;
  }
  
  .filter-label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  
  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .radio-option {
    display: flex;
    align-items: center;
  }
  
  .radio-option input[type="radio"]:checked + label {
    font-weight: bold;
  }
  
  .main-content {
    flex: 1;
    background-color: #f3f4f6;
    padding: 48px;
  }
  
  .main-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 32px;
  }
  
  .comparison-table-container {
    background-color: white;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 40px;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  .comparison-table {
    width: 100%;
    text-align: left;
    border-collapse: collapse;
  }
  
  .table-header {
    padding: 12px;
    font-size: 1rem;
    font-weight: 600;
    color: #4b5563;
    border-bottom: 2px solid #e5e7eb;
    text-align: left;
  }
  
  .table-row-title {
    padding: 12px;
    font-weight: 600;
    color: #1e3a8a;
  }
  
  .table-row {
    padding: 12px;
    font-size: 1rem;
    color: #4b5563;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .best-choice {
    background-color: #f0f9ff;
  }
  
  .best-choice-label {
    display: inline-block;
    background-color: #bfdbfe;
    color: #1e3a8a;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 9999px;
    margin-left: 8px;
  }
  
  .suggested {
    margin-top: 24px;
    background-color: #e0f2fe;
    color: #1e40af;
    padding: 16px;
    border-radius: 16px;
  }
  
  .loading {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
    color: #4b5563;
  }
  
  .error {
    text-align: center;
    padding: 2rem;
    color: #dc2626;
    background-color: #fee2e2;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }
  </style>
