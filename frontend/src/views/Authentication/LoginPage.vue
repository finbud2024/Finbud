<template>
  <div class="signin-container">
    <!-- Header -->
    <div class="header">
      <h1>Sign In</h1>
    </div>

    <!-- Social Auth Buttons -->
    <div class="auth-options">
      <button class="social-btn" @click="signInWithFacebook">
        <span class="btn-content">
          <img
            src="@/assets/facebookLogo.png"
            class="facebook-logo"
            alt="Google Logo"
          />
          Sign in with Facebook
        </span>
      </button>

      <button class="social-btn" @click="signInWithGoogle">
        <span class="btn-content">
          <img
            src="@/assets/googleLogo.png"
            class="google-logo"
            alt="Google Logo"
          />
          Sign in with Google
        </span>
      </button>

      <button class="social-btn" @click="signInWithApple">
        <span class="btn-content">
          <img
            src="@/assets/appleLogo.png"
            class="apple-logo"
            alt="Google Logo"
          />
          Sign in with Apple
        </span>
      </button>
    </div>

    <!-- Divider -->
    <div class="or-separator">
      <hr class="line" />
      <span>or</span>
      <hr class="line" />
    </div>

    <!-- Email/Password Form -->
    <form class="signin-form" @submit.prevent="onLogin">
      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email</label>
        <input
          class="form-input"
          type="text"
          id="username"
          v-model="username"
          placeholder="Email address"
          required
        />
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <div class="password-label">
          <label for="password">Password</label>
          <a href="/forgot-password" class="forgot-password"
            >Forgot password?</a
          >
        </div>
        <div class="password-input-wrapper">
          <input
            class="form-input"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            placeholder="Password"
            required
          />
          <button
            type="button"
            class="toggle-password"
            @click="toggleShowPassword"
            aria-label="Toggle password visibility"
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
import axios from "axios";
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      isLoading: false,
      errorMessage: "",
    };
  },
  methods: {
    async onLogin() {
      try {
        this.isLoading = true;
        this.errorMessage = "";

        const api = `${process.env.VUE_APP_DEPLOY_URL}/auth/login`;
        const reqBody = {
          username: this.username,
          password: this.password,
        };
        const response = await axios.post(api, reqBody, {
          withCredentials: true,
        });

        this.$store.dispatch("users/login", response.data.user);

        // Check for redirect parameter
        const redirectPath = this.$route.query.redirect;
        console.log("Login success - redirect path:", redirectPath);

        const isNewUser = response.data.isNewUser;

        // Add a small delay to ensure store is updated
        await this.$nextTick();

        if (redirectPath) {
          console.log("Redirecting to:", redirectPath);
          // If there's a redirect path, use it
          this.$router.push(redirectPath);
        } else if (isNewUser) {
          console.log("Redirecting new user to tutorial");
          this.$router.push("/?showTutorial=true");
        } else {
          console.log("Redirecting to home");
          this.$router.push("/");
        }
      } catch (err) {
        console.error(
          "Login Error:",
          err.response ? err.response.data : err.message
        );
        this.errorMessage =
          err.response?.data?.message || "Login failed. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    signInWithGoogle() {
      const redirectPath = this.$route.query.redirect;
      console.log("Google OAuth - redirect path from query:", redirectPath);
      let api = `${process.env.VUE_APP_DEPLOY_URL}/auth/google`;
      // Add redirect parameter if it exists
      if (redirectPath) {
        api += `?redirect=${encodeURIComponent(redirectPath)}`;
      }
      console.log("Google OAuth - final API URL:", api);
      window.location.href = api;
    },
    signInWithFacebook() {
      const redirectPath = this.$route.query.redirect;
      let api = `${process.env.VUE_APP_DEPLOY_URL}/auth/google`;

      // Add redirect parameter if it exists
      if (redirectPath) {
        api += `?redirect=${encodeURIComponent(redirectPath)}`;
      }

      window.location.href = api;
    },
    signInWithApple() {
      const redirectPath = this.$route.query.redirect;
      let api = `${process.env.VUE_APP_DEPLOY_URL}/auth/google`;

      // Add redirect parameter if it exists
      if (redirectPath) {
        api += `?redirect=${encodeURIComponent(redirectPath)}`;
      }

      window.location.href = api;
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap");

/* Added styles for vertical centering */
html,
body {
  height: 100%;
  margin: 0;
}

/* Parent container needs to be full height */
#app {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
}

.signin-container {
  width: 100%;
  max-width: 448px;
  margin: auto;
  padding: 1rem;
  font-family: "DM Sans", sans-serif;
  font-size: 9pt;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Make container take full viewport height */
}

.header {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #000000;
}

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
  font-family: "DM Sans", sans-serif;
  font-size: 9pt;
}

.social-btn:hover {
  background-color: #f9fafb;
}

.btn-content {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #000000;
  font-weight: 500;
}

.facebook-logo,
.apple-logo {
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
}

.google-logo {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
}

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

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 0.5rem;
  width: 100%;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #000000;
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
  color: #000000;
  text-decoration: none;
}

