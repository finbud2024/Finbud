import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";
import LoginView from "@/views/Authentication/LoginPage.vue";
import SignUp from "@/views/Authentication/SignUpPage.vue";
import Home from "@/views/Home/HomePage.vue";
import ChatPage from "@/views/Chat/ChatPage.vue";
import SideBar from "@/components/Basic/SideBar.vue";
import TechnologyPage from "@/views/Overview/TechnologyPage.vue";
import PricingPage from "@/views/Unused/PricingPage.vue";
import AboutUsPage from "@/views/Overview/AboutUsPage.vue";
import StockSimulator from "@/views/FinInvest/StockSimulatorPage.vue";
import RiskAnalysis from "@/views/FinManage/RiskAnalysisPage.vue";
import GoalPage from "@/views/FinManage/GoalPage.vue";
import MarketDataCenter from "@/views/FinManage/SuperInvestorMarketDataCenter.vue";
import ProfilePage from "@/views/Home/ProfilePage.vue";
import MortgageCalc from "@/views/FinManage/MortgageCalculatorPage.vue";
import SuperInvestors from "@/views/FinManage/SuperInvestorsPage.vue";
import InvestorDetail from "@/views/FinManage/SuperInvestorsInvestorsDetail.vue";
import ForgotPassword from "@/views/Authentication/ForgotPasswordPage.vue";
import InvestmentCalculator from "@/views/FinManage/InvestmentCalculatorPage.vue";
import FundLetterPage from "@/views/FinInvest/FundLetterPage.vue";
import NotificationCenter from "@/views/Home/NotificationCenter.vue";
import FinCompare from "@/views/FinManage/FinCompare.vue";
import SubscriptionPage from "@/views/Subscription/SubscriptionPage.vue";

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
      default: ChatPage,
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
    path: "/market-data-center",
    name: "RiskAnalysis",
    component: RiskAnalysis,
  },
  {
    path: "/about",
    name: "AboutUsPage",
    component: AboutUsPage,
  },
  {
    path: "/stock-simulator",
    name: "StockSimulator",
    component: StockSimulator,
    meta: { requiresAuth: true },
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
    path: "/mortgage-calc",
    name: "MortgageCalc",
    component: MortgageCalc,
    props: true,
  },
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
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
  },
  {
    path: "/investment-calculator",
    name: "InvestmentCalculator",
    component: InvestmentCalculator,
  },
  {
    path: "/fund-letter",
    name: "FundLetter",
    component: FundLetterPage,
  },
  {
    path: "/notifications",
    name: "NotificationCenter",
    component: NotificationCenter,
  },
  {
    path: "/fin-compare",
    name: "FinCompare",
    component: FinCompare,
  },
  {
    path: "/subscribe",
    name: "SubscriptionPage",
    component: SubscriptionPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  console.log(
    "Router guard - navigating to:",
    to.path,
    "requires auth:",
    to.meta.requiresAuth
  );

  if (!store.getters["users/isAuthenticated"]) {
    await store.dispatch("users/fetchCurrentUser");
  }

  console.log(
    "Router guard - authenticated:",
    store.getters["users/isAuthenticated"]
  );

  // Check if route requires authentication
  if (to.meta.requiresAuth && !store.getters["users/isAuthenticated"]) {
    console.log(
      "Router guard - redirecting to login with redirect:",
      to.fullPath
    );
    // Redirect to login page
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
