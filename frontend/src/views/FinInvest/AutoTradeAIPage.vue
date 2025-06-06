<template>
  <div class="autotrade-container">
    <div class="page-header">
      <h1>AutoTrade AI</h1>
      <p>Automated trading with AI-powered decision making</p>
    </div>

    <div class="autotrade-content">
      <div class="strategy-section">
        <div class="section-number">1</div>
        <h2>Start New Strategy</h2>

        <div class="strategy-options">
          <div class="strategy-card conservative">
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

          <div class="strategy-card moderate">
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

          <div class="strategy-card aggressive">
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

        <div class="capital-allocation">
          <h3>Capital Allocation ($):</h3>
          <input
            type="number"
            placeholder="Enter amount"
            class="amount-input"
          />
        </div>

        <button class="start-strategy-btn">START STRATEGY</button>
      </div>

      <div class="investments-section">
        <div class="section-number">2</div>
        <h2>Auto Investments</h2>

        <div class="investment-cards">
          <div class="investment-card">
            <div class="stock-header">
              <div class="stock-name">NVDA</div>
              <div class="status closed">CLOSED</div>
            </div>
            <div class="stock-details">
              <div class="strategy-tag aggressive">aggressive</div>
              <div class="transaction">Bought: 8.4367</div>
              <div class="transaction">Sold: 0</div>
            </div>
          </div>

          <div class="investment-card">
            <div class="stock-header">
              <div class="stock-name">MSFT</div>
              <div class="status closed">CLOSED</div>
            </div>
            <div class="stock-details">
              <div class="strategy-tag conservative">conservative</div>
              <div class="transaction">Bought: 2.5589</div>
              <div class="transaction">Sold: 0</div>
            </div>
          </div>

          <div class="investment-card">
            <div class="stock-header">
              <div class="stock-name">AAPL</div>
              <div class="status active">ACTIVE</div>
            </div>
            <div class="stock-details">
              <div class="strategy-tag moderate">moderate</div>
              <div class="transaction">Bought: 5.2310</div>
              <div class="transaction">Sold: 0</div>
            </div>
          </div>

          <div class="investment-card">
            <div class="stock-header">
              <div class="stock-name">TSLA</div>
              <div class="status active">ACTIVE</div>
            </div>
            <div class="stock-details">
              <div class="strategy-tag aggressive">aggressive</div>
              <div class="transaction">Bought: 3.7892</div>
              <div class="transaction">Sold: 0</div>
            </div>
          </div>
        </div>
      </div>

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
      // Data would go here in a real implementation
    };
  },
  methods: {
    // Methods would go here
  },
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
  top: -20px;
  left: 20px;
  width: 40px;
  height: 40px;
  background-color: rgba(54, 162, 235, 0.15);
  color: rgba(0, 0, 0, 0.5);
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
}

.strategy-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
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

.capital-allocation {
  margin-bottom: 2rem;
}

.capital-allocation h3 {
  margin-bottom: 0.8rem;
  font-size: 1.2rem;
}

.amount-input {
  width: 1200px;
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
  width: 1200px;
  background-color: #f8f9fa;
  border-radius: 12px;
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
}
</style>
