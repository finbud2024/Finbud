<template>
  <div class="tradingview-widget-container componentCard" ref="divRef">
    <div class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script>
export default {
  name: "CompanyCard",
  props: {
    companyName: {
      type: String,
      required: true,
      default: "AAPL",
    },
    width: {
      type: String,
      required: true,
    },
  },

  watch: {
    companyName: {
      immediate: true,
      handler(newCompanyName) {
        this.loadTradingViewWidget(newCompanyName);
      },
    },
  },

  methods: {
    loadTradingViewWidget(symbol) {
      console.log(symbol);
      if (!this.$refs.divRef) {
        console.log("divref is not");
        return;
      }

      this.$refs.divRef.innerHTML = "";

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: symbol,
        width: this.width,
        locale: "en",
        colorTheme: "dark",
        isTransparent: false,
      });
      script.className = "componentCard";
      this.$refs.divRef.appendChild(script);
    },
  },

  mounted() {
    this.loadTradingViewWidget(this.companyName);
  },
};
</script>

<style scoped>
.tradingview-widget-container {
  margin-bottom: 1rem;
  width: 100%;
  max-width: 100%;
}
</style>
