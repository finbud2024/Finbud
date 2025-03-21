<template>
  <section class="chart-section">
    <header class="chart-header">
      <h1>Portfolio Performance</h1>
      <div class="portfolio-summary">
        <div class="summary-item">
          <span class="summary-label">Total Value</span>
          <span class="summary-value">${{ portfolioTotalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</span>
        </div>
        <div class="summary-item" :class="{ positive: portfolioDailyChange.isPositive, negative: !portfolioDailyChange.isPositive }">
          <span class="summary-label">Today</span>
          <span class="summary-value">
            {{ portfolioDailyChange.isPositive ? '+' : '-' }}${{ portfolioDailyChange.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            ({{ portfolioDailyChange.isPositive ? '+' : '-' }}{{ portfolioDailyChange.percent.toFixed(2) }}%)
          </span>
        </div>
        <div class="summary-item" :class="{ positive: portfolioOverallChange.isPositive, negative: !portfolioOverallChange.isPositive }">
          <span class="summary-label">Overall</span>
          <span class="summary-value">
            {{ portfolioOverallChange.isPositive ? '+' : '-' }}${{ portfolioOverallChange.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
            ({{ portfolioOverallChange.isPositive ? '+' : '-' }}{{ portfolioOverallChange.percent.toFixed(2) }}%)
          </span>
        </div>
      </div>
    </header>

    <!-- Time Range Selector -->
    <div class="time-range-selector">
      <button 
        v-for="range in timeRanges" 
        :key="range.value"
        :class="{ active: selectedRange === range.value }"
        @click="changeTimeRange(range.value)">
        {{ range.label }}
      </button>
    </div>

    <!-- Chart Container -->
    <div ref="chartContainer" class="chart-container"></div>

    <!-- No Data Message -->
    <div v-if="noData" class="no-data-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>No historical data available. Start investing to see your portfolio performance.</p>
    </div>

    <div class="portfolio-metrics">
      <div class="metric-card">
        <div class="metric-title">Annual Return</div>
        <div :class="['metric-value', { positive: calculateAnnualReturn > 0, negative: calculateAnnualReturn < 0 }]">
          {{ calculateAnnualReturn > 0 ? '+' : '' }}{{ calculateAnnualReturn.toFixed(1) }}%
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Volatility</div>
        <div class="metric-value">{{ calculateVolatility.toFixed(1) }}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-title">Sharpe Ratio</div>
        <div class="metric-value">{{ calculateSharpeRatio.toFixed(2) }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import { createChart } from "lightweight-charts";
import axios from "axios";
import { sort } from "mathjs";

export default {
  name: "PortfolioPerformance",
  
  props: {
    portfolioData: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      chart: null,
      lineSeries: null,
      selectedRange: '1M',
      timeRanges: [
        { label: '1W', value: '1W' },
        { label: '1M', value: '1M' },
        { label: '3M', value: '3M' },
        { label: 'YTD', value: 'YTD' },
        { label: '1Y', value: '1Y' },
        { label: 'All', value: 'All' }
      ],
      noData: false,
      firstTransactionDate: null,
      candlestickData: [],
      userID: this.$store.getters['users/userId'] || null
    };
  },

  computed: {
    lineData() {
      return this.candlestickData.map(item => ({
        time: item.time,
        value: item.close,
      }));
    },
    
    portfolioTotalValue() {
      // Get the most recent portfolio value or return 0 if no data
      const latestData = this.candlestickData[this.candlestickData.length - 1];
      return latestData ? latestData.close : 0;
    },
    
    portfolioDailyChange() {
      // Calculate today's change (if we have at least 2 data points)
      if (this.candlestickData.length < 2) return { value: 0, percent: 0 };
      
      const latestData = this.candlestickData[this.candlestickData.length - 1];
      const previousData = this.candlestickData[this.candlestickData.length - 2];
      
      const valueChange = latestData.close - previousData.close;
      const percentChange = (valueChange / previousData.close) * 100;
      
      return { 
        value: valueChange, 
        percent: percentChange,
        isPositive: valueChange >= 0
      };
    },
    
    portfolioOverallChange() {
      // Calculate overall change since beginning
      if (this.candlestickData.length < 2) return { value: 0, percent: 0 };
      
      const latestData = this.candlestickData[this.candlestickData.length - 1];
      const firstData = this.candlestickData[0];
      
      const valueChange = latestData.close - firstData.close;
      const percentChange = (valueChange / firstData.close) * 100;
      
      return { 
        value: valueChange, 
        percent: percentChange,
        isPositive: valueChange >= 0
      };
    },

    calculateAnnualReturn() {
      if (this.candlestickData.length < 2) return 0;
      
      const latestData = this.candlestickData[this.candlestickData.length - 1];
      const firstData = this.candlestickData[0];
      
      const firstDate = new Date(firstData.time);
      const lastDate = new Date(latestData.time);
      const daysDiff = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
   
      if (daysDiff === 0) return 0;
      
      const totalReturn = (latestData.close / firstData.close) - 1;
      const annualReturn = (Math.pow(1 + totalReturn, 365 / daysDiff) - 1) * 100;
      
      return annualReturn;
    },

    calculateVolatility() {
      if (this.candlestickData.length < 2) return 0;
      
      const returns = [];
      for (let i = 1; i < this.candlestickData.length; i++) {
        const dailyReturn = (this.candlestickData[i].close / this.candlestickData[i-1].close) - 1;
        returns.push(dailyReturn);
      }
     
      const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
      
      const squaredDiffs = returns.map(value => Math.pow(value - mean, 2));
      const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / returns.length;
      
      const dailyVolatility = Math.sqrt(variance);
      const annualizedVolatility = dailyVolatility * Math.sqrt(252) * 100; // 252 trading days in a year
      
      return annualizedVolatility;
    },

    calculateSharpeRatio() {
      if (this.candlestickData.length < 2) return 0;
      
      // Using 0.02 (2%) as risk-free rate
      const riskFreeRate = 0.02;
      
      // Get annualized return in decimal form
      const annualReturn = this.calculateAnnualReturn / 100;
      
      // Get volatility in decimal form
      const volatility = this.calculateVolatility / 100;
      
      // Avoid division by zero
      if (volatility === 0) return 0;
      
      // Calculate Sharpe ratio
      const sharpeRatio = (annualReturn - riskFreeRate) / volatility;
      
      return sharpeRatio;
    }
  },

  created() {
    // this.generateYearOfData();
    this.fetchPortfolioData()
  },

  mounted() {
    this.initChart();
    this.createSeries();
    this.updateChart();
    window.addEventListener("resize", this.handleResize);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) {
      this.chart.remove();
    }
  },

  methods: {
    async fetchPortfolioData() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/portfolios/${this.userID}`);
        const data = response.data.portfolio;
        
        const sortedData = data.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });
    
        sortedData.forEach((item, index) => {
          const formattedDate = new Date(item.date).toISOString().split('T')[0];
          
          if (index === 0) {
            this.firstTransactionDate = formattedDate;
          }
          this.candlestickData.push({
            time: formattedDate,
            close: parseFloat(item.totalValue)
          });
        });
        
        console.log(this.candlestickData);
    
        this.updateChart();
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        this.noData = true;
      }
    },
    generateYearOfData() {
      const data = [];
      const today = new Date();
      let startValue = 10000;
      
      for (let i = 365; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        
        const dailyChange = Math.random() * 4 - 1.5;
        
        const trendMultiplier = 
          i > 300 ? 1.2 :
          i > 200 && i < 250 ? 0.7 :
          i > 100 && i < 150 ? 1.3 :
          1;
          
        const percentChange = dailyChange * trendMultiplier;
        startValue = startValue * (1 + percentChange / 100);
        
        if (i === 285 || i === 180 || i === 75) {
          const eventMultiplier = [0.92, 1.08, 0.94][Math.floor(i / 100)];
          startValue = startValue * eventMultiplier;
        }
        
        const close = startValue;
        
        data.push({
          time: date.toISOString().split('T')[0],
          close: parseFloat(close.toFixed(2))
        });
      }
      console.log(data)
      this.fetchPortfolioData()
      this.candlestickData = data;
    },

    changeTimeRange(range) {
      this.selectedRange = range;
      this.updateChart();
    },

    initChart() {
      const container = this.$refs.chartContainer;
      
      if (!container) return;

      this.chart = createChart(container, {
        width: container.clientWidth, 
        height: 400,
        layout: {
          background: { type: 'solid', color: '#FFFFFF' },
          textColor: '#333333',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        timeScale: {
          timeVisible: true,
          borderColor: '#f0f0f0',
        },
        rightPriceScale: {
          borderColor: '#f0f0f0',
        },
        crosshair: {
          mode: 1,
          vertLine: {
            width: 1,
            color: 'rgba(0, 123, 255, 0.3)',
            style: 0,
          },
          horzLine: {
            width: 1,
            color: 'rgba(0, 123, 255, 0.3)',
            style: 0,
          },
        },
      });
    },

    createSeries() {
      if (!this.chart) return;
      
      this.lineSeries = this.chart.addLineSeries({
        color: '#007bff',
        lineWidth: 2,
        lineType: 0,
        priceLineVisible: false,
        lastValueVisible: true,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        crosshairMarkerBorderColor: '#FFFFFF',
        crosshairMarkerBackgroundColor: '#007bff',
      });
    },

    updateChart() {
      if (!this.lineSeries) return;
      
      let filteredData = [...this.candlestickData];
      
      const today = new Date();
      let startDate = new Date();
      
      switch (this.selectedRange) {
        case '1W':
          startDate.setDate(today.getDate() - 7);
          break;
        case '1M':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case '3M':
          startDate.setMonth(today.getMonth() - 3);
          break;
        case 'YTD':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        case '1Y':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
      }
      
      if (this.selectedRange !== 'All') {
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.time);
          return itemDate >= startDate;
        });
      }
      
      const filteredLineData = filteredData.map(item => ({
        time: item.time,
        value: item.close
      }));
      
      this.lineSeries.setData(filteredLineData);
      this.chart.timeScale().fitContent();
    },

    handleResize() {
      const container = this.$refs.chartContainer;
      if (this.chart && container) {
        this.chart.applyOptions({ width: container.clientWidth });
      }
    }
  }
};
</script>

<style scoped>
.chart-section {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 100%;
  padding: 1.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chart-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
}

.chart-header h1 {
  font-size: 1.75rem;
  margin: 0 0 1.5rem 0;
  color: #1e293b;
  font-weight: 600;
}

.portfolio-summary {
  display: flex;
  gap: 2rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.positive {
  color: #10b981;
}

.negative {
  color: #ef4444;
}

.summary-item.positive .summary-value {
  color: #10b981;
}

.summary-item.negative .summary-value {
  color: #ef4444;
}

.time-range-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
}

.time-range-selector button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  background-color: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
  transition: all 0.2s ease;
}

.time-range-selector button:hover {
  color: #1e293b;
  background-color: #f1f5f9;
}

.time-range-selector button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.2);
}

.chart-container {
  width: 100%;
  height: 400px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 2rem;
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #64748b;
  text-align: center;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 2rem;
  gap: 1rem;
}

.no-data-message svg {
  color: #94a3b8;
  margin-bottom: 0.5rem;
}

.no-data-message p {
  max-width: 300px;
  line-height: 1.5;
}

.portfolio-metrics {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.metric-card {
  flex: 1;
  min-width: 180px;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.metric-title {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.metric-value.positive {
  color: #10b981;
}

.metric-value.negative {
  color: #ef4444;
}

@media (max-width: 768px) {
  .portfolio-summary {
    gap: 1rem;
  }
  
  .portfolio-metrics {
    flex-direction: column;
  }
  
  .metric-card {
    min-width: auto;
  }
}
</style>
