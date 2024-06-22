<template>
  <div>
    <!--<MarketHeader />-->
    <h1 class="headtitle">Market Data Center</h1>
    <div class="market-data-center"> 
      <div class="market-section">
        <div class="section-title">CRYPTOCURRENCY</div>
        <CryptoWatch class="CryptoArea" />
        <div class="section-title">STOCK</div>
        <StockWatch class="StockArea" />
        <div class="section-title">REAL ESTATE</div>
        <RealEstateMap class="RealEstate" />
      </div>
    </div>
    <NewsSection :disableClicks="showPopup" />
  </div>
</template>

<script>
//import MarketHeader from '../components/MarketHeader.vue';
import NewsSection from '../components/NewsSection.vue';
import CryptoWatch from '@/components/CryptoWatch.vue';
import StockWatch from '@/components/StockWatch.vue';
import RealEstateMap from '@/components/RealEstateMap.vue'; 

export default {
  name: 'MarketDataCenter',
  components: {
    //MarketHeader,
    NewsSection,
    CryptoWatch,
    StockWatch,
    RealEstateMap
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&display=swap');

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  background-color: #f0f2f5;
  margin: 0;
  padding: 0;
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

.headtitle {
  text-align: center;
  color: #333;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.market-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-weight: bold;
  color: #007bff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.CryptoArea, .StockArea, .RealEstate {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

/* Responsive design */
@media (max-width: 1200px) {
  .market-data-center {
    padding: 1.5rem;
    margin: 1.5rem auto;
  }

  .headtitle {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .CryptoArea, .StockArea, .RealEstate {
    padding: 0.75rem;
  }
}

@media (max-width: 768px) {
  .market-data-center {
    padding: 1rem;
    margin: 1rem auto;
  }

  .headtitle {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .CryptoArea, .StockArea, .RealEstate {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .market-data-center {
    padding: 0.5rem;
    margin: 0.5rem auto;
  }

  .headtitle {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 0.875rem;
  }

  .CryptoArea, .StockArea, .RealEstate {
    padding: 0.25rem;
  }
}
</style>
