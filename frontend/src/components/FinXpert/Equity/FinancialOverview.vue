<template>
  <div class="financial-overview">
    <!-- Header -->
    <div class="financial-header">
      <div class="header-info">
        <h2>Financial Overview</h2>
        <p>{{ selectedTicker }} - Financial Statements Analysis</p>
      </div>
      <div class="header-controls">
        <select v-model="selectedPeriod" class="control-select">
          <option value="annual">Annual</option>
          <option value="quarterly">Quarterly</option>
        </select>
        <button @click="refreshData" class="refresh-btn">
          <font-awesome-icon icon="fa-solid fa-sync-alt" :class="{ spinning: isLoading }" />
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
      >
        <font-awesome-icon :icon="tab.icon" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Content -->
    <div class="content-area">
      <!-- Income Statement -->
      <div v-if="activeTab === 'income'" class="statement-content">
        <div class="section-header">
          <h3>Income Statement</h3>
          <button @click="showChart = !showChart" class="chart-toggle">
            <font-awesome-icon icon="fa-solid fa-chart-bar" />
            {{ showChart ? 'Hide' : 'Show' }} Chart
          </button>
        </div>

        <div v-if="showChart" class="chart-container">
          <canvas ref="incomeChart" width="500" height="250"></canvas>
        </div>

        <div class="data-table">
          <div class="table-header">
            <div class="metric-col">Metric</div>
            <div class="value-col">2023</div>
            <div class="value-col">2022</div>
            <div class="value-col">2021</div>
          </div>
          <div v-for="item in incomeData" :key="item.metric" :class="['table-row', item.type]">
            <div class="metric-col">{{ item.metric }}</div>
            <div class="value-col">{{ formatValue(item.values[2023]) }}</div>
            <div class="value-col">{{ formatValue(item.values[2022]) }}</div>
            <div class="value-col">{{ formatValue(item.values[2021]) }}</div>
          </div>
        </div>
      </div>

      <!-- Balance Sheet -->
      <div v-if="activeTab === 'balance'" class="statement-content">
        <div class="section-header">
          <h3>Balance Sheet</h3>
          <button @click="showChart = !showChart" class="chart-toggle">
            <font-awesome-icon icon="fa-solid fa-chart-pie" />
            {{ showChart ? 'Hide' : 'Show' }} Chart
          </button>
        </div>

        <div v-if="showChart" class="chart-container">
          <canvas ref="balanceChart" width="500" height="250"></canvas>
        </div>

        <div class="data-table">
          <div class="table-header">
            <div class="metric-col">Item</div>
            <div class="value-col">2023</div>
            <div class="value-col">2022</div>
            <div class="value-col">2021</div>
          </div>
          <div v-for="item in balanceData" :key="item.metric" :class="['table-row', item.type]">
            <div class="metric-col">{{ item.metric }}</div>
            <div class="value-col">{{ formatValue(item.values[2023]) }}</div>
            <div class="value-col">{{ formatValue(item.values[2022]) }}</div>
            <div class="value-col">{{ formatValue(item.values[2021]) }}</div>
          </div>
        </div>
      </div>

      <!-- Cash Flow -->
      <div v-if="activeTab === 'cashflow'" class="statement-content">
        <div class="section-header">
          <h3>Cash Flow Statement</h3>
          <button @click="showChart = !showChart" class="chart-toggle">
            <font-awesome-icon icon="fa-solid fa-chart-line" />
            {{ showChart ? 'Hide' : 'Show' }} Chart
          </button>
        </div>

        <div v-if="showChart" class="chart-container">
          <canvas ref="cashChart" width="500" height="250"></canvas>
        </div>

        <div class="data-table">
          <div class="table-header">
            <div class="metric-col">Cash Flow</div>
            <div class="value-col">2023</div>
            <div class="value-col">2022</div>
            <div class="value-col">2021</div>
          </div>
          <div v-for="item in cashFlowData" :key="item.metric" :class="['table-row', item.type]">
            <div class="metric-col">{{ item.metric }}</div>
            <div class="value-col">{{ formatValue(item.values[2023]) }}</div>
            <div class="value-col">{{ formatValue(item.values[2022]) }}</div>
            <div class="value-col">{{ formatValue(item.values[2021]) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Ratios -->
    <div class="ratios-section">
      <h3>Key Financial Ratios</h3>
      <div class="ratios-grid">
        <div v-for="ratio in keyRatios" :key="ratio.name" class="ratio-card">
          <div class="ratio-value">{{ ratio.value }}</div>
          <div class="ratio-name">{{ ratio.name }}</div>
          <div class="ratio-trend" :class="ratio.trend">
            <font-awesome-icon :icon="ratio.trend === 'up' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down'" />
            {{ ratio.change }}
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
  faSyncAlt, faChartBar, faChartPie, faChartLine, 
  faArrowUp, faArrowDown, faFileInvoiceDollar, 
  faBalanceScale, faCoins
} from '@fortawesome/free-solid-svg-icons';

library.add(faSyncAlt, faChartBar, faChartPie, faChartLine, faArrowUp, faArrowDown, faFileInvoiceDollar, faBalanceScale, faCoins);

export default {
  name: 'FinancialOverview',
  components: { FontAwesomeIcon },
  data() {
    return {
      selectedTicker: 'AAPL',
      selectedPeriod: 'annual',
      activeTab: 'income',
      isLoading: false,
      showChart: true,
      tabs: [
        { id: 'income', label: 'Income Statement', icon: 'fa-solid fa-file-invoice-dollar' },
        { id: 'balance', label: 'Balance Sheet', icon: 'fa-solid fa-balance-scale' },
        { id: 'cashflow', label: 'Cash Flow', icon: 'fa-solid fa-coins' }
      ],
      incomeData: [
        { metric: 'Revenue', type: 'header', values: { 2023: 383285, 2022: 394328, 2021: 365817 } },
        { metric: 'Cost of Revenue', type: 'normal', values: { 2023: 214137, 2022: 223546, 2021: 212981 } },
        { metric: 'Gross Profit', type: 'subtotal', values: { 2023: 169148, 2022: 170782, 2021: 152836 } },
        { metric: 'Operating Expenses', type: 'normal', values: { 2023: 55013, 2022: 51345, 2021: 43887 } },
        { metric: 'Operating Income', type: 'subtotal', values: { 2023: 114301, 2022: 119437, 2021: 108949 } },
        { metric: 'Net Income', type: 'total', values: { 2023: 96995, 2022: 99803, 2021: 94680 } }
      ],
      balanceData: [
        { metric: 'Total Assets', type: 'total', values: { 2023: 352755, 2022: 352583, 2021: 351002 } },
        { metric: 'Current Assets', type: 'header', values: { 2023: 143566, 2022: 135405, 2021: 134047 } },
        { metric: 'Cash & Equivalents', type: 'normal', values: { 2023: 29965, 2022: 23646, 2021: 34940 } },
        { metric: 'Total Liabilities', type: 'header', values: { 2023: 290437, 2022: 302083, 2021: 287912 } },
        { metric: 'Total Equity', type: 'total', values: { 2023: 62318, 2022: 50500, 2021: 63090 } }
      ],
      cashFlowData: [
        { metric: 'Operating Cash Flow', type: 'header', values: { 2023: 110543, 2022: 122151, 2021: 104038 } },
        { metric: 'Investing Cash Flow', type: 'normal', values: { 2023: -3705, 2022: -22354, 2021: -14545 } },
        { metric: 'Financing Cash Flow', type: 'normal', values: { 2023: -108488, 2022: -110749, 2021: -93353 } },
        { metric: 'Free Cash Flow', type: 'total', values: { 2023: 99584, 2022: 111443, 2021: 92953 } }
      ],
      keyRatios: [
        { name: 'P/E Ratio', value: '29.85', change: '+2.3%', trend: 'up' },
        { name: 'ROE', value: '155.6%', change: '+5.2%', trend: 'up' },
        { name: 'Gross Margin', value: '44.1%', change: '-0.8%', trend: 'down' },
        { name: 'Net Margin', value: '25.3%', change: '-0.9%', trend: 'down' }
      ]
    };
  },
  
  mounted() {
    this.drawCharts();
  },
  
  methods: {
    refreshData() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.drawCharts();
      }, 1000);
    },
    
    formatValue(value) {
      if (value >= 1000) return `$${(value/1000).toFixed(1)}B`;
      return `$${value}M`;
    },
    
    drawCharts() {
      this.$nextTick(() => {
        if (this.activeTab === 'income' && this.$refs.incomeChart) {
          this.drawIncomeChart();
        } else if (this.activeTab === 'balance' && this.$refs.balanceChart) {
          this.drawBalanceChart();
        } else if (this.activeTab === 'cashflow' && this.$refs.cashChart) {
          this.drawCashChart();
        }
      });
    },
    
    drawIncomeChart() {
      const canvas = this.$refs.incomeChart;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const data = [365.8, 394.3, 383.3];
      const labels = ['2021', '2022', '2023'];
      
      // Chart setup
      const padding = 40;
      const chartWidth = canvas.width - 2 * padding;
      const chartHeight = canvas.height - 2 * padding;
      const barWidth = chartWidth / data.length * 0.6;
      
      // Draw bars
      data.forEach((value, index) => {
        const barHeight = (value / 400) * chartHeight;
        const x = padding + (index * chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;
        const y = canvas.height - padding - barHeight;
        
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth/2, canvas.height - 10);
        ctx.fillText(`$${value}B`, x + barWidth/2, y - 10);
      });
    },
    
    drawBalanceChart() {
      const canvas = this.$refs.balanceChart;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Pie chart for Assets vs Liabilities
      const total = 352.8;
      const assets = 352.8;
      const liabilities = 290.4;
      const equity = 62.4;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 80;
      
      let currentAngle = 0;
      
      // Assets
      const assetsAngle = (assets / total) * 2 * Math.PI;
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + assetsAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      currentAngle += assetsAngle;
      
      // Liabilities
      const liabilitiesAngle = (liabilities / total) * 2 * Math.PI;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + liabilitiesAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      
      // Legend
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px sans-serif';
      ctx.fillText('■ Assets: $352.8B', 20, 20);
      ctx.fillStyle = '#ef4444';
      ctx.fillText('■ Liabilities: $290.4B', 20, 40);
    },
    
    drawCashChart() {
      const canvas = this.$refs.cashChart;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const data = [104.0, 122.2, 110.5];
      const labels = ['2021', '2022', '2023'];
      
      // Line chart
      const padding = 40;
      const chartWidth = canvas.width - 2 * padding;
      const chartHeight = canvas.height - 2 * padding;
      
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = canvas.height - padding - ((value - 90) / 40) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        // Points
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Labels
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x, canvas.height - 10);
        ctx.fillText(`$${value}B`, x, y - 15);
      });
      
      ctx.stroke();
    }
  },
  
  watch: {
    activeTab() {
      this.$nextTick(() => {
        this.drawCharts();
      });
    },
    showChart() {
      if (this.showChart) {
        this.$nextTick(() => {
          this.drawCharts();
        });
      }
    }
  }
};
</script>

