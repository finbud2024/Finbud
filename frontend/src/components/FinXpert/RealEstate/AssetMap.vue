<template>
  <div class="asset-map-container">
    <!-- Header with Controls -->
    <div class="map-header">
      <div class="header-left">
        <h2>
          <i class="fas fa-map-marked-alt"></i>
          Bản Đồ Tài Sản Bất Động Sản
        </h2>
        <p class="subtitle">Quản lý và theo dõi danh mục bất động sản của bạn</p>
      </div>
      <div class="header-controls">
        <select v-model="selectedView" @change="handleViewChange" class="view-selector">
          <option value="portfolio">Danh mục tổng quan</option>
          <option value="market">Thị trường địa phương</option>
          <option value="analytics">Phân tích khu vực</option>
        </select>
        <button @click="toggleHeatmap" class="heatmap-btn" :class="{ active: showHeatmap }">
          <i class="fas fa-fire"></i>
          Bản đồ nhiệt
        </button>
        <button @click="addNewProperty" class="add-property-btn">
          <i class="fas fa-plus"></i>
          Thêm tài sản
        </button>
      </div>
    </div>

    <!-- Map and Sidebar Layout -->
    <div class="map-layout">
      <!-- Interactive Map -->
      <div class="map-section">
        <div ref="mapContainer" class="leaflet-map"></div>
        
        <!-- Map Controls Overlay -->
        <div class="map-controls">
          <div class="control-group">
            <button 
              v-for="layer in mapLayers" 
              :key="layer.id"
              @click="toggleLayer(layer)"
              class="layer-btn"
              :class="{ active: layer.active }"
            >
              <i :class="layer.icon"></i>
              {{ layer.name }}
            </button>
          </div>
          
          <div class="search-control">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                v-model="searchQuery" 
                @input="searchProperties"
                placeholder="Tìm kiếm địa điểm..."
                class="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Property Sidebar -->
      <div class="property-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-header">
          <button @click="toggleSidebar" class="collapse-btn">
            <i :class="sidebarCollapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
          </button>
          <h3 v-if="!sidebarCollapsed">{{ sidebarTitle }}</h3>
        </div>

        <div v-if="!sidebarCollapsed" class="sidebar-content">
          <!-- Portfolio Summary -->
          <div v-if="selectedView === 'portfolio'" class="portfolio-summary">
            <div class="summary-stats">
              <div class="stat-card">
                <div class="stat-number">{{ portfolioProperties.length }}</div>
                <div class="stat-label">Tổng tài sản</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ formatCurrency(totalPortfolioValue) }}</div>
                <div class="stat-label">Tổng giá trị</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">{{ avgROI }}%</div>
                <div class="stat-label">ROI trung bình</div>
              </div>
            </div>

            <!-- Property List -->
            <div class="property-list">
              <h4>Danh sách tài sản</h4>
              <div 
                v-for="property in portfolioProperties" 
                :key="property.id"
                class="property-item"
                :class="{ selected: selectedProperty?.id === property.id }"
                @click="selectProperty(property)"
              >
                <div class="property-image">
                  <img :src="property.image" :alt="property.title" />
                  <div class="property-status" :class="property.status.toLowerCase()">
                    {{ property.status }}
                  </div>
                </div>
                <div class="property-info">
                  <h5>{{ property.title }}</h5>
                  <p class="location">
                    <i class="fas fa-map-marker-alt"></i>
                    {{ property.location }}
                  </p>
                  <div class="property-metrics">
                    <span class="value">{{ formatCurrency(property.currentValue) }}</span>
                    <span class="roi" :class="property.roi >= 0 ? 'positive' : 'negative'">
                      {{ property.roi }}% ROI
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Market Analysis -->
          <div v-if="selectedView === 'market'" class="market-analysis">
            <h4>Phân tích thị trường địa phương</h4>
            <div class="market-stats">
              <div class="market-stat">
                <span class="label">Giá trung bình:</span>
                <span class="value">{{ formatCurrency(marketData.avgPrice) }}</span>
              </div>
              <div class="market-stat">
                <span class="label">Tăng trưởng giá:</span>
                <span class="value positive">+{{ marketData.priceGrowth }}%</span>
              </div>
              <div class="market-stat">
                <span class="label">Tỷ suất cho thuê:</span>
                <span class="value">{{ marketData.rentalYield }}%</span>
              </div>
              <div class="market-stat">
                <span class="label">Thời gian bán:</span>
                <span class="value">{{ marketData.daysOnMarket }} ngày</span>
              </div>
            </div>

            <!-- Comparable Properties -->
            <div class="comparable-properties">
              <h5>Bất động sản tương tự</h5>
              <div 
                v-for="comp in comparableProperties" 
                :key="comp.id"
                class="comparable-item"
              >
                <img :src="comp.image" :alt="comp.title" class="comp-image" />
                <div class="comp-info">
                  <h6>{{ comp.title }}</h6>
                  <p class="comp-price">{{ formatCurrency(comp.price) }}</p>
                  <p class="comp-details">{{ comp.beds }}bed • {{ comp.baths }}bath • {{ comp.sqft }}sqft</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Area Analytics -->
          <div v-if="selectedView === 'analytics'" class="area-analytics">
            <h4>Phân tích khu vực</h4>
            <div class="analytics-chart">
              <canvas ref="analyticsChart" width="300" height="200"></canvas>
            </div>
            
            <div class="area-insights">
              <h5>Thông tin chi tiết</h5>
              <div class="insight-item">
                <i class="fas fa-chart-line"></i>
                <span>Khu vực có tiềm năng tăng trưởng cao trong 2-3 năm tới</span>
              </div>
              <div class="insight-item">
                <i class="fas fa-users"></i>
                <span>Dân số trẻ, thu nhập cao tập trung</span>
              </div>
              <div class="insight-item">
                <i class="fas fa-subway"></i>
                <span>Giao thông công cộng phát triển tốt</span>
              </div>
              <div class="insight-item">
                <i class="fas fa-graduation-cap"></i>
                <span>Gần trường học và đại học danh tiếng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Property Details Modal -->
    <div v-if="showPropertyModal" class="property-modal" @click="closePropertyModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedProperty?.title }}</h3>
          <button @click="closePropertyModal" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="property-gallery">
            <img :src="selectedProperty?.image" :alt="selectedProperty?.title" />
          </div>
          <div class="property-details-full">
            <div class="detail-section">
              <h4>Thông tin tài sản</h4>
              <div class="detail-grid">
                <div class="detail-item">
                  <span>Địa chỉ:</span>
                  <span>{{ selectedProperty?.location }}</span>
                </div>
                <div class="detail-item">
                  <span>Loại hình:</span>
                  <span>{{ selectedProperty?.type }}</span>
                </div>
                <div class="detail-item">
                  <span>Diện tích:</span>
                  <span>{{ selectedProperty?.sqft }} m²</span>
                </div>
                <div class="detail-item">
                  <span>Năm xây dựng:</span>
                  <span>{{ selectedProperty?.yearBuilt }}</span>
                </div>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Tài chính</h4>
              <div class="financial-metrics">
                <div class="metric">
                  <span class="metric-label">Giá trị hiện tại:</span>
                  <span class="metric-value">{{ formatCurrency(selectedProperty?.currentValue) }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Giá mua ban đầu:</span>
                  <span class="metric-value">{{ formatCurrency(selectedProperty?.purchasePrice) }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Thu nhập hàng tháng:</span>
                  <span class="metric-value">{{ formatCurrency(selectedProperty?.monthlyRent) }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">ROI:</span>
                  <span class="metric-value" :class="selectedProperty?.roi >= 0 ? 'positive' : 'negative'">
                    {{ selectedProperty?.roi }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="editProperty" class="edit-btn">
            <i class="fas fa-edit"></i>
            Chỉnh sửa
          </button>
          <button @click="viewAnalytics" class="analytics-btn">
            <i class="fas fa-chart-bar"></i>
            Phân tích chi tiết
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Chart } from 'chart.js/auto'

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: 'AssetMap',
  data() {
    return {
      map: null,
      markers: [],
      selectedView: 'portfolio',
      showHeatmap: false,
      sidebarCollapsed: false,
      searchQuery: '',
      selectedProperty: null,
      showPropertyModal: false,
      
      mapLayers: [
        { id: 'properties', name: 'Tài sản', icon: 'fas fa-home', active: true },
        { id: 'schools', name: 'Trường học', icon: 'fas fa-graduation-cap', active: false },
        { id: 'transport', name: 'Giao thông', icon: 'fas fa-subway', active: false },
        { id: 'shopping', name: 'Mua sắm', icon: 'fas fa-shopping-cart', active: false }
      ],
      
      portfolioProperties: [
        {
          id: 1,
          title: 'Căn hộ cao cấp Vinhomes',
          location: 'Quận 1, TP.HCM',
          type: 'Căn hộ',
          status: 'Đang sở hữu',
          coordinates: [10.762622, 106.660172],
          image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
          currentValue: 8500000000,
          purchasePrice: 7200000000,
          monthlyRent: 35000000,
          sqft: 120,
          yearBuilt: 2020,
          roi: 18.1
        },
        {
          id: 2,
          title: 'Nhà phố Thảo Điền',
          location: 'Quận 2, TP.HCM',
          type: 'Nhà phố',
          status: 'Đầu tư',
          coordinates: [10.801336, 106.744597],
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
          currentValue: 12000000000,
          purchasePrice: 10500000000,
          monthlyRent: 50000000,
          sqft: 200,
          yearBuilt: 2018,
          roi: 14.3
        },
        {
          id: 3,
          title: 'Văn phòng quận 3',
          location: 'Quận 3, TP.HCM',
          type: 'Văn phòng',
          status: 'Cho thuê',
          coordinates: [10.786370, 106.682535],
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
          currentValue: 15000000000,
          purchasePrice: 13500000000,
          monthlyRent: 80000000,
          sqft: 150,
          yearBuilt: 2019,
          roi: 11.1
        }
      ],
      
      marketData: {
        avgPrice: 95000000,
        priceGrowth: 8.5,
        rentalYield: 6.2,
        daysOnMarket: 45
      },
      
      comparableProperties: [
        {
          id: 101,
          title: 'Căn hộ Landmark 81',
          price: 9200000000,
          beds: 3,
          baths: 2,
          sqft: 130,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=150'
        },
        {
          id: 102,
          title: 'Penthouse Saigon Pearl',
          price: 11500000000,
          beds: 4,
          baths: 3,
          sqft: 180,
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=150'
        }
      ]
    }
  },
  
  computed: {
    sidebarTitle() {
      switch (this.selectedView) {
        case 'portfolio': return 'Danh mục tài sản'
        case 'market': return 'Thị trường địa phương'
        case 'analytics': return 'Phân tích khu vực'
        default: return 'Bản đồ tài sản'
      }
    },
    
    totalPortfolioValue() {
      return this.portfolioProperties.reduce((sum, prop) => sum + prop.currentValue, 0)
    },
    
    avgROI() {
      const totalROI = this.portfolioProperties.reduce((sum, prop) => sum + prop.roi, 0)
      return (totalROI / this.portfolioProperties.length).toFixed(1)
    }
  },
  
  mounted() {
    this.initializeMap()
    this.loadPropertyMarkers()
  },
  
  beforeDestroy() {
    if (this.map) {
      this.map.remove()
    }
  },
  
  methods: {
    initializeMap() {
      // Mock map initialization
      console.log('Map initialized')
    },
    
    loadPropertyMarkers() {
      console.log('Property markers loaded')
    },
    
    formatCurrency(amount) {
      if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)} tỷ VNĐ`
      } else if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(0)} triệu VNĐ`
      }
      return `${amount.toLocaleString()} VNĐ`
    },
    
    handleViewChange() {
      if (this.selectedView === 'analytics') {
        this.$nextTick(() => {
          this.createAnalyticsChart()
        })
      }
    },
    
    toggleHeatmap() {
      this.showHeatmap = !this.showHeatmap
    },
    
    toggleLayer(layer) {
      layer.active = !layer.active
    },
    
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    
    searchProperties() {
      console.log('Searching for:', this.searchQuery)
    },
    
    selectProperty(property) {
      this.selectedProperty = property
      this.showPropertyModal = true
    },
    
    closePropertyModal() {
      this.showPropertyModal = false
      this.selectedProperty = null
    },
    
    addNewProperty() {
      console.log('Adding new property')
    },
    
    editProperty() {
      console.log('Editing property:', this.selectedProperty?.id)
    },
    
    viewAnalytics() {
      console.log('Viewing analytics for:', this.selectedProperty?.id)
    },
    
    createAnalyticsChart() {
      console.log('Analytics chart created')
    }
  }
}
</script>

