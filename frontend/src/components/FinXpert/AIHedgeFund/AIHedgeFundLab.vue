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

          <div class="panel trade-blotter-panel">
            <div class="panel-header">
              <h3>Trade Blotter</h3>
              <button @click="executeAllTrades" class="execute-btn">Execute All</button>
            </div>
            <div class="trade-blotter">
              <div class="blotter-header">
                <div>Symbol</div>
                <div>Action</div>
                <div>Quantity</div>
                <div>Price</div>
                <div>Status</div>
              </div>
              <div v-for="trade in proposedTrades" :key="trade.id" class="blotter-row">
                <div class="symbol">{{ trade.symbol }}</div>
                <div :class="['action', trade.action.toLowerCase()]">{{ trade.action }}</div>
                <div class="quantity">{{ trade.quantity }}</div>
                <div class="price">${{ trade.price }}</div>
                <div :class="['status', trade.status.toLowerCase()]">{{ trade.status }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Risk & Performance -->
        <div class="panel-row">
          <div class="panel risk-panel">
            <div class="panel-header">
              <h3>Risk Dashboard</h3>
              <div :class="['risk-light', riskLevel]"></div>
            </div>
            <div class="risk-metrics">
              <div class="risk-item">
                <div class="metric-label">VaR (1 Day)</div>
                <div class="metric-value">$45,230</div>
                <div class="metric-change">2.1% of NAV</div>
              </div>
              <div class="risk-item">
                <div class="metric-label">Beta</div>
                <div class="metric-value">1.23</div>
                <div class="metric-change">vs S&P 500</div>
              </div>
              <div class="risk-item">
                <div class="metric-label">Max Drawdown</div>
                <div class="metric-value">-3.2%</div>
                <div class="metric-change">YTD</div>
              </div>
              <div class="risk-item">
                <div class="metric-label">Sharpe Ratio</div>
                <div class="metric-value">1.84</div>
                <div class="metric-change">12M</div>
              </div>
            </div>
          </div>

          <div class="panel performance-panel">
            <div class="panel-header">
              <h3>Performance Chart</h3>
              <div class="chart-controls">
                <button 
                  v-for="period in chartPeriods" 
                  :key="period"
                  @click="selectedPeriod = period"
                  :class="['period-btn', { active: selectedPeriod === period }]"
                >
                  {{ period }}
                </button>
              </div>
            </div>
            <div class="chart-container">
              <canvas ref="performanceChart" width="400" height="200"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Agent Analysis Modal -->
    <div v-if="selectedAgentModal" class="modal-overlay" @click="selectedAgentModal = null">
      <div class="agent-modal" @click.stop>
        <div class="modal-header">
          <div class="agent-info">
            <img :src="selectedAgentModal.avatar" :alt="selectedAgentModal.name" class="modal-avatar" />
            <div>
              <h3>{{ selectedAgentModal.name }}</h3>
              <p>{{ selectedAgentModal.style }}</p>
            </div>
          </div>
          <button @click="selectedAgentModal = null" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        <div class="modal-content">
          <div class="agent-analysis">
            <h4>Current Analysis</h4>
            <p>{{ selectedAgentModal.analysis }}</p>
            
            <h4>Key Positions</h4>
            <div class="positions-list">
              <div v-for="position in selectedAgentModal.positions" :key="position.symbol" class="position-item">
                <span class="symbol">{{ position.symbol }}</span>
                <span :class="['action', position.action.toLowerCase()]">{{ position.action }}</span>
                <span class="conviction">{{ position.conviction }}% conviction</span>
              </div>
            </div>
            
            <h4>Performance Metrics</h4>
            <div class="performance-metrics">
              <div class="metric">
                <span class="label">YTD Return:</span>
                <span :class="['value', selectedAgentModal.ytdReturn >= 0 ? 'positive' : 'negative']">
                  {{ selectedAgentModal.ytdReturn >= 0 ? '+' : '' }}{{ selectedAgentModal.ytdReturn }}%
                </span>
              </div>
              <div class="metric">
                <span class="label">Win Rate:</span>
                <span class="value">{{ selectedAgentModal.winRate }}%</span>
              </div>
              <div class="metric">
                <span class="label">Avg Hold:</span>
                <span class="value">{{ selectedAgentModal.avgHold }} days</span>
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
          positions: [
            { symbol: 'AAPL', action: 'HOLD', conviction: 85 },
            { symbol: 'KO', action: 'BUY', conviction: 90 }
          ],
          ytdReturn: 12.4,
          winRate: 78,
          avgHold: 180
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
        { id: 1, symbol: 'NVDA', action: 'BUY', quantity: 100, price: 875.20, status: 'Pending' },
        { id: 2, symbol: 'AAPL', action: 'HOLD', quantity: 0, price: 193.45, status: 'Active' },
        { id: 3, symbol: 'TSLA', action: 'BUY', quantity: 50, price: 248.50, status: 'Pending' }
      ]
    };
  },
  
  computed: {
    selectedAgents() {
      return this.agents.filter(agent => agent.selected);
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
      console.log('Executing all trades...');
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

.trade-blotter {
  padding: 1.5rem;
}

.blotter-header {
  display: grid;
  grid-template-columns: 1fr 80px 80px 80px 80px;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #30363d;
  font-weight: 600;
  color: #7d8590;
  font-size: 0.8rem;
}

.blotter-row {
  display: grid;
  grid-template-columns: 1fr 80px 80px 80px 80px;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid #30363d;
  align-items: center;
}

.action.buy {
  color: #00ff88;
}

.action.sell {
  color: #ff4757;
}

.action.hold {
  color: #7d8590;
}

.status.pending {
  color: #f0f6fc;
}

.status.active {
  color: #00ff88;
}

.risk-metrics {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.risk-item {
  text-align: center;
}

.metric-label {
  font-size: 0.8rem;
  color: #7d8590;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.25rem;
}

.metric-change {
  font-size: 0.75rem;
  color: #7d8590;
}

.risk-light {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.risk-light.green {
  background: #00ff88;
}

.risk-light.yellow {
  background: #ffcc00;
}

.risk-light.red {
  background: #ff4757;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.25rem 0.75rem;
  border: 1px solid #30363d;
  border-radius: 4px;
  background: transparent;
  color: #7d8590;
  cursor: pointer;
  font-size: 0.8rem;
}

.period-btn.active {
  background: #00ff88;
  color: #000;
  border-color: #00ff88;
}

.chart-container {
  padding: 1.5rem;
  text-align: center;
}

.chart-container canvas {
  background: #21262d;
  border-radius: 4px;
}

.refresh-btn, .execute-btn {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  color: #c9d1d9;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.execute-btn {
  background: #00ff88;
  color: #000;
  border-color: #00ff88;
}

.modal-overlay {
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
}

.agent-modal {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #30363d;
}

.agent-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #30363d;
}

.modal-header h3 {
  margin: 0;
  color: #f0f6fc;
}

.modal-header p {
  margin: 0.25rem 0 0 0;
  color: #7d8590;
  font-size: 0.9rem;
}

.close-btn {
  background: none;
  border: none;
  color: #7d8590;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.close-btn:hover {
  background: #30363d;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
}

.agent-analysis h4 {
  margin: 0 0 1rem 0;
  color: #f0f6fc;
  font-size: 1rem;
}

.agent-analysis p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #c9d1d9;
}

.positions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.position-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #21262d;
  border-radius: 6px;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric .label {
  color: #7d8590;
}

.metric .value {
  font-weight: 600;
}

.metric .value.positive {
  color: #00ff88;
}

.metric .value.negative {
  color: #ff4757;
}
</style> 