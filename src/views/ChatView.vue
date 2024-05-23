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
          const price = await fetchStockPrice(stockCode);
          const timeStamp = new Date().toLocaleTimeString();
          let responseText = `Giá cổ phiếu ${stockCode} hiện giờ là $${price}, tính theo mốc thời gian ${timeStamp} `;
          this.addTypingResponse(responseText, false);
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
          }, 300
        )
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
      return matches;
    },

    extractSharesAndCode(message) {
      const stockCodePattern = /\b[A-Z]{1,5}\b/g;
      const sharesPattern = /(\b\d{1,3}(,\d{3})*\b)(?=\s*shares)/gi;

      const stockCodes = message.match(stockCodePattern) || [];
      const shares = message.match(sharesPattern) || [];

      return { stockCodes, shares };
    }
  }
}
</script>


<style scoped>
.home-container {
  display: flex;
  height: 100vh;
}

.chat-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
