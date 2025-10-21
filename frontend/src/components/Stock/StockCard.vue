<template>
  <div class="stock-card" :class="{ 'positive': changePercent >= 0, 'negative': changePercent < 0 }">
    <!-- Header -->
    <div class="stock-header">
        <div class="stock-info-wrapper">
          <img
            v-if="companyLogo"
            :src="companyLogo"
            :alt="`${displayName} logo`"
            class="company-logo"
            @error="handleLogoError"
          />
          <div class="stock-info">
            <a 
              :href="tradingViewUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="stock-symbol-link"
            >
              {{ displayName }}
            </a>
            <div class="stock-name">{{ stock.sector || 'N/A' }}</div>
          </div>
        </div>
      <div class="stock-meta">
        <span class="last-updated-compact">{{ compactLastUpdated }}</span>
        <span class="meta-separator">-</span>
        <span class="data-source">Data from TradingView</span>
      </div>
    </div>

    <!-- Price Section -->
    <div class="price-section">
      <div class="current-price">
        <span class="currency">$</span>
        <span class="price">{{ formatPrice(stock.close || stock.price) }}</span>
      </div>
      <div class="price-change" :class="{ 'positive': changePercent >= 0, 'negative': changePercent < 0 }">
        <i :class="changePercent >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
        <span>{{ formatChange(changePercent) }}%</span>
        <span class="change-value">({{ formatPrice(Math.abs(stock.priceChange || 0)) }})</span>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric">
        <div class="metric-label">P/E Ratio</div>
        <div class="metric-value">{{ formatNumber(stock.PERatio || stock.pe) }}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Market Cap</div>
        <div class="metric-value">{{ formatMarketCap(stock.marketCapBasic || stock.marketCap) }}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Volume</div>
        <div class="metric-value">{{ formatVolume(stock.volume) }}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Div Yield</div>
        <div class="metric-value">{{ formatPercent(stock.dividendYield) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockCard',
  props: {
    stock: {
      type: Object,
      required: true
    },
    lastUpdated: {
      type: Number,
      default: null
    }
  },
      data() {
        return {
          logoError: false
        };
      },
  computed: {
    changePercent() {
      return this.stock.priceChange || this.stock.changeAbs || this.stock.change || 0;
    },
    displayName() {
      // Format: "Company Name - SYMBOL"
      const companyName = this.stock.companyName || this.stock.shortCompanyName || this.stock.description || 'Unknown Company';
      let symbol = this.stock.symbol || this.stock.name || '';
      
      // Remove exchange prefix if it exists (e.g., "NASDAQ:ORCL" -> "ORCL")
      if (symbol.includes(':')) {
        symbol = symbol.split(':')[1];
      }
      
      return `${companyName} - ${symbol}`;
    },
    companyLogo() {
      if (this.logoError) {
        console.log('🚫 Logo error for', this.stock.symbol, '- logoError:', this.logoError);
        return null;
      }
      
      // Use backend logo proxy to avoid CORS issues
      if (this.stock.logo) {
        const logoUrl = `http://localhost:3000/api/logo/${this.stock.logo.toLowerCase()}`;
        console.log('✅ Using backend logo proxy for', this.stock.symbol, ':', logoUrl);
        return logoUrl;
      }
      
      // Fallback: construct logo URL from symbol using proxy
      let symbol = this.stock.symbol || this.stock.name;
      if (!symbol) {
        console.log('❌ No symbol for stock:', this.stock);
        return null;
      }
      
      if (symbol.includes(':')) {
        symbol = symbol.split(':')[1];
      }
      
      const fallbackUrl = `http://localhost:3000/api/logo/${symbol.toLowerCase()}`;
      console.log('⚠️ Using fallback logo proxy for', this.stock.symbol, ':', fallbackUrl);
      return fallbackUrl;
    },
    tradingViewUrl() {
      // Get clean symbol (remove exchange prefix if it exists)
      let symbol = this.stock.symbol || this.stock.name || '';
      
      // If symbol already has exchange prefix (e.g., "NASDAQ:ORCL"), extract just the symbol
      if (symbol.includes(':')) {
        symbol = symbol.split(':')[1];
      }
      
      // For US stocks, just use the symbol without exchange prefix for better compatibility
      return `https://www.tradingview.com/chart/?symbol=${symbol}`;
    },
    compactLastUpdated() {
      if (!this.lastUpdated) {
        return 'N/A';
      }
      
      const date = new Date(this.lastUpdated);
      
      // Format: "12:34 PM Oct 16, 2025"
      const timeOptions = { 
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      };
      
      const dateOptions = {
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      };
      
      const time = date.toLocaleString('en-US', timeOptions);
      const dateStr = date.toLocaleString('en-US', dateOptions);
      
      return `${time} ${dateStr}`;
    }
  },
  methods: {
    handleLogoError() {
      console.log('🚫 Logo failed to load for', this.stock.symbol, '- disabling logo for this session');
      this.logoError = true;
      // Don't retry - just disable logo for this component instance
    },
    formatPrice(value) {
      if (!value && value !== 0) return 'N/A';
      return Number(value).toFixed(2);
    },
    formatChange(value) {
      if (!value && value !== 0) return '0.00';
      const num = Number(value);
      return (num >= 0 ? '+' : '') + num.toFixed(2);
    },
    formatNumber(value) {
      if (!value && value !== 0) return 'N/A';
      const num = Number(value);
      if (num >= 1000) return num.toFixed(0);
      return num.toFixed(2);
    },
    formatMarketCap(value) {
      if (!value && value !== 0) return 'N/A';
      const num = Number(value);
      if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
      if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
      return `$${num.toLocaleString()}`;
    },
    formatVolume(value) {
      if (!value && value !== 0) return 'N/A';
      const num = Number(value);
      if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
      if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
      if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
      return num.toLocaleString();
    },
    formatPercent(value) {
      if (!value && value !== 0) return 'N/A';
      return `${Number(value).toFixed(2)}%`;
    }
  }
};
</script>

<style scoped>
.stock-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: fit-content;
}

