  <template>
  <div class="home-container">
    <button class="toggle-sidebar-btn" @click="toggleSidebar">☰</button>
    <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"></div>
    <SideBar :class="{ 'is-visible': isSidebarVisible }" :threads="threads" @add-thread="addThread" @edit-thread="editThread" @save-thread-name="saveThreadName"
      @cancel-edit="cancelEdit" @select-thread="selectThread" />
    <div class="chat-container">
      <ChatHeader :threadId="currentThread.id" />
      <ChatFrame>
        <MessageComponent v-for="(message, index) in messages" :key="index" :is-user="message.isUser"
          :text="message.text" :typing="message.typing" :timestamp="message.timestamp"
          :username="message.isUser ? 'Tri Bui' : 'FinBud Bot'" :avatar-src="message.isUser ? userAvatar : botAvatar" />
      </ChatFrame>
      <UserInput @send-message="sendMessage" @clear-message="clearMessage" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ChatHeader from '../components/ChatHeader.vue';
import ChatFrame from '../components/ChatFrame.vue';
import MessageComponent from '../components/MessageComponent.vue';
import UserInput from '../components/UserInput.vue';
import { fetchStockPrice } from '@/services/stockServices';
import SideBar from '../components/SideBar.vue';

const apiUrl = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000' 
  : 'https://finbud-ai.netlify.app/.netlify/functions';

export default {
  name: 'ChatView',
  props: ['threadId'],
  components: {
    ChatHeader,
    ChatFrame,
    MessageComponent,
    UserInput,
    SideBar
  },
  data() {
    return {
      newMessage: '',
      messages: [],
      userAvatar: require('@/assets/tri.jpeg'),
      botAvatar: require('@/assets/bot.png'),
      currentThread: {},
      threads: [],
      isSidebarVisible: false
    };
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
    updateCurrentThread(newThreadId) {
      const thread = this.threads.find(thread => thread.id.toString() === newThreadId);
      if (thread) {
        this.currentThread = thread;
        this.messages = thread.messages || [];
      } else {
        this.currentThread = {};
        this.messages = [];
      }
    },
    addThread(newThread) {
      newThread.id = this.threads.length + 1;
      this.threads.push(newThread);
    },
    editThread(index) {
      this.threads[index].editing = true;
    },
    saveThreadName({ newName, index }) {
      this.threads[index].name = newName;
      this.threads[index].editing = false;
    },
    cancelEdit(index) {
      this.threads[index].editing = false;
    },
    selectThread(index) {
      this.updateCurrentThread(this.threads[index].id.toString());
    },
    async sendMessage(newMessage) {
      this.messages.push({
        text: newMessage.trim(),
        isUser: true,
        typing: true,
        timestamp: new Date().toLocaleTimeString()
      });

      this.newMessage = '';

      const userMessage = this.messages[this.messages.length - 1].text;

      try {
        if (userMessage.toLowerCase().includes("define")) {
          await this.handleDefineMessage(userMessage);
        } else {
          const stockCode = this.extractStockCode(userMessage);
          if (stockCode.length > 0) {
            await this.handleStockMessage(stockCode[0]);
          } else {
            await this.handleGeneralMessage(userMessage);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        this.messages.push({
          text: `Error processing your message.`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString()
        });
      }
    },

    async handleDefineMessage(userMessage) {
      const term = userMessage.substring(userMessage.toLowerCase().indexOf("define") + "define".length).trim();
      const response = await axios.post(`${apiUrl}/defineTerm`, { term });
      this.addTypingResponse(response.data.definition, false);
    },

    async handleStockMessage(stockCode) {
      const price = await fetchStockPrice(stockCode);
      const timeStamp = new Date().toLocaleTimeString();
      let responseText = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;

      this.addTypingResponse(responseText, false);

      const response = await axios.post(`${apiUrl}/analyzeStock`, { stockSymbol: stockCode });
      this.addTypingResponse(response.data.analysis, false);
    },

    async handleGeneralMessage(userMessage) {
      const response = await axios.post(`${apiUrl}/normAns`, { term: userMessage });
      this.addTypingResponse(response.data.definition, false);
    },

    addTypingResponse(text, isUser) {
      const typingMessage = {
        text: text,
        isUser: isUser,
        typing: true,
        timestamp: new Date().toLocaleTimeString(),
        username: isUser ? 'You' : 'FinBud Bot'
      };

      this.messages.push(typingMessage);
      setTimeout(() => {
        typingMessage.typing = false;
        this.$forceUpdate();
      }, 1000);
    },

    extractStockCode(message) {
      const pattern = /\b[A-Z]{3,5}\b/g;
      const matches = message.match(pattern) || [];
      return matches;
    }
  },
  mounted() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 500);

    const guidanceMessage = `
    Welcome to FinBud! Here are some tips to get started:
    
    1. Stock Price Inquiry: Type the stock code in uppercase (e.g., "TSLA").
    2. Financial Term Definitions: Use "Define" followed by the term (e.g., "define IPO").
    3. General Financial Concepts & Advices: For general inquiries, use descriptive terms.
  `;

    if (!this.messages) {
      this.messages = [];
    }
    this.addTypingResponse(guidanceMessage.trim(), false);
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  width: 100%;
  height: 100vh;
}

.toggle-sidebar-btn {
  display: none;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-sidebar-btn:hover {
  background-color: #2980b9;
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
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
  background-color: #f9f3f3;
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.side-bar.is-visible {
  transform: translateX(0);
}
</style>
