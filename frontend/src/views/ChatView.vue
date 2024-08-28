<template>
  <div class="home-container">
    <div v-if="overlayEnabled" class="overlay"/>
    <div v-if="authStore.isAuthenticated" class="sidebar-container">
      <font-awesome-icon class="toggle-sidebar-btn" @click="toggleSidebar" icon="fa-solid fa-bars"/>
      <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"/>
      <SideBar
        :class="{ 'is-visible': isSidebarVisible }"
        :threads="threads"
        @add-thread="addThread"
        @edit-thread="editThread"
        @save-thread-name="saveThreadName"
        @cancel-edit="cancelEdit"
        @select-thread="selectThread"
      />
    </div>
    <ChatComponent :currentThreadID="threadID"/>
    <div  class="guidance-btn"  :class="{ 'is-guidance-visible': showGuidance }" @click="showGuidance = true">
      <div class="guidance-image-container">
        <img class="guidance-image" src="../assets/botrmbg.png" alt="Finbud" />
      </div>
      <span class="guidance-text">Guidance</span>
    </div>
    <GuidanceModal  
      v-if="showGuidance" 
      @close="showGuidance = false" 
      :showModal="showGuidance" 
    />
  </div>
</template>

<script>
//COMPONENT IMPORT
import ChatComponent from "@/components/ChatComponent.vue";
import SideBar from "../components/SideBar.vue";
import GuidanceModal from "../components/GuidanceModal.vue";
//UTILITIES + LIB IMPORT
import {getCurrentInstance, reactive, onBeforeUnmount, watchEffect } from 'vue';
import authStore from "@/authStore";
import axios from "axios";

