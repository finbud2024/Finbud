<template>
  <div class="consensus-analysis">
    <div class="consensus-header">
      <h3>Consensus Analysis</h3>
      <div class="header-controls">
        <div class="weight-toggle">
          <label class="toggle-label">
            <input 
              type="checkbox" 
              v-model="useWeightedVoting" 
              class="toggle-input"
            />
            <span class="toggle-slider"></span>
            Weighted by Performance
          </label>
        </div>
        <button @click="exportAnalysis" class="export-btn">
          <font-awesome-icon icon="fa-solid fa-download" />
          Export
        </button>
      </div>
    </div>

    <div class="consensus-grid">
      <div v-for="ticker in tickers" :key="ticker" class="consensus-card">
        <div class="card-header">
          <div class="ticker-info">
            <h4 class="ticker">{{ ticker }}</h4>
            <span class="company-name">{{ getCompanyName(ticker) }}</span>
          </div>
          <div class="current-price">
            <span class="price">${{ getCurrentPrice(ticker) }}</span>
            <span :class="['change', getPriceChange(ticker) >= 0 ? 'positive' : 'negative']">
              {{ getPriceChange(ticker) >= 0 ? '+' : '' }}{{ getPriceChange(ticker) }}%
            </span>
          </div>
        </div>

        <div class="voting-section">
          <div class="vote-distribution">
            <div class="vote-bar">
              <div 
                class="vote-segment buy"
                :style="{ width: getConsensus(ticker).buy + '%' }"
              >
                <span v-if="getConsensus(ticker).buy > 15" class="vote-label">
                  {{ getConsensus(ticker).buy }}%
                </span>
              </div>
              <div 
                class="vote-segment hold"
                :style="{ width: getConsensus(ticker).hold + '%' }"
              >
                <span v-if="getConsensus(ticker).hold > 15" class="vote-label">
                  {{ getConsensus(ticker).hold }}%
                </span>
              </div>
              <div 
                class="vote-segment sell"
                :style="{ width: getConsensus(ticker).sell + '%' }"
              >
                <span v-if="getConsensus(ticker).sell > 15" class="vote-label">
                  {{ getConsensus(ticker).sell }}%
                </span>
              </div>
            </div>
            
            <div class="vote-legend">
              <div class="legend-item">
                <div class="legend-color buy"></div>
                <span>Buy ({{ getConsensus(ticker).buyCount }})</span>
              </div>
              <div class="legend-item">
                <div class="legend-color hold"></div>
                <span>Hold ({{ getConsensus(ticker).holdCount }})</span>
              </div>
              <div class="legend-item">
                <div class="legend-color sell"></div>
                <span>Sell ({{ getConsensus(ticker).sellCount }})</span>
              </div>
            </div>
          </div>
        </div>

        <div class="consensus-metrics">
          <div class="metric-row">
            <div class="metric">
              <span class="metric-label">Consensus</span>
              <span :class="['metric-value', getConsensus(ticker).overall.toLowerCase()]">
                {{ getConsensus(ticker).overall }}
              </span>
            </div>
            <div class="metric">
              <span class="metric-label">Confidence</span>
              <span class="metric-value">{{ getConsensus(ticker).confidence }}%</span>
            </div>
          </div>
          
          <div class="metric-row">
            <div class="metric">
              <span class="metric-label">Target Price</span>
              <span class="metric-value">${{ getConsensus(ticker).targetPrice }}</span>
            </div>
            <div class="metric">
              <span class="metric-label">Upside</span>
              <span :class="['metric-value', getConsensus(ticker).upside >= 0 ? 'positive' : 'negative']">
                {{ getConsensus(ticker).upside >= 0 ? '+' : '' }}{{ getConsensus(ticker).upside }}%
              </span>
            </div>
          </div>
        </div>

        <div class="agent-breakdown">
          <button 
            @click="toggleBreakdown(ticker)"
            class="breakdown-toggle"
          >
            <span>Agent Breakdown</span>
            <font-awesome-icon 
              :icon="showBreakdown[ticker] ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" 
            />
          </button>
          
          <div v-if="showBreakdown[ticker]" class="breakdown-content">
            <div v-for="agent in agents" :key="agent.id" class="agent-vote">
              <img :src="agent.avatar" :alt="agent.name" class="agent-avatar" />
              <div class="agent-info">
                <span class="agent-name">{{ agent.name }}</span>
                <span class="agent-weight" v-if="useWeightedVoting">
                  ({{ getAgentWeight(agent.id) }}% weight)
                </span>
              </div>
              <div class="agent-signal">
                <span :class="['signal', getAgentSignal(agent.id, ticker).strength]">
                  {{ getAgentSignal(agent.id, ticker).action }}
                </span>
                <span class="signal-confidence">
                  {{ getAgentSignal(agent.id, ticker).confidence }}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            @click="addToTradingPlan(ticker, 'buy')"
            :disabled="getConsensus(ticker).overall === 'SELL'"
            class="action-btn buy"
          >
            <font-awesome-icon icon="fa-solid fa-plus" />
            Add to Buy List
          </button>
          <button 
            @click="addToWatchlist(ticker)"
            class="action-btn watch"
          >
            <font-awesome-icon icon="fa-solid fa-eye" />
            Watch
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Statistics -->
    <div class="summary-stats">
      <div class="stats-header">
        <h4>Portfolio Consensus Summary</h4>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ overallStats.strongBuyCount }}</div>
          <div class="stat-label">Strong Buy Signals</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ overallStats.avgConfidence }}%</div>
          <div class="stat-label">Avg Confidence</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ overallStats.avgUpside }}%</div>
          <div class="stat-label">Avg Upside Potential</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ overallStats.consensusLevel }}%</div>
          <div class="stat-label">Agent Consensus</div>
        </div>
      </div>
    </div>

    <!-- Risk Assessment -->
    <div class="risk-assessment">
      <h4>Risk Assessment</h4>
      <div class="risk-grid">
        <div class="risk-item">
          <div class="risk-header">
            <span class="risk-label">Portfolio Concentration</span>
            <span :class="['risk-level', concentrationRisk.level]">
              {{ concentrationRisk.level.toUpperCase() }}
            </span>
          </div>
          <div class="risk-bar">
            <div 
              class="risk-fill"
              :style="{ width: concentrationRisk.score + '%' }"
            ></div>
          </div>
          <p class="risk-description">{{ concentrationRisk.description }}</p>
        </div>
        
        <div class="risk-item">
          <div class="risk-header">
            <span class="risk-label">Consensus Reliability</span>
            <span :class="['risk-level', reliabilityRisk.level]">
              {{ reliabilityRisk.level.toUpperCase() }}
            </span>
          </div>
          <div class="risk-bar">
            <div 
              class="risk-fill"
              :style="{ width: reliabilityRisk.score + '%' }"
            ></div>
          </div>
          <p class="risk-description">{{ reliabilityRisk.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faDownload, faChevronUp, faChevronDown,
  faPlus, faEye
} from '@fortawesome/free-solid-svg-icons';

library.add(faDownload, faChevronUp, faChevronDown, faPlus, faEye);

export default {
  name: 'ConsensusAnalysis',
  components: { FontAwesomeIcon },
  props: {
    agents: {
      type: Array,
      required: true
    },
    tickers: {
      type: Array,
      required: true
    },
    signals: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      useWeightedVoting: true,
      showBreakdown: {},
      
      companyNames: {
        'AAPL': 'Apple Inc.',
        'MSFT': 'Microsoft Corp.',
        'NVDA': 'NVIDIA Corp.',
        'GOOGL': 'Alphabet Inc.',
        'AMZN': 'Amazon.com Inc.',
        'TSLA': 'Tesla Inc.',
        'META': 'Meta Platforms Inc.'
      },
      
      currentPrices: {
        'AAPL': 193.45,
        'MSFT': 420.30,
        'NVDA': 875.20,
        'GOOGL': 148.25,
        'AMZN': 155.80,
        'TSLA': 248.50,
        'META': 515.75
      },
      
      priceChanges: {
        'AAPL': 1.23,
        'MSFT': -0.45,
        'NVDA': 2.87,
        'GOOGL': 0.92,
        'AMZN': -0.34,
        'TSLA': 3.21,
        'META': 1.45
      }
    };
  },
  
  computed: {
    overallStats() {
      let strongBuyCount = 0;
      let totalConfidence = 0;
      let totalUpside = 0;
      let totalConsensus = 0;
      
      this.tickers.forEach(ticker => {
        const consensus = this.getConsensus(ticker);
        if (consensus.overall === 'BUY' && consensus.buy > 70) {
          strongBuyCount++;
        }
        totalConfidence += consensus.confidence;
        totalUpside += consensus.upside;
        totalConsensus += Math.max(consensus.buy, consensus.hold, consensus.sell);
      });
      
      return {
        strongBuyCount,
        avgConfidence: Math.round(totalConfidence / this.tickers.length),
        avgUpside: (totalUpside / this.tickers.length).toFixed(1),
        consensusLevel: Math.round(totalConsensus / this.tickers.length)
      };
    },
    
    concentrationRisk() {
      // Calculate concentration risk based on how many stocks are getting strong buy signals
      const strongBuys = this.overallStats.strongBuyCount;
      const total = this.tickers.length;
      const concentration = (strongBuys / total) * 100;
      
      if (concentration > 70) {
        return {
          level: 'high',
          score: 85,
          description: 'High concentration of buy signals may indicate overoptimism'
        };
      } else if (concentration > 40) {
        return {
          level: 'medium',
          score: 60,
          description: 'Moderate concentration within acceptable risk parameters'
        };
      } else {
        return {
          level: 'low',
          score: 30,
          description: 'Well-diversified signal distribution'
        };
      }
    },
    
    reliabilityRisk() {
      // Calculate reliability based on consensus strength
      const consensusLevel = this.overallStats.consensusLevel;
      
      if (consensusLevel > 80) {
        return {
          level: 'low',
          score: 20,
          description: 'Strong agent consensus increases signal reliability'
        };
      } else if (consensusLevel > 60) {
        return {
          level: 'medium',
          score: 50,
          description: 'Moderate consensus - consider additional analysis'
        };
      } else {
        return {
          level: 'high',
          score: 80,
          description: 'Low consensus - signals may be unreliable'
        };
      }
    }
  },
  
  methods: {
    getCompanyName(ticker) {
      return this.companyNames[ticker] || ticker;
    },
    
    getCurrentPrice(ticker) {
      return (this.currentPrices[ticker] || 100).toFixed(2);
    },
    
    getPriceChange(ticker) {
      return this.priceChanges[ticker] || 0;
    },
    
    getAgentWeight(agentId) {
      // Mock agent weights based on performance
      const agent = this.agents.find(a => a.id === agentId);
      return agent ? Math.round((agent.ytdReturn + 10) / 0.5) : 100;
    },
    
    getAgentSignal(agentId, ticker) {
      return this.signals[agentId]?.[ticker] || {
        action: 'Hold',
        strength: 'hold',
        confidence: 50
      };
    },
    
    getConsensus(ticker) {
      let buyVotes = 0;
      let holdVotes = 0;
      let sellVotes = 0;
      let totalConfidence = 0;
      let totalTargetPrice = 0;
      let validSignals = 0;
      
      this.agents.forEach(agent => {
        const signal = this.getAgentSignal(agent.id, ticker);
        const weight = this.useWeightedVoting ? this.getAgentWeight(agent.id) / 100 : 1;
        
        if (signal.action.includes('Buy')) {
          buyVotes += weight;
        } else if (signal.action.includes('Sell')) {
          sellVotes += weight;
        } else {
          holdVotes += weight;
        }
        
        totalConfidence += signal.confidence * weight;
        totalTargetPrice += parseFloat(signal.targetPrice) * weight;
        validSignals += weight;
      });
      
      const total = buyVotes + holdVotes + sellVotes;
      const buy = Math.round((buyVotes / total) * 100);
      const hold = Math.round((holdVotes / total) * 100);
      const sell = Math.round((sellVotes / total) * 100);
      
      const avgTargetPrice = (totalTargetPrice / validSignals).toFixed(2);
      const currentPrice = this.getCurrentPrice(ticker);
      const upside = (((avgTargetPrice - currentPrice) / currentPrice) * 100).toFixed(1);
      
      let overall = 'HOLD';
      if (buy > hold && buy > sell) {
        overall = 'BUY';
      } else if (sell > buy && sell > hold) {
        overall = 'SELL';
      }
      
      return {
        buy,
        hold,
        sell,
        buyCount: Math.round(buyVotes),
        holdCount: Math.round(holdVotes),
        sellCount: Math.round(sellVotes),
        overall,
        confidence: Math.round(totalConfidence / validSignals),
        targetPrice: avgTargetPrice,
        upside: parseFloat(upside)
      };
    },
    
    toggleBreakdown(ticker) {
      this.$set(this.showBreakdown, ticker, !this.showBreakdown[ticker]);
    },
    
    addToTradingPlan(ticker, action) {
      this.$emit('add-to-trading-plan', { ticker, action });
      console.log(`Added ${ticker} to trading plan: ${action}`);
    },
    
    addToWatchlist(ticker) {
      this.$emit('add-to-watchlist', ticker);
      console.log(`Added ${ticker} to watchlist`);
    },
    
    exportAnalysis() {
      console.log('Exporting consensus analysis...');
      // Implementation for exporting analysis
    }
  }
};
</script>

