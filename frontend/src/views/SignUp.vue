<template>
  <div class="form-container">
    <h1 class="brand-name">Sign Up</h1>
    <form @submit.prevent="register">
      <!-- divide information into row -->
      <div class="full-name">
        <div v-for="field in infoFields" :key="field.name" class="form-group">
          <label :for="field.name">{{ field.label }}</label>
          <input :id="field.name"
                  :type="field.type" 
                  v-model="formData[field.name]" 
                  :placeholder="field.placeholder" 
                  :class="{'error-border': errors[field.name]}" 
                  @blur="validateField(field.name)"
                  @focus="showPasswordRequirement = false"
                  :required="field.required" />
        </div>
      </div>
      <!-- username/email -->
      <div class="email">
        <div class="form-group">
          <label  for="email">Email Addresss</label>
          <input  id="email"
                  type="email" 
                  v-model="formData.email" 
                  placeholder="Email Address" 
                  :class="{'error-border': errors.email}" 
                  @blur="validateField('email')"
                  required=true />
        </div>
      </div>
      <!-- password -->
      <div class="password">
        <div class="form-group">
          <label  for="password">Password</label>
          <input  id="password"
                  :type="togglePassword? 'text' : 'password' " 
                  v-model="formData.password" 
                  placeholder="Password" 
                  :class="{'error-border': errors.password}" 
                  @blur="validateField('password')"
                  @focus="showPasswordRequirement = true"
                  required=true />
          <!-- if password valid, checkmark animation will appear -->
          <svg v-if="validPassword" class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
          <!-- password toggle invisibility -->
          <font-awesome-icon  class="invis-toggle-icon" 
                              :icon="togglePassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"
                              @click="togglePassword = !togglePassword" />
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
      <!-- confirm password -->
      <div class="form-group">
        <label for="confirm-password">Re-enter your password</label>
        <input id="confirm-password" 
               type="password" 
               v-model="formData.confirmPassword" 
               placeholder="Re-enter your password" 
               :class="{'error-border': errors.confirmPassword}" 
               @blur="validateField('confirmPassword')"
               required>
        <span v-if="!formData.password" class="error-text"></span>
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
        this.errorMessage = 'Password do not match!';
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
          this.$router.push('/login');
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
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.form-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  background: rgb(248, 249, 254);
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
}

.brand-name {
  margin-bottom: 40px;
  font-size: 40px;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

input {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-sizing: border-box;
}

.form-group input::placeholder {
  color: rgb(136, 152, 170);
}

.form-group input:focus {
  outline: 2px solid #007bff;
}

.full-name {
  display: flex;
  justify-content: space-between;
}

.full-name .form-group {
  flex: 1;
}

.full-name .form-group:not(:last-child) {
  margin-right: 20px;
}

.error-border {
  outline: 2px solid red;
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

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.password-requirement-container {
  /* display: none; */
  position: relative;
  text-align: left;
  font-size: 15px;
}

.password-requirement-container li {
  list-style: none;
  position: relative;
  left: -35px;
  color: red;
}

.password-requirement-container li span {
  margin-right: 20px;
}

.password-requirement-container .valid {
  color: green;
}

 /* .password{

  */

/* password invisibility toggle icon */
.password{
  position: relative;
}

.invis-toggle-icon {
  position: absolute;
  transform: translateY(-50%);
  top: 70%;
  right: 10px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  line-height: 1;
  color: black;
}

.invis-toggle-icon:hover {
  color: #007bff;
}

/* start of check mark animation svg
https://codepen.io/aurer/pen/jEGbA

*/
.checkmark {
  position: absolute;
  width: 30px;
  height: 30px;
  right: 40px;
  bottom: 10%;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: green;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #fff;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: green;
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
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #fff;
  }
}
/* end of check mark animation svg*/

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
