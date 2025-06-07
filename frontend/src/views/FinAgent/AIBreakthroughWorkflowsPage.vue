<template>
  <div class="ai-breakthrough-workflows">
    <!-- Universe Background Effect -->
    <div class="universe-background">
      <div class="bubble" v-for="n in 18" :key="n" :style="getBubbleStyle(n)"></div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">
            <font-awesome-icon icon="fa-solid fa-rocket" class="breakthrough-icon" />
            AI Breakthrough Workflows
          </h1>
          <p class="subtitle">Công nghệ AI tiên tiến - Đột phá trong quy trình tự động hóa tài chính</p>
        </div>
        <div class="breakthrough-stats">
          <div class="stat-card">
            <div class="stat-value">{{ breakthroughCount }}</div>
            <div class="stat-label">Breakthrough Models</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ accuracyRate }}%</div>
            <div class="stat-label">Accuracy Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ processingSpeed }}x</div>
            <div class="stat-label">Speed Improvement</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Innovation Categories -->
    <div class="innovation-categories">
      <div class="category-tabs">
        <button v-for="category in categories" :key="category.id"
                @click="activeCategory = category.id"
                :class="['category-tab', { active: activeCategory === category.id }]">
          <font-awesome-icon :icon="category.icon" />
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div class="breakthrough-dashboard">
      
      <!-- Quantum AI Section -->
      <div v-if="activeCategory === 'quantum'" class="workflow-section">
        <div class="section-header">
          <h2>Quantum AI Processing</h2>
          <div class="quantum-status">
            <div class="quantum-indicator" :class="quantumStatus">{{ quantumStatus }}</div>
          </div>
        </div>
        
        <div class="quantum-grid">
          <div class="quantum-card">
            <div class="card-header">
              <h3>Quantum Portfolio Optimization</h3>
              <div class="quantum-power">{{ quantumPower }}% Quantum Power</div>
            </div>
            <div class="card-content">
              <div class="quantum-metrics">
                <div class="metric-item">
                  <span class="metric-label">Qubits Utilized</span>
                  <span class="metric-value">{{ quantumMetrics.qubits }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Entanglement Rate</span>
                  <span class="metric-value">{{ quantumMetrics.entanglement }}%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Coherence Time</span>
                  <span class="metric-value">{{ quantumMetrics.coherence }}ms</span>
                </div>
              </div>
              <div class="quantum-visualization">
                <div class="quantum-state" v-for="n in 8" :key="n" :style="getQuantumStateStyle(n)"></div>
              </div>
            </div>
          </div>

          <div class="quantum-card">
            <div class="card-header">
              <h3>Quantum Risk Analysis</h3>
              <div class="processing-status">{{ quantumRisk.status }}</div>
            </div>
            <div class="card-content">
              <div class="risk-quantum-dashboard">
                <div class="superposition-states">
                  <h4>Superposition Risk States</h4>
                  <div class="state-grid">
                    <div v-for="state in quantumRisk.states" :key="state.id" class="risk-state">
                      <span class="state-name">{{ state.name }}</span>
                      <span class="probability">{{ state.probability }}%</span>
                      <div class="probability-bar">
                        <div class="probability-fill" :style="{ width: state.probability + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Neural Networks Section -->
      <div v-if="activeCategory === 'neural'" class="workflow-section">
        <div class="section-header">
          <h2>Advanced Neural Networks</h2>
          <div class="neural-controls">
            <button @click="trainNeuralNetwork" class="train-btn">
              <font-awesome-icon icon="fa-solid fa-brain" />
              Train Network
            </button>
          </div>
        </div>
        
        <div class="neural-grid">
          <div class="neural-card large">
            <div class="card-header">
              <h3>Transformer Architecture</h3>
              <div class="architecture-type">GPT-4 Enhanced</div>
            </div>
            <div class="card-content">
              <div class="transformer-dashboard">
                <div class="attention-mechanisms">
                  <h4>Multi-Head Attention</h4>
                  <div class="attention-grid">
                    <div v-for="head in neuralNetworks.transformer.attentionHeads" :key="head.id" 
                         class="attention-head">
                      <span class="head-name">Head {{ head.id }}</span>
                      <span class="attention-score">{{ head.score }}%</span>
                      <div class="attention-visualization">
                        <div class="attention-pattern" :style="getAttentionStyle(head.pattern)"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="layer-analysis">
                  <h4>Layer Performance</h4>
                  <div class="layer-metrics">
                    <div v-for="layer in neuralNetworks.transformer.layers" :key="layer.id" 
                         class="layer-item">
                      <span class="layer-name">Layer {{ layer.id }}</span>
                      <span class="layer-accuracy">{{ layer.accuracy }}%</span>
                      <span class="layer-loss">Loss: {{ layer.loss }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="neural-card">
            <div class="card-header">
              <h3>Reinforcement Learning Agent</h3>
              <div class="agent-status" :class="rlAgent.status">{{ rlAgent.status }}</div>
            </div>
            <div class="card-content">
              <div class="rl-dashboard">
                <div class="reward-system">
                  <h4>Reward Function</h4>
                  <div class="reward-metrics">
                    <div class="reward-item">
                      <span>Total Reward</span>
                      <span class="reward-value">{{ rlAgent.totalReward }}</span>
                    </div>
                    <div class="reward-item">
                      <span>Episode Reward</span>
                      <span class="reward-value">{{ rlAgent.episodeReward }}</span>
                    </div>
                    <div class="reward-item">
                      <span>Learning Rate</span>
                      <span class="reward-value">{{ rlAgent.learningRate }}</span>
                    </div>
                  </div>
                </div>
                <div class="policy-network">
                  <h4>Policy Network</h4>
                  <div class="policy-actions">
                    <div v-for="action in rlAgent.actions" :key="action.name" 
                         class="action-item">
                      <span class="action-name">{{ action.name }}</span>
                      <span class="action-probability">{{ action.probability }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Generative AI Section -->
      <div v-if="activeCategory === 'generative'" class="workflow-section">
        <div class="section-header">
          <h2>Generative AI Models</h2>
          <div class="generation-controls">
            <button @click="generateContent" class="generate-btn">
              <font-awesome-icon icon="fa-solid fa-magic" />
              Generate Content
            </button>
          </div>
        </div>
        
        <div class="generative-grid">
          <div class="generative-card">
            <div class="card-header">
              <h3>Financial Report Generator</h3>
              <div class="model-version">GPT-4 Turbo</div>
            </div>
            <div class="card-content">
              <div class="generation-stats">
                <div class="stat-row">
                  <div class="stat">
                    <span class="stat-label">Reports Generated</span>
                    <span class="stat-value">{{ generativeAI.reportGen.generated }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Quality Score</span>
                    <span class="stat-value">{{ generativeAI.reportGen.quality }}%</span>
                  </div>
                </div>
                <div class="recent-generations">
                  <h4>Recent Generations</h4>
                  <div class="generation-list">
                    <div v-for="report in generativeAI.reportGen.recent" :key="report.id" 
                         class="generation-item">
                      <span class="report-title">{{ report.title }}</span>
                      <span class="generation-time">{{ report.time }}s</span>
                      <span class="quality-rating" :class="getQualityClass(report.quality)">
                        {{ report.quality }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="generative-card">
            <div class="card-header">
              <h3>Market Insight Generator</h3>
              <div class="insight-status">{{ generativeAI.insights.status }}</div>
            </div>
            <div class="card-content">
              <div class="insight-dashboard">
                <div class="insight-metrics">
                  <div class="metric">
                    <span class="metric-label">Insights Generated</span>
                    <span class="metric-value">{{ generativeAI.insights.count }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Accuracy Rate</span>
                    <span class="metric-value">{{ generativeAI.insights.accuracy }}%</span>
                  </div>
                </div>
                <div class="latest-insights">
                  <h4>Latest Market Insights</h4>
                  <div class="insight-list">
                    <div v-for="insight in generativeAI.insights.latest" :key="insight.id" 
                         class="insight-item">
                      <span class="insight-text">{{ insight.text }}</span>
                      <span class="confidence-score">{{ insight.confidence }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Innovation Lab -->
    <div class="innovation-lab">
      <div class="lab-header">
        <h3>Innovation Lab - Experimental Features</h3>
        <div class="lab-status">
          <span class="status-indicator experimental">Experimental</span>
        </div>
      </div>
      <div class="lab-content">
        <div class="experiment-grid">
          <div v-for="experiment in experiments" :key="experiment.id" 
               class="experiment-card">
            <div class="experiment-header">
              <h4>{{ experiment.name }}</h4>
              <div class="experiment-stage" :class="experiment.stage">{{ experiment.stage }}</div>
            </div>
            <div class="experiment-description">{{ experiment.description }}</div>
            <div class="experiment-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: experiment.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ experiment.progress }}% Complete</span>
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
  faRocket, faBrain, faMagic
} from '@fortawesome/free-solid-svg-icons';

library.add(faRocket, faBrain, faMagic);

export default {
  name: 'AIBreakthroughWorkflowsPage',
  components: { FontAwesomeIcon },
  data() {
    return {
      breakthroughCount: 12,
      accuracyRate: 97.8,
      processingSpeed: 15.2,
      activeCategory: 'quantum',
      quantumStatus: 'active',
      quantumPower: 87,

      categories: [
        { id: 'quantum', name: 'Quantum AI', icon: 'fa-solid fa-rocket' },
        { id: 'neural', name: 'Neural Networks', icon: 'fa-solid fa-brain' },
        { id: 'generative', name: 'Generative AI', icon: 'fa-solid fa-magic' }
      ],

      quantumMetrics: {
        qubits: 128,
        entanglement: 94.2,
        coherence: 150
      },

      quantumRisk: {
        status: 'processing',
        states: [
          { id: 1, name: 'Bull Market', probability: 45 },
          { id: 2, name: 'Bear Market', probability: 25 },
          { id: 3, name: 'Sideways', probability: 20 },
          { id: 4, name: 'Volatile', probability: 10 }
        ]
      },

      neuralNetworks: {
        transformer: {
          attentionHeads: [
            { id: 1, score: 94, pattern: 'high' },
            { id: 2, score: 87, pattern: 'medium' },
            { id: 3, score: 91, pattern: 'high' },
            { id: 4, score: 83, pattern: 'medium' }
          ],
          layers: [
            { id: 1, accuracy: 96.2, loss: 0.034 },
            { id: 2, accuracy: 94.8, loss: 0.041 },
            { id: 3, accuracy: 97.1, loss: 0.028 },
            { id: 4, accuracy: 95.5, loss: 0.037 }
          ]
        }
      },

      rlAgent: {
        status: 'learning',
        totalReward: 2847.3,
        episodeReward: 156.8,
        learningRate: 0.001,
        actions: [
          { name: 'Buy', probability: 35 },
          { name: 'Sell', probability: 25 },
          { name: 'Hold', probability: 40 }
        ]
      },

      generativeAI: {
        reportGen: {
          generated: 342,
          quality: 96.5,
          recent: [
            { id: 1, title: 'Q4 Market Analysis', time: 12.3, quality: 97 },
            { id: 2, title: 'Risk Assessment Report', time: 8.7, quality: 94 },
            { id: 3, title: 'Portfolio Performance', time: 15.2, quality: 98 }
          ]
        },
        insights: {
          status: 'generating',
          count: 1247,
          accuracy: 94.8,
          latest: [
            { id: 1, text: 'Tech stocks showing strong momentum', confidence: 87 },
            { id: 2, text: 'Energy sector volatility increasing', confidence: 92 },
            { id: 3, text: 'Bond yields indicating rate changes', confidence: 89 }
          ]
        }
      },

      experiments: [
        {
          id: 1,
          name: 'Quantum-Neural Hybrid',
          description: 'Combining quantum computing with neural networks for enhanced prediction',
          stage: 'prototype',
          progress: 67
        },
        {
          id: 2,
          name: 'AGI Financial Advisor',
          description: 'Artificial General Intelligence for comprehensive financial planning',
          stage: 'research',
          progress: 23
        },
        {
          id: 3,
          name: 'Consciousness-Based Trading',
          description: 'AI system with consciousness-like decision making',
          stage: 'concept',
          progress: 8
        }
      ]
    };
  },

  mounted() {
    this.startQuantumSimulation();
  },

  methods: {
    trainNeuralNetwork() {
      console.log('Training neural network...');
      // Simulate training process
    },

    generateContent() {
      console.log('Generating AI content...');
      // Simulate content generation
    },

    getBubbleStyle(index) {
      const size = Math.random() * 70 + 20;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 20;
      const animationDuration = Math.random() * 12 + 18;
      const opacity = Math.random() * 0.3 + 0.1;
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`,
        opacity: opacity
      };
    },

    getQuantumStateStyle(index) {
      const rotation = (index * 45) + (Date.now() / 100) % 360;
      const scale = 0.8 + Math.sin(Date.now() / 1000 + index) * 0.3;
      
      return {
        transform: `rotate(${rotation}deg) scale(${scale})`,
        animationDelay: `${index * 0.2}s`
      };
    },

    getAttentionStyle(pattern) {
      const intensity = pattern === 'high' ? 1 : 0.6;
      return {
        opacity: intensity,
        background: `linear-gradient(45deg, rgba(255,255,255,${intensity}), rgba(255,255,255,${intensity * 0.5}))`
      };
    },

    getQualityClass(quality) {
      if (quality >= 95) return 'excellent';
      if (quality >= 85) return 'good';
      return 'average';
    },

    startQuantumSimulation() {
      setInterval(() => {
        this.quantumPower = Math.max(70, Math.min(100, this.quantumPower + (Math.random() - 0.5) * 5));
        this.quantumMetrics.entanglement = Math.max(80, Math.min(100, this.quantumMetrics.entanglement + (Math.random() - 0.5) * 3));
        this.rlAgent.totalReward += Math.random() * 10;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.ai-breakthrough-workflows {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #1a1a1a 75%, #000000 100%);
  color: #ffffff;
  font-family: 'Inter', 'Roboto', sans-serif;
  padding: 2rem;
}

/* Universe Background Effect */
.universe-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.bubble {
  position: absolute;
  bottom: -100px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 50%, transparent 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: floatUp linear infinite;
  backdrop-filter: blur(2px);
}

@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.header-section {
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #cccccc, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.breakthrough-icon {
  color: #ffffff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.subtitle {
  font-size: 1.2rem;
  color: #aaaaaa;
  margin: 0;
}

.breakthrough-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #aaaaaa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.innovation-categories {
  max-width: 1400px;
  margin: 0 auto 2rem auto;
  position: relative;
  z-index: 1;
}

.category-tabs {
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.5rem;
  backdrop-filter: blur(10px);
}

.category-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: #aaaaaa;
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
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.category-tab.active {
  background: #ffffff;
  color: #000000;
  font-weight: 600;
}

.breakthrough-dashboard {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.section-header h2 {
  font-size: 1.6rem;
  color: #ffffff;
  margin: 0;
}

.quantum-status, .neural-controls, .generation-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantum-indicator {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.quantum-indicator.active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.train-btn, .generate-btn {
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

.train-btn:hover, .generate-btn:hover {
  background: #cccccc;
  transform: translateY(-2px);
}

.quantum-grid, .neural-grid, .generative-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.quantum-card, .neural-card, .generative-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.neural-card.large {
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
  font-size: 1.2rem;
}

.quantum-power, .architecture-type, .model-version, .processing-status, .agent-status, .insight-status {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.quantum-metrics, .generation-stats {
  margin-bottom: 1.5rem;
}

.metric-item, .metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.metric-label {
  color: #aaaaaa;
  font-size: 0.9rem;
}

.metric-value {
  color: #ffffff;
  font-weight: 600;
}

.quantum-visualization {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  position: relative;
}

.quantum-state {
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #ffffff, rgba(255, 255, 255, 0.5));
  border-radius: 50%;
  position: absolute;
  animation: quantumFloat 3s ease-in-out infinite;
}

@keyframes quantumFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.state-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.risk-state {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.state-name {
  color: #ffffff;
  font-weight: 500;
  min-width: 100px;
}

.probability {
  color: #aaaaaa;
  font-size: 0.9rem;
  min-width: 40px;
}

.probability-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.probability-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.7));
  transition: width 0.5s ease;
}

.attention-grid, .layer-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attention-head, .layer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.head-name, .layer-name {
  color: #ffffff;
  font-weight: 500;
  min-width: 80px;
}

.attention-score, .layer-accuracy {
  color: #aaaaaa;
  font-size: 0.9rem;
}

.attention-visualization {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
}

.attention-pattern {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.reward-metrics, .policy-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reward-item, .action-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.reward-value, .action-probability {
  color: #ffffff;
  font-weight: 600;
}

.generation-list, .insight-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.generation-item, .insight-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.report-title, .insight-text {
  color: #ffffff;
  font-weight: 500;
  flex: 1;
}

.generation-time {
  color: #aaaaaa;
  font-size: 0.9rem;
  margin: 0 1rem;
}

.quality-rating, .confidence-score {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.quality-rating.excellent, .confidence-score {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.quality-rating.good {
  background: rgba(255, 255, 255, 0.15);
  color: #cccccc;
}

.quality-rating.average {
  background: rgba(255, 255, 255, 0.1);
  color: #aaaaaa;
}

.innovation-lab {
  max-width: 1400px;
  margin: 2rem auto 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
}

.lab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.lab-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.3rem;
}

.status-indicator.experimental {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.experiment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.experiment-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
}

.experiment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.experiment-header h4 {
  margin: 0;
  color: #ffffff;
  font-size: 1.1rem;
}

.experiment-stage {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.experiment-stage.prototype {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.experiment-stage.research {
  background: rgba(255, 255, 255, 0.15);
  color: #cccccc;
}

.experiment-stage.concept {
  background: rgba(255, 255, 255, 0.1);
  color: #aaaaaa;
}

.experiment-description {
  color: #aaaaaa;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.experiment-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.7));
  transition: width 0.5s ease;
}

.progress-text {
  color: #aaaaaa;
  font-size: 0.9rem;
  font-weight: 600;
}

@media (max-width: 1200px) {
  .quantum-grid, .neural-grid, .generative-grid {
    grid-template-columns: 1fr;
  }
  
  .neural-card.large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .ai-breakthrough-workflows {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .breakthrough-stats {
    grid-template-columns: 1fr;
  }
  
  .category-tabs {
    flex-direction: column;
  }
  
  .experiment-grid {
    grid-template-columns: 1fr;
  }
}
</style> 