<template>
  <nav class="nav-bar" id="app">
    <router-link to="/" @click.native="handleLogoClick">
      <img src="@/assets/home-page/FinbudSmallLogo.png" class="navbar-brand" alt="FinBud Logo" />
    </router-link>
    <div class="nav-right">
      <ul class="nav-items">

        <li>
          <router-link to="/chat-view" class="chatview">{{
            $t("chat")
          }}</router-link>
        </li>
        <li class="dropdown" @mouseenter="toggleAboutDropdown(true)" @mouseleave="toggleAboutDropdown(false)">
          <div class="services-dropdown dropbtn">
            {{ $t("overview") }} <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-if="isAboutDropdownOpen">
            <router-link to="/about" class="about" @click="toggleAboutDropdown(false)">{{ $t("about") }}</router-link>
            <router-link to="/tech" class="technology" @click="toggleAboutDropdown(false)">{{ $t("technology")
            }}</router-link>
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" @mouseenter="toggleDropdown('General', true)"
          @mouseleave="toggleDropdown('General', false)">
          <div class="services-dropdown dropbtn">
            {{ $t("finManage") }} <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="isDropdownOpen">
            <router-link
              to="/goal" 
              class="goal"
              @click="toggleDropdown(false)"
              >{{ $t("goal") }}</router-link
            >
            <router-link
              to="/riskanalysis"
              class="risk-analysis"
              @click="toggleDropdown(false)"
              >{{ $t("riskAnalysis") }}</router-link
            >
            <router-link
              to="/investment-calculator"
              class="investment-calculator"
              @click="toggleAboutDropdown(false)"
              >{{ $t("investmentCalculator") }}</router-link
            >
            <router-link
              to="/mortgage-calc"
              class="mortgage-calc"
              @click="toggleDropdown(false)"
              >{{ $t("mortgageCalculator") }}</router-link
            >

            <router-link
              to="/super-investors"
              class="super-investors"
              @click="toggleDropdownInvest(false)"
              >{{ $t("superInvestors") }}</router-link
            >
            <router-link to="/goal" class="goal" @click="toggleDropdown(false)">{{ $t("goal") }}</router-link>
            <router-link to="/riskanalysis" class="risk-analysis" @click="toggleDropdown(false)">{{ $t("riskAnalysis")
            }}</router-link>
            <router-link to="/investment-calculator" class="investment-calculator"
              @click="toggleAboutDropdown(false)">{{ $t("investmentCalculator") }}</router-link>
            <router-link to="/mortgage-calc" class="mortgage-calc" @click="toggleDropdown(false)">{{
              $t("mortgageCalculator") }}</router-link>

            <router-link to="/super-investors" class="super-investors" @click="toggleDropdownInvest(false)">{{
              $t("superInvestors") }}</router-link>
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" @mouseenter="toggleDropdownInvest(true)"
          @mouseleave="toggleDropdownInvest(false)">
          <div class="services-dropdown dropbtn">
            {{ $t("finInvest") }} <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="isDropdownOpenInvest">
            <router-link to="/stock-simulator" class="simulator" @click="toggleDropdownInvest(false)">{{ $t("simulator")
            }}</router-link>
            <router-link to="/autotrade-ai" class="autotrade" @click="toggleDropdownInvest(false)">AutoTrade
              AI</router-link>
            <router-link to="/quant-analysis" class="home" @click="toggleDropdownInvest(false)">{{ $t("quant")
            }}</router-link>
            <router-link to="/quant-simulator" class="quant-simulator" @click="toggleDropdownInvest(false)">{{
              $t("quantSimulator") }}</router-link>
            <router-link to="/fund-letter" class="fund-letter" @click="toggleDropdownInvest(false)">Fund
              Letter</router-link>
            <router-link to="/docs" class="docs" @click="toggleDropdownData(false)">{{ $t("Fin Data") }}</router-link>
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" @mouseenter="toggleDropdownEdu(true)"
          @mouseleave="toggleDropdownEdu(false)">
          <div class="services-dropdown dropbtn">
            {{ $t("finEdu") }} <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="isDropdownOpenEdu">
            <router-link to="/quizz" class="quizz" @click="toggleDropdownEdu(false)">{{ $t("quiz") }}</router-link>
            <router-link to="/event" class="event" @click="toggleDropdownEdu(false)">{{ $t("event") }}</router-link>
            <router-link to="/forum" class="forum" @click="toggleDropdownEdu(false)">{{ $t("forum") }}</router-link>
            <router-link to="/course" class="course" @click="toggleDropdownEdu(false)" >{{ $t("course") }}</router-link
            >
          </div>
        </li>

        <li v-if="isAuthenticated" class="dropdown" @mouseenter="toggleDropdown('Agent', true)"
          @mouseleave="toggleDropdown('Agent', false)">
          <div class="services-dropdown dropbtn">
            {{ $t("finAgent") }} <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="isDropdownOpenAgent">
            <router-link to="/agent" class="agent" @click="toggleDropdownEdu(false)">{{ $t("agent") }}</router-link>
          </div>
        </li>
        <li v-if="isAuthenticated" class="dropdown" @mouseenter="toggleDropdownData(true)"
          @mouseleave="toggleDropdownData(false)">

        </li>

        <li v-if="!isAuthenticated && !isAuthLoading">
          <router-link to="/login" class="login-button">{{
            $t("login")
          }}</router-link>
        </li>


        <li v-if="isAuthenticated">
          <NavbarNoti />
        </li>

        <li v-if="isAuthenticated" class="dropdown profile-dropdown">
  <div
    class="profile-wrapper"
    @mouseenter="toggleProfileDropdown(true)"
    @mouseleave="toggleProfileDropdown(false)"
  >
    <img
      :src="profileImage"
      alt="User Image"
      class="user-image"
      @error="handleImageError"
      loading="eager"
    />
    <div class="dropdown-profile" v-show="isProfileDropdownOpen">
      <router-link to="/profile" class="profile" @click="toggleProfileDropdown(false)">
        <img
          :src="profileImage"
          alt="User Image"
          class="inside-dropdown-user-image"
          @error="handleImageError"
          loading="eager"
        />
        <p>{{ profileName }}</p>
      </router-link>

      <!-- Moved inside dropdown -->
      <div class="fincoin-container">
        <FinCoinDisplay :balance="finCoinBalance" />
      </div>
      <div class="language-switcher">
        <button @click="switchLanguage('en')">
          <img src="@/assets/us.png" alt="English" />
        </button>
        <button @click="switchLanguage('vi')">
          <img src="@/assets/vn.png" alt="Tiếng Việt" />
        </button>
      </div>
      <router-link to="#" class="dark-mode-toggle" @click="toggleDarkMode">
        <font-awesome-icon :icon="isDarkMode ? 'fa-moon' : 'fa-sun'" class="icon" />
        <p>{{ isDarkMode ? $t("darkMode") : $t("lightMode") }}</p>
      </router-link>
      <router-link to="#" class="logout" @click="logout">
        <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="icon" />
        <p>{{ $t("logout") }}</p>
      </router-link>
    </div>
  </div>
