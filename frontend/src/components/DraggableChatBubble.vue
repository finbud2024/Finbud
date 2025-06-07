<template>
  <div
    v-if="isVisible"
    class="draggable-chat-bubble"
    :class="{ 'minimized': isMinimized, 'dragging': isDragging }"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="startDrag"
    @touchstart="startDrag"
  >
    <!-- Header -->
    <div class="bubble-header" :class="{ 'cursor-move': !isMinimized }">
      <div class="header-content">
        <div class="bot-info">
          <img :src="botAvatar" alt="FinBud" class="bot-avatar" />
          <span class="bot-name">{{ $t('chatbotBubble.chatWithFinBud') }}</span>
        </div>
        <div class="header-controls">
          <button
            @click.stop="toggleMinimize"
            class="control-btn"
            :title="isMinimized ? $t('chatbotBubble.maximize') : $t('chatbotBubble.minimize')"
          >
            <font-awesome-icon :icon="isMinimized ? 'fa-solid fa-expand' : 'fa-solid fa-minus'" />
          </button>
          <button
            @click.stop="closeBubble"
            class="control-btn close-btn"
            :title="$t('chatbotBubble.close')"
          >
            <font-awesome-icon icon="fa-solid fa-times" />
          </button>
        </div>
      </div>
    </div>

    <!-- Chat Content -->
    <div v-if="!isMinimized" class="bubble-content">
      <!-- Messages Area -->
      <div class="messages-area" ref="messagesArea">
        <div v-if="messages.length === 0" class="welcome-message">
          <h4>{{ $t('chatbotBubble.startConversation') }}</h4>
          <div class="quick-suggestions">
            <div class="suggestions-title">{{ $t('chatbotBubble.suggestions.title') }}</div>
            <div class="suggestion-chips">
              <button
                v-for="suggestion in quickSuggestions"
                :key="suggestion.key"
                @click="sendSuggestion(suggestion)"
                class="suggestion-chip"
              >
                <font-awesome-icon :icon="suggestion.icon" />
                {{ $t(`chatbotBubble.suggestions.${suggestion.key}`) }}
              </button>
            </div>
          </div>
        </div>

        <div v-for="(message, index) in messages" :key="index" class="message" :class="message.type">
          <div class="message-avatar">
            <img :src="message.type === 'user' ? userAvatar : botAvatar" :alt="message.type" />
          </div>
          <div class="message-content">
            <div class="message-text" v-html="message.text"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>

        <div v-if="isTyping" class="message bot">
          <div class="message-avatar">
            <img :src="botAvatar" alt="bot" />
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
            <div class="message-time">{{ $t('chatbotBubble.typing') }}</div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="input-area">
        <div class="input-container">
          <input
            v-model="currentMessage"
            @keypress.enter="sendMessage"
            @keydown="handleKeydown"
            :placeholder="$t('chatbotBubble.startConversation')"
            class="message-input"
            ref="messageInput"
          />
          <button @click="sendMessage" class="send-btn" :disabled="!currentMessage.trim()">
            <font-awesome-icon icon="fa-solid fa-paper-plane" />
          </button>
        </div>
        
        <!-- Enhanced Quick Suggestions -->
        <div v-if="showSmartSuggestions && smartSuggestions.length > 0" class="smart-suggestions">
          <div class="suggestions-scroll">
            <button
              v-for="suggestion in smartSuggestions"
              :key="suggestion.id"
              @click="sendSuggestion(suggestion)"
              class="smart-suggestion"
            >
              {{ suggestion.text }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bubble-footer">
        <span class="powered-by">{{ $t('chatbotBubble.poweredBy') }}</span>
      </div>
    </div>

    <!-- Drag hint -->
    <div v-if="!isMinimized && showDragHint" class="drag-hint">
      {{ $t('chatbotBubble.dragToMove') }}
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faMinus, faExpand, faTimes, faPaperPlane, 
  faLightbulb, faChartLine, faWallet, faCalculator 
} from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add(faMinus, faExpand, faTimes, faPaperPlane, faLightbulb, faChartLine, faWallet, faCalculator)

