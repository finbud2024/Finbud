// src/main.js
import { createApp } from "vue"; // Importing createApp directly from 'vue'
import App from "./App.vue"; // Adjust the path to your main App component
import router from "./router"; // Adjust the path to your router file
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import * as faSolid from "@fortawesome/free-solid-svg-icons";
import * as faRegular from "@fortawesome/free-regular-svg-icons";
import * as faBrand from "@fortawesome/free-brands-svg-icons";
import store from "./store"; // Import the vuex store

// Add specific icons to the library
const icons = [
  faSolid.faCamera,
  faSolid.faRightFromBracket,
  faSolid.faEye,
  faSolid.faEyeSlash,
  faSolid.faPaperclip,
  faSolid.faChevronUp,
  faSolid.faChevronDown,
  faSolid.faEllipsis,
  faSolid.faBars,
  faSolid.faPlay,
  faSolid.faXmark,
  faSolid.faPen,
  faSolid.faTrashCan,
  faSolid.faPlus,
  faSolid.faMagnifyingGlass,
  faSolid.faLocationDot,
  faRegular.faStar,
  faRegular.faBell,
  faSolid.faMoon,    
  faSolid.faSun
];
library.add(...icons); // Use the spread operator to add the icons

// Create the application
const app = createApp(App);

// Register FontAwesomeIcon component
app.component("font-awesome-icon", FontAwesomeIcon);

// Use the router and vuex store
app.use(router);
app.use(store);

// Mount the application to the DOM
app.mount("#app");
