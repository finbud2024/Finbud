// src/main.js
import App from './App.vue';
import router from './router';
import { createApp } from 'vue'; // Importing createApp directly from 'vue'
import vuetify from './plugins/vuetify';
import './assets/global.css';
import i18n from './i18n';


createApp(App)
  .use(router)
  .use(vuetify)
  .use(i18n)
  .mount('#app');
