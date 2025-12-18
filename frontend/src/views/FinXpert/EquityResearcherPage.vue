<template>
  <div class="equity-researcher-page">
    <div class="page-header">
      <div class="header-content">
        <h1>Equity Research Dashboard</h1>
        <p>Analyze stocks like a professional.</p>
        
        <!-- Centered Search and Generate Section -->
        <div class="search-generate-section">
          <div class="search-container">
            <div class="search-bar" :class="{ 'focused': isSearchFocused, 'has-suggestions': filteredSuggestions.length > 0 }">
              <font-awesome-icon icon="fa-solid fa-search" />
              <input 
                type="text" 
                v-model="ticker" 
                @keyup.enter="selectStock(ticker)"
                @input="onTickerInput"
                @focus="onSearchFocus"
                @blur="onSearchBlur"
                @keydown="handleKeyNavigation"
                placeholder="Search stocks (e.g., AAPL, Apple Inc.)..."
                :disabled="isLoading"
                ref="searchInput"
              >
              <button 
                class="search-btn" 
                @click="selectStock(ticker)"
                :disabled="isLoading || !ticker.trim()"
              >
                <font-awesome-icon 
                  :icon="isLoading ? 'fa-solid fa-spinner' : 'fa-solid fa-search'" 
                  :class="{ 'fa-spin': isLoading }"
                />
              </button>
              
              <!-- Search Suggestions Dropdown -->
              <div v-if="showSuggestions && filteredSuggestions.length > 0" class="suggestions-dropdown">
                <div class="suggestions-header">
                  <span>Popular Stocks</span>
                  <button class="close-suggestions" @click="closeSuggestions">
                    <font-awesome-icon icon="fa-solid fa-times" />
                  </button>
                </div>
                <div class="suggestions-list">
                  <div 
                    v-for="(stock, index) in filteredSuggestions" 
                    :key="stock.symbol"
                    class="suggestion-item"
                    :class="{ 'highlighted': index === selectedSuggestionIndex }"
                    @click="selectStock(stock.symbol)"
                    @mouseenter="selectedSuggestionIndex = index"
                  >
                    <div class="stock-info">
                      <div class="stock-symbol">{{ stock.symbol }}</div>
                      <div class="stock-name">{{ stock.name }}</div>
                    </div>
                    <div class="stock-sector">{{ stock.sector }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            class="generate-report-btn"
            @click="generateReport"
            :disabled="isLoading || !selectedTicker || isGeneratingReport"
          >
            <font-awesome-icon 
              :icon="isGeneratingReport ? 'fa-solid fa-spinner' : 'fa-solid fa-file-alt'" 
              :class="{ 'fa-spin': isGeneratingReport }"
            />
            <span>{{ isGeneratingReport ? 'Generating...' : 'Generate Report' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner">
        <font-awesome-icon icon="fa-solid fa-spinner" class="fa-spin" />
      </div>
      <p>Loading data for {{ ticker.toUpperCase() }}...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <div class="error-icon">
        <font-awesome-icon icon="fa-solid fa-exclamation-triangle" />
      </div>
      <h3>Unable to load data</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchStockData">
        <font-awesome-icon icon="fa-solid fa-redo" />
        Try Again
      </button>
    </div>

    <!-- Generated Report Section -->
    <div v-if="showGeneratedReport && generatedReport" class="generated-report-section">
      <div class="report-header-actions">
        <h2>Research Report - {{ selectedTicker }}</h2>
        <div class="report-actions">
          <button class="download-btn" @click="downloadReport">
            <font-awesome-icon icon="fa-solid fa-download" />
            Download PDF
          </button>
          <button class="close-report-btn" @click="closeReport">
            <font-awesome-icon icon="fa-solid fa-times" />
            Close Report
          </button>
        </div>
      </div>
      <div class="report-content" v-html="generatedReport"></div>
    </div>

    <!-- Main Dashboard -->
    <div v-if="!isLoading && !error && !showGeneratedReport" class="dashboard-grid">
      <div class="grid-item span-2">
        <CompanySnapshot :ticker="selectedTicker" :key="selectedTicker" />
      </div>
      <div class="grid-item span-1">
        <EarningsCalendar :ticker="selectedTicker" :key="selectedTicker" />
      </div>
      <div class="grid-item span-3">
        <FinancialOverview :ticker="selectedTicker" :key="selectedTicker" />
      </div>
      <div class="grid-item span-2">
        <ValuationModels :ticker="selectedTicker" :key="selectedTicker" />
      </div>
      <div class="grid-item span-1">
        <AnalystConsensus :ticker="selectedTicker" :key="selectedTicker" />
      </div>
      <div class="grid-item span-3">
        <ResearchNotes 
          :ticker="selectedTicker" 
          :key="selectedTicker"
          @generate-report="generateReport"
        />
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
import { 
  faSearch, faSpinner, faFileAlt, faExclamationTriangle, 
  faRedo, faTimes, faDownload 
} from '@fortawesome/free-solid-svg-icons';

library.add(faSearch, faSpinner, faFileAlt, faExclamationTriangle, faRedo, faTimes, faDownload);

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
      ticker: 'AAPL', // Input ticker
      selectedTicker: 'AAPL', // Currently selected ticker for analysis
      isLoading: false,
      error: null,
      isGeneratingReport: false,
      showGeneratedReport: false,
      generatedReport: '',
      isSearchFocused: false,
      showSuggestions: false,
      filteredSuggestions: [],
      selectedSuggestionIndex: null,
      stockSuggestions: [
        { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
        { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
        { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
        { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services' },
        { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
        { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
        { symbol: 'HD', name: 'Home Depot Inc.', sector: 'Consumer Discretionary' },
        { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services' },
        { symbol: 'BAC', name: 'Bank of America Corp.', sector: 'Financial Services' },
        { symbol: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy' },
        { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
        { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
        { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
        { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
        { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Staples' },
        { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
        { symbol: 'INTC', name: 'Intel Corporation', sector: 'Technology' },
        { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples' },
        { symbol: 'CVX', name: 'Chevron Corporation', sector: 'Energy' }
      ]
    };
  },
  methods: {
    onTickerInput() {
      // Clear error when user starts typing
      if (this.error) {
        this.error = null;
      }
      
      // Filter suggestions based on input
      this.filterSuggestions();
      this.selectedSuggestionIndex = null;
    },

    filterSuggestions() {
      const query = this.ticker.toLowerCase().trim();
      if (query.length === 0) {
        this.filteredSuggestions = this.stockSuggestions.slice(0, 8); // Show top 8 when empty
      } else {
        this.filteredSuggestions = this.stockSuggestions.filter(stock => 
          stock.symbol.toLowerCase().includes(query) || 
          stock.name.toLowerCase().includes(query)
        ).slice(0, 8); // Limit to 8 results
      }
    },

    async fetchStockData() {
      if (!this.ticker.trim()) {
        this.error = 'Please enter a valid stock ticker';
        return;
      }

      this.isLoading = true;
      this.error = null;
      this.showGeneratedReport = false; // Hide report when loading new stock

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Validate ticker format (basic validation)
        const tickerRegex = /^[A-Z]{1,5}$/i;
        if (!tickerRegex.test(this.ticker.trim())) {
          throw new Error('Invalid ticker format. Please enter 1-5 letters only.');
        }

        // Update selected ticker
        this.selectedTicker = this.ticker.trim().toUpperCase();
        
        console.log(`Successfully loaded data for ${this.selectedTicker}`);
        
      } catch (error) {
        this.error = error.message || 'Failed to fetch stock data. Please try again.';
        console.error('Error fetching stock data:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async generateReport() {
      if (!this.selectedTicker) {
        this.error = 'Please select a stock first';
        return;
      }
      
      this.isGeneratingReport = true;
      
      try {
        // Simulate report generation
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate mock report content
        this.generatedReport = this.createMockReport();
        this.showGeneratedReport = true;
        
        // Scroll to report section
        this.$nextTick(() => {
          const reportSection = document.querySelector('.generated-report-section');
          if (reportSection) {
            reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
        
      } catch (error) {
        console.error('Error generating report:', error);
        this.error = 'Failed to generate report. Please try again.';
      } finally {
        this.isGeneratingReport = false;
      }
    },

    createMockReport() {
      const currentDate = new Date().toLocaleDateString();
      return `
        <div class="report-header">
          <h1>Company Analysis Report</h1>
          <div class="report-meta">
            <div class="company-info">
              <h2>${this.selectedTicker}</h2>
              <p>Apple Inc.</p>
            </div>
            <div class="report-date">
              <p>Generated: ${currentDate}</p>
              <p>Report Type: Comprehensive Analysis</p>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h3>Executive Summary</h3>
          <p>Apple Inc. (${this.selectedTicker}) continues to demonstrate strong fundamentals with robust revenue growth and market leadership in consumer electronics. The company's diversified product portfolio and services ecosystem provide sustainable competitive advantages.</p>
          <div class="key-highlights">
            <h4>Key Highlights:</h4>
            <ul>
              <li>Strong financial performance with consistent revenue growth</li>
              <li>Market-leading position in premium smartphone segment</li>
              <li>Growing services revenue providing recurring income streams</li>
              <li>Strong balance sheet with significant cash reserves</li>
            </ul>
          </div>
        </div>

        <div class="report-section">
          <h3>Financial Analysis</h3>
          <div class="financial-metrics">
            <div class="metric-row">
              <span class="metric-label">Market Cap:</span>
              <span class="metric-value">$3.00T</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">P/E Ratio:</span>
              <span class="metric-value">29.85</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">EPS (TTM):</span>
              <span class="metric-value">$6.48</span>
            </div>
            <div class="metric-row">
              <span class="metric-label">Revenue Growth:</span>
              <span class="metric-value">8.2%</span>
            </div>
          </div>
          <p>The company maintains strong profitability metrics with healthy margins across all business segments. Cash flow generation remains robust, supporting continued investment in R&D and shareholder returns.</p>
        </div>

        <div class="report-section">
          <h3>Valuation Analysis</h3>
          <p>Based on multiple valuation methodologies including DCF, comparable company analysis, and precedent transactions, ${this.selectedTicker} appears fairly valued at current levels.</p>
          <div class="valuation-summary">
            <div class="valuation-method">
              <h4>DCF Valuation: $195.00</h4>
              <p>Based on 10-year cash flow projections with 8% WACC</p>
            </div>
            <div class="valuation-method">
              <h4>Peer Multiple: $190.00</h4>
              <p>Based on sector average P/E of 28x forward earnings</p>
            </div>
          </div>
        </div>

        <div class="report-section">
          <h3>Risk Assessment</h3>
          <div class="risk-factors">
            <h4>Key Risks:</h4>
            <ul>
              <li><strong>Market Saturation:</strong> Smartphone market maturity may limit growth</li>
              <li><strong>Regulatory Risk:</strong> Increased scrutiny on App Store practices</li>
              <li><strong>Supply Chain:</strong> Dependence on Asian manufacturing partners</li>
              <li><strong>Competition:</strong> Intensifying competition in services segment</li>
            </ul>
          </div>
        </div>

        <div class="report-section">
          <h3>Investment Recommendation</h3>
          <div class="recommendation-box">
            <div class="rating">
              <h2>BUY</h2>
              <p>Target Price: $210.00</p>
              <p>Upside Potential: 8.5%</p>
            </div>
          </div>
          <p><strong>Investment Thesis:</strong> ${this.selectedTicker} remains a high-quality growth stock with strong fundamentals, market leadership, and multiple growth drivers. The company's ecosystem approach and services growth provide sustainable competitive advantages.</p>
          <p><strong>Time Horizon:</strong> Medium-term investment recommended based on fundamental strength and growth prospects.</p>
        </div>

        <div class="report-footer">
          <p><em>This report is generated for educational purposes. Please consult with a financial advisor before making investment decisions.</em></p>
          <p>Generated by FinXpert Equity Research Dashboard</p>
        </div>
      `;
    },

    closeReport() {
      this.showGeneratedReport = false;
      this.generatedReport = '';
    },

    downloadReport() {
      // Create a new window with the report content for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Research Report - ${this.selectedTicker}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .report-header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .report-meta { display: flex; justify-content: space-between; align-items: flex-start; }
              .report-section { margin-bottom: 30px; }
              .report-section h3 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
              .financial-metrics { background: #f8f9fa; padding: 15px; border-radius: 8px; }
              .metric-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .metric-label { font-weight: bold; }
              .recommendation-box { background: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center; }
              .rating h2 { color: #28a745; margin: 0; }
              .report-footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.9em; color: #666; }
            </style>
          </head>
          <body>
            ${this.generatedReport}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    },

    onSearchFocus() {
      this.isSearchFocused = true;
      this.filterSuggestions();
      this.showSuggestions = true;
    },

    onSearchBlur() {
      // Delay hiding suggestions to allow for clicks
      setTimeout(() => {
        this.isSearchFocused = false;
        this.showSuggestions = false;
      }, 200);
    },

    handleKeyNavigation(event) {
      if (this.showSuggestions && this.filteredSuggestions.length > 0) {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (this.selectedSuggestionIndex === null) {
            this.selectedSuggestionIndex = 0;
          } else {
            this.selectedSuggestionIndex = (this.selectedSuggestionIndex + 1) % this.filteredSuggestions.length;
          }
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          if (this.selectedSuggestionIndex === null) {
            this.selectedSuggestionIndex = this.filteredSuggestions.length - 1;
          } else {
            this.selectedSuggestionIndex = (this.selectedSuggestionIndex - 1 + this.filteredSuggestions.length) % this.filteredSuggestions.length;
          }
        } else if (event.key === 'Enter') {
          event.preventDefault();
          if (this.selectedSuggestionIndex !== null) {
            const selectedStock = this.filteredSuggestions[this.selectedSuggestionIndex];
            this.selectStock(selectedStock.symbol);
          } else {
            this.selectStock(this.ticker);
          }
        } else if (event.key === 'Escape') {
          this.showSuggestions = false;
          this.selectedSuggestionIndex = null;
        }
      }
    },

    selectStock(ticker) {
      this.ticker = ticker.toUpperCase();
      this.showSuggestions = false;
      this.selectedSuggestionIndex = null;
      this.fetchStockData();
    },

    closeSuggestions() {
      this.showSuggestions = false;
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
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  text-align: center;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
}

.header-content h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
}

.header-content p {
  font-size: 1.1rem;
  color: #64748b;
  margin: 0 0 2rem 0;
}

.search-generate-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
}

.search-container {
  position: relative;
  z-index: 100;
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
  position: relative;
  transition: all 0.3s ease;
}

.search-bar.focused {
  border-color: #3b82f6;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.search-bar.has-suggestions {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
}

.search-bar svg { color: #9ca3af; margin-right: 0.75rem; }
.search-bar input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 1rem;
}
.search-bar input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  margin-left: 0.5rem;
  transition: all 0.2s ease;
}
.search-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
}
.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.generate-report-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  position: relative;
  overflow: hidden;
}

.generate-report-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.generate-report-btn:hover::before {
  left: 100%;
}

.generate-report-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.generate-report-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.generate-report-btn span {
  position: relative;
  z-index: 1;
}

/* Search Suggestions Styles */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #3b82f6;
  border-top: none;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 400px;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
}

.close-suggestions {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-suggestions:hover {
  background: #e5e7eb;
  color: #374151;
}

.suggestions-list {
  max-height: 320px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f3f4f6;
}

.suggestion-item:hover,
.suggestion-item.highlighted {
  background: #f0f9ff;
  border-left: 3px solid #3b82f6;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.stock-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stock-symbol {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1f2937;
  margin-bottom: 0.125rem;
}

.stock-name {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.2;
}

.stock-sector {
  font-size: 0.75rem;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.suggestion-item.highlighted .stock-sector {
  background: #dbeafe;
  color: #3b82f6;
}

/* Custom scrollbar for suggestions */
.suggestions-list::-webkit-scrollbar {
  width: 6px;
}

.suggestions-list::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.suggestions-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.suggestions-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  font-size: 2rem;
  color: #3b82f6;
  margin-bottom: 1rem;
}

.error-icon {
  font-size: 3rem;
  color: #ef4444;
  margin-bottom: 1rem;
}

.error-state h3 {
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.error-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}
.retry-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Generated Report Section Styles */
.generated-report-section {
  padding: 2rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.report-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.report-header-actions h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
}

.report-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.download-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}
.download-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.close-report-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}
.close-report-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.report-content {
  font-family: 'Georgia', serif;
  line-height: 1.6;
  color: #374151;
}

.report-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.report-header h1 {
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.company-info h2 {
  color: #3b82f6;
  font-size: 1.5rem;
  margin: 0;
}

.company-info p {
  color: #6b7280;
  margin: 0.25rem 0 0 0;
}

.report-date {
  text-align: right;
  color: #6b7280;
  font-size: 0.9rem;
}

.report-section {
  margin-bottom: 2rem;
}

.report-section h3 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.key-highlights {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
  margin-top: 1rem;
}

.key-highlights h4 {
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.key-highlights ul {
  margin: 0;
  padding-left: 1.5rem;
}

.financial-metrics {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-weight: 600;
  color: #374151;
}

.metric-value {
  font-weight: 700;
  color: #1f2937;
}

.valuation-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.valuation-method {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.valuation-method h4 {
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.risk-factors {
  background: #fef2f2;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.risk-factors h4 {
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.recommendation-box {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  margin: 1rem 0;
  border: 2px solid #10b981;
}

.rating h2 {
  color: #059669;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.rating p {
  color: #374151;
  margin: 0.25rem 0;
  font-weight: 600;
}

.report-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.9rem;
  color: #6b7280;
  text-align: center;
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

.dark-mode .header-content h1 {
  color: #f8f9fa;
}

.dark-mode .header-content p {
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

.dark-mode .search-bar.focused {
  border-color: #60a5fa;
  box-shadow: 0 4px 20px rgba(96, 165, 250, 0.15);
}

.dark-mode .suggestions-dropdown {
  background: #1f2937;
  border-color: #60a5fa;
}

.dark-mode .suggestions-header {
  background: #111827;
  border-bottom-color: #374151;
  color: #9ca3af;
}

.dark-mode .close-suggestions {
  color: #9ca3af;
}

.dark-mode .close-suggestions:hover {
  background: #374151;
  color: #e5e7eb;
}

.dark-mode .suggestion-item {
  border-bottom-color: #374151;
}

.dark-mode .suggestion-item:hover,
.dark-mode .suggestion-item.highlighted {
  background: #1e3a8a;
  border-left-color: #60a5fa;
}

.dark-mode .stock-symbol {
  color: #f8f9fa;
}

.dark-mode .stock-name {
  color: #9ca3af;
}

.dark-mode .stock-sector {
  background: #374151;
  color: #9ca3af;
}

.dark-mode .suggestion-item.highlighted .stock-sector {
  background: #1e40af;
  color: #93c5fd;
}

.dark-mode .suggestions-list::-webkit-scrollbar-track {
  background: #374151;
}

.dark-mode .suggestions-list::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark-mode .suggestions-list::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

.dark-mode .grid-item {
  background: #2d3748;
  border-color: #4a5568;
}

.dark-mode .loading-state,
.dark-mode .error-state {
  color: #e2e8f0;
}

.dark-mode .error-state h3 {
  color: #f8f9fa;
}

.dark-mode .error-state p {
  color: #9ca3af;
}

.dark-mode .generated-report-section {
  background-color: #1f2937;
  color: #e2e8f0;
  border-color: #374151;
}

.dark-mode .report-header-actions h2 {
  color: #f8f9fa;
}

.dark-mode .close-report-btn {
  color: #9ca3af;
}

.dark-mode .close-report-btn:hover {
  background: #374151;
  color: #e5e7eb;
}

.dark-mode .report-header h1 {
  color: #f8f9fa;
}

.dark-mode .company-info h2 {
  color: #60a5fa;
}

.dark-mode .company-info p {
  color: #9ca3af;
}

.dark-mode .report-date {
  color: #9ca3af;
}

.dark-mode .report-section h3 {
  color: #f8f9fa;
  border-bottom-color: #374151;
}

.dark-mode .key-highlights {
  background: #1e3a8a;
  border-left-color: #60a5fa;
}

.dark-mode .key-highlights h4 {
  color: #f8f9fa;
}

.dark-mode .financial-metrics {
  background: #374151;
}

.dark-mode .metric-label {
  color: #e2e8f0;
}

.dark-mode .metric-value {
  color: #f8f9fa;
}

.dark-mode .valuation-method {
  background: #1e3a8a;
  border-left-color: #60a5fa;
}

.dark-mode .valuation-method h4 {
  color: #f8f9fa;
}

.dark-mode .risk-factors {
  background: #7f1d1d;
  border-left-color: #f87171;
}

.dark-mode .risk-factors h4 {
  color: #f8f9fa;
}

.dark-mode .recommendation-box {
  background: linear-gradient(135deg, #064e3b, #065f46);
  border-color: #10b981;
}

.dark-mode .rating h2 {
  color: #34d399;
}

.dark-mode .rating p {
  color: #e2e8f0;
}

.dark-mode .report-footer {
  border-top-color: #374151;
  color: #9ca3af;
}

/* Enhanced Comprehensive Mobile Responsive Design - Fix Overflow Issues */
@media (max-width: 1400px) {
  .equity-researcher-page {
    padding: 1.75rem 2rem;
    overflow-x: hidden;
    max-width: 100%;
  }
  
  .page-header {
    padding: 1rem;
  }
  
  .header-content {
    max-width: 100%;
  }
  
  .search-generate-section {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .search-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .search-bar {
    width: 100%;
  }
  
  .generate-report-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
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
  
  .header-content h1 {
    font-size: 2.25rem;
  }
  
  .header-content p {
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
  
  .header-content {
    text-align: center;
  }
  
  .header-content h1 {
    font-size: 2rem;
    line-height: 1.2;
    margin-bottom: 0.5rem;
  }
  
  .header-content p {
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
  
  .suggestions-dropdown {
    max-height: 300px;
  }
  
  .suggestion-item {
    padding: 1rem 0.75rem;
  }
  
  .stock-symbol {
    font-size: 0.9rem;
  }
  
  .stock-name {
    font-size: 0.75rem;
  }
  
  .stock-sector {
    font-size: 0.7rem;
    padding: 0.2rem 0.4rem;
  }
  
  .generated-report-section {
    padding: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  
  .report-header-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .report-actions {
    justify-content: center;
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
  
  .header-content h1 {
    font-size: 1.75rem;
    line-height: 1.3;
    margin-bottom: 0.25rem;
  }
  
  .header-content p {
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
  
  .header-content h1 {
    font-size: 1.5rem;
    line-height: 1.2;
  }
  
  .header-content p {
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
  
  .header-content h1 {
    font-size: 1.3rem;
    line-height: 1.2;
    margin-bottom: 0.25rem;
  }
  
  .header-content p {
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
  
  .header-content h1 {
    font-size: 1.1rem;
    line-height: 1.2;
  }
  
  .header-content p {
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
  .header-content h1 {
    font-weight: 700; /* Slightly lighter for mobile readability */
  }
  
  .header-content p {
    line-height: 1.4;
  }
}
</style> 