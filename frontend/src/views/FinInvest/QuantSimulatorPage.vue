<template>
  <div class="hft-trading-interface">
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
    
    <div class="trading-grid">
      <!-- Market Data Panel -->
      <div class="market-panel">
        <h2>
          <span>📈 Market Data</span>
          <div class="market-status">
            <span class="market-indicator" :class="{'market-open': marketOpen}">
              {{ marketOpen ? 'OPEN' : 'CLOSED' }}
            </span>
            <span class="latency-indicator">
              Latency: {{ currentLatency }}μs
            </span>
          </div>
        </h2>
        <div class="table-wrapper">
          <table class="market-data-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Bid</th>
                <th>Ask</th>
                <th>Last</th>
                <th>Change</th>
                <th>Volume</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stock in marketData" :key="stock.symbol" 
                  :class="{'price-up': stock.isUp, 'price-down': stock.isDown}">
                <td class="symbol">{{ stock.symbol }}</td>
                <td class="bid">${{ stock.bid.toFixed(2) }}</td>
                <td class="ask">${{ stock.ask.toFixed(2) }}</td>
                <td class="price">${{ stock.price.toFixed(2) }}</td>
                <td class="change" :class="{'positive': stock.change >= 0, 'negative': stock.change < 0}">
                  {{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%
                </td>
                <td class="volume">{{ formatVolume(stock.volume) }}</td>
                <td class="time">{{ formatTime(stock.lastUpdate) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Order Book Panel -->
      <div class="orderbook-panel">
        <h2>
          <span>📊 Order Book</span>
          <select v-model="selectedOrderBookSymbol" class="symbol-selector">
            <option v-for="stock in marketData" :key="stock.symbol" :value="stock.symbol">
              {{ stock.symbol }}
            </option>
          </select>
        </h2>
        <div class="orderbook-container">
          <div class="orderbook-side asks">
            <div class="orderbook-header">
              <span>Size</span>
              <span>Price</span>
            </div>
            <div v-for="(level, index) in orderBookData.asks" :key="`ask-${index}`" 
                 class="orderbook-level ask-level">
              <span class="size">{{ level.size }}</span>
              <span class="price">${{ level.price.toFixed(2) }}</span>
            </div>
          </div>
          <div class="spread-indicator">
            <span>Spread: ${{ currentSpread.toFixed(3) }}</span>
          </div>
          <div class="orderbook-side bids">
            <div class="orderbook-header">
              <span>Size</span>
              <span>Price</span>
            </div>
            <div v-for="(level, index) in orderBookData.bids" :key="`bid-${index}`" 
                 class="orderbook-level bid-level">
              <span class="size">{{ level.size }}</span>
              <span class="price">${{ level.price.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trading Algorithm Panel -->
      <div class="algorithm-panel">
        <h2>
          <span>🤖 Trading Algorithms</span>
          <div class="algo-controls">
            <button class="start-btn" @click="toggleAlgorithms" :disabled="!marketOpen">
              {{ algorithmsRunning ? 'Stop' : 'Start' }} Algos
            </button>
          </div>
        </h2>
        <div class="algorithm-list">
          <div v-for="algo in algorithms" :key="algo.id" 
               :class="['algo-item', {'algo-active': algo.active}]">
            <div class="algo-info">
              <span class="algo-name">{{ algo.name }}</span>
              <span class="algo-strategy">{{ algo.strategy }}</span>
              <span class="algo-sharpe">Sharpe: {{ algo.sharpeRatio }}</span>
            </div>
            <div class="algo-performance">
              <span class="algo-pnl" :class="{'positive': algo.pnl >= 0, 'negative': algo.pnl < 0}">
                {{ algo.pnl >= 0 ? '+' : '' }}${{ algo.pnl.toFixed(2) }}
              </span>
              <span class="algo-trades">{{ algo.trades }} trades</span>
              <span class="algo-winrate">{{ algo.winRate }}% win</span>
            </div>
            <div class="algo-status">
              <span class="status-indicator" :class="{'active': algo.active}"></span>
              <span class="algo-latency">{{ algo.avgLatency }}μs</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Chart Panel -->
      <div class="chart-panel">
        <h2>
          <span>📊 Real-time Price Chart</span>
          <div class="chart-controls">
            <select v-model="selectedSymbol" @change="updateChart">
              <option v-for="stock in marketData" :key="stock.symbol" :value="stock.symbol">
                {{ stock.symbol }}
              </option>
            </select>
            <div class="current-price">
              ${{ getCurrentPrice(selectedSymbol) }}
            </div>
          </div>
        </h2>
        <div class="chart-container">
          <apexchart
            v-if="mounted && chartOptions"
            type="line"
            height="100%"
            :options="chartOptions"
            :series="chartSeries"
          ></apexchart>
          <div v-else class="chart-loading">
            <div class="loading-spinner"></div>
            Loading chart...
          </div>
        </div>
      </div>

      <!-- Active Orders Panel -->
      <div class="orders-panel">
        <h2>
          <span>📋 Active Orders</span>
          <span class="order-count">{{ activeOrders.length }}</span>
        </h2>
        <div class="orders-container">
          <div v-if="activeOrders.length > 0" class="orders-list">
            <div v-for="order in activeOrders" :key="order.id" 
                 :class="['order-item', `order-${order.side}`]">
              <div class="order-info">
                <span class="order-symbol">{{ order.symbol }}</span>
                <span class="order-type">{{ order.type }}</span>
                <span class="order-side">{{ order.side.toUpperCase() }}</span>
              </div>
              <div class="order-details">
                <span class="order-quantity">{{ order.quantity }}</span>
                <span class="order-price">${{ order.price.toFixed(2) }}</span>
              </div>
              <div class="order-time">
                {{ formatOrderTime(order.timestamp) }}
              </div>
              <button class="cancel-btn" @click="cancelOrder(order.id)">Cancel</button>
            </div>
          </div>
          <div v-else class="empty-orders">
            <div class="empty-icon">📝</div>
            <div class="empty-text">No active orders</div>
          </div>
        </div>
      </div>

      <!-- Trade Feed Panel -->
      <div class="trade-feed-panel">
        <h2>
          <span>💹 Live Trade Feed</span>
          <span v-if="!marketOpen" class="market-closed-indicator">(Market Closed)</span>
        </h2>
        <div class="trade-feed">
          <div v-for="trade in recentTrades" :key="trade.id" 
               :class="['trade-item', `trade-${trade.side}`, {'trade-new': trade.isNew}]">
            <div class="trade-symbol">{{ trade.symbol }}</div>
            <div class="trade-side">{{ trade.side.toUpperCase() }}</div>
            <div class="trade-quantity">{{ trade.quantity }}</div>
            <div class="trade-price">${{ trade.price.toFixed(2) }}</div>
            <div class="trade-time">{{ formatTradeTime(trade.timestamp) }}</div>
          </div>
        </div>
      </div>

      <!-- Portfolio Summary Panel -->
      <div class="portfolio-panel">
        <h2>📊 Portfolio Summary</h2>
        <div class="portfolio-stats">
          <div class="stat-item">
            <span class="stat-label">Total Value</span>
            <span class="stat-value">${{ portfolioValue.toFixed(2) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Cash Balance</span>
            <span class="stat-value">${{ cashBalance.toFixed(2) }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">P&L Today</span>
            <span class="stat-value" :class="{'positive': dailyPnL >= 0, 'negative': dailyPnL < 0}">
              {{ dailyPnL >= 0 ? '+' : '' }}${{ dailyPnL.toFixed(2) }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Positions</span>
            <span class="stat-value">{{ activePositions }}</span>
          </div>
        </div>
      </div>

      <!-- Market Clock -->
      <div class="market-clock">
        <div class="time-display">
          <span class="current-time">{{ currentTime }}</span>
          <span class="market-session">{{ marketSession }}</span>
        </div>
        <div class="trading-stats">
          <span class="trades-count">Trades: {{ totalTradesToday }}</span>
          <span class="volume-count">Volume: {{ formatVolume(totalVolumeToday) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

export default {
  name: 'QuantSimulatorPage',
  components: {
    apexchart: VueApexCharts
  },
  setup() {
    // Reactive state
    const mounted = ref(false)
    const notifications = ref([])
    const marketOpen = ref(true)
    const algorithmsRunning = ref(false)
    const selectedSymbol = ref('AAPL')
    const selectedOrderBookSymbol = ref('AAPL')
    const currentLatency = ref(125)
    
    // Market data with bid/ask spreads
    const marketData = ref([
      { 
        symbol: 'AAPL', 
        price: 185.25, 
        bid: 185.23, 
        ask: 185.27, 
        change: 0.85, 
        volume: 12500000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      },
      { 
        symbol: 'GOOGL', 
        price: 2750.80, 
        bid: 2750.75, 
        ask: 2750.85, 
        change: -0.42, 
        volume: 8500000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      },
      { 
        symbol: 'MSFT', 
        price: 338.15, 
        bid: 338.12, 
        ask: 338.18, 
        change: 1.25, 
        volume: 15200000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      },
      { 
        symbol: 'TSLA', 
        price: 245.60, 
        bid: 245.55, 
        ask: 245.65, 
        change: -2.15, 
        volume: 25800000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      },
      { 
        symbol: 'AMZN', 
        price: 145.30, 
        bid: 145.28, 
        ask: 145.32, 
        change: 0.75, 
        volume: 18900000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      },
      { 
        symbol: 'NVDA', 
        price: 875.45, 
        bid: 875.40, 
        ask: 875.50, 
        change: 3.20, 
        volume: 32100000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      },
      { 
        symbol: 'META', 
        price: 315.80, 
        bid: 315.77, 
        ask: 315.83, 
        change: -1.85, 
        volume: 14600000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      },
      { 
        symbol: 'NFLX', 
        price: 425.75, 
        bid: 425.72, 
        ask: 425.78, 
        change: 0.95, 
        volume: 9800000, 
        lastUpdate: Date.now(), 
        isUp: false, 
        isDown: false 
      }
    ])

    // Enhanced trading algorithms with more metrics
    const algorithms = ref([
      { 
        id: 1, 
        name: 'Momentum Scalper', 
        strategy: 'Mean Reversion', 
        active: false, 
        pnl: 1250.80, 
        trades: 145, 
        sharpeRatio: '2.34',
        winRate: 67,
        avgLatency: 85
      },
      { 
        id: 2, 
        name: 'Arbitrage Bot', 
        strategy: 'Statistical Arbitrage', 
        active: false, 
        pnl: 875.20, 
        trades: 89, 
        sharpeRatio: '1.89',
        winRate: 72,
        avgLatency: 92
      },
      { 
        id: 3, 
        name: 'Market Maker', 
        strategy: 'Market Making', 
        active: false, 
        pnl: -125.45, 
        trades: 267, 
        sharpeRatio: '0.45',
        winRate: 48,
        avgLatency: 78
      },
      { 
        id: 4, 
        name: 'Trend Follower', 
        strategy: 'Momentum', 
        active: false, 
        pnl: 2340.15, 
        trades: 76, 
        sharpeRatio: '3.12',
        winRate: 81,
        avgLatency: 105
      },
      { 
        id: 5, 
        name: 'News Trader', 
        strategy: 'Event Driven', 
        active: false, 
        pnl: 450.60, 
        trades: 23, 
        sharpeRatio: '1.67',
        winRate: 65,
        avgLatency: 150
      }
    ])

    // Active orders
    const activeOrders = ref([])
    
    // Recent trades
    const recentTrades = ref([])
    
    // Portfolio data
    const portfolioValue = ref(125000.00)
    const cashBalance = ref(45000.00)
    const dailyPnL = ref(850.25)
    const activePositions = ref(8)
    const totalTradesToday = ref(1247)
    const totalVolumeToday = ref(156780000)

    // Chart data
    const chartOptions = ref(null)
    const chartSeries = ref([])
    const priceHistory = ref({})

    // Time and market session
    const currentTime = ref('')
    const marketSession = ref('Regular Hours')

    // Intervals
    let priceUpdateInterval = null
    let tradeGenerationInterval = null
    let timeUpdateInterval = null
    let chartUpdateInterval = null

    // Order book data
    const orderBookData = ref({
      bids: [],
      asks: []
    })

    // Computed properties
    const currentSpread = computed(() => {
      const stock = marketData.value.find(s => s.symbol === selectedOrderBookSymbol.value)
      return stock ? stock.ask - stock.bid : 0
    })

    // Utility functions
    const formatVolume = (volume) => {
      if (volume >= 1000000) {
        return (volume / 1000000).toFixed(1) + 'M'
      }
      return (volume / 1000).toFixed(0) + 'K'
    }

    const formatTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    }

    const formatOrderTime = (timestamp) => {
      return new Date(timestamp).toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }

    const formatTradeTime = (timestamp) => {
      const now = Date.now()
      const diff = now - timestamp
      if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
      return formatTime(timestamp)
    }

    const getCurrentPrice = (symbol) => {
      const stock = marketData.value.find(s => s.symbol === symbol)
      return stock ? stock.price.toFixed(2) : '0.00'
    }

    // Generate realistic price movements
    const updatePrices = () => {
      if (!marketOpen.value) return

      marketData.value.forEach(stock => {
        const volatility = 0.002 // 0.2% base volatility
        const randomChange = (Math.random() - 0.5) * 2 * volatility
        const oldPrice = stock.price
        
        stock.price = Math.max(0.01, stock.price * (1 + randomChange))
        
        // Update bid/ask with realistic spreads
        const baseSpread = stock.price * 0.0001 // 0.01% spread
        const spreadVariation = baseSpread * (0.5 + Math.random())
        stock.bid = stock.price - spreadVariation / 2
        stock.ask = stock.price + spreadVariation / 2
        
        stock.change = ((stock.price - oldPrice) / oldPrice) * 100
        stock.volume += Math.floor(Math.random() * 100000)
        stock.lastUpdate = Date.now()
        
        // Visual indicators
        stock.isUp = stock.change > 0
        stock.isDown = stock.change < 0
        
        // Reset indicators after animation
        setTimeout(() => {
          stock.isUp = false
          stock.isDown = false
        }, 1000)

        // Update price history for charts
        if (!priceHistory.value[stock.symbol]) {
          priceHistory.value[stock.symbol] = []
        }
        priceHistory.value[stock.symbol].push({
          x: Date.now(),
          y: stock.price
        })
        
        // Keep only last 100 points
        if (priceHistory.value[stock.symbol].length > 100) {
          priceHistory.value[stock.symbol].shift()
        }
      })
    }

    // Update latency simulation
    const updateLatency = () => {
      // Simulate network latency fluctuations (50-300 microseconds)
      const baseLatency = 125
      const variation = (Math.random() - 0.5) * 100
      currentLatency.value = Math.max(50, Math.min(300, Math.round(baseLatency + variation)))
      
      // Update algorithm latencies
      algorithms.value.forEach(algo => {
        const algoVariation = (Math.random() - 0.5) * 50
        algo.avgLatency = Math.max(50, Math.min(200, algo.avgLatency + algoVariation))
      })
    }

    // Generate order book data
    const generateOrderBook = () => {
      const stock = marketData.value.find(s => s.symbol === selectedOrderBookSymbol.value)
      if (!stock) return

      const bids = []
      const asks = []
      const levels = 10

      // Generate bid levels (below current bid)
      for (let i = 0; i < levels; i++) {
        const priceOffset = (i + 1) * 0.01
        const price = stock.bid - priceOffset
        const size = Math.floor(Math.random() * 1000) + 100
        bids.push({ price, size })
      }

      // Generate ask levels (above current ask)
      for (let i = 0; i < levels; i++) {
        const priceOffset = (i + 1) * 0.01
        const price = stock.ask + priceOffset
        const size = Math.floor(Math.random() * 1000) + 100
        asks.push({ price, size })
      }

      orderBookData.value = {
        bids: bids.sort((a, b) => b.price - a.price), // Highest bid first
        asks: asks.sort((a, b) => a.price - b.price)  // Lowest ask first
      }
    }

    // Generate trading activity
    const generateTrade = () => {
      if (!marketOpen.value) return

      const symbols = marketData.value.map(s => s.symbol)
      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      const stock = marketData.value.find(s => s.symbol === symbol)
      const side = Math.random() > 0.5 ? 'buy' : 'sell'
      const quantity = Math.floor(Math.random() * 1000) + 100
      const priceVariation = (Math.random() - 0.5) * 0.01 // ±1% price variation
      const price = stock.price * (1 + priceVariation)

      const trade = {
        id: Date.now() + Math.random(),
        symbol,
        side,
        quantity,
        price,
        timestamp: Date.now(),
        isNew: true
      }

      recentTrades.value.unshift(trade)
      
      // Remove new indicator after 2 seconds
      setTimeout(() => {
        trade.isNew = false
      }, 2000)

      // Keep only last 50 trades
      if (recentTrades.value.length > 50) {
        recentTrades.value.pop()
      }

      // Update stats
      totalTradesToday.value++
      totalVolumeToday.value += quantity
    }

    // Generate orders
    const generateOrder = () => {
      if (!marketOpen.value || activeOrders.value.length >= 10) return

      const symbols = marketData.value.map(s => s.symbol)
      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      const stock = marketData.value.find(s => s.symbol === symbol)
      const side = Math.random() > 0.5 ? 'buy' : 'sell'
      const quantity = Math.floor(Math.random() * 500) + 50
      const priceOffset = side === 'buy' ? -0.005 : 0.005 // Buy below, sell above market
      const price = stock.price * (1 + priceOffset)

      const order = {
        id: Date.now() + Math.random(),
        symbol,
        side,
        type: 'Limit',
        quantity,
        price,
        timestamp: Date.now()
      }

      activeOrders.value.push(order)

      // Auto-cancel some orders after random time
      setTimeout(() => {
        const index = activeOrders.value.findIndex(o => o.id === order.id)
        if (index !== -1) {
          activeOrders.value.splice(index, 1)
        }
      }, Math.random() * 30000 + 10000) // 10-40 seconds
    }

    // Initialize chart
    const initChart = () => {
      chartOptions.value = {
        chart: {
          type: 'line',
          height: '100%',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        colors: ['#000000'],
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'HH:mm:ss'
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => '$' + value.toFixed(2)
          }
        },
        tooltip: {
          x: {
            format: 'HH:mm:ss'
          },
          y: {
            formatter: (value) => '$' + value.toFixed(2)
          }
        },
        grid: {
          strokeDashArray: 3
        }
      }
      
      updateChart()
    }

    const updateChart = () => {
      const symbol = selectedSymbol.value
      const data = priceHistory.value[symbol] || []
      
      chartSeries.value = [{
        name: symbol,
        data: data
      }]
    }

    // Control functions
    const toggleAlgorithms = () => {
      algorithmsRunning.value = !algorithmsRunning.value
      algorithms.value.forEach(algo => {
        algo.active = algorithmsRunning.value
      })
      
      if (algorithmsRunning.value) {
        addNotification('Algorithms started', 'success')
      } else {
        addNotification('Algorithms stopped', 'info')
      }
    }

    const cancelOrder = (orderId) => {
      const index = activeOrders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        activeOrders.value.splice(index, 1)
        addNotification('Order cancelled', 'info')
      }
    }

    const addNotification = (message, type = 'info') => {
      const notification = {
        id: Date.now() + Math.random(),
        message,
        type
      }
      notifications.value.push(notification)
      
      setTimeout(() => {
        removeNotification(notification.id)
      }, 5000)
    }

    const removeNotification = (id) => {
      const index = notifications.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notifications.value.splice(index, 1)
      }
    }

    const updateTime = () => {
      const now = new Date()
      currentTime.value = now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
      
      const hour = now.getHours()
      if (hour >= 9 && hour < 16) {
        marketSession.value = 'Regular Hours'
        marketOpen.value = true
      } else if ((hour >= 16 && hour < 20) || (hour >= 4 && hour < 9)) {
        marketSession.value = 'Extended Hours'
        marketOpen.value = true
      } else {
        marketSession.value = 'Market Closed'
        marketOpen.value = false
      }
    }

    // Lifecycle
    onMounted(async () => {
      await nextTick()
      mounted.value = true
      
      // Initialize price history
      marketData.value.forEach(stock => {
        priceHistory.value[stock.symbol] = []
        for (let i = 0; i < 20; i++) {
          priceHistory.value[stock.symbol].push({
            x: Date.now() - (20 - i) * 1000,
            y: stock.price * (1 + (Math.random() - 0.5) * 0.02)
          })
        }
      })
      
      initChart()
      updateTime()
      generateOrderBook()
      
      // Start intervals
      priceUpdateInterval = setInterval(updatePrices, 1000)
      tradeGenerationInterval = setInterval(generateTrade, 500)
      timeUpdateInterval = setInterval(updateTime, 1000)
      chartUpdateInterval = setInterval(updateChart, 2000)
      
      // New intervals for enhanced features
      setInterval(updateLatency, 250) // Update latency every 250ms
      setInterval(generateOrderBook, 1500) // Update order book every 1.5s
      
      // Generate some initial orders
      setTimeout(() => generateOrder(), 2000)
      setInterval(generateOrder, 8000)
      
      addNotification('HFT Simulator initialized', 'success')
    })

    onUnmounted(() => {
      if (priceUpdateInterval) clearInterval(priceUpdateInterval)
      if (tradeGenerationInterval) clearInterval(tradeGenerationInterval)
      if (timeUpdateInterval) clearInterval(timeUpdateInterval)
      if (chartUpdateInterval) clearInterval(chartUpdateInterval)
    })

    // Watch for symbol changes
    watch(selectedSymbol, () => {
      updateChart()
    })
    
    // Watch for order book symbol changes
    watch(selectedOrderBookSymbol, () => {
      generateOrderBook()
    })

    return {
      // State
      mounted,
      notifications,
      marketOpen,
      algorithmsRunning,
      selectedSymbol,
      selectedOrderBookSymbol,
      currentLatency,
      marketData,
      algorithms,
      activeOrders,
      recentTrades,
      portfolioValue,
      cashBalance,
      dailyPnL,
      activePositions,
      totalTradesToday,
      totalVolumeToday,
      chartOptions,
      chartSeries,
      currentTime,
      marketSession,
      orderBookData,
      currentSpread,
      
      // Methods
      formatVolume,
      formatTime,
      formatOrderTime,
      formatTradeTime,
      getCurrentPrice,
      toggleAlgorithms,
      cancelOrder,
      removeNotification,
      updateChart
    }
  }
}
</script>

<style scoped>
.hft-trading-interface {
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
  padding: 1rem;
  color: #e0e0e0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.notifications-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 300px;
}

.notification {
  background: rgba(30, 30, 30, 0.95);
  color: #e0e0e0;
  border: 1px solid #444;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.375rem;
  border-left: 4px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.notification-success { border-left-color: #10b981; }
.notification-error { border-left-color: #ef4444; }
.notification-info { border-left-color: #3b82f6; }

.notification-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 1rem;
}

.trading-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto auto;
  gap: 1rem;
  max-width: 1600px;
  margin: 0 auto;
}

.market-panel {
  grid-column: span 3;
}

.orderbook-panel {
  grid-column: span 1;
}

.algorithm-panel {
  grid-column: span 2;
}

.chart-panel {
  grid-column: span 2;
}

.orders-panel {
  grid-column: span 1;
}

.trade-feed-panel {
  grid-column: span 2;
}

.portfolio-panel,
.market-clock {
  grid-column: span 1;
}

.market-panel,
.algorithm-panel,
.chart-panel,
.orders-panel,
.trade-feed-panel,
.portfolio-panel,
.market-clock,
.orderbook-panel {
  background: rgba(10, 10, 10, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.market-panel h2,
.algorithm-panel h2,
.chart-panel h2,
.orders-panel h2,
.trade-feed-panel h2,
.portfolio-panel h2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f0f0f0;
}

.market-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.market-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.market-status-indicator.closed {
  background: #ef4444;
}

.latency-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #9ca3af;
}

.latency-value {
  font-weight: 600;
  color: #e0e0e0;
}

.market-data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.stock-ticker {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.stock-ticker:hover {
  background: #f1f5f9;
  border-color: #000000;
  transform: translateY(-2px);
}

.stock-ticker.flash-up {
  background: #dcfce7;
  border-color: #16a34a;
}

.stock-ticker.flash-down {
  background: #fef2f2;
  border-color: #dc2626;
}

.ticker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.ticker-symbol {
  font-weight: 700;
  font-size: 0.9rem;
  color: #000000;
}

.ticker-price {
  font-weight: 600;
  font-size: 1rem;
  color: #000000;
}

.ticker-change {
  font-size: 0.8rem;
  font-weight: 500;
}

.ticker-change.positive {
  color: #16a34a;
}

.ticker-change.negative {
  color: #dc2626;
}

.ticker-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666666;
}

.orderbook-container {
  max-height: 400px;
  overflow-y: auto;
}

.orderbook-side {
  margin-bottom: 1rem;
}

.orderbook-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0.5rem;
  background: #222;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.8rem;
  color: #e0e0e0;
}

.orderbook-level {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  border-radius: 0.25rem;
  transition: background 0.2s ease;
}

.orderbook-level:hover {
  background: #333;
}

.ask-level {
  color: #dc2626;
}

.bid-level {
  color: #16a34a;
}

.spread-indicator {
  text-align: center;
  padding: 0.5rem;
  background: #222;
  border: 1px solid #444;
  border-radius: 0.25rem;
  margin: 0.5rem 0;
  font-weight: 600;
  color: #e0e0e0;
}

.symbol-selector {
  background: #111;
  border: 1px solid #444;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  color: #e0e0e0;
}

.algo-controls {
  display: flex;
  gap: 0.5rem;
}

.start-btn {
  background: #e0e0e0;
  color: #111;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-btn:hover:not(:disabled) {
  background: #fff;
  transform: translateY(-1px);
}

.start-btn:disabled {
  background: #444;
  color: #888;
  cursor: not-allowed;
}

.algorithm-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.algo-item {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  gap: 1rem;
  padding: 0.75rem;
  background: #222;
  border: 1px solid #444;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.algo-item:hover {
  background: #333;
  border-color: #e0e0e0;
}

.algo-item.algo-active {
  background: rgba(16, 185, 129, 0.1);
  border-color: #16a34a;
}

.algo-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.algo-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #e0e0e0;
}

.algo-strategy,
.algo-sharpe {
  font-size: 0.8rem;
  color: #9ca3af;
}

.algo-performance {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: flex-end;
}

.algo-pnl {
  font-weight: 600;
  font-size: 0.9rem;
}

.algo-pnl.positive {
  color: #16a34a;
}

.algo-pnl.negative {
  color: #dc2626;
}

.algo-trades,
.algo-winrate {
  font-size: 0.8rem;
  color: #9ca3af;
}

.algo-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
}

.status-indicator.active {
  background: #16a34a;
}

.algo-latency {
  font-size: 0.7rem;
  color: #9ca3af;
}

.chart-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.current-price {
  font-weight: 700;
  font-size: 1.2rem;
  color: #e0e0e0;
}

.chart-container {
  height: 300px;
  width: 100%;
  background: #111;
  border-radius: 0.5rem;
  overflow: hidden;
}

.chart-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #9ca3af;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #444;
  border-top: 3px solid #e0e0e0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.orders-list {
  max-height: 300px;
  overflow-y: auto;
}

.order-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #444;
  font-size: 0.8rem;
  align-items: center;
}

.order-item:last-child {
  border-bottom: none;
}

.order-side.buy {
  color: #16a34a;
  font-weight: 600;
}

.order-side.sell {
  color: #dc2626;
  font-weight: 600;
}

.cancel-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cancel-btn:hover {
  background: #dc2626;
}

.trade-feed {
  max-height: 300px;
  overflow-y: auto;
}

.trade-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 0.5rem;
  padding: 0.5rem;
  border-bottom: 1px solid #444;
  font-size: 0.8rem;
  transition: background 0.3s ease;
}

.trade-item:last-child {
  border-bottom: none;
}

.trade-item.trade-new {
  background: rgba(254, 243, 199, 0.1);
  animation: fadeToNormalDark 2s ease-out forwards;
}

@keyframes fadeToNormalDark {
  0% { background: rgba(254, 243, 199, 0.1); }
  100% { background: transparent; }
}

.trade-side {
  font-weight: 600;
}

.trade-buy {
  color: #16a34a;
}

.trade-sell {
  color: #dc2626;
}

.market-closed-indicator {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
}

.portfolio-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #9ca3af;
}

.stat-value {
  font-weight: 600;
  font-size: 1rem;
  color: #e0e0e0;
}

.stat-value.positive {
  color: #16a34a;
}

.stat-value.negative {
  color: #dc2626;
}

.market-clock {
  text-align: center;
}

.time-display {
  margin-bottom: 1rem;
}

.current-time {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #e0e0e0;
  margin-bottom: 0.25rem;
}

.market-session {
  font-size: 0.8rem;
  color: #9ca3af;
}

.trading-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #9ca3af;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .trading-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .market-panel {
    grid-column: span 2;
  }
  
  .algorithm-panel,
  .chart-panel,
  .trade-feed-panel {
    grid-column: span 2;
  }
  
  .orderbook-panel,
  .orders-panel,
  .portfolio-panel,
  .market-clock {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .trading-grid {
    grid-template-columns: 1fr;
  }
  
  .market-panel,
  .algorithm-panel,
  .chart-panel,
  .orders-panel,
  .trade-feed-panel,
  .portfolio-panel,
  .market-clock,
  .orderbook-panel {
    grid-column: span 1;
  }
  
  .market-data-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .algo-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .algo-performance,
  .algo-status {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .order-item {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
    gap: 0.25rem;
  }
  
  .trade-item {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 0.25rem;
  }
}

/* Dark Mode Override for Charts */
:deep(.apexcharts-canvas) {
  background: #111 !important;
}

:deep(.apexcharts-text) {
  fill: #e0e0e0 !important;
}

:deep(.apexcharts-gridline) {
  stroke: #444 !important;
}

:deep(.apexcharts-tooltip) {
  background: #222 !important;
  border: 1px solid #444 !important;
  color: #e0e0e0 !important;
}
</style>