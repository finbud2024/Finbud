<template>
  <div class="stock-screener">
    <div class="screener-header">
      <h3>{{ $t('stockSimulator.screener.title') }}</h3>
      <p class="screener-subtitle">{{ $t('stockSimulator.screener.subtitle') }}</p>
    </div>

    <!-- Quick Presets -->
    <div class="preset-section">
      <h4>{{ $t('stockSimulator.screener.quickPresets') }}</h4>
      <div class="preset-buttons">
        <button 
          v-for="preset in presets" 
          :key="preset.key"
          @click="applyPreset(preset)"
          class="preset-btn"
        >
          {{ $t(`stockSimulator.screener.presets.${preset.key}`) }}
        </button>
      </div>
    </div>

    <!-- Market Cap Filter -->
    <div class="filter-section">
      <h4>{{ $t('stockSimulator.screener.marketCap') }}</h4>
      <div class="checkbox-group">
        <label v-for="cap in marketCapOptions" :key="cap.key" class="checkbox-label">
          <input 
            type="checkbox" 
            v-model="filters.marketCap" 
            :value="cap.key"
            @change="applyFilters"
          />
          <span>{{ $t(`stockSimulator.screener.marketCapOptions.${cap.key}`) }}</span>
        </label>
      </div>
    </div>

    <!-- Sector Filter -->
    <div class="filter-section">
      <h4>{{ $t('stockSimulator.screener.sector') }}</h4>
      <select v-model="filters.sector" @change="applyFilters" class="select-input">
        <option value="">{{ $t('stockSimulator.screener.allSectors') }}</option>
        <option v-for="sector in sectors" :key="sector.key" :value="sector.key">
          {{ $t(`stockSimulator.screener.sectors.${sector.key}`) }}
        </option>
      </select>
    </div>

    <!-- Price Range -->
    <div class="filter">
      <label>{{ $t('stockSimulator.screener.priceRange') }}</label>
      <div class="slider-container">
        <input 
          class="range-input" 
          v-model="filters.priceRange[0]" 
          type="number" 
          :min="0" 
          :max="filters.priceRange[1]" 
          :step="1"
          @input="applyFilters"
        />
        <Vue3Slider 
          @change="applyFilters" 
          v-model="filters.priceRange" 
          :min="0" 
          :max="1000" 
          style="width:70%" 
        />
        <input 
          class="range-input" 
          v-model="filters.priceRange[1]" 
          type="number" 
          :min="filters.priceRange[0]" 
          :max="1000" 
          :step="1"
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- P/E Ratio -->
    <div class="filter">
      <label>{{ $t('stockSimulator.screener.peRatio') }}</label>
      <div class="slider-container">
        <input 
          class="range-input" 
          v-model="filters.peRatio[0]" 
          type="number"
          :min="0" 
          :max="filters.peRatio[1]" 
          :step="0.1"
          @input="applyFilters"
        />
        <Vue3Slider 
          @change="applyFilters" 
          v-model="filters.peRatio" 
          :min="0" 
          :max="100" 
          style="width:70%" 
        />
        <input 
          class="range-input" 
          v-model="filters.peRatio[1]" 
          type="number" 
          :min="filters.peRatio[0]" 
          :max="100" 
          :step="0.1"
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- Market Cap Range -->
    <div class="filter">
      <label>{{ $t('stockSimulator.screener.marketCapRange') }}</label>
      <div class="slider-container">
        <input 
          class="range-input" 
          v-model="filters.marketCapRange[0]" 
          type="number" 
          :min="0" 
          :max="filters.marketCapRange[1]" 
          :step="1000000"
          @input="applyFilters"
        />
        <Vue3Slider 
          @change="applyFilters" 
          v-model="filters.marketCapRange" 
          :min="0" 
          :max="5000000000000" 
          style="width:70%" 
        />
        <input 
          class="range-input" 
          v-model="filters.marketCapRange[1]" 
          type="number" 
          :min="filters.marketCapRange[0]" 
          :max="5000000000000" 
          :step="1000000"
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- Dividend Yield -->
    <div class="filter">
      <label>{{ $t('stockSimulator.screener.dividendYield') }}</label>
      <div class="slider-container">
        <input 
          class="range-input" 
          v-model="filters.dividendYield[0]" 
          type="number" 
          :min="0" 
          :max="filters.dividendYield[1]" 
          :step="0.1"
          @input="applyFilters"
        />
        <Vue3Slider 
          @change="applyFilters" 
          v-model="filters.dividendYield" 
          :min="0" 
          :max="15" 
          style="width:70%" 
        />
        <input 
          class="range-input" 
          v-model="filters.dividendYield[1]" 
          type="number" 
          :min="filters.dividendYield[0]" 
          :max="15" 
          :step="0.1"
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- Volume -->
    <div class="filter">
      <label>{{ $t('stockSimulator.screener.volume') }}</label>
      <div class="slider-container">
        <input 
          class="range-input" 
          v-model="filters.volume[0]" 
          type="number" 
          :min="0" 
          :max="filters.volume[1]" 
          :step="1000000"
          @input="applyFilters"
        />
        <Vue3Slider 
          @change="applyFilters" 
          v-model="filters.volume" 
          :min="0" 
          :max="1000000000" 
          style="width:70%" 
        />
        <input 
          class="range-input" 
          v-model="filters.volume[1]" 
          type="number" 
          :min="filters.volume[0]" 
          :max="1000000000" 
          :step="1000000"
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- Beta -->
    <div class="filter">
      <label>{{ $t('stockSimulator.screener.beta') }}</label>
      <div class="slider-container">
        <input 
          class="range-input" 
          v-model="filters.beta[0]" 
          type="number" 
          :min="0" 
          :max="filters.beta[1]" 
          :step="0.1"
          @input="applyFilters"
        />
        <Vue3Slider 
          @change="applyFilters" 
          v-model="filters.beta" 
          :min="0" 
          :max="3" 
          style="width:70%" 
        />
        <input 
          class="range-input" 
          v-model="filters.beta[1]" 
          type="number" 
          :min="filters.beta[0]" 
          :max="3" 
          :step="0.1"
          @input="applyFilters"
        />
      </div>
    </div>

    <!-- Results Summary -->
    <div class="results-summary" v-if="resultsCount !== null && !hasError">
      <div class="results-info">
        <span class="results-count">{{ resultsCount }} {{ $t('stockSimulator.screener.stocksFound') }}</span>
        <div class="loading-indicator" v-if="isLoading">
          <i class="fas fa-spinner fa-spin"></i>
          {{ $t('stockSimulator.screener.loading') }}
        </div>
      </div>
      <div class="action-buttons">
        <button @click="resetFilters" class="reset-btn">
          <i class="fas fa-undo"></i>
          {{ $t('stockSimulator.screener.resetFilters') }}
        </button>
        <button @click="savePreset" class="save-btn">
          <i class="fas fa-save"></i>
          {{ $t('stockSimulator.screener.savePreset') }}
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="hasError" class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>{{ $t('stockSimulator.screener.errorTitle') || 'Connection Error' }}</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="error-actions">
          <button @click="retryLoad" class="retry-btn">
            <i class="fas fa-redo"></i>
            {{ $t('stockSimulator.screener.retry') || 'Retry' }}
          </button>
          <button @click="resetFilters" class="reset-btn">
            <i class="fas fa-undo"></i>
            {{ $t('stockSimulator.screener.resetFilters') || 'Reset Filters' }}
          </button>
        </div>
        <div v-if="resultsCount !== null" class="fallback-info">
          <i class="fas fa-info-circle"></i>
          <span>{{ $t('stockSimulator.screener.fallbackMessage') || 'Showing sample data while connection is restored' }} ({{ resultsCount }} stocks)</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading && (resultsCount === null || isInitialLoad)" class="initial-loading">
      <div class="loading-spinner">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
      </div>
      <p>{{ isInitialLoad ? ($t('stockSimulator.screener.loadingStocks') || 'Loading US stocks...') : ($t('stockSimulator.screener.loading') || 'Loading...') }}</p>
      <div class="loading-progress">
        <div class="progress-bar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue3Slider from 'vue-3-slider-component';
