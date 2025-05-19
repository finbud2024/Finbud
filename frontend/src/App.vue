<template>
  <LoadingPage v-if="showLoadingPage" />
  <div class="nav-actions">
    <NavBar v-if="showHeader" ref="headerBar" @logo-clicked="handleLogoClick" />
    <div class="content"></div>
  </div>
  <router-view
    @chatviewSelectingThread="loadThread"
    @finbudBotResponse="displayMessage"
    :chatBubbleThreadID="threadId"
  />
  <FooterBar v-if="showFooter" ref="footerBar" />
  <ChatBubble
    v-if="showChatBubble && chatBubbleActive"
    @closeChatBubble="toggleChatBubble"
    :chatViewThreadID="threadId"
  />
  <img
    class="finbudBot"
    :class="{ hidden: !showChatBubble }"
    src="@/assets/botrmbg_sm.webp"
    alt="Finbud"
    width="60"
    height="60"
    fetchpriority="high"
    decoding="async"
    @click="toggleChatBubble"
    :style="botPosition"
  />
  <div v-if="showBotMessage" class="bot-message-container">
    <div
      class="finbudBotMessage"
      ref="botMessage"
      :class="{ 'message-visible': messageVisible }"
    >
      <div class="message-content" v-html="displayedMessage"></div>
      <div class="messageConnector"></div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/basic/NavBar.vue";
import FooterBar from "@/components/basic/FooterBar.vue";
import ChatBubble from "./components/ChatPage/ChatBubble.vue";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import LoadingPage from "./views/Home/LoadingPage.vue";

// Initialize dark mode from localStorage before Vue loads
(function initializeDarkMode() {
  const storedDarkMode = localStorage.getItem("darkMode");
  if (storedDarkMode === "true") {
    document.documentElement.classList.add("dark-mode");
    document.body.classList.add("dark-mode");
  }
})();

