<template>
	<div class="chat-view-container" :class="{ 'navbar-expanded': isNavbarExpanded }">
		<!-- Desktop Sidebar (Fixed, Toggles Visibility) -->
		<SideBar
			v-if="isAuthenticated && !isMobile"
			:is-visible.sync="isSidebarVisibleBigScreen"
			:show-controls="false"
			:is-mobile="false"
			class="sidebar-desktop"
			:class="{ 'navbar-expanded': isNavbarExpanded }"
			:initialThreadName="newThreadName"
		/>

		<!-- Mobile Sidebar (Slides In) -->
		<SideBar
			v-if="isAuthenticated && isMobile"
			:is-visible.sync="isSidebarVisibleMobile"
			:show-controls="false"
			:is-mobile="true"
			class="sidebar-mobile"
			:initialThreadName="newThreadName"
		/>
		<div v-if="isAuthenticated && isMobile && isSidebarVisibleMobile" class="sidebar-mobile-overlay" @click="closeSidebarMobile"></div>

		<div class="chat-main-area">
			<div v-if="isAuthenticated" class="chat-controls-header">
				<button v-if="isMobile" @click="toggleSidebarMobile" class="mobile-sidebar-toggle-btn">
					<font-awesome-icon icon="fa-solid fa-bars" />
				</button>
				<font-awesome-icon 
					v-if="!isMobile" 
					class="toggle-sidebar-btn-big-fa"
					@click="toggleSidebarBigScreen" 
					:icon="isSidebarVisibleBigScreen ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right'" 
				/>
				<!-- You can add other header controls here if needed -->
			</div>
			<ChatComponent class="chat-component-instance" @initialThreadName="initialThreadName" ref="chatComponent" />
		</div>

		<!-- Guidance & Tutorial (Positioned relative to chat-view-container) -->
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
		<div v-if="overlayEnabled" class="new-window-overlay"></div>
	</div>
</template>

<script>
import ChatComponent from "@/components/ChatPage/ChatComponent.vue";
import SideBar from "@/components/Basic/SideBar.vue";
import GuidanceModal from "@/components/GuidanceModal.vue";
import TutorialOverlay from "@/components/TutorialPage/TutorialOverlay.vue";

export default {
	name: "ChatView",
	props: { chatBubbleThreadID: String },
	components: { ChatComponent, SideBar, GuidanceModal, TutorialOverlay },
	data() {
		return {
			isAuthenticated: false, // This should be derived from Vuex
			isSidebarVisibleMobile: false,
			isSidebarVisibleBigScreen: true, // Default for desktop
			showGuidance: false,
			overlayEnabled: false, // For new window pop-ups
			newWindow: null,
			windowCheckInterval: null,
			newThreadName: "",
			tutorialSteps: [
				{ element: "#tutorial-guidance-button", message: "Click here for guidance on how to ask questions to FinBud!", title: "Need help with queries?" },
			],
			isNavbarExpanded: false,
			isMobile: false,
			nnavbarObserver: null,
		};
	},
	computed: {
    // Re-enable isAuthenticated from Vuex store
    isAuthenticatedStore() {
      return this.$store.getters["users/isAuthenticated"];
    }
	},
	watch: {
    isAuthenticatedStore(newVal) {
      this.isAuthenticated = newVal;
    }
  },
	methods: {
		updateAuthStatus() {
      this.isAuthenticated = this.$store.getters["users/isAuthenticated"];
    },
		toggleSidebarMobile() { this.isSidebarVisibleMobile = !this.isSidebarVisibleMobile; },
		closeSidebarMobile() { this.isSidebarVisibleMobile = false; },
		toggleSidebarBigScreen() { this.isSidebarVisibleBigScreen = !this.isSidebarVisibleBigScreen; },
		checkMobile() { this.isMobile = window.innerWidth <= 768; },
		updateNavbarState() {
			const navbar = document.getElementById('nav-bar');
			if (navbar) this.isNavbarExpanded = navbar.classList.contains('expanded') || navbar.matches(':hover');
		},
		openNewWindow(url) {
			const screenWidth = window.screen.width, screenHeight = window.screen.height;
			const width = screenWidth * 0.7, height = screenHeight * 0.53;
			const left = (screenWidth - width) / 2, top = (screenHeight - height) / 2;
			this.newWindow = window.open(url, "_blank", `resize=0,toolbar=0,location=0,menubar=0,width=${width},height=${height},left=${left},top=${top}`);
			if (this.newWindow) {
				this.windowCheckInterval = setInterval(() => { if (this.newWindow.closed) this.handleWindowClose(); }, 1000);
				window.addEventListener("click", this.closeOnClickOutside);
				this.overlayEnabled = true;
			}
		},
		closeOnClickOutside() { if (this.newWindow && !this.newWindow.closed) { this.newWindow.close(); this.handleWindowClose(); }},
		handleWindowClose() {
			if (this.windowCheckInterval) clearInterval(this.windowCheckInterval);
			window.removeEventListener("click", this.closeOnClickOutside);
			this.overlayEnabled = false; this.newWindow = null;
		},
		initialThreadName(name) { this.newThreadName = name; },
		sendMessageToChat(message) { if (this.$refs.chatComponent) this.$refs.chatComponent.sendMessage(message); },
		onTutorialCompleted() { console.log("ChatView Tutorial completed!"); },
		restartTutorial() { if (this.$refs.tutorialOverlay) this.$refs.tutorialOverlay.resetTutorial(); },
	},
	mounted() {
		this.updateAuthStatus(); // Initial auth status check
    this.$store.watch(() => this.$store.getters["users/isAuthenticated"], (newVal) => {
      this.isAuthenticated = newVal;
    });

		this.checkMobile();
		window.addEventListener('resize', this.checkMobile);

		this.updateNavbarState();
		const navbarElement = document.getElementById('nav-bar');
		if (navbarElement) {
			this.navbarObserver = new MutationObserver(this.updateNavbarState);
			this.navbarObserver.observe(navbarElement, { attributes: true, attributeFilter: ['class'] });
			navbarElement.addEventListener('mouseenter', this.updateNavbarState);
			navbarElement.addEventListener('mouseleave', this.updateNavbarState);
		}

		const autoMessage = this.$route.query.autoMessage, threadID = this.$route.query.threadID;
		if (threadID) this.$store.dispatch("threads/updateThreadID", threadID);
		if (this.$route.query.showTutorial && this.$refs.tutorialOverlay) setTimeout(() => this.$refs.tutorialOverlay.resetTutorial(), 500);
	},
	beforeDestroy() {
		window.removeEventListener('resize', this.checkMobile);
		if (this.navbarObserver) this.navbarObserver.disconnect();
		const navbarElement = document.getElementById('nav-bar');
    if (navbarElement) {
      navbarElement.removeEventListener('mouseenter', this.updateNavbarState);
      navbarElement.removeEventListener('mouseleave', this.updateNavbarState);
    }
		if (this.windowCheckInterval) clearInterval(this.windowCheckInterval);
		window.removeEventListener("click", this.closeOnClickOutside);
	},
};
</script>

