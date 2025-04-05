<template>
    <div>
      <BubbleChat /> <!-- Ensure you have the BubbleChat component imported and used -->
      <div class="bot-chat-container" :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }">
        <img 
          class="bot-image" 
          src="@/assets/botrmbg.png" 
          alt="Bot" 
          @click="toggleBotMessage"
          :class="{ 'clickable': showBot }"
        />
        <div class="bot-message" :class="{ 'message-visible': showMessage, 'message-hidden': hidingMessage }">
          <div v-if="isTyping" class="typing-animation">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div v-else class="typed-message" v-html="typedContent"></div>
        </div>
      </div>
    </div>
    <!-- Ghost div for chatbot trigger -->
    <div ref="chatbotTriggerPoint" class="chatbot-trigger"></div>
  </template>
  
  <script>
  import BubbleChat from "@/components/tax&chat/chatbox.vue";  // Make sure to import the BubbleChat component
  
  export default {
    name: 'TaxCalculator',
    components: {
      BubbleChat, // Add BubbleChat component
    },
    data() {
      return {
        // Bot Chat data
        showBot: false,
        hidingBot: false,
        showMessage: false,
        hidingMessage: false,
        isTyping: false,
        botMessage: "",
        typedContent: "", // For the typing effect
        botObserver: null,
        botHideTimer: null,
        words: [], // For word-by-word typing
        currentWordIndex: 0,
        typingSpeed: 50, // milliseconds between words
        typingTimer: null,
        messageManuallyToggled: false, // Track if the message was manually toggled
  
        userId: this.$store.getters['users/userId'],
        firstName: this.$store.getters['users/currentUser']?.identityData?.firstName || '',
        displayName: this.$store.getters['users/userDisplayName'],
        profilePic: this.$store.getters['users/userProfileImage'],
        templateChat: `Hey "Tri"! 😊 Here's a closer look at your spending:
  
  📚 You spent $1,233 on books on 03/23/2333. If it's for learning, great! Otherwise, make sure it aligns with your financial goals.
  
  🛒 You spent $425 on "shopping" across multiple entries on 09/07/2024 and 09/14/2024. Grouping these under one category might help track spending better.
  
  🚗 A -$150 car expense—if it's a refund, labeling it clearly will help with accurate tracking.
  
  Suggestions:
  
  1. Set spending caps for categories like books or shopping.
  2. Review high-cost purchases.
  3. Use consistent labels for similar expenses.
  
  Keep it chill, "Tri," and let's make smarter financial moves together!`,
      };
    },
    mounted() {
      this.setupBotObserver(); // Set up bot observer when mounted
    },
    beforeUnmount() {
      // Clean up timers and observers when the component is destroyed
      if (this.botObserver) {
        this.botObserver.disconnect();
      }
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
      }
    },
    methods: {
      // Bot Chat methods
      setupBotObserver() {
        this.$nextTick(() => {
          // Create an observer to watch when the user scrolls to the bottom of the page
          this.botObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting && !this.showBot) {
                this.startBotAnimation();
                this.botObserver.disconnect(); // Disconnect after triggering
              }
            });
          }, { threshold: 0.9 });
  
          // Observe the ghost div at the end of the page
          if (this.$refs.chatbotTriggerPoint) {
            this.botObserver.observe(this.$refs.chatbotTriggerPoint);
          }
        });
      },
      startBotAnimation() {
        if (this.typingTimer) {
          clearTimeout(this.typingTimer);
        }
        if (this.botHideTimer) {
          clearTimeout(this.botHideTimer);
        }
  
        this.hidingBot = false;
        this.hidingMessage = false;
        this.typedContent = "";
        this.messageManuallyToggled = false;
  
        this.showBot = true;
  
        setTimeout(() => {
          this.showMessage = true;
          this.isTyping = true;
  
          setTimeout(() => {
            this.isTyping = false;
            this.botMessage = this.templateChat;
            this.startWordByWordTyping();
          }, 1500);
        }, 800);
      },
      startWordByWordTyping() {
        this.words = this.botMessage.split(/( |\n)/g).filter(word => word !== "");
        this.currentWordIndex = 0;
        this.typedContent = "";
        this.typeNextWord();
      },
      typeNextWord() {
        if (this.currentWordIndex < this.words.length) {
          const word = this.words[this.currentWordIndex];
          
          if (word === "\n") {
            this.typedContent += "<br>";
          } else {
            this.typedContent += word;
          }
  
          this.currentWordIndex++;
  
          this.typingTimer = setTimeout(() => {
            this.typeNextWord();
          }, this.typingSpeed * (word.length / 2 + 1));
        } else {
          this.scheduleHideBot();
        }
      },
      scheduleHideBot() {
        if (!this.messageManuallyToggled) {
          this.botHideTimer = setTimeout(() => {
            this.hideBot();
          }, 60000);
        }
      },
      hideBot() {
        if (this.messageManuallyToggled) {
          this.hidingMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.hidingMessage = false;
          }, 500);
        } else {
          this.hidingMessage = true;
          setTimeout(() => {
            this.hidingBot = true;
            setTimeout(() => {
              this.showBot = false;
              this.showMessage = false;
              this.hidingBot = false;
              this.hidingMessage = false;
              this.typedContent = "";
            }, 1000);
          }, 500);
        }
      },
      toggleBotMessage() {
        if (!this.showBot) return;
  
        this.messageManuallyToggled = true;
  
        if (this.botHideTimer) {
          clearTimeout(this.botHideTimer);
          this.botHideTimer = null;
        }
  
        if (this.showMessage) {
          this.hidingMessage = true;
          setTimeout(() => {
            this.showMessage = false;
            this.hidingMessage = false;
          }, 500);
        } else {
          this.hidingMessage = false;
          this.showMessage = true;
  
          if (!this.isTyping && this.typedContent) {
            // Message is already typed, just show it
          } else if (!this.isTyping && !this.typedContent) {
            this.isTyping = true;
            setTimeout(() => {
              this.isTyping = false;
              this.botMessage = this.templateChat;
              this.startWordByWordTyping();
            }, 1500);
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .bot-chat-container {
    position: fixed;
    left: -350px;
    bottom: 30px;
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 15px;
    z-index: 100;
    transition: transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1s ease;
    opacity: 0;
    pointer-events: none;
  }
  
  .bot-chat-container.bot-visible {
    transform: translateX(350px);
    opacity: 1;
    pointer-events: auto;
  }
  
  .bot-message {
    margin-top: 10px;
    background: #007bff;
    color: #ffffff;
    padding: 12px 18px;
    border-radius: 18px;
    max-width: 280px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: scale(0.8) translateY(10px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  
  .bot-message.message-visible {
    opacity: 1;
    transform: scale(1) translateY(0);
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

.bot-image {
  width: 60px;
  height: auto;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.5s ease;
  border-radius: 50%;
}
  
  @keyframes typing {
    0%, 100% { opacity: 0.3; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  </style>
  