.forgot-password:hover {
  color: #000000;
  text-decoration: underline;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  height: 32px;
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #000000;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.toggle-password {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #374151;
}

/* Eye icons using SVG data URLs - matching signup page */
.eye-on,
.eye-off {
  width: 1.25rem;
  height: 1.25rem;
  display: inline-block;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.eye-on {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' /%3E%3C/svg%3E");
}

.eye-off {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21' /%3E%3C/svg%3E");
}

.submit-btn {
  width: 70%;
  height: 44px;
  margin: 0.5rem auto 0;
  background-color: #000000;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: "DM Sans", sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.submit-btn:hover {
  background-color: #1f2937;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-family: "DM Sans", sans-serif;
  box-sizing: border-box;
}

.signup-link {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #4b5563;
  width: 100%;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  font-family: "DM Sans", sans-serif;
}

.signup-link a {
  color: #000000;
  text-decoration: none;
}

.signup-link a:hover {
  color: #333333;
  text-decoration: underline;
}

@media (max-width: 767px) {
  .signin-container {
    max-width: 100%;
    padding: 1.5rem;
    min-height: 100vh;
  }

  .header h1 {
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
  }

  .auth-options,
  .signin-form,
  .or-separator {
    max-width: 100%;
    width: 100%;
  }

  .social-btn {
    height: 50px;
    font-size: 0.9rem;
  }

  .form-input {
    height: 46px;
    font-size: 1rem;
  }

  .submit-btn {
    width: 100%;
    height: 50px;
    font-size: 1rem;
  }

  .password-label {
    margin-bottom: 0.5rem;
  }

  .signup-link {
    max-width: 100%;
    padding: 0 1rem;
  }

  /* Adjust logo sizes for mobile */
  .facebook-logo,
  .apple-logo {
    width: 1.5rem;
    height: 1.5rem;
  }

  .google-logo {
    width: 1.25rem;
    height: 1.25rem;
  }
}

/* Dark mode styles */
.dark-mode .signin-container {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #f9fafb;
}

.dark-mode .header h1 {
  color: #f9fafb;
}

.dark-mode .header p {
  color: #d1d5db;
}

.dark-mode .social-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark-mode .social-btn:hover {
  background-color: #4b5563;
  border-color: #6b7280;
}

.dark-mode .form-group label {
  color: #f9fafb;
}

.dark-mode .forgot-password {
  color: #d1d5db;
}

.dark-mode .forgot-password:hover {
  color: #f9fafb;
}

.dark-mode .form-input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.dark-mode .form-input:focus {
  border-color: #6b7280;
  background-color: #4b5563;
}

.dark-mode .form-input::placeholder {
  color: #9ca3af;
}

.dark-mode .toggle-password {
  color: #9ca3af;
}

.dark-mode .toggle-password:hover {
  color: #d1d5db;
}

.dark-mode .submit-btn {
  background-color: #1f2937;
  color: #f9fafb;
}

.dark-mode .submit-btn:hover {
  background-color: #374151;
}

.dark-mode .error-message {
  background-color: #7f1d1d;
  color: #fca5a5;
}

.dark-mode .signup-link {
  color: #d1d5db;
}

.dark-mode .signup-link a {
  color: #f9fafb;
}

.dark-mode .signup-link a:hover {
  color: #d1d5db;
}

.dark-mode .or-separator::before,
.dark-mode .or-separator::after {
  background-color: #4b5563;
}

.dark-mode .or-separator span {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #d1d5db;
}
</style>
