<template>
	<div class="home-container">
		<div v-if="overlayEnabled" class="overlay">
		</div>
		<div v-if="this.isAuthenticated" class="sidebar-container">
			<font-awesome-icon
				class="toggle-sidebar-btn"
				@click="toggleSidebar"
				icon="fa-solid fa-bars"
			/>
			<div v-if="isSidebarVisible" class="overlay" @click="closeSidebar" />
			<img
				class="toggle-sidebar toggle-sidebar-big"
				@click="toggleSidebarBigScreen"
				src="@/assets/sidebar-open-icon.png"
			/>
			<SideBar v-if="isSidebarVisibleBigScreen"
				:class="{ 'is-visible': isSidebarVisible }"
				:initialThreadName="newThreadName"
			/>
		</div>
		<ChatComponent @initialThreadName="initialThreadName" ref="chatComponent" />
		<div
			class="guidance-btn"
			id="tutorial-guidance-button"
			:class="{ 'is-guidance-visible': showGuidance }"
			@click="showGuidance = true"
		>
			<div class="guidance-image-container">
				<img class="guidance-image" src="@/assets/botrmbg.png" alt="Finbud" />
			</div>
			<span class="guidance-text">{{ $t("chatComponent.guildence") }}</span>
		</div>
		<GuidanceModal
			v-if="showGuidance"
			@close="showGuidance = false"
			@sendMessage="sendMessageToChat"
			:showModal="showGuidance"
		/>
		<TutorialOverlay
			:steps="tutorialSteps"
			storageKey="finbudChatViewTutorialShown"
			:autoStart="true"
			@tutorial-completed="onTutorialCompleted"
			ref="tutorialOverlay"
		/>
	</div>
</template>

<script>
//COMPONENT IMPORT
import ChatComponent from "@/components/ChatPage/ChatComponent.vue";
import SideBar from "@/components/Basic/SideBar.vue";
import GuidanceModal from "@/components/GuidanceModal.vue";
import TutorialOverlay from "@/components/TutorialPage/TutorialOverlay.vue";
//UTILITIES + LIB IMPORT

export default {
	name: "ChatView",
	props: {
		chatBubbleThreadID: String,
	},
	components: {
		ChatComponent,
		SideBar,
		GuidanceModal,
		TutorialOverlay,
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
			tutorialSteps: [
				{
					element: "#tutorial-guidance-button",
					message: "Click here for guidance on how to ask questions to FinBud!",
					title: "Need help with queries?",
				},
			],
			isSidebarVisibleBigScreen: true,
		};
	},
	computed: {
		isAuthenticated() {
			return this.$store.getters["users/isAuthenticated"];
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
		threadID() {
			return this.$store.getters["threads/getThreadID"];
		},
	},
	methods: {
		toggleSidebarBigScreen() {
			this.isSidebarVisibleBigScreen = !this.isSidebarVisibleBigScreen;
		},
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
		initialThreadName(newThreadName) {
			this.newThreadName = newThreadName;
		},
		sendMessageToChat(message) {
			if (this.$refs.chatComponent) {
				this.$refs.chatComponent.sendMessage(message);
			}
		},
		onTutorialCompleted() {
			console.log("ChatView Tutorial completed!");
		},
		restartTutorial() {
			if (this.$refs.tutorialOverlay) {
				this.$refs.tutorialOverlay.resetTutorial();
			}
		},
		checkNavbarState() {
			const navbar = document.querySelector('.navbar-container');
			const homeContainer = document.querySelector('.home-container');
			const sidebar = document.querySelector('.side-bar.big-screen');
			
			if (navbar && homeContainer) {
				const isExpanded = navbar.classList.contains('expanded');
				if (isExpanded) {
					homeContainer.classList.add('nav-expanded');
					if (sidebar) {
						sidebar.classList.add('nav-expanded');
					}
				} else {
					homeContainer.classList.remove('nav-expanded');
					if (sidebar) {
						sidebar.classList.remove('nav-expanded');
					}
				}
			}
		},
	},
	async mounted() {
		setInterval(() => {
			this.currentTime = new Date().toLocaleTimeString();
		}, 500);
		
		// Handle navbar expansion state
		this.checkNavbarState();
		window.addEventListener('resize', this.checkNavbarState);
		
		//HANDLE REDIRECT MESSAGE FROM HOMEPAGE
		const autoMessage = this.$route.query.autoMessage;
		const threadID = this.$route.query.threadID;

		if (threadID) {
			// Update the Vuex store with the new thread ID
			this.$store.dispatch("threads/updateThreadID", threadID);
		}

		// Check if we've been redirected from Home page and show tutorial
		if (this.$route.query.fromHome === 'true') {
			// Clear the query parameter first
			this.$router.replace({ query: {} });
		}
	},
	beforeUnmount() {
		window.removeEventListener('resize', this.checkNavbarState);
	},
};
</script>

