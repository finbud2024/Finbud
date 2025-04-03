<template>
  <section class="chart-section">
    <header class="chart-header">
      <h1>Portfolio Performance</h1>
      <div class="header-content">
        <div class="portfolio-summary">
          <div class="summary-item">
            <span class="summary-label">Total Value</span>
            <span class="summary-value">
              ${{ 
                portfolioTotalValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}
            </span>
          </div>
          
          <div 
            class="summary-item" 
            :class="getDynamicClass(portfolioDailyChange.isPositive)"
          >
            <span class="summary-label">Today</span>
            <span class="summary-value">
              {{ portfolioDailyChange.isPositive ? '+' : '-' }}
              ${{ 
                Math.abs(portfolioDailyChange.value).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}
              ({{ portfolioDailyChange.isPositive ? '+' : '-' }}
              {{ 
                Math.abs(portfolioDailyChange.percent).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}%)
            </span>
          </div>
          
          <div 
            class="summary-item" 
            :class="getDynamicClass(portfolioOverallChange.isPositive)"
          >
            <span class="summary-label">Overall</span>
            <span class="summary-value">
              {{ portfolioOverallChange.isPositive ? '+' : '-' }}
              ${{ 
                Math.abs(portfolioOverallChange.value).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}
              ({{ portfolioOverallChange.isPositive ? '+' : '-' }}
              {{ 
                Math.abs(portfolioOverallChange.percent).toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}%)
            </span>
          </div>
        </div>

        <div class="portfolio-metrics">
          <div class="metric-card">
            <div class="metric-title">Annual Return</div>
            <div :class="getValueClass(calculateAnnualReturn)">
              {{ calculateAnnualReturn > 0 ? '+' : '' }}
              {{ 
                calculateAnnualReturn.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}%
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Volatility</div>
            <div class="metric-value">
              {{ 
                calculateVolatility.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}%
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-title">Sharpe Ratio</div>
            <div :class="getValueClass(calculateSharpeRatio)">
              {{ 
                calculateSharpeRatio.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) 
              }}
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="chart-area">
      <div ref="chartContainer" class="chart-container"></div>
      <div class="time-range-selector">
        <button 
          v-for="range in timeRanges" 
          :key="range.value"
          :class="{ active: selectedRange === range.value }"
          @click="changeTimeRange(range.value)">
          {{ range.label }}
        </button>
      </div>
      
      <div v-if="!noData" class="performance-summary">
        <div :class="['performance-badge', getDynamicClass(selectedRangePerformance.isPositive)]">
          <span>{{ selectedRange }} Performance:</span>
          <span>
            {{ selectedRangePerformance.isPositive ? '+' : '-' }}
            {{ 
              Math.abs(selectedRangePerformance.percent).toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
              }) 
            }}%
          </span>
        </div>
      </div>
      
      <div v-if="noData" class="no-data-message">
        <svg xmlns="http://www.w3.org/2000/svg" 
             width="32" height="32" 
             viewBox="0 0 24 24" 
             fill="none" 
             stroke="currentColor" 
             stroke-width="2" 
             stroke-linecap="round" 
             stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>No historical data available. Start investing to see your portfolio performance.</p>
        <button class="get-started-btn">Get Started</button>
      </div>
    </div>
  </section>
</template>

<script>
import { createChart } from "lightweight-charts";
import axios from "axios";

export default {
  name: "PortfolioPerformance",
  
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
      userID: this.$store.getters['users/userId'] || null,
      colorUptrendSeries: '#10b981',
      colorDowntrendSeries: '#ef4444',
      selectedRangePerformance: { percent: 0, isPositive: true }
    };
  },

  computed: {
    portfolioTotalValue() {
      const latestData = this.candlestickData[this.candlestickData.length - 1];
      return latestData ? latestData.close : 0;
    },
    
    portfolioDailyChange() {
      if (this.candlestickData.length < 2) {
        return { value: 0, percent: 0, isPositive: true };
      }
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
      if (this.candlestickData.length < 2) {
        return { value: 0, percent: 0, isPositive: true };
      }
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
        const dailyReturn = (this.candlestickData[i].close / this.candlestickData[i - 1].close) - 1;
        returns.push(dailyReturn);
      }
      const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
      const squaredDiffs = returns.map(value => Math.pow(value - mean, 2));
      const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / returns.length;
      const dailyVolatility = Math.sqrt(variance);
      return dailyVolatility * Math.sqrt(252) * 100;
    },

    calculateSharpeRatio() {
      if (this.candlestickData.length < 2) return 0;
      const riskFreeRate = 0.02;
      const annualReturn = this.calculateAnnualReturn / 100;
      const volatility = this.calculateVolatility / 100;
      if (volatility === 0) return 0;
      return (annualReturn - riskFreeRate) / volatility;
    }
  },

  created() {
    this.fetchPortfolioData();
    // this.generateYearOfData();
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
    getDynamicClass(isPositive) {
      return isPositive ? 'positive' : 'negative';
    },
    
    getValueClass(value) {
      if (value > 0) return 'metric-value positive';
      if (value < 0) return 'metric-value negative';
      return 'metric-value';
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
      
      this.candlestickData = data.sort((a, b) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
      );
    },

    changeTimeRange(range) {
      this.selectedRange = range;
      this.updateChart();
    },
    
    async fetchPortfolioData() {
  try {
    const response = await axios.get(
      `${process.env.VUE_APP_DEPLOY_URL}/portfolios/${this.userID}`
    );
    const data = response.data.portfolio;
    
    // Sort by date first
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (sortedData.length === 0) {
      this.noData = true;
      return;
    }
    
    this.candlestickData = [];
    
    // Track seen dates to avoid duplicates
    const seenDates = new Set();
    
    sortedData.forEach((item, index) => {
      const formattedDate = new Date(item.date).toISOString().split('T')[0];
      
      // Only add if we haven't seen this date before
      if (!seenDates.has(formattedDate)) {
        seenDates.add(formattedDate);
        
        if (index === 0) {
          this.firstTransactionDate = formattedDate;
        }
        
        this.candlestickData.push({
          time: formattedDate,
          close: parseFloat(item.totalValue)
        });
      }
    });
    
    this.updateChart();
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    this.noData = true;
  }
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
      fixLeftEdge: false,
      fixRightEdge: false, // Changed to false to allow dragging past the last point
      rightBarStaysOnScroll: false, // Changed to false to improve scrolling behavior
      barSpacing: 6,
      minBarSpacing: 2,
      rightOffset: 5, // Added to keep some space on the right side
    },
    rightPriceScale: {
      borderColor: '#f0f0f0',
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      autoScale: true,
    },
    crosshair: {
      mode: 1,
      vertLine: {
        width: 1,
        color: 'rgba(0, 0, 0, 0.2)',
        style: 0,
      },
      horzLine: {
        width: 1,
        color: 'rgba(0, 0, 0, 0.2)',
        style: 0,
      },
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: false,
    },
    handleScale: {
      axisPressedMouseMove: true,
      mouseWheel: true,
      pinch: true,
    },
  });
},


    createSeries() {
      if (!this.chart) return;
      this.lineSeries = this.chart.addLineSeries({
        color: this.colorUptrendSeries,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 6,
        crosshairMarkerBorderColor: '#FFFFFF',
        crosshairMarkerBackgroundColor: this.colorUptrendSeries,
        lineType: 0,
      });
    },

    updateChart() {
      if (!this.lineSeries || this.candlestickData.length === 0) return;

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
        default:
          break;
      }

      if (this.selectedRange !== 'All') {
        filteredData = filteredData.filter(item => {
          const itemDate = new Date(item.time);
          return itemDate >= startDate;
        });
        
        filteredData = filteredData.sort((a, b) => 
          new Date(a.time).getTime() - new Date(b.time).getTime()
        );
      }
      
      if (filteredData.length >= 2) {
        const startValue = filteredData[0].close;
        const endValue = filteredData[filteredData.length - 1].close;
        const change = endValue - startValue;
        const percentChange = (change / startValue) * 100;
        
        this.selectedRangePerformance = {
          percent: percentChange,
          isPositive: change >= 0
        };
        
        const lineColor = change >= 0 ? this.colorUptrendSeries : this.colorDowntrendSeries;
        this.lineSeries.applyOptions({
          color: lineColor,
          crosshairMarkerBackgroundColor: lineColor
        });
      }
      
      const filteredLineData = filteredData.map(item => ({
        time: item.time,
        value: item.close
      }));
      
      this.lineSeries.setData(filteredLineData);
      
      this.lineSeries.applyOptions({
        lineType: 0,
        priceLineVisible: false,
        lastValueVisible: true,
        baseLineVisible: true,
        baseLineColor: '#e2e8f0',
        lineWidth: 2,
        baseLineWidth: 1,
        topColor: this.selectedRangePerformance.isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
        bottomColor: this.selectedRangePerformance.isPositive ? 'rgba(16, 185, 129, 0)' : 'rgba(239, 68, 68, 0)',
      });
      
      const dataLength = filteredLineData.length;
      
      if (dataLength > 0) {
        const visibleBars = Math.min(dataLength, 60);
        
        this.chart.timeScale().setVisibleLogicalRange({
          from: dataLength - visibleBars,
          to: dataLength - 1
        });
        
        this.chart.timeScale().scrollToPosition(0, false);
      }
    },

    handleResize() {
      const container = this.$refs.chartContainer;
      if (this.chart && container) {
        this.chart.resize(container.clientWidth, 400);
      }
    }
  }
};
</script>

