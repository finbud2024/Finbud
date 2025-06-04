<template>
  <div class="mortgage-calc">    
    <h1>{{ $t('title') }}</h1>

    <div class="content-wrapper">
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
          <label>{{ $t('homePrice') }}</label>
          <div class="input-wrapper">
            <input type="number" v-model="homePrice" min="10000" @input="calculateDownPaymentPercentage"/>
            <span class="unit">$</span>
          </div>
          <span v-if="homePrice < 10000" class="error">{{ $t('errorMinHomePrice') }}</span>
        </div>

        <div class="input-group">
          <label>{{ $t('downPayment') }}</label>
          <div class="split-input">
            <div class="input-wrapper">
              <input type="number" v-model="downPayment" @input="calculateDownPaymentPercentage" />
              <span class="unit">$</span>
            </div>
            <div class="input-wrapper">
              <input type="number" v-model="downPaymentPercentage" @input="calculateDownPayment" />
              <span class="unit">%</span>
            </div>
          </div>
        </div>

        <div class="input-group">
          <label>{{ $t('loanTerm') }}</label>
          <select class="loan-group" v-model="loanTerm">
            <option value="30">{{ $t('loan30') }}</option>
            <option value="15">{{ $t('loan15') }}</option>
            <option value="5">{{ $t('loan5') }}</option>
          </select>
        </div>

        <div class="input-group">
          <label>{{ $t('interestRate') }}</label>
          <div class="input-wrapper">
            <input type="number" v-model="interestRate" min="0" step="0.01" />
            <span class="unit">%</span>
          </div>
          <span v-if="interestRate <= 0" class="error">{{ $t('errorInterestRate') }}</span>
          <h3>{{ $t('zillowNote') }}</h3>
        </div>

        <div class="toggle-header">
          <button @click="toggleExtras">
            <label>{{ $t('taxesFees') }}</label>
            <span class="dropdown-icon" :class="{ rotated: showExtras }">▼</span>
          </button>
        </div>

        <div v-if="showExtras" class="extra-content">
          <div class="input-group">
            <label>{{ $t('propertyTax') }}</label>
            <div class="input-wrapper">
              <input type="number" v-model="propertyTax" @input="propertyTax = propertyTax || 0"/>
              <span class="unit">${{ propertyTax }}/{{ $t ('month') }}</span>
            </div>
          </div>
          <div class="input-group">
            <label>{{ $t('homeownersInsurance') }}</label>
            <div class="input-wrapper">
              <input type="number" v-model="homeInsurance" @input="homeInsurance = homeInsurance || 0" />
              <span class="unit">${{ homeInsurance }}/{{ $t ('month') }}</span>
            </div>
          </div>
          <div class="input-group">
            <label>{{ $t('pmi') }}</label>
            <div class="input-wrapper">
              <input type="number" v-model="pmi" @input="pmi = pmi || 0"/>
              <span class="unit">${{ pmi }}/{{ $t ('month') }}</span>
            </div>
          </div>
          <div class="input-group">
            <label>{{ $t('hoaFees') }}</label>
            <div class="input-wrapper">
              <input type="number" v-model="hoaFees" @input="hoaFees = hoaFees || 0"/>
              <span class="unit">${{ hoaFees }}/{{ $t ('month') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown Section -->
      <div class="payment-breakdown">
        <div class="payment-breakdown-box">
          <h2>{{ $t('mortgageBreakdown') }}</h2>
          <div class="breakdown-content">
            <div class="chart-container">
              <canvas ref="chart"></canvas>
            </div>
            <div class="breakdown-details">
              <div class="breakdown-list">
                <div class="breakdown-item">
                  <span class="percentage">{{ ((calculatePrincipalInterest / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">{{ $t('principalInterest') }}</span>
                  <span class="amount">{{ `$${calculatePrincipalInterest}` }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.propertyTax / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">{{ $t('propertyTax') }}</span>
                  <span class="amount">${{ this.propertyTax }} /{{ $t('month') }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.homeInsurance / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">{{ $t('homeownersInsurance') }}</span>
                  <span class="amount">${{ this.homeInsurance }} /{{ $t('month') }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.pmi / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">{{ $t('pmi') }}</span>
                  <span class="amount">${{ this.pmi }} /{{ $t('month') }}</span>
                </div>
                <div class="breakdown-item">
                  <span class="percentage">{{ ((this.hoaFees / calculateMonthlyPayment) * 100).toFixed(0) }}%</span>
                  <span class="label">{{ $t('hoaFees') }}</span>
                  <span class="amount">${{ this.hoaFees }} /{{ $t('month') }}</span>
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
import axios from 'axios';

//const ZillowKey = process.env.VUE_APP_ZILLOW_KEY;

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default {
  data() {
    return {
      // Bot Chat data
      showBot: false,
      hidingBot: false,
      showMessage: false,
      hidingMessage: false,
      isTyping: false,
      botMessage: "", 
      typedContent: "",
      typingSpeed: 50, // milliseconds between characters
      typingIndex: 0,
      typingTimer: null,
      botHideTimer: null,
      words: [],
      currentWordIndex: 0,

      // mortgage data
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
  created() {
    // Non-reactive container for chart instance
    this._chart = null;
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
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      this.renderChart();
    },
    // async fetchInterestRates() {
    //   try {
    //     const response = await fetch("https://mortgageapi.zillow.com/api/getRates?partnerId=YOUR_PARTNER_ID");
    //     const data = await response.json();
    //     this.rates = data.rates; /
    //   } catch (error) {
    //     console.error("Error fetching mortgage rates:", error);
    //   }
    // },

    // Bot Chat method
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
        const systemPrompt = this.$i18n.locale === "vi" 
          ? "Bạn là một chuyên gia tài chính đang phân tích khoản vay thế chấp. Hãy đưa ra lời khuyên bằng tiếng Việt."
          : "You are a financial expert providing insights on mortgage payment.";

        const userPrompt = this.$i18n.locale === "vi"
          ? `Phân tích dữ liệu khoản vay thế chấp sau:
            - Giá nhà: $${this.homePrice}
            - Trả trước: $${this.downPayment} (${this.downPaymentPercentage}%)
            - Thời hạn vay: ${this.loanTerm} năm
            - Lãi suất: ${this.interestRate}%
            - Thuế tài sản: $${this.propertyTax}/tháng
            - Bảo hiểm nhà: $${this.homeInsurance}/tháng
            - PMI: $${this.pmi}/tháng
            - Phí HOA: $${this.hoaFees}/tháng
            - Thanh toán hàng tháng: $${this.calculateMonthlyPayment}
            Đưa ra 2-3 câu nhận xét. Giữ ngắn gọn và thực tế.`
          : `Analyze this mortgage data:
            - Home Price: $${this.homePrice}
            - Down Payment: $${this.downPayment} (${this.downPaymentPercentage}%)
            - Loan Term: ${this.loanTerm} years
            - Interest Rate: ${this.interestRate}%
            - Property Tax: $${this.propertyTax}/month
            - Home Insurance: $${this.homeInsurance}/month
            - PMI: $${this.pmi}/month
            - HOA Fees: $${this.hoaFees}/month
            - Monthly Payment: $${this.calculateMonthlyPayment}
            Provide 2-3 sentences of insights. Keep it concise and actionable.`;

        const response = await axios.post(url, {
          model: "deepseek/deepseek-chat:free",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            {
              role: "user",
              content: userPrompt
            }
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.VUE_APP_DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });

        return response.data.choices[0].message.content;
      } catch (error) {
        console.error("Error generating mortgage insights:", error);
        return this.$i18n.locale === "vi" 
          ? "Không thể tạo thông tin chi tiết vào lúc này. Vui lòng thử lại sau."
          : "Unable to generate insights at the moment. Please try again later.";
      }
    },

    
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
      if (this._chart) {
        this._chart.destroy(); // Destroy previous chart instance
      }

      const ctx = this.$refs.chart.getContext('2d');
      this._chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            this.$t('principalInterest'),
            this.$t('propertyTax'),
            this.$t('homeownersInsurance'),
            this.$t('pmi'),
            this.$t('hoaFees')
          ],
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

            // Clear the center area first
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.25;
            ctx.clearRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

            // Calculate positions relative to center 
            const titleY = centerY - 60; 
            const amountY = centerY - 30; 

            // Draw "Monthly total" text
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#333333';
            ctx.font = '16px Arial';
            const text = this.$t('monthlyTotal');
            ctx.fillText(text, centerX, titleY);

            // Draw payment amount with larger, bold font
            ctx.font = 'bold 28px Arial';
            const paymentText = `$${this.calculateMonthlyPayment}`;
            ctx.fillText(paymentText, centerX, amountY);

            ctx.save();
          }
        }]
      });
    },

    updateChartLabels() {
      if (!this._chart) return;
      
      this._chart.data.labels = [
        this.$t('principalInterest'),
        this.$t('propertyTax'),
        this.$t('homeownersInsurance'),
        this.$t('pmi'),
        this.$t('hoaFees')
      ];

      // Update tooltip to use translated month
      this._chart.options.plugins.tooltip.callbacks.label = (context) => {
        return `${context.label}: $${context.raw.toFixed(2)}/${this.$t('month')}`;
      };
      
      this._chart.update();
    },

    // Add new method for updating bot message
    async updateBotMessage() {
      this.isTyping = true;
      const insights = await this.generateMortgageInsights();
      this.botMessage = insights;
      this.isTyping = false;
      this.words = this.botMessage.split(/( |\n)/g).filter(word => word !== "");
      this.currentWordIndex = this.words.length; // Set to end to show full message
      this.typedContent = this.botMessage.replace(/\n/g, '<br>');
    },
  },
  watch: {
    homePrice() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on home price change
    },
    downPayment() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on down payment change
    },
    loanTerm() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on loan term change
    },
    interestRate() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on interest rate change
    },
    propertyTax() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on property tax change
    },
    homeInsurance() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on home insurance change
    },
    pmi() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on PMI change
    },
    hoaFees() {
      this.renderChart();
      this.startBotAnimation(); // Trigger chatbot on HOA fees change
    },
    '$i18n.locale': {
      immediate: true,
      async handler() {
        this.updateChartLabels();
        // Update bot message if it's visible
        if (this.showBot && this.showMessage) {
          await this.updateBotMessage();
        } else {
          // If bot is not visible, trigger a new animation
          await this.startBotAnimation();
        }
      }
    }
  },


  mounted() {
    this.renderChart();
  }
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

