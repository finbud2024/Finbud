<template>
  <div class="agent-selector">
    <div class="selector-header">
      <h3>Select Your AI Agents</h3>
      <p>Choose up to 8 agents for your hedge fund analysis</p>
    </div>
    
    <div class="agent-categories">
      <div v-for="category in agentCategories" :key="category.name" class="category-section">
        <h4 class="category-title">{{ category.name }}</h4>
        <div class="agents-grid">
          <div 
            v-for="agent in category.agents" 
            :key="agent.id"
            :class="['agent-card', { 
              selected: selectedAgents.includes(agent.id),
              disabled: !selectedAgents.includes(agent.id) && selectedAgents.length >= maxAgents
            }]"
            @click="toggleAgent(agent.id)"
          >
            <div class="agent-avatar">
              <img :src="agent.avatar" :alt="agent.name" />
              <div v-if="selectedAgents.includes(agent.id)" class="selected-badge">
                <font-awesome-icon icon="fa-solid fa-check" />
              </div>
            </div>
            
            <div class="agent-info">
              <h5 class="agent-name">{{ agent.name }}</h5>
              <p class="agent-style">{{ agent.style }}</p>
              <div class="agent-stats">
                <div class="stat">
                  <span class="label">YTD Return:</span>
                  <span :class="['value', agent.ytdReturn >= 0 ? 'positive' : 'negative']">
                    {{ agent.ytdReturn >= 0 ? '+' : '' }}{{ agent.ytdReturn }}%
                  </span>
                </div>
                <div class="stat">
                  <span class="label">Sharpe:</span>
                  <span class="value">{{ agent.sharpe }}</span>
                </div>
              </div>
            </div>
            
            <div class="agent-details">
              <button @click.stop="showAgentDetails(agent)" class="details-btn">
                <font-awesome-icon icon="fa-solid fa-info-circle" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="selection-summary">
      <div class="selected-count">
        Selected: {{ selectedAgents.length }}/{{ maxAgents }}
      </div>
      <button 
        :disabled="selectedAgents.length === 0" 
        @click="$emit('agents-selected', selectedAgents)"
        class="continue-btn"
      >
        Continue with Selected Agents
      </button>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

library.add(faCheck, faInfoCircle);

export default {
  name: 'AgentSelector',
  components: { FontAwesomeIcon },
  props: {
    maxAgents: {
      type: Number,
      default: 8
    }
  },
  data() {
    return {
      selectedAgents: [],
      agentCategories: [
        {
          name: 'Legendary Value Investors',
          agents: [
            {
              id: 'buffett',
              name: 'Warren Buffett',
              style: 'Value Investing',
              avatar: '/agents/buffett.png',
              ytdReturn: 12.4,
              sharpe: 1.8,
              description: 'Focus on undervalued companies with strong moats',
              philosophy: 'Buy and hold forever',
              riskTolerance: 'Low',
              avgHoldingPeriod: '5+ years'
            },
            {
              id: 'graham',
              name: 'Benjamin Graham',
              style: 'Deep Value',
              avatar: '/agents/graham.png',
              ytdReturn: 8.7,
              sharpe: 1.5,
              description: 'Quantitative value screening approach',
              philosophy: 'Margin of safety',
              riskTolerance: 'Very Low',
              avgHoldingPeriod: '2-3 years'
            }
          ]
        },
        {
          name: 'Growth & Innovation',
          agents: [
            {
              id: 'cathie',
              name: 'Cathie Wood',
              style: 'Disruptive Innovation',
              avatar: '/agents/cathie.png',
              ytdReturn: 15.2,
              sharpe: 1.2,
              description: 'Betting on transformative technologies',
              philosophy: 'Innovation as competitive advantage',
              riskTolerance: 'High',
              avgHoldingPeriod: '3-5 years'
            },
            {
              id: 'lynch',
              name: 'Peter Lynch',
              style: 'Growth at Reasonable Price',
              avatar: '/agents/lynch.png',
              ytdReturn: 18.5,
              sharpe: 2.1,
              description: 'Bottom-up stock picking',
              philosophy: 'Invest in what you understand',
              riskTolerance: 'Medium',
              avgHoldingPeriod: '2-4 years'
            }
          ]
        },
        {
          name: 'Macro & Trading',
          agents: [
            {
              id: 'druckenmiller',
              name: 'Stanley Druckenmiller',
              style: 'Macro Trading',
              avatar: '/agents/druckenmiller.png',
              ytdReturn: 22.1,
              sharpe: 1.9,
              description: 'Top-down macro-driven approach',
              philosophy: 'Liquidity and momentum',
              riskTolerance: 'High',
              avgHoldingPeriod: '3-12 months'
            },
            {
              id: 'soros',
              name: 'George Soros',
              style: 'Reflexivity Theory',
              avatar: '/agents/soros.png',
              ytdReturn: 19.8,
              sharpe: 1.7,
              description: 'Market psychology and reflexivity',
              philosophy: 'Market efficiency is false',
              riskTolerance: 'Very High',
              avgHoldingPeriod: '1-6 months'
            }
          ]
        },
        {
          name: 'Quantitative Strategies',
          agents: [
            {
              id: 'simons',
              name: 'Jim Simons',
              style: 'Quantitative',
              avatar: '/agents/simons.png',
              ytdReturn: 25.3,
              sharpe: 2.8,
              description: 'Mathematical models and algorithms',
              philosophy: 'Data-driven systematic approach',
              riskTolerance: 'Medium',
              avgHoldingPeriod: 'Days to weeks'
            },
            {
              id: 'renaissance',
              name: 'Renaissance AI',
              style: 'Machine Learning',
              avatar: '/agents/renaissance.png',
              ytdReturn: 28.7,
              sharpe: 3.2,
              description: 'Advanced AI and pattern recognition',
              philosophy: 'Systematic alpha generation',
              riskTolerance: 'Medium-High',
              avgHoldingPeriod: 'Minutes to days'
            }
          ]
        }
      ]
    };
  },
  
  methods: {
    toggleAgent(agentId) {
      const index = this.selectedAgents.indexOf(agentId);
      if (index > -1) {
        this.selectedAgents.splice(index, 1);
      } else if (this.selectedAgents.length < this.maxAgents) {
        this.selectedAgents.push(agentId);
      }
    },
    
    showAgentDetails(agent) {
      this.$emit('show-agent-details', agent);
    }
  }
};
</script>

