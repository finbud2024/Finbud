<template>
  <div class="home-container">
    <div class="chat-container">
      <chat-header :threadId="currentThread" />
      <chat-window>
        <message-component v-for="(message, index) in messages" :key="index" :is-user="message.isUser"
          :text="message.text" :typing="message.typing" :timestamp="message.timestamp"
          :username="message.isUser ? 'Tri Bui' : 'FinBud Bot'" :avatar-src="message.isUser ? userAvatar : botAvatar" />
      </chat-window>
      <UserInput :newMessage="message" @send-message="handleSendMessage" @clear-message="clearMessage" />

    </div>


  </div>
</template>

<script>
import ChatHeader from '../components/ChatHeader.vue';
import ChatWindow from '../components/ChatWindow.vue';
import MessageComponent from '../components/MessageComponent.vue';
import UserInput from '../components/UserInput.vue';
import { fetchStockPrice } from '@/services/stockServices';
import { gptAPICall } from '@/services/gptServices';


export default {
  name: 'HomeView',
  props: ['threadId'],
  components: {
    ChatHeader,
    ChatWindow,
    MessageComponent,
    UserInput,

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
    handleSendMessage(message, file) {
      // Logic to send the message or file
      console.log(message, file);
      this.message = ''; // Clear the message in the parent after sending
    },
    clearMessage() {
      this.message = ''; // Clear the message
    },
    updateCurrentThread(newThreadId) {
      console.log("Update current thread function triggered: ", newThreadId)
      // const thread = this.threads.find(thread => thread.id.toString() === newThreadId);
      const thread = newThreadId.toString();
      console.log(thread)
      if (thread) {
        this.currentThread = thread;
        // this.messages = thread.messages || [];
      } else {
        console.error('Thread with ID', newThreadId, 'not found');
        this.currentThread = {};
        this.messages = [];
      }
      console.log("Current thread: ", this.currentThread)
    },
    async sendMessage() {
      if (this.newMessage.trim() !== '') {

        this.messages.push({ text: this.newMessage.trim(), isUser: true, typing: true, timestamp: new Date().toLocaleTimeString() });
        // Simulate a delay for typing effect, then set typing to false

        this.newMessage = '';


        const { stockCode, shares } = this.extractSharesAndCode(this.messages[this.messages.length - 1].text);

        if (stockCode) {
          try {
            const price = await fetchStockPrice(stockCode);
            const timeStamp = new Date().toLocaleTimeString();
            console.log("This is time stamp when ask about stock price: ", timeStamp)
            let responseText = `Giá cổ phiếu ${stockCode} hiện giờ là $${price}, tính theo mốc thời gian ${timeStamp} `;
            if (shares !== null) {
              // If both stock code and shares are provided, calculate total value
              const totalValue = (Number(price) * shares).toFixed(2);
              responseText = `Bạn có ${shares} cổ phiếu ${stockCode}, với tổng trị giá là $${totalValue}.`;
              this.messages.push({ text: `Bạn có ${shares} cổ phiếu ${stockCode}, với tổng trị giá là $${totalValue}.`, isUser: false, });
            }
            this.addTypingResponse(responseText, false);
            // Send a fixed message to the GPT API asking for analysis about the company
            const analysisQuestion = `Phân tích các số liệu sau từ công ty Tesla Chỉ Số Nâng CaoTên	Công ty	Ngành
      Tỉ số P/E TTM	39.31	18.18
  Giá trên doanh thu TTM	5.66	3.93
  Giá và dòng tiền mặt MRQ	64.94	16.68
  Giá và dòng tiền mặt tự do TTM	388.36	33.6
  Giá trên giá ghi sổ sách MRQ	8.34	2.67
  Giá trên sổ sách hữu hình MRQ	8.39	0.64
        
  Khả năng sinh lợi: TTM đối với Biên Lợi Trung Bình 5 Năm TTM (%)  TB 5 năm (%)
  Lãi gộp
  Lãi gộp kinh doanh
  Tỷ lệ lời trước thuế
  Hệ số biên lợi nhuận ròng
  0%
  5%
  10%
  15%
  20%
  25%
  Hệ số biên lợi nhuận ròng
       TTM (%)	14.37%
       TB 5 năm (%)	7.59%
   
  Lãi gộp TTM	17.78%	17.76
  Lãi Gộp 5YA	21.49%	14.78
  Lãi gộp kinh doanh TTM	7.81%	-8.16
  Lãi gộp kinh doanh 5YA	8.96%	-2,221.2
  Tỷ lệ lời trước thuế TTM	9.21%	-11.27
  Tỷ lệ lời trước thuế 5YA	7.96%	-2,230.78
  Hệ số biên lợi nhuận ròng TTM	14.37%	-11.97
  Hệ số biên lợi nhuận ròng 5YA	7.59%	-2,209.64
        
  Doanh thu/Cổ phần TTM	29.75	11,209.08
  EPS cơ bản ANN	4.73	637.24
  EPS pha loãng ANN	4.3	637.15
  Giá trị sổ sách/Cổ phần MRQ	20.21	6,320.76
  Giá trị sổ sách hữu hình/Cổ phần MRQ	20.06	6,055.95
  Tiền mặt/Cổ phần MRQ	3.71	1,383.5
  Dòng tiền/Cổ phần TTM	3.45	-72.97
       `;
            const gptResponse = await gptAPICall(analysisQuestion);
            const gptText = gptResponse.choices[0].message.content;

            this.addTypingResponse(gptText, false);

          } catch (error) {
            console.error('Error:', error);
            this.messages.push({ text: `Error fetching data for ${stockCode}.`, isUser: false, timestamp: new Date().toLocaleTimeString() });
          }
        } else {
          setTimeout(
            () => {
              this.addTypingResponse('Tôi là FinBud, trợ lý AI trong lĩnh vực tài chính của bạn, phát triển bởi Bui Dinh Tri. Tôi được cấu hình đặc biệt trên nền tảng GPT-3.5 Turbo, với mục tiêu cung cấp thông tin sâu hơn và chuyên môn về tài chính và thị trường cổ phiếu.', false);
              console.log('call API: ', this.messages[this.messages.length - 1].text)
            }, 1500
          )
        }
      }


    },

    addTypingResponse(text, isUser) {
      // Add a typing message first
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
        this.$forceUpdate(); // Force update to show changes
      }, 2000); // simulate typing delay
    },

    extractStockCode(message) {
      const pattern = /\b[A-Z]{3,5}\b/g;
      const matches = message.match(pattern) || [];
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

<style>
.home-container {
  width: 100%;
  /* Ensures the container fills the viewport width */
  box-sizing: border-box;
  /* Includes padding and border in the element's total width */
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>