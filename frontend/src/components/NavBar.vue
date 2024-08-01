<template>
  <nav class="nav-bar" id="app">
    <router-link to="/" class="navbar-brand">FinBud</router-link>
    <div class="nav-right">
      <ul class="nav-items">
        <li><router-link to="/" class="home">Home</router-link></li>
        <li><router-link to="/chat-view" class="chatview">Chat</router-link></li>
        <li class="dropdown" @mouseenter="toggleAboutDropdown(true)" @mouseleave="toggleAboutDropdown(false)">
          <div class="services-dropdown dropbtn">Overview <span class="arrow-down"></span></div>
          <div class="dropdown-content" v-if="isAboutDropdownOpen">
            <router-link to="/about" class="about" @click="toggleAboutDropdown(false)">About</router-link>
            <router-link to="/tech" class="technology"  @click="toggleAboutDropdown(false)">Technology</router-link>
          </div>
        </li>
        <li v-if="authStore.isAuthenticated" class="dropdown" @mouseenter="toggleDropdown(true)" @mouseleave="toggleDropdown(false)">
          <div class="services-dropdown dropbtn" >Services <span class="arrow-down"></span></div>
          <div class="dropdown-content" v-show="isDropdownOpen">
            <router-link to="/goal" class="goal" @click="toggleDropdown(false)">Goal</router-link>
            <router-link to="/quant-analysis" class="home"  @click="toggleDropdown(false)">Quant</router-link>
            <router-link to="/stock-simulator" class="simulator" @click="toggleDropdown(false)">Simulator</router-link>
            <router-link to="/quizz" class="quizz" @click="toggleDropdown(false)">Quiz</router-link>
            <router-link to="/risk" class="risk" @click="toggleDropdown(false)">Risk</router-link>
            <router-link to="/market" class="market" @click="toggleDropdown(false)">Market</router-link>
          </div>
        </li>
        <li v-if="!authStore.isAuthenticated"><router-link to="/login" class="login-button">Log In</router-link></li>
        <li v-if="authStore.isAuthenticated" class="dropdown" @mouseenter="toggleProfileDropdown(true)" @mouseleave="toggleProfileDropdown(false)">
          <img :src="profileImage" alt="User Image" class="user-image">
          <div class="dropdown-profile" v-show="isProfileDropdownOpen">
            <router-link to="/profile" class="profile" @click="toggleProfileDropdown(false)">
              <img :src="profileImage" alt="User Image" class="inside-dropdown-user-image">
              <p>{{name}}</p>
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
import defaultImage from '@/assets/anonymous.png';

export default {
  name: 'NavBar',
  data() {
    return {
      isDropdownOpen: false,
      isAboutDropdownOpen: false,
      isDropdownOpenMobile: false,
      isProfileDropdownOpen: false,
      image: '',
      name: 'User',
    };
  },
  computed: {
    authStore() {
      return authStore;
    },
    profileImage() {
      return this.image || defaultImage;
    },
  },
  watch: {
    'authStore.isAuthenticated': async function() {
      if(authStore.isAuthenticated){
        try {
          const profileData = JSON.parse(localStorage.getItem('user'));
          if(profileData.identityData){
            this.image = profileData.identityData.profilePicture;
            this.name = profileData.identityData.displayName;
          } else{
            this.image = '';
            this.name = 'User';
          }
        } catch (err) {
         console.log(err);
        }
      }
    },

    'authStore.userProfileChange': async function() {
      if(authStore.isAuthenticated){
        try {
          const profileData = JSON.parse(localStorage.getItem('user'));
          if(profileData.identityData){
            this.image = profileData.identityData.profilePicture;
            this.name = profileData.identityData.displayName;
          } else{
            this.image = '';
            this.name = 'User';
          }
        } catch (err) {
         console.log(err);
        }
      }
    }
  },
  methods: {
    toggleDropdown(open) {
      this.isDropdownOpen = open;
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
        //put user info into localStorage
        authStore.login(response.data.user._id);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (err) {
      console.log("After Sign in with google err: " + err);
    }

    authStore.userProfileChange = !authStore.userProfileChange;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.nav-bar {
  background-color: #FFFFFF;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
  font-family: 'Space Grotesk', sans-serif;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  position: fixed;
  z-index: 1000;
}

.navbar-brand {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
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
  color: black;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1rem;
}

.nav-items li a:hover {
  color: #007bff;
}

.nav-items li .chatview{
  border-radius: 10px;
  padding: 5px 10px;
  background-color: rgb(47, 163, 47);
  color: white;
}

.signup-button,
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
  font-size: 1rem;
  min-width: 100px;
}

.services-dropdown {
  cursor: pointer;
  position: relative;
}

.services-dropdown:hover {
  color: #007bff;
}
.services-dropdown .arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid black;
}

.signup-button:hover,
.logout-button:hover,
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
  height: 0;
  position: absolute;
  background-color: white;
  min-width: 100px;
  box-shadow: 0px 8px 16px 0px rgba(25, 53, 143, 0.2);
  z-index: 1;
  border-radius: 15px;
}

.dropdown-profile{
  position: absolute;
  background-color: white;
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(25, 53, 143, 0.2);
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
  background-color: white;
  color: black;
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
  background-color: #ddd;
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

.user-image:hover{
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

.dropdown-profile p{
  margin-left:50px;
  font-size: 1rem;
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
