<template>
  <div class="stock-search-container">
    <div class="search-wrapper">
      <div class="search-input-group">
        <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          class="stock-search-input"
          @input="handleInput"
          @focus="showSuggestions = true"
          @blur="handleBlur"
          @keydown="handleKeydown"
          autocomplete="off"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>

      <!-- Search Suggestions Dropdown -->
      <div v-if="showSuggestions && (suggestions.length > 0 || loading)" class="suggestions-dropdown">
        <!-- Loading State -->
        <div v-if="loading" class="suggestion-item loading">
          <div class="loading-spinner"></div>
          <span>Searching stocks...</span>
        </div>

        <!-- Popular Stocks (when no search query) -->
        <div v-else-if="!searchQuery.trim() && popularStocks.length > 0" class="suggestions-section">
          <div class="section-header">Popular Stocks</div>
          <div
            v-for="(stock, index) in popularStocks"
            :key="stock.symbol"
            :class="['suggestion-item', { highlighted: highlightedIndex === index }]"
            @mousedown="selectStock(stock)"
            @mouseenter="highlightedIndex = index"
          >
            <div class="stock-info">
              <div class="stock-main">
                <span class="stock-symbol">{{ stock.symbol }}</span>
                <span class="stock-name">{{ stock.name }}</span>
              </div>
              <div class="stock-meta">
                <span class="stock-price">${{ formatPrice(stock.price) }}</span>
                <span class="stock-change" :class="getChangeClass(stock.change)">
                  {{ formatChange(stock.change) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Results -->
        <div v-else-if="suggestions.length > 0" class="suggestions-section">
          <div class="section-header">Search Results</div>
          <div
            v-for="(stock, index) in suggestions"
            :key="stock.symbol"
            :class="['suggestion-item', { highlighted: highlightedIndex === index }]"
            @mousedown="selectStock(stock)"
            @mouseenter="highlightedIndex = index"
          >
            <div class="stock-info">
              <div class="stock-main">
                <span class="stock-symbol">{{ stock.symbol }}</span>
                <span class="stock-name">{{ stock.name }}</span>
              </div>
              <div class="stock-meta">
                <span class="stock-exchange">{{ stock.exchange }}</span>
                <span class="stock-type">{{ stock.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery.trim() && !loading" class="suggestion-item no-results">
          <font-awesome-icon icon="fa-solid fa-exclamation-circle" />
          <span>No stocks found for "{{ searchQuery }}"</span>
        </div>
      </div>
    </div>

    <!-- Recent Searches -->
    <div v-if="showRecentSearches && recentSearches.length > 0" class="recent-searches">
      <div class="recent-header">Recent Searches</div>
      <div class="recent-items">
        <button
          v-for="stock in recentSearches"
          :key="stock.symbol"
          @click="selectStock(stock)"
          class="recent-item"
        >
          <span class="recent-symbol">{{ stock.symbol }}</span>
          <span class="recent-name">{{ stock.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { debounce } from 'lodash'

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search stocks by symbol or company name...'
  },
  modelValue: {
    type: String,
    default: ''
  },
  showRecentSearches: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'stock-selected', 'search'])

// Reactive data
const searchInput = ref(null)
const searchQuery = ref(props.modelValue)
const suggestions = ref([])
const showSuggestions = ref(false)
const loading = ref(false)
const highlightedIndex = ref(-1)

// Popular stocks data (could be fetched from API)
const popularStocks = ref([
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.43, change: 2.34 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2734.12, change: -12.45 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 412.78, change: 5.67 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3298.91, change: 15.23 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -8.91 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 789.45, change: 23.12 },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 321.54, change: 4.76 },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 567.23, change: -2.34 }
])

// Recent searches (stored in localStorage)
const recentSearches = ref([])

// Computed
const maxSuggestions = 8

// Methods
const handleInput = debounce(async () => {
  emit('update:modelValue', searchQuery.value)
  
  if (searchQuery.value.trim().length < 2) {
    suggestions.value = []
    return
  }

  loading.value = true
  highlightedIndex.value = -1

  try {
    // Simulate API call (replace with actual stock search API)
    const results = await searchStocks(searchQuery.value)
    suggestions.value = results.slice(0, maxSuggestions)
  } catch (error) {
    console.error('Error searching stocks:', error)
    suggestions.value = []
  } finally {
    loading.value = false
  }
}, 300)

