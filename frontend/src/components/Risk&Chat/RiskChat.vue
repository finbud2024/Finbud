<template>
    <div class="container">
        <!-- Conditional rendering based on activeTab -->
        <DisplayCrypto v-if="activeTab === 'crypto'" />
        <DisplayStock v-if="activeTab === 'stock'" />
        
        <!-- Chat section only shown in stock tab -->
        <div v-if="activeTab === 'stock'" class="main-content">
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
import ChatHeader from './ChatHeader.vue';
import MessageComponent from './MessageComponent.vue';
import ChatFrame from './ChatFrame.vue';
import UserInput from '@/components/UserInput.vue';
import News from '../Risk&Chat/News.vue';
import DisplayStock from './DisplayStock.vue';
import DisplayCrypto from './DisplayCrypto.vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import defaultImage from "@/assets/anonymous.png";

const apiKey = process.env.VUE_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export default {
    name: 'RiskChat',
    components: {
        DisplayCrypto,
        DisplayStock,
        ChatFrame,
        MessageComponent,
        UserInput,
        ChatHeader,
        News,
    },
    props: {
        activeTab: {
            type: String,
            required: true,
            default: 'stock'
        }
    },
    data() {
        return {
            newMessage: '',
            messages: [],
            botAvatar: require('@/assets/bot.png'),
            currentThread: {},
            threads: [],
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
        // Thread functions
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
        // Message functions
        clearMessage() {
            this.newMessage = '';
            this.keyword = '';
        },
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
                const response = await this.getGeminiPrompt(userMessage);
                const keyword = await this.getGeminiKeyword(userMessage);
                this.keyword = keyword;
                await this.addTypingResponse(response, false);
            } catch (error) {
                console.error('Error in handleMessage:', error);
                if (error.response) {
                    console.error('Response status:', error.response.status);
                    console.error('Response data:', error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up the request:', error.message);
                }
                // Update UI with error message
                this.messages.push({
                    text: `Error processing your message: ${error.message}`,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString(),
                });
            }
        },
        async getGeminiKeyword(prompt) {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const chat = await model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{
                            text: `Given a sentence, extract and format the relevant keywords or phrases according to the following criteria: Must include: Keywords or phrases prepended with a + symbol. Exact match: Keywords or phrases surrounded by quotes ("). Logical operators: Use AND, OR, NOT to connect keywords or phrases. Group: Use parentheses to group logical operations if necessary.`
                        }],
                    },
                    {
                        role: 'user',
                        parts: [{ text: `Examples: My input: "Look up data on electric vehicles or hybrid cars and clean energy." Output: +electric vehicles OR +hybrid cars AND "clean energy"` }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 100,
                },
            });
            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = await response.text();
            return text;
        },
        async getGeminiPrompt(prompt) {
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const chat = await model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: "I'm a 15 years old boy, from now on, answer me everything simply!" }],
                    },
                    {
                        role: 'model',
                        parts: [{ text: 'Great to meet you. What would you like to know?' }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 100,
                },
            });
            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = await response.text();
            return text;
        },
        addTypingResponse(text, isUser) {
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
    },
    mounted() {
        setInterval(() => {
            this.currentTime = new Date().toLocaleTimeString();
        }, 500);

        const guidanceMessage = 'Welcome to FinBud! Ask me anything!';

        if (!this.messages) {
            this.messages = [];
        }
        this.addTypingResponse(guidanceMessage.trim(), false);
    },
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
    .chat-header {
        font-size: 1rem;
        padding: 10px;
    }
}

@media (max-width: 768px) {
    .main-content {
        flex-direction: column;
        width: 90%;
    }
}

@media (max-width: 768px) {
    .chat-header {
        font-size: 1rem;
        padding: 10px;
    }
}
</style>
