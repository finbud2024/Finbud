<template>
    <div class="home-container">
        <button class="toggle-sidebar-btn" @click="toggleSidebar">☰</button>
        <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"></div>
        <div class="chat-container">
            <ChatFrame>
                <ChatHeader :threadId="currentThread.id" />
                <MessageComponent v-for="(message, index) in messages" :key="index" :is-user="message.isUser"
                    :text="message.text" :typing="message.typing" :timestamp="message.timestamp"
                    :username="message.isUser ? 'Tri Bui' : 'FinBud Bot'"
                    :avatar-src="message.isUser ? userAvatar : botAvatar" />
            </ChatFrame>
            <UserInput @send-message="sendMessage" @clear-message="clearMessage" />
        </div>
        <News :keyword="keyword" />
    </div>
    <DisplayCrypto/>
</template>

<script>
const apiUrl = process.env.NODE_ENV === 'development' ? 'localhost:8888/.netlify/functions/server' : 'https://finbud-ai.netlify.app/.netlify/functions/server'
import ChatHeader from './ChatHeader.vue';
import MessageComponent from './MessageComponent.vue';
import ChatFrame from './ChatFrame.vue';
import UserInput from './UserInput.vue';
import News from '../Risk&Chat/News.vue'
import DisplayCrypto from './DisplayCrypto.vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.VUE_APP_GEMINI_API_KEY);
export default {
    name: 'RiskChat',
    components: {
        ChatFrame,
        MessageComponent,
        UserInput,
        ChatHeader,
        News,
        DisplayCrypto,
    },
    data() {
        return {
            newMessage: '',
            messages: [],
            userAvatar: require('@/assets/tri.jpeg'),
            botAvatar: require('@/assets/bot.png'),
            currentThread: {},
            threads: [],
            isSidebarVisible: false,
            keyword: '',
        }
    }, watch: {
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
        // message functions
        clearMessage() {
            this.newMessage = '';
            this.keyword = '';
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
                await this.handleMessage(userMessage);
            } catch (error) {
                console.log('Error in step 1:', error);
                this.messages.push({
                    text: `Error processing your message.`,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        },
        async handleMessage(userMessage) {
            try {
                const response = await this.getGeminiPrompt(userMessage);
                const keyword = await this.getGeminiKeyword(userMessage);
                this.keyword = keyword;
                // console.log("API response:", response);
                console.log("API keyword response:", this.keyword);
                // console.log("Type of response data:", typeof (response.data)
                await this.addTypingResponse(response, false);
            } catch (error) {
                console.error('Error in handleMessage:', error);
                if (error.response) {
                    console.error("Response status:", error.response.status);
                    console.error("Response data:", error.response.data);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                } else {
                    console.error("Error setting up the request:", error.message);
                }
                // Update UI with error message
                this.messages.push({
                    text: `Error processing your message: ${error.message}`,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString()
                });
            }
        },
        async getGeminiKeyword(prompt) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const chat = await model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{
                            text: `Given a sentence, extract and format the relevant keywords or phrases according to the following criteria: Must include: Keywords or phrases prepended with a + symbol. Exact match: Keywords or phrases surrounded by quotes ("). Logical operators: Use AND, OR, NOT to connect keywords or phrases. Group: Use parentheses to group logical operations if necessary.`
                        }],
                    },
                    {
                        role: "user",
                        parts: [{ text: `Examples: My input: "Look up data on electric vehicles or hybrid cars and clean energy." Output: +electric vehicles OR +hybrid cars AND "clean energy"` }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 100,
                },
            });
            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        },
        async getGeminiPrompt(prompt) {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const chat = await model.startChat({
                history: [
                    {
                        role: "user",
                        parts: [{ text: "I'm a 15 years old boy, from now on, answer me everything simply!" }],
                    },
                    {
                        role: "model",
                        parts: [{ text: "Great to meet you. What would you like to know?" }],
                    },
                ],
                generationConfig: {
                    maxOutputTokens: 100,
                },
            });
            const result = await chat.sendMessage(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
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
    },
    mounted() {
        setInterval(() => {
            this.currentTime = new Date().toLocaleTimeString();
        }, 500);

        const guidanceMessage = `Welcome to FinBud! Ask me anything!`;

        if (!this.messages) {
            this.messages = [];
        }
        this.addTypingResponse(guidanceMessage.trim(), false);
    }
}
</script>

<style scoped>
.home-container {
    display: flex;
    width: 45%;
    height: 90vh;
    background-image: linear-gradient(to bottom,#7BDBBF, #e0dede);
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