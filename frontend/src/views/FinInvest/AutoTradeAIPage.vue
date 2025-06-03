<template>
  <div class="autotrade-container">
    <!-- ▸ Header -------------------------------------------------------------->
    <div class="page-header">
      <h1>AutoTrade AI</h1>
      <p>Automated trading with AI-powered decision making</p>
    </div>

    <div class="autotrade-content">
      <!-- 1 ▸ Strategy selection ---------------------------------------------->
      <div class="strategy-section">
        <div class="section-number">1</div>
        <h2>Start New Strategy</h2>

        <div class="strategy-options">
          <!-- Conservative -->
          <div class="strategy-card conservative" @click="toggleStrategy('conservative')" tabindex="0"
            :class="{ active: activeStrategy === 'conservative' }">
            <h3>Conservative</h3>
            <p>Low risk, steady growth</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">15%</span>
                <span class="metric-label">Max Duration</span>
              </div>
              <div class="metric">
                <span class="metric-label">30 days</span>
              </div>
            </div>
          </div>

          <!-- Moderate -->
          <div class="strategy-card moderate" @click="toggleStrategy('moderate')" tabindex="0"
            :class="{ active: activeStrategy === 'moderate' }">
            <h3>Moderate</h3>
            <p>Balanced risk and reward</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">20%</span>
                <span class="metric-label">Max Duration</span>
              </div>
              <div class="metric">
                <span class="metric-label">10 days</span>
              </div>
            </div>
          </div>

          <!-- Aggressive -->
          <div class="strategy-card aggressive" @click="toggleStrategy('aggressive')" tabindex="0"
            :class="{ active: activeStrategy === 'aggressive' }">
            <h3>Aggressive</h3>
            <p>High risk, high potential return</p>
            <div class="strategy-metrics">
              <div class="metric">
                <span class="metric-value">25%</span>
                <span class="metric-label">Max Duration</span>
              </div>
              <div class="metric">
                <span class="metric-label">5 days</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Strategy Guide Section -->
        <transition name="slide-down">
          <div v-if="activeStrategy" class="strategy-guide">
            <div class="strategy-guide-header">
              <h3>{{ strategies[activeStrategy].title }} Guide</h3>
              <button class="close-guide" @click="closeStrategy" aria-label="Close guide">×</button>
            </div>

            <div class="strategy-guide-content">
              <div class="guide-section pros-section">
                <h4>✓ Pros</h4>
                <ul>
                  <li v-for="(pro, index) in strategies[activeStrategy].pros" :key="'pro-' + index">
                    {{ pro }}
                  </li>
                </ul>
              </div>

              <div class="guide-section cons-section">
                <h4>⚠ Cons</h4>
                <ul>
                  <li v-for="(con, index) in strategies[activeStrategy].cons" :key="'con-' + index">
                    {{ con }}
                  </li>
                </ul>
              </div>

              <div class="guide-section action-section">
                <h4>💡 Recommended Action</h4>
                <p>{{ strategies[activeStrategy].action }}</p>
              </div>
            </div>
          </div>
        </transition>

        <!-- Capital entry -->
        <div class="capital-allocation">
          <h3>Capital Allocation ($):</h3>
          <input v-model.number="capital" type="number" min="0" placeholder="Enter amount" class="amount-input" />
        </div>

        <button class="start-strategy-btn" @click="startStrategy">
          START STRATEGY
        </button>
      </div>

      <!-- 2 ▸ Investments ------------------------------------------------------>
      <div class="investments-section">
        <div class="section-number">2</div>
        <h2>Auto Investments</h2>

        <div class="investment-cards">
          <!-- Static placeholder cards (replace with real data) -->
          <div class="investment-card" v-for="card in exampleCards" :key="card.ticker">
            <div class="stock-header">
              <div class="stock-name">{{ card.ticker }}</div>
              <div class="status" :class="card.status.toLowerCase()">
                {{ card.status }}
              </div>
            </div>
            <div class="stock-details">
              <div class="strategy-tag" :class="card.strategy">
                {{ card.strategy }}
              </div>
              <div class="transaction">Bought: {{ card.bought }}</div>
              <div class="transaction">Sold: {{ card.sold }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 ▸ Performance ------------------------------------------------------>
      <div class="performance-section">
        <div class="section-number">3</div>
        <h2>Performance Overview</h2>

        <div class="performance-metrics">
          <div class="metric-card">
            <h3>Total Return</h3>
            <div class="metric-value positive">+20%</div>
          </div>
          <div class="metric-card">
            <h3>Active Strategies</h3>
            <div class="metric-value">2</div>
          </div>
          <div class="metric-card">
            <h3>Completed Trades</h3>
            <div class="metric-value">6</div>
          </div>
        </div>

        <div class="chart-container">
          <h3>Performance History</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AutoTradeAI",
  data() {
    return {
      /* ▸ Strategy state */
      activeStrategy: null,

      /* ▸ Form state */
      capital: null,

      /* ▸ Strategy lookup table */
      strategies: {
        conservative: {
          title: "Conservative Strategy",
          pros: [
            "Lower volatility versus the market benchmark",
            "Preserves capital during drawdowns",
            "Requires minimal monitoring once deployed"
          ],
          cons: [
            "Returns may lag in strong bull rallies",
            "Inflation-adjusted growth is moderate"
          ],
          action:
            "Ideal for capital needed in 3–6 months or as a liquidity buffer. Keep position size under 20% of your portfolio and review quarterly."
        },
        moderate: {
          title: "Moderate Strategy",
          pros: [
            "Balanced exposure across sectors and factors",
            "Automatic rebalancing targets risk parity",
            "Captures upside in trending markets"
          ],
          cons: [
            "Drawdowns larger than conservative mode",
            "Slightly higher turnover increases fees"
          ],
          action:
            "Suitable as a core growth sleeve. Allocate 20-50% of deployable capital, set a 10% trailing stop, and reassess monthly."
        },
        aggressive: {
          title: "Aggressive Strategy",
          pros: [
            "Targets high-momentum equities and leveraged ETFs",
            "Short holding periods reduce overnight risk",
            "Opportunity for outsized alpha in volatile tapes"
          ],
          cons: [
            "Greater probability of sharp drawdowns",
            "Requires active monitoring and strict risk controls",
            "Higher slippage and trading-cost drag"
          ],
          action:
            "Deploy only discretionary capital you can tolerate losing. Limit to <15% of account value, use tight stop-loss (3–5%), and evaluate after each trade cycle."
        }
      },

      /* ▸ Mock investment cards */
      exampleCards: [
        { ticker: "NVDA", status: "CLOSED", strategy: "aggressive", bought: 8.4367, sold: 0 },
        { ticker: "MSFT", status: "CLOSED", strategy: "conservative", bought: 2.5589, sold: 0 },
        { ticker: "AAPL", status: "ACTIVE", strategy: "moderate", bought: 5.231, sold: 0 },
        { ticker: "TSLA", status: "ACTIVE", strategy: "aggressive", bought: 3.7892, sold: 0 }
      ]
    };
  },
  methods: {
    /* Toggles the strategy guide display */
    toggleStrategy(strategyKey) {
      if (this.activeStrategy === strategyKey) {
        this.activeStrategy = null;
      } else {
        this.activeStrategy = strategyKey;
      }
    },

    /* Closes the strategy guide */
    closeStrategy() {
      this.activeStrategy = null;
    },

    /* Placeholder start logic */
    startStrategy() {
      if (!this.capital || this.capital <= 0) {
        alert("Enter a valid capital amount before starting.");
        return;
      }
      console.log(`Starting strategy with $${this.capital}`);
      /* TODO: call backend endpoint here */
    }
  }
};
</script>

