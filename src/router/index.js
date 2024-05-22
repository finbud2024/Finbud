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
import StockSimulator from '@/views/StockSimulator.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/contact',
    name: 'ContactUs',
    component: ContactUs,
  },
  {
    path: '/chatview',
    name: 'ChatView',
    components: {
      default: ChatView,
      sidebar: SideBar,
    },
  },
  {
    path: '/tech',
    name: 'TechnologyPage',
    component: TechnologyPage,
  },
  {
    path: '/pricing',
    name: 'PricingPage',
    component: PricingPage,
  },
  {
    path: '/about',
    name: 'AboutUsPage',
    component: AboutUsPage,
  },
  {
    path: '/quizz',
    name: 'QuizzPage',
    component: QuizzPage,
  },
  {
    path: '/stock-simulator',
    name: 'StockSimulator',
    component: StockSimulator,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
