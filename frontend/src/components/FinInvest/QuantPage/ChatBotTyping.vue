<script>
export default {
  name: "ChatBotTyping",
  data() {
    return {
      partialMessage: "",
      chatbotMessage: "",
      typingSpeed: 8,
      showChatBubble: true,
      typingComplete: false
    }
  },
  async mounted() {
    this.startTypingEffect();
  },
  beforeUnmount() {
    if (this.typingInterval) {
      clearInterval(this.typingInterval);
    }
  },
  methods: {
    toggleChatBubble() {
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
      // Temporarily disable scroll handling for debugging message display
      /*
      if (this.chatbotTriggeredByScroll) return;

      const chatbotContainer = document.querySelector('.chat-bot-container');
      if (!chatbotContainer) return;

      const rect = chatbotContainer.getBoundingClientRect();
      const isVisible = (
          rect.top >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      );

      if (isVisible) {
        this.startTypingEffect(); // Note: original had this.message, but prop is this.message
        this.chatbotTriggeredByScroll = true;
      }
      */
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
  padding: 20px;
  border-radius: 15px;
  border: 1px solid var(--border-color);
  min-height: 200px;
  height: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  margin-bottom: 1rem;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
}

.chatbot-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 150px; /* Fixed minimum height to prevent layout shifts */
  max-width: 100%;
  overflow: hidden;
}

.chat-message {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: 15px;
  padding: 15px;
  border: 1px solid var(--border-color);
  width: 100%; /* Full width to prevent shifts */
  max-width: 100%;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-top: 40px; /* Space for the bot icon */
  box-shadow: var(--shadow-sm);
  transition: none; /* Disable transitions to prevent shifts */
  transform: none !important; /* Prevent transform animations */
  opacity: 1 !important; /* Prevent opacity animations */
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  box-sizing: border-box;
  hyphens: auto;
}

.chat-message strong {
  font-weight: 600;
  color: var(--text-primary);
}

.chat-message ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  max-width: 100%;
}

.chat-message li {
  margin: 0.25rem 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: var(--text-primary);
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.finbudBot {
  width: 35px;
  height: 35px;
  position: absolute;
  top: 15px;
  left: 15px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.finbudBot:hover {
  transform: scale(1.1);
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-bot-container {
    padding: 15px;
    min-height: 150px;
  }

  .chat-message {
    padding: 12px;
    font-size: 0.9rem;
    margin-top: 35px;
  }

  .finbudBot {
    width: 30px;
    height: 30px;
    top: 12px;
    left: 12px;
  }
}

@media (max-width: 480px) {
  .chat-bot-container {
    padding: 10px;
    min-height: 120px;
  }

  .chat-message {
    padding: 10px;
    font-size: 0.85rem;
    margin-top: 30px;
  }

  .finbudBot {
    width: 25px;
    height: 25px;
    top: 10px;
    left: 10px;
  }
}

/* Dark mode adjustments */
:root[data-theme="dark"] .chat-message {
  background: var(--bg-tertiary);
  border-color: var(--border-color);
}

:root[data-theme="dark"] .chat-message strong {
  color: var(--text-primary);
}
</style>