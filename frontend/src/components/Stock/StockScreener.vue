<template>
  <div class="stock-screener">

    <!-- Header -->
    <div class="screener-header">
      <div class="header-content">
        <div class="title-section">
          <h3>{{ $t('stockSimulator.screener.title') }}</h3>
        </div>

        <!-- KPIs -->
        <div class="stats-section" v-if="!isInitialLoad">
          <div class="stat-card">
            <div class="stat-number">{{ resultsCount || 0 }}</div>
            <div class="stat-label">Stocks Found</div>
          </div>
          <div class="stat-card" v-if="resultsCount > 0">
            <div class="stat-number">{{ avgMarketCap }}</div>
            <div class="stat-label">Avg Market Cap</div>
          </div>
          <div class="stat-card" v-if="resultsCount > 0">
            <div class="stat-number">{{ topSector }}</div>
            <div class="stat-label">Top Sector</div>
          </div>
          <div class="stat-card" v-if="resultsCount === 0 && !hasActiveFilters()">
            <div class="stat-number">0</div>
            <div class="stat-label">Stocks (Apply Filters)</div>
          </div>
        </div>
      </div>
    </div>


    <!-- Scrollable Content -->
    <div class="scrollable-content">

    <!-- Top Bar: Presets + Actions -->
    <div class="top-bar">
      <!-- Left Side: Quick Presets -->
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

      <!-- Right Side: Action Buttons -->
      <div class="action-buttons">
        <button @click="applyFilters" class="apply-btn" :disabled="!hasActiveFilters()">
          <i class="fas fa-search"></i>
          Apply Filter
        </button>
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

    <!-- Market Cap & Sector Filters - Side by Side -->
    <div class="filters-row">
      <!-- Market Cap Filter - Collapsible -->
      <div class="filter-section">
        <div class="filter-header">
          <h4>
            <i class="fas fa-chart-pie"></i>
            {{ $t('stockSimulator.screener.marketCap') }}
          </h4>
          <button 
            @click="toggleMarketCapDropdown" 
            class="dropdown-toggle"
            :class="{ active: showMarketCapDropdown }"
          >
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>

        <div v-show="showMarketCapDropdown" class="filters-dropdown">
          <div class="filter-grid">
            <label 
              v-for="cap in marketCapOptions" 
              :key="cap.key" 
              class="filter-checkbox"
            >
              <input 
                type="checkbox" 
                :value="cap.key" 
                v-model="filters.marketCap"
                @change="applyFilters"
              >
              <span class="checkmark"></span>
              <span class="label-text">
                {{ $t(`stockSimulator.screener.marketCapOptions.${cap.key}`) }}
                <span class="count-pill">{{ getMarketCapCount(cap.key) }}</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Sector Filter - Collapsible -->
      <div class="filter-section">
        <div class="filter-header">
          <h4>
            <i class="fas fa-industry"></i>
            {{ $t('stockSimulator.screener.sector') }}
          </h4>
          <button 
            @click="toggleSectorDropdown" 
            class="dropdown-toggle"
            :class="{ active: showSectorDropdown }"
          >
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>

        <div v-show="showSectorDropdown" class="filters-dropdown">
          <div class="filter-grid">
            <label 
              v-for="s in sectorsSortedByLength" 
              :key="s.key" 
              class="filter-checkbox"
            >
              <input 
                type="checkbox" 
                :value="s.key" 
                v-model="filters.sector"
                @change="applyFilters"
              >
              <span class="checkmark"></span>
              <span class="label-text">
                {{ s.name }}
                <span class="count-pill">{{ getSectorCount(s.key) }}</span>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Other Filters -->
    <div class="filters-grid">


      <!-- Range Filters Row: Grouped under parent cards -->
      <div class="range-filters-row">
        <!-- Left Group: Price Range and P/E Ratio (under Market Cap) -->
        <div class="filter-group-left">
          <!-- Price -->
          <div class="filter-section filter-section-compact price-range">
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
                    v-model="priceMinDisplay"
                    inputmode="decimal"
                    placeholder="Min"
                    @blur="commitPrice('min')"
                    @keydown.enter.prevent="commitPrice('min')"
                  />
                </div>

                <div class="input-group">
                  <span class="input-prefix">$</span>
                  <input
                    class="range-input"
                    v-model="priceMaxDisplay"
                    inputmode="decimal"
                    placeholder="Max"
                    @blur="commitPrice('max')"
                    @keydown.enter.prevent="commitPrice('max')"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- P/E -->
          <div class="filter-section filter-section-compact pe-ratio">
            <h4><i class="fas fa-chart-line"></i> {{ $t('stockSimulator.screener.peRatio') }}</h4>
            <div class="range-filter">
              <div class="range-inputs">
                <input class="range-input" v-model="peMinDisplay"
                      inputmode="decimal" placeholder="Min P/E"
                      @blur="commitPe('min')" @keydown.enter.prevent="commitPe('min')" />
                <input class="range-input" v-model="peMaxDisplay"
                      inputmode="decimal" placeholder="Max P/E"
                      @blur="commitPe('max')" @keydown.enter.prevent="commitPe('max')" />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Group: Dividend Yield and Volume (under Sector) -->
        <div class="filter-group-right">
          <!-- Dividend -->
          <div class="filter-section filter-section-compact dividend-yield">
            <h4><i class="fas fa-percentage"></i> {{ $t('stockSimulator.screener.dividendYield') }}</h4>
            <div class="range-filter">
              <div class="range-inputs">
                <input class="range-input" v-model="divMinDisplay"
                      inputmode="decimal" placeholder="Min %"
                      @blur="commitDiv('min')" @keydown.enter.prevent="commitDiv('min')" />
                <input class="range-input" v-model="divMaxDisplay"
                      inputmode="decimal" placeholder="Max %"
                      @blur="commitDiv('max')" @keydown.enter.prevent="commitDiv('max')" />
              </div>
            </div>
          </div>

          <!-- Volume -->
          <div class="filter-section filter-section-compact volume">
            <h4><i class="fas fa-chart-bar"></i> {{ $t('stockSimulator.screener.volume') }}</h4>

            <div class="vol-wrap">
              <button
                v-for="p in volumePresets"
                :key="p.key"
                class="vol-chip"
                :class="{ active: isVolumePresetSelected(p.key) }"
                @click="toggleVolumePreset(p.key)"
              >
                {{ p.label }}
              </button>
            </div>
          </div>
        </div>
      </div> <!-- Close range-filters-row -->
    </div>


    <!-- Pagination Controls (Top) -->


    <!-- Initial State Message -->
    <div v-if="resultsCount === 0 && !hasActiveFilters() && !isLoading" class="initial-state">
      <p>Apply filter to see stocks</p>
    </div>

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

    

    <!-- Scroll to Top Button -->
    <button 
      v-if="showScrollTop" 
      @click="scrollToTop" 
      class="scroll-to-top-btn"
      title="Scroll to top"
    >
      <i class="fas fa-arrow-up"></i>
    </button>

    </div> <!-- Close scrollable-content -->
  </div>
</template>

<script>
import Vue3Slider from 'vue-3-slider-component';
import debounce from 'lodash/debounce';
import StockScreenerService from '@/services/stockScreenerService';
import StockCard from '@/components/Stock/StockCard.vue';

