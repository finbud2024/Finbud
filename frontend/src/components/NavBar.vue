<template>
  <nav class="nav-bar" id="app">
    <router-link to="/" class="navbar-brand">FinBud</router-link>
    <div class="nav-right">
      <ul class="nav-items">
        <li>
          <router-link to="/chat-view" class="chatview">Chat</router-link>
        </li>
        <li
          class="dropdown"
          @mouseenter="toggleAboutDropdown(true)"
          @mouseleave="toggleAboutDropdown(false)"
        >
          <div class="services-dropdown dropbtn">
            Overview <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-if="isAboutDropdownOpen">
            <router-link
              to="/about"
              class="about"
              @click="toggleAboutDropdown(false)"
              >About</router-link
            >
            <router-link
              to="/tech"
              class="technology"
              @click="toggleAboutDropdown(false)"
              >Technology</router-link
            >
          </div>
        </li>

        <li
          v-if="isAuthenticated"
          class="dropdown"
          @mouseenter="toggleDropdown(true)"
          @mouseleave="toggleDropdown(false)"
        >
          <div class="services-dropdown dropbtn">
            Fin Manage <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="isDropdownOpen">
            <router-link to="/goal" class="goal" @click="toggleDropdown(false)"
              >Goal</router-link
            >
            <router-link
              to="/riskanalysis"
              class="risk-analysis"
              @click="toggleDropdown(false)"
              >Risk Analysis</router-link
            >
            <router-link to="/mortgage-calc" class="mortgage-calc" @click="toggleDropdown(false)">Mortgage Calculator</router-link>
            
            <router-link
              to="/super-investors"
              class="super-investors"
              @click="toggleDropdownInvest(false)"
              >Super Investors</router-link
            >
          </div>
        </li>

        <li
          v-if="isAuthenticated"
          class="dropdown"
          @mouseenter="toggleDropdownInvest(true)"
          @mouseleave="toggleDropdownInvest(false)"
        >
          <div class="services-dropdown dropbtn">
            Fin Invest <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="isDropdownOpenInvest">
            <router-link
              to="/stock-simulator"
              class="simulator"
              @click="toggleDropdownInvest(false)"
              >Simulator</router-link
            >
            <router-link
              to="/quant-analysis"
              class="home"
              @click="toggleDropdownInvest(false)"
              >Quant</router-link
            >

            <router-link
              to="/quant-simulator"
              class="quant-simulator"
              @click="toggleDropdownInvest(false)"
              >Quant Simulator</router-link
            >
          </div>
        </li>

        <li
          v-if="isAuthenticated"
          class="dropdown"
          @mouseenter="toggleDropdownEdu(true)"
          @mouseleave="toggleDropdownEdu(false)"
        >
          <div class="services-dropdown dropbtn">
            Fin Edu <span class="arrow-down"></span>
          </div>
          <div class="dropdown-content" v-show="isDropdownOpenEdu">
            <router-link
              to="/quizz"
              class="quizz"
              @click="toggleDropdownEdu(false)"
              >Quiz</router-link
            >
            <router-link
              to="/event"
              class="event"
              @click="toggleDropdownEdu(false)"
              >Event</router-link
            >
            <router-link
              to="/forum"
              class="forum"
              @click="toggleDropdownEdu(false)"
              >Forum</router-link
            >
          </div>
        </li>

        <li
          v-if="isAuthenticated"
          class="dropdown"
          @mouseenter="toggleDropdownAgent(true)"
          @mouseleave="toggleDropdownAgent(false)"
        >
          <div class="services-dropdown dropbtn">
            Fin Agent <span class="arrow-down"></span>
          </div>
           <div class="dropdown-content" v-show="isDropdownOpenAgent">
            <router-link
              to="/agent"
              class="agent"
              @click="toggleDropdownEdu(false)"
              >Agent</router-link
            >
           </div>
        </li>

        <li v-if="!isAuthenticated && !isAuthLoading">
          <router-link to="/login" class="login-button">Log In</router-link>
        </li>

        <li v-if="isAuthenticated" class="fincoin-container">
          <FinCoinDisplay :balance="finCoinBalance" />
        </li>

        <li
          v-if="isAuthenticated"
          class="dropdown"
          @mouseenter="toggleProfileDropdown(true)"
          @mouseleave="toggleProfileDropdown(false)"
        >
          <img :src="profileImage" alt="User Image" class="user-image" />
          <div class="dropdown-profile" v-show="isProfileDropdownOpen">
            <router-link
              to="/profile"
              class="profile"
              @click="toggleProfileDropdown(false)"
            >
              <img
                :src="profileImage"
                alt="User Image"
                class="inside-dropdown-user-image"
              />
              <p>{{ profileName }}</p>
            </router-link>
            <router-link
              to="#"
              class="dark-mode-toggle"
              @click="toggleDarkMode"
            >
              <font-awesome-icon
                :icon="isDarkMode ? 'fa-moon' : 'fa-sun'"
                class="icon"
              />
              <p>{{ isDarkMode ? "Dark Mode" : "Light Mode" }}</p>
            </router-link>
            <router-link to="#" class="logout" @click="logout">
              <font-awesome-icon
                icon="fa-solid fa-right-from-bracket"
                class="icon"
              />
              <p>Log Out</p>
            </router-link>
          </div>
        </li>

        <li v-if="isAuthLoading" class="auth-loading">
          <div class="loading-indicator"></div>
        </li>
      </ul>

      <!-- Mobile version -->
      <div
        class="dropdown mobile-only"
        :class="{ active: isDropdownOpenMobile }"
      >
        <div class="button-mobile dropbtn" @click="toggleDropdownMobile">
          <div class="brand-mobile">FinBud</div>
          <font-awesome-icon icon="fa-solid fa-chevron-down" />
        </div>
        <div
          class="dropdown-content"
          v-show="isDropdownOpenMobile"
          @mouseleave="closeDropdownMobile"
        >
          <router-link
            to="/chat-view"
            class="chatview"
            @click="toggleDropdownMobile"
            >Chat</router-link
          >
          <router-link to="/about" class="about" @click="toggleDropdownMobile"
            >About</router-link
          >
          <router-link
            to="/tech"
            class="technology"
            @click="toggleDropdownMobile"
            >Technology</router-link
          >
          <div class="authenticated" v-if="isAuthenticated">
            <strong>Fin Manage</strong>
            <router-link to="/goal" class="goal" @click="toggleDropdownMobile"
              >Goal</router-link
            >
            <router-link
              to="/riskanalysis"
              class="risk-analysis"
              @click="toggleDropdownMobile"
              >Risk Analysis</router-link
            >

            <router-link
              to="/mortgage-calc"
              class="mortgage-calc"
              @click="toggleDropdownMobile"
              >Mortgage Calculator</router-link
            >

            <router-link
              to="/super-investors"
              class="super-investors"
              @click="toggleDropdownMobile"
              >Super Investors</router-link
            >

            <strong>Fin Invest</strong>
            <router-link
              to="/stock-simulator"
              class="simulator"
              @click="toggleDropdownMobile"
              >Simulator</router-link
            >
            <router-link
              to="/quant-analysis"
              class="home"
              @click="toggleDropdownMobile"
              >Quant</router-link
            >

            <router-link
              to="/quant-simulator"
              class="quant-simulator"
              @click="toggleDropdownMobile"
              >Quant Simulator</router-link
            >

            <strong>Fin Edu</strong>
            <router-link to="/quizz" class="quizz" @click="toggleDropdownMobile"
              >Quiz</router-link
            >
            <router-link to="/event" class="event" @click="toggleDropdownMobile"
              >Event</router-link
            >
            <router-link to="/forum" class="forum" @click="toggleDropdownMobile"
              >Forum</router-link
            >

            <router-link to="#" @click="logout" class="logout"
              >Log Out</router-link
            >
          </div>
          <router-link
            to="/login"
            v-if="!isAuthenticated && !isAuthLoading"
            class="login-button"
            @click="toggleDropdownMobile"
            >Log In</router-link
          >
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
import { to } from "mathjs";
export default {
  name: "NavBar",
  components: {
    FinCoinDisplay,
  },
  data() {
    return {
      isDropdownOpen: false,
      isDropdownOpenInvest: false,
      isDropdownOpenEdu: false,
      isDropdownOpenAgent: false,
      isAboutDropdownOpen: false,
      isDropdownOpenMobile: false,
      isProfileDropdownOpen: false,
      isDarkMode: false,
      isAuthLoading: false,
    };
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
      return this.$store.getters["users/userProfileImage"] || defaultImage;
    },
    profileName() {
      return this.$store.getters["users/userDisplayName"];
    },
    finCoinBalance() {
      return this.$store.getters["finCoin/finCoinBalance"];
    },
    watch: {
      // Fetch FinCoin balance when user logs in
      isAuthenticated(newVal) {
        if (newVal) {
          this.$store.dispatch("finCoin/fetchFinCoinBalance");
        }
      },
    },
  },
  methods: {
    toggleDropdown(open) {
      this.isDropdownOpen = open;
    },
    toggleDropdownInvest(open) {
      this.isDropdownOpenInvest = open;
    },
    toggleDropdownEdu(open) {
      this.isDropdownOpenEdu = open;
    },
    toggleDropdownAgent(open) {
      this.isDropdownOpenAgent = open;
    },
    toggleProfileDropdown(open) {
      this.isProfileDropdownOpen = open;
    },
    toggleAboutDropdown(open) {
      this.isAboutDropdownOpen = open;
    },
    toggleDropdownMobile() {
      this.isDropdownOpenMobile = !this.isDropdownOpenMobile;
    },
    closeDropdownMobile() {
      this.isDropdownOpenMobile = false;
    },
    async logout() {
      try {
        await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/auth/logout`, {
          withCredentials: true,
        });
      } catch (err) {
        console.log("After logout with err: " + err);
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
        const userId = this.userData._id;
        try {
          const response = await axios.put(
            `${process.env.VUE_APP_DEPLOY_URL}/users/${userId}/settings`,
            {
              settings: {
                darkMode: this.isDarkMode,
              },
            },
            { withCredentials: true }
          );
          console.log("Dark mode updated:", response.data);
        } catch (err) {
          console.error(
            "Error updating dark mode in database:",
            err.response ? err.response.data : err
          );
        }
      }
    },
  },
  async mounted() {
    await this.$store.dispatch("users/fetchCurrentUser");
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      this.isDarkMode = storedDarkMode === "true";
    } else if (this.userData && this.userData.settings) {
      this.isDarkMode = this.userData.settings.darkMode || false;
    } else {
      const prefersDarkMode =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.isDarkMode = prefersDarkMode;
    }

    // Fetch FinCoin balance if user is authenticated
    if (this.isAuthenticated) {
      await this.$store.dispatch("finCoin/fetchFinCoinBalance");
    }

    document.documentElement.classList.toggle("dark-mode", this.isDarkMode);
    document.body.classList.toggle("dark-mode", this.isDarkMode);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap");

.nav-bar {
  background-color: var(--bg-primary);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
  font-family: "Space Grotesk", sans-serif;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 1000;
}

.navbar-brand {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--logo-color);
  cursor: pointer;
  text-decoration: none;
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
  padding: 0.2rem;
  gap: 2rem;
}

.nav-items li a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: clamp(0.75rem, 5.6vw, 1.25rem);
}

.nav-items li .chatview {
  border-radius: 10px;
  padding: 5px 10px;
  background-color: #45a049;
  color: white;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-items li .login-button {
  background-color: #45a049;
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
  font-size: clamp(0.75rem, 5.6vw, 1.25rem);
  color: var(--text-primary);
}

.services-dropdown:hover {
  color: var(--accent-color);
}

.services-dropdown .arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid var(--text-primary);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  height: 0;
  position: absolute;
  background-color: var(--bg-primary);
  min-width: 100px;
  box-shadow: 0px 8px 16px 0px var(--shadow-color);
  z-index: 1;
  border-radius: 15px;
}

.dropdown-profile {
  position: absolute;
  background-color: var(--bg-primary);
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px var(--shadow-color);
  z-index: 1;
  transform: translate(-160px, 0px);
  border-radius: 15px;
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
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  border-bottom: 1px dotted rgb(226, 215, 215);
  height: 20px;
  border-left: 2px solid #007bff;
  border-right: 2px solid #007bff;
}

.dropdown-content a:nth-child(1),
.dropdown-profile a:nth-child(1) {
  border-top: 2px solid #007bff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.dropdown-content a:last-child,
.dropdown-profile a:last-child {
  border-bottom: 2px solid #007bff;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

.dropdown-content .authenticated a:last-child {
  border-bottom: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
}

.dropdown-content .authenticated a:nth-child(1) {
  border-top: none;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
}

.dropdown-content,
.dropdown-profile {
  animation-name: dropdown-animation;
  animation-duration: 0.3s;
  animation-timing-function: ease-in-out;
  animation-fill-mode: forwards;
}

@keyframes dropdown-animation {
  0% {
    opacity: 0;
    height: 0;
  }

  100% {
    opacity: 1;
    height: fit-content;
  }
}

.dropdown-content a:hover,
.dropdown-profile a:hover {
  background-color: var(--bg-secondary);
}

/* .dropdown:hover .dropdown-content {
  display: block;
  opacity: 1;
  transform: translate(-10px, 0px);
}

.dropdown:hover .dropdown-profile {
  display: block;
  opacity: 1;
  transform: translate(-160px, 0px);
} */

.user-image {
  position: relative;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
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

  .dropdown-content {
    top: 30px;
    width: fit-content;
    display: flex;
    flex-direction: column;
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
