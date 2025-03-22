<template>
  <div class="trading-interface">
    <div class="grid-container">
      <div class="team-panel astrominers">
        <h2>🚀 Astrominers</h2>
        <div class="table-wrapper">
          <table>
            <colgroup>
              <col class="resource-column">
              <col v-for="data in [...teamAHistory].reverse()" :key="`col-${data.time}`" class="data-column">
            </colgroup>
            <thead>
              <tr>
                <th class="fixed-column">TimeStamps</th>
                <th v-for="data in [...teamAHistory].reverse()" :key="data.time">
                  {{ data.time }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fixed-column">Oxygen Crystals</td>
                <td v-for="data in [...teamAHistory].reverse()" :key="`oxygen-${data.time}`">
                  {{ data.oxygen }}
                </td>
              </tr>
              <tr>
                <td class="fixed-column">Lithium Shards</td>
                <td v-for="data in [...teamAHistory].reverse()" :key="`lithium-${data.time}`">
                  {{ data.lithium }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="team-panel bioengineers">
        <h2>🧬 Bioengineers</h2>
        <div class="table-wrapper">
          <table>
            <colgroup>
              <col class="resource-column">
              <col v-for="data in [...teamBHistory].reverse()" :key="`col-${data.time}`" class="data-column">
            </colgroup>
            <thead>
              <tr>
                <th class="fixed-column">TimeStamps</th>
                <th v-for="data in [...teamBHistory].reverse()" :key="data.time">
                  {{ data.time }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fixed-column">Oxygen Crystals</td>
                <td v-for="data in [...teamBHistory].reverse()" :key="`oxygen-${data.time}`">
                  {{ data.oxygen }}
                </td>
              </tr>
              <tr>
                <td class="fixed-column">Lithium Shards</td>
                <td v-for="data in [...teamBHistory].reverse()" :key="`lithium-${data.time}`">
                  {{ data.lithium }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="data-row">
        <div class="multiplier-panel">
          <h2>
            <span>Multiplier</span>
            <div class="chart-controls">
              <div class="current-price">
                <span class="price-label">Price:</span>
                {{ formatValue(currentPrice) }}
              </div>
              <div class="chart-buttons">
                <button class="buy-btn">BUY</button>
                <button class="sell-btn">SELL</button>
              </div>
            </div>
          </h2>
          <div class="chart-container">
            <LineChart :data="chartData" :options="chartOptions" />
          </div>
        </div>
        <div class="trades-panel">
          <h2>Side Trades</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Expiration</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="market in markets" :key="market.market">
                  <td>{{ market.market }}</td>
                  <td>{{ market.expiresAt }}</td>
                  <td>{{ market.value }}</td>
                  <td>
                    <button class="buy-btn">BUY</button>
                    <button class="sell-btn">SELL</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="tradelog-panel">
          <h2>Tradelog</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>TimeStamp</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trade in trades" :key="trade.id">
                  <td>{{ trade.market }}</td>
                  <td>{{ trade.executedAt }}</td>
                  <td>{{ trade.value }}</td>
                  <td :class="{'action-buy': trade.type === 'BUY', 'action-sell': trade.type === 'SELL'}">{{ trade.type }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-clock">
      <div class="time-display">Time: {{ elapsedTime }}</div>
      <div class="profit-display" :class="{ 'positive': netProfit > 0, 'negative': netProfit < 0 }">
        Net Profit: {{ formatProfit(netProfit) }}
      </div>
      <button class="control-button" @click="togglePause">
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
  name: 'QuantSimulator',
  components: {
    LineChart
  },
  setup() {
    const API_BASE_URL = 'http://localhost:5000/api';
    
    const formatValue = (value) => {
      if (typeof value === 'number') {
        return value.toFixed(1);
      }
      return value;
    };

    const formatTime = (value) => {
      if (typeof value === 'number') {
        const minutes = Math.floor(value);
        const seconds = Math.floor((value % 1) * 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      return value;
    };

    const formatProfit = (value) => {
      const formattedValue = Math.abs(value).toFixed(2);
      return value >= 0 ? `+$${formattedValue}` : `-$${formattedValue}`;
    };

    // Sample data for trades with more entries
    const trades = ref([
      { id: 1, market: 'BTC/USD', executedAt: '2:30', value: '45000.00', type: 'BUY' },
      { id: 2, market: 'ETH/USD', executedAt: '2:45', value: '3200.00', type: 'SELL' },
      { id: 3, market: 'BNB/USD', executedAt: '3:00', value: '420.50', type: 'BUY' },
      { id: 4, market: 'SOL/USD', executedAt: '3:15', value: '102.75', type: 'SELL' },
      { id: 5, market: 'ADA/USD', executedAt: '3:30', value: '1.20', type: 'BUY' },
      { id: 6, market: 'DOT/USD', executedAt: '3:45', value: '32.40', type: 'SELL' },
      { id: 7, market: 'XRP/USD', executedAt: '4:00', value: '0.85', type: 'BUY' },
      { id: 8, market: 'DOGE/USD', executedAt: '4:15', value: '0.15', type: 'SELL' },
      { id: 9, market: 'LINK/USD', executedAt: '4:30', value: '25.60', type: 'BUY' },
      { id: 10, market: 'UNI/USD', executedAt: '4:45', value: '18.90', type: 'SELL' },
      { id: 11, market: 'MATIC/USD', executedAt: '5:00', value: '2.15', type: 'BUY' },
      { id: 12, market: 'AVAX/USD', executedAt: '5:15', value: '85.30', type: 'SELL' },
      { id: 13, market: 'ATOM/USD', executedAt: '5:30', value: '28.45', type: 'BUY' },
      { id: 14, market: 'ALGO/USD', executedAt: '5:45', value: '1.75', type: 'SELL' },
      { id: 15, market: 'FTM/USD', executedAt: '6:00', value: '3.20', type: 'BUY' }
    ]);

    // Sample data for markets with more entries
    const markets = ref([
      { market: 'BTC/USD', value: '45000.00', expiresAt: '4:00' },
      { market: 'ETH/USD', value: '3200.00', expiresAt: '4:15' },
      { market: 'BNB/USD', value: '420.50', expiresAt: '4:30' },
      { market: 'SOL/USD', value: '102.75', expiresAt: '4:45' },
      { market: 'ADA/USD', value: '1.20', expiresAt: '5:00' },
      { market: 'DOT/USD', value: '32.40', expiresAt: '5:15' },
      { market: 'XRP/USD', value: '0.85', expiresAt: '5:30' },
      { market: 'DOGE/USD', value: '0.15', expiresAt: '5:45' },
      { market: 'LINK/USD', value: '25.60', expiresAt: '6:00' },
      { market: 'UNI/USD', value: '18.90', expiresAt: '6:15' },
      { market: 'MATIC/USD', value: '2.15', expiresAt: '6:30' },
      { market: 'AVAX/USD', value: '85.30', expiresAt: '6:45' },
      { market: 'ATOM/USD', value: '28.45', expiresAt: '7:00' },
      { market: 'ALGO/USD', value: '1.75', expiresAt: '7:15' },
      { market: 'FTM/USD', value: '3.20', expiresAt: '7:30' }
    ]);

    // Sample data for chart
    const chartData = ref({
      labels: ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00'],
      datasets: [{
        label: 'Market Multiplier',
        data: [1.0, 1.2, 0.8, 1.5, 1.1, 1.3],
        borderColor: '#36A2EB',
        tension: 0.1,
        fill: false,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#36A2EB'
      }]
    });

    // Sample data for team histories with more entries
    const generateTeamHistory = (baseOxygen, baseLithium, count) => {
      return Array.from({ length: count }, (_, i) => {
        // Add some random variation to make the data more interesting
        const randomOxygenChange = Math.sin(i * 0.1) * 10;
        const randomLithiumChange = Math.cos(i * 0.1) * 5;
        
        const oxygen = Math.round(baseOxygen + (i * 5) + randomOxygenChange);
        const lithium = Math.round(baseLithium + (i * 2) + randomLithiumChange);
        
        return {
          time: formatTime(i * 0.5),
          oxygen: oxygen,
          lithium: lithium,
          total: oxygen + lithium
        };
      });
    };

    const teamAHistory = ref(generateTeamHistory(100, 50, 100));
    const teamBHistory = ref(generateTeamHistory(90, 45, 100));

    const currentData = ref({
      A_oxygen: 180,
      A_lithium: 90,
      B_oxygen: 170,
      B_lithium: 85
    });

    const elapsedTime = ref('0:00');
    const startTime = ref(null);
    const isGameRunning = ref(true);
    const isPaused = ref(false);
    const netProfit = ref(1234.56);
    const currentPrice = ref(1.0);

    const intervals = ref({
      clock: null,
      update: null
    });

    const lastProcessedTime = ref(null);
    const timeStep = 0.5; // Time increment in minutes

    const processNewData = (data) => {
      if (!data.collection_progress) return;
      
      const currentTime = data.current_time;
      
      // If this is the first data point
      if (!lastProcessedTime.value) {
        lastProcessedTime.value = currentTime;
      }

      // Update net profit if available in the data
      if (data.net_profit !== undefined) {
        netProfit.value = data.net_profit;
      }

      // Fill in any missing time points
      while (lastProcessedTime.value <= currentTime) {
        const timePoint = lastProcessedTime.value;
        
        // Create data points for both teams
        const newDataPointA = {
          time: formatValue(timePoint),
          oxygen: data.collection_progress.A_oxygen,
          lithium: data.collection_progress.A_lithium,
          total: data.collection_progress.A_oxygen + data.collection_progress.A_lithium
        };

        const newDataPointB = {
          time: formatValue(timePoint),
          oxygen: data.collection_progress.B_oxygen,
          lithium: data.collection_progress.B_lithium,
          total: data.collection_progress.B_oxygen + data.collection_progress.B_lithium
        };

        // Add new data points to the end of the arrays without limiting to 60 items
        if (!teamAHistory.value.length || 
            teamAHistory.value[teamAHistory.value.length - 1].time !== formatValue(timePoint)) {
          teamAHistory.value = [...teamAHistory.value, newDataPointA];
        }

        if (!teamBHistory.value.length || 
            teamBHistory.value[teamBHistory.value.length - 1].time !== formatValue(timePoint)) {
          teamBHistory.value = [...teamBHistory.value, newDataPointB];
        }

        lastProcessedTime.value = +(timePoint + timeStep).toFixed(1);
      }
    };

    const fetchData = () => {
      if (!isGameRunning.value || isPaused.value) return;

      // Update chart data with random values
      const newValue = +(Math.random() * (1.5 - 0.5) + 0.5).toFixed(2);
      const newLabels = [...chartData.value.labels.slice(1), formatTime(parseFloat(chartData.value.labels[5]) + 1)];
      const newData = [...chartData.value.datasets[0].data.slice(1), newValue];

      // Update current price
      currentPrice.value = newValue;

      chartData.value = {
        labels: newLabels,
        datasets: [{
          ...chartData.value.datasets[0],
          data: newData
        }]
      };

      // Update net profit randomly
      netProfit.value += (Math.random() - 0.5) * 100;
    };

    const clearIntervals = () => {
      if (intervals.value.clock) {
        clearInterval(intervals.value.clock);
        intervals.value.clock = null;
      }
      if (intervals.value.update) {
        clearInterval(intervals.value.update);
        intervals.value.update = null;
      }
    };

    const startIntervals = () => {
      if (isGameRunning.value && !isPaused.value) {
        intervals.value.update = setInterval(fetchData, 1000);
        intervals.value.clock = setInterval(updateClock, 100);
      }
    };

    const updateClock = () => {
      if (!startTime.value) {
        startTime.value = new Date();
      }
      
      if (!isPaused.value) {
        const now = new Date();
        const diff = now - startTime.value;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        elapsedTime.value = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    };

    const togglePause = () => {
      isPaused.value = !isPaused.value;
      if (isPaused.value) {
        clearIntervals();
      } else {
        startIntervals();
      }
    };

    onMounted(async () => {
      clearIntervals();
      await fetchData();
      startIntervals();

      // Keep the same update frequency regardless of visibility
      const handleVisibilityChange = () => {
        clearIntervals();
        if (!isPaused.value) {
          startIntervals();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);

      onUnmounted(() => {
        clearIntervals();
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      });
    });

    return {
      trades,
      teamAHistory,
      teamBHistory,
      chartData,
      currentData,
      formatValue,
      formatTime,
      elapsedTime,
      isGameRunning,
      isPaused,
      togglePause,
      markets,
      netProfit,
      formatProfit,
      currentPrice,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: 'Price',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
              drawBorder: false
            }
          },
          x: {
            title: {
              display: true,
              text: 'TimeStamp',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 0
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              boxWidth: 20,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            enabled: true,
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            titleColor: '#2d3748',
            bodyColor: '#2d3748',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            displayColors: false
          }
        }
      },
    };
  }
};
</script>

<style scoped>
/* Import Space Grotesk font */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

.trading-interface {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
  padding: 24px;
  overflow: hidden;
  font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.grid-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 100%;
  margin: 0 auto;
  height: 100vh;
  padding: 0 16px;
}

.team-panel {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  height: 200px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  overflow: hidden;
}

.team-panel:hover {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.team-panel h2 {
  font-size: 0.7rem;
  color: #1e293b;
  margin: 0;
  padding: 0.4rem 1rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  height: 28px;
  display: flex;
  align-items: center;
  font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.team-panel.bioengineers {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(236, 253, 245, 0.95));
  border-left: 4px solid #059669;
}

.team-panel.astrominers {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(238, 242, 255, 0.95));
  border-left: 4px solid #4f46e5;
}

.team-panel table {
  width: max-content;
  min-width: 100%;
  height: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

.team-panel thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #F7FAFC;
}

.team-panel tbody {
  background: white;
}

.team-panel td,
.team-panel th {
  padding: 0.3rem 0.6rem;
  font-size: 0.7rem;
  height: 24px;
  white-space: nowrap;
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
}

.team-panel .fixed-column {
  position: sticky;
  left: 0;
  min-width: 90px;
  background: #f8fafc;
  z-index: 2;
  text-align: left;
  font-weight: 500;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

.team-panel thead th.fixed-column {
  background: #f8fafc;
  z-index: 3;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

.team-panel tbody td.fixed-column {
  background: #f8fafc;
  z-index: 2;
}

.team-panel.bioengineers .fixed-column {
  background: linear-gradient(to right, rgba(236, 253, 245, 0.95), #f8fafc);
}

.team-panel.astrominers .fixed-column {
  background: linear-gradient(to right, rgba(238, 242, 255, 0.95), #f8fafc);
}

.team-panel thead tr {
  position: relative;
  z-index: 2;
}

.team-panel tbody tr {
  position: relative;
  z-index: 1;
}

.team-panel td:not(.fixed-column),
.team-panel th:not(.fixed-column) {
  min-width: 48px;
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
}

.team-panel {
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.team-panel::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.team-panel::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.8);
  border-radius: 3px;
}

.team-panel::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.team-panel::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.team-panel .table-wrapper {
  overflow: auto;
  height: calc(100% - 28px);
  position: relative;
}

.data-row {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr) minmax(300px, 1fr);
  gap: clamp(10px, 2vw, 20px);
  height: clamp(300px, calc(100vh - 450px), 600px);
  margin-top: 5px;
}

.multiplier-panel {
  width: 80%;
}
.trades-panel {
  width: 105%;
  margin-left: -55px;
}
.multiplier-panel,
.trades-panel,
.tradelog-panel {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(226, 232, 240, 0.8);
  min-height: 0;
}

.multiplier-panel:hover,
.trades-panel:hover,
.tradelog-panel:hover {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.multiplier-panel h2,
.trades-panel h2,
.tradelog-panel h2 {
  font-size: 0.85rem;
  color: #1e293b;
  margin: -1rem -1rem 1rem -1rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  background: linear-gradient(to right, #f8fafc, #f1f5f9);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  letter-spacing: 0.02em;
  position: relative;
  display: flex;
  align-items: center;
  font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.multiplier-panel h2::after,
.trades-panel h2::after,
.tradelog-panel h2::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, currentColor 0%, transparent 100%);
  opacity: 0.1;
}

.multiplier-panel h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-price {
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e40af;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-label {
  color: #6b7280;
  font-weight: 500;
}

.chart-buttons {
  display: flex;
  gap: 8px;
}

.chart-container {
  position: relative;
  flex: 1;
  width: 100%;
  height: calc(100% - 60px);
  min-height: 0;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 100%;
  object-fit: contain;
}

.trades-panel table,
.tradelog-panel table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.75rem;
  table-layout: fixed;
}

/* Update table cell alignments */
.trades-panel td,
.trades-panel th {
  text-align: center;  /* Center all content by default */
  padding: 0.5rem;
}

/* Specific column styling */
.trades-panel td:first-child,
.trades-panel th:first-child {
  width: 10%;  /* Item column */
  text-align: center;
}

.trades-panel td:nth-child(2),
.trades-panel th:nth-child(2) {
  width: 12%;  /* Expiration column */
  text-align: center;
}

.trades-panel td:nth-child(3),
.trades-panel th:nth-child(3) {
  width: 10%;  /* Price column */
  text-align: center;
  padding-right: 0.5rem;
}

.trades-panel td:last-child,
.trades-panel th:last-child {
  width: 15%;  /* Actions column */
  text-align: center;
}

/* Center the buttons in the Actions column */
.trades-panel td:last-child {
  display: flex;
  gap: 4px;
  align-items: center;
  padding: 0.25rem 0.5rem;
  margin-left: -4px;
}

.trades-panel thead th,
.tradelog-panel thead th {
  background: #f8fafc;
  color: #1e293b;
  font-weight: 600;
  padding: 0.5rem;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 2;
}

.trades-panel tbody td,
.tradelog-panel tbody td {
  padding: 0.5rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  transition: all 0.2s ease;
}

.trades-panel tbody tr:hover td,
.tradelog-panel tbody tr:hover td {
  background-color: #f8fafc;
}

/* Market/Item column */
.trades-panel td:first-child,
.tradelog-panel td:first-child {
  font-weight: 500;
  color: #1e40af;
}

/* Value/Price column */
.trades-panel td:nth-child(3),
.tradelog-panel td:nth-child(3) {
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  color: #059669;
}


/* Expires At column */
.trades-panel td:nth-child(2),
.tradelog-panel td:nth-child(2) {
  color: #6b7280;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

/* Action column */
.tradelog-panel td:last-child {
  font-weight: 500;
}

.tradelog-panel .action-buy {
  color: #059669;
}

.tradelog-panel .action-sell {
  color: #dc2626;
}

/* Update button styles */
.buy-btn,
.sell-btn {
  padding: 0.25rem 0.75rem;
  border: none;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.buy-btn {
  background: #059669;
}

.buy-btn:hover {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
}

.sell-btn {
  background: #dc2626;
}

.sell-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
}

.buy-btn:active,
.sell-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

/* Table container adjustments */
.table-container {
  margin: 0;
  padding: 0 0.5rem;
  max-height: calc(100% - 3rem);
  border-radius: 8px;
  background: white;
  box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.8);
}

.table-container::after {
  display: none;
}

/* Scrollbar styling for table containers */
.table-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-container::-webkit-scrollbar-track {
  background: #f8fafc;
  border-radius: 3px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.clock {
  position: fixed;
  background: linear-gradient(135deg, #ffffff, #f0f9ff);
  border: 1px solid rgba(59, 130, 246, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.7em;
  font-weight: 700;
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  color: #2d3748;
  transition: all 0.3s ease;
  cursor: move;
  user-select: none;
  z-index: 1000;
  animation: pulse 2s infinite;
}

.clock.dragging {
  transform: scale(1.05);
  box-shadow: 
    0 8px 15px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
}

.clock.game-ended {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5); }
  50% { box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.7); }
  100% { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.5); }
}

@media (hover: hover) {
  tr:hover td {
    background-color: rgba(247, 250, 252, 0.5);
  }
  
  .clock:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 8px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  }
}

/* Bottom panel headers */
.trades-panel h2,
.tradelog-panel h2 {
  font-size: 1rem;
  color: #1e40af;
  margin: 0;
  padding: 0.6rem 0.8rem;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(to right, #f0f9ff, #ffffff);
  letter-spacing: 0.02em;
}

/* Ultra-compact scrollbar styling */
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.8);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #1e40af);
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #1e3a8a);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Specific table scrollbar styling */
.astrominers-table::-webkit-scrollbar,
.bioengineers-table::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

.astrominers-table::-webkit-scrollbar-track,
.bioengineers-table::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 1.5px;
}

.astrominers-table::-webkit-scrollbar-thumb,
.bioengineers-table::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 1.5px;
}

/* TimeStamps styling */
thead th.fixed-column,
td.fixed-column {
  font-size: 0.75rem;
}

/* Numbers styling */
td:not(.fixed-column) {
  font-size: 0.75rem;
}

/* Extra small content for team panels */
.team-panel thead th {
  padding: 0.2rem;
  font-size: 0.65rem;
  height: 18px;
  white-space: nowrap;
}

.team-panel td {
  padding: 0.2rem;
  font-size: 0.65rem;
  height: 18px;
  white-space: nowrap;
}

/* Adjusted column widths for team panels */
.team-panel .fixed-column {
  min-width: 80px;
  width: 80px;
}

.team-panel td:not(.fixed-column) {
  min-width: 45px;
  width: 45px;
}

/* Table wrapper adjustments */
.team-panel .table-wrapper {
  padding: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

/* Table styling */
.team-panel td {
  transition: background-color 0.2s ease;
}

.team-panel tr:hover td {
  background-color: rgba(59, 130, 246, 0.05);
}

/* Data value animations */
td:not(.fixed-column) {
  transition: color 0.3s ease;
}

td:not(.fixed-column):hover {
  color: #3b82f6;
}

/* Chart animations */
.chart-container {
  transition: transform 0.2s ease;
  margin-left: -10px;
  margin-top: 5px;
}

.chart-container:hover {
  transform: scale(1.01);
}

/* Loading state animation */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.loading {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    to right,
    #f6f7f8 0%,
    #edeef1 20%,
    #f6f7f8 40%,
    #f6f7f8 100%
  );
  background-size: 1000px 100%;
}

/* Hide scrollbar while maintaining scroll functionality */
.table-wrapper {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}

.table-wrapper::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

.table-container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}

.table-container::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Ensure the containers still allow scrolling */
.table-wrapper {
  overflow: auto;
}

.table-container {
  overflow: auto;
}

.bottom-clock {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 12px 24px;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: 
    0 8px 16px -4px rgba(0, 0, 0, 0.1),
    0 4px 8px -4px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-clock:hover {
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 
    0 12px 20px -4px rgba(0, 0, 0, 0.15),
    0 8px 12px -4px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.9);
}

.time-display {
  padding-right: 16px;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  color: #1e40af;
}

.profit-display {
  padding-right: 16px;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  letter-spacing: 0.02em;
}

.profit-display.positive {
  color: #059669;
  text-shadow: 0 0 20px rgba(5, 150, 105, 0.2);
}

.profit-display.negative {
  color: #dc2626;
  text-shadow: 0 0 20px rgba(220, 38, 38, 0.2);
}

.control-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.control-button:hover {
  transform: translateY(-1px);
  background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.buy-btn,
.sell-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  margin: 0 3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.buy-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.buy-btn:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
}

.sell-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.sell-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);
}

.buy-btn:active,
.sell-btn:active {
  transform: translateY(0);
  box-shadow: none;
}

@media (max-width: 1200px) {
  .data-row {
    grid-template-columns: minmax(250px, 1fr) minmax(250px, 1fr) minmax(250px, 1fr);
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .data-row {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .multiplier-panel,
  .trades-panel,
  .tradelog-panel {
    height: clamp(250px, 40vh, 300px);
  }
  
  .team-panel {
    height: clamp(250px, 30vh, 350px);
  }
}
</style>