<template>
  <div class="pe-deal-scout">
    <!-- Mobile Sidebar Toggle Button -->
    <button 
      v-if="isMobile" 
      @click="toggleSidebar" 
      class="mobile-sidebar-toggle"
      :class="{ 'sidebar-open': isSidebarOpen }"
    >
      <i class="fas fa-bars" v-if="!isSidebarOpen"></i>
      <i class="fas fa-times" v-else></i>
    </button>

    <!-- Sidebar Overlay for mobile -->
    <div 
      v-if="isMobile && isSidebarOpen" 
      class="sidebar-overlay" 
      @click="closeSidebar"
    ></div>

    <!-- Sidebar -->
    <aside 
      class="deal-scout-sidebar" 
      :class="{
        'sidebar-open': isSidebarOpen,
        'sidebar-mobile': isMobile,
        'sidebar-desktop': !isMobile
      }"
    >
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <i class="fas fa-chart-line"></i>
          <span>Deal Scout</span>
        </div>
        <button v-if="isMobile" @click="closeSidebar" class="sidebar-close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li @click="scrollToSection('dashboard')" :class="{ active: activeSection === 'dashboard' }">
            <i class="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </li>
          <li @click="scrollToSection('comparables')" :class="{ active: activeSection === 'comparables' }">
            <i class="fas fa-balance-scale"></i>
            <span>Comparables</span>
          </li>
          <li @click="scrollToSection('due-diligence')" :class="{ active: activeSection === 'due-diligence' }">
            <i class="fas fa-clipboard-check"></i>
            <span>Due Diligence</span>
          </li>
          <li @click="scrollToSection('memo')" :class="{ active: activeSection === 'memo' }">
            <i class="fas fa-file-alt"></i>
            <span>Deal Memo</span>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="quick-stats">
          <div class="stat-item">
            <span class="stat-label">Active Deals</span>
            <span class="stat-value">12</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">This Month</span>
            <span class="stat-value">3</span>
          </div>
        </div>
      </div>
    </aside>

    <div class="main-content" :class="{ 'sidebar-open': !isMobile && isSidebarOpen }">
      <div class="hero-section" id="dashboard">
        <div class="hero-content">
          <h1 class="hero-title">Private Equity Deal Scout</h1>
          <p class="hero-subtitle">Advanced deal analysis and due diligence platform powered by AI</p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ totalDealsAnalyzed.toLocaleString() }}</div>
              <div class="stat-label">Deals Analyzed</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">${{ totalValueAnalyzed }}B</div>
              <div class="stat-label">Total Value</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ averageAccuracy }}%</div>
              <div class="stat-label">Analysis Accuracy</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deal Analysis Dashboard -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2>Deal Analysis Dashboard</h2>
          <div class="header-actions">
            <button @click="openNewDealModal" class="btn-primary">
              <i class="fas fa-plus"></i> New Deal Analysis
            </button>
            <button @click="exportReport" class="btn-secondary">
              <i class="fas fa-download"></i> Export Report
            </button>
          </div>
        </div>

        <div class="analysis-grid">
          <!-- Quick Analysis Panel -->
          <div class="analysis-card quick-analysis">
            <div class="card-header">
              <h3>Quick Deal Assessment</h3>
              <span class="status-indicator active"></span>
            </div>
            <div class="card-content">
              <form @submit.prevent="performQuickAnalysis" class="quick-form">
                <div class="form-row">
                  <div class="form-group">
                    <label>Company Name</label>
                    <input v-model="quickAnalysis.companyName" type="text" placeholder="Enter company name" required>
                  </div>
                  <div class="form-group">
                    <label>Sector</label>
                    <select v-model="quickAnalysis.sector" required>
                      <option value="saas">SaaS</option>
                      <option value="fintech">FinTech</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="edtech">EdTech</option>
                    </select>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Revenue ($M)</label>
                    <input v-model.number="quickAnalysis.revenue" type="number" step="0.1" placeholder="Annual revenue" required>
                  </div>
                  <div class="form-group">
                    <label>EBITDA ($M)</label>
                    <input v-model.number="quickAnalysis.ebitda" type="number" step="0.1" placeholder="EBITDA" required>
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Stage</label>
                    <select v-model="quickAnalysis.stage" required>
                      <option value="series-a">Series A</option>
                      <option value="series-b">Series B</option>
                      <option value="growth">Growth</option>
                      <option value="buyout">Buyout</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Market Size ($B)</label>
                    <input v-model.number="quickAnalysis.marketSize" type="number" step="0.1" placeholder="TAM">
                  </div>
                </div>
                <button type="submit" class="btn-analyze" :disabled="isAnalyzing">
                  <i class="fas fa-chart-line"></i>
                  {{ isAnalyzing ? 'Analyzing...' : 'Analyze Deal' }}
                </button>
              </form>
            </div>
          </div>

          <!-- LBO Calculator -->
          <div class="analysis-card lbo-calculator">
            <div class="card-header">
              <h3>LBO Model Calculator</h3>
              <span class="tooltip-trigger" @mouseenter="showTooltip" @mouseleave="hideTooltip">
                <i class="fas fa-info-circle"></i>
              </span>
            </div>
            <div class="card-content">
              <div class="lbo-inputs">
                <div class="input-group">
                  <label>EBITDA Multiple</label>
                  <input v-model.number="lboModel.debtMultiple" type="number" step="0.1" placeholder="5.0">
                </div>
                <div class="input-group">
                  <label>Exit Multiple</label>
                  <input v-model.number="lboModel.exitMultiple" type="number" step="0.1" placeholder="8.0">
                </div>
                <div class="input-group">
                  <label>Interest Rate (%)</label>
                  <input v-model.number="lboModel.interestRate" type="number" step="0.1" placeholder="7.5">
                </div>
                <div class="input-group">
                  <label>Holding Period (Years)</label>
                  <input v-model.number="lboModel.holdingPeriod" type="number" placeholder="5">
                </div>
              </div>
              <button @click="calculateLBO" class="btn-calculate">Calculate Returns</button>
              
              <div v-if="lboResults" class="lbo-results">
                <div class="result-metric">
                  <span class="metric-label">IRR</span>
                  <span class="metric-value">{{ lboResults.returns?.irr }}%</span>
                </div>
                <div class="result-metric">
                  <span class="metric-label">Money Multiple</span>
                  <span class="metric-value">{{ lboResults.returns?.multipleOfMoney }}x</span>
                </div>
                <div class="result-metric">
                  <span class="metric-label">Equity Value</span>
                  <span class="metric-value">${{ lboResults.exit?.equityValue }}M</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Deal Insights -->
          <div class="analysis-card deal-insights" v-if="currentAnalysis">
            <div class="card-header">
              <h3>Deal Insights</h3>
              <div class="overall-score" :class="getScoreClass(currentAnalysis.scoring?.overall)">
                {{ currentAnalysis.scoring?.overall || 0 }}
              </div>
            </div>
            <div class="card-content">
              <div class="insights-list">
                <div v-for="insight in currentAnalysis.insights" :key="insight.category" 
                     class="insight-item" :class="insight.type">
                  <div class="insight-header">
                    <span class="insight-category">{{ insight.category }}</span>
                    <span class="insight-type">{{ insight.type }}</span>
                  </div>
                  <p class="insight-message">{{ insight.message }}</p>
                  <p class="insight-recommendation">{{ insight.recommendation }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Market Intelligence -->
          <div class="analysis-card market-intel">
            <div class="card-header">
              <h3>Market Intelligence</h3>
              <button @click="refreshMarketData" class="refresh-btn">
                <i class="fas fa-sync-alt" :class="{ 'spinning': refreshing }"></i>
              </button>
            </div>
            <div class="card-content">
              <div v-if="marketIntelligence" class="market-stats">
                <div class="market-metric">
                  <label>Market Size</label>
                  <value>{{ marketIntelligence.sector_overview?.market_size }}</value>
                </div>
                <div class="market-metric">
                  <label>Growth Rate</label>
                  <value>{{ marketIntelligence.sector_overview?.growth_rate }}</value>
                </div>
                <div class="market-metric">
                  <label>Recent Deals</label>
                  <value>{{ marketIntelligence.recent_transactions?.length || 0 }}</value>
                </div>
                <div class="market-metric">
                  <label>Sentiment</label>
                  <value :class="marketIntelligence.market_sentiment">
                    {{ marketIntelligence.market_sentiment }}
                  </value>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Deals & Comparables -->
      <div class="comparables-section" id="comparables">
        <div class="section-header">
          <h2>Recent Deals & Comparables</h2>
          <div class="filter-controls">
            <select v-model="comparableFilters.sector">
              <option value="">All Sectors</option>
              <option value="saas">SaaS</option>
              <option value="fintech">FinTech</option>
              <option value="ecommerce">E-commerce</option>
              <option value="healthcare">Healthcare</option>
            </select>
            <select v-model="comparableFilters.timeframe">
              <option value="12m">Last 12 Months</option>
              <option value="24m">Last 24 Months</option>
              <option value="36m">Last 36 Months</option>
            </select>
            <button @click="loadComparables" class="btn-filter">Apply Filters</button>
          </div>
        </div>

        <div class="comparables-table">
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Stage</th>
                <th>Valuation</th>
                <th>Revenue Multiple</th>
                <th>Growth Rate</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="deal in comparableDeals" :key="deal.company_name">
                <td class="company-name">{{ deal.company_name }}</td>
                <td><span class="sector-tag">{{ deal.sector }}</span></td>
                <td><span class="stage-badge">{{ deal.stage }}</span></td>
                <td class="valuation">{{ deal.valuation }}</td>
                <td class="multiple">{{ deal.revenue_multiple }}x</td>
                <td class="growth">{{ deal.growth_rate }}</td>
                <td class="date">{{ formatDate(deal.date) }}</td>
                <td class="actions">
                  <button @click="viewDealDetails(deal)" class="btn-view">View</button>
                  <button @click="compareToDeal(deal)" class="btn-compare">Compare</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Due Diligence Checklist -->
      <div class="due-diligence-section" id="due-diligence">
        <div class="section-header">
          <h2>Due Diligence Checklist</h2>
          <div class="progress-indicator">
            <span>{{ completedChecks }}/{{ totalChecks }} Completed</span>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: (completedChecks/totalChecks)*100 + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="checklist-categories">
          <div v-for="category in dueDiligenceChecklist" :key="category.name" class="checklist-category">
            <div class="category-header" @click="toggleCategory(category.name)">
              <h3>{{ category.name }}</h3>
              <span class="category-progress">{{ category.completed }}/{{ category.items.length }}</span>
              <i class="fas fa-chevron-down" :class="{ 'rotated': category.expanded }"></i>
            </div>
            <div v-if="category.expanded" class="category-items">
              <div v-for="item in category.items" :key="item.id" class="checklist-item">
                <input type="checkbox" v-model="item.completed" @change="updateProgress">
                <label>{{ item.task }}</label>
                <span class="item-priority" :class="item.priority">{{ item.priority }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Deal Memo Generator -->
      <div class="memo-section" id="memo">
        <div class="section-header">
          <h2>AI Deal Memo Generator</h2>
          <button @click="generateMemo" class="btn-primary" :disabled="!currentAnalysis || generatingMemo">
            <i class="fas fa-robot"></i>
            {{ generatingMemo ? 'Generating...' : 'Generate Memo' }}
          </button>
        </div>

        <div v-if="generatedMemo" class="memo-preview">
          <div class="memo-header">
            <h3>{{ generatedMemo.executiveSummary?.investment_thesis?.substring(0, 50) }}...</h3>
            <div class="memo-actions">
              <button @click="downloadMemo" class="btn-download">
                <i class="fas fa-download"></i> Download PDF
              </button>
              <button @click="editMemo" class="btn-edit">
                <i class="fas fa-edit"></i> Edit
              </button>
            </div>
          </div>
          <div class="memo-content">
            <div class="memo-section-item">
              <h4>Investment Thesis</h4>
              <p>{{ generatedMemo.executiveSummary?.investment_thesis }}</p>
            </div>
            <div class="memo-section-item">
              <h4>Key Highlights</h4>
              <ul>
                <li v-for="highlight in generatedMemo.executiveSummary?.key_highlights" :key="highlight">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <div v-if="showNewDealModal" class="modal-overlay" @click="closeNewDealModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>New Deal Analysis</h3>
            <button @click="closeNewDealModal" class="close-btn">&times;</button>
          </div>
          <div class="modal-body">
            <!-- Advanced deal input form would go here -->
            <p>Comprehensive deal input form with financial modeling capabilities</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PrivateEquityDealScoutPage',
  data() {
    return {
      // Hero stats
      totalDealsAnalyzed: 1247,
      totalValueAnalyzed: 45.8,
      averageAccuracy: 89.3,

      // Quick analysis form
      quickAnalysis: {
        companyName: '',
        sector: 'saas',
        revenue: null,
        ebitda: null,
        stage: 'growth',
        marketSize: null,
        teamScore: 75
      },

      // LBO model
      lboModel: {
        debtMultiple: 5.0,
        exitMultiple: 8.0,
        interestRate: 7.5,
        holdingPeriod: 5
      },

      // State
      isAnalyzing: false,
      refreshing: false,
      generatingMemo: false,
      showNewDealModal: false,

      // Results
      currentAnalysis: null,
      lboResults: null,
      marketIntelligence: null,
      comparableDeals: [],
      generatedMemo: null,

      // Filters
      comparableFilters: {
        sector: '',
        timeframe: '24m'
      },

      // Due diligence
      dueDiligenceChecklist: [
        {
          name: 'Financial Analysis',
          expanded: true,
          completed: 0,
          items: [
            { id: 1, task: 'Audit historical financial statements', priority: 'high', completed: false },
            { id: 2, task: 'Validate revenue recognition policies', priority: 'high', completed: false },
            { id: 3, task: 'Assess working capital requirements', priority: 'medium', completed: false },
            { id: 4, task: 'Review debt structure and covenants', priority: 'high', completed: false },
            { id: 5, task: 'Analyze cash flow projections', priority: 'high', completed: false }
          ]
        },
        {
          name: 'Commercial Due Diligence',
          expanded: false,
          completed: 0,
          items: [
            { id: 6, task: 'Market size and growth validation', priority: 'high', completed: false },
            { id: 7, task: 'Customer concentration analysis', priority: 'high', completed: false },
            { id: 8, task: 'Competitive positioning assessment', priority: 'medium', completed: false },
            { id: 9, task: 'Product differentiation review', priority: 'medium', completed: false }
          ]
        },
        {
          name: 'Operational Review',
          expanded: false,
          completed: 0,
          items: [
            { id: 10, task: 'Management team assessment', priority: 'high', completed: false },
            { id: 11, task: 'Technology platform review', priority: 'medium', completed: false },
            { id: 12, task: 'Operational scalability analysis', priority: 'medium', completed: false }
          ]
        },
        {
          name: 'Legal & Compliance',
          expanded: false,
          completed: 0,
          items: [
            { id: 13, task: 'Cap table and ownership structure', priority: 'high', completed: false },
            { id: 14, task: 'IP portfolio assessment', priority: 'medium', completed: false },
            { id: 15, task: 'Regulatory compliance review', priority: 'high', completed: false }
          ]
        }
      ],

      // Sidebar state
      isSidebarOpen: false,
      isMobile: false,
      activeSection: 'dashboard',
    };
  },

  computed: {
    totalChecks() {
      return this.dueDiligenceChecklist.reduce((sum, category) => sum + category.items.length, 0);
    },

    completedChecks() {
      return this.dueDiligenceChecklist.reduce((sum, category) => 
        sum + category.items.filter(item => item.completed).length, 0);
    }
  },

  mounted() {
    this.loadInitialData();
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    window.addEventListener('scroll', this.handleScroll);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
    window.removeEventListener('scroll', this.handleScroll);
  },

  methods: {
    async loadInitialData() {
      await Promise.all([
        this.refreshMarketData(),
        this.loadComparables()
      ]);
    },

    async performQuickAnalysis() {
      this.isAnalyzing = true;
      try {
        const response = await axios.post('/api/pe-analysis/analyze-deal', {
          ...this.quickAnalysis,
          competitiveAdvantage: 'Strong',
          teamScore: this.quickAnalysis.teamScore || 75
        });

        if (response.data.success) {
          this.currentAnalysis = response.data.data;
          this.$toast.success('Deal analysis completed successfully');
        }
      } catch (error) {
        console.error('Analysis error:', error);
        this.$toast.error('Failed to analyze deal');
      } finally {
        this.isAnalyzing = false;
      }
    },

    async calculateLBO() {
      try {
        const response = await axios.post('/api/pe-analysis/lbo-model', {
          ebitda: this.quickAnalysis.ebitda || 10,
          ...this.lboModel
        });

        if (response.data.success) {
          this.lboResults = response.data.data;
          this.$toast.success('LBO calculation completed');
        }
      } catch (error) {
        console.error('LBO calculation error:', error);
        this.$toast.error('Failed to calculate LBO model');
      }
    },

    async refreshMarketData() {
      if (!this.quickAnalysis.sector) return;
      
      this.refreshing = true;
      try {
        const response = await axios.get(`/api/pe-analysis/market-intelligence/${this.quickAnalysis.sector}`, {
          params: { stage: this.quickAnalysis.stage }
        });

        if (response.data.success) {
          this.marketIntelligence = response.data.data;
        }
      } catch (error) {
        console.error('Market intelligence error:', error);
      } finally {
        this.refreshing = false;
      }
    },

    async loadComparables() {
      try {
        const response = await axios.get('/api/pe-analysis/comparable-deals', {
          params: this.comparableFilters
        });

        if (response.data.success) {
          this.comparableDeals = response.data.data.deals || [];
        }
      } catch (error) {
        console.error('Comparables loading error:', error);
      }
    },

    async generateMemo() {
      if (!this.currentAnalysis) return;

      this.generatingMemo = true;
      try {
        const response = await axios.post('/api/pe-analysis/generate-memo', {
          dealData: this.quickAnalysis,
          analysisResults: this.currentAnalysis
        });

        if (response.data.success) {
          this.generatedMemo = response.data.data;
          this.$toast.success('Deal memo generated successfully');
        }
      } catch (error) {
        console.error('Memo generation error:', error);
        this.$toast.error('Failed to generate memo');
      } finally {
        this.generatingMemo = false;
      }
    },

    getScoreClass(score) {
      if (score >= 80) return 'excellent';
      if (score >= 70) return 'good';
      if (score >= 60) return 'fair';
      return 'poor';
    },

    toggleCategory(categoryName) {
      const category = this.dueDiligenceChecklist.find(c => c.name === categoryName);
      if (category) {
        category.expanded = !category.expanded;
      }
    },

    updateProgress() {
      this.dueDiligenceChecklist.forEach(category => {
        category.completed = category.items.filter(item => item.completed).length;
      });
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString();
    },

    openNewDealModal() {
      this.showNewDealModal = true;
    },

    closeNewDealModal() {
      this.showNewDealModal = false;
    },

    exportReport() {
      // Export functionality
      this.$toast.info('Report export feature coming soon');
    },

    downloadMemo() {
      // Download memo functionality
      this.$toast.info('Memo download feature coming soon');
    },

    editMemo() {
      // Edit memo functionality
      this.$toast.info('Memo editor opening soon');
    },

    viewDealDetails(deal) {
      // View deal details
      this.$toast.info(`Viewing details for ${deal.company_name}`);
    },

    compareToDeal(deal) {
      // Compare to current deal
      this.$toast.info(`Comparing to ${deal.company_name}`);
    },

    showTooltip() {
      // Show tooltip
    },

    hideTooltip() {
      // Hide tooltip  
    },

    // Sidebar methods
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },

    closeSidebar() {
      this.isSidebarOpen = false;
    },

    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
      if (!this.isMobile) {
        this.isSidebarOpen = true; // Open by default on desktop
      } else {
        this.isSidebarOpen = false; // Closed by default on mobile
      }
    },

    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.activeSection = sectionId;
        if (this.isMobile) {
          this.closeSidebar();
        }
      }
    },

    handleScroll() {
      const sections = ['dashboard', 'comparables', 'due-diligence', 'memo'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          this.activeSection = sections[i];
          break;
        }
      }
    },
  }
};
</script>

