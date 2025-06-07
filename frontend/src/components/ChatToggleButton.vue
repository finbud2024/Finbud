<template>
  <div class="chat-toggle-container">
    <!-- Tooltip -->
    <div 
      v-if="showTooltip" 
      class="chat-tooltip"
      :class="{ 'tooltip-visible': showTooltip }"
    >
      <div class="tooltip-content">
        <i class="fas fa-robot"></i>
        <span>{{ $t('chatbotBubble.needHelp') || 'Cần hỗ trợ tài chính?' }}</span>
      </div>
      <div class="tooltip-arrow"></div>
    </div>
    
    <!-- Main Chat Button -->
    <button
      @click="toggleChat"
      class="chat-toggle-btn"
      :class="{ 
        'btn-pulsing': isPulsing,
        'btn-active': showChatBubble 
      }"
      :title="$t('chatbotBubble.chatWithFinBud') || 'Chat với FinBud'"
    >
      <!-- Notification Badge -->
      <div 
        v-if="unreadCount > 0" 
        class="notification-badge"
        :class="{ 'badge-animate': unreadCount > 0 }"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </div>
      
      <!-- Chat Icon with Animation -->
      <div class="icon-container">
        <i 
          class="fas fa-comments"
          :class="{ 'icon-bounce': isPulsing }"
        ></i>
      </div>
      
      <!-- Ripple Effect -->
      <div class="ripple-effect" :class="{ 'ripple-active': isPulsing }"></div>
    </button>

    <!-- Draggable Chat Bubble -->
    <DraggableChatBubble 
      ref="chatBubble"
      :initial-visible="showChatBubble"
      @close="handleChatClose"
    />
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCommentDots, faTimes } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import DraggableChatBubble from './DraggableChatBubble.vue'

library.add(faCommentDots, faTimes)

export default {
  name: 'ChatToggleButton',
  components: {
    FontAwesomeIcon,
    DraggableChatBubble
  },
  data() {
    return {
      showChatBubble: false,
      isVisible: true,
      isPulsing: false,
      showTooltip: false,
      unreadCount: 0,
      lastActivityTime: Date.now(),
      activityTimer: null,
      pulseTimer: null,
      hasShownInitialPrompt: false,
      contextualMessages: [
        {
          trigger: 'market_hours',
          message: this.$t ? this.$t('chatbotBubble.marketHoursPrompt') : 'Thị trường đang mở! Bạn có muốn xem phân tích mới nhất?',
          condition: () => this.isMarketHours()
        },
        {
          trigger: 'portfolio_check',
          message: this.$t ? this.$t('chatbotBubble.portfolioCheckPrompt') : 'Đã lâu rồi bạn chưa kiểm tra danh mục đầu tư. Cần hỗ trợ gì không?',
          condition: () => this.shouldSuggestPortfolioCheck()
        },
        {
          trigger: 'budget_reminder',
          message: this.$t ? this.$t('chatbotBubble.budgetReminderPrompt') : 'Cuối tháng rồi! Bạn có muốn xem lại ngân sách và chi tiêu không?',
          condition: () => this.isEndOfMonth()
        }
      ]
    }
  },
  mounted() {
    // Check if user has been inactive and show pulse animation
    this.checkUserActivity()
    
    // Add event listeners for user activity
    this.addActivityListeners()
    
    // Restore chat state from localStorage
    const chatState = localStorage.getItem('chatBubbleState')
    if (chatState) {
      const state = JSON.parse(chatState)
      this.showChatBubble = state.isOpen || false
    }
  },
  beforeUnmount() {
    this.removeActivityListeners()
  },
  methods: {
    toggleChat() {
      this.showChatBubble = !this.showChatBubble
      
      if (this.showChatBubble) {
        this.$refs.chatBubble?.show()
      } else {
        this.$refs.chatBubble?.hide()
      }
      
      this.handleChatOpened()
      this.updateLastActivity()
      
      // Save state to localStorage
      localStorage.setItem('chatBubbleState', JSON.stringify({
        isOpen: this.showChatBubble
      }))
      
      // Emit event for parent components
      this.$emit('chat-toggled', this.showChatBubble)
    },
    handleChatClose() {
      this.showChatBubble = false
      localStorage.setItem('chatBubbleState', JSON.stringify({
        isOpen: false
      }))
      this.$emit('chat-toggled', false)
    },
    addActivityListeners() {
      // Listen for user activity to manage suggestions and notifications
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
      events.forEach(event => {
        document.addEventListener(event, this.updateLastActivity, { passive: true })
      })
      
      // Start activity check interval
      this.activityInterval = setInterval(this.checkUserActivity, 30000) // Check every 30 seconds
    },
    removeActivityListeners() {
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
      events.forEach(event => {
        document.removeEventListener(event, this.updateLastActivity)
      })
      
      if (this.activityInterval) {
        clearInterval(this.activityInterval)
      }
    },
    updateLastActivity() {
      this.lastActivityTime = Date.now()
      this.hasNewMessage = false
    },
    checkUserActivity() {
      const inactiveTime = Date.now() - this.lastActivityTime
      const fiveMinutes = 5 * 60 * 1000
      
      if (inactiveTime > fiveMinutes && !this.hasShownInitialPrompt) {
        this.showContextualPrompt()
        this.hasShownInitialPrompt = true
      }
    },
    showContextualPrompt() {
      // Find applicable contextual message
      const applicableMessage = this.contextualMessages.find(msg => msg.condition())
      
      if (applicableMessage) {
        this.triggerNotification(applicableMessage.message)
      } else {
        // Default inactivity message
        const defaultMessage = this.$t ? 
          this.$t('chatbotBubble.inactivityPrompt') : 
          'Bạn có cần hỗ trợ gì về tài chính không?'
        this.triggerNotification(defaultMessage)
      }
    },
    triggerNotification(message) {
      this.unreadCount = 1
      this.isPulsing = true
      this.showTooltip = true
      
      // Store notification message for chat bubble
      localStorage.setItem('finbud_notification', JSON.stringify({
        message: message,
        timestamp: Date.now()
      }))
      
      // Auto-hide tooltip after 5 seconds
      setTimeout(() => {
        this.showTooltip = false
      }, 5000)
      
      // Stop pulsing after 10 seconds
      setTimeout(() => {
        this.isPulsing = false
      }, 10000)
    },
    isMarketHours() {
      const now = new Date()
      const hour = now.getHours()
      const day = now.getDay()
      
      // Check if it's weekday and between 9 AM - 5 PM (basic market hours)
      return day >= 1 && day <= 5 && hour >= 9 && hour <= 17
    },
    shouldSuggestPortfolioCheck() {
      const lastCheck = localStorage.getItem('finbud_last_portfolio_check')
      if (!lastCheck) return true
      
      const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000)
      return parseInt(lastCheck) < threeDaysAgo
    },
    isEndOfMonth() {
      const now = new Date()
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const daysUntilNextMonth = Math.ceil((nextMonth - now) / (1000 * 60 * 60 * 24))
      
      return daysUntilNextMonth <= 3 // Last 3 days of month
    },
    handleChatOpened() {
      this.unreadCount = 0
      this.isPulsing = false
      this.showTooltip = false
      this.hasShownInitialPrompt = false
      
      // Clear stored notification
      localStorage.removeItem('finbud_notification')
      
      // Update portfolio check time
      localStorage.setItem('finbud_last_portfolio_check', Date.now().toString())
    },
    suggestChatInteraction() {
      // Only suggest if not currently showing chat
      if (!this.showChatBubble) {
        this.hasNewMessage = true
        
        // Add a subtle notification after some inactivity
        setTimeout(() => {
          if (!this.showChatBubble) {
            this.unreadCount = 1
            
            // Show a brief tooltip-like message
            this.showBriefMessage()
          }
        }, 2000)
      }
    },
    showBriefMessage() {
      // Could integrate with a toast notification system
      // For now, just use the pulse animation
      this.hasNewMessage = true
      
      setTimeout(() => {
        this.hasNewMessage = false
      }, 5000)
    },
    // Method to be called from parent components when they want to show chat
    showChat() {
      if (!this.showChatBubble) {
        this.toggleChat()
      }
    },
    // Method to add unread count (for external message notifications)
    addUnreadMessage() {
      if (!this.showChatBubble) {
        this.unreadCount++
        this.hasNewMessage = true
      }
    }
  }
}
</script>

