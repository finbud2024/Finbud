<template>
  <div class="home-container">
    <div v-if="authStore.isAuthenticated" class="sidebar-container">
      <button class="toggle-sidebar-btn" @click="toggleSidebar">☰</button>
      <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"></div>
      <SideBar :class="{ 'is-visible': isSidebarVisible }" :threads="threads" @add-thread="addThread"
        @edit-thread="editThread" @save-thread-name="saveThreadName" @cancel-edit="cancelEdit"
        @select-thread="selectThread" />
    </div>
    <div class="chat-container">
      <ChatHeader :threadId="currentThread.id" />
      <ChatFrame>
        <MessageComponent 
          v-for="(message, index) in messages" 
          :key="index" 
          :is-user="message.isUser"
          :text="message.text" 
          :typing="message.typing"
          :htmlContent="message.htmlContent"
          :timestamp="message.timestamp"
          :username="message.isUser ? displayName : 'FinBud Bot'" 
          :avatar-src="message.isUser ? userAvatar : botAvatar" 
        />
      </ChatFrame>
      <UserInput @send-message="sendMessage" @clear-message="clearMessage" />
    </div>
    <button class="guidance-btn" @click="showGuidance = true">Guidance</button>
    <GuidanceModal v-if="showGuidance" @close="showGuidance = false" :showModal="showGuidance"/>
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