<style scoped>
.agent-selector {
  background: #0d1117;
  color: #c9d1d9;
  padding: 2rem;
  border-radius: 12px;
}

.selector-header {
  text-align: center;
  margin-bottom: 2rem;
}

.selector-header h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: #f0f6fc;
}

.selector-header p {
  margin: 0;
  color: #7d8590;
  font-size: 1.1rem;
}

.category-section {
  margin-bottom: 2.5rem;
}

.category-title {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #00ff88;
  border-bottom: 2px solid #30363d;
  padding-bottom: 0.5rem;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.agent-card {
  background: #161b22;
  border: 2px solid #30363d;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.agent-card:hover {
  border-color: #58a6ff;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(88, 166, 255, 0.15);
}

.agent-card.selected {
  border-color: #00ff88;
  background: #0d2818;
  box-shadow: 0 8px 25px rgba(0, 255, 136, 0.2);
}

.agent-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.agent-card.disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: #30363d;
}

.agent-avatar {
  position: relative;
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem auto;
}

.agent-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.selected-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #00ff88;
  color: #000;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.agent-info {
  text-align: center;
  margin-bottom: 1rem;
}

.agent-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f0f6fc;
}

.agent-style {
  margin: 0 0 1rem 0;
  color: #7d8590;
  font-size: 0.9rem;
}

.agent-stats {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat .label {
  font-size: 0.8rem;
  color: #7d8590;
}

.stat .value {
  font-weight: 700;
  font-size: 0.9rem;
}

.stat .value.positive {
  color: #00ff88;
}

.stat .value.negative {
  color: #ff4757;
}

.agent-details {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.details-btn {
  background: #21262d;
  border: 1px solid #30363d;
  border-radius: 6px;
  padding: 0.5rem;
  color: #7d8590;
  cursor: pointer;
  transition: all 0.2s ease;
}

.details-btn:hover {
  background: #30363d;
  color: #c9d1d9;
}

.selection-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1.5rem;
  background: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
}

.selected-count {
  font-size: 1.1rem;
  font-weight: 600;
  color: #f0f6fc;
}

.continue-btn {
  background: linear-gradient(135deg, #00ff88, #00cc6a);
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  color: #000;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.continue-btn:disabled {
  background: #30363d;
  color: #7d8590;
  cursor: not-allowed;
}

.continue-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 255, 136, 0.3);
}
</style> 