// src/main.js
import { createApp } from 'vue'; // Importing createApp directly from 'vue'
import App from './App.vue'; // Adjust the path to your main App component
import router from './router'; // Adjust the path to your router file
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import * as faSolid from '@fortawesome/free-solid-svg-icons'
import * as faRegular from '@fortawesome/free-regular-svg-icons'
import * as faBrand from '@fortawesome/free-brands-svg-icons' 

const icons = [ faSolid.faCamera, faSolid.faRightFromBracket ];
library.add(icons);

// Create the application and mount it with the router
createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .mount('#app');
