<template>
  <div class="trading-interface">
    <div class="notifications-container">
      <transition-group name="notification">
        <div v-for="notification in notifications" 
             :key="notification.id" 
             :class="['notification', `notification-${notification.type}`]">
          {{ notification.message }}
          <button class="notification-close" @click="removeNotification(notification.id)">×</button>
        </div>
      </transition-group>
    </div>
    
    <div class="grid-container">
      <div class="team-panel astrominers">
        <h2>Astrominers <span v-if="isRefreshing" class="refresh-indicator">⟳</span></h2>
        <div class="table-wrapper tight-columns" style="width: 100%; overflow-x: auto !important; max-width: none;">
          <table style="width: auto !important; table-layout: fixed !important; border-collapse: collapse;">
            <colgroup style="display: table-column-group !important;">
              <col class="resource-column fixed-col" style="width:130px !important; min-width:130px !important; max-width:130px !important; display:table-column !important;">
              <col v-for="data in displayAHistory" :key="`col-${data.time}`" class="data-column" style="width:45px !important; min-width:45px !important; max-width:45px !important; display:table-column !important;">
            </colgroup>
            <thead>
              <tr>
                <th class="fixed-column" style="width:130px !important; min-width:130px !important; max-width:130px !important; position:sticky !important; left:0 !important; z-index:2 !important;">TimeStamps</th>
                <th v-for="data in displayAHistory" :key="data.time" style="width:45px !important; min-width:45px !important; max-width:45px !important;">
                  {{ formatTime(data.time) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fixed-column" style="width:130px !important; min-width:130px !important; max-width:130px !important; position:sticky !important; left:0 !important; z-index:2 !important;">Oxygen Crystals</td>
                <td v-for="data in displayAHistory" 
                    :key="`oxygen-${data.time}`" 
                    style="width:45px !important; min-width:45px !important; max-width:45px !important;"
                    :class="{'resource-increased': data.oxygenIncreased}">
                  {{ data.oxygen }}
                </td>
              </tr>
              <tr>
                <td class="fixed-column" style="width:130px !important; min-width:130px !important; max-width:130px !important; position:sticky !important; left:0 !important; z-index:2 !important;">Lithium Shards</td>
                <td v-for="data in displayAHistory" 
                    :key="`lithium-${data.time}`" 
                    style="width:45px !important; min-width:45px !important; max-width:45px !important;"
                    :class="{'resource-increased': data.lithiumIncreased}">
                  {{ data.lithium }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="team-panel bioengineers">
        <h2>Bioengineers <span v-if="isRefreshing" class="refresh-indicator">⟳</span></h2>
        <div class="table-wrapper tight-columns" style="width: 100%; overflow-x: auto !important; max-width: none;">
          <table style="width: auto !important; table-layout: fixed !important; border-collapse: collapse;">
            <colgroup style="display: table-column-group !important;">
              <col class="resource-column fixed-col" style="width:130px !important; min-width:130px !important; max-width:130px !important; display:table-column !important;">
              <col v-for="data in displayBHistory" :key="`col-${data.time}`" class="data-column" style="width:45px !important; min-width:45px !important; max-width:45px !important; display:table-column !important;">
            </colgroup>
            <thead>
              <tr>
                <th class="fixed-column" style="width:130px !important; min-width:130px !important; max-width:130px !important; position:sticky !important; left:0 !important; z-index:2 !important;">TimeStamps</th>
                <th v-for="data in displayBHistory" :key="data.time" style="width:45px !important; min-width:45px !important; max-width:45px !important;">
                  {{ formatTime(data.time) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fixed-column" style="width:130px !important; min-width:130px !important; max-width:130px !important; position:sticky !important; left:0 !important; z-index:2 !important;">Oxygen Crystals</td>
                <td v-for="data in displayBHistory" 
                    :key="`oxygen-${data.time}`" 
                    style="width:45px !important; min-width:45px !important; max-width:45px !important;"
                    :class="{'resource-increased': data.oxygenIncreased}">
                  {{ data.oxygen }}
                </td>
              </tr>
              <tr>
                <td class="fixed-column" style="width:130px !important; min-width:130px !important; max-width:130px !important; position:sticky !important; left:0 !important; z-index:2 !important;">Lithium Shards</td>
                <td v-for="data in displayBHistory" 
                    :key="`lithium-${data.time}`" 
                    style="width:45px !important; min-width:45px !important; max-width:45px !important;"
                    :class="{'resource-increased': data.lithiumIncreased}">
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
                <button class="buy-btn" @click="submitMarketTrade('b')">BUY</button>
                <button class="sell-btn" @click="submitMarketTrade('s')">SELL</button>
              </div>
            </div>
          </h2>
          <div class="chart-container">
            <apexchart
              v-if="mounted && chartOptions && !chartError"
              id="market-multiplier-chart"
              type="area"
              height="100%"
              width="100%"
              :options="chartOptions"
              :series="chartSeries"
              @error="chartError = true"
              @mounted="handleChartMounted"
              @updated="handleChartUpdated"
              @zoomed="handleChartZoomed"
              @selection="handleChartSelection"
              @dataPointSelection="handleDataPointSelection"
            ></apexchart>
            <div v-else-if="chartError" class="chart-fallback">
              <div class="chart-fallback-header">
                Market Multiplier Chart (Fallback View)
              </div>
              <div class="chart-data-points">
                <div 
                  v-for="(point, index) in chartSeries[0]?.data" 
                  :key="index"
                  class="data-point"
                  :style="{
                    'height': `${Math.max(5, point.y * 20)}px`,
                    'background-color': '#3b82f6'
                  }"
                  :title="`Time: ${point.x}, Value: ${point.y.toFixed(2)}`"
                ></div>
              </div>
            </div>
            <div v-else class="chart-loading">
              <div class="loading-spinner"></div>
              Loading chart...
            </div>
          </div>
        </div>
        <div class="trades-panel">
          <h2>
            Side Trades
            <span v-if="sideTradesFrozen" class="pause-indicator">
              (Updates paused)
            </span>
            <span v-else-if="paused" class="pause-indicator">
              (Simulation paused)
            </span>
          </h2>
          <div class="table-container">
            <div v-if="sideTrades.length > 0" class="trades-grid">
              <!-- Headers -->
              <div class="trades-header">
                <div class="header-cell">ITEM</div>
                <div class="header-cell">EXPIRATION</div>
                <div class="header-cell">PRICE</div>
                <div class="header-cell">ACTIONS</div>
              </div>
              
              <!-- Rows -->
              <div v-for="(trade, index) in sortedSideTrades" 
                  :key="`trade_${trade.id || trade.trade_id}_${index}`"
                  :class="{'new-entry': trade.isNew, 'trade-row': true}"
                  :data-trade-id="trade.id || trade.trade_id">
                <div class="item-cell">
                  <div class="item-content" v-html="formatTradeExpressionMath(trade.expr || trade.item)"></div>
                  <span v-if="trade.isNew" class="new-badge">NEW</span>
                  <span v-else-if="trade.timestamp && ((Date.now() - trade.timestamp) < 600000)" class="timestamp-indicator">
                    {{ formatTimeSince(trade.timestamp) }}
                  </span>
                </div>
                <div class="expiration-cell">{{ formatExpiry(trade.expiry) }}</div>
                <div class="price-cell">{{ formatPrice(trade.price) }}</div>
                <div class="action-cell">
                  <button class="buy-btn" @click="buyTrade(trade)" :disabled="paused">Buy</button>
                  <button class="sell-btn" @click="sellTrade(trade)" :disabled="paused">Sell</button>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <div class="empty-state-icon">📊</div>
              <div class="empty-state-text">No side trades available at the moment</div>
            </div>
          </div>
        </div>
        <div class="tradelog-panel">
          <h2>Trade Log</h2>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th class="item-col">Item</th>
                  <th class="time-col">TimeStamp</th>
                  <th class="price-col">Price</th>
                  <th class="action-col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="entry in localSideTrades" 
                    :key="entry.id" 
                    :class="{
                      'new-entry': entry.isNew || isNewestTradelogEntry(entry),
                      'optimistic-entry': entry.optimistic
                    }">
                  <td class="item-col">
                    <div class="item-text">
                      <span v-html="formatTradeExpressionMath(entry.expr)"></span>
                      <span v-if="entry.isNew || isNewestTradelogEntry(entry)" class="new-badge">NEW</span>
                    </div>
                  </td>
                  <td class="time-col">{{ entry.time }}</td>
                  <td class="price-col">{{ entry.price }}</td>
                  <td :class="['action-col', {'action-buy': entry.action === 'BUY', 'action-sell': entry.action === 'SELL'}]">
                    {{ entry.action }}
                  </td>
                </tr>
                <tr v-if="localSideTrades.length === 0">
                  <td colspan="4" class="empty-trades">No trades yet. Make a side trade to see it here.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-clock">
      <div class="time-display">Time: {{ formatTime(currentTime) }}</div>
      <div v-if="currentTime >= 60 || simulationEnded" 
           class="profit-display" 
           :class="{ 
             'positive': calculatedProfit > 0, 
             'negative': calculatedProfit < 0,
             'slide-in': currentTime >= 60 || simulationEnded 
           }">
        Net Profit: {{ formatProfit(calculatedProfit) }}
      </div>
      <button class="control-button" @click="togglePause">
        {{ paused ? 'Resume' : 'Pause' }}
      </button>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import axios from 'axios';
import VueApexCharts from 'vue3-apexcharts';
import ApexCharts from 'apexcharts';
import { io } from 'socket.io-client';

// Define the API base path for the multiplier simulator endpoints
const API_BASE_PATH = '/multiplier-simulator';
// WebSocket URL - uses same host and port as the API by default
const SOCKET_URL = window.location.hostname === 'localhost' ? 
  `${window.location.protocol}//${window.location.hostname}:${window.location.port}` : 
  window.location.origin;

export default {
  name: 'QuantSimulator',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    // Log initialization
    console.log('QuantSimulator setup starting');
    
    // Data variables from HomeView
    const sessionId = ref(null);
    const wallet = ref(0);
    const currentTime = ref(0);
    const currentPrice = ref(1.0);
    const collections = ref({ A_oxygen: 0, A_lithium: 0, B_oxygen: 0, B_lithium: 0 });
    const sideTrades = ref([]);
    const sideTradesFrozen = ref(false);
    const history = ref([]);
    const initialData = ref('');
    const results = ref(null);
    const simulationEnded = ref(false);
    const paused = ref(false);
    const pollingInterval = ref(null);
    const isRefreshing = ref(false);
    // Create a ref to store trades with expiration at 60 minutes
    const tradesExpiringAt60 = ref([]);
    
    // Socket.io reference
    const socket = ref(null);
    const socketConnected = ref(false);
    const socketError = ref(null);
    const usingWebSockets = ref(true);
    
    // Add variables for profit calculation
    const multiplierAt60Minutes = ref(null);
    const calculatedProfit = ref(0);
    const buyTrades = ref([]);
    const sellTrades = ref([]);
    
    // Track the last multiplier value for color changes
    const lastMultiplierValue = ref(1.0);

    // Team history data
    const teamAHistory = ref([]);
    const teamBHistory = ref([]);

    // Add chartError ref
    const chartError = ref(false);

    // Add these new refs
    const mounted = ref(false);
    // Add a map to track processing state per trade
    const processingTrades = ref(new Map());

    // Add timestamp tracking for newest entries
    const lastSideTradeTimestamp = ref(Date.now());
    const lastTradelogTimestamp = ref(Date.now());

    // Add new ref for combined trade history
    const localSideTrades = ref([]);

    /**
     * Formats resource values into mathematical notation
     * @param {string} resourceType - The type of resource (e.g., 'A_oxygen', 'B_lithium')
     * @param {number} value - The quantity of the resource
     * @return {string} Formatted resource in math notation
     */
     const formatResourceMath = (resourceType, value) => {
      // Skip formatting if invalid values
      if (value === undefined || value === null || resourceType === undefined) {
        return 'N/A';
      }
      
      // Extract team and resource type
      const [team, resource] = resourceType.split('_');
      
      // Define resource symbols
      const resourceSymbols = {
        'oxygen': 'O',
        'lithium': 'L'
      };
      
      // Get the resource symbol
      const symbol = resourceSymbols[resource] || resource.charAt(0).toUpperCase();
      
      // Format team as subscript
      const teamSubscript = team === 'A' ? 'ₐ' : 'ᵦ';
      
      // Return formatted string: value + symbol + team subscript
      return `${value}${symbol}${teamSubscript}`;
    };

    /**
     * Formats trade expressions into mathematical notation
     * @param {string} expression - The trade expression to format (e.g., "A_lithium + B_lithium")
     * @return {string} Formatted expression with mathematical notation (e.g., "Lₐ + Lᵦ")
     */
    const formatTradeExpressionMath = (expression) => {
      // Handle null, undefined, or empty expressions
      if (!expression) return 'N/A';
      
      // Convert to string in case a number is passed
      expression = String(expression);
      
      // Skip formatting for non-mathematical expressions
      if (!expression.match(/[AB]_[a-z]+|[+\-*/0-9]/i)) {
        return expression;
      }
      
      // Define resource symbols mapping
      const resourceSymbols = {
        'oxygen': 'O',
        'lithium': 'L'
      };
      
      // Pattern for resources with team notation (e.g., "A_lithium", "B_oxygen")
      const resourcePattern = /([AB])_(oxygen|lithium)/gi;
      
      // Replace resources with symbols and subscripts
      let formattedExpression = expression.replace(resourcePattern, (match, team, resource) => {
        const symbol = resourceSymbols[resource.toLowerCase()] || resource.charAt(0).toUpperCase();
        const subscript = team.toUpperCase() === 'A' ? 'ₐ' : 'ᵦ';
        return symbol + subscript;
      });
      
      // Format numerical coefficients (e.g., "2 * B_lithium" becomes "2Lᵦ")
      formattedExpression = formattedExpression.replace(/(\d+)\s*\*\s*([OL][ₐᵦ])/g, '$1$2');
      
      // Add proper spacing around mathematical operators
      formattedExpression = formattedExpression.replace(/([+\-*/])/g, ' $1 ');
      
      // Clean up excessive spaces
      formattedExpression = formattedExpression.replace(/\s+/g, ' ').trim();
      
      return formattedExpression;
    };
    
    // Enhanced polling strategy to ensure real-time updates
    const startPolling = () => {
      stopPolling(); // Clear any existing intervals
      
      // Only start polling if we're not using WebSockets or have a WebSocket error
      if (usingWebSockets.value && socketConnected.value && !socketError.value) {
        console.log('WebSocket connection active, skipping HTTP polling');
        return;
      }
      
      console.log('Starting HTTP polling for simulation updates');
      
      let isPolling = false;
      
      // Poll at a higher frequency to capture all backend updates immediately
      pollingInterval.value = setInterval(async () => {
        if (!isPolling) {
          isPolling = true;
          try {
            // Fetch current data directly, requesting historical collections too
            // Add API_BASE_PATH to the endpoint
            const response = await axios.get(`${API_BASE_PATH}/current_data/${sessionId.value.split(':')[1]}`, {
              params: {
                fields: 'current_time,current_multiplier,collections,historical_collections,history,side_trades,wallet,paused'
              }
            });
            
            // Process the data using the same function as WebSocket
            processSimulationData(response.data);
          } catch (err) {
            console.error('Polling error:', err);
          } finally {
            isPolling = false;
          }
        }
      }, 250); // Poll every 250ms to ensure we catch all backend updates instantly
    };
    
    const processHistoricalCollections = (historicalData) => {
      if (!historicalData || historicalData.length === 0) return;
      
      console.log('Processing historical collections data');
      
      // First, sort by time to ensure chronological order
      historicalData.sort((a, b) => a.time - b.time);
      
      // Clear existing team history to rebuild it completely
      const oldALength = teamAHistory.value.length;
      const oldBLength = teamBHistory.value.length;
      
      // Only fully reset if we have significantly more data
      if (historicalData.length > (oldALength * 1.5) || historicalData.length > 10 && oldALength < 3) {
        console.log('Replacing team history with historical data');
        teamAHistory.value = [];
        teamBHistory.value = [];
      }
      
      // Process each history entry to build team history
      historicalData.forEach(entry => {
        // Normalize the time to 0.5 increments for consistency
        const exactTime = Math.round(entry.time * 2) / 2;
        
        // Extract collection data
        const collections = entry.collections || {};
        
        // Map the data to the format our display functions expect
        const collectionData = {
          // Map oranges/lemons back to oxygen/lithium for frontend compatibility
          A_oxygen: collections.A_oranges || 0,
          A_lithium: collections.A_lemons || 0,
          B_oxygen: collections.B_oranges || 0,
          B_lithium: collections.B_lemons || 0
        };
        
        // Update team history with this data point
        updateTeamHistory(collectionData, exactTime);
      });
      
      console.log(`Team A history: ${teamAHistory.value.length} entries, Team B history: ${teamBHistory.value.length} entries`);
      
      // If we didn't have data before and do now, force a UI refresh
      if ((oldALength === 0 && teamAHistory.value.length > 0) ||
          (oldBLength === 0 && teamBHistory.value.length > 0)) {
        console.log('First history data received, forcing UI refresh');
        isRefreshing.value = true;
        setTimeout(() => {
          isRefreshing.value = false;
        }, 500);
      }
    };

    // Function to compare and mark increased values in team history
    const compareTeamHistory = (teamAHistory, teamBHistory) => {
      // Create copies of the arrays to avoid reference issues
      const updatedTeamAHistory = teamAHistory.map((point, index) => {
        // Skip the first entry as there's nothing to compare it to
        if (index === 0) return { ...point, oxygenIncreased: false, lithiumIncreased: false };
        
        // Compare with previous entry to detect increases
        const prevPoint = teamAHistory[index - 1];
        return {
          ...point,
          oxygenIncreased: point.oxygen > prevPoint.oxygen,
          lithiumIncreased: point.lithium > prevPoint.lithium
        };
      });
      
      const updatedTeamBHistory = teamBHistory.map((point, index) => {
        // Skip the first entry as there's nothing to compare it to
        if (index === 0) return { ...point, oxygenIncreased: false, lithiumIncreased: false };
        
        // Compare with previous entry to detect increases
        const prevPoint = teamBHistory[index - 1];
        return {
          ...point,
          oxygenIncreased: point.oxygen > prevPoint.oxygen,
          lithiumIncreased: point.lithium > prevPoint.lithium
        };
      });
      
      return { updatedTeamAHistory, updatedTeamBHistory };
    };

    // Enhanced updateTeamHistory for consistent timestamps and resource highlighting
    const updateTeamHistory = (collectionsData, timeValue) => {
      if (!collectionsData) return;
      
      // Use exact rounded time for consistency
      const exactTime = Math.round(timeValue * 2) / 2;
      
      // Parse collection data with safe integer conversion
      const newA_oxygen = parseInt(collectionsData.A_oxygen || 0);
      const newA_lithium = parseInt(collectionsData.A_lithium || 0);
      const newB_oxygen = parseInt(collectionsData.B_oxygen || 0);
      const newB_lithium = parseInt(collectionsData.B_lithium || 0);
      
      // Find the most recent entry to compare with for highlighting
      const latestAPoint = teamAHistory.value.length > 0 
        ? teamAHistory.value[teamAHistory.value.length - 1] 
        : { oxygen: 0, lithium: 0 };
        
      const latestBPoint = teamBHistory.value.length > 0 
        ? teamBHistory.value[teamBHistory.value.length - 1] 
        : { oxygen: 0, lithium: 0 };
      
      // Create team history points with exact time value and highlighting flags
      const teamAPoint = {
        time: exactTime,
        oxygen: newA_oxygen,
        lithium: newA_lithium,
        total: newA_oxygen + newA_lithium,
        oxygenIncreased: newA_oxygen > latestAPoint.oxygen,
        lithiumIncreased: newA_lithium > latestAPoint.lithium
      };
      
      const teamBPoint = {
        time: exactTime,
        oxygen: newB_oxygen,
        lithium: newB_lithium,
        total: newB_oxygen + newB_lithium,
        oxygenIncreased: newB_oxygen > latestBPoint.oxygen,
        lithiumIncreased: newB_lithium > latestBPoint.lithium
      };
      
      // Check if this time point already exists
      const existingAIndex = teamAHistory.value.findIndex(p => Math.abs(p.time - exactTime) < 0.01);
      const existingBIndex = teamBHistory.value.findIndex(p => Math.abs(p.time - exactTime) < 0.01);
      
      let dataChanged = false;
      
      if (existingAIndex !== -1) {
        // Update existing point with exact time and highlighting
        const prevValue = teamAHistory.value[existingAIndex];
        if (teamAHistory.value[existingAIndex].oxygen !== newA_oxygen || 
            teamAHistory.value[existingAIndex].lithium !== newA_lithium) {
          teamAHistory.value[existingAIndex] = {
            ...teamAPoint,
            time: exactTime, // Ensure consistent time value
            oxygenIncreased: newA_oxygen > prevValue.oxygen,
            lithiumIncreased: newA_lithium > prevValue.lithium
          };
          dataChanged = true;
        }
      } else {
        // Add new point with exact time
        teamAHistory.value.push(teamAPoint);
        dataChanged = true;
      }
      
      if (existingBIndex !== -1) {
        // Update existing point with exact time and highlighting
        const prevValue = teamBHistory.value[existingBIndex];
        if (teamBHistory.value[existingBIndex].oxygen !== newB_oxygen || 
            teamBHistory.value[existingBIndex].lithium !== newB_lithium) {
          teamBHistory.value[existingBIndex] = {
            ...teamBPoint,
            time: exactTime, // Ensure consistent time value
            oxygenIncreased: newB_oxygen > prevValue.oxygen,
            lithiumIncreased: newB_lithium > prevValue.lithium
          };
          dataChanged = true;
        }
      } else {
        // Add new point with exact time
        teamBHistory.value.push(teamBPoint);
        dataChanged = true;
      }
      
      if (dataChanged) {
        // Sort arrays by time
        teamAHistory.value.sort((a, b) => a.time - b.time);
        teamBHistory.value.sort((a, b) => a.time - b.time);
        
        // Apply highlighting to history arrays
        const { updatedTeamAHistory, updatedTeamBHistory } = compareTeamHistory(teamAHistory.value, teamBHistory.value);
        
        // Force UI refresh by triggering Vue's reactivity
        teamAHistory.value = [...updatedTeamAHistory];
        teamBHistory.value = [...updatedTeamBHistory];
      }
      
      return dataChanged;
    };

    const stopPolling = () => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
        pollingInterval.value = null;
      }
    };

    // Enhanced formatting for consistent time display
    const formatTime = (value) => {
      if (typeof value === 'number') {
        // Round to nearest 0.5 increment to ensure consistency
        const roundedValue = Math.round(value * 2) / 2;
        const minutes = Math.floor(roundedValue);
        const seconds = Math.round((roundedValue % 1) * 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
      return value;
    };

    // Modified computed properties to directly use team history without interpolation
    // but still ensure consistent ordering
    const displayAHistory = computed(() => {
      return [...teamAHistory.value]
        .filter(item => item.time <= currentTime.value)
        .sort((a, b) => a.time - b.time); // Sort by time ascending (oldest first)
    });

    const displayBHistory = computed(() => {
      return [...teamBHistory.value]
        .filter(item => item.time <= currentTime.value)
        .sort((a, b) => a.time - b.time); // Sort by time ascending (oldest first)
    });
    
    // UI formatting functions
    const formatValue = (value) => {
      if (typeof value === 'number') {
        return Math.round(value);
      }
      return value;
    };

    const formatProfit = (value) => {
      const formattedValue = Math.abs(value).toFixed(2);
      return value >= 0 ? `+$${formattedValue}` : `-$${formattedValue}`;
    };

    // Add a function to mark new entries
    const markNewestEntries = () => {
      // Update timestamp when new entries are added
      lastSideTradeTimestamp.value = Date.now();
      lastTradelogTimestamp.value = Date.now();
      
      // Clear the "new" status after a reasonable time
      setTimeout(() => {
        sideTrades.value.forEach(trade => {
          if (trade.isNew) {
            trade.isNew = false;
            // Keep timestamp intact for time indication
          }
        });
        lastSideTradeTimestamp.value = 0;
      }, 8000); // Extended from 5000 to 8000 ms
    };

    // Add these methods to the methods section
    const formatExpiry = (expiry) => {
      // Handle different expiry formats
      if (!expiry) return 'N/A';
      
      // If it's already in the format "60:00" or similar
      if (typeof expiry === 'string' && expiry.includes(':')) {
        return expiry;
      }
      
      // If it's a number (minutes)
      if (typeof expiry === 'number' || !isNaN(Number(expiry))) {
        const minutes = parseInt(expiry);
        return `${minutes}:00`;
      }
      
      return expiry; // Return as is if we can't format it
    };
    
    const formatPrice = (price) => {
      if (!price && price !== 0) return 'N/A';
      
      // If price is a number, format as integer
      if (typeof price === 'number' || !isNaN(Number(price))) {
        return Math.round(parseFloat(price));
      }
      
      return price; // Return as is if we can't format it
    };

    /**
     * Format how long ago a trade was added
     */
    const formatTimeSince = (timestamp) => {
      if (!timestamp) return '';
      
      const now = Date.now();
      const seconds = Math.floor((now - timestamp) / 1000);
      
      if (seconds < 5) return 'just now';
      if (seconds < 60) return `${seconds}s ago`;
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    };
    
    // ApexCharts data
    const chartSeries = ref([
      {
        name: 'Market Multiplier',
        data: []
      }
    ]);
    
    const chartOptions = ref({
      chart: {
        id: 'market-multiplier-chart',
        type: 'area',
        height: '100%',
        width: '100%',
        toolbar: {
          show: true,
          autoSelected: 'zoom',
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        },
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 350
          }
        },
        background: '#fff',
        fontFamily: 'Inter, sans-serif',
        redrawOnWindowResize: true,
        redrawOnParentResize: true,
        parentHeightOffset: 0, // Remove padding
        offsetX: 0, // No horizontal offset
        offsetY: 0, // No vertical offset
        events: {}
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 1.5,
        lineCap: 'round'
      },
      colors: ['#3b82f6'],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ['#3b82f6'],
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.2,
          stops: [0, 100]
        }
      },
      markers: {
        size: 0,  // Hide markers for cleaner look
        hover: {
          size: 0  // Hide hover markers
        }
      },
      grid: {
        show: true,
        borderColor: '#f3f4f6',
        strokeDashArray: 0,
        position: 'back',
        padding: {
          left: 0,    // Minimize padding
          right: 0,   // Minimize padding
          top: 5,
          bottom: 5
        }
      },
      tooltip: {
        enabled: true,
        theme: 'light',
        shared: true,
        intersect: false,
        fixed: {
          enabled: true,
          position: 'topRight',
          offsetX: 0,
          offsetY: 0,
        },
        x: {
          show: true,
          formatter: undefined
        },
        y: {
          formatter: (val) => parseFloat(val).toFixed(2)
        },
        marker: {
          show: false  // Hide tooltip markers
        },
        onDatasetHover: {
          highlightDataSeries: true,
        }
      },
      xaxis: {
        type: 'category', // Use category type for direct string display
        labels: {
          show: true,
          rotate: 0,
          offsetY: 0,
          style: {
            fontSize: '10px' // Smaller font for more space
          },
          formatter: function(value) {
            return value; // Keep the time format as is
          }
        },
        axisBorder: {
          show: false // Hide border for more space
        },
        axisTicks: {
          show: false // Hide ticks for more space
        }
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return parseFloat(value).toFixed(2);
          },
          style: {
            fontSize: '10px' // Smaller font for more space
          },
          offsetX: -2, // Move labels closer to axis
          minWidth: 20, // Minimal width
          maxWidth: 20  // Maximal width
        },
        axisBorder: {
          show: false // Hide border for more space
        },
        axisTicks: {
          show: false // Hide ticks for more space
        }
      },
      margin: {
        left: 0,
        right: 0
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: '200px'
            },
            markers: {
              size: 0
            }
          }
        }
      ]
    });
    
    // Function to update chart options for maximum width
    const updateChartOptionsForWidth = () => {
      // Force current chart to update
      const chart = ApexCharts.getChartByID('market-multiplier-chart');
      if (chart) {
        chart.updateOptions({
          chart: {
            width: '100%',
            height: '100%',
            parentHeightOffset: 0,
            offsetX: 0,
            offsetY: 0
          },
          grid: {
            padding: {
              left: 0,
              right: 0,
              top: 5,
              bottom: 5
            }
          },
          margin: {
            left: 0,
            right: 0
          },
          yaxis: {
            labels: {
              offsetX: -2,
              minWidth: 20,
              maxWidth: 20,
              style: {
                fontSize: '10px'
              }
            }
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }, false, true);
      }
    };
    
    // Update chart with real data
    const updateChartData = (priceData, timeData) => {
      if (!priceData || !timeData || priceData.length === 0) {
        console.log('Skipping chart update - missing data');
        return;
      }
      
      try {
        console.log('Updating chart with', priceData.length, 'data points');
        
        // Create properly formatted data for ApexCharts
        const seriesData = priceData.map((price, index) => {
          // Just use the formatted time directly without additional processing
          const formattedTime = timeData[index];
          
          return {
            x: formattedTime, // Keep the original formatted time string
            y: parseFloat(price) // Ensure price is a number
          };
        });
        
        // Update chart series data
        chartSeries.value = [{
          name: 'Market Multiplier',
          data: seriesData
        }];
        
        console.log('Chart data updated successfully');
        
        // Determine the color based on the multiplier trend
        let chartColor = '#3b82f6'; // Default blue color
        
        // Get the current multiplier value
        const currentMultiplier = currentPrice.value;
        const previousMultiplier = lastMultiplierValue.value;
        
        // Calculate percentage change for more nuanced color
        const percentChange = previousMultiplier !== 0 ? 
          ((currentMultiplier - previousMultiplier) / Math.abs(previousMultiplier)) * 100 : 0;
        
        // Set color based on the trend
        if (currentMultiplier > previousMultiplier) {
          // Green gradient for increase
          const greenIntensity = Math.min(100, Math.max(50, 75 + percentChange));
          chartColor = `hsl(160, 84%, ${greenIntensity - 40}%)`; 
        } else if (currentMultiplier < previousMultiplier) {
          // Red gradient for decrease
          const redIntensity = Math.min(100, Math.max(50, 75 + Math.abs(percentChange)));
          chartColor = `hsl(0, 84%, ${redIntensity - 40}%)`;
        }
        
        // Force chart update if needed by checking the DOM element
        setTimeout(() => {
          const chartElement = document.getElementById('market-multiplier-chart');
          if (chartElement) {
            try {
              const chart = window.ApexCharts.getChartByID('market-multiplier-chart');
              if (chart) {
                // Update chart options with the new color
                chart.updateOptions({
                  colors: [chartColor],
                  tooltip: {
                    enabled: true,
                    shared: true,
                    intersect: false,
                    fixed: {
                      enabled: true,
                      position: 'topRight',
                      offsetX: 0,
                      offsetY: 0,
                    },
                    x: {
                      show: true,
                      formatter: undefined
                    }
                  },
                  stroke: {
                    curve: 'smooth',
                    width: 1.5,
                    lineCap: 'round'
                  },
                  fill: {
                    type: 'gradient',
                    gradient: {
                      shade: 'light',
                      type: "vertical",
                      shadeIntensity: 0.5,
                      gradientToColors: [chartColor],
                      inverseColors: false,
                      opacityFrom: 0.7,
                      opacityTo: 0.2,
                      stops: [0, 100]
                    }
                  }
                }, false, false);
                
                // Update the series with new data
                chart.updateSeries([{
                  name: 'Market Multiplier',
                  data: seriesData
                }], true);
                
                // Apply width optimization after updating data
                updateChartOptionsForWidth();
              } else {
                console.warn('Chart object not found, attempting to initialize');
                setTimeout(() => {
                  if (mounted.value && chartOptions.value) {
                    // Update the chartOptions colors
                    chartOptions.value.colors = [chartColor];
                    
                    // Attempt to force re-render the chart component
                    mounted.value = false;
                    setTimeout(() => {
                      mounted.value = true;
                    }, 50);
                  }
                }, 100);
              }
            } catch (chartError) {
              console.error('Error updating chart object:', chartError);
              chartError.value = true;
            }
          } else {
            console.warn('Chart element not found in DOM');
          }
        }, 100);
      } catch (error) {
        console.error('Error updating chart:', error);
        chartError.value = true;
        
        // Recovery attempt
        setTimeout(() => {
          try {
            // Try a simpler update approach as fallback
            chartSeries.value = [{
              name: 'Market Multiplier',
              data: priceData.map((price, index) => ({
                x: timeData[index], // Use the original time string directly
                y: parseFloat(price)
              }))
            }];
          } catch (recoveryError) {
            console.error('Chart recovery failed:', recoveryError);
          }
        }, 200);
      }
    };
    
    const tradeHistory = computed(() => {
      return [...localSideTrades.value].sort((a, b) => {
        if (typeof a.time === 'string' && typeof b.time === 'string') {
          return b.time.localeCompare(a.time);
        } else {
          return b.time - a.time;
        }
      });
    });

    // Inside your setup() function, ensure this computed property exists:
    const sortedSideTrades = computed(() => {
      return [...sideTrades.value].sort((a, b) => {
        // Sort by expiry - newest first
        if (a.expiry && b.expiry) {
          // Check if both are strings
          if (typeof a.expiry === 'string' && typeof b.expiry === 'string') {
            return b.expiry.localeCompare(a.expiry); // Reversed order for newest first
          }
          // Handle case where one or both are not strings (could be numbers, dates, etc.)
          else if (a.expiry > b.expiry) return -1;
          else if (a.expiry < b.expiry) return 1;
        } else if (a.expiry && !b.expiry) {
          return -1; // a has expiry but b doesn't, a comes first
        } else if (!a.expiry && b.expiry) {
          return 1; // b has expiry but a doesn't, b comes first
        }
        return 0;
      });
    });
    
    // Functions to interact with backend
    const startSimulation = async () => {
      try {
        console.log('Starting simulation...');
        
        // Check if the server is reachable before attempting to start simulation
        try {
          // First check if the server is up by pinging the root endpoint
          // Update to use the base path for simulator API
          await axios.get(`${API_BASE_PATH}/`);
          console.log('Backend server is reachable');
        } catch (pingError) {
          console.error('Backend server is not reachable:', pingError.message);
          throw new Error(`Cannot connect to backend server. Please ensure the server is running at ${axios.defaults.baseURL}${API_BASE_PATH}`);
        }
        
        // Update to use the base path for simulator API
        const response = await axios.post(`${API_BASE_PATH}/start_simulation`, {
          user_id: 'player1',
        }, {
          timeout: 10000 // 10 second timeout
        });
        
        console.log('Simulation started successfully:', response.data);
        sessionId.value = response.data.session_id;
        paused.value = false;
        simulationEnded.value = false;
        
        // Connect to WebSockets after starting simulation
        connectWebSocket();
        
        // Start polling as fallback if needed
        if (!usingWebSockets.value) {
          startPolling();
        }
      } catch (error) {
        console.error('Failed to start simulation:', error.message);
        alert(`Failed to start simulation: ${error.message}. Please check the console for more details.`);
      }
    };

    const fetchResults = async () => {
      if (!sessionId.value) return;
      
      try {
        // Update to use the base path for simulator API
        const response = await axios.get(`${API_BASE_PATH}/results/${sessionId.value.split(':')[1]}`);
        const data = response.data;
        results.value = data;
        simulationEnded.value = true;
        sessionId.value = null;
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    // Direct data refresh method
    const forceDataRefresh = async () => {
      console.log('Forcing immediate data refresh...');
      isRefreshing.value = true; // Show refresh indicator
      
      try {
        // Use direct fetch approach with all needed fields
        // Update to use the base path for simulator API
        const response = await axios.get(`${API_BASE_PATH}/current_data/${sessionId.value.split(':')[1]}`, {
          params: {
            fields: 'current_time,current_multiplier,collections,historical_collections,history,side_trades,wallet,paused'
          }
        });
        const data = response.data;
        
        // Apply all updates directly
        currentTime.value = data.current_time;
        currentPrice.value = data.current_multiplier;
        wallet.value = data.wallet;
        collections.value = data.collections;
        
        // Process historical collections if available
        if (data.historical_collections && data.historical_collections.length > 0) {
          processHistoricalCollections(data.historical_collections);
        } else {
          // Update team history with proper time normalization (fallback)
          updateTeamHistory(data.collections, data.current_time);
        }
        
        // Update history directly
        if (data.history && data.history.length > 0) {
          history.value = data.history.map(item => ({
            ...item,
            time: Math.round(item.time * 2) / 2 // Normalize time to 0.5 increments
          }));
          
          // Sort history by time
          history.value.sort((a, b) => a.time - b.time);
          
          // Update chart
          const prices = [...history.value.map(item => item.multiplier)];
          const times = [...history.value.map(item => formatTime(item.time))];
          updateChartData(prices, times);
        }
        
        console.log('Immediate data refresh completed');
      } catch (error) {
        console.error('Error during forced data refresh:', error);
      } finally {
        // Keep refresh indicator visible briefly
        setTimeout(() => {
          isRefreshing.value = false;
        }, 500);
      }
    };
    
    // Add debounce utility function at the top of the setup function after variable declarations
    const lastActionTime = ref(0);
    const isProcessingMarketTrade = ref(false);
    const debounceTime = 750; // 750ms between actions
    
    // Enhanced submitMarketTrade function with debouncing and better state management
    const submitMarketTrade = async (action) => {
      // Prevent rapid clicking by enforcing a minimum delay between clicks
      const now = Date.now();
      if (now - lastActionTime.value < debounceTime || isProcessingMarketTrade.value) {
        console.log('Action throttled - please wait');
        return;
      }
      
      lastActionTime.value = now;
      isProcessingMarketTrade.value = true;
      
      if (!sessionId.value) {
        console.error('No active session');
        isProcessingMarketTrade.value = false;
        return;
      }
      
      // Add to tradelog immediately for responsive UI
      const optimisticTradelogEntry = {
        id: `optimistic-market-${Date.now()}`,
        type: 'market',
        expr: 'Market Multiplier',
        time: formatTime(currentTime.value),
        price: currentPrice.value,
        action: action === 'b' ? 'BUY' : 'SELL',
        isNew: true,
        optimistic: true,
        timestamp: Date.now()
      };
      
      localSideTrades.value.unshift(optimisticTradelogEntry);
      
      // Add notification for the user
      const actionText = action === 'b' ? 'BUY' : 'SELL';
      const notifyId = addNotification(`Processing ${actionText} for Market Multiplier...`, 'processing');
      
      // Increased timeout and retry functionality
      const maxRetries = 2;
      let retryCount = 0;
      
      const attemptTrade = async () => {
        try {
          // Update to use the base path for simulator API
          const response = await Promise.race([
            axios.post(`${API_BASE_PATH}/action/${sessionId.value.split(':')[1]}`, {
              type: 'm',
              action: action
            }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Trade request timed out')), 15000)
            )
          ]);
          
          const data = response.data;
          wallet.value = data.wallet;
          
          // Remove optimistic entry
          localSideTrades.value = localSideTrades.value.filter(entry => 
            entry.id !== optimisticTradelogEntry.id
          );
          
          // Create the confirmed trade entry
          const tradeEntry = {
            id: `market-${Date.now()}`,
            type: 'market',
            expr: 'Market Multiplier',
            time: formatTime(currentTime.value),
            price: currentPrice.value,
            action: action === 'b' ? 'BUY' : 'SELL',
            isNew: true,
            timestamp: Date.now()
          };
          
          // Add confirmed entry to tradelog
          localSideTrades.value.unshift(tradeEntry);
          
          // Store in appropriate array for profit calculation
          if (action === 'b') {
            buyTrades.value.push(tradeEntry);
          } else {
            sellTrades.value.push(tradeEntry);
          }
          
          // If we're at or past 60 minutes and have the multiplier, recalculate profit
          if (currentTime.value >= 60 && multiplierAt60Minutes.value !== null) {
            calculateProfit();
          }
          
          // Update notification with success
          updateNotification(notifyId, `Successfully executed ${actionText} for Market Multiplier`, 'success');
          
          // Mark entries as new
          markNewestEntries();
          
          // Show success message
          console.log('Market trade executed successfully');
          
          // Don't force data refresh immediately to prevent UI lag
          // Use a small timeout to allow UI to settle first
          setTimeout(() => {
            if (socketConnected.value) {
              // If websockets are connected, no need to force refresh
              isProcessingMarketTrade.value = false;
            } else {
              // Only force refresh if needed (websockets not available)
              forceDataRefresh().finally(() => {
                isProcessingMarketTrade.value = false;
              });
            }
          }, 300);
          
        } catch (error) {
          console.error('Trade failed:', error);
          
          // Try again if we haven't exceeded max retries
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying market trade (attempt ${retryCount} of ${maxRetries})...`);
            setTimeout(attemptTrade, 1000); // Wait 1 second before retrying
            return;
          }
          
          // Remove optimistic entry on final error
          localSideTrades.value = localSideTrades.value.filter(entry => 
            !entry.id.includes('optimistic-market')
          );
          
          // Show error to user
          alert('Trade failed: ' + (error.response?.data?.error || error.message || 'Unknown error'));
          isProcessingMarketTrade.value = false;
        }
      };
      
      // Start the first attempt
      attemptTrade();
    };
    
    const submitSideTrade = async (tradeId, action) => {
      if (!sessionId.value) {
        console.error('No active session');
        return Promise.reject(new Error('No active session'));
      }
      
      try {
        // Find the side trade details to log - check for both id and trade_id
        const sideTradeDetails = sideTrades.value.find(trade => 
          (trade.id === tradeId) || (trade.trade_id === tradeId)
        );
        
        console.log(`Submitting side trade: ID=${tradeId}, Action=${action}, Details:`, sideTradeDetails);
        
        // Set a shorter initial timeout for faster response
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout instead of 12
        
        try {
          // Update to use the base path for simulator API
          const response = await axios.post(`${API_BASE_PATH}/action/${sessionId.value.split(':')[1]}`, {
            type: 's',
            action: action,
            id: tradeId
          }, {
            signal: controller.signal
          });
          
          // Clear the timeout since the request completed
          clearTimeout(timeoutId);
          
          const data = response.data;
          
          // Update wallet directly - no need to wait for forceDataRefresh
          wallet.value = data.wallet;
          
          // Replace optimistic entry with confirmed entry
          if (sideTradeDetails) {
            // Remove any optimistic entries for this trade
            localSideTrades.value = localSideTrades.value.filter(entry => 
              !entry.optimistic || !entry.id.includes(`optimistic-${tradeId}`)
            );
            
            // Add confirmed entry
            localSideTrades.value.unshift({
              id: `side-${tradeId}-${Date.now()}`,
              type: 'side',
              expr: sideTradeDetails.expr || sideTradeDetails.item,
              time: formatTime(currentTime.value),
              price: sideTradeDetails.price,
              action: action === 'b' ? 'BUY' : 'SELL',
              isNew: true,
              timestamp: Date.now()
            });
            
            // Mark entries as new - but defer it slightly to avoid blocking UI
            setTimeout(() => markNewestEntries(), 50);
          }
          
          // Don't force data refresh immediately - rely on WebSockets or regular polling
          // This avoids excessive server requests during rapid trading
          
          return Promise.resolve(data);
        } catch (axiosError) {
          // Clear the timeout to prevent memory leaks
          clearTimeout(timeoutId);
          
          if (axiosError.name === 'AbortError' || axiosError.code === 'ECONNABORTED') {
            throw new Error('Trade request timed out');
          }
          throw axiosError;
        }
      } catch (error) {
        console.error('Side trade failed:', error);
        return Promise.reject(error);
      }
    };
    
    // Pause and resume methods with smooth transition
    const togglePause = async () => {
      if (!sessionId.value) return;
      
      try {
        isRefreshing.value = true; // Show loading indicator
        
        if (paused.value) {
          // Resume simulation
          // Update to use the base path for simulator API
          await axios.post(`${API_BASE_PATH}/resume_simulation/${sessionId.value.split(':')[1]}`);
          paused.value = false;
          startPolling();
        } else {
          // Pause simulation
          // Update to use the base path for simulator API
          await axios.post(`${API_BASE_PATH}/stop_simulation/${sessionId.value.split(':')[1]}`);
          paused.value = true;
          stopPolling();
        }
      } catch (error) {
        console.error('Toggle pause failed:', error);
      } finally {
        setTimeout(() => {
          isRefreshing.value = false;
        }, 500);
      }
    };

    // Calculate profit based on the corrected formula:
    // For BUY trades: net profit += (price buy at that time - price multiplier at 60 minutes)
    // For SELL trades: net profit += (price multiplier at 60 minutes - price sell at that time)
    const calculateProfit = () => {
      if (multiplierAt60Minutes.value === null) {
        console.log('Cannot calculate profit - multiplier at 60 minutes not captured yet');
        return;
      }
      
      console.log('Calculating profit with corrected formula...');
      console.log('Buy trades:', buyTrades.value);
      console.log('Sell trades:', sellTrades.value);
      console.log('Multiplier at 60 minutes:', multiplierAt60Minutes.value);
      
      let totalProfit = 0;
      
      // For BUY trades: net profit += (price buy at that time - price multiplier at 60 minutes)
      buyTrades.value.forEach(trade => {
        const profit = multiplierAt60Minutes.value - trade.price;
        console.log(`Buy trade profit: ${multiplierAt60Minutes.value} - ${trade.price} = ${profit}`);
        totalProfit += profit;
      });
      
      // For SELL trades: net profit += (price multiplier at 60 minutes - price sell at that time)
      sellTrades.value.forEach(trade => {
        const profit = trade.price - multiplierAt60Minutes.value;
        console.log(`Sell trade profit: ${trade.price} - ${multiplierAt60Minutes.value} = ${profit}`);
        totalProfit += profit;
      });
      
      calculatedProfit.value = totalProfit;
      console.log('Total calculated profit:', calculatedProfit.value);
    };
    
    const buyTrade = (trade) => {
      if (!trade || (!trade.id && !trade.trade_id)) {
        console.error('Invalid trade:', trade);
        return;
      }
      
      // Get the trade ID
      const tradeId = trade.id || trade.trade_id;
      
      // Check if this trade is already being processed 
      if (processingTrades.value.get(tradeId)) {
        console.log(`Trade ${tradeId} already being processed`);
        return;
      }
      
      // Prevent processing the same trade repeatedly
      processingTrades.value.set(tradeId, true);
      
      // Optimistic UI update: Add to tradelog immediately before server response
      const optimisticTradelogEntry = {
        id: `optimistic-${tradeId}-${Date.now()}`,
        type: 'side',
        expr: trade.expr || trade.item,
        time: formatTime(currentTime.value),
        price: trade.price,
        action: 'BUY',
        isNew: true,
        optimistic: true,
        timestamp: Date.now()
      };
      
      localSideTrades.value.unshift(optimisticTradelogEntry);
      
      // Disable buttons immediately, with visual feedback
      const tradeEl = document.querySelector(`[data-trade-id="${tradeId}"]`);
      if (tradeEl) {
        const buttons = tradeEl.querySelectorAll('button');
        buttons.forEach(btn => {
          btn.disabled = true;
          btn.classList.add('processing');
        });
      }
      
      // Add notification for the user with immediate feedback
      const notifyId = addNotification(`Processing BUY for ${trade.expr || trade.item}...`, 'processing');
      
      // Start the API call immediately instead of waiting
      attemptTrade();
      
      // Improved timeout and retry functionality
      const maxRetries = 2;
      let retryCount = 0;
      
      function attemptTrade() {
        // Add visual pulse animation to indicate active processing
        if (tradeEl) {
          tradeEl.classList.add('processing-active');
        }
        
        // Call API with a progressive timeout approach
        const submitPromise = submitSideTrade(tradeId, 'b');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Trade request timed out')), 10000)
        );
        
        Promise.race([submitPromise, timeoutPromise])
          .then(() => {
            // Create a confirmed trade entry for profit calculation
            const tradeEntry = {
              id: `side-buy-${tradeId}-${Date.now()}`,
              type: 'side',
              expr: trade.expr || trade.item,
              time: formatTime(currentTime.value),
              price: trade.price,
              action: 'BUY'
            };
            
            // Add to buy trades array for tracking
            buyTrades.value.push(tradeEntry);
            
            // If we're at or past 60 minutes and have the multiplier, recalculate profit
            if (currentTime.value >= 60 && multiplierAt60Minutes.value !== null) {
              calculateProfit();
            }
            
            // Remove processing animation
            if (tradeEl) {
              tradeEl.classList.remove('processing-active');
            }
            
            // Update notification with success
            updateNotification(notifyId, `Successfully bought ${trade.expr || trade.item}`, 'success');
            
            // Show success message
            console.log('Trade executed successfully');
            
            // Clear the processing flag with a slight delay to prevent immediate re-clicks
            setTimeout(() => {
              processingTrades.value.delete(tradeId);
            }, 300);
          })
          .catch(error => {
            console.error('Trade submission error:', error);
            
            // Try again if we haven't exceeded max retries
            if (retryCount < maxRetries) {
              retryCount++;
              updateNotification(notifyId, `Retrying BUY for ${trade.expr || trade.item} (${retryCount}/${maxRetries})...`, 'warning');
              console.log(`Retrying trade (attempt ${retryCount} of ${maxRetries})...`);
              setTimeout(attemptTrade, 1000); // Wait 1 second before retrying
              return;
            }
            
            // Remove optimistic entry on final error
            localSideTrades.value = localSideTrades.value
              .filter(entry => entry.id !== optimisticTradelogEntry.id);
            
            // Re-enable buttons
            if (tradeEl) {
              const buttons = tradeEl.querySelectorAll('button');
              buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('processing');
              });
              tradeEl.classList.remove('processing-active');
            }
            
            // Update notification with error
            updateNotification(notifyId, `Failed to buy ${trade.expr || trade.item}`, 'error');
            
            // Show error to user
            alert(`Trade failed: ${error.message}`);
            
            // Clear the processing flag
            processingTrades.value.delete(tradeId);
          });
      }
    };
    
    const sellTrade = (trade) => {
      if (!trade || (!trade.id && !trade.trade_id)) {
        console.error('Invalid trade:', trade);
        return;
      }
      
      // Get the trade ID
      const tradeId = trade.id || trade.trade_id;
      
      // Check if this trade is already being processed
      if (processingTrades.value.get(tradeId)) {
        console.log(`Trade ${tradeId} already being processed`);
        return;
      }
      
      // Prevent processing the same trade repeatedly
      processingTrades.value.set(tradeId, true);
      
      // Optimistic UI update
      const optimisticTradelogEntry = {
        id: `optimistic-${tradeId}-${Date.now()}`,
        type: 'side',
        expr: trade.expr || trade.item,
        time: formatTime(currentTime.value),
        price: trade.price,
        action: 'SELL',
        isNew: true,
        optimistic: true,
        timestamp: Date.now()
      };
      
      localSideTrades.value.unshift(optimisticTradelogEntry);
      
      // Disable buttons immediately, with visual feedback
      const tradeEl = document.querySelector(`[data-trade-id="${tradeId}"]`);
      if (tradeEl) {
        const buttons = tradeEl.querySelectorAll('button');
        buttons.forEach(btn => {
          btn.disabled = true;
          btn.classList.add('processing');
        });
      }
      
      // Add notification for the user with immediate feedback
      const notifyId = addNotification(`Processing SELL for ${trade.expr || trade.item}...`, 'processing');
      
      // Start the API call immediately instead of waiting
      attemptTrade();
      
      // Improved timeout and retry functionality
      const maxRetries = 2;
      let retryCount = 0;
      
      function attemptTrade() {
        // Add visual pulse animation to indicate active processing
        if (tradeEl) {
          tradeEl.classList.add('processing-active');
        }
        
        // Call API with a progressive timeout approach
        const submitPromise = submitSideTrade(tradeId, 's');
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Trade request timed out')), 10000)
        );
        
        Promise.race([submitPromise, timeoutPromise])
          .then(() => {
            // Create a confirmed trade entry for profit calculation
            const tradeEntry = {
              id: `side-sell-${tradeId}-${Date.now()}`,
              type: 'side',
              expr: trade.expr || trade.item,
              time: formatTime(currentTime.value),
              price: trade.price,
              action: 'SELL'
            };
            
            // Add to sell trades array for tracking
            sellTrades.value.push(tradeEntry);
            
            // If we're at or past 60 minutes and have the multiplier, recalculate profit
            if (currentTime.value >= 60 && multiplierAt60Minutes.value !== null) {
              calculateProfit();
            }
            
            // Remove processing animation
            if (tradeEl) {
              tradeEl.classList.remove('processing-active');
            }
            
            // Update notification with success
            updateNotification(notifyId, `Successfully sold ${trade.expr || trade.item}`, 'success');
            
            // Show success message
            console.log('Trade executed successfully');
            
            // Clear the processing flag with a slight delay to prevent immediate re-clicks
            setTimeout(() => {
              processingTrades.value.delete(tradeId);
            }, 300);
          })
          .catch(error => {
            console.error('Trade submission error:', error);
            
            // Try again if we haven't exceeded max retries
            if (retryCount < maxRetries) {
              retryCount++;
              updateNotification(notifyId, `Retrying SELL for ${trade.expr || trade.item} (${retryCount}/${maxRetries})...`, 'warning');
              console.log(`Retrying trade (attempt ${retryCount} of ${maxRetries})...`);
              setTimeout(attemptTrade, 1000); // Wait 1 second before retrying
              return;
            }
            
            // Remove optimistic entry on final error
            localSideTrades.value = localSideTrades.value
              .filter(entry => entry.id !== optimisticTradelogEntry.id);
            
            // Re-enable buttons
            if (tradeEl) {
              const buttons = tradeEl.querySelectorAll('button');
              buttons.forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('processing');
              });
              tradeEl.classList.remove('processing-active');
            }
            
            // Update notification with error
            updateNotification(notifyId, `Failed to sell ${trade.expr || trade.item}`, 'error');
            
            // Show error to user
            alert(`Trade failed: ${error.message}`);
            
            // Clear the processing flag
            processingTrades.value.delete(tradeId);
          });
      }
    };
    
    // Add these refs for handling notifications
    const notifications = ref([]);
    const notificationId = ref(0);

    // Function to add a notification
    const addNotification = (message, type = 'info') => {
      const id = notificationId.value++;
      
      notifications.value.push({
        id,
        message,
        type,
        timestamp: Date.now()
      });
      
      // Auto remove after a few seconds
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
      
      return id;
    };
    
    // Function to remove a notification
    const removeNotification = (id) => {
      notifications.value = notifications.value.filter(n => n.id !== id);
    };
    
    // Function to update a notification
    const updateNotification = (id, message, type) => {
      const notification = notifications.value.find(n => n.id === id);
      if (notification) {
        notification.message = message;
        if (type) notification.type = type;
        notification.timestamp = Date.now();
      }
    };

    // Updated handleResize function for maximizing chart width
    const handleResize = () => {
      if (window._chartUpdateTimeout) {
        clearTimeout(window._chartUpdateTimeout);
      }
      
      window._chartUpdateTimeout = setTimeout(() => {
        updateChartOptionsForWidth();
      }, 250);
    };

    // Define chart event handler functions
    const handleChartMounted = () => {
      console.log('Chart component mounted');
      // Apply the chart width optimization after mount
      setTimeout(() => {
        updateChartOptionsForWidth();
      }, 100);
    };

    const handleChartUpdated = () => {
      console.log('Chart updated');
      // Re-apply the chart width optimization after update
      setTimeout(() => {
        updateChartOptionsForWidth();
      }, 100);
    };

    const handleChartZoomed = (chartContext, { xaxis, yaxis }) => {
      console.log('Chart zoomed:', { xaxis, yaxis });
    };

    const handleChartSelection = (chartContext, { xaxis, yaxis }) => {
      console.log('Selection made:', { xaxis, yaxis });
    };

    const handleDataPointSelection = (event, chartContext, config) => {
      // Use all parameters to avoid ESLint errors
      const chartId = chartContext?.chart?.id || 'unknown';
      const seriesIndex = config?.seriesIndex;
      const dataPointIndex = config?.dataPointIndex;
      
      console.log('Data point selected in chart:', chartId, {
        seriesIndex,
        dataPointIndex,
        eventType: event?.type
      });
      
      // Access selected data point if available
      if (seriesIndex !== undefined && dataPointIndex !== undefined && chartSeries.value[seriesIndex]) {
        const dataPoint = chartSeries.value[seriesIndex].data[dataPointIndex];
        console.log('Selected data:', dataPoint);
      }
    };
    
    // Create computed properties to check if entries are new
    const isNewestSideTrade = (trade) => {
      if (!trade.timestamp) return false;
      return trade.timestamp >= lastSideTradeTimestamp.value - 5000;
    };

    // Update the second computed property to avoid naming conflict
    const isNewestTradelogEntry = (entry) => {
      if (!entry.timestamp) return false;
      return entry.timestamp >= lastTradelogTimestamp.value - 8000; // Extended window from 5000ms
    };
    
    // Connect to WebSocket server
    const connectWebSocket = () => {
      try {
        // Only connect if we have a session ID
        if (!sessionId.value) {
          console.log('No session ID available, skipping WebSocket connection');
          return;
        }
        
        const socketPath = '/multiplier-simulator';
        
        console.log(`Connecting to WebSocket server at ${SOCKET_URL}${socketPath}`);
        
        // Disconnect any existing connection
        if (socket.value && socket.value.connected) {
          socket.value.disconnect();
        }
        
        // Create new socket connection
        socket.value = io(`${SOCKET_URL}${socketPath}`, {
          transports: ['websocket', 'polling'],
          path: '/socket.io',
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000
        });
        
        // Connection event handlers
        socket.value.on('connect', () => {
          console.log('Connected to WebSocket server');
          socketConnected.value = true;
          socketError.value = null;
          
          // Join the simulation-specific room
          joinSimulationRoom();
          
          // Subscribe to simulation updates
          subscribeToSimulation();
        });
        
        socket.value.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          socketError.value = error.message;
          
          // Fall back to polling after connection errors
          if (usingWebSockets.value) {
            console.log('Falling back to HTTP polling due to WebSocket connection error');
            usingWebSockets.value = false;
            startPolling();
          }
        });
        
        socket.value.on('disconnect', (reason) => {
          console.log('Disconnected from WebSocket server:', reason);
          socketConnected.value = false;
          
          // If disconnected unexpectedly, fallback to polling
          if (reason === 'transport error' || reason === 'transport close') {
            console.log('WebSocket disconnected, falling back to HTTP polling');
            usingWebSockets.value = false;
            startPolling();
          }
        });
        
        // Simulation event handlers
        setupSocketEventHandlers();
      } catch (error) {
        console.error('Error initializing WebSocket connection:', error);
        socketError.value = error.message;
        
        // Fall back to polling
        usingWebSockets.value = false;
        startPolling();
      }
    };
    
    const joinSimulationRoom = () => {
      if (!socket.value || !sessionId.value) return;
      
      const simId = sessionId.value.split(':')[1];
      console.log(`Joining simulation room: ${simId}`);
      socket.value.emit('join-simulation', simId);
    };
    
    const subscribeToSimulation = async () => {
      if (!sessionId.value) return;
      
      try {
        // Subscribe to updates via HTTP endpoint
        const response = await axios.post(`${API_BASE_PATH}/subscribe/${sessionId.value.split(':')[1]}`);
        console.log('Subscribed to simulation updates:', response.data);
        
        // If we received initial data, process it
        if (response.data.data) {
          processSimulationData(response.data.data);
        }
      } catch (error) {
        console.error('Error subscribing to simulation updates:', error);
      }
    };
    
    // Set up event handlers for socket events
    const setupSocketEventHandlers = () => {
      if (!socket.value) return;
      
      // Handle simulation data updates
      socket.value.on('simulation-data-update', (data) => {
        console.log('Received simulation data update via WebSocket:', data.type);
        processSimulationData(data);
      });
      
      // Handle trade submissions
      socket.value.on('trade-submitted', (data) => {
        console.log('Trade submitted via WebSocket:', data);
        
        // Update wallet
        wallet.value = data.wallet;
        
        // Create the confirmed trade entry
        const tradeEntry = {
          id: `${data.trade.type}-${Date.now()}`,
          type: data.trade.type,
          expr: data.trade.type === 'market' ? 'Market Multiplier' : data.trade.expression,
          time: formatTime(data.trade.time),
          price: data.trade.price,
          action: data.trade.action,
          isNew: true,
          timestamp: Date.now()
        };
        
        // Remove optimistic entries
        localSideTrades.value = localSideTrades.value.filter(entry => 
          !entry.optimistic
        );
        
        // Add confirmed entry to tradelog
        localSideTrades.value.unshift(tradeEntry);
        
        // Store in appropriate array for profit calculation
        if (data.trade.action === 'BUY') {
          buyTrades.value.push(tradeEntry);
        } else {
          sellTrades.value.push(tradeEntry);
        }
        
        // If we're at or past 60 minutes and have the multiplier, recalculate profit
        if (currentTime.value >= 60 && multiplierAt60Minutes.value !== null) {
          calculateProfit();
        }
        
        // Mark entries as new
        markNewestEntries();
        
        // Show success message
        addNotification(`Successfully executed ${data.trade.action} for ${data.trade.type === 'market' ? 'Market Multiplier' : data.trade.expression}`, 'success');
      });
      
      // Handle simulation status changes
      socket.value.on('simulation-started', (data) => {
        console.log('Simulation started via WebSocket:', data);
        paused.value = false;
      });
      
      socket.value.on('simulation-paused', (data) => {
        console.log('Simulation paused via WebSocket:', data);
        paused.value = true;
      });
      
      socket.value.on('simulation-resumed', (data) => {
        console.log('Simulation resumed via WebSocket:', data);
        paused.value = false;
      });
    };
    
    // Process simulation data updates from WebSocket or HTTP responses
    const processSimulationData = (data) => {
      if (!data) return;
      
      // Capture previous values for change detection
      const previousTime = currentTime.value;
      const previousPrice = currentPrice.value;
      
      // Update current values
      if (data.current_time !== undefined) {
        currentTime.value = data.current_time;
      }
      
      if (data.current_multiplier !== undefined) {
        currentPrice.value = data.current_multiplier;
        lastMultiplierValue.value = previousPrice;
      }
      
      // If time just hit/passed 60 minutes, capture the multiplier value
      if (previousTime < 60 && currentTime.value >= 60) {
        multiplierAt60Minutes.value = data.current_multiplier;
        console.log('Captured multiplier at 60 minutes:', multiplierAt60Minutes.value);
        calculateProfit();
      }
      
      // Update other state
      if (data.wallet !== undefined) {
        wallet.value = data.wallet;
      }
      
      if (data.collections) {
        collections.value = data.collections;
      }
      
      if (data.initial_data) {
        initialData.value = data.initial_data;
      }
      
      if (data.paused !== undefined) {
        paused.value = data.paused === 1;
      }
      
      // Process historical collections if available
      if (data.historical_collections && data.historical_collections.length > 0) {
        console.log('Processing historical collections from WebSocket:', data.historical_collections.length, 'entries');
        processHistoricalCollections(data.historical_collections);
      } else if (data.collections) {
        // Create consistent timestamps by properly rounding
        const exactTime = Math.round(data.current_time * 2) / 2;
        
        // Update team history with current data (fallback)
        updateTeamHistory({
          // Map oranges/lemons back to oxygen/lithium for frontend compatibility
          A_oxygen: data.collections.A_oranges || 0,
          A_lithium: data.collections.A_lemons || 0,
          B_oxygen: data.collections.B_oranges || 0,
          B_lithium: data.collections.B_lemons || 0
        }, exactTime);
      }
      
      // Capture history updates
      if (data.history && data.history.length > 0) {
        // Update history directly
        history.value = data.history.map(item => ({
          ...item,
          time: Math.round(item.time * 2) / 2 // Normalize time to 0.5 increments
        }));
        
        // Sort history by time
        history.value.sort((a, b) => a.time - b.time);
        
        // Update chart with the properly formatted data
        const prices = [...history.value.map(item => item.multiplier)];
        const times = [...history.value.map(item => formatTime(item.time))];
        
        // Add current data point if needed
        const currentTimeFormatted = formatTime(currentTime.value);
        if (!times.includes(currentTimeFormatted)) {
          times.push(currentTimeFormatted);
          prices.push(currentPrice.value);
        } else {
          // Update existing point
          const currentIndex = times.findIndex(t => t === currentTimeFormatted);
          if (currentIndex !== -1) {
            prices[currentIndex] = currentPrice.value;
          }
        }
        
        // Update chart
        updateChartData(prices, times);
      }
      
      // Handle side trades updates
      if (data.side_trades && !sideTradesFrozen.value) {
        // Find new trades
        const newTrades = data.side_trades.filter(newTrade => 
          !sideTrades.value.some(oldTrade => 
            (oldTrade.id === newTrade.id) || (oldTrade.trade_id === newTrade.id)
          )
        );
        
        // Find trades to keep
        const tradesToKeep = sideTrades.value.filter(oldTrade => 
          data.side_trades.some(newTrade => 
            (newTrade.id === oldTrade.id) || (newTrade.trade_id === oldTrade.id)
          )
        );
        
        // Update trades if there are changes
        if (newTrades.length > 0 || tradesToKeep.length !== sideTrades.value.length) {
          // Mark new trades
          newTrades.forEach(trade => {
            trade.isNew = true;
            trade.timestamp = Date.now();
          });
          
          // Update trades list
          sideTrades.value = [
            ...newTrades,
            ...tradesToKeep
          ];
          
          // Clear "new" status after a delay
          if (newTrades.length > 0) {
            setTimeout(() => {
              sideTrades.value.forEach(trade => {
                if (trade.isNew) trade.isNew = false;
              });
            }, 8000);
          }
        }
      }
      
      // Show quick refresh indicator
      isRefreshing.value = true;
      setTimeout(() => {
        isRefreshing.value = false;
      }, 300); // Shorter duration for frequent updates
      
      // Check if simulation has ended
      if (currentTime.value >= 60 && !paused.value) {
        if (usingWebSockets.value) {
          // Don't stop polling if we're using WebSockets
          // The server will send a final update
        } else {
          stopPolling();
        }
        fetchResults();
      }
    };

    // Enhanced mounted function with immediate start
    onMounted(async () => {
      console.log('QuantSimulator component mounted');
      
      mounted.value = true;
      chartError.value = false;
      
      // Add window resize handler
      window.addEventListener('resize', handleResize);
      
      // Initialize chart with empty data if needed
      if (chartSeries.value[0].data.length === 0) {
        chartSeries.value = [{
          name: 'Market Multiplier',
          data: [{x: '0:00', y: 1.0}]
        }];
      }
      
      // Set up watchers for chart updates with debouncing
      watch(() => currentPrice.value, (newValue, oldValue) => {
        if (newValue !== oldValue && history.value) {
          if (window.chartUpdateTimer) {
            clearTimeout(window.chartUpdateTimer);
          }
          
          window.chartUpdateTimer = setTimeout(() => {
            try {
              console.log(`Multiplier changed: ${oldValue} → ${newValue}`);
              
              const prices = [...history.value.map(item => item.multiplier)];
              const times = [...history.value.map(item => formatTime(item.time))];
              
              const currentTimeFormatted = formatTime(currentTime.value);
              if (!times.includes(currentTimeFormatted)) {
                times.push(currentTimeFormatted);
                prices.push(newValue);
              } else {
                const currentIndex = times.findIndex(t => t === currentTimeFormatted);
                if (currentIndex !== -1) {
                  prices[currentIndex] = newValue;
                }
              }
              
              updateChartData(prices, times);
            } catch (error) {
              console.error('Error updating chart:', error);
            }
          }, 100); // Faster update for chart to match real-time data
        }
        
        if (newValue && chartError.value) {
          setTimeout(() => chartError.value = false, 100);
        }
      });
      
      // Optimize chart display
      setTimeout(() => {
        updateChartOptionsForWidth();
      }, 250);
      
      // Check for saved session ID
      const savedSessionId = localStorage.getItem('simulatorSessionId');
      if (savedSessionId) {
        console.log('Resuming from saved session:', savedSessionId);
        sessionId.value = savedSessionId;
        
        // Connect to WebSockets first
        connectWebSocket();
        
        // Fetch data immediately
        await forceDataRefresh();
        
        // Start polling only if WebSockets fail
        if (!usingWebSockets.value || !socketConnected.value) {
          startPolling();
        }
      } else {
        // Start new simulation
        await startSimulation();
      }
    });

    onUnmounted(() => {
      console.log('QuantSimulator component unmounted');
      
      // Stop interval polling
      stopPolling();
      
      // Disconnect WebSocket
      if (socket.value) {
        console.log('Disconnecting WebSocket');
        socket.value.disconnect();
        socket.value = null;
      }
      
      // Remove resize handler
      window.removeEventListener('resize', handleResize);
      
      // Clear any pending timeouts
      if (window._chartUpdateTimeout) {
        clearTimeout(window._chartUpdateTimeout);
      }
    });

    // Return all required refs and methods for the template
    return {
      // Data from backend
      wallet,
      currentTime,
      currentPrice,
      collections,
      sideTrades,
      sideTradesFrozen, 
      history,
      paused,
      isRefreshing,
      
      // Socket.io status
      socketConnected,
      socketError,
      usingWebSockets,
      
      // UI data
      teamAHistory,
      teamBHistory,
      displayAHistory,
      displayBHistory,
      chartError,
      chartOptions,
      chartSeries,
      
      // For profit calculation
      multiplierAt60Minutes,
      calculatedProfit,
      buyTrades,
      sellTrades,
      
      // Chart handler functions
      handleChartMounted,
      handleChartUpdated,
      handleChartZoomed,
      handleChartSelection,
      handleDataPointSelection,
      
      // Functions
      formatValue,
      formatTime,
      formatProfit,
      submitMarketTrade,
      submitSideTrade,
      togglePause,
      isNewestSideTrade,
      isNewestTradelogEntry,
      forceDataRefresh,
      
      localSideTrades,
      tradeHistory,
      sortedSideTrades,
      mounted,
      tradesExpiringAt60,
      lastSideTradeTimestamp,
      lastTradelogTimestamp,
      
      // Methods
      formatExpiry,
      formatPrice,
      buyTrade,
      sellTrade,
      formatTimeSince,
      calculateProfit,
      
      // Notifications
      notifications,
      addNotification,
      removeNotification,
      updateNotification,
      
      // Math formatter functions
      formatResourceMath,
      formatTradeExpressionMath,
    };
  }
};
</script>
<style scoped>
/* Import Space Grotesk font */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

/* Base styles */
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

/* DATA ROW GRID */
.data-row {
  display: grid;
  grid-template-columns: minmax(300px, 1.2fr) minmax(400px, 1.5fr) minmax(300px, 1.2fr);
  gap: clamp(10px, 2vw, 20px);
  height: clamp(250px, calc(100vh - 500px), 450px);
  margin-top: 5px;
}

/* REFRESH INDICATOR ANIMATION */
.refresh-indicator {
  display: inline-block;
  margin-left: 5px;
  animation: spin 1s linear infinite;
  font-size: 0.7rem;
  opacity: 0.8;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ANIMATIONS */
@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes highlightFade {
  0% { background-color: rgba(219, 234, 254, 0.8); }
  70% { background-color: rgba(219, 234, 254, 0.4); }
  100% { background-color: transparent; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes button-spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes notification-appear {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes tradelog-highlight {
  0% { background-color: rgba(219, 234, 254, 0.8); }
  70% { background-color: rgba(219, 234, 254, 0.3); }
  100% { background-color: transparent; }
}

/* RESOURCE VALUE HIGHLIGHTING ANIMATIONS */
@keyframes resourcePulse {
  0% { 
    background-color: rgba(16, 185, 129, 0.7);
    color: white;
    transform: scale(1.1);
  }
  70% { 
    background-color: rgba(16, 185, 129, 0.4);
    color: #1a1a1a;
  }
  100% { 
    background-color: rgba(16, 185, 129, 0.15);
    transform: scale(1);
  }
}

/* Base highlighting class for both teams */
.resource-increased {
  animation: resourcePulse 2.5s ease-out forwards;
  font-weight: 600;
  position: relative;
  z-index: 5;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
  border-radius: 4px;
}

/* Team-specific highlighting for Astrominers */
.team-panel.astrominers td.resource-increased {
  background-color: rgba(16, 185, 129, 0.15) !important;
  box-shadow: 0 0 8px rgba(79, 70, 229, 0.4);
  position: relative;
}

.team-panel.astrominers td.resource-increased:before {
  content: "↑";
  position: absolute;
  top: 0;
  right: 2px;
  font-size: 0.6rem;
  color: #4f46e5;
  opacity: 0.7;
}

/* Team-specific highlighting for Bioengineers */
.team-panel.bioengineers td.resource-increased {
  background-color: rgba(16, 185, 129, 0.15) !important;
  box-shadow: 0 0 8px rgba(5, 150, 105, 0.4);
  position: relative;
}

.team-panel.bioengineers td.resource-increased:before {
  content: "↑";
  position: absolute;
  top: 0;
  right: 2px;
  font-size: 0.6rem;
  color: #059669;
  opacity: 0.7;
}

/* Add tooltip for increased values */
.team-panel td.resource-increased:hover:after {
  content: "Increased value";
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.6rem;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
}

/* PROCESSING ANIMATION */
.processing {
  opacity: 0.7;
  position: relative;
}

.processing-active {
  animation: pulse 1.2s infinite;
}

/* GLOBAL SCROLLBAR STYLING */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(241, 245, 249, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.7);
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(100, 116, 139, 0.8);
}
/* TEAM PANEL BASE STYLES */
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
  min-height: 123px; /* Ensure minimum height */
  height: auto; /* Allow height to expand with content */
  max-height: 180px; /* Cap the maximum height */
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

/* BIOENGINEERS SPECIFIC STYLES */
.team-panel.bioengineers {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(236, 253, 245, 0.95));
  border-left: 4px solid #059669;
  box-shadow: 
    0 4px 6px -1px rgba(5, 150, 105, 0.1),
    0 2px 4px -1px rgba(5, 150, 105, 0.06),
    inset 0 0 0 1px rgba(236, 253, 245, 0.7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.team-panel.bioengineers:hover {
  box-shadow: 
    0 10px 15px -3px rgba(5, 150, 105, 0.15),
    0 4px 6px -2px rgba(5, 150, 105, 0.1),
    inset 0 0 0 1px rgba(236, 253, 245, 0.9);
  transform: translateY(-1px);
}

.team-panel.bioengineers h2 {
  background: linear-gradient(to right, rgba(236, 253, 245, 0.95), rgba(209, 250, 229, 0.85));
  color: #065f46;
  border-bottom: 1px solid rgba(5, 150, 105, 0.2);
  letter-spacing: 0.03em;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.team-panel.bioengineers h2::before {
  content: "🧬";
  margin-right: 5px;
  font-size: 0.85rem;
  filter: drop-shadow(0 1px 1px rgba(5, 150, 105, 0.2));
}

/* ASTROMINERS SPECIFIC STYLES */
.team-panel.astrominers {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(238, 242, 255, 0.95));
  border-left: 4px solid #4f46e5;
  box-shadow: 
    0 4px 6px -1px rgba(79, 70, 229, 0.1),
    0 2px 4px -1px rgba(79, 70, 229, 0.06),
    inset 0 0 0 1px rgba(238, 242, 255, 0.7);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.team-panel.astrominers:hover {
  box-shadow: 
    0 10px 15px -3px rgba(79, 70, 229, 0.15),
    0 4px 6px -2px rgba(79, 70, 229, 0.1),
    inset 0 0 0 1px rgba(238, 242, 255, 0.9);
  transform: translateY(-1px);
}

.team-panel.astrominers h2 {
  background: linear-gradient(to right, rgba(238, 242, 255, 0.95), rgba(224, 231, 255, 0.85));
  color: #3730a3;
  border-bottom: 1px solid rgba(79, 70, 229, 0.2);
  letter-spacing: 0.03em;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.team-panel.astrominers h2::before {
  content: "🚀";
  margin-right: 5px;
  font-size: 0.85rem;
  filter: drop-shadow(0 1px 1px rgba(79, 70, 229, 0.2));
}
/* TABLE WRAPPER - MAIN CONTAINER FOR TABLE */
.team-panel .table-wrapper {
  flex: 1; /* Take remaining space after header */
  overflow: auto; /* Enable scrolling */
  height: auto;
  max-height: calc(100% - 28px);
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  min-width: 100%;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* BASIC TABLE STYLES */
.team-panel table {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;
  font-size: 0.75rem;
}

/* TABLE HEADER STYLING */
.team-panel thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #F7FAFC;
}

.team-panel th {
  font-weight: 600;
  font-size: 0.7rem;
  color: #1e293b;
  background-color: rgba(248, 250, 252, 0.6);
  z-index: 2;
}

/* TABLE CELL STYLING */
.team-panel th, 
.team-panel td {
  padding: 0.3rem 0.2rem;
  font-size: 0.65rem;
  height: auto; /* Allow height to expand */
  white-space: normal; /* Allow text wrapping */
  overflow: visible !important; /* Show overflow content */
  text-overflow: initial; /* Remove ellipsis */
  box-sizing: border-box !important;
  text-align: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* COLUMN STRUCTURE */
.team-panel colgroup {
  display: table-column-group !important;
}

.team-panel col {
  display: table-column !important;
}

.team-panel col.fixed-col {
  width: 130px !important;
  min-width: 130px !important;
  max-width: 130px !important;
  display: table-column !important;
}

.team-panel col.data-column {
  width: 45px !important;
  min-width: 45px !important;
  max-width: 45px !important;
  display: table-column !important;
}
/* FIXED COLUMN STYLING */
.team-panel .fixed-column {
  width: 130px !important;
  min-width: 130px !important;
  max-width: 130px !important;
  position: sticky !important;
  left: 0 !important;
  background: #f8fafc;
  z-index: 2;
  text-align: left;
  font-weight: 500;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  box-sizing: border-box !important;
  white-space: normal; /* Allow text wrapping */
  overflow: visible !important; /* Show overflow content */
}

/* FIXED COLUMN FOR BIOENGINEERS */
.team-panel.bioengineers .fixed-column {
  background: linear-gradient(to right, rgba(236, 253, 245, 0.98), rgba(236, 253, 245, 0.8));
  border-right: 1px solid rgba(5, 150, 105, 0.1);
}

/* FIXED COLUMN FOR ASTROMINERS */
.team-panel.astrominers .fixed-column {
  background: linear-gradient(to right, rgba(238, 242, 255, 0.98), rgba(238, 242, 255, 0.8));
  border-right: 1px solid rgba(79, 70, 229, 0.1);
}

/* TABLE STRUCTURE */
.team-panel thead, 
.team-panel tbody {
  display: table-row-group !important;
}

.team-panel tr {
  display: table-row !important;
}

.team-panel th,
.team-panel td {
  display: table-cell !important;
  box-sizing: border-box !important;
}

/* DATA CELL WIDTH */
.team-panel td:not(.fixed-column),
.team-panel th:not(.fixed-column) {
  width: 45px !important;
  min-width: 45px !important;
  max-width: 45px !important;
  text-align: center;
  white-space: normal;
  overflow: visible !important;
}

/* HEADER IN FIXED COLUMN */
.team-panel thead th.fixed-column {
  background: #f8fafc;
  z-index: 3; /* Higher than regular cells */
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 4px 0 6px -4px rgba(0, 0, 0, 0.1);
}

/* TEAM SPECIFIC DATA CELLS */
.team-panel.bioengineers td:not(.fixed-column) {
  background-color: rgba(236, 253, 245, 0.3);
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  font-size: 0.7rem;
  color: #065f46;
  white-space: normal;
  overflow: visible !important;
}

.team-panel.bioengineers th:not(.fixed-column) {
  background-color: rgba(236, 253, 245, 0.5);
  color: #065f46;
  font-size: 0.68rem;
}

.team-panel.astrominers td:not(.fixed-column) {
  background-color: rgba(238, 242, 255, 0.3);
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  font-size: 0.7rem;
  color: #3730a3;
  white-space: normal;
  overflow: visible !important;
}

.team-panel.astrominers th:not(.fixed-column) {
  background-color: rgba(238, 242, 255, 0.5);
  color: #3730a3;
  font-size: 0.68rem;
}

/* ROW HOVER EFFECTS */
.team-panel tr:hover td:not(.fixed-column) {
  background-color: rgba(241, 245, 249, 0.5);
}

.team-panel.bioengineers tr:hover td:not(.fixed-column) {
  background-color: rgba(236, 253, 245, 0.5);
}

.team-panel.astrominers tr:hover td:not(.fixed-column) {
  background-color: rgba(238, 242, 255, 0.5);
}

/* MULTIPLIER PANEL */
.multiplier-panel {
  width: 102%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.05),
    0 8px 10px -6px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.multiplier-panel:hover {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.07),
    0 10px 10px -5px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

/* MULTIPLIER PANEL HEADER */
.multiplier-panel h2 {
  background: linear-gradient(to right, #f8fafc, #edf2f7);
  color: #1e40af;
  padding: 5px 10px;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  letter-spacing: 0.01em;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  width: 100%;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
}
.multiplier-panel h2 span {
  margin-left: 10px;
}

/* CHART CONTROLS */
.chart-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  height: 20px;
}

.current-price {
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e40af;
  padding: 4px 8px;
  background: rgba(241, 245, 249, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  align-items: center;
  gap: 4px;
}

.price-label {
  color: #64748b;
  font-weight: 500;
}

.chart-buttons {
  margin-top: 20px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
}

/* BUY/SELL BUTTONS */
.multiplier-panel .buy-btn,
.multiplier-panel .sell-btn {
  padding: 4px 10px;
  font-size: 0.7rem;
  border-radius: 6px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  border: none;
  color: white;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 60px;
  height: 20px;
  line-height: 1;
  text-align: center;
  margin-top: -20px;
  white-space: nowrap;
}

.multiplier-panel .buy-btn {
  background: linear-gradient(135deg, #10b981, #059669);
}

.multiplier-panel .buy-btn:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(5, 150, 105, 0.3);
}

.multiplier-panel .sell-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.multiplier-panel .sell-btn:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);
}

.multiplier-panel .buy-btn:active,
.multiplier-panel .sell-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.multiplier-panel .buy-btn span,
.multiplier-panel .sell-btn span {
  margin: 0;
  padding: 0;
}

/* CHART CONTAINER */
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100% - 28px);
  min-height: 200px;
  overflow: hidden;
  border-radius: 0 0 15px 15px;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* CHART LOADING */
.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.9);
  z-index: 5;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spinner 1s ease-in-out infinite;
  margin-bottom: 10px;
}
/* CHART STYLING */
.chart-container .apexcharts-canvas {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

.chart-container .apexcharts-svg {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  overflow: visible;
}

.chart-container .apexcharts-inner {
  width: 100% !important;
  height: 100% !important;
  overflow: visible;
}

.chart-container .apexcharts-graphical {
  width: 100% !important;
  height: 100% !important;
}

.chart-container .apexcharts-toolbar {
  padding: 0 !important;
  right: 2px !important;
  top: 2px !important;
  z-index: 10 !important;
  background: rgba(255, 255, 255, 0.9) !important;
  border-radius: 4px !important;
}

.chart-container .apexcharts-zoom-icon,
.chart-container .apexcharts-zoomin-icon,
.chart-container .apexcharts-zoomout-icon,
.chart-container .apexcharts-reset-icon,
.chart-container .apexcharts-pan-icon {
  transform: scale(0.9) !important;
  margin: 0 1px !important;
}
.chart-container .apexcharts-plot-area {
  width: 100% !important;
  height: calc(100% - 5px) !important;
  overflow: visible;
}

.chart-container .apexcharts-xaxis,
.chart-container .apexcharts-yaxis {
  transform: translate3d(0, 0, 0) !important;
}

.chart-container .apexcharts-xaxis {
  padding-top: 0 !important;
}

.chart-container .apexcharts-xaxis-texts-g,
.chart-container .apexcharts-yaxis-texts-g {
  transform: translate(0, 0) !important;
}

.chart-container .apexcharts-grid {
  width: 100% !important;
  height: 100% !important;
  overflow: visible;
}

.chart-container .apexcharts-tooltip {
  max-width: 200px !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
}

.chart-container .apexcharts-yaxis-annotations,
.chart-container .apexcharts-xaxis-annotations,
.chart-container .apexcharts-point-annotations {
  overflow: visible;
}

/* CHART VISUAL STYLES */
.chart-container .apexcharts-area-series .apexcharts-area {
  fill-opacity: 0.3 !important;
  filter: drop-shadow(0 4px 6px rgba(59, 130, 246, 0.1)) !important;
}

.chart-container .apexcharts-marker {
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  stroke-width: 2px !important;
}

.chart-container .apexcharts-marker.apexcharts-active {
  transform: scale(1.4) !important;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2) !important;
}

.chart-container .apexcharts-tooltip {
  background: rgba(255, 255, 255, 0.95) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
  border-radius: 8px !important;
  padding: 8px !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(226, 232, 240, 0.8) !important;
}

.chart-container .apexcharts-tooltip-title {
  background: transparent !important;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8) !important;
  font-weight: 600 !important;
  font-size: 0.75rem !important;
  padding: 4px 8px !important;
  margin-bottom: 4px !important;
  color: #1e293b !important;
}
/* TRADES PANEL */
.trades-panel {
  width: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 
    0 10px 25px -5px rgba(0, 0, 0, 0.05),
    0 8px 10px -6px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.trades-panel:hover {
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.07),
    0 10px 10px -5px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

/* TRADES PANEL HEADER */
.trades-panel h2 {
  background: linear-gradient(to right, #f8fafc, #edf2f7);
  color: #1e40af;
  padding: 5px 10px;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  letter-spacing: 0.01em;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  width: 100%;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  top: 0;
  z-index: 30;
}

.trades-panel h2::before {
  content: "↹";
  font-size: 1.2rem;
  color: #3b82f6;
  margin-right: 4px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.pause-indicator {
  font-size: 0.6rem;
  font-weight: 500;
  color: #64748b;
  margin-left: 4px;
  padding: 1px 3px;
  background-color: rgba(241, 245, 249, 0.8);
  border-radius: 3px;
  display: inline-block;
  vertical-align: middle;
  border: 1px solid #e2e8f0;
  box-shadow: none;
}

/* TRADES TABLE CONTAINER */
.trades-panel .table-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  height: calc(100% - 28px);
  position: relative;
  padding: 0;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}
/* TRADES GRID STRUCTURE */
.trades-panel .trades-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100% - 28px);
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
}

.trades-panel .trades-header {
  display: grid;
  grid-template-columns: 38% 20% 17% 25%;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  border-bottom: 1px solid #e2e8f0;
  z-index: 30;
  width: 100%;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  margin-bottom: 2px;
}

.trades-panel .header-cell {
  padding: 8px 12px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trades-panel .trade-row {
  display: grid;
  grid-template-columns: 38% 20% 17% 25%;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  min-height: 60px;
  max-height: none; /* Remove max height limitation */
  height: auto;
  width: 100%;
  overflow: visible; /* Changed from hidden to visible */
  position: relative;
  transition: background-color 0.3s ease, opacity 0.2s ease;
  animation: fadeIn 0.4s ease;
}

.trades-panel .trade-row:nth-child(even) {
  background-color: rgba(248, 250, 252, 0.7);
}

.trades-panel .trade-row:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.9);
}

.trades-panel .trade-row:hover {
  background-color: rgba(241, 245, 249, 0.7);
}

.trades-panel .trade-row.new-entry {
  animation: highlightFade 3s ease-out forwards;
  background-color: rgba(219, 234, 254, 0.5) !important;
}
/* TRADE CELLS */
.trades-panel .item-cell,
.trades-panel .expiration-cell,
.trades-panel .price-cell,
.trades-panel .action-cell {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  font-size: 0.8rem;
}

.trades-panel .item-cell {
  color: #1e40af;
  font-weight: 500;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 4px;
  width: 100%;
  height: auto;
  overflow: visible;
  padding-bottom: 12px; /* Add some padding at the bottom */
}

.trades-panel .item-content {
  word-break: break-word;
  overflow-wrap: break-word;
  max-width: 100%;
  white-space: normal;
  line-height: 1.4;
  /* Remove max-height limitation */
  max-height: none;
  /* Show overflow content */
  overflow: visible;
  /* Remove text ellipsis */
  text-overflow: initial;
  /* Remove webkit line clamp */
  display: block;
}

.trades-panel .expiration-cell,
.trades-panel .price-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.trades-panel .expiration-cell {
  justify-content: center;
  color: #6b7280;
}

.trades-panel .price-cell {
  justify-content: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  color: #059669;
  font-weight: 500;
}

.trades-panel .action-cell {
  display: flex;
  justify-content: center;
  gap: 6px;
  align-items: center;
}

/* TRADES BUTTONS */
.trades-panel .buy-btn,
.trades-panel .sell-btn {
  padding: 4px 10px;
  font-size: 0.75rem;
  min-width: 60px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;
  position: relative;
}

.trades-panel .buy-btn {
  background: #059669;
}

.trades-panel .buy-btn:hover {
  background: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(5, 150, 105, 0.2);
}

.trades-panel .sell-btn {
  background: #dc2626;
}

.trades-panel .sell-btn:hover {
  background: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(220, 38, 38, 0.3);
}

.trades-panel .buy-btn:active,
.trades-panel .sell-btn:active {
  transform: translateY(2px);
  box-shadow: none !important;
}

.trades-panel .buy-btn.processing,
.trades-panel .sell-btn.processing {
  opacity: 0.7;
  cursor: not-allowed;
  padding-left: 25px !important;
}

.trades-panel .buy-btn.processing:before,
.trades-panel .sell-btn.processing:before {
  content: "";
  position: absolute;
  top: 50%;
  left: 10px;
  width: 10px;
  height: 10px;
  margin-top: -5px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: button-spinner 0.8s linear infinite;
}
/* TRADES BADGES & INDICATORS */
.trades-panel .new-badge {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 4px;
  margin-left: 6px;
  display: inline-block;
  vertical-align: top;
  box-shadow: 0 1px 3px rgba(234, 88, 12, 0.3);
  animation: pulse 1.5s infinite;
}

.trades-panel .timestamp-indicator {
  font-size: 0.65rem;
  color: #64748b;
  font-style: italic;
  margin-top: 2px;
  display: block;
}

/* EMPTY STATE */
.trades-panel .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  text-align: center;
  color: #64748b;
}

.trades-panel .empty-state-icon {
  font-size: 2.5rem;
  margin-bottom: 10px;
  opacity: 0.7;
}

.trades-panel .empty-state-text {
  font-size: 0.9rem;
}

/* TRADELOG PANEL */
.tradelog-panel {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  isolation: isolate;
}

.tradelog-panel:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.07), 0 10px 10px -5px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

.tradelog-panel h2 {
  background: linear-gradient(to right, #f8fafc, #edf2f7);
  color: #1e40af;
  padding: 5px 10px;
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  height: 28px;
  letter-spacing: 0.01em;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
  width: 100%;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  top: 0;
  z-index: 30;
}

.tradelog-panel h2::before {
  content: "";
  display: inline-block;
  width: 1px;
  height: 15px;
  margin-right: 6px;
}

.tradelog-panel .table-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: calc(100% - 28px);
  position: relative;
  padding: 0;
}

.tradelog-panel table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.tradelog-panel thead {
  position: sticky;
  top: 0;
  z-index: 10;
  background: #f8fafc;
}

.tradelog-panel th {
  height: 26px;
  padding: 8px 10px;
  font-size: 0.7rem;
  background: linear-gradient(to bottom, #f8fafc, #f1f5f9);
  color: #475569;
  letter-spacing: 0.01em;
  font-weight: 600;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

.tradelog-panel th.item-col {
  width: 40%;
  text-align: left;
}

.tradelog-panel th.time-col {
  width: 20%;
}

.tradelog-panel th.price-col {
  width: 15%;
}

.tradelog-panel th.action-col {
  width: 25%;
}

.tradelog-panel tbody tr {
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  transition: background-color 0.2s ease;
  height: auto;
}

.tradelog-panel tbody tr:hover {
  background-color: rgba(241, 245, 249, 0.7);
}

.tradelog-panel tbody tr:nth-child(even) {
  background-color: rgba(248, 250, 252, 0.7);
}
/* TRADELOG TABLE CELLS */
.tradelog-panel td {
  vertical-align: middle;
  padding: 8px;
  white-space: normal; /* Allow text wrapping */
  overflow: visible; /* Show overflow content */
  text-overflow: initial; /* Remove ellipsis */
}

.tradelog-panel td.item-col {
  text-align: left;
  padding-left: 10px;
  font-weight: 500;
  color: #1e40af;
  max-width: none;
  width: 40%;
  overflow: visible;
}

.tradelog-panel .item-text {
  display: block;
  white-space: normal; /* Allow text to wrap */
  overflow: visible; /* Show overflow content */
  text-overflow: initial; /* Remove ellipsis */
  max-width: 100%;
  font-size: 0.8rem; /* Match font size to trades-panel */
}

.tradelog-panel td.item-col .item-text {
  max-width: 100%;
  display: block; /* Remove webkit box display */
  overflow: visible; /* Show overflow content */
  line-height: 1.4;
  padding: 2px 0;
}

.tradelog-panel td.time-col {
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  font-size: 0.75rem;
  color: #64748b;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}

.tradelog-panel td.price-col {
  text-align: center;
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: #059669;
}

.tradelog-panel td.action-col {
  text-align: center;
  font-weight: 600;
  font-size: 0.75rem;
}

.tradelog-panel .action-buy {
  color: #059669;
  background: rgba(5, 150, 105, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  min-width: 60px;
  text-align: center;
}

.tradelog-panel .action-sell {
  color: #dc2626;
  background: rgba(220, 38, 38, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  min-width: 60px;
  text-align: center;
}

.tradelog-panel .new-badge {
  background: linear-gradient(135deg, #f97316, #ea580c);
  color: white;
  font-size: 0.6rem;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 4px;
  margin-left: 6px;
  display: inline-block;
  vertical-align: top;
  box-shadow: 0 1px 3px rgba(234, 88, 12, 0.3);
  animation: pulse 1.5s infinite;
}

.tradelog-panel tbody tr.new-entry {
  animation: tradelog-highlight 3s ease-out forwards;
}

.tradelog-panel tr.optimistic-entry {
  opacity: 0.8;
  background-color: rgba(243, 244, 246, 0.5) !important;
  font-style: italic;
}

.tradelog-panel tr.optimistic-entry td.time-col:after {
  content: " (pending)";
  font-size: 0.7em;
  opacity: 0.7;
  font-style: italic;
}

.tradelog-panel .empty-trades {
  text-align: center;
  color: #3b82f6;
  font-style: italic;
  padding: 2rem 1rem;
  font-size: 0.9rem;
}
/* BOTTOM CLOCK */
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
  position: relative;
  padding-right: 16px;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  font-family: 'JetBrains Mono', 'SF Mono', 'Roboto Mono', monospace;
  letter-spacing: 0.02em;
  opacity: 0;
  transform: translateX(-20px);
  visibility: hidden;
}

.profit-display.slide-in {
  animation: slideInProfit 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideInProfit {
  0% {
    opacity: 0;
    transform: translateX(-20px);
    visibility: visible;
  }
  100% {
    opacity: 1;
    transform: translateX(0);
    visibility: visible;
  }
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

/* NOTIFICATIONS */
.notifications-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 300px;
  max-width: 90%;
}

.notification {
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  font-weight: 500;
  animation: notification-appear 0.3s ease-out;
}

.notification-close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  padding: 0 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  opacity: 1;
}

.notification-info {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
}

.notification-success {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.notification-error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.notification-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.notification-processing {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
}
/* RESPONSIVE STYLES */
@media (max-width: 1200px) {
  .data-row {
    grid-template-columns: minmax(250px, 1fr) minmax(350px, 1.3fr) minmax(250px, 1fr);
    gap: 10px;
  }
}

@media (max-width: 992px) {
  .data-row {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  
  .tradelog-panel {
    grid-column: span 2;
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
    height: clamp(200px, 35vh, 250px);
    min-height: 200px;
  }
  
  .team-panel {
    height: auto;
    min-height: 150px;
    max-height: 250px;
  }
  
  .chart-container {
    height: 200px;
    min-height: 200px;
  }
  
  .tradelog-panel {
    grid-column: span 1;
  }
  
  .bottom-clock {
    flex-direction: column;
    gap: 8px;
    padding: 10px 16px;
  }
  
  .time-display,
  .profit-display,
  .profit-hidden {
    padding-right: 0;
    border-right: none;
    border-bottom: 1px solid rgba(226, 232, 240, 0.8);
    padding-bottom: 8px;
  }
  
  .tradelog-panel td.item-col {
    max-width: none;
    width: 40%;
    overflow: visible;
    white-space: normal;
  }
  
  .tradelog-panel th,
  .tradelog-panel td {
    padding: 4px 6px;
    font-size: 0.65rem;
  }
  
  .tradelog-panel .action-buy,
  .tradelog-panel .action-sell {
    padding: 3px 6px;
    min-width: 50px;
    font-size: 0.65rem;
  }
  
  /* Ensure tradelog rows adapt to content */
  .tradelog-panel tbody tr {
    height: auto;
    min-height: 30px;
  }
  
  /* Allow trades panel rows to expand */
  .trades-panel .trade-row {
    min-height: 60px;
    max-height: none;
    height: auto;
  }
}

@media (max-width: 576px) {
  .grid-container {
    padding: 0 8px;
  }
  
  .team-panel {
    height: auto;
    max-height: 200px;
  }
  
  .team-panel h2,
  .multiplier-panel h2,
  .trades-panel h2,
  .tradelog-panel h2 {
    font-size: 0.55rem;
    padding: 0.5rem 0.75rem;
  }
  
  .team-panel td,
  .team-panel th {
    padding: 0.15rem;
    font-size: 0.6rem;
  }
  
  .team-panel .fixed-column {
    width: 100px !important;
    min-width: 100px !important;
    max-width: 100px !important;
  }
  
  .buy-btn, .sell-btn {
    padding: 4px 10px;
    font-size: 0.65rem;
  }
  
  .control-button {
    padding: 4px 12px;
    font-size: 0.75rem;
  }
  
  .chart-container {
    height: 180px;
    min-height: 180px;
  }
  
  .tradelog-panel td.item-col {
    max-width: 100px;
  }
  
  .tradelog-panel th,
  .tradelog-panel td {
    padding: 3px 4px;
    font-size: 0.6rem;
  }
  
  .tradelog-panel .action-buy,
  .tradelog-panel .action-sell {
    padding: 2px 4px;
    min-width: 40px;
    font-size: 0.6rem;
  }
}

/* Fix hover states to maintain visibility */
.team-panel tr:hover td:not(.fixed-column),
.team-panel.bioengineers tr:hover td:not(.fixed-column),
.team-panel.astrominers tr:hover td:not(.fixed-column) {
  background-color: rgba(241, 245, 249, 0.5);
  overflow: visible !important;
}

/* Fix for webkit browsers that might have rendering issues */
@supports (-webkit-appearance:none) {
  .trades-panel .item-content,
  .tradelog-panel .item-text,
  .team-panel td,
  .team-panel th {
    -webkit-line-clamp: unset;
    display: block;
    overflow: visible !important;
  }
}

/* Fix for Firefox */
@-moz-document url-prefix() {
  .team-panel td,
  .team-panel th,
  .trades-panel .item-content,
  .tradelog-panel .item-text {
    overflow: visible !important;
    white-space: normal;
  }
}

/* Button optimizations */
.buy-btn, .sell-btn {
  /* Add hardware acceleration to reduce lag */
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
  transition: background-color 0.15s ease-out, transform 0.15s ease-out;
}

.buy-btn:active, .sell-btn:active {
  /* Reduce scale instead of complex visual effects */
  transform: scale(0.95);
}

.processing {
  /* Minimize repaint by only animating opacity */
  opacity: 0.7;
  pointer-events: none;
}

/* Optimize animation performance */
@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 0.9; }
  100% { opacity: 0.7; }
}

.processing-active {
  animation: pulse 1.5s infinite ease-in-out;
  will-change: opacity;
}
</style>