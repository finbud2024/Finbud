<template>
  <div>
    <div class="crypto-watch animate__animated animate__fadeIn">
      <div class="header">
        <!--<h2>CRYPTOCURRENCY</h2>-->
      </div>
      <div class="crypto-table-wrapper">
        <div class="crypto-table">
          <div v-for="(row, rowIndex) in rows" :key="rowIndex">
            <div class="crypto-row">
              <div class="crypto-item animate__animated animate__fadeInUp" v-for="crypto in row" :key="crypto.symbol" @click="openPopup(crypto)">
                <div :class="['crypto-bar', { 'positive-bar': crypto.change > 0, 'negative-bar': crypto.change < 0 }]"></div>
                <div class="crypto-info">
                  <div class="crypto-symbol">
                    <h3>{{ crypto.symbol }}</h3>
                    <p>{{ crypto.name }}</p>
                  </div>
                  <div class="crypto-price">
                    <p class="price">${{ crypto.price.toLocaleString() }}</p>
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
              </div>
            </div>
            <div v-if="rowIndex < rows.length - 1" class="row-divider"></div>
          </div>
        </div>
      </div>
    </div>
    <CryptoPopup v-if="showPopup" :crypto="selectedCrypto" @close="closePopup" />
    <!--<NewsSection :disableClicks="showPopup" />-->
  </div>
</template>

<script>
import axios from 'axios';
import CryptoPopup from './CryptoPopup.vue';

const API_KEY = 'coinranking687d4cc37a39468baeffcc6c0546f518c3c54b2b87e4f73a';

export default {
  name: 'CryptoWatch',
  components: {
    CryptoPopup,
  },
  data() {
    return {
      cryptos: [],
      rows: [[], [], []],
      showPopup: false,
      selectedCrypto: null,
    };
  },
  created() {
    this.fetchCryptos();
  },
  methods: {
    async fetchCryptos() {
      try {
        const response = await axios.get('https://api.coinranking.com/v2/coins', {
          headers: {
            'Authorization': `Bearer ${API_KEY}`
          }
        });
        this.cryptos = response.data.data.coins.map(coin => ({
          symbol: coin.symbol,
          name: coin.name,
          price: parseFloat(coin.price),
          change: parseFloat(coin.change),
          changeAmount: parseFloat(coin.change) * parseFloat(coin.price) / 100,
          uuid: coin.uuid,
        }));
        if (this.cryptos.length > 0) {
          this.selectedCrypto = this.cryptos[0].uuid; // Set default selected crypto
        }
        this.distributeCryptos();
      } catch (error) {
        console.error('Error fetching cryptos:', error);
      }
    },
    distributeCryptos() {
      for (let i = 0; i < this.cryptos.length; i++) {
        this.rows[i % 3].push(this.cryptos[i]);
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
  },
};
</script>

<style scoped>
@import 'animate.css';

body {
  font-family: 'Segoe UI', Arial, sans-serif;
}

.crypto-watch {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  color: #007bff;
  opacity: 1;
  text-align: left;
  margin-bottom: 20px;
  animation: fadeInDown 0.5s;
}

.crypto-table-wrapper {
  overflow-x: auto;
}

.crypto-table {
  display: flex;
  flex-direction: column;
  width: max-content; /* Ensure the table takes the necessary width for scrolling */
}

.crypto-row {
  display: flex;
  margin-bottom: 20px;
}

.crypto-item {
  display: flex;
  border: 1px solid transparent;
  padding: 8px;
  min-width: 363px;
  margin-right: 10px;
  position: relative;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
}

.crypto-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
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
}

.crypto-symbol h3 {
  margin: 0;
  font-size: 1.2em;
  font-weight: bold;
}

.crypto-symbol p {
  margin: 0;
  font-size: 0.9em;
  color: #666;
}

.crypto-price {
  flex-shrink: 0; /* Prevent shrinking */
  text-align: center; /* Center align the text */
}

.crypto-price .price {
  font-size: 1em;
  font-weight: bold;
}

.crypto-change {
  flex: 1; /* Take all the available space on the right */
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align to the right */
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
</style>
