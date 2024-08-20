<template>
  <div class="home-container">
    <div v-if="overlayEnabled" class="overlay"/>
    <div v-if="authStore.isAuthenticated" class="sidebar-container">
      <font-awesome-icon
        class="toggle-sidebar-btn"
        @click="toggleSidebar"
        icon="fa-solid fa-bars"
      />
      <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"></div>
      <SideBar
        :class="{ 'is-visible': isSidebarVisible }"
        :threads="threads"
        @add-thread="addThread"
        @edit-thread="editThread"
        @save-thread-name="saveThreadName"
        @cancel-edit="cancelEdit"
        @select-thread="selectThread"
      />
    </div>
    <ChatComponent />
    <div 
      class="guidance-btn" 
      :class="{ 'is-guidance-visible': showGuidance }"
      @click="showGuidance = true"
    >
      <div class="guidance-image-container">
        <img class="guidance-image" src="../assets/botrmbg.png" alt="Finbud" />
      </div>
      <span class="guidance-text">Guidance</span>
    </div>
    <GuidanceModal  v-if="showGuidance" @close="showGuidance = false" :showModal="showGuidance" />
  </div>
</template>

<script>
import authStore from "@/authStore";
import axios from "axios";
import ChatComponent from "@/components/ChatComponent.vue";
// import SourceComponent from "@/components/SourceComponent.vue";
// import FollowUpComponent from "@/components/FollowUpComponent.vue";

import SideBar from "../components/SideBar.vue";
import GuidanceModal from "../components/GuidanceModal.vue";
import { gptServices } from "../services/gptServices.js";
import { getSources, getVideos, getRelevantQuestions } from '../services/serperService.js';