export default {
  name: "App",
  components: {
    NavBar,
    FooterBar,
    ChatBubble,
    LoadingPage,
  },
  data() {
    return {
      botSize: { width: 60, height: 60 },
      threadId: "",
      chatBubbleActive: false,
      botMessage: "",
      displayedMessage: "",
      showBotMessage: true,
      typingSpeed: 20,
      isTyping: false,
      messageVisible: false,
      botPosition: { right: "20px", bottom: "20px" },
      showLoadingPage: false,
      isInitialLoad: true,
      logoClicked: false,
    };
  },
  async mounted() {
    if (this.isInitialLoad) {
      this.showLoadingPage = true;
      this.loadingStartTime = Date.now();

      const minLoadingTime = 1200;
      setTimeout(() => {
        this.showLoadingPage = false;
        this.isInitialLoad = false;
      }, minLoadingTime);
    }

    this.displayedMessage = "Hello! Welcome to FinBud.";
    document.addEventListener("click", this.handleClickOutside);

    console.log("App mounted, checking for tutorial flag");
    console.log("showTutorial query param:", this.$route.query.showTutorial);

    const isNewUser = localStorage.getItem("isNewUser") === "true";
    if (isNewUser && !this.$route.query.showTutorial) {
      console.log(
        "New user detected from localStorage, adding showTutorial param"
      );
      this.$router.replace({
        path: this.$route.path,
        query: { ...this.$route.query, showTutorial: "true" },
      });
      localStorage.removeItem("isNewUser");
    }

    setTimeout(async () => {
      await this.$store.dispatch("users/fetchCurrentUser");
      await this.checkIfUserIsNew();
      await this.checkDailyLoginReward();
    }, 0);
    const userData = this.$store.getters["users/currentUser"];

    if (this.isAuthenticated && userData) {
      const userId = userData._id;
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      try {
        const historyThreads = await axios.get(threadApi, {
          withCredentials: true,
        });
        const historyThreadsData = historyThreads.data;
        if (historyThreadsData.length === 0) {
          console.log("No threads found, creating new thread for user");
          const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
          const reqBody = { userId };
          const thread = await axios.post(api, reqBody, {
            withCredentials: true,
          });
          this.threadId = thread._id;
        } else {
          this.threadId = historyThreadsData[0]._id;
        }
      } catch (error) {
        console.error("Error fetching threads:", error);
      }

      const storedDarkMode = localStorage.getItem("darkMode");
      if (storedDarkMode !== null) {
        if (storedDarkMode === "true") {
          document.documentElement.classList.add("dark-mode");
          document.body.classList.add("dark-mode");
        } else {
          document.documentElement.classList.remove("dark-mode");
          document.body.classList.remove("dark-mode");
        }
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
        localStorage.setItem("darkMode", "false");
      }
    }

    if (this.$route.query.showTutorial === "true") {
      console.log("Tutorial mode activated, forcing light mode");
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }

    this.$watch(
      () => this.$route.path,
      (newPath) => {
        if (newPath === "/event") {
          this.showEventHubGreeting();
        }
      },
      { immediate: true }
    );

    const savedPosition = localStorage.getItem("finbudBotPosition");
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        if (this.isValidPosition(parsed)) {
          this.botPosition = parsed;
        }
      } catch (e) {
        console.warn("Invalid saved position", e);
      }
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
    showChatBubble() {
      return (
        this.$route.path !== "/chat-view" &&
        this.$route.path !== "/login" &&
        this.$route.path !== "/signup"
      );
    },
    showFooter() {
      return this.$route.path === "/about";
    },
    showHeader() {
      return true;
    },
  },
  methods: {
    loadThread(chatviewThreadID) {
      this.threadId = chatviewThreadID;
    },
    toggleChatBubble() {
      this.chatBubbleActive = !this.chatBubbleActive;
    },
    async checkIfUserIsNew() {
      if (this.isAuthenticated) {
        try {
          const response = await axios.get(
            `${process.env.VUE_APP_DEPLOY_URL}/auth/is-new-user`,
            {
              withCredentials: true,
            }
          );

          if (response.data.isNewUser) {
            console.log("User is new, showing tutorial");
            this.$router.replace({
              path: this.$route.path,
              query: { ...this.$route.query, showTutorial: "true" },
            });
          }
        } catch (error) {
          console.error("Error checking if user is new:", error);
        }
      }
    },
    displayMessage(message) {
      this.showBotMessage = true;
      this.botMessage = message;
      this.displayedMessage = message;

      setTimeout(() => {
        this.messageVisible = true;
      }, 200);

      if (event) {
        event.stopPropagation();
      }
    },
    typeMessage() {
      if (this.displayedMessage.length < this.botMessage.length) {
        this.displayedMessage += this.botMessage.charAt(
          this.displayedMessage.length
        );
        setTimeout(this.typeMessage, this.typingSpeed);
      } else {
        this.isTyping = false;
      }
    },
    handleClickOutside(event) {
      const botMessage = this.$refs.botMessage;
      if (
        botMessage &&
        !botMessage.contains(event.target) &&
        !event.target.closest("a") &&
        this.showBotMessage
      ) {
        this.messageVisible = false;
        setTimeout(() => {
          this.botMessage = "";
          this.displayedMessage = "";
          this.showBotMessage = false;
        }, 300);
      }
    },
    showEventHubGreeting() {},
    async checkDailyLoginReward() {
      const lastLogin = localStorage.getItem("lastLoginDate");
      const today = new Date().toISOString().split("T")[0];

      if (!lastLogin || lastLogin !== today) {
        try {
          await this.$store.dispatch("finCoin/earnFinCoins", {
            amount: 5,
            source: "daily_login",
            description: "Daily login reward",
          });

          localStorage.setItem("lastLoginDate", today);

          this.$notify({
            title: "Daily Login Reward",
            message: "You earned 5 FinCoins for logging in today!",
            type: "success",
            duration: 3000,
          });
        } catch (error) {
          console.error("Failed to award daily login FinCoins:", error);
        }
      }
    },
    handleLogoClick() {
      this.showLoadingPage = true;
      this.loadingStartTime = Date.now();

      const minLoadingTime = 1200;
      setTimeout(() => {
        this.showLoadingPage = false;
      }, minLoadingTime);

      this.$router.push("/");
    },
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap");

:root {
  --finbudBotMessageBG: #c8c5c5;
  --finbudBotMessageColor: #007bff;
  --finbudBotMessageBorderColor: #007bff;
  --bg-primary: #ffffff;
  --text-primary: #333333;
  --nav-bg: transparent;
  --border-color: #f5f5f5;
  --link-color: black;
  /* --hover-bg: #024384; */
  --hover-bg: #949393;
  --card-bg: #ffffff;
  --content-bg: #ffffff;
  --shadow-color: #e9e2e2;
  --progress-color: #c8c5c5;
  --logo-color: #007bff;
  --chat-text-color: #000000;
  /* --chat-message-bg-color: #f8f4f4; */
  --chat-user-bg-color: #f8f4f4;
  --chat-user-text-color: #ffffff;
  --black-in-light-mode: #000000;
  --white-in-light-mode: #ffffff;
  --agent-button-bg-active-color: #000000;
  --black-in-dark-mode: #ffffff;
  --white-in-dark-mode: #000000;
}

:root.dark-mode,
body.dark-mode {
  /* Dark theme */
  --bg-primary: #1a1a1a;
  --text-primary: #ffffff;
  --nav-bg: transparent;
  --border-color: #404040;
  --link-color: #ffffff;
  --hover-bg: #024384;
  --card-bg: #2d2d2d;
  --shadow-color: #0a6b10;
  --progress-color: #e9e2e2;
  --logo-color: #007bff;
  --content-bg: #736969;
  --chat-text-color: #ffffff;
  /* --chat-message-bg-color: #2d2d2d; */
  --chat-user-bg-color: #2d2d2d;
  --chat-user-text-color: #ffffff;
  --black-in-light-mode: #ffffff;
  --white-in-light-mode: #000000;
  --agent-button-bg-color: #007bff;
  --agent-button-bg-active-color: #ffffff;
  --black-in-dark-mode: #0f0f14;
  --white-in-dark-mode: #ffffff;
  --dark-grey: #0f0f14;
}
/* Update content area */
.content {
  margin-top: 5%;
  background-color: var(--content-bg);
}

/* Add transition for all elements */
* {
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
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
  /* padding-top: 80px; */
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
  z-index: 99998;
  transition: transform 0.2s ease, left 0.1s ease, top 0.1s ease;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.finbudBot:active {
  cursor: grabbing;
  transform: scale(1.05);
  transition: transform 0.1s ease;
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
  background-color: black;
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
  font-size: 16px;
  /* Reduced cursor size to match new text size */
  color: #2e3d48;
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
  from,
  to {
    color: transparent;
  }

  50% {
    color: #2e3d48;
  }
}

/* Keep other existing animation keyframes */
.hidden {
  opacity: 0;
  pointer-events: none;
}
</style>
