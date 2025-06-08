<template>
  <div class="market-analysis">
    <!-- Market Overview Header -->
    <div class="market-header">
      <div class="header-content">
        <h2>Market Analysis</h2>
        <div class="location-selector">
          <select v-model="selectedMarket" @change="loadMarketData">
            <option value="san-francisco">San Francisco, CA</option>
            <option value="austin">Austin, TX</option>
            <option value="seattle">Seattle, WA</option>
            <option value="miami">Miami, FL</option>
            <option value="denver">Denver, CO</option>
          </select>
          <button class="refresh-btn" @click="refreshData">
            <font-awesome-icon icon="fa-solid fa-sync-alt" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Market Overview Cards -->
    <div class="market-overview">
      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="fa-solid fa-home" />
        </div>
        <div class="card-content">
          <h3>${{ formatNumber(marketData.medianPrice) }}</h3>
          <p>Median Home Price</p>
          <span class="change" :class="marketData.priceChange >= 0 ? 'positive' : 'negative'">
            {{ marketData.priceChange >= 0 ? '+' : '' }}{{ marketData.priceChange }}% YoY
          </span>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="fa-solid fa-clock" />
        </div>
        <div class="card-content">
          <h3>{{ marketData.daysOnMarket }}</h3>
          <p>Avg Days on Market</p>
          <span class="change" :class="marketData.domChange <= 0 ? 'positive' : 'negative'">
            {{ marketData.domChange >= 0 ? '+' : '' }}{{ marketData.domChange }} days
          </span>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="fa-solid fa-chart-line" />
        </div>
        <div class="card-content">
          <h3>{{ marketData.inventory }}</h3>
          <p>Months of Inventory</p>
          <span class="market-type" :class="getMarketType(marketData.inventory).toLowerCase()">
            {{ getMarketType(marketData.inventory) }}
          </span>
        </div>
      </div>
      
      <div class="overview-card">
        <div class="card-icon">
          <font-awesome-icon icon="fa-solid fa-percentage" />
        </div>
        <div class="card-content">
          <h3>{{ marketData.listToSaleRatio }}%</h3>
          <p>List-to-Sale Ratio</p>
          <span class="change" :class="marketData.listToSaleRatio >= 95 ? 'positive' : 'negative'">
            {{ marketData.listToSaleRatio >= 95 ? 'Strong' : 'Weak' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="analysis-grid">
      <!-- Price Trends Chart -->
      <div class="analysis-section price-trends">
        <h3>Price Trends</h3>
        <div class="chart-container">
          <canvas ref="priceChart" width="600" height="300"></canvas>
        </div>
        <div class="trend-summary">
          <div class="trend-item">
            <span>1-Year Change:</span>
            <span class="value positive">+{{ marketData.priceChange }}%</span>
          </div>
          <div class="trend-item">
            <span>5-Year CAGR:</span>
            <span class="value positive">+{{ marketData.fiveYearCAGR }}%</span>
          </div>
          <div class="trend-item">
            <span>Forecast (12 months):</span>
            <span class="value positive">+{{ marketData.forecast }}%</span>
          </div>
        </div>
      </div>

      <!-- Market Heat Map -->
      <div class="analysis-section heat-map">
        <h3>Neighborhood Heat Map</h3>
        <div class="map-container">
          <div class="map-placeholder">
            <div class="neighborhood-grid">
              <div 
                v-for="neighborhood in neighborhoods" 
                :key="neighborhood.id"
                class="neighborhood-cell"
                :class="getHeatmapColor(neighborhood.appreciation)"
                @click="selectNeighborhood(neighborhood)"
              >
                <div class="neighborhood-name">{{ neighborhood.name }}</div>
                <div class="neighborhood-price">${{ formatNumber(neighborhood.medianPrice) }}</div>
                <div class="neighborhood-change">+{{ neighborhood.appreciation }}%</div>
              </div>
            </div>
          </div>
          <div class="heat-legend">
            <span>Cold</span>
            <div class="legend-gradient"></div>
            <span>Hot</span>
          </div>
        </div>
      </div>

      <!-- Demographics -->
      <div class="analysis-section demographics">
        <h3>Demographics & Economic Indicators</h3>
        <div class="demo-grid">
          <div class="demo-card">
            <h4>Population</h4>
            <div class="demo-value">{{ formatNumber(demographics.population) }}</div>
            <div class="demo-change">+{{ demographics.populationGrowth }}% annually</div>
          </div>
          <div class="demo-card">
            <h4>Median Income</h4>
            <div class="demo-value">${{ formatNumber(demographics.medianIncome) }}</div>
            <div class="demo-change">+{{ demographics.incomeGrowth }}% YoY</div>
          </div>
          <div class="demo-card">
            <h4>Employment Rate</h4>
            <div class="demo-value">{{ demographics.employmentRate }}%</div>
            <div class="demo-change">{{ demographics.unemploymentChange }}% unemployment</div>
          </div>
          <div class="demo-card">
            <h4>Education</h4>
            <div class="demo-value">{{ demographics.collegeGraduates }}%</div>
            <div class="demo-change">College graduates</div>
          </div>
        </div>
      </div>

      <!-- Rental Market -->
      <div class="analysis-section rental-market">
        <h3>Rental Market Analysis</h3>
        <div class="rental-metrics">
          <div class="rental-card">
            <h4>Average Rent</h4>
            <div class="rental-value">${{ formatNumber(rentalData.averageRent) }}/month</div>
            <div class="rental-breakdown">
              <div class="breakdown-item">
                <span>Studio:</span>
                <span>${{ formatNumber(rentalData.studio) }}</span>
              </div>
              <div class="breakdown-item">
                <span>1 BR:</span>
                <span>${{ formatNumber(rentalData.oneBedroom) }}</span>
              </div>
              <div class="breakdown-item">
                <span>2 BR:</span>
                <span>${{ formatNumber(rentalData.twoBedroom) }}</span>
              </div>
              <div class="breakdown-item">
                <span>3+ BR:</span>
                <span>${{ formatNumber(rentalData.threeBedroom) }}</span>
              </div>
            </div>
          </div>
          
          <div class="rental-card">
            <h4>Rental Yield</h4>
            <div class="rental-value">{{ rentalData.grossYield }}%</div>
            <div class="yield-comparison">
              <div class="yield-item">
                <span>Gross Yield:</span>
                <span>{{ rentalData.grossYield }}%</span>
              </div>
              <div class="yield-item">
                <span>Net Yield:</span>
                <span>{{ rentalData.netYield }}%</span>
              </div>
              <div class="yield-item">
                <span>Cap Rate:</span>
                <span>{{ rentalData.capRate }}%</span>
              </div>
            </div>
          </div>
          
          <div class="rental-card">
            <h4>Market Dynamics</h4>
            <div class="rental-value">{{ rentalData.vacancyRate }}%</div>
            <div class="dynamics-info">
              <div class="dynamic-item">
                <span>Vacancy Rate:</span>
                <span>{{ rentalData.vacancyRate }}%</span>
              </div>
              <div class="dynamic-item">
                <span>Rent Growth:</span>
                <span class="positive">+{{ rentalData.rentGrowth }}%</span>
              </div>
              <div class="dynamic-item">
                <span>Time to Rent:</span>
                <span>{{ rentalData.timeToRent }} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Investment Opportunities -->
      <div class="analysis-section investment-opportunities">
        <h3>Investment Opportunities</h3>
        <div class="opportunities-list">
          <div 
            v-for="opportunity in investmentOpportunities" 
            :key="opportunity.id"
            class="opportunity-card"
          >
            <div class="opportunity-header">
              <h4>{{ opportunity.title }}</h4>
              <span class="opportunity-score" :class="getScoreClass(opportunity.score)">
                {{ opportunity.score }}/10
              </span>
            </div>
            <div class="opportunity-details">
              <p>{{ opportunity.description }}</p>
              <div class="opportunity-metrics">
                <div class="metric">
                  <span>Expected ROI:</span>
                  <span class="positive">{{ opportunity.expectedROI }}%</span>
                </div>
                <div class="metric">
                  <span>Risk Level:</span>
                  <span :class="opportunity.riskLevel.toLowerCase()">{{ opportunity.riskLevel }}</span>
                </div>
                <div class="metric">
                  <span>Time Horizon:</span>
                  <span>{{ opportunity.timeHorizon }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparable Markets -->
      <div class="analysis-section comparable-markets">
        <h3>Comparable Markets</h3>
        <div class="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Market</th>
                <th>Median Price</th>
                <th>YoY Change</th>
                <th>Rental Yield</th>
                <th>Days on Market</th>
                <th>Population Growth</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="market in comparableMarkets" 
                :key="market.id"
                :class="{ current: market.id === selectedMarket }"
              >
                <td class="market-name">{{ market.name }}</td>
                <td>${{ formatNumber(market.medianPrice) }}</td>
                <td :class="market.priceChange >= 0 ? 'positive' : 'negative'">
                  {{ market.priceChange >= 0 ? '+' : '' }}{{ market.priceChange }}%
                </td>
                <td>{{ market.rentalYield }}%</td>
                <td>{{ market.daysOnMarket }}</td>
                <td :class="market.populationGrowth >= 0 ? 'positive' : 'negative'">
                  {{ market.populationGrowth >= 0 ? '+' : '' }}{{ market.populationGrowth }}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faHome, faClock, faChartLine, faPercentage, faSyncAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faClock, faChartLine, faPercentage, faSyncAlt);

export default {
  name: 'MarketAnalysis',
  components: { FontAwesomeIcon },
  data() {
    return {
      selectedMarket: 'san-francisco',
      marketData: {
        medianPrice: 1420000,
        priceChange: 12.5,
        daysOnMarket: 28,
        domChange: -5,
        inventory: 2.1,
        listToSaleRatio: 102,
        fiveYearCAGR: 8.3,
        forecast: 5.2
      },
      neighborhoods: [
        { id: 1, name: 'SOMA', medianPrice: 1650000, appreciation: 15.2 },
        { id: 2, name: 'Mission', medianPrice: 1380000, appreciation: 11.8 },
        { id: 3, name: 'Marina', medianPrice: 1820000, appreciation: 8.5 },
        { id: 4, name: 'Castro', medianPrice: 1590000, appreciation: 13.1 },
        { id: 5, name: 'Richmond', medianPrice: 1250000, appreciation: 14.6 },
        { id: 6, name: 'Sunset', medianPrice: 1180000, appreciation: 16.3 },
        { id: 7, name: 'Nob Hill', medianPrice: 1890000, appreciation: 7.2 },
        { id: 8, name: 'Hayes Valley', medianPrice: 1720000, appreciation: 12.9 }
      ],
      demographics: {
        population: 884363,
        populationGrowth: 1.2,
        medianIncome: 112449,
        incomeGrowth: 4.8,
        employmentRate: 96.2,
        unemploymentChange: 3.8,
        collegeGraduates: 58.3
      },
      rentalData: {
        averageRent: 3850,
        studio: 2950,
        oneBedroom: 3450,
        twoBedroom: 4680,
        threeBedroom: 6420,
        grossYield: 3.25,
        netYield: 2.18,
        capRate: 4.1,
        vacancyRate: 4.2,
        rentGrowth: 8.7,
        timeToRent: 18
      },
      investmentOpportunities: [
        {
          id: 1,
          title: 'Multi-Family Development',
          description: 'New construction opportunities in emerging neighborhoods with strong rental demand.',
          score: 8.5,
          expectedROI: 15.2,
          riskLevel: 'Medium',
          timeHorizon: '3-5 years'
        },
        {
          id: 2,
          title: 'Fix & Flip Properties',
          description: 'Undervalued properties in gentrifying areas with potential for value-add improvements.',
          score: 7.8,
          expectedROI: 22.5,
          riskLevel: 'High',
          timeHorizon: '6-12 months'
        },
        {
          id: 3,
          title: 'REIT Investment',
          description: 'Publicly traded real estate investment trusts focused on San Francisco commercial real estate.',
          score: 6.9,
          expectedROI: 8.8,
          riskLevel: 'Low',
          timeHorizon: '1-3 years'
        }
      ],
      comparableMarkets: [
        { id: 'san-francisco', name: 'San Francisco, CA', medianPrice: 1420000, priceChange: 12.5, rentalYield: 3.25, daysOnMarket: 28, populationGrowth: 1.2 },
        { id: 'austin', name: 'Austin, TX', medianPrice: 520000, priceChange: 18.7, rentalYield: 6.5, daysOnMarket: 22, populationGrowth: 3.8 },
        { id: 'seattle', name: 'Seattle, WA', medianPrice: 850000, priceChange: 9.8, rentalYield: 4.2, daysOnMarket: 31, populationGrowth: 2.1 },
        { id: 'miami', name: 'Miami, FL', medianPrice: 720000, priceChange: 15.6, rentalYield: 5.8, daysOnMarket: 35, populationGrowth: 2.7 },
        { id: 'denver', name: 'Denver, CO', medianPrice: 580000, priceChange: 11.2, rentalYield: 5.2, daysOnMarket: 26, populationGrowth: 1.9 }
      ]
    };
  },
  
  mounted() {
    this.drawPriceChart();
  },
  
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('en-US').format(num);
    },
    
    getMarketType(inventory) {
      if (inventory < 3) return "Seller's Market";
      if (inventory > 6) return "Buyer's Market";
      return "Balanced Market";
    },
    
    getHeatmapColor(appreciation) {
      if (appreciation >= 15) return 'hot';
      if (appreciation >= 12) return 'warm';
      if (appreciation >= 9) return 'neutral';
      if (appreciation >= 6) return 'cool';
      return 'cold';
    },
    
    getScoreClass(score) {
      if (score >= 8) return 'excellent';
      if (score >= 7) return 'good';
      if (score >= 6) return 'fair';
      return 'poor';
    },
    
    selectNeighborhood(neighborhood) {
      // Handle neighborhood selection
      console.log('Selected neighborhood:', neighborhood);
    },
    
    loadMarketData() {
      // Load market data for selected market
      console.log('Loading data for:', this.selectedMarket);
    },
    
    refreshData() {
      // Refresh market data
      console.log('Refreshing market data...');
    },
    
    drawPriceChart() {
      this.$nextTick(() => {
        if (!this.$refs.priceChart) return;
        
        const canvas = this.$refs.priceChart;
        const ctx = canvas.getContext('2d');
        
        // Sample price data (5 years of data)
        const priceData = [1180000, 1220000, 1280000, 1340000, 1420000];
        const years = ['2019', '2020', '2021', '2022', '2023'];
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Chart dimensions
        const padding = 60;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const minPrice = Math.min(...priceData) * 0.95;
        const maxPrice = Math.max(...priceData) * 1.05;
        const priceRange = maxPrice - minPrice;
        
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
        
        // Draw grid lines
        ctx.strokeStyle = '#f3f4f6';
        ctx.lineWidth = 0.5;
        
        for (let i = 1; i < 5; i++) {
          const y = padding + (i / 5) * chartHeight;
          ctx.beginPath();
          ctx.moveTo(padding, y);
          ctx.lineTo(canvas.width - padding, y);
          ctx.stroke();
        }
        
        // Draw price line
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        priceData.forEach((price, index) => {
          const x = padding + (index / (priceData.length - 1)) * chartWidth;
          const y = canvas.height - padding - ((price - minPrice) / priceRange) * chartHeight;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
        
        // Draw data points
        ctx.fillStyle = '#000000';
        priceData.forEach((price, index) => {
          const x = padding + (index / (priceData.length - 1)) * chartWidth;
          const y = canvas.height - padding - ((price - minPrice) / priceRange) * chartHeight;
          
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
          
          // Add value labels
          ctx.fillStyle = '#374151';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`$${Math.round(price / 1000)}K`, x, y - 15);
          ctx.fillStyle = '#000000';
        });
        
        // Add year labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        years.forEach((year, index) => {
          const x = padding + (index / (years.length - 1)) * chartWidth;
          ctx.fillText(year, x, canvas.height - 20);
        });
        
        // Add Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
          const value = minPrice + (i / 5) * priceRange;
          const y = canvas.height - padding - (i / 5) * chartHeight;
          ctx.fillText(`$${Math.round(value / 1000)}K`, padding - 10, y + 5);
        }
      });
    }
  }
};
</script>

