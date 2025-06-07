<template>
  <div class="ai-workflows">
    <!-- Universe Background Effect -->
    <div class="universe-background">
      <div class="bubble" v-for="n in 15" :key="n" :style="getBubbleStyle(n)"></div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">
            <font-awesome-icon icon="fa-solid fa-cogs" class="workflow-icon" />
            AI Workflows
          </h1>
          <p class="subtitle">Hệ thống quy trình AI tự động - Tối ưu hóa và phân tích thông minh</p>
        </div>
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-value">{{ activeWorkflows }}</div>
            <div class="stat-label">Active Workflows</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ completedTasks }}</div>
            <div class="stat-label">Completed Tasks</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ efficiency }}%</div>
            <div class="stat-label">Efficiency Rate</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Workflow Categories -->
    <div class="workflow-categories">
      <div class="category-tabs">
        <button v-for="category in categories" :key="category.id"
                @click="activeCategory = category.id"
                :class="['category-tab', { active: activeCategory === category.id }]">
          <font-awesome-icon :icon="category.icon" />
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- Main Workflow Dashboard -->
    <div class="workflow-dashboard">
      
      <!-- Data Processing Workflows -->
      <div v-if="activeCategory === 'data'" class="workflow-section">
        <div class="section-header">
          <h2>Data Processing Workflows</h2>
          <div class="workflow-controls">
            <button @click="runDataProcessing" class="run-btn">
              <font-awesome-icon icon="fa-solid fa-play" />
              Run Processing
            </button>
          </div>
        </div>
        
        <div class="workflow-grid">
          <div class="workflow-card">
            <div class="card-header">
              <h3>Data Ingestion Pipeline</h3>
              <div class="status-indicator" :class="dataWorkflows.ingestion.status">
                {{ dataWorkflows.ingestion.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="pipeline-metrics">
                <div class="metric">
                  <span class="metric-label">Records Processed</span>
                  <span class="metric-value">{{ dataWorkflows.ingestion.recordsProcessed.toLocaleString() }}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Processing Rate</span>
                  <span class="metric-value">{{ dataWorkflows.ingestion.processingRate }}/sec</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Error Rate</span>
                  <span class="metric-value">{{ dataWorkflows.ingestion.errorRate }}%</span>
                </div>
              </div>
              <div class="data-sources">
                <h4>Active Data Sources</h4>
                <div class="source-list">
                  <div v-for="source in dataWorkflows.ingestion.sources" :key="source.name" 
                       class="source-item">
                    <span class="source-name">{{ source.name }}</span>
                    <span class="source-status" :class="source.status">{{ source.status }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="workflow-card">
            <div class="card-header">
              <h3>Data Quality Monitor</h3>
              <div class="status-indicator" :class="dataWorkflows.quality.status">
                {{ dataWorkflows.quality.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="quality-dashboard">
                <div class="quality-score">
                  <div class="score-circle">
                    <span class="score-value">{{ dataWorkflows.quality.overallScore }}</span>
                    <span class="score-label">Quality Score</span>
                  </div>
                </div>
                <div class="quality-metrics">
                  <div class="quality-item">
                    <span>Completeness</span>
                    <span class="quality-value">{{ dataWorkflows.quality.completeness }}%</span>
                  </div>
                  <div class="quality-item">
                    <span>Accuracy</span>
                    <span class="quality-value">{{ dataWorkflows.quality.accuracy }}%</span>
                  </div>
                  <div class="quality-item">
                    <span>Consistency</span>
                    <span class="quality-value">{{ dataWorkflows.quality.consistency }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analysis Workflows -->
      <div v-if="activeCategory === 'analysis'" class="workflow-section">
        <div class="section-header">
          <h2>Analysis Workflows</h2>
          <div class="workflow-controls">
            <button @click="runAnalysis" class="run-btn">
              <font-awesome-icon icon="fa-solid fa-chart-line" />
              Run Analysis
            </button>
          </div>
        </div>
        
        <div class="workflow-grid">
          <div class="workflow-card large">
            <div class="card-header">
              <h3>Predictive Analytics Engine</h3>
              <div class="status-indicator active">running</div>
            </div>
            <div class="card-content">
              <div class="analysis-dashboard">
                <div class="model-performance">
                  <h4>Model Performance</h4>
                  <div class="model-grid">
                    <div v-for="model in analysisWorkflows.models" :key="model.name" 
                         class="model-item">
                      <span class="model-name">{{ model.name }}</span>
                      <span class="model-accuracy">{{ model.accuracy }}%</span>
                      <span class="model-status" :class="model.status">{{ model.status }}</span>
                    </div>
                  </div>
                </div>
                <div class="predictions">
                  <h4>Recent Predictions</h4>
                  <div class="prediction-list">
                    <div v-for="prediction in analysisWorkflows.predictions" :key="prediction.id" 
                         class="prediction-item">
                      <span class="prediction-target">{{ prediction.target }}</span>
                      <span class="prediction-value">{{ prediction.value }}</span>
                      <span class="prediction-confidence">{{ prediction.confidence }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Automation Workflows -->
      <div v-if="activeCategory === 'automation'" class="workflow-section">
        <div class="section-header">
          <h2>Automation Workflows</h2>
          <div class="workflow-controls">
            <button @click="deployAutomation" class="run-btn">
              <font-awesome-icon icon="fa-solid fa-robot" />
              Deploy Automation
            </button>
          </div>
        </div>
        
        <div class="workflow-grid">
          <div class="workflow-card">
            <div class="card-header">
              <h3>Task Automation Bot</h3>
              <div class="status-indicator" :class="automationWorkflows.taskBot.status">
                {{ automationWorkflows.taskBot.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="bot-metrics">
                <div class="metric-row">
                  <div class="metric">
                    <span class="metric-label">Tasks Completed</span>
                    <span class="metric-value">{{ automationWorkflows.taskBot.tasksCompleted }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Success Rate</span>
                    <span class="metric-value">{{ automationWorkflows.taskBot.successRate }}%</span>
                  </div>
                </div>
                <div class="recent-tasks">
                  <h4>Recent Tasks</h4>
                  <div class="task-list">
                    <div v-for="task in automationWorkflows.taskBot.recentTasks" :key="task.id" 
                         class="task-item">
                      <span class="task-name">{{ task.name }}</span>
                      <span class="task-status" :class="task.status">{{ task.status }}</span>
                      <span class="task-duration">{{ task.duration }}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="workflow-card">
            <div class="card-header">
              <h3>Report Generator</h3>
              <div class="status-indicator" :class="automationWorkflows.reportGen.status">
                {{ automationWorkflows.reportGen.status }}
              </div>
            </div>
            <div class="card-content">
              <div class="report-dashboard">
                <div class="generation-stats">
                  <div class="stat">
                    <span class="stat-label">Reports Generated</span>
                    <span class="stat-value">{{ automationWorkflows.reportGen.reportsGenerated }}</span>
                  </div>
                  <div class="stat">
                    <span class="stat-label">Avg Generation Time</span>
                    <span class="stat-value">{{ automationWorkflows.reportGen.avgTime }}s</span>
                  </div>
                </div>
                <div class="scheduled-reports">
                  <h4>Scheduled Reports</h4>
                  <div class="schedule-list">
                    <div v-for="report in automationWorkflows.reportGen.scheduled" :key="report.id" 
                         class="schedule-item">
                      <span class="report-name">{{ report.name }}</span>
                      <span class="report-frequency">{{ report.frequency }}</span>
                      <span class="next-run">{{ report.nextRun }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Workflow Execution Log -->
    <div class="execution-log">
      <div class="log-header">
        <h3>Execution Log</h3>
        <button @click="clearLog" class="clear-btn">Clear</button>
      </div>
      <div class="log-content">
        <div v-for="entry in executionLog" :key="entry.id" 
             :class="['log-entry', entry.type]">
          <span class="log-time">{{ formatTime(entry.timestamp) }}</span>
          <span class="log-message">{{ entry.message }}</span>
          <span class="log-status" :class="entry.status">{{ entry.status }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faPlay, faRobot, faChartLine, faCogs
} from '@fortawesome/free-solid-svg-icons';

library.add(faPlay, faRobot, faChartLine, faCogs);

export default {
  name: 'AIWorkflowsPage',
  components: { FontAwesomeIcon },
  data() {
    return {
      activeWorkflows: 8,
      completedTasks: 1247,
      efficiency: 94.2,
      activeCategory: 'data',

      categories: [
        { id: 'data', name: 'Data Processing', icon: 'fa-solid fa-cogs' },
        { id: 'analysis', name: 'Analysis', icon: 'fa-solid fa-chart-line' },
        { id: 'automation', name: 'Automation', icon: 'fa-solid fa-robot' }
      ],

      dataWorkflows: {
        ingestion: {
          status: 'active',
          recordsProcessed: 2847392,
          processingRate: 1250,
          errorRate: 0.02,
          sources: [
            { name: 'Market Data API', status: 'connected' },
            { name: 'News Feed', status: 'connected' },
            { name: 'Social Media', status: 'warning' },
            { name: 'Economic Data', status: 'connected' }
          ]
        },
        quality: {
          status: 'monitoring',
          overallScore: 96,
          completeness: 98.5,
          accuracy: 94.2,
          consistency: 96.8
        }
      },

      analysisWorkflows: {
        models: [
          { name: 'LSTM Predictor', accuracy: 87.3, status: 'active' },
          { name: 'Random Forest', accuracy: 82.1, status: 'active' },
          { name: 'XGBoost', accuracy: 89.7, status: 'training' },
          { name: 'Neural Network', accuracy: 91.2, status: 'active' }
        ],
        predictions: [
          { id: 1, target: 'AAPL Price', value: '$198.50', confidence: 87 },
          { id: 2, target: 'Market Trend', value: 'Bullish', confidence: 73 },
          { id: 3, target: 'VIX Level', value: '16.8', confidence: 82 }
        ]
      },

      automationWorkflows: {
        taskBot: {
          status: 'active',
          tasksCompleted: 342,
          successRate: 96.8,
          recentTasks: [
            { id: 1, name: 'Data Backup', status: 'completed', duration: 45 },
            { id: 2, name: 'Model Training', status: 'running', duration: 120 },
            { id: 3, name: 'Report Generation', status: 'completed', duration: 23 }
          ]
        },
        reportGen: {
          status: 'active',
          reportsGenerated: 156,
          avgTime: 12.3,
          scheduled: [
            { id: 1, name: 'Daily Market Summary', frequency: 'Daily', nextRun: '09:00 AM' },
            { id: 2, name: 'Weekly Performance', frequency: 'Weekly', nextRun: 'Monday 08:00 AM' },
            { id: 3, name: 'Monthly Analysis', frequency: 'Monthly', nextRun: '1st of Month' }
          ]
        }
      },

      executionLog: [
        {
          id: 1,
          timestamp: Date.now() - 300000,
          message: 'Data processing workflow completed successfully',
          type: 'success',
          status: 'completed'
        },
        {
          id: 2,
          timestamp: Date.now() - 600000,
          message: 'Model training initiated for LSTM predictor',
          type: 'info',
          status: 'running'
        },
        {
          id: 3,
          timestamp: Date.now() - 900000,
          message: 'Quality check detected anomaly in data source',
          type: 'warning',
          status: 'alert'
        }
      ]
    };
  },

  mounted() {
    this.startRealTimeUpdates();
  },

  methods: {
    runDataProcessing() {
      this.addLogEntry('Data processing workflow started', 'info', 'running');
      setTimeout(() => {
        this.addLogEntry('Data processing completed successfully', 'success', 'completed');
      }, 3000);
    },

    runAnalysis() {
      this.addLogEntry('Analysis workflow initiated', 'info', 'running');
      setTimeout(() => {
        this.addLogEntry('Analysis completed with 94% accuracy', 'success', 'completed');
      }, 4000);
    },

    deployAutomation() {
      this.addLogEntry('Automation deployment started', 'info', 'deploying');
      setTimeout(() => {
        this.addLogEntry('Automation successfully deployed', 'success', 'active');
      }, 2500);
    },

    clearLog() {
      this.executionLog = [];
    },

    addLogEntry(message, type, status) {
      this.executionLog.unshift({
        id: Date.now(),
        timestamp: Date.now(),
        message,
        type,
        status
      });
      
      if (this.executionLog.length > 20) {
        this.executionLog = this.executionLog.slice(0, 20);
      }
    },

    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },

    getBubbleStyle(index) {
      const size = Math.random() * 50 + 15;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 15;
      const animationDuration = Math.random() * 8 + 12;
      const opacity = Math.random() * 0.25 + 0.05;
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`,
        opacity: opacity
      };
    },

    startRealTimeUpdates() {
      setInterval(() => {
        this.dataWorkflows.ingestion.recordsProcessed += Math.floor(Math.random() * 1000);
        this.completedTasks += Math.floor(Math.random() * 3);
        this.efficiency = Math.max(90, Math.min(100, this.efficiency + (Math.random() - 0.5) * 2));
      }, 5000);
    }
  }
};
</script>

<style scoped>
.ai-workflows {
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2a2a2a 100%);
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
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  animation: floatUp linear infinite;
  backdrop-filter: blur(1px);
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
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #cccccc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.workflow-icon {
  color: #ffffff;
}

.subtitle {
  font-size: 1.1rem;
  color: #999999;
  margin: 0;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #999999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.workflow-categories {
  max-width: 1400px;
  margin: 0 auto 2rem auto;
  position: relative;
  z-index: 1;
}

.category-tabs {
  display: flex;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 0.5rem;
}

.category-tab {
  flex: 1;
  background: transparent;
  border: none;
  color: #999999;
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
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.category-tab.active {
  background: #ffffff;
  color: #000000;
  font-weight: 600;
}

.workflow-dashboard {
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-header h2 {
  font-size: 1.5rem;
  color: #ffffff;
  margin: 0;
}

.run-btn {
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

.run-btn:hover {
  background: #cccccc;
  transform: translateY(-2px);
}

.workflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.workflow-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
}

.workflow-card.large {
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
  font-size: 1.1rem;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-indicator.active {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.status-indicator.monitoring {
  background: rgba(255, 255, 255, 0.1);
  color: #999999;
}

.metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.metric-label {
  color: #999999;
  font-size: 0.9rem;
}

.metric-value {
  color: #ffffff;
  font-weight: 600;
}

.source-list, .task-list, .schedule-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.source-item, .task-item, .schedule-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.source-name, .task-name, .report-name {
  color: #ffffff;
  font-weight: 500;
}

.source-status, .task-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.source-status.connected, .task-status.completed {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.source-status.warning {
  background: rgba(255, 153, 153, 0.2);
  color: #ff9999;
}

.task-status.running {
  background: rgba(255, 255, 255, 0.15);
  color: #cccccc;
}

.quality-dashboard {
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 2rem;
  align-items: center;
}

.score-circle {
  width: 120px;
  height: 120px;
  border: 8px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.score-label {
  font-size: 0.8rem;
  color: #999999;
}

.quality-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quality-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.quality-value {
  font-weight: 600;
  color: #ffffff;
}

.execution-log {
  max-width: 1400px;
  margin: 2rem auto 0 auto;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  z-index: 1;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.log-header h3 {
  margin: 0;
  color: #ffffff;
}

.clear-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #999999;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.log-content {
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  border-left: 3px solid;
}

.log-entry.success {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: #ffffff;
}

.log-entry.warning {
  background: rgba(255, 255, 255, 0.03);
  border-left-color: #ff9999;
}

.log-entry.info {
  background: rgba(255, 255, 255, 0.02);
  border-left-color: #cccccc;
}

.log-time {
  font-size: 0.8rem;
  color: #999999;
  font-family: monospace;
}

.log-message {
  color: #ffffff;
}

.log-status {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.log-status.completed {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.log-status.alert {
  background: rgba(255, 153, 153, 0.2);
  color: #ff9999;
}

.log-status.running {
  background: rgba(255, 255, 255, 0.15);
  color: #cccccc;
}

@media (max-width: 1200px) {
  .workflow-grid {
    grid-template-columns: 1fr;
  }
  
  .workflow-card.large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .ai-workflows {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .stats-overview {
    grid-template-columns: 1fr;
  }
  
  .category-tabs {
    flex-direction: column;
  }
  
  .quality-dashboard {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style> 