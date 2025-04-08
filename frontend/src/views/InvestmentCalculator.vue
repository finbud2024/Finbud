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
      <canvas id="investmentChart"></canvas>
    </div>


    <!-- Language switch  -->
    <div class="language-switcher">
    <button @click="switchLanguage('en')">
      <img src="@/assets/us.png" alt="English" />
    </button>
    <button @click="switchLanguage('vi')">
      <img src="@/assets/vn.png" alt="Tiếng Việt" />
    </button>
  </div>

  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import axios from 'axios';
// this.$i18n.locale = 'vi'; // to change language

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
      finalAmount: 0,
      chartInstance: null,
      shouldCalculate: false,
      
      // Chatbot related properties
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
    };
  },
  watch: {
    // Watch all input values
    initialInvestment: 'setShouldCalculate',
    interestRate: 'setShouldCalculate',
    years: 'setShouldCalculate',
    compoundingFrequency: 'setShouldCalculate',
    contribution: 'setShouldCalculate',
    contributionTiming: 'setShouldCalculate',
    contributionPeriod: 'setShouldCalculate',
  },
  methods: {
    setShouldCalculate() {
      this.shouldCalculate = true;
    },

    switchLanguage(lang) {
      this.$i18n.locale = lang;
      if (this.chartInstance) {
        // Instead of directly updating, we'll destroy and recreate the chart
        this.chartInstance.destroy();
        this.$nextTick(() => {
          const canvas = document.getElementById('investmentChart');
          if (canvas) {
            const ctx = canvas.getContext('2d');
            // Recreate the chart with the same data
            const data = this.chartInstance.data;
            this.chartInstance = new Chart(ctx, {
              type: 'bar',
              data: data,
              options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: { stacked: true },
                  y: { stacked: true }
                }
              }
            });
          }
        });
      }
      this.startBotAnimation();
    },

    // Chatbot animation
    async startBotAnimation() {
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
      }

      this.hidingBot = false;
      this.hidingMessage = false;
      this.typedContent = "";

      this.showBot = true;

      setTimeout(async () => {
        this.showMessage = true;
        this.isTyping = true;

        // Fetch insights from DeepSeek API
        const insights = await this.generateMortgageInsights();
        this.botMessage = insights; // Update the bot message with the generated insights

        setTimeout(() => {
          this.isTyping = false;
          this.startWordByWordTyping();
        }, 1500);
      }, 800);
    },

    startWordByWordTyping() {
      this.words = this.botMessage.split(/( |\n)/g).filter(word => word !== "");
      this.currentWordIndex = 0;
      this.typedContent = "";
      this.typeNextWord();
    },

    typeNextWord() {
      if (this.currentWordIndex < this.words.length) {
        const word = this.words[this.currentWordIndex];
        this.typedContent += word === "\n" ? "<br>" : word;
        this.currentWordIndex++;

        this.typingTimer = setTimeout(() => {
          this.typeNextWord();
        }, this.typingSpeed * (word.length / 2 + 1));
      } else {
        this.scheduleHideBot();
      }
    },

    scheduleHideBot() {
      this.botHideTimer = setTimeout(() => {
        this.hideBot();
      }, 60000);
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

    async generateMortgageInsights() {
      const url = "https://openrouter.ai/api/v1/chat/completions";
      try {
        // Prepare investment data for analysis
        let investmentData = this.chartInstance.data.datasets.map((dataset, index) => {
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


      

    calculateInvestment() {
      if (!this.shouldCalculate) return;

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

        yearsArray.push(`Year ${i}`);
        initialArray.push(P);
        contributionArray.push(PMT * m * i);
        profitArray.push(profit);

        total = totalYear;
      }

      this.finalAmount = total;

      // Properly clean up the existing chart
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }

      this.$nextTick(() => {
        const canvas = document.getElementById('investmentChart');
        if (canvas) {
          const ctx = canvas.getContext('2d');
          this.chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: yearsArray,
              datasets: [
                {
                  label: 'Initial Investment',
                  data: initialArray,
                  backgroundColor: '#4CAF50',
                  stack: 'combined'
                },
                {
                  label: 'Additional Contribution',
                  data: contributionArray,
                  backgroundColor: '#FFC107',
                  stack: 'combined'
                },
                {
                  label: 'Profit Earned',
                  data: profitArray,
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
        }
        this.startBotAnimation();
        this.shouldCalculate = false;
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

  beforeDestroy() {
    // Clean up chart instance when component is destroyed
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  },

  mounted() {
    // Initialize with empty chart
    this.renderChart([], [], [], []);
    // Set shouldCalculate to true for first-time calculation
    this.shouldCalculate = true;
  }
  // mounted() {
  // this.$nextTick(() => {
  //   this.renderChart([], [], [], []);
  // });

};
</script>

<style scoped>

/* Language Switcher */
.language-switcher {
  position: fixed;
  bottom: 10px;
  left: 20px;
  display: flex;
}

.language-switcher button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.language-switcher button img {
  width: 40px;
  height: auto;
  transition: transform 0.2s ease;
}

.language-switcher button:hover img {
  transform: scale(1.1); /* Slightly enlarge the flag on hover */
}

.calculator-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  width: 600px;
  margin: 60px auto 0;

  min-height: 730px;

  height: auto;
  flex-grow: 1;
  flex-shrink: 0;
  overflow: visible;

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

/* Chatbot Styles */
.chatbot-container {
  width: 100%;
  margin-top: 30px;
  background: #eef6f9;
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #007bff;
  transition: all 0.5s ease;
}

.chatbot-container.hide {
  opacity: 0;
  transform: translateY(20px);
}

.bot-message {
  font-size: 16px;
  color: #333;
  line-height: 1.5;
}

/* Add the bot chat styles from the previous example here */
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
  transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1s ease;
  opacity: 0;
  transform: translateX(0);
  pointer-events: none;
}

.bot-chat-container.bot-visible {
  transform: translateX(-350px);
  opacity: 1;
  pointer-events: auto;
}

.bot-chat-container.bot-hidden {
  transform: translateX(-350px) translateY(50px); 
  opacity: 0;
  transition: transform 1s ease, opacity 1s ease;
}

.bot-image {
  width: 40px;
  height: auto;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.5s ease;
  cursor: pointer;
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

.bot-message {
  margin-top: 10px;
  background: #2196F3;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 280px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.7s ease, transform 0.7s ease;
  transition-delay: 0.3s;
}

.bot-message.message-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
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
  opacity: 0.3;
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

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
}

@keyframes typing {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.2);
  }
}


</style>
