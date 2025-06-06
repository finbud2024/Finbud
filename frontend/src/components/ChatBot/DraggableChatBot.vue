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
          typedContent.value += word === "\n" ? "<br>" : word;
          currentWordIndex.value++;
  
          typingTimer.value = setTimeout(() => {
            typeNextWord();
          }, props.typingSpeed);
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
            typedContent.value = "";
          }, 300);
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
            }, 300);
          }, 300);
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
        if (typingTimer.value) clearTimeout(typingTimer.value);
        if (botHideTimer.value) clearTimeout(botHideTimer.value);
  
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
    left: 30px;
    top: 30%;
    width: 320px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    z-index: 100;
    transition: transform 0.3s ease;
    user-select: none;
  }

  .bot-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 0.3s ease;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border: 3px solid white;
    background-color: white;
  }

  .bot-image:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }

  .bot-message {
    margin-top: 1rem;
    background: #1a1a1a;
    color: white;
    padding: 1.5rem;
    border-radius: 15px;
    font-size: 15px;
    max-width: 300px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    line-height: 1.6;
    pointer-events: none;
  }

  .bot-message.message-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .bot-message.message-hidden {
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
  }

  .typing-animation {
    display: flex;
    gap: 0.3rem;
    justify-content: center;
    padding: 0.5rem;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 50%;
    animation: bounce 1s infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  .typed-message {
    white-space: pre-wrap;
    word-break: break-word;
  }

  .chatbot-trigger {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }
  </style>