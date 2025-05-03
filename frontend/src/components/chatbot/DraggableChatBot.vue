<template>
    <div
      ref="botChatContainer"
      class="bot-chat-container"
      :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }"
      :style="{ transform: `translate(${xOffset}px, ${yOffset}px)` }"
    >
      <img
        class="bot-image"
        src="@/assets/botrmbg.png"
        alt="Bot"
        @click="toggleBotMessage"
        :class="{ clickable: showBot }"
      />
      <div
        class="bot-message"
        :class="{
          'message-visible': showMessage,
          'message-hidden': hidingMessage,
        }"
      >
        <div v-if="isTyping" class="typing-animation">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div v-else class="typed-message" v-html="typedContent"></div>
      </div>
      <!-- Ghost div for chatbot trigger -->
      <div ref="chatbotTriggerPoint" class="chatbot-trigger"></div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from "vue";
  
  export default {
    name: "ChatBot",
    props: {
      botMessage: {
        type: String,
        default: "Hello! How can I assist you today?",
      },
      typingSpeed: {
        type: Number,
        default: 50, // Speed in milliseconds
      },
    },
    setup(props) {
      const showBot = ref(false);
      const hidingBot = ref(false);
      const showMessage = ref(false);
      const hidingMessage = ref(false);
      const isTyping = ref(false);
      const typedContent = ref("");
      const xOffset = ref(0);
      const yOffset = ref(0);
      const isDragging = ref(false);
      const initialX = ref(0);
      const initialY = ref(0);
      const currentX = ref(0);
      const currentY = ref(0);
      const botObserver = ref(null);
      const botHideTimer = ref(null);
      const typingTimer = ref(null);
      const words = ref([]);
      const currentWordIndex = ref(0);
      const messageManuallyToggled = ref(false);
  
      const toggleBotMessage = () => {
        if (!showBot.value) return;
  
        if (showMessage.value) {
          hidingMessage.value = true;
          setTimeout(() => {
            showMessage.value = false;
            hidingMessage.value = false;
          }, 500);
        } else {
          showMessage.value = true;
          isTyping.value = true;
  
          // Simulate typing effect
          setTimeout(() => {
            isTyping.value = false;
            startWordByWordTyping();
          }, 1500);
        }
      };
  
      const startWordByWordTyping = () => {
        words.value = props.botMessage.split(/( |\n)/g).filter((word) => word !== "");
        currentWordIndex.value = 0;
        typedContent.value = "";
        typeNextWord();
      };
  
      const typeNextWord = () => {
        if (currentWordIndex.value < words.value.length) {
          const word = words.value[currentWordIndex.value];
  
          if (word === "\n") {
            typedContent.value += "<br>";
          } else {
            typedContent.value += word;
          }
  
          currentWordIndex.value++;
  
          typingTimer.value = setTimeout(() => {
            typeNextWord();
          }, props.typingSpeed * (word.length / 2 + 1));
        } else {
          scheduleHideBot();
        }
      };
  
      const scheduleHideBot = () => {
        if (!messageManuallyToggled.value) {
          botHideTimer.value = setTimeout(() => {
            hideBot();
          }, 60000); // Auto-hide after 1 minute
        }
      };
  
      const hideBot = () => {
        if (messageManuallyToggled.value) {
          hidingMessage.value = true;
          setTimeout(() => {
            showMessage.value = false;
            hidingMessage.value = false;
          }, 500);
        } else {
          hidingMessage.value = true;
          setTimeout(() => {
            hidingBot.value = true;
            setTimeout(() => {
              showBot.value = false;
              showMessage.value = false;
              hidingBot.value = false;
              hidingMessage.value = false;
              typedContent.value = "";
            }, 1000);
          }, 500);
        }
      };
  
      const dragStart = (e) => {
        e.preventDefault();
        isDragging.value = true;
        initialX.value = e.type === "touchstart" ? e.touches[0].clientX - xOffset.value : e.clientX - xOffset.value;
        initialY.value = e.type === "touchstart" ? e.touches[0].clientY - yOffset.value : e.clientY - yOffset.value;
      };
  
      const drag = (e) => {
        if (!isDragging.value) return;
  
        e.preventDefault();
        currentX.value = e.type === "touchmove" ? e.touches[0].clientX - initialX.value : e.clientX - initialX.value;
        currentY.value = e.type === "touchmove" ? e.touches[0].clientY - initialY.value : e.clientY - initialY.value;
  
        xOffset.value = Math.min(Math.max(currentX.value, 0), window.innerWidth - 300);
        yOffset.value = Math.min(Math.max(currentY.value, 0), window.innerHeight - 300);
      };
  
      const dragEnd = () => {
        isDragging.value = false;
      };
  
      const setupBotObserver = () => {
        botObserver.value = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !showBot.value) {
                startBotAnimation();
                botObserver.value.disconnect();
              }
            });
          },
          { threshold: 0.9 }
        );
  
        const triggerPoint = document.querySelector(".chatbot-trigger");
        if (triggerPoint) {
          botObserver.value.observe(triggerPoint);
        }
      };
  
      const startBotAnimation = () => {
        hidingBot.value = false;
        hidingMessage.value = false;
        typedContent.value = "";
        messageManuallyToggled.value = false;
  
        showBot.value = true;
  
        setTimeout(() => {
          showMessage.value = true;
          isTyping.value = true;
  
          setTimeout(() => {
            isTyping.value = false;
            startWordByWordTyping();
          }, 1500);
        }, 800);
      };
  
      onMounted(() => {
        const botContainer = document.querySelector(".bot-chat-container");
        botContainer.addEventListener("mousedown", dragStart);
        botContainer.addEventListener("touchstart", dragStart);
        document.addEventListener("mousemove", drag);
        document.addEventListener("touchmove", drag);
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);
  
        setupBotObserver();
      });
  
      onBeforeUnmount(() => {
        const botContainer = document.querySelector(".bot-chat-container");
        botContainer.removeEventListener("mousedown", dragStart);
        botContainer.removeEventListener("touchstart", dragStart);
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("mouseup", dragEnd);
        document.removeEventListener("touchend", dragEnd);
  
        if (botObserver.value) {
          botObserver.value.disconnect();
        }
        if (typingTimer.value) {
          clearTimeout(typingTimer.value);
        }
        if (botHideTimer.value) {
          clearTimeout(botHideTimer.value);
        }
      });
  
      return {
        showBot,
        hidingBot,
        showMessage,
        hidingMessage,
        isTyping,
        typedContent,
        xOffset,
        yOffset,
        toggleBotMessage,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add your bot chat styles here */
  .bot-chat-container {
  position: fixed;
  left: 20px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 1000;
  cursor: move;
  user-select: none;
  touch-action: none;
  transform: translate(0, 0);
}

.bot-image {
  width: 60px;
  height: 60px;
  cursor: grab;
}

.bot-image:active {
  cursor: grabbing;
}

.bot-message {
  margin-bottom: 10px;
  margin-left: 10px;
  background: #007bff;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  max-width: 280px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.bot-message.message-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.bot-message.message-hidden {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.5s ease, transform 0.5s ease;
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
  </style>