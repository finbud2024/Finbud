import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import SignUp from '@/views/SignUp.vue';
import Home from '@/views/Home.vue';
import ChatView from '@/views/ChatView.vue';
import SideBar from '@/components/SideBar.vue';
import TechnologyPage from '@/views/TechnologyPage.vue';
import PricingPage from '@/views/PricingPage.vue';
import AboutUsPage from '@/views/AboutUsPage.vue';
import QuizzPage from '@/views/QuizzPage.vue';
import StockSimulator from '@/views/StockSimulator.vue';
import GoalPage from '@/views/GoalPage.vue';
import RecommendationGenerator from '@/views/RecommendationGenerator.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/*',
    component: 404,
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
    path: '/chat-view',
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
  {
    path: '/goal',
    name: 'GoalPage',
    component: GoalPage,
  },
  {
    path: '/recommendation-generator',
    name: 'RecommendationGenerator',
    component: RecommendationGenerator,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;