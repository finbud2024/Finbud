<template>
  <div class="chat-container">
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
          @question-click="handleQuestionClick"
          @link-click="handleMessageLinkClick"
        />

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
    </ChatFrame>
    <ChatSuggestion
      v-if="showSuggestion"
      :lan="this.$i18n.locale"
      class="suggestion-wrapper"
      @suggestion-selected="handleSuggestion"
    />
    <UserInput
      ref="userInput"
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
  },
  data() {
    return {
      currentUserMessageText: "",
      messages: [],
      sources: [],
      videos: [],
      relevantQuestions: [],
      botAvatar: require("@/assets/botrmbg.png"),
      chatMode: "",
      showDeepResearchWorkflow: false,
      showThinkingProcess: false,
      showRagProcess: false,
      ragStatus: 'loading',
      conversationHistory: [],
      researchBrief: null,
      autoMessageProcessed: false,
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
		showSuggestion() {
			return this.messages.length === 1;
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
		}
	},
	created() {
		this.openai = new OpenAI({
			apiKey: process.env.VUE_APP_OPENAI_API_KEY,
			dangerouslyAllowBrowser: true,
		});
	},
	methods: {
		// ---------------------------- MAIN FUNCTIONS FOR HANDLING EVENTS --------------------------------
		async handleUserSubmit({ message, file }) {
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

    // ---------------------------- RESPONSE MESSAGE ----------------------------
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
					- For "Xin chào", "alo": "Vietnamese"
          - For any language that you cannot detect, return "Vietnamese" by default.
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
					- User intent: Ask for the CURRENT MARKET PRICE (a number) of a specific stock - "how much does it cost right now?"
          - Only trigger when the user wants a live price value, not an explanation.
					- Phrases may include: "bao nhiêu tiền", "giá bao nhiêu", "price of ", "how much is", "current price of", "hiện tại bao nhiêu", "price of" etc.
          - Do not trigger for definition-style questions such as "là gì", "nghĩa là gì", "what is", "what does ... mean" - those are definitions, not price queries.
					- Format: **[STOCK_CODE_IN_UPPERCASE]**  
					- Example: "giá cổ phiếu của Coca Cola" → Return "KO", "What's the price of tesla stock?" → "TSLA"
          - COUNTER-EXAMPLE: "giá cổ phiếu của tesla là gì?" → NOT this action (this is a definition question)
          - COUNTER-EXAMPLE: "cổ phiếu là gì?" → NOT this action

					2. **Search**  
					- Trigger only when the user is requesting for detailed information or definitions about specific concepts, terms, or topics that are not related to stock prices, not conversational questions.
					- Example triggers: "Explain ROI", "What is inflation?", "Tell me about compound interest"
					- Format: #search [term]					

					3. **Define Financial Term**  
					- User intent: Ask for the MEANING, DEFINITION, or CONCEPT of a financial term, instrument, or asset — "what is X?", "explain X"
          - Trigger phrases: "là gì", "nghĩa là gì", "what is", "what does ... mean", "explain", "define"
          - Preserve the FULL phrase being defined. Do not reduce it to a shorter generic term unless the user clearly asks only about the generic term.
          - If the phrase includes a company name, keep the company name in the returned term when it is part of the concept being asked about.
          - Do not convert a definition question into a live stock price query.
					- Format: **#define [term]**
          - Example: "What does IPO mean?" → "#define IPO"
          - Example: "cổ phiếu là gì?" → "#define cổ phiếu" (asking what a share/stock is in general, not a specific stock price)
          - Example: "cổ phiếu apple là gì?" → "#define cổ phiếu apple" (asking what a share/stock of apple is)
          - Example: "giá cổ phiếu của tesla là gì?" → "#define cổ phiếu tesla" (asking what a stock price is)
          - Example: "What is a bond?" → "#define bond"

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
					- Format: **#analyze**
					- Example: "Analyze my portfolio" → "#analyze"

					### Instruction:
					Given the user message: "${newMessage}", respond with the correct formatted command according to the rules above.  
					If no suitable category is found, return the original message unchanged: "${newMessage}".
					`,
          },
        ]);

        // HANDLE DEFINE(2)
        if (gptDefine.toLowerCase().includes("#define")) {
          try {
            const term = gptDefine
              .substring(
                gptDefine.toLowerCase().indexOf("define") + "define".length
              )
              .trim();
            const prompt = `
            You are a financial tutor.

            Explain the exact phrase: "${term}"

            Requirements:
            - Keep the full phrase exactly as written.
            - Answer in ${language}.
            - Write in a simple, beginner-friendly way (like explaining to a student).
            - Do NOT skip structure. Follow the format strictly.
            - Sections title should be translated into ${language} as well.
            - Never in this format : [Company name] (url), Company name (url), (url), [url]
            Structure:

            **Definition:**
            - Clearly explain what the phrase means in 1–2 sentences.
            - Mention the company and market if relevant.

            **Simple explanation:**
            - Break it down in bullet points.
            - Explain what happens when someone buys this asset.
            - Explain what the price represents.

            **Example:**
            - Give a realistic numerical example (use USD or appropriate currency).
            - Show how much money is needed to buy 1 share and multiple shares.

            Rules
            - Be clear, structured, and easy to scan.
            - Use bullet points where helpful.
            - Do NOT hallucinate real-time data or fake sources.
            - Do NOT give investment advice.
            - Always include the company name if the term is related to a specific company, and link to the company's official website if it exists.
            - Bold the section titles.
              - In definition section:
                - Bold important financial terms.
                - Bold the company name, stock exchange name, index name, organization name, or any specific named entity
              - In explanation section:
                - Bold any important points or concepts.
              - In example section:
                - Bold important numbers, prices, quantities, and specific values that help the user understand the concept.
            - Bold the name of company and group, specific name, or stock exchange, for example NASDAQ
            - Inclue the link of the real wikipedia page of the company, specific group,or stock exchange that it exists, does not include if it does not.
            - If the link of the real wikipedia page related to the company exists, replace anywhere that had the full company name with <a = href="wikipedia_url" target="_blank"> full company name </a> that has the "wikipedia_url" in this format wikipedia/wiki/companyname, bold its name and just appear one time at the first time the company name is mentioned in the answer, and keep the company name without link in the rest of the answer.
            - If the link of the real wikipedia page related to the organization exists, replace anywhere that had the organization name with <a = href="wikipedia_url" target="_blank">organization name </a> that has the "wikipedia_url" in this format wikipedia/wiki/organizationname, and just appear one time at the first time the organization name is mentioned in the answer, and keep the organization name without link in the rest of the answer.
            - If a stock exchange is mentioned in the answer and there is a real Wikipedia page for that exact stock exchange, then on its first mention:
              - bold its name
              - wrap it with a link to that Wikipedia page
              - use this format: <a href="WIKIPEDIA_URL" target="_blank"><b>Stock Exchange Name</b></a> that has the "WIKIPEDIA_URL" in this format wikipedia/wiki/stockexchangename
            - After the first mention, keep the stock exchange name as plain bold text without a link.
            `;
            const gptResponse = await gptServices([
              { role: "user", content: prompt },
            ]);
            if (!gptResponse) {
              throw new Error("No response from GPT for definition.");
            }
            const links = this.extractDistinctPreviewLinks(gptResponse);
            const previewEntries = await Promise.all(
              links.map(async (link) => {
                const prompt_summarize = `
              You are a helpful assistant that summarizes the content of a webpage based on its ${link}
              Write the answer in ${language}.
              Your goals is to produce a clean, structured summary that helps the user understand the content in the page.
              Follow these rules carefully:
              - Use only information that is clearly supported by the webpage content.
              - Do not invent missing facts.
              - Do not include a section if the information is not available or not relevant.
              - Keep the writing clear, factual, and easy to scan.
              - Prefer short paragraphs over long dense blocks.
              - If the page is about a company, use the company-focused format below.
              - If the page is not about a company, use the non-company format below.
              - Do not mention these instructions in the answer.
              - Bold the section titles.
              If the webpage is about a company, use this exact format:
              [Title] is the name of company, organization, stock exchange, or financial instrument that the webpage is about and it will be written in English even though ${language} is different than English.

              [Title] is [1-2 sentence summary explaining what the company is, what it does, where it is based if available, and why it is notable].

              Key facts
              - Founded: [date or year if available]
              - Founders: [name(s) if available]
              - Headquarters: [location if available]
              - Core products/services: [main products or services if available]
              - CEO: [name if available]

              Business segments
              [Write 1 short paragraph explaining the company’s main business areas, major revenue segments, or how its operations are divided.]

              Technology and innovation
              [Write 1 short paragraph about the company’s technology, product strengths, innovations, or operating approach, only if available.]

              Ecosystem / market position
              [Write 1 short paragraph about its broader ecosystem, partnerships, infrastructure, customer base, or market role, only if available.]

              Recent developments and challenges
              [Write 1 short paragraph about recent strategy shifts, competition, risks, or major challenges, only if available from the page.]

              If the webpage is NOT about a company, use this format instead:

              [Title]

              [1-2 sentence summary of what the page is about.]

              Key points
              - [important point 1]
              - [important point 2]
              - [important point 3]

              Why it matters
              [1 short paragraph explaining the significance, purpose, or practical meaning of the topic.]

              Important details
              [1 short paragraph with any extra context that helps the user understand the topic better.]

              Style requirements:
              - The title must appear first on its own line.
              - Use the section headings exactly as written when relevant.
              - Skip empty or unsupported sections.
              - Do not add bullet points outside the "Key facts" or "Key points" sections.
              - Do not include opinions, investment advice, or speculation.
              - Except only the title, key facts, business segments, technology and innovation, ecosystem/market position, and recent developments and challenges sections could be in ${language}.
              `;

                try {
                  const gptResponse_summarize = await gptServices([
                    { role: "user", content: prompt_summarize },
                  ]);

                  if (!gptResponse_summarize) {
                    return null;
                  }

                  return this.createPreviewEntry(link, gptResponse_summarize);
                } catch (summaryError) {
                  console.error(
                    `Error generating preview summary for ${link}:`,
                    summaryError
                  );
                  return null;
                }
              })
            );

            this.emitPreviewUpdate(term, previewEntries.filter(Boolean));
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
            const gptResponse = await gptServices([
              {
                role: "user",
                content: `${prompt}. 
						Response in this language ${language}. Previous Context to refer to if user asks ${historyChat}`,
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
    extractDistinctPreviewLinks(html) {
      if (!html || typeof html !== "string") {
        return [];
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const uniqueLinks = new Map();

      Array.from(doc.querySelectorAll("a"))
        .map((link) => this.normalizePreviewLink(link.getAttribute("href")))
        .filter(Boolean)
        .forEach((link) => {
          if (!uniqueLinks.has(link)) {
            uniqueLinks.set(link, link);
          }
        });

      return Array.from(uniqueLinks.values());
    },
    normalizePreviewLink(link) {
      if (!link || typeof link !== "string") {
        return null;
      }

      const trimmedLink = link.trim();
      if (!trimmedLink) {
        return null;
      }

      if (/^https?:\/\//i.test(trimmedLink)) {
        return trimmedLink;
      }

      if (/^\/\/[^/]/.test(trimmedLink)) {
        return `https:${trimmedLink}`;
      }

      if (/^(?:www\.)?[^\s]+\.[^\s]+/i.test(trimmedLink)) {
        return `https://${trimmedLink}`;
      }

      if (/^(?:en\.)?wikipedia\.org\/wiki\//i.test(trimmedLink)) {
        return `https://${trimmedLink}`;
      }

      if (/^wikipedia\/wiki\//i.test(trimmedLink)) {
        return `https://en.wikipedia.org/${trimmedLink.replace(/^wikipedia\//i, "")}`;
      }

      if (/^wiki\//i.test(trimmedLink)) {
        return `https://en.wikipedia.org/${trimmedLink}`;
      }

      if (/^\/wiki\//i.test(trimmedLink)) {
        return `https://en.wikipedia.org${trimmedLink}`;
      }

      return trimmedLink;
    },
    createPreviewEntry(link, summary) {
      const title = this.extractPreviewTitle(summary, link);
      return {
        id: link,
        title,
        url: link,
        sourceLabel: this.formatPreviewSourceLabel(link),
        content: this.formatPreviewSummary(summary, title),
      };
    },
    extractPreviewTitle(summary, link) {
      const titleMatch = summary && summary.match(/^\s*\*\*(.+?)\*\*/m);
      if (titleMatch && titleMatch[1]) {
        return titleMatch[1].trim();
      }

      try {
        const url = new URL(link);
        const lastSegment = url.pathname.split("/").filter(Boolean).pop();
        return lastSegment
          ? decodeURIComponent(lastSegment).replace(/_/g, " ")
          : url.hostname;
      } catch (error) {
        return link;
      }
    },
    formatPreviewSourceLabel(link) {
      try {
        const url = new URL(link);
        return `${url.hostname}${url.pathname}`;
      } catch (error) {
        return link;
      }
    },
    formatPreviewSummary(summary, title) {
      const lines = (summary || "")
        .split("\n")
        .map((line) => line.trim());

      if (title && lines[0] === `**${title}**`) {
        lines.shift();
      }

      const htmlBlocks = [];
      let listItems = [];

      const formatInlineText = (text) =>
        text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      const flushList = () => {
        if (!listItems.length) {
          return;
        }

        htmlBlocks.push(
          `<ul class="preview-card-list">${listItems
            .map((item) => `<li>${formatInlineText(item)}</li>`)
            .join("")}</ul>`
        );
        listItems = [];
      };

      lines.forEach((line) => {
        if (!line) {
          flushList();
          return;
        }

        if (/^[-*]\s+/.test(line)) {
          listItems.push(line.replace(/^[-*]\s+/, ""));
          return;
        }

        flushList();

        const formattedLine = formatInlineText(line);
        if (/^<strong>.*<\/strong>:?$/.test(formattedLine)) {
          htmlBlocks.push(
            `<h4 class="preview-card-section-title">${formattedLine.replace(/:$/, "")}</h4>`
          );
          return;
        }

        htmlBlocks.push(`<p>${formattedLine}</p>`);
      });

      flushList();
      return htmlBlocks.join("");
    },
    emitPreviewUpdate(term, entries) {
      const entryCount = entries.length;

      this.$emit("preview-update", {
        title: "Reference preview",
        subtitle: entryCount
          ? `${entryCount} reference ${entryCount === 1 ? "window" : "windows"} for \"${term}\"`
          : `No reference links found for \"${term}\"`,
        description: entryCount
          ? `Showing one preview card for each distinct link returned in the answer. Each card contains the summary generated for that source.`
          : `The answer did not include any distinct links that could be shown in the preview panel.`,
        items: entryCount
          ? []
          : [
              "No linked company or exchange was found in this answer",
              "Ask another define question with a company or exchange name",
            ],
        entries,
      });
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
    handleMessageLinkClick({ href, text }) {
      const normalizedHref = this.normalizePreviewLink(href);

      this.$emit("preview-link-click", {
        href: normalizedHref,
        text: text || "",
      });
    },
    async updateCurrentThread(threadID) {
      try {
        this.messages = [];
        // let botInstruction = `Hế lô ${this.displayName} 👋\nBấm vào "Hướng dẫn" ở góc phải màn hình hoặc thử chat`;
        // if (this.$i18n.locale != "vi") {
        //   botInstruction = `Hello ${this.displayName} 👋\nPlease click \"Guidance\" for detailed instructions on how to use the chatbot`;
        // }
        // await this.addTypingResponse(botInstruction, false);
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
  // mounted() {
  //   const hasMessages = this.messages.length > 0;

  //   if (this.greeting && !hasMessages) {
  //     let botInstruction;
  //     if (!this.isAuthenticated) {
  //       botInstruction = `Hello, Guest!\nPlease click "Guidance" for detailed instructions on how to use the chatbot.\nAlso, sign in to access the full functionality of Finbud!`;
  //     } else if (!this.currentThreadID) {
  //       botInstruction = `Hello, ${this.displayName} 👋\nHow can I help you today?`;
  //     }

  //     if (botInstruction) {
  //       this.addTypingResponse(botInstruction, false);
  //     }
  //   }
  // },
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  container-type: size;
  container-name: messageComponent userInputComponent;

  --content-max-width: 800px;
  /* Define max width */
  --content-padding-horizontal: 15px;
  /* Define horizontal padding */
}

.chat-frame-content {
  flex: 1;
  overflow-y: auto;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  margin-bottom: 10px;
  padding: 20px var(--content-padding-horizontal) 0;
  box-sizing: border-box;
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

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
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
  width: 90%;
}
</style>
