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
  "height": 765,
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
    position: relative; /* Make the container a positioning context */
    width: 100%; /* Full width of the container */
    max-width: 1200px; /* Limit the width */
    margin: 30px auto; /* Center the container */
  }
  .border-wrapper {
    position: relative; /* Position the wrapper relative to the heatmap */
    border: 10px solid #444; /* Add a border around the graph */
    border-radius: 12px; /* Round the corners of the border */
    overflow: hidden; /* Hide any part of the graph that extends beyond the border */
    width: 100%; /* Full width of the wrapper */
    height: 725px; /* Match the height of the heatmap */
    box-sizing: border-box; /* Include the border in the element's dimensions */
  }
  
  .frame-overlay {
    position: absolute; /* Position the frame above the heatmap */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 10px solid #444; /* Frame border */
    border-radius: 12px; /* Rounded corners for the frame */
    pointer-events: none; /* Allow interaction with the heatmap below */
    z-index: 1; /* Ensure the frame is above the heatmap */
  }
  .heatmap-box {
    border: 2px solid #ccc; /* Add a border around the box */
    border-radius: 8px; /* Round the corners of the box */
    padding: 16px; /* Add padding inside the box */
    background-color: #f9f9f9; /* Light background color for contrast */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
    margin: 20px auto; /* Center the box and add spacing */
    max-width: 1200px; /* Limit the width of the box */
    width: 100%; /* Ensure the box takes full width of its container */
  }
  
  .tradingview-heatmap-container {
    position: relative; /* Ensure the heatmap is positioned correctly */
    z-index: 0; /* Place the heatmap below the frame */
    width: 100%; /* Full width of the container */
    height: 600px; /* Set the height of the heatmap */
  }
  
  .tradingview-widget-container {
    width: 100%; /* Ensure the widget fills the container */
    height: 100%; /* Ensure the widget fills the container */
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