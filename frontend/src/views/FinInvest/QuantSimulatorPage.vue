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
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  min-height: 100vh;
  padding: 1rem;
  color: white;
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
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.375rem;
  border-left: 4px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
}

.notification-success { border-left-color: #10b981; }
.notification-error { border-left-color: #ef4444; }
.notification-info { border-left-color: #000000; }

.notification-close {
  background: none;
  border: none;
  color: white;
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
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 0.75rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
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
  color: #e2e8f0;
}

.market-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.market-indicator {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: bold;
  background: #dc2626;
  color: white;
}

.market-indicator.market-open {
  background: #059669;
}

.table-wrapper {
  overflow-x: auto;
}

.market-data-table {
  width: 100%;
  border-collapse: collapse;
}

.market-data-table th,
.market-data-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);
}

.market-data-table th {
  background: rgba(71, 85, 105, 0.2);
  font-weight: 600;
  color: #cbd5e1;
}

.market-data-table tr.price-up {
  background: rgba(16, 185, 129, 0.1);
  animation: flashGreen 1s ease-out;
}

.market-data-table tr.price-down {
  background: rgba(239, 68, 68, 0.1);
  animation: flashRed 1s ease-out;
}

.symbol {
  font-weight: bold;
  color: #60a5fa;
}

.bid {
  font-weight: bold;
}

.ask {
  font-weight: bold;
}

.price {
  font-weight: bold;
}

.change.positive {
  color: #10b981;
}

.change.negative {
  color: #ef4444;
}

.volume {
  color: #94a3b8;
}

.time {
  color: #64748b;
  font-size: 0.875rem;
}

.algo-controls {
  display: flex;
  gap: 0.5rem;
}

.start-btn {
  background: #059669;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s;
}

.start-btn:hover:not(:disabled) {
  background: #047857;
}

.start-btn:disabled {
  background: #374151;
  cursor: not-allowed;
}

.algorithm-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.algo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(71, 85, 105, 0.2);
  border-radius: 0.5rem;
  border: 1px solid transparent;
}

.algo-item.algo-active {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.algo-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.algo-name {
  font-weight: 600;
  color: #e2e8f0;
}

.algo-strategy {
  font-size: 0.75rem;
  color: #94a3b8;
}

.algo-sharpe {
  font-size: 0.75rem;
  color: #94a3b8;
}

.algo-performance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.algo-pnl.positive {
  color: #10b981;
}

.algo-pnl.negative {
  color: #ef4444;
}

.algo-trades {
  font-size: 0.75rem;
  color: #64748b;
}

.algo-winrate {
  font-size: 0.75rem;
  color: #64748b;
}

.status-indicator {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: #374151;
}

.status-indicator.active {
  background: #10b981;
  animation: pulse 2s infinite;
}

.chart-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chart-controls select {
  background: rgba(71, 85, 105, 0.5);
  color: white;
  border: 1px solid rgba(71, 85, 105, 0.5);
  padding: 0.5rem;
  border-radius: 0.375rem;
}

.current-price {
  font-weight: bold;
  color: #60a5fa;
  font-size: 1.1rem;
}

.chart-container {
  height: 300px;
  margin-top: 1rem;
}

.chart-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #374151;
  border-top: 2px solid #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
}

.order-count {
  background: #000000;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.orders-container {
  max-height: 300px;
  overflow-y: auto;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(71, 85, 105, 0.2);
  border-radius: 0.5rem;
  border-left: 3px solid;
}

.order-item.order-buy {
  border-left-color: #10b981;
}

.order-item.order-sell {
  border-left-color: #ef4444;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.order-symbol {
  font-weight: bold;
  color: #60a5fa;
}

.order-type,
.order-side {
  font-size: 0.75rem;
  color: #94a3b8;
}

.order-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.order-time {
  font-size: 0.75rem;
  color: #64748b;
}

.cancel-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.75rem;
}

.cancel-btn:hover {
  background: #b91c1c;
}

.empty-orders {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 150px;
  color: #64748b;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.trade-feed {
  max-height: 250px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.trade-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 0.5rem;
  padding: 0.5rem;
  background: rgba(71, 85, 105, 0.2);
  border-radius: 0.25rem;
  border-left: 2px solid;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.trade-item.trade-buy {
  border-left-color: #10b981;
}

.trade-item.trade-sell {
  border-left-color: #ef4444;
}

.trade-item.trade-new {
  background: rgba(59, 130, 246, 0.2);
  transform: scale(1.02);
}

.trade-symbol {
  font-weight: bold;
  color: #60a5fa;
}

.trade-side {
  color: #e2e8f0;
  font-weight: 500;
}

.trade-quantity {
  color: #94a3b8;
}

.trade-price {
  font-weight: bold;
}

.trade-time {
  color: #64748b;
  font-size: 0.75rem;
}

.market-closed-indicator {
  color: #ef4444;
  font-size: 0.875rem;
}

.portfolio-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: rgba(71, 85, 105, 0.2);
  border-radius: 0.5rem;
}

.stat-label {
  color: #94a3b8;
}

.stat-value {
  font-weight: bold;
  color: #e2e8f0;
}

.stat-value.positive {
  color: #10b981;
}

.stat-value.negative {
  color: #ef4444;
}

.market-clock {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 1rem;
}

.time-display {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.current-time {
  font-size: 1.5rem;
  font-weight: bold;
  color: #60a5fa;
}

.market-session {
  color: #94a3b8;
  font-size: 0.875rem;
}

.trading-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #64748b;
}

@keyframes flashGreen {
  0% { background: rgba(16, 185, 129, 0.3); }
  100% { background: rgba(16, 185, 129, 0.1); }
}

@keyframes flashRed {
  0% { background: rgba(239, 68, 68, 0.3); }
  100% { background: rgba(239, 68, 68, 0.1); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1200px) {
  .trading-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .market-panel {
    grid-column: span 2;
  }
  
  .chart-panel {
    grid-column: span 2;
  }
  
  .trade-feed-panel {
    grid-column: span 2;
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
  .market-clock {
    grid-column: span 1;
  }
  
  .hft-trading-interface {
    padding: 0.5rem;
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>