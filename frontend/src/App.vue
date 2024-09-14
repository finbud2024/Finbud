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
  <img v-if="showChatBubble" class="finbudBot" src="./assets/botrmbg.png" alt="Finbud" @click="toggleChatBubble" />
  <div v-if="showBotMessage" class="finbudBotMessage" ref="botMessage">
    {{ displayedMessage }}<span class="blinking-cursor" v-show="isTyping">|</span>
    <div class="messageConnector"></div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import FooterBar from "./components/FooterBar.vue";
import ChatBubble from "./components/ChatBubble.vue";
import axios from "axios";
export default {
  name: "App",
  components: {
    NavBar,
    FooterBar,
    ChatBubble,
  },
  data() {
    return {
      chatBubbleActive: false,
      botMessage: "",
      displayedMessage: "",
      showBotMessage: true,
      typingSpeed: 20, // milliseconds per character
      isTyping: false,
    };
  },
  async mounted() {
    this.displayedMessage = "Hello! Welcome to FinBud.";
    document.addEventListener('click', this.handleClickOutside);
    if (this.isAuthenticated) {
      const userId = localStorage.getItem("token");
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (historyThreadsData.length === 0) {
        //if new user with no thread, create a new one
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const userId = localStorage.getItem("token");
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        this.$store.dispatch("threads/updateThreadID", thread._id);
      } else {
        this.$store.dispatch("threads/updateThreadID", historyThreadsData.at(-1)._id);
      }
    }
  },
  computed: {
    isAuthenticated(){
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
      return !this.$route.fullPath.includes("/stock-simulator?");
    },
  },
  methods: {
    loadThread(chatviewThreadID) {
      this.threadId = chatviewThreadID;
    },
    toggleChatBubble() {
      this.chatBubbleActive = !this.chatBubbleActive;
    },
    displayMessage(message) {
      this.showBotMessage = true;
      this.botMessage = message;
      this.displayedMessage = message.charAt(0);
      this.isTyping = true;
      this.typeMessage();
      event.stopPropagation();
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
      if (botMessage && !botMessage.contains(event.target) && this.showBotMessage) {
        this.botMessage = "";
        this.displayedMessage = "";
        this.showBotMessage = false;
      }
      
    }
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
  z-index: 9998;
}

.finbudBot:hover {
  cursor: pointer
}

.finbudBotMessage {
  width: fit-content;
  height: fit-content;
  padding: 20px;
  font-size: clamp(0.75rem, 5.6vw, 1.25rem);
  position: fixed;
  /*  20px: bottom margin of bot image
      3.125vw: right margin of bot message
      60px: width/height of bot image
   */
  bottom: calc(20px + 60px);
  right: calc(3.125vw + 60px);
  border: 2px solid var(--finbudBotMessageBorderColor);
  border-radius: 15px;
  max-width: 18%;
  background-color: var(--finbudBotMessageBG);
  color: var(--finbudBotMessageColor);
  z-index: 9998;
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
  z-index: 9997;
}

.blinking-cursor {
  font-weight: 100;
  font-size: 20px;
  color: #2E3D48;
  -webkit-animation: 1s blink step-end infinite;
  -moz-animation: 1s blink step-end infinite;
  -ms-animation: 1s blink step-end infinite;
  -o-animation: 1s blink step-end infinite;
  animation: 1s blink step-end infinite;
}

@keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #2E3D48;
  }
}

@-moz-keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #2E3D48;
  }
}

@-webkit-keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #2E3D48;
  }
}

@-ms-keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #2E3D48;
  }
}

@-o-keyframes blink {
  from, to {
    color: transparent;
  }
  50% {
    color: #2E3D48;
  }
}

@media screen and (max-width: 768px) {
  .finbudBotMessage {
    max-width: 60%; 
  }
}

</style>
