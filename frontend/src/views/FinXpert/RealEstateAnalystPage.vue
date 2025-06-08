<template>
  <div class="real-estate-analyst-page">
    <RealEstateSidebar @view-changed="handleViewChange" />
    <main class="content-area">
      <header class="page-header">
        <h1>Real Estate Investment Analyst</h1>
        <div class="header-controls">
          <div class="search-bar">
            <font-awesome-icon icon="fa-solid fa-search" />
            <input type="text" placeholder="Search for a property, area, or city...">
          </div>
          <button class="add-property-btn">
            <font-awesome-icon icon="fa-solid fa-plus" />
            Add Property
          </button>
        </div>
      </header>
      
      <div class="component-view">
        <PropertyOverview v-if="activeView === 'overview'" />
        <ValuationPanel v-if="activeView === 'valuation'" />
        <AssetMap v-if="activeView === 'map'" />
        <RentBuyCalculator v-if="activeView === 'rent-vs-buy'" />
        <NotesSection v-if="activeView === 'notes'" />
      </div>
    </main>
  </div>
</template>

<script>
import RealEstateSidebar from '@/components/FinXpert/RealEstate/RealEstateSidebar.vue';
import PropertyOverview from '@/components/FinXpert/RealEstate/PropertyOverview.vue';
import ValuationPanel from '@/components/FinXpert/RealEstate/ValuationPanel.vue';
import AssetMap from '@/components/FinXpert/RealEstate/AssetMap.vue';
import RentBuyCalculator from '@/components/FinXpert/RealEstate/RentBuyCalculator.vue';
import NotesSection from '@/components/FinXpert/RealEstate/NotesSection.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

library.add(faSearch, faPlus);

export default {
  name: 'RealEstateAnalystPage',
  components: {
    RealEstateSidebar,
    PropertyOverview,
    ValuationPanel,
    AssetMap,
    RentBuyCalculator,
    NotesSection,
    FontAwesomeIcon,
  },
  data() {
    return {
      activeView: 'overview',
    };
  },
  methods: {
    handleViewChange(view) {
      this.activeView = view;
    }
  }
};
</script>

<style scoped>
.real-estate-analyst-page {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
  color: #1a1a1a;
  overflow: hidden;
}

.content-area {
  flex-grow: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  flex-grow: 1;
  border: 1px solid #e5e7eb;
}

.search-bar svg {
  color: #9ca3af;
  margin-right: 0.75rem;
}

.search-bar input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
}

.add-property-btn {
  background: linear-gradient(135deg, #000, #333);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.add-property-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.3);
}

.component-view {
  flex-grow: 1;
}
</style> 