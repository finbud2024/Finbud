<template>
  <div class="quizPageContainer">
    <!-- Bot Chat Component -->
    <div
      class="bot-chat-container"
      :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }"
    >
      <img
        class="bot-image"
        src="@/assets/botrmbg.png"
        alt="Bot"
        @click="toggleChat"
      />
      <div
        class="bot-message"
        :class="{
          'message-visible': showMessage && !chatCollapsed,
          'message-hidden': hidingMessage || chatCollapsed,
        }"
      >
        <div v-if="isTyping" class="typing-animation">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div v-else class="typed-message" v-html="typedContent"></div>
      </div>
    </div>

    <div class="container">
      <quizComponent @messageToBot="$emit('finbudBotResponse', $event)" />
    </div>
  </div>
</template>

<script>
import quizComponent from "@/components/FinEdu/Quiz/quizComponent.vue";
import AOS from "aos";
import "aos/dist/aos.css";
//moving quiz into a component in case need to add more later on to Quiz Page
export default {
  name: "QuizzPage",
  components: { quizComponent },
  data() {
    return {
      // Bot Chat data
      showBot: false,
      hidingBot: false,
      showMessage: false,
      hidingMessage: false,
      isTyping: false,
      botMessage: "",
      typedContent: "",
      typingTimer: null,
      botHideTimer: null,
      chatCollapsed: false,
    };
  },
  mounted() {
    AOS.init({ duration: 800, easing: "ease-out" });

    // Start bot animation when the component is mounted
    this.startBotAnimation();
  },
  beforeUnmount() {
    // Clean up timers when the component is destroyed
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    if (this.botHideTimer) {
      clearTimeout(this.botHideTimer);
    }
  },
  methods: {
    formatQuizIntroduction() {
      return 'Welcome to FinBud Quiz!\n\nHere you can:\n\n📝 Create custom learning roadmaps based on your goals and schedule\n\n🧠 Test your financial knowledge with our keyword-based quizzes\n\n💰 Earn points and rewards as you learn\n\nEnter a finance topic you\'d like to learn about, or try generating a quiz with keywords like "stocks", "budgeting", or "crypto"!';
    },

    startBotAnimation() {
      // Reset any existing timers
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
      }

      // Always show the bot
      this.showBot = true;
      this.hidingBot = false;
      this.showMessage = true;
      this.hidingMessage = false;
      this.typedContent = "";

      // Show typing animation immediately
      this.isTyping = true;

      // After short typing animation, start character-by-character typing
      setTimeout(() => {
        this.isTyping = false;
        this.botMessage = this.formatQuizIntroduction();
        this.startRealisticTyping();
      }, 500);
    },

    startRealisticTyping() {
      // Use character-by-character typing for more realistic effect
      this.typedContent = "";
      let charIndex = 0;

      // Simplified version to address potential issues
      const typeNextChar = () => {
        if (charIndex < this.botMessage.length) {
          // Get the current character for typing
          const currentChar = this.botMessage.charAt(charIndex);

          // Add character to typed content with HTML handling
          if (currentChar === "\n") {
            this.typedContent += "<br>";
          } else {
            this.typedContent += currentChar;
          }

          charIndex++;

          // Calculate a simpler typing speed based on character type
          let delay;

          // Basic delays based on character type
          if ([".", "!", "?"].includes(currentChar)) {
            delay = Math.random() * 100 + 80; // End of sentence
          } else if ([",", ":", ";"].includes(currentChar)) {
            delay = Math.random() * 60 + 40; // Mid-sentence pause
          } else if (currentChar === " ") {
            delay = Math.random() * 20 + 10; // Word break
          } else if (currentChar === "\n") {
            delay = Math.random() * 120 + 80; // Line break
          } else if (!isNaN(parseInt(currentChar))) {
            delay = Math.random() * 25 + 15; // Numbers
          } else {
            // Regular characters with occasional speed variation
            delay =
              Math.random() < 0.3
                ? Math.random() * 8 + 5 // Fast typing (30% chance)
                : Math.random() * 15 + 10; // Normal typing (70% chance)
          }

          // Add occasional small thinking pause (2% chance)
          if (Math.random() < 0.02) {
            delay += Math.random() * 150 + 50;
          }

          // Schedule typing the next character
          this.typingTimer = setTimeout(typeNextChar, delay);
        } else {
          // Typing complete, but we no longer hide the bot
          // Bot will stay visible
        }
      };

      // Start typing with a small initial delay
      setTimeout(typeNextChar, 300);
    },

    scheduleHideBot() {
      // Bot will stay visible (function kept for compatibility)
    },

    hideMessage() {
      // Only hide the message, not the bot
      this.hidingMessage = true;

      // Reset message after animation completes
      setTimeout(() => {
        this.hidingMessage = false;
        this.showMessage = true;

        // Reset for new message
        this.typedContent = "";
        this.isTyping = true;

        // After typing animation, restart with new message
        setTimeout(() => {
          this.isTyping = false;
          this.botMessage = this.formatQuizIntroduction();
          this.startRealisticTyping();
        }, 500);
      }, 800);
    },

    hideBot() {
      // Start fade-out animations
      this.hidingMessage = true;

      // Wait for message to fade out, then hide bot
      setTimeout(() => {
        this.hidingBot = true;

        // Reset states after animations complete
        setTimeout(() => {
          this.showBot = false;
          this.showMessage = false;
          this.hidingBot = false;
          this.hidingMessage = false;
          this.typedContent = "";
        }, 500);
      }, 300);
    },

    toggleChat() {
      this.chatCollapsed = !this.chatCollapsed;

      // If expanding the chat and it was previously shown, just show it again
      if (!this.chatCollapsed && this.typedContent) {
        this.showMessage = true;
      }
      // If expanding and no content yet, restart the typing animation
      else if (!this.chatCollapsed && !this.typedContent) {
        this.startBotAnimation();
      }
    },
  },
};
</script>

