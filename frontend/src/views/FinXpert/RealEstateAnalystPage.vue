<template>
  <div class="real-estate-analyst-page">
    <!-- Desktop Sidebar -->
    <RealEstateSidebar 
      v-if="!isMobile" 
      @view-changed="handleViewChange" 
    />
    
    <!-- Mobile Top Navigation -->
    <div v-if="isMobile" class="mobile-top-nav">
      <div class="mobile-nav-header">
        <font-awesome-icon icon="fa-solid fa-building-user" class="logo-icon" />
        <h2 class="mobile-title">FinXpert</h2>
        <button @click="toggleMobileNav" class="mobile-menu-toggle">
          <font-awesome-icon :icon="showMobileNav ? 'fa-times' : 'fa-bars'" />
        </button>
      </div>
      
      <!-- Mobile Navigation Slide -->
      <div class="mobile-nav-slider" :class="{ open: showMobileNav }">
        <div class="mobile-nav-items">
          <div 
            v-for="item in navItems" 
            :key="item.id"
            :class="{ active: activeView === item.id }"
            @click="handleMobileNavClick(item.id)"
            class="mobile-nav-item"
          >
            <font-awesome-icon :icon="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

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
import { 
  faSearch, faPlus, faBuildingUser, faBars, faTimes,
  faClipboardList, faChartPie, faMapMarkedAlt, 
  faExchangeAlt, faStickyNote
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faSearch, faPlus, faBuildingUser, faBars, faTimes,
  faClipboardList, faChartPie, faMapMarkedAlt, 
  faExchangeAlt, faStickyNote
);

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
      isMobile: false,
      showMobileNav: false,
      navItems: [
        { id: 'overview', label: 'Property Overview', icon: 'fa-solid fa-clipboard-list' },
        { id: 'valuation', label: 'Valuation', icon: 'fa-solid fa-chart-pie' },
        { id: 'map', label: 'Asset Map', icon: 'fa-solid fa-map-marked-alt' },
        { id: 'rent-vs-buy', label: 'Rent vs. Buy', icon: 'fa-solid fa-exchange-alt' },
        { id: 'notes', label: 'Notes & Storage', icon: 'fa-solid fa-sticky-note' },
      ],
    };
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
  methods: {
    handleViewChange(view) {
      this.activeView = view;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.showMobileNav = false;
      }
    },
    toggleMobileNav() {
      this.showMobileNav = !this.showMobileNav;
    },
    handleMobileNavClick(view) {
      this.activeView = view;
      this.showMobileNav = false;
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

/* Mobile Top Navigation */
.mobile-top-nav {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
  z-index: 1000;
}

.mobile-nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
}

.logo-icon {
  font-size: 1.5rem;
  color: #1a1a1a;
}

.mobile-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.mobile-menu-toggle {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #4b5563;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.mobile-menu-toggle:hover {
  background: #f3f4f6;
  color: #1a1a1a;
}

