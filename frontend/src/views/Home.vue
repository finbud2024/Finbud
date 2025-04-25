<template>
  <section id="main-content">
    <div class='intro-container'>
      <div class="intro-text">
        <div class="title animate fade-in">Empowering smarter finance decisions </div>
        <div class="description animate fade-in">
          {{ signInTitle }}
        </div>
        <div class="animate fade-in ">
          <UserInput @send-message="chatNow" :redirectOnSend="true" class="front-search-bar" />
        </div>
      </div>
    </div>

    <section class="introduction-section">
      <header>
        <h1>
          Partnering to Achieve Financial Goals
        </h1>
      </header>
      <div class="grid-container">
        <!-- first grid box -->
        <div class="dynamic-border">
          <div class="text-section text-left ">
            <img class="intro-icon" src="@/assets/home-page/Lightbulb.png" alt="Financial Awareness Icon">
            <h2>Enhance Your Financial Awareness</h2>
            <p>
              Finbud's advanced AI chatbot will help you review, explore financial topics, and answer all your
              questions.
            </p>
            <!-- Not in the sample frontpage, but it was in the original front page and is still functional once uncommented -->
            <!-- <a href="/quizz" class="button">Learn more</a> -->
          </div>
        </div>


        <!-- second grid box -->
        <div class="dynamic-border">
          <div class="text-section text-left">
            <img class="intro-icon" src="@/assets/home-page/Bars.png" alt="Financial Planning Icon">
            <h2>Optimize Your Financial Planning</h2>
            <p>
              Finbud helps you track and manage expenses, record income and spending, and tailor financial management to
              your specific goals.
            </p>
            <!-- <a href="/goal" class="button">Learn more</a> -->
          </div>
        </div>

        <!-- third grid box -->
        <div class="dynamic-border">
          <div class="text-section text-left">
            <img class="intro-icon" src="@/assets/home-page/CircleArrowUp.png" alt="Financial Efficiency Icon">
            <h2>Maximize Your Investment Efficiency</h2>
            <p>
              Finbud provides a comprehensive overview of the financial market, guiding you to optimize your capital
              confidently.
            </p>
            <!-- <a href="/stock-simulator" class="button">Learn more</a> -->
          </div>
        </div>

      </div>
    </section>

    <!-- Technology Section -->
    <section class="technology-section">
      <header>
        <h1>Easily notice the impact</h1>
      </header>
      <div class="technology-grid">
        <div class="technology-card">
          <div class="technology-card-title">Savings Increase</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>20% </p>
            </div>
            <div class="technology-stat-details">
              <p>average per user </p>
            </div>
          </div>
        </div>
        <div class="technology-card">
          <div class="technology-card-title">Financial Awareness</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>25% </p>
            </div>
            <div class="technology-stat-details">
              <p>increase </p>
            </div>
          </div>
        </div>
        <div class="technology-card">
          <div class="technology-card-title">Debt Reduction</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>30% </p>
            </div>
            <div class="technology-stat-details">
              <p>after 1 year </p>
            </div>
          </div>
        </div>
        <div class="technology-card">
          <div class="technology-card-title">Improved Credit Score</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>6 </p>
            </div>
            <div class="technology-stat-details">
              <p>months within</p>
            </div>
          </div>

        </div>
      </div>
      <!-- <a href="/tech" class="button">Learn more about Finbud</a> -->
    </section>

    <!-- Features Section -->
    <section class="feature-section">
      <div class="feature-container">
        <!-- Feature 1 -->
        <div class="feature-row">
          <div class="feature-text">
            <h2>Solve Financial Worries with <div class="feature-name">AI Chatbot,</div>
            </h2>
            <p>
              With just simple commands and access to a vast source of accurate and reliable information, all your
              financial queries can be answered instantly.
            </p>
            <a href="/chat-view" class="button">Chat now</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
        <!-- Feature 2 -->
        <div class="feature-row">
          <div class="feature-text">
            <h2>Master Your Investments with
              <div class="feature-name">FinBud Simulator,</div>
            </h2>
            <p>
              Track how your investments are performing in real-time, provide actionable insights from your investment
              and the market to make better investment decisions.
            </p>
            <a href="/stock-simulator" class="button">Simulator now</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
        <!-- Feature 3 -->
        <div class="feature-row">
          <div class="feature-text">
            <h2>Predict Your Costs with <div class="feature-name">FinBud Goal,</div>
            </h2>
            <p>
              Our AI predicts upcoming expenses to help you plan ahead, understand your spending patterns and receive
              tips
              for better budget management.
            </p>
            <a href="/goal" class="button">Set Goal now</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
        <!-- Feature 4 -->
        <div class="feature-row">
          <div class="feature-text">
            <h2>Boost Your Finance Skills with <div class="feature-name">FinBud Quiz,</div>
            </h2>
            <p>
              Financial Quiz with different topics related to various keywords helps you practice and learn financial
              knowledge in a smart and interactive way.
            </p>
            <a href="/quizz" class="button">Try Quiz now</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
      </div>
    </section>



    <!-- Commonly Asked Question -->
    <section class="question-section">
      <header>
        <h1>Frequently Asked Questions</h1>
      </header>
      <div class="question-container">
        <div v-for="(item, index) in faqsData" :key="index" @click="toggleExpansion(item)"
          :class="{ 'expanded': expandedItem === item }">
          <div class="question">
            <p>{{ item.question }}</p>
          </div>
          <div class="expanded-content">
            <p class="answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-image">
        <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
      </div>
      <div class="footer-text">
        © Copyright 2025, All Rights Reserved by FinBud
      </div>
    </footer>


    <TutorialOverlay :steps="tutorialSteps" storageKey="finbudHomeTutorialShown" :autoStart="true"
      @tutorial-completed="onTutorialCompleted" ref="tutorialOverlay" />
  </section>
