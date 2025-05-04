<template>
  <div class="workflow-step">
    <div class="step-icon">{{ icon }}</div>
    <div class="step-content">
      <div class="step-header">
        <span class="step-indicator" :class="{ 'active': isProcessing, 'completed': isCompleted }">●</span>
        <h2 class="step-title">{{ title }}</h2>
        <button class="toggle-button" @click="$emit('toggle')">
          <span class="toggle-icon">{{ isVisible ? '▼' : '►' }}</span>
        </button>
      </div>
      
      <div v-if="isVisible" class="step-body">
        <div class="step-message">
          <span v-if="isProcessing" class="processing-icon">⚙️</span>
          <span v-else-if="isCompleted" class="completed-icon">✓</span>
          <span class="message-text">{{ message }}</span>
        </div>
        
        <!-- Slot for additional content -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkflowStep',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: true
    },
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.workflow-step {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.step-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-content {
  flex: 1;
}

.step-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.step-indicator {
  font-size: 12px;
  color: #9ca3af;
  margin-right: 8px;
}

.step-indicator.active {
  color: #f59e0b;
  animation: pulse 1.5s infinite;
}

.step-indicator.completed {
  color: #10b981;
}

.step-title {
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}

.toggle-icon {
  font-size: 12px;
}

.step-body {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 16px;
}

.step-message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
}

.processing-icon {
  animation: spin 2s linear infinite;
}

.completed-icon {
  color: #10b981;
}

.message-text {
  font-size: 15px;
  color: #4b5563;
  line-height: 1.5;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .workflow-step {
    gap: 10px;
  }
  
  .step-title {
    font-size: 16px;
  }
}
</style>