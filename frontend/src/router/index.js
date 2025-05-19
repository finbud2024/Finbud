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
import ForeignExchange from "@/components/marketPage/ForeignExchange.vue";
import Commodity from '@/components/marketPage/Commodity.vue'
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
import FinDataPage from "@/views/FinInvest/FinData/FinDataPage.vue"
import AgentPage from "@/views/FinAgent/AgentPage.vue";
import PestlePage from "@/views/FinAgent/PestlePage.vue";
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
    path: "/forex",
    name: "ForeignExchange",
    component: ForeignExchange,
    meta: { title: "Foreign Exchange" }
  },
  { path: '/commodity', 
    name: 'Commodity', 
    component: Commodity
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
    path: '/courses/:categorySlug',
    name: 'CourseCategory',
    component: CourseCategoryPage,
    props: true
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
    redirect: "/docs/aapl"
  },
  {
    path: "/docs/:ticker",
    name: "Financial Docs",
    component: FinDataPage
  },
  {
    path: "/company-report/:ticker",
    component: InsiderTransactionPage
  },
  {
    path: "/earning-calendars",
    component: EarningCalendarPage
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
    path: '/courses/:categorySlug',
    name: 'CourseCategory', // Must match exactly what you use in router-link
    component: CourseCategoryPage,
  },
  {
    path: "/macro-economic",
    name: "MacroeconomicPage",
    component: MacroeconomicPage,
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
  }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  if (!store.getters["users/isAuthenticated"]) {
    await store.dispatch("users/fetchCurrentUser");
  }
  next();
});

export default router;
