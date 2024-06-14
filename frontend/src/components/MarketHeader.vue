<template>
  <header>
    <nav class="navbar">
      <div class="navbar-brand">
        <img src="@/assets/logo1.png" alt="MarketWatch" />
      </div>
      <ul class="navbar-nav">
        <li><router-link to="/tech" class="latest">Latest</router-link></li>
        <li><router-link to="/tech" class="market">Markets</router-link></li>
        <li><router-link to="/tech" class="investing">Investing</router-link></li>
        <li><router-link to="/tech" class="finance">Personal Finance</router-link></li>
        <li><router-link to="/tech" class="economy">Economy</router-link></li>
        <li><router-link to="/tech" class="retirement">Retirement</router-link></li>
        <li><router-link to="/tech" class="more">More</router-link></li>
      </ul>
      <div class="navbar-right">
        <button>50¢ PER WEEK</button>
        <div class="search-icon">
          <i class="fa fa-search"></i>
        </div>
        <div class="user-icon">
          <i class="fa fa-user"></i>
        </div>
      </div>
    </nav>
    <div class="sub-navbar">
      <ul>
        <li><router-link to="/">U.S. Market Data</router-link></li>
        <li><router-link to="/">Europe Market Data</router-link></li>
        <li><router-link to="/">Asia Market Data</router-link></li>
        <li><router-link to="/">Currencies</router-link></li>
        <li><router-link to="/">Cryptocurrency</router-link></li>
        <li><router-link to="/">Rates</router-link></li>
        <li><router-link to="/">Futures</router-link></li>
        <li><router-link to="/">Premium Investing Tools</router-link></li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

body {
  font-family: 'Segoe UI', Arial, sans-serif;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d2d2d;
  color: white;
  padding: 0.5rem 1rem;
}

.navbar-brand img {
  height: 40px;
}

.navbar-nav {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.navbar-nav li {
  margin: 0 1rem;
}

.navbar-nav a {
  color: white;
  text-decoration: none;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-right button {
  background-color: orange;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.navbar-right .fa {
  margin-right: 1rem;
}

.sub-navbar {
  background-color: #f3f3f3;
  padding: 0.5rem 1rem;
  text-align: center;
}

.sub-navbar ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: center;
  align-items: center;
}

.sub-navbar li {
  margin: 0 1rem;
}

.sub-navbar a {
  color: black;
  text-decoration: none;
  font-family: 'Segoe UI', Arial, sans-serif;
}
</style>