<style scoped>
.consensus-analysis {
  background: #0d1117;
  color: #c9d1d9;
  padding: 1.5rem;
  border-radius: 12px;
}

.consensus-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #30363d;
}

.consensus-header h3 {
  margin: 0;
  color: #f0f6fc;
  font-size: 1.5rem;
}

.header-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.weight-toggle {
  display: flex;
  align-items: center;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #c9d1d9;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 48px;
  height: 24px;
  background: #30363d;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #c9d1d9;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.toggle-input:checked + .toggle-slider {
  background: #00ff88;
}

.toggle-input:checked + .toggle-slider::after {
  transform: translateX(24px);
  background: #000;
}

.export-btn {
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

.export-btn:hover {
  background: #30363d;
}

.consensus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.consensus-card {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.consensus-card:hover {
  border-color: #58a6ff;
  box-shadow: 0 4px 15px rgba(88, 166, 255, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.ticker-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f0f6fc;
}

.company-name {
  font-size: 0.9rem;
  color: #7d8590;
}

.current-price {
  text-align: right;
}

.price {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f0f6fc;
  margin-bottom: 0.25rem;
}

.change.positive {
  color: #00ff88;
  font-size: 0.9rem;
  font-weight: 600;
}

.change.negative {
  color: #ff4757;
  font-size: 0.9rem;
  font-weight: 600;
}

.voting-section {
  margin-bottom: 1.5rem;
}

.vote-bar {
  display: flex;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.vote-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.vote-segment.buy {
  background: #00ff88;
}

.vote-segment.hold {
  background: #94a3b8;
}

.vote-segment.sell {
  background: #ff4757;
  color: #fff;
}

.vote-label {
  white-space: nowrap;
}

.vote-legend {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.buy {
  background: #00ff88;
}

.legend-color.hold {
  background: #94a3b8;
}

.legend-color.sell {
  background: #ff4757;
}

.consensus-metrics {
  margin-bottom: 1.5rem;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
  flex: 1;
}

.metric-label {
  font-size: 0.8rem;
  color: #7d8590;
}

.metric-value {
  font-weight: 700;
  font-size: 1rem;
  color: #f0f6fc;
}

.metric-value.buy {
  color: #00ff88;
}

.metric-value.sell {
  color: #ff4757;
}

.metric-value.positive {
  color: #00ff88;
}

.metric-value.negative {
  color: #ff4757;
}

.agent-breakdown {
  margin-bottom: 1.5rem;
}

.breakdown-toggle {
  width: 100%;
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.75rem;
  color: #c9d1d9;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}

.breakdown-toggle:hover {
  background: #30363d;
}

.breakdown-content {
  margin-top: 0.75rem;
  border: 1px solid #30363d;
  border-radius: 6px;
  overflow: hidden;
}

.agent-vote {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #30363d;
}

.agent-vote:last-child {
  border-bottom: none;
}

.agent-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.75rem;
}

.agent-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.agent-name {
  font-weight: 600;
  color: #f0f6fc;
  font-size: 0.9rem;
}

.agent-weight {
  font-size: 0.7rem;
  color: #7d8590;
}

.agent-signal {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.signal {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.signal.buy,
.signal.weak-buy {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.signal.hold {
  background: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.signal.sell,
.signal.weak-sell {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.signal-confidence {
  font-size: 0.7rem;
  color: #7d8590;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.action-btn.buy {
  background: #00ff88;
  color: #000;
}

.action-btn.buy:disabled {
  background: #30363d;
  color: #7d8590;
  cursor: not-allowed;
}

.action-btn.buy:not(:disabled):hover {
  background: #00cc6a;
  transform: translateY(-1px);
}

.action-btn.watch {
  background: #21262d;
  border: 1px solid #30363d;
  color: #c9d1d9;
}

.action-btn.watch:hover {
  background: #30363d;
}

.summary-stats,
.risk-assessment {
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.stats-header h4,
.risk-assessment h4 {
  margin: 0 0 1rem 0;
  color: #f0f6fc;
  font-size: 1.1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #0d1117;
  border-radius: 6px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #00ff88;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #7d8590;
}

.risk-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.risk-item {
  background: #0d1117;
  padding: 1rem;
  border-radius: 6px;
}

.risk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.risk-label {
  font-weight: 600;
  color: #f0f6fc;
}

.risk-level {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.risk-level.low {
  background: rgba(0, 255, 136, 0.2);
  color: #00ff88;
}

.risk-level.medium {
  background: rgba(255, 204, 0, 0.2);
  color: #ffcc00;
}

.risk-level.high {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
}

.risk-bar {
  height: 8px;
  background: #30363d;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.risk-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88, #ffcc00, #ff4757);
  transition: width 0.3s ease;
}

.risk-description {
  margin: 0;
  font-size: 0.9rem;
  color: #7d8590;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .consensus-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metric-row {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .vote-legend {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 