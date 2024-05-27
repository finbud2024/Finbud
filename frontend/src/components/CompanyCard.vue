<template>
  <div class="tradingview-widget-container componentCard" ref="divRef">
    <div class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

export default {
  name: 'CompanyCard',
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
  setup(props) {
    const divRef = ref(null);

    const loadTradingViewWidget = () => {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        symbol: props.companyName,
        width: props.width,
        locale: 'en',
        colorTheme: 'dark',
        isTransparent: false,
      });
      script.className = 'componentCard';
      divRef.value.appendChild(script);
    };

    onMounted(() => {
      loadTradingViewWidget();
    });

    watch(() => [props.companyName, props.width], () => {
      if (divRef.value) {
        divRef.value.innerHTML = '';
        loadTradingViewWidget();
      }
    });

    return {
      divRef,
    };
  },
};
</script>

<style scoped>
.tradingview-widget-container {
    margin-bottom: 1rem;
}
</style>
