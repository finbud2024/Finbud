// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignUp from '@/views/SignUp.vue';
import Home from '@/views/Home.vue';
import ContactUs from '@/views/ContactUs.vue'; 
import ChatView from '@/views/ChatView.vue'; 
import SideBar from '@/components/SideBar.vue';
import TechnologyPage from '@/views/TechnologyPage.vue'; 
import PricingPage from '@/views/PricingPage.vue'; 
import AboutUsPage from '@/views/AboutUsPage.vue';
import QuizzPage from '@/views/QuizzPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  // Add other routes as needed
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/',
    name: 'Home',
    component: Home, // Set the component for the homepage
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactUs // Setup the route for the contact page
  },
  {
  path: '/chatview',
  name: 'chatview',
  components: {
    default: ChatView,
    sidebar: SideBar
  }
  },
  {
    path: '/tech',
    name: 'TechnologyPage',
    component: TechnologyPage  // Setup the route for the contact page
  },
  {
    path: '/pricing',
    name: 'PricingPage',
    component: PricingPage  // Setup the route for the contact page
  },
  {
    path: '/about',
    name: 'AboutUsPage',
    component: AboutUsPage  // Setup the route for the contact page
  },
  {
    path: '/quizz',
    name: 'QuizzPage',
    component: QuizzPage  // Setup the route for the contact page
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
