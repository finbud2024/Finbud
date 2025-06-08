<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-chart-line" />
          Stock Trading
        </h2>
        <button @click="$emit('close')" class="close-btn">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>

      <div class="modal-body">
        <div class="stock-info-card">
          <div class="stock-symbol">
            {{ stockData.symbol }}
          </div>
          <div class="stock-name">
            {{ stockData.name || 'Loading...' }}
          </div>
          <div class="stock-price">
            ${{ stockData.price || '0.00' }}
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="trading-form">
          <div class="form-row">
            <div class="form-group">
              <label>Action</label>
              <select v-model="tradeData.action" class="form-select">
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Quantity</label>
              <input 
                v-model.number="tradeData.quantity" 
                type="number" 
                min="1" 
                step="1"
                class="form-input"
                placeholder="Number of shares"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Stock Symbol</label>
            <input 
              v-model="tradeData.symbol" 
              type="text" 
              class="form-input"
              placeholder="e.g. TSLA, AAPL"
              @input="fetchStockData"
              required
            />
          </div>

          <div class="calculation-card">
            <div class="calc-row">
              <span>Price per share:</span>
              <span>${{ stockData.price || '0.00' }}</span>
            </div>
            <div class="calc-row">
              <span>Quantity:</span>
              <span>{{ tradeData.quantity || 0 }} shares</span>
            </div>
            <div class="calc-row total">
              <span>Total {{ tradeData.action === 'buy' ? 'Cost' : 'Value' }}:</span>
              <span>${{ totalAmount.toFixed(2) }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="$emit('close')" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="submit-btn" :disabled="!isValidTrade">
              {{ tradeData.action === 'buy' ? 'Buy' : 'Sell' }} Shares
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'StockTradingModal',
  components: {
    FontAwesomeIcon
  },
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      tradeData: {
        symbol: '',
        quantity: 1,
        action: 'buy'
      },
      stockData: {
        symbol: '',
        name: '',
        price: 0
      },
      loading: false
    }
  },
  computed: {
    totalAmount() {
      return (this.stockData.price || 0) * (this.tradeData.quantity || 0)
    },
    isValidTrade() {
      return this.tradeData.symbol && 
             this.tradeData.quantity > 0 && 
             this.stockData.price > 0
    }
  },
  mounted() {
    // Pre-fill data if provided
    if (this.initialData.symbol) {
      this.tradeData.symbol = this.initialData.symbol
      this.tradeData.quantity = this.initialData.quantity || 1
      this.tradeData.action = this.initialData.action || 'buy'
      this.fetchStockData()
    }
  },
  methods: {
    async fetchStockData() {
      if (!this.tradeData.symbol || this.tradeData.symbol.length < 1) return
      
      this.loading = true
      try {
        // Mock stock data - replace with real API
        const stockName = this.getStockName(this.tradeData.symbol.toUpperCase())
        const mockPrice = this.getMockPrice(this.tradeData.symbol.toUpperCase())
        
        this.stockData = {
          symbol: this.tradeData.symbol.toUpperCase(),
          name: stockName,
          price: mockPrice
        }
      } catch (error) {
        console.error('Error fetching stock data:', error)
      } finally {
        this.loading = false
      }
    },
    
    getStockName(symbol) {
      const stockNames = {
        'TSLA': 'Tesla, Inc.',
        'AAPL': 'Apple Inc.',
        'GOOGL': 'Alphabet Inc.',
        'MSFT': 'Microsoft Corporation',
        'AMZN': 'Amazon.com Inc.',
        'META': 'Meta Platforms Inc.',
        'NVDA': 'NVIDIA Corporation',
        'NFLX': 'Netflix Inc.'
      }
      return stockNames[symbol] || `${symbol} Corporation`
    },
    
    getMockPrice(symbol) {
      const mockPrices = {
        'TSLA': 250.50,
        'AAPL': 175.25,
        'GOOGL': 2750.80,
        'MSFT': 410.30,
        'AMZN': 3350.75,
        'META': 485.60,
        'NVDA': 875.90,
        'NFLX': 620.40
      }
      return mockPrices[symbol] || Math.floor(Math.random() * 500) + 50
    },
    
    handleSubmit() {
      if (!this.isValidTrade) return
      
      const tradeRecord = {
        symbol: this.tradeData.symbol.toUpperCase(),
        quantity: this.tradeData.quantity,
        action: this.tradeData.action,
        price: this.stockData.price,
        total: this.totalAmount,
        timestamp: new Date().toISOString()
      }
      
      this.$emit('trade-executed', tradeRecord)
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 1.5rem;
}

.stock-info-card {
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.5rem;
  border: 1px solid #e2e8f0;
}

.stock-symbol {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.stock-name {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stock-price {
  font-size: 1.25rem;
  font-weight: 600;
  color: #10b981;
}

.trading-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.form-input,
.form-select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.calculation-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.calc-row:last-child {
  border-bottom: none;
}

.calc-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  color: #1e293b;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 2px solid #e2e8f0;
  border-bottom: none;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 640px) {
  .modal-container {
    width: 95%;
    margin: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style> 