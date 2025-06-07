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
        <div class="workflow-category" @click="selectCategory('predictive')">
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
        <div class="workflow-category" @click="selectCategory('risk')">
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
        <div class="workflow-category" @click="selectCategory('portfolio')">
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

.hero-section {
  padding: 80px 20px 60px;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.workflow-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  max-width: 800px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.workflow-categories {
  padding: 40px 20px;
  background: white;
  margin: -30px 20px 0;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.1);
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.workflow-category {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.workflow-category:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
}

.category-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.category-icon i {
  font-size: 2rem;
  color: white;
}

.workflow-category h3 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.workflow-category p {
  color: #718096;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.category-stats {
  color: #667eea;
  font-weight: 600;
  font-size: 0.9rem;
}

.dashboard-section {
  padding: 40px 20px;
  background: #f7fafc;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.section-header h2 {
  font-size: 1.8rem;
  color: #2d3748;
  margin: 0;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  padding: 1.5rem;
  background: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-content {
  padding: 1.5rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.metric-item {
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.metric-label {
  display: block;
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  display: block;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.idle {
  background: #e2e8f0;
  color: #4a5568;
}

.status-badge.training {
  background: #ffeaa7;
  color: #d68910;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.training-form .form-group {
  margin-bottom: 1rem;
}

.training-form label {
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.training-form select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-train, .btn-generate, .btn-detect {
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.btn-train:hover, .btn-generate:hover, .btn-detect:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-train:disabled, .btn-generate:disabled, .btn-detect:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.training-progress {
  margin-top: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.feature-types {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #4a5568;
  font-size: 0.9rem;
}

.feature-count {
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.feature-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.feature-preview h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1rem;
}

.feature-list {
  space-y: 0.5rem;
}

.feature-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f7fafc;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.feature-name {
  color: #4a5568;
  font-size: 0.9rem;
}

.feature-importance {
  color: #667eea;
  font-weight: 600;
  font-size: 0.8rem;
}

.alert-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: background 0.3s ease;
}

.alert-indicator.active {
  background: #f56565;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.anomaly-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.anomaly-controls .form-group {
  margin: 0;
}

.anomaly-controls label {
  display: block;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.anomaly-controls select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.anomaly-results {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.result-summary {
  text-align: center;
  color: #4a5568;
}

.anomaly-rate {
  color: #718096;
  font-size: 0.9rem;
}

.refresh-btn {
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.refresh-btn:hover {
  background: #f7fafc;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.monitoring-section {
  padding: 40px 20px;
  background: white;
}

.monitoring-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-toggle {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-toggle.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.monitoring-controls select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.monitoring-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.monitoring-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
}

.monitoring-card h3 {
  margin: 0 0 1.5rem 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.status-list {
  space-y: 1rem;
}

.workflow-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.workflow-info {
  flex: 1;
}

.workflow-name {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.workflow-id {
  display: block;
  font-size: 0.8rem;
  color: #718096;
}

.workflow-progress {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.workflow-progress .progress-bar {
  flex: 1;
  height: 6px;
}

.progress-text {
  font-size: 0.8rem;
  color: #4a5568;
  min-width: 35px;
}

.workflow-status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.workflow-status.running {
  background: #ffeaa7;
  color: #d68910;
}

.workflow-status.completed {
  background: #d4edda;
  color: #155724;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
}

.chart-placeholder i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.workflows-library {
  padding: 40px 20px;
  background: #f7fafc;
}

.library-filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 300px;
}

.library-filters select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 2rem auto 0;
}

.workflow-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.workflow-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.workflow-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.workflow-icon i {
  color: white;
  font-size: 1.2rem;
}

.workflow-card h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.2rem;
}

.workflow-card p {
  color: #718096;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.workflow-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.category-tag {
  background: #e2e8f0;
  color: #4a5568;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.complexity-level {
  background: #ffeaa7;
  color: #d68910;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
}

.workflow-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-run, .btn-config {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.btn-run {
  background: #667eea;
  color: white;
}

.btn-config {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-run:hover, .btn-config:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .monitoring-grid {
    grid-template-columns: 1fr;
  }
  
  .workflows-grid {
    grid-template-columns: 1fr;
  }
  
  .workflow-stats {
    flex-direction: column;
    gap: 2rem;
  }
  
  .library-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
}
</style> 