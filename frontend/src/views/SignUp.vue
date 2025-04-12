<template>
  <div class="signup-container">
    <!-- Header -->
    <div class="header">
      <h1>Sign Up</h1>
    </div>

    <div class="auth-options">
      <button class="social-btn" @click="signInWithX">
        <span class="btn-content">
          <img src="@/assets/facebookLogo.png" class="google-logo" alt="Google Logo">
          Sign up with Facebook
        </span>
      </button>

      <button class="social-btn" @click="signInWithGoogle">
        <span class="btn-content">
          <img src="@/assets/google.png" class="google-logo" alt="Google Logo">
          Sign up with Google
        </span>
      </button>

      <button class="social-btn" @click="signInWithApple">
        <span class="btn-content">
          <img src="@/assets/google.png" class="google-logo" alt="Google Logo">
          Sign up with Apple
        </span>
      </button>
    </div>
    
    <!-- Divider -->
    <div class="or-separator">
      <hr class="line"/>
      <span>or</span>
      <hr class="line"/>
    </div>


    <!-- Form -->
    <form class="signup-form" @submit.prevent="register">
      <!-- Full Name Fields -->
      <div class="name-fields">
        <div v-for="field in infoFields" :key="field.name" class="form-group">
          <label :for="field.name">{{ field.label }}</label>
          <input 
            :id="field.name"
            :type="field.type" 
            v-model="formData[field.name]" 
            :placeholder="field.placeholder" 
            :class="{'error-border': errors[field.name]}" 
            @blur="validateField(field.name)"
            @focus="showPasswordRequirement = false"
            :required="field.required" />
        </div>
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email"
          type="email" 
          v-model="formData.email" 
          placeholder="Email Address" 
          :class="{'error-border': errors.email}" 
          @blur="validateField('email')"
          required />
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password">Password</label>
        <div class="password-input-wrapper">
          <input 
            id="password"
            :type="togglePassword ? 'text' : 'password'" 
            v-model="formData.password" 
            placeholder="Password" 
            :class="{'error-border': errors.password}" 
            @blur="validateField('password')"
            @focus="showPasswordRequirement = true"
            required />
          <!-- if password valid, checkmark animation will appear -->
          <svg v-if="validPassword" class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
          <!-- password toggle visibility -->
          <button
            type="button"
            class="toggle-password"
            @click="togglePassword = !togglePassword"
          >
            <i :class="togglePassword ? 'eye-off' : 'eye-on'"></i>
          </button>
        </div>
      </div>

      <!-- Password requirements -->
      <div v-if="showPasswordRequirement && !validPassword" class="password-requirement-container">
        <p><b>Password must contain the following:</b></p>
        <ul>
          <li :class="{'valid': formData.password.length >= minLength}">
            <span>{{formData.password.length >= minLength? "✓" : "✗"}}</span>
            Minimum 8 characters
          </li>
          <li :class="{'valid': hasUppercaseLetter}">
            <span>{{hasUppercaseLetter? "✓" : "✗"}}</span>
            A capital (uppercase) letter
          </li>
          <li :class="{'valid': hasNumber}">
            <span>{{hasNumber? "✓" : "✗"}}</span>
            A number
          </li>
          <li :class="{'valid': hasSpecialCharacter}">
            <span>{{hasSpecialCharacter? "✓" : "✗"}}</span>
            A special character (!@#$%&*)
          </li>
        </ul>
      </div>

      <!-- Confirm Password Field -->
      <div class="form-group">
        <label for="confirm-password">Confirm password</label>
        <div class="password-input-wrapper">
          <input 
            id="confirm-password" 
            type="password" 
            v-model="formData.confirmPassword" 
            placeholder="Confirm password" 
            :class="{'error-border': errors.confirmPassword}" 
            @blur="validateField('confirmPassword')"
            required />
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="submit-btn">Create account</button>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </form>

    <!-- Sign In Link -->
    <div class="signin-link">
      <span>Already have an account?</span>
      <router-link to="/login">Sign in</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import validator from 'validator';

export default {
  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errorMessage: '',
      errors: {
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false
      },
      loginFields: [
        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Email Address', required: true },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Password', required: true },
      ],
      infoFields: [
        { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'First Name', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last Name', required: true },
      ],
      showPasswordRequirement: false,
      minLength: 8,
      togglePassword: false
    };
  },
  computed: {
    hasUppercaseLetter() {
      return /[A-Z]/.test(this.formData.password);
    },
    hasNumber() {
      return /[0-9]/.test(this.formData.password);
    },
    hasSpecialCharacter() {
      return /[!@#$%&*]/.test(this.formData.password);
    },
    validPassword() {
      return this.formData.password.length >= this.minLength && 
      this.hasUppercaseLetter && 
      this.hasNumber && 
      this.hasSpecialCharacter;
    }
  },
  methods: {
    validateField(field) {
      if(field === 'email'){
        this.errors.email = !validator.isEmail(this.formData[field]);
      } else if(field === 'password'){
        this.errors.password =  this.formData[field].length < this.minLength || !this.hasUppercaseLetter || !this.hasNumber || !this.hasSpecialCharacter;
      } else if(field ==='confirmPassword'){
        this.errors.confirmPassword = this.formData.password !== this.formData.confirmPassword;
      } else {
        this.errors[field] = !this.formData[field];
      }
    },
    async register() {
      this.infoFields.forEach(field => this.validateField(field.name));
      this.loginFields.forEach(field => this.validateField(field.name));
      this.validateField('confirmPassword');
      if(this.errors.confirmPassword){
        this.errorMessage = 'Passwords do not match!';
        return;
      }
      //check all value in errors object, if all false, then no error
      if (!Object.values(this.errors).some(error => error)) {
        try {
          const api = `${process.env.VUE_APP_DEPLOY_URL}/users`
          await axios.post(api, {
            accountData: {
              username: this.formData.email,
              password: this.formData.password
            },
            identityData: {
              firstName: this.formData.firstName,
              lastName: this.formData.lastName,
              displayName: `${this.formData.firstName} ${this.formData.lastName}`,
            }
          });

          // Automatically log in the user after successful registration
          try {
            const loginApi = `${process.env.VUE_APP_DEPLOY_URL}/auth/login`;
            await axios.post(loginApi, {
              username: this.formData.email,
              password: this.formData.password
            }, { withCredentials: true });
            
            // Set user as authenticated in Vuex store
            await this.$store.dispatch('users/login', {
              username: this.formData.email,
              password: this.formData.password
            });
            
            // Redirect to home page with tutorial flag
            this.$router.push('/?showTutorial=true');
          } catch (loginErr) {
            console.error("Auto-login failed after registration:", loginErr);
            // Fall back to manual login if auto-login fails
            this.$router.push('/login');
          }
        } catch (err) {
          console.log(err);
          this.errorMessage = "Email has already been registered!"
        }
      } else {
        this.errorMessage = "Please fill in all required fields."
      }
    }
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

/* Main container */
.signup-container {
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
  margin-bottom: 0rem;
}

.header h1 {
  font-size: 2.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #111827;
}

/* Form */
.signup-form {
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
  color: #374151;
  margin-bottom: 0.25rem;
}

.name-fields {
  display: flex;
  gap: 0.5rem;
}

.name-fields .form-group {
  flex: 1;
}

input {
  width: 100%;
  height: 36px;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #111827;
  font-family: 'DM Sans', sans-serif;
  font-size: 9pt;
  box-sizing: border-box;
}

input:focus {
  outline: 2px solid #3b82f6;
  border-color: #3b82f6;
}

.password-input-wrapper {
  position: relative;
  width: 100%;
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

/* Password requirements */
.password-requirement-container {
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.password-requirement-container p {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.password-requirement-container ul {
  margin: 0;
  padding: 0;
}

.password-requirement-container li {
  list-style: none;
  color: #ef4444;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.password-requirement-container li span {
  margin-right: 0.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
}

.password-requirement-container .valid {
  color: #10b981;
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
  font-family: 'DM Sans', sans-serif;
  font-size: 9pt;
}

.social-btn:hover {
  background-color: #f9fafb;
}

.btn-content {
  display: flex;
  align-items: center;
  font-size: .875rem;
  color: #374151;
  font-weight: 500; /* Matching the form labels weight */
}

/* Icons */
.facebook-icon, .google-icon, .apple-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.facebook-icon {
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


/* Submit button */
.submit-btn {
  width: 100%;
  height: 44px;
  margin: 0.75rem auto 0;
  background-color: #111827;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'DM Sans', sans-serif;
  font-size: 10pt;
}

.submit-btn:hover {
  background-color: #1f2937;
}

/* Error message */
.error-message {
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

/* Sign in link */
.signin-link {
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
}

.signin-link a {
  color: #2563eb;
  text-decoration: none;
}

.signin-link a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* Error styles */
.error-border {
  border-color: #ef4444;
  outline: 1px solid #ef4444;
}

/* Checkmark animation */
.checkmark {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #10b981;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #fff;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #10b981;
  fill: none;
  animation: stroke .6s cubic-bezier(0.650, 0.000, 0.450, 1.000) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke .3s cubic-bezier(0.650, 0.000, 0.450, 1.000) .8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: translateY(-50%);
  }
  50% {
    transform: translateY(-50%) scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #fff;
  }
}
</style>