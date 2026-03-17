<template>
    <section id="symbol-info" class="tradingview-widget-wrapper">
      <!-- TradingView Widget BEGIN -->
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <div class="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span class="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
      <!-- TradingView Widget END -->
    </section>
</template>

<script>
export default {
name: "TradingViewWidget",
props: {
    symbol: {
    type: String,
    required: true // Symbol is now required
    },
    interval: {
    type: String,
    default: "D" // Daily interval
    },
    theme: {
    type: String,
    default: "light",
    validator: (value) => ["light", "dark"].includes(value)
    }
},
mounted() {
    this.loadTradingViewWidget();
},
watch: {
    symbol(newVal) {
    // Recreate the widget when symbol changes
    this.loadTradingViewWidget();
    },
    theme(newVal) {
    // Recreate the widget when theme changes
    this.loadTradingViewWidget();
    }
},
methods: {
    loadTradingViewWidget() {
    // Remove any existing TradingView script
    const existingScript = document.querySelector('script[src*="tradingview.com"]');
    if (existingScript) {
        existingScript.remove();
    }

    // Use the symbol exactly as provided
    const formattedSymbol = this.symbol;

    // Create new script element
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": formattedSymbol,
        "interval": this.interval,
        "timezone": "Etc/UTC",
        "theme": this.theme,
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "withdateranges": true,
        "hide_top_toolbar": false,
        "studies": [
        "ROC@tv-basicstudies",
        "StochasticRSI@tv-basicstudies",
        "MASimple@tv-basicstudies"
        ],
        "support_host": "https://www.tradingview.com"
    });
    
    // Append to the widget container
    const container = this.$el.querySelector('.tradingview-widget-container');
    if (container) {
        container.appendChild(script);
    }
    }
}
};
</script>

<style scoped>
.tradingview-widget-wrapper {
width: 100%;
height: 450px;
margin: 10px 0;
border-radius: 8px;
overflow: hidden;
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tradingview-widget-container {
height: 100%;
width: 100%;
position: relative;
}

.tradingview-widget-container__widget {
height: calc(100% - 32px);
width: 100%;
}

.tradingview-widget-copyright {
font-size: 12px;
text-align: center;
padding: 8px 0;
color: #9db2bd;
}

.tradingview-widget-copyright .blue-text {
color: #2962FF;
text-decoration: none;
}

.tradingview-widget-copyright a {
text-decoration: none;
}

/* Responsive adjustments */
@media (max-width: 768px) {
.tradingview-widget-wrapper {
    height: 350px;
}
}
</style>