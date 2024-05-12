// src/main.js
import { createApp } from 'vue'; // Importing createApp directly from 'vue'
import App from './App.vue'; // Adjust the path to your main App component
import router from './router'; // Adjust the path to your router file

// Create the application and mount it with the router
createApp(App)
  .use(router)
  .mount('#app');
