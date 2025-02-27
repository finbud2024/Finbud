<template>
  <div class="trading-interface">
    <div 
      class="draggable-clock"
      :style="{ left: clockPosition.x + 'px', top: clockPosition.y + 'px' }"
      @mousedown="startDragging"
      :class="{ 'dragging': isDragging }"
    >
      {{ elapsedTime }}
    </div>
    
    <div class="grid-container" data-aos="flip-left">
      <div class="left-column">
        <!-- Markets Panel -->
        <div class="panel">
          <h2>Markets</h2>
          <div class="table-container">
            <table class="market-table">
              <thead>
                <tr>
                  <th>Market</th>
                  <th>Value</th>
                  <th>Expires At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="market-name">Team A - Team B</td>
                  <td class="market-value">-1.00</td>
                  <td class="expires-at">60.0 min</td>
                  <td class="action-buttons">
                    <button class="buy-btn">BUY</button>
                    <button class="sell-btn">SELL</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Trades Panel -->
        <div class="panel" data-aos="flip-left">
          <h2>Trades</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Market</th>
                  <th>Expires At</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="trade in trades" :key="trade.id">
                  <td :class="trade.type.toLowerCase()">{{ trade.type }}</td>
                  <td>{{ trade.market }}</td>
                  <td>{{ formatTime(trade.executedAt) }}</td>
                  <td>{{ formatValue(trade.value) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Chart Panel -->
        <div class="panel" data-aos="flip-left">
          <h2>Multiplier Tradeable value</h2>
          <div class="chart-container">
            <LineChart :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <div class="right-column">
        <!-- Team A Panel -->
        <div class="panel" data-aos="flip-right">
          <h2>Team A Live Game</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Time (min)</th>
                  <th>Oxygen</th>
                  <th>Lithium</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, index) in [...teamAHistory].reverse()" :key="index">
                  <td>{{ record.time }}</td>
                  <td>{{ record.oxygen }}</td>
                  <td>{{ record.lithium }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Team B Panel -->
        <div class="panel" data-aos="flip-right">
          <h2>Team B Live Game</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Time (min)</th>
                  <th>Oxygen</th>
                  <th>Lithium</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(record, index) in [...teamBHistory].reverse()" :key="index">
                  <td>{{ record.time }}</td>
                  <td>{{ record.oxygen }}</td>
                  <td>{{ record.lithium }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { ref, onMounted, onUnmounted } from 'vue';  // Comment out onMounted and onUnmounted
import { ref, onMounted } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default {
  name: 'QuantSimulator',
  components: {
    LineChart
  },
  setup() {
    // Sample data
    const trades = ref([
      {
        id: 's1',
        type: 'SELL',
        market: '3 * A_oxygen + B_lithium',
        executedAt: '24.5 min',
        value: '3.00'
      },
      {
        id: 's2',
        type: 'BUY',
        market: 'A_oxygen + 2 * B_lithium',
        executedAt: '22.5 min',
        value: '7.00'
      },
      {
        id: 's3',
        type: 'SELL',
        market: '3 * A_lithium + 3 * B_oxygen',
        executedAt: '23.5 min',
        value: '11.00'
      },
      {
        id: 's4',
        type: 'BUY',
        market: '2 * A_oxygen + 2 * B_oxygen',
        executedAt: '28.5 min',
        value: '0.00'
      },
      {
        id: 'm1',
        type: 'BUY',
        market: 'A_oxygen + 2 * B_lithium',
        executedAt: '25.0 min',
        value: '-1.00'
      },
      {
        id: 'm2',
        type: 'SELL',
        market: '3 * A_oxygen + B_lithium',
        executedAt: '26.0 min',
        value: '1.00'
      }
    ]);

    const teamAHistory = ref([
      { time: '28.5', oxygen: '16.0', lithium: '0' },
      { time: '28.0', oxygen: '16.0', lithium: '0' },
      { time: '27.5', oxygen: '15.5', lithium: '0' },
      { time: '27.0', oxygen: '15.0', lithium: '0' },
      { time: '26.5', oxygen: '14.5', lithium: '0' },
      { time: '26.0', oxygen: '14.0', lithium: '0' }
    ]);

    const teamBHistory = ref([
      { time: '28.5', oxygen: '1', lithium: '1' },
      { time: '28.0', oxygen: '1', lithium: '1' },
      { time: '27.5', oxygen: '1', lithium: '1' },
      { time: '27.0', oxygen: '1', lithium: '1' },
      { time: '26.5', oxygen: '0', lithium: '1' },
      { time: '26.0', oxygen: '0', lithium: '1' }
    ]);

    // Sample chart data
    const chartData = ref({
      labels: ['0.0', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0'],
      datasets: [{
        label: 'Multiplier Price',
        data: [-1, -0.8, -0.6, -0.4, -0.2, 0, 0.2],
        borderColor: '#36A2EB',
        tension: 0.1
      }]
    });

    // Formatting functions
    const formatValue = (value) => {
      return Number(value).toFixed(2);
    };

    const formatTime = (time) => {
      const timeValue = parseFloat(time.replace(' min', ''));
      return `${timeValue.toFixed(1)} min`;
    };

    onMounted(() => {
      // mounted code
      AOS.init({ duration: 800, easing: "ease-out" });
    });

    // onUnmounted(() => {
    //   // unmounted code
    // });

    const clockPosition = ref({ x: 20, y: 400 });
    const isDragging = ref(false);
    let dragOffset = { x: 0, y: 0 };

    const startDragging = (event) => {
      isDragging.value = true;
      dragOffset = {
        x: event.clientX - clockPosition.value.x,
        y: event.clientY - clockPosition.value.y
      };

      // Add event listeners
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('mouseup', stopDragging);
    };

    const onDrag = (event) => {
      if (isDragging.value) {
        clockPosition.value = {
          x: event.clientX - dragOffset.x,
          y: event.clientY - dragOffset.y
        };
      }
    };

    const stopDragging = () => {
      isDragging.value = false;
      // Remove event listeners
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup', stopDragging);
    };

    return {
      trades,
      teamAHistory,
      teamBHistory,
      chartData,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false
          }
        }
      },
      formatValue,
      formatTime,
      elapsedTime: ref('28:30'),
      isGameRunning: ref(true),
      clockPosition,
      isDragging,
      startDragging
    };
  }
};
</script>

<style scoped>
.trading-interface {
  padding: 15px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  height: 100vh;
  overflow-y: auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.grid-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
  min-height: calc(100vh - 30px);
  padding: 15px;
  overflow: visible;
}

.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-height: min-content;
}

