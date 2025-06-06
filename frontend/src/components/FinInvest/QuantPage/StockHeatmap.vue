<template>
  <div class="frame-container">
    <div class="border-wrapper">
    <div class="tradingview-heatmap-container">
      <div class="tradingview-widget-container">
        <div id="tradingview-heatmap-widget"></div>
        <div class="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">

          </a>
        </div>
      </div>
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

  // Remove TradingView branding after a delay
  setTimeout(() => {
    const brandingLink = document.querySelector('a[data-target-type="copyright"]');
    if (brandingLink) {
      brandingLink.remove();
    }
  }, 2000); // Adjust delay as needed
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
  "symbolUrl": "https://finbud.pro/",
  "colorTheme": "dark",
  "hasTopBar": true,
  "isDataSetEnabled": true,
  "isZoomEnabled": true,
  "hasSymbolTooltip": false,
  "showSymbolLogo": false,
  "isMonoSize": false,
  "width": "100%",
  "height": "100%",
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
  .frame-container {
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 30px auto;
    box-sizing: border-box;
    overflow: hidden; /* Prevent container overflow */
  }
  
  .border-wrapper {
    position: relative;
    border: 10px solid #444;
    border-radius: 12px;
    overflow: hidden; /* Ensure content doesn't overflow */
    width: 100%;
    height: 600px; /* Reduced height for better fit */
    box-sizing: border-box;
  }
  
  .frame-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 10px solid #444;
    border-radius: 12px;
    pointer-events: none;
    z-index: 1;
  }
  
  .heatmap-box {
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  
  .tradingview-heatmap-container {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .tradingview-widget-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
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
  
  #tradingview-heatmap-widget {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    max-width: 100% !important;
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .frame-container {
      margin: 15px auto;
    }
    
    .border-wrapper {
      height: 400px; /* Smaller height on mobile */
      border-width: 5px; /* Thinner border on mobile */
    }
    
    .heatmap-box {
      padding: 8px;
      margin: 10px auto;
    }
  }
  
  @media (max-width: 480px) {
    .border-wrapper {
      height: 300px; /* Even smaller on very small screens */
      border-width: 3px;
    }
  }
  </style>