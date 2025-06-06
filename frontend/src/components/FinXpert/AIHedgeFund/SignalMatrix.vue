<template>
  <div class="signal-matrix">
    <div class="matrix-header">
      <div class="header-controls">
        <h3>Agent Signal Matrix</h3>
        <div class="controls">
          <select v-model="selectedTimeframe" class="timeframe-select">
            <option value="1d">1 Day</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
          </select>
          <button @click="refreshSignals" class="refresh-btn">
            <font-awesome-icon icon="fa-solid fa-sync-alt" :class="{ spinning: isRefreshing }" />
            Refresh
          </button>
        </div>
      </div>
      
      <div class="legend">
        <div class="legend-item">
          <div class="signal-dot buy"></div>
          <span>Strong Buy</span>
        </div>
        <div class="legend-item">
          <div class="signal-dot weak-buy"></div>
          <span>Buy</span>
        </div>
        <div class="legend-item">
          <div class="signal-dot hold"></div>
          <span>Hold</span>
        </div>
        <div class="legend-item">
          <div class="signal-dot weak-sell"></div>
          <span>Sell</span>
        </div>
        <div class="legend-item">
          <div class="signal-dot sell"></div>
          <span>Strong Sell</span>
        </div>
      </div>
    </div>

    <div class="matrix-container">
      <div class="matrix-table">
        <!-- Table Header -->
        <div class="table-header">
          <div class="agent-column">Agent</div>
          <div v-for="ticker in tickers" :key="ticker" class="ticker-column">
            <span class="ticker">{{ ticker }}</span>
            <span class="price">${{ getTickerPrice(ticker) }}</span>
          </div>
        </div>

        <!-- Agent Rows -->
        <div v-for="agent in agents" :key="agent.id" class="agent-row">
          <div class="agent-cell">
            <img :src="agent.avatar" :alt="agent.name" class="agent-avatar" />
            <div class="agent-info">
              <span class="agent-name">{{ agent.name }}</span>
              <span class="agent-style">{{ agent.style }}</span>
            </div>
            <div class="agent-performance">
              <span :class="['performance', agent.todayReturn >= 0 ? 'positive' : 'negative']">
                {{ agent.todayReturn >= 0 ? '+' : '' }}{{ agent.todayReturn }}%
              </span>
            </div>
          </div>
          
          <div v-for="ticker in tickers" :key="ticker" class="signal-cell">
            <div 
              :class="['signal-indicator', getSignal(agent.id, ticker).strength]"
              @click="showSignalDetails(agent, ticker)"
            >
              <div class="signal-icon">
                <font-awesome-icon :icon="getSignalIcon(getSignal(agent.id, ticker))" />
              </div>
              <div class="signal-info">
                <span class="signal-type">{{ getSignal(agent.id, ticker).action }}</span>
                <span class="confidence">{{ getSignal(agent.id, ticker).confidence }}%</span>
              </div>
            </div>
            
            <div class="signal-meta">
              <span class="target-price">
                Target: ${{ getSignal(agent.id, ticker).targetPrice }}
              </span>
              <span :class="['upside', getSignal(agent.id, ticker).upside >= 0 ? 'positive' : 'negative']">
                {{ getSignal(agent.id, ticker).upside >= 0 ? '+' : '' }}{{ getSignal(agent.id, ticker).upside }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Signal Details Modal -->
    <div v-if="selectedSignal" class="modal-overlay" @click="selectedSignal = null">
      <div class="signal-modal" @click.stop>
        <div class="modal-header">
          <div class="modal-title">
            <img :src="selectedSignal.agent.avatar" :alt="selectedSignal.agent.name" class="modal-avatar" />
            <div>
              <h4>{{ selectedSignal.agent.name }} - {{ selectedSignal.ticker }}</h4>
              <p>{{ selectedSignal.agent.style }} Analysis</p>
            </div>
          </div>
          <button @click="selectedSignal = null" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        
        <div class="modal-content">
          <div class="signal-summary">
            <div class="summary-item">
              <span class="label">Signal:</span>
              <span :class="['value', selectedSignal.signal.strength]">
                {{ selectedSignal.signal.action }}
              </span>
            </div>
            <div class="summary-item">
              <span class="label">Confidence:</span>
              <span class="value">{{ selectedSignal.signal.confidence }}%</span>
            </div>
            <div class="summary-item">
              <span class="label">Target Price:</span>
              <span class="value">${{ selectedSignal.signal.targetPrice }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Expected Return:</span>
              <span :class="['value', selectedSignal.signal.upside >= 0 ? 'positive' : 'negative']">
                {{ selectedSignal.signal.upside >= 0 ? '+' : '' }}{{ selectedSignal.signal.upside }}%
              </span>
            </div>
          </div>
          
          <div class="analysis-text">
            <h5>Analysis</h5>
            <p>{{ selectedSignal.signal.analysis }}</p>
          </div>
          
          <div class="key-factors">
            <h5>Key Factors</h5>
            <ul>
              <li v-for="factor in selectedSignal.signal.keyFactors" :key="factor">
                {{ factor }}
              </li>
            </ul>
          </div>
          
          <div class="risk-assessment">
            <h5>Risk Assessment</h5>
            <div class="risk-bars">
              <div class="risk-item">
                <span class="risk-label">Market Risk:</span>
                <div class="risk-bar">
                  <div class="risk-fill" :style="{ width: selectedSignal.signal.risks.market + '%' }"></div>
                </div>
                <span class="risk-value">{{ selectedSignal.signal.risks.market }}%</span>
              </div>
              <div class="risk-item">
                <span class="risk-label">Company Risk:</span>
                <div class="risk-bar">
                  <div class="risk-fill" :style="{ width: selectedSignal.signal.risks.company + '%' }"></div>
                </div>
                <span class="risk-value">{{ selectedSignal.signal.risks.company }}%</span>
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
  faSyncAlt, faTimes, faArrowUp, faArrowDown, 
  faMinus, faChevronUp, faChevronDown 
} from '@fortawesome/free-solid-svg-icons';

library.add(faSyncAlt, faTimes, faArrowUp, faArrowDown, faMinus, faChevronUp, faChevronDown);

export default {
  name: 'SignalMatrix',
  components: { FontAwesomeIcon },
  props: {
    agents: {
      type: Array,
      required: true
    },
    tickers: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedTimeframe: '1w',
      isRefreshing: false,
      selectedSignal: null,
      
      // Mock signal data
      signals: {},
      tickerPrices: {
        'AAPL': 193.45,
        'MSFT': 420.30,
        'NVDA': 875.20,
        'GOOGL': 148.25,
        'AMZN': 155.80,
        'TSLA': 248.50,
        'META': 515.75
      }
    };
  },
  
  mounted() {
    this.generateMockSignals();
  },
  
  methods: {
    generateMockSignals() {
      const actions = ['Strong Buy', 'Buy', 'Hold', 'Sell', 'Strong Sell'];
      const strengths = ['buy', 'weak-buy', 'hold', 'weak-sell', 'sell'];
      
      this.agents.forEach(agent => {
        this.tickers.forEach(ticker => {
          const actionIndex = Math.floor(Math.random() * actions.length);
          const confidence = Math.floor(Math.random() * 40 + 60);
          const currentPrice = this.tickerPrices[ticker] || 100;
          const priceChange = (Math.random() - 0.5) * 0.3;
          const targetPrice = (currentPrice * (1 + priceChange)).toFixed(2);
          const upside = ((targetPrice - currentPrice) / currentPrice * 100).toFixed(1);
          
          if (!this.signals[agent.id]) {
            this.signals[agent.id] = {};
          }
          
          this.signals[agent.id][ticker] = {
            action: actions[actionIndex],
            strength: strengths[actionIndex],
            confidence,
            targetPrice,
            upside: parseFloat(upside),
            analysis: this.generateAnalysis(agent, ticker, actions[actionIndex]),
            keyFactors: this.generateKeyFactors(ticker, actions[actionIndex]),
            risks: {
              market: Math.floor(Math.random() * 30 + 20),
              company: Math.floor(Math.random() * 40 + 15)
            }
          };
        });
      });
    },
    
    generateAnalysis(agent, ticker, action) {
      const analyses = {
        'Strong Buy': `Based on ${agent.style} principles, ${ticker} shows exceptional fundamentals with strong growth potential and attractive valuation metrics.`,
        'Buy': `${ticker} demonstrates solid fundamentals aligned with ${agent.style} strategy, though with some caution on current market conditions.`,
        'Hold': `While ${ticker} maintains stable fundamentals, current valuation suggests limited upside potential based on ${agent.style} criteria.`,
        'Sell': `${ticker} shows concerning trends that conflict with ${agent.style} investment principles, suggesting reduced allocation.`,
        'Strong Sell': `Critical issues identified in ${ticker} fundamentals that significantly contradict ${agent.style} investment philosophy.`
      };
      return analyses[action] || 'Analysis pending...';
    },
    
    generateKeyFactors(ticker, action) {
      const factors = {
        'Strong Buy': [
          'Strong revenue growth momentum',
          'Expanding profit margins',
          'Market leadership position',
          'Attractive valuation relative to peers'
        ],
        'Buy': [
          'Solid financial performance',
          'Competitive market position',
          'Reasonable valuation metrics'
        ],
        'Hold': [
          'Stable business fundamentals',
          'Fair current valuation',
          'Limited near-term catalysts'
        ],
        'Sell': [
          'Declining fundamentals',
          'Increased competitive pressure',
          'Valuation concerns'
        ],
        'Strong Sell': [
          'Deteriorating financial metrics',
          'Loss of market position',
          'Overvaluation concerns'
        ]
      };
      return factors[action] || ['Analysis in progress'];
    },
    
    getSignal(agentId, ticker) {
      return this.signals[agentId]?.[ticker] || {
        action: 'Hold',
        strength: 'hold',
        confidence: 50,
        targetPrice: this.tickerPrices[ticker],
        upside: 0
      };
    },
    
    getSignalIcon(signal) {
      const icons = {
        'buy': 'fa-solid fa-chevron-up',
        'weak-buy': 'fa-solid fa-arrow-up',
        'hold': 'fa-solid fa-minus',
        'weak-sell': 'fa-solid fa-arrow-down',
        'sell': 'fa-solid fa-chevron-down'
      };
      return icons[signal.strength] || 'fa-solid fa-minus';
    },
    
    getTickerPrice(ticker) {
      return (this.tickerPrices[ticker] || 100).toFixed(2);
    },
    
    showSignalDetails(agent, ticker) {
      this.selectedSignal = {
        agent,
        ticker,
        signal: this.getSignal(agent.id, ticker)
      };
    },
    
    async refreshSignals() {
      this.isRefreshing = true;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.generateMockSignals();
      this.isRefreshing = false;
    }
  }
};
</script>

