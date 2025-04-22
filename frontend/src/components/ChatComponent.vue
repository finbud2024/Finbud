<template>
  <div class="chat-container">
    <ChatFrame>
      <div v-for="(message, index) in messages" :key="index">
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
        />
        <!-- Add TradingView widget after stock messages -->
        <TradingViewWidget
          v-if="message.showChart"
          :symbol="message.stockSymbol"
        />
      </div>
    </ChatFrame>
    <UserInput @send-message="handleUserSubmit" />
  </div>
</template>

<script>
// COMPONENT IMPORT
import ChatFrame from "./ChatFrame.vue";
import MessageComponent from "./MessageComponent.vue";
import UserInput from "./UserInput.vue";
import TradingViewWidget from "./TradingViewWidget.vue";
// SERVICES + LIBRARY IMPORT
import axios from "axios";
import { gptServices } from "@/services/gptServices";
import {
  getSources,
  getVideos,
  getRelevantQuestions,
} from "@/services/serperService.js";
import api from "@/utils/api";
import OpenAI from 'openai';
export default {
  name: "ChatComponent",
  props: {},
  components: { ChatFrame, MessageComponent, UserInput, TradingViewWidget},
  data() {
    return {
      messages: [],
      sources: [],
      videos: [],
      relevantQuestions: [],
      botAvatar: require("@/assets/botrmbg.png"),
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
  },
  created() {
    this.openai = new OpenAI({
      apiKey: process.env.VUE_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });
  },
  methods: {
    // ---------------------------- MAIN FUNCTIONS FOR HANDLING EVENTS --------------------------------
    handleUserSubmit({ message, file }) {
      if(file) {
        this.handleFileUpload(message, file);
      }
      else if(message) {
        this.sendMessage(message);
      }
    },

    // ---------------------------- RESPONSE MESSGE ----------------------------
    async sendMessage(newMessage) {
      const userMessage = newMessage.trim();
      const language = await gptServices([
        {
          role: "user",
          content: `Detect the language of this message and return only the language name in English. Examples:
					- For "Hello": "English"
					- For "Xin chào": "Vietnamese"
					Now detect this message: "${userMessage}"
          Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
        },
      ]);

      //UPDATE THREAD NAME BASED ON FIRST MESSAGE
      if (this.messages.length === 1) {
        const response = await gptServices([
          {
            role: "system",
            content: `I am a highly efficient summarizer. 
												Here are examples: 'Best vacation in Europe' from 
												'What are the best vacation spots in Europe?'; 
												'Discussing project deadline' from 
												'We need to extend the project deadline by two weeks due to unforeseen issues.' 
												Now, summarize the following user message within 3 to 4 words into a title:`,
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
            axios.put(threadApi, { title: response });
          } catch (err) {
            console.error("Error on updating thread name:", err.message);
          }
        }
      }

      //ONLY EXECUTE COMMAND/SHOW PROMPT IF THERE IS SOME MESSAGES IN THE USER INPUT
      if (userMessage.length != 0) {
        this.messages.push({
          text: userMessage,
          isUser: true,
          typing: true,
          timestamp: new Date().toLocaleTimeString(),
        });
        const answers = [];
				const htmlContents = [];
        let newSources = [];
        let newVideos = [];
        let newRelevantQuestions = [];

        // Add thinking message
        this.addTypingResponse("", false, [], [], [], true);

        const gptDefine = await gptServices([
        {
          role: "user",
          content: `You are FINBOT, an expert financial advisor with decades of experience in global markets, banking, investments, and personal finance. You have an encyclopedic knowledge of financial institutions, products, historical market events, and industry leaders. Your expertise spans across:

          1. Stock markets and public companies worldwide
          2. Financial terminology and concepts
          3. Banking products and services
          4. Investment strategies and portfolio management
          5. Personal finance management and budgeting
          6. Real estate markets
          7. Cryptocurrency and blockchain technology
          8. Financial history and famous business leaders

          Given a natural language message from the user, detect which of the following actions it belongs to. Extract the necessary information and return a **formatted command** for that action if found. ALWAYS answer in Vietnamese unless explicitly directed otherwise.
          
          You can detect even vague descriptions, implied relationships, or contextual references. Examples:
          - "Elon Musk's e-wallet company" → PayPal (PYPL)
          - "The social network Zuckerberg created" → Meta (META)
          - "The company with the bitten apple logo" → Apple (AAPL)
          - "The big search engine company" → Google (GOOGL)
          - "Warren Buffett's company" → Berkshire Hathaway (BRK.A, BRK.B)
          - "The largest e-commerce site" → Amazon (AMZN)
          - "That coffee chain with the green logo" → Starbucks (SBUX)
          - "The company making the iPhone" → Apple (AAPL)
          - "World's largest software company" → Microsoft (MSFT)
          - "That sports company with the swoosh" → Nike (NKE)
          
          When detecting company references:
          1. Consider both direct and indirect descriptions
          2. Identify companies by their products, services, founders, CEOs, or distinctive features
          3. Recognize company nicknames, slang terms, and cultural references
          4. Connect vague industry descriptions to major players in that sector
          
          ### Supported Actions & Return Formats:
          0. **General Message** (MAJORITY OF MESSAGES WILL BE THIS TYPE)
          - User intent: General message, not related to any specific action.
          - Format: **[user_message]**
          - Example: "Tell me about the weather today" → "Tell me about the weather today"
          - Example in Vietnamese: "Cho tôi biết về thời tiết hôm nay" → "Cho tôi biết về thời tiết hôm nay"

          1. **Stock Price**  
          - User intent: Ask for a stock price of any company (directly named or indirectly described)
          - Format: **[STOCK_CODE_IN_UPPERCASE]**  
          - Detect phrases like: "giá cổ phiếu", "stock price of", "bao nhiêu tiền cổ phiếu", "cổ phiếu ... giá bao nhiêu", "how much is ... trading for", "what's ... worth", etc.
          - Example: "giá cổ phiếu của Coca Cola" → "KO"
          - Example: "What's the price of tesla stock?" → "TSLA"
          - Example: "How's the stock of that streaming company with the red logo doing?" → "NFLX"
          - Example in Vietnamese: "Cổ phiếu của công ty làm iPhone đang giá bao nhiêu?" → "AAPL"

          2. **Search**  
          - Trigger for detailed information requests about financial concepts, market events, statistics, or comparisons
          - Format: **#search [term]**
          - Example: "Explain ROI compared to IRR" → "#search ROI vs IRR"
          - Example: "What happened during the 2008 financial crisis?" → "#search 2008 financial crisis"
          - Vietnamese: "Giải thích sự khác biệt giữa cổ phiếu và trái phiếu" → "#search sự khác biệt giữa cổ phiếu và trái phiếu"

          3. **Define Financial Term**  
          - User intent: Ask for meaning of a specific financial term or concept  
          - Format: **#define [term]**  
          - Example: "What does IPO mean?" → "#define IPO"
          - Example: "Explain what a bear market is" → "#define bear market"
          - Example in Vietnamese: "Thị trường giá xuống là gì?" → "#define thị trường giá xuống"

          4. **Top 5 Cryptocurrencies**  
          - User intent: Ask about top cryptocurrencies by market cap or performance
          - Format: **#crypto**  
          - Example: "Show me top cryptocurrencies" → "#crypto"
          - Example: "What are the largest digital currencies right now?" → "#crypto"
          - Example in Vietnamese: "Những đồng tiền số có giá trị nhất hiện nay?" → "#crypto"

          5. **Real Estate Lookup**  
          - User intent: Ask for properties in an area or housing market information
          - Format: **#realestate [area_name]**  
          - Example: "Show me houses in New York" → "#realestate new york"  
          - Example: "What's the housing market like in Miami?" → "#realestate miami"
          - Example in Vietnamese: "Cho tôi xem bất động sản ở quận 7" → "#realestate quan 7"
          - If no area is mentioned, default to: **#realestate San Jose**

          6. **Add a Transaction**  
          - User intent: Add money to the account (income, deposit, refund, salary, etc.)
          - Format: **#add [description] [amount]**  
          - Example: "I received 125 from a refund" → "#add refund 125"
          - Example: "Got my paycheck of $2,500 today" → "#add paycheck 2500"
          - Example in Vietnamese: "Tôi vừa nhận lương 15 triệu đồng" → "#add lương 15000000"

          7. **Track Spending**  
          - User intent: Record an expense or purchase
          - Format: **#spend [description] [amount]**  
          - Example: "I spent 80 on groceries" → "#spend groceries 80"
          - Example: "Just paid $120 for electricity bill" → "#spend electricity bill 120"
          - Example in Vietnamese: "Tao mua xe máy với giá 10 triệu" → "#spend xe máy 10000000"

          8. **Buy Stock**  
          - User intent: Buy shares of a company (directly named or vaguely described)
          - Format: **#buy [STOCK_CODE_IN_UPPERCASE] [quantity]**  
          - Example: "I want to buy 10 shares of Tesla" → "#buy TSLA 10"
          - Example: "Purchase 5 shares of that online retail giant" → "#buy AMZN 5"
          - Example in Vietnamese: "Mua 20 cổ phiếu của công ty điện thoại táo khuyết" → "#buy AAPL 20"

          9. **Sell Stock**  
          - User intent: Sell shares of a company (directly named or vaguely described)
          - Format: **#sell [STOCK_CODE_IN_UPPERCASE] [quantity]**  
          - Example: "Sell 5 shares of AAPL" → "#sell AAPL 5"
          - Example: "I want to get rid of my 10 shares in that social media company" → "#sell META 10"
          - Example in Vietnamese: "Bán 15 cổ phiếu của công ty xe điện của Elon Musk" → "#sell TSLA 15"

          10. **Add a Goal**  
          - User intent: Create a financial goal or savings target
          - Format: **#create goal**  
          - Example: "I want to create a savings goal for a house" → "#create goal"
          - Example: "Help me start a retirement plan" → "#create goal"
          - Example in Vietnamese: "Tôi muốn lập kế hoạch tiết kiệm cho con đi học" → "#create goal"

          11. **Analyze Portfolio**
          - User intent: Request analysis of investments or portfolio performance
          - Format: **#analyze**
          - Example: "Analyze my portfolio" → "#analyze"
          - Example: "How balanced are my investments?" → "#analyze"
          - Example in Vietnamese: "Đánh giá danh mục đầu tư của tôi có hợp lý không" → "#analyze"

          12. **Compare Investments**
          - User intent: Compare performance or potential of different investment options
          - Format: **#compare [option1] [option2]**
          - Example: "Which is better, Tesla or Ford stock?" → "#compare TSLA F"
          - Example: "Compare Bitcoin with Ethereum" → "#compare BTC ETH"
          - Example in Vietnamese: "So sánh cổ phiếu Apple với Microsoft" → "#compare AAPL MSFT"
          
          13. **Financial News**
          - User intent: Request latest financial news or updates about markets/companies
          - Format: **#news [topic/company]**
          - Example: "What's happening with tech stocks today?" → "#news tech stocks"
          - Example: "Latest news about Netflix" → "#news NFLX"
          - Example in Vietnamese: "Tin tức mới nhất về thị trường chứng khoán" → "#news thị trường chứng khoán"

          ### Decision-Making Logic:
          - For ambiguous messages, use this priority order: Stock Price > Define > Search > Compare > General
          - If detecting company references for stock operations, map to the correct ticker symbol:
            * Major tech companies: Apple (AAPL), Microsoft (MSFT), Google/Alphabet (GOOGL), Amazon (AMZN), Meta/Facebook (META), Tesla (TSLA), etc.
            * Financial institutions: JPMorgan (JPM), Bank of America (BAC), Wells Fargo (WFC), Visa (V), etc.
            * Retail: Walmart (WMT), Target (TGT), Costco (COST), etc.
            * Vietnamese companies: Vingroup (VIC), Vietcombank (VCB), FPT (FPT), etc.
          - For messages mentioning money without specific actions, treat as general inquiry
          - When amounts are unclear or missing, still identify the command type but note the missing information

          ### Important Note:
          Given the user message: "${newMessage}", respond ONLY with the correct formatted command according to the rules above.
          If no suitable category is found, return the original message unchanged: "${newMessage}".
          Your response will be processed further to generate a complete answer in Vietnamese.
          Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output
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
              const baseUrl = window.location.origin.includes("localhost")
                ? "http://localhost:8888"
                : "https://finbud.pro";

              const url = `${baseUrl}/stock-simulator?symbol=${stockSymbol}&quantity=${quantity}&action=buy&fullUI=true`;
              window.open(url, "_blank");
              // Wait for the page to load and auto-click the Preview Order button
              setTimeout(() => {
                window.addEventListener("load", () => {
                  const previewButton = document.querySelector(".preview-btn");
                  if (previewButton) previewButton.click();
                });
              }, 2000);
            } else {
              const res = "Invalid stock symbol or quantity";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".
                  Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
                },
              ]);
              this.addTypingResponse(Responsegpt, false);
            }
          } else {
            const res = "Invalid stock symbol or quantity";
            const Responsegpt = await gptServices([
              {
                role: "user",
                content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".
                Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
              },
            ]);
            this.addTypingResponse(Responsegpt, false);
          }
        }

        // HANDLE SELL (8)
        else if (gptDefine.toLowerCase().includes("#sell")) {
          try {
            const sellRegex = /#sell\s+([A-Z]+)\s+(\d+)/i;
            const match = gptDefine.match(sellRegex);
            if (match) {
              const stockSymbol = match[1].toUpperCase();
              const quantity = parseInt(match[2], 10);
              if (stockSymbol && !isNaN(quantity)) {
                const baseUrl = window.location.origin.includes("localhost")
                  ? "http://localhost:8888"
                  : "https://finbud.pro";

                const url = `${baseUrl}/stock-simulator?symbol=${stockSymbol}&quantity=${quantity}&action=sell`;
                window.open(url, "_blank");

								const res = `We've created the sell request for ${quantity} ${stockSymbol} shares.`;
								const Responsegpt = await gptServices([{ 
									role: "user", 
                  content: `Translate the following text ${res} into ${language}. Respond only with the translated text.
                  Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`
								}]);
								answers.push(Responsegpt);

                // Wait for the page to load and auto-click the Preview Order button
                setTimeout(() => {
                  window.addEventListener("load", () => {
                    const previewButton =
                      document.querySelector(".preview-btn");
                    if (previewButton) previewButton.click();
                  });
                }, 2000);
              } else {
                const res = "Invalid stock symbol or quantity";
                const Responsegpt = await gptServices([
                  {
                    role: "user",
                    content: `Translate "${res}" into the language detected from this message: "${newMessage}".
                    Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
                  },
                ]);
                this.addTypingResponse(Responsegpt, false);
              }
            } else {
              const res = "Invalid sell command format";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate "${res}" into the language detected from this message: "${newMessage}".
                  Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
                },
              ]);
              this.addTypingResponse(Responsegpt, false);
            }
          } catch (err) {
            console.error("Error in sell message:", err.message);
          }
        }
        // HANDLE ADD TRANSACTION (6)
        else if (gptDefine.toLowerCase().includes("#add")) {
          try {
            const match = gptDefine.match(/#add\s+([\p{L}\p{N}\s]+)\s+(\d+)/iu);
            if (match) {
              const description = match[1].trim();
              const amount = parseInt(match[2], 10);
              const balance = await this.calculateNewBalance(amount);
              await this.addTransaction(description, amount, balance);
              const res = `Transaction added: ${description}, $${amount}. New balance: $${balance}....`;
              console.log(res);
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text "${res}" into ${language}. Respond only with the translated text
                  Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
                },
              ]);
              console.log(Responsegpt);
              answers.push(Responsegpt);
            } else {
              const res =
                "Please specify the description and amount you want to add.";
              const Responsegpt = await gptServices([
                {
                  role: "user",
                  content: `Translate the following text "${res}" into ${language}. Respond only with the translated text
                  Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
                },
              ]);
              answers.push(Responsegpt);
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
                    content: `Translate the following text "${res}" into ${language}. Respond only with the translated text.
                    Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
                  },
                ]);
                answers.push(Responsegpt);
                // this.openNewWindow("/goal");
              } else {
                const description = match[1].trim();
                const amount = -parseInt(match[2], 10);
                const balance = await this.calculateNewBalance(amount);
                await this.addTransaction(description, amount, balance);
                const res = `Transaction spent: ${description}, $${Math.abs(
                  amount
                )}. New balance: $${balance}.`;
                const Responsegpt = await gptServices([
                  {
                    role: "user",
                    content: `Translate the following text "${res}" into ${language}. Respond only with the translated text.
                    Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
                  },
                ]);
                answers.push(Responsegpt);
              }
              //this.openNewWindow("/goal");
              const baseUrl = window.location.origin.includes("localhost")
                ? "http://localhost:8888"
                : "https://finbud.pro";

              const url = `${baseUrl}/goal/`;
              window.open(url);
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
                  content: `Translate the following text "${res}" into ${language}. Respond only with the translated text.
                  Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
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
				<div style="font-weight: 900; font-size: 30px"> Top 10 Ranking Coins </div>
				<table>
				<thead>
				    <tr>
				    <th>Name</th>
				    <th>Rank</th>
				    <th>Tier</th>
				    <th>Price</th>
				    <th>Symbol</th>
				    <th>Change</th>
				    </tr>
				</thead>
				<tbody id="tableBody" class="table-body">`;
          coinData.slice(0, 10).map((item) => {
            tableTemplate += `
				    <tr>
				    <td><img style="width: 50px; aspect-ratio: 1;" src=${item.iconUrl} alt=${
              item.name
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
				<div style="font-weight: 900; font-size: 30px"> Listing of 5 Properties in ${searchLocation} </div>
				<table>
				<thead>
				    <tr>
				    <th>Type</th>
				    <th>Address</th>
				    <th>Price</th>
				    <th>Status</th>
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
                content: `Translate "${alphavantageResponse}" into this language ${language}. Respond only with the translated text.
                Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
              },
            ]);
            answers.push(alphavantageResponsegpt);
            //chatgpt api
            const prompt = `Response in this language ${language}": generate a detailed analysis of ${stockCode} which currently trades at $${price}.
            Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`;
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
              window.open(url, "_blank");

              // Create response in user's language
							const res = "We've created the goal section for you to add your goals.";
							const Responsegpt = await gptServices([{ 
								role: "user", 
                content: `Translate the following text ${res} into ${language}. Respond only with the translated text.
                Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`
							}]);
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
							const responseGpt = await gptServices([{ 
								role: "user", 
                content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".
                Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output` 
							}]);
							answers.push(responseGpt);
						} else {
					
							this.addTypingResponse("", false, [], [], [], true);
							
							const userId = this.$store.getters["users/userId"];
							const apiUrl = `${process.env.VUE_APP_DEPLOY_URL}/chats/analyze-portfolio/${userId}`;
							
						
							const response = await axios.get(apiUrl);
							const analysisData = response.data;
							
							if (analysisData && analysisData.analysis) {
								
								if (analysisData.analysis.stock) {
									this.messages = this.messages.filter(msg => !msg.isThinking);
									
									
									this.messages.push({
										text: "",
										isUser: false,
										typing: false,
										timestamp: new Date().toLocaleTimeString(),
										htmlContent: analysisData.analysis.stock,
										username: "FinBud Bot",
										sources: [],
										videos: [],
										relevantQuestions: []
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
										relevantQuestions: []
									});
									htmlContents.push(analysisData.analysis.transaction);
								}
								
								if (!analysisData.analysis.stock && !analysisData.analysis.transaction) {
									const errorMsg = "Could not generate portfolio analysis. Please try again later.";
									const translatedError = await gptServices([{ 
										role: "user", 
                    content: `Translate the following text into ${language}. Respond only with the translated text: "${errorMsg}".
                    Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output` 
									}]);
									answers.push(translatedError);
								}
							} else {
								const noDataMsg = "No portfolio data available for analysis. Please add holdings or transactions first.";
								const translatedNoData = await gptServices([{ 
									role: "user", 
                  content: `Translate the following text into ${language}. Respond only with the translated text: "${noDataMsg}".
                  Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output` 
								}]);
								answers.push(translatedNoData);
							}
							
							
							this.messages = this.messages.filter(msg => !msg.isThinking);
						}
					} catch (err) {
						console.error("Error in analyze portfolio:", err.message);
						const errorMsg = "There was an error analyzing your portfolio. Please try again later.";
						const translatedError = await gptServices([{ 
							role: "user", 
              content: `Translate the following text into ${language}. Respond only with the translated text: "${errorMsg}".
              Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output` 
						}]);
						answers.push(translatedError);
					}
				}
	
        else {
          try {
						const historyChat = this.messages.slice(-10).map(msg => {
							return { role: msg.isUser ? "user" : "assistant", content: msg.text };
						});
						console.log(historyChat)
            const prompt = userMessage;
            const gptResponse = await gptServices([
              {
                role: "user",
                content: `${prompt}. 
						Response in this language ${language}. Previous Context to refer to if user asks ${historyChat}
            Respond with no formatting. Do not use any formatting like Italics, bold, or code blocks. Do not use any markdown language. Give raw output`,
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
    // --------------------------- READ FILE -----------------------------------------------------
    async handleFileUpload(newMessage, file) {
      this.isLoading = true;
      this.messages.push({
          text: newMessage,
          isUser: true,
          typing: true,
          timestamp: new Date().toLocaleTimeString(),
        });
      try {
        if (file.type.startsWith('image/')) {
          const result = await this.analyzeImage(file, newMessage);
          this.messages.push({
            text: result,
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
          });
        } 
        else if (file.type === 'application/pdf') {
          const result = await this.analyzePDF(file, newMessage);
          this.messages.push({
            text: result,
            isUser: false,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      } catch (err) {
        console.error('Error processing file:', err);
        this.addTypingResponse("Failed to process file", false);
      }
      
      this.isLoading = false;
    },

    async analyzeImage(file, newMessage) {
      const base64Image = await this.readFileAsBase64(file);
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",  
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: newMessage },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 300
      });
      return response.choices[0].message.content;
    },

    async analyzePDF(file, newMessage) {
      const uploadedFile = await this.openai.files.create({
        file, 
        purpose: "user_data"
      });
      
      const response = await this.openai.responses.create({
        model: "gpt-4o",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_file",
                file_id: uploadedFile.id
              },
              {
                type: "input_text",
                text: newMessage
              }
            ]
          }
        ],
      });
      
      // Clean up
      await this.openai.files.del(uploadedFile.id);
      return response.output_text;
    },

    readFileAsBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(',')[1]);
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
      };
      this.messages.push(typingMessage);
      setTimeout(() => {
        typingMessage.typing = false;
        this.$forceUpdate();
      }, 1000);
    },
    extractStockCode(message) {
      const pattern = /\b[A-Z]{2,5}\b/g;
      const matches = message.match(pattern);
      return matches;
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
      const accountCheck = await this.checkAccountBalance();
      if (!accountCheck) {
        return;
        // this.openNewWindow("/goal");
      }
      try {
        const userId = this.$store.getters["users/userId"];
        const response = await api.get(`/transactions/u/${userId}`);
        const transactions = response.data;

        // Sắp xếp giao dịch theo ngày gần nhất (mới nhất) trước
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Lấy số dư tài khoản hiện tại từ giao dịch gần nhất, thay vì tính lại
        const currentBalance =
          transactions.length > 0 ? transactions[0].balance : 0;

        return currentBalance + amount;
      } catch (err) {
        console.error("Error calculating new balance:", err.message);
        return 0; // Return 0 in case of error
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
    async addTransaction(description, amount, balance) {
      const accountCheck = await this.checkAccountBalance();
      if (!accountCheck) {
        return;
      }

      const userId = this.$store.getters["users/userId"]; // Get userId from store
      const date = new Date().toISOString(); // Get current date
      const type = amount > 0 ? "Expense" : "Income";

      try {
        await api.post(`/transactions`, {
          description,
          amount,
          balance,
          date,
          userId,
          type,
        });
      } catch (err) {
        console.error("Error adding transaction:", err.message);
        this.addTypingResponse("Error adding transaction.", false);
      }
    },


    async scrollChatFrameToBottom() {
      await new Promise((r) => setTimeout(r, 200));
      const chatFrame = document.querySelector(".chat-frame");
      chatFrame.scrollTo({
        top: chatFrame.scrollHeight,
        behavior: "smooth", // Smooth scrolling effect
      });
    },
    async setScrollHeightBottomn() {
      await new Promise((r) => setTimeout(r, 200));
      const chatFrame = document.querySelector(".chat-frame");
      chatFrame.scrollTo({
        top: chatFrame.scrollHeight,
      });
    },
    handleQuestionClick(question) {
      const searchQuery = `#search ${question}`;
      this.sendMessage(searchQuery);
    },
    async updateCurrentThread(threadID) {
      try {
        this.messages = [];
        const botInstruction = `Xin chào ${this.displayName}!\n Hãy bấm vào phần "Hướng dẫn" để biết hướng dẫn chi tiết về cách sử dụng chatbot.\n`;
        this.addTypingResponse(botInstruction, false);
        const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${threadID}`;
        const chats = await axios.get(chatApi);
        const chatsData = chats.data;
        if (Array.isArray(chatsData)) {
          chatsData.forEach((chat) => {
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
									relevantQuestions: chat.followUpQuestions
								};
								this.messages.push(htmlResponse);
							});
						}
          });
        } else {
          console.error("Error: chatsData is not an array");
        }
        // Scroll to the bottom after loading messages
        await this.setScrollHeightBottomn();
      } catch (err) {
        console.error("Error on updating to current thread:", err.message);
      }
    },
  },
  mounted() {
    if (!this.isAuthenticated) {
      const botInstruction = `Hello, Guest!\nPlease click "Guidance" for detailed instructions on how to use the chatbot.\nAlso, sign in to access the full functionality of Finbud!`;
      this.addTypingResponse(botInstruction, false);
    }
  },
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  position: relative;
  container-type: size;
  container-name: messageComponent userInputComponent;
}

.analysis-section {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.analysis-section h2 {
  color: #2c3e50;
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
  height: 100px;  /* Or any height you desire to push content down */
}
</style>
