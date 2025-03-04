<template>
  <section id="main-content">
    <div class='intro-container'>
      <div class="intro-text">
        <div class="intro-text1">
          <li class="title animate fade-in">Making the most informed financial choices</li>
          <li class="animate fade-in" :style="{ minHeight: '41px', fontSize: '30px', fontWeight: 'bold', listStyleType: 'none' }">
            {{ signInTitle }}
          </li>
          <li class="description animate fade-in last-li">
            {{  signInDescription }}
          </li>
          <BigGreenButton @click="chatNow" id="tutorial-main-button">{{ displayText }}</BigGreenButton>
        </div>

        <div class="photo">
          <img src='@/assets/botrmbg.png' alt="placeholder">
        </div>
      </div>
    </div>

    <section class="introduction-section">
      <header>
        <h1 class="animate fade-in">
          From Learning to Implementation, Partnering with You to Achieve Your Financial Goals
        </h1>
      </header>
      <div class="grid-container">
        <!-- first row -->
        <div class="text-section text-left animate slide-in-left">
          <h2>Enhance Your Financial Awareness</h2>
          <p>
            Complex financial concepts and challenging knowledge are no longer a concern. Finbud's advanced AI chatbot
            will help you review, explore financial topics, and answer all your questions.
          </p>
          <a href="/quizz" class="button">Learn more</a>
        </div>
        <div class="image-section animate slide-in-right">
          <div class="quizz-image introduction-image"></div>
        </div>
        <!-- second row -->
        <div class="image-section animate slide-in-left">
          <div class="goal-image introduction-image"></div>
        </div>
        <div class="text-section text-right animate slide-in-right">
          <h2>Optimize Your Financial Planning & Operations</h2>
          <p>
            Is your spending often out of control?
            <br>
            Finbud helps you track and manage expenses, record income and spending, and tailor financial management to
            your specific goals.
          </p>
          <a href="/goal" class="button">Learn more</a>
        </div>
        <!-- third row -->
        <div class="text-section text-left animate slide-in-left">
          <h2>Maximize Your Investment Efficiency</h2>
          <p>
            Interested in investing but unsure where to start or worried about risks?
            <br>
            Finbud provides a comprehensive overview of the financial market, guiding you to optimize your capital
            confidently.
          </p>
          <a href="/stock-simulator" class="button">Learn more</a>
        </div>
        <div class="image-section animate slide-in-right">
          <div class="simulator-image introduction-image"></div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="feature-section">
      <header>
        <h1 class="animate fade-in">Choose Finbud as your <br>
          Everyday Wealth Management Advisor!
        </h1>
      </header>
      <div class="sub-header">
        Paired with advanced AI technology, tailored for individual financial needs, Finbud has a comprehensive package
        of features that suits all your needs.
      </div>
      <div class="grid-container">
        <div class="feature-chatbot animate slide-in-left">
          <img class="feature-icon" src="@/assets/home-page/chatbot.png" alt="chatbot image">
          <h2>Advanced AI Chatbot immediately Solve All Your Financial Concerns</h2>
          <p>With just simple commands and access to a vast source of accurate and reliable information, all your
            financial queries can be answered instantly.</p>
          <a href="/chat-view" class="button">Chat now!</a>
        </div>
        <div class="feature-investment-tracking animate slide-in-right">
          <img class="feature-icon" src="@/assets/home-page/investment-tracking.png" alt="chatbot image">
          <h2>Investment Guidance, Tracker and Market Report </h2>
          <p>Track how your investments are performing in real-time, provide actionable insights from your investment
            and the market to make better investment decisions.</p>
          <a href="/stock-simulator" class="button">Try Simulator now!</a>
        </div>
        <div class="feature-budget-projection animate slide-in-left">
          <img class="feature-icon" src="@/assets/home-page/budget-projection.png" alt="chatbot image">
          <h2>Future Expense Projections through Spending Habit Analysis</h2>
          <p>Our AI predicts upcoming expenses to help you plan ahead, understand your spending patterns and receive
            tips for better budget management.</p>
          <a href="/goal" class="button">Try Goal now! </a>
        </div>
        <div class="feature-financial-knowledge animate slide-in-right">
          <img class="feature-icon" src="@/assets/home-page/financial-knowledge.png" alt="chatbot image">
          <h2>Financial Knowledge Review with Keyword-based Quiz </h2>
          <p>Financial Quiz with different topics related to different keywords help you practice and learn financial
            knowledge in a smart and interactive way.</p>
          <a href="/quizz" class="button">Try Quiz now!</a>
        </div>
      </div>
    </section>

    <!-- Technology Section -->
    <section class="technology-section">
      <header>
        <h1 class="animate fade-in">With Finbud, easily notice the impact starting from today!</h1>
      </header>
      <div class="technology-grid">
        <div class="animate slide-in-up technology-card">
          <h3>20% Savings Increase</h3>
          <p>average per user</p>
        </div>
        <div class="animate slide-in-down technology-card">
          <h3>25% Financial <br> Awareness Increase</h3>
        </div>
        <div class="animate slide-in-up technology-card">
          <h3>30% Debt Reduction</h3>
          <p>after 1 year</p>
        </div>
        <div class="animate slide-in-down technology-card">
          <h3>Improved Credit Score</h3>
          <p>within 6 months</p>
        </div>
      </div>
      <a href="/tech" class="button">Learn more about Finbud</a>
    </section>
    <!-- Commonly Asked Question -->
    <section class="question-section">
      <header>
        <h1>Frequently Asked Questions</h1>
      </header>
      <div class="question-container">
        <div v-for="(item, index) in faqsData" :key="index" @click="toggleExpansion(item)"
        :class="{ 'expanded': expandedItem === item}">
          <div class="question">
            <h4>{{ item.question }}</h4>
            <span v-if="expandedItem === item">
              <font-awesome-icon icon="fa-solid fa-chevron-up" />
            </span>
            <span v-else>
              <font-awesome-icon icon="fa-solid fa-chevron-down" />
            </span>
          </div>
          <div class="expanded-content">
            <p class="answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>
    <TutorialOverlay 
      :steps="tutorialSteps" 
      storageKey="finbudHomeTutorialShown" 
      :autoStart="true"
      @tutorial-completed="onTutorialCompleted" 
      ref="tutorialOverlay" />
  </section>