</li>

    <li v-if="isAuthLoading" class="auth-loading">
      <div class="loading-indicator"></div>
    </li>
    </ul>

    <!-- Mobile version -->
    <div class="dropdown mobile-only" :class="{ active: isDropdownOpenMobile }">
      <div class="button-mobile dropbtn" @click="toggleDropdownMobile">
        <div class="brand-mobile">FinBud</div>
        <font-awesome-icon icon="fa-solid fa-chevron-down" />
      </div>
      <div class="dropdown-content" v-show="isDropdownOpenMobile" @mouseleave="closeDropdownMobile">
        <router-link to="/chat-view" class="chatview" @click="toggleDropdownMobile">{{ $t("chat") }}</router-link>
        <router-link to="/about" class="about" @click="toggleDropdownMobile">{{ $t("about") }}</router-link>
        <router-link to="/tech" class="technology" @click="toggleDropdownMobile">{{ $t("technology") }}</router-link>
        <div class="authenticated" v-if="isAuthenticated">
          <strong>{{ $t("finManage") }}</strong>
          <router-link to="/goal" class="goal" @click="toggleDropdownMobile">{{ $t("goal") }}</router-link>
          <router-link to="/riskanalysis" class="risk-analysis" @click="toggleDropdownMobile">{{ $t("riskAnalysis")
          }}</router-link>
          <router-link to="/investment-calculator" class="investment-calculator" @click="toggleDropdownMobile">{{
            $t("investmentCalculator") }}</router-link>
          <router-link to="/mortgage-calc" class="mortgage-calc" @click="toggleDropdownMobile">{{
            $t("mortgageCalculator") }}</router-link>
          <router-link to="/super-investors" class="super-investors" @click="toggleDropdownMobile">{{
            $t("superInvestors") }}</router-link>

          <strong>{{ $t("finInvest") }}</strong>
          <router-link to="/stock-simulator" class="simulator" @click="toggleDropdownMobile">{{ $t("simulator")
          }}</router-link>
          <router-link to="/autotrade-ai" class="autotrade" @click="toggleDropdownMobile">AutoTrade AI</router-link>
          <router-link to="/quant-analysis" class="home" @click="toggleDropdownMobile">{{ $t("quant") }}</router-link>
          <router-link to="/quant-simulator" class="quant-simulator" @click="toggleDropdownMobile">{{
            $t("quantSimulator") }}</router-link>
          <router-link to="/docs" class="docs" @click="toggleDropdownMobile">
            {{ $t("Fin Data") }}
          </router-link>

          <strong>{{ $t("finEdu") }}</strong>
          <router-link to="/quizz" class="quizz" @click="toggleDropdownMobile">{{ $t("quiz") }}</router-link>
          <router-link to="/event" class="event" @click="toggleDropdownMobile">{{ $t("event") }}</router-link>
          <router-link to="/forum" class="forum" @click="toggleDropdownMobile">{{ $t("forum") }}</router-link>

          <router-link to="#" @click="logout" class="logout">{{
            $t("logout")
          }}</router-link>
        </div>
        <router-link to="/login" v-if="!isAuthenticated && !isAuthLoading" class="login-button"
          @click="toggleDropdownMobile">{{ $t("login") }}</router-link>
        <div v-if="isAuthLoading" class="auth-loading-mobile">
          <div class="loading-indicator"></div>
        </div>
      </div>
    </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";
