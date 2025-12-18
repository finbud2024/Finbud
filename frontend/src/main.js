// src/main.js
import { createApp } from "vue"; // Importing createApp directly from 'vue'
import App from "./App.vue"; // Adjust the path to your main App component
import router from "./router"; // Adjust the path to your router file
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
// Import console filter for cleaner development experience
import { enableDevConsoleFilter } from "./utils/consoleFilter";
// Import only specific icons instead of entire packs
import {
  faCamera,
  faRightFromBracket,
  faEye,
  faEyeSlash,
  faPaperclip,
  faChevronUp,
  faChevronDown,
  faEllipsis,
  faBars,
  faPlay,
  faXmark,
  faPen,
  faTrashCan,
  faPlus,
  faMagnifyingGlass,
  faLocationDot,
  faMoon,
  faSun,
  faBell,
  faComments,
  faWallet,
  faChartBar,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar,
  faBell as faBellRegular,
} from "@fortawesome/free-regular-svg-icons";
import store from "./store"; // Import the vuex store
import VueGoogleMaps from "@fawmi/vue-google-maps";
import i18n from "./i18n";
import BootstrapVue3 from "bootstrap-vue-3";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { VueQueryPlugin } from "@tanstack/vue-query";
import VueApexCharts from "vue3-apexcharts";

// Create event bus for component communication using tiny-emitter
class EventBus {
  constructor() {
    this.events = {};
  }

  $on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  $off(event, callback) {
    if (this.events[event]) {
      if (callback) {
        this.events[event] = this.events[event].filter((cb) => cb !== callback);
      } else {
        this.events[event] = [];
      }
    }
  }

  $emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(...args));
    }
  }
}

// Add specific icons to the library
const icons = [
  faCamera,
  faRightFromBracket,
  faEye,
  faEyeSlash,
  faPaperclip,
  faChevronUp,
  faChevronDown,
  faEllipsis,
  faBars,
  faPlay,
  faXmark,
  faPen,
  faTrashCan,
  faPlus,
  faMagnifyingGlass,
  faLocationDot,
  faStar,
  faBellRegular,
  faMoon,
  faSun,
  faBell,
  faComments,
  faWallet,
  faChartBar,
  faUser,
];
library.add(...icons); // Use the spread operator to add the icons

// Create the application
const app = createApp(App);

// Add event bus to global properties
app.config.globalProperties.$eventBus = new EventBus();

app.use(VueGoogleMaps, {
  load: {
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
  },
});

// Register FontAwesomeIcon component
app.component("font-awesome-icon", FontAwesomeIcon);

// Enable console filtering for cleaner development experience
enableDevConsoleFilter();

// Use the router and vuex store
app.use(router);
app.use(store);
app.use(i18n);
app.use(BootstrapVue3);
app.use(VueQueryPlugin);
app.use(VueApexCharts);
// Mount the application to the DOM
app.mount("#app");