<style scoped>
.chart-section {
  width: 100%;
  margin: 0;
  padding: 0;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  overflow: hidden;
  font-family: sans-serif;
  box-sizing: border-box;
}

.chart-header {
  padding: 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.chart-header h1 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #1e293b;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.header-content {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: space-between;
  align-items: flex-start;
}

.portfolio-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.summary-item:hover {
  transform: translateY(-2px);
}

.summary-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.01em;
}

.positive .summary-value,
.positive {
  color: #10b981;
}

.negative .summary-value,
.negative {
  color: #ef4444;
}

.portfolio-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.metric-card {
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1.25rem;
  min-width: 180px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.metric-title {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.01em;
}

.chart-area {
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;
}

.chart-container {
  width: 100%;
  height: 400px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
  padding: 0;
}

.performance-summary {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
}

.performance-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 500;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.performance-badge.positive {
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.performance-badge.negative {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.time-range-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  background-color: #f8fafc;
  border-radius: 10px;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.time-range-selector button {
  padding: 0.625rem 1.25rem;
  border: 1px solid #e2e8f0;
  background-color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.875rem;
  color: #64748b;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.time-range-selector button:hover {
  background-color: #f1f5f9;
  color: #1e293b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time-range-selector button.active {
  background-color: #1e40af;
  color: white;
  border-color: #1e40af;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
}

.no-data-message {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #64748b;
  text-align: center;
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 3rem;
  gap: 1.5rem;
}

.no-data-message svg {
  color: #94a3b8;
  margin-bottom: 1rem;
}

.no-data-message p {
  max-width: 350px;
  line-height: 1.7;
  font-size: 1rem;
  color: #475569;
}

.get-started-btn {
  background-color: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);
  letter-spacing: 0.01em;
  margin-top: 1rem;
}

.get-started-btn:hover {
  background-color: #1e3a8a;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(37, 99, 235, 0.25);
}

@media (max-width: 992px) {
  .header-content {
    gap: 2rem;
  }
  
  .portfolio-summary {
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 2rem;
  }
  
  .portfolio-summary {
    justify-content: space-between;
    gap: 1.5rem;
  }
  
  .portfolio-metrics {
    margin-top: 1.5rem;
    justify-content: space-around;
  }
  
  .metric-card {
    min-width: 150px;
    flex: 1;
  }
}

@media (max-width: 576px) {
  .chart-header {
    padding: 1rem;
  }
  
  .chart-header h1 {
    font-size: 1.5rem;
  }
  
  .portfolio-summary {
    flex-direction: column;
    gap: 1rem;
  }
  
  .summary-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .portfolio-metrics {
    flex-direction: column;
  }
  
  .metric-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  .metric-title {
    margin-bottom: 0;
  }
}
</style>