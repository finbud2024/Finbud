<template>
  <div class="ai-breakthrough-workflows">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">
            <font-awesome-icon icon="fa-solid fa-brain" class="brain-icon" />
            AI Breakthrough Workflows
          </h1>
          <p class="subtitle">Tương lai của tài chính thông minh với Multi-Agent AI Systems</p>
        </div>
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-value">{{ activeAgents }}</div>
            <div class="stat-label">Active Agents</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ completedWorkflows }}</div>
            <div class="stat-label">Workflows Completed</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ accuracy }}%</div>
            <div class="stat-label">AI Accuracy</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agent Orchestrator -->
    <div class="orchestrator-section">
      <div class="section-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-network-wired" />
          Multi-Agent Orchestrator
        </h2>
        <button @click="toggleOrchestrator" class="orchestrator-btn" 
                :class="{ active: orchestratorActive }">
          <font-awesome-icon :icon="orchestratorActive ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
          {{ orchestratorActive ? 'Pause System' : 'Start System' }}
        </button>
      </div>
      
      <div class="agent-network">
        <div v-for="agent in aiAgents" :key="agent.id" 
             :class="['agent-node', agent.status, { processing: agent.processing }]"
             @click="selectAgent(agent.id)">
          <div class="agent-avatar">
            <img :src="agent.avatar" :alt="agent.name" />
            <div class="status-indicator" :class="agent.status"></div>
          </div>
          <div class="agent-info">
            <h4>{{ agent.name }}</h4>
            <p>{{ agent.specialty }}</p>
            <div class="agent-metrics">
              <span class="success-rate">{{ agent.successRate }}% success</span>
              <span class="tasks-completed">{{ agent.tasksCompleted }} tasks</span>
            </div>
          </div>
          <div class="processing-indicator" v-if="agent.processing">
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow Designer -->
    <div class="workflow-designer">
      <div class="section-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-project-diagram" />
          Intelligent Workflow Designer
        </h2>
        <div class="workflow-controls">
          <select v-model="selectedWorkflowType" @change="loadWorkflowTemplate">
            <option value="portfolio-optimization">Portfolio Optimization</option>
            <option value="risk-assessment">Risk Assessment Pipeline</option>
            <option value="market-prediction">Market Prediction Chain</option>
            <option value="fraud-detection">Fraud Detection System</option>
            <option value="algorithmic-trading">Algorithmic Trading Bot</option>
          </select>
          <button @click="createNewWorkflow" class="create-btn">
            <font-awesome-icon icon="fa-solid fa-plus" />
            Create Workflow
          </button>
        </div>
      </div>

      <div class="workflow-canvas">
        <div class="workflow-steps">
          <div v-for="(step, index) in currentWorkflow.steps" :key="index"
               :class="['workflow-step', step.status]"
               @click="editStep(index)">
            <div class="step-header">
              <font-awesome-icon :icon="step.icon" />
              <span>{{ step.name }}</span>
              <div class="step-status" :class="step.status">
                {{ step.status }}
              </div>
            </div>
            <div class="step-content">
              <p>{{ step.description }}</p>
              <div class="step-metrics" v-if="step.metrics">
                <span v-for="metric in step.metrics" :key="metric.label">
                  {{ metric.label }}: {{ metric.value }}
                </span>
              </div>
            </div>
            <div class="step-connector" v-if="index < currentWorkflow.steps.length - 1">
              <font-awesome-icon icon="fa-solid fa-arrow-down" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Analytics Dashboard -->
    <div class="analytics-dashboard">
      <div class="section-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-chart-line" />
          Advanced Analytics & Insights
        </h2>
        <div class="analytics-controls">
          <select v-model="analyticsTimeframe">
            <option value="1h">1 Hour</option>
            <option value="1d">1 Day</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
          </select>
        </div>
      </div>

      <div class="analytics-grid">
        <div class="analytics-card performance">
          <h3>AI Performance Metrics</h3>
          <div class="performance-chart">
            <canvas ref="performanceChart" width="400" height="200"></canvas>
          </div>
          <div class="performance-stats">
            <div class="stat">
              <span class="label">Avg Response Time</span>
              <span class="value">{{ avgResponseTime }}ms</span>
            </div>
            <div class="stat">
              <span class="label">Accuracy Rate</span>
              <span class="value">{{ accuracy }}%</span>
            </div>
          </div>
        </div>

        <div class="analytics-card predictions">
          <h3>Market Predictions</h3>
          <div class="prediction-list">
            <div v-for="prediction in marketPredictions" :key="prediction.id"
                 :class="['prediction-item', prediction.confidence]">
              <div class="prediction-header">
                <span class="symbol">{{ prediction.symbol }}</span>
                <span class="confidence">{{ prediction.confidenceLevel }}%</span>
              </div>
              <div class="prediction-content">
                <span class="direction" :class="prediction.direction">
                  {{ prediction.direction.toUpperCase() }}
                </span>
                <span class="target">Target: ${{ prediction.targetPrice }}</span>
              </div>
              <div class="prediction-reasoning">
                {{ prediction.reasoning }}
              </div>
            </div>
          </div>
        </div>

        <div class="analytics-card risk-monitor">
          <h3>Real-time Risk Monitor</h3>
          <div class="risk-gauge">
            <div class="gauge-container">
              <div class="gauge-circle">
                <div class="gauge-fill" :style="{ transform: `rotate(${riskGaugeAngle}deg)` }"></div>
                <div class="gauge-center">
                  <span class="risk-score">{{ riskScore }}</span>
                  <span class="risk-label">Risk Score</span>
                </div>
              </div>
            </div>
          </div>
          <div class="risk-factors">
            <div v-for="factor in riskFactors" :key="factor.name" class="risk-factor">
              <span class="factor-name">{{ factor.name }}</span>
              <div class="factor-bar">
                <div class="factor-fill" :style="{ width: factor.level + '%' }"></div>
              </div>
              <span class="factor-value">{{ factor.level }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Autonomous Trading Bot -->
    <div class="trading-bot-section">
      <div class="section-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-robot" />
          Autonomous Trading Bot
        </h2>
        <div class="bot-controls">
          <button @click="toggleTradingBot" 
                  :class="['bot-toggle', { active: tradingBotActive }]">
            <font-awesome-icon :icon="tradingBotActive ? 'fa-solid fa-stop' : 'fa-solid fa-play'" />
            {{ tradingBotActive ? 'Stop Bot' : 'Start Bot' }}
          </button>
          <select v-model="tradingStrategy">
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
      </div>

      <div class="bot-dashboard">
        <div class="bot-status">
          <div class="status-card">
            <h4>Bot Status</h4>
            <div class="status-indicator" :class="tradingBotActive ? 'active' : 'inactive'">
              {{ tradingBotActive ? 'ACTIVE' : 'INACTIVE' }}
            </div>
            <div class="bot-metrics">
              <div class="metric">
                <span>Total Trades:</span>
                <span>{{ botStats.totalTrades }}</span>
              </div>
              <div class="metric">
                <span>Win Rate:</span>
                <span class="positive">{{ botStats.winRate }}%</span>
              </div>
              <div class="metric">
                <span>P&L Today:</span>
                <span :class="botStats.dailyPnL >= 0 ? 'positive' : 'negative'">
                  ${{ botStats.dailyPnL }}
                </span>
              </div>
            </div>
          </div>

          <div class="active-positions">
            <h4>Active Positions</h4>
            <div class="positions-list">
              <div v-for="position in activePositions" :key="position.symbol"
                   class="position-item">
                <div class="position-header">
                  <span class="symbol">{{ position.symbol }}</span>
                  <span class="action" :class="position.action">{{ position.action }}</span>
                </div>
                <div class="position-details">
                  <span>Qty: {{ position.quantity }}</span>
                  <span>Entry: ${{ position.entryPrice }}</span>
                  <span :class="position.pnl >= 0 ? 'positive' : 'negative'">
                    P&L: ${{ position.pnl }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Insights Feed -->
    <div class="insights-feed">
      <div class="section-header">
        <h2>
          <font-awesome-icon icon="fa-solid fa-lightbulb" />
          AI Generated Insights
        </h2>
        <button @click="refreshInsights" class="refresh-btn">
          <font-awesome-icon icon="fa-solid fa-sync-alt" />
          Refresh
        </button>
      </div>

      <div class="insights-container">
        <div v-for="insight in aiInsights" :key="insight.id"
             :class="['insight-card', insight.priority]">
          <div class="insight-header">
            <div class="insight-source">
              <font-awesome-icon :icon="insight.icon" />
              <span>{{ insight.source }}</span>
            </div>
            <div class="insight-timestamp">{{ formatTime(insight.timestamp) }}</div>
            <div class="insight-priority" :class="insight.priority">
              {{ insight.priority }}
            </div>
          </div>
          <div class="insight-content">
            <h4>{{ insight.title }}</h4>
            <p>{{ insight.description }}</p>
            <div class="insight-actions" v-if="insight.actions">
              <button v-for="action in insight.actions" :key="action.type"
                      @click="executeInsightAction(action)"
                      class="action-btn">
                {{ action.label }}
              </button>
            </div>
          </div>
          <div class="insight-confidence">
            <span>Confidence: {{ insight.confidence }}%</span>
            <div class="confidence-bar">
              <div class="confidence-fill" :style="{ width: insight.confidence + '%' }"></div>
            </div>
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
  faBrain, faNetworkWired, faProjectDiagram, faChartLine, faRobot,
  faLightbulb, faPlay, faPause, faStop, faPlus, faArrowDown,
  faSyncAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faBrain, faNetworkWired, faProjectDiagram, faChartLine, faRobot,
  faLightbulb, faPlay, faPause, faStop, faPlus, faArrowDown,
  faSyncAlt, faTimes
);

export default {
  name: 'AIBreakthroughWorkflowsPage',
  components: { FontAwesomeIcon },
  data() {
    return {
      activeAgents: 8,
      completedWorkflows: 1247,
      accuracy: 94.7,
      orchestratorActive: false,
      selectedWorkflowType: 'portfolio-optimization',
      analyticsTimeframe: '1d',
      tradingBotActive: false,
      tradingStrategy: 'balanced',
      avgResponseTime: 127,
      riskScore: 23,
      riskGaugeAngle: 45,
      
      aiAgents: [
        {
          id: 1,
          name: 'Portfolio Optimizer',
          specialty: 'Asset Allocation & Risk Management',
          avatar: '/agents/portfolio-agent.png',
          status: 'active',
          processing: false,
          successRate: 96.8,
          tasksCompleted: 342
        },
        {
          id: 2,
          name: 'Market Analyst',
          specialty: 'Technical & Fundamental Analysis',
          avatar: '/agents/analyst-agent.png',
          status: 'active',
          processing: true,
          successRate: 94.2,
          tasksCompleted: 598
        },
        {
          id: 3,
          name: 'Risk Assessor',
          specialty: 'Risk Modeling & Compliance',
          avatar: '/agents/risk-agent.png',
          status: 'active',
          processing: false,
          successRate: 98.1,
          tasksCompleted: 423
        },
        {
          id: 4,
          name: 'News Processor',
          specialty: 'Sentiment Analysis & Event Processing',
          avatar: '/agents/news-agent.png',
          status: 'standby',
          processing: false,
          successRate: 92.5,
          tasksCompleted: 1203
        }
      ],
      
      currentWorkflow: {
        name: 'Portfolio Optimization',
        steps: [
          {
            name: 'Data Collection',
            description: 'Gathering market data, portfolio holdings, and risk parameters',
            status: 'completed',
            icon: 'fa-solid fa-database',
            metrics: [
              { label: 'Data Sources', value: '15' },
              { label: 'Refresh Rate', value: '1s' }
            ]
          },
          {
            name: 'Risk Analysis',
            description: 'Calculating VaR, stress testing, and correlation analysis',
            status: 'processing',
            icon: 'fa-solid fa-shield-alt',
            metrics: [
              { label: 'VaR 95%', value: '-2.3%' },
              { label: 'Sharpe Ratio', value: '1.85' }
            ]
          },
          {
            name: 'Optimization Engine',
            description: 'Running Monte Carlo simulations and portfolio optimization',
            status: 'queued',
            icon: 'fa-solid fa-cogs',
            metrics: []
          },
          {
            name: 'Execution',
            description: 'Generating trade recommendations and execution orders',
            status: 'queued',
            icon: 'fa-solid fa-bolt',
            metrics: []
          }
        ]
      },
      
      marketPredictions: [
        {
          id: 1,
          symbol: 'AAPL',
          direction: 'up',
          targetPrice: 198.50,
          confidenceLevel: 87,
          confidence: 'high',
          reasoning: 'Strong earnings momentum and positive technical indicators suggest upward movement'
        },
        {
          id: 2,
          symbol: 'TSLA',
          direction: 'down',
          targetPrice: 185.20,
          confidenceLevel: 72,
          confidence: 'medium',
          reasoning: 'Overvaluation concerns and regulatory headwinds may pressure stock price'
        }
      ],
      
      riskFactors: [
        { name: 'Market Risk', level: 35 },
        { name: 'Credit Risk', level: 18 },
        { name: 'Liquidity Risk', level: 12 },
        { name: 'Operational Risk', level: 8 }
      ],
      
      botStats: {
        totalTrades: 1247,
        winRate: 73.2,
        dailyPnL: 2847.50
      },
      
      activePositions: [
        {
          symbol: 'NVDA',
          action: 'long',
          quantity: 100,
          entryPrice: 875.20,
          pnl: 2340.00
        },
        {
          symbol: 'AAPL',
          action: 'long',
          quantity: 200,
          entryPrice: 193.45,
          pnl: -578.00
        }
      ],
      
      aiInsights: [
        {
          id: 1,
          source: 'Market Sentiment Engine',
          title: 'Bullish Momentum in Tech Sector',
          description: 'AI analysis of social media sentiment and news flow indicates strong bullish momentum in technology stocks, with 78% positive sentiment score.',
          priority: 'high',
          icon: 'fa-solid fa-chart-line',
          timestamp: Date.now() - 300000,
          confidence: 89,
          actions: [
            { type: 'adjust-allocation', label: 'Increase Tech Allocation' },
            { type: 'create-alert', label: 'Set Price Alert' }
          ]
        },
        {
          id: 2,
          source: 'Risk Management AI',
          title: 'Portfolio Concentration Alert',
          description: 'Your portfolio shows high concentration in growth stocks (65%). Consider rebalancing to maintain optimal risk-adjusted returns.',
          priority: 'medium',
          icon: 'fa-solid fa-exclamation-triangle',
          timestamp: Date.now() - 600000,
          confidence: 94,
          actions: [
            { type: 'rebalance', label: 'Auto Rebalance' },
            { type: 'suggest-alternatives', label: 'View Alternatives' }
          ]
        }
      ]
    };
  },
  
  mounted() {
    this.initializeCharts();
    this.startRealTimeUpdates();
  },
  
  methods: {
    toggleOrchestrator() {
      this.orchestratorActive = !this.orchestratorActive;
      if (this.orchestratorActive) {
        this.startAgentProcessing();
      }
    },
    
    startAgentProcessing() {
      // Simulate agent processing
      setInterval(() => {
        this.aiAgents.forEach(agent => {
          if (Math.random() > 0.7) {
            agent.processing = !agent.processing;
          }
        });
      }, 3000);
    },
    
    selectAgent(agentId) {
      console.log('Selected agent:', agentId);
      // Implementation for agent selection
    },
    
    loadWorkflowTemplate() {
      // Load different workflow templates based on selection
      console.log('Loading workflow:', this.selectedWorkflowType);
    },
    
    createNewWorkflow() {
      console.log('Creating new workflow');
    },
    
    editStep(stepIndex) {
      console.log('Editing step:', stepIndex);
    },
    
    toggleTradingBot() {
      this.tradingBotActive = !this.tradingBotActive;
      if (this.tradingBotActive) {
        this.startTradingSimulation();
      }
    },
    
    startTradingSimulation() {
      // Simulate trading bot activity
      setInterval(() => {
        if (this.tradingBotActive) {
          this.botStats.dailyPnL += (Math.random() - 0.5) * 100;
          this.botStats.totalTrades += Math.random() > 0.8 ? 1 : 0;
        }
      }, 5000);
    },
    
    refreshInsights() {
      console.log('Refreshing AI insights');
      // Simulate new insights generation
    },
    
    executeInsightAction(action) {
      console.log('Executing action:', action);
    },
    
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },
    
    initializeCharts() {
      this.$nextTick(() => {
        if (this.$refs.performanceChart) {
          this.drawPerformanceChart();
        }
      });
    },
    
    drawPerformanceChart() {
      const canvas = this.$refs.performanceChart;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw performance chart
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      // Sample data points
      const points = [
        {x: 50, y: 150}, {x: 100, y: 120}, {x: 150, y: 100},
        {x: 200, y: 80}, {x: 250, y: 60}, {x: 300, y: 40},
        {x: 350, y: 30}
      ];
      
      points.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      
      ctx.stroke();
    },
    
    startRealTimeUpdates() {
      // Update metrics in real-time
      setInterval(() => {
        this.accuracy = 94 + Math.random() * 2;
        this.avgResponseTime = 120 + Math.random() * 20;
        this.riskScore = 20 + Math.random() * 10;
        this.riskGaugeAngle = (this.riskScore / 100) * 180;
      }, 2000);
    }
  }
};
</script>

