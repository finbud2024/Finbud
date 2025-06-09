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
              <ChartLoader v-if="isLoading" :text="$t('calculatingMortgage')" />
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
import ChartLoader from '@/components/Common/ChartLoader.vue';

//const ZillowKey = process.env.VUE_APP_ZILLOW_KEY;

Chart.register(PieController, ArcElement, Tooltip, Legend);

export default {
  components: {
    ChartLoader
  },
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
      isLoading: false,
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
    async renderChart() {
      this.isLoading = true;
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (this._chart) {
        this._chart.destroy(); // Destroy previous chart instance
      }

      const ctx = this.$refs.chart.getContext('2d');
      this._chart = new Chart(ctx, {
        type: 'doughnut',
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
            backgroundColor: [
              '#1a1a1a', // Dark blue for principal & interest
              '#e74c3c', // Red for property tax
              '#27ae60', // Green for insurance
              '#f39c12', // Orange for PMI
              '#8e44ad'  // Purple for HOA fees
            ],
            borderColor: '#ffffff',
            borderWidth: 2,
            borderRadius: 5,
            spacing: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          layout: {
            padding: 20
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#000000',
                font: {
                  size: 13,
                  family: "'Space Grotesk', sans-serif",
                  weight: '500'
                },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle'
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
                family: "'Space Grotesk', sans-serif",
                weight: '600'
              },
              bodyFont: {
                size: 13,
                family: "'Space Grotesk', sans-serif"
              },
              callbacks: {
                label: function(context) {
                  const value = context.raw.toFixed(2);
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.raw / total) * 100).toFixed(1);
                  return `${context.label}: $${value} (${percentage}%)`;
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

            // Clear the center area
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.25;
            ctx.clearRect(centerX - radius, centerY - radius, radius * 2, radius * 2);

            // Draw background circle
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 0.9, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();

            // Calculate positions for text
            const titleY = centerY - 25;
            const amountY = centerY + 10;

            // Draw "Monthly total" text
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#000000';
            ctx.font = "600 16px 'Space Grotesk'";
            const text = this.$t('monthlyTotal');
            ctx.fillText(text, centerX, titleY);

            // Draw payment amount
            ctx.font = "700 24px 'Space Grotesk'";
            const paymentText = `$${this.calculateMonthlyPayment}`;
            ctx.fillText(paymentText, centerX, amountY);

            ctx.save();
          }
        }]
      });
      
      this.isLoading = false;
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
/* Base styles - Fixed horizontal scroll */
.mortgage-calc {
  max-width: 95%;
  width: 100%;
  margin: auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow-x: hidden;
}

/* Headings */
h1 {
  font-size: 40px;
  margin-bottom: 20px;
  color: #000000;
  font-weight: 600;
  transition: color 0.3s ease;
}

h2 {
  color: #000000;
  font-size: 24px;
  margin-bottom: 15px;
  font-weight: 500;
}

/* Layout - Enhanced Mobile First */
.content-wrapper {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  animation: fadeIn 0.5s ease;
}

/* Desktop layout */
@media (min-width: 968px) {
  .content-wrapper {
    grid-template-columns: 400px 1fr;
    gap: 3rem;
    max-width: 1200px;
    padding: 0 1rem;
  }
}

/* Input Section - Mobile First */
.input-section {
  width: 100%;
  max-width: 100%;
  animation: slideIn 0.5s ease;
  box-sizing: border-box;
  overflow-x: hidden;
  padding: 0;
}

@media (min-width: 968px) {
  .input-section {
    max-width: 400px;
  }
}

/* Input Groups */
.input-group {
  margin-bottom: 20px;
  opacity: 0;
  animation: fadeInUp 0.5s ease forwards;
}

.input-group:nth-child(1) { animation-delay: 0.1s; }
.input-group:nth-child(2) { animation-delay: 0.2s; }
.input-group:nth-child(3) { animation-delay: 0.3s; }
.input-group:nth-child(4) { animation-delay: 0.4s; }

