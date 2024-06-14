<template>
  <div class="login-container">
    <h1>Sign in to FinBud</h1>
    <button @click="signInWithGoogle" class="login-google">
      <img src="@/assets/google.png" class="google-logo" alt="Google Logo">
      Sign in with Google
    </button>
    <div class="or-separator">
      <hr class="line"/> or sign in with email <hr class="line"/>
    </div>
    <form @submit.prevent="onLogin">
      <div class="input-group">
        <label for="username">Username or Email:</label>
        <input type="text" id="username" v-model="username" required>
      </div>
      <div class="input-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required>
        <p id="errorMessage" class="wrong-password"> wrong username or password!</p>
      </div>
      <div class="forgot-password"><a href="#">Forgot?</a></div>
      <button type="submit" class="login-button">Sign In</button>
    </form>
    <p class="signup-link">Don't have an account? <router-link to="/signup">Sign up</router-link></p>
  </div>
</template>

<script>
import axios from 'axios';
import authStore from '@/authStore';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    async onLogin() {
      try {
        const username = this.username;
        const password = this.password;
        const response = await axios.get(`http://localhost:3000/users/?username=${username}&password=${password}`);
        
        console.log('Login successful!');
        console.log(response.data.token);
        authStore.login(response.data._id);
        this.$router.push('/'); // Redirect to the main page after login
      } catch (err) {
        console.error('Login Error:', err.response ? err.response.data : err.message);
        document.getElementById('errorMessage').classList.remove('wrong-password');
        //alert('Invalid username or password!');
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

/* Container for the login page */
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background: white;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
}

h1 {
  margin-bottom: 20px;
}

.login-google {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border: none;
  border-radius: 50px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.google-logo {
  height: 20px;
  margin-right: 10px;
}

.login-google:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.or-separator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  color: #888;
  font-size: 0.9em;
}

.line {
  flex: 1;
  border: 0;
  border-top: 1px solid #ddd;
  margin: 0 8px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-sizing: border-box;
}

.forgot-password {
  text-align: right;
  margin-bottom: 20px;
}

.forgot-password a {
  color: #007bff;
  text-decoration: none;
}

.forgot-password a:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 50px;
  background-color: #000;
  color: white;
  font-family: 'Space Grotesk', sans-serif;
}

.login-button:hover {
  cursor: pointer;
}

.signup-link {
  margin-top: 20px;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

#errorMessage{
  color: red;
}

.wrong-password {
  display: none;
}
</style>