import defaultImage from "@/assets/anonymous.png";
import FinCoinDisplay from "@/components/FinCoinDisplay.vue";
import NavbarNoti from "../Notification/NavbarNoti.vue";

export default {
  name: "NavBar",
  components: {
    FinCoinDisplay,
    NavbarNoti,
  },
  data() {
    return {
      dropdowns: {
        General: false,
        Invest: false,
        Edu: false,
        Agent: false,
        Data: false,
        About: false,
        Profile: false,
        Mobile: false,
      },
      isDarkMode: false,
    };
  },
  computed: {
    isDropdownOpen() {
      return this.dropdowns.General;
    },
    isDropdownOpenInvest() {
      return this.dropdowns.Invest;
    },
    isDropdownOpenEdu() {
      return this.dropdowns.Edu;
    },
    isDropdownOpenAgent() {
      return this.dropdowns.Agent;
    },
    isDropdownOpenMobile() {
      return this.dropdowns.Mobile;
    },
    isAboutDropdownOpen() {
      return this.dropdowns.About;
    },
    isProfileDropdownOpen() {
      return this.dropdowns.Profile;
    },
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
  },
  watch: {
    isAuthenticated(newVal) {
      if (newVal) {
        this.$store.dispatch("finCoin/fetchFinCoinBalance");
      }
    },
  },

  methods: {
    switchLanguage(lang) {
      this.$i18n.locale = lang;
      localStorage.setItem("language", lang);
    },
    toggleDropdown(type, open) {
      if (this.dropdowns.hasOwnProperty(type)) {
        this.dropdowns[type] = open;
      }

    },
    toggleAboutDropdown(open) {
      this.toggleDropdown("About", open);
    },

    toggleDropdownInvest(open) {
      this.toggleDropdown("Invest", open);
    },
    toggleDropdownData(open) {
      this.toggleDropdown("Data", open);
    },
    toggleProfileDropdown(open) {
      this.toggleDropdown("Profile", open);
    },

    toggleDropdownMobile() {
      this.dropdowns.Mobile = !this.dropdowns.Mobile;
    },

    toggleDropdownEdu(open) {
      this.toggleDropdown("Edu", open);
    },

    closeDropdownMobile() {
      this.dropdowns.Mobile = false;
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
    handleLogoClick(event) {
      event.preventDefault();
      this.$emit("logo-clicked");
    },
    handleImageError(event) {
      event.target.src = defaultImage;
    },
  },
  async mounted() {
    const savedLang = localStorage.getItem("language");
    if (savedLang) this.$i18n.locale = savedLang;

    if (!this.$store.getters["users/currentUser"]) {
      await this.$store.dispatch("users/fetchCurrentUser");
    }

    const storedDarkMode = localStorage.getItem("darkMode");
    this.isDarkMode = storedDarkMode === "true";
    document.documentElement.classList.toggle("dark-mode", this.isDarkMode);
    document.body.classList.toggle("dark-mode", this.isDarkMode);

    if (this.isAuthenticated) {
      await this.$store.dispatch("finCoin/fetchFinCoinBalance");
    }

    this.$router.afterEach(() => {
      this.closeDropdownMobile();
    });
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap");

.language-switcher {
  display: flex;
  margin-left: 2rem;
}

.language-switcher button {
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

.language-switcher button img {
  width: 40px;
  height: auto;
  transition: transform 0.2s ease;
}

.language-switcher button:hover img {
  transform: scale(1.1);
  /* Slightly enlarge the flag on hover */
}

.nav-bar {
  background: linear-gradient(to bottom,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0));
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
  font-family: "Space Grotesk", sans-serif;
  position: fixed;
  z-index: 1000;
}

:root.dark-mode .nav-bar {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0));
}

.navbar-brand {
  font-size: 4rem;
  font-weight: bold;
  color: var(--logo-color);
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  height: 100%;
  width: auto;
  object-fit: contain;
}

:root.dark-mode .navbar-brand {
  filter: invert(1);
  /* This will make the PNG icons white */
}

.nav-right {
  display: flex;
  align-items: center;
  margin-right: 3rem;
}

.nav-items {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-items li {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-items li a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: clamp(0.5rem, 5vw, 1rem);
  white-space: nowrap;
}

.nav-items li .chatview {
  border-radius: 10px;
  padding: 5px 10px;
  background-color: black;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-items li .login-button {
  background-color: black;
  color: white;
  border: none;
  border-radius: 10px;
  text-decoration: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
}

.nav-items li a:not(.login-button):not(.chatview):hover {
  color: var(--accent-color);
}

.login-button:hover,
.chatview:hover {
  transform: scale(1.05);
}

.services-dropdown {
  cursor: pointer;
  position: relative;
  font-size: clamp(0.6rem, 5.1vw, 1rem);
  color: var(--text-primary);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  text-align: center;
}

.services-dropdown:hover {
  color: var(--accent-color);
}

.services-dropdown .arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 5px;
  vertical-align: middle;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--text-primary);
}

.services-dropdown:hover .arrow-down {
  border-top-color: var(--accent-color);
}

.dropdown:hover .services-dropdown {
  color: var(--accent-color);
}

.dropdown {
  position: relative;
  display: inline-block;
}

/* Add pseudo-element to connect dropdown to trigger */
.dropdown::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 20px;
  /* Height of connection area */
  bottom: -20px;
  /* Position it below the dropdown trigger */
  left: 0;
  z-index: 1000;
  pointer-events: none;
  /* Makes it not interfere with clicks */
}

