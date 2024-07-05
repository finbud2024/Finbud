<template>
  <div class="home-container">
    <button class="toggle-sidebar-btn" @click="toggleSidebar">☰</button>
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
    <div class="chat-container">
      <ChatHeader :threadId="currentThread.id" />
      <ChatFrame>
        <MessageComponent 
          v-for="(message, index) in messages" 
          :key="index" 
          :is-user="message.isUser"
          :text="message.text" 
          :typing="message.typing" 
          :timestamp="message.timestamp"
          :username="message.isUser ? 'Tri Bui' : 'FinBud Bot'" 
          :avatar-src="message.isUser ? userAvatar : botAvatar" 
        />
      </ChatFrame>
      <UserInput @send-message="sendMessage" @clear-message="clearMessage" />
    </div>3
  </div>
</template>

<script>
import axios from 'axios';
import ChatHeader from '../components/ChatHeader.vue';
import ChatFrame from '../components/ChatFrame.vue';
import MessageComponent from '../components/MessageComponent.vue';
import UserInput from '../components/UserInput.vue';
import SideBar from '../components/SideBar.vue';
import { gptResponse } from '../services/gptResponse.js';
import authStore from '@/authStore';

const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;
const ALPHA_VANTAGE_API_KEY = process.env.VUE_APP_ALPHA_VANTAGE_API_KEY;

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
  computed:{
    authStore(){
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
    async updateCurrentThread(currentThreadId) {
      try{
        this.messages = [];

        const thread = this.threads.find(thread => thread.id.toString() === currentThreadId);
        if (thread) {
          this.currentThread = thread;
        }
        console.log(this.currentThread.id);

        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${currentThreadId}`;
        const chats = await axios.get(chatApi);
        console.log(chats);
        const chatsData = chats.data;
        chatsData.forEach(chat => {
          console.log("hahaha:", chat);
          const prompt = {
            text: chat.prompt.toString(),
            isUser: true,
            typing: true,
            timestamp: chat.creationDate,
          };

          console.log("prompt:", prompt)
          this.messages.push(prompt);
          const responses = chat.response;
          responses.forEach(responseData => {
            const response = {
              text: responseData,
              isUser: false,
              typing: true,
              timestamp: chat.creationDate,
            };
            this.messages.push(response);
          });
        });
        console.log('chats:', chats);
      }catch(err){
        console.error('Error on updating to current thread:', err);
      }
    },
    async addThread(newThread) {
      try{
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;

        const userId = localStorage.getItem('token');
        const reqBody = {
          userId: userId
        }
        const thread = await axios.post(api, reqBody);

        newThread.id = thread.data._id;
        this.threads.push(newThread);
      }catch(err){
        console.error('Error on adding new thread:', err);
      }
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
      this.updateCurrentThread(this.threads[index].id);
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
        } else if (userMessage.toLowerCase().includes("#receive")) {
          await this.handleAddTransaction(userMessage);
        } else if (userMessage.toLowerCase().includes("#spend")) {
          await this.handleSpendTransaction(userMessage);
        } else {
          const stockCode = this.extractStockCode(userMessage);
          if (stockCode.length > 0) {
            answers = await this.handleStockMessage(stockCode[0]);
          } else {
            answers = await this.handleGeneralMessage(userMessage);
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

      answers.forEach(answer => {
        this.addTypingResponse(answer, false);
      })

      //save chat to backend
      try{
        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats`;
        const reqBody = {
          prompt: userMessage,
          response: answers,
          threadId: this.currentThread.id,
        };
        const chat = await axios.post(chatApi, reqBody);
      }catch(err){
        console.error('Error on saving chat:', err);
      }
    },
    async handleDefineMessage(userMessage) {
      const term = userMessage.substring(userMessage.toLowerCase().indexOf("define") + "define".length).trim();
      try {
        const answers = [];
    
        const prompt = `Explain ${term} to me as if I'm 15.`;
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const responseData = response.data;
        const answer = responseData.choices[0]?.message?.content || "";
        this.addTypingResponse(answer, false);
      } catch (err) {
        console.log(err);
      }
    },
    async handleStockMessage(stockCode) {
      const stockResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${ALPHA_VANTAGE_API_KEY}`);
      const stockData = stockResponse.data;
      const price = stockData['Global Quote']['05. price'];
      const timeStamp = new Date().toLocaleTimeString();

      let responseText = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;
      answers.push(responseText);
      //this.addTypingResponse(responseText, false);

      const prompt = `Generate a detailed analysis of ${stockCode} which currently trades at $${price}.`;
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
        }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = response.data;
      const answer = responseData.choices[0]?.message?.content || "";
      this.addTypingResponse(answer, false);
    },
    async handleGeneralMessage(userMessage) {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = response.data;
      const answer = responseData.choices[0]?.message?.content || "";
      this.addTypingResponse(answer, false);
    },
    async handleAddTransaction(userMessage) {
      const match = userMessage.match(/#receive\s+(\w+)\s+(\d+)/i);
      if (match) {
        const description = match[1];
        const amount = parseInt(match[2], 10);
        const balance = await this.calculateNewBalance(amount);
        await this.addTransaction(description, amount, balance);
      } else {
        this.addTypingResponse('Please specify the description and amount you want to add.', false);
      }
    },
    async handleSpendTransaction(userMessage) {
      const match = userMessage.match(/#spend\s+(\w+)\s+(\d+)/i);
      if (match) {
        const description = match[1];
        const amount = -parseInt(match[2], 10);
        const balance = await this.calculateNewBalance(amount);
        await this.addTransaction(description, amount, balance);
      } else {
        this.addTypingResponse('Please specify the description and amount you want to spend.', false);
      }
    },
    async addTransaction(description, amount, balance) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
          description,
          amount,
          balance,
          date: new Date().toISOString()
        });
        if (amount < 0) {
          this.addTypingResponse(`Transaction spent: ${description}, $${Math.abs(amount)}.`, false);
        } else {
          this.addTypingResponse(`Transaction received: ${description}, $${amount}.`, false);
        }
      } catch (error) {
        console.error('Error adding transaction:', error);
        this.addTypingResponse('Error adding transaction.', false);
      }
    },
    async calculateNewBalance(amount) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions`);
        const transactions = response.data;
        const currentBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        return currentBalance + amount;
      } catch (error) {
        console.error('Error calculating new balance:', error);
        throw error;
      }
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
      //console.log(typingMessage);
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
  async mounted() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 500);

    const guidanceMessage = `
    Welcome to FinBud! Here are some tips to get started:
    
    1. Stock Price Inquiry: Type the stock code in uppercase (e.g., "TSLA").
    2. Financial Term Definitions: Use "Define" followed by the term (e.g., "define IPO").
    3. General Financial Concepts & Advices: For general inquiries, use descriptive terms.
    4. Add your transaction management: Use prompt '#add your_description your_amount' (e.g., "#receive Shopping 125")
    5. Spend your transaction management: Use prompt '#spend your_description your_amount' (e.g., "#spend Shopping 125")
  `;
    if (!this.messages) {
      this.messages = [];
    }
    this.addTypingResponse(guidanceMessage.trim(), false);

    //load threads
    const userId = localStorage.getItem('token');
    console.log(userId);
    const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;

    const historyThreads = await axios.get(threadApi);
    const historyThreadsData = historyThreads.data;
    //console.log("history: ", historyThreadsData);
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
