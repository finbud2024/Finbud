<template>
  <div id="app">
    <NavBar @login-clicked="toggleLogin"/>
    <div class="content">
      <SideBar :threads="threads" 
               @add-thread="handleAddThread"
               @edit-thread="handleEditThread"
               @save-thread-name="handleSaveThreadName"
               @cancel-edit="handleCancelEdit" />
      <LoginView v-if="showLogin" />
      <MainContent /> <!-- Add this line here -->
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'; 
import SideBar from './components/SideBar.vue';
import LoginView from './views/LoginView.vue'; // Ensure LoginView is correctly imported
import MainContent from './components/MainContent.vue'; // Import MainContent

export default {
  name: 'App',
  components: {
    NavBar,
    SideBar,
    LoginView,
    MainContent, // Register MainContent
  },
  data() {
    return {
      threads: [],
      showLogin: false,
    };
  },
  methods: {
    toggleLogin() {
      this.showLogin = !this.showLogin; // Toggle the display state of LoginView
    },
    handleAddThread(newThread) {
      this.threads.push(newThread);
    },
    handleEditThread(index) {
      this.$set(this.threads[index], 'editing', true);
    },
    handleSaveThreadName(data) {
      this.$set(this.threads[data.index], 'name', data.newName);
      this.$set(this.threads[data.index], 'editing', false);
    },
    handleCancelEdit(index) {
      this.$set(this.threads[index], 'editing', false);
    }
  }
}
</script>
