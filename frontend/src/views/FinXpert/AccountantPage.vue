<template>
  <div class="accountant-page">
    <!-- Enhanced Universe Background Effect -->
    <div class="universe-background">
      <div class="atomic-particles">
        <div class="atomic-particle" v-for="n in 50" :key="n" :style="getAtomicParticleStyle(n)"></div>
      </div>
      <div class="quantum-grid"></div>
      <div class="floating-orbs">
        <div class="orb" v-for="n in 8" :key="n" :style="getOrbStyle(n)"></div>
      </div>
      <div class="energy-waves">
        <div class="wave" v-for="n in 3" :key="n"></div>
      </div>
    </div>

    <!-- Enhanced Notifications Panel -->
    <div v-if="showNotifications" class="notifications-panel" data-aos="slide-left">
      <div class="notifications-header">
        <h3>{{ $t('accountantPage.notifications.title') }}</h3>
        <div class="notification-actions">
          <button @click="markAllAsRead" class="mark-read-btn">
            {{ $t('accountantPage.notifications.markAllRead') }}
          </button>
          <button @click="showNotifications = false" class="close-notifications">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="notifications-list">
        <div v-for="notification in notifications" :key="notification.id" 
             class="notification-item" :class="notification.type"
             @click="handleNotificationClick(notification)">
          <div class="notification-icon">
            <i :class="notification.icon"></i>
          </div>
          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            <span class="notification-time">{{ notification.time }}</span>
          </div>
          <div v-if="!notification.read" class="notification-dot"></div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Enhanced Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <div class="badge-glow"></div>
              <i class="fas fa-calculator"></i>
              <span>{{ $t('accountantPage.hero.title') }}</span>
            </div>
            <h1>
              <span class="text-gradient">AI Accounting</span>
              <span class="text-normal">Excellence</span>
            </h1>
            <p>{{ $t('accountantPage.hero.subtitle') }}</p>
            
            <!-- Real-time Stats with enhanced animations -->
            <div class="hero-stats">
              <div class="stat-item" v-for="(stat, index) in heroStats" :key="index"
                   data-aos="fade-up" :data-aos-delay="index * 100">
                <div class="stat-icon">
                  <div class="icon-background"></div>
                  <i :class="stat.icon"></i>
                </div>
                <div class="stat-data">
                  <div class="stat-number">{{ stat.value }}</div>
                  <div class="stat-label">{{ $t(`accountantPage.hero.stats.${stat.key}`) }}</div>
                  <div class="stat-trend" :class="stat.trend">
                    <i :class="stat.trendIcon"></i>
                    {{ stat.change }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Quick Action Buttons -->
            <div class="hero-actions">
              <button @click="triggerFileInput" class="action-btn primary">
                <div class="btn-bg"></div>
                <i class="fas fa-upload"></i>
                <span>{{ $t('accountantPage.upload.chooseFiles') }}</span>
              </button>
              <button @click="openChatbot" class="action-btn secondary">
                <div class="btn-bg"></div>
                <i class="fas fa-robot"></i>
                <span>{{ $t('accountantPage.chatbot.title') }}</span>
              </button>
              <button @click="showNotifications = !showNotifications" class="action-btn notifications">
                <div class="btn-bg"></div>
                <i class="fas fa-bell"></i>
                <span>{{ $t('accountantPage.notifications.title') }}</span>
                <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
              </button>
              <button @click="showDemoAnalysis" class="action-btn demo">
                <div class="btn-bg"></div>
                <i class="fas fa-play"></i>
                <span>Demo Analysis</span>
              </button>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="dashboard-preview">
              <div class="preview-card" v-for="(card, index) in previewCards" :key="index"
                   data-aos="zoom-in" :data-aos-delay="index * 150">
                <div class="card-glow"></div>
                <div class="card-icon">
                  <i :class="card.icon"></i>
                </div>
                <div class="card-info">
                  <h4>{{ card.title }}</h4>
                  <div class="card-metrics">
                    <span class="metric-value">{{ card.value }}</span>
                    <span class="metric-change" :class="card.trend">{{ card.change }}</span>
                  </div>
                </div>
                <div class="card-chart">
                  <svg viewBox="0 0 100 30" class="mini-chart">
                    <polyline :points="card.chartData" 
                              :stroke="card.trend === 'positive' ? '#ffffff' : '#808080'"
                              stroke-width="2" fill="none"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Upload Section -->
      <section class="upload-section">
        <div class="section-header">
          <h2>
            <span class="text-gradient">Upload</span>
            <span class="text-normal">Documents</span>
          </h2>
          <p>{{ $t('accountantPage.upload.subtitle') }}</p>
        </div>
        
        <div class="upload-area">
          <!-- Advanced Upload Zone -->
          <div class="upload-zone" 
               @drop="handleDrop" 
               @dragover.prevent 
               @dragenter.prevent
               :class="{ 'drag-over': isDragOver }"
               @dragenter="isDragOver = true"
               @dragleave="isDragOver = false">
            
            <div class="upload-animation">
              <div class="upload-circle">
                <div class="circle-glow"></div>
                <i class="fas fa-upload"></i>
              </div>
              <div class="upload-ripples">
                <div class="ripple"></div>
                <div class="ripple"></div>
                <div class="ripple"></div>
              </div>
            </div>
            
            <h3>{{ $t('accountantPage.upload.dragDrop') }}</h3>
            <p>{{ $t('accountantPage.upload.formats') }}</p>
            
            <!-- File Type Icons -->
            <div class="file-types">
              <div class="file-type" v-for="type in supportedTypes" :key="type.ext">
                <div class="file-type-bg"></div>
                <i :class="type.icon"></i>
                <span>{{ type.ext }}</span>
              </div>
            </div>
            
            <button @click="triggerFileInput" class="upload-btn">
              <div class="btn-particles"></div>
              <i class="fas fa-upload"></i>
              <span>{{ $t('accountantPage.upload.chooseFiles') }}</span>
            </button>
            <input ref="fileInput" type="file" @change="handleFileSelect" 
                   accept=".pdf,.xlsx,.xls,.csv" multiple hidden>
            
            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0" class="upload-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
                <div class="progress-glow" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ uploadProgress }}%</span>
            </div>
          </div>
          
          <!-- Enhanced Quick Templates -->
          <div class="quick-templates">
            <div class="templates-header">
              <h3>{{ $t('accountantPage.upload.quickStart') }}</h3>
              <button @click="loadDemoData" class="demo-btn">
                <div class="btn-bg"></div>
                <i class="fas fa-star"></i>
                <span>Dữ Liệu Demo</span>
              </button>
            </div>
            <div class="template-grid">
              <div v-for="template in quickTemplates" :key="template.id"
                   @click="loadTemplate(template)"
                   class="template-card"
                   data-aos="fade-up" :data-aos-delay="template.id * 100">
                <div class="template-glow"></div>
                <div class="template-icon">
                  <i :class="template.icon"></i>
                </div>
                <div class="template-info">
                  <h4>{{ $t(`accountantPage.templates.${template.key}`) || template.name }}</h4>
                  <p>{{ $t(`accountantPage.templates.${template.key}Desc`) || template.description }}</p>
                  <div class="template-stats">
                    <span class="stat-item">
                      <i class="fas fa-file"></i>
                      {{ template.sampleCount }} samples
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Enhanced Dashboard Section -->
      <section v-if="showDashboard" class="dashboard-section">
        <div class="dashboard-header">
          <div class="header-left">
            <h2>{{ $t('accountantPage.dashboard.title') }}</h2>
            <div class="dashboard-status">
              <div class="status-indicator active"></div>
              <span>{{ $t('accountantPage.dashboard.realtime') }}</span>
              <span class="last-updated">Cập nhật: {{ lastUpdated }}</span>
            </div>
          </div>
          
          <div class="dashboard-controls">
            <div class="view-toggles">
              <button @click="dashboardView = 'grid'" 
                      :class="['view-btn', { active: dashboardView === 'grid' }]">
                <i class="fas fa-th"></i>
              </button>
              <button @click="dashboardView = 'list'" 
                      :class="['view-btn', { active: dashboardView === 'list' }]">
                <i class="fas fa-list"></i>
              </button>
            </div>
            
            <div class="time-range-selector">
              <select v-model="selectedTimeRange" class="time-range">
                <option value="day">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="quarter">Quý này</option>
                <option value="year">Năm này</option>
              </select>
            </div>
            
            <button @click="refreshAnalysis" class="control-btn">
              <i class="fas fa-redo" :class="{ spinning: isRefreshing }"></i>
              {{ $t('accountantPage.dashboard.refresh') }}
            </button>
            
            <div class="dropdown-container">
              <button @click="showExportMenu = !showExportMenu" class="control-btn primary">
                <i class="fas fa-download"></i>
                {{ $t('accountantPage.dashboard.export') }}
              </button>
              <div v-if="showExportMenu" class="export-dropdown">
                <div class="export-option" @click="exportReport('pdf')">
                  <i class="fas fa-file"></i>
                  {{ $t('accountantPage.export.pdf') }}
                </div>
                <div class="export-option" @click="exportReport('excel')">
                  <i class="fas fa-file"></i>
                  {{ $t('accountantPage.export.excel') }}
                </div>
                <div class="export-option" @click="exportReport('powerpoint')">
                  <i class="fas fa-file"></i>
                  {{ $t('accountantPage.export.powerpoint') }}
                </div>
                <div class="export-option" @click="shareReport">
                  <i class="fas fa-share"></i>
                  {{ $t('accountantPage.export.share') }}
                </div>
              </div>
            </div>
            
            <button @click="openChatbot" class="control-btn ai-assist">
              <i class="fas fa-robot"></i>
              {{ $t('accountantPage.dashboard.assistant') }}
            </button>
          </div>
        </div>

        <!-- Performance Summary Bar -->
        <div class="performance-summary" data-aos="fade-up">
          <div class="summary-item" v-for="metric in performanceMetrics" :key="metric.key">
            <div class="metric-icon" :class="metric.status">
              <i :class="metric.icon"></i>
            </div>
            <div class="metric-details">
              <h4>{{ $t(`accountantPage.performance.${metric.key}`) }}</h4>
              <div class="metric-value">{{ metric.value }}</div>
              <div class="metric-comparison">
                <span :class="metric.trend">{{ metric.change }}</span>
                <span class="comparison-text">so với kỳ trước</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Analysis Grid -->
        <div :class="['analysis-grid', dashboardView]">
          <!-- Financial Overview Card -->
          <div class="analysis-card financial-overview" data-aos="fade-up">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-chart-bar"></i>
                <h3>{{ $t('accountantPage.dashboard.overview') }}</h3>
              </div>
              <div class="card-actions">
                <button @click="expandCard('financial')" class="expand-btn">
                  <i class="fas fa-expand"></i>
                </button>
                <div class="card-badge">{{ $t('accountantPage.dashboard.liveData') }}</div>
              </div>
            </div>
            <div class="card-content">
              <div class="metrics-grid">
                <div class="metric-item" v-for="metric in financialMetrics" :key="metric.id">
                  <div class="metric-icon">
                    <i :class="metric.icon"></i>
                  </div>
                  <div class="metric-data">
                    <div class="metric-value">${{ formatNumber(metric.value) }}</div>
                    <div class="metric-label">{{ $t(`accountantPage.metrics.${metric.key}`) || metric.label }}</div>
                    <div class="metric-change" :class="metric.trend">
                      <i :class="metric.trend === 'positive' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ metric.change }}
                    </div>
                  </div>
                  <div class="metric-chart">
                    <canvas :ref="`chart-${metric.key}`" width="80" height="40"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced AI Insights -->
          <div class="analysis-card ai-insights" data-aos="fade-up" data-aos-delay="100">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-brain"></i>
                <h3>{{ $t('accountantPage.dashboard.aiInsights') }}</h3>
              </div>
              <div class="insight-controls">
                <button @click="generateNewInsights" class="generate-btn">
                  <i class="fas fa-star"></i>
                  Tạo insights mới
                </button>
                <div class="insight-status active">
                  <div class="status-dot"></div>
                  <span>{{ $t('accountantPage.dashboard.realtime') }}</span>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="insights-list">
                <div v-for="insight in aiInsights" :key="insight.id" 
                     class="insight-item" :class="insight.priority"
                     data-aos="slide-right" :data-aos-delay="insight.id * 100">
                  <div class="insight-icon">
                    <i :class="insight.icon"></i>
                  </div>
                  <div class="insight-content">
                    <div class="insight-header">
                      <h4>{{ $t(`accountantPage.insights.${insight.key}`) || insight.title }}</h4>
                      <span class="insight-confidence">{{ insight.confidence }}% độ tin cậy</span>
                    </div>
                    <p>{{ $t(`accountantPage.insights.${insight.key}Desc`) || insight.description }}</p>
                    <div class="insight-actions">
                      <button @click="viewInsightDetails(insight)" class="action-btn">
                        {{ $t('accountantPage.insights.viewDetails') }}
                      </button>
                      <button @click="implementInsight(insight)" class="implement-btn">
                        <i class="fas fa-play"></i>
                        Thực hiện
                      </button>
                      <div class="insight-impact" :class="insight.impact">
                        {{ $t(`accountantPage.insights.impact.${insight.impact}`) }}
                      </div>
                    </div>
                  </div>
                  <div class="insight-trend">
                    <div class="trend-indicator" :class="insight.trend"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Expense Analysis -->
          <div class="analysis-card expense-analysis" data-aos="fade-up" data-aos-delay="200">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-pie-chart"></i>
                <h3>{{ $t('accountantPage.dashboard.expenseAnalysis') }}</h3>
              </div>
              <div class="analysis-controls">
                <select v-model="selectedPeriod" class="period-selector">
                  <option value="month">{{ $t('accountantPage.dashboard.periods.month') }}</option>
                  <option value="quarter">{{ $t('accountantPage.dashboard.periods.quarter') }}</option>
                  <option value="year">{{ $t('accountantPage.dashboard.periods.year') }}</option>
                </select>
                <button @click="switchChartType" class="chart-switch">
                  <i :class="chartType === 'donut' ? 'fas fa-chart-bar' : 'fas fa-chart-pie'"></i>
                </button>
              </div>
            </div>
            <div class="card-content">
              <div class="chart-container">
                <div v-if="chartType === 'donut'" class="donut-chart">
                  <svg viewBox="0 0 100 100" class="donut-svg">
                    <circle cx="50" cy="50" r="35" class="donut-background"/>
                    <circle v-for="(segment, index) in expenseSegments" :key="index"
                            cx="50" cy="50" r="35" 
                            class="donut-segment"
                            :style="segmentStyle(segment, index)"
                            :stroke-dasharray="`${segment.percentage * 2.2} 220`"
                            :stroke-dashoffset="segment.offset"/>
                  </svg>
                  <div class="chart-center">
                    <div class="center-value">${{ totalExpenses }}K</div>
                    <div class="center-label">{{ $t('accountantPage.dashboard.total') }}</div>
                  </div>
                </div>
                
                <div v-else class="bar-chart">
                  <canvas ref="expenseBarChart" width="300" height="200"></canvas>
                </div>
                
                <div class="chart-legend">
                  <div v-for="(category, index) in expenseCategories" :key="index"
                       class="legend-item" @click="toggleCategory(category)">
                    <div class="legend-color" :style="{ backgroundColor: category.color }"></div>
                    <span class="legend-label">{{ $t(`accountantPage.expenses.${category.key}`) || category.name }}</span>
                    <span class="legend-value">${{ category.amount }}K</span>
                    <span class="legend-percentage">{{ ((category.amount / totalExpenses) * 100).toFixed(1) }}%</span>
                    <div class="legend-trend" :class="category.trend">
                      <i :class="category.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                      {{ category.change }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Compliance Monitor -->
          <div class="analysis-card compliance-monitor" data-aos="fade-up" data-aos-delay="300">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-shield"></i>
                <h3>{{ $t('accountantPage.dashboard.compliance') }}</h3>
              </div>
              <div class="compliance-score">
                <div class="score-circle">
                  <svg viewBox="0 0 36 36" class="score-svg">
                    <path class="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                    <path class="score-fill" :stroke-dasharray="`${complianceScore}, 100`"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  </svg>
                  <span class="score-text">{{ complianceScore }}%</span>
                </div>
                <div class="score-details">
                  <span>{{ $t('accountantPage.dashboard.complianceScore') }}</span>
                  <div class="score-trend positive">
                    <i class="fas fa-arrow-up"></i>
                    +2.3% từ tháng trước
                  </div>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="compliance-checks">
                <div v-for="check in complianceChecks" :key="check.id"
                     class="compliance-item" :class="check.status">
                  <div class="check-icon">
                    <i :class="check.icon"></i>
                  </div>
                  <div class="check-content">
                    <h4>{{ $t(`accountantPage.compliance.${check.key}`) || check.title }}</h4>
                    <p>{{ $t(`accountantPage.compliance.${check.key}Desc`) || check.description }}</p>
                    <div class="check-meta">
                      <span class="last-check">Kiểm tra lần cuối: {{ check.lastChecked }}</span>
                      <button @click="rerunCheck(check)" class="rerun-btn">
                        <i class="fas fa-redo"></i>
                        Kiểm tra lại
                      </button>
                    </div>
                  </div>
                  <div class="check-status">
                    <span class="status-badge" :class="check.status">
                      {{ $t(`accountantPage.compliance.statuses.${check.statusText.toLowerCase()}`) || check.statusText }}
                    </span>
                    <div class="check-actions">
                      <button v-if="check.status === 'warning'" @click="fixIssue(check)" class="fix-btn">
                        <i class="fas fa-wrench"></i>
                        Sửa
                      </button>
                      <button @click="viewCheckDetails(check)" class="details-btn">
                        <i class="fas fa-info-circle"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Tax Optimization -->
          <div class="analysis-card tax-optimization" data-aos="fade-up" data-aos-delay="400">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-receipt"></i>
                <h3>{{ $t('accountantPage.dashboard.taxOptimization') }}</h3>
              </div>
              <div class="tax-summary">
                <div class="total-savings">
                  <span class="savings-amount">${{ totalTaxSavings.toLocaleString() }}</span>
                  <span class="savings-label">Tiết kiệm tiềm năng</span>
                </div>
              </div>
            </div>
            <div class="card-content">
              <div class="tax-strategies">
                <div v-for="strategy in taxStrategies" :key="strategy.id"
                     class="tax-strategy" :class="strategy.complexity"
                     data-aos="slide-up" :data-aos-delay="strategy.id * 100">
                  <div class="strategy-header">
                    <div class="strategy-icon">
                      <i :class="strategy.icon"></i>
                    </div>
                    <div class="strategy-info">
                      <h4>{{ $t(`accountantPage.tax.${strategy.key}`) || strategy.title }}</h4>
                      <p>{{ $t(`accountantPage.tax.${strategy.key}Desc`) || strategy.description }}</p>
                      <div class="strategy-meta">
                        <span class="complexity-badge" :class="strategy.complexity">
                          {{ strategy.complexity === 'low' ? 'Dễ' : strategy.complexity === 'medium' ? 'Trung bình' : 'Khó' }}
                        </span>
                        <span class="timeline">{{ strategy.timeline }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="strategy-footer">
                    <div class="savings-amount">
                      <span class="savings-label">{{ $t('accountantPage.tax.savings') }}</span>
                      <span class="savings-value">${{ strategy.savings.toLocaleString() }}</span>
                      <span class="savings-percentage">{{ strategy.savingsPercentage }}%</span>
                    </div>
                    <div class="strategy-actions">
                      <button @click="implementStrategy(strategy)" class="strategy-btn primary">
                        {{ $t(`accountantPage.tax.actions.${strategy.actionKey}`) || strategy.actionText }}
                      </button>
                      <button @click="learnMore(strategy)" class="strategy-btn secondary">
                        <i class="fas fa-info-circle"></i>
                        Chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- New Risk Analysis Card -->
          <div class="analysis-card risk-analysis" data-aos="fade-up" data-aos-delay="500">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>{{ $t('accountantPage.risk.title') }}</h3>
              </div>
              <div class="risk-score">
                <div class="risk-indicator" :class="overallRiskLevel">
                  {{ overallRiskScore }}
                </div>
                <span>Risk Score</span>
              </div>
            </div>
            <div class="card-content">
              <div class="risk-categories">
                <div v-for="risk in riskCategories" :key="risk.type"
                     class="risk-item" :class="risk.level">
                  <div class="risk-icon">
                    <i :class="risk.icon"></i>
                  </div>
                  <div class="risk-content">
                    <h4>{{ $t(`accountantPage.risk.${risk.type}`) }}</h4>
                    <p>{{ risk.description }}</p>
                    <div class="risk-metrics">
                      <span class="risk-level" :class="risk.level">
                        {{ $t(`accountantPage.risk.${risk.level}`) }}
                      </span>
                      <span class="risk-impact">${{ risk.impact }}K tác động</span>
                    </div>
                  </div>
                  <div class="risk-actions">
                    <button @click="mitigateRisk(risk)" class="mitigate-btn">
                      <i class="fas fa-shield"></i>
                      Giảm thiểu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced Predictive Analytics -->
          <div class="analysis-card predictive-analytics" data-aos="fade-up" data-aos-delay="600">
            <div class="card-header">
              <div class="card-title">
                <i class="fas fa-eye"></i>
                <h3>{{ $t('accountantPage.dashboard.forecasting') }}</h3>
              </div>
              <div class="forecast-controls">
                <div class="forecast-confidence">
                  <div class="confidence-meter">
                    <div class="confidence-fill" :style="{ width: '92%' }"></div>
                  </div>
                  <span>{{ $t('accountantPage.dashboard.forecasting92') }}</span>
                </div>
                <button @click="updateForecast" class="update-forecast">
                  <i class="fas fa-sync"></i>
                  Cập nhật
                </button>
              </div>
            </div>
            <div class="card-content">
              <div class="forecast-timeline">
                <div v-for="(forecast, index) in financialForecasts" :key="index"
                     class="forecast-item" data-aos="fade-right" :data-aos-delay="index * 100">
                  <div class="forecast-period">{{ $t(`accountantPage.dashboard.forecastPeriods.${forecast.periodKey}`) || forecast.period }}</div>
                  <div class="forecast-metrics">
                    <div class="forecast-metric">
                      <span class="metric-label">{{ $t('accountantPage.dashboard.metrics.revenue') }}</span>
                      <span class="metric-value" :class="forecast.revenue.trend">
                        ${{ forecast.revenue.value }}K
                      </span>
                      <span class="metric-change" :class="forecast.revenue.trend">
                        {{ forecast.revenue.change }}
                      </span>
                    </div>
                    <div class="forecast-metric">
                      <span class="metric-label">{{ $t('accountantPage.dashboard.metrics.profit') }}</span>
                      <span class="metric-value" :class="forecast.profit.trend">
                        ${{ forecast.profit.value }}K
                      </span>
                      <span class="metric-change" :class="forecast.profit.trend">
                        {{ forecast.profit.change }}
                      </span>
                    </div>
                  </div>
                  <div class="forecast-trend">
                    <i :class="forecast.trend.icon"></i>
                    <span>{{ $t(`accountantPage.dashboard.metrics.${forecast.trend.textKey}`) || forecast.trend.text }}</span>
                  </div>
                  <div class="forecast-actions">
                    <button @click="drillDownForecast(forecast)" class="drill-down">
                      <i class="fas fa-search-plus"></i>
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Enhanced Chatbot -->
    <div v-if="showChatbot" class="chatbot-overlay" @click="closeChatbot">
      <div class="chatbot-container" @click.stop data-aos="zoom-in">
        <div class="chatbot-header">
          <div class="chatbot-avatar">
            <i class="fas fa-robot"></i>
            <div class="avatar-pulse"></div>
          </div>
          <div class="chatbot-info">
            <h3>{{ $t('accountantPage.chatbot.title') }}</h3>
            <span class="chatbot-status">{{ isTyping ? 'Đang nhập...' : 'Trực tuyến' }}</span>
            <div class="chatbot-capabilities">
              <span class="capability">Phân tích tài chính</span>
              <span class="capability">Tối ưu thuế</span>
              <span class="capability">Tuân thủ</span>
            </div>
          </div>
          <div class="chatbot-actions">
            <button @click="clearChat" class="clear-chat">
              <i class="fas fa-times"></i>
            </button>
            <button @click="closeChatbot" class="chatbot-close">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <div class="chatbot-messages" ref="chatMessagesContainer">
          <div v-for="(message, index) in chatMessages" :key="index" 
               class="message" :class="message.type">
            <div class="message-content">
              <p>{{ message.text }}</p>
              <div v-if="message.options" class="message-options">
                <button v-for="option in message.options" :key="option.value"
                        @click="handleChatOption(option)"
                        class="option-btn">
                  {{ option.label }}
                </button>
              </div>
              <div v-if="message.attachments" class="message-attachments">
                <div v-for="attachment in message.attachments" :key="attachment.id"
                     class="attachment-item">
                  <i :class="attachment.icon"></i>
                  <span>{{ attachment.name }}</span>
                </div>
              </div>
            </div>
            <div class="message-time">{{ message.timestamp }}</div>
          </div>
          
          <div v-if="isTyping" class="message assistant typing">
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chatbot-input">
          <div class="input-suggestions" v-if="showSuggestions">
            <button v-for="suggestion in quickSuggestions" :key="suggestion"
                    @click="sendSuggestion(suggestion)"
                    class="suggestion-chip">
              {{ suggestion }}
            </button>
          </div>
          
          <div class="input-row">
            <button @click="attachFile" class="attach-btn">
              <i class="fas fa-link"></i>
            </button>
            <input v-model="chatInput" 
                   @keyup.enter="sendMessage"
                   @focus="showSuggestions = true"
                   @blur="showSuggestions = false"
                   :placeholder="$t('accountantPage.chatbot.placeholder')"
                   class="chat-input">
            <button @click="recordVoice" class="voice-btn" :class="{ recording: isRecording }">
              <i class="fas fa-user"></i>
            </button>
            <button @click="sendMessage" class="send-btn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Integrated Chatbot Widget - Inside Page -->
    <div class="integrated-chatbot-widget">
      <div class="chatbot-card" :class="{ 'widget-minimized': !chatWidgetExpanded }">
        <div class="widget-header" @click="toggleChatWidget">
          <div class="widget-icon">
            <i class="fas fa-robot"></i>
            <div class="icon-pulse"></div>
          </div>
          <div class="widget-info" v-if="chatWidgetExpanded">
            <h4>AI Assistant</h4>
            <p>Ready to help with accounting</p>
          </div>
          <button class="widget-toggle" v-if="chatWidgetExpanded">
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        
        <div class="widget-body" v-if="chatWidgetExpanded">
          <div class="quick-actions">
            <button @click="handleQuickAction('analyze')" class="quick-action-btn">
              <i class="fas fa-chart-bar"></i>
              <span>Quick Analysis</span>
            </button>
            <button @click="handleQuickAction('tax')" class="quick-action-btn">
              <i class="fas fa-calculator"></i>
              <span>Tax Optimize</span>
            </button>
            <button @click="openChatbot" class="quick-action-btn primary">
              <i class="fas fa-comments"></i>
              <span>Full Chat</span>
            </button>
          </div>
          
          <div class="widget-preview">
            <div class="preview-message">
              <div class="message-avatar">
                <i class="fas fa-robot"></i>
              </div>
              <div class="message-content">
                <p>{{ $t('accountantPage.widget.greeting') || 'Hi! I can help you analyze financial data and optimize taxes.' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Processing Overlay -->
    <div v-if="isProcessing" class="processing-overlay">
      <div class="processing-content">
        <div class="processing-animation">
          <div class="processing-circle">
            <div class="circle-progress" :style="{ transform: `rotate(${processingProgress * 3.6}deg)` }"></div>
          </div>
          <div class="processing-icon">
            <i class="fas fa-brain"></i>
          </div>
        </div>
        <h3>{{ $t('accountantPage.help.processing') }}</h3>
        <p>{{ currentProcessingStep }}</p>
        <div class="processing-steps">
          <div v-for="(step, index) in processingSteps" :key="index"
               class="step-item" :class="{ 
                 active: index === currentStepIndex, 
                 completed: index < currentStepIndex 
               }">
            <div class="step-icon">
              <i v-if="index < currentStepIndex" class="fas fa-check"></i>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span>{{ step }}</span>
          </div>
        </div>
        <div class="processing-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: processingProgress + '%' }"></div>
          </div>
          <span>{{ processingProgress }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Basic FontAwesome icon imports - using only core icons
import { 
  faChartBar, faChartPie, faRobot, faUpload,
  faFile, faReceipt, 
  faShield, faBrain, faEye, faSyncAlt, faDownload, faBell,
  faPlay, faSearch, faExpand, 
  faShare, faEnvelope,
  faArrowUp, faArrowDown, faArrowRight,
  faCheck, faTimes, faExclamationTriangle, faInfoCircle,
  faWrench, faRedo, faPaperPlane,
  faCog, faUser,
  faFlag, faTag, faLink, faDatabase, faServer, faCloud,
  faLock, faKey, faDollarSign,
  faCalculator, faChartLine, 
  faFolder,
  faLightbulb, faBullseye, 
  faRocket, faStar, faHeart,
  faCrown, faTrophy
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

// Register only safe icons
library.add(
  faChartBar, faChartPie, faRobot, faUpload,
  faFile, faReceipt, 
  faShield, faBrain, faEye, faSyncAlt, faDownload, faBell,
  faPlay, faSearch, faExpand, 
  faShare, faEnvelope,
  faArrowUp, faArrowDown, faArrowRight,
  faCheck, faTimes, faExclamationTriangle, faInfoCircle,
  faWrench, faRedo, faPaperPlane,
  faCog, faUser,
  faFlag, faTag, faLink, faDatabase, faServer, faCloud,
  faLock, faKey, faDollarSign,
  faCalculator, faChartLine, 
  faFolder,
  faLightbulb, faBullseye, 
  faRocket, faStar, faHeart,
  faCrown, faTrophy
)

export default {
  name: 'AccountantPage',
  setup() {
    const { t } = useI18n()
    
    // Enhanced reactive state management
    const fileInput = ref(null)
    const chatMessagesContainer = ref(null)
    const isDragOver = ref(false)
    const showDashboard = ref(true)
    const showChatbot = ref(false)
    const showNotifications = ref(false)
    const showExportMenu = ref(false)
    const showSuggestions = ref(false)
    const isProcessing = ref(false)
    const isRefreshing = ref(false)
    const isTyping = ref(false)
    const isRecording = ref(false)
    const uploadProgress = ref(0)
    const processingProgress = ref(0)
    const currentStepIndex = ref(0)
    const chatInput = ref('')
    const selectedPeriod = ref('month')
    const selectedTimeRange = ref('month')
    const dashboardView = ref('grid')
    const chartType = ref('donut')
    const complianceScore = ref(94)
    const totalTaxSavings = ref(287543)
    const lastUpdated = ref('2 phút trước')
    const currentProcessingStep = ref('Đang khởi tạo phân tích AI...')
    const overallRiskScore = ref(7.2)
    const overallRiskLevel = ref('medium')
    const totalExpenses = ref(1247)
    const chatWidgetExpanded = ref(true)

    // Enhanced hero stats with real-time data
    const heroStats = ref([
      {
        key: 'analyzed',
        value: '47,329',
        icon: 'fas fa-chart-bar',
        trend: 'positive',
        trendIcon: 'fas fa-arrow-up',
        change: '+12.5%'
      },
      {
        key: 'savings',
        value: '$3,142,891',
        icon: 'fas fa-dollar-sign',
        trend: 'positive',
        trendIcon: 'fas fa-arrow-up',
        change: '+8.3%'
      },
      {
        key: 'compliance',
        value: '97%',
        icon: 'fas fa-shield',
        trend: 'positive',
        trendIcon: 'fas fa-arrow-up',
        change: '+2.1%'
      }
    ])

    // Enhanced preview cards with mini charts
    const previewCards = ref([
      {
        icon: 'fas fa-chart-line',
        title: 'Doanh Thu',
        value: '$847K',
        change: '+15.2%',
        trend: 'positive',
        chartData: '0,20 20,15 40,25 60,18 80,30 100,28'
      },
      {
        icon: 'fas fa-receipt',
        title: 'Chi Phí',
        value: '$523K',
        change: '-5.8%',
        trend: 'positive',
        chartData: '0,25 20,22 40,18 60,20 80,15 100,12'
      },
      {
        icon: 'fas fa-brain',
        title: 'AI Insights',
        value: '23',
        change: '+7',
        trend: 'positive',
        chartData: '0,15 20,18 40,22 60,25 80,28 100,30'
      }
    ])

    // Enhanced supported file types
    const supportedTypes = ref([
      { ext: 'PDF', icon: 'fas fa-file' },
      { ext: 'XLSX', icon: 'fas fa-file' },
      { ext: 'CSV', icon: 'fas fa-file' },
      { ext: 'XLS', icon: 'fas fa-file' }
    ])

    // Enhanced quick templates with processing times
    const quickTemplates = ref([
      {
        id: 1,
        key: 'income',
        name: 'Báo Cáo Thu Nhập',
        description: 'Phân tích báo cáo P&L',
        icon: 'fas fa-chart-line',
        sampleCount: 1247,
        processingTime: 15
      },
      {
        id: 2,
        key: 'balance',
        name: 'Bảng Cân Đối',
        description: 'Xem xét tình hình tài chính',
        icon: 'fas fa-chart-bar',
        sampleCount: 892,
        processingTime: 22
      },
      {
        id: 3,
        key: 'cashflow',
        name: 'Dòng Tiền',
        description: 'Theo dõi luồng tiền',
        icon: 'fas fa-arrow-right',
        sampleCount: 634,
        processingTime: 18
      },
      {
        id: 4,
        key: 'tax',
        name: 'Tài Liệu Thuế',
        description: 'Lập kế hoạch & tuân thủ thuế',
        icon: 'fas fa-receipt',
        sampleCount: 421,
        processingTime: 25
      }
    ])

    // Enhanced performance metrics
    const performanceMetrics = ref([
      {
        key: 'roi',
        value: '24.7%',
        icon: 'fas fa-chart-line',
        status: 'excellent',
        trend: 'positive',
        change: '+3.2%'
      },
      {
        key: 'growth',
        value: '18.5%',
        icon: 'fas fa-arrow-up',
        status: 'good',
        trend: 'positive',
        change: '+5.1%'
      },
      {
        key: 'efficiency',
        value: '91.3%',
        icon: 'fas fa-cog',
        status: 'excellent',
        trend: 'positive',
        change: '+1.8%'
      },
      {
        key: 'profitability',
        value: '32.1%',
        icon: 'fas fa-dollar-sign',
        status: 'excellent',
        trend: 'positive',
        change: '+4.3%'
      },
      {
        key: 'liquidity',
        value: '2.4x',
        icon: 'fas fa-cloud',
        status: 'good',
        trend: 'stable',
        change: '0%'
      },
      {
        key: 'leverage',
        value: '1.2x',
        icon: 'fas fa-chart-bar',
        status: 'good',
        trend: 'negative',
        change: '-0.3%'
      }
    ])

    // Enhanced financial metrics with mini charts
    const financialMetrics = ref([
      {
        id: 1,
        key: 'revenue',
        label: 'Tổng Doanh Thu',
        value: 2847395,
        change: '+15.2%',
        trend: 'positive',
        icon: 'fas fa-chart-line'
      },
      {
        id: 2,
        key: 'expenses',
        label: 'Tổng Chi Phí',
        value: 1523847,
        change: '-5.8%',
        trend: 'positive',
        icon: 'fas fa-receipt'
      },
      {
        id: 3,
        key: 'profit',
        label: 'Lợi Nhuận Ròng',
        value: 1323548,
        change: '+28.7%',
        trend: 'positive',
        icon: 'fas fa-dollar-sign'
      },
      {
        id: 4,
        key: 'margin',
        label: 'Tỷ Lệ Lợi Nhuận',
        value: 46.5,
        change: '+8.1%',
        trend: 'positive',
        icon: 'fas fa-percentage'
      }
    ])

    // Enhanced AI insights with confidence and implementation
    const aiInsights = ref([
      {
        id: 1,
        key: 'revenue_growth',
        title: 'Cơ Hội Tăng Trưởng Doanh Thu',
        description: 'Xu hướng doanh thu Q4 cho thấy tiềm năng tăng trưởng 23% ở mảng dịch vụ công nghệ',
        priority: 'high',
        impact: 'high',
        confidence: 92,
        trend: 'up',
        icon: 'fas fa-chart-line'
      },
      {
        id: 2,
        key: 'cost_optimization',
        title: 'Cảnh Báo Tối Ưu Chi Phí',
        description: 'Chi phí văn phòng tăng 18% quý này. Nên cân nhắc đàm phán lại hợp đồng nhà cung cấp',
        priority: 'medium',
        impact: 'medium',
        confidence: 87,
        trend: 'down',
        icon: 'fas fa-exclamation-triangle'
      },
      {
        id: 3,
        key: 'cashflow_prediction',
        title: 'Dự Báo Dòng Tiền',
        description: 'Dựa trên xu hướng hiện tại, dự kiến cải thiện dòng tiền tích cực quý tới',
        priority: 'low',
        impact: 'medium',
        confidence: 78,
        trend: 'up',
        icon: 'fas fa-eye'
      }
    ])

    // Enhanced expense categories with trends
    const expenseCategories = ref([
      {
        key: 'operations',
        name: 'Vận Hành',
        amount: 485,
        color: '#3b82f6',
        trend: 'down',
        change: '-3.2%'
      },
      {
        key: 'marketing',
        name: 'Marketing',
        amount: 289,
        color: '#10b981',
        trend: 'up',
        change: '+12.5%'
      },
      {
        key: 'technology',
        name: 'Công Nghệ',
        amount: 267,
        color: '#f59e0b',
        trend: 'up',
        change: '+8.7%'
      },
      {
        key: 'personnel',
        name: 'Nhân Sự',
        amount: 206,
        color: '#ef4444',
        trend: 'up',
        change: '+5.1%'
      }
    ])

    // Enhanced compliance checks with actions
    const complianceChecks = ref([
      {
        id: 1,
        key: 'tax_filing',
        title: 'Tuân Thủ Nộp Thuế',
        description: 'Tất cả báo cáo thuế quý đã được cập nhật',
        status: 'compliant',
        statusText: 'Compliant',
        icon: 'fas fa-check',
        lastChecked: '2 giờ trước'
      },
      {
        id: 2,
        key: 'reporting_standards',
        title: 'Tiêu Chuẩn Báo Cáo Tài Chính',
        description: 'Xác minh tuân thủ GAAP hoàn tất',
        status: 'compliant',
        statusText: 'Compliant',
        icon: 'fas fa-shield',
        lastChecked: '1 ngày trước'
      },
      {
        id: 3,
        key: 'audit_trail',
        title: 'Xác Minh Kiểm Toán',
        description: 'Phát hiện sai lệch nhỏ trong phân loại chi phí',
        status: 'warning',
        statusText: 'Review Required',
        icon: 'fas fa-exclamation-triangle',
        lastChecked: '3 giờ trước'
      }
    ])

    // Enhanced tax strategies with complexity and timeline
    const taxStrategies = ref([
      {
        id: 1,
        key: 'depreciation',
        title: 'Tối Ưu Khấu Hao',
        description: 'Tăng tốc khấu hao thiết bị để giảm nghĩa vụ thuế năm hiện tại',
        savings: 87500,
        savingsPercentage: 12.3,
        complexity: 'low',
        timeline: '2-3 tuần',
        actionKey: 'implement',
        actionText: 'Thực Hiện Ngay',
        icon: 'fas fa-calculator'
      },
      {
        id: 2,
        key: 'expenses',
        title: 'Tối Đa Hóa Chi Phí Kinh Doanh',
        description: 'Xác định chi phí khấu trừ bị bỏ lỡ từ đi lại và giải trí',
        savings: 34200,
        savingsPercentage: 4.8,
        complexity: 'medium',
        timeline: '1-2 tháng',
        actionKey: 'review',
        actionText: 'Xem Xét & Áp Dụng',
        icon: 'fas fa-receipt'
      },
      {
        id: 3,
        key: 'rd_credit',
        title: 'Tín Dụng Thuế R&D',
        description: 'Đủ điều kiện nhận ưu đãi thuế nghiên cứu và phát triển',
        savings: 165843,
        savingsPercentage: 23.1,
        complexity: 'high',
        timeline: '3-6 tháng',
        actionKey: 'consult',
        actionText: 'Tham Vấn Chuyên Gia',
        icon: 'fas fa-lightbulb'
      }
    ])

    // New risk analysis data
    const riskCategories = ref([
      {
        type: 'financial',
        level: 'medium',
        impact: 125,
        description: 'Biến động dòng tiền có thể ảnh hưởng đến thanh khoản ngắn hạn',
        icon: 'fas fa-dollar-sign'
      },
      {
        type: 'operational',
        level: 'low',
        impact: 65,
        description: 'Rủi ro vận hành trong mức kiểm soát với các biện pháp phòng ngừa',
        icon: 'fas fa-cog'
      },
      {
        type: 'market',
        level: 'high',
        impact: 285,
        description: 'Biến động thị trường có thể tác động đáng kể đến doanh thu',
        icon: 'fas fa-chart-line'
      },
      {
        type: 'regulatory',
        level: 'low',
        impact: 45,
        description: 'Tuân thủ quy định hiện tại ở mức tốt',
        icon: 'fas fa-flag'
      }
    ])

    // Enhanced financial forecasts
    const financialForecasts = ref([
      {
        periodKey: 'next_month',
        period: 'Tháng Tới',
        revenue: { value: 950, trend: 'positive', change: '+12.5%' },
        profit: { value: 425, trend: 'positive', change: '+18.3%' },
        trend: { 
          icon: 'fas fa-rocket', 
          textKey: 'strong_growth',
          text: 'Tăng Trưởng Mạnh' 
        }
      },
      {
        periodKey: 'next_quarter',
        period: 'Quý Tới',
        revenue: { value: 2750, trend: 'positive', change: '+8.7%' },
        profit: { value: 1150, trend: 'positive', change: '+15.2%' },
        trend: { 
          icon: 'fas fa-chart-line', 
          textKey: 'sustained_growth',
          text: 'Tăng Trưởng Bền Vững' 
        }
      },
      {
        periodKey: 'next_year',
        period: 'Năm Tới',
        revenue: { value: 12400, trend: 'positive', change: '+23.1%' },
        profit: { value: 5200, trend: 'positive', change: '+28.7%' },
        trend: { 
          icon: 'fas fa-trophy', 
          textKey: 'exponential_growth',
          text: 'Tăng Trưởng Vượt Trội' 
        }
      }
    ])

    // Enhanced notifications system
    const notifications = ref([
      {
        id: 1,
        type: 'urgent',
        title: 'Hạn Nộp Thuế',
        message: 'Hạn nộp thuế còn 7 ngày. Cần hoàn tất báo cáo.',
        time: '2 phút trước',
        icon: 'fas fa-exclamation-triangle',
        read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Insight Mới',
        message: 'Phát hiện cơ hội tiết kiệm thuế $25,000',
        time: '15 phút trước',
        icon: 'fas fa-lightbulb',
        read: false
      },
      {
        id: 3,
        type: 'success',
        title: 'Báo Cáo Hoàn Tất',
        message: 'Phân tích Q4 đã sẵn sàng để xem',
        time: '1 giờ trước',
        icon: 'fas fa-check',
        read: true
      },
      {
        id: 4,
        type: 'warning',
        title: 'Cảnh Báo Tuân Thủ',
        message: 'Cần xem xét audit trail cho giao dịch tháng 11',
        time: '2 giờ trước',
        icon: 'fas fa-shield',
        read: false
      }
    ])

    // Enhanced chatbot messages with Vietnamese support
    const chatMessages = ref([
      {
        type: 'assistant',
        text: 'Xin chào! Tôi là trợ lý AI FinXpert. Tôi có thể giúp bạn phân tích tài chính, tối ưu thuế và đảm bảo tuân thủ. Bạn cần hỗ trợ gì hôm nay?',
        timestamp: '14:30',
        options: [
          { label: 'Phân tích tài liệu', value: 'analyze' },
          { label: 'Tối ưu thuế', value: 'tax' },
          { label: 'Kiểm tra tuân thủ', value: 'compliance' },
          { label: 'Dự báo tài chính', value: 'forecast' }
        ]
      }
    ])

    // Quick suggestions for chatbot
    const quickSuggestions = ref([
      'Phân tích báo cáo thu nhập',
      'Tối ưu hóa thuế cho Q4',
      'Kiểm tra tuân thủ GAAP',
      'Dự báo dòng tiền',
      'So sánh với kỳ trước'
    ])

    // Processing steps
    const processingSteps = ref([
      'Tải lên tài liệu',
      'Trích xuất dữ liệu',
      'Phân tích AI',
      'Tạo insights',
      'Hoàn tất báo cáo'
    ])

    // Computed properties
    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length
    })

    const expenseSegments = computed(() => {
      let offset = 0
      return expenseCategories.value.map(category => {
        const percentage = (category.amount / totalExpenses.value) * 100
        const segment = {
          ...category,
          percentage,
          offset: -offset
        }
        offset += percentage * 2.2
        return segment
      })
    })

    // Enhanced methods
    const formatNumber = (num) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K'
      }
      return num.toLocaleString()
    }

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    // Universe background effects methods
    const getAtomicParticleStyle = (index) => {
      const delay = (index % 5) * 2 + 's'
      const left = Math.random() * 100 + '%'
      const animationDuration = (8 + Math.random() * 12) + 's'
      return {
        left: left,
        animationDelay: delay,
        animationDuration: animationDuration
      }
    }

    const getOrbStyle = (index) => {
      const size = (20 + Math.random() * 40) + 'px'
      const left = Math.random() * 100 + '%'
      const top = Math.random() * 100 + '%'
      const delay = index * 2.5 + 's'
      return {
        width: size,
        height: size,
        left: left,
        top: top,
        animationDelay: delay
      }
    }

    const initializeUniverseEffects = () => {
      // Initialize any additional universe effects here
      console.log('Universe effects initialized')
    }

    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files)
      processFiles(files)
    }

    const handleDrop = (event) => {
      event.preventDefault()
      isDragOver.value = false
      const files = Array.from(event.dataTransfer.files)
      processFiles(files)
    }

    const processFiles = async (files) => {
      isProcessing.value = true
      uploadProgress.value = 0
      processingProgress.value = 0
      currentStepIndex.value = 0
      
      for (let i = 0; i <= 100; i += 2) {
        uploadProgress.value = i
        await new Promise(resolve => setTimeout(resolve, 50))
      }
      
      // Simulate AI processing steps
      for (let step = 0; step < processingSteps.value.length; step++) {
        currentStepIndex.value = step
        currentProcessingStep.value = processingSteps.value[step]
        
        for (let i = 0; i <= 20; i++) {
          processingProgress.value = (step * 20) + i
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
      
      isProcessing.value = false
      showDashboard.value = true
      uploadProgress.value = 0
      
      // Add success notification
      notifications.value.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Phân Tích Hoàn Tất',
        message: `Đã phân tích thành công ${files.length} tài liệu`,
        time: 'Vừa xong',
        icon: 'fas fa-check',
        read: false
      })
    }

    const loadTemplate = (template) => {
      currentProcessingStep.value = `Đang tải mẫu ${template.name}...`
      processFiles([])
    }

    const loadDemoData = () => {
      currentProcessingStep.value = 'Đang tải dữ liệu demo...'
      processFiles([])
    }

    const showDemoAnalysis = () => {
      showDashboard.value = true
      
      // Update demo data
      heroStats.value = [
        {
          key: 'analyzed',
          value: '52,847',
          icon: 'fas fa-chart-bar',
          trend: 'positive',
          trendIcon: 'fas fa-arrow-up',
          change: '+18.2%'
        },
        {
          key: 'savings',
          value: '$4,287,543',
          icon: 'fas fa-dollar-sign',
          trend: 'positive',
          trendIcon: 'fas fa-arrow-up',
          change: '+12.7%'
        },
        {
          key: 'compliance',
          value: '98.5%',
          icon: 'fas fa-shield',
          trend: 'positive',
          trendIcon: 'fas fa-arrow-up',
          change: '+3.2%'
        }
      ]
      
      notifications.value.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Demo Analysis Loaded',
        message: 'Dữ liệu demo đã được tải thành công',
        time: 'Vừa xong',
        icon: 'fas fa-play',
        read: false
      })
    }

    const refreshAnalysis = async () => {
      isRefreshing.value = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      isRefreshing.value = false
      lastUpdated.value = 'Vừa xong'
      
      // Update some metrics
      heroStats.value[0].value = (parseInt(heroStats.value[0].value.replace(',', '')) + Math.floor(Math.random() * 100)).toLocaleString()
      
      notifications.value.unshift({
        id: Date.now(),
        type: 'info',
        title: 'Dữ Liệu Cập Nhật',
        message: 'Tất cả chỉ số đã được làm mới',
        time: 'Vừa xong',
        icon: 'fas fa-redo',
        read: false
      })
    }

    const exportReport = (format) => {
      showExportMenu.value = false
      
      const formatNames = {
        pdf: 'PDF',
        excel: 'Excel',
        powerpoint: 'PowerPoint'
      }
      
      notifications.value.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Xuất Báo Cáo',
        message: `Báo cáo ${formatNames[format]} đã được tạo thành công`,
        time: 'Vừa xong',
        icon: 'fas fa-download',
        read: false
      })
    }

    const shareReport = () => {
      showExportMenu.value = false
      
      notifications.value.unshift({
        id: Date.now(),
        type: 'info',
        title: 'Chia Sẻ Báo Cáo',
        message: 'Link chia sẻ đã được tạo và sao chép',
        time: 'Vừa xong',
        icon: 'fas fa-share',
        read: false
      })
    }

    const openChatbot = () => {
      showChatbot.value = true
    }

    const closeChatbot = () => {
      showChatbot.value = false
    }

    const sendMessage = () => {
      if (!chatInput.value.trim()) return
      
      const userMessage = {
        type: 'user',
        text: chatInput.value,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
      
      chatMessages.value.push(userMessage)
      chatInput.value = ''
      
      // Simulate AI response
      isTyping.value = true
      setTimeout(() => {
        const responses = [
          'Tôi đang phân tích yêu cầu của bạn. Dựa trên dữ liệu hiện tại, tôi có thể cung cấp những insights sau...',
          'Để tối ưu hóa thuế, tôi khuyên bạn nên xem xét các chiến lược khấu hao và tín dụng R&D.',
          'Về tuân thủ, tất cả báo cáo hiện tại đều đạt chuẩn. Tuy nhiên, có một vài điểm cần lưu ý...',
          'Dự báo cho quý tới cho thấy xu hướng tích cực với tăng trưởng dự kiến 15-20%.'
        ]
        
        const assistantMessage = {
          type: 'assistant',
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          attachments: Math.random() > 0.7 ? [
            { id: 1, name: 'tax-optimization-report.pdf', icon: 'fas fa-file' }
          ] : null
        }
        
        chatMessages.value.push(assistantMessage)
        isTyping.value = false
        
        nextTick(() => {
          if (chatMessagesContainer.value) {
            chatMessagesContainer.value.scrollTop = chatMessagesContainer.value.scrollHeight
          }
        })
      }, 2000)
    }

    const sendSuggestion = (suggestion) => {
      chatInput.value = suggestion
      sendMessage()
    }

    const clearChat = () => {
      chatMessages.value = chatMessages.value.slice(0, 1) // Keep welcome message
    }

    const handleChatOption = (option) => {
      chatInput.value = option.label
      sendMessage()
    }

    const toggleChatWidget = () => {
      chatWidgetExpanded.value = !chatWidgetExpanded.value
    }

    const handleQuickAction = (action) => {
      switch(action) {
        case 'analyze':
          // Trigger quick analysis
          break
        case 'tax':
          // Trigger tax optimization
          break
        default:
          openChatbot()
      }
    }

    const attachFile = () => {
      // File attachment logic
      console.log('Attach file')
    }

    const recordVoice = () => {
      isRecording.value = !isRecording.value
      
      if (isRecording.value) {
        setTimeout(() => {
          isRecording.value = false
          chatInput.value = 'Phân tích báo cáo tài chính cho tháng này'
        }, 3000)
      }
    }

    // Notification methods
    const markAllAsRead = () => {
      notifications.value.forEach(n => n.read = true)
    }

    const handleNotificationClick = (notification) => {
      notification.read = true
      
      // Handle different notification types
      if (notification.type === 'urgent') {
        // Open tax filing section
        console.log('Open tax filing')
      } else if (notification.type === 'info') {
        // Open insights
        console.log('Open insights')
      }
    }

    // Advanced features
    const expandCard = (cardType) => {
      console.log(`Expanding ${cardType} card`)
    }

    const generateNewInsights = () => {
      notifications.value.unshift({
        id: Date.now(),
        type: 'info',
        title: 'Insights Mới',
        message: 'Đã tạo 3 insights mới từ dữ liệu cập nhật',
        time: 'Vừa xong',
        icon: 'fas fa-lightbulb',
        read: false
      })
    }

    const viewInsightDetails = (insight) => {
      console.log('View insight details:', insight)
    }

    const implementInsight = (insight) => {
      notifications.value.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Thực Hiện Insight',
        message: `Đã áp dụng insight: ${insight.title}`,
        time: 'Vừa xong',
        icon: 'fas fa-check',
        read: false
      })
    }

    const switchChartType = () => {
      chartType.value = chartType.value === 'donut' ? 'bar' : 'donut'
    }

    const toggleCategory = (category) => {
      console.log('Toggle category:', category)
    }

    const rerunCheck = (check) => {
      check.lastChecked = 'Vừa xong'
      
      notifications.value.unshift({
        id: Date.now(),
        type: 'info',
        title: 'Kiểm Tra Tuân Thủ',
        message: `Đã kiểm tra lại: ${check.title}`,
        time: 'Vừa xong',
        icon: 'fas fa-shield',
        read: false
      })
    }

    const fixIssue = (check) => {
      check.status = 'compliant'
      check.statusText = 'Compliant'
      
      notifications.value.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Sửa Chữa Hoàn Tất',
        message: `Đã khắc phục vấn đề: ${check.title}`,
        time: 'Vừa xong',
        icon: 'fas fa-wrench',
        read: false
      })
    }

    const viewCheckDetails = (check) => {
      console.log('View check details:', check)
    }

    const implementStrategy = (strategy) => {
      notifications.value.unshift({
        id: Date.now(),
        type: 'success',
        title: 'Chiến Lược Thuế',
        message: `Đã triển khai: ${strategy.title}`,
        time: 'Vừa xong',
        icon: 'fas fa-receipt',
        read: false
      })
    }

    const learnMore = (strategy) => {
      console.log('Learn more about strategy:', strategy)
    }

    const mitigateRisk = (risk) => {
      notifications.value.unshift({
        id: Date.now(),
        type: 'info',
        title: 'Giảm Thiểu Rủi Ro',
        message: `Đã tạo kế hoạch giảm thiểu cho: ${risk.type}`,
        time: 'Vừa xong',
        icon: 'fas fa-shield',
        read: false
      })
    }

    const updateForecast = () => {
      // Update forecast with new data
      financialForecasts.value.forEach(forecast => {
        const randomChange = (Math.random() * 10 - 5).toFixed(1)
        forecast.revenue.change = `${randomChange > 0 ? '+' : ''}${randomChange}%`
        forecast.profit.change = `${randomChange > 0 ? '+' : ''}${(randomChange * 1.2).toFixed(1)}%`
      })
      
      notifications.value.unshift({
        id: Date.now(),
        type: 'info',
        title: 'Dự Báo Cập Nhật',
        message: 'Dự báo tài chính đã được làm mới với dữ liệu mới nhất',
        time: 'Vừa xong',
        icon: 'fas fa-eye',
        read: false
      })
    }

    const drillDownForecast = (forecast) => {
      console.log('Drill down forecast:', forecast)
    }

    const segmentStyle = (segment, index) => {
      return {
        stroke: segment.color,
        strokeDashoffset: segment.offset,
        strokeWidth: '8',
        fill: 'none',
        transition: 'all 0.3s ease'
      }
    }

    // Watchers
    watch(selectedTimeRange, (newRange) => {
      console.log('Time range changed:', newRange)
      refreshAnalysis()
    })

    // Lifecycle
    onMounted(() => {
      AOS.init({
        duration: 800,
        once: true,
        offset: 100
      })
      
      // Auto-refresh every 5 minutes
      setInterval(() => {
        if (!isRefreshing.value) {
          lastUpdated.value = `${Math.floor(Math.random() * 5) + 1} phút trước`
        }
      }, 300000)
      
      // Simulate real-time updates
      setInterval(() => {
        if (Math.random() > 0.8) {
          const insights = [
            'Phát hiện xu hướng chi tiêu bất thường',
            'Cơ hội tiết kiệm thuế mới được xác định',
            'Dự báo dòng tiền cập nhật',
            'Cảnh báo tuân thủ mới'
          ]
          
          notifications.value.unshift({
            id: Date.now(),
            type: 'info',
            title: 'Cập Nhật Thời Gian Thực',
            message: insights[Math.floor(Math.random() * insights.length)],
            time: 'Vừa xong',
            icon: 'fas fa-bell',
            read: false
          })
          
          // Keep only last 10 notifications
          if (notifications.value.length > 10) {
            notifications.value = notifications.value.slice(0, 10)
          }
        }
      }, 120000) // Every 2 minutes
    })

    return {
      // Refs
      fileInput,
      chatMessagesContainer,
      isDragOver,
      showDashboard,
      showChatbot,
      showNotifications,
      showExportMenu,
      showSuggestions,
      isProcessing,
      isRefreshing,
      isTyping,
      isRecording,
      uploadProgress,
      processingProgress,
      currentStepIndex,
      chatInput,
      selectedPeriod,
      selectedTimeRange,
      dashboardView,
      chartType,
      complianceScore,
      chatWidgetExpanded,
      totalTaxSavings,
      lastUpdated,
      currentProcessingStep,
      overallRiskScore,
      overallRiskLevel,
      totalExpenses,
      
      // Data
      heroStats,
      previewCards,
      supportedTypes,
      quickTemplates,
      performanceMetrics,
      financialMetrics,
      aiInsights,
      expenseCategories,
      complianceChecks,
      taxStrategies,
      riskCategories,
      financialForecasts,
      notifications,
      chatMessages,
      quickSuggestions,
      processingSteps,
      
      // Computed
      unreadCount,
      expenseSegments,
      
      // Methods
      formatNumber,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      processFiles,
      loadTemplate,
      loadDemoData,
      showDemoAnalysis,
      refreshAnalysis,
      exportReport,
      shareReport,
      openChatbot,
      closeChatbot,
      sendMessage,
      sendSuggestion,
      clearChat,
      handleChatOption,
      toggleChatWidget,
      handleQuickAction,
      attachFile,
      recordVoice,
      markAllAsRead,
      handleNotificationClick,
      expandCard,
      generateNewInsights,
      viewInsightDetails,
      implementInsight,
      switchChartType,
      toggleCategory,
      rerunCheck,
      fixIssue,
      viewCheckDetails,
      implementStrategy,
      learnMore,
      mitigateRisk,
      updateForecast,
      drillDownForecast,
      segmentStyle,
      
      // Universe effects methods
      getAtomicParticleStyle,
      getOrbStyle,
      initializeUniverseEffects
    }
  }
}
</script>

