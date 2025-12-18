<template>
  <div class="tradingview-widget-container componentCard" ref="divRef">
    <div class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script>
export default {
  name: 'CompanyCard',
  // Static counter to limit concurrent widget loads
  static: {
    activeWidgets: 0,
    maxConcurrentWidgets: 10, // Increased from 5 to 10
    widgetQueue: [] // Queue for widgets waiting to load
  },
  props: {
    companyName: {
      type: String,
      required: true,
      default: 'AAPL'
    },
    width: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      loadAttempted: false
    };
  },
  mounted() {
    // Add a shorter delay to prevent overwhelming TradingView with simultaneous requests
    // Use a more staggered approach for better resource management
    const delay = Math.random() * 2000 + 500; // Random delay 0.5-2.5 seconds (reduced)
    setTimeout(() => {
      this.loadTradingViewWidget();
    }, delay);
    
    // Set a timeout to show fallback if widget doesn't load within 10 seconds
    this.loadTimeout = setTimeout(() => {
      if (!this.loadAttempted) {
        console.log(`Timeout reached for ${this.companyName}, showing fallback`);
        this.showFallback();
      }
    }, 10000); // Reduced from 15s to 10s
  },
  beforeDestroy() {
    // Clean up the active widgets counter when component is destroyed
    if (this.loadAttempted) {
      this.$options.static.activeWidgets--;
    }
    // Clear the timeout
    if (this.loadTimeout) {
      clearTimeout(this.loadTimeout);
    }
  },
  methods: {
    loadTradingViewWidget() {
      try {
        // Prevent multiple simultaneous loads
        if (this.loadAttempted) return;
        
        // Check if we've reached the maximum concurrent widgets
        if (this.$options.static.activeWidgets >= this.$options.static.maxConcurrentWidgets) {
          console.log('Max concurrent widgets reached, queuing widget load for', this.companyName);
          // Add to queue instead of skipping
          this.$options.static.widgetQueue.push(() => this.loadTradingViewWidget());
          return;
        }
        
        this.loadAttempted = true;
        this.$options.static.activeWidgets++;
        
        // Clear any existing widget and create proper container
        let containerId;
        if (this.$refs.divRef) {
          this.$refs.divRef.innerHTML = '';
          
          // Create the proper TradingView widget container
          containerId = `tradingview_${this.companyName}_${Date.now()}`;
          const widgetContainer = document.createElement('div');
          widgetContainer.id = containerId;
          widgetContainer.className = 'tradingview-widget-container__widget';
          this.$refs.divRef.appendChild(widgetContainer);
        } else {
          // Fallback container ID if ref is not available
          containerId = `tradingview_${this.companyName}_${Date.now()}`;
        }

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
        script.async = true;
        script.type = "text/javascript";
        
        // Create the widget configuration using the same container ID
        const widgetConfig = {
          symbol: this.companyName,
          width: this.width,
          locale: "en",
          colorTheme: "light",
          isTransparent: false,
          autosize: true,
          container_id: containerId
        };
        
        // Set the script content properly
        script.innerHTML = JSON.stringify(widgetConfig);
        script.className = "componentCard";
        
        // Add error handling for the script
        script.onerror = () => {
          console.warn(`Failed to load TradingView widget for ${this.companyName}`);
          this.loadAttempted = false; // Allow retry
          this.$options.static.activeWidgets--; // Decrement counter on error
          // Retry once after a delay
          setTimeout(() => {
            this.showFallback();
          }, 2000);
        };
        
        if (this.$refs.divRef) {
          this.$refs.divRef.appendChild(script);
        }
        
        // Clear the timeout since widget is loading
        if (this.loadTimeout) {
          clearTimeout(this.loadTimeout);
        }
        
        // Process queue when widget starts loading
        this.processQueue();
      } catch (error) {
        console.warn(`Error loading TradingView widget for ${this.companyName}:`, error);
        this.$options.static.activeWidgets--; // Decrement counter on error
        this.processQueue(); // Process queue even on error
        this.showFallback();
      }
    },
    processQueue() {
      // Process queued widgets when slots become available
      if (this.$options.static.widgetQueue.length > 0 && 
          this.$options.static.activeWidgets < this.$options.static.maxConcurrentWidgets) {
        const nextWidget = this.$options.static.widgetQueue.shift();
        if (nextWidget) {
          setTimeout(() => nextWidget(), 100); // Small delay between widgets
        }
      }
    },
    showFallback() {
      if (this.$refs.divRef) {
        this.$refs.divRef.innerHTML = `
          <div class="fallback-card">
            <div class="fallback-symbol">${this.companyName}</div>
            <div class="fallback-message">TradingView widget loading...</div>
            <div class="fallback-status">Please wait or click below to view directly</div>
            <div class="fallback-link">
              <a href="https://www.tradingview.com/chart/?symbol=${this.companyName}" target="_blank" rel="noopener noreferrer">
                View ${this.companyName} on TradingView →
              </a>
            </div>
          </div>
        `;
      }
      this.isLoading = false;
    }
  }
};
</script>

<style scoped>
.tradingview-widget-container {
  margin-bottom: 1rem;
  width: 100%;
  max-width: 100%;
}

/* Fallback card styling when TradingView widget fails to load */
.fallback-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.fallback-header {
  margin-bottom: 1rem;
}

.fallback-symbol {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.fallback-exchange {
  font-size: 0.8rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.fallback-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1rem;
}

.fallback-price {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.fallback-change {
  font-size: 1rem;
  color: #6b7280;
}

.fallback-footer {
  margin-top: auto;
}

.fallback-message {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.fallback-status {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 1rem;
  font-style: italic;
}

.fallback-link a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.fallback-link a:hover {
  background: #3b82f6;
  color: white;
}
</style>

