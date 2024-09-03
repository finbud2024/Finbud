<template>
  <div class="container">
    

    <!-- Market Data Section -->
    <section class="content">
      <h2 class="headtitle">Market Data Center</h2>
      <div class="market-data-center">
        <div class="market-section">
          <!-- Cryptocurrency Watch Section -->
          <div class="section-title">Cryptocurrency Watch</div>
          <div class="margin-box">
            <CryptoWatch class="margin-box-content" />
          </div>
          
          <!-- Stock Watch Section -->
          <div class="section-title">Stock Watch</div>
          <div class="margin-box">
            <StockWatch class="margin-box-content" />
          </div>

          <!-- Real Estate Section -->
          <div class="section-title">Real Estate</div>
          <div class="margin-box">
            <RealEstateMap class="margin-box-content" />
          </div>

          <!-- Stock Quotes Section -->
          <div class="section-title">Stock Quotes</div>
          <div class="margin-box">
            <div class="margin-box-content">
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
                  <tbody v-if="paginatedStockQuotes.length">
                    <tr v-for="stock in paginatedStockQuotes" :key="stock['01. symbol']">
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
          </div>

          <!-- Crypto Quotes Section -->
          <div class="section-title">Crypto Quotes</div>
          <div class="margin-box">
            <div class="margin-box-content">
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
                  <tbody v-if="paginatedCryptoList.length">
                    <tr v-for="crypto in paginatedCryptoList" :key="crypto.uuid">
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
          </div>

        </div>
      </div>
    </section>

    <!-- Risk Chat Section -->
    <RiskChat />
  </div>
</template>



<script>
import axios from 'axios';
import Pagination from '../components/Risk&Chat/Pagination.vue';
import RiskChat from '../components/Risk&Chat/RiskChat.vue';
import CryptoWatch from '@/components/marketPage/CryptoWatch.vue';
import StockWatch from '@/components/marketPage/StockWatch.vue';
import RealEstateMap from '@/components/marketPage/RealEstateMap.vue';

const apiKey = process.env.VUE_APP_ALPHA_VANTAGE_KEY; 
const apiKeyCrypto = process.env.VUE_APP_COINRANKING_KEY;

export default {
  name: 'RiskAnalysis',
  components: {
    Pagination,
    CryptoWatch,
    StockWatch,
    RealEstateMap,
    RiskChat,
  },
  data() {
    return {
      loading: true,
      error: null,
      stockQuotes: [],
      loadingCrypto: true,
      errorCrypto: null,
      cryptoList: [],
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
        this.stockQuotes = responses.map(response => {
          const quote = response.data['Global Quote'];
          if (quote && Object.keys(quote).length > 0) {
            return quote;
          } else {
            return null; 
          }
        }).filter(quote => quote !== null);
        this.loading = false;
      } catch (error) {
        this.error = 'Failed to fetch stock quotes';
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
        this.cryptoList = res.data.data.coins;
        this.loadingCrypto = false;
      } catch (error) {
        this.errorCrypto = 'Failed to fetch crypto quotes';
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

.headtitle {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.market-data-center {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  background: white;
  margin: 2rem auto;
  max-width: 1200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.section-title {
  font-weight: bold;
  color: #007bff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  text-align: left;
}

.margin-box {
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  background-color: #fff;
}

.margin-box-content {
  overflow-x: auto;
  white-space: nowrap;
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

.table-row {
  transition: background-color 0.3s ease;
}

img {
  max-width: 30px;
  height: auto;
  vertical-align: middle;
  margin-right: 8px;
}

.error {
  color: red;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
}

.loading {
  color: gray;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
}

@media screen and (max-width: 1200px) {
  .market-data-center,
  .quotes-section {
    padding: 1.5rem;
    margin: 1.5rem auto;
  }

  .headtitle {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .margin-box {
    padding: 0.75rem;
  }
}

@media screen and (max-width: 992px) {
  .market-data-center,
  .quotes-section {
    padding: 1.5rem;
    margin: 1.5rem auto;
  }

  .headtitle {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .margin-box {
    padding: 0.75rem;
  }
}

@media screen and (max-width: 768px) {
  .market-data-center,
  .quotes-section {
    padding: 1rem;
    margin: 1rem auto;
  }

  .headtitle {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.3rem;
  }

  .margin-box {
    padding: 0.5rem;
  }
}

@media screen and (max-width: 576px) {
  .market-data-center,
  .quotes-section {
    padding: 0.5rem;
    margin: 0.5rem auto;
  }

  .headtitle {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .margin-box {
    padding: 0.25rem;
  }
}
</style>