.stock-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stock-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.stock-card:hover::before {
  opacity: 1;
}

.stock-card.positive::before {
  background: linear-gradient(90deg, #10b981, #059669);
}

.stock-card.negative::before {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

/* Header */
.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.stock-info-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.company-logo {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: contain;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  flex-shrink: 0;
}

.stock-info {
  flex: 1;
  min-width: 0;
}

.stock-symbol-link {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
  letter-spacing: -0.02em;
  text-decoration: none;
  display: inline-block;
  transition: color 0.2s, transform 0.2s;
  word-break: break-word;
}

.stock-symbol-link:hover {
  color: #3b82f6;
  transform: translateX(2px);
  text-decoration: underline;
}

.stock-name {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Stock Meta (timestamp and source) */
.stock-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: #9ca3af;
  text-align: right;
  white-space: nowrap;
}

.last-updated-compact {
  font-weight: 500;
}

.meta-separator {
  font-weight: 300;
}

.data-source {
  font-weight: 400;
  font-style: italic;
}

/* Price Section */
.price-section {
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
}

.current-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.currency {
  font-size: 1.25rem;
  color: #6b7280;
  font-weight: 600;
  margin-right: 0.25rem;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.02em;
}

.price-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.price-change.positive {
  color: #10b981;
}

.price-change.negative {
  color: #ef4444;
}

.price-change i {
  font-size: 0.75rem;
}

.change-value {
  color: #6b7280;
  font-weight: 500;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 640px) {
  .stock-card {
    padding: 1rem;
  }

  .stock-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .company-logo {
    width: 28px;
    height: 28px;
  }

  .stock-meta {
    align-self: flex-start;
    font-size: 0.65rem;
  }

  .stock-symbol-link {
    font-size: 1rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .metrics-grid {
    gap: 0.75rem;
  }
}
</style>

