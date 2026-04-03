import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const LoginView = () => import("@/views/Authentication/LoginPage.vue");
const SignUp = () => import("@/views/Authentication/SignUpPage.vue");
const Home = () => import("@/views/Home/HomePage.vue");
const ChatPage = () => import("@/views/Chat/ChatPage.vue");
const SideBar = () => import("@/components/Basic/SideBar.vue");
const PricingPage = () => import("@/views/Unused/PricingPage.vue");
const AboutTechnologyPage = () =>
  import("@/views/Overview/AboutTechnologyPage.vue");
const StockSimulator = () => import("@/views/FinInvest/StockSimulatorPage.vue");
const RiskAnalysis = () => import("@/views/FinManage/RiskAnalysisPage.vue");
const GoalPage = () => import("@/views/FinManage/GoalPage.vue");
const MarketDataCenter = () =>
  import("@/views/FinManage/SuperInvestorMarketDataCenter.vue");
const ProfilePage = () => import("@/views/Home/ProfilePage.vue");
const MortgageCalc = () =>
  import("@/views/FinManage/MortgageCalculatorPage.vue");
const SuperInvestors = () =>
  import("@/views/FinManage/SuperInvestorsPage.vue");
const InvestorDetail = () =>
  import("@/views/FinManage/SuperInvestorsInvestorsDetail.vue");
const ForgotPassword = () =>
  import("@/views/Authentication/ForgotPasswordPage.vue");
const FundLetterPage = () => import("@/views/FinInvest/FundLetterPage.vue");
const NotificationCenter = () =>
  import("@/views/Home/NotificationCenter.vue");
const SubscriptionPage = () =>
  import("@/views/Subscription/SubscriptionPage.vue");
const CalculatorsPage = () =>
  import("@/views/FinManage/CalculatorsPage.vue");

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
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
    meta: { requiresAuth: true },
  },
  {
    path: "/tech",
    redirect: { path: "/about", hash: "#technology" },
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
    name: "AboutTechnologyPage",
    component: AboutTechnologyPage,
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
    meta: { requiresAuth: true },
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
    meta: { requiresAuth: true },
  },
  {
    path: "/calculators",
    name: "CalculatorsPage",
    component: CalculatorsPage,
  },
  {
    path: "/mortgage-calc",
    redirect: "/calculators?tab=mortgage",
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
    redirect: "/calculators?tab=investment",
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
    meta: { requiresAuth: true },
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

router.beforeEach(async (to, from, next) => {
  const needsAuth = Boolean(to.meta.requiresAuth);

  if (needsAuth && !store.state.users.authChecked) {
    await store.dispatch("users/fetchCurrentUser");
  }

  if (needsAuth && !store.getters["users/isAuthenticated"]) {
    return next({ name: "Login", query: { redirect: to.fullPath } });
  }

  next();
});

export default router;