<style scoped>
.chat-toggle-container {
  position: relative;
}

.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 9999;
  font-size: 24px;
  color: white;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.6);
}

.chat-toggle-btn.btn-active {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
}

.chat-toggle-btn.btn-active:hover {
  box-shadow: 0 6px 25px rgba(239, 68, 68, 0.6);
}

.chat-toggle-btn.btn-pulsing {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.8);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  }
}

.icon-container {
  color: white;
  transition: transform 0.3s ease;
}

.chat-toggle-btn:hover .icon-container {
  transform: scale(1.1);
}

.icon {
  font-size: 24px;
}

.notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid white;
  animation: badgeBounce 0.5s ease;
}

@keyframes badgeBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.chat-tooltip {
  position: absolute;
  bottom: 75px;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 10000;
}

.chat-toggle-btn:hover .chat-tooltip {
  opacity: 1;
}

.chat-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 20px;
  border: 6px solid transparent;
  border-top-color: rgba(0, 0, 0, 0.8);
}

.tooltip-content {
  display: flex;
  align-items: center;
}

.tooltip-content i {
  margin-right: 8px;
}

.tooltip-arrow {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(0, 0, 0, 0.8);
  position: absolute;
  top: -6px;
  right: 20px;
}

.tooltip-visible {
  opacity: 1;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .chat-toggle-btn {
    bottom: 15px;
    right: 15px;
    width: 50px;
    height: 50px;
  }
  
  .icon {
    font-size: 20px;
  }
  
  .notification-badge {
    width: 20px;
    height: 20px;
    font-size: 9px;
    top: -6px;
    right: -6px;
  }
  
  .chat-tooltip {
    bottom: 65px;
    font-size: 11px;
    padding: 6px 10px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .chat-tooltip {
    background: rgba(255, 255, 255, 0.9);
    color: #1f2937;
  }
  
  .chat-tooltip::after {
    border-top-color: rgba(255, 255, 255, 0.9);
  }
}

/* Accessibility improvements */
.chat-toggle-btn:focus {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .chat-toggle-btn,
  .icon-container,
  .notification-badge {
    animation: none;
    transition: none;
  }
  
  .chat-toggle-btn.btn-pulsing {
    animation: none;
  }
}

.ripple-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.ripple-active {
  animation: ripple 1s ease;
}

@keyframes ripple {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.icon-bounce {
  animation: bounce 1s ease;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

.badge-animate {
  animation: badge-pulse 1s ease;
}

@keyframes badge-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style> 