label {
  font-weight: 500;
  color: #333333;
  display: block;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

/* Input Wrapper - Mobile Optimized */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

input, select {
  width: 100%;
  max-width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: #ffffff;
  transition: all 0.3s ease;
  box-sizing: border-box;
  min-width: 0;
}

input:focus, select:focus {
  border-color: #000000;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.unit {
  position: absolute;
  right: 12px;
  font-size: 14px;
  color: #666666;
  pointer-events: none;
}

/* Payment Breakdown Box */
.payment-breakdown-box {
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 25px;
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
  flex: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: slideInRight 0.5s ease;
}

.payment-breakdown-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

/* Payment Breakdown - Mobile First */
.payment-breakdown {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
}

@media (min-width: 968px) {
  .payment-breakdown {
    flex: 1;
    min-width: 500px;
  }
}

/* Breakdown Details */
.breakdown-list {
  margin-top: 20px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  background: #f8f8f8;
  transition: all 0.3s ease;
}

.breakdown-item:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}

.percentage {
  font-weight: 600;
  color: #000000;
  margin-right: 15px;
  min-width: 45px;
}

.label {
  flex: 1;
  color: #333333;
}

.amount {
  font-weight: 500;
  color: #000000;
}

/* Toggle Header */
.toggle-header button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 12px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toggle-header button:hover {
  background: #f5f5f5;
}

.dropdown-icon {
  transition: transform 0.3s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

/* Extra Content Animation */
.extra-content {
  animation: slideDown 0.3s ease;
}

/* Loading States */
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

/* Bot Chat Styles - Base */
.bot-chat-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
}

.bot-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  pointer-events: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid #ffffff;
}

.bot-image:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.bot-message {
  background: #2196f3;
  color: white;
  padding: 12px 16px;
  border-radius: 16px;
  margin-bottom: 10px;
  max-width: 280px;
  font-size: 14px;
  line-height: 1.4;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  pointer-events: auto;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  position: relative;
}

.bot-message::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #2196f3;
}

