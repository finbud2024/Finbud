<template>
  <div>
    <!-- Display the market summary quote -->
    <div class="market-summary">
      <h3>Market Summary</h3>
      <p v-if="marketSummary">{{ marketSummary }}</p>
      <p v-else>Loading market summary...</p>
    </div>
    <CryptoPopup v-if="showPopup" :crypto="selectedCrypto" @close="closePopup" />

    <!-- Top Series Section -->
    <section class="top-series">
      <TopSeries title="Hot Coins" :cryptos="hotCoins" :openPopup="openPopup" />
      <TopSeries title="Top Losers" :cryptos="topLosers" :openPopup="openPopup" />
      <TopSeries title="Top Gainers" :cryptos="topGainers" :openPopup="openPopup" />
      <TopSeries title="Top Volume" :cryptos="topVolume" :openPopup="openPopup" />
    </section>

    <!-- Search Bar -->
    <!-- <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by symbol or name..." 
        @keyup.enter="filterCryptos"
      />
      <button @click="filterCryptos">Search</button>
    </div> -->

    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search for a coin..." 
        @input="filterCryptos"
      />
    </div>

    <!-- Existing crypto list -->
    <div class="crypto-table-wrapper">
      <div class="crypto-table">
        <div v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
          <div class="crypto-row">
            <div 
              class="crypto-item animate__animated animate__fadeInUp" 
              v-for="crypto in row" 
              :key="crypto.symbol" 
              @click="openPopup(crypto)"
              @mouseover="showTooltip(crypto.uuid)"  
              @mouseleave="hideTooltip"  
            >
              <div :class="['crypto-bar', { 'positive-bar': crypto.change > 0, 'negative-bar': crypto.change < 0 }]"></div>
              <div class="crypto-info">
                <div class="crypto-symbol">
                  <h3>{{ crypto.symbol }}</h3>
                  <p>{{ crypto.name }}</p>
                </div>
                <div class="crypto-price">
                  <p class="price">${{ crypto.price.toFixed(6) }}</p>
                </div>
                <div class="crypto-change">
                  <p :class="{'positive': crypto.change > 0, 'negative': crypto.change < 0}">
                    {{ crypto.change > 0 ? '+' : '' }}{{ crypto.change.toFixed(2) }}%
                  </p>
                  <p :class="{'positive': crypto.changeAmount > 0, 'negative': crypto.changeAmount < 0}">
                    {{ crypto.changeAmount.toFixed(6) }}
                  </p>
                </div>
              </div>
              <!-- Tooltip element -->
              <div :class="['tooltip', { 'tooltip-visible': tooltipVisible && activeCrypto === crypto.uuid }]">
                Full chart
              </div>
            </div>
          </div>
          <div v-if="rowIndex < filteredRows.length - 1" class="row-divider"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import TopSeries from './TopSeries.vue';
import CryptoPopup from '../marketPage/CryptoPopup.vue';
import { gptServices } from '@/services/gptServices.js';


const DEPLOY_URL = process.env.VUE_APP_DEPLOY_URL;
const BINANCE_API_KEY = process.env.VUE_APP_BINANCE_API_KEY;

