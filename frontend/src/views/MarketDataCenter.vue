<template>
  <MarketHeader />
  <h1 class="headtitle">Market Data Center</h1>
  <div class="market-data-center">
    <div class="market-section">
      <CryptoWatch />
      <!--<NewsSection />-->
    </div>
  </div>
</template>

<script>

import MarketHeader from '../components/MarketHeader.vue';
import NewsSection from '../components/NewsSection.vue'; 
import CryptoWatch from '@/components/CryptoWatch.vue';


export default {
  name: 'MarketDataCenter',
  components: {
    MarketHeader,
    NewsSection,
    CryptoWatch,
},
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
  color: black;
  gap: 1rem;
  padding: 1rem;
}
</style>
