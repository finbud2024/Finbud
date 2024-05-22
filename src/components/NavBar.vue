<template>
  <nav class="nav-bar" id="app">
    <router-link to="/" class="navbar-brand">FinBud</router-link>
    <div class="nav-right">
      <ul class="nav-items">
        <li><router-link to="/" class="home">Home</router-link></li>
        <li><router-link to="/about" class="about">About</router-link></li>
        <li><router-link to="/tech" class="technology">Technology</router-link></li>
        <li><router-link to="/contact" class="contact">Contact</router-link></li>
        <li><router-link to="/pricing" class="pricing">Pricing</router-link></li>
        <li><router-link to="/chatview" class="chatview">ChatView</router-link></li>
        <li><router-link to="/quizz" class="quizz">Quizz</router-link></li>
      </ul>
      <ul class="nav-actions">
        <li><router-link to="/login" class="login-button">Log In</router-link></li>
        <li><router-link to="/signup" class="signup-button">Sign Up</router-link></li>
      </ul>
      <div class="dropdown">
        <button class="dropbtn" @click="toggleDropdown">☰</button>
        <div class="dropdown-content" v-if="isDropdownOpen">
          <router-link to="/" class="home" @click="closeDropdown">Home</router-link>
          <router-link to="/about" class="about" @click="closeDropdown">About</router-link>
          <router-link to="/tech" class="technology" @click="closeDropdown">Technology</router-link>
          <router-link to="/contact" class="contact" @click="closeDropdown">Contact</router-link>
          <router-link to="/pricing" class="pricing" @click="closeDropdown">Pricing</router-link>
          <router-link to="/chatview" class="chatview" @click="closeDropdown">ChatView</router-link>
          <router-link to="/quizz" class="quizz" @click="closeDropdown">Quizz</router-link>
          <router-link to="/login" class="login-button" @click="closeDropdown">Log In</router-link>
          <router-link to="/signup" class="signup-button" @click="closeDropdown">Sign Up</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isDropdownOpen: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
  },
};
</script>

<style scoped>
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
  gap: 3rem;
}

.nav-actions {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  gap: 1.2rem;
}

.nav-items li a, .nav-actions li a {
  color: black;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1.2rem;
}

.nav-items li a:hover, .nav-actions li a:hover {
  color: #007bff;
}

.login-button, .signup-button {
  background-color: transparent;
  color: black;
  border: none;
  text-decoration: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signup-button {
  background-color: #4CAF50;
  color: white;
  border-radius: 5px;
  padding: 0.8rem 1.2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.signup-button:hover {
  background-color: #45a049;
}

.dropbtn {
  background-color: #04AA6D;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown {
  display: none;
  position: relative;
}

.dropdown-content {
  display: none;
  position: fixed;
  top: 60px; /* Adjust according to the height of your nav-bar */
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1000;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.dropdown-content a:last-child {
  border-bottom: none;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: flex;
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}

@media (max-width: 868px) {
  .nav-items, .nav-actions {
    display: none;
  }

  .dropdown {
    display: inline-block;
  }

  .nav-bar {
    flex-direction: row;
    justify-content: space-between;
  }

  .dropdown-content {
    display: flex;
  }
}
</style>
