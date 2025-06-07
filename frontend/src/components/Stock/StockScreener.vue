<template>
  <div class="stock-screener">
    <!-- Enhanced Header with Stats -->
    <div class="screener-header">
      <div class="header-content">
        <div class="title-section">
          <h3>{{ $t('stockSimulator.screener.title') }}</h3>
          <p class="screener-subtitle">{{ $t('stockSimulator.screener.subtitle') }}</p>
        </div>
        <div class="stats-section" v-if="!isInitialLoad">
          <div class="stat-card">
            <div class="stat-number">{{ resultsCount || 0 }}</div>
            <div class="stat-label">Stocks Found</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ avgMarketCap }}</div>
            <div class="stat-label">Avg Market Cap</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ topSector }}</div>
            <div class="stat-label">Top Sector</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Quick Presets with Icons -->
    <div class="preset-section">
      <h4>{{ $t('stockSimulator.screener.quickPresets') }}</h4>
      <div class="preset-buttons">
        <button 
          v-for="preset in presets" 
          :key="preset.key"
          @click="applyPreset(preset)"
          class="preset-btn"
          :class="{ active: activePreset === preset.key }"
        >
          <i :class="preset.icon"></i>
          <span>{{ $t(`stockSimulator.screener.presets.${preset.key}`) }}</span>
        </button>
      </div>
    </div>

    <!-- Enhanced Filter Grid -->
    <div class="filters-grid">
      <!-- Market Cap Filter -->
      <div class="filter-section">
        <h4>
          <i class="fas fa-chart-pie"></i>
          {{ $t('stockSimulator.screener.marketCap') }}
        </h4>
        <div class="checkbox-group">
          <label v-for="cap in marketCapOptions" :key="cap.key" class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="filters.marketCap" 
              :value="cap.key"
              @change="applyFilters"
            />
            <span class="checkmark"></span>
            <span class="label-text">{{ $t(`stockSimulator.screener.marketCapOptions.${cap.key}`) }}</span>
            <span class="count-badge">{{ getMarketCapCount(cap.key) }}</span>
          </label>
        </div>
      </div>

      <!-- Sector Filter -->
      <div class="filter-section">
        <h4>
          <i class="fas fa-industry"></i>
          {{ $t('stockSimulator.screener.sector') }}
        </h4>
        <div class="sector-grid">
          <div 
            v-for="sector in sectors" 
            :key="sector.key"
            @click="toggleSector(sector.key)"
            class="sector-card"
            :class="{ active: filters.sector === sector.key }"
          >
            <i :class="sector.icon"></i>
            <span>{{ $t(`stockSimulator.screener.sectors.${sector.key}`) }}</span>
          </div>
        </div>
      </div>

      <!-- Enhanced Price Range with Visual Feedback -->
      <div class="filter-section">
        <h4>
          <i class="fas fa-dollar-sign"></i>
          {{ $t('stockSimulator.screener.priceRange') }}
        </h4>
        <div class="range-filter">
          <div class="range-inputs">
            <div class="input-group">
              <span class="input-prefix">$</span>
              <input 
                class="range-input" 
                v-model="filters.priceRange[0]" 
                type="number" 
                :min="0" 
                :max="filters.priceRange[1]" 
                :step="1"
                @input="applyFilters"
                placeholder="Min"
              />
            </div>
            <div class="range-separator">-</div>
            <div class="input-group">
              <span class="input-prefix">$</span>
              <input 
                class="range-input" 
                v-model="filters.priceRange[1]" 
                type="number" 
                :min="filters.priceRange[0]" 
                :max="1000" 
                :step="1"
                @input="applyFilters"
                placeholder="Max"
              />
            </div>
          </div>
          <Vue3Slider 
            @change="applyFilters" 
            v-model="filters.priceRange" 
            :min="0" 
            :max="1000" 
            class="price-slider"
          />
        </div>
      </div>

      <!-- Enhanced P/E Ratio -->
      <div class="filter-section">
        <h4>
          <i class="fas fa-chart-line"></i>
          {{ $t('stockSimulator.screener.peRatio') }}
        </h4>
        <div class="range-filter">
          <div class="range-inputs">
            <input 
              class="range-input" 
              v-model="filters.peRatio[0]" 
              type="number"
              :min="0" 
              :max="filters.peRatio[1]" 
              :step="0.1"
              @input="applyFilters"
              placeholder="Min P/E"
            />
            <div class="range-separator">-</div>
            <input 
              class="range-input" 
              v-model="filters.peRatio[1]" 
              type="number" 
              :min="filters.peRatio[0]" 
              :max="100" 
              :step="0.1"
              @input="applyFilters"
              placeholder="Max P/E"
            />
          </div>
          <Vue3Slider 
            @change="applyFilters" 
            v-model="filters.peRatio" 
            :min="0" 
            :max="100" 
            class="pe-slider"
          />
        </div>
      </div>

      <!-- Enhanced Dividend Yield -->
      <div class="filter-section">
        <h4>
          <i class="fas fa-percentage"></i>
          {{ $t('stockSimulator.screener.dividendYield') }}
        </h4>
        <div class="range-filter">
          <div class="range-inputs">
            <input 
              class="range-input" 
              v-model="filters.dividendYield[0]" 
              type="number" 
              :min="0" 
              :max="filters.dividendYield[1]" 
              :step="0.1"
              @input="applyFilters"
              placeholder="Min %"
            />
            <div class="range-separator">-</div>
            <input 
              class="range-input" 
              v-model="filters.dividendYield[1]" 
              type="number" 
              :min="filters.dividendYield[0]" 
              :max="15" 
              :step="0.1"
              @input="applyFilters"
              placeholder="Max %"
            />
          </div>
          <Vue3Slider 
            @change="applyFilters" 
            v-model="filters.dividendYield" 
            :min="0" 
            :max="15" 
            class="dividend-slider"
          />
        </div>
      </div>

      <!-- Enhanced Volume Filter -->
      <div class="filter-section">
        <h4>
          <i class="fas fa-chart-bar"></i>
          {{ $t('stockSimulator.screener.volume') }}
        </h4>
        <div class="volume-presets">
          <button 
            v-for="volumePreset in volumePresets" 
            :key="volumePreset.key"
            @click="setVolumePreset(volumePreset)"
            class="volume-preset-btn"
            :class="{ active: isVolumePresetActive(volumePreset) }"
          >
            {{ volumePreset.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Enhanced Results Summary -->
    <div class="results-summary" v-if="!isInitialLoad">
      <div class="results-info">
        <div class="results-count">
          <i class="fas fa-list"></i>
          {{ resultsCount || 0 }} stocks found
        </div>
        <div class="loading-indicator" v-if="isLoading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Filtering...</span>
        </div>
        <div class="premium-indicator" v-if="hasLockedStocks">
          <i class="fas fa-lock"></i>
          <span>Some premium stocks available</span>
        </div>
      </div>
      <div class="action-buttons">
        <button @click="resetFilters" class="reset-btn">
          <i class="fas fa-undo"></i>
          Reset
        </button>
        <button @click="saveFilters" class="save-btn">
          <i class="fas fa-save"></i>
          Save Filters
        </button>
        <button @click="exportResults" class="export-btn">
          <i class="fas fa-download"></i>
          Export
        </button>
      </div>
    </div>

    <!-- Enhanced Loading State -->
    <div v-if="isInitialLoad" class="initial-loading">
      <div class="loading-spinner">
        <i class="fas fa-chart-line fa-3x loading-icon"></i>
      </div>
      <h3>Loading US Stock Market Data</h3>
      <p>Fetching comprehensive stock data from multiple sources...</p>
      <div class="loading-progress">
        <div class="progress-bar"></div>
      </div>
      <div class="data-sources">
        <div class="source-item">
          <i class="fas fa-chart-area"></i>
          <span>TradingView</span>
        </div>
        <div class="source-item">
          <i class="fas fa-database"></i>
          <span>Alpha Vantage</span>
        </div>
        <div class="source-item">
          <i class="fas fa-cloud"></i>
          <span>Yahoo Finance</span>
        </div>
      </div>
    </div>

    <!-- Enhanced Error State -->
    <div v-if="hasError" class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Data Loading Error</h3>
        <p class="error-message">{{ errorMessage }}</p>
        <div class="error-actions">
          <button @click="loadInitialStocks" class="retry-btn">
            <i class="fas fa-refresh"></i>
            Retry Loading
          </button>
          <button @click="clearCache" class="clear-cache-btn">
            <i class="fas fa-trash"></i>
            Clear Cache
          </button>
        </div>
        <div class="fallback-info">
          <i class="fas fa-info-circle"></i>
          <span>Using sample data for demonstration</span>
        </div>
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
      stockScreenerService: StockScreenerService,
      activePreset: null,
      hasLockedStocks: false,
      lastResults: [],
      presets: [
        { key: 'growthStocks', name: 'Growth Stocks', icon: 'fas fa-rocket' },
        { key: 'valueStocks', name: 'Value Stocks', icon: 'fas fa-gem' },
        { key: 'dividendStocks', name: 'Dividend Stocks', icon: 'fas fa-coins' },
        { key: 'largeCap', name: 'Large Cap', icon: 'fas fa-building' },
        { key: 'smallCap', name: 'Small Cap', icon: 'fas fa-seedling' }
      ],
      marketCapOptions: [
        { key: 'mega', name: 'Mega Cap (>$200B)', count: 0 },
        { key: 'large', name: 'Large Cap ($10B-$200B)', count: 0 },
        { key: 'mid', name: 'Mid Cap ($2B-$10B)', count: 0 },
        { key: 'small', name: 'Small Cap ($300M-$2B)', count: 0 },
        { key: 'micro', name: 'Micro Cap (<$300M)', count: 0 }
      ],
      sectors: [
        { key: 'technology', name: 'Technology', icon: 'fas fa-microchip' },
        { key: 'healthcare', name: 'Healthcare', icon: 'fas fa-heartbeat' },
        { key: 'financials', name: 'Financials', icon: 'fas fa-university' },
        { key: 'energy', name: 'Energy', icon: 'fas fa-bolt' },
        { key: 'industrials', name: 'Industrials', icon: 'fas fa-industry' },
        { key: 'materials', name: 'Materials', icon: 'fas fa-hammer' },
        { key: 'utilities', name: 'Utilities', icon: 'fas fa-plug' },
        { key: 'realestate', name: 'Real Estate', icon: 'fas fa-home' },
        { key: 'consumer_discretionary', name: 'Consumer Discretionary', icon: 'fas fa-shopping-cart' },
        { key: 'consumer_staples', name: 'Consumer Staples', icon: 'fas fa-shopping-basket' },
        { key: 'telecommunications', name: 'Telecommunications', icon: 'fas fa-wifi' }
      ],
      volumePresets: [
        { key: 'low', label: 'Low (<10M)', min: 0, max: 10000000 },
        { key: 'medium', label: 'Medium (10M-50M)', min: 10000000, max: 50000000 },
        { key: 'high', label: 'High (>50M)', min: 50000000, max: 1000000000 }
      ]
    };
  },
  computed: {
    avgMarketCap() {
      if (!this.lastResults.length) return 'N/A';
      const avg = this.lastResults.reduce((sum, stock) => sum + (stock.marketCap || 0), 0) / this.lastResults.length;
      return this.formatMarketCap(avg);
    },
    topSector() {
      if (!this.lastResults.length) return 'N/A';
      const sectorCounts = {};
      this.lastResults.forEach(stock => {
        const sector = stock.sector || 'Unknown';
        sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
      });
      return Object.keys(sectorCounts).reduce((a, b) => sectorCounts[a] > sectorCounts[b] ? a : b);
    }
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
          this.lastResults = response.stocks;
          this.hasLockedStocks = response.stocks.some(stock => stock.isLocked);
          this.updateMarketCapCounts(response.stocks);
        
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
        this.handleFilterError(error);
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
        
        console.log('Loading comprehensive US stocks...');
        
        // Load all US stocks initially
        const response = await this.stockScreenerService.getAllUSStocks();
        
        if (response && response.stocks) {
          this.resultsCount = response.count || response.stocks.length;
          this.lastResults = response.stocks;
          this.hasLockedStocks = response.stocks.some(stock => stock.isLocked);
          this.updateMarketCapCounts(response.stocks);
        
          this.$emit('applyFilter', {
            filters: {},
            results: response.stocks
          });
          
          console.log(`✅ Loaded ${this.resultsCount} US stocks successfully from ${response.source}`);
        } else {
          throw new Error('Invalid response from stock screener service');
        }
      } catch (error) {
        console.error('Error loading initial stocks:', error);
        this.handleFilterError(error);
      } finally {
        this.isLoading = false;
        this.isInitialLoad = false;
      }
    },

    handleFilterError(error) {
      this.hasError = true;
      this.errorMessage = 'Failed to load stocks. Using comprehensive sample data.';
      
      // Fallback to mock data
      const fallbackData = this.getEnhancedMockStocks();
      this.resultsCount = fallbackData.length;
      this.lastResults = fallbackData;
      this.hasLockedStocks = fallbackData.some(stock => stock.isLocked);
      this.updateMarketCapCounts(fallbackData);
      
      this.$emit('applyFilter', {
        filters: this.filters,
        results: fallbackData
      });
      
      console.log(`Using ${this.resultsCount} enhanced mock stocks as fallback`);
    },

    getEnhancedMockStocks() {
      // Enhanced mock data with premium features
      const mockStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 189.50, change: '+2.5%', pe: 29.2, marketCap: 2950000000000, sector: 'Technology', beta: 1.2, dividendYield: 0.5, volume: 55000000, isLocked: false, tier: 'mega', analystRating: 'AAA' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.25, change: '+1.2%', pe: 25.1, marketCap: 1750000000000, sector: 'Technology', beta: 1.1, dividendYield: 0, volume: 28000000, isLocked: false, tier: 'mega', analystRating: 'AAA' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.30, change: '-0.8%', pe: 35.3, marketCap: 3080000000000, sector: 'Technology', beta: 0.9, dividendYield: 0.7, volume: 22000000, isLocked: false, tier: 'mega', analystRating: 'AAA' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.48, change: '+3.2%', pe: 45.2, marketCap: 790000000000, sector: 'Consumer Cyclical', beta: 2.1, dividendYield: 0, volume: 45000000, isLocked: true, tier: 'large', analystRating: 'AA' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 155.89, change: '+0.5%', pe: 45.8, marketCap: 1620000000000, sector: 'Consumer Cyclical', beta: 1.3, dividendYield: 0, volume: 35000000, isLocked: false, tier: 'mega', analystRating: 'AAA' },
        { symbol: 'META', name: 'Meta Platforms Inc.', price: 503.22, change: '+1.8%', pe: 24.5, marketCap: 1280000000000, sector: 'Technology', beta: 1.4, dividendYield: 0.4, volume: 18000000, isLocked: true, tier: 'mega', analystRating: 'AA' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.28, change: '+4.2%', pe: 72.2, marketCap: 2150000000000, sector: 'Technology', beta: 1.8, dividendYield: 0.03, volume: 42000000, isLocked: true, tier: 'mega', analystRating: 'AAA' },
        { symbol: 'NFLX', name: 'Netflix Inc.', price: 486.75, change: '-1.1%', pe: 34.9, marketCap: 210000000000, sector: 'Consumer Cyclical', beta: 1.2, dividendYield: 0, volume: 8500000, isLocked: false, tier: 'large', analystRating: 'A' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 181.52, change: '+0.8%', pe: 12.5, marketCap: 530000000000, sector: 'Financial Services', beta: 1.1, dividendYield: 2.8, volume: 12000000, isLocked: false, tier: 'large', analystRating: 'AA' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 162.35, change: '+0.3%', pe: 15.2, marketCap: 425000000000, sector: 'Healthcare', beta: 0.7, dividendYield: 3.1, volume: 8000000, isLocked: false, tier: 'large', analystRating: 'AAA' }
      ];
      
      // Apply basic filtering if filters are set
      return mockStocks.filter(stock => {
        // Price range filter
        if (this.filters.priceRange && (stock.price < this.filters.priceRange[0] || stock.price > this.filters.priceRange[1])) {
          return false;
        }
        
        // Sector filter
        if (this.filters.sector && stock.sector.toLowerCase() !== this.filters.sector.toLowerCase()) {
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
        this.activePreset = preset.key;
        const presetFilters = this.stockScreenerService.getPresetFilters(preset.key);
      
        // Merge preset filters with current filters
        this.filters = {
          ...this.filters,
          ...presetFilters
        };
        
        // Apply the filters
        this.applyFilters();
        
        console.log('Applied preset filters:', presetFilters);
      } catch (error) {
        console.error('Error applying preset:', error);
        this.$emit('error', `Failed to apply ${preset.name} preset`);
      }
    },

    toggleSector(sectorKey) {
      if (this.filters.sector === sectorKey) {
        this.filters.sector = '';
      } else {
        this.filters.sector = sectorKey;
      }
      this.applyFilters();
    },

    setVolumePreset(preset) {
      this.filters.volume = [preset.min, preset.max];
      this.applyFilters();
    },

    isVolumePresetActive(preset) {
      return this.filters.volume[0] === preset.min && this.filters.volume[1] === preset.max;
    },

    getMarketCapCount(capKey) {
      const option = this.marketCapOptions.find(opt => opt.key === capKey);
      return option ? option.count : 0;
    },

    updateMarketCapCounts(stocks) {
      // Reset counts
      this.marketCapOptions.forEach(option => option.count = 0);
      
      // Count stocks in each market cap category
      stocks.forEach(stock => {
        const tier = this.stockScreenerService.getStockTier(stock);
        const option = this.marketCapOptions.find(opt => opt.key === tier);
        if (option) option.count++;
      });
    },

    formatMarketCap(value) {
      if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
      if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
      return `$${value.toFixed(0)}`;
    },

    resetFilters() {
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
      this.activePreset = null;
      this.applyFilters();
    },

    saveFilters() {
      const filtersToSave = {
        ...this.filters,
        timestamp: Date.now(),
        name: `Filter_${new Date().toISOString().split('T')[0]}`
      };
      
      localStorage.setItem('stockScreenerFilters', JSON.stringify(filtersToSave));
      this.$emit('success', 'Filters saved successfully');
    },

    exportResults() {
      if (!this.lastResults.length) {
        this.$emit('warning', 'No results to export');
        return;
      }

      const csv = this.convertToCSV(this.lastResults);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stock_screener_results_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    },

    convertToCSV(data) {
      const headers = ['Symbol', 'Name', 'Price', 'Change', 'P/E', 'Market Cap', 'Sector', 'Dividend Yield', 'Volume', 'Beta', 'Rating', 'Tier'];
      const rows = data.map(stock => [
        stock.symbol,
        stock.name,
        stock.price,
        stock.change,
        stock.pe,
        stock.marketCap,
        stock.sector,
        stock.dividendYield,
        stock.volume,
        stock.beta,
        stock.analystRating || 'N/A',
        stock.tier || 'N/A'
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    },

    clearCache() {
      this.stockScreenerService.clearCache();
      this.$emit('success', 'Cache cleared successfully');
      this.loadInitialStocks();
    }
  }
};
</script>

<style scoped>
.stock-screener {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 24px;
  padding: 2rem;
  color: #000000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Enhanced Header */
.screener-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.title-section h3 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.screener-subtitle {
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0;
  font-weight: 400;
  color: #666666;
}

.stats-section {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(0, 0, 0, 0.15);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Enhanced Presets */
.preset-section {
  margin-bottom: 2rem;
}

.preset-section h4 {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preset-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.preset-btn {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  color: #000000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(8px);
}

.preset-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.preset-btn.active {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-color: #000000;
  color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}

/* Enhanced Filter Grid */
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.filter-section {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.filter-section:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.filter-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #000000;
}

.filter-section h4 i {
  color: #000000;
}

/* Enhanced Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.checkbox-label:hover {
  background: rgba(0, 0, 0, 0.1);
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-color: #000000;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.label-text {
  flex: 1;
  font-weight: 500;
}

.count-badge {
  background: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #000000;
}

/* Enhanced Sector Grid */
.sector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.sector-card {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #000000;
}

.sector-card:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.sector-card.active {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-color: #000000;
  color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}

.sector-card i {
  font-size: 1.5rem;
  color: #000000;
}

.sector-card.active i {
  color: white;
}

/* Enhanced Range Filters */
.range-filter {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.input-group {
  position: relative;
  flex: 1;
}

.input-prefix {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-weight: 600;
  z-index: 1;
}

.range-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  color: #000000;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.range-input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.1);
}

.range-input::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

.range-separator {
  font-weight: 600;
  color: #9ca3af;
  padding: 0 0.5rem;
}

/* Enhanced Sliders */
.price-slider,
.pe-slider,
.dividend-slider {
  margin-top: 0.5rem;
}

/* Volume Presets */
.volume-presets {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.volume-preset-btn {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: #000000;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.volume-preset-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.volume-preset-btn.active {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border-color: #000000;
  color: white;
}

/* Enhanced Results Summary */
.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
}

.results-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.results-count {
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #000000;
}

.premium-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666666;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.reset-btn,
.save-btn,
.export-btn,
.clear-cache-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.reset-btn {
  background: rgba(0, 0, 0, 0.1);
  color: #000000;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.reset-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

.save-btn {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border: 1px solid #000000;
}

.save-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.export-btn {
  background: linear-gradient(135deg, #333333 0%, #666666 100%);
  color: white;
  border: 1px solid #333333;
}

.export-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(51, 51, 51, 0.3);
}

.clear-cache-btn {
  background: linear-gradient(135deg, #666666 0%, #999999 100%);
  color: white;
  border: 1px solid #666666;
}

.clear-cache-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 102, 102, 0.3);
}

/* Enhanced Loading State */
.initial-loading {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  margin-top: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  color: #000000;
}

.loading-spinner {
  margin-bottom: 2rem;
}

.loading-icon {
  color: #000000;
  animation: pulse 2s infinite;
}

.initial-loading h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.initial-loading p {
  opacity: 0.8;
  margin-bottom: 2rem;
}

.loading-progress {
  width: 100%;
  max-width: 400px;
  margin: 2rem auto;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
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
  border-radius: 3px;
  animation: loading-slide 2s infinite;
}

@keyframes loading-slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.data-sources {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.source-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
}

.source-item i {
  font-size: 1.5rem;
  color: #000000;
}

/* Enhanced Error State */
.error-container {
  text-align: center;
  padding: 3rem 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  margin-top: 2rem;
  backdrop-filter: blur(8px);
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-icon {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-container h3 {
  font-size: 1.5rem;
  color: #ef4444;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.error-message {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
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
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.fallback-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #60a5fa;
  font-size: 0.9rem;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .stock-screener {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-section {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .preset-buttons {
    flex-direction: column;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .checkbox-group {
    max-height: 200px;
    overflow-y: auto;
  }
  
  .results-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .range-inputs {
    flex-direction: column;
  }
  
  .sector-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .title-section h3 {
    font-size: 2rem;
  }
  
  .filters-grid {
    gap: 1rem;
  }
  
  .filter-section {
    padding: 1rem;
  }
  
  .sector-grid {
    grid-template-columns: 1fr;
  }
}
</style>
  