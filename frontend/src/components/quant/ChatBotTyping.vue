<script>
export default {
  name: "ChatBotTyping",
  data() {
    return {
      partialMessage: "",
      chatbotTriggeredByScroll: false,
      chatbotMessage: "",
      typingSpeed: 30,
      showChatBubble: true,
      typingComplete: false
    }
  },
  async mounted() {
    this.startTypingEffect();
    window.addEventListener('scroll', this.handleScroll);
    // Add window resize listener

    await this.$nextTick(() => {
      this.handleScroll();
    });
  },
  beforeUnmount() {
    // Clean up all event listeners
    window.removeEventListener('scroll', this.handleScroll);
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
  methods: {
    toggleChatBubble() {
      this.chatbotTriggeredByScroll = false;
      this.startTypingEffect();
    },

    startTypingEffect() {
      this.typingComplete = false;
      this.partialMessage = "";
      const message = this.message;
      let charIndex = 0;

      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      this.typingInterval = setInterval(() => {
        if (charIndex < message.length) {
          this.partialMessage += message.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(this.typingInterval);
          this.typingInterval = null;
          this.chatbotMessage = message;
          this.typingComplete = true;
        }
      }, this.typingSpeed);
    },
    handleScroll() {
      if (this.chatbotTriggeredByScroll) return;

      const chatbotContainer = document.querySelector('.chat-bot-container');
      if (!chatbotContainer) return;

      const rect = chatbotContainer.getBoundingClientRect();
      const isVisible = (
          rect.top >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );

      if (isVisible) {
        this.startTypingEffect(this.message);
        this.chatbotTriggeredByScroll = true;
      }
    },
    formatChatMessage(message) {
      return message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    },
  },
  props: {
    message: { type: String },
  }
}
</script>

<template>
  <div class="chat-bot-container">
    <div class="chatbot-content">
      <div v-if="typingComplete" class="chat-message" v-html="formatChatMessage(message)"></div>
      <div v-else class="chat-message typing">
        <span v-html="formatChatMessage(partialMessage)"></span>
        <span class="typing-cursor">|</span>
      </div>
    </div>
    <img v-if="showChatBubble" class="finbudBot" src="@/assets/botrmbg.png" alt="Finbud" @click="toggleChatBubble" />
  </div>
</template>

<style scoped>
.chat-bot-container {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  min-height: 200px;
  height: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chatbot-content {
  display: flex;
  flex-direction: column;
}

.chat-message {
  background-color: #2196F3;
  color: white;
  border-radius: 15px;
  padding: 12px 15px;
  border: 1px solid #dee2e6;
  max-width: 85%;
  align-self: flex-start;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-left: 10px;
  margin-top: 30px;
}

.chat-message strong {
  font-weight: 600;
  color: #007bff;
}

.typing-cursor {
  animation: blink 1s infinite;
  font-weight: bold;
  display: inline;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.finbudBot {
  width: 40px;
  aspect-ratio: 1;
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.finbudBot:hover {
  transform: scale(1.1);
}
</style>