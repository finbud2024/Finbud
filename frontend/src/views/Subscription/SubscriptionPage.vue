<template>
  <div class="subscription-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <font-awesome-icon icon="fa-solid fa-crown" class="crown-icon" />
            Upgrade to FinPlus
          </h1>
          <p class="hero-subtitle">
            Unlock premium features and take your financial journey to the next level
          </p>
          <div class="hero-features">
            <div class="feature-item">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Advanced Analytics & Insights</span>
            </div>
            <div class="feature-item">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Priority Customer Support</span>
            </div>
            <div class="feature-item">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Exclusive Investment Tools</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card">
            <font-awesome-icon icon="fa-solid fa-chart-line" />
            <span>Premium Analytics</span>
          </div>
          <div class="floating-card">
            <font-awesome-icon icon="fa-solid fa-robot" />
            <span>AI Insights</span>
          </div>
          <div class="floating-card">
            <font-awesome-icon icon="fa-solid fa-shield-alt" />
            <span>Priority Support</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pricing Section -->
    <div class="pricing-section">
      <div class="pricing-header">
        <h2>Choose Your Plan</h2>
        <p>Select the perfect plan for your financial goals</p>
      </div>

      <div class="pricing-cards">
        <!-- Basic Plan -->
        <div class="pricing-card basic-plan">
          <div class="plan-header">
            <div class="plan-icon">
              <font-awesome-icon icon="fa-solid fa-star" />
            </div>
            <h3>FinPlus Basic</h3>
            <p class="plan-description">Perfect for getting started with premium features</p>
          </div>
          
          <div class="plan-price">
            <span class="currency">$</span>
            <span class="amount">5.99</span>
            <span class="period">/month</span>
          </div>

          <div class="plan-features">
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Advanced Portfolio Analytics</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Real-time Market Data</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>5 Custom Watchlists</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Email Support</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Monthly Market Reports</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Basic Risk Assessment</span>
            </div>
          </div>

          <button class="subscribe-btn basic-btn" @click="selectPlan('basic')">
            <font-awesome-icon icon="fa-solid fa-rocket" />
            Get Started
          </button>
        </div>

        <!-- Premium Plan -->
        <div class="pricing-card premium-plan featured">
          <div class="featured-badge">
            <font-awesome-icon icon="fa-solid fa-crown" />
            Most Popular
          </div>
          
          <div class="plan-header">
            <div class="plan-icon premium-icon">
              <font-awesome-icon icon="fa-solid fa-crown" />
            </div>
            <h3>FinPlus Premium</h3>
            <p class="plan-description">Complete financial toolkit for serious investors</p>
          </div>
          
          <div class="plan-price">
            <span class="currency">$</span>
            <span class="amount">9.99</span>
            <span class="period">/month</span>
          </div>

          <div class="plan-features">
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Everything in Basic Plan</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>AI-Powered Investment Insights</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Unlimited Watchlists</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Priority 24/7 Support</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Advanced Risk Analytics</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Custom Trading Strategies</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Exclusive Market Research</span>
            </div>
            <div class="feature">
              <font-awesome-icon icon="fa-solid fa-check" />
              <span>Portfolio Optimization Tools</span>
            </div>
          </div>

          <button class="subscribe-btn premium-btn" @click="selectPlan('premium')">
            <font-awesome-icon icon="fa-solid fa-crown" />
            Upgrade Now
          </button>
        </div>
      </div>
    </div>

    <!-- Features Comparison -->
    <div class="comparison-section">
      <div class="comparison-header">
        <h2>Feature Comparison</h2>
        <p>See what's included in each plan</p>
      </div>

      <div class="comparison-table">
        <div class="table-header">
          <div class="feature-column">Features</div>
          <div class="plan-column">Basic</div>
          <div class="plan-column premium">Premium</div>
        </div>

        <div class="table-row" v-for="feature in comparisonFeatures" :key="feature.name">
          <div class="feature-name">{{ feature.name }}</div>
          <div class="feature-value">
            <font-awesome-icon 
              :icon="feature.basic ? 'fa-solid fa-check' : 'fa-solid fa-times'" 
              :class="{ 'available': feature.basic, 'unavailable': !feature.basic }"
            />
          </div>
          <div class="feature-value">
            <font-awesome-icon 
              :icon="feature.premium ? 'fa-solid fa-check' : 'fa-solid fa-times'" 
              :class="{ 'available': feature.premium, 'unavailable': !feature.premium }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section">
      <div class="faq-header">
        <h2>Frequently Asked Questions</h2>
        <p>Everything you need to know about FinPlus</p>
      </div>

      <div class="faq-list">
        <div 
          class="faq-item" 
          v-for="(faq, index) in faqs" 
          :key="index"
          :class="{ 'active': activeFaq === index }"
          @click="toggleFaq(index)"
        >
          <div class="faq-question">
            <span>{{ faq.question }}</span>
            <font-awesome-icon 
              icon="fa-solid fa-chevron-down" 
              :class="{ 'rotated': activeFaq === index }"
            />
          </div>
          <div class="faq-answer" v-show="activeFaq === index">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="cta-section">
      <div class="cta-content">
        <h2>Ready to Upgrade Your Financial Journey?</h2>
        <p>Join thousands of users who have already upgraded to FinPlus</p>
        <div class="cta-buttons">
          <button class="cta-btn primary" @click="selectPlan('premium')">
            <font-awesome-icon icon="fa-solid fa-crown" />
            Start Premium Trial
          </button>
          <button class="cta-btn secondary" @click="selectPlan('basic')">
            <font-awesome-icon icon="fa-solid fa-star" />
            Try Basic Plan
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div v-if="showPaymentModal" class="payment-modal-overlay" @click="closePaymentModal">
      <div class="payment-modal" @click.stop>
        <div class="modal-header">
          <h3>Complete Your Subscription</h3>
          <button class="close-btn" @click="closePaymentModal">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        
        <div class="modal-content">
          <div class="selected-plan">
            <div class="plan-summary">
              <h4>{{ selectedPlan === 'premium' ? 'FinPlus Premium' : 'FinPlus Basic' }}</h4>
              <p class="plan-price">${{ selectedPlan === 'premium' ? '9.99' : '5.99' }}/month</p>
            </div>
          </div>

          <div class="payment-form">
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" v-model="paymentForm.cardNumber">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input type="text" placeholder="MM/YY" v-model="paymentForm.expiryDate">
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" v-model="paymentForm.cvv">
              </div>
            </div>

            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" placeholder="John Doe" v-model="paymentForm.cardholderName">
            </div>

            <button class="payment-btn" @click="processPayment" :disabled="isProcessing">
              <font-awesome-icon 
                :icon="isProcessing ? 'fa-solid fa-spinner' : 'fa-solid fa-credit-card'" 
                :class="{ 'spinning': isProcessing }"
              />
              {{ isProcessing ? 'Processing...' : 'Subscribe Now' }}
            </button>
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
  faCrown, faCheck, faChartLine, faRobot, faShieldAlt, faStar,
  faRocket, faTimes, faChevronDown, faCreditCard, faSpinner
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faCrown, faCheck, faChartLine, faRobot, faShieldAlt, faStar,
  faRocket, faTimes, faChevronDown, faCreditCard, faSpinner
);