.bot-message.message-visible {
  opacity: 1;
  transform: translateY(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: translateY(10px);
}

/* Typing Animation */
.typing-animation {
  display: flex;
  gap: 4px;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
.dot:nth-child(3) { animation-delay: 0s; }

@keyframes typing {
  0%, 80%, 100% { 
    transform: scale(0.8);
    opacity: 0.5; 
  }
  40% { 
    transform: scale(1);
    opacity: 1; 
  }
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

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: top;
  }
  to {
    opacity: 1;
    transform: scaleY(1);
    transform-origin: top;
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Enhanced Responsive Design - Fix placeholder overflow and bot positioning */
@media (max-width: 1400px) {
  .mortgage-calc {
    max-width: 100%;
    padding: 1.5rem;
  }
  
  .content-wrapper {
    gap: 2rem;
  }
  
  .input-section {
    max-width: 100%;
  }
  
  .payment-breakdown-box {
    padding: 2rem;
  }
  
  /* Bot positioning adjustments */
  .bot-chat-container {
    right: 2rem;
    bottom: 2rem;
  }
  
  .bot-image {
    width: 55px;
    height: 55px;
  }
  
  .bot-message {
    max-width: 250px;
    font-size: 13px;
  }
}

@media (max-width: 1200px) {
  .content-wrapper {
    flex-direction: column;
    gap: 2rem;
  }
  
  .input-section {
    max-width: 100%;
  }
  
  h1 {
    font-size: 2.5rem;
    text-align: center;
  }
  
  .breakdown-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .chart-container {
    min-height: 300px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }
  
  /* Bot adjustments for medium screens */
  .bot-chat-container {
    right: 1.5rem;
    bottom: 1.5rem;
  }
  
  .bot-image {
    width: 50px;
    height: 50px;
  }
  
  .bot-message {
    max-width: 220px;
    font-size: 12px;
    padding: 10px 14px;
  }
}

@media (max-width: 968px) {
  .mortgage-calc {
    padding: 1.25rem;
  }
  
  h1 {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .content-wrapper {
    gap: 1.75rem;
    position: relative; /* For bot positioning */
  }
  
  .input-group {
    margin-bottom: 1.5rem;
  }
  
  .split-input {
    flex-direction: column;
    gap: 1rem;
  }
  
  .split-input .input-wrapper {
    width: 100%;
  }
  
  .payment-breakdown-box {
    padding: 1.75rem;
    position: relative; /* For bot container */
  }
  
  .breakdown-details {
    margin-top: 1rem;
  }
  
  .breakdown-item {
    padding: 1rem;
    font-size: 0.95rem;
  }
  
  /* Fix input overflow issues */
  .input-wrapper {
    overflow: hidden;
    position: relative;
  }
  
  .input-wrapper input {
    width: 100%;
    padding-right: 60px; /* Make room for unit */
    box-sizing: border-box;
  }
  
  .unit {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    white-space: nowrap;
    font-size: 0.9rem;
    color: #666;
    max-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Relocate bot for mobile - smaller and less intrusive */
  .bot-chat-container {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 100;
  }
  
  .bot-image {
    width: 45px;
    height: 45px;
  }
  
  .bot-message {
    max-width: 200px;
    font-size: 11px;
    padding: 8px 12px;
  }
}

@media (max-width: 768px) {
  .mortgage-calc {
    padding: 1rem;
    max-width: 100%;
    width: 100%;
    overflow-x: hidden;
    margin: 0 auto;
  }

  h1 {
    font-size: 1.75rem;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .content-wrapper {
    gap: 1.5rem;
    position: relative;
    flex-direction: column;
    max-width: 100%;
    overflow-x: hidden;
  }

  .input-section {
    max-width: 100%;
    overflow: hidden;
  }

  .input-group {
    margin-bottom: 1.25rem;
  }

  .split-input {
    flex-direction: column;
    gap: 1rem;
  }

  .split-input .input-wrapper {
    width: 100%;
  }

  /* Enhanced input wrapper for mobile */
  .input-wrapper {
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e0e6ed;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    max-width: 100%;
  }

  .input-wrapper input {
    flex: 1;
    border: none;
    outline: none;
    padding: 0.875rem 0.75rem;
    font-size: 16px; /* Prevent iOS zoom */
    background: transparent;
    min-width: 0; /* Allow shrinking */
    width: calc(100% - 60px);
  }

  .input-wrapper .unit {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    color: #6c757d;
    white-space: nowrap;
    max-width: 50px;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
  }

  /* Better select styling */
  select {
    padding: 0.875rem;
    font-size: 16px;
    border: 2px solid #e0e6ed;
    border-radius: 8px;
    background: white;
    width: 100%;
    min-height: 44px; /* Touch target */
  }

  /* Enhanced payment breakdown */
  .payment-breakdown {
    position: relative;
    overflow: hidden;
  }

  .payment-breakdown-box {
    padding: 1.5rem;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
  }

  .breakdown-content {
    flex-direction: column;
    gap: 1.5rem;
  }

  .chart-container {
    min-height: 250px;
    margin-bottom: 1rem;
  }

  .breakdown-item {
    padding: 0.875rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .breakdown-item .percentage {
    font-size: 0.9rem;
    min-width: 40px;
  }

  .breakdown-item .label {
    flex: 1;
    font-size: 0.9rem;
    min-width: 0;
  }

  .breakdown-item .amount {
    font-size: 0.9rem;
    white-space: nowrap;
  }

  /* Enhanced bot positioning for mobile */
  .bot-chat-container {
    position: fixed;
    right: 0.75rem;
    bottom: 0.75rem;
    z-index: 100;
  }

  .bot-image {
    width: 42px;
    height: 42px;
  }

  .bot-message {
    max-width: 180px;
    font-size: 11px;
    padding: 8px 10px;
  }

  /* Error message improvements */
  .error {
    font-size: 0.8rem;
    color: #dc3545;
    margin-top: 0.25rem;
    display: block;
  }

  /* Toggle button improvements */
  .toggle-header button {
    width: 100%;
    padding: 1rem;
    font-size: 16px;
    min-height: 44px;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .mortgage-calc {
    padding: 0.875rem;
  }

  h1 {
    font-size: 1.625rem;
    margin-bottom: 1.25rem;
  }

  .content-wrapper {
    gap: 1.25rem;
  }

  .input-group {
    margin-bottom: 1rem;
  }

  .input-group label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .input-wrapper input {
    padding: 0.75rem;
    font-size: 16px;
    width: calc(100% - 55px);
  }

  .input-wrapper .unit {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
    max-width: 45px;
    right: 0.5rem;
  }

  .payment-breakdown-box {
    padding: 1.25rem;
  }

  .breakdown-item {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .breakdown-item .percentage,
  .breakdown-item .label,
  .breakdown-item .amount {
    font-size: 0.85rem;
  }

  /* Smaller bot for small screens */
  .bot-image {
    width: 40px;
    height: 40px;
  }

  .bot-message {
    max-width: 160px;
    font-size: 10px;
    padding: 6px 8px;
  }
}

@media (max-width: 480px) {
  .mortgage-calc {
    padding: 0.75rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .content-wrapper {
    gap: 1rem;
  }

  .input-group {
    margin-bottom: 0.875rem;
  }

  .input-group label {
    font-size: 0.85rem;
  }

  .input-wrapper input {
    padding: 0.625rem;
    font-size: 16px;
    width: calc(100% - 50px);
  }

  .input-wrapper .unit {
    font-size: 0.7rem;
    padding: 0.15rem 0.3rem;
    max-width: 40px;
    right: 0.4rem;
  }

  .payment-breakdown-box {
    padding: 1rem;
  }

  .payment-breakdown-box h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .chart-container {
    min-height: 200px;
  }

  .breakdown-item {
    padding: 0.625rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .breakdown-item .percentage {
    font-weight: 700;
    color: #007bff;
  }

  /* Extra small bot */
  .bot-chat-container {
    right: 0.5rem;
    bottom: 0.5rem;
  }

  .bot-image {
    width: 38px;
    height: 38px;
  }

  .bot-message {
    max-width: 150px;
    font-size: 9px;
    padding: 5px 7px;
  }
}

@media (max-width: 320px) {
  .mortgage-calc {
    padding: 0.5rem;
  }

  h1 {
    font-size: 1.375rem;
    margin-bottom: 0.875rem;
  }

  .input-group label {
    font-size: 0.8rem;
  }

  .input-wrapper input {
    padding: 0.5rem;
    font-size: 16px;
    width: calc(100% - 45px);
  }

  .input-wrapper .unit {
    font-size: 0.65rem;
    padding: 0.1rem 0.25rem;
    max-width: 35px;
    right: 0.3rem;
  }

  .payment-breakdown-box {
    padding: 0.875rem;
  }

  .payment-breakdown-box h2 {
    font-size: 1.125rem;
  }

  .chart-container {
    min-height: 180px;
  }

  .breakdown-item {
    padding: 0.5rem;
  }

  .breakdown-item .percentage,
  .breakdown-item .label,
  .breakdown-item .amount {
    font-size: 0.8rem;
  }

  /* Tiny bot for very small screens */
  .bot-image {
    width: 35px;
    height: 35px;
  }

  .bot-message {
    max-width: 130px;
    font-size: 8px;
    padding: 4px 6px;
  }
}

/* Mobile-specific optimizations */
@media (max-width: 768px) {
  /* Prevent horizontal scroll */
  .mortgage-calc,
  .content-wrapper,
  .input-section,
  .payment-breakdown {
    overflow-x: hidden;
  }

  /* Ensure inputs don't break layout */
  .input-wrapper {
    max-width: 100%;
    box-sizing: border-box;
  }

  .input-wrapper input {
    max-width: 100%;
    box-sizing: border-box;
  }

  /* Better focus states */
  .input-wrapper:focus-within {
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }

  select:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }

  /* Enhanced touch targets */
  .toggle-header button,
  select,
  .input-wrapper {
    min-height: 44px;
  }

  /* Better text rendering */
  .breakdown-item .amount {
    word-break: break-all;
  }

  /* Improve bot visibility */
  .bot-chat-container {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    padding: 0.25rem;
    backdrop-filter: blur(5px);
  }

  /* Prevent zoom on iOS */
  input,
  select {
    font-size: 16px !important;
  }
}
</style>