</template>

<script>
import BigGreenButton from "../components/Button/ChatNow.vue";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay.vue";
import faqs from "@/views/hardcodeData/FAQs.js";
import { useTypingEffect } from '@/composables/useTypingEffect';
import { LucideAsteriskSquare } from "lucide-vue-next";
import UserInput from '@/components/UserInput.vue';

export default {
  name: 'MainContent',
  components: {
    BigGreenButton,
    TutorialOverlay,
    UserInput,
  },
  setup() {
    const {
      typingText: signInTitle,
      startTyping: startTypingSignInTitle
    } = useTypingEffect('Anytime answers for finance questions with FinBud')
    const {
      typingText: signInDescription,
      startTyping: startTypingSignInDescription
    } = useTypingEffect('[Note to devs, this part has been removed in display. It\'s too closely intertwined with everything else and will crash the app if this part is removed, so I left this note to show that it should be removed LucideAsteriskSquare]', {
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
      ],
      mouseX: 0,
      mouseY: 0,
      elementStyle: {
        backgroundColor: 'lightblue'
      }
    };
  },
  computed: {
    isAuthenticated() {
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
    chatNow(message) {
      if (this.isAuthenticated) {
        this.$router.push({
          path: '/chat-view',
          query: { autoMessage: message }
        });
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
          query: { showTutorial: 'true' }
        });
      } else {
        this.$router.push('login');
      }
    },
    handleGlobalMouseMove(e) {
      const containers = document.querySelectorAll(".dynamic-border");
      containers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        container.style.setProperty("--mouse-x", x + "px");
        container.style.setProperty("--mouse-y", y + "px");
      });
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
        } else {
          entry.target.classList.remove('animate-visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate');
    elements.forEach(el => observer.observe(el));

    this._globalMouseMoveHandler = this.handleGlobalMouseMove.bind(this);
    window.addEventListener("mousemove", this._globalMouseMoveHandler);
  },
  beforeUnmount() {
    window.removeEventListener("mousemove", this._globalMouseMoveHandler);
  },

};
</script>

<style scoped>
/* Add animations */
.animate {
  opacity: 0;
  transition: opacity 2s ease 1s, transform 2s ease 1s;
}

.animate-visible {
  opacity: 1;
}

.fade-in {
  transform: translateY(50px);
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  width: 100%;
  height: 100vh;
  animation: none;
  padding: 2rem;
}

.last-li {
  margin-bottom: 20px;
}

.title {
  font-weight: bold;
  color: var(--text-primary);
  display: flex;
  text-align: center;
  flex-direction: column;
  font-size: clamp(3rem, 4.5vw, 8rem);
  flex-wrap: wrap;
  animation: none;
  font-weight: 700;
}

.description {
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  font-size: 2rem;
  padding-top: 20px;
  flex-wrap: wrap;
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

.front-search-bar {
  position: relative;
  width: min(2000px, 90vw);
  height: auto;
  color: var(--text-primary);
  display: flex;
  justify-content: center;
  font-size: 1.2rem;
  padding: 20px 17% 0;
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
  /* padding-right: 8%; */
}

/*grid*/
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 10%;
  gap: 1rem;
}