</template>

<script>
import BigGreenButton from "../components/Button/ChatNow.vue";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay.vue";
import faqs from "@/views/hardcodeData/FAQs.js";
import { useTypingEffect } from '@/composables/useTypingEffect';

export default {
  name: 'MainContent',
  components: {
    BigGreenButton,
    TutorialOverlay
  },
  setup() {
    const { 
        typingText: signInTitle, 
        startTyping: startTypingSignInTitle 
    } = useTypingEffect('Sign in to see more services')
    const { 
      typingText: signInDescription, 
      startTyping:  startTypingSignInDescription 
    } = useTypingEffect('With FinBud, you can ask for the best financial advice anytime, anywhere', {
      reverseEffect: false
    })
    
    return {
      signInTitle,
      signInDescription, 
      startTypingSignInTitle,
      startTypingSignInDescription
    }
  },
  data() {
    return {
      faqsData: faqs.map(dataPoint => ({
        question: dataPoint.question,
        answer: dataPoint.answer,
        isOpen: false,
      })),
      expandedItem: null,
      tutorialSteps: [
        {
          element: '#tutorial-main-button', // Target the BigGreenButton in the intro
          message: "Click here to start chatting with FinBud, your personal finance assistant!",
          title: "Welcome to FinBud"
        }
      ]
    };
  },
  computed: {
    isAuthenticated(){
      return this.$store.getters['users/isAuthenticated'];
    },
    displayText() {
      return this.isAuthenticated ? "Chat Now" : "Get Started!"
    }
  },
  methods: {
    learnMore() {
      this.$router.push('/tech');
    },
    chatNow() {
      if (this.isAuthenticated) {
        this.$router.push('/chat-view');
      } else {
        this.$router.push('/login');
      }
    },
    toggleExpansion(item) {
      //if it is already expanded and click into it again:
      if (this.expandedItem === item) {
        this.expandedItem = null;
      }
      else {
        this.expandedItem = item;
      }
    },
    onTutorialCompleted() {
      console.log("Tutorial completed!");
      if (this.isAuthenticated) {
        this.$router.push({
          path: '/chat-view',
          query: {showTutorial: 'true'}
        });
      } else {
        this.$router.push('login');
      }
    }
  },
  mounted() {
    this.startTypingSignInTitle(); 
    this.startTypingSignInDescription();
    
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate');
    elements.forEach(el => observer.observe(el));
  },
};
</script>

<style scoped>
/* Add animations */
.animate {
  opacity: 0;
  transition: opacity 1s ease, transform 1s ease;
}

.animate-visible {
  opacity: 1;
}

.fade-in {
  transform: translateY(20px);
}

.fade-in.animate-visible {
  transform: translateY(0);
}

.slide-in-left {
  transform: translateX(-20px);
}

.slide-in-left.animate-visible {
  transform: translateX(0);
}

.slide-in-right {
  transform: translateX(20px);
}

.slide-in-right.animate-visible {
  transform: translateX(0);
}

.slide-in-up {
  transform: translateY(20px);
}

.slide-in-up.animate-visible {
  transform: translateY(0);
}

.slide-in-down {
  transform: translateY(-20px);
}

.slide-in-down.animate-visible {
  transform: translateY(0);
}

/* General Styling */
.intro-text {
  display: flex;
  flex-direction: row;
  width: auto;
  opacity: 1;
  animation: none;
  padding: 2rem;
}

.intro-text1 {
  width: 66%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 10%;
}

.last-li {
  margin-bottom: 20px;
}

.title {
  font-weight: bold;
  color: var(--text-primary);
  display: flex;
  text-align: left;
  flex-direction: column;
  font-size: clamp(3rem, 2.5vw, 4rem);
  max-width: 30rem;
  flex-wrap: wrap;
  opacity: 1;
  animation: none;
  font-weight: 700;
}