.dropdown-content {
  display: block;
  position: absolute;
  background-color: var(--bg-primary);
  border: 2px solid var(--text-primary);
  min-width: 180px;
  /* Increased from 160px to accommodate longer text */
  box-shadow: 0px 8px 16px 0px var(--shadow-color);
  z-index: 1001;
  /* Increased z-index to prevent overlap */
  border-radius: 15px;
  top: 40px;
  /* Position below the navbar item */
  left: 0;
  /* Align with left edge of the parent */
  margin-top: 0;
  /* Reduced from 10px to eliminate gap */
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
  transform-origin: top left;
  transform: translateY(10px);
  text-align: left;
  overflow: hidden;
}

.dropdown-profile {
  position: absolute;
  background-color: var(--bg-primary);
  border: 2px solid var(--text-primary);
  min-width: 220px;
  /* Increased width */
  box-shadow: 0px 8px 16px 0px var(--shadow-color);
  z-index: 1001;
  /* Increased z-index */
  right: 0;
  top: 45px;
  /* Position below user image */
  border-radius: 15px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
  transform: translateY(10px);
  left: auto;
  /* Ensure right alignment */
  transform-origin: top right;
  padding-top: 10px;
  /* Add padding to top of dropdown content */
  margin-top: 0;
  /* No gap between trigger and content */
  overflow: hidden;
  /* Ensure content stays within border radius */
}

.dropdown-content:before {
  content: "";
  position: absolute;
  top: 0px;
  /* Moved up to account for padding */
  left: 20px;
  /* Position arrow more to the left */
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid var(--bg-primary);
}

