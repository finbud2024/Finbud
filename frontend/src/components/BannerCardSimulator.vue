<template>
  <div class="company-card" v-if="!isLoading">
    <!-- Header: Ticker + Price/Change -->
    <div class="card-header">
      <div class="company-name">{{ displaySymbol || "No Stock Selected" }}</div>
      <div class="price-info" v-if="livePrice !== 'N/A'">
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
      <div class="price-info" v-else>
        <span class="current-price text-muted">No data available</span>
      </div>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error-message">
      <small>Error loading stock data: {{ error }}</small>
    </div>

    <!-- Stats Section - Now with proper grid layout -->
    <div class="card-stats">
      <div class="stat-item" v-for="stat in stats" :key="stat.label">
        <span class="label">{{ stat.label }}</span>
        <span class="value">{{
          typeof stat.value === "number" ? stat.value.toFixed(2) : stat.value
        }}</span>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">
    <div class="loading-text">
      Loading stock data for {{ displaySymbol }}...
    </div>
  </div>
</template>

<script>
import { fetchSimBannerStockDatav3 } from "../services/stockServices";

export default {
  name: "BannerCardSimulator",
  props: {
    stockCode: {
      type: String,
      required: true,
      default: "AAPL",
    },
  },
  data() {
    return {
      livePrice: "N/A",
      open: "N/A",
      close: "N/A",
      high: "N/A",
      low: "N/A",
      volume: "N/A",
      marketCap: "N/A",
      eps: "N/A",
      peRatio: "N/A",
      pbr: "N/A",
      isLoading: true,
      error: null,
    };
  },
  computed: {
    displaySymbol() {
      // Extract clean symbol for display (e.g., "NASDAQ:AAPL" -> "AAPL")
      return this.stockCode && this.stockCode.includes(":")
        ? this.stockCode.split(":")[1]
        : this.stockCode;
    },
    stats() {
      return [
        { label: this.$t("investment.stats.open"), value: this.open },
        { label: this.$t("investment.stats.high"), value: this.high },
        { label: this.$t("investment.stats.low"), value: this.low },
        { label: this.$t("investment.stats.prevClose"), value: this.close },
        { label: this.$t("investment.stats.marketCap"), value: this.marketCap },
        { label: this.$t("investment.stats.volume"), value: this.volume },
        { label: this.$t("investment.stats.eps"), value: this.eps },
        { label: this.$t("investment.stats.pe"), value: this.peRatio },
        { label: this.$t("investment.stats.pb"), value: this.pbr },
      ];
    },
    priceChange() {
      if (this.close !== "N/A" && this.livePrice !== "N/A") {
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
      if (
        this.close !== "N/A" &&
        parseFloat(this.close) !== 0 &&
        this.livePrice !== "N/A"
      ) {
        const change = parseFloat(this.priceChange);
        const prevClose = parseFloat(this.close);
        return ((change / prevClose) * 100).toFixed(2);
      }
      return 0;
    },
  },
  watch: {
    // Watch for changes in stockCode prop and refetch data
    stockCode: {
      handler(newStockCode, oldStockCode) {
        console.log(
          `Stock code changed from ${oldStockCode} to ${newStockCode}`
        );
        if (newStockCode && newStockCode !== oldStockCode) {
          this.fetchStockData();
        }
      },
      immediate: true, // Run on component mount
    },
  },
  methods: {
    async fetchStockData() {
      if (!this.stockCode) {
        console.warn("No stock code provided");
        return;
      }

      // Extract symbol from exchange-prefixed format (e.g., "NASDAQ:AAPL" -> "AAPL")
      const cleanSymbol = this.stockCode.includes(":")
        ? this.stockCode.split(":")[1]
        : this.stockCode;

      console.log(
        `Fetching data for stock: ${this.stockCode} -> clean symbol: ${cleanSymbol}`
      );
      this.isLoading = true;
      this.error = null; // Reset error state

      try {
        const data = await fetchSimBannerStockDatav3(cleanSymbol);
        console.log("Banner card data received:", data);

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
        } else {
          console.warn("No data returned from API");
          // Reset to N/A if no data
          this.livePrice = "N/A";
          this.open = "N/A";
          this.close = "N/A";
          this.high = "N/A";
          this.low = "N/A";
          this.volume = "N/A";
          this.marketCap = "N/A";
          this.eps = "N/A";
          this.peRatio = "N/A";
          this.pbr = "N/A";
        }
      } catch (error) {
        console.error("Error in BannerCardSimulator:", error);
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
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

.text-muted {
  color: #6c757d;
  font-style: italic;
}

.error-message {
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.loading-state {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
}

.loading-text {
  color: #6c757d;
  font-size: 1rem;
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
