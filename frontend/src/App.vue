<template>
  <div class="nav-actions">
    <NavBar v-if="showHeader" ref="headerBar" />
    <div class="content"></div>
  </div>
  <router-view 
    @chatviewSelectingThread="loadThread" 
    @finbudBotResponse="displayMessage"
    :chatBubbleThreadID="threadId" />
  <FooterBar v-if="showFooter" ref="footerBar" />
  <ChatBubble v-if="showChatBubble && chatBubbleActive"
    @closeChatBubble="toggleChatBubble"
    :chatViewThreadID="threadId" />
  <img v-if="showChatBubble" class="finbudBot" src="./assets/botrmbg.png" alt="Finbud" @click="toggleChatBubble" ref="finbudBot"/>
  
  <div v-if="showBotMessage" class="bot-message-container">
    <div class="finbudBotMessage" 
         ref="botMessage" 
         :class="{ 'message-visible': messageVisible }">
      <div class="message-content" v-html="displayedMessage"></div>
      <div class="messageConnector"></div>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import ChatBubble from "./components/ChatBubble.vue";
import axios from "axios";
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: "App",
  components: {
    NavBar,
    FooterBar,
    ChatBubble,
  },
  data() {
    return {
      threadId: "",
      chatBubbleActive: false,
      botMessage: "",
      displayedMessage: "",
      showBotMessage: true,
      typingSpeed: 20, // milliseconds per character
      isTyping: false,
      messageVisible: false, // New property for message visibility
      isDragging: false, // Track if the bot is being dragged
      dragStartX: 0, // Initial X position when dragging starts
      dragStartY: 0, // Initial Y position when dragging starts
      initialOffsetX: 0, // Initial offset X
      initialOffsetY: 0, // Initial offset Y
    };
  },
  async mounted() {
    // Set the initial bot message
    this.displayedMessage = "Hello! Welcome to FinBud.";
    document.addEventListener('click', this.handleClickOutside);

    if (this.isAuthenticated) {
      const userId = localStorage.getItem("token");
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (historyThreadsData.length === 0) {
        // If new user with no thread, create a new one
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        this.threadId = thread._id;
      } else {
        this.threadId = historyThreadsData[0]._id;
      }
    }

    if (this.$route.query.showTutorial === 'true') {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
    }

    // Add route watcher
    this.$watch(
      () => this.$route.path,
      (newPath) => {
        if (newPath === '/event') {
          this.showEventHubGreeting();
        }
      },
      { immediate: true } // Check immediately on mount
    );

    // Add drag event listeners
    this.addDragListeners();
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['users/isAuthenticated'];
    },
    showChatBubble() {
      return (
        this.$route.path !== "/chat-view" &&
        this.$route.path !== "/login" &&
        this.$route.path !== "/signup"
      );
    },
    showFooter() {
      return (
        this.$route.path !== "/chat-view" &&
        this.$route.path !== "/quizz" &&
        !this.$route.fullPath.includes("/stock-simulator?")
      );
    },
    showHeader() {
      return true;
    },
  },
  methods: {
    addDragListeners() {
      const finbudBot = this.$refs.finbudBot;

      finbudBot.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;
        this.initialOffsetX = finbudBot.offsetLeft;
        this.initialOffsetY = finbudBot.offsetTop;
      });

      document.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
          const offsetX = e.clientX - this.dragStartX;
          const offsetY = e.clientY - this.dragStartY;
          finbudBot.style.left = `${this.initialOffsetX + offsetX}px`;
          finbudBot.style.top = `${this.initialOffsetY + offsetY}px`;
        }
      });

      document.addEventListener('mouseup', () => {
        this.isDragging = false;
      });
    },
    loadThread(chatviewThreadID) {
      this.threadId = chatviewThreadID;
    },
    toggleChatBubble() {
      this.chatBubbleActive = !this.chatBubbleActive;
    },
    displayMessage(message) {
      this.showBotMessage = true;
      this.botMessage = message;
      this.displayedMessage = message;
      
      // Add small delay before showing the message
      setTimeout(() => {
        this.messageVisible = true;
      }, 200);

      if (event) {
        event.stopPropagation();
      }
    },
    typeMessage() {
      if (this.displayedMessage.length < this.botMessage.length) {
        this.displayedMessage += this.botMessage.charAt(this.displayedMessage.length);
        setTimeout(this.typeMessage, this.typingSpeed);
      } else {
        this.isTyping = false;
      }
    },
    handleClickOutside(event) {
      const botMessage = this.$refs.botMessage;
      if (botMessage && !botMessage.contains(event.target) && 
          !event.target.closest('a') && 
          this.showBotMessage) {
        this.messageVisible = false;
        // Wait for fade out animation before hiding
        setTimeout(() => {
          this.botMessage = "";
          this.displayedMessage = "";
          this.showBotMessage = false;
        }, 300);
      }
    },
    showEventHubGreeting() {
      // Instead of static message, we'll wait for EventHub to emit the message
      // The actual message will be handled by displayMessage method
      // which is already connected to finbudBotResponse event
    },
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap");

