<template>
  <div class="popup">
    <div class="popup-content">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <div class="stock-header">
        <h2>{{ stock.name || stock.symbol }}</h2>
        <div class="stock-details">
          <div class="detail-row">
            <span class="detail-key">Price:</span>
            <span class="detail-value">{{ stock['05. price'] }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Change (đồng):</span>
            <span class="detail-value" :class="{'positive': parseFloat(stock['09. change']) > 0, 'negative': parseFloat(stock['09. change']) < 0}">
              {{ parseFloat(stock['09. change']) > 0 ? '+' : '' }}{{ stock['09. change'] }}
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-key">Change (%):</span>
            <span class="detail-value" :class="{'positive': parseFloat(stock['10. change percent']) > 0, 'negative': parseFloat(stock['10. change percent']) < 0}">
              {{ stock['10. change percent'] }}
            </span>
          </div>
        </div>
      </div>
      <div ref="chartContainer" class="chart-container"></div>
      
      <!-- Income Statement Section -->
      <div class="income-statement-container">
        <h3 class="income-statement-title">Income Statement (Đơn vị: đồng)</h3>
        <div v-if="loadingIncomeStatement" class="loading-indicator">Loading income statement data...</div>
        <div v-else-if="incomeStatementError" class="error-message">{{ incomeStatementError }}</div>
        <div v-else-if="incomeStatementData.length === 0" class="no-data-message">No income statement data available</div>
        <div v-else class="income-statement-scroll">
          <table class="income-statement-table">
            <thead>
              <tr>
                <th class="sticky-column">Chỉ tiêu</th>
                <th v-for="item in incomeStatementData" :key="item.year">{{ item.year }}</th>
              </tr>
            </thead>
            <tbody>
              <!-- Main metrics rows -->
              <tr>
                <td class="sticky-column metric-name">Doanh thu</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['Doanh thu (đồng)']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Tăng trưởng doanh thu (%)</td>
                <td v-for="item in incomeStatementData" :key="item.year" 
                    :class="getGrowthClass(item.data['Tăng trưởng doanh thu (%)'])">
                  {{ formatPercentage(item.data['Tăng trưởng doanh thu (%)']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Lợi nhuận sau thuế</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['Lợi nhuận sau thuế của Cổ đông công ty mẹ (đồng)']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Tăng trưởng lợi nhuận (%)</td>
                <td v-for="item in incomeStatementData" :key="item.year"
                    :class="getGrowthClass(item.data['Tăng trưởng lợi nhuận (%)'])">
                  {{ formatPercentage(item.data['Tăng trưởng lợi nhuận (%)']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Lãi gộp</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['Lãi gộp']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Thu nhập tài chính</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['Thu nhập tài chính']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Chi phí tài chính</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['Chi phí tài chính']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Chi phí bán hàng</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['Chi phí bán hàng']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Chi phí quản lý</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['Chi phí quản lý DN']) }}
                </td>
              </tr>
              <tr>
                <td class="sticky-column metric-name">Lợi nhuận trước thuế</td>
                <td v-for="item in incomeStatementData" :key="item.year">
                  {{ formatLargeNumber(item.data['LN trước thuế']) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { createChart } from 'lightweight-charts';

export default {
  name: 'VNStockPopup',
  props: {
    stock: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
      candlestickSeries: null,
      volumeSeries: null,
      ohlcvData: [],
      loading: true,
      error: null,
      // Income statement data
      incomeStatementData: [],
      loadingIncomeStatement: false,
      incomeStatementError: null,
    };
  },
  watch: {
    stock: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue['01. symbol']) {
          this.fetchOHLCVData(newValue['01. symbol']);
          this.fetchIncomeStatement(newValue['01. symbol']);
        }
      },
    },
  },
  methods: {
    async fetchOHLCVData(symbol) {
      try {
        this.loading = true;
        const response = await axios.get(`https://self-surfaces-dylan-usc.trycloudflare.com/api/vn-stock/ohlcv/${symbol}`);
        // const response = await axios.get(`${process.env.VUE_STOCK_API_BASE_URL}/api/vn-stock/ohlcv/${symbol}`);
        
        if (response.data && response.data.data) {
          // Transform the data for the chart
          this.ohlcvData = response.data.data.map(item => ({
            time: item.time,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume
          }));
          
          // Sort data by time in ascending order
          this.ohlcvData = this.ohlcvData.sort((a, b) => 
            new Date(a.time) - new Date(b.time)
          );
          
          this.renderChart(this.ohlcvData);
        } else {
          this.error = 'Invalid response format from API';
        }
        this.loading = false;
      } catch (error) {
        console.error('Error fetching OHLCV data:', error);
        this.error = 'Failed to fetch stock data';
        this.loading = false;
      }
    },
    
    async fetchIncomeStatement(symbol) {
      try {
        this.loadingIncomeStatement = true;
        this.incomeStatementError = null;
        
        const response = await axios.get(`https://self-surfaces-dylan-usc.trycloudflare.com/api/vn-stock/income-statement/${symbol}`);
        
        if (response.data && response.data.data) {
          this.incomeStatementData = response.data.data // data is already sorted by year in descending order
        } else {
          this.incomeStatementError = 'Invalid income statement data format';
        }
        
        this.loadingIncomeStatement = false;
      } catch (error) {
        console.error('Error fetching income statement:', error);
        this.incomeStatementError = 'Failed to fetch income statement data';
        this.loadingIncomeStatement = false;
      }
    },
    
    formatValue(value) {
      if (value === undefined || value === null) return 'N/A';
      
      // If it's a percentage
      if (typeof value === 'number') {
        // Format percentage
        if (Math.abs(value) < 10) {
          return value.toLocaleString('vi-VN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
        }
        // Format large numbers
        return value.toLocaleString('vi-VN');
      }
      
      return value;
    },
    
    getValueClass(key, item) {
      if (!item.data[key]) return '';
      
      // Add positive/negative classes for growth percentages
      if (key.includes('Tăng trưởng')) {
        const value = parseFloat(item.data[key]);
        return value > 0 ? 'positive' : value < 0 ? 'negative' : '';
      }
      
      return '';
    },
    
    // New methods for formatted income statement display
    formatLargeNumber(value) {
      if (value === undefined || value === null) return 'N/A';
      
      return typeof value === 'number' 
        ? value.toLocaleString('vi-VN')
        : parseFloat(value).toLocaleString('vi-VN');
    },
    
    formatPercentage(value) {
      if (value === undefined || value === null) return 'N/A';
      
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      return (numValue * 100).toFixed(2) + '%';
    },
    
    getGrowthClass(value) {
      if (value === undefined || value === null) return '';
      
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      return numValue > 0 ? 'positive' : numValue < 0 ? 'negative' : '';
    },
    
    calculateChartDimensions() {
      const container = this.$refs.chartContainer;
      // Ensure we have a container before proceeding
      if (!container) return { width: 0, height: 0 };
      
      // Get the container's width and height
      const rect = container.getBoundingClientRect();
      
      // Calculate the available dimensions, ensuring they're positive
      const width = Math.max(Math.floor(rect.width) - 5, 0); // Reduced padding from 10 to 5
      const height = Math.max(Math.floor(rect.height) - 5, 0);
      
      return { width, height };
    },
    
    renderChart(data) {
      this.$nextTick(() => {
        if (this.chart) {
          this.chart.remove();
        }
        
        // Calculate available space
        const { width, height } = this.calculateChartDimensions();
        
        // Skip rendering if dimensions are not valid
        if (width === 0 || height === 0) {
          console.warn('Invalid chart dimensions, skipping render');
          return;
        }

        // Create chart
        this.chart = createChart(this.$refs.chartContainer, {
          width,
          height,
          layout: {
            backgroundColor: '#ffffff',
            textColor: '#333333',
            fontSize: 12,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          },
          grid: {
            vertLines: {
              color: '#f0f0f0',
            },
            horzLines: {
              color: '#f0f0f0',
            },
          },
          crosshair: {
            mode: 0,
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
            borderColor: '#dcdee0',
            barSpacing: 12,
            rightOffset: 5,
            leftOffset: 5,
          },
          rightPriceScale: {
            borderColor: '#dcdee0',
            autoScale: true,
            entireTextOnly: false,
            scaleMargins: {
              top: 0.1,
              bottom: 0.2,
            },
            paddingRight: 30,
            paddingLeft: 0,
            ticksVisible: true,
            borderVisible: true,
          },
          leftPriceScale: {
            borderColor: '#dcdee0',
            visible: false,
          },
          watermark: {
            visible: true,
            fontSize: 48,
            horzAlign: 'center',
            vertAlign: 'center',
            color: 'rgba(0, 0, 0, 0.03)',
            text: this.stock['01. symbol'],
          },
        });

        // Add candlestick series
        this.candlestickSeries = this.chart.addCandlestickSeries({
          upColor: '#28a745',
          downColor: '#dc3545',
          borderVisible: false,
          wickUpColor: '#28a745',
          wickDownColor: '#dc3545',
          priceFormat: { 
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
          priceScaleId: 'right',
        });
        
        // Add volume series
        this.volumeSeries = this.chart.addHistogramSeries({
          color: '#26a69a',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: 'volume',
          scaleMargins: {
            top: 0.85,
            bottom: 0.05,
          },
        });
        
        // Set data for candlestick series
        if (data.length > 0) {
          this.candlestickSeries.setData(data);
          
          // Set data for volume series
          const volumeData = data.map(item => ({
            time: item.time,
            value: item.volume,
            color: item.close >= item.open ? 'rgba(40, 167, 69, 0.5)' : 'rgba(220, 53, 69, 0.5)',
          }));
          this.volumeSeries.setData(volumeData);
          
          // Fit content
          this.chart.timeScale().fitContent();
          
          // Create static legend showing summary information
          this.createLegend(data);
        }

        // Handle tooltip on hover
        this.chart.subscribeCrosshairMove(param => {
          if (!param.point || !param.time) {
            this.removeTooltip();
            return;
          }

          const dataPoint = data.find(d => d.time === param.time);
          if (dataPoint) {
            // Only use detailed info, no longer showing the tooltip
            this.updateDetailedInfo(dataPoint, param);
          }
        });
      });
    },
    
    createLegend(data) {
      if (!data.length) return;
      
      // Calculate latest values
      const latest = data[data.length - 1];
      const prev = data.length > 1 ? data[data.length - 2] : latest;
      const change = latest.close - prev.close;
      const changePercent = (change / prev.close) * 100;
      
      // Create a legend container as a DOM element
      let legendContainer = document.querySelector('.chart-legend');
      if (!legendContainer) {
        legendContainer = document.createElement('div');
        legendContainer.className = 'chart-legend';
        legendContainer.style.position = 'absolute';
        legendContainer.style.top = '10px';
        legendContainer.style.left = '10px'; // Changed from right: 40px to left: 10px
        legendContainer.style.padding = '6px 10px';
        legendContainer.style.fontSize = '12px';
        legendContainer.style.fontWeight = 'bold';
        legendContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'; // More opaque background
        legendContainer.style.border = '1px solid #ddd';
        legendContainer.style.borderRadius = '4px';
        legendContainer.style.zIndex = '3';
        legendContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // Added shadow for better visibility
        this.$refs.chartContainer.appendChild(legendContainer);
      }
      
      // Determine class for price change
      const changeClass = change >= 0 ? 'positive' : 'negative';
      const changeSign = change >= 0 ? '+' : '';
      
      // Set legend content
      legendContainer.innerHTML = `
        <div>Last Price: <span style="color: ${change >= 0 ? '#28a745' : '#dc3545'}">${latest.close.toFixed(2)}</span></div>
        <div>Change: <span style="color: ${change >= 0 ? '#28a745' : '#dc3545'}">${changeSign}${change.toFixed(2)} (${changeSign}${changePercent.toFixed(2)}%)</span></div>
        <div>Volume: <span>${latest.volume.toLocaleString()}</span></div>
      `;
    },
    
    resizeChart() {
      if (this.chart) {
        const { width, height } = this.calculateChartDimensions();
        
        if (width > 0 && height > 0) {
          this.chart.resize(width, height);
          this.chart.timeScale().fitContent();
        }
      }
    },
    
    updateDetailedInfo(point, param) {
      // Create or get the detailed info container
      let detailedInfo = document.querySelector('.detailed-info');
      if (!detailedInfo) {
        detailedInfo = document.createElement('div');
        detailedInfo.className = 'detailed-info';
        detailedInfo.style.position = 'absolute';
        detailedInfo.style.top = '10px';
        detailedInfo.style.right = '10px';
        detailedInfo.style.padding = '8px 12px';
        detailedInfo.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        detailedInfo.style.border = '1px solid #ddd';
        detailedInfo.style.borderRadius = '4px';
        detailedInfo.style.zIndex = '3';
        detailedInfo.style.fontSize = '12px';
        detailedInfo.style.fontWeight = '500';
        detailedInfo.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        detailedInfo.style.minWidth = '140px';
        this.$refs.chartContainer.appendChild(detailedInfo);
      }

      // Format date
      const date = new Date(point.time);
      const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      // Calculate change
      const change = point.close - point.open;
      const changePercent = (change / point.open) * 100;
      const changeSign = change >= 0 ? '+' : '';
      const changeColor = change >= 0 ? '#28a745' : '#dc3545';

      // Update content
      detailedInfo.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px; text-align: center; border-bottom: 1px solid #eee; padding-bottom: 3px;">${formattedDate}</div>
        <div style="display: flex; justify-content: space-between; margin: 3px 0;">
          <span style="font-weight: 600;">Open:</span>
          <span>${point.open.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 3px 0;">
          <span style="font-weight: 600;">High:</span>
          <span>${point.high.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 3px 0;">
          <span style="font-weight: 600;">Low:</span>
          <span>${point.low.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 3px 0;">
          <span style="font-weight: 600;">Close:</span>
          <span>${point.close.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 3px 0;">
          <span style="font-weight: 600;">Change:</span>
          <span style="color: ${changeColor};">${changeSign}${change.toFixed(2)} (${changeSign}${changePercent.toFixed(2)}%)</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 3px 0;">
          <span style="font-weight: 600;">Volume:</span>
          <span>${point.volume.toLocaleString()}</span>
        </div>
      `;

      // Show the container
      detailedInfo.style.display = 'block';
    },
    
    // UNUSED - Retained for reference only
    // This was causing duplicate OHLCV info to appear on hover
    showTooltip(point, param) {
      const date = new Date(point.time);
      const formattedDate = date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      
      let tooltip = document.querySelector('.vn-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'vn-tooltip';
        this.$refs.chartContainer.appendChild(tooltip);
      }
      
      tooltip.innerHTML = `
        <div class="tooltip-date">${formattedDate}</div>
        <div class="tooltip-row"><span>Open:</span> <span>${point.open.toFixed(2)}</span></div>
        <div class="tooltip-row"><span>High:</span> <span>${point.high.toFixed(2)}</span></div>
        <div class="tooltip-row"><span>Low:</span> <span>${point.low.toFixed(2)}</span></div>
        <div class="tooltip-row"><span>Close:</span> <span>${point.close.toFixed(2)}</span></div>
        <div class="tooltip-row"><span>Volume:</span> <span>${point.volume.toLocaleString()}</span></div>
      `;
      
      const coordinate = this.chart.timeScale().timeToCoordinate(param.time);
      
      let left = coordinate - tooltip.clientWidth / 2;
      left = Math.max(0, Math.min(left, this.$refs.chartContainer.clientWidth - tooltip.clientWidth));
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = '80px';
      tooltip.style.display = 'block';
    },
    
    removeTooltip() {
      // Hide detailed info when moving away from chart
      const detailedInfo = document.querySelector('.detailed-info');
      if (detailedInfo) {
        detailedInfo.style.display = 'none';
      }
      
      // Also clean up unused tooltip if it exists
      const tooltip = document.querySelector('.vn-tooltip');
      if (tooltip) {
        tooltip.style.display = 'none';
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      // Wait for DOM to be fully rendered
      setTimeout(() => {
        this.renderChart([]);
      }, 50);
      
      // Add window resize event listener
      window.addEventListener('resize', this.resizeChart);
    });
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resizeChart);
    if (this.chart) {
      this.chart.remove();
    }
    
    // Clean up legend and info elements
    const elementsToRemove = [
      '.chart-legend',
      '.vn-tooltip',
      '.detailed-info'
    ];
    
    elementsToRemove.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.remove();
      }
    });
  }
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px 20px 30px 20px;
  border-radius: 8px;
  position: relative;
  width: 95%;
  max-width: 1400px;
  height: 90%; /* Increased from 75% to 90% to accommodate income statement */
  min-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow-y: auto; /* Add vertical scrolling */
  box-sizing: border-box;
}

.stock-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  width: 100%;
  flex-shrink: 0;
}

.stock-header h2 {
  margin: 0 0 10px 0;
  font-size: 1.5rem;
  color: #333;
}

.stock-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.detail-row {
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.detail-key {
  min-width: 120px;
  width: 120px;
  font-weight: 500;
  color: #666;
  margin-right: 15px;
  flex-shrink: 0;
}

.detail-value {
  font-weight: 600;
}

.positive {
  color: #28a745;
}

.negative {
  color: #dc3545;
}

.chart-container {
  width: 98%;
  height: 55%; /* Reduced from 100% - 80px to make room for income statement */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  flex: 0 0 auto; /* Changed from flex: 1 to prevent stretching */
  overflow: hidden;
  min-height: 400px; /* Add minimum height to ensure chart is visible */
}

/* Income Statement Styles */
.income-statement-container {
  width: 98%;
  margin-top: 20px; 
  border-top: 1px solid #eee;
  padding-top: 15px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 300px; /* Add minimum height for the table */
}

.income-statement-title {
  font-size: 1.2rem;
  margin: 0 0 15px 0;
  color: #333;
  align-self: flex-start;
}

.income-statement-scroll {
  overflow-x: auto;
  width: 100%;
  flex: 1;
}

.income-statement-table {
  border-collapse: collapse;
  width: 100%;
  font-size: 0.9rem;
}

.income-statement-table th, 
.income-statement-table td {
  padding: 8px 12px;
  text-align: right;
  white-space: nowrap;
  border: 1px solid #ddd;
}

.income-statement-table th {
  background-color: #f7f7f7;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 2;
}

.income-statement-table .sticky-column {
  position: sticky;
  left: 0;
  background-color: #f7f7f7;
  z-index: 1;
  text-align: left;
  font-weight: 500;
  border-right: 2px solid #ddd;
}

.income-statement-table th.sticky-column {
  z-index: 3;
}

.metric-name {
  font-weight: 500;
}

.loading-indicator,
.error-message,
.no-data-message {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error-message {
  color: #dc3545;
}

.vn-tooltip {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.95);
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  display: none;
  z-index: 5;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.tooltip-date {
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 3px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  margin: 3px 0;
}

.tooltip-row span:first-child {
  margin-right: 15px;
  font-weight: 500;
  color: #666;
}

.tooltip-row span:last-child {
  font-weight: 600;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  z-index: 10;
}

@media (max-width: 992px) {
  .popup-content {
    min-width: auto;
    width: 95%;
    height: 90%;
  }
  
  .chart-container {
    min-height: 350px;
  }
  
  .income-statement-container {
    min-height: 250px;
  }
}

@media (max-width: 768px) {
  .popup-content {
    width: 95%;
    height: 90%;
    padding: 15px 15px 25px 15px;
  }
  
  .stock-header {
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  
  .chart-container {
    height: 50%;
    min-height: 300px;
  }
  
  .close-btn {
    top: 5px;
    right: 5px;
  }
  
  .income-statement-table {
    font-size: 0.8rem;
  }
  
  .income-statement-table th, 
  .income-statement-table td {
    padding: 6px 8px;
  }
}
</style> 