export default {
  name: 'CryptoWatch',
  components: {
    TopSeries,
    CryptoPopup,
  },
  data() {
    return {
      cryptos: [],
      hotCoins: [],
      topGainers: [],
      topLosers: [],
      topVolume: [],
      rows: [[], [], []],
      filteredRows: [[], [], []],
      showPopup: false,
      selectedCrypto: null,
      searchQuery: '',  // For storing the search input
      tooltipVisible: false,  // Tooltip visibility flag
      activeCrypto: null,  // Store the UUID of the active crypto for tooltip
      marketSummary: null,  // To store the generated market summary
    };
  },
  created() {
    this.fetchCryptos();
  },
  methods: {
    async fetchCryptos() {
      try {
        // Make a request to your backend, which will call the Binance API
        const response = await axios.post(`${DEPLOY_URL}/proxy`, {
          url: 'https://api.binance.com/api/v3/ticker/24hr',
          method: 'GET',
          headers: {
            'X-MBX-APIKEY': BINANCE_API_KEY,
            'Accept': 'application/json',
          }
        });

        // Filter the response to only include USDT pairs (which are priced in USD)
        const usdPairs = response.data.filter(ticker => ticker.symbol.endsWith('USDT'));

        // Process the response data from Binance API
        this.cryptos = usdPairs.map(ticker => ({
          symbol: ticker.symbol.replace('USDT', ''),  // Remove 'USDT' to show just the crypto symbol
          name: ticker.symbol.replace('USDT', ''),    // Using symbol as name for simplicity
          price: parseFloat(ticker.lastPrice),
          change: parseFloat(ticker.priceChangePercent),
          changeAmount: parseFloat(ticker.priceChange),
          volume: parseFloat(ticker.volume),
          uuid: ticker.symbol,  // Using symbol as uuid substitute
        }));

        // Categorize the data
        this.hotCoins = this.getTopCoins(this.cryptos, 'changeAmount', 3);
        this.topGainers = this.getTopCoins(this.cryptos, 'change', 3);
        this.topLosers = this.getTopCoins(this.cryptos, 'change', 3, true);
        this.topVolume = this.getTopCoins(this.cryptos, 'symbol', 3);

        if (this.cryptos.length > 0) {
          this.selectedCrypto = this.cryptos[0].symbol; // Set default selected crypto
        }
        this.distributeCryptos();
        await this.generateMarketSummary(); // Generate market summary after fetching cryptos
      } catch (error) {
        console.error('Error fetching cryptos:', error);
      }
    },
    getTopCoins(coins, sortBy, limit, ascending = false) {
      return coins
        .slice()
        .sort((a, b) => ascending ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy])
        .slice(0, limit);
    },
    distributeCryptos() {
      // Distribute cryptos into rows for display
      this.rows = [[], [], []]; // Reset rows
      for (let i = 0; i < this.cryptos.length; i++) {
        this.rows[i % 3].push(this.cryptos[i]);
      }
      this.filteredRows = this.rows; // Initialize filteredRows with all cryptos
    },
    filterCryptos() {
      const query = this.searchQuery.toLowerCase();

      if (!query) {
        this.filteredRows = this.rows;
        return;
      }

      const filteredCryptos = this.cryptos.filter(crypto =>
        crypto.symbol.toLowerCase().includes(query) ||
        crypto.name.toLowerCase().includes(query)
      );

      // Distribute filtered cryptos into rows
      this.filteredRows = [[], [], []];
      for (let i = 0; i < filteredCryptos.length; i++) {
        this.filteredRows[i % 3].push(filteredCryptos[i]);
      }
    },
    async generateMarketSummary() {
      try {
        const allCryptos = this.cryptos; // Use all cryptos
        const promptData = allCryptos.map(crypto => {
          return `${crypto.symbol} (${crypto.name}) - $${crypto.price.toFixed(2)} - ${crypto.changeAmount.toFixed(2)}%`;
        }).join('\n');

        const openAiPrompt = `Here is the data for all cryptocurrencies:\n${promptData}\n\nBased on the above data, provide a summary of the overall market trend. Consider factors like the general direction (increase/decrease), and any significant fluctuations or patterns. Please give a concise summary that starts with "The market trend today tends to..."`;

        const summary = await gptServices(openAiPrompt);

        this.marketSummary = summary;
      } catch (error) {
        console.error('Error generating market summary:', error);
        this.marketSummary = 'Unable to generate market summary at this time.';
      }
    },
    openPopup(crypto) {
      this.selectedCrypto = crypto;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.selectedCrypto = null;
    },
    showTooltip(uuid) {
      this.activeCrypto = uuid;
      this.tooltipVisible = true;
    },
    hideTooltip() {
      this.tooltipVisible = false;
    },
  },
};
</script>

