<template>
  <div class="ai-workflows">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">AI Finance Workflows</h1>
        <p class="hero-subtitle">Automate your financial analysis with intelligent AI workflows</p>
        <div class="workflow-stats">
          <div class="stat-card">
            <div class="stat-number">{{ activeWorkflows }}</div>
            <div class="stat-label">Active Workflows</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ totalExecutions.toLocaleString() }}</div>
            <div class="stat-label">Total Executions</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">{{ averageAccuracy }}%</div>
            <div class="stat-label">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow Categories -->
    <div class="workflow-categories">
      <div class="category-grid">
        <!-- Data Processing -->
        <div class="workflow-category" @click="selectCategory('data-processing')">
          <div class="category-icon">
            <i class="fas fa-database"></i>
          </div>
          <h3>Data Processing</h3>
          <p>Automated data ingestion, cleaning, and transformation workflows</p>
          <div class="category-stats">
            <span>5 workflows available</span>
          </div>
        </div>

        <!-- Predictive Analytics -->
        <div class="workflow-category" data-category="predictive" @click="selectCategory('predictive')">
          <div class="category-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <h3>Predictive Analytics</h3>
          <p>ML models for forecasting and prediction tasks</p>
          <div class="category-stats">
            <span>8 workflows available</span>
          </div>
        </div>

        <!-- Risk Assessment -->
        <div class="workflow-category" data-category="risk" @click="selectCategory('risk')">
          <div class="category-icon">
            <i class="fas fa-shield-alt"></i>
          </div>
          <h3>Risk Assessment</h3>
          <p>Automated risk analysis and monitoring systems</p>
          <div class="category-stats">
            <span>6 workflows available</span>
          </div>
        </div>

        <!-- Portfolio Optimization -->
        <div class="workflow-category" data-category="portfolio" @click="selectCategory('portfolio')">
          <div class="category-icon">
            <i class="fas fa-balance-scale"></i>
          </div>
          <h3>Portfolio Optimization</h3>
          <p>AI-driven portfolio construction and rebalancing</p>
          <div class="category-stats">
            <span>4 workflows available</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Workflows Dashboard -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2>Workflow Dashboard</h2>
        <button @click="createNewWorkflow" class="btn-primary">
          <i class="fas fa-plus"></i> Create Workflow
        </button>
      </div>

      <div class="dashboard-grid">
        <!-- Real-time Analytics -->
        <div class="dashboard-card analytics-card">
          <div class="card-header">
            <h3>Real-time Analytics</h3>
            <button @click="refreshAnalytics" class="refresh-btn">
              <i class="fas fa-sync-alt" :class="{ spinning: refreshingAnalytics }"></i>
            </button>
          </div>
          <div class="card-content">
            <div v-if="realTimeData" class="analytics-grid">
              <div class="metric-item">
                <span class="metric-label">Active Models</span>
                <span class="metric-value">{{ realTimeData.current_metrics?.active_models || 0 }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Predictions/Hour</span>
                <span class="metric-value">{{ realTimeData.current_metrics?.predictions_generated || 0 }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Accuracy Rate</span>
                <span class="metric-value">{{ realTimeData.current_metrics?.accuracy_rate?.toFixed(1) || 0 }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Latency</span>
                <span class="metric-value">{{ realTimeData.current_metrics?.processing_latency?.toFixed(1) || 0 }}ms</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Model Training -->
        <div class="dashboard-card training-card">
          <div class="card-header">
            <h3>Model Training</h3>
            <span class="status-badge" :class="trainingStatus">{{ trainingStatus }}</span>
          </div>
          <div class="card-content">
            <div class="training-form">
              <div class="form-group">
                <label>Model Type</label>
                <select v-model="trainingConfig.modelType">
                  <option value="lstm">LSTM Neural Network</option>
                  <option value="random_forest">Random Forest</option>
                  <option value="xgboost">XGBoost</option>
                  <option value="neural_network">Deep Neural Network</option>
                </select>
              </div>
              <div class="form-group">
                <label>Training Data</label>
                <select v-model="trainingConfig.trainingData">
                  <option value="market_data">Market Data (5Y)</option>
                  <option value="financial_ratios">Financial Ratios</option>
                  <option value="alternative_data">Alternative Data</option>
                </select>
              </div>
              <button @click="startTraining" class="btn-train" :disabled="isTraining">
                <i class="fas fa-play"></i>
                {{ isTraining ? 'Training...' : 'Start Training' }}
              </button>
            </div>
            <div v-if="trainingResult" class="training-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: trainingResult.progress + '%' }"></div>
              </div>
              <p>{{ trainingResult.status }}</p>
            </div>
          </div>
        </div>

        <!-- Feature Engineering -->
        <div class="dashboard-card features-card">
          <div class="card-header">
            <h3>Feature Engineering</h3>
            <span class="feature-count">{{ generatedFeatures?.total_features || 0 }} features</span>
          </div>
          <div class="card-content">
            <div class="feature-types">
              <label v-for="type in featureTypes" :key="type" class="checkbox-label">
                <input type="checkbox" v-model="selectedFeatureTypes" :value="type">
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
              </label>
            </div>
            <button @click="generateFeatures" class="btn-generate" :disabled="generatingFeatures">
              <i class="fas fa-cogs"></i>
              {{ generatingFeatures ? 'Generating...' : 'Generate Features' }}
            </button>
            <div v-if="generatedFeatures" class="feature-preview">
              <h4>Generated Features Preview</h4>
              <div class="feature-list">
                <div v-for="feature in generatedFeatures.features?.slice(0, 5)" :key="feature.name" 
                     class="feature-item">
                  <span class="feature-name">{{ feature.name }}</span>
                  <span class="feature-importance">{{ (feature.importance_score * 100).toFixed(1) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Anomaly Detection -->
        <div class="dashboard-card anomaly-card">
          <div class="card-header">
            <h3>Anomaly Detection</h3>
            <div class="alert-indicator" :class="{ active: hasAnomalies }"></div>
          </div>
          <div class="card-content">
            <div class="anomaly-controls">
              <div class="form-group">
                <label>Sensitivity</label>
                <select v-model="anomalyConfig.sensitivity">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div class="form-group">
                <label>Algorithm</label>
                <select v-model="anomalyConfig.algorithm">
                  <option value="isolation_forest">Isolation Forest</option>
                  <option value="one_class_svm">One-Class SVM</option>
                  <option value="autoencoder">Autoencoder</option>
                </select>
              </div>
            </div>
            <button @click="detectAnomalies" class="btn-detect" :disabled="detectingAnomalies">
              <i class="fas fa-search"></i>
              {{ detectingAnomalies ? 'Detecting...' : 'Run Detection' }}
            </button>
            <div v-if="anomalyResults" class="anomaly-results">
              <div class="result-summary">
                <span>{{ anomalyResults.anomalies_detected }} anomalies found</span>
                <span class="anomaly-rate">({{ anomalyResults.anomaly_rate }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow Monitoring -->
    <div class="monitoring-section">
      <div class="section-header">
        <h2>Workflow Monitoring</h2>
        <div class="monitoring-controls">
          <button @click="toggleAutoRefresh" class="btn-toggle" :class="{ active: autoRefresh }">
            <i class="fas fa-sync"></i> Auto Refresh
          </button>
          <select v-model="monitoringTimeframe">
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      <div class="monitoring-grid">
        <div class="monitoring-card">
          <h3>Workflow Status</h3>
          <div v-if="workflowStatus" class="status-list">
            <div v-for="workflow in workflowStatus.active_workflows" :key="workflow.id" 
                 class="workflow-item">
              <div class="workflow-info">
                <span class="workflow-name">{{ workflow.type }}</span>
                <span class="workflow-id">{{ workflow.id }}</span>
              </div>
              <div class="workflow-progress">
                <div class="progress-bar">
                  <div class="progress-fill" :style="{ width: workflow.progress + '%' }"></div>
                </div>
                <span class="progress-text">{{ workflow.progress }}%</span>
              </div>
              <span class="workflow-status" :class="workflow.status">{{ workflow.status }}</span>
            </div>
          </div>
        </div>

        <div class="monitoring-card">
          <h3>Performance Metrics</h3>
          <div class="performance-chart">
            <!-- Chart placeholder -->
            <div class="chart-placeholder">
              <i class="fas fa-chart-area"></i>
              <p>Performance Chart</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Available Workflows -->
    <div class="workflows-library">
      <div class="section-header">
        <h2>Workflow Library</h2>
        <div class="library-filters">
          <input v-model="searchQuery" type="text" placeholder="Search workflows..." class="search-input">
          <select v-model="categoryFilter">
            <option value="">All Categories</option>
            <option value="data-processing">Data Processing</option>
            <option value="predictive">Predictive Analytics</option>
            <option value="risk">Risk Assessment</option>
            <option value="portfolio">Portfolio Optimization</option>
          </select>
        </div>
      </div>

      <div class="workflows-grid">
        <div v-for="workflow in filteredWorkflows" :key="workflow.id" 
             class="workflow-card" @click="selectWorkflow(workflow)">
          <div class="workflow-icon">
            <i :class="workflow.icon"></i>
          </div>
          <h3>{{ workflow.name }}</h3>
          <p>{{ workflow.description }}</p>
          <div class="workflow-meta">
            <span class="category-tag">{{ workflow.category }}</span>
            <span class="complexity-level">{{ workflow.complexity }}</span>
          </div>
          <div class="workflow-actions">
            <button @click.stop="runWorkflow(workflow)" class="btn-run">
              <i class="fas fa-play"></i> Run
            </button>
            <button @click.stop="configureWorkflow(workflow)" class="btn-config">
              <i class="fas fa-cog"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AIWorkflowsPage',
  data() {
    return {
      // Stats
      activeWorkflows: 12,
      totalExecutions: 45823,
      averageAccuracy: 91.7,

      // Real-time data
      realTimeData: null,
      refreshingAnalytics: false,
      autoRefresh: true,
      monitoringTimeframe: '24h',

      // Training
      trainingConfig: {
        modelType: 'lstm',
        trainingData: 'market_data'
      },
      trainingResult: null,
      isTraining: false,
      trainingStatus: 'idle',

      // Features
      featureTypes: ['technical', 'fundamental', 'alternative', 'macro'],
      selectedFeatureTypes: ['technical', 'fundamental'],
      generatedFeatures: null,
      generatingFeatures: false,

      // Anomaly detection
      anomalyConfig: {
        sensitivity: 'medium',
        algorithm: 'isolation_forest'
      },
      anomalyResults: null,
      detectingAnomalies: false,
      hasAnomalies: false,

      // Monitoring
      workflowStatus: null,

      // Library
      searchQuery: '',
      categoryFilter: '',
      
      // Available workflows
      availableWorkflows: [
        {
          id: 1,
          name: 'Market Data Ingestion',
          description: 'Automated real-time market data collection and processing',
          category: 'data-processing',
          complexity: 'Medium',
          icon: 'fas fa-download',
          estimatedTime: '5-10 minutes'
        },
        {
          id: 2,
          name: 'LSTM Price Prediction',
          description: 'Deep learning model for stock price forecasting',
          category: 'predictive',
          complexity: 'High',
          icon: 'fas fa-brain',
          estimatedTime: '30-60 minutes'
        },
        {
          id: 3,
          name: 'Portfolio Risk Analysis',
          description: 'Comprehensive risk assessment and VaR calculation',
          category: 'risk',
          complexity: 'Medium',
          icon: 'fas fa-exclamation-triangle',
          estimatedTime: '10-15 minutes'
        },
        {
          id: 4,
          name: 'Mean Reversion Strategy',
          description: 'Automated mean reversion trading strategy',
          category: 'portfolio',
          complexity: 'High',
          icon: 'fas fa-arrows-alt-h',
          estimatedTime: '20-30 minutes'
        },
        {
          id: 5,
          name: 'Sentiment Analysis Pipeline',
          description: 'News and social media sentiment analysis',
          category: 'data-processing',
          complexity: 'Medium',
          icon: 'fas fa-comments',
          estimatedTime: '15-20 minutes'
        },
        {
          id: 6,
          name: 'Correlation Analysis',
          description: 'Asset correlation and clustering analysis',
          category: 'risk',
          complexity: 'Low',
          icon: 'fas fa-project-diagram',
          estimatedTime: '5-10 minutes'
        }
      ]
    };
  },

  computed: {
    filteredWorkflows() {
      let workflows = this.availableWorkflows;
      
      if (this.searchQuery) {
        workflows = workflows.filter(w => 
          w.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          w.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      
      if (this.categoryFilter) {
        workflows = workflows.filter(w => w.category === this.categoryFilter);
      }
      
      return workflows;
    }
  },

  mounted() {
    this.loadInitialData();
    this.startAutoRefresh();
  },

  beforeUnmount() {
    this.stopAutoRefresh();
  },

  methods: {
    async loadInitialData() {
      await Promise.all([
        this.refreshAnalytics(),
        this.loadWorkflowStatus()
      ]);
    },

    async refreshAnalytics() {
      this.refreshingAnalytics = true;
      try {
        const response = await axios.get('/api/ai-workflows/analytics/real-time');
        if (response.data.success) {
          this.realTimeData = response.data.data;
        }
      } catch (error) {
        console.error('Analytics error:', error);
      } finally {
        this.refreshingAnalytics = false;
      }
    },

    async startTraining() {
      this.isTraining = true;
      this.trainingStatus = 'starting';
      
      try {
        const response = await axios.post('/api/ai-workflows/models/train', this.trainingConfig);
        if (response.data.success) {
          this.trainingResult = response.data.data;
          this.trainingStatus = 'training';
          this.monitorTrainingProgress();
        }
      } catch (error) {
        console.error('Training error:', error);
        this.trainingStatus = 'error';
      } finally {
        this.isTraining = false;
      }
    },

    monitorTrainingProgress() {
      const interval = setInterval(() => {
        this.trainingResult.progress = Math.min(100, this.trainingResult.progress + Math.random() * 10);
        
        if (this.trainingResult.progress >= 100) {
          this.trainingStatus = 'completed';
          clearInterval(interval);
        }
      }, 2000);
    },

    async generateFeatures() {
      this.generatingFeatures = true;
      
      try {
        const response = await axios.post('/api/ai-workflows/feature-engineering', {
          dataset: 'market_data',
          targetVariable: 'price_return',
          featureTypes: this.selectedFeatureTypes
        });
        
        if (response.data.success) {
          this.generatedFeatures = response.data.data;
        }
      } catch (error) {
        console.error('Feature generation error:', error);
      } finally {
        this.generatingFeatures = false;
      }
    },

    async detectAnomalies() {
      this.detectingAnomalies = true;
      
      try {
        // Simulate data for anomaly detection
        const mockData = Array.from({length: 1000}, () => Math.random() * 100);
        
        const response = await axios.post('/api/ai-workflows/anomaly-detection', {
          data: mockData,
          ...this.anomalyConfig
        });
        
        if (response.data.success) {
          this.anomalyResults = response.data.data;
          this.hasAnomalies = this.anomalyResults.anomalies_detected > 0;
        }
      } catch (error) {
        console.error('Anomaly detection error:', error);
      } finally {
        this.detectingAnomalies = false;
      }
    },

    async loadWorkflowStatus() {
      try {
        const response = await axios.get('/api/ai-workflows/workflows/status');
        if (response.data.success) {
          this.workflowStatus = response.data.data;
        }
      } catch (error) {
        console.error('Workflow status error:', error);
      }
    },

    startAutoRefresh() {
      if (this.autoRefresh) {
        this.refreshInterval = setInterval(() => {
          this.refreshAnalytics();
          this.loadWorkflowStatus();
        }, 30000); // Refresh every 30 seconds
      }
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
    },

    toggleAutoRefresh() {
      this.autoRefresh = !this.autoRefresh;
      if (this.autoRefresh) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    },

    selectCategory(category) {
      this.categoryFilter = category;
    },

    createNewWorkflow() {
      this.$toast.info('Workflow builder coming soon');
    },

    selectWorkflow(workflow) {
      this.$toast.info(`Selected workflow: ${workflow.name}`);
    },

    runWorkflow(workflow) {
      this.$toast.success(`Starting workflow: ${workflow.name}`);
      // Simulate workflow execution
    },

    configureWorkflow(workflow) {
      this.$toast.info(`Configuring workflow: ${workflow.name}`);
    }
  }
};
</script>

<style scoped>
.ai-workflows {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  color: white;
  position: relative;
  overflow-x: hidden;
}

.ai-workflows::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.01) 0%, transparent 50%);
  background-size: 800px 800px, 600px 600px, 400px 400px;
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.hero-section {
  padding: 120px 20px 80px;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.9) 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%),
    linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%);
  background-size: 100px 100px, 50px 50px;
  animation: grid-move 15s linear infinite;
  pointer-events: none;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(100px, 50px); }
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 50px rgba(255, 255, 255, 0.3);
  letter-spacing: -2px;
  animation: glow-pulse 3s ease-in-out infinite;
  position: relative;
  z-index: 3;
}

@keyframes glow-pulse {
  0%, 100% { 
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.2));
  }
  50% { 
    filter: drop-shadow(0 0 40px rgba(255, 255, 255, 0.4));
  }
}

