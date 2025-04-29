<template>
  <div class="loading-page">
    <div class="loading-container">
      <img
        class="loading-image"
        src="@/assets/home-page/FinbudSmallLogo.png"
        alt="Loading"
      />
      <img
        class="loading-image"
        src="@/assets/home-page/FinBudPix.png"
        alt="Loading"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingPage",
  data() {
    return {
      loadingText: "Loading",
      dotCount: 0,
      intervalId: null,
    };
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.dotCount = (this.dotCount + 1) % 4;
      this.loadingText = "Loading" + ".".repeat(this.dotCount);
    }, 500);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
}

.loading-container {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-image {
  width: 120px;
  height: auto;
  margin-bottom: 10px;
}

.loading-text {
  margin-top: 20px;
  font-size: 18px;
  color: #555;
}
</style>
