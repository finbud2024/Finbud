<template>
  <div class="home-container">
    <div v-if="authStore.isAuthenticated" class="sidebar-container">
      <font-awesome-icon class="toggle-sidebar-btn" @click="toggleSidebar" icon="fa-solid fa-bars" />
      <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"></div>
      <SideBar :class="{ 'is-visible': isSidebarVisible }" :threads="threads" @add-thread="addThread"
        @edit-thread="editThread" @save-thread-name="saveThreadName" @cancel-edit="cancelEdit"
        @select-thread="selectThread" @delete-thread="deleteThread" />
    </div>
    <div class="chat-container">
      <ChatFrame>
        <div v-for="(message, index) in messages" :key="index">
          <!-- Message Container -->
          <div v-if="message.isUser" class="message-container">
            <section class="chat-response">
              <MessageComponent 
                :is-user="message.isUser"
                :text="message.text" 
                :typing="message.typing" 
                :htmlContent="message.htmlContent"
                :username="message.isUser ? displayName : 'FinBud Bot'"
                :avatar-src="message.isUser ? userAvatar : botAvatar"
                :sources="message.isUser ? [] : message.sources"
                :videos="message.isUser ? [] : message.videos"
                :relevantQuestions="message.isUser ? [] : message.relevantQuestions"
                @question-click="handleQuestionClick"
              />
            </section>
          </div>

          <!-- Response Container -->
          <div v-if="!message.isUser" class="message-container">
            <section class="chat-response">
              <MessageComponent 
                :is-user="message.isUser"
                :text="message.text" 
                :typing="message.typing" 
                :htmlContent="message.htmlContent"
                :username="message.isUser ? displayName : 'FinBud Bot'"
                :avatar-src="message.isUser ? userAvatar : botAvatar"
                :sources="message.isUser ? [] : message.sources"
                :videos="message.isUser ? [] : message.videos"
                :relevantQuestions="message.isUser ? [] : message.relevantQuestions"
                @question-click="handleQuestionClick"
              />
            </section>
          </div>
        </div>
      </ChatFrame>
      <UserInput @send-message="sendMessage" @clear-message="clearMessage" />
    </div>
    <div 
      class="guidance-btn" 
      :class="{ 'is-guidance-visible': showGuidance }"
      @click="showGuidance = true"
    >
      <div class="guidance-image-container">
        <img class="guidance-image" src="../assets/botrmbg.png" alt="Finbud">
      </div>
      <span class="guidance-text">Guidance</span>
    </div>
    <GuidanceModal v-if="showGuidance" @close="showGuidance = false" :showModal="showGuidance" />
  </div>
</template>

<script>
import axios from 'axios';
import ChatHeader from '../components/ChatHeader.vue';
import ChatFrame from '../components/ChatFrame.vue';
import MessageComponent from '../components/MessageComponent.vue';
import UserInput from '../components/UserInput.vue';
import SideBar from '../components/SideBar.vue';
import GuidanceModal from '../components/GuidanceModal.vue';
import authStore from '@/authStore';
import { gptServices } from '../services/gptServices.js';
import { handleDefine } from '../services/HandleDefine.js';
import { handleBuy } from '../services/HandleBuy.js';
import { handleSell } from '../services/HandleSell.js';
import { handleAddTransaction } from '../services/HandleAddTransaction.js';
import { handleSpendTransaction } from '../services/HandleSpendTransaction.js';
import { handleStock } from '../services/HandleStock.js';
import { handleReturnCryptoTable } from '../services/HandleReturnCryptoTable.js';
import { handleReturnRealEstateTable } from '../services/HandleReturnRealEstateTable.js';
import { handleGeneral } from '../services/HandleGeneral.js';
import { getSources, getVideos, getRelevantQuestions } from '../services/serperService.js';