.hero-subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 3rem;
  font-weight: 300;
  letter-spacing: 0.5px;
  line-height: 1.6;
}

.workflow-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  flex-wrap: wrap;
}

.stat-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  min-width: 180px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: rotate 4s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.05);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  position: relative;
  z-index: 1;
}

.workflow-categories {
  padding: 80px 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.workflow-category {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.workflow-category::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.workflow-category:hover::before {
  opacity: 1;
}

.workflow-category:hover {
  transform: translateY(-12px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(255, 255, 255, 0.1);
}

.category-icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.category-icon::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  to { transform: rotate(360deg); }
}

.category-icon i {
  font-size: 2.5rem;
  color: white;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  z-index: 1;
  position: relative;
}

.workflow-category h3 {
  color: #ffffff;
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.workflow-category p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
}

.category-stats {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: inline-block;
}

.dashboard-section {
  padding: 80px 20px;
  background: linear-gradient(180deg, rgba(5, 5, 5, 1) 0%, rgba(0, 0, 0, 1) 100%);
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  font-size: 2.5rem;
  color: #ffffff;
  margin: 0;
  font-weight: 800;
  letter-spacing: -1px;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.4s ease;
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  font-size: 1rem;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.btn-primary:hover::before {
  left: 100%;
}

.btn-primary:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-card {
  background: linear-gradient(145deg, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.95));
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  transition: all 0.4s ease;
  backdrop-filter: blur(20px);
  position: relative;
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
}

.dashboard-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.card-header {
  padding: 2rem 2rem 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.card-content {
  padding: 2rem;
}

/* Training and Form Styles */
.training-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.form-group select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.form-group select option {
  background: #1a1a1a;
  color: white;
}

.btn-train, .btn-generate, .btn-toggle {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.btn-train:hover, .btn-generate:hover, .btn-toggle:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08));
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.btn-train:disabled, .btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-toggle.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  border-color: rgba(255, 255, 255, 0.3);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  border-radius: 4px;
  transition: width 0.3s ease;
  animation: progress-glow 2s ease-in-out infinite;
}

@keyframes progress-glow {
  0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.2); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.4); }
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.metric-item {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.metric-item:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
  transform: translateY(-2px);
}

