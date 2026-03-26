<template>
  <LoadingPage v-if="showLoadingPage" />
  <div class="nav-actions">
    <NavBar v-if="showHeader" ref="headerBar" @logo-clicked="handleLogoClick" />
    <div class="content-wrapper">
      <router-view
        @chatviewSelectingThread="loadThread"
        @finbudBotResponse="displayMessage"
        :chatBubbleThreadID="threadId"
      />
    </div>
  </div>
  <FooterBar v-if="showFooter" ref="footerBar" />
  
  
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
import NavBar from "@/components/Basic/NavBar.vue";
import FooterBar from "@/components/Basic/FooterBar.vue";
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
    LoadingPage,
  },
  data() {
    return {
      botSize: { width: 60, height: 60 },
      threadId: "",
      botMessage: "",
      displayedMessage: "",
      showBotMessage: true,
      typingSpeed: 20,
      isTyping: false,
      messageVisible: false,
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
      if (storedDarkMode === "true") {
        document.documentElement.classList.add("dark-mode");
        document.body.classList.add("dark-mode");
      } else if (storedDarkMode === "false") {
        document.documentElement.classList.remove("dark-mode");
        document.body.classList.remove("dark-mode");
      }
      /* If unset (null), keep whatever IIFE / user already applied — do not force light */
    }

    if (this.$route.query.showTutorial === "true") {
      console.log("Tutorial mode activated, forcing light mode");
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }

  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
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
      // TEMPORARILY DISABLED - FinCoin /earn endpoint causing 500 errors and logging out users
      // The /earn endpoint requires MongoDB which may not be properly connected
      // TODO: Re-enable after fixing MongoDB connection for FinCoin transactions
      console.log("Daily login reward check disabled - preventing session logout issue");
      return;
      
      /* const lastLogin = localStorage.getItem("lastLoginDate");
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
      } */
    },
    handleLogoClick() {
      this.showLoadingPage = true;
      this.loadingStartTime = Date.now();

      const minLoadingTime = 1200;
      setTimeout(() => {
        this.showLoadingPage = false;
      }, minLoadingTime);

      this.$router.push("/");
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap");

:root {
  color-scheme: light;
  /* Duolingo-inspired playful palette */
  --bg-primary: #F8FAFF;
  --content-bg: #F8FAFF;
  --text-primary: #1E293B;
  --text-secondary: #64748B;
  --nav-bg: #FFFFFF;
  --border-color: #E2E8F0;
  --link-color: #60A5FA;
  --hover-bg: #F1F5F9;
  --card-bg: #FFFFFF;
  
  /* Accent Colors */
  --fin-speak-accent: #4ADE80; /* Positive/Mint */
  --agent-button-bg-color: #A78BFA; /* Playful Purple for AI */
  --agent-button-bg-active-color: #8B5CF6;
  --error-color: #FF7A7A; /* Gentle Coral */
  --trust-color: #60A5FA; /* Soft Blue */
  --progress-color: #4ADE80;

  /* Chat Colors */
  --chat-text-color: #1E293B;
  --chat-assistant-bg-color: #ede9fe; /* Lavender */
  --chat-assistant-text-color: #1E293B;
  --chat-assistant-link-color: #60A5FA;
  --chat-assistant-code-bg-color: #F8FAFF;
  --chat-user-bg-color: #d1fae5; /* Light Mint */
  --chat-user-text-color: #064e3b;
  
  /* Shadows & Shapes */
  --shadow-color: rgba(148, 163, 184, 0.15);
  --shadow-soft: 0 8px 24px rgba(148, 163, 184, 0.12);
  --shadow-hover: 0 12px 32px rgba(148, 163, 184, 0.2);
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 9999px;

  /* Legacy vars just in case */
  --black-in-light-mode: #1E293B;
  --white-in-light-mode: #FFFFFF;
  --black-in-dark-mode: #FFFFFF;
  --white-in-dark-mode: #1E293B;
  
  --finbud-chat-sidebar-width: clamp(240px, 18vw, 300px);
  --finbud-mobile-drawer-width: min(280px, calc(100vw - 56px));
}

:root.dark-mode,
body.dark-mode {
  /* Soft dark mode, avoiding heavy finance blacks */
  --bg-primary: #1E1E2E;
  --content-bg: #1E1E2E;
  --text-primary: #F8FAFF;
  --text-secondary: #94A3B8;
  --nav-bg: #27273A;
  --border-color: #33334D;
  --link-color: #A78BFA;
  --hover-bg: #2D2D42;
  --card-bg: #27273A;
  
  --shadow-color: rgba(0, 0, 0, 0.2);
  --shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.25);
  --shadow-hover: 0 12px 32px rgba(0, 0, 0, 0.35);

  --chat-assistant-bg-color: #2D2D42;
  --chat-assistant-text-color: #F8FAFF;
  --chat-user-bg-color: #3B82F6; /* Playful blue instead of dark green to keep it crisp */
  --chat-user-text-color: #FFFFFF;
  
  --agent-button-bg-color: #A78BFA;
  --agent-button-bg-active-color: #C4B5FD;
  
  --black-in-light-mode: #FFFFFF;
  --white-in-light-mode: #1E1E2E;
  --black-in-dark-mode: #1E1E2E;
  --white-in-dark-mode: #FFFFFF;
}