export default {
  name: 'ChatView',
  props: ['threadId'],
  components: { ChatHeader, ChatFrame, MessageComponent, UserInput, SideBar, GuidanceModal },
  data() {
    return {
      newMessage: '',
      messages: [],
      displayName: authStore.isAuthenticated ? JSON.parse(localStorage.getItem('user')).identityData.displayName : 'User',
      userAvatar: authStore.isAuthenticated ? JSON.parse(localStorage.getItem('user')).identityData.profilePicture : require('@/assets/anonymous.png'),
      botAvatar: require('@/assets/botrmbg.png'),
      currentThread: {},
      threads: [],
      isSidebarVisible: false,
      showGuidance: false,
      sources: [],
      videos: [],
      showVideos: false,
      showSearchVideosButton: false,
      relevantQuestions: []
    };
  },
  computed: {
    authStore() {
      return authStore;
    }
  },
  watch: {
    threadId: {
      immediate: true,
      handler(newThreadId) {
        if (newThreadId != null) {
          this.updateCurrentThread(newThreadId);
        }
      }
    },
  },
  methods: {
    clearMessage() {
      this.newMessage = '';
    },
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    closeSidebar() {
      this.isSidebarVisible = false;
    },
    toggleVideos() {
      this.showVideos = !this.showVideos;
      this.showSearchVideosButton = false;
    },
    async updateCurrentThread(currentThreadId) {
      try {
        this.messages = [];
        const botInstruction = `Hello ${this.displayName}!
Please click "Guidance" for detailed instructions on how to use the chatbot.`;
        this.addTypingResponse(botInstruction, false);

        const thread = this.threads.find(thread => thread.id.toString() === currentThreadId);
        if (thread) {
          this.currentThread = thread;
        }
        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${currentThreadId}`;
        const chats = await axios.get(chatApi);
        const chatsData = chats.data;
        if (Array.isArray(chatsData)) {
          chatsData.forEach(chat => {
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
              responses.forEach(responseData => {
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
        console.error('Error on updating to current thread:', err);
      }
    },
    async addThread(newThread) {
      try {
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const userId = localStorage.getItem('token');
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        newThread.id = thread.data._id;
        this.threads.push(newThread);
      } catch (err) {
        console.error('Error on adding new thread:', err);
      }
    },
    editThread(index) {
      this.threads[index].editing = true;
      this.$nextTick(() => {
        const input = this.$refs['threadInput-' + index][0];
        if (input) {
          input.focus();
          const length = input.value.length;
          input.setSelectionRange(length, length); // Set cursor at the end
        }
      });
    },
    async saveThreadName({ newName, index }) {
      this.threads[index].name = newName;
      this.threads[index].editing = false;
      try {
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads/${this.threads[index].id}`;
        const reqBody = { title: newName };
        await axios.put(api, reqBody);
      } catch (err) {
        console.error('Error on saving thread name:', err);
      }
    },
    cancelEdit(index) {
      this.threads[index].editing = false;
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
    async scrollChatFrameToBottom() {
      await new Promise(r => setTimeout(r, 200));
      const chatFrame = document.querySelector(".chat-frame");
      chatFrame.scrollTo({
        top: chatFrame.scrollHeight,
        behavior: 'smooth'
      });
    },
    async sendMessage(newMessage) {
      const userMessage = newMessage.trim();
      if (!userMessage) {
        console.warn('User message is empty');
        return;
      }

      this.messages.push({
        text: userMessage,
        isUser: true,
        typing: true,
        timestamp: new Date().toLocaleTimeString()
      });

      console.log('User message:', userMessage);
      let answers = [];
      let newSources = [];
      let newVideos = [];
      let newRelevantQuestions = [];

      try {
        if (userMessage.toLowerCase().startsWith('#search')) {
          const searchResults = await getSources(userMessage);
          newSources = searchResults;

          newVideos = await getVideos(userMessage);

          newRelevantQuestions = await getRelevantQuestions(searchResults);

          const gptResponse = await gptServices(userMessage);
          answers.push(gptResponse);

          this.showSearchVideosButton = true;
        } else {
          this.showSearchVideosButton = false;
          if (userMessage.toLowerCase().includes("define")) {
            answers = await handleDefine(userMessage);
          } else if (userMessage.toLowerCase().includes("buy")) {
            answers = await handleBuy(userMessage, this.$router);
          } else if (userMessage.toLowerCase().includes("sell")) {
            answers = await handleSell(userMessage, this.$router);
          } else if (userMessage.toLowerCase().includes("#add")) {
            answers = await handleAddTransaction(userMessage);
          } else if (userMessage.toLowerCase().includes("#spend")) {
            answers = await handleSpendTransaction(userMessage);
          } else if (userMessage.match(/\b[A-Z]{3,5}\b/)) {
            answers = await handleStock(userMessage);
          } else if (userMessage.toLowerCase().includes("#crypto")) {
            console.log('Handling #crypto');
            const tableTemplate = await handleReturnCryptoTable();
            console.log('Table template:', tableTemplate);
            this.messages.push({
              text: '',
              htmlContent: tableTemplate,
              isUser: false,
              typing: true,
              timestamp: new Date().toLocaleTimeString()
            });
            console.log('Crypto message added');
          } else if (userMessage.toLowerCase().includes("#realestate")) {
            const tableTemplate = await handleReturnRealEstateTable(userMessage);
            this.messages.push({
              text: '',
              htmlContent: tableTemplate,
              isUser: false,
              typing: true,
              timestamp: new Date().toLocaleTimeString()
            });
          } else {
            answers = await handleGeneral(userMessage);
          }
        }
      } catch (error) {
        console.error('Error handling user message:', error);
      }

      if (answers && answers.length > 0) {
        answers.forEach(answer => {
          this.addTypingResponse(answer, false, newSources, newVideos, newRelevantQuestions);
          this.scrollChatFrameToBottom();
        });
      } else {
        console.warn('No answers were generated.');
      }

      if (authStore.isAuthenticated) {
        try {
          const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats`;
          const reqBody = {
            prompt: userMessage,
            response: answers,
            sources: newSources,
            videos: newVideos,
            followUpQuestions: newRelevantQuestions,
            threadId: this.currentThread.id,
          };
          await axios.post(chatApi, reqBody);
        } catch (err) {
          console.error('Error on saving chat:', err);
        }
      }
    },
    handleQuestionClick(question) {
      const searchQuery = `#search ${question}`;
      this.sendMessage(searchQuery);
    },
    addTypingResponse(text, isUser, sources = [], videos = [], relevantQuestions = []) {
      const typingMessage = {
        text: text,
        isUser: isUser,
        typing: true,
        timestamp: new Date().toLocaleTimeString(),
        username: isUser ? 'You' : 'FinBud Bot',
        sources: sources,
        videos: videos,
        relevantQuestions: relevantQuestions
      };
      this.messages.push(typingMessage);
      setTimeout(() => {
        typingMessage.typing = false;
        this.$forceUpdate();
      }, 1000);
    }
  },
  async mounted() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 500);
    const navbarHeight = document.querySelector('.nav-actions').offsetHeight;
    document.querySelector('.home-container').style.height = `calc(100vh - ${navbarHeight}px)`;

    if (!this.messages) {
      this.messages = [];
    }

    if (authStore.isAuthenticated) {
      const userId = localStorage.getItem('token');
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;

      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (Array.isArray(historyThreadsData) && historyThreadsData.length === 0) {
        const newThread = {
          name: 'New Thread',
          editing: false,
          editedName: 'New Chat',
          messages: []
        };
        await this.addThread(newThread);
      } else {
        historyThreadsData.forEach(threadData => {
          const thread = {
            id: threadData._id,
            name: threadData.title,
            editing: false,
            editedName: threadData.title,
            messages: []
          };
          this.threads.push(thread);
        });
      }
      this.selectThread(0);
    } else {
      const botInstruction = `Hello, Guest! Please click "Guidance" for detailed instructions on how to use the chatbot. Also, sign in to access the full functionality of Finbud!`;
      this.addTypingResponse(botInstruction, false);
    }
  }
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

</style>
