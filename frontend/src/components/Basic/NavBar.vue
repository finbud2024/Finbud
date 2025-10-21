<template>

  <button 
    class="navbar-toggle"
    @click="toggleMenu"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    ref="toggleButton"
  >
    <font-awesome-icon icon="fa-solid fa-bars" />
  </button> 

  <nav class="nav-bar" :class="{ active: isMenuOpen, expanded: navBarIsVisiblyExpanded }" id="nav-bar" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave" ref="navBar">
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
            <router-link to="/predictive-calculator">{{ $t("predictiveCalculator") }}</router-link>
            <router-link to="/autotrade-ai">{{ $t("autoTradeAI") }}</router-link>
            <router-link to="/quant-analysis">{{ $t("quant") }}</router-link>
            <router-link to="/quant-simulator">{{ $t("quantSimulator") }}</router-link>
            <router-link to="/fund-letter">{{ $t("FundLetter")}}</router-link>
            <router-link to="/docs">{{ $t("FinData") }}</router-link>
            <router-link to="/macro-economic">{{ $t("macroEconomic") }}</router-link>
            <router-link to="/market-analysis">{{ $t("marketAnalysis") }}</router-link>
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

        <li class="dropdown" ref="finEduDropdown" v-if="isAuthenticated">
          <div class="services-dropdown" @click="toggleDropdown('finEdu')">
            <font-awesome-icon icon="fa-solid fa-graduation-cap" class="icon" />
            <span>{{ $t("finEdu") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finEdu'">
            <router-link to="/quizz">{{ $t("quiz") }}</router-link>
            <router-link to="/create-roadmap">{{ $t("learningRoadmap") }}</router-link>
            <router-link to="/event">{{ $t("event") }}</router-link>
            <router-link to="/course">{{ $t("course") }}</router-link>
          </div>
        </li>

        <!-- Fin Agent Section - Top-level item -->
        <li class="dropdown" ref="finAgentDropdown" v-if="isAuthenticated">
          <div class="services-dropdown" @click="toggleDropdown('finAgent')">
            <font-awesome-icon icon="fa-solid fa-robot" class="icon" />
            <span>{{ $t("finAgent.title", "Fin Agent") }}</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finAgent'">
            <router-link to="/agent" class="subsection-item">
              <font-awesome-icon icon="fa-solid fa-newspaper" class="subsection-item-icon" />
              {{ $t("news") }}
            </router-link>
            <router-link to="/pestle" class="subsection-item">
              <font-awesome-icon icon="fa-solid fa-chart-pie" class="subsection-item-icon" />
              {{ $t("pestle") }}
            </router-link>
          </div>
        </li>

        <!-- AI Hedge Fund Lab - Premium Independent Section -->
        <li v-if="isAuthenticated" class="ai-hedge-fund-section">
          <router-link to="/ai-hedge-fund-lab" class="ai-hedge-fund-link">
            <font-awesome-icon icon="fa-solid fa-brain" class="icon" />
            <span>AI Hedge Fund Lab</span>
            <div class="premium-indicator">
              <span class="premium-text">PREMIUM</span>
              <div class="premium-glow"></div>
            </div>
          </router-link>
        </li>

        <!-- FinXpert Section -->
        <li v-if="isAuthenticated" class="dropdown" ref="finXpertDropdown">
          <div class="services-dropdown" @click="toggleDropdown('finXpert')">
            <font-awesome-icon icon="fa-solid fa-microscope" class="icon" />
            <span>FinXpert</span>
            <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="activeDropdown === 'finXpert'">
            <router-link to="/finxpert-real-estate" class="subsection-item">
              <font-awesome-icon icon="fa-solid fa-building" class="subsection-item-icon" />
              {{ $t("realEstateAnalyst") }}
            </router-link>
            <router-link to="/finxpert-equity" class="subsection-item">
              <font-awesome-icon icon="fa-solid fa-chart-line" class="subsection-item-icon" />
              {{ $t("equityResearcher") }}
            </router-link>
            <router-link to="/finxpert-accountant" class="subsection-item">
              <font-awesome-icon icon="fa-solid fa-calculator" class="subsection-item-icon" />
              {{ $t("accountant") }}
            </router-link>
            <router-link to="/ai-finance-workflows" class="subsection-item">
              <font-awesome-icon icon="fa-solid fa-brain" class="subsection-item-icon" />
              {{ $t("aiFinanceWorkflows") }}
            </router-link>
            <router-link to="/private-equity-deal-scout" class="subsection-item">
              <font-awesome-icon icon="fa-solid fa-search-dollar" class="subsection-item-icon" />
              {{ $t("privateEquityDealScout") }}
            </router-link>
          </div>
        </li>

        <!-- FinVerse Social Section - Simplified to single link -->
        <li v-if="isAuthenticated">
          <router-link to="/forum" class="nav-link finverse-link">
            <font-awesome-icon icon="fa-solid fa-users" class="icon" />
            <span>{{ $t("finVerse") }}</span>
            </router-link>
        </li>

        <!-- Subscribe FinPlus Section -->
        <li v-if="isAuthenticated">
          <router-link to="/subscribe" class="nav-link finplus-link">
            <font-awesome-icon icon="fa-solid fa-crown" class="icon" />
            <span>{{ $t("subscribeFinPlus") }}</span>
            </router-link>
        </li>

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

        <!-- Adding standalone blog section -->
        <li v-if="isAuthenticated">
          <router-link to="/blog" class="nav-link blog-link">
            <font-awesome-icon icon="fa-solid fa-newspaper" class="icon" />
            <span>Blog</span>
          </router-link>
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
  faChevronLeft, faChevronRight, faMoon, faSun, 
  faRightFromBracket, faBars, faUser,
  faUsers, faHeart, faCalendar, faTrophy, faCrown, faBuilding, faMicroscope, faBrain,
  faCogs, faRocket, faSearchDollar, faCalculator, faBullseye
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faComments, faChartLine, faWallet, faGraduationCap, faChartBar, 
  faRobot, faUserTie, faChartPie, faNewspaper,
  faChevronLeft, faChevronRight, faMoon, faSun, 
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
        this.isMenuOpen = false;
        this.activeDropdown = null;
      }
    },
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
    handleImageError(event) {
      event.target.src = defaultImage;
    },
    toggleExpand() {
      if (this.isMobile) {
        // For mobile, toggle the menu instead
        this.toggleMenu();
        return;
      }
      this.isExpanded = !this.isExpanded;
    },
    toggleDropdown(name) {
      // Allow dropdown toggle in mobile when menu is open
      if (this.isMobile && !this.isMenuOpen) {
        this.isMenuOpen = true;
        return;
      }

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
    document.addEventListener('click', this.handleOutsideClick);

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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
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
  background: white;
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
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s ease;
  background: #f8fafc;
}

