<template>
  <div class="company-card" v-if="!isLoading">
    <!-- Header: Ticker + Price/Change -->
    <div class="card-header">
      <div class="company-name">{{ stockCode }}</div>
      <div class="price-info">
        <!-- Live Price -->
        <span class="current-price">{{ livePrice }}</span>
  
        <!-- Price change from previous close to current live price -->
        <span
          class="price-change"
          :class="{ positive: priceChange >= 0, negative: priceChange < 0 }"
        >
          {{ priceChangeDisplay }} ({{ priceChangePercent }}%)
        </span>
      </div>
    </div>
  
    <!-- Stats Section - Now with proper grid layout -->
    <div class="card-stats">
      <div class="stat-item" v-for="stat in stats" :key="stat.label">
        <span class="label">{{ stat.label }}</span>
        <span class="value">{{ typeof stat.value === 'number' ? stat.value.toFixed(2) : stat.value }}</span>
      </div>
    </div>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import { fetchSimBannerStockDatav3 } from "../services/stockServices";

export default {
  name: 'BannerCardSimulator',
  props: {
    stockCode: {
      type: String,
      required: true,
      default: 'AAPL'
    }
  },
  data() {
    return {
      livePrice: 'N/A',
      open: 'N/A',
      close: 'N/A',
      high: 'N/A',
      low: 'N/A',
      volume: 'N/A',
      marketCap: 'N/A',
      eps: 'N/A',
      peRatio: 'N/A',
      pbr: 'N/A',
      isLoading: true,
      error: null
    };
  },
  computed: {
    stats() {
      return [
        { label: 'Open', value: this.open },
        { label: 'High', value: this.high },
        { label: 'Low', value: this.low },
        { label: 'Previous Close', value: this.close },
        { label: 'Market Cap', value: this.marketCap },
        { label: 'Volume', value: this.volume },
        { label: 'EPS', value: this.eps },
        { label: 'P/E', value: this.peRatio },
        { label: 'P/B', value: this.pbr }
      ];
    },
    priceChange() {
      if (this.close !== 'N/A' && this.livePrice !== 'N/A') {
        const live = parseFloat(this.livePrice);
        const prevClose = parseFloat(this.close);
        return (live - prevClose).toFixed(2);
      }
      return 0;
    },
    priceChangeDisplay() {
      const num = parseFloat(this.priceChange);
      return num > 0 ? `+${num}` : `${num}`;
    },
    priceChangePercent() {
      if (this.close !== 'N/A' && parseFloat(this.close) !== 0 && this.livePrice !== 'N/A') {
        const change = parseFloat(this.priceChange);
        const prevClose = parseFloat(this.close);
        return ((change / prevClose) * 100).toFixed(2);
      }
      return 0;
    }
  },
  async created() {
    try {
      const data = await fetchSimBannerStockDatav3(this.stockCode);
      if (data) {
        this.livePrice = data.livePrice;
        this.open = data.open;
        this.close = data.close;
        this.high = data.high;
        this.low = data.low;
        this.volume = data.volume;
        this.marketCap = data.marketCap;
        this.eps = data.eps;
        this.peRatio = data.peRatio;
        this.pbr = data.pbr;
      }
    } catch (error) {
      console.error('Error in BannerCardSimulator:', error);
    } finally {
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
/* Complete CSS overhaul for proper sizing */
.company-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f9fa;
  color: var(--text-primary);
  box-shadow: 0 2px 4px var(--box-shadow);
  box-sizing: border-box;
  overflow: hidden; /* Prevent any overflow */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.company-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.price-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.current-price {
  font-size: 1.5rem;
  font-weight: 600;
}

.price-change {
  font-size: 1rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}

.price-change.positive {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
}

.price-change.negative {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

/* Improved stats grid layout */
.card-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  background-color: var(--bg-secondary);
  border-radius: 6px;
  min-height: 60px;
}

.label {
  font-size: 0.8rem;
  color: var(--label-color);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .company-name {
    font-size: 1.3rem;
  }
  
  .current-price {
    font-size: 1.3rem;
  }
  
  .price-change {
    font-size: 0.9rem;
  }
  
  .card-stats {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 8px;
  }
  
  .stat-item {
    min-height: 50px;
    padding: 6px;
  }
  
  .label {
    font-size: 0.75rem;
  }
  
  .value {
    font-size: 0.9rem;
  }
}
</style>