export default {
  name: 'DraggableChatBubble',
  components: {
    FontAwesomeIcon
  },
  props: {
    initialVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisible: this.initialVisible,
      isMinimized: false,
      isDragging: false,
      showDragHint: false,
      position: {
        x: window.innerWidth - 400,
        y: 100
      },
      dragOffset: { x: 0, y: 0 },
      messages: [],
      currentMessage: '',
      isTyping: false,
      showSmartSuggestions: true,
      botAvatar: require('@/assets/bot.png'),
      quickSuggestions: [
        { key: 'investment', icon: 'fa-solid fa-chart-line', text: 'Investment advice' },
        { key: 'portfolio', icon: 'fa-solid fa-wallet', text: 'Portfolio analysis' },
        { key: 'market', icon: 'fa-solid fa-lightbulb', text: 'Market insights' },
        { key: 'budgeting', icon: 'fa-solid fa-calculator', text: 'Budgeting tips' }
      ],
      smartSuggestions: []
    }
  },
  computed: {
    userAvatar() {
      return this.$store.getters['users/userProfileImage'] || require('@/assets/anonymous.png')
    }
  },
  mounted() {
    this.initializeSmartSuggestions()
    // Save position to localStorage
    const savedPosition = localStorage.getItem('chatBubblePosition')
    if (savedPosition) {
      this.position = JSON.parse(savedPosition)
    }
    
    // Ensure bubble stays within viewport
    this.constrainPosition()
    
    // Listen for window resize
    window.addEventListener('resize', this.constrainPosition)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.constrainPosition)
  },
  methods: {
    show() {
      this.isVisible = true
    },
    hide() {
      this.isVisible = false
    },
    toggle() {
      this.isVisible = !this.isVisible
    },
    toggleMinimize() {
      this.isMinimized = !this.isMinimized
      if (!this.isMinimized) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    closeBubble() {
      this.isVisible = false
      this.$emit('close')
    },
    startDrag(event) {
      if (this.isMinimized || event.target.closest('.bubble-content')) return
      
      this.isDragging = true
      this.showDragHint = false
      
      const clientX = event.clientX || event.touches[0].clientX
      const clientY = event.clientY || event.touches[0].clientY
      
      this.dragOffset = {
        x: clientX - this.position.x,
        y: clientY - this.position.y
      }
      
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
      document.addEventListener('touchmove', this.onDrag)
      document.addEventListener('touchend', this.stopDrag)
      
      event.preventDefault()
    },
    onDrag(event) {
      if (!this.isDragging) return
      
      const clientX = event.clientX || event.touches[0].clientX
      const clientY = event.clientY || event.touches[0].clientY
      
      this.position = {
        x: clientX - this.dragOffset.x,
        y: clientY - this.dragOffset.y
      }
      
      this.constrainPosition()
    },
    stopDrag() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onDrag)
      document.removeEventListener('mouseup', this.stopDrag)
      document.removeEventListener('touchmove', this.onDrag)
      document.removeEventListener('touchend', this.stopDrag)
      
      // Save position
      localStorage.setItem('chatBubblePosition', JSON.stringify(this.position))
    },
    constrainPosition() {
      const maxX = window.innerWidth - 320
      const maxY = window.innerHeight - (this.isMinimized ? 60 : 500)
      
      this.position.x = Math.max(0, Math.min(this.position.x, maxX))
      this.position.y = Math.max(0, Math.min(this.position.y, maxY))
    },
    async sendMessage() {
      if (!this.currentMessage.trim()) return
      
      const userMessage = this.currentMessage.trim()
      this.messages.push({
        type: 'user',
        text: userMessage,
        timestamp: new Date()
      })
      
      this.currentMessage = ''
      this.isTyping = true
      
      // Generate contextual suggestions based on user input
      this.smartSuggestions = this.generateSmartSuggestions(userMessage)
      
      // Simulate typing delay for more natural conversation
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700))
      
      const botResponse = this.generateBotResponse(userMessage)
      this.messages.push({
        type: 'bot',
        text: botResponse,
        timestamp: new Date()
      })
      
      this.isTyping = false
      
      // Auto-scroll to bottom after message
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    sendSuggestion(suggestion) {
      if (typeof suggestion === 'object' && suggestion.text) {
        this.currentMessage = suggestion.text
      } else if (typeof suggestion === 'string') {
        this.currentMessage = suggestion
      } else {
        this.currentMessage = this.$t(`chatbotBubble.suggestions.${suggestion.key}`)
      }
      this.sendMessage()
    },
    generateBotResponse(userMessage) {
      const message = userMessage.toLowerCase();
      
      // Context-aware responses based on keywords
      const responsePatterns = {
        // Investment queries
        'đầu tư|investment|invest': {
          vi: [
            'Đầu tư thông minh là chìa khóa tạo dựng tài sản. Bạn có muốn tìm hiểu về các loại hình đầu tư phù hợp không?',
            'Nguyên tắc vàng: không bao giờ đầu tư số tiền bạn không thể mất. Hãy bắt đầu với một danh mục đa dạng.',
            'Thời gian trong thị trường quan trọng hơn timing thị trường. Đầu tư dài hạn thường mang lại hiệu quả tốt hơn.'
          ],
          en: [
            'Smart investing is key to building wealth. Would you like to learn about suitable investment types?',
            'Golden rule: never invest money you cannot afford to lose. Start with a diversified portfolio.',
            'Time in the market is more important than timing the market. Long-term investing usually yields better results.'
          ]
        },
        
        // Portfolio management
        'danh mục|portfolio': {
          vi: [
            'Danh mục đầu tư cân bằng nên bao gồm: 60% cổ phiếu, 30% trái phiếu, 10% tài sản thay thế. Bạn muốn điều chỉnh theo độ tuổi không?',
            'Đa dạng hóa là cách duy nhất để giảm rủi ro mà không hy sinh lợi nhuận. Hãy phân bổ đầu tư qua nhiều lĩnh vực.',
            'Xem xét rebalancing danh mục mỗi quý để duy trì tỷ lệ mục tiêu và tối ưu hóa lợi nhuận.'
          ],
          en: [
            'A balanced portfolio should include: 60% stocks, 30% bonds, 10% alternative assets. Want to adjust based on age?',
            'Diversification is the only free lunch in investing. Spread investments across multiple sectors.',
            'Consider quarterly rebalancing to maintain target allocation and optimize returns.'
          ]
        },
        
        // Market analysis
        'thị trường|market|cổ phiếu|stock': {
          vi: [
            'Thị trường hiện tại đang cho thấy những tín hiệu hỗn hợp. Phân tích kỹ thuật và cơ bản đều quan trọng trong quyết định đầu tư.',
            'Volatility là bạn của nhà đầu tư dài hạn. Hãy tận dụng các đợt điều chỉnh để tích lũy thêm cổ phiếu chất lượng.',
            'Theo dõi các chỉ số kinh tế vĩ mô như GDP, lạm phát, và chính sách tiền tệ để hiểu xu hướng thị trường.'
          ],
          en: [
            'Current market shows mixed signals. Both technical and fundamental analysis are crucial for investment decisions.',
            'Volatility is a long-term investor\'s friend. Use market corrections to accumulate quality stocks.',
            'Monitor macroeconomic indicators like GDP, inflation, and monetary policy to understand market trends.'
          ]
        },
        
        // Budgeting and savings
        'ngân sách|budget|tiết kiệm|saving': {
          vi: [
            'Quy tắc 50/30/20: 50% cho nhu cầu thiết yếu, 30% cho giải trí, 20% cho tiết kiệm và đầu tư. Bạn đang áp dụng như thế nào?',
            'Bắt đầu với emergency fund 3-6 tháng chi phí sinh hoạt trước khi đầu tư. Đây là nền tảng tài chính vững chắc.',
            'Tự động hóa việc tiết kiệm bằng cách chuyển một phần lương vào tài khoản tiết kiệm ngay khi nhận lương.'
          ],
          en: [
            '50/30/20 rule: 50% for needs, 30% for wants, 20% for savings and investments. How are you applying this?',
            'Start with 3-6 months emergency fund before investing. This is your financial foundation.',
            'Automate savings by transferring a portion of salary to savings account immediately after payday.'
          ]
        }
      };

      // Find matching response pattern
      for (const [keywords, responses] of Object.entries(responsePatterns)) {
        const regex = new RegExp(keywords, 'i');
        if (regex.test(message)) {
          const langResponses = responses[this.$i18n.locale] || responses.vi;
          return langResponses[Math.floor(Math.random() * langResponses.length)];
        }
      }

      // Default responses if no pattern matches
      const defaultResponses = {
        vi: [
          'Tôi có thể giúp bạn với các câu hỏi về tài chính, đầu tư, và quản lý ngân sách. Bạn muốn biết gì cụ thể?',
          'Hãy cho tôi biết bạn quan tâm đến lĩnh vực nào: đầu tư, tiết kiệm, hay phân tích thị trường?',
          'Tôi luôn sẵn sàng hỗ trợ bạn đưa ra quyết định tài chính thông minh. Có câu hỏi gì không?'
        ],
        en: [
          'I can help you with questions about finance, investments, and budget management. What specifically would you like to know?',
          'Let me know what area interests you: investing, saving, or market analysis?',
          'I\'m here to help you make smart financial decisions. Any questions?'
        ]
      };

      const responses = defaultResponses[this.$i18n.locale] || defaultResponses.vi;
      return responses[Math.floor(Math.random() * responses.length)];
    },
    initializeSmartSuggestions() {
      this.smartSuggestions = [
        { id: 1, text: 'Phân tích cổ phiếu VCB', category: 'analysis' },
        { id: 2, text: 'Xu hướng thị trường tuần này', category: 'market' },
        { id: 3, text: 'Làm thế nào để đa dạng hóa danh mục?', category: 'investment' },
        { id: 4, text: 'Tỷ lệ lạm phát hiện tại', category: 'economic' },
        { id: 5, text: 'Lời khuyên tiết kiệm cho người mới', category: 'budgeting' }
      ]
    },
    updateSmartSuggestions(userMessage) {
      // Enhanced suggestion algorithm based on user input and context
      const message = userMessage.toLowerCase()
      let newSuggestions = []
      
      if (message.includes('cổ phiếu') || message.includes('stock')) {
        newSuggestions = [
          { id: Date.now() + 1, text: 'Phân tích RSI và MACD', category: 'technical' },
          { id: Date.now() + 2, text: 'So sánh P/E ratio ngành ngân hàng', category: 'analysis' },
          { id: Date.now() + 3, text: 'Khuyến nghị mua/bán tuần này', category: 'recommendation' }
        ]
      } else if (message.includes('thị trường')) {
        newSuggestions = [
          { id: Date.now() + 1, text: 'Tác động FED đến TTCK Việt Nam', category: 'global' },
          { id: Date.now() + 2, text: 'Dòng tiền ngoại tuần qua', category: 'flow' },
          { id: Date.now() + 3, text: 'Nhóm ngành nên đầu tư', category: 'sector' }
        ]
      } else if (message.includes('ngân sách') || message.includes('tiết kiệm')) {
        newSuggestions = [
          { id: Date.now() + 1, text: 'Kế hoạch tài chính 6 tháng', category: 'planning' },
          { id: Date.now() + 2, text: 'Đầu tư định kỳ như thế nào?', category: 'strategy' },
          { id: Date.now() + 3, text: 'Quỹ khẩn cấp cần bao nhiêu tiền?', category: 'emergency' }
        ]
      } else {
        // Default suggestions based on user behavior and popular topics
        newSuggestions = [
          { id: Date.now() + 1, text: 'Top 5 cổ phiếu đáng chú ý', category: 'trending' },
          { id: Date.now() + 2, text: 'Chiến lược đầu tư cuối năm', category: 'strategy' },
          { id: Date.now() + 3, text: 'Cập nhật lãi suất ngân hàng', category: 'rates' }
        ]
      }
      
      this.smartSuggestions = newSuggestions
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesArea = this.$refs.messagesArea
        if (messagesArea) {
          messagesArea.scrollTop = messagesArea.scrollHeight
        }
      })
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    handleKeydown(event) {
      // Handle special keys for better UX
      if (event.key === 'Escape') {
        this.toggleMinimize()
      }
    },
    generateSmartSuggestions(userMessage = '') {
      const message = userMessage.toLowerCase();
      const suggestions = [];

      // Financial keywords mapping to specific suggestions
      const keywordMappings = {
        // Investment related
        'đầu tư|investment|invest|portfolio|danh mục': [
          this.$t('chatbotBubble.suggestions.investment'),
          'Phân tích rủi ro đầu tư',
          'Chiến lược đầu tư dài hạn',
          'Đa dạng hóa danh mục'
        ],
        
        // Market analysis
        'thị trường|market|cổ phiếu|stock|crypto|tiền điện tử': [
          this.$t('chatbotBubble.suggestions.market'),
          'Phân tích kỹ thuật',
          'Xu hướng thị trường',
          'Dự báo giá cổ phiếu'
        ],
        
        // Budgeting and finance
        'ngân sách|budget|chi tiêu|tiết kiệm|saving|money|tiền': [
          this.$t('chatbotBubble.suggestions.budgeting'),
          'Lập kế hoạch tài chính',
          'Quản lý chi tiêu',
          'Mục tiêu tiết kiệm'
        ],
        
        // Risk management
        'rủi ro|risk|bảo hiểm|insurance|hedge': [
          'Quản lý rủi ro tài chính',
          'Bảo hiểm tối ưu',
          'Hedging strategies',
          'Risk assessment'
        ],
        
        // Trading
        'giao dịch|trading|mua|bán|buy|sell': [
          'Chiến lược giao dịch',
          'Timing thị trường',
          'Stop loss strategies',
          'Technical indicators'
        ],
        
        // Economic analysis
        'kinh tế|economy|inflation|lạm phát|gdp': [
          'Phân tích kinh tế vĩ mô',
          'Tác động lạm phát',
          'Economic indicators',
          'Market cycles'
        ]
      };

      // Find matching keywords and add relevant suggestions
      for (const [keywords, relatedSuggestions] of Object.entries(keywordMappings)) {
        const regex = new RegExp(keywords, 'i');
        if (regex.test(message)) {
          suggestions.push(...relatedSuggestions.slice(0, 2)); // Take first 2 suggestions
        }
      }

      // If no specific keywords found, provide general suggestions
      if (suggestions.length === 0) {
        suggestions.push(
          this.$t('chatbotBubble.suggestions.investment'),
          this.$t('chatbotBubble.suggestions.market'),
          this.$t('chatbotBubble.suggestions.budgeting'),
          'Phân tích tài chính cá nhân'
        );
      }

      // Remove duplicates and limit to 4 suggestions
      return [...new Set(suggestions)].slice(0, 4);
    }
  }
}
</script>

