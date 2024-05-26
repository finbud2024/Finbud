<template>
  <div class="home-container">
    <SideBar :threads="threads" @add-thread="addThread" @edit-thread="editThread" @save-thread-name="saveThreadName"
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
      threads: []
    };
  },
  watch: {
    threadId: {
      immediate: true,
      handler(newThreadId) {
        console.log('Received new thread ID:', newThreadId);
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
    updateCurrentThread(newThreadId) {
      console.log("Update current thread function triggered: ", newThreadId);
      const thread = this.threads.find(thread => thread.id.toString() === newThreadId);
      console.log(thread);
      if (thread) {
        this.currentThread = thread;
        this.messages = thread.messages || [];
      } else {
        console.error('Thread with ID', newThreadId, 'not found');
        this.currentThread = {};
        this.messages = [];
      }
      console.log("Current thread: ", this.currentThread);
    },
    addThread(newThread) {
      newThread.id = this.threads.length + 1;
      this.threads.push(newThread);
      console.log("Added new thread: ", newThread);
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
    console.log("start sending message in send message..");

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

  // async handleDefineMessage(userMessage) {
  //   const term = userMessage.substring(userMessage.toLowerCase().indexOf("define") + "define".length).trim();
  //   const response = await axios.post('/.netlify/functions/defineTerm', { term });
  //   this.addTypingResponse(response.data.definition, false);
  // },

  // async handleStockMessage(stockCode) {
  //   const price = await fetchStockPrice(stockCode);
  //   const timeStamp = new Date().toLocaleTimeString();
  //   let responseText = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;

  //   this.addTypingResponse(responseText, false);

  //   const response = await axios.post('/.netlify/functions/analyzeStock', { stockSymbol: stockCode });
  //   this.addTypingResponse(response.data.analysis, false);
  // },

  // async handleGeneralMessage(userMessage) {
  //   const response = await axios.post('/.netlify/functions/normAns', { term: userMessage });
  //   this.addTypingResponse(response.data.definition, false);
  // },

  async handleDefineMessage(userMessage) {
    const term = userMessage.substring(userMessage.toLowerCase().indexOf("define") + "define".length).trim();
    const response = await axios.post('http://localhost:3000/defineTerm', { term }); // Updated URL
    this.addTypingResponse(response.data.definition, false);
},

async handleStockMessage(stockCode) {
    const price = await fetchStockPrice(stockCode);
    const timeStamp = new Date().toLocaleTimeString();
    let responseText = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;

    this.addTypingResponse(responseText, false);

    const response = await axios.post('http://localhost:3000/analyzeStock', { stockSymbol: stockCode }); // Updated URL
    this.addTypingResponse(response.data.analysis, false);
},

async handleGeneralMessage(userMessage) {
    const response = await axios.post('http://localhost:3000/normAns', { term: userMessage }); // Updated URL
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
      console.log("Ham extract: ", matches);
      return matches;
    },
    extractSharesAndCode(message) {
      // Regex to find stock codes: assumes codes are upper-case letters optionally followed by numbers
      const stockCodePattern = /\b[A-Z]{1,5}\b/g;
      // Regex to find numbers: looks for numbers that may have commas and come after the word 'shares'
      const sharesPattern = /(\b\d{1,3}(,\d{3})*\b)(?=\s*shares)/gi;

      const stockCodes = message.match(stockCodePattern);
      const sharesMatches = message.match(sharesPattern);

      let shares;
      if (sharesMatches && sharesMatches.length > 0) {
        // Remove commas and convert to integer
        shares = parseInt(sharesMatches[0].replace(/,/g, ''), 10);
      }

      // We return the first stock code found and the number of shares, if any
      return {
        stockCode: stockCodes ? stockCodes[0] : null, // Just taking the first match for simplicity
        shares: shares || null
      };
    },
    async calculateTotalValue(stockCode, shares) {
      if (!stockCode || !shares) {
        throw new Error("Stock code or number of shares missing.");
      }
      try {
        const price = await fetchStockPrice(stockCode);
        // Convert price to a number and calculate total value
        const totalValue = (Number(price) * shares).toFixed(2);
        return totalValue;
      } catch (error) {
        console.error('Error calculating total value:', error);
        throw error; // Re-throw the error to handle it in the calling function
      }
    },

  },
  mounted() {
    console.log("Component has been mounted.");
    // Update the current time every second
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 500);

    // Add the user guidance message when the page loads
    const guidanceMessage = `
    Welcome to FinBud! Here are some tips to get started:
    
    1. Stock Price Inquiry: Type the stock code in uppercase (e.g., "TSLA").
    2. Financial Term Definitions:** Use "Define" followed by the term (e.g., "define IPO").
    3. General Financial Concepts & Advices: For general inquiries, use descriptive terms.
  `;

    // Ensure messages array is ready
    if (!this.messages) {
      this.messages = [];
    }
    console.log("Guidance message added to messages.");
    this.addTypingResponse(guidanceMessage.trim(), false);
  }
};
</script>

<style scoped>
.home-container {
  display: flex;
  /* Changes the flex-direction to row by default */
  width: 100%;
  /* Full width of the viewport */
  height: 100vh;
  /* Full height of the viewport */
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