export default {
  name: "ChatView",
  props:{
    chatBubbleThreadID: String
  },
  components: {
    ChatComponent,
    SideBar,
    GuidanceModal
  },
  data() {
    return {
      threadID:"",
      newMessage: "",
      messages: [],
      sources: [],
      followUpQuestions: [],
      botAvatar: require("@/assets/botrmbg.png"),
      currentThread: {},
      threads: [],
      isSidebarVisible: false,
      showGuidance: false,
      overlayEnabled: false, //overlay to darken the chat screen when new window popsup
      newWindow: null, //new window to referrence to other
      windowCheckInterval: null,
    };
  },
  computed: {
    authStore() {
      return authStore;
    },
    displayName() {
      return this.authStore.isAuthenticated
        ? JSON.parse(localStorage.getItem("user")).identityData.displayName
        : "User";
    },
    userAvatar() {
      //Check data in localstorage (user is authenticated)
      if(!JSON.parse(localStorage.getItem("user"))){
        return require("@/assets/anonymous.png");
      }
      //Check if user has a profile picture
      if(!JSON.parse(localStorage.getItem("user")).identityData.profilePicture){
        return require("@/assets/anonymous.png");
      }
      return JSON.parse(localStorage.getItem("user")).identityData.profilePicture;
    }
  },
  setup(props,{emit}){
   const instance = getCurrentInstance()
		onBeforeUnmount(()=>{
			emit('chatviewSelectingThread', instance.data.threadID);
		})
	},
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    closeSidebar() {
      this.isSidebarVisible = false;
    },
    async addThread(newThread) {
      try {
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const userId = localStorage.getItem("token");
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        newThread.id = thread.data._id;
        this.threads.push(newThread);
      } catch (err) {
        console.error("Error on adding new thread:", err);
      }
    },
    editThread(index) {
      this.threads[index].editing = true;
    },
    async saveThreadName({ newName, index }) {
      this.threads[index].name = newName;
      this.threads[index].editing = false;
      try {
        console.log("save edit");
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads/${this.threads[index].id}`;
        const reqBody = { title: newName };
        const updatedThread = await axios.put(api, reqBody);
      } catch (err) {
        console.error("Error on saving thread name:", err);
      }
    },
    cancelEdit(index) {
      this.threads[index].editing = false;
      console.log("cancel edit");
    },
    selectThread(index) {
      this.threadID = this.threads[index].id;
      this.threads.forEach((thread, i) => {
        thread.clicked = i === index;
      });
    },
    async deleteThread(index) {
      const threadId = this.threads[index].id;
      try {
        // Step 1: delete all chats associated with this threadId
        const deleteChatsApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${threadId}`;
        await axios.delete(deleteChatsApi);

        // Step 2: delete the thread itself
        const deleteThreadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/${threadId}`;
        await axios.delete(deleteThreadApi);

        // Remove the thread from the list in the UI
        this.threads.splice(index, 1);
        
        // If there are still threads left, select the first one; otherwise, clear the chat and thread state
        if (this.threads.length > 0) {
          this.selectThread(0);
        } else {
          this.currentThread = {};
          this.messages = [];
        }
      } catch (err) {
        console.error('Error on deleting thread or its associated chats:', err);
      }
    },
    async scrollChatFrameToBottom() {
      await new Promise(r => setTimeout(r, 200));
      const chatFrame = document.querySelector(".chat-frame");
      chatFrame.scrollTo({
        top: chatFrame.scrollHeight,
        behavior: 'smooth'
      });
    },
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

        // Define additional parameters
        const returnSources = true;
        const textChunkSize = 800;
        const textChunkOverlap = 200;
        const numberOfSimilarityResults = 2;
        const numberOfPagesToScan = 4;


        // HANDLE DEFINE
        if (userMessage.toLowerCase().includes("define")) {
          try {
            const term = userMessage
              .substring(
                userMessage.toLowerCase().indexOf("define") + "define".length
              )
              .trim();
            const prompt = `Explain ${term} to me as if I'm 15.`;
            const gptResponse = await gptServices(prompt);
            answers.push(gptResponse);
          } catch (err) {
            console.error("Error in define message:", err);
          }
        }
        // HANDLE BUY (7)
        if (userMessage.toLowerCase().includes("buy")) {
          try {
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
                answers.push(`Buying ${quantity} shares of ${stockSymbol} stock, please redirecting to the stock simulator...`);
                this.openNewWindow(url);
              } else {
                this.addTypingResponse(
                  "Invalid stock symbol or quantity",
                  false
                );
              }
            } else {
              this.addTypingResponse("Invalid buy command format", false);
            }
          } catch (err) {
            console.error("Error in buy message:", err);
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
                answers.push(`Selling ${quantity} shares of ${stockSymbol} stock, redirecting to the stock simulator...`);
                this.openNewWindow(url);
              } else {
                this.addTypingResponse(
                  "Invalid stock symbol or quantity",
                  false
                );
              }
            } else {
              this.addTypingResponse("Invalid sell command format", false);
            }
          } catch (err) {
            console.error("Error in sell message:", err);
          }
        }
        // HANDLE ADD TRANSACTION (5)
        else if (userMessage.toLowerCase().includes("#add")) {
          try {
            const match = userMessage.match(/#add\s+([\w\s]+)\s+(\d+)/i);
            if (match) {
              const accountCheck = await this.checkAccountBalance();
              if (!accountCheck){
                answers.push(`Account balance is not set yet, please set your account balance first`);
                this.openNewWindow("/goal");
              }
              else {
                const description = match[1].trim();
                const amount = parseInt(match[2], 10);
                const balance = await this.calculateNewBalance(amount);
                await this.addTransaction(description, amount, balance);
                // answers.push( `Transaction added: ${description}, $${amount}. New balance: $${balance}.`);
                answers.push(`Adding transaction for ${description}, $${amount}. Redirecting to the goal page...`);
                this.openNewWindow("/goal");
              }
            } else {
              answers.push(
                "Please specify the description and amount you want to add."
              );
            }
          } catch (err) {
            console.error("Error in add transaction:", err);
          }
        }
        // HANDLE SPEND TRANSACTION (6)
        else if (userMessage.toLowerCase().includes("#spend")) {
          try {
            const match = userMessage.match(/#spend\s+([\w\s]+)\s+(\d+)/i);
            if (match) {
              const accountCheck = await this.checkAccountBalance();
              if (!accountCheck){
                answers.push(`Account balance is not set yet, please set your account balance first`);
                this.openNewWindow("/goal");
              }
              else {
                const description = match[1].trim();
                const amount = -parseInt(match[2], 10);
                const balance = await this.calculateNewBalance(amount);
                await this.addTransaction(description, amount, balance);
                // answers.push( `Transaction spent: ${description}, $${Math.abs(amount)}. New balance: $${balance}.`);
                answers.push(`Adding transaction for ${description}, $${amount}. Please redirect to the goal page...`);
                this.openNewWindow("/goal");
              }
            } else {
              answers.push(
                "Please specify the description and amount you want to spend."
              );
            }
          } catch (err) {
            console.error("Error in spend transaction:", err);
          }
        }
        // HANDLE STOCK
        else if (this.extractStockCode(userMessage)) {
          try {
            const stockCode = this.extractStockCode(userMessage)[0];
            const stockResponse = await axios.get(
              `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${process.env.VUE_APP_ALPHA_VANTAGE_API_KEY}`
            );
            const stockData = stockResponse.data;
            const price = stockData["Global Quote"]["05. price"];
            const timeStamp = new Date().toLocaleTimeString();
            let alphavantageResponse = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;
            answers.push(alphavantageResponse);
            //chatgpt api
            const prompt = `Generate a detailed analysis of ${stockCode} which currently trades at $${price}.`;
            const gptResponse = await gptServices(prompt);
            answers.push(gptResponse);
          } catch (err) {
            console.error("Error in stock message:", err);
          }
        }
        // RETURNS CRYPTO TABLE (3)
        else if (userMessage.toLowerCase().includes("#crypto")) {
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
              <td><img style="width: 50px; aspect-ratio: 1;" src=${
                item.iconUrl
              } alt=${item.name}>${item.name}</td>
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
        // RETURNS REALESTATE TABLE
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
          const BASE_URL =
            "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch";
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
        else if (userMessage.toLowerCase().includes("#search")){
          //Search for sources, videos, and relevant questions
          const searchResults = await getSources(userMessage);
          newSources = searchResults;
          newVideos = await getVideos(userMessage);
          newRelevantQuestions = await getRelevantQuestions(searchResults);
          //Normal GTP response
          const gptResponse = await gptServices(userMessage);
          answers.push(gptResponse);
          // this.showSearchVideosButton = true; ??????
        }
        // HANDLE GENERAL
        else {
          try {
            const prompt = userMessage;
            // const gptResponse = await axios.post(
            //   `${process.env.VUE_APP_DEPLOY_URL}/query`,
            //   {
            //     prompt,
            //     returnSources,
            //     textChunkSize,
            //     textChunkOverlap,
            //     numberOfSimilarityResults,
            //     numberOfPagesToScan,
            //   }
            // );
            const gptResponse =  await gptServices(prompt);
            answers.push(gptResponse);
            // answers.push(gptResponse.data.answer);
            // this.sources = gptResponse.data.sources || [];
            // this.followUpQuestions = gptResponse.data.followUpQuestions || [];
          } catch (err) {
            console.error("Error in general message:", err);
          }
        }
        answers.forEach((answer) => {
          this.addTypingResponse(answer, false, newSources, newVideos, newRelevantQuestions);
        });
        //save chat to backend
        if (authStore.isAuthenticated) {
          try {
            const chatApi = `${process.env.VUE_APP_DEPLOY_URL}/chats`;
            const reqBody = {
            prompt: userMessage,
            response: answers,
            sources: newSources,
            videos: newVideos,
            followUpQuestions: newRelevantQuestions,
            threadId: this.currentThread.id,
          };
            const chat = await axios.post(chatApi, reqBody);
          } catch (err) {
            console.error("Error on saving chat:", err.message);
          }
        }
        this.scrollChatFrameToBottom();
      }
    },
    async handleAddTransaction(userMessage) {
      const match = userMessage.match(/#add\s+([\w\s]+)\s+(\d+)/i);
      if (match) {
        const description = match[1].trim();
        const amount = parseInt(match[2], 10);
        const balance = await this.calculateNewBalance(amount);
        await this.addTransaction(description, amount, balance);
        return [
          `Transaction added: ${description}, $${amount}. New balance: $${balance}.`,
        ];
      } else {
        return ["Please specify the description and amount you want to add."];
      }
    },
    async handleSpendTransaction(userMessage) {
      const match = userMessage.match(/#spend\s+([\w\s]+)\s+(\d+)/i);
      if (match) {
        const description = match[1].trim();
        const amount = -parseInt(match[2], 10);
        const balance = await this.calculateNewBalance(amount);
        await this.addTransaction(description, amount, balance);
        return [
          `Transaction spent: ${description}, $${Math.abs(
            amount
          )}. New balance: $${balance}.`,
        ];
      } else {
        return ["Please specify the description and amount you want to spend."];
      }
    },
    async addTransaction(description, amount, balance) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_DEPLOY_URL}/transactions`, {
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
    async calculateNewBalance(amount) {
      try {
        const userId = localStorage.getItem("token");
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${userId}`
        );
        const transactions = response.data;
        const currentBalance = transactions.reduce(
          (acc, transaction) => acc + transaction.amount,
          0
        );
        return currentBalance + amount;
      } catch (err) {
        console.error('Error calculating new balance:', err);
        throw error;
      }
    },
    async checkAccountBalance() {
      try {
        const userId = localStorage.getItem("token");
        const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/transactions/u/${userId}`);
        const transactions = response.data;
        return transactions.length > 0 && this.accountBalance !== 0;
      } catch (error) {
        console.error('Error checking account balance:', error);
        return false;
      }
    },
    extractStockCode(message) {
      const pattern = /\b[A-Z]{3,5}\b/g;
      const matches = message.match(pattern);
      return matches;
    },
    handleQuestionClick(question) {
      const searchQuery = `#search ${question}`;
      this.sendMessage(searchQuery);
    },
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
    //USED IN BUY/SELL/ADD/SPEND/(QUIZ?)
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
    //HANDLE THE ABILITY TO CHECK IF USER CLICKS OUTSIDE OF THE REFERENCED WINDOW
    closeOnClickOutside(event) {
      if (this.newWindow && !this.newWindow.closed) {
        this.newWindow.close();
        this.handleWindowClose();
      }
    },
    //HANDLE CLOSE WINDOW
    handleWindowClose() {
      if (this.windowCheckInterval) {
        clearInterval(this.windowCheckInterval);
      }
      window.removeEventListener("click", this.closeOnClickOutside);
      this.overlayEnabled = false;
      this.newWindow = null;
    },
  },
  async mounted() {
    setInterval(() => {this.currentTime = new Date().toLocaleTimeString();}, 500);
    const navbarHeight = document.querySelector(".nav-actions").offsetHeight;
    document.querySelector(".home-container").style.height = `calc(100vh - ${navbarHeight}px)`;

    if (authStore.isAuthenticated) {
      const userId = localStorage.getItem("token");
      console.log("current UserID:",userId);
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (historyThreadsData.length === 0) {
        const newThread = {
          name: "New Thread",
          editing: false,
          editedName: "New Chat",
          messages: [],
        };
        await this.addThread(newThread);
      } else {
        historyThreadsData.forEach((threadData) => {
          const thread = {
            id: threadData._id,
            name: threadData.title,
            editing: false,
            editedName: threadData.title,
            messages: [],
          };
          this.threads.push(thread);
        });
      }
      for(let i= 0; i< historyThreadsData.length; i++){
        if(historyThreadsData[i]._id === this.chatBubbleThreadID){
          this.selectThread(i)
          break;
        }
      }
    }
  },
};
</script>
<style scoped>
.home-container {
  display: flex;
  width: 100%;
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.toggle-sidebar-btn {
  display: none;
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 1000;
  color: black;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-sidebar-btn:hover {
  background-color: #2980b9;
}

.chat-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  position: relative;
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
  background-color: rgb(248, 249, 254);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
}

.side-bar.is-visible {
  transform: translateX(0);
}
/*______________________*/
/* Guidance CSS class*/

.guidance-btn {
  height: 50px;
  width: 130px;
  position: fixed;
  bottom: calc(15%);
  right: -105px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: flex;
}

.guidance-btn:hover {
  transform: translateX(-90px);
}

.guidance-image-container {
  margin-left: -25px;
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.guidance-image {
  width: 35px;
  aspect-ratio: 1;
  border-radius: 50%;
}

.guidance-text {
  font-size: 1.25rem;
  padding-top: 15px;
}

.is-guidance-visible {
  right: calc(25% + 19px - 80px);
}

.source-component-card,
.followup-component-card {
  width: 70%;
  margin: 0 auto;
  background-color: #f8f9fa; /* Light grey background */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow */
  margin-top: 20px;
}

/* Animation for follow up and source components */
@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes highlight {
  0% {
    background-color: #f0f0f0;
  }
  100% {
    background-color: transparent;
  }
}

.followup-component-card,
.source-component-card {
  animation: fadeInSlide 0.5s ease-out, highlight 1s ease-in-out;
}
</style>
