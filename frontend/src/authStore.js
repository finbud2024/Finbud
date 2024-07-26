import { reactive } from 'vue';

const authStore = reactive({
  userProfileChange: false,
  isAuthenticated: !!localStorage.getItem('token'),

  login(token) {
    localStorage.setItem('token', token);
    this.isAuthenticated = true;  
  },

  logout() {
    localStorage.clear();
    this.isAuthenticated = false;
  },
});

export default authStore;

