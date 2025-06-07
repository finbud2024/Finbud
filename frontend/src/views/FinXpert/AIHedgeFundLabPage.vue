<template>
  <div class="ai-hedge-fund-lab">
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
    }
  }
};
</script>

<style scoped>
.ai-hedge-fund-lab {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  padding: 2rem;
}

.lab-header {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(20px);
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
  color: #ffffff;
}

.lab-title h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
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
  color: #ffffff;
}

.status-label {
  font-size: 0.9rem;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(20px);
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
  font-size: 1.2rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trading-status {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.trading-status.active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.trading-status.stopped {
  background: rgba(255, 255, 255, 0.1);
  color: #999999;
}

.trading-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.trading-btn {
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

.trading-btn:hover {
  background: #cccccc;
}

.trading-btn.active {
  background: #ff4444;
  color: #ffffff;
}

.strategy-select {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
  flex: 1;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.metric-label {
  color: #cccccc;
  font-size: 0.9rem;
}

.metric-value {
  color: #ffffff;
  font-weight: 600;
}

.positive {
  color: #ffffff !important;
}

.negative {
  color: #ff9999 !important;
}

.positions-section h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.positions-list {
  max-height: 200px;
  overflow-y: auto;
}

.position-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.position-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.symbol {
  font-weight: 600;
  color: #ffffff;
}

.quantity {
  font-size: 0.8rem;
  color: #cccccc;
}

.position-metrics {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

.optimization-inputs {
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #cccccc;
  font-size: 0.9rem;
}

.input-group input[type="range"] {
  width: calc(100% - 60px);
  margin-right: 10px;
}

.range-value {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.input-group select {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffff;
}

.allocation-chart h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.allocation-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.allocation-bar {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1rem;
  align-items: center;
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
  background: linear-gradient(90deg, #ffffff, #cccccc);
  transition: width 0.5s ease;
}

.percentage {
  font-size: 0.9rem;
  color: #ffffff;
  font-weight: 600;
}

.efficiency-frontier h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.analytics-controls {
  display: flex;
  gap: 0.5rem;
}

.timeframe-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #cccccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeframe-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

.timeframe-btn.active {
  background: #ffffff;
  color: #000000;
}

.chart-container {
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.indicators-section h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.indicators-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.indicator-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.indicator-name {
  color: #cccccc;
}

.indicator-value {
  font-weight: 600;
}

.indicator-signal {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
  font-weight: 600;
}

.bullish {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.bearish {
  background: rgba(255, 153, 153, 0.2);
  color: #ff9999;
}

.neutral {
  background: rgba(255, 255, 255, 0.1);
  color: #cccccc;
}

.risk-level {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.risk-level.low {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.risk-level.medium {
  background: rgba(255, 204, 102, 0.2);
  color: #ffcc66;
}

.risk-level.high {
  background: rgba(255, 102, 102, 0.2);
  color: #ff6666;
}

.risk-gauge-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.risk-gauge {
  position: relative;
  width: 120px;
  height: 120px;
}

.gauge-background {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid rgba(255, 255, 255, 0.1);
}

.gauge-fill {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid #ffffff;
  border-right-color: transparent;
  border-bottom-color: transparent;
  transform-origin: center;
  transition: transform 0.5s ease;
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
  color: #cccccc;
}

.risk-metrics {
  margin-bottom: 1.5rem;
}

.risk-metric {
  margin-bottom: 1rem;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.metric-name {
  color: #cccccc;
  font-size: 0.9rem;
}

.metric-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.metric-fill.low {
  background: #ffffff;
}

.metric-fill.medium {
  background: #ffcc66;
}

.metric-fill.high {
  background: #ff6666;
}

.stress-tests h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.stress-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stress-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.scenario-name {
  color: #cccccc;
  font-size: 0.9rem;
}

.scenario-impact {
  font-weight: 600;
}

.sentiment-score {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.sentiment-sources {
  margin-bottom: 1.5rem;
}

.sentiment-source {
  margin-bottom: 1rem;
}

.source-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.source-name {
  color: #cccccc;
  font-size: 0.9rem;
}

.source-weight {
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 600;
}

.sentiment-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.sentiment-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.sentiment-fill.positive {
  background: #ffffff;
}

.sentiment-fill.negative {
  background: #ff9999;
}

.sentiment-fill.neutral {
  background: #cccccc;
}

.sentiment-value {
  font-size: 0.8rem;
  color: #ffffff;
  font-weight: 600;
}

.news-feed h4 {
  margin-bottom: 1rem;
  color: #ffffff;
}

.news-items {
  max-height: 200px;
  overflow-y: auto;
}

.news-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.news-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
}

.news-title {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 500;
}

.news-time {
  color: #999999;
  font-size: 0.8rem;
}

.news-impact {
  font-weight: 600;
  font-size: 0.9rem;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.action-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 1rem 2rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.action-btn.primary {
  background: #ffffff;
  color: #000000;
}

.action-btn.warning {
  border-color: #ff9999;
  color: #ff9999;
}

.action-btn.info {
  border-color: #99ccff;
  color: #99ccff;
}

.action-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

@media (max-width: 1200px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .quick-actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .ai-hedge-fund-lab {
    padding: 1rem;
  }
  
  .metric-grid {
    grid-template-columns: 1fr;
  }
  
  .allocation-bar {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* Enhanced ML Models Section */
.ml-models-section {
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.ml-models-section h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.model-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.model-card.active {
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.model-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.model-name {
  font-weight: 600;
  color: #ffffff;
}

.model-accuracy {
  color: #ffffff;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.model-metrics {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.model-metric {
  display: flex;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #cccccc;
}

.model-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #cccccc;
}

.model-status i.active {
  color: #ffffff;
}

.model-status i.inactive {
  color: #666666;
}

/* Backtesting Section */
.backtesting-section {
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.backtesting-section h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.backtest-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  color: #cccccc;
  font-size: 0.9rem;
}

.control-group select,
.capital-input {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #ffffff;
}

.backtest-btn {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.backtest-btn:hover {
  background: #cccccc;
}

.backtest-results {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-label {
  color: #cccccc;
  font-size: 0.9rem;
}

.result-value {
  font-weight: 600;
  color: #ffffff;
}

/* Factor Analysis */
.factor-analysis {
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.factor-analysis h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.factors-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.factor-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0.75rem;
}

.factor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.factor-name {
  color: #cccccc;
  font-size: 0.9rem;
}

.factor-loading {
  font-weight: 600;
  font-size: 0.9rem;
}

.factor-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.factor-fill {
  height: 100%;
  transition: width 0.5s ease;
}

.factor-fill.positive {
  background: #ffffff;
}

.factor-fill.negative {
  background: #ff9999;
}

.factor-fill.neutral {
  background: #cccccc;
}

/* VaR Analysis */
.var-analysis {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.var-analysis h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.var-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.var-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.var-label {
  color: #cccccc;
  font-size: 0.9rem;
}

.var-value {
  font-weight: 600;
  font-size: 0.9rem;
}

/* Monte Carlo Section */
.monte-carlo-section {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.monte-carlo-section h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.simulation-controls {
  margin-bottom: 1rem;
}

.simulation-btn {
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.simulation-btn:hover {
  background: #cccccc;
}

.simulation-results {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 1rem;
}

.percentile-results {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.percentile-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

/* Alternative Data Section */
.alt-data-section {
  margin-bottom: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.alt-data-section h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alt-data-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alt-data-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
}

.signal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.signal-source {
  font-weight: 600;
  color: #ffffff;
}

.signal-strength {
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.signal-description {
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.signal-confidence {
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Pattern Recognition */
.pattern-recognition {
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.pattern-recognition h4 {
  color: #ffffff;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.patterns-detected {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pattern-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 0.75rem;
}

.pattern-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.pattern-name {
  color: #ffffff;
  font-weight: 500;
}

.pattern-confidence {
  color: #cccccc;
  font-size: 0.8rem;
}

.pattern-signal {
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.pattern-signal.bullish {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.pattern-signal.bearish {
  background: rgba(255, 153, 153, 0.2);
  color: #ff9999;
}

/* Enhanced Sentiment Analysis */
.overall-sentiment {
  margin-bottom: 1.5rem;
}

.sentiment-gauge {
  position: relative;
  height: 20px;
  background: linear-gradient(90deg, #ff9999 0%, #cccccc 50%, #ffffff 100%);
  border-radius: 10px;
  margin-bottom: 0.5rem;
}

.sentiment-indicator {
  position: absolute;
  top: -5px;
  width: 10px;
  height: 30px;
  background: #000000;
  border-radius: 2px;
  transform: translateX(-50%);
  transition: left 0.5s ease;
}

.sentiment-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #cccccc;
}
</style> 