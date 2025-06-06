<template>
  <div class="equity-researcher-page">
    <div class="page-header">
      <div class="header-left">
        <h1>Equity Research Dashboard</h1>
        <p>Analyze stocks like a professional.</p>
      </div>
      <div class="header-right">
        <div class="search-bar">
          <font-awesome-icon icon="fa-solid fa-search" />
          <input type="text" v-model="ticker" @keyup.enter="fetchStockData" placeholder="Enter stock ticker (e.g., AAPL)...">
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="grid-item span-2">
        <CompanySnapshot />
      </div>
      <div class="grid-item span-1">
        <AnalystConsensus />
      </div>
      <div class="grid-item span-3">
        <FinancialOverview />
      </div>
      <div class="grid-item span-2">
        <ValuationModels />
      </div>
      <div class="grid-item span-1">
        <EarningsCalendar />
      </div>
      <div class="grid-item span-3">
        <ResearchNotes />
      </div>
    </div>
  </div>
</template>

<script>
import CompanySnapshot from '@/components/FinXpert/Equity/CompanySnapshot.vue';
import FinancialOverview from '@/components/FinXpert/Equity/FinancialOverview.vue';
import ValuationModels from '@/components/FinXpert/Equity/ValuationModels.vue';
import AnalystConsensus from '@/components/FinXpert/Equity/AnalystConsensus.vue';
import ResearchNotes from '@/components/FinXpert/Equity/ResearchNotes.vue';
import EarningsCalendar from '@/components/FinXpert/Equity/EarningsCalendar.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch);

export default {
  name: 'EquityResearcherPage',
  components: {
    CompanySnapshot,
    FinancialOverview,
    ValuationModels,
    AnalystConsensus,
    ResearchNotes,
    EarningsCalendar,
    FontAwesomeIcon,
  },
  data() {
    return {
      ticker: 'AAPL', // Default ticker
    };
  },
  methods: {
    fetchStockData() {
      console.log(`Fetching data for ${this.ticker}...`);
      // This is where you would typically call an API
      // and pass the data to child components via props or a store.
    }
  },
  mounted() {
    this.fetchStockData();
  }
};
</script>

<style scoped>
.equity-researcher-page {
  padding: 2rem 3rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  color: #1a1a1a;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
}
.header-left p {
  font-size: 1.1rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  width: 350px;
}
.search-bar svg { color: #9ca3af; margin-right: 0.75rem; }
.search-bar input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.grid-item {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
}

.grid-item.span-1 { grid-column: span 1; }
.grid-item.span-2 { grid-column: span 2; }
.grid-item.span-3 { grid-column: span 3; }
</style> 