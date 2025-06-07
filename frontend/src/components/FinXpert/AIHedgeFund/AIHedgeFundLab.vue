<template>
  <div class="ai-hedge-fund-lab">
    <!-- Header -->
    <div class="lab-header">
      <div class="header-left">
        <h1>AI Hedge Fund Lab</h1>
        <div class="universe-selector">
          <select v-model="selectedUniverse" class="universe-select">
            <option value="sp500">S&P 500</option>
            <option value="nasdaq100">NASDAQ 100</option>
            <option value="custom">Custom Watchlist</option>
          </select>
        </div>
      </div>
      <div class="header-right">
        <div class="market-time">
          <span class="status-dot open"></span>
          <span>Market Open</span>
          <span class="time">{{ currentTime }}</span>
        </div>
        <button @click="startSimulation" class="start-simulation-btn">
          <font-awesome-icon icon="fa-solid fa-play" />
          Start Simulation
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="lab-content">
      <!-- Sidebar -->
      <div class="lab-sidebar">
        <div class="sidebar-section">
          <h3>Agent Roster</h3>
          <div class="agent-grid">
            <div 
              v-for="agent in agents" 
              :key="agent.id"
              :class="['agent-card', { active: agent.selected }]"
              @click="toggleAgent(agent.id)"
            >
              <img :src="agent.avatar" :alt="agent.name" class="agent-avatar" />
              <div class="agent-name">{{ agent.name }}</div>
              <div :class="['agent-pnl', agent.pnl >= 0 ? 'positive' : 'negative']">
                {{ agent.pnl >= 0 ? '+' : '' }}{{ agent.pnl.toFixed(2) }}%
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Market Overview</h3>
          <div class="market-stats">
            <div class="stat-item">
              <span class="label">S&P 500</span>
              <span class="value positive">+0.85%</span>
            </div>
            <div class="stat-item">
              <span class="label">VIX</span>
              <span class="value">16.4</span>
            </div>
            <div class="stat-item">
              <span class="label">DXY</span>
              <span class="value negative">-0.12%</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3>Portfolio</h3>
          <div class="portfolio-summary">
            <div class="portfolio-value">
              <span class="label">Total Value</span>
              <span class="value">$2,847,392</span>
            </div>
            <div class="portfolio-pnl">
              <span class="label">Today's P&L</span>
              <span class="value positive">+$24,382 (+0.86%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Canvas -->
      <div class="main-canvas">
        <!-- Signal Matrix -->
        <div class="panel signal-matrix-panel">
          <div class="panel-header">
            <h3>Agent Signal Matrix</h3>
            <div class="matrix-controls">
              <button @click="refreshSignals" class="refresh-btn">
                <font-awesome-icon icon="fa-solid fa-sync-alt" />
                Refresh
              </button>
            </div>
          </div>
          <div class="signal-matrix">
            <div class="matrix-header">
              <div class="agent-col">Agent</div>
              <div v-for="ticker in topTickers" :key="ticker" class="ticker-col">{{ ticker }}</div>
            </div>
            <div v-for="agent in selectedAgents" :key="agent.id" class="matrix-row">
              <div class="agent-cell">
                <img :src="agent.avatar" :alt="agent.name" class="mini-avatar" />
                <span>{{ agent.shortName }}</span>
              </div>
              <div v-for="ticker in topTickers" :key="ticker" class="signal-cell">
                <div :class="['signal', getSignal(agent.id, ticker).type]">
                  {{ getSignal(agent.id, ticker).label }}
                </div>
                <div class="confidence">{{ getSignal(agent.id, ticker).confidence }}%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Consensus & Trade Execution -->
        <div class="panel-row">
          <div class="panel consensus-panel">
            <div class="panel-header">
              <h3>Consensus Analysis</h3>
            </div>
            <div class="consensus-content">
              <div v-for="ticker in topTickers" :key="ticker" class="consensus-item">
                <div class="ticker-header">
                  <span class="ticker">{{ ticker }}</span>
                  <span class="price">${{ getTickerPrice(ticker) }}</span>
                </div>
                <div class="consensus-bar">
                  <div class="buy-section" :style="{ width: getConsensus(ticker).buy + '%' }">
                    {{ getConsensus(ticker).buy }}%
                  </div>
                  <div class="hold-section" :style="{ width: getConsensus(ticker).hold + '%' }">
                    {{ getConsensus(ticker).hold }}%
                  </div>
                  <div class="sell-section" :style="{ width: getConsensus(ticker).sell + '%' }">
                    {{ getConsensus(ticker).sell }}%
                  </div>
                </div>
                <div class="target-price">
                  Target: ${{ getConsensus(ticker).targetPrice }}
                  <span :class="['upside', getConsensus(ticker).upside >= 0 ? 'positive' : 'negative']">
                    ({{ getConsensus(ticker).upside >= 0 ? '+' : '' }}{{ getConsensus(ticker).upside }}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="panel trade-execution-panel">
            <div class="panel-header">
              <h3>Smart Trade Execution</h3>
              <div class="execution-controls">
                <div class="execution-mode">
                  <label>Mode:</label>
                  <select v-model="executionMode" class="mode-select">
                    <option value="conservative">Conservative</option>
                    <option value="balanced">Balanced</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
                <button @click="executeAllTrades" class="execute-btn" :disabled="!hasValidTrades">
                  <font-awesome-icon icon="fa-solid fa-bolt" />
                  Execute All ({{ validTradesCount }})
                </button>
              </div>
            </div>
            <div class="proposed-trades">
              <div v-for="trade in proposedTrades" :key="trade.id" 
                   :class="['trade-item', `trade-${trade.action.toLowerCase()}`]">
                <div class="trade-main">
                  <div class="trade-symbol">
                    <span class="ticker">{{ trade.symbol }}</span>
                    <span class="price">${{ trade.price.toFixed(2) }}</span>
                  </div>
                  <div class="trade-action">
                    <span :class="['action-badge', trade.action.toLowerCase()]">
                      {{ trade.action }}
                    </span>
                    <span class="quantity">{{ trade.quantity }} shares</span>
                  </div>
                  <div class="trade-confidence">
                    <div class="confidence-bar">
                      <div class="confidence-fill" :style="{ width: trade.confidence + '%' }"></div>
                    </div>
                    <span class="confidence-text">{{ trade.confidence }}%</span>
                  </div>
                  <div class="trade-controls">
                    <button @click="editTrade(trade.id)" class="edit-btn">
                      <font-awesome-icon icon="fa-solid fa-edit" />
                    </button>
                    <button @click="removeTrade(trade.id)" class="remove-btn">
                      <font-awesome-icon icon="fa-solid fa-times" />
                    </button>
                  </div>
                </div>
                <div class="trade-reasoning" v-if="trade.reasoning">
                  <div class="reasoning-text">{{ trade.reasoning }}</div>
                  <div class="risk-metrics">
                    <span class="risk-item">VaR: {{ trade.var }}%</span>
                    <span class="risk-item">Sharpe: {{ trade.sharpe }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Analytics Panel -->
        <div class="panel performance-panel">
          <div class="panel-header">
            <h3>Live Performance Analytics</h3>
            <div class="performance-controls">
              <select v-model="performancePeriod" @change="updatePerformanceChart">
                <option value="1D">1 Day</option>
                <option value="1W">1 Week</option>
                <option value="1M">1 Month</option>
                <option value="3M">3 Months</option>
                <option value="1Y">1 Year</option>
              </select>
            </div>
          </div>
          <div class="performance-content">
            <div class="performance-metrics">
              <div class="metric-card">
                <div class="metric-value positive">{{ portfolioReturn }}%</div>
                <div class="metric-label">Portfolio Return</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">{{ sharpeRatio }}</div>
                <div class="metric-label">Sharpe Ratio</div>
              </div>
              <div class="metric-card">
                <div class="metric-value negative">{{ maxDrawdown }}%</div>
                <div class="metric-label">Max Drawdown</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">{{ winRate }}%</div>
                <div class="metric-label">Win Rate</div>
              </div>
            </div>
            <div class="performance-chart">
              <canvas ref="performanceChart" width="600" height="300"></canvas>
            </div>
          </div>
        </div>

        <!-- Risk Management Panel -->
        <div class="panel risk-panel">
          <div class="panel-header">
            <h3>Advanced Risk Management</h3>
            <div class="risk-status" :class="riskLevel">
              <span class="risk-dot"></span>
              <span>{{ riskLevel.toUpperCase() }} RISK</span>
            </div>
          </div>
          <div class="risk-content">
            <div class="risk-gauge">
              <div class="gauge-container">
                <div class="gauge-arc">
                  <div class="gauge-needle" :style="{ transform: `rotate(${riskAngle}deg)` }"></div>
                </div>
                <div class="gauge-center">
                  <div class="gauge-value">{{ portfolioRisk }}</div>
                  <div class="gauge-label">VaR 95%</div>
                </div>
              </div>
            </div>
            <div class="risk-breakdown">
              <div v-for="risk in riskFactors" :key="risk.name" class="risk-factor">
                <div class="factor-info">
                  <span class="factor-name">{{ risk.name }}</span>
                  <span class="factor-value">{{ risk.value }}%</span>
                </div>
                <div class="factor-bar">
                  <div class="factor-fill" :style="{ 
                    width: risk.value + '%',
                    backgroundColor: getRiskColor(risk.value)
                  }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Market Intelligence Panel -->
        <div class="panel intelligence-panel">
          <div class="panel-header">
            <h3>Market Intelligence Feed</h3>
            <div class="intelligence-filters">
              <button v-for="filter in intelligenceFilters" :key="filter"
                      :class="['filter-btn', { active: activeFilter === filter }]"
                      @click="activeFilter = filter">
                {{ filter }}
              </button>
            </div>
          </div>
          <div class="intelligence-feed">
            <div v-for="intel in filteredIntelligence" :key="intel.id" 
                 :class="['intel-item', intel.priority]">
              <div class="intel-header">
                <div class="intel-source">{{ intel.source }}</div>
                <div class="intel-time">{{ formatTime(intel.timestamp) }}</div>
                <div :class="['intel-priority', intel.priority]">{{ intel.priority }}</div>
              </div>
              <div class="intel-content">{{ intel.content }}</div>
              <div class="intel-impact" v-if="intel.impact">
                <span class="impact-label">Market Impact:</span>
                <span :class="['impact-value', intel.impact.type]">
                  {{ intel.impact.magnitude }}% {{ intel.impact.direction }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Agent Modal -->
    <div v-if="selectedAgentModal" class="modal-overlay" @click="selectedAgentModal = null">
      <div class="agent-modal enhanced-modal" @click.stop>
        <div class="modal-header">
          <div class="agent-info">
            <img :src="selectedAgentModal.avatar" :alt="selectedAgentModal.name" class="modal-avatar" />
            <div>
              <h3>{{ selectedAgentModal.name }}</h3>
              <p>{{ selectedAgentModal.style }}</p>
              <div class="agent-stats">
                <span class="stat">YTD: {{ selectedAgentModal.ytdReturn }}%</span>
                <span class="stat">Win Rate: {{ selectedAgentModal.winRate }}%</span>
                <span class="stat">Avg Hold: {{ selectedAgentModal.avgHold }}d</span>
              </div>
            </div>
          </div>
          <button @click="selectedAgentModal = null" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        
        <div class="modal-tabs">
          <button v-for="tab in modalTabs" :key="tab"
                  :class="['tab-btn', { active: activeModalTab === tab }]"
                  @click="activeModalTab = tab">
            {{ tab }}
          </button>
        </div>
        
        <div class="modal-content">
          <!-- Analysis Tab -->
          <div v-if="activeModalTab === 'Analysis'" class="tab-content">
            <h4>Current Market Analysis</h4>
            <p>{{ selectedAgentModal.analysis }}</p>
            
            <h4>Investment Philosophy</h4>
            <p>{{ selectedAgentModal.philosophy }}</p>
            
            <h4>Key Positions</h4>
            <div class="positions-list">
              <div v-for="position in selectedAgentModal.positions" :key="position.symbol" class="position-item">
                <span class="symbol">{{ position.symbol }}</span>
                <span :class="['action', position.action.toLowerCase()]">{{ position.action }}</span>
                <span class="conviction">{{ position.conviction }}% conviction</span>
                <span class="allocation">{{ position.allocation }}% portfolio</span>
              </div>
            </div>
          </div>
          
          <!-- Performance Tab -->
          <div v-if="activeModalTab === 'Performance'" class="tab-content">
            <div class="performance-grid">
              <div class="perf-metric">
                <div class="perf-value">{{ selectedAgentModal.ytdReturn }}%</div>
                <div class="perf-label">YTD Return</div>
              </div>
              <div class="perf-metric">
                <div class="perf-value">{{ selectedAgentModal.winRate }}%</div>
                <div class="perf-label">Win Rate</div>
              </div>
              <div class="perf-metric">
                <div class="perf-value">{{ selectedAgentModal.sharpe }}</div>
                <div class="perf-label">Sharpe Ratio</div>
              </div>
              <div class="perf-metric">
                <div class="perf-value">{{ selectedAgentModal.maxDrawdown }}%</div>
                <div class="perf-label">Max Drawdown</div>
              </div>
            </div>
            
            <h4>Historical Performance</h4>
            <div class="performance-chart-modal">
              <canvas ref="agentPerformanceChart" width="500" height="250"></canvas>
            </div>
          </div>
          
          <!-- Insights Tab -->
          <div v-if="activeModalTab === 'Insights'" class="tab-content">
            <h4>Recent Insights</h4>
            <div class="insights-list">
              <div v-for="insight in selectedAgentModal.insights" :key="insight.id" class="insight-item">
                <div class="insight-date">{{ formatDate(insight.date) }}</div>
                <div class="insight-content">{{ insight.content }}</div>
                <div class="insight-impact">
                  <span>Impact: </span>
                  <span :class="insight.impact.type">{{ insight.impact.value }}%</span>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faPlay, faSyncAlt, faTimes
} from '@fortawesome/free-solid-svg-icons';

library.add(faPlay, faSyncAlt, faTimes);

export default {
  name: 'AIHedgeFundLab',
  components: { FontAwesomeIcon },
  data() {
    return {
      selectedUniverse: 'nasdaq100',
      selectedPeriod: '1M',
      selectedAgentModal: null,
      riskLevel: 'green',
      currentTime: '',
      
      chartPeriods: ['1D', '1W', '1M', '3M', '1Y'],
      topTickers: ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'],
      
      agents: [
        {
          id: 1,
          name: 'Warren Buffett',
          shortName: 'Buffett',
          avatar: '/agents/buffett.png',
          style: 'Value Investing',
          selected: true,
          pnl: 2.3,
          analysis: 'Focus on undervalued companies with strong moats and long-term prospects.',
          philosophy: 'Buy wonderful companies at fair prices and hold forever. Focus on business fundamentals, not market sentiment.',
          positions: [
            { symbol: 'AAPL', action: 'HOLD', conviction: 85, allocation: 25.5 },
            { symbol: 'KO', action: 'BUY', conviction: 90, allocation: 15.2 }
          ],
          ytdReturn: 12.4,
          winRate: 78,
          avgHold: 180,
          sharpe: 1.89,
          maxDrawdown: -8.3,
          insights: [
            {
              id: 1,
              date: Date.now() - 86400000,
              content: 'Technology companies showing strong competitive moats despite valuation concerns',
              impact: { type: 'positive', value: 3.2 }
            }
          ]
        },
        {
          id: 2,
          name: 'Stanley Druckenmiller',
          shortName: 'Druck',
          avatar: '/agents/druckenmiller.png',
          style: 'Macro Trading',
          selected: true,
          pnl: 4.1,
          analysis: 'Bullish on tech growth but watching for macro headwinds.',
          positions: [
            { symbol: 'NVDA', action: 'BUY', conviction: 80 },
            { symbol: 'QQQ', action: 'BUY', conviction: 75 }
          ],
          ytdReturn: 18.7,
          winRate: 65,
          avgHold: 45
        },
        {
          id: 3,
          name: 'Cathie Wood',
          shortName: 'Wood',
          avatar: '/agents/cathie.png',
          style: 'Innovation Growth',
          selected: true,
          pnl: -1.2,
          analysis: 'Betting on disruptive innovation despite recent volatility.',
          positions: [
            { symbol: 'TSLA', action: 'BUY', conviction: 95 },
            { symbol: 'ROKU', action: 'BUY', conviction: 70 }
          ],
          ytdReturn: 8.3,
          winRate: 58,
          avgHold: 120
        },
        {
          id: 4,
          name: 'Ray Dalio',
          shortName: 'Dalio',
          avatar: '/agents/dalio.png',
          style: 'All Weather',
          selected: false,
          pnl: 1.1,
          analysis: 'Diversified approach across asset classes with risk parity.',
          positions: [],
          ytdReturn: 6.8,
          winRate: 72,
          avgHold: 90
        }
        // Add more agents as needed
      ],
      
      proposedTrades: [
        { 
          id: 1, 
          symbol: 'NVDA', 
          action: 'BUY', 
          quantity: 100, 
          price: 875.20, 
          confidence: 89,
          reasoning: 'Strong AI momentum and data center growth. Multiple agents consensus.',
          var: 15.2,
          sharpe: 2.1,
          status: 'Pending' 
        },
        { 
          id: 2, 
          symbol: 'AAPL', 
          action: 'HOLD', 
          quantity: 200, 
          price: 193.45,
          confidence: 76,
          reasoning: 'Stable fundamentals but limited near-term catalysts.',
          var: 8.9,
          sharpe: 1.4,
          status: 'Active' 
        }
      ],
      
      // New enhanced data
      executionMode: 'balanced',
      performancePeriod: '1M',
      activeModalTab: 'Analysis',
      activeFilter: 'All',
      
      modalTabs: ['Analysis', 'Performance', 'Insights'],
      intelligenceFilters: ['All', 'Critical', 'Market', 'Economic', 'Company'],
      
      portfolioReturn: 8.45,
      sharpeRatio: 1.67,
      maxDrawdown: -4.2,
      winRate: 73,
      portfolioRisk: 12.5,
      riskAngle: 45, // degrees for gauge needle
      
      riskFactors: [
        { name: 'Market Risk', value: 35 },
        { name: 'Sector Concentration', value: 22 },
        { name: 'Currency Risk', value: 8 },
        { name: 'Liquidity Risk', value: 15 },
        { name: 'Credit Risk', value: 12 }
      ],
      
      marketIntelligence: [
        {
          id: 1,
          source: 'Fed Reserve',
          content: 'FOMC minutes suggest potential pause in rate hikes amid inflation cooling',
          priority: 'critical',
          timestamp: Date.now() - 300000,
          impact: { type: 'positive', direction: 'up', magnitude: 2.3 }
        },
        {
          id: 2,
          source: 'Goldman Sachs',
          content: 'Upgraded NVDA to Buy on AI growth momentum and data center demand',
          priority: 'high',
          timestamp: Date.now() - 600000,
          impact: { type: 'positive', direction: 'up', magnitude: 1.8 }
        },
        {
          id: 3,
          source: 'Economic Data',
          content: 'Q3 GDP revised higher to 4.9% annualized growth rate',
          priority: 'medium',
          timestamp: Date.now() - 900000,
          impact: { type: 'positive', direction: 'up', magnitude: 0.9 }
        }
      ]
    };
  },
  
  computed: {
    selectedAgents() {
      return this.agents.filter(agent => agent.selected);
    },
    
    hasValidTrades() {
      return this.proposedTrades.some(trade => trade.confidence >= 70);
    },
    
    validTradesCount() {
      return this.proposedTrades.filter(trade => trade.confidence >= 70).length;
    },
    
    filteredIntelligence() {
      if (this.activeFilter === 'All') return this.marketIntelligence;
      return this.marketIntelligence.filter(intel => 
        intel.priority === this.activeFilter.toLowerCase()
      );
    }
  },
  
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
    this.drawPerformanceChart();
  },
  
  methods: {
    updateTime() {
      this.currentTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
      }).format(new Date());
    },
    
    toggleAgent(agentId) {
      const agent = this.agents.find(a => a.id === agentId);
      if (agent) {
        agent.selected = !agent.selected;
      }
    },
    
    startSimulation() {
      console.log('Starting simulation with selected agents:', this.selectedAgents);
    },
    
    refreshSignals() {
      console.log('Refreshing signals...');
    },
    
    executeAllTrades() {
      const validTrades = this.proposedTrades.filter(trade => trade.confidence >= 70);
      console.log('Executing trades:', validTrades);
      // Execute trade logic here
      this.$emit('trades-executed', validTrades);
    },
    
    editTrade(tradeId) {
      console.log('Editing trade:', tradeId);
      // Open trade editing modal
    },
    
    removeTrade(tradeId) {
      this.proposedTrades = this.proposedTrades.filter(trade => trade.id !== tradeId);
    },
    
    getSignal(agentId, ticker) {
      // Mock signal data
      const signals = ['BUY', 'SELL', 'HOLD'];
      const signal = signals[Math.floor(Math.random() * signals.length)];
      const confidence = Math.floor(Math.random() * 40 + 60);
      
      return {
        type: signal.toLowerCase(),
        label: signal,
        confidence
      };
    },
    
    getTickerPrice(ticker) {
      const prices = {
        'AAPL': '193.45',
        'MSFT': '420.30',
        'NVDA': '875.20',
        'GOOGL': '148.25',
        'AMZN': '155.80'
      };
      return prices[ticker] || '100.00';
    },
    
    getConsensus(ticker) {
      // Mock consensus data
      return {
        buy: Math.floor(Math.random() * 40 + 30),
        hold: Math.floor(Math.random() * 30 + 20),
        sell: Math.floor(Math.random() * 30 + 10),
        targetPrice: (parseFloat(this.getTickerPrice(ticker)) * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2),
        upside: (Math.random() * 20 - 5).toFixed(1)
      };
    },
    
    drawPerformanceChart() {
      this.$nextTick(() => {
        if (!this.$refs.performanceChart) return;
        
        const canvas = this.$refs.performanceChart;
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Mock performance data
        const data = [];
        let value = 100;
        for (let i = 0; i < 30; i++) {
          value += (Math.random() - 0.48) * 2;
          data.push(value);
        }
        
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;
        
        const minValue = Math.min(...data) * 0.99;
        const maxValue = Math.max(...data) * 1.01;
        const valueRange = maxValue - minValue;
        
        // Draw performance line
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((value, index) => {
          const x = padding + (index / (data.length - 1)) * chartWidth;
          const y = canvas.height - padding - ((value - minValue) / valueRange) * chartHeight;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
        
        // Draw benchmark line
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding - chartHeight / 2);
        ctx.lineTo(canvas.width - padding, canvas.height - padding - chartHeight / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    },
    
    getRiskColor(value) {
      if (value < 20) return '#00ff88';
      if (value < 50) return '#ffa500';
      return '#ff4444';
    },
    
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString();
    },
    
    updatePerformanceChart() {
      // Update chart based on selected period
      this.drawPerformanceChart();
    }
  }
};
</script>

<style scoped>
.ai-hedge-fund-lab {
  min-height: 100vh;
  background: #0d1117;
  color: #c9d1d9;
  font-family: 'Monaco', 'Menlo', monospace;
}

.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.lab-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f0f6fc;
}

.universe-select {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.market-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.open {
  background: #00ff88;
}

.start-simulation-btn {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.start-simulation-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
}

.lab-content {
  display: flex;
  height: calc(100vh - 80px);
}

.lab-sidebar {
  width: 300px;
  background: #161b22;
  border-right: 1px solid #30363d;
  padding: 1.5rem;
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: 2rem;
}

.sidebar-section h3 {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #7d8590;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.agent-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.agent-card {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}

.agent-card.active {
  border-color: #00ff88;
  background: #1a2f1a;
}

.agent-card:hover {
  border-color: #58a6ff;
}

.agent-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  background: #30363d;
}

.agent-name {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.agent-pnl {
  font-size: 0.75rem;
  font-weight: 700;
}

.agent-pnl.positive {
  color: #00ff88;
}

.agent-pnl.negative {
  color: #ff4757;
}

.market-stats {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #30363d;
}

.stat-item .label {
  font-size: 0.8rem;
  color: #7d8590;
}

.stat-item .value {
  font-weight: 700;
  font-size: 0.9rem;
}

.stat-item .value.positive {
  color: #00ff88;
}

.stat-item .value.negative {
  color: #ff4757;
}

.portfolio-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.portfolio-value, .portfolio-pnl {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.portfolio-value .label, .portfolio-pnl .label {
  font-size: 0.8rem;
  color: #7d8590;
}

.portfolio-value .value, .portfolio-pnl .value {
  font-weight: 700;
  font-size: 1.1rem;
}

.portfolio-pnl .value.positive {
  color: #00ff88;
}

.main-canvas {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #21262d;
  border-bottom: 1px solid #30363d;
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #f0f6fc;
}

.panel-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.signal-matrix-panel {
  margin-bottom: 1.5rem;
}

.signal-matrix {
  padding: 1.5rem;
}

.matrix-header {
  display: grid;
  grid-template-columns: 120px repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #7d8590;
  font-size: 0.8rem;
}

.matrix-row {
  display: grid;
  grid-template-columns: 120px repeat(5, 1fr);
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #30363d;
}

.agent-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.mini-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #30363d;
}

.signal-cell {
  text-align: center;
}

.signal {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.signal.buy {
  background: #1a4d3a;
  color: #00ff88;
}

.signal.sell {
  background: #4d1a1a;
  color: #ff4757;
}

.signal.hold {
  background: #30363d;
  color: #7d8590;
}

.confidence {
  font-size: 0.7rem;
  color: #7d8590;
}

.consensus-content {
  padding: 1.5rem;
}

.consensus-item {
  margin-bottom: 1.5rem;
}

.ticker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ticker {
  font-weight: 700;
  color: #f0f6fc;
}

.price {
  font-weight: 600;
  color: #c9d1d9;
}

.consensus-bar {
  display: flex;
  height: 20px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.buy-section {
  background: #00ff88;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.hold-section {
  background: #7d8590;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.sell-section {
  background: #ff4757;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

.target-price {
  font-size: 0.9rem;
  color: #c9d1d9;
}

.upside.positive {
  color: #00ff88;
}

.upside.negative {
  color: #ff4757;
}

.trade-execution-panel {
  margin-bottom: 1rem;
}

.execution-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.execution-mode {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.mode-select {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  color: #c9d1d9;
  font-size: 0.8rem;
}

.execute-btn {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.execute-btn:disabled {
  background: #30363d;
  color: #7d8590;
  cursor: not-allowed;
}

.proposed-trades {
  max-height: 400px;
  overflow-y: auto;
}

.trade-item {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.trade-item:hover {
  border-color: #58a6ff;
}

.trade-item.trade-buy {
  border-left: 4px solid #00ff88;
}

.trade-item.trade-sell {
  border-left: 4px solid #ff4444;
}

.trade-main {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 1rem;
  padding: 0.75rem;
  align-items: center;
}

.trade-symbol {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ticker {
  font-weight: 700;
  color: #f0f6fc;
}

.price {
  font-size: 0.8rem;
  color: #7d8590;
}

.action-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.action-badge.buy {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.action-badge.sell {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
}

.confidence-bar {
  width: 100px;
  height: 6px;
  background: #21262d;
  border-radius: 3px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4444, #ffa500, #00ff88);
  transition: width 0.3s ease;
}

.confidence-text {
  font-size: 0.8rem;
  color: #c9d1d9;
  margin-top: 0.25rem;
}

.trade-controls {
  display: flex;
  gap: 0.5rem;
}

.edit-btn, .remove-btn {
  background: none;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 0.25rem;
  color: #7d8590;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  border-color: #58a6ff;
  color: #58a6ff;
}

.remove-btn:hover {
  border-color: #ff4444;
  color: #ff4444;
}

.trade-reasoning {
  padding: 0.75rem;
  border-top: 1px solid #30363d;
  background: rgba(0, 0, 0, 0.2);
}

.reasoning-text {
  font-size: 0.9rem;
  color: #c9d1d9;
  margin-bottom: 0.5rem;
}

.risk-metrics {
  display: flex;
  gap: 1rem;
}

.risk-item {
  font-size: 0.8rem;
  color: #7d8590;
}

.performance-panel {
  margin-bottom: 1rem;
}

.performance-metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.metric-value.positive {
  color: #00ff88;
}

.metric-value.negative {
  color: #ff4444;
}

.metric-label {
  font-size: 0.8rem;
  color: #7d8590;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.performance-chart {
  background: #161b22;
  border-radius: 8px;
  padding: 1rem;
}

.risk-panel {
  margin-bottom: 1rem;
}

.risk-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.risk-status.green {
  color: #00ff88;
}

.risk-status.yellow {
  color: #ffa500;
}

.risk-status.red {
  color: #ff4444;
}

.risk-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.risk-content {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
}

.gauge-container {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 1rem auto;
}

.gauge-arc {
  width: 100%;
  height: 50%;
  border: 8px solid #30363d;
  border-bottom: none;
  border-radius: 75px 75px 0 0;
  position: relative;
}

.gauge-needle {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 2px;
  height: 70px;
  background: #ff4444;
  transform-origin: bottom;
  transition: transform 0.5s ease;
}

.gauge-center {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.gauge-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f0f6fc;
}

.gauge-label {
  font-size: 0.8rem;
  color: #7d8590;
}

.risk-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.risk-factor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.factor-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.factor-name {
  color: #c9d1d9;
}

.factor-value {
  color: #f0f6fc;
  font-weight: 600;
}

.factor-bar {
  height: 8px;
  background: #21262d;
  border-radius: 4px;
  overflow: hidden;
}

.factor-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.intelligence-panel {
  margin-bottom: 1rem;
}

.intelligence-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  background: none;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  color: #7d8590;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn.active {
  background: #58a6ff;
  border-color: #58a6ff;
  color: #fff;
}

.intelligence-feed {
  max-height: 400px;
  overflow-y: auto;
}

.intel-item {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.intel-item.critical {
  border-left: 4px solid #ff4444;
}

.intel-item.high {
  border-left: 4px solid #ffa500;
}

.intel-item.medium {
  border-left: 4px solid #58a6ff;
}

.intel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
}

.intel-source {
  font-weight: 600;
  color: #f0f6fc;
}

.intel-time {
  color: #7d8590;
}

.intel-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.intel-priority.critical {
  background: rgba(255, 68, 68, 0.2);
  color: #ff4444;
}

.intel-priority.high {
  background: rgba(255, 165, 0, 0.2);
  color: #ffa500;
}

.intel-priority.medium {
  background: rgba(88, 166, 255, 0.2);
  color: #58a6ff;
}

.intel-content {
  color: #c9d1d9;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.intel-impact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.impact-label {
  color: #7d8590;
}

.impact-value.positive {
  color: #00ff88;
}

.impact-value.negative {
  color: #ff4444;
}

.enhanced-modal {
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-tabs {
  display: flex;
  border-bottom: 1px solid #30363d;
}

.tab-btn {
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  color: #7d8590;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.tab-btn.active {
  color: #58a6ff;
  border-bottom-color: #58a6ff;
}

.tab-content {
  padding: 1.5rem;
  overflow-y: auto;
}

.agent-stats {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.stat {
  color: #7d8590;
}

.performance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.perf-metric {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
}

.perf-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.25rem;
}

.perf-label {
  font-size: 0.8rem;
  color: #7d8590;
  text-transform: uppercase;
}

.performance-chart-modal {
  background: #0d1117;
  border-radius: 8px;
  padding: 1rem;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.insight-item {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1rem;
}

.insight-date {
  font-size: 0.8rem;
  color: #7d8590;
  margin-bottom: 0.5rem;
}

.insight-content {
  color: #c9d1d9;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.insight-impact {
  font-size: 0.8rem;
}

.insight-impact .positive {
  color: #00ff88;
}

.insight-impact .negative {
  color: #ff4444;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .trade-main {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .performance-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .risk-content {
    grid-template-columns: 1fr;
  }
  
  .enhanced-modal {
    max-width: 95vw;
    margin: 0.5rem;
  }
  
  .performance-grid {
    grid-template-columns: 1fr;
  }
}
</style> 