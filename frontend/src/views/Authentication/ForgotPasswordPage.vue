<template>
  <div class="reset-password-container">
    <div class="form-container">
      <h1>Reset Password</h1>
      <p class="instructions">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          placeholder="Your email address"
          class="email-input"
        />
      </div>
      
      <button
        class="reset-button"
        @click="sendResetLink"
        :disabled="!isValidEmail"
      >
        Send reset link
      </button>
      
      <div class="back-link">
        <a href="/login">Back to Sign In</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasswordReset',
  data() {
    return {
      email: '',
    }
  },
  computed: {
    isValidEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailPattern.test(this.email)
    }
  },
  methods: {
    sendResetLink() {
      if (this.isValidEmail) {
        // In a real application, this would send a request to your backend
        console.log('Sending reset link to:', this.email)
        alert(`A password reset link has been sent to ${this.email}`)
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'DM Sans', sans-serif;
}

.reset-password-container {
  width: 100%;
  min-height: 80vh; 
  background-color: white;
  display: flex; 
  justify-content: center; 
  align-items: center; 
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eaeaea;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-icon {
  background-color: #000;
  color: white;
  font-weight: bold;
  padding: 4px 10px;
  font-size: 20px;
  margin-right: 10px;
}

.logo-text {
  color: #4a5568;
  font-size: 18px;
}

.try-button {
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.try-button:hover {
  background-color: #333333;
}

.form-container {
  max-width: 500px;
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Removed margin-top: 60px to allow for true centering */
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1a202c;
}

.instructions {
  color: #4a5568;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.5;
  max-width: 400px;
}

.form-group {
  text-align: left;
  margin-bottom: 24px;
  width: 320px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 16px;
  color: #1a202c;
}

.email-input {
  width: 320px;
  height: 32px;
  padding: 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  line-height: 1;
}

.email-input:focus {
  outline: none;
  border-color: #000000;
}

.reset-button {
  width: 320px;
  height: 50px;
  background-color: #1a202c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-button:hover {
  background-color: #2d3748;
}

.reset-button:disabled {
  background-color: #1a202c;
  cursor: not-allowed;
}

.back-link a {
  color: #000000;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.2s;
}

.back-link a:hover {
  color: #333333;
  text-decoration: underline;
}
</style>