:root {
  --finbudBotMessageBG: #007bff;
  --finbudBotMessageColor: white;
  --finbudBotMessageBorderColor: #007bff;
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --nav-bg: #ffffff;
  --border-color: #dddddd;
  --link-color: #007bff;
  --hover-bg: #024384;
  --card-bg: #ffffff;
  --content-bg: #ffffff;
  --shadow-color: #e9e2e2;
  --progress-color: #c8c5c5;
  --logo-color: #007bff
}

:root.dark-mode,
body.dark-mode {
  /* Dark theme */
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --nav-bg: #242424;
  --border-color: #404040;
  --link-color: #4da3ff;
  --hover-bg: #024384;
  --card-bg: #2d2d2d;
  --shadow-color: #0a6b10;
  --progress-color: #e9e2e2;
  --logo-color: #007bff;
  --content-bg: #736969;
}

/* Update content area */
.content {
  background-color: var(--content-bg);
}

/* Add transition for all elements */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Update common elements */
.card,
.container,
.dropdown-menu,
.nav-actions {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.dark-mode .nav-bar {
  background-color: var(--nav-bg);
}

.dark-mode .dropdown-content a:hover,
.dark-mode .dropdown-profile a:hover {
  background-color: var(--hover-bg);
}

body {
  min-height: 100%;
  margin: 0;
  padding: 0;
  font-family: Noto sans, sans-serif;
  overflow-x: none;
}

html {
  height: 100%;
  scrollbar-gutter: auto;
}
</style>

<style scoped>
.nav-actions {
  display: flex;
  flex-direction: column;
  margin: 0px;
}

.content {
  padding-top: 80px;
  flex: 1;
}

a {
  text-decoration: none;
  color: blue;
  border: 1px solid blue;
}

a:hover {
  background-color: #e7f3ff;
}

.finbudBot {
  position: fixed;
  width: 60px;
  aspect-ratio: 1;
  right: 3.125vw;
  bottom: 20px;
  z-index: 99998;
  transition: transform 0.2s ease;
  cursor:auto; /* Change cursor to indicate draggable */
}

.finbudBot:active {
  cursor: auto; /* Change cursor when dragging */
}

.finbudBot:hover {
  cursor: pointer;
  transform: scale(1.05);
}

.bot-message-container {
  position: fixed;
  z-index: 99999;
  bottom: calc(20px + 60px);
  right: calc(3.125vw + 60px);
}

.finbudBotMessage {
  width: fit-content;
  height: fit-content;
  position: relative;
  opacity: 0;
  transform: translateY(20px) scale(0.95);
  transition: all 0.3s ease-out;
}

.message-content {
  padding: 15px;
  font-size: 0.875rem;
  line-height: 1.4;
  border: 2px solid var(--finbudBotMessageBorderColor);
  border-radius: 15px;
  max-width: 300px;
  background-color: var(--finbudBotMessageBG);
  color: #ffffff;
}

/* Animation class for message visibility */
.message-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* Force all text elements inside the message to be white */
.message-content :deep(*) {
  color: #ffffff !important;
}

.message-content :deep(a) {
  color: #ffffff;
  text-decoration: underline;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.message-content :deep(a:hover) {
  color: #e0e0e0;
  background-color: transparent;
}

.messageConnector {
  width: 0;
  height: 0;
  position: absolute;
  right: -6px;
  bottom: -6px;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--finbudBotMessageBorderColor);
  transform-origin: bottom right;
  transform: rotate(15deg);
}

.blinking-cursor {
  font-weight: 100;
  font-size: 16px; /* Reduced cursor size to match new text size */
  color: #2E3D48;
  -webkit-animation: 1s blink step-end infinite;
  -moz-animation: 1s blink step-end infinite;
  -ms-animation: 1s blink step-end infinite;
  -o-animation: 1s blink step-end infinite;
  animation: 1s blink step-end infinite;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  .message-content {
    max-width: 250px;
    font-size: 0.8125rem;
    padding: 12px;
  }
  
  .bot-message-container {
    right: calc(3.125vw + 50px);
  }
}

/* Very small screens */
@media screen and (max-width: 480px) {
  .message-content {
    max-width: 200px;
    font-size: 0.75rem;
    padding: 10px;
  }
}

/* Keep existing animation keyframes */
@keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #2E3D48;
  }
}

/* Keep other existing animation keyframes */
</style>