<style scoped>
.market-analysis {
  padding: 0;
}

.market-header {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  padding: 2rem;
  border-radius: 16px 16px 0 0;
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.location-selector {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.location-selector select {
  padding: 0.75rem 1rem;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-weight: 500;
}

.refresh-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: rgba(255,255,255,0.2);
}

.market-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.overview-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
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

.card-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
}

.card-content p {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.change {
  font-size: 0.85rem;
  font-weight: 600;
}

.change.positive { color: #10b981; }
.change.negative { color: #ef4444; }

.market-type {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.market-type.seller { background: #fee2e2; color: #dc2626; }
.market-type.buyer { background: #dbeafe; color: #2563eb; }
.market-type.balanced { background: #f3f4f6; color: #374151; }

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

.analysis-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.analysis-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

/* Price Trends */
.chart-container {
  margin-bottom: 1.5rem;
  text-align: center;
}

.trend-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.trend-item .value {
  font-weight: 700;
}

.trend-item .value.positive { color: #10b981; }

/* Heat Map */
.map-container {
  text-align: center;
}

.neighborhood-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.neighborhood-cell {
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.neighborhood-cell:hover {
  transform: scale(1.05);
}

.neighborhood-cell.hot { background: #fef2f2; border: 2px solid #dc2626; }
.neighborhood-cell.warm { background: #fef3c7; border: 2px solid #f59e0b; }
.neighborhood-cell.neutral { background: #f3f4f6; border: 2px solid #6b7280; }
.neighborhood-cell.cool { background: #dbeafe; border: 2px solid #2563eb; }
.neighborhood-cell.cold { background: #e0f2fe; border: 2px solid #0284c7; }

.neighborhood-name {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.neighborhood-price {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.neighborhood-change {
  font-size: 0.8rem;
  font-weight: 600;
  color: #10b981;
}

.heat-legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.legend-gradient {
  width: 100px;
  height: 10px;
  background: linear-gradient(to right, #0284c7, #2563eb, #6b7280, #f59e0b, #dc2626);
  border-radius: 5px;
}

/* Demographics */
.demo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.demo-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
}

.demo-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.demo-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.demo-change {
  font-size: 0.85rem;
  color: #10b981;
  font-weight: 500;
}

/* Rental Market */
.rental-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.rental-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.rental-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.rental-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.rental-breakdown,
.yield-comparison,
.dynamics-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.breakdown-item,
.yield-item,
.dynamic-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.breakdown-item span:first-child,
.yield-item span:first-child,
.dynamic-item span:first-child {
  color: #6b7280;
}

.breakdown-item span:last-child,
.yield-item span:last-child,
.dynamic-item span:last-child {
  font-weight: 600;
  color: #1a1a1a;
}

/* Investment Opportunities */
.opportunities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.opportunity-card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.opportunity-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.opportunity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.opportunity-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.opportunity-score {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

.opportunity-score.excellent { background: #d1fae5; color: #065f46; }
.opportunity-score.good { background: #fef3c7; color: #92400e; }
.opportunity-score.fair { background: #e0f2fe; color: #0c4a6e; }
.opportunity-score.poor { background: #fde2e8; color: #9b1c1c; }

.opportunity-details p {
  margin: 0 0 1rem 0;
  color: #6b7280;
  line-height: 1.5;
}

.opportunity-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric span:first-child {
  font-size: 0.8rem;
  color: #6b7280;
}

.metric span:last-child {
  font-weight: 600;
  color: #1a1a1a;
}

.metric .positive { color: #10b981; }
.metric .high { color: #ef4444; }
.metric .medium { color: #f59e0b; }
.metric .low { color: #10b981; }

/* Comparable Markets */
.comparison-table {
  overflow-x: auto;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.comparison-table th,
.comparison-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.comparison-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #374151;
}

.comparison-table td {
  color: #1a1a1a;
}

.comparison-table tr.current {
  background: #f0f9ff;
  border-left: 4px solid #0ea5e9;
}

.comparison-table .market-name {
  font-weight: 600;
}

.comparison-table .positive { color: #10b981; }
.comparison-table .negative { color: #ef4444; }

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .market-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .rental-metrics {
    grid-template-columns: 1fr;
  }
  
  .demo-grid {
    grid-template-columns: 1fr;
  }
  
  .opportunity-metrics {
    grid-template-columns: 1fr;
  }
  
  .neighborhood-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 