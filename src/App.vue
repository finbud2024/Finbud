<template>
  <div class="nav-actions">
    <NavBar />
    <div class="content">
      <!-- Use router-link to navigate to the login page -->
      <MainContentVue />
      <ChatBox/>
    </div>
  </div>
  <!-- router-view will render the component associated with the current route -->
  <router-view />

</template>

<script>

import NavBar from './components/NavBar.vue';
import ChatBox from './components/ChatBox.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    ChatBox,
  }
};
</script>

<style scoped>
.nav-actions {
  display: flex;
  flex-direction: column;
}

.content {
  margin-top: 20px;
}

a {
  text-decoration: none;
  color: blue;
  padding: 10px;
  border: 1px solid blue;
  border-radius: 5px;
}

a:hover {
  background-color: #e7f3ff;
}
</style>
