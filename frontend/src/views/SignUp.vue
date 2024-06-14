<template>
  <div class="form-container">
    <h1 class="brand-name">FinBud</h1>
    <h2>Register a new account</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="email">Email Address</label>
        <input id="email" type="email" v-model="email" placeholder="Email Address" required />
        <span v-if="!email" class="error-text">Email is required</span>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" placeholder="Password" required />
        <span v-if="!password" class="error-text">Password is required</span>
      </div>
      <div class="form-group">
        <label for="confirmPassword"> Re-enter your password</label>
        <input id="confirmPassword" type="password" v-model="confirmPassword" placeholder="re-enter your password"required>
        <span v-if="!password" class="error-text">Confirm Password is required</span>
      </div>
      <button type="submit" class="register-button">Register</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p class="signin-text">
      Already have an account? <router-link to="/login">Log in here</router-link>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    async register() {
      if (this.email && this.password && this.confirmPassword) {
        try {
          if(this.password !== this.confirmPassword){
            this.errorMessage = "Passwords do not match!";
            return;
          }
          const response = await axios.post('http://localhost:3000/users', {
            accountData: {
              username: this.email,
              password: this.password
            }, identityData: {
              
            }
          });

          //alert('Registration successful!');
          // Store token and redirect to login or dashboard
          localStorage.setItem('token', response.data.token);
          this.$router.push('/login');
        } catch (err) {
          console.log(err);
          this.errorMessage = "Email has already been registered!"
          //alert(`Registration failed: ${err}`);
        }
      } else {
        this.errorMessage = "Please fill in all required fields."
        //alert('Please fill in all required fields.');
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.form-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background: white;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
}

.brand-name {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-sizing: border-box;
}

.register-button:hover {
  cursor: pointer;
}

.register-button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 50px;
  background-color: #000;
  color: white;
  font-family: 'Space Grotesk', sans-serif;
}

.error-message{
  color: red;
  text-align: center;
  margin-top: 10px;
}

.signin-text {
  margin-top: 20px;
}

.signin-text a {
  color: #007bff;
  text-decoration: none;
}

.signin-text a:hover {
  text-decoration: underline;
}
</style>
