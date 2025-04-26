<template>
	<div class="chat-container">
		<ChatFrame class="chat-frame-content">
			<div v-for="(message, index) in messages" :key="index">
				<MessageComponent :is-user="message.isUser" :text="message.text" :typing="message.typing"
					:is-thinking="message.isThinking" :htmlContent="message.htmlContent"
					:username="message.isUser ? displayName : 'FinBud Bot'"
					:avatar-src="message.isUser ? userAvatar : botAvatar"
					:sources="message.isUser ? [] : message.sources" :videos="message.isUser ? [] : message.videos"
					:relevantQuestions="message.isUser ? [] : message.relevantQuestions"
					@question-click="handleQuestionClick" />

				<!-- Add TradingView widget after stock messages -->
				<TradingViewWidget v-if="message.showChart" :symbol="message.stockSymbol" />
			</div>
			<!-- Agent Mode work flow - Only show when workflow starts -->
			<ChatAgent ref="chatAgent" v-if="showAgentWorkflow" @workflow-complete="handleWorkflowComplete"
				:scroll-to-bottom="scrollChatFrameToBottom" />
		</ChatFrame>
		<UserInput ref="userInput" @send-message="handleUserSubmit" @agent-mode="handleAgentMode" />
	</div>
</template>

<script>
// COMPONENT IMPORT
import ChatFrame from "./ChatFrame.vue";
import MessageComponent from "./MessageComponent.vue";
import UserInput from "./UserInput.vue";
import TradingViewWidget from "./TradingViewWidget.vue";
import ChatAgent from "./ChatAgent.vue";
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
export default {
	name: "ChatComponent",
	props: {},
	components: {
		ChatFrame,
		MessageComponent,
		UserInput,
		TradingViewWidget,
		ChatAgent,
	},
	data() {
		return {
			messages: [],
			sources: [],
			videos: [],
			relevantQuestions: [],
			botAvatar: require("@/assets/botrmbg.png"),
			agentMode: false,
			showAgentWorkflow: false,
			pendingMessageAfterWorkflow: null,
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
			dangerouslyAllowBrowser: true,
		});
	},
	methods: {
		// ---------------------------- MAIN FUNCTIONS FOR HANDLING EVENTS --------------------------------
		handleUserSubmit({ message, file }) {
			if (file) {
				this.handleFileUpload(message, file);
			} else if (message) {
				const userMessageText = message.trim();
				this.messages.push({
					text: userMessageText,
					isUser: true,
					typing: false,
					timestamp: new Date().toLocaleTimeString(),
				});
				this.$nextTick(() => this.scrollChatFrameToBottom());

				console.log(
					"[ChatComponent] handleUserSubmit - Checking agentMode:",
					this.agentMode
				);
				if (this.agentMode) {
					console.log(
						"[ChatComponent] handleUserSubmit - Agent mode ON. Setting showAgentWorkflow=true and starting workflow..."
					);
					this.pendingMessageAfterWorkflow = userMessageText;
					this.showAgentWorkflow = true;
					this.$nextTick(() => {
						if (this.$refs.chatAgent) {
							this.$refs.chatAgent.startWorkflow();
						} else {
							console.error(
								"[ChatComponent] ChatAgent ref not found immediately after setting showAgentWorkflow! Retrying..."
							);
							setTimeout(() => this.$refs.chatAgent.startWorkflow(), 50);
						}
					});
				} else {
					console.log(
						"[ChatComponent] handleUserSubmit - Agent mode OFF. Sending message directly..."
					);
					this.sendMessage(userMessageText);
				}

				this.$refs.userInput && this.$refs.userInput.clearInput?.();
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
					Now detect this message: "${userMessage}"`,
				},
			]);

			//UPDATE THREAD NAME BASED ON FIRST MESSAGE
			if (this.messages.length === 1) {
				const response = await gptServices([
					{
						role: "system",
						content: `Bạn là một trợ lý đặt tên hội thoại bằng tiếng Việt ngắn gọn, mang tính mô tả chủ đề.
Đây là vài ví dụ:
- 'Kỳ nghỉ ở châu Âu' từ 'Các địa điểm du lịch châu Âu nên đi?'
- 'Gia hạn dự án' từ 'Chúng ta cần lùi deadline 2 tuần do có vấn đề.'

Hãy tóm tắt đoạn sau thành tên hội thoại bằng tiếng Việt, không quá 5 từ:`,
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
									content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
								},
							]);
							this.addTypingResponse(Responsegpt, false);
						}
					} else {
						const res = "Invalid stock symbol or quantity";
						const Responsegpt = await gptServices([
							{
								role: "user",
								content: `Translate the following text into ${language}. Respond only with the translated text: "${res}".`,
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
								const Responsegpt = await gptServices([
									{
										role: "user",
										content: `Translate the following text ${res} into ${language}. Respond only with the translated text.`,
									},
								]);
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
										content: `Translate "${res}" into the language detected from this message: "${newMessage}".`,
									},
								]);
								this.addTypingResponse(Responsegpt, false);
							}
						} else {
							const res = "Invalid sell command format";
							const Responsegpt = await gptServices([
								{
									role: "user",
									content: `Translate "${res}" into the language detected from this message: "${newMessage}".`,
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
							const type = "Income";
							const balance = await this.calculateNewBalance(amount);
							const category = await this.categorizeTransaction(description, type);
							await this.addTransaction(description, amount, type, category);
							const res = `Transaction added: "${description}" as a ${type} in category "${category}" with amount $${Math.abs(amount)}. Your new balance is $${balance}.`;
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
								const category = await this.categorizeTransaction(description, type);
								await this.addTransaction(description, amount, type, category);
								const res = `Transaction added: "${description}" as a ${type} in category "${category}" with amount $${Math.abs(amount)}. Your new balance is $${balance}.`;
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
				    <td><img style="width: 50px; aspect-ratio: 1;" src=${item.iconUrl} alt=${item.name
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

		handleAgentMode(agentModeValue) {
			console.log("[ChatComponent] handleAgentMode received:", agentModeValue);
			this.agentMode = agentModeValue;
			console.log("[ChatComponent] this.agentMode is now:", this.agentMode);
			if (!agentModeValue) {
				this.showAgentWorkflow = false;
			}
		},

		handleWorkflowComplete() {
			console.log("[ChatComponent] handleWorkflowComplete received.");
			this.showAgentWorkflow = false;
			if (this.pendingMessageAfterWorkflow) {
				this.sendMessage(this.pendingMessageAfterWorkflow);
				this.pendingMessageAfterWorkflow = null;
			} else {
				console.warn(
					"[ChatComponent] Workflow completed, but no pending message found"
				);
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
				if (file.type.startsWith("image/")) {
					const result = await this.analyzeImage(file, newMessage);
					this.messages.push({
						text: result,
						isUser: false,
						timestamp: new Date().toLocaleTimeString(),
					});
				} else if (file.type === "application/pdf") {
					const result = await this.analyzePDF(file, newMessage);
					this.messages.push({
						text: result,
						isUser: false,
						timestamp: new Date().toLocaleTimeString(),
					});
				}
			} catch (err) {
				console.error("Error processing file:", err);
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

		async analyzePDF(file, newMessage) {
			const uploadedFile = await this.openai.files.create({
				file,
				purpose: "user_data",
			});

			const response = await this.openai.responses.create({
				model: "gpt-4o",
				input: [
					{
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
					console.error('Invalid balance calculation:', {
						currentBalance,
						amount: newAmount,
						transactions: transactions[0]
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
				const response = await api.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
					userId,
					description,
					amount,
					balance: newBalance,
					date,
					type,
					category,
				});

				// Emit event to update other components

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
				const botInstruction = `Hế lô ${this.displayName} 👋\nBấm vào "Hướng dẫn" ở góc phải màn hình hoặc thử chat:
"Ghi lại thu nhập 12.500.000 VNĐ", 
"Phân tích ngân sách của tôi <3", 
"Chi 70.000 VNĐ mua sáchhhhhh", 
"Mua 5 cổ phiếu Apple cho tui nè", 
"Giá cổ phiếu Tesla là bao nhiêu á Bud ơii"`;
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
									relevantQuestions: chat.followUpQuestions,
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
		async categorizeTransaction(description, type) {
  const categories = type === "Income"
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
      "Lifestyle & Subscriptions"
    ];

  let category = "";
  let attempts = 0;
  const maxAttempts = 3;

  while (!categories.includes(category) && attempts < maxAttempts) {
    const prompt = `You are a smart finance assistant. Given the transaction description: ${description}, and the type: ${type}, select the most appropriate category from the following list:
${categories.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Respond ONLY with the category name, and nothing else.`;

    const response = await gptServices([
      { role: "user", content: prompt }
    ]);

    category = response.trim().replace(/^"(.*)"$/, '$1');

    if (!categories.includes(category)) {
      // Nếu chưa phân loại được --> Gọi API tạo câu trả lời tự động giải thích tại sao
      const explanationPrompt = `You are a smart finance assistant. The user described the transaction as: "${description}". 
You tried to categorize it into type "${type}" but none of the expected categories match correctly.
Please write a short, friendly explanation (in Vietnamese) telling the user why you cannot categorize this yet and politely ask them to clarify more.`;

      const explanation = await gptServices([
        { role: "user", content: explanationPrompt }
      ]);

      await this.addTypingResponse(explanation.trim(), false);
      return null; // Ngưng luôn, chờ user clarify
    }

    attempts++;
  }

  return category;
}
	},
	mounted() {
		const autoMessage = this.$route.query.autoMessage;
		if (autoMessage && !this.autoMessageSent) {
			this.autoMessageSent = true;
			this.handleUserSubmit({ message: autoMessage }); // gửi 1 lần
			this.$router.replace({ query: null }); // xoá query để reload ko gửi lại
		}

		if (!this.isAuthenticated) {
			const botInstruction = `Hello, Guest!\nPlease click \"Guidance\" for detailed instructions on how to use the chatbot.\nAlso, sign in to access the full functionality of Finbud!`;
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
</style>
