<template>
  <section class="content fin-speak-page">
    <div>
      <header class="fin-speak-hero-block">
        <p class="fin-speak-eyebrow">{{ $t('finSpeak.slogan') }}</p>
        <h1 class="fin-speak-page-title headtitle">{{ $t('marketDataCenter.title') }}</h1>
        <p class="fin-speak-lead">{{ $t('finSpeak.marketDataLead') }}</p>
      </header>
      <div class="market-data-center"> 
        <div class="market-section">
          <div class="section-title">{{ $t('marketDataCenter.sections.crypto').toUpperCase() }}</div>
          <div class="margin-box">
            <CryptoWatch class="margin-box-content" />
          </div>
          <div class="section-title">{{ $t('marketDataCenter.sections.stocks').toUpperCase() }}</div>
          <div class="margin-box">
            <StockWatch class="margin-box-content" />
          </div>
          <div class="section-title">{{ $t('marketDataCenter.sections.realEstate').toUpperCase() }}</div>
          <RealEstateMap class="margin-box" />
        </div>
      </div>
      <NewsSection :disableClicks="showPopup" />
    </div>
</section>
</template>


<script>
import NewsSection from '@/components/MarketPage/NewsSection.vue';
import CryptoWatch from '@/components/MarketPage/CryptoWatch.vue';
import StockWatch from '@/components/MarketPage/StockWatch.vue';
import RealEstateMap from '@/components/MarketPage/RealEstateMap.vue'; 

export default {
  name: 'MarketDataCenter',
  components: {
    NewsSection,
    CryptoWatch,
    StockWatch,
    RealEstateMap
  },
};
</script>

<style scoped>


/*.content{
}*/

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
  margin-bottom: 0.35rem;
}

.market-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-weight: bold;
  color: #000;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #000000;
  padding-bottom: 0.5rem;
}

.dark-mode .headtitle {
  color: inherit;
}

.dark-mode .section-title {
  color: #0f172a;
  border-bottom-color: var(--fin-speak-accent, #34d399);
}

.margin-box {
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  position: relative; /* Added to allow content alignment */
}

.margin-box-content {
  margin-right: 40px; /* Align content 10px from the left */
}

/* Responsive design */
@media (max-width: 1200px) {
  .market-data-center {
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

@media (max-width: 992px) {
  .market-data-center {
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

@media (max-width: 768px) {
  .market-data-center {
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

@media (max-width: 576px) {
  .market-data-center {
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

/* Dark mode styles */
.dark-mode .content {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #f9fafb;
  min-height: 100vh;
}

.dark-mode .market-data-center {
  background: #374151;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.dark-mode .headtitle {
  color: #f9fafb;
}

.dark-mode .section-title {
  color: #f9fafb;
  border-bottom-color: #f9fafb;
}

.dark-mode .margin-box {
  background: #4b5563;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
