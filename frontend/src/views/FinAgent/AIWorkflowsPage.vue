<template>
  <div class="ai-workflows-container">
    <!-- Header Section -->
    <div class="workflows-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="main-title">AI Workflows</h1>
          <p class="subtitle">Automate your financial analysis with intelligent workflows</p>
        </div>
        <div class="header-actions">
          <button @click="showCreateWorkflowModal = true" class="create-btn">
            <font-awesome-icon icon="fa-solid fa-plus" />
            Create Workflow
          </button>
          <button @click="refreshWorkflows" class="refresh-btn">
            <font-awesome-icon icon="fa-solid fa-refresh" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filter and Search Section -->
    <div class="filter-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
          <input 
            v-model="searchQuery" 
            placeholder="Search workflows..."
            class="search-input"
          />
        </div>
      </div>
      <div class="filter-controls">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="market-analysis">Market Analysis</option>
          <option value="portfolio-management">Portfolio Management</option>
          <option value="risk-assessment">Risk Assessment</option>
          <option value="trading-signals">Trading Signals</option>
          <option value="research">Research</option>
        </select>
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>
    </div>

    <!-- Workflows Grid -->
    <div class="workflows-grid">
      <div 
        v-for="workflow in filteredWorkflows" 
        :key="workflow.id"
        :class="['workflow-card', workflow.status]"
        @click="openWorkflowDetails(workflow)"
      >
        <div class="workflow-header">
          <div class="workflow-icon">
            <font-awesome-icon :icon="workflow.icon" />
          </div>
          <div class="workflow-actions">
            <button @click.stop="toggleWorkflow(workflow)" class="action-btn">
              <font-awesome-icon :icon="workflow.status === 'active' ? 'fa-solid fa-pause' : 'fa-solid fa-play'" />
            </button>
            <button @click.stop="editWorkflow(workflow)" class="action-btn">
              <font-awesome-icon icon="fa-solid fa-edit" />
            </button>
          </div>
        </div>
        
        <div class="workflow-content">
          <h3 class="workflow-title">{{ workflow.name }}</h3>
          <p class="workflow-description">{{ workflow.description }}</p>
          
          <div class="workflow-tags">
            <span 
              v-for="tag in workflow.tags" 
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
          
          <div class="workflow-stats">
            <div class="stat">
              <span class="stat-label">Runs:</span>
              <span class="stat-value">{{ workflow.runs }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Success Rate:</span>
              <span class="stat-value">{{ workflow.successRate }}%</span>
            </div>
          </div>
          
          <div class="workflow-schedule">
            <div class="schedule-info">
              <span class="schedule-icon">
                <font-awesome-icon icon="fa-solid fa-clock" />
              </span>
              <span class="schedule-text">{{ workflow.schedule }}</span>
            </div>
            <div class="last-run">
              Last run: {{ formatDate(workflow.lastRun) }}
            </div>
          </div>
        </div>
        
        <div class="workflow-status">
          <span :class="['status-badge', workflow.status]">
            {{ workflow.status.toUpperCase() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Create Workflow Modal -->
    <div v-if="showCreateWorkflowModal" class="modal-overlay" @click="showCreateWorkflowModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Create New Workflow</h2>
          <button @click="showCreateWorkflowModal = false" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label for="workflowName">Workflow Name</label>
            <input 
              id="workflowName"
              v-model="newWorkflow.name" 
              placeholder="Enter workflow name"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label for="workflowDescription">Description</label>
            <textarea 
              id="workflowDescription"
              v-model="newWorkflow.description" 
              placeholder="Describe what this workflow does"
              class="form-textarea"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="workflowCategory">Category</label>
            <select id="workflowCategory" v-model="newWorkflow.category" class="form-select">
              <option value="">Select Category</option>
              <option value="market-analysis">Market Analysis</option>
              <option value="portfolio-management">Portfolio Management</option>
              <option value="risk-assessment">Risk Assessment</option>
              <option value="trading-signals">Trading Signals</option>
              <option value="research">Research</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Workflow Template</label>
            <div class="template-grid">
              <div 
                v-for="template in workflowTemplates" 
                :key="template.id"
                :class="['template-card', { selected: newWorkflow.template === template.id }]"
                @click="newWorkflow.template = template.id"
              >
                <div class="template-icon">
                  <font-awesome-icon :icon="template.icon" />
                </div>
                <div class="template-info">
                  <h4>{{ template.name }}</h4>
                  <p>{{ template.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="workflowSchedule">Schedule</label>
            <select id="workflowSchedule" v-model="newWorkflow.schedule" class="form-select">
              <option value="manual">Manual</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showCreateWorkflowModal = false" class="cancel-btn">Cancel</button>
          <button @click="createWorkflow" class="create-workflow-btn">Create Workflow</button>
        </div>
      </div>
    </div>

    <!-- Workflow Details Modal -->
    <div v-if="selectedWorkflow" class="modal-overlay" @click="selectedWorkflow = null">
      <div class="workflow-details-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedWorkflow.name }}</h2>
          <button @click="selectedWorkflow = null" class="close-btn">
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
        
        <div class="workflow-details-content">
          <div class="details-tabs">
            <button 
              v-for="tab in detailTabs" 
              :key="tab"
              :class="['tab-btn', { active: activeDetailsTab === tab }]"
              @click="activeDetailsTab = tab"
            >
              {{ tab }}
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Overview Tab -->
            <div v-if="activeDetailsTab === 'Overview'" class="overview-content">
              <div class="workflow-overview">
                <div class="overview-section">
                  <h3>Description</h3>
                  <p>{{ selectedWorkflow.description }}</p>
                </div>
                
                <div class="overview-section">
                  <h3>Configuration</h3>
                  <div class="config-grid">
                    <div class="config-item">
                      <span class="config-label">Category:</span>
                      <span class="config-value">{{ selectedWorkflow.category }}</span>
                    </div>
                    <div class="config-item">
                      <span class="config-label">Schedule:</span>
                      <span class="config-value">{{ selectedWorkflow.schedule }}</span>
                    </div>
                    <div class="config-item">
                      <span class="config-label">Created:</span>
                      <span class="config-value">{{ formatDate(selectedWorkflow.created) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Execution History Tab -->
            <div v-if="activeDetailsTab === 'History'" class="history-content">
              <div class="execution-history">
                <div v-for="execution in selectedWorkflow.executions" :key="execution.id" class="execution-item">
                  <div class="execution-header">
                    <span :class="['execution-status', execution.status]">{{ execution.status }}</span>
                    <span class="execution-date">{{ formatDateTime(execution.timestamp) }}</span>
                  </div>
                  <div class="execution-details">
                    <p>{{ execution.summary }}</p>
                    <div class="execution-metrics">
                      <span class="metric">Duration: {{ execution.duration }}s</span>
                      <span class="metric">Output: {{ execution.outputItems }} items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Settings Tab -->
            <div v-if="activeDetailsTab === 'Settings'" class="settings-content">
              <div class="workflow-settings">
                <div class="setting-group">
                  <h3>Execution Settings</h3>
                  <div class="setting-item">
                    <label>Auto-retry on failure</label>
                    <input type="checkbox" v-model="selectedWorkflow.settings.autoRetry" />
                  </div>
                  <div class="setting-item">
                    <label>Max retries</label>
                    <input type="number" v-model="selectedWorkflow.settings.maxRetries" min="0" max="5" />
                  </div>
                  <div class="setting-item">
                    <label>Timeout (minutes)</label>
                    <input type="number" v-model="selectedWorkflow.settings.timeout" min="1" max="60" />
                  </div>
                </div>
                
                <div class="setting-group">
                  <h3>Notifications</h3>
                  <div class="setting-item">
                    <label>Email on success</label>
                    <input type="checkbox" v-model="selectedWorkflow.settings.emailOnSuccess" />
                  </div>
                  <div class="setting-item">
                    <label>Email on failure</label>
                    <input type="checkbox" v-model="selectedWorkflow.settings.emailOnFailure" />
                  </div>
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  name: 'AIWorkflowsPage',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      selectedStatus: '',
      showCreateWorkflowModal: false,
      selectedWorkflow: null,
      activeDetailsTab: 'Overview',
      
      detailTabs: ['Overview', 'History', 'Settings'],
      
      newWorkflow: {
        name: '',
        description: '',
        category: '',
        template: '',
        schedule: 'manual'
      },
      
      workflowTemplates: [
        {
          id: 'market-scanner',
          name: 'Market Scanner',
          description: 'Scan markets for trading opportunities',
          icon: 'fa-solid fa-search'
        },
        {
          id: 'portfolio-rebalancer',
          name: 'Portfolio Rebalancer',
          description: 'Automatically rebalance portfolio allocations',
          icon: 'fa-solid fa-balance-scale'
        },
        {
          id: 'risk-monitor',
          name: 'Risk Monitor',
          description: 'Monitor portfolio risk and send alerts',
          icon: 'fa-solid fa-shield-alt'
        },
        {
          id: 'news-analyzer',
          name: 'News Analyzer',
          description: 'Analyze financial news for sentiment',
          icon: 'fa-solid fa-newspaper'
        }
      ],
      
      workflows: [
        {
          id: 1,
          name: 'Daily Market Analysis',
          description: 'Comprehensive daily analysis of major market indices and trending stocks',
          category: 'market-analysis',
          status: 'active',
          icon: 'fa-solid fa-chart-line',
          tags: ['SPY', 'QQQ', 'VIX'],
          runs: 156,
          successRate: 94,
          schedule: 'Daily at 9:00 AM',
          lastRun: Date.now() - 3600000,
          created: Date.now() - 86400000 * 30,
          executions: [
            {
              id: 1,
              status: 'success',
              timestamp: Date.now() - 3600000,
              summary: 'Analyzed 500+ stocks, identified 12 buy signals',
              duration: 45,
              outputItems: 12
            },
            {
              id: 2,
              status: 'success',
              timestamp: Date.now() - 86400000,
              summary: 'Analyzed 487 stocks, identified 8 buy signals',
              duration: 42,
              outputItems: 8
            }
          ],
          settings: {
            autoRetry: true,
            maxRetries: 3,
            timeout: 30,
            emailOnSuccess: false,
            emailOnFailure: true
          }
        },
        {
          id: 2,
          name: 'Portfolio Rebalancing',
          description: 'Automatically rebalance portfolio based on target allocations',
          category: 'portfolio-management',
          status: 'scheduled',
          icon: 'fa-solid fa-balance-scale',
          tags: ['Rebalance', 'Allocation'],
          runs: 24,
          successRate: 100,
          schedule: 'Monthly on 1st',
          lastRun: Date.now() - 86400000 * 7,
          created: Date.now() - 86400000 * 90,
          executions: [],
          settings: {
            autoRetry: true,
            maxRetries: 2,
            timeout: 15,
            emailOnSuccess: true,
            emailOnFailure: true
          }
        },
        {
          id: 3,
          name: 'Crypto Sentiment Analysis',
          description: 'Monitor social media and news sentiment for major cryptocurrencies',
          category: 'research',
          status: 'active',
          icon: 'fa-solid fa-bitcoin',
          tags: ['BTC', 'ETH', 'Sentiment'],
          runs: 72,
          successRate: 89,
          schedule: 'Every 4 hours',
          lastRun: Date.now() - 14400000,
          created: Date.now() - 86400000 * 15,
          executions: [],
          settings: {
            autoRetry: false,
            maxRetries: 1,
            timeout: 10,
            emailOnSuccess: false,
            emailOnFailure: true
          }
        },
        {
          id: 4,
          name: 'Risk Alert System',
          description: 'Monitor portfolio risk metrics and send alerts when thresholds are exceeded',
          category: 'risk-assessment',
          status: 'active',
          icon: 'fa-solid fa-exclamation-triangle',
          tags: ['VaR', 'Drawdown', 'Alerts'],
          runs: 340,
          successRate: 97,
          schedule: 'Real-time',
          lastRun: Date.now() - 300000,
          created: Date.now() - 86400000 * 60,
          executions: [],
          settings: {
            autoRetry: true,
            maxRetries: 5,
            timeout: 5,
            emailOnSuccess: false,
            emailOnFailure: true
          }
        }
      ]
    }
  },
  
  computed: {
    filteredWorkflows() {
      return this.workflows.filter(workflow => {
        const matchesSearch = !this.searchQuery || 
          workflow.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          workflow.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        
        const matchesCategory = !this.selectedCategory || workflow.category === this.selectedCategory;
        const matchesStatus = !this.selectedStatus || workflow.status === this.selectedStatus;
        
        return matchesSearch && matchesCategory && matchesStatus;
      });
    }
  },
  
  methods: {
    refreshWorkflows() {
      console.log('Refreshing workflows...');
      // Implement refresh logic
    },
    
    openWorkflowDetails(workflow) {
      this.selectedWorkflow = workflow;
      this.activeDetailsTab = 'Overview';
    },
    
    toggleWorkflow(workflow) {
      workflow.status = workflow.status === 'active' ? 'inactive' : 'active';
    },
    
    editWorkflow(workflow) {
      console.log('Editing workflow:', workflow.name);
      // Implement edit functionality
    },
    
    createWorkflow() {
      if (!this.newWorkflow.name || !this.newWorkflow.category || !this.newWorkflow.template) {
        alert('Please fill in all required fields');
        return;
      }
      
      const workflow = {
        id: Date.now(),
        name: this.newWorkflow.name,
        description: this.newWorkflow.description,
        category: this.newWorkflow.category,
        status: 'inactive',
        icon: 'fa-solid fa-cog',
        tags: [this.newWorkflow.category],
        runs: 0,
        successRate: 0,
        schedule: this.newWorkflow.schedule,
        lastRun: null,
        created: Date.now(),
        executions: [],
        settings: {
          autoRetry: true,
          maxRetries: 3,
          timeout: 30,
          emailOnSuccess: false,
          emailOnFailure: true
        }
      };
      
      this.workflows.push(workflow);
      this.showCreateWorkflowModal = false;
      this.resetNewWorkflow();
    },
    
    resetNewWorkflow() {
      this.newWorkflow = {
        name: '',
        description: '',
        category: '',
        template: '',
        schedule: 'manual'
      };
    },
    
    formatDate(timestamp) {
      if (!timestamp) return 'Never';
      return new Date(timestamp).toLocaleDateString();
    },
    
    formatDateTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    }
  }
}
</script>

<style scoped>
.ai-workflows-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  min-height: 100vh;
  color: #000000;
}

/* Header Section */
.workflows-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  flex: 1;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #000000;
}

.subtitle {
  font-size: 1.1rem;
  color: #666666;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.create-btn {
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.create-btn:hover {
  background: #333333;
  transform: translateY(-1px);
}

.refresh-btn {
  background: white;
  color: #000000;
  border: 2px solid #000000;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  background: #000000;
  color: white;
}

/* Filter Section */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666666;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #000000;
}

.filter-controls {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #000000;
}

/* Workflows Grid */
.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.workflow-card {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.workflow-card:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.workflow-card.active {
  border-color: #00aa00;
}

.workflow-card.inactive {
  border-color: #cccccc;
  opacity: 0.7;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.workflow-icon {
  width: 50px;
  height: 50px;
  background: #f8f8f8;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #000000;
}

.workflow-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  color: #666666;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #000000;
  color: #000000;
}

.workflow-content {
  margin-bottom: 1rem;
}

.workflow-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #000000;
}

.workflow-description {
  color: #666666;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.workflow-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background: #f0f0f0;
  color: #000000;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.workflow-stats {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666666;
}

.stat-value {
  font-weight: 600;
  color: #000000;
}

.workflow-schedule {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.schedule-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666666;
}

.schedule-icon {
  color: #000000;
}

.last-run {
  color: #888888;
  font-size: 0.8rem;
}

.workflow-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #e6ffe6;
  color: #006600;
}

