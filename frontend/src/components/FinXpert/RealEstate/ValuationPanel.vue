<template>
  <div class="valuation-panel">
    <!-- Header with method selection -->
    <div class="panel-header">
      <h2>Property Valuation</h2>
      <div class="method-tabs">
        <button 
          v-for="method in valuationMethods" 
          :key="method.id"
          :class="{ active: activeMethod === method.id }"
          @click="activeMethod = method.id"
        >
          <font-awesome-icon :icon="method.icon" />
          {{ method.name }}
        </button>
      </div>
    </div>

    <!-- DCF Method -->
    <div v-if="activeMethod === 'dcf'" class="valuation-content">
      <div class="method-description">
        <h3>Discounted Cash Flow (DCF) Analysis</h3>
        <p>Calculate property value based on projected future cash flows discounted to present value.</p>
      </div>

      <div class="dcf-calculator">
        <div class="input-section">
          <h4>Property Information</h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Annual Rental Income</label>
              <input 
                type="number" 
                v-model.number="dcfInputs.annualRent" 
                @input="calculateDCF"
                placeholder="$0"
              />
            </div>
            <div class="input-group">
              <label>Operating Expenses (%)</label>
              <input 
                type="number" 
                v-model.number="dcfInputs.operatingExpenses" 
                @input="calculateDCF"
                placeholder="25"
              />
            </div>
            <div class="input-group">
              <label>Vacancy Rate (%)</label>
              <input 
                type="number" 
                v-model.number="dcfInputs.vacancyRate" 
                @input="calculateDCF"
                placeholder="5"
              />
            </div>
            <div class="input-group">
              <label>Discount Rate (%)</label>
              <input 
                type="number" 
                v-model.number="dcfInputs.discountRate" 
                @input="calculateDCF"
                placeholder="8"
              />
            </div>
            <div class="input-group">
              <label>Growth Rate (%)</label>
              <input 
                type="number" 
                v-model.number="dcfInputs.growthRate" 
                @input="calculateDCF"
                placeholder="3"
              />
            </div>
            <div class="input-group">
              <label>Holding Period (Years)</label>
              <input 
                type="number" 
                v-model.number="dcfInputs.holdingPeriod" 
                @input="calculateDCF"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        <div class="results-section">
          <h4>Valuation Results</h4>
          <div class="results-grid">
            <div class="result-card primary">
              <div class="result-label">DCF Value</div>
              <div class="result-value">${{ formatNumber(dcfResults.totalValue) }}</div>
            </div>
            <div class="result-card">
              <div class="result-label">Annual NOI</div>
              <div class="result-value">${{ formatNumber(dcfResults.noi) }}</div>
            </div>
            <div class="result-card">
              <div class="result-label">Cap Rate</div>
              <div class="result-value">{{ dcfResults.capRate }}%</div>
            </div>
            <div class="result-card">
              <div class="result-label">Terminal Value</div>
              <div class="result-value">${{ formatNumber(dcfResults.terminalValue) }}</div>
            </div>
          </div>

          <!-- Cash Flow Projection Table -->
          <div class="cash-flow-table">
            <h5>10-Year Cash Flow Projection</h5>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Gross Income</th>
                  <th>Operating Expenses</th>
                  <th>Net Operating Income</th>
                  <th>Present Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(year, index) in dcfResults.cashFlows" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>${{ formatNumber(year.grossIncome) }}</td>
                  <td>${{ formatNumber(year.expenses) }}</td>
                  <td>${{ formatNumber(year.noi) }}</td>
                  <td>${{ formatNumber(year.presentValue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparable Method -->
    <div v-if="activeMethod === 'comparable'" class="valuation-content">
      <div class="method-description">
        <h3>Comparable Sales Analysis</h3>
        <p>Estimate property value based on recent sales of similar properties in the area.</p>
      </div>

      <div class="comparable-analysis">
        <div class="property-input">
          <h4>Subject Property</h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Square Footage</label>
              <input 
                type="number" 
                v-model.number="comparableInputs.subjectSqft" 
                @input="calculateComparable"
                placeholder="0"
              />
            </div>
            <div class="input-group">
              <label>Bedrooms</label>
              <input 
                type="number" 
                v-model.number="comparableInputs.subjectBedrooms" 
                @input="calculateComparable"
                placeholder="0"
              />
            </div>
            <div class="input-group">
              <label>Bathrooms</label>
              <input 
                type="number" 
                v-model.number="comparableInputs.subjectBathrooms" 
                @input="calculateComparable"
                placeholder="0"
              />
            </div>
            <div class="input-group">
              <label>Year Built</label>
              <input 
                type="number" 
                v-model.number="comparableInputs.subjectYearBuilt" 
                @input="calculateComparable"
                placeholder="2020"
              />
            </div>
          </div>
        </div>

        <div class="comparables-list">
          <h4>Comparable Properties</h4>
          <div class="comparable-card" v-for="(comp, index) in comparableData" :key="index">
            <div class="comp-header">
              <h5>Comparable {{ index + 1 }}</h5>
              <span class="comp-price">${{ formatNumber(comp.salePrice) }}</span>
            </div>
            <div class="comp-details">
              <div class="comp-spec">{{ comp.sqft }} sqft</div>
              <div class="comp-spec">{{ comp.bedrooms }}bd/{{ comp.bathrooms }}ba</div>
              <div class="comp-spec">Built {{ comp.yearBuilt }}</div>
              <div class="comp-spec">${{ Math.round(comp.salePrice / comp.sqft) }}/sqft</div>
            </div>
            <div class="comp-adjustments">
              <span class="adjustment" 
                :class="comp.adjustment >= 0 ? 'positive' : 'negative'">
                {{ comp.adjustment >= 0 ? '+' : '' }}{{ comp.adjustment }}%
              </span>
              <span class="adjusted-price">${{ formatNumber(comp.adjustedPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="comparable-results">
          <h4>Valuation Summary</h4>
          <div class="summary-grid">
            <div class="summary-item">
              <span>Price per Square Foot Range:</span>
              <span>${{ comparableResults.priceRangeMin }} - ${{ comparableResults.priceRangeMax }}</span>
            </div>
            <div class="summary-item">
              <span>Median Price per Square Foot:</span>
              <span>${{ comparableResults.medianPriceSqft }}</span>
            </div>
            <div class="summary-item primary">
              <span>Estimated Property Value:</span>
              <span>${{ formatNumber(comparableResults.estimatedValue) }}</span>
            </div>
            <div class="summary-item">
              <span>Confidence Level:</span>
              <span class="confidence" :class="comparableResults.confidence.toLowerCase()">
                {{ comparableResults.confidence }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Income Method -->
    <div v-if="activeMethod === 'income'" class="valuation-content">
      <div class="method-description">
        <h3>Income Capitalization Approach</h3>
        <p>Value property based on its income-generating potential using cap rates.</p>
      </div>

      <div class="income-calculator">
        <div class="input-section">
          <h4>Income & Expense Analysis</h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Gross Annual Rent</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.grossRent" 
                @input="calculateIncome"
                placeholder="$0"
              />
            </div>
            <div class="input-group">
              <label>Other Income (Annual)</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.otherIncome" 
                @input="calculateIncome"
                placeholder="$0"
              />
            </div>
            <div class="input-group">
              <label>Vacancy Rate (%)</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.vacancyRate" 
                @input="calculateIncome"
                placeholder="5"
              />
            </div>
            <div class="input-group">
              <label>Property Taxes</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.propertyTaxes" 
                @input="calculateIncome"
                placeholder="$0"
              />
            </div>
            <div class="input-group">
              <label>Insurance</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.insurance" 
                @input="calculateIncome"
                placeholder="$0"
              />
            </div>
            <div class="input-group">
              <label>Maintenance & Repairs</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.maintenance" 
                @input="calculateIncome"
                placeholder="$0"
              />
            </div>
            <div class="input-group">
              <label>Management Fees</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.management" 
                @input="calculateIncome"
                placeholder="$0"
              />
            </div>
            <div class="input-group">
              <label>Market Cap Rate (%)</label>
              <input 
                type="number" 
                v-model.number="incomeInputs.capRate" 
                @input="calculateIncome"
                placeholder="6.5"
              />
            </div>
          </div>
        </div>

        <div class="income-results">
          <h4>Valuation Results</h4>
          <div class="income-breakdown">
            <div class="breakdown-section">
              <h5>Annual Income</h5>
              <div class="breakdown-item">
                <span>Gross Rental Income:</span>
                <span>${{ formatNumber(incomeResults.grossIncome) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Other Income:</span>
                <span>${{ formatNumber(incomeInputs.otherIncome) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Vacancy Loss:</span>
                <span class="negative">-${{ formatNumber(incomeResults.vacancyLoss) }}</span>
              </div>
              <div class="breakdown-item total">
                <span>Effective Gross Income:</span>
                <span>${{ formatNumber(incomeResults.effectiveGrossIncome) }}</span>
              </div>
            </div>

            <div class="breakdown-section">
              <h5>Annual Expenses</h5>
              <div class="breakdown-item">
                <span>Property Taxes:</span>
                <span>${{ formatNumber(incomeInputs.propertyTaxes) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Insurance:</span>
                <span>${{ formatNumber(incomeInputs.insurance) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Maintenance & Repairs:</span>
                <span>${{ formatNumber(incomeInputs.maintenance) }}</span>
              </div>
              <div class="breakdown-item">
                <span>Management Fees:</span>
                <span>${{ formatNumber(incomeInputs.management) }}</span>
              </div>
              <div class="breakdown-item total">
                <span>Total Operating Expenses:</span>
                <span>${{ formatNumber(incomeResults.totalExpenses) }}</span>
              </div>
            </div>

            <div class="final-results">
              <div class="result-item noi">
                <span>Net Operating Income (NOI):</span>
                <span>${{ formatNumber(incomeResults.noi) }}</span>
              </div>
              <div class="result-item value">
                <span>Property Value (NOI ÷ Cap Rate):</span>
                <span>${{ formatNumber(incomeResults.propertyValue) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Comparison -->
    <div class="valuation-summary">
      <h3>Valuation Summary</h3>
      <div class="summary-comparison">
        <div class="method-result">
          <div class="method-name">DCF Analysis</div>
          <div class="method-value">${{ formatNumber(dcfResults.totalValue) }}</div>
        </div>
        <div class="method-result">
          <div class="method-name">Comparable Sales</div>
          <div class="method-value">${{ formatNumber(comparableResults.estimatedValue) }}</div>
        </div>
        <div class="method-result">
          <div class="method-name">Income Approach</div>
          <div class="method-value">${{ formatNumber(incomeResults.propertyValue) }}</div>
        </div>
        <div class="method-result final">
          <div class="method-name">Average Valuation</div>
          <div class="method-value">${{ formatNumber(averageValuation) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faCalculator, faChartBar, faDollarSign
} from '@fortawesome/free-solid-svg-icons';

library.add(faCalculator, faChartBar, faDollarSign);

export default {
  name: 'ValuationPanel',
  components: { FontAwesomeIcon },
  data() {
    return {
      activeMethod: 'dcf',
      valuationMethods: [
        { id: 'dcf', name: 'DCF Analysis', icon: 'fa-solid fa-calculator' },
        { id: 'comparable', name: 'Comparable Sales', icon: 'fa-solid fa-chart-bar' },
        { id: 'income', name: 'Income Approach', icon: 'fa-solid fa-dollar-sign' }
      ],
      
      // DCF Inputs
      dcfInputs: {
        annualRent: 54000,
        operatingExpenses: 25,
        vacancyRate: 5,
        discountRate: 8,
        growthRate: 3,
        holdingPeriod: 10
      },
      
      // DCF Results
      dcfResults: {
        totalValue: 0,
        noi: 0,
        capRate: 0,
        terminalValue: 0,
        cashFlows: []
      },
      
      // Comparable Inputs
      comparableInputs: {
        subjectSqft: 1200,
        subjectBedrooms: 2,
        subjectBathrooms: 2,
        subjectYearBuilt: 2018
      },
      
      // Comparable Data
      comparableData: [
        {
          salePrice: 920000,
          sqft: 1180,
          bedrooms: 2,
          bathrooms: 2,
          yearBuilt: 2019,
          adjustment: -2,
          adjustedPrice: 901600
        },
        {
          salePrice: 875000,
          sqft: 1250,
          bedrooms: 2,
          bathrooms: 2,
          yearBuilt: 2017,
          adjustment: 5,
          adjustedPrice: 918750
        },
        {
          salePrice: 950000,
          sqft: 1300,
          bedrooms: 3,
          bathrooms: 2,
          yearBuilt: 2020,
          adjustment: -8,
          adjustedPrice: 874000
        }
      ],
      
      // Comparable Results
      comparableResults: {
        priceRangeMin: 672,
        priceRangeMax: 779,
        medianPriceSqft: 725,
        estimatedValue: 870000,
        confidence: 'High'
      },
      
      // Income Inputs
      incomeInputs: {
        grossRent: 54000,
        otherIncome: 2400,
        vacancyRate: 5,
        propertyTaxes: 12000,
        insurance: 3600,
        maintenance: 5400,
        management: 5400,
        capRate: 6.5
      },
      
      // Income Results
      incomeResults: {
        grossIncome: 54000,
        vacancyLoss: 2700,
        effectiveGrossIncome: 53700,
        totalExpenses: 26400,
        noi: 27300,
        propertyValue: 420000
      }
    };
  },
  
  computed: {
    averageValuation() {
      const values = [
        this.dcfResults.totalValue,
        this.comparableResults.estimatedValue,
        this.incomeResults.propertyValue
      ].filter(val => val > 0);
      
      return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    }
  },
  
  mounted() {
    this.calculateDCF();
    this.calculateComparable();
    this.calculateIncome();
  },
  
  methods: {
    formatNumber(num) {
      return new Intl.NumberFormat('en-US').format(Math.round(num));
    },
    
    calculateDCF() {
      const { annualRent, operatingExpenses, vacancyRate, discountRate, growthRate, holdingPeriod } = this.dcfInputs;
      
      // Calculate base NOI
      const effectiveGrossIncome = annualRent * (1 - vacancyRate / 100);
      const noi = effectiveGrossIncome * (1 - operatingExpenses / 100);
      
      // Generate cash flows
      const cashFlows = [];
      let presentValue = 0;
      
      for (let year = 1; year <= holdingPeriod; year++) {
        const yearlyNOI = noi * Math.pow(1 + growthRate / 100, year - 1);
        const yearlyGrossIncome = annualRent * Math.pow(1 + growthRate / 100, year - 1);
        const yearlyExpenses = yearlyGrossIncome * (operatingExpenses / 100) + 
                              (yearlyGrossIncome * vacancyRate / 100);
        
        const pv = yearlyNOI / Math.pow(1 + discountRate / 100, year);
        presentValue += pv;
        
        cashFlows.push({
          grossIncome: yearlyGrossIncome,
          expenses: yearlyExpenses,
          noi: yearlyNOI,
          presentValue: pv
        });
      }
      
      // Calculate terminal value
      const finalYearNOI = noi * Math.pow(1 + growthRate / 100, holdingPeriod);
      const terminalCapRate = (discountRate - growthRate) / 100;
      const terminalValue = finalYearNOI / terminalCapRate;
      const presentTerminalValue = terminalValue / Math.pow(1 + discountRate / 100, holdingPeriod);
      
      const totalValue = presentValue + presentTerminalValue;
      
      this.dcfResults = {
        totalValue,
        noi,
        capRate: (noi / totalValue * 100).toFixed(2),
        terminalValue: presentTerminalValue,
        cashFlows
      };
    },
    
    calculateComparable() {
      // Recalculate adjustments and estimated value
      this.comparableData.forEach(comp => {
        // Simple adjustment based on size and age difference
        let adjustment = 0;
        
        // Size adjustment
        const sizeDiff = (comp.sqft - this.comparableInputs.subjectSqft) / this.comparableInputs.subjectSqft;
        adjustment += sizeDiff * 10; // 10% per size difference
        
        // Age adjustment
        const ageDiff = comp.yearBuilt - this.comparableInputs.subjectYearBuilt;
        adjustment += ageDiff * 0.5; // 0.5% per year difference
        
        comp.adjustment = Math.round(adjustment * 100) / 100;
        comp.adjustedPrice = comp.salePrice * (1 + comp.adjustment / 100);
      });
      
      // Calculate results
      const pricesPerSqft = this.comparableData.map(comp => comp.adjustedPrice / comp.sqft);
      const medianPrice = pricesPerSqft.sort((a, b) => a - b)[Math.floor(pricesPerSqft.length / 2)];
      
      this.comparableResults = {
        priceRangeMin: Math.round(Math.min(...pricesPerSqft)),
        priceRangeMax: Math.round(Math.max(...pricesPerSqft)),
        medianPriceSqft: Math.round(medianPrice),
        estimatedValue: Math.round(medianPrice * this.comparableInputs.subjectSqft),
        confidence: 'High'
      };
    },
    
    calculateIncome() {
      const {
        grossRent, otherIncome, vacancyRate, propertyTaxes,
        insurance, maintenance, management, capRate
      } = this.incomeInputs;
      
      const vacancyLoss = grossRent * (vacancyRate / 100);
      const effectiveGrossIncome = grossRent + otherIncome - vacancyLoss;
      const totalExpenses = propertyTaxes + insurance + maintenance + management;
      const noi = effectiveGrossIncome - totalExpenses;
      const propertyValue = noi / (capRate / 100);
      
      this.incomeResults = {
        grossIncome: grossRent,
        vacancyLoss,
        effectiveGrossIncome,
        totalExpenses,
        noi,
        propertyValue
      };
    }
  }
};
</script>

<style scoped>
.valuation-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  overflow: hidden;
}

.panel-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.panel-header h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
}

.method-tabs {
  display: flex;
  gap: 0.5rem;
}

.method-tabs button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.method-tabs button.active,
.method-tabs button:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

.valuation-content {
  padding: 2rem;
}

.method-description {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.method-description h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

.method-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.input-section h4,
.results-section h4,
.income-results h4 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
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

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
}

.result-card.primary {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
}

.result-label {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.result-card.primary .result-label {
  color: #e5e7eb;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.result-card.primary .result-value {
  color: white;
}

.cash-flow-table {
  margin-top: 2rem;
}

.cash-flow-table h5 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.cash-flow-table table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.cash-flow-table th,
.cash-flow-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.cash-flow-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #374151;
}

.cash-flow-table td {
  color: #1a1a1a;
}

/* Comparable Styles */
.comparable-card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.comp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.comp-header h5 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.comp-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000000;
}

.comp-details {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.comp-spec {
  font-size: 0.9rem;
  color: #6b7280;
  background: #f8f9fa;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.comp-adjustments {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.adjustment {
  font-weight: 600;
  font-size: 0.9rem;
}

.adjustment.positive { color: #10b981; }
.adjustment.negative { color: #ef4444; }

.adjusted-price {
  font-weight: 700;
  color: #1a1a1a;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item.primary {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
}

.confidence.high { color: #10b981; }
.confidence.medium { color: #f59e0b; }
.confidence.low { color: #ef4444; }

/* Income Styles */
.income-breakdown {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.breakdown-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.breakdown-section h5 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.breakdown-item:last-child {
  border-bottom: none;
}

.breakdown-item.total {
  font-weight: 700;
  padding-top: 1rem;
  border-top: 2px solid #1a1a1a;
  border-bottom: none;
}

.breakdown-item .negative {
  color: #ef4444;
}

.final-results {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-top: 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.result-item.noi {
  font-size: 1.1rem;
  font-weight: 600;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.result-item.value {
  font-size: 1.3rem;
  font-weight: 700;
  padding-top: 1rem;
}

/* Valuation Summary */
.valuation-summary {
  padding: 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e5e7eb;
}

.valuation-summary h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
}

.summary-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.method-result {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.method-result.final {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
}

.method-name {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.method-result.final .method-name {
  color: #e5e7eb;
}

.method-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.method-result.final .method-value {
  color: white;
}

@media (max-width: 768px) {
  .method-tabs {
    flex-direction: column;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .comp-details {
    flex-wrap: wrap;
  }
  
  .income-breakdown {
    grid-template-columns: 1fr;
  }
  
  .summary-comparison {
    grid-template-columns: 1fr;
  }
}
</style> 