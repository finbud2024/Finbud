<template>
  <div class="ai-hedge-fund-lab">
    <!-- Enhanced Universe Background Effect with Atomic Particles -->
    <div class="universe-background">
      <div class="bubble" v-for="n in 20" :key="n" :style="getBubbleStyle(n)"></div>
    </div>

    <!-- Enhanced Header with Market Status -->
    <div class="lab-header">
      <div class="header-content">
        <div class="lab-title">
          <font-awesome-icon icon="fa-solid fa-brain" class="brain-icon" />
          <div>
            <h1>AI Hedge Fund Laboratory</h1>
            <p>Advanced Quantitative Trading & Risk Management System</p>
          </div>
        </div>
        <div class="market-status">
          <div class="status-item">
            <div class="status-value">{{ marketStatus.isOpen ? 'OPEN' : 'CLOSED' }}</div>
            <div class="status-label">Market Status</div>
          </div>
          <div class="status-item">
            <div class="status-value">${{ totalAUM }}M</div>
            <div class="status-label">Assets Under Management</div>
          </div>
          <div class="status-item">
            <div class="status-value">{{ dailyPnL >= 0 ? '+' : '' }}{{ dailyPnL }}%</div>
            <div class="status-label">Daily P&L</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div class="dashboard-container">
      
      <!-- Left Panel: Trading & Analytics -->
      <div class="left-panel">
        
        <!-- Real-Time Trading Simulator -->
        <div class="feature-card trading-simulator">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-robot" />
              Live Trading Simulation
            </h3>
            <div class="trading-status" :class="tradingEngine.status">
              {{ tradingEngine.status }}
            </div>
          </div>
          <div class="card-content">
            <div class="trading-controls">
              <button @click="toggleTrading" :class="['trading-btn', tradingEngine.status]">
                <font-awesome-icon :icon="tradingEngine.isRunning ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
                {{ tradingEngine.isRunning ? 'Stop Trading' : 'Start Trading' }}
              </button>
              <select v-model="tradingEngine.strategy" class="strategy-select">
                <option value="momentum">Momentum Strategy</option>
                <option value="mean-reversion">Mean Reversion</option>
                <option value="arbitrage">Statistical Arbitrage</option>
                <option value="market-neutral">Market Neutral</option>
              </select>
            </div>
            
            <div class="trading-metrics">
              <div class="metric-grid">
                <div class="metric">
                  <span class="metric-label">Active Positions</span>
                  <span class="metric-value">{{ tradingEngine.activePositions }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Win Rate</span>
                  <span class="metric-value">{{ tradingEngine.winRate }}%</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Daily P&L</span>
                  <span class="metric-value" :class="tradingEngine.dailyPnL >= 0 ? 'positive' : 'negative'">
                    ${{ tradingEngine.dailyPnL }}
                  </span>
                </div>
                <div class="metric">
                  <span class="metric-label">Sharpe Ratio</span>
                  <span class="metric-value">{{ tradingEngine.sharpeRatio }}</span>
                </div>
              </div>
            </div>

            <!-- Live Positions -->
            <div class="positions-section">
              <h4>Active Positions</h4>
              <div class="positions-list">
                <div v-for="position in tradingEngine.positions" :key="position.symbol" 
                     class="position-item">
                  <div class="position-info">
                    <span class="symbol">{{ position.symbol }}</span>
                    <span class="quantity">{{ position.quantity }} shares</span>
                  </div>
                  <div class="position-metrics">
                    <span class="entry-price">${{ position.entryPrice }}</span>
                    <span class="current-price">${{ position.currentPrice }}</span>
                    <span class="pnl" :class="position.pnl >= 0 ? 'positive' : 'negative'">
                      {{ position.pnl >= 0 ? '+' : '' }}${{ position.pnl }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Portfolio Optimization Engine -->
        <div class="feature-card portfolio-optimizer">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-chart-pie" />
              Portfolio Optimization
            </h3>
            <button @click="runOptimization" class="optimize-btn">
              <font-awesome-icon icon="fa-solid fa-cog" />
              Optimize
            </button>
          </div>
          <div class="card-content">
            <div class="optimization-inputs">
              <div class="input-group">
                <label>Target Return (%)</label>
                <input v-model.number="optimizer.targetReturn" type="range" min="5" max="25" step="0.5">
                <span class="range-value">{{ optimizer.targetReturn }}%</span>
              </div>
              <div class="input-group">
                <label>Risk Tolerance</label>
                <select v-model="optimizer.riskTolerance">
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </div>

            <div class="allocation-chart">
              <h4>Current Allocation</h4>
              <div class="allocation-bars">
                <div v-for="asset in optimizer.allocation" :key="asset.name" class="allocation-bar">
                  <span class="asset-name">{{ asset.name }}</span>
                  <div class="bar-container">
                    <div class="bar-fill" :style="{ width: asset.percentage + '%' }"></div>
                  </div>
                  <span class="percentage">{{ asset.percentage }}%</span>
                </div>
              </div>
            </div>

            <div class="efficiency-frontier">
              <h4>Efficient Frontier</h4>
              <canvas ref="frontierChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Panel: Analytics & Risk -->
      <div class="right-panel">
        
        <!-- Advanced Market Analytics -->
        <div class="feature-card market-analytics">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-chart-line" />
              Market Analytics
            </h3>
            <div class="analytics-controls">
              <button v-for="timeframe in ['1D', '1W', '1M', '3M']" :key="timeframe"
                      @click="activeTimeframe = timeframe"
                      :class="['timeframe-btn', { active: activeTimeframe === timeframe }]">
                {{ timeframe }}
              </button>
            </div>
          </div>
          <div class="card-content">
            <!-- Price Chart -->
            <div class="chart-container">
              <canvas ref="priceChart" width="500" height="250"></canvas>
            </div>
            
            <!-- Technical Indicators -->
            <div class="indicators-section">
              <h4>Technical Indicators</h4>
              <div class="indicators-grid">
                <div v-for="indicator in technicalIndicators" :key="indicator.name" 
                     class="indicator-item">
                  <span class="indicator-name">{{ indicator.name }}</span>
                  <span class="indicator-value" :class="indicator.signal">{{ indicator.value }}</span>
                  <span class="indicator-signal" :class="indicator.signal">{{ indicator.signal }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk Management Dashboard -->
        <div class="feature-card risk-dashboard">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-shield-halved" />
              Risk Management
            </h3>
            <div class="risk-level" :class="getRiskLevel(portfolioRisk.overallScore)">
              {{ getRiskLevel(portfolioRisk.overallScore) }}
            </div>
          </div>
          <div class="card-content">
            <!-- Risk Gauge -->
            <div class="risk-gauge-container">
              <div class="risk-gauge">
                <div class="gauge-background"></div>
                <div class="gauge-fill" :style="{ transform: `rotate(${riskGaugeAngle}deg)` }"></div>
                <div class="gauge-center">
                  <span class="risk-score">{{ portfolioRisk.overallScore }}</span>
                  <span class="risk-label">Risk Score</span>
                </div>
              </div>
            </div>

            <!-- Risk Metrics -->
            <div class="risk-metrics">
              <div v-for="metric in portfolioRisk.metrics" :key="metric.name" class="risk-metric">
                <div class="metric-header">
                  <span class="metric-name">{{ metric.name }}</span>
                  <span class="metric-value" :class="metric.level">{{ metric.value }}</span>
                </div>
                <div class="metric-bar">
                  <div class="metric-fill" :class="metric.level" 
                       :style="{ width: (metric.normalizedValue * 100) + '%' }"></div>
                </div>
              </div>
            </div>

            <!-- Stress Test Results -->
            <div class="stress-tests">
              <h4>Stress Test Scenarios</h4>
              <div class="stress-results">
                <div v-for="test in stressTests" :key="test.scenario" class="stress-item">
                  <span class="scenario-name">{{ test.scenario }}</span>
                  <span class="scenario-impact" :class="test.impact >= 0 ? 'positive' : 'negative'">
                    {{ test.impact >= 0 ? '+' : '' }}{{ test.impact }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Sentiment Monitor -->
        <div class="feature-card sentiment-monitor">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-brain" />
              AI Sentiment Analysis
            </h3>
            <div class="sentiment-score" :class="getSentimentClass(marketSentiment.overall)">
              {{ marketSentiment.overall }}
            </div>
          </div>
          <div class="card-content">
            <div class="sentiment-sources">
              <div v-for="source in marketSentiment.sources" :key="source.name" 
                   class="sentiment-source">
                <div class="source-header">
                  <span class="source-name">{{ source.name }}</span>
                  <span class="source-weight">{{ source.weight }}%</span>
                </div>
                <div class="sentiment-bar">
                  <div class="sentiment-fill" :class="getSentimentClass(source.sentiment)"
                       :style="{ width: Math.abs(source.sentiment) * 100 + '%' }"></div>
                </div>
                <span class="sentiment-value">{{ source.sentiment.toFixed(2) }}</span>
              </div>
            </div>

            <!-- News Feed -->
            <div class="news-feed">
              <h4>Market News Impact</h4>
              <div class="news-items">
                <div v-for="news in recentNews" :key="news.id" class="news-item">
                  <div class="news-content">
                    <span class="news-title">{{ news.title }}</span>
                    <span class="news-time">{{ formatTime(news.timestamp) }}</span>
                  </div>
                  <div class="news-impact" :class="news.sentiment >= 0 ? 'positive' : 'negative'">
                    {{ news.sentiment >= 0 ? '+' : '' }}{{ news.sentiment }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Enhanced Quick Actions -->
    <div class="quick-actions">
      <button v-for="action in enhancedActions" :key="action.id" 
              @click="executeAction(action.id)"
              :class="['action-btn', action.type]">
        <font-awesome-icon :icon="action.icon" />
        <span>{{ action.label }}</span>
        <div class="action-indicator" v-if="action.isActive"></div>
      </button>
    </div>

    <!-- Enhanced ML Models Section -->
    <div class="ml-models-section">
      <h4>ML Models</h4>
      <div class="models-grid">
        <div v-for="model in mlModels" :key="model.name" class="model-card" :class="{ active: model.isActive }">
          <div class="model-header">
            <span class="model-name">{{ model.name }}</span>
            <span class="model-accuracy">{{ model.accuracy }}%</span>
          </div>
          <div class="model-metrics">
            <div class="model-metric">
              <span class="metric-name">Accuracy</span>
              <span class="metric-value">{{ model.accuracy }}%</span>
            </div>
            <div class="model-metric">
              <span class="metric-name">Precision</span>
              <span class="metric-value">{{ model.precision }}%</span>
            </div>
            <div class="model-metric">
              <span class="metric-name">Recall</span>
              <span class="metric-value">{{ model.recall }}%</span>
            </div>
            <div class="model-metric">
              <span class="metric-name">F1 Score</span>
              <span class="metric-value">{{ model.f1Score }}%</span>
            </div>
          </div>
          <div class="model-status">
            <i class="fa-solid fa-circle" :class="model.isActive ? 'active' : 'inactive'"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Backtesting Section -->
    <div class="backtesting-section">
      <h4>Backtesting</h4>
      <div class="backtest-controls">
        <div class="control-group">
          <label>Strategy</label>
          <select v-model="backtestStrategy">
            <option value="momentum">Momentum</option>
            <option value="mean-reversion">Mean Reversion</option>
            <option value="arbitrage">Arbitrage</option>
            <option value="market-neutral">Market Neutral</option>
          </select>
        </div>
        <div class="control-group">
          <label>Capital</label>
          <input v-model="backtestCapital" type="number" min="10000" max="1000000" step="1000">
        </div>
        <div class="control-group">
          <label>Start Date</label>
          <input v-model="backtestStartDate" type="date">
        </div>
        <div class="control-group">
          <label>End Date</label>
          <input v-model="backtestEndDate" type="date">
        </div>
      </div>
      <button @click="runBacktest" class="backtest-btn">Run Backtest</button>
      <div v-if="backtestResults" class="backtest-results">
        <div class="results-grid">
          <div class="result-item">
            <span class="result-label">Total Return</span>
            <span class="result-value">{{ backtestResults.totalReturn }}%</span>
          </div>
          <div class="result-item">
            <span class="result-label">Max Drawdown</span>
            <span class="result-value">{{ backtestResults.maxDrawdown }}%</span>
          </div>
          <div class="result-item">
            <span class="result-label">Volatility</span>
            <span class="result-value">{{ backtestResults.volatility }}%</span>
          </div>
          <div class="result-item">
            <span class="result-label">Calmar Ratio</span>
            <span class="result-value">{{ backtestResults.calmarRatio }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Factor Analysis -->
    <div class="factor-analysis">
      <h4>Factor Analysis</h4>
      <div class="factors-grid">
        <div v-for="factor in factorAnalysis" :key="factor.name" class="factor-item">
          <div class="factor-header">
            <span class="factor-name">{{ factor.name }}</span>
            <span class="factor-loading">{{ factor.loading }}%</span>
          </div>
          <div class="factor-bar">
            <div class="factor-fill" :style="{ width: factor.loading + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- VaR Analysis -->
    <div class="var-analysis">
      <h4>VaR Analysis</h4>
      <div class="var-metrics">
        <div v-for="metric in varMetrics" :key="metric.name" class="var-item">
          <span class="var-label">{{ metric.name }}</span>
          <span class="var-value">{{ metric.value }}</span>
        </div>
      </div>
    </div>

    <!-- Monte Carlo Section -->
    <div class="monte-carlo-section">
      <h4>Monte Carlo Simulation</h4>
      <div class="simulation-controls">
        <button @click="runMonteCarlo" class="simulation-btn">Run Simulation</button>
      </div>
      <div v-if="monteCarloResults" class="simulation-results">
        <div class="percentile-results">
          <div v-for="result in monteCarloResults" :key="result.percentile" class="percentile-item">
            <span class="result-label">{{ result.percentile }}%</span>
            <span class="result-value">{{ result.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Alternative Data Section -->
    <div class="alt-data-section">
      <h4>Alternative Data</h4>
      <div class="alt-data-grid">
        <div v-for="data in alternativeData" :key="data.source" class="alt-data-item">
          <div class="signal-header">
            <span class="signal-source">{{ data.source }}</span>
            <span class="signal-strength">{{ data.strength }}%</span>
          </div>
          <span class="signal-description">{{ data.description }}</span>
          <span class="signal-confidence">{{ data.confidence }}%</span>
        </div>
      </div>
    </div>

    <!-- Pattern Recognition -->
    <div class="pattern-recognition">
      <h4>Pattern Recognition</h4>
      <div class="patterns-detected">
        <div v-for="pattern in patternRecognition" :key="pattern.name" class="pattern-item">
          <div class="pattern-header">
            <span class="pattern-name">{{ pattern.name }}</span>
            <span class="pattern-confidence">{{ pattern.confidence }}%</span>
          </div>
          <span class="pattern-signal" :class="pattern.signal">{{ pattern.signal }}</span>
        </div>
      </div>
    </div>

    <!-- Enhanced Sentiment Analysis -->
    <div class="overall-sentiment">
      <h4>Overall Sentiment</h4>
      <div class="sentiment-gauge">
        <div class="sentiment-indicator" :style="{ left: sentimentIndicatorPosition + 'px' }"></div>
      </div>
      <div class="sentiment-labels">
        <span>Negative</span>
        <span>Neutral</span>
        <span>Positive</span>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faBrain, faRobot, faChartPie, faChartLine, faShieldHalved, 
  faPlay, faPause, faCog, faSearch, faDownload
} from '@fortawesome/free-solid-svg-icons';

library.add(faBrain, faRobot, faChartPie, faChartLine, faShieldHalved, faPlay, faPause, faCog, faSearch, faDownload);

export default {
  name: 'AIHedgeFundLabPage',
  components: { FontAwesomeIcon },
  data() {
    return {
      totalAUM: 347.5,
      dailyPnL: 15420.75,
      activeTimeframe: '1D',
      
      marketStatus: {
        isOpen: true,
        lastUpdate: Date.now()
      },

      tradingEngine: {
        isRunning: false,
        status: 'stopped',
        strategy: 'momentum',
        activePositions: 12,
        winRate: 0.682,
        dailyPnL: 8947.50,
        sharpeRatio: 2.34,
        positions: [
          { symbol: 'AAPL', quantity: 500, entryPrice: 185.50, currentPrice: 187.25, pnl: 875.00 },
          { symbol: 'GOOGL', quantity: 200, entryPrice: 2750.00, currentPrice: 2782.50, pnl: 6500.00 },
          { symbol: 'MSFT', quantity: 300, entryPrice: 415.25, currentPrice: 412.75, pnl: -750.00 },
          { symbol: 'TSLA', quantity: 150, entryPrice: 245.80, currentPrice: 252.30, pnl: 975.00 },
          { symbol: 'NVDA', quantity: 100, entryPrice: 895.00, currentPrice: 912.50, pnl: 1750.00 }
        ]
      },

      optimizer: {
        targetReturn: 12.5,
        riskTolerance: 'moderate',
        allocation: [
          { name: 'Large Cap Stocks', percentage: 45 },
          { name: 'Small Cap Stocks', percentage: 20 },
          { name: 'International', percentage: 15 },
          { name: 'Bonds', percentage: 12 },
          { name: 'Commodities', percentage: 5 },
          { name: 'Cash', percentage: 3 }
        ]
      },

      selectedTimeframe: '1D',

      technicalIndicators: [
        { name: 'RSI (14)', value: 65.4, signal: 'neutral' },
        { name: 'MACD', value: 2.34, signal: 'bullish' },
        { name: 'Bollinger %B', value: 0.78, signal: 'bullish' },
        { name: 'Stochastic', value: 72.1, signal: 'neutral' },
        { name: 'Williams %R', value: -28.5, signal: 'bullish' },
        { name: 'ADX', value: 45.2, signal: 'trending' }
      ],

      portfolioRisk: {
        overallScore: 72,
        marketRisk: 68.5,
        creditRisk: 23.2,
        liquidityRisk: 15.8,
        stressTests: [
          { scenario: '2008 Financial Crisis', impact: -0.387 },
          { scenario: 'COVID-19 Crash', impact: -0.234 },
          { scenario: 'Flash Crash', impact: -0.156 },
          { scenario: 'Rate Hike Cycle', impact: -0.089 },
          { scenario: 'Currency Crisis', impact: -0.123 }
        ]
      },

      riskMetrics: {
        var_1d_95: 125000,
        var_1d_99: 198000,
        expectedShortfall: 245000
      },

      monteCarloResults: {
        isComplete: true,
        percentile_5: -0.234,
        percentile_50: 0.156,
        percentile_95: 0.567
      },

      alternativeData: [
        {
          source: 'Satellite Imagery',
          strength: 0.78,
          confidence: 0.85,
          description: 'Retail foot traffic analysis showing increased activity'
        },
        {
          source: 'Social Sentiment',
          strength: 0.62,
          confidence: 0.73,
          description: 'Positive sentiment spike in tech sector mentions'
        },
        {
          source: 'Patent Filings',
          strength: 0.91,
          confidence: 0.92,
          description: 'Significant increase in AI/ML patent applications'
        },
        {
          source: 'Supply Chain',
          strength: -0.34,
          confidence: 0.78,
          description: 'Disruptions detected in semiconductor supply chain'
        }
      ],

      marketSentiment: {
        overall: 0.34,
        sources: [
          { name: 'News Sentiment', sentiment: 0.45, weight: 0.3 },
          { name: 'Social Media', sentiment: 0.28, weight: 0.25 },
          { name: 'Options Flow', sentiment: 0.67, weight: 0.2 },
          { name: 'Insider Trading', sentiment: 0.12, weight: 0.15 },
          { name: 'Analyst Revisions', sentiment: 0.55, weight: 0.1 }
        ]
      },

      recentNews: [
        { id: 1, title: 'Fed signals potential rate cuts in Q2', sentiment: 0.45, timestamp: Date.now() - 300000 },
        { id: 2, title: 'Tech earnings beat expectations broadly', sentiment: 0.32, timestamp: Date.now() - 600000 },
        { id: 3, title: 'Geopolitical tensions escalate in Asia', sentiment: -0.28, timestamp: Date.now() - 900000 }
      ],

      enhancedActions: [
        { id: 1, label: 'Market Scanner', icon: 'fa-solid fa-search', type: 'primary', isActive: false },
        { id: 2, label: 'Download Report', icon: 'fa-solid fa-download', type: 'secondary', isActive: false },
        { id: 3, label: 'Risk Alert', icon: 'fa-solid fa-shield-halved', type: 'warning', isActive: true },
        { id: 4, label: 'Auto-Rebalance', icon: 'fa-solid fa-cog', type: 'info', isActive: false }
      ],

      mlModels: [
        { name: 'Model A', accuracy: 85, precision: 80, recall: 82, f1Score: 81, isActive: false },
        { name: 'Model B', accuracy: 82, precision: 78, recall: 79, f1Score: 78, isActive: false },
        { name: 'Model C', accuracy: 80, precision: 75, recall: 76, f1Score: 75, isActive: false }
      ],

      backtestStrategy: 'momentum',
      backtestCapital: 50000,
      backtestStartDate: '',
      backtestEndDate: '',
      backtestResults: null,

      factorAnalysis: [
        { name: 'Factor 1', loading: 75 },
        { name: 'Factor 2', loading: 65 },
        { name: 'Factor 3', loading: 55 }
      ],

      varMetrics: [
        { name: 'VaR 95%', value: '$100,000' },
        { name: 'VaR 99%', value: '$150,000' },
        { name: 'Expected Shortfall', value: '$200,000' }
      ],

      sentimentIndicatorPosition: 0
    };
  },

  computed: {
    riskGaugeAngle() {
      return (this.portfolioRisk.overallScore / 100) * 180;
    },
    sentimentIndicatorPosition() {
      const sentiment = this.marketSentiment.overall;
      const position = Math.round((sentiment + 1) * 100);
      return position;
    }
  },

  mounted() {
    this.initializeCharts();
    this.startRealTimeUpdates();
  },

  methods: {
    toggleTrading() {
      this.tradingEngine.isRunning = !this.tradingEngine.isRunning;
      this.tradingEngine.status = this.tradingEngine.isRunning ? 'active' : 'stopped';
    },

    runOptimization() {
      // Simulate optimization process
      setTimeout(() => {
        this.optimizer.allocation.forEach(asset => {
          asset.percentage = Math.max(0, asset.percentage + (Math.random() - 0.5) * 10);
        });
        
        // Normalize to 100%
        const total = this.optimizer.allocation.reduce((sum, asset) => sum + asset.percentage, 0);
        this.optimizer.allocation.forEach(asset => {
          asset.percentage = Math.round(asset.percentage / total * 100);
        });
      }, 1000);
    },

    executeAction(actionId) {
      const action = this.enhancedActions.find(a => a.id === actionId);
      if (action) {
        action.isActive = !action.isActive;
        // Simulate action execution
        console.log(`Executing action: ${action.label}`);
      }
    },

    getRiskLevel(score) {
      if (score < 30) return 'low';
      if (score < 70) return 'medium';
      return 'high';
    },

    getSentimentClass(sentiment) {
      if (sentiment > 0.2) return 'positive';
      if (sentiment < -0.2) return 'negative';
      return 'neutral';
    },

    formatTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    initializeCharts() {
      this.$nextTick(() => {
        if (this.$refs.priceChart) {
          this.drawPriceChart();
        }
        if (this.$refs.frontierChart) {
          this.drawEfficientFrontier();
        }
      });
    },

    drawPriceChart() {
      const canvas = this.$refs.priceChart;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw price line
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      const points = Array.from({ length: 50 }, (_, i) => ({
        x: (i / 49) * (canvas.width - 40) + 20,
        y: 200 - Math.sin(i * 0.3) * 50 - Math.random() * 30
      }));
      
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
    },

    drawEfficientFrontier() {
      const canvas = this.$refs.frontierChart;
      const ctx = canvas.getContext('2d');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw efficient frontier curve
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let i = 0; i <= 100; i++) {
        const x = i / 100 * (canvas.width - 40) + 20;
        const y = canvas.height - 20 - Math.sqrt(i) * 15;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      // Mark current portfolio
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(200, 120, 5, 0, 2 * Math.PI);
      ctx.fill();
    },

    startRealTimeUpdates() {
      setInterval(() => {
        // Update trading positions
        this.tradingEngine.positions.forEach(position => {
          position.currentPrice += (Math.random() - 0.5) * 2;
          position.pnl = (position.currentPrice - position.entryPrice) * position.quantity;
        });
        
        // Update market sentiment
        this.marketSentiment.overall = Math.max(-1, Math.min(1, this.marketSentiment.overall + (Math.random() - 0.5) * 0.1));
        
        // Update daily P&L
        this.dailyPnL += (Math.random() - 0.5) * 0.1;
        
        // Update risk score
        this.portfolioRisk.overallScore = Math.max(0, Math.min(100, this.portfolioRisk.overallScore + (Math.random() - 0.5) * 5));
      }, 2000);
    },

    runBacktest() {
      console.log('Running advanced backtest...');
      // Simulate backtesting process
      this.backtestResults = {
        isComplete: true,
        totalReturn: 0.28 + Math.random() * 0.15,
        maxDrawdown: -(0.05 + Math.random() * 0.1),
        volatility: 0.12 + Math.random() * 0.08,
        calmarRatio: 2.5 + Math.random() * 2
      };
    },

    runMonteCarlo() {
      console.log('Running Monte Carlo simulation...');
      this.monteCarloResults.isComplete = false;
      
      setTimeout(() => {
        this.monteCarloResults = {
          isComplete: true,
          percentile_5: -0.2 - Math.random() * 0.1,
          percentile_50: 0.1 + Math.random() * 0.1,
          percentile_95: 0.4 + Math.random() * 0.2
        };
      }, 5000);
    },

    getFactorClass(loading) {
      if (loading > 0.3) return 'positive';
      if (loading < -0.3) return 'negative';
      return 'neutral';
    },

    getSignalClass(strength) {
      if (strength > 0.5) return 'positive';
      if (strength < -0.5) return 'negative';
      return 'neutral';
    },

    formatNumber(num) {
      return Math.abs(num).toLocaleString('en-US', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
      });
    },

    getBubbleStyle(index) {
      const size = Math.random() * 60 + 20; // 20-80px
      const left = Math.random() * 100; // 0-100%
      const animationDelay = Math.random() * 20; // 0-20s
      const animationDuration = Math.random() * 10 + 15; // 15-25s
      const opacity = Math.random() * 0.3 + 0.1; // 0.1-0.4
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`,
        opacity: opacity
      };
    }
  }
};
</script>

<style scoped>
/* Base Layout - Enhanced */
.ai-hedge-fund-lab {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0a0a0a 100%);
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 2rem;
  position: relative;
  overflow-x: hidden;
  animation: fadeIn 0.8s ease-out;
}

/* Enhanced Universe Background */
.universe-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.bubble {
  position: absolute;
  background: radial-gradient(circle, rgba(100, 149, 237, 0.3), rgba(65, 105, 225, 0.1));
  border-radius: 50%;
  animation: float 20s infinite linear;
  box-shadow: 0 0 20px rgba(100, 149, 237, 0.3);
}

/* Animations */
@keyframes float {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes cardSlideIn {
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Header */
.lab-header {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border: 1px solid rgba(100, 149, 237, 0.3);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(25px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: slideInDown 0.8s ease-out;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.lab-title {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.brain-icon {
  font-size: 3rem;
  color: #64a5f3;
  animation: pulse 2s infinite;
  filter: drop-shadow(0 0 20px rgba(100, 165, 243, 0.5));
}

.lab-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.lab-title p {
  font-size: 1.1rem;
  color: #cccccc;
  margin: 0;
}

.market-status {
  display: flex;
  gap: 2rem;
}

.status-item {
  text-align: center;
}

.status-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.status-label {
  font-size: 0.9rem;
  color: #999999;
  text-transform: uppercase;
}

/* Main Dashboard & Feature Cards */
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: slideInUp 0.8s ease-out 0.3s both;
}

.feature-card {
  background: linear-gradient(135deg, rgba(40, 48, 78, 0.5), rgba(26, 30, 52, 0.5));
  border: 1px solid rgba(100, 149, 237, 0.2);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transition: all 0.4s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-color: rgba(100, 149, 237, 0.4);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(100, 149, 237, 0.2);
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #e0e0e0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* General Section Styling */
.quick-actions, .ml-models-section, .backtesting-section, .factor-analysis, .var-analysis, .monte-carlo-section, .alt-data-section, .pattern-recognition, .overall-sentiment {
  max-width: 1400px;
  margin: 2rem auto;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(40, 48, 78, 0.5), rgba(26, 30, 52, 0.5));
  border: 1px solid rgba(100, 149, 237, 0.2);
  border-radius: 20px;
}

.quick-actions h4, .ml-models-section h4, .backtesting-section h4, .factor-analysis h4, .var-analysis h4, .monte-carlo-section h4, .alt-data-section h4, .pattern-recognition h4, .overall-sentiment h4 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(100, 149, 237, 0.2);
  text-align: center;
}

/* Quick Actions */
.quick-actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin: 2.5rem auto;
    max-width: 1400px;
}

.action-btn {
    background: linear-gradient(135deg, rgba(100, 165, 243, 0.15), rgba(65, 105, 225, 0.15));
    border: 1px solid rgba(100, 149, 237, 0.3);
    color: #e0e0e0;
    padding: 1rem 1.8rem;
    border-radius: 14px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.action-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(65, 105, 225, 0.3);
    border-color: rgba(100, 149, 237, 0.5);
    color: #fff;
}

/* ML Models */
.models-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
}
.model-card {
    background: rgba(40, 48, 78, 0.5);
    padding: 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(100, 149, 237, 0.2);
    transition: all 0.3s ease;
}
.model-card:hover {
    transform: scale(1.03);
    border-color: rgba(100, 149, 237, 0.4);
}

.model-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    margin-bottom: 1rem;
    font-size: 1.1rem;
}
.model-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    font-size: 0.9rem;
    color: #ccc;
}
.model-metric {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: rgba(0,0,0,0.2);
    border-radius: 6px;
}
.model-metric .metric-value {
    font-weight: bold;
    color: #fff;
}

/* Backtesting */
.backtest-controls {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
}
.control-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #ccc;
}
.control-group input, .control-group select {
    width: 100%;
    padding: 0.75rem;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(100, 149, 237, 0.3);
    border-radius: 8px;
    color: white;
}
.backtest-btn {
    display: block;
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #5b6eae, #4169e1);
    border: none;
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    margin-top: 1rem;
}

/* Other Sections */
.factors-grid, .var-metrics, .alt-data-grid, .patterns-detected {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-container { grid-template-columns: 1fr; }
  .header-content { flex-direction: column; gap: 1.5rem; }
}

@media (max-width: 768px) {
  .ai-hedge-fund-lab { padding: 1rem; }
  .lab-header { padding: 1.5rem; }
  .lab-title h1 { font-size: 1.8rem; }
  .quick-actions { flex-direction: column; align-items: stretch; }
  .models-grid, .backtest-controls, .factors-grid, .var-metrics, .alt-data-grid, .patterns-detected {
    grid-template-columns: 1fr;
  }
}
</style> 