/* Add class for profile-dropdown that will work in all browsers */
.dropdown.profile-dropdown::after {
  width: 35px;
  height: 20px;
  bottom: -20px;
  right: 0;
  left: auto;
}

/* Show dropdown on hover */
.dropdown:hover .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown:hover .dropdown-profile {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Support for v-show="true" */
.dropdown-content[style*="display: block"],
.dropdown-profile[style*="display: block"] {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Support for v-if */
.dropdown-content:not([style*="display: none"]),
.dropdown-profile:not([style*="display: none"]) {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Mobile dropdown active state - keep for mobile toggle functionality */
.dropdown.active .dropdown-content {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-content a:first-child:hover,
.dropdown-profile a:first-child:hover {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.dropdown-content a:last-child:hover,
.dropdown-profile a:last-child:hover {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.dropdown-content a,
.dropdown-profile a {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: 6px 12px;
  /* giảm padding */
  font-size: 12px;
  /* chữ nhỏ hơn */
  margin: 1px 0;
  /* ít khoảng cách hơn */
  line-height: 1.2;
  /* dòng sát nhau hơn */
  text-decoration: none;
  display: flex;
  align-items: center;
  border-bottom: 1px dotted var(--border-color, rgba(226, 215, 215, 0.5));
  height: auto;
  /* Changed from fixed height */
  min-height: 24px;
  /* Minimum height */
  border-left: none;
  border-right: none;
  transition: background-color 0.2s ease;
  margin: 2px 0;
  /* Added margin between items */
}

.dropdown-content a:nth-child(1),
.dropdown-profile a:nth-child(1) {
  border-top: none;
  border-top-left-radius: 13px;
  border-top-right-radius: 13px;
  margin-top: 0;
  /* No margin for first item */
}

.dropdown-content a:last-child,
.dropdown-profile a:last-child {
  border-bottom: none;
  border-bottom-left-radius: 13px;
  border-bottom-right-radius: 13px;
  margin-bottom: 0;
  /* No margin for last item */
}

.dropdown-content .authenticated a:last-child {
  border-bottom: none;
}

.dropdown-content .authenticated a:nth-child(1) {
  border-top: none;
}

.dropdown-content .authenticated {
  width: 100%;
}

/* Remove animation that might cause issues */
.dropdown-content,
.dropdown-profile {
  transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
}

.dropdown-content a:hover,
.dropdown-profile a:hover {
  background-color: var(--bg-secondary);
}

.user-image {
  position: relative;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
  object-fit: cover;
  background-color: #f0f0f0;
  border: 1px solid var(--border-color, rgba(226, 215, 215, 0.5));
}

.user-image:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

.inside-dropdown-user-image,
.icon {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer;
  object-fit: cover;
  background-color: #f0f0f0;
}

.dropdown-profile p {
  margin-left: 50px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow-down {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 5px;
  vertical-align: middle;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
}

.mobile-only {
  display: none;
}

.dropdown.active .dropdown-content {
  display: block;
  opacity: 1;
  transform: translate(-15px, 0px);
}

@media (max-width: 768px) {

  /* Disable the hover connection for mobile */
  .dropdown::after {
    display: none;
  }

  .dropdown-content,
  .dropdown-profile {
    padding-top: 0;
  }

  .nav-bar {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 7%;
  }

  .mobile-only {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .button-mobile {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .navbar-brand {
    display: none;
  }

  .brand-mobile {
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-color);
    cursor: pointer;
    text-decoration: none;
  }

  .nav-items {
    display: none;
  }

  .mobile-only .dropdown-content {
    top: 40px;
    width: 200px;
    max-height: 80vh;
    /* Limit height on mobile */
    overflow-y: auto;
    /* Allow scrolling */
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    transform-origin: top center;
    background-color: var(--bg-primary);
    border: 2px solid var(--text-primary);
  }

  .mobile-only .dropdown-content a {
    padding: 14px 16px;
    /* Larger touch targets on mobile */
    border-left: none;
    border-right: none;
  }

  .dropdown.active .dropdown-content {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }

  /* Fix for authenticated section in mobile dropdown */
  .dropdown-content .authenticated strong {
    display: block;
    padding: 10px 16px;
    background-color: var(--bg-secondary);
    margin-top: 5px;
    font-weight: bold;
  }
}



.auth-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
}

.loading-indicator {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #45a049;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.auth-loading-mobile {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 5px 0;
}

/* Only keep one instance of the keyframes animation */
</style>