import debounce from 'lodash/debounce';
import StockScreenerService from '@/services/stockScreenerService';

export default {
  name: 'StockScreener',
  components: {
    Vue3Slider
  },
  data() {
    return {
      filters: {
        marketCap: [],
        sector: '',
        priceRange: [0, 1000],
        peRatio: [0, 100],
        marketCapRange: [0, 5000000000000],
        dividendYield: [0, 15],
        volume: [0, 1000000000],
        beta: [0, 3]
      },
      resultsCount: null,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      isInitialLoad: true,
      stockScreenerService: new StockScreenerService(),
      presets: [
        { key: 'growthStocks', name: 'Growth Stocks' },
        { key: 'valueStocks', name: 'Value Stocks' },
        { key: 'dividendStocks', name: 'Dividend Stocks' },
        { key: 'largeCap', name: 'Large Cap' },
        { key: 'smallCap', name: 'Small Cap' }
      ],
      marketCapOptions: [
        { key: 'mega', name: 'Mega Cap (>$200B)' },
        { key: 'large', name: 'Large Cap ($10B-$200B)' },
        { key: 'mid', name: 'Mid Cap ($2B-$10B)' },
        { key: 'small', name: 'Small Cap ($300M-$2B)' },
        { key: 'micro', name: 'Micro Cap (<$300M)' }
      ],
      sectors: [
        { key: 'technology', name: 'Technology' },
        { key: 'healthcare', name: 'Healthcare' },
        { key: 'financials', name: 'Financials' },
        { key: 'energy', name: 'Energy' },
        { key: 'industrials', name: 'Industrials' },
        { key: 'materials', name: 'Materials' },
        { key: 'utilities', name: 'Utilities' },
        { key: 'realestate', name: 'Real Estate' },
        { key: 'consumer_discretionary', name: 'Consumer Discretionary' },
        { key: 'consumer_staples', name: 'Consumer Staples' },
        { key: 'telecommunications', name: 'Telecommunications' }
      ]
    };
  },
  mounted() {
    // Load initial stocks when component mounts
    this.loadInitialStocks();
  },
  methods: {
    applyFilters: debounce(async function() {
      try {
        this.isLoading = true;
        this.hasError = false;
        this.errorMessage = '';
        
        console.log('Applying filters:', this.filters);
        
        // Use the StockScreenerService to get filtered stocks
        const response = await this.stockScreenerService.screenStocks(this.filters);
        
        if (response && response.stocks) {
          this.resultsCount = response.count || response.stocks.length;
        
        this.$emit('applyFilter', {
          filters: this.filters,
          results: response.stocks
        });
          
          console.log(`Found ${this.resultsCount} stocks matching filters`);
        } else {
          throw new Error('Invalid response from stock screener service');
        }
      } catch (error) {
        console.error('Error applying filters:', error);
        this.hasError = true;
        this.errorMessage = 'Failed to load filtered stocks. Using sample data.';
        
        // Fallback to mock data
        const fallbackData = this.getMockFilteredStocks();
        this.resultsCount = fallbackData.length;
        
        this.$emit('applyFilter', {
          filters: this.filters,
          results: fallbackData
        });
      } finally {
        this.isLoading = false;
      }
    }, 800),

    async loadInitialStocks() {
      try {
        this.isLoading = true;
        this.isInitialLoad = true;
        this.hasError = false;
        this.errorMessage = '';
        
        console.log('Loading initial US stocks...');
        
        // Load all US stocks initially
        const response = await this.stockScreenerService.getAllUSStocks();
        
        if (response && response.stocks) {
          this.resultsCount = response.count || response.stocks.length;
        
        this.$emit('applyFilter', {
          filters: {},
          results: response.stocks
        });
          
          console.log(`Loaded ${this.resultsCount} US stocks successfully`);
        } else {
          throw new Error('Invalid response from stock screener service');
        }
      } catch (error) {
        console.error('Error loading initial stocks:', error);
        this.hasError = true;
        this.errorMessage = 'Failed to load US stocks. Using sample data.';
        
        // Fallback to mock data
        const fallbackData = this.getMockFilteredStocks();
        this.resultsCount = fallbackData.length;
        
        this.$emit('applyFilter', {
          filters: {},
          results: fallbackData
        });
        
        console.log(`Using ${this.resultsCount} mock stocks as fallback`);
      } finally {
        this.isLoading = false;
        this.isInitialLoad = false;
      }
    },

    getMockFilteredStocks() {
      // Enhanced mock data for fallback with more realistic US stocks
      const mockStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 189.50, change: '+2.5%', pe: 29.2, marketCap: 2950000000000, sector: 'technology', beta: 1.2, dividendYield: 0.5, volume: 55000000 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, change: '+1.2%', pe: 25.1, marketCap: 1750000000000, sector: 'technology', beta: 1.1, dividendYield: 0, volume: 28000000 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.30, change: '-0.8%', pe: 35.3, marketCap: 3080000000000, sector: 'technology', beta: 0.9, dividendYield: 0.7, volume: 22000000 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.48, change: '+3.2%', pe: 45.2, marketCap: 790000000000, sector: 'consumer_discretionary', beta: 2.1, dividendYield: 0, volume: 45000000 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.89, change: '+0.5%', pe: 45.8, marketCap: 1620000000000, sector: 'consumer_discretionary', beta: 1.3, dividendYield: 0, volume: 35000000 },
        { symbol: 'META', name: 'Meta Platforms Inc.', price: 503.22, change: '+1.8%', pe: 24.5, marketCap: 1280000000000, sector: 'technology', beta: 1.4, dividendYield: 0.4, volume: 18000000 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: '+4.2%', pe: 72.2, marketCap: 2150000000000, sector: 'technology', beta: 1.8, dividendYield: 0.03, volume: 42000000 },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 486.75, change: '-1.1%', pe: 34.9, marketCap: 210000000000, sector: 'consumer_discretionary', beta: 1.2, dividendYield: 0, volume: 8500000 },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 181.52, change: '+0.8%', pe: 12.5, marketCap: 530000000000, sector: 'financials', beta: 1.1, dividendYield: 2.8, volume: 12000000 },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.35, change: '+0.3%', pe: 15.2, marketCap: 425000000000, sector: 'healthcare', beta: 0.7, dividendYield: 3.1, volume: 8000000 },
        { symbol: 'UNH', name: 'UnitedHealth Group Inc.', price: 524.88, change: '+1.5%', pe: 24.8, marketCap: 490000000000, sector: 'healthcare', beta: 0.8, dividendYield: 1.3, volume: 3200000 },
        { symbol: 'V', name: 'Visa Inc.', price: 271.49, change: '+0.9%', pe: 32.1, marketCap: 580000000000, sector: 'financials', beta: 1.0, dividendYield: 0.7, volume: 7800000 },
        { symbol: 'HD', name: 'The Home Depot Inc.', price: 337.89, change: '-0.4%', pe: 24.6, marketCap: 345000000000, sector: 'consumer_discretionary', beta: 1.0, dividendYield: 2.4, volume: 4500000 },
        { symbol: 'PG', name: 'Procter & Gamble Co.', price: 157.22, change: '+0.2%', pe: 26.3, marketCap: 375000000000, sector: 'consumer_staples', beta: 0.6, dividendYield: 2.3, volume: 6200000 },
        { symbol: 'MA', name: 'Mastercard Inc.', price: 450.15, change: '+1.1%', pe: 35.7, marketCap: 430000000000, sector: 'financials', beta: 1.1, dividendYield: 0.5, volume: 3100000 }
      ];
      
      // Apply basic filtering if filters are set
      return mockStocks.filter(stock => {
        // Price range filter
        if (this.filters.priceRange && (stock.price < this.filters.priceRange[0] || stock.price > this.filters.priceRange[1])) {
          return false;
        }
        
        // Sector filter
        if (this.filters.sector && stock.sector !== this.filters.sector) {
          return false;
        }
        
        // P/E ratio filter
        if (this.filters.peRatio && (stock.pe < this.filters.peRatio[0] || stock.pe > this.filters.peRatio[1])) {
          return false;
        }
        
        return true;
      });
    },

    applyPreset(preset) {
      try {
        console.log('Applying preset:', preset.key);
        const presetFilters = this.stockScreenerService.getPresetFilters(preset.key);
      
      // Merge preset filters with current filters
      this.filters = {
        ...this.filters,
        ...presetFilters
      };
      
      this.applyFilters();
      } catch (error) {
        console.error('Error applying preset:', error);
        this.$notify({
          type: 'error',
          title: 'Preset Error',
          text: 'Failed to apply preset. Please try again.'
        });
      }
    },

    resetFilters() {
      console.log('Resetting filters');
      this.filters = {
        marketCap: [],
        sector: '',
        priceRange: [0, 1000],
        peRatio: [0, 100],
        marketCapRange: [0, 5000000000000],
        dividendYield: [0, 15],
        volume: [0, 1000000000],
        beta: [0, 3]
      };
      this.resultsCount = null;
      this.hasError = false;
      this.errorMessage = '';
      this.loadInitialStocks();
    },

    retryLoad() {
      console.log('Retrying to load stocks');
      this.hasError = false;
      this.errorMessage = '';
      this.loadInitialStocks();
    },

    savePreset() {
      // Implementation for saving custom presets
      const presetName = prompt(this.$t('stockSimulator.screener.enterPresetName') || 'Enter preset name:');
      if (presetName && presetName.trim()) {
        try {
          // Save to localStorage
        localStorage.setItem(`stock-screener-preset-${presetName}`, JSON.stringify(this.filters));
        this.$emit('savePreset', { name: presetName, filters: this.filters });
        
        // Show success message
        this.$notify({
          type: 'success',
          title: this.$t('stockSimulator.screener.presetSaved') || 'Preset Saved',
          text: this.$t('stockSimulator.screener.presetSavedMessage', { name: presetName }) || `Preset "${presetName}" saved successfully`
        });
        } catch (error) {
          console.error('Error saving preset:', error);
          this.$notify({
            type: 'error',
            title: 'Save Error',
            text: 'Failed to save preset. Please try again.'
          });
        }
      }
    }
  }
};
</script>

