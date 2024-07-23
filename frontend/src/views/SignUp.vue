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
      <!-- email and password -->
      <div v-for="field in loginFields" :key="field.name">
        <div class="form-group">
          <label :for="field.name">{{ field.label }}</label>
          <input :id="field.name"
                  :type="field.type" 
                  v-model="formData[field.name]" 
                  :placeholder="field.placeholder" 
                  :class="{'error-border': errors[field.name]}" 
                  @blur="validateField(field.name)"
                  @focus="showPasswordRequirement = (field.name === 'password')"
                  :required="field.required" />
        </div>
      </div>
      <!-- Password requirements -->
      <div v-if="showPasswordRequirement" class="password-requirement-container">
        <p><b>Password must contain the following:</b></p>
        <ul>
          <li :class="{'valid': formData.password.length >= minLength}">
            <span>{{formData.password.length >= minLength? "✓" : "✗"}}</span>
            Minimum 8 characters
          </li>
          <!-- <p :class="{'valid': hasUppercaseLetter}">A <b>lowercase</b> letter</p> -->
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
        this.errorMessage = 'Passowrd do not match!';
      } else {
        this.errors[field] = !this.formData[field];
      }
    },
    async register() {
      this.infoFields.forEach(field => this.validateField(field.name));
      this.loginFields.forEach(field => this.validateField(field.name));
      this.validateField('confirmPassword');
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
  }
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