export default {
  name: 'ChatView',
  props: ['threadId'],
  components: { ChatHeader, ChatFrame, MessageComponent, UserInput, SideBar, GuidanceModal },
  data() {
    return {
      newMessage: '',
      messages: [], 
      displayName : JSON.parse(localStorage.getItem('user')).identityData.displayName,
      userAvatar: JSON.parse(localStorage.getItem('user')).identityData.profilePicture,
      botAvatar: require('@/assets/bot.png'),
      currentThread: {},
      threads: [], 
      isSidebarVisible: false,
      showGuidance: false // Add state for showing guidance modal
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
    async updateCurrentThread(currentThreadId) {
      try {
        this.messages = [];
        this.addTypingResponse("Hello!", false);

        const thread = this.threads.find(thread => thread.id.toString() === currentThreadId);
        if (thread) {
          this.currentThread = thread;
        }
        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${currentThreadId}`;
        const chats = await axios.get(chatApi);
        const chatsData = chats.data;
        chatsData.forEach(chat => {
          const prompt = {
            text: chat.prompt.toString(),
            isUser: true,
            typing: true,
            timestamp: chat.creationDate,
          };
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
    },
    async saveThreadName({ newName, index }) {
      this.threads[index].name = newName;
      this.threads[index].editing = false;
      try {
        console.log("save edit")
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads/${this.threads[index].id}`;
        const reqBody = { title: newName };
        const updatedThread = await axios.put(api, reqBody);
        console.log(updatedThread);
      } catch (err) {
        console.error('Error on saving thread name:', err);
      }
    },
    cancelEdit(index) {
      console.log("here: ", this.threads[index]);
      this.threads[index].editing = false;
      console.log("cancel edit")
    },
    selectThread(index) {
      this.updateCurrentThread(this.threads[index].id);
      this.threads.forEach((thread, i) => {
        thread.clicked = i === index;
      });
    },
    async sendMessage(newMessage) {
      this.messages.push({
        text: newMessage.trim(),
        isUser: true,
        typing: true,
        timestamp: new Date().toLocaleTimeString()
      });

      const userMessage = newMessage.trim();
      console.log('User message:', userMessage);
      const answers = [];
      // HANDLE DEFINE
      if (userMessage.toLowerCase().includes("define")) {
        try {
          const term = userMessage.substring(userMessage.toLowerCase().indexOf("define") + "define".length).trim();
          const prompt = `Explain ${term} to me as if I'm 15.`;
          const gptResponse = await gptServices(prompt);
          answers.push(gptResponse);
        } catch (err) {
          console.error('Error in define message:', error);
        }
      }
      // HANDLE BUY
      if (userMessage.toLowerCase().includes("buy")) {
        try {
          const buyRegex = /#buy\s+([A-Z]+)\s+(\d+)/i;
          const match = userMessage.match(buyRegex);
          if (match) {
            const stockSymbol = match[1].toUpperCase();
            const quantity = parseInt(match[2], 10);
            if (stockSymbol && !isNaN(quantity)) {
              const url = this.$router.resolve({
                path: '/stock-simulator',
                query: { symbol: stockSymbol, quantity }
              }).href;
              window.open(url, '_blank');
            } else {
              this.addTypingResponse('Invalid stock symbol or quantity', false);
            }
          } else {
            this.addTypingResponse('Invalid buy command format', false);
          }
        } catch (err) {
          console.error('Error in buy message:', err);
        }
      }
      // HANDLE SELL
      else if (userMessage.toLowerCase().includes("sell")) {
        try {
          const sellRegex = /#sell\s+([A-Z]+)\s+(\d+)/i;
          const match = userMessage.match(sellRegex);
          if (match) {
            const stockSymbol = match[1].toUpperCase();
            const quantity = parseInt(match[2], 10);
            if (stockSymbol && !isNaN(quantity)) {
              const url = this.$router.resolve({
                path: '/stock-simulator',
                query: { symbol: stockSymbol, quantity: -quantity }
              }).href;
              window.open(url, '_blank');
            } else {
              this.addTypingResponse('Invalid stock symbol or quantity', false);
            }
          } else {
            this.addTypingResponse('Invalid sell command format', false);
          }
        } catch (err) {
          console.error('Error in sell message:', err);
        }
      }
      // HANDLE ADD TRANSACTION
      else if (userMessage.toLowerCase().includes("#add")) {
        try {
          const match = userMessage.match(/#add\s+([\w\s]+)\s+(\d+)/i);
          if (match) {
            const description = match[1].trim();
            const amount = parseInt(match[2], 10);
            const balance = await this.calculateNewBalance(amount);
            await this.addTransaction(description, amount, balance);
            answers.push([`Transaction added: ${description}, $${amount}. New balance: $${balance}.`]);
          } else {
            answers.push(['Please specify the description and amount you want to add.']);
          }
        } catch (err) {
          console.error('Error in add transaction:', err);
        }
      }
      // HANDLE SPEND TRANSACTION
      else if (userMessage.toLowerCase().includes("#spend")) {
        try {
          const match = userMessage.match(/#spend\s+([\w\s]+)\s+(\d+)/i);
          if (match) {
            const description = match[1].trim();
            const amount = -parseInt(match[2], 10);
            const balance = await this.calculateNewBalance(amount);
            await this.addTransaction(description, amount, balance);
            answers.push([`Transaction spent: ${description}, $${Math.abs(amount)}. New balance: $${balance}.`]);
          } else {
            answers.push(['Please specify the description and amount you want to spend.']);
          }
        } catch (err) {
          console.error('Error in spend transaction:', err);
        }
      }
      // HANDLE STOCK 
      else if (this.extractStockCode(userMessage)) {
        try {
          const stockCode = this.extractStockCode(userMessage)[0];
          const stockResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${process.env.VUE_APP_ALPHA_VANTAGE_API_KEY}`);
          const stockData = stockResponse.data;
          const price = stockData['Global Quote']['05. price'];
          const timeStamp = new Date().toLocaleTimeString();
          let alphavantageResponse = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;
          answers.push(alphavantageResponse);
          //chatgpt api
          const prompt = `Generate a detailed analysis of ${stockCode} which currently trades at $${price}.`;
          const gptResponse = await gptServices(prompt);
          answers.push(gptResponse);
        } catch (err) {
          console.error('Error in stock message:', err);
        }
      }
      // RETURNS CRYPTO TABLE
      else if (userMessage.toLowerCase().includes("#crypto")) {
        //FETCHING COIN DATA

        let coinData = [];
        try {
          const res = await axios.get("https://api.coinranking.com/v2/coins?timePeriod=7d", {
            headers: { 'x-access-token': process.env.VUE_APP_COINRANKING_KEY }
          });
          coinData = res.data.data.coins;
        } catch (error) {
          console.error('Failed to fetch cr quotes:', error);
        }
        let tableTemplate = `
        <div style="font-weight: 900; font-size: 30px"> Top 5 Ranking Coins </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Rank</th>
              <th>Tier</th>
              <th>Price</th>
              <th>Symbol</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody id="tableBody" class="table-body">`;
        coinData.slice(0, 5).map((item) => {
          tableTemplate += `
            <tr>
              <td><img style="width: 50px; aspect-ratio: 1;" src=${item.iconUrl} alt=${item.name}>${item.name}</td>
              <td>${item.rank}</td>
              <td>${item.tier}</td>
              <td>${parseFloat(item.price).toFixed(2)}$</td>
              <td>${item.symbol}</td>
              <td>${item.change}</td>
            </tr>
          `;
        });
        tableTemplate += `</tbody></table>`;
        this.messages.push({
          text: ``,
          htmlContent: tableTemplate,
          isUser: false,
          typing: true,
          timestamp: new Date().toLocaleTimeString()
        });
      }
      // RETURNS REALESTATE TABLE
      else if (userMessage.toLowerCase().includes("#realestate")) {
        let userInputToken = userMessage.toLowerCase().split(/\s+/);
        let searchLocation;
        if (userInputToken.length > 1) {
          userInputToken = userInputToken.slice(1, userInputToken.length);
          searchLocation = userInputToken.join(' ');
        } else {
          searchLocation = "san jose";
        }
        let propertiesData = [];
        const API_KEY = process.env.VUE_APP_REAL_ESTATE_KEY;
        const BASE_URL = 'https://zillow-com1.p.rapidapi.com/propertyExtendedSearch';
        try {
          const response = await axios.get(BASE_URL, {
            params: { location: searchLocation },
            headers: {
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
            },
          });
          propertiesData = response.data.props;
        } catch (error) {
          console.error('Error fetching property data:', error);
        }
        let tableTemplate = `
        <div style="font-weight: 900; font-size: 30px"> Listing of 5 Properties in ${searchLocation} </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Type</th>
              <th>Address</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="tableBody" class="table-body">`;
        propertiesData.slice(0, 5).map((item) => {
          tableTemplate += `
            <tr>
              <td><img style="width: 50px; aspect-ratio: 1;" src=${item.imgSrc} alt="propertyImage"></td>
              <td>${item.propertyType}</td>
              <td>${item.address}</td>
              <td>${item.price}$</td>
              <td>${item.listingStatus}</td>
            </tr>`;
        });
        tableTemplate += `</tbody></table>`;
        this.messages.push({
          text: ``,
          htmlContent: tableTemplate,
          isUser: false,
          typing: true,
          timestamp: new Date().toLocaleTimeString()
        });
      }
      // HANDLE GENERAL 
      else {
        try {
          const prompt = userMessage;
          const gptResponse = await gptServices(prompt);
          answers.push(gptResponse);
        } catch (err) {
          console.error('Error in general message:', error);
        }
      }
      answers.forEach(answer => {
        this.addTypingResponse(answer, false);
      });
      //save chat to backend
      try {
        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats`;
        const reqBody = {
          prompt: userMessage,
          response: answers,
          threadId: this.currentThread.id,
        };
        const chat = await axios.post(chatApi, reqBody);
      } catch (err) {
        console.error('Error on saving chat:', err);
      }
    },
    async handleAddTransaction(userMessage) {
      const match = userMessage.match(/#add\s+([\w\s]+)\s+(\d+)/i);
      if (match) {
        const description = match[1].trim();
        const amount = parseInt(match[2], 10);
        const balance = await this.calculateNewBalance(amount);
        await this.addTransaction(description, amount, balance);
        return [`Transaction added: ${description}, $${amount}. New balance: $${balance}.`];
      } else {
        return ['Please specify the description and amount you want to add.'];
      }
    },
    async handleSpendTransaction(userMessage) {
      const match = userMessage.match(/#spend\s+([\w\s]+)\s+(\d+)/i);
      if (match) {
        const description = match[1].trim();
        const amount = -parseInt(match[2], 10);
        const balance = await this.calculateNewBalance(amount);
        await this.addTransaction(description, amount, balance);
        return [`Transaction spent: ${description}, $${Math.abs(amount)}. New balance: $${balance}.`];
      } else {
        return ['Please specify the description and amount you want to spend.'];
      }
    },
    async addTransaction(description, amount, balance) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
          description,
          amount,
          balance,
          date: new Date().toISOString(),
          userId: localStorage.getItem('token')
        });
      } catch (error) {
        console.error('Error adding transaction:', error);
        this.addTypingResponse('Error adding transaction.', false);
      }
    },
    async calculateNewBalance(amount) {
      try {
        const userId = localStorage.getItem('token');
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${userId}`);
        const transactions = response.data;
        const currentBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
        return currentBalance + amount;
      } catch (error) {
        console.error('Error calculating new balance:', error);
        throw error;
      }
    },
    extractStockCode(message) {
      const pattern = /\b[A-Z]{3,5}\b/g;
      const matches = message.match(pattern);
      return matches;
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
    }
  },
  async mounted() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 500);

    if (!this.messages) {
      this.messages = [];
    }

    const userId = localStorage.getItem('token');
    console.log(userId);
    const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;

    const historyThreads = await axios.get(threadApi);
    const historyThreadsData = historyThreads.data;
    console.log(historyThreadsData);
    if (historyThreadsData.length === 0) {
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

.guidance-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.guidance-btn:hover {
  background-color: #2980b9;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.3s, opacity 0.3s ease-in-out;
}

.sidebar-overlay.show {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-content {
  background: white;
  padding: 20px;
  border-radius: 8px 0 0 8px;
  max-width: 500px;
  width: 80%;
  height: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.sidebar-overlay.show .sidebar-content {
  transform: translateX(0);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.guidance-text {
  margin-top: 20px;
}
</style>
