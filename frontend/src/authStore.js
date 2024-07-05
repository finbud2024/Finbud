import { reactive } from 'vue';

const authStore = reactive({
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