const searchStocks = async (query) => {
  // Mock API response (replace with real API call)
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', exchange: 'NASDAQ', type: 'Common Stock' },
        { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', type: 'Common Stock' }
      ]
      
      const filtered = mockStocks.filter(stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      )
      
      resolve(filtered)
    }, 200)
  })
}

const selectStock = (stock) => {
  searchQuery.value = stock.symbol
  showSuggestions.value = false
  highlightedIndex.value = -1
  
  // Add to recent searches
  addToRecentSearches(stock)
  
  // Emit events
  emit('update:modelValue', stock.symbol)
  emit('stock-selected', stock)
  emit('search', stock.symbol)
}

const clearSearch = () => {
  searchQuery.value = ''
  suggestions.value = []
  showSuggestions.value = false
  emit('update:modelValue', '')
}

const handleBlur = () => {
  // Delay hiding suggestions to allow for click events
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const handleKeydown = (event) => {
  if (!showSuggestions.value) return

  const totalItems = searchQuery.value.trim() ? suggestions.value.length : popularStocks.value.length

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, totalItems - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0) {
        const selectedStock = searchQuery.value.trim() 
          ? suggestions.value[highlightedIndex.value]
          : popularStocks.value[highlightedIndex.value]
        if (selectedStock) {
          selectStock(selectedStock)
        }
      }
      break
    case 'Escape':
      showSuggestions.value = false
      searchInput.value?.blur()
      break
  }
}

// Utility functions
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)
}

const formatChange = (change) => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}`
}

const getChangeClass = (change) => {
  return {
    positive: change > 0,
    negative: change < 0,
    neutral: change === 0
  }
}

// Recent searches management
const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem('stockSearchRecents')
    if (saved) {
      recentSearches.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Error loading recent searches:', error)
  }
}

const addToRecentSearches = (stock) => {
  // Remove if already exists
  recentSearches.value = recentSearches.value.filter(item => item.symbol !== stock.symbol)
  
  // Add to beginning
  recentSearches.value.unshift(stock)
  
  // Keep only last 5
  recentSearches.value = recentSearches.value.slice(0, 5)
  
  // Save to localStorage
  try {
    localStorage.setItem('stockSearchRecents', JSON.stringify(recentSearches.value))
  } catch (error) {
    console.error('Error saving recent searches:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadRecentSearches()
})

// Cleanup
onUnmounted(() => {
  // Any cleanup if needed
})
</script>

<style scoped>
.stock-search-container {
  position: relative;
  width: 100%;
}

.search-wrapper {
  position: relative;
}

.search-input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: #64748b;
  font-size: 14px;
  z-index: 2;
}

.stock-search-input {
  width: 100%;
  padding: 12px 40px 12px 36px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.stock-search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  z-index: 2;
}

.clear-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  margin-top: 4px;
}

.suggestions-section {
  padding: 8px 0;
}

.section-header {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 4px;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f8fafc;
}

.suggestion-item:hover,
.suggestion-item.highlighted {
  background: #f8fafc;
}

.suggestion-item.loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  cursor: default;
}

.suggestion-item.no-results {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #64748b;
  cursor: default;
  font-style: italic;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.stock-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.stock-main {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stock-symbol {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.stock-name {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.stock-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.stock-price {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.stock-change {
  font-size: 12px;
  font-weight: 500;
}

.stock-change.positive {
  color: #059669;
}

.stock-change.negative {
  color: #dc2626;
}

.stock-change.neutral {
  color: #64748b;
}

.stock-exchange,
.stock-type {
  font-size: 11px;
  color: #94a3b8;
}

.recent-searches {
  margin-top: 16px;
}

.recent-header {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.recent-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.recent-symbol {
  font-weight: 600;
  color: #1e293b;
}

.recent-name {
  color: #64748b;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .stock-search-input {
    padding: 10px 36px 10px 32px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .suggestions-dropdown {
    max-height: 300px;
  }
  
  .stock-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .stock-meta {
    align-items: flex-start;
    flex-direction: row;
    gap: 12px;
  }
}
</style> 