.mobile-nav-slider {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.mobile-nav-slider.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-nav-items {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-nav-item:hover {
  background: #f8f9fa;
  color: #1a1a1a;
}

.mobile-nav-item.active {
  background: linear-gradient(135deg, #000, #333);
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.mobile-nav-item svg {
  font-size: 1rem;
  width: 16px;
  text-align: center;
}

/* Enhanced Responsive Design */
@media (max-width: 1400px) {
  .content-area {
    padding: 1.75rem 2.5rem;
  }
  
  .page-header h1 {
    font-size: 2.25rem;
  }
  
  .header-controls {
    gap: 1.5rem;
  }
  
  .search-bar {
    max-width: 450px;
  }
}

@media (max-width: 1200px) {
  .content-area {
    padding: 1.5rem 2rem;
  }
  
  .page-header h1 {
    font-size: 2.1rem;
  }
  
  .header-controls {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
  }
  
  .search-bar {
    flex-grow: 1;
    min-width: 300px;
  }
  
  .add-property-btn {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 1024px) {
  .real-estate-analyst-page {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
  
  .content-area {
    padding: 1.5rem 2rem;
    overflow-y: visible;
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-bar {
    width: 100%;
    max-width: none;
    margin: 0;
  }
  
  .add-property-btn {
    width: 100%;
    justify-content: center;
  }
  
  .component-view {
    width: 100%;
    overflow-x: hidden;
  }
}

@media (max-width: 968px) {
  .content-area {
    padding: 1.25rem 1.5rem;
  }
  
  .page-header {
    margin-bottom: 1.75rem;
  }
  
  .page-header h1 {
    font-size: 1.875rem;
    margin-bottom: 0.5rem;
  }
  
  .search-bar {
    padding: 0.75rem 1.125rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
  
  .search-bar input {
    font-size: 16px; /* Prevent iOS zoom */
  }
  
  .add-property-btn {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
    min-height: 44px; /* Touch target minimum */
    border-radius: 10px;
  }
  
  /* Mobile navigation improvements */
  .mobile-nav-header {
    padding: 1rem 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .mobile-title {
    font-size: 1.25rem;
    font-weight: 700;
  }
  
  .mobile-menu-toggle {
    padding: 0.5rem;
    min-width: 44px;
    min-height: 44px;
  }
}

@media (max-width: 768px) {
  .real-estate-analyst-page {
    height: auto;
    min-height: 100vh;
    overflow-x: hidden;
  }
  
  .content-area {
    padding: 1rem 0.75rem;
    overflow-y: visible;
    overflow-x: hidden;
  }
  
  .page-header {
    margin-bottom: 1.5rem;
    padding: 0 0.25rem;
  }
  
  .page-header h1 {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    text-align: center;
    line-height: 1.2;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-bar {
    padding: 0.75rem 1rem;
    font-size: 16px; /* Prevent iOS zoom */
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .search-bar input {
    font-size: 16px;
  }
  
  .search-bar svg {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
  
  .add-property-btn {
    width: 100%;
    justify-content: center;
    padding: 0.875rem 1.5rem;
    font-size: 16px;
    border-radius: 10px;
    min-height: 44px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  /* Enhanced mobile navigation */
  .mobile-top-nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .mobile-nav-header {
    padding: 1rem 1.25rem;
  }
  
  .logo-icon {
    font-size: 1.5rem;
  }
  
  .mobile-title {
    font-size: 1.2rem;
    font-weight: 700;
  }
  
  .mobile-menu-toggle {
    background: none;
    border: none;
    font-size: 1.25rem;
    color: #4b5563;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .mobile-menu-toggle:hover {
    background: #f3f4f6;
    color: #1a1a1a;
  }
  
  .mobile-nav-slider {
    max-height: 70vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }
  
  .mobile-nav-items {
    padding: 1rem;
    gap: 0.5rem;
  }
  
  .mobile-nav-item {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
    min-height: 44px; /* Touch target minimum */
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .mobile-nav-item svg {
    font-size: 1.1rem;
    width: 18px;
  }
  
  .mobile-nav-item.active {
    background: linear-gradient(135deg, #000, #333);
    color: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  
  /* Component view optimization */
  .component-view {
    width: 100%;
    overflow-x: hidden;
    padding: 0.25rem;
  }
}

@media (max-width: 640px) {
  .content-area {
    padding: 0.875rem 0.5rem;
  }
  
  .page-header {
    padding: 0;
  }
  
  .page-header h1 {
    font-size: 1.625rem;
    margin-bottom: 0.5rem;
  }
  
  .search-bar {
    padding: 0.75rem 1rem;
    border-radius: 8px;
  }
  
  .add-property-btn {
    padding: 0.75rem 1.25rem;
    font-size: 16px;
    border-radius: 8px;
  }
  
  .mobile-nav-header {
    padding: 0.875rem 1rem;
  }
  
  .mobile-title {
    font-size: 1.125rem;
  }
  
  .mobile-nav-items {
    padding: 0.75rem;
    gap: 0.375rem;
  }
  
  .mobile-nav-item {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
  
  .component-view {
    padding: 0;
  }
}

@media (max-width: 480px) {
  .content-area {
    padding: 0.75rem 0.375rem;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .search-bar {
    padding: 0.75rem 1rem;
  }
  
  .search-bar input {
    font-size: 16px;
  }
  
  .add-property-btn {
    padding: 0.75rem 1rem;
    font-size: 16px;
  }
  
  .mobile-nav-header {
    padding: 0.875rem 1rem;
  }
  
  .mobile-title {
    font-size: 1.1rem;
  }
  
  .mobile-nav-items {
    padding: 0.75rem;
  }
  
  .mobile-nav-item {
    padding: 0.75rem;
    font-size: 0.9rem;
    min-height: 44px;
  }
}

@media (max-width: 320px) {
  .content-area {
    padding: 0.625rem 0.25rem;
  }
  
  .page-header h1 {
    font-size: 1.375rem;
  }
  
  .search-bar {
    padding: 0.625rem 0.875rem;
  }
  
  .add-property-btn {
    padding: 0.625rem 0.875rem;
    font-size: 16px;
  }
  
  .mobile-nav-header {
    padding: 0.75rem 0.875rem;
  }
  
  .mobile-title {
    font-size: 1rem;
  }
  
  .mobile-nav-item {
    padding: 0.625rem;
    font-size: 0.85rem;
    min-height: 44px;
  }
  
  .mobile-nav-item svg {
    font-size: 1rem;
    width: 16px;
  }
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  /* Prevent zoom on iOS */
  .search-bar input,
  .add-property-btn {
    font-size: 16px !important;
  }
  
  /* Enhanced touch targets */
  .mobile-nav-item,
  .add-property-btn,
  .mobile-menu-toggle {
    min-height: 44px;
    min-width: 44px;
  }
  
  /* Better focus states for mobile */
  .search-bar input:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  .mobile-nav-item:focus,
  .add-property-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  /* Optimize animations for mobile performance */
  .mobile-nav-slider {
    will-change: transform, opacity;
  }
  
  .mobile-nav-item:hover {
    background: #f8f9fa;
  }
  
  /* Ensure proper spacing for mobile */
  .page-header {
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  /* Prevent horizontal scroll */
  .real-estate-analyst-page,
  .content-area,
  .component-view {
    overflow-x: hidden;
  }
  
  /* Mobile navigation backdrop */
  .mobile-nav-slider.open::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }
}

/* Dark mode styles */
.dark-mode .real-estate-analyst-page {
  background-color: #1a1a1a;
  color: #e2e8f0;
}

.dark-mode .content-area {
  background-color: #1a1a1a;
}

.dark-mode .page-header h1 {
  color: #f8f9fa;
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

.dark-mode .add-property-btn {
  background: linear-gradient(135deg, #1a1a1a, #2d3748);
  border: 1px solid #4a5568;
}

.dark-mode .mobile-top-nav {
  background: #2d3748;
  border-bottom-color: #4a5568;
}

.dark-mode .mobile-title {
  color: #f8f9fa;
}

.dark-mode .mobile-nav-slider {
  background: #2d3748;
  border-bottom-color: #4a5568;
}

.dark-mode .mobile-nav-item {
  color: #e2e8f0;
}

.dark-mode .mobile-nav-item:hover {
  background: #374151;
  color: #f8f9fa;
}
</style> 