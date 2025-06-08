<template>
  <transition-group name="toast" tag="div" class="toast-container">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast', `toast-${toast.type}`]"
      @click="removeToast(toast.id)"
    >
      <div class="toast-icon">
        <font-awesome-icon 
          :icon="getToastIcon(toast.type)" 
          :class="['icon', `icon-${toast.type}`]"
        />
      </div>
      
      <div class="toast-content">
        <h4 class="toast-title">{{ toast.title }}</h4>
        <p v-if="toast.message" class="toast-message">{{ toast.message }}</p>
      </div>
      
      <button class="toast-close" @click.stop="removeToast(toast.id)">
        <font-awesome-icon icon="fa-solid fa-times" />
      </button>
      
      <!-- Progress bar for auto-dismiss -->
      <div 
        v-if="toast.autoClose" 
        class="toast-progress"
        :style="{ animationDuration: `${toast.duration}ms` }"
      ></div>
    </div>
  </transition-group>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faCheckCircle, 
  faExclamationCircle, 
  faInfoCircle,
  faExclamationTriangle,
  faTimes 
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faExclamationTriangle,
  faTimes
)

export default {
  name: 'Toast',
  components: {
    FontAwesomeIcon
  },
  data() {
    return {
      toasts: [],
      nextId: 1
    }
  },
  methods: {
    show(toast) {
      const id = this.nextId++
      const newToast = {
        id,
        type: toast.type || 'info',
        title: toast.title || 'Notification',
        message: toast.message || '',
        duration: toast.duration || 5000,
        autoClose: toast.autoClose !== false
      }
      
      this.toasts.push(newToast)
      
      // Auto remove toast if autoClose is enabled
      if (newToast.autoClose) {
        setTimeout(() => {
          this.removeToast(id)
        }, newToast.duration)
      }
      
      return id
    },
    
    removeToast(id) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },
    
    removeAll() {
      this.toasts = []
    },
    
    getToastIcon(type) {
      const icons = {
        success: 'fa-solid fa-check-circle',
        error: 'fa-solid fa-exclamation-circle',
        warning: 'fa-solid fa-exclamation-triangle',
        info: 'fa-solid fa-info-circle'
      }
      return icons[type] || icons.info
    },

    // Public methods for easier usage
    success(title, message, options = {}) {
      return this.show({
        type: 'success',
        title,
        message,
        ...options
      })
    },
    
    error(title, message, options = {}) {
      return this.show({
        type: 'error',
        title,
        message,
        duration: options.duration || 7000, // Errors stay longer
        ...options
      })
    },
    
    warning(title, message, options = {}) {
      return this.show({
        type: 'warning',
        title,
        message,
        duration: options.duration || 6000,
        ...options
      })
    },
    
    info(title, message, options = {}) {
      return this.show({
        type: 'info',
        title,
        message,
        ...options
      })
    }
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  pointer-events: none;
}

.toast {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  min-height: 70px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  cursor: pointer;
  pointer-events: auto;
  overflow: hidden;
  max-width: 100%;
  animation: slideIn 0.3s ease-out;
}

.toast-success {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.toast-error {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
}

.toast-warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.toast-info {
  border-left-color: #000000;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
}

.toast-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  font-size: 1.25rem;
}

.icon-success {
  color: #10b981;
}

.icon-error {
  color: #ef4444;
}

.icon-warning {
  color: #f59e0b;
}

.icon-info {
  color: #000000;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.25;
}

.toast-message {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
  word-wrap: break-word;
}

.toast-close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  animation: progressBar linear forwards;
}

.toast-success .toast-progress {
  background: #10b981;
}

.toast-error .toast-progress {
  background: #ef4444;
}

.toast-warning .toast-progress {
  background: #f59e0b;
}

.toast-info .toast-progress {
  background: #000000;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes progressBar {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* Transition animations */
.toast-enter-active {
  animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
  animation: slideOut 0.3s ease-in;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Hover effects */
.toast:hover {
  transform: translateX(-4px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
}

.toast:hover .toast-progress {
  animation-play-state: paused;
}

/* Responsive design */
@media (max-width: 768px) {
  .toast-container {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
  
  .toast {
    max-width: 100%;
  }
  
  .toast-title {
    font-size: 0.9rem;
  }
  
  .toast-message {
    font-size: 0.8rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .toast {
    background: #1f2937;
    color: #f9fafb;
  }
  
  .toast-title {
    color: #f9fafb;
  }
  
  .toast-message {
    color: #d1d5db;
  }
  
  .toast-close {
    color: #9ca3af;
  }
  
  .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #f3f4f6;
  }
}

/* Accessibility improvements */
.toast:focus {
  outline: 2px solid #000000;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .toast,
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    animation: none;
    transition: none;
  }
  
  .toast-progress {
    animation: none;
  }
}
</style> 