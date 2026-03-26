<template>
  <div class="loading-page">
    <div class="loading-container">
      <div class="mascot-container">
        <img
          class="loading-image mascot-float"
          src="@/assets/finbud_logo.png"
          alt="FinBud"
        />
        <div class="mascot-shadow"></div>
      </div>
      <p class="loading-text animate-pulse">{{ $t('loading') || 'Waking up your Money Buddy...' }}</p>
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
  width: 150px;
  height: auto;
  position: relative;
  z-index: 2;
}

.mascot-container {
  position: relative;
  margin-bottom: 2rem;
}

.mascot-float {
  animation: float 2s ease-in-out infinite;
}

.mascot-shadow {
  width: 80px;
  height: 10px;
  background: rgba(167, 139, 250, 0.2);
  border-radius: 50%;
  margin: 10px auto 0;
  filter: blur(4px);
  animation: shadowScale 2s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes shadowScale {
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(0.7); opacity: 0.3; }
  100% { transform: scale(1); opacity: 0.6; }
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--agent-button-bg-color, #A78BFA);
  font-family: 'Outfit', sans-serif;
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