export default {
  name: 'SubscriptionPage',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      showPaymentModal: false,
      selectedPlan: null,
      isProcessing: false,
      activeFaq: null,
      paymentForm: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      },
      comparisonFeatures: [
        { name: 'Portfolio Analytics', basic: true, premium: true },
        { name: 'Real-time Data', basic: true, premium: true },
        { name: 'Custom Watchlists', basic: '5', premium: 'Unlimited' },
        { name: 'AI Insights', basic: false, premium: true },
        { name: 'Priority Support', basic: false, premium: true },
        { name: 'Advanced Risk Analytics', basic: false, premium: true },
        { name: 'Custom Trading Strategies', basic: false, premium: true },
        { name: 'Market Research', basic: false, premium: true },
        { name: 'Portfolio Optimization', basic: false, premium: true }
      ],
      faqs: [
        {
          question: 'What is FinPlus?',
          answer: 'FinPlus is our premium subscription service that unlocks advanced financial tools, AI-powered insights, and priority support to help you make better investment decisions.'
        },
        {
          question: 'Can I cancel anytime?',
          answer: 'Yes, you can cancel your subscription at any time. Your access to premium features will continue until the end of your current billing period.'
        },
        {
          question: 'Is there a free trial?',
          answer: 'Yes, we offer a 7-day free trial for new Premium subscribers. You can cancel before the trial ends without being charged.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards including Visa, MasterCard, American Express, and Discover. We also support PayPal payments.'
        },
        {
          question: 'How do I upgrade or downgrade my plan?',
          answer: 'You can change your plan at any time from your account settings. Changes will take effect at the start of your next billing cycle.'
        }
      ]
    }
  },
  methods: {
    selectPlan(plan) {
      this.selectedPlan = plan;
      this.showPaymentModal = true;
    },
    closePaymentModal() {
      this.showPaymentModal = false;
      this.selectedPlan = null;
      this.resetPaymentForm();
    },
    resetPaymentForm() {
      this.paymentForm = {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: ''
      };
    },
    async processPayment() {
      this.isProcessing = true;
      
      // Simulate payment processing
      setTimeout(() => {
        this.isProcessing = false;
        this.closePaymentModal();
        this.showSuccessMessage();
      }, 2000);
    },
    showSuccessMessage() {
      alert(`Successfully subscribed to FinPlus ${this.selectedPlan === 'premium' ? 'Premium' : 'Basic'}!`);
    },
    toggleFaq(index) {
      this.activeFaq = this.activeFaq === index ? null : index;
    }
  }
};
</script>

