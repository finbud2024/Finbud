<template>
  <div class="container">
      <div class="main-content">
          <div class="chat-section">
              <ChatFrame>
                  <ChatHeader :threadId="currentThread.id" />
                  <MessageComponent
                      v-for="(message, index) in messages"
                      :key="index"
                      :is-user="message.isUser"
                      :text="message.text"
                      :typing="message.typing"
                      :timestamp="message.timestamp"
                      :username="message.isUser ? profileName : 'FinBud Bot'"
                      :avatar-src="message.isUser ? profileImage : botAvatar"
                  />
              </ChatFrame>
              <UserInput class="user-input-container" @send-message="sendMessage" @clear-message="clearMessage" />
          </div>
      </div>
  </div>
</template>

<script>
import { GoogleGenerativeAI } from '@google/generative-ai';  
import MessageComponent from './MessageComponent.vue';
import ChatFrame from './ChatFrame.vue';
import UserInput from '@/components/UserInput.vue';
import defaultImage from "@/assets/anonymous.png";
import ChatHeader from './ChatHeader.vue';

// Initialize AI
const apiKey = process.env.VUE_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export default {
  name: 'TaxChat',
  components: {
      ChatFrame,
      MessageComponent,
      UserInput,
      ChatHeader
  },
  props: {
      activeTab: {
          type: String,
          required: true,
          default: 'tax'
      }
  },
  data() {
      return {
          newMessage: '',
          messages: [],
          botAvatar: require('@/assets/bot.png'),
          currentThread: {},
          isSidebarVisible: false,
          keyword: '',
      };
  },
  computed: {
      userData() {
          try {
              const data = localStorage.getItem('user');
              return data ? JSON.parse(data) : null;
          } catch (e) {
              console.error('Error parsing user data:', e);
              return null;
          }
      },
      profileImage() {
          if (this.userData && this.userData.identityData) {
              return this.userData.identityData.profilePicture;
          }
          return defaultImage;
      },
      profileName() {
          if (this.userData && this.userData.identityData) {
              return this.userData.identityData.displayName;
          }
          return 'User';
      }
  },
  methods: {
      async sendMessage(newMessage) {
          this.messages.push({
              text: newMessage.trim(),
              isUser: true,
              typing: true,
              timestamp: new Date().toLocaleTimeString(),
          });
          this.newMessage = '';
          const userMessage = this.messages[this.messages.length - 1].text;
          try {
              await this.handleMessage(userMessage);
          } catch (error) {
              console.log('Error in step 1:', error);
              this.messages.push({
                  text: 'Error processing your message.',
                  isUser: false,
                  timestamp: new Date().toLocaleTimeString(),
              });
          }
      },

      async handleMessage(userMessage) {
          try {
              const response = await this.getTaxInfoResponse(userMessage);
              await this.addTypingResponse(response, false);
          } catch (error) {
              console.error('Error in handleMessage:', error);
              this.messages.push({
                  text: `Error processing your message: ${error.message}`,
                  isUser: false,
                  timestamp: new Date().toLocaleTimeString(),
              });
          }
      },

      async getTaxInfoResponse(prompt) {
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

          const chat = await model.startChat({
              history: [
                  {
                      role: 'user',
                      parts: [{ text: prompt }],
                  },
                  {
                      role: 'model',
                      parts: [{ text: 'I can help you calculate your tax based on the information you provide.' }],
                  },
              ],
              generationConfig: {
                  maxOutputTokens: 150,
              },
          });

          const result = await chat.sendMessage(prompt);
          const response = await result.response;
          const text = await response.text();
          return text;
      },

      async addTypingResponse(text, isUser) {
          const typingMessage = {
              text: text,
              isUser: isUser,
              typing: true,
              timestamp: new Date().toLocaleTimeString(),
              username: isUser ? 'You' : 'FinBud Bot',
          };

          this.messages.push(typingMessage);
          setTimeout(() => {
              typingMessage.typing = false;
              this.$forceUpdate();
          }, 1000);
      },

      clearMessage() {
          this.newMessage = '';
          this.keyword = '';
      }
  },
  mounted() {
      const guidanceMessage = 'Welcome to FinBud! Ask me anything related to tax calculations!';
      
      if (!this.messages) {
          this.messages = [];
      }
      this.addTypingResponse(guidanceMessage.trim(), false);
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.main-content {
  display: flex;
  width: 100%;
  max-width: 1100px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  background: linear-gradient(to bottom, #7BDBBF, #e0dede);
  border-radius: 10px;
  overflow: hidden;
}

.chat-section {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
}

.user-input-container {
position: static;
}

.user-input-container :deep(.user-input) {
width: 100%;
}

@media (max-width: 768px) {
  .main-content {
      flex-direction: column;
      width: 90%;
  }
}
</style>