<style scoped>
.financial-overview {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid #f0f0f0;
}

.financial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
}

.header-info h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.header-info p {
  margin: 0;
  color: #6b7280;
}

.header-controls {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.control-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
}

.refresh-btn {
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: white;
  color: #1a1a1a;
  border-bottom: 3px solid #000;
}

.content-area {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
}

.chart-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
}

.chart-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
}

.chart-container canvas {
  background: white;
  border-radius: 8px;
}

.data-table {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: #f8f9fa;
  font-weight: 700;
  color: #374151;
}

.table-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row.header {
  background: #e5e7eb;
  font-weight: 700;
}

.table-row.subtotal {
  background: #f3f4f6;
  font-weight: 600;
}

.table-row.total {
  background: #1f2937;
  color: white;
  font-weight: 700;
}

.metric-col {
  flex: 2;
  padding: 1rem;
  border-right: 1px solid #e5e7eb;
}

.value-col {
  flex: 1;
  padding: 1rem;
  text-align: right;
  border-right: 1px solid #e5e7eb;
}

.value-col:last-child {
  border-right: none;
}

.ratios-section {
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.ratios-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
}

.ratios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.ratio-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.ratio-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
}

.ratio-name {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.25rem 0;
}

.ratio-trend {
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.ratio-trend.up {
  color: #059669;
}

.ratio-trend.down {
  color: #dc2626;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 