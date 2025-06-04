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
  --bot-bg: #000000;
  --bot-text: #ffffff;
  --button-bg: #000000;
  --button-hover: #1a1a1a;
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --transition: all 0.3s ease;
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
  box-shadow: var(--shadow-md);
}

/* Bot Chat Styles */
.bot-chat-container {
  position: fixed;
  left: 5px;
  top: 30%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 100;
  opacity: 1;
  pointer-events: auto;
}

.bot-image {
  width: 50px;
  height: 50px;
  display: block;
  position: relative;
  background: transparent;
  transition: var(--transition);
  cursor: pointer;
  z-index: 2;
  border-radius: 50%;
  box-shadow: var(--shadow-md);
}

.bot-image:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.bot-message {
  background: #000000;
  color: #ffffff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-top: 1rem;
  max-width: 280px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: messageSlideIn 0.3s ease;
}

.bot-message::before {
  content: '';
  position: absolute;
  left: 15px;
  top: -8px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #000000;
}

.message-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.message-hidden {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Typing Animation */
.typing-animation {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--bot-text);
  border-radius: 50%;
  animation: bounce 1s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

/* Animations */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
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

/* Responsive Design */
@media (max-width: 768px) {
  .bot-chat-container {
    width: 250px;
  }

  .bot-message {
    max-width: 220px;
    font-size: 0.9rem;
  }

  .bot-image {
    width: 40px;
    height: 40px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1f2937;
    --text-primary: #ffffff;
    --container-bg: #111827;
    --container-border: #374151;
    --bot-bg: #000000;
    --bot-text: #ffffff;
    --button-bg: #000000;
    --button-hover: #1a1a1a;
  }
}
</style>
