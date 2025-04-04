<!-- <template>
  <div class="calculator-container">
    <h1 class="animated-title">Investment Calculator</h1>
    <div class="input-group">
      <label>Initial Investment ($):</label>
      <input v-model.number="initialInvestment" type="number" />
    </div>
    <div class="input-group">
      <label> Interest Rate (%):</label>
      <input v-model.number="interestRate" type="number" />
    </div>
    <div class="input-group">
      <label>Years:</label>
      <input v-model.number="years" type="number" />
    </div>
    <div class="input-group">
      <label>Compounding Frequency:</label>
      <select v-model="compoundingFrequency"  class="wide-input">
        <option value="1">Annually</option>
        <option value="4">Quarterly</option>
        <option value="12">Monthly</option>
        <option value="52">Weekly</option>
        <option value="365">Daily</option>
      </select>
    </div>
    <div class = "input-group">
      <label>Additional Contribution ($): </label>
      <input v-model.number = "contribution" type="number"/>
    </div>
    <div class = "contribution-options">
      <label>Contribution at the</label>
      <input type = "radio" v-model="contributionTiming" value="beginning"/> beginning
      <input type = "radio" v-model="contributionTiming" value="end"/> end
      <label> of each </label>
      <input type = "radio" v-model = "contributionPeriod" value = "month"/> month
      <input type = "radio" v-model = "contributionPeriod" value = "year"/> year
    </div>
    <div class="button-container">
       <button @click="calculateInvestment" class="calculate-btn">Calculate</button>
    </div>
    <div v-if="finalAmount !== null" class="result-container">
      <h2 class="result-text">Final Amount: ${{ finalAmount.toFixed(2) }}</h2>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "InvestmentCalculator",
  data() {
    return {
      initialInvestment: 1000,
      interestRate: 5,
      years: 10,
      compoundingFrequency: 1, // Default is annually
      finalAmount: null,
      //contribution
      contribution: 0,
      contributionTiming: "end", // Default to end of period
      contributionPeriod: "month", // Default to monthly contributions
      finalAmount: null,
    };
  },
  methods: {
    calculateInvestment() {
      const P = this.initialInvestment;
      const r = this.interestRate / 100;
      const n = this.compoundingFrequency;
      const t = this.years;
      const A = P * Math.pow(1 + r / n, n * t);
      const profit = A - P;
      this.finalAmount = A;
      this.$nextTick(() => {
        this.renderChart(P, this.contribution, profit);
      });
    },
    renderChart(initial, contribution, profit) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const ctx = document.getElementById('investmentChart').getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Initial Investment', 'Additional Contribution', 'Profit Earned'],
          datasets: [{
            label: 'Amount ($)',
            data: [initial, contribution, profit],
            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

.calculator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 600px;
  margin: auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.calculate-btn {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.chart-section {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* 
.input-group {
  margin: 15px 0;
}

.input-group select.wide-input {
  width: 99%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
}

label {
  display: block;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 5px;
}

input, select {
  display: block;
  width: 95%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  transition: all 0.3s ease-in-out;
}

input:focus, select:focus {
  outline: none;
  transform: scale(1.05);
}

.contribution-options {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap;
  white-space: nowrap;
}

.button-container {
  margin-top: 20px;
}

.calculate-btn {
  background: #ff9800;
  color: white;
  padding: 12px;
  font-size: 18px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

.calculate-btn:hover {
  background: #e68900;
  transform: scale(1.1);
}

.result-container {
  margin-top: 20px;
  animation: fadeIn 1s ease-in-out;
}

.result-text {
  font-size: 22px;
  font-weight: 600;
  color: #ffeb3b;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); */
/* } */
</style>






<!-- 
<template>
  <div class="calculator-container">
    <h1 class="title">Investment Calculator</h1>
    <div class="input-section">
      <div class="input-group">
        <label>Initial Investment ($):</label>
        <input v-model.number="initialInvestment" type="number" />
      </div>
      <div class="input-group">
        <label>Interest Rate (%):</label>
        <input v-model.number="interestRate" type="number" />
      </div>
      <div class="input-group">
        <label>Years:</label>
        <input v-model.number="years" type="number" />
      </div>
      <div class="input-group">
        <label>Compounding Frequency:</label>
        <select v-model="compoundingFrequency">
          <option value="1">Annually</option>
          <option value="4">Quarterly</option>
          <option value="12">Monthly</option>
          <option value="52">Weekly</option>
          <option value="365">Daily</option>
        </select>
      </div>
      <div class="input-group">
        <label>Additional Contribution ($):</label>
        <input v-model.number="contribution" type="number" />
      </div>
    </div>
    <button @click="calculateInvestment" class="calculate-btn">Calculate</button>
    <div v-if="finalAmount !== null" class="chart-section">
      <h2 class="result-text">Final Amount: ${{ finalAmount.toFixed(2) }}</h2>
      <canvas ref="investmentChart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
export default {
  data() {
    return {
      initialInvestment: 1000,
      interestRate: 5,
      years: 10,
      compoundingFrequency: 1,
      contribution: 0,
      finalAmount: null,
      chartInstance: null,
    };
  },
  methods: {
    calculateInvestment() {
      const P = this.initialInvestment;
      const r = this.interestRate / 100;
      const n = this.compoundingFrequency;
      const t = this.years;
      const A = P * Math.pow(1 + r / n, n * t);
      const profit = A - P;
      this.finalAmount = A;
      this.renderChart(P, this.contribution, profit);
    },
    renderChart(initial, contribution, profit) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const ctx = this.$refs.investmentChart.getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Initial Investment', 'Additional Contribution', 'Profit Earned'],
          datasets: [{
            label: 'Amount ($)',
            data: [initial, contribution, profit],
            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3'],
          }],
        },
      });
    },
  },
};
</script>

<style scoped>
.calculator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 600px;
  margin: auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.calculate-btn {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.chart-section {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style> --> 





<template>
  <div class="calculator-container">
    <h1 class="title">Investment Calculator</h1>
    <div class="input-section">
      <div class="input-group">
        <label>Initial Investment ($):</label>
        <input v-model.number="initialInvestment" type="number" />
      </div>
      <div class="input-group">
        <label>Interest Rate (%):</label>
        <input v-model.number="interestRate" type="number" />
      </div>
      <div class="input-group">
        <label>Years:</label>
        <input v-model.number="years" type="number" />
      </div>
      <div class="input-group">
        <label>Compounding Frequency:</label>
        <select v-model="compoundingFrequency">
          <option value="1">Annually</option>
          <option value="4">Quarterly</option>
          <option value="12">Monthly</option>
          <option value="52">Weekly</option>
          <option value="365">Daily</option>
        </select>
      </div>
      <div class="input-group">
        <label>Additional Contribution ($):</label>
        <input v-model.number="contribution" type="number" />
      </div>
      <div class="contribution-options">
        <label>Contribution at the</label>
        <input type="radio" v-model="contributionTiming" value="beginning"/> beginning
        <input type="radio" v-model="contributionTiming" value="end"/> end
        <label> of each </label>
        <input type="radio" v-model="contributionPeriod" value="month"/> month
        <input type="radio" v-model="contributionPeriod" value="year"/> year
      </div>
    </div>
    <button @click="calculateInvestment" class="calculate-btn">Calculate</button>
    <div v-if="finalAmount !== null" class="chart-section">
      <h2 class="result-text">Final Amount: ${{ finalAmount.toFixed(2) }}</h2>
      <canvas id="investmentChart"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
export default {
  data() {
    return {
      initialInvestment: 1000,
      interestRate: 5,
      years: 10,
      compoundingFrequency: 1,
      contribution: 0,
      contributionTiming: "end", 
      contributionPeriod: "month", 
      finalAmount: null,
      chartInstance: null,
    };
  },
  methods: {
    calculateInvestment() {
      const P = this.initialInvestment;
      const r = this.interestRate / 100;
      const n = this.compoundingFrequency;
      const t = this.years;
      let yearsArray = [];
      let initialArray = [];
      let contributionArray = [];
      let profitArray = [];
      let accumulated = P;
      
      for (let i = 1; i <= t; i++) {
        let A = accumulated * Math.pow(1 + r / n, n);
        let periodsPerYear = this.contributionPeriod === "month" ? 12 : 1;
        let contributionFactor = (Math.pow(1 + r / periodsPerYear, i * periodsPerYear) - 1) / (r / periodsPerYear);
        if (this.contributionTiming === "beginning") {
          contributionFactor *= (1 + r / periodsPerYear);
        }
        let totalContribution = this.contribution * contributionFactor;
        let profit = A + totalContribution - P;
        yearsArray.push(`Year ${i}`);
        initialArray.push(P);
        contributionArray.push(totalContribution);
        profitArray.push(profit);
        accumulated = A + totalContribution;
      }
      this.finalAmount = accumulated;
      
      this.$nextTick(() => {
        this.renderChart(yearsArray, initialArray, contributionArray, profitArray);
      });
    },
    renderChart(years, initial, contribution, profit) {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const ctx = document.getElementById('investmentChart').getContext('2d');
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: years,
          datasets: [
            {
              label: 'Initial Investment',
              data: initial,
              backgroundColor: '#4CAF50',
              stack: 'combined'
            },
            {
              label: 'Additional Contribution',
              data: contribution,
              backgroundColor: '#FFC107',
              stack: 'combined'
            },
            {
              label: 'Profit Earned',
              data: profit,
              backgroundColor: '#2196F3',
              stack: 'combined'
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { stacked: true },
            y: { stacked: true }
          }
        },
      });
    },
  },

  
};
</script>


<style scoped>
.calculator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 600px;
  margin: auto;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input, select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.calculate-btn {
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

.chart-section {
  margin-top: 20px;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>