.status-badge.inactive {
  background: #f0f0f0;
  color: #666666;
}

.status-badge.scheduled {
  background: #fff3cd;
  color: #856404;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.workflow-details-modal {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  color: #000000;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666666;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #000000;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #000000;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #000000;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.template-card {
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.template-card:hover {
  border-color: #000000;
}

.template-card.selected {
  border-color: #000000;
  background: #f8f8f8;
}

.template-icon {
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #000000;
  flex-shrink: 0;
}

.template-info h4 {
  margin: 0 0 0.25rem 0;
  color: #000000;
}

.template-info p {
  margin: 0;
  color: #666666;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.cancel-btn {
  background: white;
  color: #666666;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  border-color: #000000;
  color: #000000;
}

.create-workflow-btn {
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-workflow-btn:hover {
  background: #333333;
}

/* Workflow Details Content */
.workflow-details-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.details-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 1.5rem;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  color: #666666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-btn.active {
  color: #000000;
  border-bottom-color: #000000;
}

.tab-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.overview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-section h3 {
  margin: 0 0 1rem 0;
  color: #000000;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f8f8;
  border-radius: 8px;
}

.config-label {
  color: #666666;
}

.config-value {
  font-weight: 600;
  color: #000000;
}

.execution-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.execution-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
}

.execution-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.execution-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.execution-status.success {
  background: #e6ffe6;
  color: #006600;
}

.execution-status.failed {
  background: #ffe6e6;
  color: #cc0000;
}

.execution-date {
  color: #666666;
  font-size: 0.9rem;
}

.execution-details p {
  margin: 0 0 0.5rem 0;
  color: #000000;
}

.execution-metrics {
  display: flex;
  gap: 1rem;
}

.metric {
  color: #666666;
  font-size: 0.9rem;
}

.workflow-settings {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.setting-group h3 {
  margin: 0 0 1rem 0;
  color: #000000;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item label {
  color: #000000;
  font-weight: 500;
}

.setting-item input[type="checkbox"] {
  transform: scale(1.2);
  cursor: pointer;
}

.setting-item input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 80px;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ai-workflows-container {
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filter-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .workflows-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content,
  .workflow-details-modal {
    width: 95%;
    margin: 1rem;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }
  
  .details-tabs {
    overflow-x: auto;
  }
  
  .tab-btn {
    white-space: nowrap;
  }
}
</style> 