<template>
  <div class="company-snapshot">
    <!-- Header với ticker và tên công ty -->
    <div class="company-header">
      <div class="company-info">
        <div class="ticker-section">
          <h2 class="ticker">{{ companyData.ticker }}</h2>
          <span class="exchange">{{ companyData.exchange }}</span>
        </div>
        <h3 class="company-name">{{ companyData.companyName }}</h3>
        <div class="sector-industry">
          <span class="sector">{{ companyData.sector }}</span>
          <span class="industry">{{ companyData.industry }}</span>
        </div>
      </div>
      <div class="company-logo">
        <img :src="companyData.logo" :alt="companyData.companyName" @error="handleLogoError" />
      </div>
    </div>

    <!-- Price Information -->
    <div class="price-section">
      <div class="current-price">
        <span class="price-value">${{ formatPrice(stockData.currentPrice) }}</span>
        <div class="price-change" :class="stockData.change >= 0 ? 'positive' : 'negative'">
          <span class="change-amount">{{ stockData.change >= 0 ? '+' : '' }}${{ formatPrice(Math.abs(stockData.change)) }}</span>
          <span class="change-percent">({{ stockData.change >= 0 ? '+' : '' }}{{ stockData.changePercent }}%)</span>
        </div>
      </div>
      <div class="price-time">
        <font-awesome-icon icon="fa-solid fa-clock" />
        <span>{{ formatTime(stockData.lastUpdated) }}</span>
        <span class="market-status" :class="stockData.marketStatus.toLowerCase()">
          {{ stockData.marketStatus }}
        </span>
      </div>
    </div>

    <!-- Key Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Market Cap</div>
        <div class="metric-value">${{ formatLargeNumber(keyMetrics.marketCap) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">P/E Ratio</div>
        <div class="metric-value">{{ keyMetrics.peRatio || 'N/A' }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">EPS (TTM)</div>
        <div class="metric-value">${{ formatPrice(keyMetrics.eps) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Dividend Yield</div>
        <div class="metric-value">{{ keyMetrics.dividendYield }}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">52W High</div>
        <div class="metric-value">${{ formatPrice(keyMetrics.week52High) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">52W Low</div>
        <div class="metric-value">${{ formatPrice(keyMetrics.week52Low) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Volume</div>
        <div class="metric-value">{{ formatVolume(keyMetrics.volume) }}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Volume</div>
        <div class="metric-value">{{ formatVolume(keyMetrics.avgVolume) }}</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <button class="action-btn primary" @click="addToWatchlist">
        <font-awesome-icon icon="fa-solid fa-star" />
        {{ isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist' }}
      </button>
      <button class="action-btn secondary" @click="openChart">
        <font-awesome-icon icon="fa-solid fa-chart-line" />
        View Chart
      </button>
      <button class="action-btn secondary" @click="refreshData">
        <font-awesome-icon icon="fa-solid fa-sync-alt" :class="{ spinning: isRefreshing }" />
        Refresh
      </button>
    </div>

    <!-- Mini Chart -->
    <div class="mini-chart-section">
      <h4>Price Trend (5 Days)</h4>
      <canvas ref="miniChart" width="300" height="120"></canvas>
    </div>

    <!-- Company Description -->
    <div class="company-description">
      <h4>About {{ companyData.companyName }}</h4>
      <p>{{ companyData.description }}</p>
      <div class="company-details">
        <div class="detail-item">
          <span class="label">Founded:</span>
          <span class="value">{{ companyData.founded || 'N/A' }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Employees:</span>
          <span class="value">{{ formatLargeNumber(companyData.employees) }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Headquarters:</span>
          <span class="value">{{ companyData.headquarters }}</span>
        </div>
        <div class="detail-item">
          <span class="label">Website:</span>
          <a :href="companyData.website" target="_blank" class="value link">{{ companyData.website }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faClock, faStar, faChartLine, faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faClock, faStar, faChartLine, faSyncAlt);

export default {
  name: 'CompanySnapshot',
  components: { FontAwesomeIcon },
  props: {
    ticker: {
      type: String,
      default: 'AAPL'
    }
  },
  data() {
    return {
      isRefreshing: false,
      isInWatchlist: false,
      companyData: {
        ticker: 'AAPL',
        exchange: 'NASDAQ',
        companyName: 'Apple Inc.',
        sector: 'Technology',
        industry: 'Consumer Electronics',
        logo: 'https://logo.clearbit.com/apple.com',
        description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod.',
        founded: '1976',
        employees: 164000,
        headquarters: 'Cupertino, CA',
        website: 'https://www.apple.com'
      },
      stockData: {
        currentPrice: 193.42,
        change: 2.48,
        changePercent: 1.30,
        lastUpdated: new Date(),
        marketStatus: 'Open'
      },
      keyMetrics: {
        marketCap: 3000000000000,
        peRatio: 29.85,
        eps: 6.48,
        dividendYield: 0.46,
        week52High: 198.23,
        week52Low: 164.08,
        volume: 45623000,
        avgVolume: 58234000
      },
      chartData: [190.5, 191.2, 189.8, 192.1, 193.42]
    };
  },
  
  mounted() {
    this.fetchCompanyData();
    this.drawMiniChart();
    this.setupRealTimeUpdates();
  },
  
  methods: {
    async fetchCompanyData() {
      this.updateDataForTicker(this.ticker);
    },
    
    updateDataForTicker(ticker) {
      const mockData = {
        'AAPL': {
          companyName: 'Apple Inc.',
          sector: 'Technology',
          industry: 'Consumer Electronics',
          logo: 'https://logo.clearbit.com/apple.com',
          description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
          founded: '1976',
          employees: 164000,
          headquarters: 'Cupertino, CA',
          website: 'https://www.apple.com'
        },
        'MSFT': {
          companyName: 'Microsoft Corporation',
          sector: 'Technology',
          industry: 'Software',
          logo: 'https://logo.clearbit.com/microsoft.com',
          description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
          founded: '1975',
          employees: 221000,
          headquarters: 'Redmond, WA',
          website: 'https://www.microsoft.com'
        }
      };
      
      if (mockData[ticker]) {
        this.companyData = { ...this.companyData, ...mockData[ticker], ticker, exchange: 'NASDAQ' };
      }
    },
    
    formatPrice(price) {
      return Number(price).toFixed(2);
    },
    
    formatLargeNumber(num) {
      if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
      if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
      if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
      if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
      return num.toLocaleString();
    },
    
    formatVolume(volume) {
      if (volume >= 1e6) return (volume / 1e6).toFixed(1) + 'M';
      if (volume >= 1e3) return (volume / 1e3).toFixed(1) + 'K';
      return volume.toLocaleString();
    },
    
    formatTime(date) {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }).format(date);
    },
    
    handleLogoError(event) {
      event.target.src = 'https://via.placeholder.com/60x60?text=' + this.companyData.ticker;
    },
    
    addToWatchlist() {
      this.isInWatchlist = !this.isInWatchlist;
      console.log(`${this.isInWatchlist ? 'Added to' : 'Removed from'} watchlist:`, this.ticker);
    },
    
    openChart() {
      console.log('Opening chart for:', this.ticker);
    },
    
    async refreshData() {
      this.isRefreshing = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await this.fetchCompanyData();
        this.drawMiniChart();
      } finally {
        this.isRefreshing = false;
      }
    },
    
    setupRealTimeUpdates() {
      setInterval(() => {
        const changePercent = (Math.random() - 0.5) * 0.02;
        const newPrice = this.stockData.currentPrice * (1 + changePercent);
        const priceChange = newPrice - this.stockData.currentPrice;
        
        this.stockData.currentPrice = newPrice;
        this.stockData.change = priceChange;
        this.stockData.changePercent = (changePercent * 100).toFixed(2);
        this.stockData.lastUpdated = new Date();
        
        this.chartData.push(newPrice);
        if (this.chartData.length > 5) {
          this.chartData.shift();
        }
        this.drawMiniChart();
      }, 5000);
    },
    
    drawMiniChart() {
      this.$nextTick(() => {
        if (!this.$refs.miniChart) return;
        
        const canvas = this.$refs.miniChart;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 20;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const minPrice = Math.min(...this.chartData) * 0.999;
        const maxPrice = Math.max(...this.chartData) * 1.001;
        const priceRange = maxPrice - minPrice;
        
        ctx.strokeStyle = this.stockData.change >= 0 ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        this.chartData.forEach((price, index) => {
          const x = padding + (index / (this.chartData.length - 1)) * chartWidth;
          const y = canvas.height - padding - ((price - minPrice) / priceRange) * chartHeight;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
        
        ctx.fillStyle = this.stockData.change >= 0 ? '#10b981' : '#ef4444';
        this.chartData.forEach((price, index) => {
          const x = padding + (index / (this.chartData.length - 1)) * chartWidth;
          const y = canvas.height - padding - ((price - minPrice) / priceRange) * chartHeight;
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        });
      });
    }
  },
  
  watch: {
    ticker(newTicker) {
      this.updateDataForTicker(newTicker);
    }
  }
};
</script>

<style scoped>
.company-snapshot {
  background: white;
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.company-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.company-info {
  flex: 1;
}

.ticker-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.ticker {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.exchange {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.company-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
}

.sector-industry {
  display: flex;
  gap: 0.5rem;
}

.sector, .industry {
  background: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.company-logo {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.price-section {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.price-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
}

.price-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-change.positive {
  color: #10b981;
}

.price-change.negative {
  color: #ef4444;
}

.change-amount {
  font-size: 1.2rem;
  font-weight: 700;
}

.change-percent {
  font-size: 1rem;
  font-weight: 600;
}

.price-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}

.market-status {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.market-status.open {
  background: #d1fae5;
  color: #065f46;
}

.market-status.closed {
  background: #fee2e2;
  color: #991b1b;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.action-btn.primary {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border: none;
}

.action-btn.secondary {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mini-chart-section {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.mini-chart-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.mini-chart-section canvas {
  width: 100%;
  background: #f8f9fa;
  border-radius: 8px;
}

.company-description {
  padding: 1.5rem;
}

.company-description h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.company-description p {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.company-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item .label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.detail-item .value {
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-item .value.link {
  color: #3b82f6;
  text-decoration: none;
}

.detail-item .value.link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .company-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .company-logo {
    align-self: flex-start;
  }
}
</style> 