<style scoped>
.draggable-chat-bubble {
  position: fixed;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 9999;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: slideInFromRight 0.3s ease-out;
}

.draggable-chat-bubble.minimized {
  height: auto;
}

.draggable-chat-bubble.dragging {
  transform: rotate(2deg);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

/* Header */
.bubble-header {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 12px 16px;
  border-radius: 16px 16px 0 0;
}

.cursor-move {
  cursor: move;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bot-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bot-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.bot-name {
  font-weight: 600;
  font-size: 14px;
}

.header-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

/* Content */
.bubble-content {
  height: 420px;
  display: flex;
  flex-direction: column;
}

.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #ffffff;
}

.welcome-message {
  text-align: center;
  padding: 20px 0;
}

.welcome-message h4 {
  margin: 0 0 16px 0;
  color: #000000;
  font-size: 14px;
}

.quick-suggestions {
  margin-top: 16px;
}

.suggestions-title {
  font-size: 12px;
  color: #666666;
  margin-bottom: 8px;
  font-weight: 500;
}

.suggestion-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.suggestion-chip {
  background: white;
  border: 1px solid #cccccc;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.suggestion-chip:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

/* Messages */
.message {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.message-content {
  max-width: 80%;
}

.message.user .message-content {
  text-align: right;
}

.message-text {
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.4;
  border: 1px solid #e5e5e5;
  color: #000000;
}

.message.user .message-text {
  background: #000000;
  color: white;
  border-color: #000000;
}

.message-time {
  font-size: 10px;
  color: #666666;
  margin-top: 4px;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
}

.typing-indicator span {
  width: 6px;
  height: 6px;
  background: #666666;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
.typing-indicator span:nth-child(3) { animation-delay: 0s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* Input Area */
.input-area {
  border-top: 1px solid #e5e5e5;
  padding: 12px;
  background: white;
}

.input-container {
  display: flex;
  gap: 8px;
  align-items: center;
}

.message-input {
  flex: 1;
  border: 1px solid #cccccc;
  border-radius: 20px;
  padding: 8px 12px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #000000;
}

.send-btn {
  background: #000000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.send-btn:hover:not(:disabled) {
  background: #333333;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

/* Smart Suggestions */
.smart-suggestions {
  margin-top: 8px;
}

.suggestions-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 4px 0;
}

.suggestions-scroll::-webkit-scrollbar {
  height: 4px;
}

.suggestions-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.suggestions-scroll::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 2px;
}

.smart-suggestion {
  background: white;
  border: 1px solid #cccccc;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.smart-suggestion:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

/* Footer */
.bubble-footer {
  background: #f9f9f9;
  padding: 8px 16px;
  text-align: center;
  border-top: 1px solid #e5e5e5;
}

.powered-by {
  font-size: 10px;
  color: #666666;
}

/* Drag hint */
.drag-hint {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 1s forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .draggable-chat-bubble {
    width: 280px;
    right: 10px;
  }
  
  .bubble-content {
    height: 350px;
  }
  
  .messages-area {
    padding: 12px;
  }
}

/* Animation for bubble appearance */
@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style> 