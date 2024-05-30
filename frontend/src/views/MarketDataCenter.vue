<template>
  <MarketHeader />
  <h1 class="headtitle">Market Data Center</h1>
  <div class="market-data-center">
    <div class="market-section">
      <!-- <MarketIndex title="U.S." :indexes="usIndexes" />
      <MarketIndex title="Europe" :indexes="europeIndexes" />
      <MarketIndex title="Asia" :indexes="asiaIndexes" />
      <CurrencyRate :currencies="currencies" /> -->
      <CryptoMarket />
      <!--<StockList />-->
      <NewsSection /> <!-- Use the renamed component here -->
    </div>
  </div>
</template>

<script>
// import MarketIndex from '../components/MarketIndex.vue';
// import CurrencyRate from '../components/CurrencyRate.vue';
import MarketHeader from '../components/MarketHeader.vue';
import CryptoMarket from '../components/CryptoMarket.vue'; // Import the CryptoMarket component
import NewsSection from '../components/NewsSection.vue'; // Import the renamed component
//import StockList from '../components/StockList.vue';

export default {
  name: 'MarketDataCenter',
  components: {
    MarketHeader,
    // MarketIndex,
    // CurrencyRate,
    CryptoMarket, // Register the CryptoMarket component
    NewsSection,
    //StockList // Register the renamed component
  },
  data() {
    return {
      usIndexes: [
        { name: 'DJIA', value: 38852.86, change: -216.73, percentage: -0.55 },
        { name: 'COMP', value: 17019.88, change: 99.09, percentage: 0.59 },
        { name: 'SPX', value: 5306.04, change: 1.32, percentage: 0.02 },
        { name: 'GDOW', value: 4696.80, change: -32.04, percentage: -0.68 },
      ],
      europeIndexes: [
        { name: 'FTSE 100', value: 8224.35, change: -29.83, percentage: -0.36 },
      ],
      asiaIndexes: [
        { name: 'XX: ADOW', value: 3949.51, change: -66.33, percentage: -1.65 },
      ],
      currencies: [
        { name: 'Euro', value: 1.0846, change: -0.0010, percentage: -0.09 },
      ]
    };
  }
};
</script>

<style scoped>
.market-data-center {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.headtitle {
  display: flex;
  color: rgb(23, 125, 165);
  gap: 1rem;
  padding: 1rem;
}
</style>