.panel {
  height: 400px;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.panel:hover {
  box-shadow: 
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
}

.panel h2 {
  margin: 0 0 15px 0;
  color: #1a202c;
  font-size: 1.1em;
  font-weight: 600;
  letter-spacing: 0.05em;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: -1px;
}

th {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba(247, 250, 252, 0.95);
  backdrop-filter: blur(4px);
  color: #4a5568;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px;
  font-size: 0.65em;
  border-bottom: 2px solid #e2e8f0;
}

td {
  padding: 6px 8px;
  font-size: 0.65em;
  border-bottom: 1px solid #edf2f7;
  color: #2d3748;
}

.trades-panel tbody tr:hover {
  background-color: rgba(247, 250, 252, 0.5);
}

.side {
  color: #2563eb;
  font-weight: 600;
  background: rgba(37, 99, 235, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.market {
  color: #7c3aed;
  font-weight: 600;
  background: rgba(124, 58, 237, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
}

.team-panel tbody tr:first-child {
  background-color: rgba(235, 248, 255, 0.7);
  font-weight: 600;
}

.draggable-clock {
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  color: #00ff00;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: monospace;
  font-size: 1.2rem;
  cursor: move;
  user-select: none;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.1s ease;
}

.draggable-clock:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.05);
}

.draggable-clock.dragging {
  opacity: 0.8;
  transform: scale(1.1);
}

.draggable-clock::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 22px;
  background: linear-gradient(45deg, #00ff00, transparent);
  opacity: 0.1;
  z-index: -1;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(247, 250, 252, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 224, 0.8);
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(160, 174, 192, 0.8);
}

.chart-container {
  height: 350px;
  min-height: unset;
  flex: 1;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 12px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

@media (hover: hover) {
  tr:hover td {
    background-color: rgba(247, 250, 252, 0.5);
  }
  
  .draggable-clock:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 8px rgba(0, 0, 0, 0.1),
      inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  }
}

/* Markets panel */
.left-column .panel:nth-child(1) {
  height: 400px;
}

/* Trades panel */
.left-column .panel:nth-child(2) {
  height: 400px;
}

/* Chart panel */
.left-column .panel:nth-child(3) {
  height: 400px;
}

/* Team A panel */
.right-column .panel:first-child {
  height: 400px;
}

/* Team B panel */
.right-column .panel:last-child {
  height: 400px;
  margin-top: 0px;
}

/* Common table container styles */
.table-container {
  flex: 1;
  margin: -1px -15px 0;
  padding: 0 15px;
  overflow: hidden;
}

/* Common table styles */
.table-container table {
  width: 100%;
  display: block;
  max-height: 350px;
  overflow-y: auto;
}

.table-container thead tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.table-container tbody {
  display: block;
  overflow-y: auto;
}

.table-container tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

/* Fixed headers */
table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: rgba(247, 250, 252, 0.95);
  backdrop-filter: blur(4px);
}

/* Common scrollbar styling */
.table-container table::-webkit-scrollbar {
  width: 6px;
}

.table-container table::-webkit-scrollbar-track {
  background: rgba(247, 250, 252, 0.5);
  border-radius: 3px;
}

.table-container table::-webkit-scrollbar-thumb {
  background: rgba(203, 213, 224, 0.8);
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.table-container table::-webkit-scrollbar-thumb:hover {
  background: rgba(160, 174, 192, 0.8);
}

/* Firefox scrollbar styling */
.table-container table {
  scrollbar-width: thin;
  scrollbar-color: rgba(203, 213, 224, 0.8) rgba(247, 250, 252, 0.5);
}

/* Market table specific styling */
.market-table {
  border-collapse: collapse;
  width: 100%;
}

.market-table th,
.market-table td {
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #e2e8f0;
}

.market-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #4a5568;
}

.market-table td {
  background-color: white;
}

.market-name {
  color: #2d3748;
  font-weight: 500;
}

.market-value {
  color: #2d3748;
  font-weight: 600;
}

.expires-at {
  color: #718096;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.buy-btn,
.sell-btn {
  padding: 4px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.buy-btn {
  background-color: #4299e1;
  color: white;
}

.buy-btn:hover {
  background-color: #3182ce;
}

.sell-btn {
  background-color: #cbd5e0;
  color: #4a5568;
}

.sell-btn:hover {
  background-color: #a0aec0;
}

/* Ensure table header stays fixed */
.market-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f8fafc;
}
</style>