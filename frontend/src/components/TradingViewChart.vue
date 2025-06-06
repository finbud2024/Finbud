<template>
  <div class="tradingview-chart">
    <div :id="containerId"></div>
  </div>
</template>

<script>
export default {
  name: 'TradingViewChart',
  props: {
    symbol: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {
      containerId: 'tradingview_' + Math.random().toString(36).substring(7),
      widget: null
    }
  },
  mounted() {
    this.initWidget();
  },
  methods: {
    initWidget() {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        if (typeof TradingView !== 'undefined') {
          this.widget = new TradingView.widget({
            width: '100%',
            height: 500,
            symbol: this.symbol,
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: this.theme,
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: this.containerId,
            hide_side_toolbar: false,
            studies: [
              'MASimple@tv-basicstudies',
              'RSI@tv-basicstudies'
            ]
          });
        }
      };
      document.head.appendChild(script);
    }
  },
  beforeUnmount() {
    if (this.widget) {
      this.widget = null;
    }
  }
}
</script>

<style scoped>
.tradingview-chart {
  width: 100%;
  height: 500px;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style> 