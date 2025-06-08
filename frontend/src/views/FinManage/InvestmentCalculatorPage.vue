<template>
  <div class="calculator-container">
    <h1 class="title"> {{$t('investmentTitle')}}</h1>
      <!-- Bot Chat Component -->
      <div class="bot-chat-container" :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }">
        <img class="bot-image" src="@/assets/botrmbg.png" alt="Bot" @click="hideMessage"/>
        <div class="bot-message" :class="{ 'message-visible': showMessage, 'message-hidden': hidingMessage }">
          <div v-if="isTyping" class="typing-animation">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div v-else class="typed-message" v-html="typedContent"></div>
        </div>
      </div>

    <!-- Input Fields Section -->
    <div class="input-section">
      <div class="input-group">
        <label> {{ $t('initialInvestment') }}</label>
        <input v-model.number="initialInvestment" type="number" />
      </div>
      <div class="input-group">
        <label> {{ $t('annualInterestRate') }}</label>
        <input v-model.number="interestRate" type="number" />
      </div>
      <div class="input-group">
        <label>{{ $t('years') }}</label>
        <input v-model.number="years" type="number" />
      </div>
      <div class="input-group">
        <label> {{ $t('compoundingFrequency') }}</label>
        <select v-model="compoundingFrequency">
          <option value="1">{{$t('annually')}}</option>
          <option value="4">{{$t('quarterly')}}</option>
          <option value="12">{{$t('monthly')}}</option>
          <option value="52">{{$t('weekly')}}</option>
          <option value="365">{{$t('daily')}}</option>
        </select>
      </div>
      <div class="input-group">
        <label> {{ $t('contributionAmount') }}</label>
        <input v-model.number="contribution" type="number" />
      </div>
      <div class="contribution-options">
        <label>{{$t('contributionAtThe')}}</label>
        <input type="radio" v-model="contributionTiming" value="beginning"/> {{$t('beginning')}}
        <input type="radio" v-model="contributionTiming" value="end"/> {{$t('end')}}
        <label> {{ $t('ofEach') }} </label>
        <input type="radio" v-model="contributionPeriod" value="month"/> {{$t('month')}}
        <input type="radio" v-model="contributionPeriod" value="year"/> {{$t('year')}}
      </div>
    </div>
    <button @click="calculateInvestment" class="calculate-btn">{{$t('calculate')}}</button>
    <div class="chart-section">
      <h2 class="result-text"> {{$t('finAmount')}} ${{ finalAmount.toFixed(2) }}</h2>
      <div class="chart-wrapper">
        <ChartLoader v-if="isLoading" :text="$t('calculatingInvestment')" />
      <canvas id="investmentChart"></canvas>
      </div>
    </div>

  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
import axios from 'axios';
import { debounce } from 'lodash';
import ChartLoader from '@/components/Common/ChartLoader.vue';
// this.$i18n.locale = 'vi'; // to change language

// Chart configuration constants
const CHART_COLORS = [
  'rgba(0, 0, 0, 0.8)',
  'rgba(0, 0, 0, 0.5)',
  'rgba(0, 0, 0, 0.3)'
];

const BASE_OPTIONS = {
  animation: { duration: 500 },
  responsive: true,
  maintainAspectRatio: false,
  scales: { 
    x: { 
      stacked: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.3)'
      },
      ticks: {
        color: '#000000'
      }
    }, 
    y: { 
      stacked: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        borderColor: 'rgba(0, 0, 0, 0.3)'
      },
      ticks: {
        color: '#000000'
      }
    } 
  },
  plugins: {
    legend: {
      labels: {
        color: '#000000',
        font: {
          weight: '500'
        },
        padding: 15
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#ffffff',
      bodyColor: '#ffffff',
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: '600'
      },
      bodyFont: {
        size: 13
      }
    }
  }
};

