<template>
  <div class="deal-analyzer">
    <!-- Header -->
    <div class="analyzer-header">
      <h2>Deal Analyzer</h2>
      <button class="save-analysis-btn" @click="saveAnalysis">
        <font-awesome-icon icon="fa-solid fa-save" />
        Save Analysis
      </button>
    </div>

    <!-- Input Form -->
    <div class="analysis-form">
      <div class="form-section">
        <h3>Property Details</h3>
        <div class="input-grid">
          <div class="input-group">
            <label>Property Address</label>
            <input type="text" v-model="dealData.address" placeholder="123 Main St, City, State" />
          </div>
          <div class="input-group">
            <label>Purchase Price</label>
            <input type="number" v-model.number="dealData.purchasePrice" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Down Payment (%)</label>
            <input type="number" v-model.number="dealData.downPaymentPercent" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Interest Rate (%)</label>
            <input type="number" step="0.1" v-model.number="dealData.interestRate" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Loan Term (Years)</label>
            <input type="number" v-model.number="dealData.loanTerm" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Closing Costs</label>
            <input type="number" v-model.number="dealData.closingCosts" @input="calculateMetrics" />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Income & Expenses</h3>
        <div class="input-grid">
          <div class="input-group">
            <label>Monthly Rent</label>
            <input type="number" v-model.number="dealData.monthlyRent" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Other Monthly Income</label>
            <input type="number" v-model.number="dealData.otherIncome" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Property Taxes (Annual)</label>
            <input type="number" v-model.number="dealData.propertyTaxes" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Insurance (Annual)</label>
            <input type="number" v-model.number="dealData.insurance" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Maintenance (Annual)</label>
            <input type="number" v-model.number="dealData.maintenance" @input="calculateMetrics" />
          </div>
          <div class="input-group">
            <label>Vacancy Rate (%)</label>
            <input type="number" v-model.number="dealData.vacancyRate" @input="calculateMetrics" />
          </div>
        </div>
      </div>
    </div>

    <!-- Results Dashboard -->
    <div class="results-dashboard">
      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card cash-flow" :class="results.monthlyCashFlow >= 0 ? 'positive' : 'negative'">
          <div class="metric-icon">
            <font-awesome-icon icon="fa-solid fa-dollar-sign" />
          </div>
          <div class="metric-content">
            <h3>${{ formatNumber(Math.abs(results.monthlyCashFlow)) }}</h3>
            <p>Monthly Cash Flow</p>
            <span class="metric-status">{{ results.monthlyCashFlow >= 0 ? 'Positive' : 'Negative' }}</span>
          </div>
        </div>

        <div class="metric-card cap-rate">
          <div class="metric-icon">
            <font-awesome-icon icon="fa-solid fa-percentage" />
          </div>
          <div class="metric-content">
            <h3>{{ results.capRate }}%</h3>
            <p>Cap Rate</p>
            <span class="metric-status" :class="getCapRateClass(results.capRate)">
              {{ getCapRateLabel(results.capRate) }}
            </span>
          </div>
        </div>

        <div class="metric-card cash-on-cash">
          <div class="metric-icon">
            <font-awesome-icon icon="fa-solid fa-chart-line" />
          </div>
          <div class="metric-content">
            <h3>{{ results.cashOnCashReturn }}%</h3>
            <p>Cash-on-Cash Return</p>
            <span class="metric-status" :class="getCoCRateClass(results.cashOnCashReturn)">
              {{ getCoCLabel(results.cashOnCashReturn) }}
            </span>
          </div>
        </div>

        <div class="metric-card total-roi">
          <div class="metric-icon">
            <font-awesome-icon icon="fa-solid fa-trophy" />
          </div>
          <div class="metric-content">
            <h3>{{ results.totalROI }}%</h3>
            <p>Total ROI (5-Year)</p>
            <span class="metric-status" :class="getROIClass(results.totalROI)">
              {{ getROILabel(results.totalROI) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Detailed Analysis -->
      <div class="analysis-sections">
        <!-- Financing Breakdown -->
        <div class="analysis-card">
          <h3>Financing Breakdown</h3>
          <div class="financing-details">
            <div class="detail-row">
              <span>Purchase Price:</span>
              <span>${{ formatNumber(dealData.purchasePrice) }}</span>
            </div>
            <div class="detail-row">
              <span>Down Payment ({{ dealData.downPaymentPercent }}%):</span>
              <span>${{ formatNumber(results.downPayment) }}</span>
            </div>
            <div class="detail-row">
              <span>Loan Amount:</span>
              <span>${{ formatNumber(results.loanAmount) }}</span>
            </div>
            <div class="detail-row">
              <span>Closing Costs:</span>
              <span>${{ formatNumber(dealData.closingCosts) }}</span>
            </div>
            <div class="detail-row total">
              <span>Total Cash Required:</span>
              <span>${{ formatNumber(results.totalCashRequired) }}</span>
            </div>
            <div class="detail-row">
              <span>Monthly Payment (P&I):</span>
              <span>${{ formatNumber(results.monthlyPayment) }}</span>
            </div>
          </div>
        </div>

        <!-- Cash Flow Analysis -->
        <div class="analysis-card">
          <h3>Monthly Cash Flow Analysis</h3>
          <div class="cash-flow-breakdown">
            <div class="income-section">
              <h4>Income</h4>
              <div class="breakdown-item">
                <span>Rental Income:</span>
                <span>${{ formatNumber(dealData.monthlyRent) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Other Income:</span>
                <span>${{ formatNumber(dealData.otherIncome) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Vacancy Loss:</span>
                <span class="negative">-${{ formatNumber(results.vacancyLoss) }}</span>
              </div>
              <div class="breakdown-item total">
                <span>Net Income:</span>
                <span>${{ formatNumber(results.netIncome) }}</span>
              </div>
            </div>
            
            <div class="expense-section">
              <h4>Expenses</h4>
              <div class="breakdown-item">
                <span>Mortgage Payment:</span>
                <span>${{ formatNumber(results.monthlyPayment) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Property Taxes:</span>
                <span>${{ formatNumber(dealData.propertyTaxes / 12) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Insurance:</span>
                <span>${{ formatNumber(dealData.insurance / 12) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Maintenance:</span>
                <span>${{ formatNumber(dealData.maintenance / 12) }}</span>
              </div>
              <div class="breakdown-item total">
                <span>Total Expenses:</span>
                <span>${{ formatNumber(results.totalExpenses) }}</span>
              </div>
            </div>
          </div>
          
          <div class="cash-flow-result" :class="results.monthlyCashFlow >= 0 ? 'positive' : 'negative'">
            <span>Net Cash Flow:</span>
            <span class="amount">${{ formatNumber(results.monthlyCashFlow) }}/month</span>
          </div>
        </div>

        <!-- Investment Scenarios -->
        <div class="analysis-card">
          <h3>Investment Scenarios</h3>
          <div class="scenarios">
            <div class="scenario-card conservative">
              <h4>Conservative (3% appreciation)</h4>
              <div class="scenario-metrics">
                <div class="metric">
                  <span>5-Year Value:</span>
                  <span>${{ formatNumber(getScenarioValue(3)) }}</span>
                </div>
                <div class="metric">
                  <span>Total Return:</span>
                  <span>${{ formatNumber(getScenarioReturn(3)) }}</span>
                </div>
                <div class="metric">
                  <span>Annualized ROI:</span>
                  <span>{{ getScenarioROI(3) }}%</span>
                </div>
              </div>
            </div>
            
            <div class="scenario-card moderate">
              <h4>Moderate (5% appreciation)</h4>
              <div class="scenario-metrics">
                <div class="metric">
                  <span>5-Year Value:</span>
                  <span>${{ formatNumber(getScenarioValue(5)) }}</span>
                </div>
                <div class="metric">
                  <span>Total Return:</span>
                  <span>${{ formatNumber(getScenarioReturn(5)) }}</span>
                </div>
                <div class="metric">
                  <span>Annualized ROI:</span>
                  <span>{{ getScenarioROI(5) }}%</span>
                </div>
              </div>
            </div>
            
            <div class="scenario-card aggressive">
              <h4>Aggressive (7% appreciation)</h4>
              <div class="scenario-metrics">
                <div class="metric">
                  <span>5-Year Value:</span>
                  <span>${{ formatNumber(getScenarioValue(7)) }}</span>
                </div>
                <div class="metric">
                  <span>Total Return:</span>
                  <span>${{ formatNumber(getScenarioReturn(7)) }}</span>
                </div>
                <div class="metric">
                  <span>Annualized ROI:</span>
                  <span>{{ getScenarioROI(7) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Deal Rating -->
        <div class="analysis-card deal-rating">
          <h3>Deal Rating</h3>
          <div class="rating-container">
            <div class="rating-score" :class="getDealRatingClass(results.dealScore)">
              <span class="score">{{ results.dealScore }}/10</span>
              <span class="rating-label">{{ getDealRatingLabel(results.dealScore) }}</span>
            </div>
            <div class="rating-breakdown">
              <div class="rating-factor">
                <span>Cash Flow:</span>
                <div class="rating-bar">
                  <div class="rating-fill" :style="{ width: getCashFlowRating() * 20 + '%' }"></div>
                </div>
                <span>{{ getCashFlowRating() }}/5</span>
              </div>
              <div class="rating-factor">
                <span>Cap Rate:</span>
                <div class="rating-bar">
                  <div class="rating-fill" :style="{ width: getCapRateRating() * 20 + '%' }"></div>
                </div>
                <span>{{ getCapRateRating() }}/5</span>
              </div>
              <div class="rating-factor">
                <span>Cash-on-Cash:</span>
                <div class="rating-bar">
                  <div class="rating-fill" :style="{ width: getCoCRating() * 20 + '%' }"></div>
                </div>
                <span>{{ getCoCRating() }}/5</span>
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
  faDollarSign, faPercentage, faChartLine, faTrophy, faSave
} from '@fortawesome/free-solid-svg-icons';

library.add(faDollarSign, faPercentage, faChartLine, faTrophy, faSave);

export default {
  name: 'DealAnalyzer',
  components: { FontAwesomeIcon },
  data() {
    return {
      dealData: {
        address: '',
        purchasePrice: 500000,
        downPaymentPercent: 25,
        interestRate: 6.5,
        loanTerm: 30,
        closingCosts: 15000,
        monthlyRent: 2800,
        otherIncome: 0,
        propertyTaxes: 6000,
        insurance: 1200,
        maintenance: 3000,
        vacancyRate: 5
      },
      results: {
        downPayment: 0,
        loanAmount: 0,
        totalCashRequired: 0,
        monthlyPayment: 0,
        netIncome: 0,
        vacancyLoss: 0,
        totalExpenses: 0,
        monthlyCashFlow: 0,
        capRate: 0,
        cashOnCashReturn: 0,
        totalROI: 0,
        dealScore: 0
      }
    };
  },
  
  mounted() {
    this.calculateMetrics();
  },
  
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('en-US').format(Math.round(num));
    },
    
    calculateMetrics() {
      // Financing calculations
      this.results.downPayment = this.dealData.purchasePrice * (this.dealData.downPaymentPercent / 100);
      this.results.loanAmount = this.dealData.purchasePrice - this.results.downPayment;
      this.results.totalCashRequired = this.results.downPayment + this.dealData.closingCosts;
      
      // Monthly payment calculation
      const monthlyRate = this.dealData.interestRate / 100 / 12;
      const numPayments = this.dealData.loanTerm * 12;
      this.results.monthlyPayment = this.results.loanAmount * 
        (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
        (Math.pow(1 + monthlyRate, numPayments) - 1);
      
      // Income calculations
      const grossIncome = this.dealData.monthlyRent + this.dealData.otherIncome;
      this.results.vacancyLoss = grossIncome * (this.dealData.vacancyRate / 100);
      this.results.netIncome = grossIncome - this.results.vacancyLoss;
      
      // Expense calculations
      const monthlyTaxes = this.dealData.propertyTaxes / 12;
      const monthlyInsurance = this.dealData.insurance / 12;
      const monthlyMaintenance = this.dealData.maintenance / 12;
      this.results.totalExpenses = this.results.monthlyPayment + monthlyTaxes + monthlyInsurance + monthlyMaintenance;
      
      // Cash flow
      this.results.monthlyCashFlow = this.results.netIncome - this.results.totalExpenses;
      
      // Cap rate
      const annualNOI = this.results.netIncome * 12 - (this.dealData.propertyTaxes + this.dealData.insurance + this.dealData.maintenance);
      this.results.capRate = ((annualNOI / this.dealData.purchasePrice) * 100).toFixed(2);
      
      // Cash-on-cash return
      const annualCashFlow = this.results.monthlyCashFlow * 12;
      this.results.cashOnCashReturn = ((annualCashFlow / this.results.totalCashRequired) * 100).toFixed(2);
      
      // Total ROI (5-year projection with 5% appreciation)
      const futureValue = this.dealData.purchasePrice * Math.pow(1.05, 5);
      const totalCashFlow = annualCashFlow * 5;
      const totalReturn = (futureValue - this.dealData.purchasePrice) + totalCashFlow;
      this.results.totalROI = ((totalReturn / this.results.totalCashRequired) * 100).toFixed(1);
      
      // Deal score calculation
      this.calculateDealScore();
    },
    
    calculateDealScore() {
      let score = 0;
      
      // Cash flow score (0-3 points)
      if (this.results.monthlyCashFlow > 500) score += 3;
      else if (this.results.monthlyCashFlow > 200) score += 2;
      else if (this.results.monthlyCashFlow > 0) score += 1;
      
      // Cap rate score (0-3 points)
      if (this.results.capRate > 8) score += 3;
      else if (this.results.capRate > 6) score += 2;
      else if (this.results.capRate > 4) score += 1;
      
      // Cash-on-cash score (0-4 points)
      if (this.results.cashOnCashReturn > 15) score += 4;
      else if (this.results.cashOnCashReturn > 12) score += 3;
      else if (this.results.cashOnCashReturn > 8) score += 2;
      else if (this.results.cashOnCashReturn > 5) score += 1;
      
      this.results.dealScore = Math.min(score, 10);
    },
    
    getScenarioValue(appreciation) {
      return this.dealData.purchasePrice * Math.pow(1 + appreciation / 100, 5);
    },
    
    getScenarioReturn(appreciation) {
      const futureValue = this.getScenarioValue(appreciation);
      const totalCashFlow = this.results.monthlyCashFlow * 12 * 5;
      return (futureValue - this.dealData.purchasePrice) + totalCashFlow;
    },
    
    getScenarioROI(appreciation) {
      const totalReturn = this.getScenarioReturn(appreciation);
      return ((totalReturn / this.results.totalCashRequired) * 100).toFixed(1);
    },
    
    // Rating methods
    getCapRateClass(rate) {
      if (rate >= 8) return 'excellent';
      if (rate >= 6) return 'good';
      if (rate >= 4) return 'fair';
      return 'poor';
    },
    
    getCapRateLabel(rate) {
      if (rate >= 8) return 'Excellent';
      if (rate >= 6) return 'Good';
      if (rate >= 4) return 'Fair';
      return 'Poor';
    },
    
    getCoCRateClass(rate) {
      if (rate >= 15) return 'excellent';
      if (rate >= 12) return 'good';
      if (rate >= 8) return 'fair';
      return 'poor';
    },
    
    getCoCLabel(rate) {
      if (rate >= 15) return 'Excellent';
      if (rate >= 12) return 'Good';
      if (rate >= 8) return 'Fair';
      return 'Poor';
    },
    
    getROIClass(roi) {
      if (roi >= 100) return 'excellent';
      if (roi >= 75) return 'good';
      if (roi >= 50) return 'fair';
      return 'poor';
    },
    
    getROILabel(roi) {
      if (roi >= 100) return 'Excellent';
      if (roi >= 75) return 'Good';
      if (roi >= 50) return 'Fair';
      return 'Poor';
    },
    
    getDealRatingClass(score) {
      if (score >= 8) return 'excellent';
      if (score >= 6) return 'good';
      if (score >= 4) return 'fair';
      return 'poor';
    },
    
    getDealRatingLabel(score) {
      if (score >= 8) return 'Excellent Deal';
      if (score >= 6) return 'Good Deal';
      if (score >= 4) return 'Fair Deal';
      return 'Poor Deal';
    },
    
    getCashFlowRating() {
      if (this.results.monthlyCashFlow > 500) return 5;
      if (this.results.monthlyCashFlow > 300) return 4;
      if (this.results.monthlyCashFlow > 100) return 3;
      if (this.results.monthlyCashFlow > 0) return 2;
      return 1;
    },
    
    getCapRateRating() {
      if (this.results.capRate > 8) return 5;
      if (this.results.capRate > 6) return 4;
      if (this.results.capRate > 4) return 3;
      if (this.results.capRate > 2) return 2;
      return 1;
    },
    
    getCoCRating() {
      if (this.results.cashOnCashReturn > 15) return 5;
      if (this.results.cashOnCashReturn > 12) return 4;
      if (this.results.cashOnCashReturn > 8) return 3;
      if (this.results.cashOnCashReturn > 5) return 2;
      return 1;
    },
    
    saveAnalysis() {
      console.log('Saving analysis:', this.dealData, this.results);
      // Implement save functionality
    }
  }
};
</script>

<style scoped>
.deal-analyzer {
  padding: 0;
}

.analyzer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border-radius: 16px 16px 0 0;
  margin-bottom: 2rem;
}

.analyzer-header h2 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.save-analysis-btn {
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

.save-analysis-btn:hover {
  background: rgba(255,255,255,0.2);
}

.analysis-form {
  display: grid;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.form-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.input-group input {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #000000;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-card.positive {
  border-left: 4px solid #10b981;
}

.metric-card.negative {
  border-left: 4px solid #ef4444;
}

.metric-icon {
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

.metric-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
}

.metric-content p {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.metric-status {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.metric-status.excellent { background: #d1fae5; color: #065f46; }
.metric-status.good { background: #fef3c7; color: #92400e; }
.metric-status.fair { background: #e0f2fe; color: #0c4a6e; }
.metric-status.poor { background: #fde2e8; color: #9b1c1c; }

.analysis-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.analysis-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.analysis-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.financing-details,
.cash-flow-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row.total {
  font-weight: 700;
  border-top: 2px solid #1a1a1a;
  border-bottom: none;
  padding-top: 1rem;
}

.income-section,
.expense-section {
  margin-bottom: 1rem;
}

.income-section h4,
.expense-section h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.breakdown-item.total {
  font-weight: 700;
  border-top: 2px solid #1a1a1a;
  border-bottom: none;
  padding-top: 1rem;
}

.breakdown-item .negative {
  color: #ef4444;
}

.cash-flow-result {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
}

.cash-flow-result.positive {
  background: #d1fae5;
  color: #065f46;
}

.cash-flow-result.negative {
  background: #fde2e8;
  color: #9b1c1c;
}

.cash-flow-result .amount {
  font-size: 1.2rem;
}

.scenarios {
  display: grid;
  gap: 1rem;
}

.scenario-card {
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid;
}

.scenario-card.conservative {
  background: #f0f9ff;
  border-left-color: #0ea5e9;
}

.scenario-card.moderate {
  background: #fef3c7;
  border-left-color: #f59e0b;
}

.scenario-card.aggressive {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.scenario-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.scenario-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scenario-metrics .metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.scenario-metrics .metric span:first-child {
  color: #6b7280;
}

.scenario-metrics .metric span:last-child {
  font-weight: 600;
  color: #1a1a1a;
}

.deal-rating {
  grid-column: 1 / -1;
}

.rating-container {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.rating-score {
  text-align: center;
  padding: 2rem;
  border-radius: 12px;
  min-width: 150px;
}

.rating-score.excellent { background: #d1fae5; color: #065f46; }
.rating-score.good { background: #fef3c7; color: #92400e; }
.rating-score.fair { background: #e0f2fe; color: #0c4a6e; }
.rating-score.poor { background: #fde2e8; color: #9b1c1c; }

.rating-score .score {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.rating-score .rating-label {
  font-weight: 600;
  font-size: 1.1rem;
}

.rating-breakdown {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rating-factor {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-factor span:first-child {
  min-width: 100px;
  font-weight: 600;
  color: #374151;
}

.rating-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: linear-gradient(135deg, #000000, #333333);
  transition: width 0.3s ease;
}

.rating-factor span:last-child {
  font-weight: 600;
  color: #1a1a1a;
  min-width: 40px;
}

@media (max-width: 768px) {
  .analyzer-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .analysis-sections {
    grid-template-columns: 1fr;
  }
  
  .rating-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 