.language-switcher button:hover {
  background: #e2e8f0;
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
.expand-toggle {
  position: absolute;
  top: 50%;
  right: -12px;
  width: 24px;
  height: 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #6b7280;
  transition: all 0.3s ease;
  z-index: 1001;
}

.expand-toggle:hover {
  background: #f8fafc;
  border-color: #000000;
  color: #000000;
  transform: scale(1.1);
}

/* Mobile toggle */
.navbar-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
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
.nav-bar:not(.expanded) span {
  opacity: 0;
  width: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.nav-bar.expanded span {
  opacity: 1;
  width: auto;
  transition: all 0.3s ease 0.1s;
}

/* Mobile styles */
@media (max-width: 768px) {
  .nav-bar {
    transform: translateX(-100%);
    width: 280px;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
  }

  .nav-bar.active {
    transform: translateX(0);
    width: 280px;
  }

  .navbar-toggle {
    display: flex;
  }

  .navbar-toggle:hover + .nav-bar,
  .nav-bar.active {
    transform: translateX(0);
    width: 280px;
  }

  .expand-toggle {
    display: none;
  }

  /* Always show text in mobile */
  .nav-bar span {
    opacity: 1 !important;
    width: auto !important;
  }

  /* Mobile dropdown positioning */
  .dropdown-content {
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    background: #f8fafc;
    margin-top: 0.5rem;
  }

  .nav-bar.expanded {
    width: 280px;
  }

  .nav-bar:not(.expanded) {
    width: 60px;
  }
}

/* Dark mode styles */
.dark-mode .nav-bar {
  background: rgba(17, 24, 39, 0.95);
  border-right: 1px solid #374151;
}

.dark-mode .services-dropdown {
  color: #d1d5db;
}

.dark-mode .services-dropdown:hover {
  background: #374151;
  color: #f9fafb;
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

.finverse-link .icon {
  font-size: 1.1rem;
  min-width: 20px;
  color: #6b7280;
  transition: color 0.3s ease;
}
.finverse-link:hover .icon,
.finverse-link.router-link-exact-active .icon {
  color: #000000;
}
.finverse-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: #4b5563;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  background: transparent;
  box-shadow: none;
}
.finverse-link:hover,
.finverse-link.router-link-exact-active {
  background: #f8fafc;
  color: #000000;
  transform: translateX(4px);
  box-shadow: none;
  border-color: transparent;
}

/* FinXpert Link Styling */
.finxpert-link .icon {
  font-size: 1.1rem;
  min-width: 20px;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.finxpert-link:hover .icon,
.finxpert-link.router-link-exact-active .icon {
  color: #2563eb;
  transform: scale(1.1);
}

.finxpert-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  color: #4b5563;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 600;
  position: relative;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.finxpert-link:hover,
.finxpert-link.router-link-exact-active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2));
  color: #2563eb;
  transform: translateX(4px);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  border-color: rgba(59, 130, 246, 0.4);
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

/* Featured AI Hedge Fund Lab styling */
.featured-item {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1)) !important;
  border: 1px solid rgba(16, 185, 129, 0.3) !important;
  position: relative;
  overflow: hidden;
}