export default {
  components: {
    ChartLoader
  },
  data() {
    return {
      // Core input data
      initialInvestment: 1000,
      interestRate: 5,
      years: 10,
      compoundingFrequency: 1,
      contribution: 0,
      contributionTiming: "end",
      contributionPeriod: "month",
      finalAmount: 0,
      shouldCalculate: false,
      
      // Chart data
      rawYears: [],
      rawInit: [],
      rawContrib: [],
      rawProfit: [],
      
      // Bot state
      showBot: false,
      showMessage: false,
      typedContent: "",
      botMessage: "",
      hidingBot: false,
      hidingMessage: false,
      typingTimer: null,
      botHideTimer: null,
      isTyping: false,
      words: [],
      currentWordIndex: 0,
      typingSpeed: 60,
      isLoading: false,
    };
  },

  created() {
    this._chart = null;
  },

  computed: {
    inputs() {
      return {
        initialInvestment: this.initialInvestment,
        interestRate: this.interestRate,
        years: this.years,
        compoundingFrequency: this.compoundingFrequency,
        contribution: this.contribution,
        contributionTiming: this.contributionTiming,
        contributionPeriod: this.contributionPeriod
      };
    }
  },

  watch: {
    inputs: {
      handler: debounce(function() {
        if (this.shouldCalculate) {
          this.calculateInvestment();
        }
      }, 300),
      deep: true,
      immediate: true
    },
    '$i18n.locale'() {
      this.updateChartLabels();
      // Update bot message if it's visible
      if (this.showBot && this.showMessage) {
        this.updateBotMessage();
      }
    }
  },

  methods: {
    async calculateInvestment() {
      this.isLoading = true;
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const P = this.initialInvestment;
      const r = this.interestRate / 100;
      const t = this.years;
      const n = this.compoundingFrequency;
      const m = this.contributionPeriod === "month" ? 12 : 1;
      const PMT = this.contribution;
      const isBeginning = this.contributionTiming === "beginning";

      let yearsArray = [], initialArray = [], contributionArray = [], profitArray = [];
      let total = 0;

      for (let i = 1; i <= t; i++) {
        const baseAmount = P * Math.pow(1 + r / n, n * i);
        let contributionFactor = (Math.pow(1 + r / m, m * i) - 1) / (r / m);
        if (isBeginning) {
          contributionFactor *= (1 + r / m);
        }
        const contributionTotal = PMT * contributionFactor;
        const totalYear = baseAmount + contributionTotal;
        const profit = totalYear - P - (PMT * m * i);

        yearsArray.push(i);
        initialArray.push(P);
        contributionArray.push(PMT * m * i);
        profitArray.push(profit);

        total = totalYear;
      }

      this.finalAmount = total;
      this.rawYears = yearsArray;
      this.rawInit = initialArray;
      this.rawContrib = contributionArray;
      this.rawProfit = profitArray;

      this.isLoading = false;
      
      this.$nextTick(() => { 
        this.buildChart(this.rawYears, this.rawInit, this.rawContrib, this.rawProfit);
      });

      this.shouldCalculate = false;
      this.startBotAnimation();
    },

    buildChart(years, init, contrib, profit) {
      const canvasElement = document.getElementById('investmentChart');
      if (!canvasElement) {
        console.error('Canvas element "investmentChart" not found during buildChart.');
        return;
      }

      if (this._chart) {
        this._chart.destroy();
      }
      const ctx = canvasElement.getContext('2d');
      const labels = years.map(i => this.$t('yearNumber', { number: i }));
      
      this._chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: this.$t('initialInvestmentLabel'),
              data: [...init],
              backgroundColor: CHART_COLORS[0],
              stack: 'combined'
            },
            {
              label: this.$t('additionalContributionLabel'),
              data: [...contrib],
              backgroundColor: CHART_COLORS[1],
              stack: 'combined'
            },
            {
              label: this.$t('profitEarnedLabel'),
              data: [...profit],
              backgroundColor: CHART_COLORS[2],
              stack: 'combined'
            }
          ]
        },
        options: BASE_OPTIONS
      });
    },

    startBotAnimation() {
      this.showBot = true;
      this.showMessage = true;
      this.isTyping = true;

      setTimeout(() => {
        this.isTyping = false;
        this.startWordByWordTyping();
      }, 1500);
    },

    startWordByWordTyping() {
      this.words = this.generateInsightMessage().split(/( |\n)/g).filter(word => word !== "");
      this.currentWordIndex = 0;
      this.typedContent = "";
      this.typeNextWord();
    },

    typeNextWord() {
      if (this.currentWordIndex < this.words.length) {
        const word = this.words[this.currentWordIndex];
        this.typedContent += word === "\n" ? "<br>" : word;
        this.currentWordIndex++;

        setTimeout(() => {
          this.typeNextWord();
        }, this.typingSpeed * (word.length / 2 + 1));
      }
    },

    generateInsightMessage() {
      return `${this.$t('investmentAnalysis')}
      ${this.$t('initialAmount')} $${this.initialInvestment}
      ${this.$t('rateAmount')} ${this.interestRate}%
      ${this.$t('finalAmountBot')} $${this.finalAmount.toFixed(2)}`;
    },

    hideMessage() {
      this.hidingMessage = true;
    },

    hideBot() {
      this.hidingMessage = true;

      setTimeout(() => {
        this.hidingBot = true;

        setTimeout(() => {
          this.showBot = false;
          this.showMessage = false;
          this.hidingBot = false;
          this.hidingMessage = false;
          this.typedContent = "";
        }, 1000);
      }, 500);
    },

    async generateInvestmentInsights() {
      const url = "https://openrouter.ai/api/v1/chat/completions";
      try {
        // Prepare investment data for analysis
        let investmentData = this._chart.data.datasets.map((dataset, index) => {
          return {
            label: dataset.label,
            values: dataset.data.join(", ")
          };
        });

        let formattedData = investmentData.map(d => `${d.label}: ${d.values}`).join("\n");

        // Fetch investment insights from DeepSeek API
        const investmentResponse = await axios.post(url, {
          model: "deepseek/deepseek-chat:free",
          messages: [
            {
              role: "system",
              content: "You are a financial analyst providing insights on investment growth based on historical data."
            },
            {
              role: "user",
              content: `Analyze this investment chart data:
              ${formattedData}
              Provide 2-3 sentences of insights on investment trends, potential growth, and areas of improvement.`
            }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.VUE_APP_DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        

        const investmentInsights = investmentResponse.data.choices[0].message.content;

        return investmentInsights;
      } catch (error) {
        console.error("Error generating investment insights:", error);
        return "Unable to generate insights at the moment. Please try again later.";
      }
    },

    updateChartLabels() {
      if (!this._chart) return;
      this._chart.data.datasets[0].label = this.$t('initialInvestmentLabel');
      this._chart.data.datasets[1].label = this.$t('additionalContributionLabel');
      this._chart.data.datasets[2].label = this.$t('profitEarnedLabel');
      const count = this.rawYears.length;
      this._chart.data.labels = Array.from({length: count}, (_, idx) =>
        this.$t('yearNumber', { number: idx + 1 })
      );
      this._chart.update();
    },

    updateBotMessage() {
      const newMessage = this.generateInsightMessage();
      this.words = newMessage.split(/( |\n)/g).filter(word => word !== "");
      this.currentWordIndex = this.words.length; // Set to end to show full message
      this.typedContent = newMessage.replace(/\n/g, '<br>');
    },
  },

  beforeDestroy() {
    // Clean up chart instance when component is destroyed
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  },

  mounted() {
    this.shouldCalculate = true;
    this.calculateInvestment();
  }
};
</script>

<style scoped>
/* Base Container */
.calculator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 800px;
  margin: 40px auto;
  min-height: 730px;
  animation: fadeIn 0.5s ease;
  transition: all 0.3s ease;
}