<style scoped>
.signal-matrix {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  overflow: hidden;
}

.matrix-header {
  background: #21262d;
  padding: 1.5rem;
  border-bottom: 1px solid #30363d;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-controls h3 {
  margin: 0;
  color: #f0f6fc;
  font-size: 1.2rem;
}

.controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.timeframe-select {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.5rem;
  color: #c9d1d9;
  font-size: 0.9rem;
}

.refresh-btn {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #c9d1d9;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #30363d;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.legend {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #c9d1d9;
}

.signal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.signal-dot.buy {
  background: #00ff88;
}

.signal-dot.weak-buy {
  background: #7dd3fc;
}

.signal-dot.hold {
  background: #94a3b8;
}

.signal-dot.weak-sell {
  background: #fb7185;
}

.signal-dot.sell {
  background: #ff4757;
}

.matrix-container {
  overflow-x: auto;
}

.matrix-table {
  min-width: 800px;
}

.table-header {
  display: grid;
  grid-template-columns: 250px repeat(var(--ticker-count, 5), 200px);
  background: #0d1117;
  padding: 1rem;
  border-bottom: 1px solid #30363d;
}

.agent-column {
  font-weight: 600;
  color: #7d8590;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.ticker-column {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ticker {
  font-weight: 700;
  color: #f0f6fc;
  font-size: 0.9rem;
}