<style scoped>
.chat-view-container {
	display: flex;
	width: 100%;
	min-height: 100vh;
	background-color: var(--bg-primary);
	color: var(--text-primary);
	padding-left: 70px; /* Collapsed NavBar width */
	transition: padding-left 0.3s ease-in-out;
	box-sizing: border-box;
	position: relative; /* For absolute positioning of guidance btn */
}

.chat-view-container.navbar-expanded {
	padding-left: 280px; /* Expanded NavBar width */
}

/* Desktop Sidebar Styling */
.sidebar-desktop {
	position: fixed;
	left: 70px; /* After collapsed NavBar */
	top: 0;
	height: 100vh;
	width: 250px; /* Sidebar width */
	background-color: var(--bg-secondary);
	border-right: 1px solid var(--border-color);
	z-index: 990; /* Below NavBar (1000), Above Chat Area (10) */
	transition: left 0.3s ease-in-out;
}

.sidebar-desktop.navbar-expanded {
	left: 280px; /* After expanded NavBar */
}

/* Mobile Sidebar Styling */
.sidebar-mobile {
	position: fixed;
	left: 0;
	top: 0;
	width: 260px; /* Or percentage like 70% */
	height: 100vh;
	background-color: var(--card-bg);
	z-index: 1060; /* High z-index to be on top */
	box-shadow: 2px 0 10px rgba(0,0,0,0.2);
}

.sidebar-mobile-overlay {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	z-index: 1055; /* Below mobile sidebar, above other content */
}

/* Main Chat Area Styling */
.chat-main-area {
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	width: 100%; /* Will be constrained by chat-view-container padding */
	position: relative;
	z-index: 10; /* Base for chat content */
	box-sizing: border-box;
	overflow: hidden; /* Prevent chat-main-area itself from scrolling */
}

.chat-controls-header {
	display: flex;
	align-items: center;
	padding: 10px 15px;
	background-color: var(--bg-primary);
	/* position: sticky; Remove sticky, let ChatComponent handle its own scroll */
	/* top: 0; */
	z-index: 15; /* Above chat messages if they scroll, though ChatComponent will manage internal scroll */
	flex-shrink: 0; /* Prevent header from shrinking */
}

