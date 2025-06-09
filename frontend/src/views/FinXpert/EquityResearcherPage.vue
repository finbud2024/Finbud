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

/* Dark mode styles */
.dark-mode .equity-researcher-page {
  background-color: #1a1a1a;
  color: #e2e8f0;
}

.dark-mode .page-header {
  border-bottom-color: #374151;
}

.dark-mode .header-left h1 {
  color: #f8f9fa;
}

.dark-mode .header-left p {
  color: #9ca3af;
}

.dark-mode .search-bar {
  background: #2d3748;
  border-color: #4a5568;
}

.dark-mode .search-bar input {
  color: #e2e8f0;
}

.dark-mode .search-bar svg {
  color: #9ca3af;
}

.dark-mode .grid-item {
  background: #2d3748;
  border-color: #4a5568;
}

/* Enhanced Comprehensive Mobile Responsive Design - Fix Overflow Issues */
@media (max-width: 1400px) {
  .equity-researcher-page {
    padding: 1.75rem 2rem;
    overflow-x: hidden;
    max-width: 100%;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  
  .header-left {
    text-align: center;
  }
  
  .search-bar {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .grid-item.span-3 {
    grid-column: span 2;
  }
  
  .grid-item.span-2 {
    grid-column: span 2;
  }
  
  .grid-item.span-1 {
    grid-column: span 1;
  }
}

@media (max-width: 1200px) {
  .equity-researcher-page {
    padding: 1.5rem 1.5rem;
  }
  
  .header-left h1 {
    font-size: 2.25rem;
  }
  
  .header-left p {
    font-size: 1rem;
  }
  
  .search-bar {
    width: 100%;
    max-width: 350px;
    padding: 0.625rem 1rem;
  }
  
  .search-bar input {
    font-size: 0.95rem;
  }
  
  .dashboard-grid {
    gap: 1rem;
  }
  
  .grid-item {
    padding: 1.25rem;
  }
}

@media (max-width: 968px) {
  .equity-researcher-page {
    padding: 1.25rem 1rem;
    overflow-x: hidden;
    max-width: 100vw;
    box-sizing: border-box;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
    gap: 1.25rem;
  }
  
  .header-left {
    text-align: center;
  }
  
  .header-left h1 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  
  .header-left p {
    font-size: 0.95rem;
    margin-top: 0.5rem;
  }
  
  .search-bar {
    width: 100%;
    max-width: 100%;
    padding: 0.75rem 1rem;
    margin: 0;
    box-sizing: border-box;
  }
  
  .search-bar input {
    font-size: 16px; /* Prevent iOS zoom */
    width: 100%;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 100%;
  }
  
  .grid-item {
    grid-column: span 1 !important;
    padding: 1rem;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  
  .grid-item.span-1,
  .grid-item.span-2,
  .grid-item.span-3 {
    grid-column: span 1;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .equity-researcher-page {
    padding: 1rem 0.75rem;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  .page-header {
    margin-bottom: 1.25rem;
    gap: 1rem;
    padding: 0 0.25rem;
  }
  
  .header-left h1 {
    font-size: 1.75rem;
    line-height: 1.3;
    margin-bottom: 0.25rem;
  }
  
  .header-left p {
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }
  
  .search-bar {
    padding: 0.625rem 0.875rem;
    border-radius: 10px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }
  
  .search-bar svg {
    margin-right: 0.5rem;
    font-size: 0.9rem;
  }
  
  .search-bar input {
    font-size: 16px; /* Prevent iOS zoom */
    min-height: 24px;
  }
  
  .dashboard-grid {
    gap: 0.875rem;
    padding: 0;
  }
  
  .grid-item {
    padding: 0.875rem;
    border-radius: 12px;
    margin: 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
  
  .grid-item:hover {
    transform: none; /* Disable hover animations on mobile */
  }
}

@media (max-width: 640px) {
  .equity-researcher-page {
    padding: 0.875rem 0.5rem;
  }
  
  .page-header {
    margin-bottom: 1rem;
    gap: 0.875rem;
    padding: 0;
  }
  
  .header-left h1 {
    font-size: 1.5rem;
    line-height: 1.2;
  }
  
  .header-left p {
    font-size: 0.85rem;
  }
  
  .search-bar {
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
  }
  
  .search-bar input {
    font-size: 16px;
    min-height: 20px;
  }
  
  .dashboard-grid {
    gap: 0.75rem;
  }
  
  .grid-item {
    padding: 0.75rem;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .equity-researcher-page {
    padding: 0.75rem 0.375rem;
    overflow-x: hidden;
    max-width: 100vw;
  }
  
  .page-header {
    margin-bottom: 0.875rem;
    gap: 0.75rem;
  }
  
  .header-left h1 {
    font-size: 1.3rem;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }
  
  .header-left p {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  .search-bar {
    padding: 0.5rem 0.625rem;
    border-radius: 8px;
    width: 100%;
    max-width: 100%;
  }
  
  .search-bar svg {
    margin-right: 0.375rem;
    font-size: 0.85rem;
  }
  
  .search-bar input {
    font-size: 16px;
    min-height: 20px;
  }
  
  .dashboard-grid {
    gap: 0.625rem;
  }
  
  .grid-item {
    padding: 0.625rem;
    border-radius: 8px;
    margin: 0;
    width: 100%;
    max-width: 100%;
    overflow: hidden;
    box-sizing: border-box;
  }
}

@media (max-width: 320px) {
  .equity-researcher-page {
    padding: 0.5rem 0.25rem;
    overflow-x: hidden;
    max-width: 100vw;
  }
  
  .page-header {
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }
  
  .header-left h1 {
    font-size: 1.1rem;
    line-height: 1.2;
  }
  
  .header-left p {
    font-size: 0.75rem;
  }
  
  .search-bar {
    padding: 0.375rem 0.5rem;
    border-radius: 6px;
  }
  
  .search-bar input {
    font-size: 16px;
    min-height: 18px;
  }
  
  .dashboard-grid {
    gap: 0.5rem;
  }
  
  .grid-item {
    padding: 0.5rem;
    border-radius: 6px;
  }
}

/* Prevent horizontal scroll and ensure proper box-sizing */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.equity-researcher-page {
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
}

.page-header,
.dashboard-grid,
.grid-item,
.search-bar {
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Additional overflow prevention */
html,
body {
  overflow-x: hidden;
  max-width: 100%;
}

/* Enhanced touch targets for mobile */
@media (max-width: 768px) {
  .search-bar {
    min-height: 44px; /* Touch target minimum */
    width: 100%;
    max-width: 100%;
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    box-sizing: border-box;
  }
  
  .search-bar input {
    min-height: 44px;
    font-size: 16px !important; /* Prevent iOS zoom */
    flex: 1;
    width: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
  }
  
  .search-bar svg {
    flex-shrink: 0;
    margin-right: 0.75rem;
  }
  
  /* Better focus states for accessibility */
  .search-bar:focus-within {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    border-color: rgba(59, 130, 246, 0.5);
  }
  
  .search-bar input:focus {
    outline: none;
  }
  
  /* Prevent input zoom on iOS */
  .search-bar input::placeholder {
    font-size: 16px;
    color: #9ca3af;
  }
}

/* Dark mode responsive adjustments */
.dark-mode .equity-researcher-page {
  background-color: #1a1a1a;
  color: #e2e8f0;
}

.dark-mode .search-bar {
  background: #2d3748;
  border-color: #4a5568;
}

.dark-mode .search-bar input {
  color: #e2e8f0;
}

.dark-mode .grid-item {
  background: #2d3748;
  border-color: #4a5568;
}

/* Ensure grid items don't overflow on any screen size */
@media (max-width: 968px) {
  .dashboard-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .grid-item {
    width: 100% !important;
    max-width: 100% !important;
    flex: none;
    grid-column: unset !important;
  }
}

/* Additional mobile optimizations */
@media (max-width: 768px) {
  /* Optimize animations for mobile performance */
  .grid-item {
    transition: none; /* Disable transitions on mobile for better performance */
  }
  
  /* Improve spacing for mobile */
  .page-header {
    text-align: center;
  }
  
  /* Better mobile typography */
  .header-left h1 {
    font-weight: 700; /* Slightly lighter for mobile readability */
  }
  
  .header-left p {
    line-height: 1.4;
  }
}
</style> 