<template>
  <div class="home-container">
    <div v-if="overlayEnabled" class="overlay"/>
    <div v-if="this.isAuthenticated" class="sidebar-container">
      <font-awesome-icon class="toggle-sidebar-btn" @click="toggleSidebar" icon="fa-solid fa-bars"/>
      <div v-if="isSidebarVisible" class="overlay" @click="closeSidebar"/>
      <SideBar :class="{ 'is-visible': isSidebarVisible }" :initialThreadName="newThreadName"/>
    </div>
    <ChatComponent @initialThreadName="initialThreadName"/>
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
      newMessage: "",
      messages: [],
      sources: [],
      followUpQuestions: [],
      botAvatar: require("@/assets/botrmbg.png"),
      isSidebarVisible: false,
      showGuidance: false,
      overlayEnabled: false, //overlay to darken the chat screen when new window popsup
      newWindow: null, //new window to referrence to other
      windowCheckInterval: null,
      newThreadName: "",
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
    displayName() {
      return this.isAuthenticated
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
    },
    threadID() {
      return this.$store.getters['threads/getThreadID'];
    },
  },
  methods: {
    toggleSidebar() {
      this.isSidebarVisible = !this.isSidebarVisible;
    },
    closeSidebar() {
      this.isSidebarVisible = false;
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
    initialThreadName(newThreadName){
      this.newThreadName = newThreadName;
    }
  },
  async mounted() {
    setInterval(() => {this.currentTime = new Date().toLocaleTimeString();}, 500);
    const navbarHeight = document.querySelector(".nav-actions").offsetHeight;
    document.querySelector(".home-container").style.height = `calc(100vh - ${navbarHeight}px)`;
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
  margin: auto 0;
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