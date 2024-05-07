<template>
  <nav class="nav-bar" id="app">
    <div class="navbar-brand">FinBud</div>
    <ul class="nav-items">
      <li><a href="#about">About</a></li>
      <li><a href="#technology">Technology</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#pricing">Pricing</a></li>
    </ul>
    <ul class="nav-actions">
      <!-- Sử dụng router-link để điều hướng đúng -->
      <li><router-link to="/login" class="login-button">Log In</router-link></li>
      <li><a href="#" class="sign-up-button">Sign Up</a></li>
    </ul>
  </nav>
</template>


<style scoped>
.nav-bar {
  background-color: #FFFFFF; /* Background màu trắng */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
}

.navbar-brand {
  font-size: 1.8rem;
  font-weight: bold;
  color: #007bff; /* Màu xanh nhãn hiệu */
  cursor: pointer;
}

.nav-items, .nav-actions {
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
}

.nav-items li a {
  color: black;
  text-decoration: none;
  padding: 0.5rem 1rem;
  transition: color 0.3s ease;
}

.nav-items li a:hover {
  color: #007bff; /* Màu khi hover */
}

.login-button, .sign-up-button {
  background-color: transparent;
  color: black;
  border: none;
  text-decoration: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.sign-up-button {
  background-color: #4CAF50; /* Nút màu xanh lá */
  color: white;
  border-radius: 5px;
}

.sign-up-button:hover {
  background-color: #45a049; /* Màu xanh lá đậm khi hover */
}
</style>