.mobile-sidebar-toggle-btn, .desktop-sidebar-toggle-btn {
	background: var(--bg-secondary);
	color: var(--text-accent);
	border: 1px solid var(--border-color);
	border-radius: 8px;
	padding: 8px 10px;
	font-size: 1rem;
	cursor: pointer;
	transition: background-color 0.2s, color 0.2s;
}

.mobile-sidebar-toggle-btn:hover, .desktop-sidebar-toggle-btn:hover {
	background-color: var(--hover-bg);
	color: var(--text-primary);
}

.desktop-sidebar-toggle-btn {
  margin-left: 5px; /* Small space from the edge of chat area */
}

.chat-component-instance {
	flex-grow: 1;
	display: flex; /* Ensure it takes up space */
	width: 100%;
	overflow-y: auto; /* ChatComponent scrolls its own content */
	display: flex; /* Ensure it is a flex container if ChatComponent root expects to grow within flex */
    flex-direction: column; /* Assuming ChatComponent stacks content vertically */
}

/* Overlay for new window pop-ups */
.new-window-overlay {
	position: fixed;
	top: 0; left: 0; width: 100%; height: 100%;
	background: rgba(0, 0, 0, 0.7);
	z-index: 1080; /* Highest for pop-ups */
}

/* Guidance Button & Modal - Z-indexing */
.guidance-btn {
	position: fixed;
	bottom: 30px;
	right: 30px;
	z-index: 1000;
	/* Added styles for desktop appearance and layout */
	display: flex;
	align-items: center;
	padding: 8px 12px; /* Adjust padding as needed */
	background-color: var(--card-bg); /* Use theme variable */
	border-radius: 20px; /* Rounded corners */
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.guidance-btn:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* New styles for desktop image container */
.guidance-image-container {
	width: 40px; /* Desktop image container size */
	height: 40px;
	margin-right: 8px; /* Space between image and text */
	overflow: hidden; /* Crucial to contain the image */
	border-radius: 50%; /* Make the image container circular */
	flex-shrink: 0; /* Prevent shrinking */
}

/* New styles for desktop image */
.guidance-image {
	width: 100%;
	height: 100%;
	object-fit: cover; /* Ensures the image covers the container, might crop */
	display: block;
}

.guidance-text {
	font-size: 0.9rem;
	color: var(--text-primary); /* Use theme variable */
	font-weight: 500;
}

@media (max-width: 768px) {
	.chat-view-container, .chat-view-container.navbar-expanded {
		padding-left: 0; /* NavBar is typically overlaid or hidden on mobile */
	}
	.desktop-sidebar-toggle-btn {
		display: none;
	}
  .chat-controls-header {
    padding-left: 15px; /* Ensure mobile toggle isn't at very edge */
  }
	/* Adjust guidance button for mobile */
	.guidance-btn {
		width: 60px; 
		height: 60px;
		border-radius: 50%;
		right: 15px; 
		bottom: 15px;
		padding: 0; /* Remove padding for circular button if image container takes full space */
		justify-content: center; /* Center the image container if it's the only child visible */
	}
	.guidance-text { 
		display: none; 
	}
	.guidance-image-container { 
		margin: 0; /* Remove margin if centered by flex parent */
		width: 45px;  /* Slightly smaller image for the 60px button */
		height: 45px;
	}
    /* .guidance-image styling for mobile can remain as is if it works, or inherit from desktop */
    /* The explicit width/height for .guidance-image in mobile (35px) might be too small if container is 45px.
       Let's ensure it fills its container on mobile too.
    */
    .guidance-image { /* Overriding for mobile if necessary, or just rely on desktop's 100% if container is sized */
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

/* Remaining styles from before, ensure they don't conflict */
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

@keyframes fadeInSlide {
	0% { opacity: 0; transform: translateY(20px); }
	100% { opacity: 1; transform: translateY(0); }
}

@keyframes highlight {
	0% { background-color: var(--hover-bg); }
	100% { background-color: transparent; }
}

.followup-component-card,
.source-component-card {
	animation: fadeInSlide 0.5s ease-out, highlight 1s ease-in-out;
}

/* Style for the FontAwesome-based big sidebar toggle */
.toggle-sidebar-btn-big-fa {
	width: 20px; /* Adjust size as needed */
	height: 20px; /* Adjust size as needed */
	cursor: pointer;
	padding: 8px;
	background: var(--bg-secondary);
	color: var(--text-accent);
	border-radius: 8px;
	border: 1px solid var(--border-color);
	transition: all 0.3s ease;
	margin-left: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.toggle-sidebar-btn-big-fa:hover {
	background: var(--hover-bg);
	transform: scale(1.05);
	color: var(--text-primary);
}

</style>
