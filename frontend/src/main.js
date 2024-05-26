// src/main.js
import { createApp } from 'vue'; // Importing createApp directly from 'vue'
import App from './App.vue'; // Adjust the path to your main App component
import router from './router'; // Adjust the path to your router file
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';


// Create the application and mount it with the router
createApp(App)
  .use(router)
  .mount('#app');