export default {
  name: "ChatView",
  props: ["threadId"],
  components: {
    ChatComponent,
    SideBar,
    GuidanceModal ,
    // SourceComponent,
    // FollowUpComponent,
  },
  data() {
    return {
      currentThread: {},
      threads: [],
      isSidebarVisible: false,
      showGuidance: false,
      overlayEnabled: false, //overlay to darken the chat screen when new window popsup
      newWindow: null, //new window to referrence to other
      windowCheckInterval: null,
    };
  },
  computed: {
    authStore() {
      return authStore;
    },
  },
  watch: {
    threadId: {
      immediate: true,
      handler(newThreadId) {
        if (newThreadId != null) {
          this.updateCurrentThread(newThreadId);
        }
      },
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    closeSidebar() {
      this.isSidebarVisible = false;
    },
    async updateCurrentThread(currentThreadId) {
      try {
        this.messages = [];
        const botInstruction = `Hello ${this.displayName}!\nPlease click "Guidance" for detailed instructions on how to use the chatbot.`;
        this.addTypingResponse(botInstruction, false);

        const thread = this.threads.find(
          (thread) => thread.id.toString() === currentThreadId
        );
        if (thread) {
          this.currentThread = thread;
        }
        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${currentThreadId}`;
        const chats = await axios.get(chatApi);
        const chatsData = chats.data;
        if (Array.isArray(chatsData)) {
          chatsData.forEach((chat) => {
            const prompt = {
              text: chat.prompt.toString(),
              isUser: true,
              typing: true,
              timestamp: chat.creationDate,
              sources: chat.sources,
              videos: chat.videos,
              relevantQuestions: chat.followUpQuestions
            };
            this.messages.push(prompt);
            const responses = chat.response;
            if (Array.isArray(responses)) {
              responses.forEach((responseData) => {
                const response = {
                  text: responseData,
                  isUser: false,
                  typing: true,
                  timestamp: chat.creationDate,
                  sources: chat.sources,
                  videos: chat.videos,
                  relevantQuestions: chat.followUpQuestions
                };
                this.messages.push(response);
              });
            }
          });
        } else {
          console.error('Error: chatsData is not an array');
        }

        // Scroll to the bottom after loading messages
        await this.scrollChatFrameToBottom();

      } catch (err) {
        console.error("Error on updating to current thread:", err);
      }
    },
    async addThread(newThread) {
      try {
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const userId = localStorage.getItem("token");
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        newThread.id = thread.data._id;
        this.threads.push(newThread);
      } catch (err) {
        console.error("Error on adding new thread:", err);
      }
    },
    editThread(index) {
      this.threads[index].editing = true;
    },
    async saveThreadName({ newName, index }) {
      this.threads[index].name = newName;
      this.threads[index].editing = false;
      try {
        console.log("save edit");
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads/${this.threads[index].id}`;
        const reqBody = { title: newName };
        const updatedThread = await axios.put(api, reqBody);
      } catch (err) {
        console.error("Error on saving thread name:", err);
      }
    },
    cancelEdit(index) {
      this.threads[index].editing = false;
      console.log("cancel edit");
    },
    selectThread(index) {
      this.updateCurrentThread(this.threads[index].id);
      this.threads.forEach((thread, i) => {
        thread.clicked = i === index;
      });
    },
    async deleteThread(index) {
      const threadId = this.threads[index].id;
      try {
        // Step 1: delete all chats associated with this threadId
        const deleteChatsApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${threadId}`;
        await axios.delete(deleteChatsApi);

        // Step 2: delete the thread itself
        const deleteThreadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/${threadId}`;
        await axios.delete(deleteThreadApi);

        // Remove the thread from the list in the UI
        this.threads.splice(index, 1);
        
        // If there are still threads left, select the first one; otherwise, clear the chat and thread state
        if (this.threads.length > 0) {
          this.selectThread(0);
        } else {
          this.currentThread = {};
          this.messages = [];
        }
      } catch (err) {
        console.error('Error on deleting thread or its associated chats:', err);
      }
    },
   
    //USED IN BUY/SELL/ADD/SPEND/(QUIZ?)
    openNewWindow(url) {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const width = screenWidth * 0.7; // 80% of screen width
      const height = screenHeight * 0.53; // 80% of screen height
      const left = (screenWidth - width) / 2;
      const top = (screenHeight - height) / 2;
      this.newWindow = window.open(
        url,
        "_blank",
        `resize=0,toolbar=0,location=0,menubar=0,width=${width},height=${height},left=${left},top=${top}`
      );

      if (this.newWindow) {
        // Set up interval to check if the window has been closed
        this.windowCheckInterval = setInterval(() => {
          if (this.newWindow.closed) {
            this.handleWindowClose();
          }
        }, 1000); // Check every second
        window.addEventListener("click", this.closeOnClickOutside);
        this.overlayEnabled = true;
      }
    },
    //HANDLE THE ABILITY TO CHECK IF USER CLICKS OUTSIDE OF THE REFERENCED WINDOW
    closeOnClickOutside(event) {
      if (this.newWindow && !this.newWindow.closed) {
        this.newWindow.close();
        this.handleWindowClose();
      }
    },
    //HANDLE CLOSE WINDOW
    handleWindowClose() {
      if (this.windowCheckInterval) {
        clearInterval(this.windowCheckInterval);
      }
      window.removeEventListener("click", this.closeOnClickOutside);
      this.overlayEnabled = false;
      this.newWindow = null;
    },
  },
  async mounted() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 500);
    const navbarHeight = document.querySelector(".nav-actions").offsetHeight;
    document.querySelector(
      ".home-container"
    ).style.height = `calc(100vh - ${navbarHeight}px)`;

    if (!this.messages) {
      this.messages = [];
    }

    if (authStore.isAuthenticated) {
      const userId = localStorage.getItem("token");
      console.log(userId);
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;

      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (historyThreadsData.length === 0) {
        const newThread = {
          name: "New Thread",
          editing: false,
          editedName: "New Chat",
          messages: [],
        };
        await this.addThread(newThread);
      } else {
        historyThreadsData.forEach((threadData) => {
          const thread = {
            id: threadData._id,
            name: threadData.title,
            editing: false,
            editedName: threadData.title,
            messages: [],
          };
          this.threads.push(thread);
        });
      }
      this.selectThread(0);
    } else {
      const botInstruction = `Hello, Guest!\nPlease click "Guidance" for detailed instructions on how to use the chatbot.\nAlso, sign in to access the full functionality of Finbud!`;
      this.addTypingResponse(botInstruction, false);
    }
  },
};
</script>
<style scoped>
.home-container {
  display: flex;
  width: 100%;
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toggle-sidebar-btn {
  display: none;
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 1000;
  color: black;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-sidebar-btn:hover {
  background-color: #2980b9;
}

.chat-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  position: relative;
}

@media (max-width: 768px) {
  .side-bar {
    display: none;
  }

  .toggle-sidebar-btn {
    display: block;
  }

  .chat-header {
    font-size: 1rem;
    padding: 10px;
  }
}

.overlay {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.side-bar.is-visible {
  display: block;
  position: fixed;
  left: 0;
  top: 0;
  width: 60%;
  height: 100%;
  background-color: rgb(248, 249, 254);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.side-bar.is-visible {
  transform: translateX(0);
}
/*______________________*/
/* Guidance CSS class*/

.guidance-btn {
  height: 50px;
  width: 130px;
  position: fixed;
  bottom: calc(15%);
  right: -105px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
}

.guidance-btn:hover {
  transform: translateX(-90px);
}

.guidance-image-container {
  margin-left: -25px;
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.guidance-image {
  width: 35px;
  aspect-ratio: 1;
  border-radius: 50%;
}

.guidance-text {
  font-size: 1.25rem;
  padding-top: 15px;
}

.is-guidance-visible {
  right: calc(25% + 19px - 80px);
}

.source-component-card,
.followup-component-card {
  width: 70%;
  margin: 0 auto;
  background-color: #f8f9fa; /* Light grey background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow */
  margin-top: 20px;
}

/* Animation for follow up and source components */
@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes highlight {
  0% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: transparent;
  }
}

.followup-component-card,
.source-component-card {
  animation: fadeInSlide 0.5s ease-out, highlight 1s ease-in-out;
}
</style>
