<template>
  <div class="tradingview-widget-container" ref="divRef">
    <div class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script>
export default {
  name: 'TechAnalysis',
  props: {
    companyName: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: this.companyName,
      width: this.width,
      height: this.height,
      locale: 'en',
      colorTheme: 'light',
      isTransparent: false,
    });
    this.$refs.divRef.appendChild(script);
  },
};
</script>

<style scoped>
.tradingview-widget-container {
    margin-top: 1rem;
    height: 80%;
}
</style>