.grid-container>div {
  text-align: center;
  padding: 20px 30px;
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.intro-icon {
  width: 40px;
  aspect-ratio: 1;
}

/* Dark mode specific styles for PNG icons */
:root.dark-mode .intro-icon {
  filter: brightness(0) invert(1);
  /* This will make the PNG icons white */
}

.dynamic-border {
  position: relative;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dynamic-border::before {
  content: "";
  position: absolute;
  width: 100%;
  inset: 0px;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(circle 100px at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(0, 0, 255, 0.8) 0,
      transparent 100%);
  transition: background 0.1s ease;
  z-index: 1;
}

.text-section {
  position: relative;
  z-index: 2;
  margin: 0px;
  padding: 10px;
  background-color: var(--card-bg);
  border-radius: inherit;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: var(--text-primary);
}



.text-left p,
.text-left h2 {
  text-align: left;
  margin: 0.5rem 0;
}

.text-right p,
.text-right h2 {
  text-align: right;
  margin: 0.5rem 0;
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
  background-color: transparent;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  color: black;
  text-decoration: none;
  cursor: pointer;
  max-width: 220px;
  border-radius: 6px;
  transition: transform 0.3s;
}

:root.dark-mode .button {
  background-color: transparent;
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.458);
  color: white;
}

.button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
  /* slightly darker text */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);
}

:root.dark-mode .button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ddd;
  /* slightly lighter text */
  box-shadow: 0 4px 8px 0 rgba(255, 255, 255, 0.6);
}

/* Important - make the tutorial button accessible for clicks */
#tutorial-main-button {
  position: relative;
  z-index: 10001;
}

/* Dark mode specific styles for PNG icons */
:root.dark-mode .feature-icon,
body.dark-mode .feature-icon {
  filter: brightness(0) invert(1);
  /* This will make the PNG icons white */
}

/* technology section */
.technology-section {
  padding: 10% 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.technology-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding-bottom: 50px;
}

.technology-card {
  text-align: left;
  border-right: 1px solid var(--border-color);
  padding: 20px;
}

.technology-card:nth-child(4n) {
  border-right: none;
}

.technology-card-title {
  text-align: left;
  margin-bottom: 3rem;
}

.technology-card-content {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 1rem;
}

.technology-stat p {
  font-size: 3rem;
  margin: 0;
  line-height: 1;
}


.technology-stat-details p {
  font-size: 1rem;
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
  flex: 1;
}

.feature-container {
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
  padding: 0 10%;
}

.feature-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid var(--border-color);
  /* border-radius: 6px;*/
  overflow: hidden;
}

.feature-image {
  flex: 0 0 auto;
  width: 150px;
  border-left: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  flex: 1;
}

.feature-image img {
  width: 70%;
  height: 70%;
  object-fit: contain;
}


.feature-text {
  flex: 1;
  padding: 3rem;
  text-align: left;
}


.feature-text h2 {
  font-size: 2rem;
  padding-bottom: 3rem;
  font-weight: normal;
}

.feature-name {
  color: blue;
}


.feature-text p {
  padding-bottom: 2rem;
  white-space: normal;
}

/* question section*/
.question-section {
  padding: 0 10%;
  padding-bottom: 10%;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.question-section header {
  padding: 0 20px;
}

.question-section header h1 {
  text-align: center;
}

.question-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
}

.question-container>div {
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0px 3%;
}

/* When expanded, style the overall container (both question & answer) */
.question-container>div:hover,
.question-container>div.expanded {
  background-color: rgb(226, 242, 251);
  border: 1px solid darkblue;
}

/* Styling for the question bar (the clickable header) */
.question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-container>div.expanded .question {
  color: blue;
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.expanded-content {
  max-height: 0;
  padding-top: 0px;
  opacity: 0;
  transform: translateY(-20px);
  transition: all 0.3s ease;
  overflow: hidden;
}

.expanded .expanded-content {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0);
}


.answer {
  height: fit-content;
}

.site-footer {
  border-top: 1px solid var(--border-color, #ccc);
  padding: 3rem 2rem;
  text-align: left;
}

.footer-image img {
  max-width: 150px;
  height: auto;
  margin-bottom: 0.5rem;
}

.footer-text {
  font-size: 0.9rem;
  color: var(--text-secondary, #666);
}


/* Global settings and the main content area */

*,
*::before,
*::after {
  box-sizing: border-box;
}

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

  .grid-container>div:nth-child(odd) {
    order: 1;
  }

  .grid-container>div:nth-child(even) {
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