export default {
  name: 'StockScreener',
  components: { Vue3Slider, StockCard },
  data() {
    return {
      filters: {
        marketCap: [], // Changed to array to support multiple selections
        sector: [], // Changed to array to support multiple selections
        priceRange: [0, 1000],
        peRatio: [0, Infinity],
        marketCapRange: [0, 5000000000000],
        dividendYield: [0, 15],
        volume: [], // Changed to array to support multiple volume presets
        beta: [0, 3]
      },
      
      // Data properties
      resultsCount: null,
      avgMarketCapFromBackend: null, // Store backend-calculated average
      showMarketCapDropdown: false,
      showSectorDropdown: false,
      isLoading: false,
      hasError: false,
      errorMessage: '',
      isInitialLoad: true,
      stockScreenerService: StockScreenerService,
      activePreset: null,
      hasLockedStocks: false,
      lastResults: [],
      _nextReqId: 1,
      // Pagination properties
      currentPage: 1,
      totalPages: 1,
      pageSize: 5, // Default to top 5 stocks when no filters applied
      isLoadingMore: false,
      // Apply Filter workflow
      lastAppliedFilters: {},
      // Removed refresh-related data properties
      // Scroll to top
      showScrollTop: false,
      presets: [
        { key: 'growthStocks', name: 'Growth Stocks', icon: 'fas fa-rocket' },
        { key: 'valueStocks', name: 'Value Stocks', icon: 'fas fa-gem' },
        { key: 'dividendStocks', name: 'Dividend Stocks', icon: 'fas fa-coins' }
      ],
      marketCapOptions: [
        { key: 'mega', name: 'Mega Cap (>$200B)', count: 0 },
        { key: 'large', name: 'Large Cap ($10B-$200B)', count: 0 },
        { key: 'mid', name: 'Mid Cap ($2B-$10B)', count: 0 },
        { key: 'small', name: 'Small Cap ($300M-$2B)', count: 0 },
        { key: 'micro', name: 'Micro Cap (<$300M)', count: 0 }
      ],
      sectors: [
        { key: 'technology', name: 'Tech', icon: 'fas fa-microchip', count: 0 },
        { key: 'healthcare', name: 'Healthcare', icon: 'fas fa-heartbeat', count: 0 },
        { key: 'financials', name: 'Financials', icon: 'fas fa-university', count: 0 },
        { key: 'energy', name: 'Energy', icon: 'fas fa-bolt', count: 0 },
        { key: 'industrials', name: 'Industrials', icon: 'fas fa-industry', count: 0 },
        { key: 'materials', name: 'Materials', icon: 'fas fa-hammer', count: 0 },
        { key: 'utilities', name: 'Utilities', icon: 'fas fa-plug', count: 0 },
        { key: 'realestate', name: 'Real Estate', icon: 'fas fa-home', count: 0 },
        { key: 'consumer_discretionary', name: 'Consumer Discretionary', icon: 'fas fa-shopping-cart', count: 0 },
        { key: 'consumer_staples', name: 'Consumer Staples', icon: 'fas fa-shopping-basket', count: 0 },
        { key: 'telecommunications', name: 'Telecom', icon: 'fas fa-wifi', count: 0 }
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
      // Use backend-calculated average if available, otherwise fallback to current page average
      if (this.avgMarketCapFromBackend !== null && this.avgMarketCapFromBackend !== undefined) {
        return this.formatMarketCap(this.avgMarketCapFromBackend);
      }
      
      // Fallback: calculate from current page results (for backward compatibility)
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
    },

    // Removed data freshness indicators

    /* ---- Summaries for compact headers/tags ---- */
    sectorLabel() {
      if (!this.filters.sector || this.filters.sector.length === 0) return 'Any';
      return this.filters.sector.map(sectorKey => {
        const s = this.sectors.find(x => x.key === sectorKey);
        return s ? s.name : sectorKey;
      }).join(', ');
    },
    sectorsSortedByLength() {
      // Sort alphabetically by display name
      return [...this.sectors].sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      });
    },

    marketCapSummary() {
      if (!this.filters.marketCap || this.filters.marketCap.length === 0) return 'Any';
      const map = { mega: 'Mega', large: 'Large', mid: 'Mid', small: 'Small', micro: 'Micro' };
      return this.filters.marketCap.map(cap => map[cap] || cap).join(', ');
    },
    priceSummary() {
      const [min, max] = this.filters.priceRange;
      if (min === 0 && max === 1000) return null; // Don't show if at default range
      return `$${min}–$${max}`;
    },
    peSummary() {
      const [min, max] = this.filters.peRatio;
      if (min === 0 && max === Infinity) return null; // Don't show if at default range
      return `P/E ${min}–${max}`;
    },
    divSummary() {
      const [min, max] = this.filters.dividendYield;
      if (min === 0 && max === 15) return null; // Don't show if at default range
      return `Div ${min}%–${max}%`;
    },
    volSummary() {
      if (!this.filters.volume || this.filters.volume.length === 0) return 'Any Volume';
      return this.filters.volume.map(volumeKey => {
        const preset = this.volumePresets.find(p => p.key === volumeKey);
        return preset ? preset.label : volumeKey;
      }).join(', ');
    },
    activeTags() {
      const arr = [];
      if (this.filters.marketCap && this.filters.marketCap.length > 0) arr.push({ key: 'cap', text: `Cap: ${this.marketCapSummary}`, clear: () => (this.filters.marketCap = [], this.applyFilters()) });
      if (this.filters.sector && this.filters.sector.length > 0) arr.push({ key: 'sec', text: `${this.sectorLabel}`, clear: () => (this.filters.sector = [], this.applyFilters()) });
      if (this.filters.volume && this.filters.volume.length > 0) arr.push({ key: 'vol', text: this.volSummary, clear: () => (this.filters.volume = [], this.applyFilters()) });
      
      // Only show range filters if they're not at default values
      if (this.priceSummary) arr.push({ key: 'price', text: this.priceSummary, clear: () => (this.filters.priceRange = [0, 1000], this.applyFilters()) });
      if (this.peSummary) arr.push({ key: 'pe', text: this.peSummary, clear: () => (this.filters.peRatio = [0, Infinity], this.applyFilters()) });
      if (this.divSummary) arr.push({ key: 'div', text: this.divSummary, clear: () => (this.filters.dividendYield = [0, 15], this.applyFilters()) });
      
      return arr;
    },
    marketCapCol1() { 
      return this.marketCapOptions.slice(0, 3); 
    }, // first 3
    marketCapCol2() { 
      return this.marketCapOptions.slice(3); 
    }, // last 2
    // Show formatted strings in inputs while keeping numeric values in filters
  priceMinDisplay: {
    get() { 
      const value = this.filters.priceRange[0];
      return value === 0 ? '' : this.formatMoney(value);
    },
    set(v) { this._priceMinTemp = v; } // temp until commit
  },
  priceMaxDisplay: {
    get() { 
      const value = this.filters.priceRange[1];
      return value === 1000 ? '' : this.formatMoney(value);
    },
    set(v) { this._priceMaxTemp = v; }
  },
  peMinDisplay: {
    get() { 
      const value = this.filters.peRatio[0];
      return value === 0 ? '' : this.formatMoney(value);
    },
    set(v) { this._peMinTemp = v; }
  },
  peMaxDisplay: {
    get() { 
      const value = this.filters.peRatio[1];
      return value === 100 ? '' : this.formatMoney(value);
    },
    set(v) { this._peMaxTemp = v; }
  },

  divMinDisplay: {
    get() { 
      const value = this.filters.dividendYield[0];
      return value === 0 ? '' : this.formatMoney(value);
    },
    set(v) { this._divMinTemp = v; }
  },
  divMaxDisplay: {
    get() { 
      const value = this.filters.dividendYield[1];
      return value === 15 ? '' : this.formatMoney(value);
    },
    set(v) { this._divMaxTemp = v; }
  }
},


  mounted() {
    // Don't load initial stocks - wait for user to apply filters
    this.isInitialLoad = false;
    this.resultsCount = 0;
    this.lastResults = [];

    // Optional: only one accordion open at a time
    this.$nextTick(() => {
      const accordions = this.$el.querySelectorAll('details[data-accordion]');
      accordions.forEach(d => {
        d.addEventListener('toggle', () => {
          if (d.open) {
            accordions.forEach(o => { if (o !== d) o.open = false; });
          }
        });
      });

      // Add scroll listener for scroll-to-top button
      const scrollableContent = this.$el.querySelector('.scrollable-content');
      if (scrollableContent) {
        scrollableContent.addEventListener('scroll', this.handleScroll);
      }
    });
  },

  beforeUnmount() {
    // Cleanup - no longer needed since refresh methods removed

    // Remove scroll listener
    const scrollableContent = this.$el?.querySelector('.scrollable-content');
    if (scrollableContent) {
      scrollableContent.removeEventListener('scroll', this.handleScroll);
    }
  },

  methods: {
    async loadPage(page) {
      const safePage = Math.max(1, Math.min(Number(page) || 1, this.totalPages || 1));
      if (safePage === this.currentPage) return;
      this.isLoadingMore = true;
      try {
        const response = await this.stockScreenerService.fetchPage(safePage, this.filters, this.pageSize);
        this.processStocks(response, this.filters);
        this.lastUpdated = Date.now();
      } catch (error) {
        console.error('Error loading page:', error);
        this.$emit('error', 'Failed to load page');
      } finally {
        this.isLoadingMore = false;
      }
    },
    /* ---------- Utilities ---------- */
    // Check if any filters are actually applied (not just default values)
    hasActiveFilters() {
      // Check if any market cap filters are selected
      if (this.filters.marketCap && this.filters.marketCap.length > 0) {
        return true;
      }
      
      // Check if any sector filters are selected
      if (this.filters.sector && this.filters.sector.length > 0) {
        return true;
      }
      
      // Check if any volume filters are selected
      if (this.filters.volume && this.filters.volume.length > 0) {
        return true;
      }
      
      // Check if price range is not default (0-1000)
      const [minPrice, maxPrice] = this.filters.priceRange || [0, 1000];
      if (minPrice !== 0 || maxPrice !== 1000) {
        return true;
      }
      
      // Check if P/E ratio is not default (0-Infinity)
      const [minPE, maxPE] = this.filters.peRatio || [0, Infinity];
      if (minPE !== 0 || maxPE !== Infinity) {
        return true;
      }
      
      // Check if dividend yield is not default (0-15)
      const [minDiv, maxDiv] = this.filters.dividendYield || [0, 15];
      if (minDiv !== 0 || maxDiv !== 15) {
        return true;
      }
      
      return false;
    },
    
    // key -> display label (i18n first, fallback to config name/key)
    sectorKeyToLabel(key) {
      if (!key) return '';
      
      // Map component keys -> labels used in API data
      const map = {
        technology: ['Electronic Technology', 'Technology Services', 'Health Technology'], // API returns these sector names
        healthcare: 'Health Technology',
        financials: 'Finance',
        energy: 'Energy Minerals',
        industrials: 'Industrial Services', // Update when we see this sector
        materials: 'Materials', // Update when we see this sector
        utilities: 'Utilities', // Update when we see this sector
        realestate: 'Real Estate', // Update when we see this sector
        consumer_discretionary: 'Retail Trade', // API data uses "Retail Trade"
        consumer_staples: 'Consumer Durables', // API data uses "Consumer Durables"
        telecommunications: 'Telecom' // Update when we see this sector
      };
      
      // Try explicit mapping first, then i18n, then sectors config
      if (map[key]) return map[key];
      
      const fromI18n = this.$t?.(`stockSimulator.screener.sectors.${key}`);
      if (typeof fromI18n === 'string' && !fromI18n.startsWith('stockSimulator.')) return fromI18n;
      
      const item = this.sectors.find(s => s.key === key);
      return item?.name || key;
    },
    norm(s) { 
      if (s == null) return '';
      if (typeof s === 'object') return '';
      return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); 
    },

    /* ---------- Core fetch flow (race-safe) ---------- */

    processStocks(response, filtersForEmit = this.filters) {
      const { stocks = [], count, source, marketCapCounts, sectorCounts, totalPages, avgMarketCap } = response || {};
      this.resultsCount = Number.isFinite(count) ? count : stocks.length;
      this.lastResults = stocks;
      this.avgMarketCapFromBackend = avgMarketCap; // Store backend-calculated average
      this.totalPages = totalPages || Math.ceil(this.resultsCount / this.pageSize);
      this.currentPage = response.currentPage || 1;
      this.hasLockedStocks = stocks.some(s => s.isLocked);
      
      // Use market cap counts from service if available, otherwise calculate from stocks
      if (marketCapCounts) {
        this.updateMarketCapCountsFromService(marketCapCounts);
      } else {
        this.updateMarketCapCounts(stocks);
      }
      
      // Use sector counts from backend if available, otherwise calculate from stocks
      if (sectorCounts) {
        this.updateSectorCountsFromService(sectorCounts);
      } else {
        this.updateSectorCounts(stocks);
      }
      
      // Update last updated timestamp
      this.lastUpdated = Date.now();
      
      this.$emit('applyFilter', { 
        filters: filtersForEmit, 
        results: stocks, 
        totalCount: count,
        currentPage: this.currentPage,
        totalPages: this.totalPages,
        lastUpdated: this.lastUpdated 
      });
      if (source) console.debug(`Loaded ${stocks.length} stocks from ${source}. Total available: ${this.resultsCount}`);
    },

    async applyFiltersInternal() {
      const reqId = this._nextReqId++;
      try {
        this.isLoading = true; 
        this.hasError = false; 
        this.errorMessage = '';

        // Check if any filters are actually applied (not just default values)
        const hasActiveFilters = this.hasActiveFilters();
        
        if (!hasActiveFilters) {
          // No filters applied, show empty state
          console.log('🔄 No filters applied, showing empty state...');
          this.resultsCount = 0;
          this.lastResults = [];
          this.hasLockedStocks = false;
          this.updateMarketCapCounts([]);
          this.updateSectorCounts([]);
          this.lastUpdated = Date.now();
          this.$emit('applyFilter', { 
            filters: {}, 
            results: [], 
            totalCount: 0,
            currentPage: 1,
            totalPages: 1,
            lastUpdated: this.lastUpdated 
          });
          return;
        }

        // Load the first page of results (includes correct totalCount and marketCapCounts)
        const response = await this.stockScreenerService.fetchPage(1, this.filters, this.pageSize);
        
        // Process stocks with all the correct data from backend
        this.processStocks(response, this.filters);
      } catch (error) {
        console.error('Error applying filters:', error);
        this.handleFilterError(error);
      } finally {
        this.isLoading = false;
      }
    },

    applyFilters: debounce(function() {
      this.applyFiltersInternal();
    }, 1200), // Increased debounce to prevent API spamming

    async loadInitialStocks() {
      const reqId = this._nextReqId++;
      try {
        this.isLoading = true;
        this.isInitialLoad = true;
        this.hasError = false;
        this.errorMessage = '';

        // No initial load - show empty state until filters are applied
        console.log('🔄 Initial load: showing empty state (no filters applied)...');
        this.resultsCount = 0;
        this.lastResults = [];
        this.hasLockedStocks = false;
        this.updateMarketCapCounts([]);
        this.updateSectorCounts([]);
        this.lastUpdated = Date.now();
        this.$emit('applyFilter', { 
          filters: {}, 
          results: [], 
          totalCount: 0,
          currentPage: 1,
          totalPages: 1,
          lastUpdated: this.lastUpdated 
        });
      } catch (error) {
        console.error('Error loading initial stocks:', error);
        this.handleFilterError(error);
      } finally {
        this.isLoading = false;
        this.isInitialLoad = false;
      }
    },

    async handleFilterError(error) {
      this.hasError = true;
      this.errorMessage = 'Failed to load stocks. Backend server is not available. Please ensure the backend server is running on localhost:3000.';
      this.resultsCount = 0;
      this.lastResults = [];
      this.hasLockedStocks = false;
      this.updateMarketCapCounts([]);
      this.updateSectorCounts([]);
      this.$emit('applyFilter', { filters: this.filters, results: [] });
    },

    /* ---------- Data helpers ---------- */
    async getDynamicStockData() {
      try {
        // Clear cache to ensure fresh data
        StockScreenerService.clearCache();
        console.log('🔄 Cache cleared, forcing fresh data load...');
        
        // Try to get real-time data from service
        const result = await StockScreenerService.getAllUSStocks();
        if (result && result.stocks && result.stocks.length > 0) {
          console.log(`✅ Loaded ${result.stocks.length} stocks from API`);
          
          // Use API data regardless of count (we're using pagination now)
          // Add tier property based on market cap
          return result.stocks.map(stock => ({
            ...stock,
            tier: this.calculateTierFromMarketCap(stock.marketCap || stock.close * 1000000) // Estimate market cap if not provided
          }));
        }
      } catch (error) {
        console.error('❌ Failed to fetch stock data:', error.message);
        throw error; // Re-throw the error instead of using fallback data
      }
    },

    applyPreset(preset) {
      try {
        this.activePreset = preset.key;
        const presetFilters = this.stockScreenerService.getPresetFilters(preset.key) || {};
        this.filters = { ...this.filters, ...presetFilters };
      } catch (e) {
        console.error('Error applying preset:', e);
        this.$emit('error', `Failed to apply ${preset.name} preset`);
      }
    },

    toggleSector(sectorKey) {
      const index = this.filters.sector.indexOf(sectorKey);
      if (index > -1) {
        this.filters.sector.splice(index, 1);
      } else {
        this.filters.sector.push(sectorKey);
      }
    },

    isSectorSelected(sectorKey) {
      return this.filters.sector.includes(sectorKey);
    },

    toggleMarketCap(capKey) {
      const index = this.filters.marketCap.indexOf(capKey);
      if (index > -1) {
        this.filters.marketCap.splice(index, 1);
      } else {
        this.filters.marketCap.push(capKey);
      }
    },

    isMarketCapSelected(capKey) {
      return this.filters.marketCap.includes(capKey);
    },


    toggleSector(sectorKey) {
      const index = this.filters.sector.indexOf(sectorKey);
      if (index > -1) {
        this.filters.sector.splice(index, 1);
      } else {
        this.filters.sector.push(sectorKey);
      }
      this.applyFilters();
    },

    toggleMarketCapDropdown() {
      this.showMarketCapDropdown = !this.showMarketCapDropdown;
    },

    toggleSectorDropdown() {
      this.showSectorDropdown = !this.showSectorDropdown;
    },

    toggleVolumePreset(presetKey) {
      const index = this.filters.volume.indexOf(presetKey);
      if (index > -1) {
        this.filters.volume.splice(index, 1);
      } else {
        this.filters.volume.push(presetKey);
      }
    },

    isVolumePresetSelected(presetKey) {
      return this.filters.volume.includes(presetKey);
    },

    getMarketCapCount(capKey) {
      const opt = this.marketCapOptions.find(o => o.key === capKey);
      return opt ? opt.count : 0;
    },

    getSectorCount(sectorKey) {
      const sector = this.sectors.find(s => s.key === sectorKey);
      return sector ? sector.count : 0;
    },

    updateMarketCapCounts(stocks) {
      this.marketCapOptions.forEach(o => (o.count = 0));
      stocks.forEach(s => {
        // Use tier field directly from mock data, or calculate from marketCap
        const tier = s.tier || this.calculateTierFromMarketCap(s.marketCap);
        const opt = this.marketCapOptions.find(o => o.key === tier);
        if (opt) opt.count++;
      });
    },

    updateMarketCapCountsFromService(marketCapCounts) {
      this.marketCapOptions.forEach(option => {
        option.count = marketCapCounts[option.key] || 0;
      });
    },

    updateSectorCountsFromService(sectorCounts) {
      this.sectors.forEach(sector => {
        sector.count = sectorCounts[sector.key] || 0;
      });
    },

    updateSectorCounts(stocks) {
      // Reset all counts
      this.sectors.forEach(s => s.count = 0);
      
      // Count stocks by sector using the backend sector mapping
      stocks.forEach(stock => {
        const stockSector = stock.sector;
        if (!stockSector) return;
        
        // Find matching sector by checking if the stock's sector matches any of our sector mappings
        const matchingSector = this.sectors.find(s => {
          const mappedSectors = this.stockScreenerService.mapSectorKeyToBackend(s.key);
          if (Array.isArray(mappedSectors)) {
            return mappedSectors.includes(stockSector);
          }
          return mappedSectors === stockSector;
        });
        
        if (matchingSector) {
          matchingSector.count++;
        }
      });
    },

    calculateTierFromMarketCap(marketCap) {
      if (marketCap > 200000000000) return 'mega';
      if (marketCap > 10000000000) return 'large';
      if (marketCap > 2000000000) return 'mid';
      if (marketCap > 300000000) return 'small';
      return 'micro';
    },

    formatMarketCap(v) {
      if (!Number.isFinite(v)) return 'N/A';
      if (v >= 1e12) return `$${(v/1e12).toFixed(1)}T`;
      if (v >= 1e9)  return `$${(v/1e9).toFixed(1)}B`;
      if (v >= 1e6)  return `$${(v/1e6).toFixed(1)}M`;
      return `$${Math.round(v).toLocaleString()}`;
    },

    /* ---------- Input helpers ---------- */
    parseMoney(v) {
      const cleaned = String(v ?? '').replace(/[^\d.]/g, '');
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    },
    formatMoney(n) {
      if (n == null || n === '') return '';
      const num = Number(n);
      if (!Number.isFinite(num)) return '';
      return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
    },

    commitPrice(which) {
      if (which === 'min') {
        const raw = this._priceMinTemp ?? this.priceMinDisplay;
        this.filters.priceRange[0] = Math.max(0, this.parseMoney(raw));
      } else {
        const raw = this._priceMaxTemp ?? this.priceMaxDisplay;
        this.filters.priceRange[1] = Math.max(0, this.parseMoney(raw));
      }
      let [min, max] = this.filters.priceRange;
      if (min > max) [min, max] = [max, min];
      this.filters.priceRange = [min, max];
      this._priceMinTemp = this._priceMaxTemp = undefined;
    },

    commitPe(which) {
      if (which === 'min') {
        const raw = this._peMinTemp ?? this.peMinDisplay;
        this.filters.peRatio[0] = Math.max(0, this.parseMoney(raw));
      } else {
        const raw = this._peMaxTemp ?? this.peMaxDisplay;
        this.filters.peRatio[1] = Math.max(0, this.parseMoney(raw));
      }
      let [min, max] = this.filters.peRatio;
      if (min > max) [min, max] = [max, min];
      this.filters.peRatio = [min, max];
      this._peMinTemp = this._peMaxTemp = undefined;
    },

    commitDiv(which) {
      if (which === 'min') {
        const raw = this._divMinTemp ?? this.divMinDisplay;
        this.filters.dividendYield[0] = Math.max(0, this.parseMoney(raw));
      } else {
        const raw = this._divMaxTemp ?? this.divMaxDisplay;
        this.filters.dividendYield[1] = Math.max(0, this.parseMoney(raw));
      }
      let [min, max] = this.filters.dividendYield;
      if (min > max) [min, max] = [max, min];
      this.filters.dividendYield = [min, max];
      this._divMinTemp = this._divMaxTemp = undefined;
    },

    /* ---------- Reset / Persist / Export ---------- */
    resetFilters() {
      this.filters = {
        marketCap: [],
        sector: [],
        priceRange: [0, 1000],
        peRatio: [0, Infinity],
        marketCapRange: [0, 5_000_000_000_000],
        dividendYield: [0, 15],
        volume: [],
        beta: [0, 3]
      };
      this.activePreset = null;
      this.lastAppliedFilters = {};
      this.resultsCount = 0;
      this.lastResults = [];
      this.currentPage = 1;
      this.totalPages = 1;
      
      // Clear market cap badge counts
      this.marketCapOptions.forEach(option => {
        option.count = 0;
      });
      
      this.$emit('applyFilter', { filters: this.filters, results: [] });
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
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stock_screener_results_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },

    convertToCSV(rows) {
      const headers = [
        'Symbol','Name','Price','Change','P/E','Market Cap','Sector',
        'Dividend Yield','Volume','Beta','Rating','Tier'
      ];
      const esc = (v) => {
        const s = v == null ? '' : String(v);
        const needsWrap = /[",\n]/.test(s);
        const safe = s.replace(/"/g,'""');
        return needsWrap ? `"${safe}"` : safe;
      };
      const body = rows.map(s => [
        s.symbol, s.name, s.price, s.change, s.pe, s.marketCap, s.sector,
        s.dividendYield, s.volume, s.beta, (s.analystRating ?? 'N/A'), (s.tier ?? 'N/A')
      ].map(esc).join(','));
      return [headers.map(esc).join(','), ...body].join('\n');
    },

    clearCache() {
      this.stockScreenerService.clearCache();
      this.$emit('success', 'Cache cleared successfully');
      this.loadInitialStocks();
    },

    async applyFilters() {
      // Check if filters have actually changed
      const filtersChanged = JSON.stringify(this.filters) !== JSON.stringify(this.lastAppliedFilters);
      
      if (!filtersChanged && this.resultsCount > 0) {
        console.log('Filters unchanged, skipping API call');
        return;
      }

      // Reset pagination when applying new filters
      this.currentPage = 1;
      this.totalPages = 1;
      
      // Apply the filters
      await this.applyFiltersInternal();
      
      // Mark filters as applied
      this.lastAppliedFilters = JSON.parse(JSON.stringify(this.filters));
    },

    // Pagination methods
    async loadNextPage() {
      if (this.currentPage >= this.totalPages || this.isLoadingMore) return;
      
      this.isLoadingMore = true;
      try {
        const nextPage = this.currentPage + 1;
        const response = await this.stockScreenerService.fetchPage(nextPage, this.filters, this.pageSize);
        
        // Update all state including counts and page numbers
        this.processStocks(response, this.filters);
        
        // Update timestamp on pagination
        this.lastUpdated = Date.now();
        this.scrollToTop();
      } catch (error) {
        console.error('Error loading next page:', error);
        this.$emit('error', 'Failed to load more stocks');
      } finally {
        this.isLoadingMore = false;
      }
    },

    async loadPreviousPage() {
      if (this.currentPage <= 1 || this.isLoadingMore) return;
      
      this.isLoadingMore = true;
      try {
        const prevPage = this.currentPage - 1;
        const response = await this.stockScreenerService.fetchPage(prevPage, this.filters, this.pageSize);
        
        // Update all state including counts and page numbers
        this.processStocks(response, this.filters);
        
        // Update timestamp on pagination
        this.lastUpdated = Date.now();
        this.scrollToTop();
      } catch (error) {
        console.error('Error loading previous page:', error);
        this.$emit('error', 'Failed to load previous page');
      } finally {
        this.isLoadingMore = false;
      }
    },

    async loadFirstPage() {
      if (this.currentPage <= 1 || this.isLoadingMore) return;
      
      this.isLoadingMore = true;
      try {
        const response = await this.stockScreenerService.fetchPage(1, this.filters, this.pageSize);
        
        // Update all state including counts and page numbers
        this.processStocks(response, this.filters);
        
        // Update timestamp on pagination
        this.lastUpdated = Date.now();
        this.scrollToTop();
      } catch (error) {
        console.error('Error loading first page:', error);
        this.$emit('error', 'Failed to load first page');
      } finally {
        this.isLoadingMore = false;
      }
    },

    async loadLastPage() {
      if (this.currentPage >= this.totalPages || this.isLoadingMore) return;
      
      this.isLoadingMore = true;
      try {
        const response = await this.stockScreenerService.fetchPage(this.totalPages, this.filters, this.pageSize);
        
        // Update all state including counts and page numbers
        this.processStocks(response, this.filters);
        
        // Update timestamp on pagination
        this.lastUpdated = Date.now();
        this.scrollToTop();
      } catch (error) {
        console.error('Error loading last page:', error);
        this.$emit('error', 'Failed to load last page');
      } finally {
        this.isLoadingMore = false;
      }
    },

    scrollToTop() {
      const scrollableContent = this.$el.querySelector('.scrollable-content');
      if (scrollableContent) {
        scrollableContent.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    handleScroll(event) {
      const scrollTop = event.target.scrollTop;
      this.showScrollTop = scrollTop > 300;
    },

    handleStockSelection(stock) {
      this.$emit('stockSelected', stock);
    }
  }
};
</script>

<style scoped>
/* ---------- Compact density tokens ---------- */
.stock-screener{ --pad:.9rem; --gap:.75rem; }

/* Card */
.stock-screener {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 24px;
  padding: 2rem;
  color: #000;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Sticky Filter Chips */
.sticky-filter-chips {
  position: sticky;
  top: 0;
  z-index: 10;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

/* Scrollable Content */
.scrollable-content {
  max-height: calc(100vh - 120px); /* Reduced height since header is not sticky */
  overflow-y: auto;
  padding-right: 8px; /* Space for scrollbar */
}

.scrollable-content::-webkit-scrollbar {
  width: 6px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Header */
.screener-header { margin-bottom: var(--gap); }
.header-content { display:flex; justify-content:space-between; align-items:flex-start; gap:2rem; }
.title-section h3 {
  font-size: 2.5rem; font-weight: 800; margin: 0 0 .5rem 0;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.screener-subtitle{ font-size:1.1rem; opacity:.8; margin:0; font-weight:400; color:#666; }
.stats-section{ display:flex; gap:1rem; }
.stat-card{ background:rgba(0,0,0,.1); border-radius:10px; padding:.6rem .9rem; text-align:center; border:1px solid rgba(0,0,0,.2); backdrop-filter:blur(8px); transition:.3s; }
.stat-card:hover{ transform:translateY(-4px); background:rgba(0,0,0,.15); box-shadow:0 10px 25px rgba(0,0,0,.2); }
.stat-number{ font-size:1rem; font-weight:700; margin-bottom:.15rem; }
.stat-label{ font-size:.7rem; opacity:.8; text-transform:uppercase; letter-spacing:.5px; }

/* Summary strip */
.summary-strip{
  display:flex; align-items:center; gap:.75rem; flex-wrap:wrap;
  padding:.5rem .75rem; border:1px solid rgba(0,0,0,.12);
  border-radius:12px; background:rgba(0,0,0,.04); margin-bottom:1rem;
}
.summary-strip .kpi{ font-size:.85rem; color:#111; }
.summary-strip .tags{ display:flex; gap:.5rem; flex-wrap:wrap; margin-left:.5rem; }
.summary-strip .tag{
  font-size:.75rem; line-height:1; padding:.35rem .5rem; border-radius:999px;
  border:1px solid rgba(0,0,0,.18); background:#fff; cursor:pointer;
}
.summary-strip .muted{ color:#6b7280; font-size:.8rem; }

/* Presets */
.preset-section{ margin-bottom: var(--gap); }
.preset-section h4{ font-size:1.1rem; font-weight:600; margin-bottom:.6rem; display:flex; align-items:center; gap:.5rem; }
/* Top Bar: Presets + Actions */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-top: 1rem;
  gap: 1rem;
}

.preset-buttons{ display:flex; gap:.6rem; flex-wrap:wrap; }
.preset-btn{
  background:rgba(0,0,0,.1); border:1px solid rgba(0,0,0,.2); border-radius:8px;
  padding:.45rem .8rem; color:#000; font-weight:600; cursor:pointer; transition:.3s; display:flex; align-items:center; gap:.5rem; backdrop-filter:blur(8px); font-size:.85rem;
}
.preset-btn:hover{ background:rgba(0,0,0,.2); transform:translateY(-2px); box-shadow:0 8px 20px rgba(0,0,0,.15); }
.preset-btn.active{ background:linear-gradient(135deg,#000 0%,#333 100%); border-color:#000; color:#fff; box-shadow:0 0 20px rgba(0,0,0,.4); }

/* Filters row - Side by side layout with flexible width */
.filters-row {
  display: flex;
  gap: var(--gap);
  margin-bottom: var(--gap);
  flex-wrap: wrap; /* Allow wrapping if not enough space */
}

.filters-row .filter-section {
  flex: 2; /* 2x width of compact sections */
  min-width: 450px; /* Minimum width to fit content */
}

/* Range Filters Row - Grouped under parent cards */
.range-filters-row {
  display: flex;
  gap: var(--gap);
  margin-bottom: var(--gap);
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  width: 100%;
}

/* Left group: Price Range and P/E Ratio (under Market Cap) */
.filter-group-left {
  display: flex;
  gap: var(--gap);
  flex: 1;
  min-width: 0;
  width: 100%; /* Ensure full width to match parent */
}

/* Right group: Dividend Yield and Volume (under Sector) */
.filter-group-right {
  display: flex;
  gap: var(--gap);
  flex: 1;
  min-width: 0;
  width: 100%; /* Ensure full width to match parent */
}

.filter-section-compact {
  flex: 1; /* Equal width within groups */
  min-width: 0; /* Allow shrinking */
}

/* Price Range - exactly half of Market Cap width */
.filter-section-compact.price-range {
  flex: 1;
  min-width: 0;
}

/* P/E Ratio - exactly half of Market Cap width */
.filter-section-compact.pe-ratio {
  flex: 1;
  min-width: 0;
}

/* Dividend Yield - smaller portion of Sector width */
.filter-section-compact.dividend-yield {
  flex: 0.4; /* Smaller portion */
  min-width: 0;
}

/* Volume - larger portion of Sector width to fit buttons */
.filter-section-compact.volume {
  flex: 0.6; /* Larger portion */
  min-width: 0;
}

/* Filters grid */
.filters-grid{
  display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--gap); margin-bottom: var(--gap);
}
.filter-section{ background:rgba(0,0,0,.05); border-radius:12px; padding: var(--pad); border:1px solid rgba(0,0,0,.1); backdrop-filter:blur(8px); transition:.3s; display: flex; flex-direction: column; height: fit-content; align-self: flex-start; min-height: 20px; }
.filter-section:hover{ background:rgba(0,0,0,.1); transform:translateY(-2px); }
.filter-section.wide{ grid-column: span 2; }
.filter-section summary{ list-style:none; cursor:pointer; }
.filter-section summary::-webkit-details-marker{ display:none; }
.filter-section h4{ font-size:1rem; font-weight:600; margin:0; display:flex; align-items:center; gap:.5rem; color:#000; }

/* Collapsible Filters Dropdown */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
}

.dropdown-toggle {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  color: #666;
}

.dropdown-toggle:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #000;
}

.dropdown-toggle.active {
  transform: rotate(180deg);
  color: #007bff;
}

.dropdown-toggle i {
  font-size: 0.9rem;
  transition: transform 0.3s ease;
}

.filters-dropdown {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.summary-pill{
  margin-left:.5rem; padding:.15rem .45rem; font-size:.7rem;
  border:1px solid rgba(0,0,0,.15); border-radius:999px; color:#374151; background:#fff;
}

/* Filter grid layout */
.filter-grid{ display:grid; grid-template-columns:repeat(3, 1fr); gap:.5rem; }

/* Filter checkbox styling */
.filter-checkbox{ display:flex; align-items:center; gap:.75rem; padding:.5rem; border-radius:8px; cursor:pointer; transition:.3s; }
.filter-checkbox:hover{ background:rgba(0,0,0,.05); }
.filter-checkbox input[type="checkbox"]{ display:none; }
.filter-checkbox .checkmark{ width:18px; height:18px; border:2px solid #ddd; border-radius:4px; position:relative; transition:.3s; }
.filter-checkbox input[type="checkbox"]:checked + .checkmark{ background:#007bff; border-color:#007bff; }
.filter-checkbox input[type="checkbox"]:checked + .checkmark::after{ content:"✓"; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-size:12px; font-weight:bold; }
.filter-checkbox .label-text{ font-weight:500; color:#333; display: flex; align-items: center; gap: 0.5rem; }
.count-pill{ background:linear-gradient(135deg,#000 0%,#333 100%); color:#fff; padding:.2rem .5rem; border-radius:12px; font-size:.75rem; font-weight:600; min-width:auto; width:fit-content; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,.2); }

/* Checkboxes */
.checkbox-group{ display:flex; flex-direction:column; gap:.5rem; }
.checkbox-label{ display:flex; align-items:center; gap:.6rem; cursor:pointer; padding:.4rem; border-radius:8px; transition:.2s; position:relative; }
.checkbox-label:hover{ background:rgba(0,0,0,.1); }
.checkbox-label input[type="checkbox"]{ display:none; }
.checkmark{ width:18px; height:18px; border:2px solid rgba(0,0,0,.4); border-radius:4px; position:relative; transition:.3s; }
.checkbox-label input[type="checkbox"]:checked + .checkmark{ background:linear-gradient(135deg,#000 0%,#333 100%); border-color:#000; }
.checkbox-label input[type="checkbox"]:checked + .checkmark::after{
  content:'✓'; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-weight:bold; font-size:11px;
}
.label-text{ flex:1; font-weight:500; }
.count-badge{ background:rgba(0,0,0,.2); padding:.2rem .45rem; border-radius:12px; font-size:.75rem; font-weight:600; color:#000; }
/* 2-column layout for Market Cap */
.cap-grid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:.5rem 1rem;
}
.cap-col{ display:flex; flex-direction:column; gap:.5rem; }

/* Row layout: checkbox + count circle next to it + label */
.checkbox-row{
  display:flex; align-items:center; gap:.5rem;
  padding:.35rem .4rem; border-radius:8px; cursor:pointer;
  transition:.2s;
}
.checkbox-row:hover{ background:rgba(0,0,0,.06); }

/* Checkbox styles */
.checkmark{ width:18px; height:18px; border:2px solid rgba(0,0,0,.4); border-radius:4px; position:relative; }
.checkbox-row input[type="checkbox"]{ display:none; }
.checkbox-row input[type="checkbox"]:checked + .checkmark{
  background:linear-gradient(135deg,#000 0%,#333 100%); border-color:#000;
}
.checkbox-row input[type="checkbox"]:checked + .checkmark::after{
  content:'✓'; position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%); color:#fff; font-weight:bold; font-size:11px;
}

/* Count circle right next to the checkbox */
.count-dot{
  width:24px; height:24px; border-radius:999px;
  display:inline-flex; align-items:center; justify-content:center;
  background:rgba(0,0,0,.15); color:#000; font-weight:700; font-size:.75rem;
}

/* Keep label flexible */
.checkbox-row .label-text{ flex:1; font-weight:600; }

/* Responsive: stack to one column on narrow screens */
@media (max-width: 640px){
  .cap-grid{ grid-template-columns: 1fr; }
}

/* Sector */
/* Container: tight wrap with even gaps */
.sector-wrap{
  display:flex;
  flex-wrap:wrap;
  gap:10px;                 /* space between chips */
  align-items:center;
}


/* Ranges */
.range-filter{ display:flex; flex-direction:column; gap:.6rem; }
.range-inputs{ display:flex; align-items:center; gap:.5rem; }
.input-group{ position:relative; max-width: 140px; }
.input-prefix{ position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; font-weight:600; z-index:1; }
.range-input{
  width:140px; padding:.5rem .75rem; padding-left:1.6rem;
  background:rgba(0,0,0,.05); border:1px solid rgba(0,0,0,.2); border-radius:8px; color:#000; font-weight:500; transition:.3s; backdrop-filter:blur(8px);
}

/* Dividend Yield inputs - smaller to fit within container */
.dividend-yield .range-input{
  width: 112px; /* Reduced from 120px to fit better within container */
  padding-left: 1.2rem;
  text-align: center;
}

.dividend-yield .input-group{
  max-width: 112px; /* Reduced from 120px to match input width */
}

.dividend-yield .input-prefix{
  left: 8px;
}
.range-input:focus{ outline:none; border-color:#000; box-shadow:0 0 0 3px rgba(0,0,0,.1); background:rgba(0,0,0,.1); }
.range-input::placeholder{ color:rgba(0,0,0,.6); }

/* Volume presets */
.volume-presets{ display:flex; gap:.6rem; flex-wrap:wrap; }
.volume-preset-btn{
  background:rgba(0,0,0,.05); border:1px solid rgba(0,0,0,.2); border-radius:8px; padding:.45rem .8rem;
  color:#000; font-weight:500; cursor:pointer; transition:.3s; font-size:.85rem;
}
.volume-preset-btn:hover{ background:rgba(0,0,0,.1); }
.volume-preset-btn.active{ background:linear-gradient(135deg,#000 0%,#333 100%); border-color:#000; color:#fff; }

/* Volume buttons - keep on one line */
.vol-wrap{
  display: flex;
  gap: 0.5rem;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding-bottom: 2px; /* Space for scrollbar */
}

.vol-chip{
  background: rgba(0,0,0,.05);
  border: 1px solid rgba(0,0,0,.2);
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  transition: .3s;
  font-size: .85rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.vol-chip:hover{
  background: rgba(0,0,0,.1);
}

.vol-chip.active{
  background: linear-gradient(135deg, #000 0%, #333 100%);
  border-color: #000;
  color: #fff;
}

/* Hide scrollbar for volume buttons */
.vol-wrap::-webkit-scrollbar {
  height: 4px;
}

.vol-wrap::-webkit-scrollbar-track {
  background: transparent;
}

.vol-wrap::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,.2);
  border-radius: 2px;
}

.vol-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(0,0,0,.3);
}

/* Removed results summary styles */

.action-buttons{ display:flex; gap:.6rem; flex-wrap:wrap; }

.apply-btn,.reset-btn,.save-btn,.export-btn,.clear-cache-btn{
  padding:.55rem .9rem; border:none; border-radius:8px; font-weight:600; cursor:pointer; transition:.3s; display:flex; align-items:center; gap:.5rem; font-size:.85rem;
}
.apply-btn{ background:linear-gradient(135deg,#000 0%,#333 100%); color:#fff; border:1px solid #000; }
.apply-btn:hover:not(:disabled){ transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.3); }
.apply-btn:disabled{ background:#9ca3af; cursor:not-allowed; transform:none; box-shadow:none; }
.reset-btn{ background:rgba(0,0,0,.1); color:#000; border:1px solid rgba(0,0,0,.2); }
.reset-btn:hover{ background:rgba(0,0,0,.2); transform:translateY(-1px); }
.save-btn{ background:linear-gradient(135deg,#000 0%,#333 100%); color:#fff; border:1px solid #000; }
.save-btn:hover{ transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.3); }
.export-btn{ background:linear-gradient(135deg,#333 0%,#666 100%); color:#fff; border:1px solid #333; }
.export-btn:hover{ transform:translateY(-1px); box-shadow:0 4px 12px rgba(51,51,51,.3); }
.clear-cache-btn{ background:linear-gradient(135deg,#666 0%,#999 100%); color:#fff; border:1px solid #666; }
.clear-cache-btn:hover{ transform:translateY(-1px); box-shadow:0 4px 12px rgba(102,102,102,.3); }

/* Initial State Message */
.initial-state{ text-align:center; padding:2rem; color:#6b7280; font-size:1rem; }

/* Loading / Error (unchanged except density) */
.loading-spinner{ margin-bottom:1rem; }
.loading-icon{ color:#000; animation:pulse 2s infinite; }
.loading-progress{ width:100%; max-width:400px; margin:1rem auto; }
.progress-bar{ width:100%; height:6px; background:rgba(0,0,0,.2); border-radius:3px; overflow:hidden; position:relative; }
.progress-bar::after{ content:''; position:absolute; top:0; left:0; height:100%; width:30%; background:linear-gradient(90deg,#000,#333,#000); border-radius:3px; animation:loading-slide 2s infinite; }
@keyframes loading-slide{ 0%{transform:translateX(-100%)} 100%{transform:translateX(400%)} }
@keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:.6} }

.error-container{ text-align:center; padding:2rem 1.2rem; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.3); border-radius:12px; margin-top:1rem; backdrop-filter:blur(8px); }
.error-content{ display:flex; flex-direction:column; align-items:center; }
.error-icon{ font-size:2.2rem; color:#ef4444; margin-bottom:.6rem; }
.error-container h3{ font-size:1.25rem; color:#ef4444; margin-bottom:.4rem; font-weight:600; }
.error-message{ font-size:.95rem; color:#111; margin-bottom:1rem; max-width:400px; }
.error-actions{ display:flex; gap:.6rem; margin-bottom:.6rem; flex-wrap:wrap; justify-content:center; }
.retry-btn{ padding:.55rem .9rem; border:none; border-radius:8px; font-weight:600; cursor:pointer; transition:.3s; background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%); color:#fff; display:flex; align-items:center; gap:.5rem; }
.retry-btn:hover{ transform:translateY(-1px); box-shadow:0 4px 12px rgba(220,38,38,.3); }
.fallback-info{ display:flex; align-items:center; gap:.5rem; background:rgba(59,130,246,.1); padding:.55rem .9rem; border-radius:8px; color:#60a5fa; font-size:.85rem; border:1px solid rgba(59,130,246,.2); }

/* Responsive */
@media (max-width: 768px){
  .stock-screener{ padding:1rem; }
  .header-content{ flex-direction:column; gap:1rem; }
  .stats-section{ justify-content:center; flex-wrap:wrap; }
  .top-bar{ flex-direction:column; gap:1rem; align-items:center; }
  .preset-buttons{ justify-content:center; }
  .action-buttons{ justify-content:center; }
  .filters-row{ flex-direction:column; } /* Stack vertically on mobile */
  .filters-row .filter-section{ width: 100%; flex: 1; } /* Full width on mobile */
  .range-filters-row{ flex-direction:column; } /* Stack range filters vertically on mobile */
  .filter-group-left{ flex-direction:column; } /* Stack left group vertically on mobile */
  .filter-group-right{ flex-direction:column; } /* Stack right group vertically on mobile */
  .filter-section-compact{ flex: 1; min-width: 100%; } /* Full width on mobile */
  .vol-wrap{ flex-wrap: wrap; } /* Allow wrapping on mobile */
  .filters-grid{ grid-template-columns:1fr; }
  .filter-section.wide{ grid-column:auto; }
  .filter-grid{ grid-template-columns:repeat(2, 1fr); } /* 2 columns on mobile */
  .checkbox-group{ max-height:200px; overflow-y:auto; }
  .results-summary{ flex-direction:column; gap:1rem; }
  .action-buttons{ justify-content:center; flex-wrap:wrap; }
  .range-inputs{ flex-direction:column; }
  .sector-grid{ grid-template-columns:repeat(2,1fr); }
}
@media (max-width: 480px){
  .title-section h3{ font-size:4rem; }
  .filters-grid{ gap:1rem; }
  .filter-section{ padding:1rem; }
  .sector-grid{ grid-template-columns:1fr; }
}

/* Volume chips - stay on one line */
.vol-wrap{
  display:flex;
  flex-wrap:nowrap; /* Prevent wrapping */
  gap:8px;
  align-items:center;
  overflow-x:auto; /* Allow horizontal scroll if needed */
  padding-bottom: 5px; /* Space for scrollbar */
}

/* Custom scrollbar for volume chips */
.vol-wrap::-webkit-scrollbar {
  height: 6px;
}
.vol-wrap::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.vol-wrap::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}
.vol-wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

.vol-chip{
  display:inline-flex;
  align-items:center;
  padding:.38rem .7rem;
  border-radius:9999px;
  background:#f2f3f5;
  border:1px solid rgba(0,0,0,.14);
  box-shadow: 0 1px 0 rgba(0,0,0,.03) inset;
  color:#111827;
  font-size:.9rem;
  font-weight:600;
  white-space:nowrap;
  cursor:pointer;
  transition: background .15s ease, transform .1s ease, border-color .15s ease, box-shadow .15s ease;
  flex-shrink:0; /* Prevent shrinking */
}
.vol-chip:hover{ background:#e9eaee; transform: translateY(-1px); }
.vol-chip.active{
  background: linear-gradient(135deg,#000 0%,#333 100%);
  color:#fff;
  border-color:#000;
  box-shadow:0 2px 10px rgba(0,0,0,.2);
}

@media (max-width:640px){
  .vol-wrap{ gap:6px; }
  .vol-chip{ font-size:.85rem; padding:.34rem .6rem; }
}

/* Pagination Controls */
.pagination-controls {
  display: flex;
  flex-direction: column;
  gap: 0.058rem;
  padding: 0.115rem;
  background: rgba(0,0,0,.05);
  border-radius: 4px;
  margin-top: 1rem;
  border: 1px solid rgba(0,0,0,.1);
  backdrop-filter: blur(8px);
}

.pagination-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1f2937;
  font-size: 5px;
}

.results-info {
  font-size: 0.75rem;
  color: #6b7280;
}

.pagination-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.077rem;
  padding: 0.058rem 0.154rem;
  border: none;
  border-radius: 2px;
  font-weight: 600;
  font-size: 5px;
  cursor: pointer;
  transition: all 0.3s;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: #fff;
}

.pagination-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,.3);
}

.pagination-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  color: #6b7280;
  font-size: 0.75rem;
}

/* Stock Results */
.stock-results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 1rem 0;
}

/* Bottom Pagination */
.pagination-bottom {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

/* Scroll to Top Button */
.scroll-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #000 0%, #333 100%);
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,.3);
  transition: all 0.3s;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-to-top-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0,0,0,.4);
  background: linear-gradient(135deg, #333 0%, #666 100%);
}

.scroll-to-top-btn:active {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .pagination-controls {
    padding: 0.058rem;
  }
  
  .pagination-info {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .pagination-buttons {
    flex-direction: column;
  }
  
  .pagination-btn {
    width: 100%;
    justify-content: center;
  }

  .scroll-to-top-btn {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
}


</style>