/* Mortgage Calculator Container */
.mortgage-calc {
  max-width: 95%;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

/* Headings */
h1 {
  font-size: 40px;
  margin-bottom: 20px;
  color: #007bff;
}

/* Layout */
.content-wrapper {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* Input Section */
.input-section {
  max-width: 30%;
  flex-grow: 1;
}

/* Loan Input Group */
.loan-group {
  margin-bottom: 15px;
  width: 100%;
  border-radius: 25px;
}

/* Payment Breakdown Box */
.payment-breakdown-box {
  border: 2px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  flex: 1;
}

.payment-breakdown {
  flex: 1;
}

/* Input Groups */
.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column; /* This will stack children vertically */
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

/* Input Wrapper */
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

/* Split Input */
.split-input {
  display: flex;
  gap: 10px;
}

/* Toggle Header */
.toggle-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toggle-header button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.toggle-header button label {
  font-size: 1.2rem;
  font-weight: bold;
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
  max-width: 100%;
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

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
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

/* Mobile responsiveness */
@media (max-width: 768px) {
  .breakdown-content {
    flex-direction: column;
    gap: 30px;
  }
  
  .chart-container,
  .breakdown-details {
    width: 100%;
  }
  
  .breakdown-item {
    flex-wrap: wrap;
    gap: 5px;
  }
  
  .breakdown-item .percentage {
    order: 1;
    width: 15%;
  }
  
  .breakdown-item .label {
    order: 2;
    width: 60%;
  }
  
  .breakdown-item .amount {
    order: 3;
    width: 25%;
    text-align: right;
  }

  .mortgage-calc {
    max-width: 100%;
    padding: 15px;
    margin: 0 auto;
  }

  h1 {
    font-size: 28px;
    margin-bottom: 15px;
  }

  .content-wrapper {
    flex-direction: column;
    gap: 15px;
  }

  .input-section {
    max-width: 100%;
    width: 100%;
  }

  .payment-breakdown-box {
    padding: 15px;
    margin-top: 15px;
  }

  .payment-breakdown h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .breakdown-content {
    flex-direction: column;
    gap: 15px;
  }

  .chart-container {
    width: 100%;
    height: 200px;
  }

  .breakdown-details {
    width: 100%;
  }

  .breakdown-item {
    padding: 8px;
    font-size: 14px;
  }

  .percentage {
    min-width: 40px;
  }

  .label {
    margin: 0 8px;
    font-size: 13px;
  }

  .amount {
    min-width: 70px;
    text-align: right;
  }

  /* Input adjustments */
  input, select {
    font-size: 14px;
    padding: 8px 10px;
  }

  .split-input {
    flex-direction: column;
    gap: 8px;
  }

  .toggle-header button label {
    font-size: 1rem;
  }

  /* Bot chat adjustments for mobile */
  .bot-chat-container {
    right: -280px;
    width: 250px;
    top: auto;
    bottom: 20px;
  }

  .bot-chat-container.bot-visible {
    transform: translateX(-280px);
  }

  .bot-message {
    max-width: 230px;
    padding: 10px 15px;
  }
}

</style>