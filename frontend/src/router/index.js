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
import QuizzPage from "@/views/FinEdu/QuizzPage.vue";
import StockSimulator from "@/views/FinInvest/StockSimulatorPage.vue";
import RiskAnalysis from "@/views/FinManage/RiskAnalysisPage.vue";
import GoalPage from "@/views/FinManage/GoalPage.vue";
import MarketDataCenter from "@/views/FinManage/SuperInvestorMarketDataCenter.vue";
import ProfilePage from "@/views/Home/ProfilePage.vue";
import QuantAnalysis from "@/views/FinInvest/QuantPage.vue";
import EventHub from "@/views/FinEdu/EventPage.vue";
import LearningRoadMap from "@/views/FinEdu/QuizzLearningRoadMap.vue";
import QuantSimulator from "@/views/FinInvest/QuantSimulatorPage.vue";
import ForumView from "@/views/FinEdu/ForumPage.vue";
import ThreadCard from "@/components/ThreadCard.vue";
import ThreadView from "@/views/FinEdu/ForumThreadView.vue";
import StartThread from "@/views/FinEdu/ForumThreadStart.vue";
import MortgageCalc from "@/views/FinManage/MortgageCalculatorPage.vue";
import SuperInvestors from "@/views/FinManage/SuperInvestorsPage.vue";
import InvestorDetail from "@/views/FinManage/SuperInvestorsInvestorsDetail.vue";
import FinDataPage from "@/views/FinInvest/FinData/FinDataPage.vue";
import AgentPage from "@/views/FinAgent/AgentPage.vue";
import PestlePage from "@/views/FinAgent/PestlePage.vue";
import AIBreakthroughWorkflowsPage from "@/views/FinAgent/AIBreakthroughWorkflowsPage.vue";
import AIWorkflowsPage from "@/views/FinAgent/AIWorkflowsPage.vue";
import ForgotPassword from "@/views/Authentication/ForgotPasswordPage.vue";
import AutoTradeAI from "@/views/FinInvest/AutoTradeAIPage.vue";
import InvestmentCalculator from "@/views/FinManage/InvestmentCalculatorPage.vue";
import InsiderTransactionPage from "@/views/FinInvest/FinData/InsiderTransactionPage.vue";
import EarningCalendarPage from "@/views/Unused/EarningCalendarPage.vue";
import FundLetterPage from "@/views/FinInvest/FundLetterPage.vue";
import NotificationCenter from "@/views/Home/NotificationCenter.vue";
import CourseCategoryPage from "@/views/FinEdu/CourseCategoryPage.vue";
import CoursePage from "@/views/FinEdu/CoursePage.vue";
import MacroeconomicPage from "@/views/FinInvest/MacroEconomicData.vue";
import MarketAnalysisPage from "@/views/FinInvest/MarketAnalysis.vue";
import MarketAnalysisInsight from "@/views/FinInvest/MarketAnalysis/MarketAnalysisInsight.vue";
import FinCompare from "@/views/FinManage/FinCompare.vue";
import PredictiveCalculatorPage from "@/views/FinInvest/PredictiveCalculatorPage.vue";
import CreateRoadmapPage from "@/views/FinEdu/CreateRoadmapPage.vue";
import SubscriptionPage from "@/views/Subscription/SubscriptionPage.vue";
import RealEstateAnalystPage from "@/views/FinXpert/RealEstateAnalystPage.vue";
import EquityResearcherPage from "@/views/FinXpert/EquityResearcherPage.vue";
import AIHedgeFundLabPage from "@/views/FinXpert/AIHedgeFundLabPage.vue";
import PrivateEquityDealScoutPage from "@/views/FinXpert/PrivateEquityDealScoutPage.vue";
import AIFinanceWorkflowsPage from "@/views/FinXpert/AIFinanceWorkflowsPage.vue";
import AccountantPage from "@/views/FinXpert/AccountantPage.vue";

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
    meta: { requiresAuth: true },
  },
  {
    path: "/quant-simulator",
    name: "QuantSimulator",
    component: QuantSimulator,
    meta: { requiresAuth: true },
  },
  {
    path: "/autotrade-ai",
    name: "AutoTradeAI",
    component: AutoTradeAI,
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
    path: "/course",
    name: "CoursePage",
    component: CoursePage,
    props: true,
  },
  {
    path: "/courses/:categorySlug",
    name: "CourseCategory",
    component: CourseCategoryPage,
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
    path: "/docs",
    redirect: "/docs/aapl",
  },
  {
    path: "/docs/:ticker",
    name: "Financial Docs",
    component: FinDataPage,
  },
  {
    path: "/company-report/:ticker",
    component: InsiderTransactionPage,
  },
  {
    path: "/earning-calendars",
    component: EarningCalendarPage,
  },
  {
    path: "/agent/",
    name: "AgentPage",
    component: AgentPage,
  },
  {
    path: "/pestle/",
    name: "PestlePage",
    component: PestlePage,
  },
  {
    path: "/ai-breakthrough-workflows",
    name: "AIBreakthroughWorkflowsPage",
    component: AIBreakthroughWorkflowsPage,
  },
  {
    path: "/ai-workflows",
    name: "AIWorkflowsPage",
    component: AIWorkflowsPage,
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
    path: "/courses/:categorySlug",
    name: "CourseCategory", // Must match exactly what you use in router-link
    component: CourseCategoryPage,
  },
  {
    path: "/macro-economic",
    name: "MacroeconomicPage",
    component: MacroeconomicPage,
  },
  {
    path: "/blog",
    name: "BlogPage",
    component: () => import("../views/Blog/BlogPage.vue"),
  },
  {
    path: "/market-analysis",
    name: "MarketAnalysisPage",
    component: MarketAnalysisPage,
  },
  {
    path: "/market-analysis/insight/:type",
    name: "MarketAnalysisInsight",
    component: MarketAnalysisInsight,
  },
  {
    path: "/fin-compare",
    name: "FinCompare",
    component: FinCompare,
  },
  {
    path: "/predictive-calculator",
    name: "PredictiveCalculatorPage",
    component: PredictiveCalculatorPage,
  },
  {
    path: "/create-roadmap",
    name: "CreateRoadmapPage",
    component: CreateRoadmapPage,
  },
  {
    path: "/subscribe",
    name: "SubscriptionPage",
    component: SubscriptionPage,
  },
  {
    path: "/finxpert-real-estate",
    name: "RealEstateAnalystPage",
    component: RealEstateAnalystPage,
  },
  {
    path: "/finxpert-equity",
    name: "EquityResearcherPage",
    component: EquityResearcherPage,
  },
  {
    path: "/ai-hedge-fund-lab",
    name: "AIHedgeFundLabPage",
    component: AIHedgeFundLabPage,
  },
  {
    path: "/finxpert-pe-deal-scout",
    name: "PrivateEquityDealScoutPage",
    component: PrivateEquityDealScoutPage,
  },
  {
    path: "/private-equity-deal-scout",
    name: "PrivateEquityDealScoutPageAlias",
    component: PrivateEquityDealScoutPage,
  },
  {
    path: "/ai-finance-workflows",
    name: "AIFinanceWorkflowsPage",
    component: AIFinanceWorkflowsPage,
  },
  {
    path: "/finxpert-accountant",
    name: "AccountantPage",
    component: AccountantPage,
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