<style scoped>
.pe-deal-scout {
  min-height: 100vh;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  font-family: 'Inter', sans-serif;
  display: flex;
  position: relative;
}

/* Mobile Sidebar Toggle Button */
.mobile-sidebar-toggle {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.mobile-sidebar-toggle:hover {
  background: white;
  transform: scale(1.05);
}

.mobile-sidebar-toggle i {
  font-size: 1.2rem;
  color: #2d3748;
}

/* Sidebar Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Sidebar Styles */
.deal-scout-sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(45, 55, 72, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  z-index: 999;
}

.sidebar-desktop {
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
}

.sidebar-mobile {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  transform: translateX(-100%);
  z-index: 999;
}

.sidebar-mobile.sidebar-open {
  transform: translateX(0);
}

.sidebar-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(45, 55, 72, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.sidebar-logo i {
  font-size: 1.5rem;
  color: #2d3748;
}

.sidebar-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.sidebar-close:hover {
  background: #f7fafc;
  color: #2d3748;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.sidebar-nav li:hover {
  background: #f7fafc;
  color: #2d3748;
}

.sidebar-nav li.active {
  background: linear-gradient(135deg, rgba(45, 55, 72, 0.1), rgba(26, 32, 44, 0.1));
  color: #2d3748;
  border-left-color: #2d3748;
  font-weight: 600;
}

.sidebar-nav li i {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(45, 55, 72, 0.1);
}

.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
}

.stat-value {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

/* Main Content */
.main-content {
  flex: 1;
  transition: all 0.3s ease;
  min-width: 0; /* Prevent flex item from overflowing */
}

.main-content.sidebar-open {
  margin-left: 0; /* Desktop sidebar is sticky, no need for margin */
}

.hero-section {
  padding: 80px 20px 60px;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.dashboard-section {
  padding: 40px 20px;
  background: white;
  margin: -30px 20px 0;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #2d3748, #1a202c);
  color: white;
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #1a202c, #171923);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(45, 55, 72, 0.4);
}

.analysis-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.analysis-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #48bb78;
}

.card-content {
  padding: 1.5rem;
}

.quick-form .form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input, .form-group select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: #2d3748;
  box-shadow: 0 0 0 3px rgba(45, 55, 72, 0.1);
}

.btn-analyze, .btn-calculate {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #2d3748, #1a202c);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.btn-analyze:hover, .btn-calculate:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(45, 55, 72, 0.4);
}

.btn-analyze:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.lbo-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.input-group input {
  padding: 8px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.lbo-results {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.result-metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.metric-label {
  color: #718096;
  font-size: 0.9rem;
}

.metric-value {
  font-weight: 600;
  color: #2d3748;
}

.overall-score {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.1rem;
}

.overall-score.excellent { background: #48bb78; }
.overall-score.good { background: #38b2ac; }
.overall-score.fair { background: #ed8936; }
.overall-score.poor { background: #f56565; }

.insights-list {
  space-y: 1rem;
}

.insight-item {
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
  margin-bottom: 1rem;
}

.insight-item.positive {
  background: #f0fff4;
  border-left-color: #48bb78;
}

.insight-item.warning {
  background: #fffbf0;
  border-left-color: #ed8936;
}

.insight-item.risk {
  background: #fff5f5;
  border-left-color: #f56565;
}

.insight-item.opportunity {
  background: #f0f9ff;
  border-left-color: #4299e1;
}

.insight-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.insight-category {
  font-weight: 600;
  color: #2d3748;
}

.insight-type {
  font-size: 0.8rem;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 12px;
  background: rgba(0,0,0,0.1);
}

.insight-message {
  margin: 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
}

.insight-recommendation {
  margin: 0;
  color: #718096;
  font-size: 0.8rem;
  font-style: italic;
}

.market-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.market-metric {
  text-align: center;
}

.market-metric label {
  display: block;
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.market-metric value {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.market-metric value.bullish { color: #48bb78; }
.market-metric value.bearish { color: #f56565; }
.market-metric value.moderate { color: #ed8936; }

.refresh-btn {
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #f7fafc;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.comparables-section {
  padding: 40px 20px;
  background: #f7fafc;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-controls select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.btn-filter {
  padding: 8px 16px;
  background: #2d3748;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
}

.comparables-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-top: 2rem;
}

.comparables-table table {
  width: 100%;
  border-collapse: collapse;
}

.comparables-table th {
  padding: 1rem;
  background: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.comparables-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.company-name {
  font-weight: 600;
  color: #2d3748;
}

.sector-tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.stage-badge {
  background: #2d3748;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.valuation {
  font-weight: 600;
  color: #2d3748;
}

.btn-view, .btn-compare {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-right: 0.5rem;
}

.btn-view {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-compare {
  background: #2d3748;
  color: white;
}

.due-diligence-section {
  padding: 40px 20px;
  background: white;
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #2d3748, #1a202c);
  transition: width 0.3s ease;
}

.checklist-categories {
  margin-top: 2rem;
}

.checklist-category {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.category-header {
  padding: 1rem 1.5rem;
  background: #f7fafc;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s ease;
}

.category-header:hover {
  background: #edf2f7;
}

.category-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.category-progress {
  color: #718096;
  font-size: 0.9rem;
}

.category-header i {
  transition: transform 0.3s ease;
}

.category-header i.rotated {
  transform: rotate(180deg);
}

.category-items {
  padding: 1rem 1.5rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.checklist-item:last-child {
  border-bottom: none;
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.checklist-item label {
  flex: 1;
  color: #4a5568;
  cursor: pointer;
}

.item-priority {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  text-transform: uppercase;
  font-weight: 600;
}

.item-priority.high {
  background: #fed7d7;
  color: #c53030;
}

.item-priority.medium {
  background: #feebc8;
  color: #dd6b20;
}

.item-priority.low {
  background: #c6f6d5;
  color: #25855a;
}

.memo-section {
  padding: 40px 20px;
  background: #f7fafc;
}

.memo-preview {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-top: 2rem;
  overflow: hidden;
}

.memo-header {
  padding: 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.memo-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.memo-actions {
  display: flex;
  gap: 1rem;
}

.btn-download, .btn-edit {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-download {
  background: #2d3748;
  color: white;
}

.btn-edit {
  background: #e2e8f0;
  color: #4a5568;
}

.memo-content {
  padding: 1.5rem;
}

.memo-section-item {
  margin-bottom: 2rem;
}

.memo-section-item h4 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.memo-section-item p {
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.memo-section-item ul {
  margin: 0;
  padding-left: 1.5rem;
}

.memo-section-item li {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
}

.modal-body {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .pe-deal-scout {
    flex-direction: column;
  }

  .main-content {
    padding-top: 80px; /* Account for mobile toggle button */
  }

  .hero-stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-form .form-row {
    grid-template-columns: 1fr;
  }
  
  .lbo-inputs {
    grid-template-columns: 1fr;
  }
  
  .market-stats {
    grid-template-columns: 1fr;
  }
  
  .comparables-table {
    overflow-x: auto;
  }

  .filter-controls {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .filter-controls select,
  .btn-filter {
    width: 100%;
  }
}
</style> 