<style scoped>
@import 'animate.css';

body {
  font-family: 'Segoe UI', Arial, sans-serif;
}

.top-series {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 10px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.crypto-watch {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  overflow: hidden;
}

.header {
  color: #007bff;
  opacity: 1;
  text-align: left;
  margin-bottom: 20px;
  animation: fadeInDown 0.5s;
}

.crypto-section {
  background-color: #1c1c1c;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  color: #fff;
}

.crypto-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.crypto-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.crypto-item:hover {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s;
  background-color: rgba(0, 0, 0, 0.1);
}

.crypto-icon {
  margin-right: 15px;
}

.crypto-icon img {
  width: 32px;
  height: 32px;
}

.crypto-details {
  display: flex;
  flex-direction: column;
}

.crypto-details h4 {
  margin: 0;
  font-size: 1.1em;
}

.crypto-details p {
  margin: 2px 0;
  font-size: 0.9em;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #ff5252;
}

.crypto-table-wrapper {
  overflow-x: auto;
  overflow-y: hidden; 
  white-space: nowrap; 
}

.crypto-table {
  display: flex;
  flex-direction: column;
  width: max-content; /* Ensure the table takes the necessary width for scrolling */
}

.crypto-row {
  display: flex;
  margin-bottom: 30px;
}

.crypto-item {
  display: flex;
  border: 1px solid transparent;
  padding: 8px;
  width: 350px; /* Set a fixed width for each item */
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
  white-space: normal; /* Ensure text wraps within the item */
  word-wrap: break-word; /* Break words that are too long */
}

.crypto-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

/* Tooltip styles */
.tooltip {
  visibility: hidden;
  background-color: rgba(125, 123, 123, 0.7);
  color: black;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 5px;
  position: absolute;
  top: 70px;
  width: 95%;
  height: 25px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
}

.tooltip-visible {
  visibility: visible;
  opacity: 1;
}

.crypto-bar {
  width: 5px;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.positive-bar {
  background-color: green;
}

.negative-bar {
  background-color: red;
}

.crypto-info {
  display: flex;
  justify-content: space-between; /* Distribute space between children */
  align-items: center;
  width: 100%; /* Make sure it takes the full width of the container */
  padding-left: 10px;
}

.crypto-symbol {
  flex: 1; /* Take all the available space on the left */
  display: flex;
  flex-direction: column;
  word-wrap: break-word; /* Ensure long words break to the next line */
}

.crypto-symbol h3 {
  margin: 0;
  font-size: 1.0em;
  font-weight: bold;
}

.crypto-symbol p {
  margin: 0;
  font-size: 0.9em;
  color: #666;
  word-wrap: break-word; /* Ensure long words break to the next line */
  white-space: normal; /* Ensure text wraps */
  overflow-wrap: break-word; /* Ensure text wraps */
}

.crypto-price {
  flex-shrink: 0; /* Prevent shrinking */
  text-align: center; /* Center align the text */
  font-size: 0.9em;
}

.crypto-price .price {
  font-weight: bold;
}

.crypto-change {
  flex: 1; /* Take all the available space on the right */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align to the right */
  font-size: 0.9em;
}

.crypto-change p {
  margin: 0;
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.row-divider {
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  width: 100%; /* Ensure the divider spans the entire width of the scrolling area */
  margin: 10px 0;
}

.market-summary {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .crypto-item {
    width: 363px;
  }
}

@media (max-width: 992px) {
  .crypto-item {
    width: 500px;
  }
}

@media (max-width: 768px) {
  .crypto-item {
    width: 350px;
  }
}

.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar input {
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 3px;
  width: 60%;
  margin-right: 10px;
}

.search-bar button {
  padding: 10px 20px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.search-bar button:hover {
  background-color: #0056b3;
}

</style>
