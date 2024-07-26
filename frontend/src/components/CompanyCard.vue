<template>
  <div class="tradingview-widget-container componentCard" ref="divRef">
    <div class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script>
export default {
  name: 'CompanyCard',
  props: {
    companyName: {
      type: String,
      required: true,
      default: 'AAPL'
    },
    width:{
      type: String,
      required: true
    }
  },
  mounted() {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: this.companyName,
      width: this.width,
      locale: "en",
      colorTheme: "dark",
      isTransparent: false,
    });
    script.className = "componentCard";
    this.$refs.divRef.appendChild(script);
  }
};
</script>

<style scoped>
.tradingview-widget-container {
  margin-bottom: 1rem;
  width: 100%;
  max-width: 100%;
}
</style>