<style scoped>
.subscription-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  padding: 6rem 2rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.crown-icon {
  color: #fbbf24;
  font-size: 3rem;
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
}

.feature-item svg {
  color: #10b981;
  font-size: 1.2rem;
}

.hero-visual {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
}

.floating-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  animation: float 6s ease-in-out infinite;
}

.floating-card:nth-child(2) {
  animation-delay: -2s;
  margin-left: 2rem;
}

.floating-card:nth-child(3) {
  animation-delay: -4s;
  margin-left: 1rem;
}

.floating-card svg {
  font-size: 2rem;
  color: #fbbf24;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Pricing Section */
.pricing-section {
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-header {
  text-align: center;
  margin-bottom: 4rem;
}

.pricing-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.pricing-header p {
  font-size: 1.2rem;
  color: #666;
}

.pricing-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 900px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid #f1f5f9;
  transition: all 0.3s ease;
  position: relative;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.pricing-card.featured {
  border-color: #fbbf24;
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-8px);
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.plan-header {
  text-align: center;
  margin-bottom: 2rem;
}

.plan-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: #64748b;
}

.premium-icon {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.plan-header h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.plan-description {
  color: #666;
  font-size: 1rem;
}

.plan-price {
  text-align: center;
  margin-bottom: 2.5rem;
}

.currency {
  font-size: 1.5rem;
  color: #666;
  vertical-align: top;
}

.amount {
  font-size: 4rem;
  font-weight: 900;
  color: #1a1a1a;
}

.period {
  font-size: 1.2rem;
  color: #666;
}

.plan-features {
  margin-bottom: 2.5rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.feature:last-child {
  border-bottom: none;
}

.feature svg {
  color: #10b981;
  font-size: 1.1rem;
  min-width: 16px;
}

.subscribe-btn {
  width: 100%;
  padding: 1.25rem 2rem;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.basic-btn {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
}

.basic-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.premium-btn {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
}

/* Comparison Section */
.comparison-section {
  padding: 6rem 2rem;
  background: #f8f9fa;
}

.comparison-header {
  text-align: center;
  margin-bottom: 3rem;
}

.comparison-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.comparison-table {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  background: linear-gradient(135deg, #000000, #1a1a1a);
  color: white;
  font-weight: 700;
  padding: 1.5rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.feature-name {
  font-weight: 600;
  color: #1a1a1a;
}

.feature-value {
  text-align: center;
}

.available {
  color: #10b981;
}

.unavailable {
  color: #ef4444;
}

.plan-column.premium {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
}

/* FAQ Section */
.faq-section {
  padding: 6rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.faq-header {
  text-align: center;
  margin-bottom: 3rem;
}

.faq-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.faq-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #1a1a1a;
}

.faq-question svg {
  transition: transform 0.3s ease;
}

.faq-question svg.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: #666;
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 3rem;
}

.cta-buttons {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cta-btn.primary {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

/* Payment Modal */
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.payment-modal {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1a1a1a;
}

.modal-content {
  padding: 2rem;
}

.selected-plan {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.plan-summary h4 {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.plan-price {
  font-size: 2rem;
  font-weight: 800;
  color: #fbbf24;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  font-weight: 600;
  color: #1a1a1a;
}

.form-group input {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #fbbf24;
}

.payment-btn {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.payment-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
}

.payment-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .pricing-cards {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .pricing-card.featured {
    transform: none;
  }

  .pricing-card.featured:hover {
    transform: translateY(-8px);
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-value {
    text-align: left;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style> 
 