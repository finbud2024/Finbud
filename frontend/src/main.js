// src/main.js
import { createApp } from 'vue'; // Importing createApp directly from 'vue'
import App from './App.vue'; // Adjust the path to your main App component
import router from './router'; // Adjust the path to your router file
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import * as faSolid from '@fortawesome/free-solid-svg-icons';
import * as faRegular from '@fortawesome/free-regular-svg-icons';
import * as faBrand from '@fortawesome/free-brands-svg-icons';

// Add specific icons to the library
const icons = [faSolid.faCamera, faSolid.faRightFromBracket];
library.add(...icons); // Use the spread operator to add the icons

// Create the application
const app = createApp(App);

// Configure custom elements
app.config.compilerOptions.isCustomElement = tag => ['Vue3Slider', 'MultiSelector'].includes(tag);

// Register FontAwesomeIcon component
app.component('font-awesome-icon', FontAwesomeIcon);

// Use the router
app.use(router);

// Mount the application to the DOM
app.mount('#app');