<style scoped>
.home-container {
	display: flex;
	height: 100vh;
	overflow: hidden;
	padding-left: 70px; /* Default navbar width */
	transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Adjust for expanded navbar */
.home-container.nav-expanded {
	padding-left: 280px; /* Expanded navbar width */
}

.sidebar-container {
	position: relative;
	z-index: 100; /* Lower than navbar but higher than chat content */
}

.toggle-sidebar-btn {
	display: none;
	position: fixed;
	top: 20px;
	left: 20px;
	z-index: 1050;
	font-size: 24px;
	background: rgba(255, 255, 255, 0.9);
	color: #333;
	border: none;
	border-radius: 8px;
	padding: 12px;
	cursor: pointer;
	backdrop-filter: blur(10px);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.toggle-sidebar-btn:hover {
	background: rgba(255, 255, 255, 1);
	transform: scale(1.05);
}

.chat-container {
	display: flex;
	align-items: center;
	flex-direction: column;
	flex: 1;
	position: relative;
	z-index: 1;
}

@media (max-width: 768px) {
	.home-container {
		padding-left: 0; /* No padding on mobile */
	}
	
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
	
	.toggle-sidebar-big {
		display: none;
	}
}

.overlay {
	display: block;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.7);
	z-index: 1049; /* Just below sidebar */
	pointer-events: auto;
}

.side-bar.is-visible {
	display: block;
	position: fixed;
	left: 0;
	top: 0;
	width: 60%;
	height: 100%;
	background-color: var(--card-bg);
	z-index: 1050; /* Higher than overlay, lower than navbar */
	transform: translateX(-100%);
	transition: transform 0.3s ease-in-out;
	backdrop-filter: blur(10px);
	box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
}

.side-bar.is-visible {
	transform: translateX(0);
}

/* Add this new style */
.chat-component-wrapper {
	position: relative;
	z-index: 1;
	height: 100%;
	width: 100%;
	pointer-events: auto;
}

.toggle-sidebar-big {
	position: fixed;
	top: 20px;
	left: 300px; /* Position outside expanded navbar */
	z-index: 100;
	cursor: pointer;
	color: var(--text-primary);
	width: 38px;   
 	height: 38px;
	padding: 10px;
	background: rgba(255, 255, 255, 0.9);
	border-radius: 8px;
	backdrop-filter: blur(10px);
	transition: all 0.3s ease;
}

.toggle-sidebar-big:hover {
	background: rgba(255, 255, 255, 1);
	transform: scale(1.05);
}

.side-bar.big-screen {
	position: fixed;
	top: 0;
	left: 70px; /* Start after navbar */
	width: 250px;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	z-index: 100; /* Lower than navbar */
	transition: all 0.3s ease;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
	box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
}

/* When navbar is expanded, adjust sidebar position */
.side-bar.big-screen.nav-expanded {
	left: 280px; /* Position after expanded navbar */
}

/*______________________*/
/* Guidance CSS class*/

.guidance-btn {
	height: 50px;
	width: 130px;
	position: fixed;
	bottom: calc(15%);
	right: -105px;
	background-color: var(--link-color);
	color: white;
	border: none;
	cursor: pointer;
	transition: transform 0.3s ease, right 0.3s ease, z-index 0.3s ease;
	display: flex;
	z-index: 999;
	border-radius: 25px 0 0 25px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Make button visible during tutorial with higher z-index */
.guidance-btn.tutorial-active {
	transform: translateX(-100px) !important;
	right: -105px !important;
	z-index: 10001 !important;
}

.guidance-btn:hover {
	transform: translateX(-90px);
	box-shadow: 0 6px 30px rgba(0, 0, 0, 0.3);
}

.is-guidance-visible {
	right: calc(50% + 19px - 80px);
	z-index: 999;
}

/* Make the guidance button always visible during tutorial */
#tutorial-guidance-button.tutorial-active {
	transform: translateX(-90px);
}

.guidance-image-container {
	margin-left: -25px;
	width: 50px;
	aspect-ratio: 1;
	border-radius: 50%;
	background-color: var(--link-color);
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
	background-color: var(--card-bg);
	padding: 20px;
	border-radius: 8px;
	box-shadow: 0 2px 4px var(--shadow-color);
	margin-top: 20px;
	color: var(--text-primary);
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
		background-color: var(--hover-bg);
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
