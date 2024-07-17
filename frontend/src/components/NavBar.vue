<template>
  <nav class="nav-bar" id="app">
    <router-link to="/" class="navbar-brand">FinBud</router-link>
    <div class="nav-right">
      <ul class="nav-items">
        <li><router-link to="/" class="home">Home</router-link></li>
        <li><router-link to="/chat-view" class="chatview">Chat</router-link></li>
        <li><router-link to="/about" class="about">About</router-link></li>
        <li><router-link to="/tech" class="technology">Technology</router-link></li>
        <li v-if="authStore.isAuthenticated" class="dropdown">
          <button class="services-button dropbtn" @click="toggleDropdown">Services <span class="arrow-down"></span></button>
          <div class="dropdown-content" v-show="isDropdownOpen" @mouseleave="closeDropdown">
            <router-link to="/goal" class="goal" @click="closeDropdown">Goal</router-link>
            <router-link to="/quant-analysis" class="home">Quant</router-link>
            <router-link to="/stock-simulator" class="simulator" @click="closeDropdown">Simulator</router-link>
            <router-link to="/quizz" class="quizz" @click="closeDropdown">Quiz</router-link>
            <router-link to="/risk" class="risk" @click="closeDropdown">Risk</router-link>
            <router-link to="/market" class="market" @click="closeDropdown">Market</router-link>
          </div>
        </li>
        <li v-if="!authStore.isAuthenticated"><router-link to="/login" class="login-button">Log In</router-link></li>
        <li v-if="authStore.isAuthenticated" class="dropdown">
          <img src="../assets/Dung.jpg" alt="User Image" class="user-image" @click="toggleProfileDropdown">
          <div class="dropdown-profile" v-show="isProfileDropdownOpen" @mouseleave="closeProfileDropdown">
            <router-link to="/profile" class="profile" @click="closeProfileDropdown">
              <img src="../assets/Dung.jpg" alt="User Image" class="inside-dropdown-user-image">
              <p>Dung Nguyen</p>
            </router-link>
            <router-link to="#" class="logout" @click="logout">
              <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="icon"/>
              <p>Log Out</p>
            </router-link>
          </div>
        </li>
      </ul>
      <div class="dropdown mobile-only" :class="{ active: isDropdownOpenMobile }">
        <button class="dropbtn" @click="toggleDropdownMobile">☰</button>
        <div class="dropdown-content" v-show="isDropdownOpenMobile" @mouseleave="closeDropdownMobile">
          <router-link to="/" class="home" @click="toggleDropdownMobile">Home</router-link>
          <router-link to="/goal" class="goal" @click="toggleDropdownMobile">Goal</router-link>
          <router-link to="/stock-simulator" class="simulator" @click="toggleDropdownMobile">Simulator</router-link>
          <router-link to="/quizz" class="quizz" @click="toggleDropdownMobile">Quiz</router-link>
          <router-link to="/market" class="market" @click="toggleDropdownMobile">Market</router-link>
          <router-link to="/chat-view" class="chatview" @click="toggleDropdownMobile">Chat</router-link>
          <router-link to="/risk" class="risk" @click="toggleDropdownMobile">Risk</router-link>
          <router-link to="/about" class="about" @click="toggleDropdownMobile">About</router-link>
          <router-link to="/tech" class="technology" @click="toggleDropdownMobile">Technology</router-link>
          <router-link to="/quant-analysis" class="home">Quant</router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/login" class="login-button" @click="toggleDropdownMobile">Log In</router-link>
          <button v-if="authStore.isAuthenticated" @click="logout" class="logout-button">Log Out</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import authStore from '@/authStore';
import axios from 'axios';

export default {
  name: 'NavBar',
  data() {
    return {
      isDropdownOpen: false,
      isDropdownOpenMobile: false,
      isProfileDropdownOpen: false,
    };
  },
  computed: {
    authStore() {
      return authStore;
    },
  },
  methods: {
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeProfileDropdown() {
      this.isProfileDropdownOpen = false;
    },
    toggleProfileDropdown() {
      this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    },
    toggleDropdownMobile() {
      this.isDropdownOpenMobile = !this.isDropdownOpenMobile;
    },
    closeDropdownMobile() {
      this.isDropdownOpenMobile = false;
    },
    async logout() {
      authStore.logout();
      try {
        await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/auth/logout`);
      } catch (err) {
        console.log("After logout with err: " + err);
      }
      this.$router.push('/login');
    },
  },
  async mounted() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_DEPLOY_URL}/auth/test`);
      if (response.data.isAuthenticated) {
        authStore.login(response.data.user._id);
      }
    } catch (err) {
      console.log("After Sign in with google err: " + err);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.nav-bar {
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  font-family: 'Space Grotesk', sans-serif;
}

.navbar-brand {
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
}

.nav-right {
  display: flex;
  align-items: center;
}

.nav-items {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  gap: 2rem;
}

.nav-items li a {
  color: black;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1.2rem;
}

.nav-items li a:hover {
  color: #007bff;
}

.signup-button,
.services-button,
.login-button,
.logout-button {
  background-color: #45a049;
  color: white;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  min-width: 100px;
}

.services-button {
  position: relative;
}

.services-button .arrow-down {
  margin-left: 0.5rem;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
}

.signup-button:hover,
.logout-button:hover,
.services-button:hover,
.login-button:hover {
  background-color: #3e8e41;
  color: #007bff;
  transform: scale(1.05);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(25, 53, 143, 0.2);
  z-index: 1;
  opacity: 0;
  transform: translate(-15px, 20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  border-radius: 15px;
}

.dropdown-profile{
  position: absolute;
  background-color: white;
  min-width: 300px;
  box-shadow: 0px 8px 16px 0px rgba(25, 53, 143, 0.2);
  z-index: 1;
  opacity: 0;
  transform: translate(-250px, 20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  border-radius: 15px;
  margin-right: 100px;
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
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  border-bottom: 1px dotted rgb(226, 215, 215);
  height: 40px;
}

.dropdown-content a:last-child,
.dropdown-profile a:last-child {
  border-bottom: none;
}

.dropdown-content a:hover,
.dropdown-profile a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
  opacity: 1;
  transform: translate(-15px, 0px);
}

.dropdown:hover .dropdown-profile {
  display: block;
  opacity: 1;
  transform: translate(-250px, 0px);
}

.user-image {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.user-image:hover{
  opacity: 0.8;
  transform: scale(1.05);
}

.inside-dropdown-user-image,
.icon {
  position: absolute;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
  cursor: pointer;
}

.dropdown-profile p{
  margin-left: calc(50% - 70px);
  font-size: 1.2rem;
  line-height: 3px;
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

@media (max-width: 868px) {
  .nav-items {
    display: none;
  }

  .dropdown.mobile-only {
    display: inline-block;
  }

  .dropdown-content {
    position: fixed;
    top: 60px;
    left: 5px;
    width: 100%;
    flex-direction: column;
  }

  .nav-bar {
    flex-direction: row;
    justify-content: space-between;
  }

  .navbar-brand {
    margin-left: 50px;
  }

  .login-button {
    width: 20%;
    padding: 0.5rem 1rem;
    font-size: 1.2rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 10px;
    margin-top: 20px;
    margin-left: 10px;
  }

  .logout-button {
    width: 30%;
    font-size: 1.2rem;
    border-radius: 8px;
    text-align: center;
    margin-bottom: 10px;
    margin-top: 20px;
    padding: 12px 16px;
    margin-left: 10px;
  }
}
</style>