.price {
  font-size: 0.8rem;
  color: #7d8590;
}

.agent-row {
  display: grid;
  grid-template-columns: 250px repeat(var(--ticker-count, 5), 200px);
  border-bottom: 1px solid #30363d;
  transition: background-color 0.2s ease;
}

.agent-row:hover {
  background: #21262d;
}

.agent-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.agent-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.agent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.agent-name {
  font-weight: 600;
  color: #f0f6fc;
  font-size: 0.9rem;
}

.agent-style {
  font-size: 0.8rem;
  color: #7d8590;
}

.agent-performance {
  font-size: 0.8rem;
  font-weight: 600;
}

.agent-performance.positive {
  color: #00ff88;
}

.agent-performance.negative {
  color: #ff4757;
}

.signal-cell {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 0.5rem;
}

.signal-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.signal-indicator:hover {
  background: #30363d;
}

.signal-indicator.buy {
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid #00ff88;
}

.signal-indicator.weak-buy {
  background: rgba(125, 211, 252, 0.1);
  border: 1px solid #7dd3fc;
}

.signal-indicator.hold {
  background: rgba(148, 163, 184, 0.1);
  border: 1px solid #94a3b8;
}

.signal-indicator.weak-sell {
  background: rgba(251, 113, 133, 0.1);
  border: 1px solid #fb7185;
}

