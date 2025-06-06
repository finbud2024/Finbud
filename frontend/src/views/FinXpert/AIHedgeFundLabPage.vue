<template>
  <div class="ai-hedge-fund-lab">
    <!-- Navigation Breadcrumb -->
    <div class="breadcrumb">
      <span class="breadcrumb-item">FinBud</span>
      <span class="breadcrumb-separator">›</span>
      <span class="breadcrumb-item">AI Hedge Fund Lab</span>
    </div>

    <!-- Hero Section with Mystical Design -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="mystic-particles"></div>
      
      <div class="hero-content">
        <div class="hero-icon">
          <font-awesome-icon icon="fa-solid fa-brain" class="brain-icon" />
          <div class="neural-network">
            <div class="neural-node" v-for="n in 8" :key="n"></div>
          </div>
        </div>
        
        <h1 class="hero-title">
          <span class="title-main">AI HEDGE FUND</span>
          <span class="title-lab">LABORATORY</span>
        </h1>
        
        <p class="hero-subtitle">
          Harness the collective intelligence of legendary investors through advanced AI consensus analysis
        </p>
        
        <div class="premium-badge-hero">
          <span class="premium-text">PREMIUM INTELLIGENCE</span>
          <div class="badge-glow"></div>
        </div>
      </div>

      <!-- Floating Investor Spirits -->
      <div class="floating-investors">
        <div v-for="investor in featuredInvestors" :key="investor.id" 
             class="investor-spirit" :style="{ animationDelay: investor.delay }">
          <div class="spirit-avatar">
            <span class="avatar-text">{{ investor.initials }}</span>
          </div>
          <div class="spirit-name">{{ investor.name }}</div>
        </div>
      </div>
    </section>

    <!-- Core Features Matrix -->
    <section class="features-matrix">
      <div class="matrix-header">
        <h2 class="section-title">NEURAL CAPABILITIES</h2>
        <div class="title-underline"></div>
      </div>

      <div class="features-grid">
        <div v-for="feature in coreFeatures" :key="feature.id" 
             class="feature-card" :class="feature.status">
          <div class="card-header">
            <font-awesome-icon :icon="feature.icon" class="feature-icon" />
            <span class="feature-status">{{ feature.status }}</span>
          </div>
          
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          
          <div class="feature-metrics">
            <div class="metric" v-for="metric in feature.metrics" :key="metric.label">
              <span class="metric-value">{{ metric.value }}</span>
              <span class="metric-label">{{ metric.label }}</span>
            </div>
          </div>

          <button class="feature-action" :disabled="feature.status === 'locked'">
            {{ feature.actionText }}
          </button>
        </div>
      </div>
    </section>

    <!-- AI Consensus Dashboard -->
    <section class="consensus-dashboard">
      <div class="dashboard-header">
        <h2 class="section-title">LIVE CONSENSUS MATRIX</h2>
        <div class="real-time-indicator">
          <div class="pulse-dot"></div>
          <span>REAL-TIME</span>
        </div>
      </div>

      <div class="consensus-grid">
        <div class="consensus-card market-sentiment">
          <h3>Market Sentiment</h3>
          <div class="sentiment-gauge">
            <div class="gauge-arc"></div>
            <div class="gauge-needle" :style="{ transform: `rotate(${marketSentiment}deg)` }"></div>
            <div class="gauge-value">{{ sentimentLabel }}</div>
          </div>
        </div>

        <div class="consensus-card signal-strength">
          <h3>Signal Strength</h3>
          <div class="signal-bars">
            <div v-for="i in 5" :key="i" 
                 class="signal-bar" 
                 :class="{ active: i <= signalStrength }"></div>
          </div>
          <div class="signal-text">{{ signalStrength }}/5 Consensus</div>
        </div>

        <div class="consensus-card risk-matrix">
          <h3>Risk Assessment</h3>
          <div class="risk-grid">
            <div v-for="risk in riskFactors" :key="risk.factor" 
                 class="risk-item" :class="risk.level">
              <span class="risk-factor">{{ risk.factor }}</span>
              <div class="risk-bar">
                <div class="risk-fill" :style="{ width: risk.value + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Actions Panel -->
    <section class="quick-actions">
      <h2 class="section-title">NEURAL INTERFACE</h2>
      <div class="actions-grid">
        <button v-for="action in quickActions" :key="action.id" 
                class="action-button" :class="action.type">
          <font-awesome-icon :icon="action.icon" />
          <span>{{ action.label }}</span>
          <div class="button-glow"></div>
        </button>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AIHedgeFundLabPage',
  data() {
    return {
      featuredInvestors: [
        { id: 1, name: 'Warren Buffett', initials: 'WB', delay: '0s' },
        { id: 2, name: 'Stanley Druckenmiller', initials: 'SD', delay: '0.5s' },
        { id: 3, name: 'Cathie Wood', initials: 'CW', delay: '1s' },
        { id: 4, name: 'Ray Dalio', initials: 'RD', delay: '1.5s' },
        { id: 5, name: 'George Soros', initials: 'GS', delay: '2s' },
        { id: 6, name: 'Peter Lynch', initials: 'PL', delay: '2.5s' }
      ],
      coreFeatures: [
        {
          id: 1,
          title: 'AI Consensus Engine',
          description: 'Real-time analysis from 16 legendary investment strategies',
          icon: 'fa-solid fa-brain',
          status: 'active',
          actionText: 'Access Console',
          metrics: [
            { value: '16', label: 'AI Agents' },
            { value: '94%', label: 'Accuracy' }
          ]
        },
        {
          id: 2,
          title: 'Signal Matrix',
          description: 'Advanced pattern recognition across multiple timeframes',
          icon: 'fa-solid fa-chart-line',
          status: 'active',
          actionText: 'View Signals',
          metrics: [
            { value: '1,247', label: 'Signals' },
            { value: '87%', label: 'Success Rate' }
          ]
        },
        {
          id: 3,
          title: 'Risk Synthesis',
          description: 'Multi-dimensional risk assessment with hedge fund precision',
          icon: 'fa-solid fa-shield-halved',
          status: 'beta',
          actionText: 'Enter Beta',
          metrics: [
            { value: '0.23', label: 'Sharpe Ratio' },
            { value: '8.4%', label: 'Max Drawdown' }
          ]
        },
        {
          id: 4,
          title: 'Quantum Backtesting',
          description: 'Test strategies across infinite parallel market scenarios',
          icon: 'fa-solid fa-atom',
          status: 'locked',
          actionText: 'Coming Soon',
          metrics: [
            { value: '∞', label: 'Scenarios' },
            { value: '???', label: 'Performance' }
          ]
        }
      ],
      quickActions: [
        { id: 1, label: 'Run Analysis', icon: 'fa-solid fa-play', type: 'primary' },
        { id: 2, label: 'View Portfolio', icon: 'fa-solid fa-briefcase', type: 'secondary' },
        { id: 3, label: 'Market Scanner', icon: 'fa-solid fa-radar', type: 'secondary' },
        { id: 4, label: 'Risk Monitor', icon: 'fa-solid fa-heart-pulse', type: 'warning' }
      ],
      marketSentiment: 45, // degrees for gauge needle
      signalStrength: 4,
      riskFactors: [
        { factor: 'Market Volatility', value: 67, level: 'medium' },
        { factor: 'Liquidity Risk', value: 34, level: 'low' },
        { factor: 'Correlation Risk', value: 89, level: 'high' },
        { factor: 'Tail Risk', value: 45, level: 'medium' }
      ]
    }
  },
  computed: {
    sentimentLabel() {
      if (this.marketSentiment < 30) return 'BEARISH';
      if (this.marketSentiment < 60) return 'NEUTRAL';
      return 'BULLISH';
    }
  },
  mounted() {
    this.animateOnScroll();
  },
  methods: {
    animateOnScroll() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, observerOptions);

      document.querySelectorAll('.feature-card, .consensus-card').forEach(el => {
        observer.observe(el);
      });
    }
  }
}
</script>

