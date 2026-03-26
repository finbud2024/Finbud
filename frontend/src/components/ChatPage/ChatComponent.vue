<template>
  <div class="chat-container finbud-chat">
    <div class="chat-header-spirit">
      <div class="fixed-slogan-band" @click="triggerCelebration">
        <div class="breathing-indicator"></div>
        WE SPEAK FINANCE
        <div class="spirit-sparkles"></div>
      </div>
    </div>
    <section
      v-if="showWelcomeHero"
      class="finbud-hero"
      aria-label="FinBud welcome"
    >
      <div class="hero-decorative-blobs"></div>
      <p class="finbud-slogan">We speak finance</p>
      <div class="finbud-hero-copy" v-html="welcomeHeroHtml"></div>
      
      <!-- Quick Action Chips -->
      <div class="quick-action-chips animate-up">
        <button @click="handleUserSubmit({ message: '#play' })" class="action-chip game-chip">
          <font-awesome-icon icon="fa-solid fa-gamepad" />
          <span>Play Game</span>
        </button>
        <button @click="handleUserSubmit({ message: 'What is the stock market trend today?' })" class="action-chip trend-chip">
          <font-awesome-icon icon="fa-solid fa-chart-line" />
          <span>Market Analysis</span>
        </button>
        <button @click="handleUserSubmit({ message: 'Help me plan my savings' })" class="action-chip plan-chip">
          <font-awesome-icon icon="fa-solid fa-piggy-bank" />
          <span>Savings Plan</span>
        </button>
      </div>
    </section>
    <ChatFrame class="chat-frame-content">
      <div v-for="(message, index) in messages" :key="index">
        <FileIndicator v-if="message.containFile" :file="message.file" />

        <!-- Deep Research Result custom view -->
        <DeepResearchResult
          v-if="!message.isUser && message.isDeepResearch"
          :report="message.report"
          :symbol="message.symbol"
          :relevantQuestions="message.relevantQuestions"
          @question-click="handleQuestionClick"
        />

        <!-- Regular message view -->
        <MessageComponent
          v-else-if="!message.isGame"
          :is-user="message.isUser"
          :text="message.text"
          :typing="message.typing"
          :is-thinking="message.isThinking"
          :htmlContent="message.htmlContent"
          :username="message.isUser ? displayName : 'FinBud Bot'"
          :avatar-src="message.isUser ? userAvatar : botAvatar"
          :sources="message.isUser ? [] : message.sources"
          :videos="message.isUser ? [] : message.videos"
          :relevantQuestions="message.isUser ? [] : message.relevantQuestions"
          :mentor-parts="message.mentorParts"
          :finance-card="message.financeCard"
          @question-click="handleQuestionClick"
        />

        <!-- Money Catch Game custom view -->
        <MessageComponent
          v-else
          :key="index"
          :is-user="message.isUser"
          :text="message.text"
          :typing="message.typing"
          :avatar-src="message.isUser ? userAvatar : botAvatar"
          :markdown="!message.isUser"
          :sources="message.sources"
          :videos="message.videos"
          :relevant-questions="message.relevantQuestions"
          :mentor-parts="message.mentorParts"
          :finance-card="message.financeCard"
          @question-click="handleUserSubmit"
        >
          <template v-if="message.isGame">
            <FinancialTriviaGame v-if="message.gameType === 'trivia'" />
            <MoneyCatchGame v-else />
          </template>
        </MessageComponent>

        <!-- Slogan Styled Message -->
        <div v-if="message.isSlogan" class="slogan-message-wrapper animate-up">
          <div class="slogan-message-card">
            <div class="slogan-pulse"></div>
            <img src="@/assets/finbud_logo.png" class="slogan-logo" />
            <div class="slogan-text">WE SPEAK FINANCE</div>
            <div class="slogan-sub">Hi, I'm FinBud. How can I help you today?</div>
            <div class="slogan-actions">
              <button @click="handleUserSubmit({ message: 'Play Catch Game' })" class="slogan-btn">
                <font-awesome-icon icon="fa-solid fa-coins" /> Catch Coins
              </button>
              <button @click="handleUserSubmit({ message: 'Play Trivia' })" class="slogan-btn">
                <font-awesome-icon icon="fa-solid fa-trophy" /> Trivia Master
              </button>
            </div>
          </div>
        </div>

        <!-- Only show ThinkingProcess for the current message when in think mode -->
        <ThinkingProcess
          v-if="
            chatMode === 'think' &&
            showThinkingProcess &&
            index === messages.length - 1
          "
          @thinking-complete="handleThinkingComplete"
          :scroll-to-bottom="scrollChatFrameToBottom"
        />

        <!-- Deep Research Mode workflow -->
        <DeepResearchAgent
          ref="deepResearchAgent"
          v-if="
            chatMode === 'deep-research' &&
            showDeepResearchWorkflow &&
            index === messages.length - 1
          "
          @workflow-complete="handleDeepResearchWorkflowComplete"
          :scroll-to-bottom="scrollChatFrameToBottom"
          :user-prompt="currentUserMessageText"
        />

        <!-- RAG Process -->
        <RagProcess
          v-if="
            chatMode === 'rag' &&
            showRagProcess &&
            index === messages.length - 1
          "
          :status="ragStatus"
          @rag-complete="handleRagComplete"
        />

        <!-- Add TradingView widget after stock messages -->
        <TradingViewWidget
          v-if="message.showChart"
          :symbol="message.stockSymbol"
        />
      </div>
      <div v-if="showConfetti" class="confetti-cannon">
        <div v-for="n in 30" :key="n" class="confetti-bit"></div>
      </div>
    </ChatFrame>
    <ChatSuggestion
      v-if="showWelcomeChips"
      :lan="this.$i18n.locale"
      class="suggestion-wrapper"
      @suggestion-selected="handleSuggestion"
    />
    <UserInput
      ref="userInput"
      :static-placeholder="finbudInputPlaceholder"
      @send-message="handleUserSubmit"
      @chat-mode="handleChatMode"
    />
  </div>
</template>

<script>
// COMPONENT IMPORT
import ChatFrame from "./ChatFrame.vue";
import MessageComponent from "../MessageComponent.vue";
import UserInput from "../UserInput.vue";
import TradingViewWidget from "../TradingViewWidget.vue";
import DeepResearchAgent from "./DeepResearchAgent.vue";
import DeepResearchResult from "./DeepResearchResult.vue";
import ChatSuggestion from "./ChatSuggestion.vue";
import FileIndicator from "../FileIndicator.vue";
import MoneyCatchGame from "./MoneyCatchGame.vue";
import FinancialTriviaGame from "./FinancialTriviaGame.vue";

import ThinkingProcess from "../ThinkingProcess.vue";
import RagProcess from "./RagProcess.vue";
// SERVICES + LIBRARY IMPORT
import axios from "axios";
import { gptServices } from "@/services/gptServices";
import {
  getSources,
  getVideos,
  getRelevantQuestions,
} from "@/services/serperService.js";
import api from "@/utils/api";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import { has } from "lodash";

GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
const geminiAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default {
  name: "ChatComponent",
  props: {
    autoMessage: {
      type: String,
      default: null,
    },
    greeting: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    ChatFrame,
    MessageComponent,
    UserInput,
    TradingViewWidget,
    DeepResearchAgent,
    DeepResearchResult,
    FileIndicator,
    ChatSuggestion,
    ThinkingProcess,
    RagProcess,
    MoneyCatchGame,
    FinancialTriviaGame,
  },
  data() {
    return {
      currentUserMessageText: "",
      messages: [],
      sources: [],
      videos: [],
      relevantQuestions: [],
      botAvatar: require("@/assets/finbud_logo.png"),
      chatMode: "",
      showDeepResearchWorkflow: false,
      showThinkingProcess: false,
      showRagProcess: false,
      ragStatus: 'loading',
      conversationHistory: [],
      researchBrief: null,
      autoMessageProcessed: false,
      isLoadingMessages: false,
      showConfetti: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
    currentThreadID() {
      return this.$store.getters["threads/getThreadID"];
		},
		displayName() {
			return this.$store.getters["users/userDisplayName"];
		},
		userAvatar() {
			return (
				this.$store.getters["users/userProfileImage"] ||
				require("@/assets/anonymous.png")
			);
		},
    showWelcomeChips() {
      if (this.autoMessage || this.isLoadingMessages) return false;
      return this.messages.length === 0 || (this.messages.length === 1 && this.messages[0].isSlogan);
    },
    showWelcomeHero() {
      return this.showWelcomeChips;
    },
    welcomeHeroHtml() {
      const vi = this.$i18n.locale === "vi";
			if (vi) {
				if (!this.isAuthenticated) {
					return [
						"Chào bạn 👋",
						"Anh là FinBud — <em>we speak finance</em>",
						"Tụi mình nói chuyện tiền bạc theo cách dễ hiểu, không cần thuật ngữ hàn lâm.",
						"<span class=\"finbud-hero-hint\">Đăng nhập để lưu hội thoại và dùng đủ tính năng nhé.</span>",
						"Bạn muốn bắt đầu từ đâu?",
					].join("<br>");
				}
				return [
					"Chào em 👋",
					"Anh là FinBud — <em>we speak finance</em>",
					"Tụi mình sẽ nói về tiền theo cách dễ hiểu hơn",
					"Không cần biết quá nhiều thuật ngữ",
					"Em muốn bắt đầu từ đâu?",
				].join("<br>");
			}
			if (!this.isAuthenticated) {
				return [
					"Hey there 👋",
					"I'm FinBud — <em>we speak finance</em>",
					"We'll talk about money in plain language—no jargon required.",
					"<span class=\"finbud-hero-hint\">Sign in to save chats and unlock the full experience.</span>",
					"Where would you like to start?",
				].join("<br>");
			}
			return [
				"Hi there 👋",
				"I'm FinBud — <em>we speak finance</em>",
				"We'll unpack money together in a calmer, clearer way.",
				"No need to master every term first.",
				"Where do you want to begin?",
			].join("<br>");
		},
		finbudInputPlaceholder() {
			return this.$i18n.locale === "vi"
				? "Hỏi về tiền, cổ phiếu, hoặc mục tiêu của em..."
				: "Ask about money, stocks, or your goals...";
		},
	},
	watch: {
		currentThreadID: {
			immediate: true,
			handler(newThreadID) {
				if (
					newThreadID !== null &&
					newThreadID !== undefined &&
					newThreadID.length != 0
				) {
					this.updateCurrentThread(newThreadID);
				} else {
					this.messages = [];
				}
			},
		},
		autoMessage: {
			immediate: true,
			handler(newMessage) {
				if (newMessage && !this.autoMessageProcessed) {
					this.autoMessageProcessed = true;
					this.handleUserSubmit({ message: newMessage });
				}
			}
		},
    messages(newVal) {
      if (newVal.length === 0 && !this.isLoadingMessages) {
        this.pushSloganMessage();
      }
    },
	},
	created() {
		this.openai = new OpenAI({
			apiKey: process.env.VUE_APP_OPENAI_API_KEY,
			dangerouslyAllowBrowser: true,
		});
	},
	methods: {
    pushSloganMessage() {
      if (this.messages.some(m => m.isSlogan)) return;
      this.messages.push({
        id: 'slogan-' + Date.now(),
        isSlogan: true,
        text: "WE SPEAK FINANCE",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      });
    },
		// ---------------------------- MAIN FUNCTIONS FOR HANDLING EVENTS --------------------------------
		async handleUserSubmit({ message, file }) {
      if (message && (message.toLowerCase().includes("#play") || message.toLowerCase().includes("#game"))) {
        this.messages.push({ text: message, isUser: true, timestamp: new Date().toLocaleTimeString() });
        this.$nextTick(() => this.scrollChatFrameToBottom());
        setTimeout(() => {
          this.messages.push({
            text: "Oh! You want to play? Let's go! Catch as many coins as you can! 💰🚀",
            isUser: false,
            isGame: true,
            typing: false,
            timestamp: new Date().toLocaleTimeString()
          });
          this.triggerConfetti();
          this.$nextTick(() => this.scrollChatFrameToBottom());
        }, 500);
        this.currentUserMessageText = "";
        this.$refs.userInput && this.$refs.userInput.clearInput?.();
        return;
      }

			console.log(
				`chat mode before sent from chat component: ${this.chatMode}`
			);
			if (file) {
				this.handleFileUpload(message, file);
			} else if (message) {
				this.currentUserMessageText = message.trim();
				this.messages.push({
					text: this.currentUserMessageText,
					isUser: true,
					typing: false,
					timestamp: new Date().toLocaleTimeString(),
				});

        this.$nextTick(() => this.scrollChatFrameToBottom());

        if (this.chatMode === "deep-research") {
          this.sendDeepResearchMessage(this.currentUserMessageText);
        } else if (this.chatMode === "think") {
          this.showThinkingProcess = true;
        } else if (this.chatMode === "rag") {
          try {
            this.showRagProcess = true;
            const context = await this.sendRagMessage(
              this.currentUserMessageText
            );
            // Pass both original message and context to sendMessage
            await this.sendMessage({
              message: this.currentUserMessageText,
              context: context,
            });
          } catch (error) {
            console.error("Error in RAG mode:", error);
            // Fall back to normal message if RAG fails
            await this.sendMessage(this.currentUserMessageText);
          }
        } else {
          this.sendMessage(this.currentUserMessageText);
        }
      }
      this.$refs.userInput && this.$refs.userInput.clearInput?.();
    },

    // ---------------------------- RESPONSE MESSGE ----------------------------
    async sendMessage(newMessage) {
      // Handle both string messages and RAG message objects
      const userMessage =
        typeof newMessage === "string"
          ? newMessage.trim()
          : newMessage.message.trim();

      const language = await gptServices([
        {
          role: "user",
          content: `Detect the language of this message and return only the language name in English. Examples:
					- For "Hello": "English"
					- For "Xin chào": "Vietnamese"
					Now detect this message: "${userMessage}"`,
        },
      ]);

      //UPDATE THREAD NAME BASED ON FIRST MESSAGE
      if (this.messages.length === 1) {
        const response = await gptServices([
          {
            role: "system",
            content: `You are an assistant for naming conversations with short, descriptive English titles.
Here are a few examples:

"Europe Vacation" from "What are must-visit places in Europe?"

"Project Extension" from "We need to push the deadline back by 2 weeks due to some issues."

Summarize the following into an English conversation title, no more than 5 words`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ]);
        if (this.$route.path === "/chat-view") {
          this.$emit("initialThreadName", response);
        } else {
          try {
            const currentThreadID = this.$store.getters["threads/getThreadID"];
            const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/${currentThreadID}`;
            axios.put(threadApi, { title: response }, {
              withCredentials: true,
            });
          } catch (err) {
            console.error("Error on updating thread name:", err.message);
          }
        }
      }

      //ONLY EXECUTE COMMAND/SHOW PROMPT IF THERE IS SOME MESSAGES IN THE USER INPUT
      if (userMessage.length != 0) {
        const answers = [];
        const htmlContents = [];
        let newSources = [];
        let newVideos = [];
        let newRelevantQuestions = [];

        // Add thinking message
        this.addTypingResponse("", false, [], [], [], true);

        // If in RAG mode, process with enhanced context
        if (
          this.chatMode === "rag" &&
          typeof newMessage === "object" &&
          newMessage.context
        ) {
          try {
            // Get response from GPT with enhanced context
            const gptResponse = await gptServices([
              {
                role: "system",
                content: `You are FinBud, a financial assistant. Use the following context to provide a detailed answer to the user's question.

RELEVANT CONTEXT:
${newMessage.context}

Please provide a comprehensive answer that:
1. Uses the context above to inform your response
2. Maintains a friendly and professional tone
3. Focuses on financial accuracy and clarity
4. Includes specific details from the context when relevant`,
              },
              {
                role: "user",
                content: userMessage, // Use original query
              },
            ]);

            answers.push(gptResponse);

            // Remove thinking message
            this.messages = this.messages.filter((msg) => !msg.isThinking);

            // Add response to messages
            this.addTypingResponse(
              gptResponse,
              false,
              newSources,
              newVideos,
              newRelevantQuestions
            );

            // Save chat to backend if authenticated
            if (this.isAuthenticated) {
              try {
                const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats`;
                const reqBody = {
                  prompt: this.currentUserMessageText, // Save original query
                  response: [gptResponse],
                  sources: newSources,
                  videos: newVideos,
                  threadId: this.currentThreadID,
                  context: newMessage.context, // Save the context
                };
                await axios.post(chatApi, reqBody);
              } catch (err) {
                console.error("Error on saving chat:", err.message);
              }
            }

            this.scrollChatFrameToBottom();
            return;
          } catch (error) {
            console.error("Error in RAG mode:", error);
            // Fall back to normal processing if RAG fails
          }
        }

        // Continue with normal processing for non-RAG mode or if RAG failed
        const gptDefine = await gptServices([
          {
            role: "user",
            content: `You are an intelligent assistant. Given a natural language message from the user, detect which of the following 10 actions it belongs to. Then extract the necessary information and return a **formatted command** for that action if found.

					### Supported Actions & Return Formats:
					0. **General Message** MAJORITY OF THE MESSAGE WILL BE THIS ONE 
					- User intent: General message, not related to any specific action.
					- Format: **[user_message]**
					- Example: "Tell me about the weather today" → "Tell me about the weather today"

					1. **Stock Price**  
					- User intent: Ask for a stock price, return only the stock code (ticker symbol) in uppercase.
					- Phrases may include: "giá cổ phiếu", "stock price of", "bao nhiêu tiền cổ phiếu", etc.
					- Format: **[STOCK_CODE_IN_UPPERCASE]**  
					- Example: "giá cổ phiếu của Coca Cola" → Return "KO", "What's the price of tesla stock?" → "TSLA", 

					2. **Search**  
					- Trigger only when the user is requesting for detailed information or definitions about specific concepts, terms, or topics that are not related to stock prices, not conversational questions.
					- Example triggers: "Explain ROI", "What is inflation?", "Tell me about compound interest"
					- Format: #search [term]					

					3. **Define Financial Term**  
					- User intent: Ask for meaning of a financial term  
					- Format: **#define [term]**  
					- Example: "What does IPO mean?" → "#define IPO"

					4. **Top 5 Cryptocurrencies**  
					- User intent: Ask about top cryptocurrencies  
					- Format: **#crypto**  
					- Example: "Show me top cryptocurrencies" → "#crypto"

					5. **Real Estate Lookup**  
					- User intent: Ask for properties in an area  
					- Format: **#realestate [area_name]**  
					- Example: "Show me houses in New York" → "#realestate new york"  
					- If no area is mentioned, default to: **#realestate San Jose**

					6. **Income**  
					- User intent: Add money to the account (e.g., income, deposit, or refund).
					- Format: **#add [description] [amount]**  
					- Example: "I received 125 from a refund" → "#add refund 125"

					7. **Expense**  
					- User intent: Subtract money from the account for something spent (e.g., purchase or bill). 
					- Format: **#spend [description] [amount]**  
					- Example: "I spend 80 on groceries" → "#spend groceries 80", "Tao mua xe máy với giá 10 dollar" → #spend xe máy 10

					8. **Buy Stock**  
					- User intent: Buy a stock with quantity  
					- Format: **#buy [STOCK_CODE_IN_UPPERCASE] [quantity]**  
					- Example: "I want to buy 10 shares of Tesla" → "#buy TSLA 10"

					9. **Sell Stock**  
					- User intent: Sell a stock with quantity  
					- Format: **#sell [STOCK_CODE_IN_UPPERCASE] [quantity]**  
					- Example: "Sell 5 shares of AAPL" → "#sell AAPL 5"

					10. **Add a Goal**  
					- User intent: Create a goal  
					- Format: **#create goal**  
					- Example: "I want to create a savings goal" → "#create goal"

					11. **Analyze Portfolio**
					- User intent: Analyze portfolio
					- Format: **#analyze Portfolio**
					
					12. **Play Game**
					- User intent: Play a game or trivia
					- Format: **#play [game_type]** (Type can be 'catch' or 'trivia')
					- Example: "Chơi game" → "#play catch", "Chơi giải đố" → "#play trivia"

					13. **Draw Chart**
					- User intent: Request a visual chart or diagram of a stock or financial trend.
					- Format: **#chart [STOCK_CODE_IN_UPPERCASE]**
					- Example: "Vẽ biểu đồ Tesla" → "#chart TSLA", "Show me AAPL chart" → "#chart AAPL"

					### Instruction:
					Given the user message: "${newMessage}", respond with the correct formatted command according to the rules above.  
					If no suitable category is found, return the original message unchanged: "${newMessage}".
					`,
          },
        ]);

        // HANDLE PLAY(12)
        if (gptDefine.toLowerCase().includes("#play")) {
          const gameType = gptDefine.split(" ").pop() === 'trivia' ? 'trivia' : 'catch';
          const botMessage = {
            id: Date.now(),
            text: gameType === 'trivia' ? "Let's test your financial knowledge!" : "Catch as many coins as you can!",
            isUser: false,
            timestamp: new Date().toLocaleTimeString(),
            isGame: true,
            gameType: gameType
          };
          this.messages.push(botMessage);
          this.scrollChatFrameToBottom();
          return;
        }

        // HANDLE TRANSACTION (#add / #spend)
        if (gptDefine.toLowerCase().includes("#add") || gptDefine.toLowerCase().includes("#spend")) {
          const isAdd = gptDefine.toLowerCase().includes("#add");
          const parts = gptDefine.split(" ");
          const amount = parseFloat(parts.pop()) || 0;
          // Clean the description: get only the part between command and amount, remove any AI chatter
          let desc = parts.slice(1).join(" ").replace(/\*\*|#add|#spend/gi, "").trim();
          if (desc.split('\n').length > 1) desc = desc.split('\n')[0]; // Take only first line to avoid AI reasoning
          desc = desc || (isAdd ? "Income" : "Expense");
          
          const botMessage = {
            id: Date.now(),
            text: `${isAdd ? 'Thu nhập' : 'Chi tiêu'} $${amount} cho "${desc}" đã được ghi lại!`,
            isUser: false,
            timestamp: new Date().toLocaleTimeString(),
            financeCard: {
              type: isAdd ? 'income' : 'expense',
              amount: amount,
              description: desc,
              chartData: {
                series: [isAdd ? 100 : 40, isAdd ? 40 : 100],
                options: {
                  labels: ['Income', 'Expenses'],
                  colors: ['#10B981', '#EF4444'],
                  chart: { type: 'donut' }
                }
              }
            }
          };
          this.messages.push(botMessage);
          this.scrollChatFrameToBottom();
          return;
        }

        // HANDLE CHART(13)
        if (gptDefine.toLowerCase().includes("#chart")) {
          const symbol = gptDefine.split(" ").pop() || "AAPL";
          const botMessage = {
            id: Date.now(),
            text: `Đây là biểu đồ của ${symbol.toUpperCase()} mà bạn yêu cầu.`,
            isUser: false,
            timestamp: new Date().toLocaleTimeString(),
            showChart: true,
            stockSymbol: symbol.toUpperCase(),
          };
          this.messages.push(botMessage);
          this.scrollChatFrameToBottom();
          return;
        }

        // HANDLE DEFINE(2)
        if (gptDefine.toLowerCase().includes("#define")) {
          try {
            const term = gptDefine
              .substring(
                gptDefine.toLowerCase().indexOf("define") + "define".length
              )
              .trim();
            const prompt = `Explain ${term} to me as if I'm 15 in this language ${language} `;
            const gptResponse = await gptServices([
              { role: "user", content: prompt },
            ]);
            answers.push(gptResponse);
          } catch (err) {
            console.error("Error in define message:", err);
          }
        }
        // HANDLE BUY (7)
        else if (gptDefine.toLowerCase().includes("#buy")) {
          const buyRegex = /#buy\s+([A-Z]+)\s+(\d+)/i;
          const match = gptDefine.match(buyRegex);
          if (match) {
            const stockSymbol = match[1].toUpperCase();
            const quantity = parseInt(match[2], 10);
            if (stockSymbol && !isNaN(quantity)) {
              // Navigate to stock simulator and auto-open modal
              this.$router.push("/stock-simulator").then(() => {
                // Wait for component to mount, then emit event
                setTimeout(() => {
                  if (this.$eventBus) {
                    this.$eventBus.$emit("stock-buy-request", {
                      symbol: stockSymbol,
                      quantity: quantity,
                      action: "buy",
                    });
                  }
                }, 500);
              });

              const res = `I'll help you buy ${quantity} shares of ${stockSymbol}. Opening the stock trading interface for you!`;
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
                },
              ]);
              answers.push(Responsegpt);
            } else {
              const res = "Invalid stock symbol or quantity";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
                },
              ]);
              answers.push(Responsegpt);
            }
          } else {
            const res =
              "Invalid stock symbol or quantity format. Please use: #buy SYMBOL QUANTITY";
            const Responsegpt = await gptServices([
              {
                role: "user",
                content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
              },
            ]);
            answers.push(Responsegpt);
          }
        }

        // HANDLE SELL (8)
        else if (gptDefine.toLowerCase().includes("#sell")) {
          const sellRegex = /#sell\s+([A-Z]+)\s+(\d+)/i;
          const match = gptDefine.match(sellRegex);
          if (match) {
            const stockSymbol = match[1].toUpperCase();
            const quantity = parseInt(match[2], 10);
            if (stockSymbol && !isNaN(quantity)) {
              // Navigate to stock simulator and auto-open modal
              this.$router.push("/stock-simulator").then(() => {
                // Wait for component to mount, then emit event
                setTimeout(() => {
                  if (this.$eventBus) {
                    this.$eventBus.$emit("stock-sell-request", {
                      symbol: stockSymbol,
                      quantity: quantity,
                      action: "sell",
                    });
                  }
                }, 500);
              });

              const res = `I'll help you sell ${quantity} shares of ${stockSymbol}. Opening the stock trading interface for you!`;
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
                },
              ]);
              answers.push(Responsegpt);
            } else {
              const res = "Invalid stock symbol or quantity";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
                },
              ]);
              answers.push(Responsegpt);
            }
          } else {
            const res =
              "Invalid stock symbol or quantity format. Please use: #sell SYMBOL QUANTITY";
            const Responsegpt = await gptServices([
              {
                role: "user",
                content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
              },
            ]);
            answers.push(Responsegpt);
          }
        }
        // HANDLE ADD TRANSACTION (6)
        else if (gptDefine.toLowerCase().includes("#add")) {
          try {
            const match = gptDefine.match(/#add\s+([\p{L}\p{N}\s]+)\s+(\d+)/iu);
            if (match) {
              const description = match[1].trim();
              const amount = parseInt(match[2], 10);
              const type = "Income";
              const balance = await this.calculateNewBalance(amount);
              const category = await this.categorizeTransaction(
                description,
                type
              );
              await this.addTransaction(description, amount, type, category);
              const res = `Transaction added: "${description}" as a ${type} in category "${category}" with amount $${Math.abs(
                amount
              )}. Your new balance is $${balance}.`;
              console.log(res);
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text "${res}" into ${language}. Respond only with the translated text`,
                },
              ]);
              console.log(Responsegpt);
              answers.push(Responsegpt);
              const baseUrl = window.location.origin.includes("localhost")
                ? "http://localhost:8888"
                : "https://finbud.pro";
              const url = `${baseUrl}/goal/`;
              // window.open(url, "_blank");
            } else {
              const res =
                "Please specify the description and amount you want to add.";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text "${res}" into ${language}. Respond only with the translated text`,
                },
              ]);
              answers.push(Responsegpt);
              const baseUrl = window.location.origin.includes("localhost")
                ? "http://localhost:8888"
                : "https://finbud.pro";
              const url = `${baseUrl}/goal/`;
              window.open(url, "_blank");
            }
          } catch (err) {
            console.error("Error in add transaction:", err.message);
          }
        }
        // HANDLE SPEND TRANSACTION (7)
        else if (gptDefine.toLowerCase().includes("#spend")) {
          try {
            const match = gptDefine.match(
              /#spend\s+([\p{L}\p{N}\s]+)\s+(\d+)/iu
            );
            if (match) {
              const accountCheck = await this.checkAccountBalance();
              if (!accountCheck) {
                const res = `Account balance is not set yet, please set your account balance first`;
                const Responsegpt = await gptServices([
                  {
                    role: "user",
                    content: `Translate the following text "${res}" into ${language}. Respond only with the translated text.`,
                  },
                ]);
                answers.push(Responsegpt);
                // this.openNewWindow("/goal");
              } else {
                const description = match[1].trim();
                const amount = -parseInt(match[2], 10);
                const type = "Expense";
                const balance = await this.calculateNewBalance(amount);
                const category = await this.categorizeTransaction(
                  description,
                  type
                );
                await this.addTransaction(description, amount, type, category);
                const res = `Transaction added: "${description}" as a ${type} in category "${category}" with amount $${Math.abs(
                  amount
                )}. Your new balance is $${balance}.`;
                const Responsegpt = await gptServices([
                  {
                    role: "user",
                    content: `Translate the following text "${res}" into ${language}. Respond only with the translated text`,
                  },
                ]);
                answers.push(Responsegpt);
              }
              //this.openNewWindow("/goal");
              const baseUrl = window.location.origin.includes("localhost")
                ? "http://localhost:8888"
                : "https://finbud.pro";

              const url = `${baseUrl}/goal/`;
              // window.open(url);
              setTimeout(() => {
                window.addEventListener("load", () => {
                  const previewButton = document.querySelector(".preview-btn");
                  if (previewButton) previewButton.click();
                });
              }, 2000);
            } else {
              const res =
                "Please specify the description and amount you want to spend.";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text "${res}" into ${language}. Respond only with the translated text`,
                },
              ]);
              answers.push(Responsegpt);
            }
          } catch (err) {
            console.error("Error in spend transaction:", err.message);
          }
        }
        // RETURNS CRYPTO TABLE (3)
        else if (gptDefine.toLowerCase().includes("#crypto")) {
          //FETCHING COIN DATA
          let coinData = [];
          try {
            const res = await axios.get(
              "https://api.coinranking.com/v2/coins?timePeriod=7d",
              {
                headers: {
                  "x-access-token": process.env.VUE_APP_COINRANKING_KEY,
                },
              }
            );
            coinData = res.data.data.coins;
          } catch (err) {
            console.error("Failed to fetch cr quotes:", err);
          }
          let tableTemplate = `
				<div style="font-weight: 900; font-size: 30px"> Top 10 đồng Coin vốn hóa lớn nhất </div>
				<table>
				<thead>
				    <tr>
				    <th>Tên</th>
				    <th>Hạng</th>
				    <th>Cấp</th>
				    <th>Giá</th>
				    <th>Kí hiệu</th>
				    <th>Biến động</th>
				    </tr>
				</thead>
				<tbody id="tableBody" class="table-body">`;
          coinData.slice(0, 10).map((item) => {
            tableTemplate += `
				    <tr>
				    <td><img style="width: 50px; aspect-ratio: 1;" src=${item.iconUrl} alt=${
              item.name
            }
						}>${item.name}</td>
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
            timestamp: new Date().toLocaleTimeString(),
          });
          htmlContents.push(tableTemplate);
        }
        // // RETURNS REALESTATE TABLE
        else if (gptDefine.includes("#realestate")) {
          let userInputToken = gptDefine.split(/\s+/);
          let searchLocation;

          const capitalizeLocation = (word) => {
            return word
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(" ");
          };

          if (userInputToken.length > 1) {
            userInputToken = userInputToken.slice(1, userInputToken.length);
            searchLocation = capitalizeLocation(userInputToken.join(" "));
          } else {
            searchLocation = "San Jose";
          }
          let propertiesData = [
            {
              propertyType: "Single Family Home",
              formattedAddress: "123 Main St, San Jose, CA 95112",
              price: "$1,200,000",
              status: "For Sale",
            },
            {
              propertyType: "Condo",
              formattedAddress: "456 Elm St, San Jose, CA 95126",
              price: "$850,000",
              status: "Pending",
            },
            {
              propertyType: "Townhouse",
              formattedAddress: "789 Oak Ave, San Jose, CA 95128",
              price: "$975,000",
              status: "Sold",
            },
            {
              propertyType: "Apartment",
              formattedAddress: "101 Pine St, San Jose, CA 95110",
              price: "$3,200/mo",
              status: "For Rent",
            },
            {
              propertyType: "Duplex",
              formattedAddress: "202 Maple Dr, San Jose, CA 95125",
              price: "$1,050,000",
              status: "For Sale",
            },
          ];
          // const API_KEY = process.env.VUE_APP_REAL_ESTATE_KEY;
          // const BASE_URL = "https://api.rentcast.io/v1/listings/sale";
          // try {
          // 	const response = await axios.get(BASE_URL, {
          // 		params: { city: searchLocation },
          // 		headers: {
          // 			accept: 'application/json',
          // 			"X-Api-Key": API_KEY
          // 		},
          // 	});
          // 	// console.log(response.data)
          // 	propertiesData = response.data;
          // } catch (err) {
          // 	console.error("Error fetching property data:", err);
          // }
          let tableTemplate = `
				<div style="font-weight: 900; font-size: 30px"> Danh sách 5 Bất động sản ở ${searchLocation} </div>
				<table>
				<thead>
				    <tr>
				    <th>Loại</th>
				    <th>Địa chỉ</th>
				    <th>Giá</th>
				    <th>Tình trạng</th>
				    </tr>
				</thead>
				<tbody id="tableBody" class="table-body">`;
          propertiesData.slice(0, 5).map((item) => {
            tableTemplate += `
				    <tr>
				    <td>${item.propertyType}</td>
				    <td>${item.formattedAddress}</td>
				    <td>${item.price.toLocaleString()}$</td>
				    <td>${item.status}</td>
				    </tr>`;
          });
          tableTemplate += `</tbody></table>`;
          htmlContents.push(tableTemplate);
          this.messages.push({
            text: ``,
            htmlContent: tableTemplate,
            isUser: false,
            typing: true,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
        // HANDLE STOCK
        else if (this.extractStockCode(gptDefine)) {
          try {
            const stockCode = this.extractStockCode(gptDefine)[0];
            const stockResponse = await axios.get(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${process.env.VUE_APP_ALPHA_VANTAGE_API_KEY}`
            );
            const price = stockResponse.data["Global Quote"]["05. price"];
            const timeStamp = new Date().toLocaleTimeString();
            console.log(price, timeStamp, stockCode);
            let alphavantageResponse = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;
            const alphavantageResponsegpt = await gptServices([
              {
                role: "user",
                content: `Translate "${alphavantageResponse}" into this language ${language}. Respond only with the translated text.`,
              },
            ]);
            answers.push(alphavantageResponsegpt);
            //chatgpt api
            const prompt = `Response in this language ${language}": generate a detailed analysis of ${stockCode} which currently trades at $${price}.`;
            const gptResponse = await gptServices([
              { role: "user", content: prompt },
            ]);
            answers.push(gptResponse);

            // Add a message that will trigger the chart display
            this.messages.push({
              text: "",
              isUser: false,
              typing: false,
              showChart: true,
              stockSymbol: stockCode,
              timestamp: new Date().toLocaleTimeString(),
            });
          } catch (err) {
            console.error("Error in stock message:", err.message);
          }
        }
        // HANDLE SEARCH
        else if (gptDefine.toLowerCase().includes("#search")) {
          //Search for sources, videos, and relevant questions
          const searchResults = await getSources(gptDefine);
          newSources = searchResults;
          newVideos = await getVideos(gptDefine);
          newRelevantQuestions = await getRelevantQuestions(
            searchResults,
            language
          );
          //Normal GTP response
          const gptResponse = await gptServices([
            {
              role: "user",
              content: `Search for ${gptDefine} and response in ${language} language.`,
            },
          ]);
          answers.push(gptResponse);
        }

        // HANDLE CREATE (10)
        else if (gptDefine.includes("#create")) {
          try {
            const createRegex = /#create\s+goal/i;
            const match = gptDefine.match(createRegex);
            if (match) {
              const baseUrl = window.location.origin.includes("localhost")
                ? "http://localhost:8888"
                : "https://finbud.pro";

              // Open the /goal page
              const url = `${baseUrl}/goal`;
              // window.open(url, "_blank");

              // Create response in user's language
              const res =
                "We've created the goal section for you to add your goals.";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text ${res} into ${language}. Respond only with the translated text.`,
                },
              ]);
              answers.push(Responsegpt);

              setTimeout(() => {
                window.addEventListener("load", () => {
                  const addGoalButton =
                    document.querySelector(".add-goal-button");
                  if (addGoalButton) addGoalButton.click();
                });
              }, 2000);
            } else {
              this.addTypingResponse("Invalid create command format", false);
            }
          } catch (err) {
            console.error("Error in create message:", err.message);
          }
        }

        // HANDLE ANALYZE (11)
        else if (gptDefine.toLowerCase().includes("#analyze")) {
          try {
            if (!this.isAuthenticated) {
              const res = "You need to be logged in to analyze your portfolio.";
              const responseGpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
                },
              ]);
              answers.push(responseGpt);
            } else {
              this.addTypingResponse("", false, [], [], [], true);

              const userId = this.$store.getters["users/userId"];
              const apiUrl = `${process.env.VUE_APP_DEPLOY_URL}/chats/analyze-portfolio/${userId}`;

              const response = await axios.get(apiUrl);
              const analysisData = response.data;

              if (analysisData && analysisData.analysis) {
                if (analysisData.analysis.stock) {
                  this.messages = this.messages.filter(
                    (msg) => !msg.isThinking
                  );

                  this.messages.push({
                    text: "",
                    isUser: false,
                    typing: false,
                    timestamp: new Date().toLocaleTimeString(),
                    htmlContent: analysisData.analysis.stock,
                    username: "FinBud Bot",
                    sources: [],
                    videos: [],
                    relevantQuestions: [],
                  });
                  htmlContents.push(analysisData.analysis.stock);
                }

                if (analysisData.analysis.transaction) {
                  this.messages.push({
                    text: "",
                    isUser: false,
                    typing: false,
                    timestamp: new Date().toLocaleTimeString(),
                    htmlContent: analysisData.analysis.transaction,
                    username: "FinBud Bot",
                    sources: [],
                    videos: [],
                    relevantQuestions: [],
                  });
                  htmlContents.push(analysisData.analysis.transaction);
                }

                if (
                  !analysisData.analysis.stock &&
                  !analysisData.analysis.transaction
                ) {
                  const errorMsg =
                    "Could not generate portfolio analysis. Please try again later.";
                  const translatedError = await gptServices([
                    {
                      role: "user",
                      content: `Translate the following text into ${language}. Respond only with the translated text: "${errorMsg}".`,
                    },
                  ]);
                  answers.push(translatedError);
                }
              } else {
                const noDataMsg =
                  "No portfolio data available for analysis. Please add holdings or transactions first.";
                const translatedNoData = await gptServices([
                  {
                    role: "user",
                    content: `Translate the following text into ${language}. Respond only with the translated text: "${noDataMsg}".`,
                  },
                ]);
                answers.push(translatedNoData);
              }

              this.messages = this.messages.filter((msg) => !msg.isThinking);
            }
          } catch (err) {
            console.error("Error in analyze portfolio:", err.message);
            const errorMsg =
              "There was an error analyzing your portfolio. Please try again later.";
            const translatedError = await gptServices([
              {
                role: "user",
                content: `Translate the following text into ${language}. Respond only with the translated text: "${errorMsg}".`,
              },
            ]);
            answers.push(translatedError);
          }
        } else {
          try {
            const historyChat = this.messages.slice(-10).map((msg) => {
              return {
                role: msg.isUser ? "user" : "assistant",
                content: msg.text,
              };
            });
            console.log(historyChat);
            const prompt = userMessage;
            const systemMessage = `You are FinBud, a playful but intelligent financial companion designed to help users understand and manage their money in a simple, intuitive, and engaging way. You follow the “We Speak Finance” philosophy, meaning you do not teach finance like a textbook, but instead speak through insights, translating financial data into clear, human, and actionable meaning. Your personality is friendly, slightly mischievous, warm, and supportive, similar to a Duolingo-style assistant, but you always maintain financial credibility and accuracy. You communicate like a smart Gen Z money buddy who understands both numbers and emotions. Your tone is light, conversational, and concise, occasionally playful, but never childish or unprofessional.

If users ask who created you, you answer clearly that you were created by Tri Bui. If users ask about your philosophy or spirit, you explain that you follow the “We Speak Finance” mindset, meaning you make finance feel natural, intuitive, and human instead of complex and academic.

You prioritize insight over explanation. Instead of defining concepts or giving long theoretical answers, you focus on what the information means for the user and what they should consider doing next. You break responses into short, digestible pieces, often starting with a clear observation, followed by reasoning, and optionally a gentle suggestion. You avoid unnecessary jargon, but when technical terms are needed, you explain them simply and naturally in context.

You are emotionally aware. If a user expresses stress, confusion, or personal concerns, you respond with empathy first, then guide the conversation back to helpful financial perspective. You never judge the user’s situation. You act like a supportive companion, not an an authority figure. You can use light humor or soft expressions to make the interaction feel natural, but you do not overuse emojis or become overly casual.

You are confident but not absolute. You provide clear opinions when appropriate, but you avoid making guarantees or giving rigid financial advice. You guide thinking rather than dictate decisions. You frame suggestions as options, not commands.

Your responses follow a natural structure:

A short, intuitive insight or reaction
A brief explanation of why it matters
An optional suggestion or next step

Keep responses concise, usually under 3–5 sentences unless the user explicitly asks for deeper detail. Avoid long paragraphs.

Do not behave like a generic chatbot. Do not output textbook-style explanations, long lists of definitions, or overly technical breakdowns unless explicitly requested. Do not sound robotic, overly formal, or like a financial report. Do not overwhelm the user with too much data.

Your goal is to make finance feel easy, human, and slightly enjoyable, while still being accurate and useful. Every response should help the user feel more in control of their money, not more confused.`;

            const gptResponse = await gptServices([
              { role: "system", content: systemMessage },
              {
                role: "user",
                content: `${prompt}. \nResponse in this language ${language}. Previous Context to refer to if user asks: ${JSON.stringify(historyChat)}`,
              },
            ]);

            answers.push(gptResponse);
          } catch (err) {
            console.error("Error in general message:", err.message);
          }
        }

        // Remove the thinking message
        this.messages = this.messages.filter((msg) => !msg.isThinking);
        await this.$nextTick();

        answers.forEach((answer) => {
          this.addTypingResponse(
            answer,
            false,
            newSources,
            newVideos,
            newRelevantQuestions
          );
        });
        //save chat to backend
        if (this.isAuthenticated) {
          try {
            const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats`;
            const reqBody = {
              prompt: userMessage,
              response: answers,
              sources: newSources,
              videos: newVideos,
              threadId: this.currentThreadID,
            };
            await axios.post(chatApi, reqBody);
          } catch (err) {
            console.error("Error on saving chat:", err.message);
          }
        }
        this.scrollChatFrameToBottom();
      }
    },

    // --------------------------- AGENT MODE -----------------------------------------------------

    handleChatMode(mode) {
      this.chatMode = mode;
      console.log(`Chat mode changed to: ${mode}`);
    },

    handleDeepResearchWorkflowComplete() {
      setTimeout(() => {
        this.showDeepResearchWorkflow = false;
        this.sendMessage(this.currentUserMessageText);
        this.currentUserMessageText = "";
      }, 1500);
    },

    async handleSuggestion(suggestion) {
      this.messages.push({
        text: suggestion,
        isUser: true,
        timestamp: new Date().toLocaleTimeString(),
      });
      this.sendMessage(suggestion);
    },

    // --------------------------- THINKING PROCESS -----------------------------------------------------
    handleThinkingComplete() {
      setTimeout(() => {
        this.showThinkingProcess = false;
        this.sendMessage(this.currentUserMessageText);
        this.currentUserMessageText = "";
      }, 1500);
    },

    // --------------------------- READ FILE -----------------------------------------------------
    async handleFileUpload(newMessage, file) {
      this.isLoading = true;
      this.messages.push({
        text: newMessage,
        isUser: true,
        typing: true,
        timestamp: new Date().toLocaleTimeString(),
        containFile: true,
        file: file,
      });
      try {
        let result = null;
        if (file.type.startsWith("image/")) {
          try {
            result = await this.analyzeImageOpenAI(file, newMessage);
          } catch (err) {
            console.error(
              "OpenAI failed to anylyze image, switching to Gemini:",
              err
            );
            result = await this.analyzeImageGemini(file, newMessage);
          }
        } else if (file.type === "application/pdf") {
          try {
            result = await this.analyzePDFOpenAI(file, newMessage);
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error("OpenAI timeout")), 3000)
            );
          } catch (err) {
            console.error(
              "OpenAI failed to anylyze pdf, switching to Gemini:",
              err
            );
            result = await this.analyzePDFGemini(file, newMessage);
          }
        } else {
          throw new Error("Unsupported file type");
        }
        this.messages.push({
          text: result,
          isUser: false,
          timestamp: new Date().toLocaleTimeString(),
        });
      } catch (err) {
        console.error("Error processing file:", err);
        this.addTypingResponse("Failed to process file", false);
      }

      this.isLoading = false;
    },

    async analyzeImageOpenAI(file, newMessage) {
      const base64Image = await this.readFileAsBase64(file);
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Bạn là FinBud — một trợ lý tài chính thông minh, thân thiện, chuyên nói chuyện bằng tiếng Việt.
            Tuy nhiên, nếu người dùng dùng ngôn ngữ khác, bạn có thể phản hồi bằng ngôn ngữ đó cho phù hợp.
            Hãy luôn trả lời một cách vui vẻ, dễ hiểu, như một người bạn đáng tin cậy của Gen Z. 😎
            Nếu tin nhắn người dùng không rõ ràng, hãy lịch sự nhắc họ viết lại rõ hơn, và phản hồi bằng **tiếng Việt**.`,
            role: "user",
            content: [
              { type: "text", text: newMessage },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
      });
      return response.choices[0].message.content;
    },

    async analyzeImageGemini(file, newMessage) {
      const base64Image = await this.readFileAsBase64(file);
      const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const systemPrompt = `
Bạn là FinBud — trợ lý tài chính. 
**QUY TẮC**:
1. Nếu người dùng hỏi bằng tiếng Việt → trả lời bằng tiếng Việt.
2. Nếu hỏi bằng ngôn ngữ khác → trả lời bằng ngôn ngữ đó.
3. Luôn thân thiện, vui vẻ! 😊
`;
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: "Câu hỏi của người dùng: " + newMessage },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      });
      return result.response.candidates[0].content.parts[0].text;
    },

    async analyzePDFOpenAI(file, newMessage) {
      const uploadedFile = await this.openai.files.create({
        file,
        purpose: "user_data",
      });

      const response = await this.openai.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "system",
            content: `Bạn là FinBud — một trợ lý tài chính thông minh, thân thiện, chuyên nói chuyện bằng tiếng Việt.
					Tuy nhiên, nếu người dùng dùng ngôn ngữ khác, bạn có thể phản hồi bằng ngôn ngữ đó cho phù hợp.
					Hãy luôn trả lời một cách vui vẻ, dễ hiểu, như một người bạn đáng tin cậy của Gen Z. 😎
					Nếu tin nhắn người dùng không rõ ràng, hãy lịch sự nhắc họ viết lại rõ hơn, và phản hồi bằng **tiếng Việt**.`,
            role: "user",
            content: [
              {
                type: "input_file",
                file_id: uploadedFile.id,
              },
              {
                type: "input_text",
                text: newMessage,
              },
            ],
          },
        ],
      });

      // Clean up
      await this.openai.files.del(uploadedFile.id);
      return response.output_text;
    },

    async analyzePDFGemini(file, newMessage) {
      const textFromPDF = await this.extractTextFromPDF(file);
      const model = geminiAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const systemPrompt = `
Bạn là FinBud — trợ lý tài chính. 
**QUY TẮC**:
1. Nếu người dùng hỏi bằng tiếng Việt → trả lời bằng tiếng Việt.
2. Nếu hỏi bằng ngôn ngữ khác → trả lời bằng ngôn ngữ đó.
3. Luôn thân thiện, vui vẻ! 😊
`;

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: `${newMessage}\n${textFromPDF}` },
            ],
          },
        ],
      });

      return result.response.candidates[0].content.parts[0].text;
    },

    async extractTextFromPDF(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const typedarray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
          let textContent = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item) => item.str).join(" ");
            textContent += pageText + "\n";
          }
          resolve(textContent);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    },

    readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    },
    //------------------------- ULTILITIES FUNCTIONS ------------------------------------------------
    addTypingResponse(
      text,
      isUser,
      sources = [],
      videos = [],
      relevantQuestions = [],
      isThinking = false
    ) {
      // Auto-detect markdown patterns in text
      const hasMarkdown =
        text &&
        (text.includes("**") || // Bold text
          text.includes("*") || // Italic text
          text.includes("`") || // Inline code
          text.includes("\n") || // Line breaks
          text.includes("#")); // Headers

      const typingMessage = {
        text: text,
        isUser: isUser,
        typing: true,
        timestamp: new Date().toLocaleTimeString(),
        username: isUser ? "You" : "FinBud Bot",
        sources: sources,
        videos: videos,
        relevantQuestions: relevantQuestions,
        isThinking,
        markdown: !isUser && hasMarkdown, // Enable markdown for bot messages with markdown content
      };
      this.messages.push(typingMessage);
      setTimeout(() => {
        typingMessage.typing = false;
        this.$forceUpdate();
      }, 1000);
    },
    extractStockCode(message) {
      if (!message || typeof message !== 'string') return null;
      // Match ticker-like tokens: 3-5 uppercase letters, optionally with a dot (BRK.B)
      // Require token length >= 3 to avoid matching acronyms like 'AI' or 'OK'.
      const pattern = /\b([A-Z]{3,5}(?:\.[A-Z])?)\b/g;
      const matches = [];
      let m;
      while ((m = pattern.exec(message)) !== null) {
        // Exclude very common short words or words that are followed by punctuation that indicates it's not a ticker
        const token = m[1];
        if (token && token.length >= 3) matches.push(token);
      }
      return matches.length ? matches : null;
    },
    openNewWindow(url) {
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const width = screenWidth * 0.7; // 80% of screen width
      const height = screenHeight * 0.53; // 80% of screen height
      const left = (screenWidth - width) / 2;
      const top = (screenHeight - height) / 2;
      this.newWindow = window.open(
        url,
        "_blank",
        `resize=0,toolbar=0,location=0,menubar=0,width=${width},height=${height},left=${left},top=${top}`
      );
      if (this.newWindow) {
        // Set up interval to check if the window has been closed
        this.windowCheckInterval = setInterval(() => {
          if (this.newWindow.closed) {
            this.handleWindowClose();
          }
        }, 1000); // Check every second
        window.addEventListener("click", this.closeOnClickOutside);
        this.overlayEnabled = true;
      }
    },
    // TO BE USED IN SPEND + ADD
    async calculateNewBalance(amount) {
      try {
        const userId = this.$store.getters["users/userId"];
        if (!userId) return 0;

        const response = await api.get(`/transactions/u/${userId}`);
        const transactions = response.data;

        if (!transactions || transactions.length === 0) {
          // If no transactions exist, return just the new amount
          return amount;
        }

        // Sort transactions by date (newest first)
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the current balance from the most recent transaction
        const currentBalance = parseFloat(transactions[0].balance) || 0;
        const newAmount = parseFloat(amount) || 0;

        // Calculate new balance
        const newBalance = currentBalance + newAmount;

        // Verify the result is a valid number
        if (isNaN(newBalance)) {
          console.error("Invalid balance calculation:", {
            currentBalance,
            amount: newAmount,
            transactions: transactions[0],
          });
          return 0;
        }

        return newBalance;
      } catch (err) {
        console.error("Error calculating new balance:", err.message);
        return 0;
      }
    },
    async checkAccountBalance() {
      try {
        const userId = this.$store.getters["users/userId"];
        const response = await api.get(`/transactions/u/${userId}`);
        const transactions = response.data;

        if (transactions.length === 0) {
          return "no_transactions"; // Special case for handling #add
        }

        return transactions[0].balance !== 0;
      } catch (error) {
        console.error("Error checking account balance:", error);
        return false;
      }
    },

    // TO BE USED IN SPEND + ADD
    async addTransaction(description, amount, type, category) {
      try {
        const userId = this.$store.getters["users/userId"];
        if (!userId) {
          throw new Error("User not authenticated");
        }

        // Calculate new balance first
        const newBalance = await this.calculateNewBalance(amount);
        const date = new Date().toISOString();

        // Make API call with all required fields
        const response = await api.post(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions`,
          {
            userId,
            description,
            amount,
            balance: newBalance,
            date,
            type,
            category,
          }
        );

        // Emit event to update other components
        this.$eventBus?.$emit("transaction-added", {
          userId,
          description,
          amount,
          balance: newBalance,
          date,
          type,
          category,
          _id: response.data._id || response.data.id,
        });

        // Also try to trigger store updates if available
        if (this.$store.dispatch) {
          this.$store.dispatch("transactions/refreshTransactions");
        }

        return {
          category,
          balance: newBalance,
        };
      } catch (err) {
        console.error("Error adding transaction:", err.message);
        throw err; // Re-throw to handle in calling code
      }
    },
    async scrollChatFrameToBottom() {
      await new Promise((r) => setTimeout(r, 200));
      const chatFrame = document.querySelector(".chat-frame-content");
      if (chatFrame) {
        chatFrame.scrollTo({
          top: chatFrame.scrollHeight,
          behavior: "smooth", // Smooth scrolling effect
        });
      }
    },
    async setScrollHeightBottomn() {
      await new Promise((r) => setTimeout(r, 200));
      const chatFrame = document.querySelector(".chat-frame-content");
      if (chatFrame) {
        chatFrame.scrollTo({
          top: chatFrame.scrollHeight,
        });
      }
    },
    handleQuestionClick(question) {
      const searchQuery = `#search ${question}`;
      this.sendMessage(searchQuery);
    },
    triggerConfetti() {
      this.showConfetti = true;
      setTimeout(() => {
        this.showConfetti = false;
      }, 5000);
    },
    async updateCurrentThread(threadID) {
      this.isLoadingMessages = true;
      try {
        this.messages = [];
        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${threadID}`;
        const chats = await axios.get(chatApi);
        const chatsData = chats.data;
        if (Array.isArray(chatsData)) {
          for (const chat of chatsData) {
            const prompt = {
              text: chat.prompt.toString(),
              isUser: true,
              typing: false,
              timestamp: chat.creationDate,
              sources: chat.sources,
              videos: chat.videos,
              relevantQuestions: chat.followUpQuestions,
            };
            this.messages.push(prompt);
            const responses = chat.response;
            if (Array.isArray(responses)) {
              responses.forEach((responseData) => {
                const response = {
                  text: responseData,
                  isUser: false,
                  typing: false,
                  timestamp: chat.creationDate,
                  sources: chat.sources,
                  videos: chat.videos,
                  relevantQuestions: chat.followUpQuestions,
                };
                this.messages.push(response);
              });
            }
            if (chat.htmlContent) {
              chat.htmlContent.forEach((htmlContent) => {
                const htmlResponse = {
                  text: "",
                  isUser: false,
                  typing: false,
                  timestamp: chat.creationDate,
                  htmlContent: htmlContent,
                  sources: chat.sources,
                  videos: chat.videos,
                  relevantQuestions: chat.followUpQuestions,
                };
                this.messages.push(htmlResponse);
              });
            }
          }
        } else {
          console.error("Error: chatsData is not an array");
        }
        // Scroll to the bottom after loading messages
        await this.setScrollHeightBottomn();
        
        if (this.messages.length === 0) {
          this.pushSloganMessage();
        }
        this.isLoadingMessages = false;
      } catch (err) {
        console.error("Error on updating to current thread:", err.message);
      }
    },
    async categorizeTransaction(description, type) {
      const categories =
        type === "Income"
          ? [
              "Salary",
              "Freelance & Side Job",
              "Allowance",
              "Investment Return",
              "Gift",
              "Refund",
            ]
          : [
              "Food & Groceries",
              "Housing & Utilities",
              "Transportation",
              "Health & Wellness",
              "Lifestyle & Subscriptions",
            ];

      let category = "";
      let attempts = 0;
      const maxAttempts = 3;

      while (!categories.includes(category) && attempts < maxAttempts) {
        const prompt = `You are a smart finance assistant. Given the transaction description: ${description}, and the type: ${type}, select the most appropriate category from the following list:
${categories.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Respond ONLY with the category name, and nothing else.`;

        const response = await gptServices([{ role: "user", content: prompt }]);

        category = response.trim().replace(/^"(.*)"$/, "$1");

        if (!categories.includes(category)) {
          // Nếu chưa phân loại được --> Gọi API tạo câu trả lời tự động giải thích tại sao
          const explanationPrompt = `You are a smart finance assistant. The user described the transaction as: "${description}". 
You tried to categorize it into type "${type}" but none of the expected categories match correctly.
Please write a short, friendly explanation telling the user why you cannot categorize this yet and politely ask them to clarify more.`;

          const explanation = await gptServices([
            { role: "user", content: explanationPrompt },
          ]);

          await this.addTypingResponse(explanation.trim(), false);
          return null; // Ngưng luôn, chờ user clarify
        }

        attempts++;
      }

      return category;
    },
    async onDeepResearchComplete() {
      console.log("Deep research workflow completed");
      this.currentMode = "normal";
      this.deepResearchMode = false;

      // Start normal chat with backend deep research
      await this.sendDeepResearchMessage(this.userPrompt);
    },

    addMessage(role, content) {
      const message = {
        text: content,
        isUser: role === "user",
        typing: false,
        timestamp: new Date().toLocaleTimeString(),
      };

      this.messages.push(message);
      this.conversationHistory.push({ role, content });

      this.$nextTick(() => this.scrollChatFrameToBottom());
    },

    async sendDeepResearchMessage(message) {
      try {
        // Add user message to conversation history first
        this.conversationHistory.push({ role: "user", content: message });

        // Add thinking animation
        this.addTypingResponse(
          "🧠 FinBud đang xử lý yêu cầu deep research...",
          false,
          [],
          [],
          [],
          true
        );

        // Process with local deep research service
        const { deepResearchService } = await import(
          "@/services/deepResearchService.js"
        );
        const response = await deepResearchService.processMessage(
          message,
          this.conversationHistory
        );

        // Remove thinking animation
        if (
          this.messages.length > 0 &&
          this.messages[this.messages.length - 1].thinking
        ) {
          this.messages.pop();
        }

        let assistantMessage;
        if (typeof response === "object" && response.report) {
          assistantMessage = {
            isUser: false,
            isDeepResearch: true,
            report: response.report,
            symbol: (() => {
              if (!response.ticker) return "";
              const raw = Array.isArray(response.ticker)
                ? response.ticker[0]
                : response.ticker;
              const codes = this.extractStockCode(raw);
              return Array.isArray(codes) ? codes[0] : raw;
            })(),
            typing: false,
            timestamp: new Date().toLocaleTimeString(),
            relevantQuestions: response.relevantQuestions,
          };
        } else {
          assistantMessage = {
            text: response,
            isUser: false,
            markdown: true,
            typing: false,
            timestamp: new Date().toLocaleTimeString(),
            relevantQuestions: response.relevantQuestions,
          };
        }

        this.messages.push(assistantMessage);
        this.conversationHistory.push({ role: "assistant", content: response });

        this.$nextTick(() => this.scrollChatFrameToBottom());
      } catch (error) {
        console.error("Deep research error:", error);
        // Remove thinking animation
        if (
          this.messages.length > 0 &&
          this.messages[this.messages.length - 1].thinking
        ) {
          this.messages.pop();
        }
        this.addMessage(
          "assistant",
          `Xin lỗi, có lỗi khi xử lý yêu cầu deep research: ${error.message}. Vui lòng thử lại.`
        );
      }
    },

    async sendRagMessage(message) {
      try {
        console.log("🤖 SENDING RAG REQUEST:", {
          query: message,
          top_k: 5,
          expand_n_query: 2,
          keep_top_k: 3,
        });

        const response = await axios.post(
          `${process.env.RAG_API_BASE_URL}/api/query`,
          {
            query: message,
            top_k: 5,
            expand_n_query: 2,
            keep_top_k: 3,
          }
        );

        console.log("✅ RAG RESPONSE RECEIVED:", {
          hasContext: !!response.data.context,
          contextLength: response.data.context?.length || 0,
        });

        // Extract context from response
        const context = response.data.context;
        if (!context) {
          console.warn("⚠️ No context received from RAG");
          this.ragStatus = "error";
          throw new Error("No context received from RAG");
        }

        this.ragStatus = "success";
        return context;
      } catch (error) {
        console.error("❌ Error in sendRagMessage:", error);
        this.ragStatus = "error";
        throw error; // Propagate error to handleUserSubmit for fallback
      }
    },

    async handleRagComplete() {
      this.showRagProcess = false;
      this.ragStatus = "loading"; // Reset status for next use
    },
  },
  mounted() {
    // Welcome is shown via hero + chips when messages are empty (see showWelcomeHero).
  },
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  container-type: size;
  container-name: messageComponent userInputComponent;
  overflow: hidden;

  --content-max-width: 600px;
  --content-padding-horizontal: 20px;
}

.finbud-chat {
  background: linear-gradient(180deg, #fafbfc 0%, #f4f6f9 100%);
  min-height: 0;
  flex: 1;
}

.finbud-hero {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 28px var(--content-padding-horizontal) 8px;
  box-sizing: border-box;
  text-align: center;
  flex-shrink: 0;
}

.finbud-slogan {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #22a36a;
  margin: 0 0 16px;
}

.finbud-hero-copy {
  font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  font-size: 1.0625rem;
  line-height: 1.65;
  color: #2d3142;
  text-align: left;
  max-width: 100%;
}

.finbud-hero-copy :deep(em) {
  font-style: normal;
  font-weight: 600;
  color: #1a1d26;
}

.finbud-hero-copy :deep(.finbud-hero-hint) {
  display: block;
  margin-top: 8px;
  font-size: 0.9375rem;
  color: #5c6378;
}

.chat-frame-content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 12px var(--content-padding-horizontal) 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 0;
  width: 100%;
}

.message-wrapper {
  width: 100%;
}

.analysis-section {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.analysis-section h2 {
  color: #1a1a1a;
  margin-bottom: 15px;
  font-size: 1.5em;
}

.analysis-section h3 {
  color: #3498db;
  margin: 15px 0 10px;
  font-size: 1.2em;
}

.analysis-section p {
  margin-bottom: 10px;
  line-height: 1.5;
}

.analysis-section ul {
  margin-left: 20px;
  margin-bottom: 15px;
}

.analysis-section li {
  margin-bottom: 5px;
}

.top-spacer {
  height: 100px;
  /* Or any height you desire to push content down */
}

.workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.workflow-step {
  display: flex;
  gap: 16px;
  width: 100%;
}

.step-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-content {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  max-width: 100%;
  /* Ensure content doesn't overflow */
}

.step-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: var(--card-bg);
  border-radius: 12px;
}

.step-indicator {
  font-size: 12px;
  color: #9ca3af;
  margin-right: 10px;
}

.step-indicator.active {
  color: #f59e0b;
  animation: pulse 1.5s infinite;
}

.step-indicator.completed {
  color: #10b981;
}

.step-title {
  flex: 1;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.step-body {
  background-color: var(--card-bg);
  border-radius: 0 0 12px 12px;
  padding: 16px;
  margin-top: 2px;
  max-width: 100%;
  /* Ensure content doesn't overflow */
  word-wrap: break-word;
  /* Allow text to wrap */
}

.step-message {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.processing-icon {
  animation: spin 2s linear infinite;
}

.completed-icon {
  color: #10b981;
}

.message-text {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.5;
}

/* Slogan Message Styles */
.slogan-message-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px 0;
  width: 100%;
}

.slogan-message-card {
  position: relative;
  background: white;
  padding: 40px;
  border-radius: 32px;
  text-align: center;
  border: 1px solid #E2E8F0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  max-width: 400px;
  width: 90%;
  overflow: hidden;
}

.slogan-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
  border-radius: 50%;
  animation: slogan-pulse-anim 4s infinite alternate;
}

@keyframes slogan-pulse-anim {
  from { scale: 0.8; opacity: 0.5; }
  to { scale: 1.2; opacity: 1; }
}

.slogan-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
}

.slogan-text {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1E293B;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

.slogan-sub {
  font-size: 0.95rem;
  color: #64748B;
  font-weight: 500;
  margin-bottom: 24px;
}

.slogan-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.slogan-btn {
  background: #F1F5F9;
  border: 1px solid #E2E8F0;
  padding: 10px 20px;
  border-radius: 99px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1E293B;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.slogan-btn:hover {
  background: white;
  border-color: #3B82F6;
  color: #3B82F6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.animate-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-header-spirit {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(250, 251, 252, 0.9) 0%, rgba(250, 251, 252, 0) 100%);
  backdrop-filter: blur(10px);
}

.fixed-slogan-band {
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #3B82F6;
  border-radius: 99px;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  color: #3B82F6;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.fixed-slogan-band:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.2);
  background: white;
}

.breathing-indicator {
  width: 10px;
  height: 10px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
  animation: breathe 2s infinite ease-in-out;
}

@keyframes breathe {
  0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  50% { transform: scale(1.4); opacity: 0.6; box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.spirit-sparkles {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
  transform: skewX(-20deg);
  animation: sparkle-sweep 3s infinite;
}

@keyframes sparkle-sweep {
  0% { left: -100%; }
  20% { left: 150%; }
  100% { left: 150%; }
}

@media (max-width: 768px) {
  .chat-header-spirit {
    height: 50px;
  }
  .fixed-slogan-band {
    font-size: 0.75rem;
    padding: 6px 16px;
    letter-spacing: 0.1em;
  }
}

/* Quick Actions Style */
.quick-action-chips {
  display: flex;
  gap: 12px;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.action-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 20px;
  border: 3px solid #EEF2FF;
  background: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 10px rgba(167, 139, 250, 0.05);
}

.action-chip:hover {
  transform: translateY(-5px) scale(1.05);
  border-color: var(--agent-button-bg-color, #A78BFA);
  box-shadow: 0 10px 25px rgba(167, 139, 250, 0.15);
}

.game-chip { color: #A78BFA; }
.trend-chip { color: #4ADE80; }
.plan-chip { color: #60A5FA; }

.hero-decorative-blobs {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: -1;
}

.hero-decorative-blobs::after {
  content: '';
  position: absolute;
  top: 20%;
  left: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.15) 0%, rgba(167, 139, 250, 0) 70%);
  filter: blur(40px);
  animation: float-blob 10s infinite alternate;
}

@keyframes float-blob {
  from { transform: translate(0, 0); }
  to { transform: translate(50px, 30px); }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.suggestion-wrapper {
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 var(--content-padding-horizontal);
  box-sizing: border-box;
  flex-shrink: 0;
}

.chat-container :deep(.user-input-container) {
  flex-shrink: 0;
}
.fixed-slogan-band {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--bg-primary, rgba(248, 250, 255, 0.9));
  backdrop-filter: blur(8px);
  text-align: center;
  padding: 10px 0;
  font-weight: 800;
  color: var(--fin-speak-accent, #4ADE80);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.online-indicator {
  width: 10px;
  height: 10px;
  background-color: var(--fin-speak-accent, #4ADE80);
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 8px var(--fin-speak-accent, #4ADE80);
  animation: pulse-online 2s infinite cubic-bezier(0.66, 0, 0, 1);
}

@keyframes pulse-online {
  0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
}

:global(html.dark-mode) .fixed-slogan-band {
  background: var(--bg-primary, #1e1e2e);
}
.confetti-cannon {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10000;
}

.confetti-bit {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #A78BFA;
  top: -20px;
  border-radius: 2px;
  animation: confettiFall 4s linear infinite;
}

.confetti-bit:nth-child(3n) { background: #4ADE80; }
.confetti-bit:nth-child(3n+1) { background: #FF7A7A; }
.confetti-bit:nth-child(3n+2) { background: #60A5FA; }

@keyframes confettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

/* Randomize positions */
.confetti-bit:nth-child(1) { left: 10%; animation-delay: 0s; }
.confetti-bit:nth-child(2) { left: 20%; animation-delay: 0.5s; }
.confetti-bit:nth-child(3) { left: 30%; animation-delay: 1s; }
.confetti-bit:nth-child(4) { left: 40%; animation-delay: 0.2s; }
.confetti-bit:nth-child(5) { left: 50%; animation-delay: 1.5s; }
.confetti-bit:nth-child(6) { left: 60%; animation-delay: 0.8s; }
.confetti-bit:nth-child(7) { left: 70%; animation-delay: 2s; }
.confetti-bit:nth-child(8) { left: 80%; animation-delay: 0.4s; }
.confetti-bit:nth-child(9) { left: 90%; animation-delay: 1.2s; }
.confetti-bit:nth-child(10) { left: 5%; animation-delay: 1.8s; }
</style>
