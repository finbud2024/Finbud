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
import authStore from "@/authStore";
import axios from "axios";
import { gptServices } from '@/services/gptServices';
import { getSources, getVideos, getRelevantQuestions } from '@/services/serperService.js';
import {getCurrentInstance, onBeforeUnmount } from 'vue';
export default {
	name: 'ChatComponent',
	props: {
		currentThreadID:String,
	},
	components: { ChatFrame, MessageComponent, UserInput },
	data() {
		return {
			messages: [],
			sources: [],
			videos: [],
			relevantQuestions: [],
			displayName: authStore.isAuthenticated ? JSON.parse(localStorage.getItem("user")).identityData.displayName : "User",
			userAvatar: authStore.isAuthenticated ? JSON.parse(localStorage.getItem("user")).identityData.profilePicture : require("@/assets/anonymous.png"),
			botAvatar: require("@/assets/botrmbg.png"),
		}
	},
	computed: {
		authStore() {
			return authStore;
		},
	},
	watch: {
		currentThreadID:{
			immediate: true,
			handler(newThreadID){
				if(newThreadID !== null && newThreadID !== undefined && newThreadID.length != 0){
					this.updateCurrentThread(newThreadID)
				}
			}
		}
	},
	methods: {
		// ---------------------------- MAIN FUNCTIONS FOR HANDLING EVENTS --------------------------------
		async sendMessage(newMessage) {
			const userMessage = newMessage.trim();
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
						const gptResponse = await gptServices(prompt);
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
							const url = this.$router.resolve({
								path: "/stock-simulator",
								query: { symbol: stockSymbol, quantity },
							}).href;
							// this.openNewWindow(url);
						} else {
							this.addTypingResponse("Invalid stock symbol or quantity", false);
						}
					} else {
						this.addTypingResponse("Invalid buy command format", false);
					}
				}
				// HANDLE SELL (8)
				else if (userMessage.toLowerCase().includes("sell")) {
					try {
						const sellRegex = /#sell\s+([A-Z]+)\s+(\d+)/i;
						const match = userMessage.match(sellRegex);
						if (match) {
							const stockSymbol = match[1].toUpperCase();
							const quantity = parseInt(match[2], 10);
							if (stockSymbol && !isNaN(quantity)) {
								const url = this.$router.resolve({
									path: "/stock-simulator",
									query: { symbol: stockSymbol, quantity: -quantity },
								}).href;
								// this.openNewWindow(url);
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
				// HANDLE ADD TRANSACTION (5)
				else if (userMessage.toLowerCase().includes("#add")) {
					try {
						const match = userMessage.match(/#add\s+([\w\s]+)\s+(\d+)/i);
						if (match) {
							const description = match[1].trim();
							const amount = parseInt(match[2], 10);
							const balance = await this.calculateNewBalance(amount);
							await this.addTransaction(description, amount, balance);
							answers.push(`Transaction added: ${description}, $${amount}. New balance: $${balance}.`);
							// this.openNewWindow("/goal");
						} else {
							answers.push("Please specify the description and amount you want to add.");
						}
					} catch (err) {
						console.error("Error in add transaction:", err.message);
					}
				}
				// HANDLE SPEND TRANSACTION (6)
				else if (userMessage.toLowerCase().includes("#spend")) {
					try {
						const match = userMessage.match(/#spend\s+([\w\s]+)\s+(\d+)/i);
						if (match) {
							const description = match[1].trim();
							const amount = -parseInt(match[2], 10);
							const balance = await this.calculateNewBalance(amount);
							await this.addTransaction(description, amount, balance);
							answers.push(`Transaction spent: ${description}, $${Math.abs(amount)}. New balance: $${balance}.`);
							// this.openNewWindow("/goal");
						} else {
							answers.push("Please specify the description and amount you want to spend.");
						}
					} catch (err) {
						console.error("Error in spend transaction:", err.message);
					}
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
						const gptResponse = await gptServices(prompt);
						answers.push(gptResponse);
					} catch (err) {
						console.error("Error in stock message:", err.message);
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
				<div style="font-weight: 900; font-size: 30px"> Top 5 Ranking Coins </div>
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
					coinData.slice(0, 5).map((item) => {
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
				else if (userMessage.toLowerCase().includes("#realestate")) {
					let userInputToken = userMessage.toLowerCase().split(/\s+/);
					let searchLocation;
					if (userInputToken.length > 1) {
						userInputToken = userInputToken.slice(1, userInputToken.length);
						searchLocation = userInputToken.join(" ");
					} else {
						searchLocation = "san jose";
					}
					let propertiesData = [];
					const API_KEY = process.env.VUE_APP_REAL_ESTATE_KEY;
					const BASE_URL = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch";
					try {
						const response = await axios.get(BASE_URL, {
							params: { location: searchLocation },
							headers: {
								"X-RapidAPI-Key": API_KEY,
								"X-RapidAPI-Host": "zillow-com1.p.rapidapi.com",
							},
						});
						propertiesData = response.data.props;
					} catch (err) {
						console.error("Error fetching property data:", err);
					}
					let tableTemplate = `
				<div style="font-weight: 900; font-size: 30px"> Listing of 5 Properties in ${searchLocation} </div>
				<table>
				<thead>
				    <tr>
				    <th>Image</th>
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
				    <td><img style="width: 50px; aspect-ratio: 1;" src=${item.imgSrc} alt="propertyImage"></td>
				    <td>${item.propertyType}</td>
				    <td>${item.address}</td>
				    <td>${item.price}$</td>
				    <td>${item.listingStatus}</td>
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
					const gptResponse = await gptServices(userMessage);
					answers.push(gptResponse);
				}
				// HANDLE GENERAL
				else {
					try {
						const prompt = userMessage;
						const gptResponse = await gptServices(prompt);
						answers.push(gptResponse);
					} catch (err) {
						console.error("Error in general message:", err.message);
					}
				}
				answers.forEach((answer) => { this.addTypingResponse(answer, false, newSources, newVideos, newRelevantQuestions) });
				//save chat to backend
				if (authStore.isAuthenticated) {
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
		// TO BE USED IN SPEND + ADD
		async addTransaction(description, amount, balance) {
			try {
				await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
					description,
					amount,
					balance,
					date: new Date().toISOString(),
					userId: localStorage.getItem('token')
				});
			} catch (err) {
				console.error('Error adding transaction:', err);
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
							typing: true,
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
									typing: true,
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
				await this.scrollChatFrameToBottom();
			} catch (err) {
				console.error("Error on updating to current thread:", err.message);
			}
		},
	},
	mounted(){
		if(!authStore.isAuthenticated){
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