<style scoped>
.asset-map-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8f9fa;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-left h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-left h2 i {
  color: #2563eb;
}

.subtitle {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.view-selector {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  min-width: 180px;
}

.heatmap-btn, .add-property-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heatmap-btn {
  background: #f3f4f6;
  color: #374151;
}

.heatmap-btn.active {
  background: #fbbf24;
  color: white;
}

.add-property-btn {
  background: #2563eb;
  color: white;
}

.add-property-btn:hover {
  background: #1d4ed8;
}

.map-layout {
  flex: 1;
  display: flex;
  position: relative;
}

.map-section {
  flex: 1;
  position: relative;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1.2rem;
}

.leaflet-map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.layer-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.layer-btn:hover {
  background: #f3f4f6;
}

.layer-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.search-control {
  display: flex;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 12px;
  color: #9ca3af;
  z-index: 1;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  width: 250px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.property-sidebar {
  width: 400px;
  background: white;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.property-sidebar.collapsed {
  width: 50px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  color: #6b7280;
}

.collapse-btn:hover {
  background: #f3f4f6;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.sidebar-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.portfolio-summary {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.property-list h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.property-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.property-item:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.property-item.selected {
  border-color: #2563eb;
  background: #eff6ff;
}

.property-image {
  position: relative;
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-status {
  position: absolute;
  top: 4px;
  right: 4px;
  padding: 2px 6px;
  background: rgba(0,0,0,0.8);
  color: white;
  font-size: 0.7rem;
  border-radius: 4px;
}

.property-info {
  flex: 1;
}

.property-info h5 {
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
}

.location {
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.property-metrics {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.value {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.85rem;
}

.roi {
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.roi.positive {
  background: #d1fae5;
  color: #065f46;
}

.roi.negative {
  background: #fee2e2;
  color: #991b1b;
}

.market-analysis h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.market-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.market-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.market-stat .label {
  font-size: 0.85rem;
  color: #6b7280;
}

.market-stat .value {
  font-weight: 600;
  color: #1f2937;
}

.market-stat .value.positive {
  color: #10b981;
}

.comparable-properties h5 {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
}

.comparable-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.comp-image {
  width: 60px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
}

.comp-info {
  flex: 1;
}

.comp-info h6 {
  margin: 0 0 0.25rem 0;
  font-size: 0.8rem;
  font-weight: 600;
  color: #1f2937;
}

.comp-price {
  margin: 0 0 0.25rem 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #2563eb;
}

.comp-details {
  margin: 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.area-analytics h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.analytics-chart {
  margin-bottom: 1.5rem;
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.area-insights h5 {
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
}

.insight-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
  color: #374151;
}

.insight-item i {
  color: #2563eb;
  width: 16px;
}

/* Property Modal */
.property-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  color: #6b7280;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 2rem;
}

.property-gallery {
  margin-bottom: 2rem;
}

.property-gallery img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.property-details-full {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}

.detail-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-item span:first-child {
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-item span:last-child {
  font-weight: 600;
  color: #1f2937;
}

.financial-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.metric-label {
  color: #6b7280;
  font-size: 0.9rem;
}

.metric-value {
  font-weight: 600;
  color: #1f2937;
}

.metric-value.positive {
  color: #10b981;
}

.metric-value.negative {
  color: #ef4444;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
}

.edit-btn, .analytics-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-btn {
  background: #f3f4f6;
  color: #374151;
}

.edit-btn:hover {
  background: #e5e7eb;
}

.analytics-btn {
  background: #2563eb;
  color: white;
}

.analytics-btn:hover {
  background: #1d4ed8;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .property-sidebar {
    width: 350px;
  }
  
  .property-details-full {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .map-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .property-sidebar {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    z-index: 1500;
    box-shadow: -4px 0 8px rgba(0,0,0,0.1);
  }

  .modal-content {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .modal-body {
    padding: 1rem;
  }
}
</style> 