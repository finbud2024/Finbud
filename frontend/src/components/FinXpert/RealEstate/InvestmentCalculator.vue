<template>
  <div class="investment-calculator">
    <!-- Header -->
    <div class="calc-header">
      <h2>
        <i class="fas fa-chart-line"></i>
        Máy Tính Đầu Tư Bất Động Sản
      </h2>
      <p class="subtitle">Phân tích lợi nhuận và rủi ro đầu tư chi tiết</p>
    </div>

    <!-- Quick Summary Cards -->
    <div class="summary-cards" v-if="hasCalculated">
      <div class="summary-card roi">
        <div class="card-icon">
          <i class="fas fa-percentage"></i>
        </div>
        <div class="card-content">
          <h3>{{ formatPercentage(results.roi) }}</h3>
          <p>ROI Hàng Năm</p>
        </div>
      </div>
      <div class="summary-card cash-flow">
        <div class="card-icon">
          <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="card-content">
          <h3>{{ formatCurrency(results.monthlyCashFlow) }}</h3>
          <p>Cash Flow/Tháng</p>
        </div>
      </div>
      <div class="summary-card break-even">
        <div class="card-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="card-content">
          <h3>{{ results.breakEvenYears }} năm</h3>
          <p>Thời gian hòa vốn</p>
        </div>
      </div>
      <div class="summary-card total-return">
        <div class="card-icon">
          <i class="fas fa-trophy"></i>
        </div>
        <div class="card-content">
          <h3>{{ formatCurrency(results.totalReturn5Years) }}</h3>
          <p>Lợi nhuận 5 năm</p>
        </div>
      </div>
    </div>

    <!-- Main Calculator -->
    <div class="calculator-layout">
      <!-- Input Panel -->
      <div class="input-panel">
        <h3>Thông tin đầu vào</h3>
        
        <!-- Property Details -->
        <div class="input-section">
          <h4><i class="fas fa-home"></i> Thông tin bất động sản</h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Giá mua (VNĐ)</label>
              <input v-model.number="inputs.purchasePrice" type="number" class="form-input">
            </div>
            <div class="input-group">
              <label>Vốn ban đầu (%)</label>
              <input v-model.number="inputs.downPayment" type="number" class="form-input">
            </div>
            <div class="input-group">
              <label>Thu nhập thuê/tháng (VNĐ)</label>
              <input v-model.number="inputs.monthlyRent" type="number" class="form-input">
            </div>
            <div class="input-group">
              <label>Tỷ lệ lấp đầy (%)</label>
              <input v-model.number="inputs.occupancyRate" type="number" class="form-input">
            </div>
          </div>
        </div>

        <!-- Loan Information -->
        <div class="input-section">
          <h4><i class="fas fa-bank"></i> Thông tin vay vốn</h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Lãi suất (%/năm)</label>
              <input v-model.number="inputs.interestRate" type="number" step="0.1" class="form-input">
            </div>
            <div class="input-group">
              <label>Thời hạn vay (năm)</label>
              <input v-model.number="inputs.loanTerm" type="number" class="form-input">
            </div>
          </div>
        </div>

        <!-- Operating Expenses -->
        <div class="input-section">
          <h4><i class="fas fa-calculator"></i> Chi phí vận hành</h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Quản lý (%/tháng)</label>
              <input v-model.number="inputs.managementFee" type="number" step="0.1" class="form-input">
            </div>
            <div class="input-group">
              <label>Bảo trì (%/năm)</label>
              <input v-model.number="inputs.maintenance" type="number" step="0.1" class="form-input">
            </div>
            <div class="input-group">
              <label>Bảo hiểm (%/năm)</label>
              <input v-model.number="inputs.insurance" type="number" step="0.1" class="form-input">
            </div>
            <div class="input-group">
              <label>Thuế tài sản (%/năm)</label>
              <input v-model.number="inputs.propertyTax" type="number" step="0.1" class="form-input">
            </div>
          </div>
        </div>

        <!-- Market Assumptions -->
        <div class="input-section">
          <h4><i class="fas fa-trending-up"></i> Dự báo thị trường</h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Tăng giá BĐS (%/năm)</label>
              <input v-model.number="inputs.appreciation" type="number" step="0.1" class="form-input">
            </div>
            <div class="input-group">
              <label>Tăng tiền thuê (%/năm)</label>
              <input v-model.number="inputs.rentGrowth" type="number" step="0.1" class="form-input">
            </div>
          </div>
        </div>

        <button @click="calculate" class="calculate-btn">
          <i class="fas fa-calculator"></i>
          Tính toán & Phân tích
        </button>
      </div>

      <!-- Results Panel -->
      <div class="results-panel" v-if="hasCalculated">
        <!-- Financial Analysis -->
        <div class="analysis-section">
          <h3>Phân tích tài chính</h3>
          
          <!-- Cash Flow Analysis -->
          <div class="cash-flow-table">
            <h4>Cash Flow Hàng Tháng</h4>
            <div class="table-row header">
              <span>Khoản mục</span>
              <span>Số tiền</span>
            </div>
            <div class="table-row">
              <span>Thu nhập thuê</span>
              <span class="positive">{{ formatCurrency(results.grossRentalIncome) }}</span>
            </div>
            <div class="table-row">
              <span>Trả góp ngân hàng</span>
              <span class="negative">-{{ formatCurrency(results.monthlyMortgage) }}</span>
            </div>
            <div class="table-row">
              <span>Chi phí quản lý</span>
              <span class="negative">-{{ formatCurrency(results.monthlyManagement) }}</span>
            </div>
            <div class="table-row">
              <span>Chi phí khác</span>
              <span class="negative">-{{ formatCurrency(results.monthlyOtherExpenses) }}</span>
            </div>
            <div class="table-row total">
              <span>Cash Flow ròng</span>
              <span :class="results.monthlyCashFlow >= 0 ? 'positive' : 'negative'">
                {{ results.monthlyCashFlow >= 0 ? '' : '-' }}{{ formatCurrency(Math.abs(results.monthlyCashFlow)) }}
              </span>
            </div>
          </div>

          <!-- Key Metrics -->
          <div class="metrics-grid">
            <div class="metric-item">
              <span class="metric-label">Cap Rate:</span>
              <span class="metric-value">{{ formatPercentage(results.capRate) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Cash-on-Cash Return:</span>
              <span class="metric-value">{{ formatPercentage(results.cashOnCashReturn) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Debt Service Coverage:</span>
              <span class="metric-value">{{ results.debtServiceCoverage.toFixed(2) }}x</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">Loan-to-Value:</span>
              <span class="metric-value">{{ formatPercentage(results.loanToValue) }}</span>
            </div>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="risk-section">
          <h3>Đánh giá rủi ro</h3>
          <div class="risk-indicators">
            <div class="risk-item" :class="getRiskLevel(results.riskScore)">
              <div class="risk-icon">
                <i :class="getRiskIcon(results.riskScore)"></i>
              </div>
              <div class="risk-content">
                <h4>{{ getRiskText(results.riskScore) }}</h4>
                <p>{{ getRiskDescription(results.riskScore) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Sensitivity Analysis -->
          <div class="sensitivity-analysis">
            <h4>Phân tích độ nhạy</h4>
            <div class="sensitivity-item">
              <span>Nếu tiền thuê giảm 10%:</span>
              <span class="impact negative">{{ formatCurrency(results.rentDecreaseImpact) }}</span>
            </div>
            <div class="sensitivity-item">
              <span>Nếu lãi suất tăng 1%:</span>
              <span class="impact negative">{{ formatCurrency(results.interestIncreaseImpact) }}</span>
            </div>
            <div class="sensitivity-item">
              <span>Nếu vacancy tăng 5%:</span>
              <span class="impact negative">{{ formatCurrency(results.vacancyImpact) }}</span>
            </div>
          </div>
        </div>

        <!-- Investment Guidance -->
        <div class="guidance-section">
          <h3>Hướng dẫn đầu tư</h3>
          <div class="guidance-list">
            <div v-for="guide in guidanceItems" :key="guide.id" class="guidance-item" :class="guide.type">
              <div class="guide-icon">
                <i :class="guide.icon"></i>
              </div>
              <div class="guide-content">
                <h5>{{ guide.title }}</h5>
                <p>{{ guide.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InvestmentCalculator',
  data() {
    return {
      hasCalculated: false,
      inputs: {
        purchasePrice: 3000000000,
        downPayment: 30,
        monthlyRent: 25000000,
        occupancyRate: 95,
        interestRate: 8.5,
        loanTerm: 20,
        managementFee: 8,
        maintenance: 1.5,
        insurance: 0.3,
        propertyTax: 0.5,
        appreciation: 6,
        rentGrowth: 4
      },
      results: {}
    }
  },
  
  computed: {
    loanAmount() {
      return this.inputs.purchasePrice * (1 - this.inputs.downPayment / 100)
    },
    
    downPaymentAmount() {
      return this.inputs.purchasePrice * (this.inputs.downPayment / 100)
    },
    
    guidanceItems() {
      const items = []
      
      if (this.results.roi > 15) {
        items.push({
          id: 1,
          type: 'success',
          icon: 'fas fa-check-circle',
          title: 'Đầu tư rất tốt',
          description: `ROI ${this.formatPercentage(this.results.roi)} vượt mức kỳ vọng. Đây là cơ hội đầu tư hấp dẫn.`
        })
      } else if (this.results.roi > 10) {
        items.push({
          id: 1,
          type: 'info',
          icon: 'fas fa-thumbs-up',
          title: 'Đầu tư khả quan',
          description: `ROI ${this.formatPercentage(this.results.roi)} ở mức tốt, phù hợp với thị trường hiện tại.`
        })
      } else {
        items.push({
          id: 1,
          type: 'warning',
          icon: 'fas fa-exclamation-triangle',
          title: 'Cần cân nhắc',
          description: `ROI ${this.formatPercentage(this.results.roi)} thấp hơn kỳ vọng. Xem xét giảm giá mua hoặc tăng tiền thuê.`
        })
      }
      
      if (this.results.monthlyCashFlow < 0) {
        items.push({
          id: 2,
          type: 'warning',
          icon: 'fas fa-minus-circle',
          title: 'Cash flow âm',
          description: 'Bạn cần bù tiền hàng tháng. Đảm bảo có dự phòng tài chính đủ.'
        })
      }
      
      if (this.results.debtServiceCoverage < 1.2) {
        items.push({
          id: 3,
          type: 'warning',
          icon: 'fas fa-shield-alt',
          title: 'Tỷ số an toàn thấp',
          description: 'DSCR dưới 1.2 cho thấy rủi ro thanh toán cao. Cân nhắc tăng vốn ban đầu.'
        })
      }
      
      items.push({
        id: 4,
        type: 'info',
        icon: 'fas fa-lightbulb',
        title: 'Lời khuyên chung',
        description: 'Luôn có dự phòng 6-12 tháng chi phí. Đa dạng hóa danh mục đầu tư để giảm rủi ro.'
      })
      
      return items
    }
  },
  
  methods: {
    calculate() {
      const monthlyPayment = this.calculateMonthlyPayment()
      const grossRentalIncome = this.inputs.monthlyRent * (this.inputs.occupancyRate / 100)
      const monthlyManagement = grossRentalIncome * (this.inputs.managementFee / 100)
      const monthlyOtherExpenses = this.inputs.purchasePrice * (this.inputs.maintenance + this.inputs.insurance + this.inputs.propertyTax) / 100 / 12
      const monthlyCashFlow = grossRentalIncome - monthlyPayment - monthlyManagement - monthlyOtherExpenses
      
      const annualCashFlow = monthlyCashFlow * 12
      const annualRentalIncome = grossRentalIncome * 12
      const annualExpenses = (monthlyPayment + monthlyManagement + monthlyOtherExpenses) * 12
      const netOperatingIncome = annualRentalIncome - (monthlyManagement + monthlyOtherExpenses) * 12
      
      const capRate = (netOperatingIncome / this.inputs.purchasePrice) * 100
      const cashOnCashReturn = (annualCashFlow / this.downPaymentAmount) * 100
      const debtServiceCoverage = netOperatingIncome / (monthlyPayment * 12)
      const loanToValue = (this.loanAmount / this.inputs.purchasePrice) * 100
      
      // 5-year projection
      const totalReturn5Years = this.calculate5YearReturn()
      const breakEvenYears = this.calculateBreakEvenYears()
      
      // Risk assessment
      const riskScore = this.calculateRiskScore(debtServiceCoverage, loanToValue, capRate)
      
      // Sensitivity analysis
      const rentDecreaseImpact = (grossRentalIncome * 0.1) * 12
      const interestIncreaseImpact = this.calculateInterestImpact()
      const vacancyImpact = (grossRentalIncome * 0.05) * 12
      
      this.results = {
        monthlyMortgage: monthlyPayment,
        grossRentalIncome,
        monthlyManagement,
        monthlyOtherExpenses,
        monthlyCashFlow,
        roi: cashOnCashReturn,
        capRate,
        cashOnCashReturn,
        debtServiceCoverage,
        loanToValue,
        totalReturn5Years,
        breakEvenYears,
        riskScore,
        rentDecreaseImpact,
        interestIncreaseImpact,
        vacancyImpact
      }
      
      this.hasCalculated = true
    },
    
    calculateMonthlyPayment() {
      const principal = this.loanAmount
      const monthlyRate = this.inputs.interestRate / 100 / 12
      const numPayments = this.inputs.loanTerm * 12
      
      if (monthlyRate === 0) return principal / numPayments
      
      return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
             (Math.pow(1 + monthlyRate, numPayments) - 1)
    },
    
    calculate5YearReturn() {
      let totalReturn = 0
      let currentRent = this.inputs.monthlyRent * (this.inputs.occupancyRate / 100)
      
      for (let year = 1; year <= 5; year++) {
        const annualCashFlow = (currentRent - this.results.monthlyMortgage - this.results.monthlyManagement - this.results.monthlyOtherExpenses) * 12
        totalReturn += annualCashFlow
        currentRent *= (1 + this.inputs.rentGrowth / 100)
      }
      
      // Add appreciation
      const futureValue = this.inputs.purchasePrice * Math.pow(1 + this.inputs.appreciation / 100, 5)
      totalReturn += futureValue - this.inputs.purchasePrice
      
      return totalReturn
    },
    
    calculateBreakEvenYears() {
      const initialInvestment = this.downPaymentAmount
      const annualCashFlow = this.results.monthlyCashFlow * 12
      
      if (annualCashFlow <= 0) return '∞'
      
      return (initialInvestment / annualCashFlow).toFixed(1)
    },
    
    calculateRiskScore(dscr, ltv, capRate) {
      let score = 0
      
      // DSCR scoring
      if (dscr >= 1.5) score += 30
      else if (dscr >= 1.2) score += 20
      else if (dscr >= 1.0) score += 10
      
      // LTV scoring
      if (ltv <= 70) score += 30
      else if (ltv <= 80) score += 20
      else if (ltv <= 90) score += 10
      
      // Cap Rate scoring
      if (capRate >= 8) score += 40
      else if (capRate >= 6) score += 30
      else if (capRate >= 4) score += 20
      else score += 10
      
      return score
    },
    
    calculateInterestImpact() {
      const newRate = this.inputs.interestRate + 1
      const newPayment = this.loanAmount * (newRate / 100 / 12 * Math.pow(1 + newRate / 100 / 12, this.inputs.loanTerm * 12)) / 
                         (Math.pow(1 + newRate / 100 / 12, this.inputs.loanTerm * 12) - 1)
      return (newPayment - this.results.monthlyMortgage) * 12
    },
    
    getRiskLevel(score) {
      if (score >= 80) return 'low'
      if (score >= 60) return 'medium'
      return 'high'
    },
    
    getRiskIcon(score) {
      if (score >= 80) return 'fas fa-shield-alt'
      if (score >= 60) return 'fas fa-exclamation-triangle'
      return 'fas fa-exclamation-circle'
    },
    
    getRiskText(score) {
      if (score >= 80) return 'Rủi ro thấp'
      if (score >= 60) return 'Rủi ro trung bình'
      return 'Rủi ro cao'
    },
    
    getRiskDescription(score) {
      if (score >= 80) return 'Đầu tư an toàn với các chỉ số tài chính tốt.'
      if (score >= 60) return 'Đầu tư khả quan nhưng cần theo dõi thường xuyên.'
      return 'Đầu tư có rủi ro cao, cần cân nhắc kỹ trước khi quyết định.'
    },
    
    formatCurrency(amount) {
      if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)} tỷ`
      } else if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(1)} tr`
      }
      return `${amount.toLocaleString()}`
    },
    
    formatPercentage(value) {
      return `${value.toFixed(1)}%`
    }
  }
}
</script>

<style scoped>
.investment-calculator {
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.calc-header {
  text-align: center;
  margin-bottom: 2rem;
}

.calc-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.calc-header h2 i {
  color: #2563eb;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.roi .card-icon {
  background: linear-gradient(45deg, #059669, #10b981);
}

.cash-flow .card-icon {
  background: linear-gradient(45deg, #2563eb, #3b82f6);
}

.break-even .card-icon {
  background: linear-gradient(45deg, #d97706, #f59e0b);
}

.total-return .card-icon {
  background: linear-gradient(45deg, #7c3aed, #8b5cf6);
}

.card-content h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.card-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.calculator-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-panel, .results-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  height: fit-content;
}

.input-panel h3, .results-panel h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
}

.input-section {
  margin-bottom: 2rem;
}

.input-section h4 {
  color: #374151;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.input-section h4 i {
  color: #2563eb;
}

.input-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  color: #374151;
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.calculate-btn {
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.calculate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
}

.analysis-section, .risk-section, .guidance-section {
  margin-bottom: 2rem;
}

.analysis-section h3, .risk-section h3, .guidance-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.cash-flow-table {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.cash-flow-table h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.table-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row.header {
  font-weight: 600;
  color: #374151;
  border-bottom: 2px solid #d1d5db;
}

.table-row.total {
  font-weight: 700;
  background: white;
  margin: 0.5rem -1rem -1rem;
  padding: 0.75rem 1rem;
  border-radius: 0 0 8px 8px;
}

.positive {
  color: #059669;
  font-weight: 600;
}

.negative {
  color: #dc2626;
  font-weight: 600;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.metric-label {
  color: #6b7280;
  font-size: 0.9rem;
}

.metric-value {
  font-weight: 600;
  color: #1f2937;
}

.risk-indicators {
  margin-bottom: 1.5rem;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.risk-item.low {
  background: #ecfdf5;
  border-left-color: #059669;
}

.risk-item.medium {
  background: #fef3c7;
  border-left-color: #d97706;
}

.risk-item.high {
  background: #fee2e2;
  border-left-color: #dc2626;
}

.risk-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.risk-item.low .risk-icon {
  background: #d1fae5;
  color: #059669;
}

.risk-item.medium .risk-icon {
  background: #fed7aa;
  color: #d97706;
}

.risk-item.high .risk-icon {
  background: #fecaca;
  color: #dc2626;
}

.risk-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.risk-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.sensitivity-analysis h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.sensitivity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.sensitivity-item span:first-child {
  color: #374151;
  font-weight: 500;
}

.impact {
  font-weight: 600;
}

.impact.negative {
  color: #dc2626;
}

.guidance-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guidance-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.guidance-item.success {
  background: #ecfdf5;
  border-left-color: #059669;
}

.guidance-item.info {
  background: #eff6ff;
  border-left-color: #2563eb;
}

.guidance-item.warning {
  background: #fef3c7;
  border-left-color: #d97706;
}

.guide-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.guidance-item.success .guide-icon {
  background: #d1fae5;
  color: #059669;
}

.guidance-item.info .guide-icon {
  background: #dbeafe;
  color: #2563eb;
}

.guidance-item.warning .guide-icon {
  background: #fed7aa;
  color: #d97706;
}

.guide-content h5 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.guide-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 1024px) {
  .calculator-layout {
    grid-template-columns: 1fr;
  }
  
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .investment-calculator {
    padding: 1rem;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .input-panel, .results-panel {
    padding: 1.5rem;
  }
}
</style> 