<template>
	<div class="chat-container">
	  <ChatFrame>
		<div v-for="(message, index) in messages" :key="index">
		  <MessageComponent :is-user="message.isUser" :text="message.text" :typing="message.typing"
			:is-thinking="message.isThinking"
			:htmlContent="message.htmlContent" :username="message.isUser ? displayName : 'FinBud Bot'"
			:avatar-src="message.isUser ? userAvatar : botAvatar"
			:sources="message.isUser ? [] : message.sources" :videos="message.isUser ? [] : message.videos"
			:relevantQuestions="message.isUser ? [] : message.relevantQuestions"
			@question-click="handleQuestionClick" />
		  <!-- Add TradingView widget after stock messages -->
		  <TradingViewWidget v-if="message.showChart" :symbol="message.stockSymbol" />
		</div>
	  </ChatFrame>
	  <UserInput @send-message="sendMessage" />
	</div>
  </template>

<script>
// COMPONENT IMPORT
import ChatFrame from './ChatFrame.vue';
import MessageComponent from './MessageComponent.vue';
import UserInput from './UserInput.vue';
import TradingViewWidget from './TradingViewWidget.vue';
// SERVICES + LIBRARY IMPORT
import axios from "axios";
import { gptServices } from '@/services/gptServices';
import { getSources, getVideos, getRelevantQuestions } from '@/services/serperService.js';
import api from '@/utils/api';
export default {
	name: 'ChatComponent',
	props: {},
	components: { ChatFrame, MessageComponent, UserInput, TradingViewWidget },
	data() {
		return {
			messages: [],
			sources: [],
			videos: [],
			relevantQuestions: [],
			botAvatar: require("@/assets/botrmbg.png"),
		}
	},
	computed: {
		isAuthenticated() {
			return this.$store.getters['users/isAuthenticated'];
		},
		currentThreadID() {
			return this.$store.getters['threads/getThreadID'];
		},
		displayName() {
			return this.$store.getters['users/userDisplayName'];
		},
		userAvatar() {
			return this.$store.getters['users/userProfileImage'] || require("@/assets/anonymous.png");
		},
	},
	watch: {
		currentThreadID: {
			immediate: true,
			handler(newThreadID) {
				if (newThreadID !== null && newThreadID !== undefined && newThreadID.length != 0) {
					this.updateCurrentThread(newThreadID)
				} else {
					this.messages = [];
				}
			}
		}
	},
	methods: {
		// ---------------------------- MAIN FUNCTIONS FOR HANDLING EVENTS --------------------------------
		async sendMessage(newMessage) {
			const userMessage = newMessage.trim();
			//UPDATE THREAD NAME BASED ON FIRST MESSAGE
			if (this.messages.length === 1) {
				const response = await gptServices([
					{ role: "system", content: `I am a highly efficient summarizer. 
												Here are examples: 'Best vacation in Europe' from 
												'What are the best vacation spots in Europe?'; 
												'Discussing project deadline' from 
												'We need to extend the project deadline by two weeks due to unforeseen issues.' 
												Now, summarize the following user message within 3 to 4 words into a title:`
					},
					{
						role: "user",
						content: userMessage,
					},
				]);
				if(this.$route.path === "/chat-view"){
					this.$emit("initialThreadName", response);
				}else{
					try{
						const currentThreadID = this.$store.getters['threads/getThreadID'];
						const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/${currentThreadID}`;
						axios.put(threadApi, { title: response });
					}catch(err){
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

					1. **Search**  
					- User intent: General question or request for info  
					- Format: **#search [term]**  
					- Example: "What's happening with the stock market?" → "#search stock market"

					2. **Stock Price Inquiry**  
					- User intent: Ask for a stock price  
					- Format: **[STOCK_CODE_IN_UPPERCASE]**  
					- Example: "What's the price of tsla?" → "TSLA"

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

					6. **Add a Transaction**  
					- User intent: Record a spending transaction  
					- Format: **#add [description] [amount]**  
					- Example: "I spent 125 on shopping" → "#add shopping 125"

					7. **Track Spending**  
					- User intent: Log or monitor an expense  
					- Format: **#spend [description] [amount]**  
					- Example: "Track 80 for groceries" → "#spend groceries 80"

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

					### Instruction:
					Given the user message: "${newMessage}", respond with the correct formatted command according to the rules above.  
					If no suitable category is found, return the original message unchanged: "${newMessage}".
					`
					}
				]);

				// HANDLE DEFINE(2)
				if (gptDefine.toLowerCase().includes("#define")) {
					try {
						const term = gptDefine.substring(gptDefine.toLowerCase().indexOf("define") + "define".length).trim();
						const prompt = `Explain ${term} to me as if I'm 15.`;
						const gptResponse = await gptServices([{ role: "user", content: prompt }]);
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
            				this.addTypingResponse("Invalid stock symbol or quantity", false);
        				}
    				} else {
        				this.addTypingResponse("Invalid buy command format", false);
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
								// Wait for the page to load and auto-click the Preview Order button
								setTimeout(() => {
                					window.addEventListener("load", () => {
                    					const previewButton = document.querySelector(".preview-btn");
                    					if (previewButton) previewButton.click();
                					});
            					}, 2000);
            				} else {
                				this.addTypingResponse("Invalid stock symbol or quantity", false);
            				}
        				} else {
            				this.addTypingResponse("Invalid sell command format", false);
        				}
    				} catch (err) {
        				console.error("Error in sell message:", err.message);
   					}
			}
				// HANDLE ADD TRANSACTION (6)
				else if (gptDefine.toLowerCase().includes("#add")) {
					try {
						const match = gptDefine.match(/#add\s+([\w\s]+)\s+(\d+)/i);
						if (match) {
							const description = match[1].trim();
							const amount = parseInt(match[2], 10);
							const balance = await this.calculateNewBalance(amount);
							await this.addTransaction(description, amount, balance);
							answers.push(`Transaction added: ${description}, $${amount}. New balance: $${balance}.`);
						} else {
							answers.push("Please specify the description and amount you want to add.");
						}
					} catch (err) {
						console.error("Error in add transaction:", err.message);
					}
				}
				// HANDLE SPEND TRANSACTION (7)
				else if (gptDefine.toLowerCase().includes("#spend")) {
					try {
						const match = gptDefine.match(/#spend\s+([\w\s]+)\s+(\d+)/i);
						if (match) {
							const accountCheck = await this.checkAccountBalance();
							if (!accountCheck) {
								answers.push(`Account balance is not set yet, please set your account balance first`);
								// this.openNewWindow("/goal");
							} else {
								const description = match[1].trim();
								const amount = -parseInt(match[2], 10);
								const balance = await this.calculateNewBalance(amount);
								await this.addTransaction(description, amount, balance);
								answers.push(`Transaction spent: ${description}, $${Math.abs(amount)}. New balance: $${balance}.`);
							}
							// this.openNewWindow("/goal");
						} else {
							answers.push("Please specify the description and amount you want to spend.");
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
						const res = await axios.get("https://api.coinranking.com/v2/coins?timePeriod=7d", {
							headers: { "x-access-token": process.env.VUE_APP_COINRANKING_KEY },
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
				    <td><img style="width: 50px; aspect-ratio: 1;" src=${item.iconUrl} alt=${item.name}>${item.name}</td>
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
				}
				// // RETURNS REALESTATE TABLE
				else if (gptDefine.includes("#realestate")) {
					let userInputToken = gptDefine.split(/\s+/);
					let searchLocation;

					const capitalizeLocation = (word) => {
						return word.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
					}

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
						status: "For Sale"
					},
					{
						propertyType: "Condo",
						formattedAddress: "456 Elm St, San Jose, CA 95126",
						price: "$850,000",
						status: "Pending"
					},
					{
						propertyType: "Townhouse",
						formattedAddress: "789 Oak Ave, San Jose, CA 95128",
						price: "$975,000",
						status: "Sold"
					},
					{
						propertyType: "Apartment",
						formattedAddress: "101 Pine St, San Jose, CA 95110",
						price: "$3,200/mo",
						status: "For Rent"
					},
					{
						propertyType: "Duplex",
						formattedAddress: "202 Maple Dr, San Jose, CA 95125",
						price: "$1,050,000",
						status: "For Sale"
					}
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
					this.messages.push({
						text: ``,
						htmlContent: tableTemplate,
						isUser: false,
						typing: true,
						timestamp: new Date().toLocaleTimeString(),
					});
				}
				// HANDLE SEARCH
				else if (gptDefine.toLowerCase().includes("#search")) {
					//Search for sources, videos, and relevant questions
					const searchResults = await getSources(gptDefine);
					newSources = searchResults;
					newVideos = await getVideos(gptDefine);
					newRelevantQuestions = await getRelevantQuestions(searchResults);
					//Normal GTP response
					const gptResponse = await gptServices([{ role: "user", content: gptDefine }]);
					answers.push(gptResponse);
				}
				// HANDLE STOCK
				else if (this.extractStockCode(gptDefine)) {
					try {
						const stockCode = this.extractStockCode(gptDefine)[0];
						const stockResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${process.env.VUE_APP_ALPHA_VANTAGE_API_KEY}`);
						const price = stockResponse.data["Global Quote"]["05. price"];
						const timeStamp = new Date().toLocaleTimeString();
						console.log(price, timeStamp, stockCode)
						let alphavantageResponse = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;
						answers.push(alphavantageResponse);
						//chatgpt api
						const prompt = `Generate a detailed analysis of ${stockCode} which currently trades at $${price}.`;
						const gptResponse = await gptServices([{ role: "user", content: prompt }]);
						answers.push(gptResponse);
						
						// Add a message that will trigger the chart display
						this.messages.push({
						text: '',
						isUser: false,
						typing: false,
						showChart: true,
						stockSymbol: stockCode,
						timestamp: new Date().toLocaleTimeString()
						});
					} catch (err) {
						console.error("Error in stock message:", err.message);
					}
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

							// Wait for the page to load and auto-click the Add Goal button
							setTimeout(() => {
								window.addEventListener("load", () => {
									const addGoalButton = document.querySelector(".add-goal-button");
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
				// HANDLE GENERAL
				else {
					try {
						const prompt = userMessage;
						const gptResponse = await gptServices([{ role: "user", content: prompt }]);
						answers.push(gptResponse);
					} catch (err) {
						console.error("Error in general message:", err.message);
					}
				}

				// Remove the thinking message
        this.messages = this.messages.filter(msg => !msg.isThinking);
				await this.$nextTick();

				answers.forEach((answer) => { this.addTypingResponse(answer, false, newSources, newVideos, newRelevantQuestions) });
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
		//------------------------- ULTILITIES FUNCTIONS ------------------------------------------------
		addTypingResponse(text, isUser, sources = [], videos = [], relevantQuestions = [], isThinking = false) {
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
			const pattern = /\b[A-Z]{3,5}\b/g;
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
			this.newWindow = window.open(url, "_blank", `resize=0,toolbar=0,location=0,menubar=0,width=${width},height=${height},left=${left},top=${top}`);
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
				const currentBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
				return currentBalance + amount;
			} catch (err) {
				console.error('Error calculating new balance:', err.message);
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
				console.error('Error checking account balance:', error);
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
			const type = 'revenue';

			/* logs for testing
			console.log("description:", description);
			console.log("amount:", amount);
			console.log("balance:", balance);
			console.log("userId:", userId);
			console.log("date:", date);
			console.log("type:", type);
			*/
			try {
				await api.post(`/transactions`, {
					description,
					amount,
					balance,
					date,
					userId,
					type
				});

			} catch (err) {
				console.error('Error adding transaction:', err.message);
				this.addTypingResponse('Error adding transaction.', false);
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
				this.messages = []
				const botInstruction = `Hello ${this.displayName}!\nPlease click "Guidance" for detailed instructions on how to use the chatbot.`;
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
							relevantQuestions: chat.followUpQuestions
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
									relevantQuestions: chat.followUpQuestions
								};
								this.messages.push(response);
							});
						}
					});
				} else {
					console.error('Error: chatsData is not an array');
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
	}
}
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
</style>