/* Title */
.title {
  font-size: 32px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 30px;
  text-align: center;
  animation: slideInDown 0.5s ease;
}

/* Input Section */
.input-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  width: 100%;
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease;
}

/* Input Groups */
.input-group {
  display: flex;
  flex-direction: column;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}

.input-group:nth-child(1) { animation-delay: 0.1s; }
.input-group:nth-child(2) { animation-delay: 0.2s; }
.input-group:nth-child(3) { animation-delay: 0.3s; }
.input-group:nth-child(4) { animation-delay: 0.4s; }
.input-group:nth-child(5) { animation-delay: 0.5s; }

label {
  font-weight: 500;
  color: #333333;
  margin-bottom: 8px;
  font-size: 14px;
  transition: color 0.3s ease;
}

input, select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
}

input:focus, select:focus {
  border-color: #000000;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

/* Contribution Options */
.contribution-options {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  margin-top: 20px;
  padding: 15px;
  background: #f8f8f8;
  border-radius: 8px;
  animation: slideIn 0.5s ease;
}

.contribution-options label {
  margin: 0;
  font-size: 14px;
}

.contribution-options input[type="radio"] {
  margin-right: 5px;
  cursor: pointer;
}

/* Calculate Button */
.calculate-btn {
  background: #000000;
  color: white;
  padding: 14px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin: 20px 0;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease;
}

.calculate-btn:hover {
  background: #333333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Chart Section */
.chart-section {
  width: 100%;
  height: 400px;
  margin-top: 30px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  animation: slideInUp 0.5s ease;
  transition: all 0.3s ease;
}

.chart-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.result-text {
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 20px;
  text-align: center;
  animation: fadeIn 0.5s ease;
}

/* Loading State */
.loading {
  position: relative;
  overflow: hidden;
}

.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
}
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
  opacity: 0;
  transform: translateY(20px);
}
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Responsive Design */
@media (max-width: 850px) {
  .calculator-container {
    width: 95%;
    padding: 20px;
    margin: 20px auto;
  }

  .input-section {
    grid-template-columns: 1fr;
}

  .title {
    font-size: 24px;
  }

  .chart-section {
    height: 300px;
  }

  .contribution-options {
    flex-direction: column;
    align-items: flex-start;
  }

  .calculate-btn {
    width: 100%;
  }
}

/* Bot Chat Styles */
.bot-chat-container {
  position: fixed;
  right: -350px;
  top: 30%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 15px;
  z-index: 100;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bot-image {
  width: 50px;
  height: 50px;
  object-fit: contain;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.3s ease;
  cursor: pointer;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.bot-image:hover {
  transform: scale(1.1);
}

.bot-visible .bot-image {
  animation: botBounce 1s ease-out;
}

@keyframes botBounce {
  0% { transform: translateY(20px); opacity: 0; }
  60% { transform: translateY(-5px); }
  80% { transform: translateY(2px); }
  100% { transform: translateY(0); opacity: 1; }
}

.bot-chat-container.bot-visible {
  transform: translateX(-350px);
  opacity: 1;
}

.bot-chat-container.bot-hidden {
  transform: translateX(0);
  opacity: 0;
}

.bot-message {
  background: #000000;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-right: 15px;
  max-width: 250px;
  transition: all 0.3s ease;
}

.bot-message.message-visible {
  opacity: 1;
  transform: translateX(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: translateX(20px);
}

.typing-animation {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.6;
}

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
  color: #ffffff;
}

.dot:nth-child(1) {
  animation: typing 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: typing 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: typing 1s infinite 0.4s;
}

@keyframes typing {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}

.chart-wrapper {
  position: relative;
    width: 100%;
  height: 400px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  overflow: hidden;
    }
</style>