.signal-indicator.sell {
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid #ff4757;
}

.signal-icon {
  font-size: 1rem;
}

.signal-indicator.buy .signal-icon {
  color: #00ff88;
}

.signal-indicator.weak-buy .signal-icon {
  color: #7dd3fc;
}

.signal-indicator.hold .signal-icon {
  color: #94a3b8;
}

.signal-indicator.weak-sell .signal-icon {
  color: #fb7185;
}

.signal-indicator.sell .signal-icon {
  color: #ff4757;
}

.signal-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  text-align: center;
}

.signal-type {
  font-size: 0.8rem;
  font-weight: 600;
  color: #f0f6fc;
}

.confidence {
  font-size: 0.7rem;
  color: #7d8590;
}

.signal-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  text-align: center;
}

.target-price {
  font-size: 0.7rem;
  color: #c9d1d9;
}

.upside.positive {
  color: #00ff88;
  font-size: 0.7rem;
  font-weight: 600;
}

.upside.negative {
  color: #ff4757;
  font-size: 0.7rem;
  font-weight: 600;
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

.signal-modal {
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
  background: #21262d;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.modal-title h4 {
  margin: 0;
  color: #f0f6fc;
  font-size: 1.1rem;
}

.modal-title p {
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
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #30363d;
  color: #c9d1d9;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 60vh;
}

.signal-summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #0d1117;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  color: #7d8590;
  font-size: 0.9rem;
}

.summary-item .value {
  font-weight: 600;
  color: #f0f6fc;
}

.summary-item .value.buy,
.summary-item .value.weak-buy {
  color: #00ff88;
}

.summary-item .value.sell,
.summary-item .value.weak-sell {
  color: #ff4757;
}

.summary-item .value.positive {
  color: #00ff88;
}

.summary-item .value.negative {
  color: #ff4757;
}

.analysis-text,
.key-factors,
.risk-assessment {
  margin-bottom: 1.5rem;
}

.analysis-text h5,
.key-factors h5,
.risk-assessment h5 {
  margin: 0 0 0.75rem 0;
  color: #f0f6fc;
  font-size: 1rem;
}

.analysis-text p {
  margin: 0;
  line-height: 1.6;
  color: #c9d1d9;
}

.key-factors ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #c9d1d9;
}

.key-factors li {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.risk-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.risk-label {
  min-width: 100px;
  font-size: 0.9rem;
  color: #7d8590;
}

.risk-bar {
  flex: 1;
  height: 8px;
  background: #30363d;
  border-radius: 4px;
  overflow: hidden;
}

.risk-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #ffcc00, #ff4757);
  transition: width 0.3s ease;
}

.risk-value {
  min-width: 40px;
  text-align: right;
  font-size: 0.8rem;
  color: #c9d1d9;
  font-weight: 600;
}

@media (max-width: 768px) {
  .matrix-container {
    overflow-x: scroll;
  }
  
  .legend {
    gap: 1rem;
  }
  
  .legend-item {
    font-size: 0.7rem;
  }
  
  .signal-summary {
    grid-template-columns: 1fr;
  }
}
</style> 