html.dark-mode {
  color-scheme: dark;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

html.dark-mode body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Fin Invest — shared “We speak finance” surface (aligned with chat hero) */
.fin-speak-page {
  --fin-speak-accent: #22a36a;
  --fin-speak-heading: #1a1d26;
  --fin-speak-text: #2d3142;
  --fin-speak-muted: #5c6378;
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  color: var(--fin-speak-text);
  background: linear-gradient(180deg, #fafbfc 0%, #f4f6f9 100%) !important;
  min-height: 100vh;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.dark-mode .fin-speak-page {
  --fin-speak-accent: #34d399;
  --fin-speak-heading: #f8fafc;
  --fin-speak-text: #e2e8f0;
  --fin-speak-muted: #94a3b8;
  /* Bottom stop matches --bg-primary for seamless blend with #app */
  background: linear-gradient(180deg, #161922 0%, #12141a 100%) !important;
  color: var(--fin-speak-text);
}

.fin-speak-eyebrow {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--fin-speak-accent, #22a36a);
  margin: 0 0 0.75rem;
  text-align: center;
}

.fin-speak-hero-block {
  text-align: center;
  max-width: 42rem;
  margin: 0 auto 1.5rem;
  padding: 0.5rem 1rem 0;
}

.fin-speak-page-title {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: clamp(1.65rem, 3.5vw, 2.15rem);
  font-weight: 700;
  color: var(--fin-speak-heading, #1a1d26);
  margin: 0 0 0.5rem;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.fin-speak-lead {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--fin-speak-muted, #5c6378);
  margin: 0;
}

/* Update content area */
.content-wrapper {
  background-color: var(--content-bg);
  flex: 1;
  position: relative;
  z-index: 1;
  width: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

#app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.nav-actions {
  margin: 0px;
}

/* Main router view positioning to avoid navbar */
#app {
  padding-left: 80px;
  transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Expand margin when navbar is hovered or expanded */
.nav-bar:hover ~ #app,
.nav-bar.expanded ~ #app {
  padding-left: 280px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  #app {
    padding-left: 0;
  }
  
  .nav-bar:hover ~ #app,
  .nav-bar.expanded ~ #app {
    padding-left: 0;
  }
}

/* Chat view on mobile: lock document scroll; messages scroll inside chat frame */
html.finbud-chat-mobile-lock,
body.finbud-chat-mobile-lock {
  overflow: hidden !important;
  height: 100% !important;
  max-height: 100dvh;
}

@media (max-width: 768px) {
  html.finbud-chat-mobile-lock #app,
  body.finbud-chat-mobile-lock #app {
    height: 100%;
    max-height: 100dvh;
    min-height: 0;
    overflow: hidden;
  }

  html.finbud-chat-mobile-lock .nav-actions,
  body.finbud-chat-mobile-lock .nav-actions {
    min-height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 100dvh;
  }

  html.finbud-chat-mobile-lock .content-wrapper,
  body.finbud-chat-mobile-lock .content-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
    align-items: stretch;
  }
}

/* Theme transitions — keep narrow to avoid layout thrash / broken paints in dark mode */
@media (prefers-reduced-motion: no-preference) {
  body,
  #app,
  .content-wrapper {
    transition: background-color 0.2s ease, color 0.2s ease;
  }
}

/* Surfaces — do not target .container globally (breaks mixed layouts & dark mode) */
.card,
.dropdown-menu {
  background-color: var(--card-bg);
  color: var(--text-primary);
  border-color: var(--border-color);
  border-radius: var(--radius-lg, 24px);
  box-shadow: var(--shadow-soft);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.nav-actions {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: transparent;
  color: inherit;
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
  font-family: "Noto Sans", system-ui, sans-serif;
  overflow-x: hidden;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

html {
  height: 100%;
  scrollbar-gutter: stable;
  background-color: var(--bg-primary);
}

/* Default link appearance (theme-aware; avoid hard-coded black borders) */
a {
  color: var(--link-color);
}

a:hover {
  color: var(--text-primary);
}
</style>

<style scoped>
.nav-actions {
  margin: 0px;
}

.content-wrapper {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.bot-message-container {
  position: fixed;
  z-index: 9999;
  bottom: 20px;
  right: 20px;
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
