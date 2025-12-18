<template>
  <div class="rag-process">
    <div class="rag-status" :class="{ 'fade-out': isFinished }">
      <div class="status-icon">
        <div v-if="status === 'loading'" class="loading-spinner"></div>
        <div v-else-if="status === 'success'" class="check-icon">✓</div>
        <div v-else-if="status === 'error'" class="error-icon">✕</div>
      </div>
      <div class="status-text">
        <span v-if="status === 'loading'">Retrieving relevant information...</span>
        <span v-else-if="status === 'success'">Retrieval complete!</span>
        <span v-else-if="status === 'error'">No relevant information found</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RagProcess',
  props: {
    status: {
      type: String,
      required: true,
      validator: value => ['loading', 'success', 'error'].includes(value)
    }
  },
  data() {
    return {
      isFinished: false
    }
  },
  watch: {
    status(newStatus) {
      if (newStatus === 'success' || newStatus === 'error') {
        // Emit completion event after animation
        setTimeout(() => {
          this.$emit('rag-complete');
        }, 1000);
      }
    }
  }
}
</script>

<style scoped>
.rag-process {
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
  background-color: var(--card-bg, #f8f9fa);
  transition: all 0.3s ease;
}

.rag-status {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.rag-status.fade-out {
  opacity: 0;
}

.status-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.check-icon {
  color: #2ecc71;
  font-size: 20px;
  font-weight: bold;
}

.error-icon {
  color: #e74c3c;
  font-size: 20px;
  font-weight: bold;
}

.status-text {
  font-size: 14px;
  color: var(--text-secondary, #666);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
