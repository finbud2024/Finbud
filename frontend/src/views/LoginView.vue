<template>
  <div class="signin-container">
    <!-- Header -->
    <div class="header">
      <h1>Sign In</h1>
    </div>

    <!-- Social Auth Buttons -->
    <div class="auth-options">
      <button class="social-btn" @click="signInWithX">
        <span class="btn-content">
          <img src="@/assets/google.png" class="google-logo" alt="Google Logo">
          Sign in with Facebook
        </span>
      </button>

      <button class="social-btn" @click="signInWithGoogle">
        <span class="btn-content">
          <img src="@/assets/google.png" class="google-logo" alt="Google Logo">
          Sign in with Google
        </span>
      </button>

      <button class="social-btn" @click="signInWithApple">
        <span class="btn-content">
          <img src="@/assets/google.png" class="google-logo" alt="Google Logo">
          Sign in with Apple
        </span>
      </button>
    </div>
    
    <!-- Divider -->
    <div class="or-separator">
      <hr class="line"/>
      <span>or</span>
      <hr class="line"/>
    </div>

    <!-- Email/Password Form -->
    <form class="signin-form" @submit.prevent="onLogin">
      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email</label>
        <input class="form-input" type="text" id="username" v-model="username" placeholder="Username" required>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <div class="password-label">
          <label for="password">Password</label>
          <a href="/forgot-password" class="forgot-password">Forgot password?</a>
        </div>
        <div class="password-input-wrapper">
          <input 
          class="form-input"
          :type="togglePassword? 'text' : 'password'" 
          id="password" 
          v-model="password" 
          placeholder="Password" 
          required >
          <button
            type="button"
            class="toggle-password"
            @click="toggleShowPassword"
          >
            <i :class="showPassword ? 'eye-off' : 'eye-on'"></i>
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn" :disabled="isLoading">
        <span v-if="!isLoading">Sign in</span>
        <span v-else>Signing in...</span>
      </button>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>

    <!-- Sign Up Link -->
    <div class="signup-link">
      <span>Don't have an account?</span>
      <router-link to="/signup">Sign up</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      togglePassword: false
    };
  },
  methods: {
    async onLogin() {
      try {
        const api = `${process.env.VUE_APP_DEPLOY_URL}/auth/login`;
        const reqBody = {
          "username": this.username,
          "password": this.password
        };
        const response = await axios.post(api, reqBody, { withCredentials: true });
        
        // Store user data in Vuex store
        this.$store.dispatch("users/login", response.data.user);
        
        // Check if this is a new user from the server response
        const isNewUser = response.data.isNewUser;
        if (isNewUser) {
          this.$router.push('/?showTutorial=true');
        } else {
          this.$router.push('/'); // Redirect to the main page after login
        }
      } catch (err) {
        console.error('Login Error:', err.response ? err.response.data : err.message);
        document.getElementById('errorMessage').classList.remove('wrong-password');
      }
    },
    signInWithGoogle() {
      const api = `${process.env.VUE_APP_DEPLOY_URL}/auth/google`;
      window.location.href = api;
    },
    signInWithX() {
      const api = `${process.env.VUE_APP_DEPLOY_URL}/auth/google`;
      window.location.href = api;
    },
    signInWithFacebook() {
      const api = `${process.env.VUE_APP_DEPLOY_URL}/auth/google`;
      window.location.href = api;
    },
    toggleShowPassword() {
      this.togglePassword = !this.togglePassword;
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

/* Main container */
.signin-container {
  width: 100%;
  max-width: 448px;
  margin: 0 auto;
  padding: 1rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 9pt;
}

/* Header */
.header {
  display: flex;
  justify-content: center;
  margin-bottom: 10px; /* Set to exactly 30px as requested */
}

.header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #111827;
}

/* Social buttons */
.auth-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0 auto;
  width: 100%;
  max-width: 320px;
}

.social-btn {
  width: 100%;
  height: 44px;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'DM Sans', sans-serif;
  font-size: 9pt;
}

.social-btn:hover {
  background-color: #f9fafb;
}

.btn-content {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #374151;
  font-weight: 500; /* Matching the form labels weight */
}

/* Icons */
.x-icon, .google-icon, .apple-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.x-icon {
  background-image: url("data:image/svg+xml,...");
}

.google-icon {
  background-image: url("data:image/svg+xml,...");
}

.apple-icon {
  background-image: url("data:image/svg+xml,...");
}

/* Divider */
.or-separator {
  display: flex;
  align-items: center;
  margin: 10px auto;
  color: #6b7280;
  font-size: 14px;
  width: 100%;
  max-width: 320px;
}

.line {
  flex: 1;
  border: 0;
  border-top: 1px solid #e5e7eb;
}

.or-separator span {
  padding: 0 12px;
}

/* Form */
.signin-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 0.5rem; /* Reduced from 1rem to bring fields closer */
  width: 100%;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.password-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.forgot-password {
  font-size: 0.875rem;
  color: #3b82f6;
  text-decoration: none;
}

.forgot-password:hover {
  color: #2563eb;
  text-decoration: underline;
}

.form-input {
  width: 320px; /* Set width to 320px as requested */
  height: 32px; /* Set height to 32px as requested */
  padding: 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  font-family: 'DM Sans', sans-serif;
  font-size: 9pt;
  box-sizing: border-box;
}

.password-input-wrapper {
  position: relative;
  width: 320px; /* Match the input width */
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.toggle-password:hover {
  color: #374151;
}

.eye-on, .eye-off {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
}

/* Submit button */
.submit-btn {
  width: 300px; /* Changed from 320px to 300px as requested */
  height: 44px;
  margin: 0.5rem auto 0; /* Reduced top margin to bring button closer */
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'DM Sans', sans-serif;
  font-size: 9pt;
  box-sizing: border-box;
}

.submit-btn:hover {
  background-color: #1f2937;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Error message */
.error-message {
  margin-top: 0.5rem; /* Reduced spacing */
  width: 300px; /* Match submit button width */
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: 'DM Sans', sans-serif;
  box-sizing: border-box;
}

/* Sign up link */
.signup-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  width: 100%;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  font-family: 'DM Sans', sans-serif;
}

.signup-link a {
  color: #2563eb;
  text-decoration: none;
}

.signup-link a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>