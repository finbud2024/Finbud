<template>
	<div class="chat-container">
		<ChatFrame>
			<div v-for="(message, index) in messages" :key="index">
				<MessageComponent :is-user="message.isUser" :text="message.text" :typing="message.typing"
					:htmlContent="message.htmlContent" :username="message.isUser ? displayName : 'FinBud Bot'"
					:avatar-src="message.isUser ? userAvatar : botAvatar"
					:sources="message.isUser ? [] : message.sources" :videos="message.isUser ? [] : message.videos"
					:relevantQuestions="message.isUser ? [] : message.relevantQuestions"
					@question-click="handleQuestionClick" />
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
// SERVICES + LIBRARY IMPORT
import axios from "axios";
import { gptServices } from '@/services/gptServices';
import { getSources, getVideos, getRelevantQuestions } from '@/services/serperService.js';
export default {
	name: 'ChatComponent',
	props: {},
	components: { ChatFrame, MessageComponent, UserInput },
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
			if (this.isAuthenticated) {
				return JSON.parse(localStorage.getItem("user")).identityData.displayName;
			} else {
				return "User";
			}
		},
		userAvatar() {
			if (this.isAuthenticated) {
				return JSON.parse(localStorage.getItem("user")).identityData.profilePicture;
			} else {
				return require("@/assets/anonymous.png");
			}
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

				// HANDLE DEFINE(2)
				if (userMessage.toLowerCase().includes("#define")) {
					try {
						const term = userMessage.substring(userMessage.toLowerCase().indexOf("define") + "define".length).trim();
						const prompt = `Explain ${term} to me as if I'm 15.`;
						const gptResponse = await gptServices([{ role: "user", content: prompt }]);
						answers.push(gptResponse);
					} catch (err) {
						console.error("Error in define message:", err);
					}
				}
				// HANDLE BUY (7)
				else if (userMessage.toLowerCase().includes("#buy")) {
    				const buyRegex = /#buy\s+([A-Z]+)\s+(\d+)/i;
    				const match = userMessage.match(buyRegex);
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
				else if (userMessage.toLowerCase().includes("#sell")) {
    				try {
        				const sellRegex = /#sell\s+([A-Z]+)\s+(\d+)/i;
        				const match = userMessage.match(sellRegex);
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
<<<<<<< HEAD
				// HANDLE ADD TRANSACTION (5)
=======
				// HANDLE ADD TRANSACTION (6)
>>>>>>> origin/main
				else if (userMessage.toLowerCase().includes("#add")) {
					try {
						const match = userMessage.match(/#add\s+([\w\s]+)\s+(\d+)/i);
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
				else if (userMessage.toLowerCase().includes("#spend")) {
					try {
						const match = userMessage.match(/#spend\s+([\w\s]+)\s+(\d+)/i);
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
				else if (userMessage.toLowerCase().includes("#crypto")) {
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
				else if (userMessage.includes("#realestate")) {
					let userInputToken = userMessage.split(/\s+/);
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
					let propertiesData = [];
					const API_KEY = process.env.VUE_APP_REAL_ESTATE_KEY;
					const BASE_URL = "https://api.rentcast.io/v1/listings/sale";
					try {
						const response = await axios.get(BASE_URL, {
							params: { city: searchLocation },
							headers: {
								accept: 'application/json',
								"X-Api-Key": API_KEY
							},
						});
						// console.log(response.data)
						propertiesData = response.data;
					} catch (err) {
						console.error("Error fetching property data:", err);
					}
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
				else if (userMessage.toLowerCase().includes("#search")) {
					//Search for sources, videos, and relevant questions
					const searchResults = await getSources(userMessage);
					newSources = searchResults;
					newVideos = await getVideos(userMessage);
					newRelevantQuestions = await getRelevantQuestions(searchResults);
					//Normal GTP response
					const gptResponse = await gptServices([{ role: "user", content: userMessage }]);
					answers.push(gptResponse);
				}
				// HANDLE STOCK
				else if (this.extractStockCode(userMessage)) {
					try {
						const stockCode = this.extractStockCode(userMessage)[0];
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
					} catch (err) {
						console.error("Error in stock message:", err.message);
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
		addTypingResponse(text, isUser, sources = [], videos = [], relevantQuestions = []) {
			const typingMessage = {
				text: text,
				isUser: isUser,
				typing: true,
				timestamp: new Date().toLocaleTimeString(),
				username: isUser ? "You" : "FinBud Bot",
				sources: sources,
				videos: videos,
				relevantQuestions: relevantQuestions
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
				const userId = localStorage.getItem("token");
				const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${userId}`);
				const transactions = response.data;
				const currentBalance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);
				return currentBalance + amount;
			} catch (err) {
				console.error('Error calculating new balance:', err.message);
			}
		},
		async checkAccountBalance() {
			try {
				const userId = localStorage.getItem("token");
				const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${userId}`);
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

			const userId = localStorage.getItem('token'); // Ensure userId is defined
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
				await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
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