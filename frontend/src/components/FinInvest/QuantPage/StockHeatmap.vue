<template>
    <div class="tradingview-heatmap-container">
      <div class="tradingview-widget-container">
        <div id="tradingview-heatmap-widget"></div>
        <div class="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span class="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StockHeatmap',
    props: {
      width: {
        type: String,
        default: 1500
      },
      height: {
        type: String,
        default: 1000
      }
    },
    mounted() {
      this.loadTradingViewWidget();
    },
    methods: {
      loadTradingViewWidget() {
        // Remove any existing script first
        const existingScript = document.getElementById('tradingview-heatmap-script');
        if (existingScript) {
          existingScript.remove();
        }
  
        // Create new script element
        const script = document.createElement('script');
        script.id = 'tradingview-heatmap-script';
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
        script.async = true;
        script.type = 'text/javascript';
        script.innerHTML = JSON.stringify({
          "exchanges": [],
          "dataSource": "SPX500",
          "grouping": "sector",
          "blockSize": "market_cap_basic",
          "blockColor": "change",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "dark",
          "hasTopBar": true,
            "isDataSetEnabled": true,
            "isZoomEnabled": true,
            "hasSymbolTooltip": true,
            "isMonoSize": false,
          "width": 1000,
          "height": 1000
        });
  
        // Append to widget container
        document.getElementById('tradingview-heatmap-widget').appendChild(script);
      }
    },
    watch: {
      width() {
        this.loadTradingViewWidget();
      },
      height() {
        this.loadTradingViewWidget();
      }
    }
  };
  </script>
  
  <style scoped>
  .tradingview-heatmap-container {
    width: 100%;
    aspect-ratio: 16 / 9; /* Responsive height based on width */
    min-height: 500px;
    max-height: 100vh;
  }
  
  .tradingview-widget-container {
    width: 100%;
    height: 100%;
  }
  
  .tradingview-widget-copyright {
    font-size: 13px;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif;
    color: #9db2bd;
  }
  
  .tradingview-widget-copyright .blue-text {
    color: #2962FF;
  }
  
  .tradingview-widget-copyright a {
    text-decoration: none;
    color: #9db2bd;
  }
  
  .tradingview-widget-copyright a:hover {
    color: #1E53E5;
  }
  </style>