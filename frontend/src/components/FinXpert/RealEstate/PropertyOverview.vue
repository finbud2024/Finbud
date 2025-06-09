<template>
  <div class="property-overview">
    <!-- Overview Stats -->
    <div class="overview-stats">
      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-home" />
        </div>
        <div class="stat-content">
          <h3>{{ totalProperties }}</h3>
          <p>Total Properties</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-dollar-sign" />
        </div>
        <div class="stat-content">
          <h3>${{ formatNumber(totalValue) }}</h3>
          <p>Portfolio Value</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-chart-line" />
        </div>
        <div class="stat-content">
          <h3>{{ avgROI }}%</h3>
          <p>Average ROI</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">
          <font-awesome-icon icon="fa-solid fa-calendar" />
        </div>
        <div class="stat-content">
          <h3>${{ formatNumber(monthlyIncome) }}</h3>
          <p>Monthly Income</p>
        </div>
      </div>
    </div>

    <!-- Filters and Controls -->
    <div class="controls-section">
      <div class="filter-group">
        <select v-model="selectedFilter" @change="applyFilter">
          <option value="all">All Properties</option>
          <option value="residential">Residential</option>
          <option value="commercial">Commercial</option>
          <option value="rental">Rental</option>
          <option value="investment">Investment</option>
        </select>
        <select v-model="sortBy" @change="applySorting">
          <option value="price">Sort by Price</option>
          <option value="roi">Sort by ROI</option>
          <option value="location">Sort by Location</option>
          <option value="date">Sort by Date Added</option>
        </select>
      </div>
      <div class="view-toggle">
        <button 
          :class="{ active: viewMode === 'grid' }" 
          @click="viewMode = 'grid'"
        >
          <font-awesome-icon icon="fa-solid fa-th" />
        </button>
        <button 
          :class="{ active: viewMode === 'list' }" 
          @click="viewMode = 'list'"
        >
          <font-awesome-icon icon="fa-solid fa-list" />
        </button>
      </div>
    </div>

    <!-- Properties Display -->
    <div class="properties-container" :class="viewMode">
      <div 
        v-for="property in filteredProperties" 
        :key="property.id" 
        class="property-card"
        @click="selectProperty(property)"
        :class="{ selected: selectedProperty?.id === property.id }"
      >
        <div class="property-image">
          <img :src="property.image" :alt="property.title" />
          <div class="property-status" :class="property.status.toLowerCase().replace(' ', '-')">
            {{ property.status }}
          </div>
          <div class="property-type">{{ property.type }}</div>
        </div>
        
        <div class="property-details">
          <h3 class="property-title">{{ property.title }}</h3>
          <p class="property-location">
            <font-awesome-icon icon="fa-solid fa-map-marker-alt" />
            {{ property.location }}
          </p>
          
          <div class="property-specs">
            <span class="spec">
              <font-awesome-icon icon="fa-solid fa-bed" />
              {{ property.bedrooms }} bed
            </span>
            <span class="spec">
              <font-awesome-icon icon="fa-solid fa-bath" />
              {{ property.bathrooms }} bath
            </span>
            <span class="spec">
              <font-awesome-icon icon="fa-solid fa-ruler-combined" />
              {{ property.sqft }} sqft
            </span>
          </div>

          <div class="property-financials">
            <div class="price">
              <span class="current-price">${{ formatNumber(property.currentValue) }}</span>
              <span class="price-change" :class="property.priceChange >= 0 ? 'positive' : 'negative'">
                {{ property.priceChange >= 0 ? '+' : '' }}{{ property.priceChange }}%
              </span>
            </div>
            <div class="roi">
              <span class="roi-label">ROI:</span>
              <span class="roi-value" :class="property.roi >= 0 ? 'positive' : 'negative'">
                {{ property.roi }}%
              </span>
            </div>
          </div>

          <div class="property-metrics">
            <div class="metric">
              <span class="metric-label">Purchase:</span>
              <span class="metric-value">${{ formatNumber(property.purchasePrice) }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Monthly Rent:</span>
              <span class="metric-value">${{ formatNumber(property.monthlyRent) }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Cap Rate:</span>
              <span class="metric-value">{{ property.capRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Property Detail Modal -->
    <div v-if="selectedProperty" class="property-modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
        
        <div class="modal-header">
          <h2>{{ selectedProperty.title }}</h2>
          <div class="property-tags">
            <span class="tag" :class="selectedProperty.status.toLowerCase().replace(' ', '-')">
              {{ selectedProperty.status }}
            </span>
            <span class="tag type">{{ selectedProperty.type }}</span>
          </div>
        </div>

        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedProperty.image" :alt="selectedProperty.title" />
          </div>
          
          <div class="property-details-full">
            <div class="detail-section">
              <h4>Property Information</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span>Location:</span>
                  <span>{{ selectedProperty.location }}</span>
                </div>
                <div class="detail-item">
                  <span>Year Built:</span>
                  <span>{{ selectedProperty.yearBuilt }}</span>
                </div>
                <div class="detail-item">
                  <span>Lot Size:</span>
                  <span>{{ selectedProperty.lotSize }} sqft</span>
                </div>
                <div class="detail-item">
                  <span>Property ID:</span>
                  <span>{{ selectedProperty.id }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h4>Financial Overview</h4>
              <div class="financial-chart">
                <canvas ref="roiChart" width="400" height="200"></canvas>
              </div>
            </div>

            <div class="detail-section">
              <h4>Investment Analysis</h4>
              <div class="analysis-grid">
                <div class="analysis-item">
                  <span>Cash-on-Cash Return:</span>
                  <span class="value positive">{{ selectedProperty.cashOnCash }}%</span>
                </div>
                <div class="analysis-item">
                  <span>Debt Service Coverage:</span>
                  <span class="value">{{ selectedProperty.dscr }}x</span>
                </div>
                <div class="analysis-item">
                  <span>Price per sqft:</span>
                  <span class="value">${{ Math.round(selectedProperty.currentValue / selectedProperty.sqft) }}</span>
                </div>
                <div class="analysis-item">
                  <span>Annual Appreciation:</span>
                  <span class="value positive">{{ selectedProperty.appreciation }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faHome, faDollarSign, faChartLine, faCalendar,
  faTh, faList, faBed, faBath, faRulerCombined,
  faMapMarkerAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faHome, faDollarSign, faChartLine, faCalendar,
  faTh, faList, faBed, faBath, faRulerCombined,
  faMapMarkerAlt, faTimes
);

export default {
  name: 'PropertyOverview',
  components: { FontAwesomeIcon },
  data() {
    return {
      viewMode: 'grid',
      selectedFilter: 'all',
      sortBy: 'price',
      selectedProperty: null,
      properties: [
        {
          id: 'RE001',
          title: 'Modern Downtown Condo',
          location: 'San Francisco, CA',
          type: 'Residential',
          status: 'Owned',
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
          bedrooms: 2,
          bathrooms: 2,
          sqft: 1200,
          yearBuilt: 2018,
          lotSize: 0,
          purchasePrice: 850000,
          currentValue: 920000,
          monthlyRent: 4500,
          priceChange: 8.2,
          roi: 12.5,
          capRate: 5.8,
          cashOnCash: 11.2,
          dscr: 1.4,
          appreciation: 3.5
        },
        {
          id: 'RE002',
          title: 'Suburban Family Home',
          location: 'Austin, TX',
          type: 'Residential',
          status: 'Investment',
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2500,
          yearBuilt: 2015,
          lotSize: 8000,
          purchasePrice: 450000,
          currentValue: 520000,
          monthlyRent: 2800,
          priceChange: 15.6,
          roi: 18.7,
          capRate: 6.5,
          cashOnCash: 15.3,
          dscr: 1.8,
          appreciation: 4.2
        },
        {
          id: 'RE003',
          title: 'Commercial Office Space',
          location: 'Seattle, WA',
          type: 'Commercial',
          status: 'Under Contract',
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
          bedrooms: 0,
          bathrooms: 4,
          sqft: 5000,
          yearBuilt: 2010,
          lotSize: 12000,
          purchasePrice: 1200000,
          currentValue: 1350000,
          monthlyRent: 8500,
          priceChange: 12.5,
          roi: 9.8,
          capRate: 7.6,
          cashOnCash: 8.9,
          dscr: 1.6,
          appreciation: 2.8
        },
        {
          id: 'RE004',
          title: 'Beachfront Villa',
          location: 'Miami, FL',
          type: 'Luxury',
          status: 'For Sale',
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
          bedrooms: 5,
          bathrooms: 4,
          sqft: 3500,
          yearBuilt: 2020,
          lotSize: 15000,
          purchasePrice: 2200000,
          currentValue: 2450000,
          monthlyRent: 12000,
          priceChange: 11.4,
          roi: 7.2,
          capRate: 5.9,
          cashOnCash: 6.8,
          dscr: 1.2,
          appreciation: 3.1
        }
      ]
    };
  },
  computed: {
    filteredProperties() {
      let filtered = this.properties;
      
      if (this.selectedFilter !== 'all') {
        filtered = filtered.filter(property => 
          property.type.toLowerCase().includes(this.selectedFilter.toLowerCase()) ||
          property.status.toLowerCase().includes(this.selectedFilter.toLowerCase())
        );
      }
      
      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'price':
            return b.currentValue - a.currentValue;
          case 'roi':
            return b.roi - a.roi;
          case 'location':
            return a.location.localeCompare(b.location);
          default:
            return 0;
        }
      });
      
      return filtered;
    },
    totalProperties() {
      return this.properties.length;
    },
    totalValue() {
      return this.properties.reduce((sum, prop) => sum + prop.currentValue, 0);
    },
    avgROI() {
      return Math.round(this.properties.reduce((sum, prop) => sum + prop.roi, 0) / this.properties.length * 10) / 10;
    },
    monthlyIncome() {
      return this.properties.reduce((sum, prop) => sum + prop.monthlyRent, 0);
    }
  },
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('en-US').format(num);
    },
    applyFilter() {
      // Filter logic is handled in computed property
    },
    applySorting() {
      // Sorting logic is handled in computed property
    },
    selectProperty(property) {
      this.selectedProperty = property;
      this.$nextTick(() => {
        this.drawROIChart();
      });
    },
    closeModal() {
      this.selectedProperty = null;
    },
    drawROIChart() {
      if (!this.$refs.roiChart) return;
      
      const canvas = this.$refs.roiChart;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Simple line chart showing ROI trend
      const data = [8.5, 9.2, 10.1, 11.3, 12.5]; // Sample ROI progression
      const labels = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
      
      // Chart dimensions
      const padding = 40;
      const chartWidth = canvas.width - 2 * padding;
      const chartHeight = canvas.height - 2 * padding;
      
      // Draw axes
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      
      // Y-axis
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, canvas.height - padding);
      ctx.stroke();
      
      // X-axis
      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.stroke();
      
      // Draw data line
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const maxROI = Math.max(...data);
      const minROI = Math.min(...data);
      const roiRange = maxROI - minROI;
      
      data.forEach((roi, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = canvas.height - padding - ((roi - minROI) / roiRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      // Draw data points
      ctx.fillStyle = '#000000';
      data.forEach((roi, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = canvas.height - padding - ((roi - minROI) / roiRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
      
      // Add labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      
      labels.forEach((label, index) => {
        const x = padding + (index / (labels.length - 1)) * chartWidth;
        ctx.fillText(label, x, canvas.height - 10);
      });
    }
  }
};
</script>

<style scoped>
.property-overview {
  padding: 0;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #000000, #333333);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.stat-content h3 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: #1a1a1a;
}

.stat-content p {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

.controls-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-group select {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-toggle button {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-toggle button.active,
.view-toggle button:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

.properties-container {
  display: grid;
  gap: 1.5rem;
}

.properties-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
}

.properties-container.list {
  grid-template-columns: 1fr;
}

.property-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.property-card.selected {
  border-color: #000000;
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.property-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-status {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.property-status.owned { background: #10b981; color: white; }
.property-status.investment { background: #3b82f6; color: white; }
.property-status.under-contract { background: #f59e0b; color: white; }
.property-status.for-sale { background: #ef4444; color: white; }

.property-type {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.property-details {
  padding: 1.5rem;
}

.property-title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.property-specs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.spec {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.85rem;
}

.property-financials {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

.price-change {
  font-size: 0.9rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

.price-change.positive { color: #10b981; }
.price-change.negative { color: #ef4444; }

.roi-label {
  color: #6b7280;
  font-size: 0.9rem;
}

.roi-value {
  font-weight: 700;
  font-size: 1.1rem;
  margin-left: 0.5rem;
}

.roi-value.positive { color: #10b981; }
.roi-value.negative { color: #ef4444; }

.property-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.8rem;
  color: #6b7280;
}

.metric-value {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.9rem;
}

/* Modal Styles */
.property-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0,0,0,0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-header {
  padding: 2rem 2rem 1rem 2rem;
}

.modal-header h2 {
  margin: 0 0 1rem 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.property-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.tag.owned { background: #10b981; color: white; }
.tag.investment { background: #3b82f6; color: white; }
.tag.under-contract { background: #f59e0b; color: white; }
.tag.for-sale { background: #ef4444; color: white; }
.tag.type { background: #6b7280; color: white; }

.modal-body {
  padding: 0 2rem 2rem 2rem;
}

.modal-image {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.detail-item span:first-child {
  color: #6b7280;
  font-weight: 500;
}

.detail-item span:last-child {
  color: #1a1a1a;
  font-weight: 600;
}

.financial-chart {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Enhanced Mobile Responsive Design */
@media (max-width: 1400px) {
  .properties-container.grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
  }
  
  .overview-stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.25rem;
  }
}

@media (max-width: 1200px) {
  .properties-container.grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
  }
  
  .controls-section {
    padding: 1.25rem;
  }
  
  .filter-group {
    gap: 1rem;
  }
  
  .overview-stats {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}

@media (max-width: 1024px) {
  .properties-container.grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }
  
  .controls-section {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-group {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 968px) {
  .properties-container.grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .property-card {
    border-radius: 14px;
  }
  
  .property-details {
    padding: 1.375rem;
  }
  
  .property-image {
    height: 180px;
  }
  
  .modal-content {
    border-radius: 16px;
  }
}

@media (max-width: 768px) {
  .properties-container.grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
    padding: 0.5rem;
  }
  
  .controls-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    padding: 1rem 0.75rem;
  }
  
  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .filter-group select,
  .filter-group input {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 16px; /* Prevent zoom on iOS */
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    min-height: 44px; /* Touch target minimum */
  }
  
  .view-toggle {
    align-self: center;
  }
  
  .view-toggle button {
    min-height: 44px;
    min-width: 44px;
  }
  
  .overview-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.875rem;
    margin-bottom: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem;
    text-align: center;
  }
  
  .property-card {
    margin: 0;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  }
  
  .property-image {
    height: 160px;
  }
  
  .property-details {
    padding: 1.25rem;
  }
  
  .property-title {
    font-size: 1.125rem;
    line-height: 1.3;
  }
  
  .property-specs {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .spec {
    font-size: 0.8rem;
  }
  
  .property-financials {
    flex-direction: column;
    gap: 0.875rem;
    text-align: center;
    padding: 1rem;
  }
  
  .current-price {
    font-size: 1.25rem;
  }
  
  .property-metrics {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .metric {
    text-align: center;
    padding: 0.5rem;
  }
  
  .metric-label {
    font-size: 0.75rem;
  }
  
  .metric-value {
    font-size: 0.875rem;
  }
  
  /* Modal improvements for mobile */
  .property-modal {
    padding: 1rem;
  }
  
  .modal-content {
    margin: 0;
    max-width: 100%;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
  
  .modal-header h2 {
    font-size: 1.375rem;
    line-height: 1.3;
  }
  
  .modal-body {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .detail-item {
    padding: 0.875rem;
    border-radius: 8px;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .close-btn {
    width: 40px;
    height: 40px;
    top: 0.75rem;
    right: 0.75rem;
  }
}

@media (max-width: 640px) {
  .controls-section {
    padding: 0.875rem 0.5rem;
  }
  
  .overview-stats {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .stat-card {
    padding: 0.875rem;
  }
  
  .properties-container.grid {
    padding: 0.25rem;
    gap: 1rem;
  }
  
  .property-card {
    border-radius: 10px;
  }
  
  .property-details {
    padding: 1rem;
  }
  
  .property-title {
    font-size: 1.05rem;
  }
  
  .property-financials {
    padding: 0.875rem;
    gap: 0.75rem;
  }
  
  .current-price {
    font-size: 1.125rem;
  }
  
  .property-metrics {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .modal-header {
    padding: 1.25rem 1.25rem 0.875rem 1.25rem;
  }
  
  .modal-body {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
  
  .close-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .controls-section {
    padding: 0.75rem 0.375rem;
  }
  
  .filter-group select,
  .filter-group input {
    padding: 0.75rem;
    font-size: 16px;
    border-radius: 6px;
  }
  
  .property-card {
    border-radius: 8px;
  }
  
  .property-image {
    height: 140px;
  }
  
  .property-details {
    padding: 0.875rem;
  }
  
  .property-title {
    font-size: 1rem;
  }
  
  .property-location {
    font-size: 0.85rem;
  }
  
  .spec {
    font-size: 0.75rem;
  }
  
  .property-financials {
    padding: 0.75rem;
    gap: 0.625rem;
  }
  
  .current-price {
    font-size: 1.05rem;
  }
  
  .roi-value {
    font-size: 1rem;
  }
  
  .property-metrics {
    gap: 0.375rem;
  }
  
  .metric {
    padding: 0.375rem;
  }
  
  .metric-label {
    font-size: 0.7rem;
  }
  
  .metric-value {
    font-size: 0.8rem;
  }
  
  .modal-header h2 {
    font-size: 1.25rem;
  }
  
  .modal-header {
    padding: 1rem 1rem 0.75rem 1rem;
  }
  
  .modal-body {
    padding: 0 1rem 1rem 1rem;
  }
  
  .detail-item {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .close-btn {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 320px) {
  .controls-section {
    padding: 0.625rem 0.25rem;
  }
  
  .property-details {
    padding: 0.75rem;
  }
  
  .property-title {
    font-size: 0.95rem;
  }
  
  .property-image {
    height: 120px;
  }
  
  .property-financials {
    padding: 0.625rem;
  }
  
  .current-price {
    font-size: 1rem;
  }
  
  .modal-header {
    padding: 0.875rem 0.875rem 0.625rem 0.875rem;
  }
  
  .modal-body {
    padding: 0 0.875rem 0.875rem 0.875rem;
  }
  
  .close-btn {
    width: 30px;
    height: 30px;
    top: 0.5rem;
    right: 0.5rem;
  }
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  /* Prevent zoom on iOS */
  .filter-group select,
  .filter-group input {
    font-size: 16px !important;
  }
  
  /* Enhanced touch targets */
  .property-card,
  .view-toggle button,
  .close-btn {
    min-height: 44px;
  }
  
  /* Better focus states for mobile */
  .filter-group select:focus,
  .filter-group input:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  .property-card:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
  }
  
  /* Optimize animations for mobile performance */
  .property-card:hover {
    transform: none; /* Disable hover animations on mobile */
  }
  
  /* Ensure proper scrolling */
  .modal-content {
    -webkit-overflow-scrolling: touch;
  }
  
  /* Better spacing for mobile */
  .properties-container {
    margin-bottom: 2rem;
  }
}
</style> 