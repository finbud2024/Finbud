<template>
  <div class="tradingview-widget-container" ref="divRef">
    <div class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script>
export default {
  name: 'SmallCompanyCard',
  props: {
    companyName: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: this.companyName,
      width: this.width,
      locale: 'en',
      colorTheme: 'light',
      isTransparent: false,
    });
    this.$refs.divRef.appendChild(script);
  },
};
</script>

<style scoped>
/* Add your styles here if needed */
</style>