<style scoped>
/* Light & Dark Mode Variables */
:root {
  --bg-primary: white;
  --text-primary: black;
  --container-bg: #f8f9fa;
  --container-border: #ddd;
}

:root.dark-mode {
  --bg-primary: #121212;
  --text-primary: #f5f5f5;
  --container-bg: #1e1e1e;
  --container-border: #444;
}

/* Quiz Page Container */
.quizPageContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
}

/* Container for Quiz Component */
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  background-color: var(--container-bg);
  border: 1px solid var(--container-border);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Bot Chat Styles - Positioned on the left side */
.bot-chat-container {
  position: fixed;
  left: 5px;
  top: 30%;
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 100;
  opacity: 1; /* Always visible */
  pointer-events: auto; /* Always interactive */
}

.bot-chat-container.bot-visible {
  opacity: 1;
}

.bot-chat-container.bot-hidden {
  opacity: 0;
  transition: opacity 0.6s ease;
}

.bot-image {
  width: 40px;
  height: auto;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.3s ease;
  cursor: pointer;
  z-index: 2;
}

.bot-image:hover {
  transform: scale(1.1);
}

.bot-visible .bot-image {
  animation: botBounce 0.6s ease-out;
}

@keyframes botBounce {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  60% {
    transform: translateY(-5px);
  }
  80% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.bot-message {
  margin-top: 10px;
  background: black;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 15px;
  max-width: 280px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease, max-height 0.4s ease;
  transition-delay: 0.2s;
  word-wrap: break-word;
  white-space: pre-line;
  max-height: 0;
  overflow: hidden;
}

.bot-message.message-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
  max-height: 1000px;
}

.bot-message.message-hidden {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  max-height: 0;
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}

.typing-animation {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.3;
}

.dot:nth-child(1) {
  animation: typing 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: typing 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: typing 1s infinite 0.4s;
}

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
}

@keyframes typing {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .container {
    width: 100%;
    padding: 15px;
  }

  .bot-chat-container {
    left: 10px;
    right: auto;
    bottom: 10px;
    top: auto;
  }

  .bot-image {
    width: 60px;
  }
}

@media screen and (max-width: 576px) {
  .bot-chat-container {
    width: 250px;
  }

  .bot-message {
    max-width: 220px;
  }
}
</style>
