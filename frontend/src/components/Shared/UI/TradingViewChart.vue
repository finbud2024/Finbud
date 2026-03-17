<template>
  <div class="tradingview-chart">
    <!-- Debug info in development -->
    <div v-if="isDev" class="debug-info">
      <small>Symbol: {{ symbol }} | Container: {{ containerId }}</small>
    </div>
    <div :id="containerId" class="chart-container"></div>
  </div>
</template>

<script>
import {
  validateAndFormatSymbol,
  isKnownSymbol,
} from "@/utils/symbolValidator";

export default {
  name: "TradingViewChart",
  props: {
    symbol: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      default: "light",
    },
  },
  data() {
    return {
      containerId: "tradingview_" + Math.random().toString(36).substring(7),
      widget: null,
    };
  },
  computed: {
    isDev() {
      return process.env.NODE_ENV === "development";
    },
  },
  mounted() {
    console.log(`🚀 TradingViewChart mounting with symbol: ${this.symbol}`);
    console.log(`📊 Container ID: ${this.containerId}`);
    this.initWidget();
  },
  watch: {
    symbol(newSymbol) {
      if (!this.validateSymbol(newSymbol)) {
        console.warn("Invalid symbol provided:", newSymbol);
        return;
      }

      const formattedSymbol = this.formatSymbolForTradingView(newSymbol);
      console.log(
        `🔄 Symbol changed to: ${formattedSymbol} (from: ${newSymbol})`
      );

      if (this.widget && typeof this.widget.setSymbol === "function") {
        try {
          this.widget.setSymbol(formattedSymbol);
          console.log("✅ Chart symbol updated successfully");
        } catch (error) {
          console.error("❌ Error updating symbol:", error);
          this.showErrorMessage();
        }
      } else {
        console.log("🔄 Widget not ready, reinitializing...");
        this.initWidget();
      }
    },
  },
  methods: {
    initWidget() {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (typeof TradingView !== "undefined") {
          try {
            // Ensure symbol is in correct format for TradingView
            const formattedSymbol = this.formatSymbolForTradingView(
              this.symbol
            );
            console.log(
              `Initializing TradingView with symbol: ${formattedSymbol} (original: ${this.symbol})`
            );

            this.widget = new TradingView.widget({
              width: "100%",
              height: "90%",
              symbol: formattedSymbol,
              interval: "D",
              timezone: "Etc/UTC",
              theme: this.theme,
              style: "1",
              locale: "en",
              toolbar_bg: "#f1f3f6",
              enable_publishing: false,
              allow_symbol_change: true,
              container_id: this.containerId,
              hide_side_toolbar: false,
              studies: ["MASimple@tv-basicstudies", "RSI@tv-basicstudies"],
              // Error handling options
              loading_screen: { backgroundColor: "#f1f3f6" },
              disabled_features: [],
              enabled_features: ["side_toolbar_in_fullscreen_mode"],
              // Debug callbacks
              onChartReady: () => {
                console.log(
                  "✅ TradingView chart loaded successfully for:",
                  formattedSymbol
                );
              },
              debug: process.env.NODE_ENV === "development",
            });
          } catch (error) {
            console.error("Error initializing TradingView widget:", error);
            this.showErrorMessage();
          }
        } else {
          console.error("TradingView library not loaded");
          this.showErrorMessage();
        }
      };
      script.onerror = () => {
        console.error("Failed to load TradingView script");
        this.showErrorMessage();
      };
      document.head.appendChild(script);
    },
    showErrorMessage() {
      // Display a user-friendly error message
      const container = document.getElementById(this.containerId);
      if (container) {
        container.innerHTML = `
          <div style="
            display: flex; 
            align-items: center; 
            justify-content: center; 
            height: 100%; 
            background: #f8f9fa; 
            border: 1px solid #dee2e6; 
            border-radius: 8px;
            font-family: Arial, sans-serif;
            color: #6c757d;
          ">
            <div style="text-align: center;">
              <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
              <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Chart Loading...</div>
              <div style="font-size: 14px;">Unable to load chart for ${this.symbol}</div>
              <div style="font-size: 12px; margin-top: 8px;">Please check the symbol or try again later</div>
            </div>
          </div>
        `;
      }
    },
    validateSymbol(symbol) {
      // Basic symbol validation
      return symbol && typeof symbol === "string" && symbol.length > 0;
    },
    formatSymbolForTradingView(symbol) {
      // Use the comprehensive validator without automatic exchange mapping
      const validatedSymbol = validateAndFormatSymbol(symbol, false);

      if (!isKnownSymbol(symbol)) {
        console.warn(
          `⚠️ Using unknown symbol: ${symbol} -> ${validatedSymbol}`
        );
        console.warn(
          'This may cause "Quote snapshot error" - consider adding to SYMBOL_MAPPINGS'
        );
      }

      return validatedSymbol;
    },
  },
  beforeUnmount() {
    if (this.widget) {
      this.widget = null;
    }
  },
};
</script>

<style scoped>
.tradingview-chart {
  width: 100%;
  height: 500px;
  margin: 20px 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
}

.debug-info {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  z-index: 1000;
}
</style>
