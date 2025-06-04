<template>
  <nav class="nav-bar" :class="{ active: isMenuOpen, expanded: navBarIsVisiblyExpanded }" id="nav-bar" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <router-link to="/" class="logo-link">
      <img src="@/assets/home-page/FinbudSmallLogo.png" class="navbar-brand" alt="FinBud Logo" />
    </router-link>

    <button class="expand-toggle" @click="toggleExpand">
      <font-awesome-icon :icon="isExpanded ? 'fa-chevron-left' : 'fa-chevron-right'" class="icon" />
    </button>

    <div class="nav-right">
      <ul class="nav-items">
        <li>
          <router-link to="/chat-view" class="chat-button">
            <font-awesome-icon icon="fa-solid fa-comment" class="icon" />
            <span>{{ $t("chat") }}</span>
          </router-link>
        </li>

        <li class="dropdown" ref="overviewDropdown">
          <div class="services-dropdown" @click="toggleDropdown('overview')">
            <font-awesome-icon icon="fa-solid fa-compass" class="icon" />
            <span>{{ $t("overview") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'overview'">
            <router-link to="/about">{{ $t("about") }}</router-link>
            <router-link to="/tech">{{ $t("technology") }}</router-link>
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" ref="finAgentDropdown">
          <div class="services-dropdown" @click="toggleDropdown('finAgent')">
            <font-awesome-icon icon="fa-solid fa-robot" class="icon" />
            <span>{{ $t("finAgent") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finAgent'">
            <router-link to="/agent">{{ $t("agent") }}</router-link>
            <router-link to="/pestle">{{ $t("pestle") }}</router-link>
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" ref="finManageDropdown">
          <div class="services-dropdown" @click="toggleDropdown('finManage')">
            <font-awesome-icon icon="fa-solid fa-chart-line" class="icon" />
            <span>{{ $t("finManage") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finManage'">
            <router-link to="/goal">{{ $t("goal") }}</router-link>
            <router-link to="/riskanalysis">{{ $t("riskAnalysis") }}</router-link>
            <router-link to="/investment-calculator">{{ $t("investmentCalculator") }}</router-link>
            <router-link to="/mortgage-calc">{{ $t("mortgageCalculator") }}</router-link>
            <router-link to="/super-investors">{{ $t("superInvestors") }}</router-link>
            <router-link to="/fin-compare">{{ $t("ProductComparison") }}</router-link>
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" ref="finInvestDropdown">
          <div class="services-dropdown" @click="toggleDropdown('finInvest')">
            <font-awesome-icon icon="fa-solid fa-money-bill-trend-up" class="icon" />
            <span>{{ $t("finInvest") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finInvest'">
            <router-link to="/stock-simulator">{{ $t("simulator") }}</router-link>
            <router-link to="/autotrade-ai">AutoTrade AI</router-link>
            <router-link to="/quant-analysis">{{ $t("quant") }}</router-link>
            <router-link to="/quant-simulator">{{ $t("quantSimulator") }}</router-link>
            <router-link to="/fund-letter">{{ $t("FundLetter")}}</router-link>
            <router-link to="/docs">{{ $t("FinData") }}</router-link>
            <router-link to="/macro-economic">{{ $t("macroEconomic") }}</router-link>
            <router-link to="/market-analysis">{{ $t("marketAnalysis") }}</router-link>
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" ref="finEduDropdown">
          <div class="services-dropdown" @click="toggleDropdown('finEdu')">
            <font-awesome-icon icon="fa-solid fa-graduation-cap" class="icon" />
            <span>{{ $t("finEdu") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finEdu'">
            <router-link to="/quizz">{{ $t("quiz") }}</router-link>
            <router-link to="/event">{{ $t("event") }}</router-link>
            <router-link to="/forum">{{ $t("forum") }}</router-link>
            <router-link to="/course">{{ $t("course") }}</router-link>
          </div>
        </li>
      </ul>

      <div class="profile-wrapper" v-if="isAuthenticated">
        <router-link to="/profile" class="user-profile">
          <img :src="profileImage" alt="User Image" class="user-image" @error="handleImageError" />
          <div class="user-info">
            <div class="user-name">{{ profileName }}</div>
                <FinCoinDisplay :balance="finCoinBalance" />
              </div>
        </router-link>
        
        <div class="nav-bottom">
              <div class="language-switcher">
                <button @click="switchLanguage('en')">
                  <img src="@/assets/us.png" alt="English" />
                </button>
                <button @click="switchLanguage('vi')">
                  <img src="@/assets/vn.png" alt="Tiếng Việt" />
                </button>
              </div>
          
          <a href="#" class="dark-mode-toggle" @click.prevent="toggleDarkMode">
                <font-awesome-icon :icon="isDarkMode ? 'fa-moon' : 'fa-sun'" class="icon" />
            <span>{{ isDarkMode ? $t("darkMode") : $t("lightMode") }}</span>
          </a>
          
          <a href="#" class="logout" @click.prevent="logout">
                <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="icon" />
            <span>{{ $t("logout") }}</span>
          </a>
            </div>
          </div>

      <router-link v-if="!isAuthenticated && !isAuthLoading" to="/login" class="login-button">
        {{ $t("login") }}
            </router-link>
          </div>

    <button class="navbar-toggle" @click="toggleMenu">
      <font-awesome-icon icon="fa-solid fa-bars" />
    </button>
  </nav>
</template>

<script>
import axios from "axios";
import defaultImage from "@/assets/anonymous.png";
import FinCoinDisplay from "@/components/FinCoinDisplay.vue";
import NavbarNoti from "../Notification/NavbarNoti.vue";
import LoadingPage from "@/views/Home/LoadingPage.vue";

export default {
  name: "NavBar",
  components: {
    FinCoinDisplay,
    NavbarNoti,
    LoadingPage,
  },
  data() {
    return {
      isDarkMode: false,
      isMenuOpen: false,
      isMobile: false,
      isExpanded: false,
      activeDropdown: null,
      isHovered: false,
    };
  },
  watch: {
    isExpanded(newIsExpandedState) {
      if (!newIsExpandedState && !this.isHovered) {
        this.activeDropdown = null;
      }
    },
    isHovered(newIsHoveredState) {
      if (!newIsHoveredState && !this.isExpanded) {
        this.activeDropdown = null;
      }
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
    isAuthLoading() {
      return this.$store.getters["users/isAuthLoading"];
    },
    userData() {
      return this.$store.getters["users/currentUser"];
    },
    profileImage() {
      const userImage = this.$store.getters["users/userProfileImage"];
      return userImage && userImage.trim() !== "" ? userImage : defaultImage;
    },
    profileName() {
      return this.$store.getters["users/userDisplayName"];
    },
    finCoinBalance() {
      return this.$store.getters["finCoin/finCoinBalance"];
    },
    navBarIsVisiblyExpanded() {
      if (this.isMobile) return this.isMenuOpen;
      return this.isExpanded || this.isHovered;
    }
  },
  methods: {
    handleMouseEnter() {
      if (!this.isMobile) {
        this.isHovered = true;
      }
    },
    handleMouseLeave() {
      if (!this.isMobile) {
        this.isHovered = false;
      }
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      if(!this.isMenuOpen && this.isMobile) {
          this.activeDropdown = null;
      }
    },
    checkMobile() {
      const mobileState = window.innerWidth <= 768;
      if (this.isMobile !== mobileState) {
          this.isMobile = mobileState;
          if(this.isMobile) {
              this.isExpanded = false;
              this.isHovered = false;
          } else {
              this.isMenuOpen = false;
          }
      }
    },
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("language", lang);
    },
    async logout() {
      try {
        await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/auth/logout`, {
          withCredentials: true,
        });
      } catch (err) {
        console.error("Logout error:", err);
      }
      this.$store.dispatch("users/logout");
      this.$router.push("/login");
    },
    async toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      document.documentElement.classList.toggle("dark-mode", this.isDarkMode);
      document.body.classList.toggle("dark-mode", this.isDarkMode);
      localStorage.setItem("darkMode", this.isDarkMode ? "true" : "false");

      if (this.userData) {
        try {
          const response = await axios.put(
            `${process.env.VUE_APP_DEPLOY_URL}/users/${this.userData._id}/settings`,
            { settings: { darkMode: this.isDarkMode } },
            { withCredentials: true }
          );
          console.log("Dark mode updated:", response.data);
        } catch (err) {
          console.error("Error saving dark mode:", err);
        }
      }
    },
    handleImageError(event) {
      event.target.src = defaultImage;
    },
    toggleExpand() {
      if (this.isMobile) return;
      this.isExpanded = !this.isExpanded;
    },
    toggleDropdown(name) {
      if (this.isMobile && !this.isMenuOpen) return;

      if (!this.isMobile && !this.navBarIsVisiblyExpanded) {
        this.isExpanded = true;
        this.$nextTick(() => {
          this.activeDropdown = name;
          this.positionDropdown(name);
        });
      } else if (this.activeDropdown === name) {
        this.activeDropdown = null;
      } else {
        this.activeDropdown = name;
        this.$nextTick(() => {
          this.positionDropdown(name);
        });
      }
    },
    positionDropdown(name) {
      if (this.isMobile) {
          const dropdownContent = this.$refs[name + 'Dropdown']?.querySelector('.dropdown-content');
          if(dropdownContent) {
            dropdownContent.style.left = '';
            dropdownContent.style.top = '';
          }
          return;
      }

      const dropdownRef = this.$refs[name + 'Dropdown'];
      if (dropdownRef) {
        const rect = dropdownRef.getBoundingClientRect();
        const dropdown = dropdownRef.querySelector('.dropdown-content');
        if (dropdown) {
          const navBarElement = document.getElementById('nav-bar');
          let navBarWidth = 70; 
          if (navBarElement && navBarElement.classList.contains('expanded')) {
             navBarWidth = 280;
          }
          dropdown.style.left = navBarWidth + 'px';
          dropdown.style.top = rect.top + 'px';
        }
      }
    },
    closeDropdowns(event) {
      if (!event.target.closest('.dropdown')) {
        this.activeDropdown = null;
      }
    },
    handleResize() {
      this.checkMobile();
      if (this.activeDropdown) {
          if (this.navBarIsVisiblyExpanded || this.isMenuOpen) { 
              this.positionDropdown(this.activeDropdown);
          } else {
              this.activeDropdown = null; 
          }
      }
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.handleResize);

    const savedLang = localStorage.getItem("language");
    if (savedLang) this.$i18n.locale = savedLang;

    if (!this.$store.getters["users/currentUser"]) {
      this.$store.dispatch("users/fetchCurrentUser");
    }

    const storedDarkMode = localStorage.getItem("darkMode");
    this.isDarkMode = storedDarkMode === "true";
    document.documentElement.classList.toggle("dark-mode", this.isDarkMode);
    document.body.classList.toggle("dark-mode", this.isDarkMode);

    if (this.isAuthenticated) {
      this.$store.dispatch("finCoin/fetchFinCoinBalance");
    }
    document.addEventListener('click', this.closeDropdowns);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.closeDropdowns);
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap");

.nav-bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 70px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0.75rem;
  z-index: 1000;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-bar.expanded {
  width: 280px;
}

.logo-link {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.navbar-brand {
  height: 55px;
  width: auto;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

.nav-right {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.nav-right::-webkit-scrollbar {
  width: 4px;
}

.nav-right::-webkit-scrollbar-track {
  background: transparent;
}

.nav-right::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.nav-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-items li {
  width: 100%;
}

/* Chat button special styling */
.chat-button {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  margin: 0.5rem 0;
  background: #000;
  color: #fff !important;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.chat-button:hover::before {
  transform: translate(-50%, -50%) scale(2);
}

.chat-button .icon {
  min-width: 24px;
  margin-right: 1rem;
  font-size: 1.2rem;
  position: relative;
  z-index: 2;
}

.chat-button span {
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.nav-bar.expanded .chat-button span {
  opacity: 1;
  transform: translateX(0);
}

/* Navigation items styling */
.nav-items li a,
.services-dropdown {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  color: #333;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.nav-items li a .icon,
.services-dropdown .icon {
  min-width: 24px;
  margin-right: 1rem;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.nav-items li a span,
.services-dropdown span {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.nav-bar.expanded .nav-items li a span,
.nav-bar.expanded .services-dropdown span {
  opacity: 1;
  transform: translateX(0);
}

.nav-items li a:hover,
.services-dropdown:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(5px);
}

.nav-items li a:hover .icon,
.services-dropdown:hover .icon {
  transform: scale(1.1);
}

/* Dropdown styling */
.dropdown {
  position: relative;
}

.dropdown-content {
  position: fixed;
  left: 280px;
  top: auto;
  min-width: 240px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.nav-bar:not(.expanded):not(:hover) .dropdown-content {
  left: 70px;
}

.dropdown-content a {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #333;
  text-decoration: none;
  font-size: 0.95rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.dropdown-content a:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(5px);
}

.arrow-down {
  margin-left: auto;
  width: 6px;
  height: 6px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: rotate(-45deg);
  transition: transform 0.3s ease;
}

.services-dropdown:hover .arrow-down {
  transform: rotate(-45deg) translate(-2px, -2px);
}

/* Profile section */
.profile-wrapper {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  gap: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.user-profile:hover {
  background: rgba(0, 0, 0, 0.05);
}

.user-image {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  min-width: 42px;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}

.nav-bar.expanded .user-info {
  opacity: 1;
  transform: translateX(0);
}

.user-name {
  font-weight: 600;
  color: #000;
  margin-bottom: 0.25rem;
  font-size: 0.95rem;
}

/* Bottom section */
.nav-bottom {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-bottom a {
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  color: #333;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.95rem;
}

.nav-bottom a .icon {
  min-width: 24px;
  margin-right: 1rem;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.nav-bottom a span {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.nav-bar.expanded .nav-bottom a span {
  opacity: 1;
  transform: translateX(0);
}

.nav-bottom a:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(5px);
}

.nav-bottom a:hover .icon {
  transform: scale(1.1);
}

/* Language switcher */
.language-switcher {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem;
}

.language-switcher button {
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.language-switcher button img {
  width: 28px;
  height: auto;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.language-switcher button:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.language-switcher button:hover img {
  transform: scale(1.1);
}

/* Dark mode */
:root.dark-mode .nav-bar {
  background: rgba(0, 0, 0, 0.95);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-mode .nav-items li a,
:root.dark-mode .services-dropdown,
:root.dark-mode .nav-bottom a {
  color: rgba(255, 255, 255, 0.9);
}

:root.dark-mode .nav-items li a:hover,
:root.dark-mode .services-dropdown:hover,
:root.dark-mode .nav-bottom a:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-mode .dropdown-content {
  background: rgba(20, 20, 20, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:root.dark-mode .dropdown-content a {
  color: rgba(255, 255, 255, 0.9);
}

:root.dark-mode .dropdown-content a:hover {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark-mode .user-name {
  color: white;
}

:root.dark-mode .chat-button {
  background: #fff;
  color: #000 !important;
}

:root.dark-mode .chat-button::before {
  background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, transparent 70%);
}

/* Toggle button */
.expand-toggle {
    position: absolute;
  top: 1.5rem;
  right: -12px;
  width: 24px;
  height: 24px;
  background: #000;
  border: none;
  border-radius: 50%;
  color: white;
    display: flex;
    align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2001;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.expand-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.expand-toggle .icon {
  font-size: 0.8rem;
  transition: transform 0.3s ease;
}

.nav-bar.expanded .expand-toggle .icon {
  transform: rotate(180deg);
}

:root.dark-mode .expand-toggle {
  background: #fff;
  color: #000;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .nav-bar {
    transform: translateX(-100%);
    width: 280px;
  }

  .nav-bar.active {
    transform: translateX(0);
  }

  .navbar-toggle {
    display: block;
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 2001;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 8px;
    padding: 0.75rem;
    cursor: pointer;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-size: 1.2rem;
    color: #333;
    backdrop-filter: blur(10px);
  }

  .navbar-toggle:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }

  .dropdown-content {
    position: static;
    margin: 0.5rem 0;
    width: 100%;
    box-shadow: none;
    border-left: 2px solid rgba(0,0,0,0.1);
    border-radius: 0 0 12px 12px;
    left: auto !important;
    top: auto !important;
  }

  .nav-bar.active .chat-button span,
  .nav-bar.active .nav-items li a span,
  .nav-bar.active .services-dropdown span,
  .nav-bar.active .user-info,
  .nav-bar.active .nav-bottom a span {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
   }
}

/* Mobile navbar toggle */
.navbar-toggle {
  display: none;
}

/* Mobile navbar toggle dark mode */
:root.dark-mode .navbar-toggle {
  background: rgba(0, 0, 0, 0.95);
  color: #fff;
}

:root.dark-mode .navbar-toggle:hover {
  background: rgba(0, 0, 0, 1);
}
</style>