<style scoped>
.ai-breakthrough-workflows {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  font-family: 'Inter', 'Roboto', sans-serif;
  padding: 2rem;
}

.header-section {
  margin-bottom: 3rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.title-section {
  flex: 1;
}

.main-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #00ff88, #0099ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.brain-icon {
  font-size: 2.5rem;
  color: #00ff88;
}

.subtitle {
  font-size: 1.2rem;
  color: #888;
  margin: 0;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #00ff88;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.orchestrator-section, .workflow-designer, .analytics-dashboard, 
.trading-bot-section, .insights-feed {
  max-width: 1400px;
  margin: 0 auto 3rem auto;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
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
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.orchestrator-btn, .create-btn, .bot-toggle, .refresh-btn {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.orchestrator-btn:hover, .create-btn:hover, .bot-toggle:hover, .refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 255, 136, 0.3);
}

.orchestrator-btn.active, .bot-toggle.active {
  background: linear-gradient(135deg, #ff4757, #ff3742);
}

.agent-network {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.agent-node {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.agent-node:hover {
  transform: translateY(-4px);
  border-color: #00ff88;
  box-shadow: 0 8px 25px rgba(0, 255, 136, 0.2);
}

.agent-node.processing {
  border-color: #0099ff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.agent-avatar {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.agent-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #333;
  background: #333;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: absolute;
  bottom: 0;
  right: -4px;
  border: 2px solid #1a1a1a;
}

.status-indicator.active {
  background: #00ff88;
}

.status-indicator.standby {
  background: #ffa500;
}

.agent-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #fff;
}

.agent-info p {
  margin: 0 0 1rem 0;
  color: #aaa;
  font-size: 0.9rem;
}

.agent-metrics {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #888;
}

.processing-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 153, 255, 0.3);
  border-top: 2px solid #0099ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.workflow-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.workflow-controls select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #fff;
  font-size: 0.9rem;
}

.workflow-canvas {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 2rem;
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workflow-step {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.workflow-step.completed {
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.1);
}

.workflow-step.processing {
  border-color: #0099ff;
  background: rgba(0, 153, 255, 0.1);
  animation: pulse 2s infinite;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.step-status {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.step-status.completed {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.step-status.processing {
  background: rgba(0, 153, 255, 0.2);
  color: #0099ff;
}

.step-status.queued {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
}

.step-connector {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  color: #555;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.analytics-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.analytics-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #fff;
}

.performance-chart {
  margin-bottom: 1rem;
}

.performance-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.performance-stats .stat {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.risk-gauge {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.gauge-container {
  position: relative;
  width: 150px;
  height: 150px;
}

.gauge-circle {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 8px solid rgba(255, 255, 255, 0.1);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gauge-center {
  text-align: center;
}

.risk-score {
  font-size: 2rem;
  font-weight: 700;
  color: #00ff88;
  display: block;
}

.risk-label {
  font-size: 0.8rem;
  color: #aaa;
}

.risk-factors {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.risk-factor {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 1rem;
  align-items: center;
}

.factor-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.factor-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #0099ff);
  transition: width 0.5s ease;
}

.prediction-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prediction-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
}

.prediction-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.symbol {
  font-weight: 700;
  color: #fff;
}

.confidence {
  font-size: 0.9rem;
  color: #00ff88;
}

.prediction-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.direction.up {
  color: #00ff88;
  font-weight: 600;
}

.direction.down {
  color: #ff4757;
  font-weight: 600;
}

.prediction-reasoning {
  font-size: 0.9rem;
  color: #aaa;
  line-height: 1.4;
}

.bot-dashboard {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.status-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
}

.status-indicator.active {
  color: #00ff88;
  font-weight: 700;
}

.status-indicator.inactive {
  color: #888;
  font-weight: 700;
}

.bot-metrics {
  margin-top: 1rem;
}

.bot-metrics .metric {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.positive {
  color: #00ff88;
}

.negative {
  color: #ff4757;
}

.active-positions {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
}

.positions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.position-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 1rem;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.action.long {
  color: #00ff88;
  font-weight: 600;
}

.action.short {
  color: #ff4757;
  font-weight: 600;
}

.position-details {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #aaa;
}

.insights-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.insight-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.insight-card:hover {
  transform: translateY(-2px);
  border-color: #00ff88;
}

.insight-card.high {
  border-left: 4px solid #ff4757;
}

.insight-card.medium {
  border-left: 4px solid #ffa500;
}

.insight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.insight-source {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
}

.insight-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.insight-priority.high {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.insight-priority.medium {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
}

.insight-content h4 {
  margin: 0 0 0.5rem 0;
  color: #fff;
}

.insight-content p {
  margin: 0 0 1rem 0;
  color: #ccc;
  line-height: 1.4;
}

.insight-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.action-btn {
  background: rgba(0, 255, 136, 0.2);
  border: 1px solid #00ff88;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  color: #00ff88;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #00ff88;
  color: #000;
}

.insight-confidence {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #aaa;
}

.confidence-bar {
  width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4757, #ffa500, #00ff88);
  transition: width 0.3s ease;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    gap: 2rem;
  }
  
  .stats-overview {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .bot-dashboard {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ai-breakthrough-workflows {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .agent-network {
    grid-template-columns: 1fr;
  }
  
  .insights-container {
    grid-template-columns: 1fr;
  }
}
</style> 