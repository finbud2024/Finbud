// src/main.js
import { createApp } from "vue"; // Importing createApp directly from 'vue'
import App from "./App.vue"; // Adjust the path to your main App component
import router from "./router"; // Adjust the path to your router file
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import CanvasJSStockChart from "@canvasjs/vue-stockcharts";

// Create the application and mount it with the router
let app = createApp(App);
app.use(router);
app.use(CanvasJSStockChart); // install the CanvasJS Vuejs StockChart Plugin
app.mount("#app");
