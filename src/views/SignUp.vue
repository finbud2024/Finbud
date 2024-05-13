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
      <!-- Removed the form-check div and checkbox -->
      <button type="submit" class="register-button">Register</button>
    </form>
    <p class="signin-text">
      Log in with an existing account
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    register() {
      // Add form submission logic here
      if (this.email && this.password) {
        alert('Registration successful!');
      } else {
        alert('Please fill in all required fields.');
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 2rem;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.brand-name {
  font-size: 2rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  width: 100%;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #d0d0d0;
  border-radius: 5px;
}

.error-text {
  color: red;
  font-size: 0.8rem;
}

.register-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
}

.register-button:hover {
  background-color: #0056b3;
}

.signin-text {
  margin-top: 1rem;
  color: #777777;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
