<template>
  <div class="mortgage-calc">
    <h1>Mortgage Payment Calculator</h1>
    
    <div class="content-wrapper">
      <!-- Input Fields Section -->
      <div class="input-section">
        <div class="input-group">
          <label>Home price</label>
          <div class="input-wrapper">
            <input type="number" v-model="homePrice" min="10000" />
            <span class="unit">$</span>
          </div>
          <span v-if="homePrice < 10000" class="error">Minimum of $10,000 required</span>
        </div>
        
        <div class="input-group">
            <label>Down payment</label>
            <div class="split-input">
                <div class="input-wrapper">
                <input
                    type="number"
                    v-model="downPayment"
                    @input="calculateDownPaymentPercentage"
                />
                <span class="unit">$</span>
                </div>
                <div class="input-wrapper">
                <input
                    type="number"
                    v-model="downPaymentPercentage"
                    @input="calculateDownPayment"
                />
                <span class="unit">%</span>
                </div>
            </div>
            </div>
        
        <div class="input-group">
          <label>Loan term</label>
          <select class="loan-group" v-model="loanTerm">
            <option value="30">30-year fixed</option>
            <option value="15">15-year fixed</option>
            <option value="5">5-year ARM</option>
          </select>
        </div>
        
        <div class="input-group">
          <label>Interest rate</label>
          <div class="input-wrapper">
            <input type="number" v-model="interestRate" step="0.01" />
            <span class="unit">%</span>
          </div>
          <h3>Interest rate provided via Zillow. </h3>
        </div>
        
        <div class="toggle-header">
          <button @click="toggleExtras">
            <label>Taxes, Insurance, HOA Fees</label>
            <span class="dropdown-icon" :class="{ rotated: showExtras }">▼</span>
          </button>
        </div>       
        
        <div v-if="showExtras" class="extra-content">
          <div class="input-group">
            <label>Property tax</label>
            <div class="input-wrapper">
              <input type="number" v-model="propertyTax" />
              <span class="unit">$/month</span>
            </div>
          </div>
          <div class="input-group">
            <label>Homeowners insurance</label>
            <div class="input-wrapper">
              <input type="number" v-model="homeInsurance" />
              <span class="unit">$/month</span>
            </div>
          </div>
          <div class="input-group">
            <label>Private mortgage insurance</label>
            <div class="input-wrapper">
              <input type="number" v-model="pmi" />
              <span class="unit">$/month</span>
            </div>
          </div>
          <div class="input-group">
            <label>HOA fees</label>
            <div class="input-wrapper">
              <input type="number" v-model="hoaFees" />
              <span class="unit">$/month</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown Section -->
      <div class="payment-breakdown">
        <div class="payment-breakdown-box">
          <h2>Mortgage Payment Breakdown</h2>
          <div class="breakdown-content">
            <div class="chart-container">
              <canvas ref="chart"></canvas>
            </div>
            <div class="breakdown-details">
              <div class="breakdown-list">
                <div class="breakdown-item">
                  <span class="percentage">{{ ((calculatePrincipalInterest / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">Principal & Interest</span>
                  <span class="amount">{{ `$${calculatePrincipalInterest}` }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.propertyTax / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">Property Tax</span>
                  <span class="amount">${{  this.propertyTax }} /month</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.homeInsurance / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">Homeowners Insurance</span>
                  <span class="amount">${{ this.homeInsurance }} /month</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.pmi / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">Private Mortgage Insurance</span>
                  <span class="amount">${{ this.pmi }} /month</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.hoaFees / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">HOA Fees</span>
                  <span class="amount">${{ this.hoaFees }} /month</span>
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
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default {
  data() {
    return {
      homePrice: 425000,
      downPayment: 85000,
      downPaymentPercentage: 20,
      loanTerm: 30,
      interestRate: 6.299,
      propertyTax: 354,
      homeInsurance: 150,
      pmi: 0,
      hoaFees: 0,
      showExtras: false,
    };
  },
  computed: {
    calculatePrincipalInterest() {
        const loanAmount = this.homePrice - this.downPayment;
        const monthlyInterestRate = (this.interestRate / 100) / 12;
        const numberOfPayments = this.loanTerm * 12;

        if (loanAmount <= 0 || numberOfPayments <= 0) {
            return 0;
        }

        if (monthlyInterestRate === 0) {
            return (loanAmount / numberOfPayments).toFixed(0);
        }

        const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments);
        const denominator = Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1;
        return (loanAmount * (numerator / denominator)).toFixed(0);
    },

    // Calculate month payment
    calculateMonthlyPayment() {
        return (
        parseFloat(this.calculatePrincipalInterest) + 
        parseFloat(this.propertyTax) + 
        parseFloat(this.homeInsurance) + 
        parseFloat(this.pmi) + 
        parseFloat(this.hoaFees)
        ).toFixed(0);
    },
  },
  methods: {
    // Calculate Down Payment Percentage based on Down Payment
    calculateDownPaymentPercentage() {
      if (this.homePrice > 0) {
        this.downPaymentPercentage = ((this.downPayment / this.homePrice) * 100).toFixed(0);
      } else {
        this.downPaymentPercentage = 0;
      }
    },

    // Calculate Down Payment based on Down Payment Percentage
    calculateDownPayment() {
      if (this.homePrice > 0) {
        this.downPayment = ((this.downPaymentPercentage / 100) * this.homePrice).toFixed(2);
      } else {
        this.downPayment = 0;
      }
    },

    

    toggleExtras() {
      this.showExtras = !this.showExtras;
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy(); // Destroy previous chart instance
      }

      const ctx = this.$refs.chart.getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Principal & Interest', 'Property Tax', 'Homeowners Insurance', 'PMI', 'HOA Fees'],
          datasets: [{
            data: [
              parseFloat(this.calculatePrincipalInterest), 
              parseFloat(this.propertyTax), 
              parseFloat(this.homeInsurance), 
              parseFloat(this.pmi), 
              parseFloat(this.hoaFees)
            ],
            backgroundColor: ['#81D4FA', '#FFCC80', '#E6EE9C', '#A5D6A7', '#80CBC4']
          }]
        },
        options: {
          responsive: true,
          cutout: '60%', 
          plugins: {
            legend: {
              position: 'bottom',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: $${context.raw.toFixed(2)}`;
                }
              }
            },
            // Custom Plugin for Center Text
            centerText: {
              text: `Monthly total<br><span style="font-size: 24px; font-weight: bold;">$${this.calculateMonthlyPayment}</span>`, 
            }
          }
        },
        plugins: [{
          id: 'centerText',
          beforeDraw: (chart) => {
            const width = chart.width;
            const height = chart.height;
            const ctx = chart.ctx;

            ctx.restore();
            const fontSize = (height / 10).toFixed(2);
            ctx.font = `${fontSize}px Arial`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';

            // Draw the custom text in two lines
            const text = `Monthly total`;
            const textX = Math.round(width / 2);
            const textY = Math.round(height / 2) - 50;

            const paymentText = `$${this.calculateMonthlyPayment}`;
            const paymentTextY = Math.round(height / 2) - 10;

            // Set the style for the larger payment amount text
            ctx.font = '20px Arial';
            ctx.fillText(text, textX, textY);
            ctx.font = '36px Arial';
            ctx.fillText(paymentText, textX, paymentTextY);

            ctx.save();
          }
        }]
      });
    }

  },



    watch: {
      calculateMonthlyPayment() {
      this.renderChart();
      },
      propertyTax() {
        this.renderChart();
      },
      homeInsurance() {
        this.renderChart();
      },
      pmi() {
        this.renderChart();
      },
      hoaFees() {
        this.renderChart();
      }
    },


  mounted() {
    this.renderChart();
  }
};
</script>

<style scoped>
.mortgage-calc {
  max-width: 90%;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  font-size: 40px;
  margin-bottom: 20px;
  color: #007bff;
}

.content-wrapper {
  display: flex;
  gap: 20px;
}

.input-section {
  max-width: 30%;
}

.payment-breakdown-box {
  border: 2px solid #ddd; 
  border-radius: 12px; 
  padding: 20px;  
  background-color: #f9f9f9; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  margin-top: 20px; 
  margin-left: 30px;
  flex: 1;
}

.payment-breakdown {
  margin-left: 30px;
  flex: 1;
}

.input-group {
  margin-bottom: 15px;
}

.loan-group {
  margin-bottom: 15px;
  width: 35%;
  border-radius: 25px;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.unit {
  position: absolute;
  right: 10px;
  font-size: 14px;
  color: #555;
}

.split-input {
  display: flex;
  gap: 10px;
}

.toggle-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-header button label {
  font-size: 1.2rem; 
  font-weight: bold; 
}

.toggle-header button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.dropdown-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.extra-content {
  margin-top: 10px;
  border-radius: 5px;
}

.error {
  color: red;
  font-size: 14px;
}

.payment-breakdown h2 {
  text-align: center;
  font-size: 25px;
  margin-bottom: 20px;
}

.breakdown-content {
  display: flex;
  gap: 20px;
  align-items: center;
}

h3 {
  font-size: 12px;
  font-weight:400;
}

.chart-container {
  flex: 1;
  max-width: 300px;
}

.breakdown-details {
  flex: 2;
}

.monthly-total {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.percentage {
  font-weight: bold;
  color: #555;
}

.label {
  flex: 1;
  margin: 0 10px;
}

.amount {
  font-weight: bold;
  color: #333;
}
</style>