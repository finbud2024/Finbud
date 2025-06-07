<template>
  <div class="ai-finance-workflows">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">
            <font-awesome-icon icon="fa-solid fa-chart-line" class="network-icon" />
            AI Finance Workflows
          </h1>
          <p class="subtitle">Hệ thống AI tài chính tiên tiến - Tự động hóa quy trình phân tích và giao dịch</p>
        </div>
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-value">{{ activeStrategies }}</div>
            <div class="stat-label">Active Strategies</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalROI }}%</div>
            <div class="stat-label">Total ROI</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${{ assetsUnderManagement }}M</div>
            <div class="stat-label">Assets Under Management</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow Categories -->
    <div class="workflow-categories">
      <div class="category-tabs">
        <button v-for="category in categories" :key="category.id"
                @click="activeCategory = category.id"
                :class="['category-tab', { active: activeCategory === category.id }]">
          <font-awesome-icon :icon="category.icon" />
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Main Workflow Dashboard -->
    <div class="workflow-dashboard">
      
      <!-- Portfolio Management Workflows -->
      <div v-if="activeCategory === 'portfolio'" class="workflow-section">
        <div class="section-header">
          <h2>Portfolio Management Workflows</h2>
          <div class="workflow-controls">
            <button @click="runOptimization" class="run-btn">
              <font-awesome-icon icon="fa-solid fa-play" />
              Run Optimization
            </button>
          </div>
        </div>
        
        <div class="workflow-grid">
          <div class="workflow-card">
            <div class="card-header">
              <h3>Asset Allocation Engine</h3>
              <div class="status-indicator" :class="portfolioWorkflows.allocation.status">
                {{ portfolioWorkflows.allocation.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="workflow-metrics">
                <div class="metric">
                  <span class="metric-label">Current Allocation</span>
                  <div class="allocation-chart">
                    <div v-for="asset in portfolioWorkflows.allocation.currentAllocation" 
                         :key="asset.name" class="allocation-bar">
                      <span class="asset-name">{{ asset.name }}</span>
                      <div class="bar-container">
                        <div class="bar-fill" :style="{ width: asset.percentage + '%' }"></div>
                      </div>
                      <span class="percentage">{{ asset.percentage }}%</span>
                    </div>
                  </div>
                </div>
                <div class="metric">
                  <span class="metric-label">Expected Return</span>
                  <span class="metric-value">{{ portfolioWorkflows.allocation.expectedReturn }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Sharpe Ratio</span>
                  <span class="metric-value">{{ portfolioWorkflows.allocation.sharpeRatio }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="workflow-card">
            <div class="card-header">
              <h3>Risk Management System</h3>
              <div class="status-indicator" :class="portfolioWorkflows.risk.status">
                {{ portfolioWorkflows.risk.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="risk-dashboard">
                <div class="risk-gauge">
                  <div class="gauge-container">
                    <div class="gauge-fill" :style="{ transform: `rotate(${riskGaugeAngle}deg)` }"></div>
                    <div class="gauge-center">
                      <span class="risk-score">{{ riskScore }}</span>
                      <span class="risk-label">Risk Score</span>
                    </div>
                  </div>
                </div>
                <div class="risk-metrics">
                  <div class="risk-item">
                    <span>VaR (95%)</span>
                    <span class="risk-value negative">-{{ portfolioWorkflows.risk.var95 }}%</span>
                  </div>
                  <div class="risk-item">
                    <span>Max Drawdown</span>
                    <span class="risk-value negative">-{{ portfolioWorkflows.risk.maxDrawdown }}%</span>
                  </div>
                  <div class="risk-item">
                    <span>Beta</span>
                    <span class="risk-value">{{ portfolioWorkflows.risk.beta }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Trading Algorithms -->
      <div v-if="activeCategory === 'trading'" class="workflow-section">
        <div class="section-header">
          <h2>Algorithmic Trading Systems</h2>
          <div class="workflow-controls">
            <button @click="deployStrategy" class="run-btn">
              <font-awesome-icon icon="fa-solid fa-rocket" />
              Deploy Strategy
            </button>
          </div>
        </div>
        
        <div class="workflow-grid">
          <div class="workflow-card">
            <div class="card-header">
              <h3>Momentum Trading Bot</h3>
              <div class="status-indicator" :class="tradingBots.momentum.status">
                {{ tradingBots.momentum.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="bot-metrics">
                <div class="metric-row">
                  <div class="metric">
                    <span class="metric-label">P&L Today</span>
                    <span class="metric-value" :class="tradingBots.momentum.dailyPnL >= 0 ? 'positive' : 'negative'">
                      ${{ tradingBots.momentum.dailyPnL }}
                    </span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Win Rate</span>
                    <span class="metric-value">{{ tradingBots.momentum.winRate }}%</span>
                  </div>
                </div>
                <div class="recent-trades">
                  <h4>Recent Trades</h4>
                  <div class="trade-list">
                    <div v-for="trade in tradingBots.momentum.recentTrades" 
                         :key="trade.id" class="trade-item">
                      <span class="trade-symbol">{{ trade.symbol }}</span>
                      <span class="trade-action" :class="trade.action">{{ trade.action }}</span>
                      <span class="trade-pnl" :class="trade.pnl >= 0 ? 'positive' : 'negative'">
                        ${{ trade.pnl }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="workflow-card">
            <div class="card-header">
              <h3>Arbitrage Scanner</h3>
              <div class="status-indicator" :class="tradingBots.arbitrage.status">
                {{ tradingBots.arbitrage.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="arbitrage-opportunities">
                <h4>Current Opportunities</h4>
                <div class="opportunity-list">
                  <div v-for="opp in tradingBots.arbitrage.opportunities" 
                       :key="opp.id" class="opportunity-item">
                    <div class="opp-header">
                      <span class="opp-pair">{{ opp.pair }}</span>
                      <span class="opp-spread positive">{{ opp.spread }}%</span>
                    </div>
                    <div class="opp-details">
                      <span>{{ opp.buyExchange }} → {{ opp.sellExchange }}</span>
                      <span class="opp-profit">Est. Profit: ${{ opp.estimatedProfit }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Market Analysis -->
      <div v-if="activeCategory === 'analysis'" class="workflow-section">
        <div class="section-header">
          <h2>Market Analysis Workflows</h2>
          <div class="workflow-controls">
            <button @click="generateReport" class="run-btn">
              <font-awesome-icon icon="fa-solid fa-file-alt" />
              Generate Report
            </button>
          </div>
        </div>
        
        <div class="workflow-grid">
          <div class="workflow-card large">
            <div class="card-header">
              <h3>Technical Analysis Engine</h3>
              <div class="status-indicator active">running</div>
            </div>
            <div class="card-content">
              <div class="analysis-dashboard">
                <div class="analysis-chart">
                  <canvas ref="technicalChart" width="600" height="300"></canvas>
                </div>
                <div class="analysis-signals">
                  <h4>Current Signals</h4>
                  <div class="signal-list">
                    <div v-for="signal in technicalSignals" :key="signal.id" 
                         :class="['signal-item', signal.strength]">
                      <span class="signal-symbol">{{ signal.symbol }}</span>
                      <span class="signal-type">{{ signal.type }}</span>
                      <span class="signal-strength">{{ signal.strength }}</span>
                      <span class="signal-price">${{ signal.targetPrice }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="workflow-card">
            <div class="card-header">
              <h3>Sentiment Analysis</h3>
              <div class="status-indicator active">analyzing</div>
            </div>
            <div class="card-content">
              <div class="sentiment-overview">
                <div class="sentiment-gauge">
                  <div class="sentiment-score" :class="getSentimentClass(overallSentiment)">
                    {{ overallSentiment }}
                  </div>
                  <div class="sentiment-label">Market Sentiment</div>
                </div>
                <div class="sentiment-breakdown">
                  <div class="sentiment-source">
                    <span>News Sentiment</span>
                    <span class="sentiment-value" :class="getSentimentClass(sentimentData.news)">
                      {{ sentimentData.news }}
                    </span>
                  </div>
                  <div class="sentiment-source">
                    <span>Social Media</span>
                    <span class="sentiment-value" :class="getSentimentClass(sentimentData.social)">
                      {{ sentimentData.social }}
                    </span>
                  </div>
                  <div class="sentiment-source">
                    <span>Options Flow</span>
                    <span class="sentiment-value" :class="getSentimentClass(sentimentData.options)">
                      {{ sentimentData.options }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Workflow Execution Log -->
    <div class="execution-log">
      <div class="log-header">
        <h3>Execution Log</h3>
        <button @click="clearLog" class="clear-btn">Clear</button>
      </div>
      <div class="log-content">
        <div v-for="entry in executionLog" :key="entry.id" 
             :class="['log-entry', entry.type]">
          <span class="log-time">{{ formatTime(entry.timestamp) }}</span>
          <span class="log-message">{{ entry.message }}</span>
          <span class="log-status" :class="entry.status">{{ entry.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faPlay, faRocket, faFileAlt, faTimes,
  faChartPie, faRobot, faChartLine, faShieldAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faPlay, faRocket, faFileAlt, faTimes, faChartPie, faRobot, faChartLine, faShieldAlt);

export default {
  name: 'AIFinanceWorkflowsPage',
  components: { FontAwesomeIcon },
  data() {
    return {
      activeStrategies: 12,
      totalROI: 24.7,
      assetsUnderManagement: 145.2,
      activeCategory: 'portfolio',
      riskScore: 23,
      riskGaugeAngle: 45,
      overallSentiment: 0.15,

      categories: [
        { id: 'portfolio', name: 'Portfolio Management', icon: 'fa-solid fa-chart-pie' },
        { id: 'trading', name: 'Algorithmic Trading', icon: 'fa-solid fa-robot' },
        { id: 'analysis', name: 'Market Analysis', icon: 'fa-solid fa-chart-line' },
        { id: 'risk', name: 'Risk Management', icon: 'fa-solid fa-shield-alt' }
      ],

      portfolioWorkflows: {
        allocation: {
          status: 'active',
          expectedReturn: 12.4,
          sharpeRatio: 1.67,
          currentAllocation: [
            { name: 'Stocks', percentage: 60 },
            { name: 'Bonds', percentage: 25 },
            { name: 'Commodities', percentage: 10 },
            { name: 'Cash', percentage: 5 }
          ]
        },
        risk: {
          status: 'monitoring',
          var95: 2.1,
          maxDrawdown: 8.5,
          beta: 1.2
        }
      },

      tradingBots: {
        momentum: {
          status: 'active',
          dailyPnL: 2847.50,
          winRate: 73.2,
          recentTrades: [
            { id: 1, symbol: 'AAPL', action: 'buy', pnl: 324.50 },
            { id: 2, symbol: 'MSFT', action: 'sell', pnl: -156.20 },
            { id: 3, symbol: 'GOOGL', action: 'buy', pnl: 589.30 }
          ]
        },
        arbitrage: {
          status: 'scanning',
          opportunities: [
            {
              id: 1,
              pair: 'BTC/USD',
              spread: 0.15,
              buyExchange: 'Coinbase',
              sellExchange: 'Binance',
              estimatedProfit: 247.80
            },
            {
              id: 2,
              pair: 'ETH/USD',
              spread: 0.08,
              buyExchange: 'Kraken',
              sellExchange: 'Bitfinex',
              estimatedProfit: 134.20
            }
          ]
        }
      },

      technicalSignals: [
        { id: 1, symbol: 'AAPL', type: 'Golden Cross', strength: 'strong', targetPrice: 198.50 },
        { id: 2, symbol: 'TSLA', type: 'RSI Oversold', strength: 'medium', targetPrice: 185.20 },
        { id: 3, symbol: 'NVDA', type: 'Breakout', strength: 'strong', targetPrice: 890.75 }
      ],

      sentimentData: {
        news: 0.23,
        social: -0.12,
        options: 0.45
      },

      executionLog: [
        {
          id: 1,
          timestamp: Date.now() - 300000,
          message: 'Portfolio optimization completed',
          type: 'success',
          status: 'completed'
        },
        {
          id: 2,
          timestamp: Date.now() - 600000,
          message: 'Risk threshold exceeded for TSLA position',
          type: 'warning',
          status: 'alert'
        },
        {
          id: 3,
          timestamp: Date.now() - 900000,
          message: 'Momentum strategy generated buy signal for AAPL',
          type: 'info',
          status: 'executed'
        }
      ]
    };
  },

  mounted() {
    this.initializeCharts();
    this.startRealTimeUpdates();
  },

  methods: {
    runOptimization() {
      this.addLogEntry('Portfolio optimization started', 'info', 'running');
      // Simulate optimization process
      setTimeout(() => {
        this.addLogEntry('Portfolio optimization completed successfully', 'success', 'completed');
      }, 2000);
    },

    deployStrategy() {
      this.addLogEntry('Deploying new trading strategy', 'info', 'deploying');
      setTimeout(() => {
        this.addLogEntry('Trading strategy deployed and active', 'success', 'active');
      }, 3000);
    },

    generateReport() {
      this.addLogEntry('Generating market analysis report', 'info', 'processing');
      setTimeout(() => {
        this.addLogEntry('Market analysis report generated', 'success', 'completed');
      }, 1500);
    },

    clearLog() {
      this.executionLog = [];
    },

    addLogEntry(message, type, status) {
      this.executionLog.unshift({
        id: Date.now(),
        timestamp: Date.now(),
        message,
        type,
        status
      });
      
      // Keep only last 20 entries
      if (this.executionLog.length > 20) {
        this.executionLog = this.executionLog.slice(0, 20);
      }
    },

    getSentimentClass(sentiment) {
      if (sentiment > 0.2) return 'positive';
      if (sentiment < -0.2) return 'negative';
      return 'neutral';
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },

    initializeCharts() {
      this.$nextTick(() => {
        if (this.$refs.technicalChart) {
          this.drawTechnicalChart();
        }
      });
    },

    drawTechnicalChart() {
      const canvas = this.$refs.technicalChart;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw price chart
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Sample data points
      const points = [
        {x: 50, y: 200}, {x: 100, y: 180}, {x: 150, y: 160},
        {x: 200, y: 140}, {x: 250, y: 120}, {x: 300, y: 100},
        {x: 350, y: 90}, {x: 400, y: 80}, {x: 450, y: 75},
        {x: 500, y: 70}, {x: 550, y: 60}
      ];
      
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
      
      // Draw moving averages
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(50, 210);
      ctx.lineTo(550, 80);
      ctx.stroke();
      ctx.setLineDash([]);
    },

    startRealTimeUpdates() {
      setInterval(() => {
        // Update risk score
        this.riskScore = 20 + Math.random() * 10;
        this.riskGaugeAngle = (this.riskScore / 100) * 180;
        
        // Update sentiment
        this.overallSentiment = -0.5 + Math.random();
        
        // Simulate trading bot activity
        if (Math.random() > 0.8) {
          this.tradingBots.momentum.dailyPnL += (Math.random() - 0.5) * 100;
        }
      }, 3000);
    }
  }
};
</script>

<style scoped>
.ai-finance-workflows {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%);
  color: #ffffff;
  font-family: 'Inter', 'Roboto', sans-serif;
  padding: 2rem;
}

.header-section {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.network-icon {
  color: #ffffff;
}

.subtitle {
  font-size: 1.1rem;
  color: #999999;
  margin: 0;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.workflow-categories {
  max-width: 1400px;
  margin: 0 auto 2rem auto;
}

.category-tabs {
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.5rem;
}

.category-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: #999999;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.category-tab:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.category-tab.active {
  background: #ffffff;
  color: #000000;
  font-weight: 600;
}

.workflow-dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h2 {
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0;
}

.run-btn {
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.run-btn:hover {
  background: #cccccc;
  transform: translateY(-2px);
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.workflow-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.workflow-card.large {
  grid-column: span 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.1rem;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-indicator.active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.status-indicator.monitoring {
  background: rgba(255, 255, 255, 0.1);
  color: #999999;
}

.status-indicator.scanning {
  background: rgba(255, 255, 255, 0.15);
  color: #cccccc;
}

.allocation-chart {
  margin-top: 1rem;
}

.allocation-bar {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.asset-name {
  font-size: 0.9rem;
  color: #cccccc;
}

.bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, #999999);
  transition: width 0.5s ease;
}

.percentage {
  font-size: 0.9rem;
  color: #ffffff;
  font-weight: 600;
}

.metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.metric-label {
  color: #999999;
  font-size: 0.9rem;
}

.metric-value {
  color: #ffffff;
  font-weight: 600;
}

.risk-dashboard {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 2rem;
  align-items: center;
}

.gauge-container {
  position: relative;
  width: 120px;
  height: 120px;
}

.gauge-fill {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

.gauge-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.risk-score {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  display: block;
}

.risk-label {
  font-size: 0.8rem;
  color: #999999;
}

.risk-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.risk-value {
  font-weight: 600;
  color: #ffffff;
}

.risk-value.negative {
  color: #ff9999;
}

.bot-metrics {
  margin-bottom: 1.5rem;
}

.metric-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.recent-trades h4 {
  margin-bottom: 1rem;
  color: #ffffff;
  font-size: 1rem;
}

.trade-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.trade-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.trade-symbol {
  font-weight: 600;
  color: #ffffff;
}

.trade-action {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.trade-action.buy {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.trade-action.sell {
  background: rgba(255, 255, 255, 0.1);
  color: #cccccc;
}

.trade-pnl {
  font-weight: 600;
}

.positive {
  color: #ffffff;
}

.negative {
  color: #ff9999;
}

.neutral {
  color: #cccccc;
}

.arbitrage-opportunities h4,
.opportunity-list {
  margin-bottom: 1rem;
}

.opportunity-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.opp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.opp-pair {
  font-weight: 600;
  color: #ffffff;
}

.opp-spread {
  font-weight: 600;
}

.opp-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #999999;
}

.opp-profit {
  color: #ffffff;
  font-weight: 600;
}

.analysis-dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.analysis-chart {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.signal-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.signal-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border-left: 3px solid #ffffff;
}

.signal-item.strong {
  border-left-color: #ffffff;
}

.signal-item.medium {
  border-left-color: #cccccc;
}

.signal-symbol {
  font-weight: 600;
  color: #ffffff;
}

.signal-type {
  font-size: 0.9rem;
  color: #cccccc;
}

.signal-strength {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.signal-price {
  font-weight: 600;
  color: #ffffff;
}

.sentiment-overview {
  text-align: center;
}

.sentiment-gauge {
  margin-bottom: 1.5rem;
}

.sentiment-score {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.sentiment-score.positive {
  color: #ffffff;
}

.sentiment-score.negative {
  color: #ff9999;
}

.sentiment-score.neutral {
  color: #cccccc;
}

.sentiment-label {
  font-size: 0.9rem;
  color: #999999;
}

.sentiment-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sentiment-source {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sentiment-value {
  font-weight: 600;
}

.execution-log {
  max-width: 1400px;
  margin: 2rem auto 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.log-header h3 {
  margin: 0;
  color: #ffffff;
}

.clear-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #999999;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.log-content {
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  border-left: 3px solid;
}

.log-entry.success {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: #ffffff;
}

.log-entry.warning {
  background: rgba(255, 255, 255, 0.03);
  border-left-color: #ff9999;
}

.log-entry.info {
  background: rgba(255, 255, 255, 0.02);
  border-left-color: #cccccc;
}

.log-time {
  font-size: 0.8rem;
  color: #999999;
  font-family: monospace;
}

.log-message {
  color: #ffffff;
}

.log-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.log-status.completed {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.log-status.alert {
  background: rgba(255, 153, 153, 0.2);
  color: #ff9999;
}

.log-status.executed {
  background: rgba(255, 255, 255, 0.15);
  color: #cccccc;
}

@media (max-width: 1200px) {
  .workflow-grid {
    grid-template-columns: 1fr;
  }
  
  .workflow-card.large {
    grid-column: span 1;
  }
  
  .analysis-dashboard {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ai-finance-workflows {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .category-tabs {
    flex-direction: column;
  }
  
  .risk-dashboard {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style> 