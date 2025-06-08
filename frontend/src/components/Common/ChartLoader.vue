<template>
  <div class="chart-loader-container">
    <div class="chart-loader">
      <svg class="chart-icon" viewBox="0 0 24 24">
        <path d="M3 3v18h18" fill="none" stroke="currentColor" stroke-width="2"/>
        <path class="animate-path" d="M3 15l5-5 4 4 6-6" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
      <div class="loading-text">Loading Chart...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartLoader'
}
</script>

<style scoped>
.chart-loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
  background: var(--bg-primary);
  border-radius: 12px;
}

.chart-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.chart-icon {
  width: 48px;
  height: 48px;
  animation: pulse 1.5s ease-in-out infinite;
}

.animate-path {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: draw 1.5s ease-in-out infinite;
}

.loading-text {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

@keyframes draw {
  0% { stroke-dashoffset: 30; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -30; }
}
</style> 