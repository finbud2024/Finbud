<template>
  <div class="calculators-wrapper fin-speak-page">
    <header class="fin-speak-hero-block unified-hero">
      <p class="fin-speak-eyebrow">{{ $t('finSpeak.slogan') }}</p>
      <h1 class="fin-speak-page-title">
        {{ activeTab === 'mortgage' ? $t('title') : $t('investmentTitle') }}
      </h1>
      <p class="fin-speak-lead">
        {{ activeTab === 'mortgage' ? $t('finSpeak.mortgageCalcLead') : $t('finSpeak.investmentCalcLead') }}
      </p>
    </header>

    <div class="tab-container">
      <div class="tabs">
        <button 
          :class="{ active: activeTab === 'mortgage' }" 
          @click="setTab('mortgage')"
        >
          <i class="fa-solid fa-house"></i>
          {{ $t('title') || 'Mortgage' }}
        </button>
        <button 
          :class="{ active: activeTab === 'investment' }" 
          @click="setTab('investment')"
        >
          <i class="fa-solid fa-chart-line"></i>
          {{ $t('investmentTitle') || 'Investment' }}
        </button>
      </div>
    </div>
    
    <div class="tab-content transition-wrapper">
      <MortgageCalculatorPage v-if="activeTab === 'mortgage'" class="embedded-page" />
      <InvestmentCalculatorPage v-if="activeTab === 'investment'" class="embedded-page" />
    </div>
  </div>
</template>

<script>
import MortgageCalculatorPage from './MortgageCalculatorPage.vue';
import InvestmentCalculatorPage from './InvestmentCalculatorPage.vue';

export default {
  name: 'CalculatorsPage',
  components: {
    MortgageCalculatorPage,
    InvestmentCalculatorPage
  },
  data() {
    return {
      activeTab: this.$route.query.tab === 'investment' ? 'investment' : 'mortgage'
    }
  },
  methods: {
    setTab(tab) {
      this.activeTab = tab;
      this.$router.replace({ query: { ...this.$route.query, tab } });
    }
  },
  watch: {
    '$route.query.tab'(newTab) {
      if (newTab === 'investment' || newTab === 'mortgage') {
        this.activeTab = newTab;
      }
    }
  }
}
</script>

<style scoped>
.calculators-wrapper {
  padding-top: 1rem;
  padding-bottom: 4rem;
  min-height: 100vh;
}

.unified-hero {
  margin-bottom: 2rem;
  animation: fadeIn 0.4s ease;
}

.tab-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 10;
  animation: fadeIn 0.5s ease;
}

.tabs {
  display: flex;
  background: var(--card-bg, #fff);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-color, #e8eaef);
  gap: 4px;
}

.tabs button {
  padding: 12px 30px;
  border: none;
  background: transparent;
  font-weight: 600;
  font-size: 1.05rem;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-secondary, #666);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs button i {
  font-size: 1.1rem;
}

.tabs button:hover:not(.active) {
  background: rgba(0,0,0,0.04);
}

.dark-mode .tabs button:hover:not(.active) {
  background: rgba(255,255,255,0.06);
}

.tabs button.active {
  background: var(--agent-button-bg-color, #000);
  color: var(--white-in-light-mode, #fff);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-1px);
}

.dark-mode .tabs button.active {
  background: var(--agent-button-bg-active-color, #fff);
  color: var(--black-in-dark-mode, #000);
}

.transition-wrapper {
  position: relative;
  animation: fadeIn 0.4s ease;
}

/* Hide the child components' native hero sections and background so they sit flush */
.embedded-page :deep(.fin-speak-hero-block) {
  display: none !important;
}

.embedded-page {
  box-shadow: none !important;
  background: transparent !important;
  padding-top: 0 !important;
  min-height: auto !important;
  animation: slideUp 0.4s ease;
}

/* Fix wrapper padding inside embedded components */
.embedded-page :deep(.mortgage-calc),
.embedded-page :deep(.calculator-container) {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .tabs button {
    padding: 10px 16px;
    font-size: 0.95rem;
  }
}
</style>
