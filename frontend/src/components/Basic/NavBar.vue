<template>

  <button 
    class="navbar-toggle"
    @click="toggleMenu"
    ref="toggleButton"
    :aria-expanded="isMobile ? isMenuOpen : isExpanded"
    aria-controls="nav-bar"
  >
    <font-awesome-icon icon="fa-solid fa-bars" />
  </button> 

  <div
    v-if="isMobile"
    class="nav-overlay"
    :class="{ active: isMenuOpen }"
    @click="closeMobileMenu"
  ></div>

  <nav class="nav-bar" :class="navBarClasses" id="nav-bar"  ref="navBar">
    <div
      class="nav-header"
      @mouseenter="handleLogoHover(true)"
      @mouseleave="handleLogoHover(false)"
    >
      <router-link
        v-if="!showCollapsedHoverToggle"
        to="/"
        class="logo-link"
        :class="{ 'logo-link-collapsed': !isMobile && !isExpanded }"
      >
        <img src="@/assets/home-page/FinbudSmallLogo.png" class="navbar-brand" alt="FinBud Logo" />
      </router-link>

      <button
        v-if="!isMobile && isExpanded"
        type="button"
        class="panel-toggle-btn"
        @click="toggleExpand"
        aria-label="Collapse navigation"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="14" rx="3"></rect>
          <path d="M10 5v14"></path>
        </svg>
      </button>

      <button
        v-else-if="showCollapsedHoverToggle"
        type="button"
        class="panel-toggle-btn panel-toggle-btn-collapsed"
        @click="toggleExpand"
        aria-label="Expand navigation"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="14" rx="3"></rect>
          <path d="M10 5v14"></path>
        </svg>
      </button>
    </div>

    
    <div class="nav-right">
      <ul class="nav-items">
        <li>
          <router-link to="/chat-view" class="chat-button">
            <font-awesome-icon icon="fa-solid fa-comments" class="icon" />
            <span>{{ $t("chat") }}</span>
          </router-link>
        </li>

        <li class="dropdown" ref="finInvestDropdown" v-if="isAuthenticated">
          <div class="services-dropdown" @click="toggleDropdown('finInvest')">
            <font-awesome-icon icon="fa-solid fa-chart-line" class="icon" />
            <span>{{ $t("finInvest") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finInvest'">
            <router-link to="/stock-simulator">{{ $t("simulator") }}</router-link>
            <router-link to="/fund-letter">{{ $t("FundLetter")}}</router-link>
          </div>
        </li>

        <li class="dropdown" ref="finManageDropdown" v-if="isAuthenticated">
          <div class="services-dropdown" @click="toggleDropdown('finManage')">
            <font-awesome-icon icon="fa-solid fa-wallet" class="icon" />
            <span>{{ $t("finManage") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finManage'">
            <router-link to="/goal">{{ $t("goal") }}</router-link>
            <router-link to="/market-data-center">{{ $t("riskAnalysis") }}</router-link>
            <router-link to="/investment-calculator">{{ $t("investmentCalculator") }}</router-link>
            <router-link to="/mortgage-calc">{{ $t("mortgageCalculator") }}</router-link>
            <router-link to="/super-investors">{{ $t("superInvestors") }}</router-link>
            <router-link to="/fin-compare">{{ $t("ProductComparison") }}</router-link>
          </div>
        </li>

        <!-- Subscribe FinPlus Section -->
        <li v-if="isAuthenticated">
          <router-link to="/subscribe" class="nav-link finplus-link">
            <font-awesome-icon icon="fa-solid fa-crown" class="icon" />
            <span>{{ $t("subscribeFinPlus") }}</span>
            </router-link>
        </li>
        <div class="nav-bottom">
          <div class="language-switcher">
              <button @click="switchLanguage('en')">
                <img src="@/assets/us.png" alt="English" />
              </button>
              <button @click="switchLanguage('vi')">
                <img src="@/assets/vn.png" alt="Tiếng Việt" />
              </button>
          </div>
        </div>

        <!-- Overview section - Appears after FinVerse -->
        <li class="dropdown overview-section" ref="overviewDropdown">
          <div class="services-dropdown" @click="toggleDropdown('overview')">
            <font-awesome-icon icon="fa-solid fa-chart-bar" class="icon" />
            <span>{{ $t("overview") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'overview'">
            <router-link to="/about">{{ $t("about") }}</router-link>
            <router-link to="/tech">{{ $t("technology") }}</router-link>
          </div>
        </li>
      </ul>

      <div class="profile-wrapper" v-if="isAuthenticated">
        <router-link to="/profile" class="user-profile">
          <img :key="resolvedProfileImage" :src="resolvedProfileImage" alt="User Image" class="user-image" referrerpolicy="no-referrer" @error="handleImageError" />
          <div class="user-info">
            <div class="user-name">{{ profileName }}</div>
                <FinCoinDisplay :balance="finCoinBalance" />
            </div>
        </router-link>
        
        <div class="nav-bottom">
          <!-- <div class="language-switcher">
            <button @click="switchLanguage('en')">
              <img src="@/assets/us.png" alt="English" />
            </button>
            <button @click="switchLanguage('vi')">
              <img src="@/assets/vn.png" alt="Tiếng Việt" />
            </button>
          </div> -->
          
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
      <router-link v-if="!isAuthenticated && !isAuthLoading" to="/login" class="login-button" @click.native="closeMobileMenu">
        <font-awesome-icon icon="fa-solid fa-user" class="icon" />
        <span>{{ $t("login") }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
import defaultImage from "@/assets/anonymous.png";
import FinCoinDisplay from "@/components/FinCoinDisplay.vue";
import NavbarNoti from "../Notification/NavbarNoti.vue";
import LoadingPage from "@/views/Home/LoadingPage.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faComments, faChartLine, faWallet, faGraduationCap, faChartBar, 
  faRobot, faUserTie, faChartPie, faNewspaper,
  faMoon, faSun, 
  faRightFromBracket, faBars, faUser,
  faUsers, faHeart, faCalendar, faTrophy, faCrown, faBuilding, faMicroscope, faBrain,
  faCogs, faRocket, faSearchDollar, faCalculator, faBullseye
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faComments, faChartLine, faWallet, faGraduationCap, faChartBar, 
  faRobot, faUserTie, faChartPie, faNewspaper,
  faMoon, faSun, 
  faRightFromBracket, faBars, faUser,
  faUsers, faHeart, faCalendar, faTrophy, faCrown, faBuilding, faMicroscope, faBrain,
  faCogs, faRocket, faSearchDollar, faCalculator, faBullseye
);

export default {
  name: "NavBar",
  components: {
    FinCoinDisplay,
    NavbarNoti,
    LoadingPage,
    FontAwesomeIcon,
  },
  data() {
    return {
      isDarkMode: false,
      isMenuOpen: false,
      isMobile: false,
      isExpanded: true,
      activeDropdown: null,
      isHovered: false,
      isLogoHovered: false,
      hasProfileImageError: false,
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
    },
    profileImage(newProfileImage, oldProfileImage) {
      if (newProfileImage !== oldProfileImage) {
        this.hasProfileImageError = false;
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
    resolvedProfileImage() {
      return this.hasProfileImageError ? defaultImage : this.profileImage;
    },
    profileName() {
      return this.$store.getters["users/userDisplayName"];
    },
    finCoinBalance() {
      return this.$store.getters["finCoin/finCoinBalance"];
    },
    navBarClasses() {
      return {
        expanded: !this.isMobile && this.isExpanded,
        collapsed: !this.isMobile && !this.isExpanded,
        'mobile-open': this.isMobile && this.isMenuOpen,
        'mobile-closed': this.isMobile && !this.isMenuOpen,
      };
    },
    showCollapsedHoverToggle() {
      return !this.isMobile && !this.isExpanded && this.isLogoHovered;
    }
  },
  methods: {
    handleLogoHover(isHovered) {
      if (this.isMobile || this.isExpanded) {
        this.isLogoHovered = false;
        return;
      }

      this.isLogoHovered = isHovered;
    },
    handleOutsideClick(event) {
      // Check if the click is outside the nav-bar and toggle button
      const nav = this.$refs.navBar;
      const toggle = this.$refs.toggleButton;

      if (
        this.isMobile &&
        this.isMenuOpen &&
        nav &&
        toggle &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        this.closeMobileMenu();
      }
    },
    toggleMenu() {
      if (!this.isMobile) {
        this.isExpanded = !this.isExpanded;
        return;
      }

      this.isMenuOpen = !this.isMenuOpen;
      if (!this.isMenuOpen) {
        this.activeDropdown = null;
      }

      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    },
    closeMobileMenu() {
      if (!this.isMobile) {
        return;
      }

      this.isMenuOpen = false;
      this.activeDropdown = null;
      document.body.style.overflow = '';
    },
    checkMobile() {
      const mobileState = window.innerWidth <= 768;
      if (this.isMobile !== mobileState) {
          this.isMobile = mobileState;
          this.activeDropdown = null;
          this.isMenuOpen = false;
          this.isLogoHovered = false;
          document.body.style.overflow = '';
          if(this.isMobile) {
              this.isExpanded = false;
              this.isHovered = false;
          }
      }
      console.log( 'isMobile: ', this.isMobile );
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
    handleImageError() {
      if (this.profileImage !== defaultImage) {
        this.hasProfileImageError = true;
      }
    },
    toggleExpand() {
      if (this.isMobile) {
        this.toggleMenu();
        return;
      }
      this.isExpanded = !this.isExpanded;
      this.isLogoHovered = false;
    },
    toggleDropdown(name) {
      // Allow dropdown toggle in mobile when menu is open
      if (this.isMobile && !this.isMenuOpen) {
        this.isMenuOpen = true;
        return;
      }

      if (!this.isMobile && !this.isExpanded) {
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
          let navBarWidth = 80; 
          if (navBarElement && navBarElement.classList.contains('expanded')) {
             navBarWidth = 280;
          }
          dropdown.style.position = 'fixed';
          dropdown.style.left = navBarWidth + 'px';
          dropdown.style.top = rect.top + 'px';
          dropdown.style.zIndex = '1001'; // Higher than navbar
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
          if ((this.isMobile && this.isMenuOpen) || (!this.isMobile && this.isExpanded)) { 
              this.positionDropdown(this.activeDropdown);
          } else {
              this.activeDropdown = null; 
          }
      }
    }
  },
  async mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleOutsideClick);

    const savedLang = localStorage.getItem("language");
    if (savedLang) this.$i18n.locale = savedLang;

    // Always fetch current user data to ensure we have the latest info
    await this.$store.dispatch("users/fetchCurrentUser");
    
    // Debug logging
    const userData = this.$store.getters["users/currentUser"];
    console.log("NavBar - User data loaded:", userData);
    console.log("NavBar - Display name:", this.profileName);
    console.log("NavBar - Profile image:", this.profileImage);

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
    document.removeEventListener('click', this.handleOutsideClick);
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap");

.nav-bar {
  position: fixed;
  left: 0;
  top: 0;
  width: 80px;
  height: 100vh;
  background: var(--bg-primary);
  backdrop-filter: blur(10px);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0.75rem;
  box-sizing: border-box;
  overflow: visible;
  z-index: 1000;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-bar.expanded {
  width: 280px;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
  margin-bottom: 2rem;
  gap: 0.75rem;
}

.nav-bar.expanded .nav-header {
  justify-content: space-between;
}

.logo-link {
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.logo-link-collapsed {
  margin: 0 auto;
}

.navbar-brand {
  height: 55px;
  width: auto;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

.panel-toggle-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: var(--bg-primary);
  color: #4b5563;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.panel-toggle-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.panel-toggle-btn:hover {
  background: #f8fafc;
  color: #111827;
  border-color: #9ca3af;
}

.panel-toggle-btn-collapsed {
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.nav-right {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.nav-right::-webkit-scrollbar {
  display: none;
}

.nav-items {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-items li {
  position: relative;
}

/* Chat button special styling */
.chat-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 56px;
  padding: 0.875rem 1rem;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 600;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.chat-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #000000, #333333, #000000);
  z-index: -1;
  border-radius: 10px;
}

.chat-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.chat-button .icon {
  font-size: 1.1rem;
  min-width: 20px;
}

/* Overview section at bottom */
.overview-section {
  margin-top: auto;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.services-dropdown {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 56px;
  padding: 0.875rem 1rem;
  color: #4b5563;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
}

.services-dropdown:hover {
  background: #f8fafc;
  color: #1a1a1a;
  transform: translateX(4px);
}

.services-dropdown .icon {
  font-size: 1.1rem;
  min-width: 20px;
  color: #6b7280;
  transition: color 0.3s ease;
}

.services-dropdown:hover .icon {
  color: #000000;
}

.arrow-down {
  margin-left: auto;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #9ca3af;
  transition: transform 0.3s ease, border-top-color 0.3s ease;
}

.services-dropdown:hover .arrow-down {
  border-top-color: #6b7280;
}

.dropdown.active .arrow-down {
  transform: rotate(180deg);
}

/* Dropdown content */
.dropdown-content {
  position: fixed;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 0.75rem;
  min-width: 200px;
  z-index: 1001;
  border: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-content a {
  display: block;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
  font-size: 0.9rem;
}

.dropdown-content a:hover {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  transform: translateX(4px);
}

/* Overview subsection styling */
.overview-subsection {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
}

.subsection-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.subsection-icon {
  font-size: 0.9rem;
  color: #000000;
}

.subsection-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem 0.5rem 2rem;
  color: #6b7280;
  text-decoration: none;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0.25rem 0.5rem;
}

.subsection-item:hover {
  background: linear-gradient(135deg, #f5f5f5, #e5e5e5);
  color: #000000;
  transform: translateX(4px);
}

.subsection-item-icon {
  font-size: 0.8rem;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.subsection-item:hover .subsection-item-icon {
  color: #000000;
}

/* Dark mode for subsections */
.dark-mode .overview-subsection {
  border-top-color: #374151;
}

.dark-mode .subsection-header {
  color: #9ca3af;
}

.dark-mode .subsection-item {
  color: #9ca3af;
}

.dark-mode .subsection-item:hover {
  background: linear-gradient(135deg, #333333, #000000);
  color: #ddd6fe;
}

.dark-mode .subsection-item-icon {
  color: #6b7280;
}

.dark-mode .subsection-item:hover .subsection-item-icon {
  color: #ddd6fe;
}

/* Profile section */
.profile-wrapper {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 56px;
  padding: 0.875rem 1rem;
  color: #1a1a1a;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.user-profile:hover {
  background: #f8fafc;
}

.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-info {
  flex: 1;
  overflow: hidden;
}

.user-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.language-switcher {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.language-switcher button {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  background: transparent;
}

.language-switcher button:hover {
  background: rgba(148, 163, 184, 0.12);
  transform: scale(1.05);
}

.language-switcher button img {
  width: 20px;
  height: auto;
}

.dark-mode-toggle,
.logout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 48px;
  padding: 0.75rem 1rem;
  color: #6b7280;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.dark-mode-toggle:hover,
.logout:hover {
  background: #f8fafc;
  color: #1a1a1a;
}

.logout:hover {
  background: #fef2f2;
  color: #dc2626;
}

.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: auto;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

/* Expand toggle */
/* Mobile toggle */
.navbar-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 48px;
  height: 48px;
  background: var(--bg-primary);
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #1a1a1a;
  z-index: 1002;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.navbar-toggle:hover {
  background: white;
  transform: scale(1.05);
}

/* Hide text when collapsed */
.nav-bar.collapsed span {
  opacity: 0;
  width: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}
.nav-bar.collapsed .profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-bar.collapsed .user-profile {
  justify-content: center;
  padding: 0.5rem;
  gap: 0;
  width: 100%;
}

.nav-bar.collapsed .user-info {
  display: none;
}

.nav-bar.collapsed .user-image {
  margin: 0 auto;
}

/* Collapsed state: center bottom action icons */
.nav-bar.collapsed .nav-bottom {
  align-items: center;
}

.nav-bar.collapsed .dark-mode-toggle,
.nav-bar.collapsed .logout {
  width: 48px;
  height: 48px;
  padding: 0;
  gap: 0;
  margin: 0 auto;
  justify-content: center;
  border-radius: 12px;
}

.nav-bar.collapsed .dark-mode-toggle span,
.nav-bar.collapsed .logout span {
  display: none;
}

.nav-bar.collapsed .dark-mode-toggle .icon,
.nav-bar.collapsed .logout .icon {
  margin: 0;
  font-size: 1.2rem;
}
.nav-bar.expanded span {
  opacity: 1;
  width: auto;
  transition: all 0.3s ease 0.1s;
}

.nav-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.32);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.25s ease, visibility 0.25s ease;
  z-index: 998;
}

.nav-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Mobile styles */
@media (max-width: 768px) {
  .nav-bar {
    width: min(86vw, 320px);
    transform: translateX(calc(-100% - 16px));
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
    box-shadow: 8px 0 28px rgba(0, 0, 0, 0.18);
  }

  .nav-bar.mobile-open {
    transform: translateX(0);
  }

  .nav-bar.mobile-closed {
    transform: translateX(calc(-100% - 16px));
  }

  .navbar-toggle {
    display: flex;
    z-index: 1001;
  }

  /* Always show text in mobile */
  .nav-bar span {
    opacity: 1 !important;
    width: auto !important;
    overflow: visible !important;
  }

  .nav-bar .user-info {
    display: block !important;
  }

  /* Mobile dropdown positioning */
  .dropdown-content {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    background: var(--bg-primary);
    margin-top: 0.5rem;
  }
}

/* Dark mode styles */
.dark-mode .nav-bar {
  background: var(--bg-primary);
  border-right: 1px solid #374151;
}

.dark-mode .panel-toggle-btn {
  background: rgba(31, 41, 55, 0.92);
  border-color: #4b5563;
  color: #f9fafb;
}

.dark-mode .panel-toggle-btn:hover {
  background: rgba(55, 65, 81, 0.95);
  border-color: #9ca3af;
  color: #ffffff;
}

.dark-mode .overview-section,
.dark-mode .profile-wrapper {
  border-top-color: rgba(255, 255, 255, 0.22);
}

.dark-mode .services-dropdown {
  color: #f9fafb;
}

.dark-mode .services-dropdown:hover {
  background: #374151;
  color: #f9fafb;
}

.dark-mode .services-dropdown .icon {
  color: #d1d5db;
}

.dark-mode .services-dropdown:hover .icon {
  color: #f9fafb;
}

.dark-mode .arrow-down {
  border-top-color: #d1d5db;
}

.dark-mode .services-dropdown:hover .arrow-down {
  border-top-color: #f9fafb;
}

.dark-mode .chat-button {
  background: linear-gradient(135deg, #1f2937, #111827);
  border-color: #374151;
}

.dark-mode .dropdown-content {
  background: #1f2937;
  border-color: #374151;
}

.dark-mode .dropdown-content a {
  color: #d1d5db;
}

.dark-mode .dropdown-content a:hover {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
}

.dark-mode .user-profile {
  color: #f9fafb;
}

.dark-mode .user-profile:hover {
  background: rgba(255, 255, 255, 0.06);
}

.dark-mode .user-image {
  border-color: #4b5563;
}

.dark-mode .user-name {
  color: #f9fafb;
}

.dark-mode .dark-mode-toggle,
.dark-mode .logout {
  color: #f9fafb;
}

.dark-mode .dark-mode-toggle .icon,
.dark-mode .logout .icon {
  color: #d1d5db;
}

.dark-mode .dark-mode-toggle:hover,
.dark-mode .logout:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #f9fafb;
}

.dark-mode .dark-mode-toggle:hover .icon,
.dark-mode .logout:hover .icon {
  color: #f9fafb;
}

.dark-mode .logout:hover {
  background: rgba(220, 38, 38, 0.18);
  color: #fca5a5;
}

.dark-mode .logout:hover .icon {
  color: #fca5a5;
}

.dark-mode .language-switcher button {
  background: transparent;
  border-color: transparent;
}

.dark-mode .language-switcher button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.dark-mode .finplus-link {
  color: #f9fafb;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(245, 158, 11, 0.1));
  border-color: rgba(251, 191, 36, 0.28);
}

.dark-mode .finplus-link:hover,
.dark-mode .finplus-link.router-link-exact-active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.18));
}

/* Ensure navbar doesn't interfere with chat sidebar */
.chat-view .nav-bar {
  z-index: 999;
}

/* Higher z-index for dropdowns */
.dropdown-content {
  z-index: 1001 !important;
}

.auth-btn {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.mobile-menu-toggle {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-auth-btn {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}


/* FinPlus Link Styling */
.finplus-link .icon {
  font-size: 1.1rem;
  min-width: 20px;
  color: #fbbf24;
  transition: all 0.3s ease;
}

.finplus-link:hover .icon,
.finplus-link.router-link-exact-active .icon {
  color: #f59e0b;
  transform: scale(1.1);
}

.finplus-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: 56px;
  padding: 0.875rem 1rem;
  color: #4b5563;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.finplus-link:hover,
.finplus-link.router-link-exact-active {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  color: #f59e0b;
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
  border-color: rgba(251, 191, 36, 0.4);
}

/* Navigation Link Styling */
.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: #4b5563;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.chat-button span,
.services-dropdown > span:first-of-type,
.finplus-link span,
.dark-mode-toggle span,
.logout span,
.login-button span {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}
</style>
