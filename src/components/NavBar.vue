<template>
  <nav class="nav-bar" id="app">
    <div class="navbar-brand">FinBud</div>
    <div class="dropdown">
      <button class="dropbtn">Menu</button>
      <div class="dropdown-content">
        <li><router-link to="/" class="home">Home</router-link></li>
        <li><router-link to="/about" class="about">About</router-link></li>
        <li><router-link to="/tech" class="technology">Technology</router-link></li>
        <li><router-link to="/contact" class="contact">Contact</router-link></li>
        <li><router-link to="/pricing" class="pricing">Pricing</router-link></li>
        <li><router-link to="/chatview" class="chatview">ChatView</router-link></li>
        <li><router-link to="/quizz" class="chatview">Quizz</router-link></li>
      </div>
    </div>
    <ul class="nav-items">
      <li><router-link to="/" class="home">Home</router-link></li>
      <li><router-link to="/about" class="about">About</router-link></li>
      <li><router-link to="/tech" class="technology">Technology</router-link></li>
      <li><router-link to="/contact" class="contact">Contact</router-link></li>
      <li><router-link to="/pricing" class="pricing">Pricing</router-link></li>
      <li><router-link to="/chatview" class="chatview">ChatView</router-link></li>
      <li><router-link to="/quizz" class="chatview">Quizz</router-link></li>
    </ul>
    <ul class="nav-actions">
      <li><router-link to="/login" class="login-button">Log In</router-link></li>
      <li><router-link to="/signup" class="signup-button">Sign Up</router-link></li>
      
    </ul>
  </nav>
</template>


<script>
export default {
  name: 'NavBar',
}
</script>

<style scoped>
.nav-bar {
  background-color: #FFFFFF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff;
  cursor: pointer;
}

.nav-items{
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  gap:3rem;
}

.nav-actions {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  gap:1.2rem;
}

.nav-items li a, .nav-actions li .router-link {
  color: black;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 1.2rem;
}

.nav-items li a:hover, .nav-actions li .router-link:hover {
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
}

.dropdown {
  position: relative;
  display: none;
  align-content: left;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #ddd;}

.dropdown:hover .dropdown-content {display: block;}

.dropdown:hover .dropbtn {background-color: #3e8e41;}

@media (max-width: 1062px) {
  .nav-items {
    gap: 1rem; /* Hide regular navigation items on smaller screens */
  }

  .nav-bar {
    flex-direction: row;
    justify-content: space-between; /* Ensures spacing between elements */
  }
}

@media (max-width: 868px) {
  .nav-items {
    display: none; /* Hide regular navigation items on smaller screens */
  }

  .dropdown {
    display: inline-block;
  }

  .nav-bar {
    flex-direction: row;
    justify-content: space-between; /* Ensures spacing between elements */
  }
}

@media (max-width: 868px) {
  .nav-items {
    display: none; /* Hide regular navigation items on smaller screens */
  }

  .nav-actions {
    font-size: 0.7rem;
  }

  .login-button, .signup-button {
    padding: 0.5rem;
  }
  

  .dropdown {
    display: inline-block;
  }

  .dropbtn {
    font-size: 0.5rem;
    padding: 10px;
  }

  .nav-brand {
    font-size: 0.5rem;
  }

  .nav-bar {
    flex-direction: row;
    justify-content: space-between; /* Ensures spacing between elements */
  }
}
</style>