<style scoped>
/* Enhanced Black & White Theme with Atomic Effects */
.accountant-page {
  min-height: 100vh;
  max-width: 100vw;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #000000 100%);
  color: #ffffff;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  box-sizing: border-box;
}

/* Enhanced Universe Background Effects */
.universe-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  background: radial-gradient(ellipse at center, rgba(15, 15, 15, 0.9) 0%, rgba(0, 0, 0, 1) 100%);
}

/* Atomic Particles */
.atomic-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.atomic-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  border-radius: 50%;
  animation: atomicFloat 12s linear infinite;
  box-shadow: 
    0 0 4px #ffffff,
    0 0 8px rgba(255, 255, 255, 0.5),
    0 0 12px rgba(255, 255, 255, 0.3);
}

.atomic-particle:nth-child(2n) {
  background: radial-gradient(circle, #e5e5e5 0%, transparent 70%);
  box-shadow: 
    0 0 4px #e5e5e5,
    0 0 8px rgba(229, 229, 229, 0.5);
  animation-duration: 15s;
}

.atomic-particle:nth-child(3n) {
  background: radial-gradient(circle, #c0c0c0 0%, transparent 70%);
  box-shadow: 
    0 0 4px #c0c0c0,
    0 0 8px rgba(192, 192, 192, 0.5);
  animation-duration: 18s;
  animation-direction: reverse;
}

@keyframes atomicFloat {
  0% { 
    transform: translate(0, 100vh) scale(0) rotate(0deg);
    opacity: 0;
  }
  10% { 
    opacity: 1;
    transform: scale(1);
  }
  90% { 
    opacity: 1;
  }
  100% { 
    transform: translate(100vw, -10vh) scale(0) rotate(360deg);
    opacity: 0;
  }
}

/* Quantum Grid */
.quantum-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: quantumShift 20s linear infinite;
}

@keyframes quantumShift {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Floating Orbs */
.floating-orbs {
  position: absolute;
  width: 100%;
  height: 100%;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.03));
  backdrop-filter: blur(1px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: orbFloat 25s ease-in-out infinite;
}

@keyframes orbFloat {
  0%, 100% { 
    transform: translateY(0) rotate(0deg);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-30px) rotate(90deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-10px) rotate(180deg);
    opacity: 0.4;
  }
  75% { 
    transform: translateY(-50px) rotate(270deg);
    opacity: 0.7;
  }
}