.description {
  color: var(--text-primary);
  display: flex;
  text-align: left;
  font-size: 1.2rem;
  padding-top: 20px;
  flex-wrap: wrap;
  opacity: 1;
  animation: none;
  font-weight: 300;
}

.small-description {
  color: var(--text-primary);
  padding-top: 90px;
  padding: 2rem;
  flex-direction: row;
  gap: 80px;
  display: flex;
  flex-direction: row;
  opacity: 1;
  animation: none;
  font-weight: 300;
}

.photo img {
  width: 50%;
  border-radius: 10%;
  opacity: 1;
  animation: none;
}

.photo {
  aspect-ratio: 1;
  text-align: center;
  margin: auto;
  opacity: 1;
  animation: none;
  width: 33%;
  height: 100%;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-right: 8%;
}

/*grid*/
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 0 10%;
}

.grid-container>div {
  text-align: center;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
}

.introduction-image {
  height: 100%;
  border: 2px solid var(--border-color);
  border-radius: 20px;
}

.quizz-image {
  background-image: url("@/assets/home-page/quizz.png");
  background-size: cover;
  background-position: top center;
}

.goal-image {
  background-image: url("@/assets/home-page/goal.png");
  background-size: cover;
  background-position: center center;
}

.simulator-image {
  background-image: url("@/assets/home-page/simulator.png");
  background-size: cover;
  background-position: top center;
}

.text-left p,
.text-left h2 {
  text-align: left;
}

.text-right p,
.text-right h2 {
  text-align: right;
}

.text-right a {
  align-self: flex-end;
}

.text-left a {
  align-self: flex-start;
}

/* Button styling */
.button {
  padding: 10px 20px;
  margin-top: 10px;
  background-color: #007bff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  color: white;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  max-width: 220px;
  border-radius: 50px;
  transition: transform 0.3s;
}

.button:hover {
  transform: scale(1.1);
}

/* Important - make the tutorial button accessible for clicks */
#tutorial-main-button {
  position: relative;
  z-index: 10001;
}

.feature-icon {
  width: 100px;
  aspect-ratio: 1;
}

/* Dark mode specific styles for PNG icons */
:root.dark-mode .feature-icon,
body.dark-mode .feature-icon {
  filter: brightness(0) invert(1); /* This will make the PNG icons white */
}

.feature-section .grid-container>div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* technology section */
.technology-section {
  padding: 0 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.technology-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding-bottom: 50px;
}

.technology-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--card-bg);
  box-shadow: 0 4px 8px 0 var(--shadow-color);
  color: var(--text-primary);
  border-radius: 30px;
  height: 150px;
  padding: 20px;
}

.technology-card h3,
.technology-card p {
  color: var(--text-primary);
  text-align: center;
}

.technology-card p {
  margin-top: -20px;
}

/* question section*/
.question-section {
  padding: 0 10%;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.question-section header {
  padding: 40px 0 0 0;
}

.question-section header h1 {
  text-align: left;
}

.question-container {
  transition: all 0.3s ease;
}
.question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.expanded-content {
  transition: all 0.5s ease;
  /* opacity, max-height*/
  border-radius: 4px;
  max-height: 0;
  overflow: hidden;
  display: flex;
  justify-content: end;
}

.expanded .expanded-content {
  max-height: 100px;
}

.answer {
  height: fit-content;
}

/* Global settings and the main content area */
#main-content {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  margin-top: 0;
  opacity: 1;
  animation: none;
}

header {
  text-align: center;
  padding: 40px 300px 0 300px;
  background: none;
  opacity: 1;
  animation: none;
}

.sub-header {
  text-align: center;
  padding: 0 300px 50px 300px;
}

h1 {
  font-size: 30px;
  font-weight: 700;
}

h1,
h2,
h3 {
  color: #007bff;
  opacity: 1;
  animation: none;
}

/* Responsive images styling */
img {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  opacity: 1;
  animation: none;
}

/* Medium devices (tablets, 768px and up) */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
  
  .grid-container>div {
    height: 300px;
    width: 100%;
    margin-bottom: 40px;
  }

  .introduction-section .grid-container>div {
    margin-bottom: 0;
  } 

  .grid-container > div:nth-child(odd) {
    order: 1;
  }

  .grid-container > div:nth-child(even) {
    order: 2;
  }

  header {
    padding: 0 5%;
  }

  .feature-section header h1 {
    margin: 0px 0 20px 0px;
  }

  .sub-header {
    padding: 0 10% 30px 10%;
  }

  .text-right a,
  .text-left a {
    align-self: center;
  }

  .text-left p,
  .text-left h2 {
    text-align: center;
  }

  .text-right p,
  .text-right h2 {
    text-align: center;
  }
  
  .feature-section .grid-container>div {
    padding: 50px 0;
  }

  .technology-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .expanded .expanded-content {
    max-height: 300px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (max-width: 992px) {

  .intro-text {
    flex-direction: column;
    padding: 0;
    align-items: center;
    text-align: center;
  }

  .intro-text1 {
    padding-left: 0;
    gap: 10px;
  }

  .intro-text1 li {
    text-align: center;
  }

  .photo {
    padding: 0;
    padding-top: 2rem;
  }

  .photo img {
    width: 100%;
  }
}
</style>