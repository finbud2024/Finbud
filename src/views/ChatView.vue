<template>
  <div class="home-container">
    <SideBar /> <!-- Include the sidebar here -->
    <div class="chat-container">
      <ChatHeader :threadId="currentThread" />
      <ChatFrame>
        <MessageComponent v-for="(message, index) in messages" :key="index"
          :is-user="message.isUser" :text="message.text" :typing="message.typing"
          :timestamp="message.timestamp" :username="message.isUser ? 'Tri Bui' : 'FinBud Bot'"
          :avatar-src="message.isUser ? userAvatar : botAvatar" />
      </ChatFrame>
      <UserInput @send-message="sendMessage" @clear-message="clearMessage" />
    </div>
  </div>
</template>

<style>
.home-container {
  display: flex; /* Changes the flex-direction to row by default */
  width: 100%; /* Full width of the viewport */
  height: 100vh; /* Full height of the viewport */
}

.chat-container {
  flex-grow: 1; /* Takes up the remaining space */
  display: flex;
  flex-direction: column;
}
</style>

<script>
import ChatHeader from '../components/ChatHeader.vue';
import ChatFrame from '../components/ChatFrame.vue'
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
      currentThread: {}, // The current selected thread
    };
  },

  watch: {
    threadId: {
      immediate: true,
      handler(newThreadId) {
        console.log('Received new thread ID:', newThreadId);
        if (newThreadId != null) {
          console.log("Hello");
          this.updateCurrentThread(newThreadId);
        }
      }
    },
  },
  computed: {
    currentChatWindow() {
      // Dynamic component name based on the selected thread or default chat window
      return this.currentThread.id ? 'ChatWindow' : 'DefaultChatWindow';
    },
  },
  methods: {
    clearMessage() {
      this.newMessage = ''
    },

    updateCurrentThread(newThreadId) {
      console.log("Update current thread function triggered: ", newThreadId)
      const thread = newThreadId.toString();
      console.log(thread)
      if (thread) {
        this.currentThread = thread;
      } else {
        console.error('Thread with ID', newThreadId, 'not found');
        this.currentThread = {};
        this.messages = [];
      }
      console.log("Current thread: ", this.currentThread)
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
        if (userMessage.toLowerCase().includes("ipo")) {
          this.addTypingResponse("IPO stands for Initial Public Offering. It's when a company sells its shares to the public for the first time. Think of it like when a company decides to let anyone buy a small piece of it.", false);
        }  else if (userMessage.toLowerCase().includes("balance sheet")) {
          this.addTypingResponse("A balance sheet is like a financial snapshot of a company at a specific point in time. It shows what the company owns (assets), what it owes (liabilities), and the value left over for the owners (equity). Think of it as a list that helps you understand a company's financial health.", false);
        }  else if (userMessage.toLowerCase().includes("define bond")) {
          this.addTypingResponse("Bonds are loans from investors to companies or governments. Investors receive regular interest payments and get their money back when the bond matures. Think of it like lending money to a friend with a promise. When you give them the money, they agree to pay you back a little extra each month (interest) and return the full amount you lent them after a certain time (maturity)..", false);
        }
        else {
          setTimeout(
            () => {
              this.addTypingResponse('I am FinBud, your AI financial assistant developed by Bui Dinh Tri. I am specially configured on the GPT-3.5 Turbo platform to provide deeper insights and expertise in finance and stock markets.', false);
            }, 300
          )
        }
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
      console.log("Extracted stock codes: ", matches)
      return matches;
    },
  },

  mounted() {
    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString();
    }, 500);
  }
}
</script>

<style>
.home-container {
  width: 100%;
  box-sizing: border-box;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