/* Energy Waves */
.energy-waves {
  position: absolute;
  width: 100%;
  height: 100%;
}

.wave {
  position: absolute;
  width: 150%;
  height: 150%;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(255, 255, 255, 0.01) 40%, transparent 70%);
  border-radius: 50%;
  animation: waveExpand 20s ease-in-out infinite;
}

.wave:nth-child(1) {
  animation-delay: 0s;
  top: -25%;
  left: -25%;
}

.wave:nth-child(2) {
  animation-delay: 7s;
  top: -30%;
  left: -20%;
}

.wave:nth-child(3) {
  animation-delay: 14s;
  top: -20%;
  left: -30%;
}

@keyframes waveExpand {
  0% { 
    transform: scale(0) rotate(0deg);
    opacity: 0.8;
  }
  50% { 
    transform: scale(1) rotate(180deg);
    opacity: 0.2;
  }
  100% { 
    transform: scale(1.2) rotate(360deg);
    opacity: 0;
  }
}

/* Notifications Panel */
.notifications-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.notification-actions {
  display: flex;
  gap: 10px;
}

.mark-read-btn, .close-notifications {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mark-read-btn:hover, .close-notifications:hover {
  background: rgba(255, 255, 255, 0.2);
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border-left: 4px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.notification-item.urgent {
  border-left-color: #ef4444;
}

.notification-item.info {
  border-left-color: #3b82f6;
}

.notification-item.success {
  border-left-color: #10b981;
}

.notification-item.warning {
  border-left-color: #f59e0b;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 16px;
}

.notification-item.urgent .notification-icon {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.notification-item.info .notification-icon {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.notification-item.success .notification-icon {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.notification-item.warning .notification-icon {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  font-weight: 600;
}

.notification-content p {
  margin: 0 0 5px 0;
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.4;
}

.notification-time {
  font-size: 11px;
  opacity: 0.6;
}

.notification-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Floating Widgets */
.floating-widgets {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.floating-help, .floating-notifications {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1f2937, #374151);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.floating-help:hover, .floating-notifications:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

.notification-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Hero Actions */
.hero-actions {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.action-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.action-btn.notifications {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
  position: relative;
}

.action-btn.demo {
  background: linear-gradient(45deg, #8b5cf6, #7c3aed);
  color: #ffffff;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

/* Performance Summary */
.performance-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.metric-icon.excellent {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.metric-icon.good {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.metric-details h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
  opacity: 0.8;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

.metric-comparison {
  font-size: 12px;
}

.metric-comparison .positive {
  color: #10b981;
}

.metric-comparison .negative {
  color: #ef4444;
}

.comparison-text {
  opacity: 0.6;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
  }
  33% {
    transform: translateY(-20px) translateX(10px);
  }
  66% {
    transform: translateY(10px) translateX(-10px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .notifications-panel {
    width: 100%;
  }
  
  .floating-widgets {
    bottom: 20px;
    right: 20px;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .performance-summary {
    grid-template-columns: 1fr;
  }
}

.bg-gradient {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.1;
  animation: float 20s ease-in-out infinite;
}

.gradient-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.gradient-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #e0e0e0 0%, transparent 70%);
  top: 60%;
  right: 10%;
  animation-delay: 7s;
}

.gradient-3 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #c0c0c0 0%, transparent 70%);
  bottom: 10%;
  left: 50%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}

/* Enhanced Hero Section with Black/White Theme */
.hero-section {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
  text-align: center;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 24px;
  padding: 60px 40px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
}

.hero-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%, 
    rgba(255, 255, 255, 0.02) 50%, 
    transparent 70%
  );
  animation: heroShimmer 6s ease-in-out infinite;
  pointer-events: none;
}

@keyframes heroShimmer {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
}

.badge-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: badgeGlow 3s ease-in-out infinite;
}

@keyframes badgeGlow {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
}

.text-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  animation: textShine 4s ease-in-out infinite;
}

.text-normal {
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
}

@keyframes textShine {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.hero-text p {
  font-size: 1.3rem;
  margin-bottom: 40px;
  color: #cccccc;
  line-height: 1.6;
  word-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 40px;
}

.stat-item {
  padding: 25px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.stat-item:hover::before {
  transform: translateX(100%);
}

.stat-item:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.stat-icon {
  position: relative;
  margin-bottom: 15px;
}

.icon-background {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.8; }
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}

.stat-label {
  color: #cccccc;
  font-size: 0.9rem;
}

.hero-visual {
  position: relative;
}

.dashboard-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 40px;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(15px);
}

.preview-card {
  padding: 20px;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.preview-card:hover {
  transform: scale(1.05);
  background: rgba(255,255,255,0.15);
}

.preview-card i {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #ffffff;
}

/* Upload Section */
.upload-section {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #ffffff;
  word-wrap: break-word;
  hyphens: auto;
  line-height: 1.2;
  max-width: 100%;
}

.section-header p {
  font-size: 1.1rem;
  color: #cccccc;
}

.upload-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.upload-zone {
  padding: 60px 40px;
  border: 2px dashed rgba(255,255,255,0.3);
  border-radius: 20px;
  text-align: center;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-zone:hover,
.upload-zone.drag-over {
  border-color: #ffffff;
  background: rgba(255,255,255,0.1);
  transform: translateY(-5px);
}

.upload-icon {
  font-size: 4rem;
  color: #ffffff;
  margin-bottom: 20px;
  opacity: 0.7;
}

.upload-zone h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #ffffff;
}

.upload-zone p {
  color: #cccccc;
  margin-bottom: 30px;
}

/* Enhanced Action Buttons */
.action-btn {
  position: relative;
  padding: 16px 32px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.8);
  color: #ffffff;
  text-decoration: none;
}

.btn-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.action-btn:hover .btn-bg {
  transform: translateX(0);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.action-btn.primary {
  background: linear-gradient(135deg, #000000, #333333);
  border-color: rgba(255, 255, 255, 0.3);
}

.action-btn.primary:hover {
  background: linear-gradient(135deg, #1a1a1a, #404040);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(255, 255, 255, 0.15);
}

.upload-btn {
  background: linear-gradient(135deg, #000000, #333333);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.btn-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.upload-btn:hover .btn-particles {
  transform: translateX(100%);
}

.upload-btn:hover {
  transform: translateY(-3px);
  box-shadow: 
    0 15px 35px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
}

.quick-templates {
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 40px;
  border: 1px solid rgba(255,255,255,0.1);
}

.quick-templates h3 {
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #ffffff;
}

.template-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.template-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(255,255,255,0.08);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.1);
}

.template-card:hover {
  background: rgba(255,255,255,0.15);
  transform: translateX(10px);
}

.template-icon {
  font-size: 1.5rem;
  color: #ffffff;
  margin-right: 15px;
  min-width: 40px;
}

.template-info h4 {
  color: #ffffff;
  margin-bottom: 5px;
}

.template-info p {
  color: #cccccc;
  font-size: 0.9rem;
}

/* Dashboard Section */
.dashboard-section {
  position: relative;
  z-index: 1;
  padding: 80px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.dashboard-header h2 {
  font-size: 2.5rem;
  color: #ffffff;
  font-weight: 600;
}

.dashboard-controls {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.control-btn {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.control-btn:hover {
  background: rgba(255,255,255,0.2);
  transform: translateY(-2px);
}

.control-btn.primary {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: #ffffff;
}

.control-btn.ai-assist {
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  color: #000000;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.3); }
  50% { box-shadow: 0 0 30px rgba(255,255,255,0.6); }
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Analysis Grid */
.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.analysis-card {
  background: rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(15px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.analysis-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s;
}

.analysis-card:hover::before {
  left: 100%;
}

.analysis-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(255,255,255,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-title i {
  font-size: 1.5rem;
  color: #ffffff;
  padding: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
}

.card-title h3 {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
}

.card-badge {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Financial Overview Card */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
}

.metric-icon {
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  color: #ffffff;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 5px;
}

.metric-label {
  color: #cccccc;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.metric-change {
  font-size: 0.9rem;
  font-weight: 600;
}

.metric-change.positive { color: #4ade80; }
.metric-change.negative { color: #f87171; }

/* AI Insights Card */
.insight-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #cccccc;
}

.insight-status.active .status-dot {
  background: #4ade80;
  animation: pulse 2s ease-in-out infinite;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #cccccc;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.insight-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border-left: 4px solid transparent;
}

.insight-item.high { border-left-color: #f87171; }
.insight-item.medium { border-left-color: #fbbf24; }
.insight-item.low { border-left-color: #4ade80; }

.insight-icon {
  padding: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #ffffff;
  min-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.insight-content h4 {
  color: #ffffff;
  margin-bottom: 8px;
  font-weight: 600;
}

.insight-content p {
  color: #cccccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 12px;
}

.insight-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-btn {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255,255,255,0.2);
}

.insight-impact {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 10px;
}

.insight-impact.high { background: rgba(248,113,113,0.2); color: #f87171; }
.insight-impact.medium { background: rgba(251,191,36,0.2); color: #fbbf24; }
.insight-impact.low { background: rgba(74,222,128,0.2); color: #4ade80; }

/* Expense Analysis Card */
.period-selector {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.chart-container {
  display: flex;
  align-items: center;
  gap: 40px;
}

.donut-chart {
  position: relative;
  width: 200px;
  height: 200px;
}

.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-background {
  fill: none;
  stroke: rgba(255,255,255,0.1);
  stroke-width: 8;
}

.donut-segment {
  fill: none;
  stroke-width: 8;
  transition: all 0.3s ease;
  stroke-linecap: round;
}

.chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.center-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
}

.center-label {
  color: #cccccc;
  font-size: 0.9rem;
}

.chart-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  flex: 1;
  color: #cccccc;
}

.legend-value {
  color: #ffffff;
  font-weight: 600;
}

/* Compliance Monitor Card */
.compliance-score {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 0.9rem;
  color: #cccccc;
}

.score-circle {
  position: relative;
  width: 60px;
  height: 60px;
}

.score-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-bg {
  fill: none;
  stroke: rgba(255,255,255,0.1);
  stroke-width: 4;
}

.score-fill {
  fill: none;
  stroke: #4ade80;
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dasharray 1s ease;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.compliance-checks {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.compliance-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  border-left: 4px solid transparent;
}

.compliance-item.passed { border-left-color: #4ade80; }
.compliance-item.warning { border-left-color: #fbbf24; }
.compliance-item.failed { border-left-color: #f87171; }

.check-icon {
  padding: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  color: #ffffff;
}

.check-content {
  flex: 1;
}

.check-content h4 {
  color: #ffffff;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.check-content p {
  color: #cccccc;
  font-size: 0.8rem;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge.passed { background: rgba(74,222,128,0.2); color: #4ade80; }
.status-badge.warning { background: rgba(251,191,36,0.2); color: #fbbf24; }
.status-badge.failed { background: rgba(248,113,113,0.2); color: #f87171; }

/* Tax Optimization Card */
.tax-strategies {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tax-strategy {
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border-left: 4px solid transparent;
}

.tax-strategy.low { border-left-color: #4ade80; }
.tax-strategy.medium { border-left-color: #fbbf24; }
.tax-strategy.high { border-left-color: #f87171; }

.strategy-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
}

.strategy-icon {
  padding: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #ffffff;
}

.strategy-info h4 {
  color: #ffffff;
  margin-bottom: 8px;
}

.strategy-info p {
  color: #cccccc;
  font-size: 0.9rem;
  line-height: 1.4;
}

.strategy-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.savings-amount {
  text-align: center;
}

.savings-label {
  display: block;
  color: #cccccc;
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.savings-value {
  color: #4ade80;
  font-size: 1.2rem;
  font-weight: 700;
}

.strategy-btn {
  background: linear-gradient(45deg, #ffffff, #e0e0e0);
  color: #000000;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.strategy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255,255,255,0.3);
}

/* Predictive Analytics Card */
.forecast-confidence {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #cccccc;
}

.confidence-meter {
  width: 60px;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 4px;
  transition: width 1s ease;
}

.forecast-timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forecast-item {
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
}

.forecast-period {
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 15px;
}

.forecast-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

.forecast-metric {
  text-align: center;
}

.forecast-metric .metric-label {
  display: block;
  color: #cccccc;
  font-size: 0.8rem;
  margin-bottom: 5px;
}

.forecast-metric .metric-value {
  font-size: 1.2rem;
  font-weight: 700;
}

.forecast-metric .metric-value.positive { color: #4ade80; }
.forecast-metric .metric-value.negative { color: #f87171; }

.forecast-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #4ade80;
  font-weight: 600;
}

/* Chatbot */
.chatbot-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.chatbot-container {
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.chatbot-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ffffff, #e0e0e0);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-size: 1.5rem;
}

.chatbot-info {
  flex: 1;
}

.chatbot-info h3 {
  color: #ffffff;
  margin-bottom: 5px;
}

.chatbot-status {
  color: #4ade80;
  font-size: 0.9rem;
}

.chatbot-close {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.chatbot-close:hover {
  background: rgba(255,255,255,0.1);
}

.chatbot-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  max-height: 400px;
}

.message {
  margin-bottom: 20px;
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.message-content {
  max-width: 80%;
  padding: 15px;
  border-radius: 15px;
  word-wrap: break-word;
}

.message.user .message-content {
  background: linear-gradient(45deg, #ffffff, #e0e0e0);
  color: #000000;
}

.message.assistant .message-content {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.1);
}

.message-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.option-btn {
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-btn:hover {
  background: rgba(255,255,255,0.2);
}

.typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #ffffff;
  border-radius: 50%;
  animation: typing 1.4s ease-in-out infinite;
}

.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
  0%, 60%, 100% { opacity: 0.3; }
  30% { opacity: 1; }
}

.chatbot-input {
  display: flex;
  padding: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
  gap: 10px;
}

.chat-input {
  flex: 1;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #ffffff;
  padding: 12px 15px;
  border-radius: 25px;
  outline: none;
}

.chat-input::placeholder {
  color: #cccccc;
}

.send-btn {
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover {
  transform: scale(1.05);
}

/* Integrated Chatbot Widget */
.integrated-chatbot-widget {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
  max-width: 350px;
  width: 350px;
}

.chatbot-card {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chatbot-card.widget-minimized {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.widget-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.widget-minimized .widget-header {
  padding: 15px;
  border-bottom: none;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  justify-content: center;
}

.widget-icon {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  font-size: 1rem;
  margin-right: 15px;
  flex-shrink: 0;
}

.widget-minimized .widget-icon {
  margin-right: 0;
  font-size: 1.5rem;
  width: 100%;
  height: 100%;
  background: transparent;
  animation: bounce 2s infinite;
}

.icon-pulse {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.widget-info {
  flex: 1;
  color: #000;
}

.widget-info h4 {
  margin: 0 0 5px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
}

.widget-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #666;
}

.widget-toggle {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.widget-toggle:hover {
  background: rgba(0,0,0,0.1);
  color: #000;
}

.widget-body {
  padding: 20px;
  background: rgba(255,255,255,0.9);
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.quick-action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 10px;
  background: rgba(255,255,255,0.7);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
  font-size: 0.8rem;
  text-align: center;
}

.quick-action-btn:hover {
  background: rgba(255,255,255,0.9);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.quick-action-btn.primary {
  grid-column: 1 / -1;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  color: white;
  border-color: transparent;
}

.quick-action-btn.primary:hover {
  background: linear-gradient(45deg, #16a34a, #15803d);
}

.quick-action-btn i {
  font-size: 1.2rem;
}

.widget-preview {
  border-top: 1px solid rgba(0,0,0,0.1);
  padding-top: 15px;
}

.preview-message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(45deg, #22c55e, #16a34a);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
  background: rgba(0,0,0,0.05);
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  line-height: 1.4;
  color: #333;
}

.message-content p {
  margin: 0;
}

.help-tooltip {
  position: absolute;
  right: 70px;
  top: 50%;
  transform: translateX(-100%) translateY(-50%) scale(0.8);
  background: rgba(0,0,0,0.9);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease;
  pointer-events: none;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Processing Overlay */
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  backdrop-filter: blur(15px);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
}

.processing-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.processing-animation {
  position: relative;
  margin-bottom: 30px;
}

.processing-circle {
  width: 80px;
  height: 80px;
  border: 4px solid rgba(255,255,255,0.2);
  border-top: 4px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.processing-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.processing-dots span {
  width: 10px;
  height: 10px;
  background: #ffffff;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

.processing-dots span:nth-child(2) { animation-delay: 0.2s; }
.processing-dots span:nth-child(3) { animation-delay: 0.4s; }

.processing-content h3 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.processing-content p {
  color: #cccccc;
  margin-bottom: 30px;
}

.processing-steps {
  display: flex;
  align-items: center;
  gap: 15px;
}

.step-item {
  display: flex;
  align-items: center;
}

.step-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  margin-right: 8px;
}

.step-item.active .step-icon {
  background: #4ade80;
}

.step-item.completed .step-icon {
  background: #cccccc;
}

.step-item span {
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .analysis-grid {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-text h1 {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .upload-area {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .dashboard-controls {
    justify-content: center;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .forecast-metrics {
    grid-template-columns: 1fr;
  }
  
  .chatbot-container {
    margin: 10px;
    max-height: 90vh;
  }
}

@media (max-width: 480px) {
  .hero-text h1 {
    font-size: 2rem;
  }
  
  .section-header h2 {
    font-size: 2rem;
  }
  
  .dashboard-header h2 {
    font-size: 2rem;
  }
  
  .floating-help {
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

/* Risk Analysis Card */
.risk-analysis {
  position: relative;
}

.risk-score-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.risk-score-svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.risk-score-background {
  fill: none;
  stroke: rgba(255,255,255,0.1);
  stroke-width: 8;
}

.risk-score-progress {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-in-out;
}

.risk-score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.risk-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 2px;
}

.risk-label {
  font-size: 0.8rem;
  color: #cccccc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.risk-level {
  text-align: center;
  margin-bottom: 15px;
}

.risk-level-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.risk-level-badge.low {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
}

.risk-level-badge.medium {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
}

.risk-level-badge.high {
  background: linear-gradient(45deg, #ef4444, #dc2626);
  color: white;
}

.risk-factors {
  margin-top: 20px;
}

.risk-factor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.risk-factor:last-child {
  border-bottom: none;
}

.factor-name {
  color: #cccccc;
  font-size: 0.9rem;
}

.factor-score {
  font-weight: 600;
  color: #ffffff;
}

/* Enhanced processing overlay */
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(10px);
}

.processing-content {
  text-align: center;
  max-width: 400px;
  padding: 40px;
}

.processing-animation {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
}

.processing-circle {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  position: relative;
  animation: pulse 2s ease-in-out infinite;
}

.circle-progress {
  position: absolute;
  top: -4px;
  left: -4px;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.processing-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  color: #22c55e;
  animation: bounce 1.5s ease-in-out infinite;
}

.processing-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 30px 0;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 15px;
  color: #888888;
  transition: all 0.3s ease;
}

.step-item.active {
  color: #22c55e;
  transform: translateX(10px);
}

.step-item.completed {
  color: #ffffff;
}

.step-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.step-item.active .step-icon {
  background: #22c55e;
  color: white;
}

.step-item.completed .step-icon {
  background: #ffffff;
  color: #000000;
}

.processing-progress {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  border-radius: 4px;
  transition: width 0.3s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

/* Prevent Horizontal Scroll - Enhanced */
* {
  box-sizing: border-box;
}

html, body {
  overflow-x: hidden;
  max-width: 100vw;
}

.accountant-page {
  max-width: 100vw;
  overflow-x: hidden;
}

.main-content,
.hero-content,
.analysis-grid,
.analysis-card,
.card-content,
.hero-stats,
.dashboard-controls,
.dashboard-section,
.upload-section,
.hero-section {
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Enhanced text layout */
.analysis-card h3,
.card-title h3,
.section-header h2,
.dashboard-header h2,
.hero-text h1,
.hero-text p,
.upload-zone h3,
.upload-zone p {
  word-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
  max-width: 100%;
}

/* Responsive Design */
@media (max-width: 1400px) {
  .main-content {
    padding: 25px 20px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .hero-content {
    padding: 40px 20px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .hero-stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .dashboard-controls {
    gap: 12px;
    max-width: 100%;
    overflow-x: hidden;
    flex-wrap: wrap;
  }
  
  .analysis-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 20px;
    max-width: 100%;
    overflow-x: hidden;
  }
}

@media (max-width: 1200px) {
  .hero-stats {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 18px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .analysis-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 18px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .control-btn {
    padding: 12px 18px;
    font-size: 0.9rem;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

@media (max-width: 968px) {
  .main-content {
    padding: 20px 15px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .hero-content {
    padding: 35px 15px;
    max-width: 100%;
    overflow-x: hidden;
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }
  
  .hero-text h1 {
    font-size: 2.2rem;
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.2;
    text-align: center;
  }
  
  .hero-text p {
    font-size: 1.1rem;
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.5;
    text-align: center;
  }
  
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .dashboard-preview {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 20px;
  }
  
  .upload-area {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .upload-zone {
    padding: 30px 20px;
  }
  
  .upload-zone h3 {
    font-size: 1.2rem;
    word-wrap: break-word;
  }
  
  .section-header h2 {
    font-size: 2rem;
    word-wrap: break-word;
    hyphens: auto;
    line-height: 1.2;
  }
  
  .section-header p {
    font-size: 1rem;
    word-wrap: break-word;
    line-height: 1.4;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .dashboard-controls {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .control-btn {
    width: 100%;
    justify-content: center;
    padding: 12px 15px;
    min-height: 44px; /* Touch target minimum */
    font-size: 16px; /* Prevent iOS zoom */
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  
  .analysis-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .analysis-card {
    padding: 20px 15px;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  
  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .card-actions {
    display: flex;
    gap: 8px;
    width: 100%;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  
  .chart-container {
    flex-direction: column;
    gap: 20px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .donut-chart {
    align-self: center;
    max-width: 200px;
    width: 100%;
    box-sizing: border-box;
  }
  
  /* Chatbot widget responsive */
  .integrated-chatbot-widget {
    bottom: 20px;
    right: 20px;
    max-width: 320px;
    width: 320px;
    box-sizing: border-box;
  }
  
  .widget-body {
    padding: 15px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .quick-actions {
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .quick-action-btn {
    padding: 12px 8px;
    font-size: 0.75rem;
    flex: 1;
    min-width: 80px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

/* Additional mobile-specific improvements */
@media (max-width: 768px) {
  /* Enhanced touch targets */
  .control-btn,
  .action-btn,
  .btn {
    min-height: 44px;
    min-width: 44px;
    font-size: 16px !important; /* Prevent iOS zoom */
    border-radius: 10px;
  }
  
  /* Better form inputs */
  .period-selector,
  input[type="text"],
  input[type="number"],
  select {
    font-size: 16px !important; /* Prevent iOS zoom */
    min-height: 44px;
    padding: 10px 12px;
    border-radius: 8px;
  }
  
  /* Optimize animations for mobile performance */
  .analysis-card:hover,
  .metric-item:hover {
    transform: none; /* Disable hover animations on mobile */
  }
  
  /* Better focus states for accessibility */
  .control-btn:focus,
  .action-btn:focus,
  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.5);
  }
  
  /* Improve spacing for mobile */
  .hero-text {
    text-align: center;
    margin-bottom: 25px;
  }
  
  .dashboard-section {
    padding: 25px 15px;
  }
  
  /* Better metric displays */
  .metric-item {
    padding: 15px;
    text-align: center;
  }
  
  .metric-value {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }
  
  .metric-label {
    font-size: 0.85rem;
  }
  
  /* Improved processing overlay for mobile */
  .processing-overlay {
    padding: 15px;
  }
  
  .processing-content {
    padding: 20px 15px;
    max-width: 320px;
    border-radius: 12px;
  }
  
  .processing-animation {
    width: 70px;
    height: 70px;
  }
  
  /* Mobile chatbot widget */
  .integrated-chatbot-widget {
    bottom: 15px;
    right: 15px;
    max-width: 300px;
    width: 300px;
  }
  
  .chatbot-card.widget-minimized {
    width: 55px;
    height: 55px;
  }
  
  .widget-minimized .widget-header {
    padding: 12px;
  }
  
  .widget-minimized .widget-icon {
    font-size: 1.3rem;
  }
  
  .widget-body {
    padding: 12px;
  }
  
  .quick-actions {
    gap: 6px;
    margin-bottom: 15px;
  }
  
  .quick-action-btn {
    padding: 10px 6px;
    font-size: 0.7rem;
    gap: 6px;
  }
  
  .quick-action-btn i {
    font-size: 1rem;
  }
  
  .message-content {
    font-size: 0.8rem;
    padding: 8px 10px;
  }
}

@media (max-width: 640px) {
  .hero-stats {
    grid-template-columns: 1fr;
    gap: 12px;
    max-width: 100%;
    overflow-x: hidden;
  }
  
  .stat-item {
    padding: 15px;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  
  .analysis-card {
    padding: 15px 12px;
    margin-bottom: 12px;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  
  .card-title h3 {
    font-size: 1.1rem;
    word-wrap: break-word;
  }
  
  .control-btn {
    padding: 10px 12px;
    font-size: 16px;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  
  .metric-item {
    padding: 12px;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  
  .processing-content {
    max-width: 280px;
    padding: 18px 12px;
    box-sizing: border-box;
  }
}

/* Additional enhancements for very small screens */
@media (max-width: 480px) {
  .hero-text h1 {
    font-size: 1.6rem;
    line-height: 1.3;
  }
  
  .hero-text p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  .dashboard-header h2 {
    font-size: 1.4rem;
  }
  
  .analysis-card {
    padding: 12px 10px;
    border-radius: 10px;
  }
  
  .card-title {
    margin-bottom: 12px;
  }
  
  .card-title i {
    font-size: 1.1rem;
    padding: 8px;
  }
  
  .control-btn {
    padding: 8px 10px;
    font-size: 16px;
    border-radius: 8px;
  }
  
  .metric-item {
    padding: 10px;
    border-radius: 8px;
  }
  
  .donut-chart {
    max-width: 180px;
  }
}

@media (max-width: 320px) {
  .main-content {
    padding: 12px 8px;
  }
  
  .hero-content {
    padding: 25px 8px;
  }
  
  .dashboard-section {
    padding: 20px 8px;
  }
  
  .hero-text h1 {
    font-size: 1.3rem;
  }
  
  .hero-text p {
    font-size: 0.85rem;
  }
  
  .dashboard-header h2 {
    font-size: 1.2rem;
  }
  
  .analysis-card {
    padding: 10px 8px;
  }
  
  .control-btn {
    padding: 8px;
    font-size: 16px;
  }
  
  .metric-item {
    padding: 8px;
  }
  
  .processing-content {
    max-width: 260px;
    padding: 15px 10px;
  }
  
  .processing-animation {
    width: 50px;
    height: 50px;
  }
}
</style> 