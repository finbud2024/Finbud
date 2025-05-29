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

export default {
  name: "QuizzPage",
  components: { quizComponent },
  data() {
    return {
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
    this.startBotAnimation();
  },
  beforeUnmount() {
    if (this.typingTimer) clearTimeout(this.typingTimer);
    if (this.botHideTimer) clearTimeout(this.botHideTimer);
  },
  methods: {
    formatQuizIntroduction() {
      return `Welcome to FinBud Quiz!\n\nHere you can:\n\n📝 Create custom learning roadmaps based on your goals and schedule\n\n🧠 Test your financial knowledge with our keyword-based quizzes\n\n💰 Earn points and rewards as you learn\n\nEnter a finance topic you’d like to learn about, or try generating a quiz with keywords like "stocks", "budgeting", or "crypto"!`;
    },
    startBotAnimation() {
      if (this.typingTimer) clearTimeout(this.typingTimer);
      if (this.botHideTimer) clearTimeout(this.botHideTimer);
      this.showBot = true;
      this.hidingBot = false;
      this.showMessage = true;
      this.hidingMessage = false;
      this.typedContent = "";
      this.isTyping = true;
      setTimeout(() => {
        this.isTyping = false;
        this.botMessage = this.formatQuizIntroduction();
        this.startRealisticTyping();
      }, 500);
    },
    startRealisticTyping() {
      this.typedContent = "";
      let charIndex = 0;
      const typeNextChar = () => {
        if (charIndex < this.botMessage.length) {
          const currentChar = this.botMessage.charAt(charIndex);
          this.typedContent += currentChar === "\n" ? "<br>" : currentChar;
          charIndex++;
          let delay = 20;
          if ([".", "!", "?"].includes(currentChar)) delay = 100;
          else if ([",", ":", ";"].includes(currentChar)) delay = 60;
          else if (currentChar === " ") delay = 20;
          else if (currentChar === "\n") delay = 150;
          else if (!isNaN(parseInt(currentChar))) delay = 30;
          else delay = Math.random() < 0.3 ? 10 : 20;
          if (Math.random() < 0.02) delay += 100;
          this.typingTimer = setTimeout(typeNextChar, delay);
        }
      };
      setTimeout(typeNextChar, 300);
    },
    toggleChat() {
      this.chatCollapsed = !this.chatCollapsed;
      if (!this.chatCollapsed && this.typedContent) {
        this.showMessage = true;
      } else if (!this.chatCollapsed && !this.typedContent) {
        this.startBotAnimation();
      }
    },
  },
};
</script>

<style scoped>
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
.quizPageContainer {
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: 1rem;
  box-sizing: border-box;
}
.container {
  width: 100%;
  max-width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--container-bg);
  border: 1px solid var(--container-border);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.bot-chat-container {
  position: fixed;
  left: 10px;
  top: 30%;
  width: 90%;
  max-width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 100;
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
  cursor: pointer;
  transition: transform 0.3s ease;
  z-index: 2;
}
.bot-image:hover {
  transform: scale(1.1);
}
.bot-visible .bot-image {
  animation: botBounce 0.6s ease-out;
}
@keyframes botBounce {
  0% { transform: translateY(20px); opacity: 0; }
  60% { transform: translateY(-5px); }
  80% { transform: translateY(2px); }
  100% { transform: translateY(0); opacity: 1; }
}
.bot-message {
  margin-top: 10px;
  background: #2196f3;
  color: white;
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
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
  background-color: white;
  opacity: 0.3;
}
.dot:nth-child(1) { animation: typing 1s infinite 0s; }
.dot:nth-child(2) { animation: typing 1s infinite 0.2s; }
.dot:nth-child(3) { animation: typing 1s infinite 0.4s; }
@keyframes typing {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
}
@media screen and (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  .bot-chat-container {
    left: 5%;
    bottom: 20px;
    top: auto;
    width: 90%;
  }
  .bot-message {
    max-width: 100%;
    font-size: 14px;
  }
}
@media screen and (max-width: 576px) {
  .bot-chat-container {
    width: 90%;
  }
  .bot-message {
    max-width: 100%;
  }
}
</style>
