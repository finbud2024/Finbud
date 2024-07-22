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
                  :required="field.required" />
        </div>
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
      ]
    };
  },
  methods: {
    validateField(field) {
      if (!this.formData[field]) {
        this.errors[field] = true;
      } else {
        this.errors[field] = false;
      }
    },
    async register() {
      this.infoFields.forEach(field => this.validateField(field.name));
      this.loginFields.forEach(field => this.validateField(field.name));
      this.validateField('confirmPassword');
      //check email format
      if (!validator.isEmail(this.formData.email)) {
        console.log(validator.isEmail(this.formData.email));
        this.errors.email = true;
        this.errorMessage = "Invalid email format!";
        return;
      }
      //check if password and confirm password match
      if (this.formData.password !== this.formData.confirmPassword) {
        this.errors.confirmPassword = true;
        this.errorMessage = "Passwords do not match!";
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
