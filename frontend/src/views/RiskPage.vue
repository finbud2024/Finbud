<template>
  <div class="container">
    <header class="header">
      <h1>Market Quotes Dashboard</h1>
    </header>
    <div class="data-card">
      <h2>Stock Quotes</h2>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-else-if="loading" class="loading">Loading...</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>Volume</th>
              <th>Previous Close</th>
              <th>Change</th>
              <th>Change Percent</th>
            </tr>
          </thead>
          <tbody v-if="paginatedStockQuotes.length" class="table-body">
            <tr v-for="stock in paginatedStockQuotes" :key="stock['01. symbol']" class="table-row">
              <td>{{ stock['01. symbol'] }}</td>
              <td>{{ stock['05. price'] }}</td>
              <td>{{ stock['06. volume'] }}</td>
              <td>{{ stock['08. previous close'] }}</td>
              <td>{{ stock['09. change'] }}</td>
              <td>{{ stock['10. change percent'] }}</td>
            </tr>
          </tbody>
        </table>
        <Pagination :currentPage.sync="currentStockPage" :totalPages="stockTotalPages" @update:currentPage="updateStockCurrentPage" />
      </div>
    </div>
    <div class="data-card">
      <h2>Crypto Quotes</h2>
      <div v-if="errorCrypto" class="error">{{ errorCrypto }}</div>
      <div v-else-if="loadingCrypto" class="loading">Loading...</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rank</th>
              <th>Tier</th>
              <th>Price</th>
              <th>Symbol</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody v-if="paginatedCryptoList.length" class="table-body">
            <tr v-for="crypto in paginatedCryptoList" :key="crypto.uuid" class="table-row">
              <td><img :src="crypto.iconUrl" :alt="crypto.name"> {{ crypto.name }}</td>
              <td>{{ crypto.rank }}</td>
              <td>{{ crypto.tier }}</td>
              <td>{{ formatPrice(crypto.price) }} B</td>
              <td>{{ crypto.symbol }}</td>
              <td>{{ crypto.change }}</td>
            </tr>
          </tbody>
        </table>
        <Pagination :currentPage.sync="currentCryptoPage" :totalPages="cryptoTotalPages" @update:currentPage="updateCryptoCurrentPage" />
      </div>
    </div>
    <RiskChat />
  </div>
</template>

<script>
import axios from 'axios';
import Pagination from '../components/Risk&Chat/Pagination.vue';
import RiskChat from '../components/Risk&Chat/RiskChat.vue';

const apiKey = process.env.VUE_APP_ALPHA_VANTAGE_KEY;
const apiKeyCrypto = process.env.VUE_APP_COINRANKING_KEY;

export default {
  name: 'StockQuote',
  components: {
    RiskChat,
    Pagination,
  },
  data() {
    return {
      loading: true,
      error: null,
      stockQuotes: [],
      loadingCrypto: true,
      errorCrypto: null,
      cryptoList: [], // from coinranking contains update every seconds
      cryptoQuotes: [], // from alpha vantage which only contain daily 
      currentStockPage: 1,
      currentCryptoPage: 1,
      itemsPerPage: 10,
    };
  },
  mounted() {
    this.fetchStockQuote();
    this.getCryptoPrice();
  },
  computed: {
    stockTotalPages() {
      return Math.ceil(this.stockQuotes.length / this.itemsPerPage);
    },
    cryptoTotalPages() {
      return Math.ceil(this.cryptoList.length / this.itemsPerPage);
    },
    paginatedStockQuotes() {
      const start = (this.currentStockPage - 1) * this.itemsPerPage;
      return this.stockQuotes.slice(start, start + this.itemsPerPage);
    },
    paginatedCryptoList() {
      const start = (this.currentCryptoPage - 1) * this.itemsPerPage;
      return this.cryptoList.slice(start, start + this.itemsPerPage);
    },
  },
  methods: {
    async fetchStockQuote() {
      const symbols = ['IBM', 'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TSLA', 'NFLX', 'NVDA', 'INTC', 'CSCO', 'ORCL', 'ADBE', 'CRM', 'PYPL', 'AMD', 'QCOM', 'TXN', 'AVGO', 'SHOP'];
      try {
        const requests = symbols.map(symbol => {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
          return axios.get(url);
        });
        const responses = await Promise.all(requests);
        console.log('Stock responses:', responses);
        this.stockQuotes = responses.map(response => {
          const quote = response.data['Global Quote'];
          if (quote && Object.keys(quote).length > 0) {
            return quote;
          } else {
            return null; 
          }
        }).filter(quote => quote !== null);
        console.log('Final stockQuotes:', this.stockQuotes);
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to fetch stock quotes';
        console.error('Error:', error);
        this.loading = false;
      }
    },
    async getCryptoPrice() {
      const url = "https://api.coinranking.com/v2/coins?timePeriod=7d";
      try {
        const res = await axios.get(url, {
          headers: {
            'x-access-token': apiKeyCrypto,
          }
        });
        console.log('Crypto response:', res);
        this.cryptoList = res.data.data.coins;
        console.log('Final CryptoList:', this.cryptoList);
        this.loadingCrypto = false;
      } catch (error) {
        this.errorCrypto = 'Failed to fetch crypto quotes';
        console.error('Error:', error);
        this.loadingCrypto = false;
      }
    },
    updateCryptoCurrentPage(newPage) {
      this.currentCryptoPage = newPage;
    },
    updateStockCurrentPage(newPage) {
      this.currentStockPage = newPage;
    },
    formatPrice(price) {
      const x = parseFloat(price);
      if (x >= 1e9) {
        return (x / 1e9).toFixed(2);
      }
      return x.toFixed(2);
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.header {
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
}

.data-card {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  border-radius: 10px;
  background-color: #fff;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 0.9rem;
}

thead {
  background-color: #f8f8f8;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f2f2f2;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
}

.loading {
  color: gray;
  font-weight: bold;
  text-align: center;
}

.table-row {
  transition: background-color 0.3s ease;
}

img {
  max-width: 30px;
  height: auto;
  vertical-align: middle;
  margin-right: 8px;
}

/* Media query for phone users */

@media screen and (max-width: 768px) {
  .data-card {
    width: 100%;
    display: flex;
    padding: 10px;
    flex-direction: column;
  }

  th, td {
    padding: 5px 5px;
    text-align: left;
    border: 1px solid #ddd;
  }

}
</style>