<style scoped>
.autotrade-container {
  max-width: 1300px;
  margin: 100px auto 0;
  padding: 2rem;
  color: var(--text-primary);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.2rem;
  opacity: 0.8;
}

.autotrade-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

.strategy-section,
.investments-section,
.performance-section {
  background-color: var(--card-bg);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
}

.section-number {
  position: absolute;
  top: -20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(54, 162, 235, 0.15);
  color: rgba(0, 0, 255, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.strategy-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.strategy-card {
  border-radius: 15px;
  padding: 1.5rem;
  color: #333;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;
}

.strategy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.strategy-card.active {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.strategy-card.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 15px;
  border: 3px solid;
  pointer-events: none;
}

.strategy-card.conservative.active::after {
  border-color: #4bc0c0;
}

.strategy-card.moderate.active::after {
  border-color: #36a2eb;
}

.strategy-card.aggressive.active::after {
  border-color: #ff6384;
}

.strategy-card h3 {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.strategy-card p {
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.strategy-metrics {
  display: flex;
  justify-content: space-between;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  display: block;
}

.metric-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.conservative {
  background-color: white;
  border: 2px solid #4bc0c0;
}

.moderate {
  background-color: white;
  border: 2px solid #36a2eb;
}

.aggressive {
  background-color: white;
  border: 2px solid #ff6384;
}

/* ▸ Strategy Guide Styles */
.strategy-guide {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  border-left: 5px solid #36a2eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.strategy-guide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #dee2e6;
}

.strategy-guide-header h3 {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.close-guide {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
}

.close-guide:hover {
  background-color: #e9ecef;
  color: #495057;
}

.strategy-guide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.guide-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.action-section {
  grid-column: 1 / -1;
}

.guide-section h4 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pros-section h4 {
  color: #28a745;
}

.cons-section h4 {
  color: #dc3545;
}

.action-section h4 {
  color: #007bff;
}

.guide-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-section li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f3f4;
  font-size: 0.95rem;
  line-height: 1.4;
}

.guide-section li:last-child {
  border-bottom: none;
}

.pros-section li::before {
  content: '✓';
  color: #28a745;
  font-weight: bold;
  margin-right: 0.5rem;
}

.cons-section li::before {
  content: '⚠';
  color: #dc3545;
  margin-right: 0.5rem;
}

.action-section p {
  font-size: 1rem;
  line-height: 1.6;
  color: #495057;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #007bff;
  margin: 0;
}

/* ▸ Slide down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.capital-allocation {
  margin-bottom: 2rem;
}

.capital-allocation h3 {
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
}

.amount-input {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.start-strategy-btn {
  width: 100%;
  padding: 1rem;
  background-color: var(--text-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.investment-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.investment-card {
  border-radius: 12px;
  border: 1px solid #ddd;
  overflow: hidden;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f8f9fa;
  align-items: center;
}

.stock-name {
  font-size: 1.2rem;
  font-weight: bold;
}

.status {
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.3rem 0.8rem;
  border-radius: 5px;
}

.closed {
  background-color: #e0e0e0;
  color: #666;
}

.active {
  background-color: #4caf50;
  color: white;
}

.stock-details {
  padding: 1rem;
}

.strategy-tag {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 0.8rem;
  color: white;
}

.strategy-tag.conservative {
  background-color: #4bc0c0;
}

.strategy-tag.moderate {
  background-color: #36a2eb;
}

.strategy-tag.aggressive {
  background-color: #ff6384;
}

.transaction {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.metric-card h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  opacity: 0.8;
}

.metric-card .metric-value {
  font-size: 2rem;
  font-weight: bold;
}

.positive {
  color: #4caf50;
}

.negative {
  color: #ff6384;
}

.chart-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  min-height: 200px;
}

.chart-container h3 {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .strategy-options {
    grid-template-columns: 1fr;
  }

  .performance-metrics {
    grid-template-columns: 1fr;
  }

  .strategy-guide-content {
    grid-template-columns: 1fr;
  }

  .amount-input {
    max-width: 100%;
  }
}
</style>