.metric-label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.metric-value {
  display: block;
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-badge.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

/* Feature Engineering */
.feature-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.3s ease;
}

.checkbox-label:hover {
  color: white;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: white;
}

.feature-count {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.feature-preview {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-preview h4 {
  margin: 0 0 1.2rem 0;
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 600;
}

.feature-list {
  space-y: 0.8rem;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: 10px;
  margin-bottom: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04));
}

.feature-name {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  font-weight: 500;
}

.feature-importance {
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

/* Anomaly Detection */
.alert-indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.alert-indicator.active {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
  animation: pulse-alert 2s infinite;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

@keyframes pulse-alert {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.anomaly-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.anomaly-controls .form-group {
  margin: 0;
}

.anomaly-controls label {
  display: block;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.anomaly-controls select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.anomaly-controls select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.anomaly-controls select option {
  background: #1a1a1a;
  color: white;
}

.anomaly-results {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.result-summary {
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
}

.anomaly-rate {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.refresh-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.monitoring-section {
  padding: 60px 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(5, 5, 5, 1) 100%);
}

.monitoring-controls {
  display: flex;
  gap: 1.2rem;
  align-items: center;
  flex-wrap: wrap;
}

.monitoring-controls select {
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.monitoring-controls select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
}

.monitoring-controls select option {
  background: #1a1a1a;
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .workflow-stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .category-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .anomaly-controls {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
}
</style> 