<style scoped>
.stock-screener {
  background: linear-gradient(145deg, #ffffff, #f8fafc);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  max-width: 900px;
  margin: 2rem auto;
}

.screener-header {
  text-align: center;
  margin-bottom: 2rem;
}

.screener-header h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.screener-subtitle {
  color: #64748b;
  font-size: 1rem;
}

.preset-section {
  margin-bottom: 2rem;
}

.preset-section h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.preset-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.preset-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

.filter-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #000000;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
}

.filter {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: block;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.range-input {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-align: center;
  font-size: 0.9rem;
}

.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.results-count {
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.reset-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-btn {
  background: #6b7280;
  color: white;
}

.reset-btn:hover {
  background: #4b5563;
}

.save-btn {
  background: #000000;
  color: white;
}

.save-btn:hover {
  background: #333333;
}

.initial-loading {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  margin-top: 2rem;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.loading-progress {
  width: 100%;
  max-width: 300px;
  margin: 1rem auto 0;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  position: relative;
}

.progress-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #000000, #333333, #000000);
  border-radius: 2px;
  animation: loading-slide 2s infinite;
}

@keyframes loading-slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(400%);
  }
}

.error-container {
  text-align: center;
  padding: 2rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin-top: 2rem;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-icon {
  font-size: 3rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-container h3 {
  font-size: 1.5rem;
  color: #b91c1c;
  margin-bottom: 0.5rem;
}

.error-message {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  max-width: 400px;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #dc2626;
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
}

.fallback-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #4b5563;
  font-size: 0.9rem;
}

.fallback-info i {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .stock-screener {
    padding: 1rem;
  }
  
  .preset-buttons {
    flex-direction: column;
  }
  
  .checkbox-group {
    flex-direction: column;
  }
  
  .slider-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .results-summary {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    margin-top: 1rem;
  }
}
</style>
  