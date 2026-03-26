<template>
	<div
		class="chat-view-container"
		:class="{
			'navbar-expanded': isNavbarExpanded,
			'chat-view--mobile': isMobile,
		}"
	>
		<!-- Desktop Sidebar (Fixed, Toggles Visibility) -->
		<SideBar
			v-if="isAuthenticated && !isMobile"
			:is-visible.sync="isSidebarVisibleBigScreen"
			:show-controls="false"
			:is-mobile="false"
			class="sidebar-desktop"
			:class="{
				'navbar-expanded': isNavbarExpanded,
				'sidebar-hidden': !isSidebarVisibleBigScreen
			}"
			:initialThreadName="newThreadName"
		/>

		<!-- Mobile Sidebar (Slides In) -->
		<SideBar
			v-if="isAuthenticated && isMobile"
			:is-visible.sync="isSidebarVisibleMobile"
			:show-controls="false"
			:is-mobile="true"
			class="sidebar-mobile"
			:class="{ 'is-open': isSidebarVisibleMobile }"
			:initialThreadName="newThreadName"
		/>
		<div v-if="isAuthenticated && isMobile && isSidebarVisibleMobile" class="sidebar-mobile-overlay" @click="closeSidebarMobile"></div>

		<div class="chat-main-area">
			<ChatComponent class="chat-component-instance" @initialThreadName="initialThreadName" ref="chatComponent" :autoMessage="autoMessage" :greeting="greeting" />
		</div>

		<div v-if="overlayEnabled" class="new-window-overlay"></div>
	</div>
</template>

<script>
import ChatComponent from "@/components/ChatPage/ChatComponent.vue";
import SideBar from "@/components/Basic/SideBar.vue";

export default {
	name: "ChatView",
	props: { chatBubbleThreadID: String },
	components: { ChatComponent, SideBar },
	data() {
		return {
			isAuthenticated: false, // This should be derived from Vuex
			isSidebarVisibleMobile: false,
			isSidebarVisibleBigScreen: true, // Default for desktop
			overlayEnabled: false, // For new window pop-ups
			newWindow: null,
			windowCheckInterval: null,
			newThreadName: "",
			isNavbarExpanded: false,
			isMobile: false,
			nnavbarObserver: null,
			autoMessage: null,
			greeting: true,
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
    },
    isNavbarExpanded() {
			this.syncSidebarWithNavbar();
		},
		isMobile() {
			this.syncChatBodyScrollLock();
		},
		"$route.path"() {
			this.syncChatBodyScrollLock();
		},
  },
	methods: {
		syncChatBodyScrollLock() {
			const lock = this.isMobile && this.$route.path === "/chat-view";
			document.documentElement.classList.toggle("finbud-chat-mobile-lock", lock);
			document.body.classList.toggle("finbud-chat-mobile-lock", lock);
		},
		updateAuthStatus() {
      this.isAuthenticated = this.$store.getters["users/isAuthenticated"];
    },
		toggleSidebarMobile() {
			if (this.isNavbarExpanded) return;
			this.isSidebarVisibleMobile = !this.isSidebarVisibleMobile;
		},
		closeSidebarMobile() { this.isSidebarVisibleMobile = false; },
		toggleSidebarBigScreen() {
			if (this.isNavbarExpanded) return;
			this.isSidebarVisibleBigScreen = !this.isSidebarVisibleBigScreen;
		},
		checkMobile() {
			this.isMobile = window.innerWidth <= 768;
			this.syncSidebarWithNavbar();
		},
		updateNavbarState() {
			const navbar = document.getElementById('nav-bar');
			if (!navbar) return;

			// Sync only with explicit expand-toggle state to avoid hover jitter.
			this.isNavbarExpanded = navbar.classList.contains('expanded');
		},
		syncSidebarWithNavbar() {
			if (this.isNavbarExpanded) {
				this.isSidebarVisibleBigScreen = false;
				this.isSidebarVisibleMobile = false;
				return;
			}

			if (!this.isMobile) {
				this.isSidebarVisibleBigScreen = true;
			}
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
	},
	mounted() {
		this.updateAuthStatus(); // Initial auth status check
    this.$store.watch(() => this.$store.getters["users/isAuthenticated"], (newVal) => {
      this.isAuthenticated = newVal;
    });

		this.checkMobile();
		window.addEventListener('resize', this.checkMobile);

		this.updateNavbarState();
		this.syncSidebarWithNavbar();
		const navbarElement = document.getElementById('nav-bar');
		if (navbarElement) {
			this.navbarObserver = new MutationObserver(this.updateNavbarState);
			this.navbarObserver.observe(navbarElement, { attributes: true, attributeFilter: ['class'] });
		}

		const autoMessage = this.$route.query.autoMessage, threadID = this.$route.query.threadID;
		if (threadID) this.$store.dispatch("threads/updateThreadID", threadID);
		if (autoMessage) {
			this.autoMessage = autoMessage;
			this.greeting = false;
		}
		this.syncChatBodyScrollLock();
	},
	beforeDestroy() {
		document.documentElement.classList.remove("finbud-chat-mobile-lock");
		document.body.classList.remove("finbud-chat-mobile-lock");
		window.removeEventListener('resize', this.checkMobile);
		if (this.navbarObserver) this.navbarObserver.disconnect();
		if (this.windowCheckInterval) clearInterval(this.windowCheckInterval);
		window.removeEventListener("click", this.closeOnClickOutside);
	},
};
</script>

<style scoped>
.chat-view-container {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
	background-color: var(--bg-primary);
	color: var(--text-primary);
	padding-left: 80px; /* Collapsed NavBar width */
	transition: padding-left 0.3s ease-in-out;
	box-sizing: border-box;
	position: relative;
}

.chat-view-container.navbar-expanded {
	padding-left: 280px; /* Expanded NavBar width */
}

/* Desktop Sidebar Styling — width matches SideBar (.side-bar) via --finbud-chat-sidebar-width */
.sidebar-desktop {
	position: fixed;
	left: 80px; /* After collapsed NavBar */
	top: 0;
	height: 100vh;
	width: var(--finbud-chat-sidebar-width, clamp(248px, 16vw, 280px));
	overflow: hidden;
	z-index: 990; /* Below NavBar (1000), Above Chat Area (10) */
	transition: left 0.3s ease-in-out, width 0.25s ease-in-out;
}

.sidebar-desktop.navbar-expanded {
	left: 280px; /* After expanded NavBar */
}

.sidebar-desktop.sidebar-hidden {
	width: 0;
	pointer-events: none;
}

/* Mobile Sidebar Styling */
.sidebar-mobile {
	box-shadow: none;
}
.sidebar-mobile.is-open {
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
	flex: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 0;
	position: relative;
	z-index: 10;
	box-sizing: border-box;
	overflow: hidden;
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
	flex: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 0;
	overflow: hidden;
}

/* Overlay for new window pop-ups */
.new-window-overlay {
	position: fixed;
	top: 0; left: 0; width: 100%; height: 100%;
	background: rgba(0, 0, 0, 0.7);
	z-index: 1080; /* Highest for pop-ups */
}

@media (max-width: 768px) {
	.chat-view-container.chat-view--mobile,
	.chat-view-container.chat-view--mobile.navbar-expanded {
		padding-left: 0;
		height: 100dvh;
		max-height: 100dvh;
		min-height: 0;
		overflow: hidden;
	}

	.desktop-sidebar-toggle-btn {
		display: none;
	}
	.chat-controls-header {
		padding-left: 15px;
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