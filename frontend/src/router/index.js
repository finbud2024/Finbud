import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import SignUp from "@/views/SignUp.vue";
import Home from "@/views/Home.vue";
import ChatView from "@/views/ChatView.vue";
import SideBar from "@/components/SideBar.vue";
import TechnologyPage from "@/views/TechnologyPage.vue";
import PricingPage from "@/views/PricingPage.vue";
import AboutUsPage from "@/views/AboutUsPage.vue";
import QuizzPage from "@/views/QuizzPage.vue";
import StockSimulator from "@/views/StockSimulator.vue";
import RiskAnalysis from "@/views/RiskAnalysis.vue";
import GoalPage from "@/views/GoalPage.vue";
import MarketDataCenter from "@/views/MarketDataCenter.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import QuantAnalysis from "@/views/QuantAnalysis.vue";
import EventHub from "@/views/EventHub.vue";
import LearningRoadMap from "@/views/LearningRoadMap.vue";
import QuantSimulator from "@/views/QuantSimulator.vue";
import ForumView from "@/views/ForumView.vue";
import ThreadCard from "@/components/ThreadCard.vue";
import ThreadView from "@/views/ThreadView.vue";
import StartThread from "@/views/StartThread.vue";
import InvestmentCalculator from "@/views/InvestmentCalculator.vue";

import MortgageCalc from "@/views/Mortgage-calc.vue";
import SuperInvestors from "@/views/SuperInvestors.vue";
import InvestorDetail from "@/views/InvestorDetail.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/*",
    component: 404,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
  },
  {
    path: "/chat-view",
    name: "ChatView",
    components: {
      default: ChatView,
      sidebar: SideBar,
    },
  },
  {
    path: "/tech",
    name: "TechnologyPage",
    component: TechnologyPage,
  },
  {
    path: "/pricing",
    name: "PricingPage",
    component: PricingPage,
  },
  {
    path: "/riskanalysis",
    name: "RiskAnalysis",
    component: RiskAnalysis,
  },
  {
    path: "/quant-analysis",
    name: "QuantAnalysis",
    component: QuantAnalysis,
  },
  {
    path: "/about",
    name: "AboutUsPage",
    component: AboutUsPage,
  },
  {
    path: "/quizz",
    name: "QuizzPage",
    component: QuizzPage,
  },
  {
    path: "/stock-simulator",
    name: "StockSimulator",
    component: StockSimulator,
  },
  {
    path: "/quant-simulator",
    name: "QuantSimulator",
    component: QuantSimulator,
  },
  {
    path: "/goal",
    name: "GoalPage",
    component: GoalPage,
  },
  {
    path: "/market",
    name: "Market",
    component: MarketDataCenter,
  },
  {
    path: "/profile",
    name: "Profile",
    component: ProfilePage,
  },
  {
    path: "/event",
    name: "EventHub",
    component: EventHub,
  },
  {
    path: "/learning-roadmap",
    name: "LearningRoadMap",
    component: LearningRoadMap,
    props: true,
  },
  {
    path: "/forum",
    name: "ForumView",
    component: ForumView,
    props: true,
  },
  {
    path: "/thread",
    name: "ThreadCard",
    component: ThreadCard,
    props: true,
  },
  {
    path: "/forum/thread/:id",
    name: "ThreadView",
    component: ThreadView,
    props: true,
  },
  {
    path: "/start-thread",
    name: "StartThread",
    component: StartThread,
    props: true,
  },
  {
    path: "/mortgage-calc",
    name: "MortgageCalc",
    component: MortgageCalc,
    props: true,
  },
  ,
  {
    path: "/super-investors",
    name: "SuperInvestors",
    component: SuperInvestors,
  },
  {
    path: "/super-investors/:id",
    name: "InvestorDetails",
    component: InvestorDetail,
  },
  {
    path: "/investment-calculator",
    name: "InvestmentCalculator",
    component: InvestmentCalculator,
    props: true,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