.featured-item:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)) !important;
  border-color: rgba(16, 185, 129, 0.5) !important;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3) !important;
  transform: translateX(8px) !important;
}

.featured-item .subsection-item-icon {
  color: #10b981 !important;
  animation: pulse 2s infinite;
}

.premium-badge {
  position: absolute;
  top: 2px;
  right: 8px;
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  color: #000;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes glow {
  0% { box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4); }
  100% { box-shadow: 0 2px 15px rgba(251, 191, 36, 0.8); }
}

.dark-mode .featured-item {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15)) !important;
  border-color: rgba(16, 185, 129, 0.4) !important;
}

.dark-mode .featured-item:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.25)) !important;
}

.dark-mode .premium-badge {
  background: linear-gradient(45deg, #fbbf24, #f59e0b);
  color: #000;
}

/* AI Hedge Fund Lab - Premium Independent Styling */
.ai-hedge-fund-section {
  margin: 1rem 0;
  position: relative;
}

.ai-hedge-fund-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: #f0f6fc;
  text-decoration: none;
  border-radius: 16px;
  transition: all 0.4s ease;
  font-weight: 700;
  position: relative;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.9) 0%, 
    rgba(20, 20, 30, 0.95) 30%, 
    rgba(40, 40, 60, 0.9) 70%, 
    rgba(0, 0, 0, 0.9) 100%
  );
  border: 2px solid transparent;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.6),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
}

.ai-hedge-fund-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%, 
    rgba(255, 255, 255, 0.1) 50%, 
    transparent 70%
  );
  transform: translateX(-100%);
  transition: transform 0.6s ease;
  z-index: 1;
}

.ai-hedge-fund-link:hover::before {
  transform: translateX(100%);
}

.ai-hedge-fund-link:hover {
  background: linear-gradient(135deg, 
    rgba(10, 10, 20, 0.95) 0%, 
    rgba(30, 30, 50, 1) 30%, 
    rgba(50, 50, 80, 0.95) 70%, 
    rgba(10, 10, 20, 0.95) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.3);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 
    0 8px 40px rgba(0, 0, 0, 0.8),
    0 0 30px rgba(255, 255, 255, 0.2),
    inset 0 1px 1px rgba(255, 255, 255, 0.2);
}

.ai-hedge-fund-link .icon {
  font-size: 1.3rem;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: brainPulse 3s ease-in-out infinite;
  z-index: 2;
  position: relative;
}

.premium-indicator {
  position: relative;
  margin-left: auto;
  display: flex;
  align-items: center;
  z-index: 2;
}

.premium-text {
  background: linear-gradient(45deg, #ffffff, #e0e0e0, #ffffff);
  background-size: 200% 200%;
  animation: shimmer 2s ease-in-out infinite alternate;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.premium-glow {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, #ffffff 0%, transparent 70%);
  border-radius: 50%;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes brainPulse {
  0%, 100% { 
    transform: scale(1);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  50% { 
    transform: scale(1.1);
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes glowPulse {
  0%, 100% { 
    opacity: 0.6;
    transform: scale(1);
  }
  50% { 
    opacity: 1;
    transform: scale(1.5);
  }
}

/* Dark mode adjustments for AI Hedge Fund Lab */
.dark-mode .ai-hedge-fund-link {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 1) 0%, 
    rgba(15, 15, 25, 1) 30%, 
    rgba(30, 30, 50, 1) 70%, 
    rgba(0, 0, 0, 1) 100%
  );
  box-shadow: 
    0 4px 25px rgba(0, 0, 0, 0.9),
    inset 0 1px 1px rgba(255, 255, 255, 0.15);
}

.dark-mode .ai-hedge-fund-link:hover {
  background: linear-gradient(135deg, 
    rgba(5, 5, 15, 1) 0%, 
    rgba(20, 20, 40, 1) 30%, 
    rgba(40, 40, 70, 1) 70%, 
    rgba(5, 5, 15, 1) 100%
  );
  box-shadow: 
    0 10px 50px rgba(0, 0, 0, 1),
    0 0 40px rgba(255, 255, 255, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.25);
}

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

.blog-link {
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border: 1px solid #d1d5db;
}

.blog-link:hover {
  background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.blog-link .icon {
  color: #4b5563;
  font-size: 1.1rem;
  min-width: 20px;
}

/* Dark mode styles */
.dark-mode .blog-link {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-color: #374151;
}

.dark-mode .blog-link:hover {
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
}

.dark-mode .blog-link .icon {
  color: #d1d5db;
}
</style>
