// src/main.js
import { createApp } from 'vue'; // Importing createApp directly from 'vue'
import App from './App.vue'; // Adjust the path to your main App component
import router from './router'; // Adjust the path to your router file
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as faSolid from '@fortawesome/free-solid-svg-icons'
import * as faRegular from '@fortawesome/free-regular-svg-icons'
import * as faBrand from '@fortawesome/free-brands-svg-icons' 

// Extract the icons from the imported objects
const solidIcons = Object.values(faSolid).filter(icon => icon.prefix && icon.iconName);
const regularIcons = Object.values(faRegular).filter(icon => icon.prefix && icon.iconName);
const brandIcons = Object.values(faBrand).filter(icon => icon.prefix && icon.iconName);

library.add(solidIcons, regularIcons, brandIcons);

// Create the application and mount it with the router
createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