<style scoped>
.ai-hedge-fund-lab {
  min-height: 100vh;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #111111 50%, #0a0a0a 75%, #000000 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.breadcrumb {
  padding: 1rem 2rem;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, transparent 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.breadcrumb-item {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.breadcrumb-separator {
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  margin: 0 1rem;
}

.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
}

.mystic-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 255, 0.8), transparent),
    radial-gradient(2px 2px at 40% 70%, rgba(255, 255, 255, 0.6), transparent),
    radial-gradient(1px 1px at 60% 15%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(1px 1px at 80% 50%, rgba(255, 255, 255, 0.3), transparent);
  background-size: 300px 300px, 200px 200px, 150px 150px, 250px 250px;
  animation: particleFloat 20s linear infinite;
}

.hero-content {
  text-align: center;
  z-index: 2;
  position: relative;
  max-width: 800px;
  padding: 2rem;
}

.hero-icon {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.brain-icon {
  color: #ffffff;
  font-size: 4rem;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 0 40px rgba(255, 255, 255, 0.3),
    0 0 60px rgba(255, 255, 255, 0.1);
  animation: brainPulse 4s ease-in-out infinite;
}

.neural-network {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
  opacity: 0.7;
}

.neural-node {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: nodeFlicker 3s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
}

.neural-node:nth-child(odd) {
  animation-delay: 0.5s;
}

.neural-node:nth-child(even) {
  animation-delay: 1s;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-main {
  color: #ffffff;
  text-shadow: 
    0 0 30px rgba(255, 255, 255, 0.5),
    0 0 60px rgba(255, 255, 255, 0.2);
  background: linear-gradient(45deg, #ffffff, #e0e0e0, #ffffff);
  background-size: 200% 200%;
  animation: titleShimmer 3s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-lab {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 300;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 3rem;
  font-weight: 300;
  letter-spacing: 0.5px;
}

.premium-badge-hero {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 0.8rem 2rem;
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.premium-text {
  background: linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff);
  background-size: 200% 200%;
  animation: shimmer 2s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.badge-glow {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

.floating-investors {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.investor-spirit {
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: mysticalFloat 6s ease-in-out infinite;
  min-width: 120px;
  opacity: 0.8;
}

.investor-spirit:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
.investor-spirit:nth-child(2) { top: 25%; right: 8%; animation-delay: 1s; }
.investor-spirit:nth-child(3) { bottom: 35%; left: 8%; animation-delay: 2s; }
.investor-spirit:nth-child(4) { bottom: 15%; right: 12%; animation-delay: 3s; }
.investor-spirit:nth-child(5) { top: 45%; left: 15%; animation-delay: 4s; }
.investor-spirit:nth-child(6) { top: 60%; right: 15%; animation-delay: 5s; }

.spirit-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.avatar-text {
  font-size: 0.8rem;
  letter-spacing: 1px;
}

.spirit-name {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
}

.features-matrix, .consensus-dashboard, .quick-actions {
  padding: 6rem 2rem;
  background: linear-gradient(180deg, #000000 0%, #0a0a0a 100%);
  position: relative;
}

.features-matrix::before,
.consensus-dashboard::before,
.quick-actions::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.matrix-header, .dashboard-header {
  max-width: 1200px;
  margin: 0 auto 4rem;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.title-underline {
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ffffff, transparent);
  margin: 0 auto;
  border-radius: 2px;
}

.features-grid, .consensus-grid, .actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card, .consensus-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.feature-card::before, .consensus-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transition: left 0.6s ease;
}

.feature-card:hover::before, .consensus-card:hover::before {
  left: 100%;
}

.feature-card:hover, .consensus-card:hover {
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-8px);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 30px rgba(255, 255, 255, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.feature-icon {
  color: #ffffff;
  font-size: 2rem;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.feature-status {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feature-status.active {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-status.beta {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.feature-status.locked {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

.feature-title, .consensus-card h3 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.feature-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.feature-metrics {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.metric {
  text-align: center;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.metric-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 0.25rem;
}

.feature-action {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.feature-action:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.feature-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.real-time-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  animation: pulseGlow 2s ease-in-out infinite;
}

.sentiment-gauge {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
}

.gauge-arc {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  position: relative;
}

.gauge-needle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 60px;
  background: #ffffff;
  transform-origin: bottom center;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.gauge-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.signal-bars {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.signal-bar {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: transparent;
  transition: all 0.3s ease;
}

.signal-bar.active {
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.signal-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
}

.risk-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.risk-factor {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  min-width: 120px;
}

.risk-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.risk-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.risk-item.low .risk-fill {
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
}

.risk-item.medium .risk-fill {
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.7));
}

.risk-item.high .risk-fill {
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.6));
}

.action-button {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  overflow: hidden;
}

.action-button.primary {
  border-color: rgba(255, 255, 255, 0.4);
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
}

.button-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.action-button:hover .button-glow {
  left: 100%;
}

/* Mystical Animations */
@keyframes particleFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(120deg); }
  66% { transform: translateY(-60px) rotate(240deg); }
}

@keyframes brainPulse {
  0%, 100% { 
    transform: scale(1);
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.5),
      0 0 40px rgba(255, 255, 255, 0.3),
      0 0 60px rgba(255, 255, 255, 0.1);
  }
  50% { 
    transform: scale(1.05);
    text-shadow: 
      0 0 30px rgba(255, 255, 255, 0.8),
      0 0 60px rgba(255, 255, 255, 0.5),
      0 0 90px rgba(255, 255, 255, 0.2);
  }
}

@keyframes nodeFlicker {
  0%, 100% { 
    opacity: 0.3;
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
  }
  50% { 
    opacity: 1;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
  }
}

@keyframes titleShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes glowPulse {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.5);
  }
}

@keyframes mysticalFloat {
  0%, 100% { 
    transform: translateY(0px) scale(1);
    opacity: 0.8;
  }
  33% { 
    transform: translateY(-20px) scale(1.02);
    opacity: 0.9;
  }
  66% { 
    transform: translateY(-10px) scale(0.98);
    opacity: 0.7;
  }
}

@keyframes pulseGlow {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.3);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .ai-hedge-fund-lab {
    font-size: 0.9rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .brain-icon {
    font-size: 3rem;
  }
  
  .features-grid, .consensus-grid, .actions-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .investor-spirit {
    min-width: 100px;
    padding: 0.75rem;
  }
  
  .spirit-avatar {
    width: 40px;
    height: 40px;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .feature-metrics {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .brain-icon {
    font-size: 2.5rem;
  }
  
  .features-matrix, .consensus-dashboard, .quick-actions {
    padding: 4rem 1rem;
  }
}
</style> 