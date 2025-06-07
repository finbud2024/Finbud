<template>
  <div class="rent-buy-calculator">
    <!-- Header -->
    <div class="calculator-header">
      <h2>
        <i class="fas fa-balance-scale"></i>
        Máy Tính So Sánh Thuê vs Mua
      </h2>
      <p class="subtitle">Phân tích chi tiết để đưa ra quyết định tài chính thông minh</p>
    </div>

    <!-- Quick Result Card -->
    <div class="quick-result-card" v-if="hasCalculated">
      <div class="result-header">
        <h3>Kết quả phân tích</h3>
        <div class="recommendation" :class="recommendation.type">
          <i :class="recommendation.icon"></i>
          <span>{{ recommendation.text }}</span>
        </div>
      </div>
      <div class="result-summary">
        <div class="summary-item">
          <span class="label">Chi phí thuê 5 năm:</span>
          <span class="value">{{ formatCurrency(totalRentCost) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Chi phí mua 5 năm:</span>
          <span class="value">{{ formatCurrency(totalBuyCost) }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Chênh lệch:</span>
          <span class="value" :class="difference >= 0 ? 'positive' : 'negative'">
            {{ formatCurrency(Math.abs(difference)) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Calculator -->
    <div class="calculator-grid">
      <!-- Input Panel -->
      <div class="input-panel">
        <div class="panel-header">
          <h3>Thông tin đầu vào</h3>
          <button @click="resetForm" class="reset-btn">
            <i class="fas fa-redo"></i>
            Đặt lại
          </button>
        </div>

        <!-- Property Information -->
        <div class="input-section">
          <h4>
            <i class="fas fa-home"></i>
            Thông tin bất động sản
          </h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Giá mua nhà (VNĐ)</label>
              <input v-model.number="inputs.homePrice" type="number" class="form-input" />
            </div>
            <div class="input-group">
              <label>Tiền thuê hàng tháng (VNĐ)</label>
              <input v-model.number="inputs.monthlyRent" type="number" class="form-input" />
            </div>
            <div class="input-group">
              <label>Vốn ban đầu (%)</label>
              <input v-model.number="inputs.downPaymentPercent" type="number" class="form-input" max="100" />
            </div>
            <div class="input-group">
              <label>Thời gian ở (năm)</label>
              <input v-model.number="inputs.timeHorizon" type="number" class="form-input" />
            </div>
          </div>
        </div>

        <!-- Loan Information -->
        <div class="input-section">
          <h4>
            <i class="fas fa-percentage"></i>
            Thông tin vay vốn
          </h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Lãi suất vay (%/năm)</label>
              <input v-model.number="inputs.interestRate" type="number" step="0.1" class="form-input" />
            </div>
            <div class="input-group">
              <label>Thời hạn vay (năm)</label>
              <input v-model.number="inputs.loanTerm" type="number" class="form-input" />
            </div>
          </div>
        </div>

        <!-- Additional Costs -->
        <div class="input-section">
          <h4>
            <i class="fas fa-calculator"></i>
            Chi phí phát sinh
          </h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Bảo hiểm nhà (%/năm)</label>
              <input v-model.number="inputs.insurance" type="number" step="0.01" class="form-input" />
            </div>
            <div class="input-group">
              <label>Bảo trì sửa chữa (%/năm)</label>
              <input v-model.number="inputs.maintenance" type="number" step="0.01" class="form-input" />
            </div>
            <div class="input-group">
              <label>Thuế tài sản (%/năm)</label>
              <input v-model.number="inputs.propertyTax" type="number" step="0.01" class="form-input" />
            </div>
            <div class="input-group">
              <label>Tăng giá nhà (%/năm)</label>
              <input v-model.number="inputs.appreciation" type="number" step="0.1" class="form-input" />
            </div>
          </div>
        </div>

        <!-- Investment Options -->
        <div class="input-section">
          <h4>
            <i class="fas fa-chart-line"></i>
            Tùy chọn đầu tư
          </h4>
          <div class="input-grid">
            <div class="input-group">
              <label>Tỷ suất đầu tư thay thế (%/năm)</label>
              <input v-model.number="inputs.investmentReturn" type="number" step="0.1" class="form-input" />
            </div>
            <div class="input-group">
              <label>Tăng tiền thuê (%/năm)</label>
              <input v-model.number="inputs.rentIncrease" type="number" step="0.1" class="form-input" />
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
        <!-- Detailed Breakdown -->
        <div class="breakdown-section">
          <h3>Phân tích chi tiết</h3>
          
          <!-- Buy vs Rent Comparison -->
          <div class="comparison-cards">
            <div class="comparison-card buy-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-home"></i>
                  Mua nhà
                </h4>
                <span class="total-cost">{{ formatCurrency(totalBuyCost) }}</span>
              </div>
              <div class="cost-breakdown">
                <div class="cost-item">
                  <span>Vốn ban đầu:</span>
                  <span>{{ formatCurrency(downPayment) }}</span>
                </div>
                <div class="cost-item">
                  <span>Tổng trả góp:</span>
                  <span>{{ formatCurrency(totalMortgagePayments) }}</span>
                </div>
                <div class="cost-item">
                  <span>Chi phí bảo trì:</span>
                  <span>{{ formatCurrency(totalMaintenanceCost) }}</span>
                </div>
                <div class="cost-item">
                  <span>Bảo hiểm & thuế:</span>
                  <span>{{ formatCurrency(totalInsuranceTax) }}</span>
                </div>
                <div class="cost-item positive">
                  <span>Giá trị cuối kỳ:</span>
                  <span>-{{ formatCurrency(finalHomeValue) }}</span>
                </div>
              </div>
            </div>

            <div class="comparison-card rent-card">
              <div class="card-header">
                <h4>
                  <i class="fas fa-key"></i>
                  Thuê nhà
                </h4>
                <span class="total-cost">{{ formatCurrency(totalRentCost) }}</span>
              </div>
              <div class="cost-breakdown">
                <div class="cost-item">
                  <span>Tổng tiền thuê:</span>
                  <span>{{ formatCurrency(totalRentPayments) }}</span>
                </div>
                <div class="cost-item positive">
                  <span>Đầu tư vốn dư:</span>
                  <span>-{{ formatCurrency(investmentValue) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Visualization -->
        <div class="visualization-section">
          <h3>Biểu đồ phân tích</h3>
          <div class="chart-container">
            <canvas ref="comparisonChart" width="400" height="200"></canvas>
          </div>
        </div>

        <!-- Sensitivity Analysis -->
        <div class="sensitivity-section">
          <h3>Phân tích độ nhạy</h3>
          <div class="sensitivity-grid">
            <div class="sensitivity-item">
              <span class="factor">Lãi suất tăng 1%:</span>
              <span class="impact" :class="interestImpact >= 0 ? 'negative' : 'positive'">
                {{ interestImpact >= 0 ? '+' : '' }}{{ formatCurrency(interestImpact) }}
              </span>
            </div>
            <div class="sensitivity-item">
              <span class="factor">Giá nhà tăng 2%/năm:</span>
              <span class="impact positive">-{{ formatCurrency(appreciationImpact) }}</span>
            </div>
            <div class="sensitivity-item">
              <span class="factor">Tiền thuê tăng thêm 2%/năm:</span>
              <span class="impact negative">+{{ formatCurrency(rentImpact) }}</span>
            </div>
          </div>
        </div>

        <!-- Guidance Section -->
        <div class="guidance-section">
          <h3>Hướng dẫn & Khuyến nghị</h3>
          <div class="guidance-content">
            <div class="guidance-item" v-for="guide in guidanceItems" :key="guide.id">
              <div class="guide-icon" :class="guide.type">
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
  name: 'RentBuyCalculator',
  data() {
    return {
      hasCalculated: false,
      inputs: {
        homePrice: 3000000000,
        monthlyRent: 15000000,
        downPaymentPercent: 20,
        timeHorizon: 5,
        interestRate: 8.5,
        loanTerm: 20,
        insurance: 0.2,
        maintenance: 1.0,
        propertyTax: 0.5,
        appreciation: 5.0,
        investmentReturn: 7.0,
        rentIncrease: 3.0
      },
      results: {}
    }
  },
  
  computed: {
    downPayment() {
      return this.inputs.homePrice * (this.inputs.downPaymentPercent / 100)
    },
    
    loanAmount() {
      return this.inputs.homePrice - this.downPayment
    },
    
    monthlyPayment() {
      const r = this.inputs.interestRate / 100 / 12
      const n = this.inputs.loanTerm * 12
      return this.loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    },
    
    totalMortgagePayments() {
      return this.monthlyPayment * this.inputs.timeHorizon * 12
    },
    
    totalMaintenanceCost() {
      let total = 0
      for (let i = 0; i < this.inputs.timeHorizon; i++) {
        const yearlyMaintenance = this.inputs.homePrice * (this.inputs.maintenance / 100)
        total += yearlyMaintenance * Math.pow(1.03, i)
      }
      return total
    },
    
    totalInsuranceTax() {
      let total = 0
      for (let i = 0; i < this.inputs.timeHorizon; i++) {
        const yearlyInsuranceTax = this.inputs.homePrice * ((this.inputs.insurance + this.inputs.propertyTax) / 100)
        total += yearlyInsuranceTax * Math.pow(1.03, i)
      }
      return total
    },
    
    finalHomeValue() {
      return this.inputs.homePrice * Math.pow(1 + this.inputs.appreciation / 100, this.inputs.timeHorizon)
    },
    
    totalBuyCost() {
      return this.downPayment + this.totalMortgagePayments + this.totalMaintenanceCost + this.totalInsuranceTax - this.finalHomeValue
    },
    
    totalRentPayments() {
      let total = 0
      let currentRent = this.inputs.monthlyRent
      for (let i = 0; i < this.inputs.timeHorizon; i++) {
        total += currentRent * 12
        currentRent *= (1 + this.inputs.rentIncrease / 100)
      }
      return total
    },
    
    investmentValue() {
      const monthlyInvestment = this.downPayment / (this.inputs.timeHorizon * 12)
      const monthlyReturn = this.inputs.investmentReturn / 100 / 12
      let value = 0
      
      // Investment of down payment
      value += this.downPayment * Math.pow(1 + this.inputs.investmentReturn / 100, this.inputs.timeHorizon)
      
      // Monthly difference investment
      const monthlyDifference = this.monthlyPayment + (this.inputs.homePrice * (this.inputs.insurance + this.inputs.maintenance + this.inputs.propertyTax) / 100 / 12) - this.inputs.monthlyRent
      if (monthlyDifference > 0) {
        for (let i = 0; i < this.inputs.timeHorizon * 12; i++) {
          value += monthlyDifference * Math.pow(1 + monthlyReturn, this.inputs.timeHorizon * 12 - i)
        }
      }
      
      return value
    },
    
    totalRentCost() {
      return this.totalRentPayments - this.investmentValue
    },
    
    difference() {
      return this.totalBuyCost - this.totalRentCost
    },
    
    recommendation() {
      if (this.difference > 0) {
        return {
          type: 'rent',
          icon: 'fas fa-key',
          text: 'Nên thuê nhà'
        }
      } else {
        return {
          type: 'buy',
          icon: 'fas fa-home',
          text: 'Nên mua nhà'
        }
      }
    },
    
    interestImpact() {
      const newRate = this.inputs.interestRate + 1
      const r = newRate / 100 / 12
      const n = this.inputs.loanTerm * 12
      const newPayment = this.loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
      return (newPayment - this.monthlyPayment) * this.inputs.timeHorizon * 12
    },
    
    appreciationImpact() {
      const newAppreciation = this.inputs.appreciation + 2
      const newValue = this.inputs.homePrice * Math.pow(1 + newAppreciation / 100, this.inputs.timeHorizon)
      return newValue - this.finalHomeValue
    },
    
    rentImpact() {
      const newRentIncrease = this.inputs.rentIncrease + 2
      let total = 0
      let currentRent = this.inputs.monthlyRent
      for (let i = 0; i < this.inputs.timeHorizon; i++) {
        total += currentRent * 12
        currentRent *= (1 + newRentIncrease / 100)
      }
      return total - this.totalRentPayments
    },
    
    guidanceItems() {
      const items = []
      
      if (this.difference > 0) {
        items.push({
          id: 1,
          type: 'success',
          icon: 'fas fa-check-circle',
          title: 'Thuê nhà có lợi hơn',
          description: `Với những thông số hiện tại, thuê nhà sẽ tiết kiệm được ${this.formatCurrency(this.difference)} so với mua nhà trong ${this.inputs.timeHorizon} năm.`
        })
      } else {
        items.push({
          id: 1,
          type: 'info',
          icon: 'fas fa-home',
          title: 'Mua nhà có lợi hơn',
          description: `Mua nhà sẽ tiết kiệm được ${this.formatCurrency(Math.abs(this.difference))} so với thuê nhà và bạn sẽ sở hữu tài sản có giá trị ${this.formatCurrency(this.finalHomeValue)}.`
        })
      }
      
      if (this.inputs.downPaymentPercent < 20) {
        items.push({
          id: 2,
          type: 'warning',
          icon: 'fas fa-exclamation-triangle',
          title: 'Cân nhắc tăng vốn ban đầu',
          description: 'Vốn ban đầu dưới 20% có thể làm tăng chi phí lãi suất và bảo hiểm vay vốn.'
        })
      }
      
      if (this.monthlyPayment > this.inputs.monthlyRent * 3) {
        items.push({
          id: 3,
          type: 'warning',
          icon: 'fas fa-dollar-sign',
          title: 'Gánh nặng tài chính cao',
          description: 'Khoản trả góp hàng tháng cao gấp 3 lần tiền thuê có thể gây áp lực tài chính.'
        })
      }
      
      items.push({
        id: 4,
        type: 'info',
        icon: 'fas fa-lightbulb',
        title: 'Yếu tố khác cần xem xét',
        description: 'Ngoài chi phí, hãy xem xét tính linh hoạt, thời gian ở, kế hoạch gia đình và sở thích cá nhân.'
      })
      
      return items
    }
  },
  
  methods: {
    calculate() {
      this.hasCalculated = true
      this.$nextTick(() => {
        this.createChart()
      })
    },
    
    resetForm() {
      this.hasCalculated = false
      this.inputs = {
        homePrice: 3000000000,
        monthlyRent: 15000000,
        downPaymentPercent: 20,
        timeHorizon: 5,
        interestRate: 8.5,
        loanTerm: 20,
        insurance: 0.2,
        maintenance: 1.0,
        propertyTax: 0.5,
        appreciation: 5.0,
        investmentReturn: 7.0,
        rentIncrease: 3.0
      }
    },
    
    formatCurrency(amount) {
      if (amount >= 1000000000) {
        return `${(amount / 1000000000).toFixed(1)} tỷ`
      } else if (amount >= 1000000) {
        return `${(amount / 1000000).toFixed(0)} triệu`
      }
      return `${amount.toLocaleString()}`
    },
    
    createChart() {
      console.log('Chart would be created here')
    }
  }
}
</script>

<style scoped>
.rent-buy-calculator {
  padding: 2rem;
  background: #f8f9fa;
  min-height: 100vh;
}

.calculator-header {
  text-align: center;
  margin-bottom: 2rem;
}

.calculator-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.calculator-header h2 i {
  color: #2563eb;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.quick-result-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border: 2px solid #e5e7eb;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.2rem;
}

.recommendation {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.recommendation.buy {
  background: #dbeafe;
  color: #2563eb;
}

.recommendation.rent {
  background: #d1fae5;
  color: #059669;
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item .label {
  color: #6b7280;
  font-weight: 500;
}

.summary-item .value {
  font-weight: 600;
  color: #1f2937;
}

.summary-item .value.positive {
  color: #059669;
}

.summary-item .value.negative {
  color: #dc2626;
}

.calculator-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.input-panel, .results-panel {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #1f2937;
}

.reset-btn {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #e5e7eb;
}

.input-section {
  margin-bottom: 2rem;
}

.input-section h4 {
  color: #374151;
  font-size: 1.1rem;
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

.breakdown-section {
  margin-bottom: 2rem;
}

.breakdown-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
}

.comparison-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.comparison-card {
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.buy-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-left: 4px solid #2563eb;
}

.rent-card {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-left: 4px solid #059669;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1f2937;
}

.total-cost {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
}

.cost-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  font-size: 0.9rem;
}

.cost-item:last-child {
  border-bottom: none;
}

.cost-item.positive {
  color: #059669;
  font-weight: 600;
}

.visualization-section {
  margin-bottom: 2rem;
}

.visualization-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-container {
  height: 200px;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.sensitivity-section {
  margin-bottom: 2rem;
}

.sensitivity-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.sensitivity-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sensitivity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.sensitivity-item .factor {
  color: #374151;
  font-weight: 500;
}

.sensitivity-item .impact {
  font-weight: 600;
}

.sensitivity-item .impact.positive {
  color: #059669;
}

.sensitivity-item .impact.negative {
  color: #dc2626;
}

.guidance-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.guidance-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guidance-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid transparent;
}

.guidance-item .guide-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.guide-icon.success {
  background: #d1fae5;
  color: #059669;
  border-left-color: #059669;
}

.guide-icon.info {
  background: #dbeafe;
  color: #2563eb;
  border-left-color: #2563eb;
}

.guide-icon.warning {
  background: #fef3c7;
  color: #d97706;
  border-left-color: #d97706;
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
  .calculator-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-cards {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .rent-buy-calculator {
    padding: 1rem;
  }
  
  .result-summary {
    grid-template-columns: 1fr;
  }
  
  .input-grid {
    grid-template-columns: 1fr;
  }
  
  .input-panel, .results-panel {
    padding: 1.5rem;
  }
}
</style> 