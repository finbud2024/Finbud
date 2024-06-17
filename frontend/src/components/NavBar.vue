<template>
  <nav class="nav-bar" id="app">
    <router-link to="/" class="navbar-brand">FinBud</router-link>
    <div class="nav-right">
      <ul class="nav-items">
        <li><router-link to="/" class="home">Home</router-link></li>
        <li><router-link to="/chat-view" class="chatview">Chat</router-link></li>
        <li><router-link to="/about" class="about">About</router-link></li>
        <li><router-link to="/tech" class="technology">Technology</router-link></li>
        <li><router-link to="/market" class="market">Market</router-link></li>
      </ul>
      <ul class="nav-actions">
        <li v-if="authStore.isAuthenticated" class="dropdown">
          <button class="dropdown-button" >Services <span class="arrow-down"></span></button>
          <div class="dropdown-content" v-show="isDropdownOpen">
            <router-link to="/goal" class="goal" @click="closeDropdown">Goal</router-link>
            <router-link to="/stock-simulator" class="simulator" @click="closeDropdown">Simulator</router-link>
            <router-link to="/quizz" class="quizz" @click="closeDropdown">Quiz</router-link>
            <router-link to="/market" class="market" @click="closeDropdown">Market</router-link>
          </div>
        </li>
        <li v-if="!authStore.isAuthenticated"><router-link to="/login" class="login-button">Log In</router-link></li>
        <li v-if="!authStore.isAuthenticated"><router-link to="/signup" class="login-button">Sign Up</router-link></li>
        <li v-if="authStore.isAuthenticated"><button @click="logout" class="logout-button">Log Out</button></li>
      </ul>
      <div class="dropdown mobile-only">
        <button class="dropbtn" @click="toggleDropdownMobile">☰</button>
        <div class="dropdown-content" v-show="isDropdownOpenMobile">
          <router-link to="/" class="home" @click="closeDropdownMobile">Home</router-link>
          <router-link to="/goal" class="goal" @click="closeDropdownMobile">Goal</router-link>
          <router-link to="/stock-simulator" class="simulator" @click="closeDropdownMobile">Simulator</router-link>
          <router-link to="/quizz" class="quizz" @click="closeDropdownMobile">Quiz</router-link>
          <router-link to="/market" class="market" @click="closeDropdownMobile">Market</router-link>
          <router-link to="/chat-view" class="chatview" @click="closeDropdownMobile">Chat</router-link>
          <router-link to="/about" class="about" @click="closeDropdownMobile">About</router-link>
          <router-link to="/tech" class="technology" @click="closeDropdownMobile">Technology</router-link>
          <router-link v-if="!authStore.isAuthenticated" to="/login" class="login-button" @click="closeDropdownMobile">Log In</router-link>
          <button v-if="authStore.isAuthenticated" @click="logout" class="logout-button">Sign Out</button>
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
      isDropdownOpen: true,
      isDropdownOpenMobile: false,
    };
  },
  async mounted(){
    try{
      const api = process.env.NODE_ENV !== 'production'? "http://localhost:8888/.netlify/functions/server/users":"https://finbud-ai.netlify.app/.netlify/functions/server/users";
      const check = await axios.get(api);
      console.log(check);
    }catch(err){
      console.log(err);
      //alert(err);
    }

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
    toggleDropdownMobile() {
      this.isDropdownOpenMobile = !this.isDropdownOpenMobile;
    },
    closeDropdownMobile() {
      this.isDropdownOpenMobile = false;
    },
    logout() {
      authStore.logout();
      this.$router.push('/login');
    },
  },
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

.nav-actions {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}

.nav-items li a,
.nav-actions li a {
  color: black;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1.2rem;
}

.nav-items li a:hover,
.nav-actions li a:hover {
  color: #007bff;
}

.login-button,
.signup-button {
  background-color: #45a049;
  color: black;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin-left: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button{
  background-color: #45a049;
  color: black;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  text-decoration: none;
  padding: 0.5rem 1rem;
  margin-left: 1.2rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.signup-button:hover,
.logout-button:hover,
.dropdown-button:hover,
.login-button:hover {
  background-color: #3e8e41;
  color: #007bff;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background-color: #45a049;
  color: black;
  padding: 0.5rem 1rem;
  text-decoration: none;
  font-size: 1.2rem;
  border-radius: 8px;
  margin-left: 1.2rem;
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(25, 53, 143, 0.2);
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
  opacity: 1;
  transform: translateY(0);
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

@media (max-width: 868px) {

  .nav-items,
  .nav-actions {
    display: none;
  }

  .dropdown.mobile-only {
    display: inline-block;
  }

  .dropdown-content {
    position: fixed;
    top: 60px;
    /* Adjust according to the height of your nav-bar */
    left: 0;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }

  .nav-bar {
    flex-direction: row;
    justify-content: space-between;
  }

  .navbar-brand {
    margin-left: 50px;
    /* Adjust this value to move the text to the right */
  }
}
</style>
