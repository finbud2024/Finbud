<template>
  <div class="wrap-recommend">
    <div class="content">
      <div class="header-recommend">
        <h1>Get Similar Stocks</h1>
        <h2>Enter a Stock Symbol to Generate Recommendations. Reset before Searching Again.</h2>
      </div>
      <div class="bar">
        <input
          class="searchbar"
          type="text"
          placeholder="i.e. AAPL"
          v-model="query"
        />
      </div>
      <div class="buttons">
        <button
          class="button"
          @click="handleSearch"
          :disabled="searching"
        >
          Find Similar Stocks
        </button>
        <button class="button" @click="reset">
          Reset and Search Again
        </button>
      </div>
    </div>
    <div v-if="count !== 5" class="recommend-warning">
      <div class="warning">
        <h3>
          If you see no result, you may have entered an invalid stock symbol
        </h3>
      </div>
      <div class="wrapper">
        <div class="pie spinner"></div>
        <div class="pie filler"></div>
        <div class="mask"></div>
      </div>
    </div>
    <div class="company-container">
      <div>
        <h1 v-if="searchedStocks && similarStocks && count === 5">
          We found 5 alternatives
        </h1>
        <CompanyCard
          v-for="stock in similarStocks"
          :key="stock.symbol"
          :companyName="stock.symbol"
          :width="800"
        />
      </div>
      <div>
        <h1 v-if="similarStocks && searchedStocks && count === 5">
          You searched for:
        </h1>
        <SmallCompanyCard
          v-if="similarStocks && searchedStocks && count === 5"
          :companyName="searchedStocks"
          :width="500"
        />
        <TechAnalysis
          v-if="similarStocks && searchedStocks && count === 5"
          :companyName="searchedStocks"
          :width="500"
        />
      </div>
    </div>
    <div class="additional-info" v-if="similarStocks && searchedStocks && count === 5">
      <h2>Additional Information</h2>
      <div class="info-grid">
        <div class="info-item" v-for="(info, index) in additionalInfo" :key="index">
          <h3>{{ info.title }}</h3>
          <p>{{ info.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CompanyCard from '@/components/CompanyCard.vue';
import SmallCompanyCard from '@/components/dashboard/SmallCompanyCard.vue';
import TechAnalysis from '@/components/dashboard/TechAnalysis.vue';

export default {
  name: 'RecommendationGenerator',
  components: {
    CompanyCard,
    SmallCompanyCard,
    TechAnalysis,
  },
  data() {
    return {
      query: '',
      similarStocks: [],
      searchedStocks: '',
      searching: false,
      count: 0,
      additionalInfo: [
        { title: 'Market Trends', description: 'Latest market trends and insights.' },
        { title: 'Investment Tips', description: 'Top tips for successful stock investments.' },
        { title: 'Risk Analysis', description: 'Understand the risks involved with similar stocks.' },
      ],
    };
  },
    methods: {
    async searchSimilarStocks() {
        const url = `https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-recommendations?symbol=${this.query}`;
        try {
        const res = await axios.get(url, {
            headers: {
            'x-rapidapi-key': 'a48948c3dbmsh0752220de3da440p119094jsnf7916aa82678',
            'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
            },
        });
        this.similarStocks = res.data.finance.result[0].quotes;
        this.count = res.data.finance.result[0].count;
        } catch (err) {
        console.log(err);
        }
    },
    handleSearch() {
      this.searching = true;
      this.searchedStocks = this.query;
      this.searchSimilarStocks();
    },
    reset() {
      this.searching = false;
      this.searchedStocks = '';
      this.similarStocks = [];
      this.query = '';
      this.count = 0;
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap');

.wrap-recommend {
  background-color: white;
  color: #1e06fb;
  font-family: 'Space Grotesk', sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}

.header-recommend h1,
.header-recommend h2 {
  text-align: center;
  margin: 10px 0;
}

.bar {
  margin: 20px auto;
  width: 100%;
  max-width: 800px;
  border-radius: 40px;
  border: 1px solid #dcdcdc;
  background: white;
  transition: box-shadow 0.3s;
}

.bar:hover,
.bar:focus-within {
  box-shadow: 1px 1px 8px 1px #dcdcdc;
}

.searchbar {
  height: 60px;
  border: none;
  width: calc(100% - 60px);
  font-size: 18px;
  outline: none;
  margin: 0 30px;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.button {
  background-color: #1e06fb;
  border: none;
  color: white;
  font-size: 15px;
  padding: 12px 20px;
  margin: 5px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.button:hover {
  background-color: #0d04a7;
  transform: translateY(-3px);
}

.button[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}

.recommend-warning {
  text-align: center;
  margin-top: 20px;
}

.wrapper {
  position: relative;
  margin: 40px auto;
  background: white;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  overflow: hidden;
}

.wrapper .pie {
  width: 50%;
  height: 100%;
  transform-origin: 100% 50%;
  position: absolute;
  background: #1e06fb;
}

.wrapper .spinner {
  border-radius: 100% 0 0 100% / 50% 0 0 50%;
  z-index: 200;
  border-right: none;
  animation: rota 5s linear infinite;
}

.wrapper:hover .spinner,
.wrapper:hover .filler,
.wrapper:hover .mask {
  animation-play-state: running;
}

.wrapper .filler {
  border-radius: 0 100% 100% 0 / 0 50% 50% 0;
  left: 50%;
  opacity: 0;
  z-index: 100;
  animation: opa 5s steps(1, end) infinite reverse;
  border-left: none;
}

.wrapper .mask {
  width: 50%;
  height: 100%;
  position: absolute;
  background: inherit;
  opacity: 1;
  z-index: 300;
  animation: opa 5s steps(1, end) infinite;
}

@keyframes rota {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes opa {
  0% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.company-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 20px;
}

.company-container h1 {
  width: 100%;
  text-align: center;
}

.additional-info {
  margin-top: 40px;
  text-align: center;
}

.additional-info h2 {
  color: #1e06fb;
  margin-bottom: 20px;
}

.info-grid {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.info-item {
  background-color: #f0f0f0;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  margin: 10px;
  padding: 20px;
  width: 250px;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.1);
}

.info-item h3 {
  color: #1e06fb;
}

/* Media queries for responsiveness */
@media (max-width: 768px) {
  .bar {
    width: 90%;
  }

  .searchbar {
    width: calc(100% - 40px);
    margin: 0 20px;
  }

  .buttons {
    flex-direction: column;
  }

  .button {
    width: 100%;
    margin: 10px 0;
  }

  .company-container {
    flex-direction: column;
    align-items: center;
  }
}
</style>
