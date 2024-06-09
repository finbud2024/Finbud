<template>
  <div class="popup">
    <div class="popup-content">
      <button class="close-btn" @click="$emit('close')">&times;</button>
      <div class="chart-wrapper">
        <CryptoChart :uuid="crypto.uuid" />
      </div>
    </div>
  </div>
</template>

<script>
import CryptoChart from './CryptoChart.vue';

export default {
  name: 'CryptoPopup',
  components: {
    CryptoChart,
  },
  props: {
    crypto: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure the popup appears above other content */
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 50%; /* Set height to 90% of the viewport height */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-wrapper {
  width: 95%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}
</style>
