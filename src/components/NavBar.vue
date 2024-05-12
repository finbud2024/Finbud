<template>
  <nav class="nav-bar" id="app">
    <div class="navbar-brand">FinBud</div>
    <ul class="nav-items">
      <li><router-link to="/" class="home">Home</router-link></li>
      <li><a href="#about">About</a></li>
      <li><router-link to="/tech" class="technology">Technology</router-link></li>
      <li><router-link to="/contact" class="contact">Contact</router-link></li>
      <li><router-link to="/pricing" class="pricing">Pricing</router-link></li>
      <li><router-link to="/chatview" class="chatview">ChatView</router-link></li>
    </ul>
    <ul class="nav-actions">
      <li><router-link to="/login" class="login-button">Log In</router-link></li>
      <li><router-link to="/signup" class="signup-button">Sign Up</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.nav-bar {
  background-color: #FFFFFF; /* White background */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff; /* Brand blue */
  cursor: pointer;
}

.nav-items, .nav-actions {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}

.nav-items li a, .nav-actions li .router-link {
  color: black;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.nav-items li a:hover, .nav-actions li .router-link:hover {
  color: #007bff; /* Blue on hover */
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
  background-color: #4CAF50; /* Green button */
  color: white;
  border-radius: 5px;
  padding: 0.8rem 1.2rem; /* Slightly larger padding for button appearance */
  box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Subtle shadow for depth */
}

.signup-button:hover {
  background-color: #45a049; /* Darker green on hover */
}
</style>
