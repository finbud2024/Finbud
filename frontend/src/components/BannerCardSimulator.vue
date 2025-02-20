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
  
      <!-- Stats Section -->
      <div class="card-stats">
        <div class="stat-item">
          <span class="label">Open</span>
          <span class="value">{{ open }}</span>
        </div>
        <div class="stat-item">
          <span class="label">High</span>
          <span class="value">{{ high }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Low</span>
          <span class="value">{{ low }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Previous Close</span>
          <span class="value">{{ close }}</span>
        </div>
        <div class="stat-item">
          <span class="label">EPS</span>
          <span class="value">{{ eps }}</span>
        </div>
        <div class="stat-item">
          <span class="label">P/E</span>
          <span class="value">{{ peRatio }}</span>
        </div>
        <div class="stat-item">
          <span class="label">P/B</span>
          <span class="value">{{ pbr }}</span>
        </div>
      </div>
    </div>
  
    <div v-else>Loading...</div>
  </template>
  
  <script>
  import { fetchSimBannerStockDatav3 } from "../services/stockServices"; 
  // Make sure the above path is correct for your project
  
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
        // Finnhub Data
        livePrice: 'N/A',  // Current price (quoteData.c)
        open: 'N/A',       // quoteData.o
        close: 'N/A',      // Previous close (quoteData.pc)
        high: 'N/A',       // quoteData.h
        low: 'N/A',        // quoteData.l
        volume: 'N/A',     // (Currently "N/A" from the service, but you could add more calls if needed)
        marketCap: 'N/A',
        eps: 'N/A',
        peRatio: 'N/A',
        pbr: 'N/A',
  
        // Loading state
        isLoading: true,
        error: null
      };
    },
    computed: {
      /**
       * Price change from previous close to the live price.
       */
      priceChange() {
        if (this.close !== 'N/A' && this.livePrice !== 'N/A') {
          const live = parseFloat(this.livePrice);
          const prevClose = parseFloat(this.close);
          return (live - prevClose).toFixed(2);
        }
        return 0;
      },
      /**
       * Add a + sign if the price is higher than previous close.
       */
      priceChangeDisplay() {
        const num = parseFloat(this.priceChange);
        return num > 0 ? `+${num}` : `${num}`;
      },
      /**
       * Percentage change from previous close.
       */
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
      console.log('BannerCardSimulator created with stockCode:', this.stockCode);
      try {
        const data = await fetchSimBannerStockDatav3(this.stockCode);
        console.log('Fetched data:', data);
        if (data) {
          this.livePrice = data.livePrice;
          this.open = data.open;
          this.close = data.close;  // This is the 'previous close'
          this.high = data.high;
          this.low = data.low;
          this.volume = data.volume;  // Currently "N/A" in the service
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
  .company-card {
    width: 100%;
    max-width: 800px;
    border: 1px solid #e7e7e7;
    border-radius: 4px;
    padding: 1.5rem;
    font-family: sans-serif;
    margin: 1.5rem auto;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .company-name {
    font-size: 1.8rem;
    font-weight: bold;
  }
  
  .price-info {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }
  
  .current-price {
    font-size: 1.8rem;
  }
  
  .price-change {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  /* Change color based on positive/negative movement */
  .price-change.positive {
    color: green;
  }
  .price-change.negative {
    color: red;
  }
  
  .card-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .stat-item {
    display: flex;
    flex-direction: column;
    width: 140px;
  }
  
  .label {
    font-size: 0.9rem;
    color: #555;
    margin-bottom: 0.3rem;
  }
  
  .value {
    font-size: 1.3rem;
  }
  </style>
  