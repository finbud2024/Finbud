<template>
  <div class="home-container">
    <SideBar
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
    </div>
  </div>
</template>

<script>
import ChatHeader from '../components/ChatHeader.vue';
import ChatFrame from '../components/ChatFrame.vue';
import MessageComponent from '../components/MessageComponent.vue';
import UserInput from '../components/UserInput.vue';
import { fetchStockPrice } from '@/services/stockServices';
import { gptAPICall } from '@/services/gptServices';
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
      this.newMessage = ''
    },
    updateCurrentThread(newThreadId) {
      console.log("Update current thread function triggered: ", newThreadId)
      const thread = this.threads.find(thread => thread.id.toString() === newThreadId);
      console.log(thread)
      if (thread) {
        this.currentThread = thread;
        this.messages = thread.messages || [];
      } else {
        console.error('Thread with ID', newThreadId, 'not found');
        this.currentThread = {};
        this.messages = [];
      }
      console.log("Current thread: ", this.currentThread)
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
      console.log("start sending message in send message..")

      this.messages.push({
        text: newMessage.trim(),
        isUser: true,
        typing: true,
        timestamp: new Date().toLocaleTimeString()
      });

      this.newMessage = '';

      const stockCode = this.extractStockCode(this.messages[this.messages.length - 1].text);
      if (stockCode.length > 0) {
        try {
          const price = await fetchStockPrice(stockCode[0]);
          const timeStamp = new Date().toLocaleTimeString();
          console.log("This is time stamp when asking about stock price: ", timeStamp)
          let responseText = `The current price of ${stockCode[0]} stock is $${price}, as of ${timeStamp}.`;

          this.addTypingResponse(responseText, false);

          const analysisQuestion = `Analyze the following data for Tesla:
            P/E ratio TTM: 39.31
            Price to sales TTM: 5.66
            Price to cash flow MRQ: 64.94
            Price to free cash flow TTM: 388.36
            Price to book MRQ: 8.34
            Price to tangible book MRQ: 8.39
            Profitability:
            Gross margin TTM: 17.78%
            Gross margin 5YA: 21.49%
            Operating margin TTM: 7.81%
            Operating margin 5YA: 8.96%
            Pre-tax margin TTM: 9.21%
            Pre-tax margin 5YA: 7.96%
            Net margin TTM: 14.37%
            Net margin 5YA: 7.59%
            Revenue per share TTM: 29.75
            Basic EPS ANN: 4.73
            Diluted EPS ANN: 4.3
            Book value per share MRQ: 20.21
            Tangible book value per share MRQ: 20.06
            Cash per share MRQ: 3.71
            Cash flow per share TTM: 3.45
          `;
          this.addTypingResponse(analysisQuestion, false);
          const gptResponse = await gptAPICall(analysisQuestion);
          const gptText = gptResponse.choices[0].message.content;

          this.addTypingResponse(gptText, false);

        } catch (error) {
          console.error('Error:', error);
          this.messages.push({ text: `Error fetching data for ${stockCode}.`, isUser: false, timestamp: new Date().toLocaleTimeString() });
        }
      }
      else {
        const userMessage = this.messages[this.messages.length - 1].text;
        setTimeout(() => {
          if (userMessage.toLowerCase().includes("ipo")) {
            this.addTypingResponse("IPO stands for Initial Public Offering. It's when a company sells its shares to the public for the first time. Think of it like when a company decides to let anyone buy a small piece of it.", false);
          }  else if (userMessage.toLowerCase().includes("balance sheet")) {
            this.addTypingResponse("A balance sheet is like a financial snapshot of a company at a specific point in time. It shows what the company owns (assets), what it owes (liabilities), and the value left over for the owners (equity). Think of it as a list that helps you understand a company's financial health.", false);
          }  else if (userMessage.toLowerCase().includes("define bond")) {
            this.addTypingResponse("Bonds are loans from investors to companies or governments. Investors receive regular interest payments and get their money back when the bond matures. Think of it like lending money to a friend with a promise. When you give them the money, they agree to pay you back a little extra each month (interest) and return the full amount you lent them after a certain time (maturity).", false);
          }
          else {
            setTimeout(
              () => {
                this.addTypingResponse('I am FinBud, your AI financial assistant developed by Bui Dinh Tri. I am specially configured on the GPT-3.5 Turbo platform to provide deeper insights and expertise in finance and stock markets.', false);
              }, 300
            )
          }
        }, 2000);
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
      setTimeout(() => {
        typingMessage.text = text;
        typingMessage.typing = false;
        this.$forceUpdate();
      }, 2000);
    },

    extractStockCode(message) {
      const pattern = /\b[A-Z]{3,5}\b/g;
      const matches = message.match(pattern) || [];
      console.log("Ham extract: ", matches)
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

    async fakeResponse(message) {
      // Simulate fake response from the backend API
      return "This is a fake response to the message: " + message;
    },


    mounted() {
      // Update the current time every second
      setInterval(() => {
        this.currentTime = new Date().toLocaleTimeString();
      }, 500);
    }
  }
}
</script>


<style scoped>
.home-container {
  display: flex; /* Changes the flex-direction to row by default */
  width: 100%; /* Full width of the viewport */
  height: 100vh; /* Full height of the viewport */
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
