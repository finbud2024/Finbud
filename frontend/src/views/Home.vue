<template>
  <section id="main-content">
    <div class="blur-background"></div>
    <div class="intro-container animate">
      <div class="intro-text">
        <div class="title animate">{{ t('empoweringTitle') }}</div>
        <div class="description animate">{{ t('anytimeAnswers') }}</div>
        <div class="animate">
          <UserInput @send-message="chatNow" :redirectOnSend="true" class="front-search-bar" />
        </div>
      </div>
    </div>

    <section class="introduction-section animate">
      <header class="animate">
        <h1>{{ t('partneringTitle') }}</h1>
      </header>
      <div class="grid-container">
        <div class="dynamic-border animate">
          <div class="text-section text-left">
            <img class="intro-icon" src="@/assets/home-page/Lightbulb.png" alt="Financial Awareness Icon">
            <h2>{{ t('enhanceFinancialTitle') }}</h2>
            <p>{{ t('enhanceFinancialDesc') }}</p>
          </div>
        </div>
        <div class="dynamic-border animate">
          <div class="text-section text-left">
            <img class="intro-icon" src="@/assets/home-page/Bars.png" alt="Financial Planning Icon">
            <h2>{{ t('optimizeFinancialTitle') }}</h2>
            <p>{{ t('optimizeFinancialDesc') }}</p>
          </div>
        </div>
        <div class="dynamic-border animate">
          <div class="text-section text-left">
            <img class="intro-icon" src="@/assets/home-page/CircleArrowUp.png" alt="Financial Efficiency Icon">
            <h2>{{ t('maximizeInvestmentTitle') }}</h2>
            <p>{{ t('maximizeInvestmentDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="technology-section animate">
      <header class="animate">
        <h1>{{ t('impactTitle') }}</h1>
      </header>
      <div class="technology-grid">
        <div class="technology-card animate">
          <div class="technology-card-title">{{ t('savingsIncrease') }}</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>20%</p>
            </div>
            <div class="technology-stat-details">
              <p>{{ t('savingsDesc') }}</p>
            </div>
          </div>
        </div>
        <div class="technology-card animate">
          <div class="technology-card-title">{{ t('financialAwareness') }}</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>25%</p>
            </div>
            <div class="technology-stat-details">
              <p>{{ t('awarenessDesc') }}</p>
            </div>
          </div>
        </div>
        <div class="technology-card animate">
          <div class="technology-card-title">{{ t('debtReduction') }}</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>30%</p>
            </div>
            <div class="technology-stat-details">
              <p>{{ t('debtDesc') }}</p>
            </div>
          </div>
        </div>
        <div class="technology-card animate">
          <div class="technology-card-title">{{ t('creditScore') }}</div>
          <div class="technology-card-content">
            <div class="technology-stat">
              <p>6</p>
            </div>
            <div class="technology-stat-details">
              <p>{{ t('creditDesc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="feature-section animate">
      <div class="feature-container">
        <div class="feature-row animate">
          <div class="feature-text">
            <h2>{{ t('chatbotFeatureTitle') }} <div class="feature-name">{{ t('chatbotFeatureName') }}</div>
            </h2>
            <p>{{ t('chatbotDesc') }}</p>
            <a href="/chat-view" class="button">{{ t('chatNow') }}</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
        <div class="feature-row animate">
          <div class="feature-text">
            <h2>{{ t('simulatorFeatureTitle') }} <div class="feature-name">{{ t('simulatorFeatureName') }}</div>
            </h2>
            <p>{{ t('simulatorDesc') }}</p>
            <a href="/stock-simulator" class="button">{{ t('simulatorNow') }}</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
        <div class="feature-row animate">
          <div class="feature-text">
            <h2>{{ t('goalFeatureTitle') }} <div class="feature-name">{{ t('goalFeatureName') }}</div>
            </h2>
            <p>{{ t('goalDesc') }}</p>
            <a href="/goal" class="button">{{ t('goalNow') }}</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
        <div class="feature-row animate">
          <div class="feature-text">
            <h2>{{ t('quizFeatureTitle') }} <div class="feature-name">{{ t('quizFeatureName') }}</div>
            </h2>
            <p>{{ t('quizDesc') }}</p>
            <a href="/quizz" class="button">{{ t('quizNow') }}</a>
          </div>
          <div class="feature-image">
            <img src="@/assets/home-page/FinBudPix.png" alt="FinBud Logo">
          </div>
        </div>
      </div>
    </section>

    <section class="question-section animate">
      <header class="animate">
        <h1>{{ t('faqTitle') }}</h1>
      </header>
      <div class="question-container">
        <template v-if="faqsData && faqsData.length > 0">
          <div v-for="(item, index) in faqsData" :key="index" class="faq-item" :class="{ 'expanded': expandedItem === index }">
            <div class="question" @click="toggleExpansion(index)">
              <p>{{ item.question }}</p>
              <span class="expand-icon">{{ expandedItem === index ? '−' : '+' }}</span>
            </div>
            <transition name="fade">
              <div class="answer" v-show="expandedItem === index">
                <p>{{ item.answer }}</p>
              </div>
            </transition>
          </div>
        </template>
        <div v-else class="no-faqs animate">
          <p>No FAQs available at the moment.</p>
        </div>
      </div>
    </section>

    <footer class="site-footer animate">
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
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import BigGreenButton from "../components/Button/ChatNow.vue";
import TutorialOverlay from "@/components/tutorial/TutorialOverlay.vue";
import { useTypingEffect } from '@/composables/useTypingEffect';
import UserInput from '@/components/UserInput.vue';

export default {
  name: 'MainContent',
  components: {
    BigGreenButton,
    TutorialOverlay,
    UserInput,
  },
  setup() {
    const store = useStore();
    const { t, tm } = useI18n();
    const expandedItem = ref(null);

    const {
      typingText: signInTitle,
      startTyping: startTypingSignInTitle
    } = useTypingEffect('Anytime answers for finance questions with FinBud');

    const {
      typingText: signInDescription,
      startTyping: startTypingSignInDescription
    } = useTypingEffect('[Note to devs, this part has been removed in display...]');

    const isAuthenticated = computed(() => store.getters['users/isAuthenticated']);
    const displayText = computed(() => isAuthenticated.value ? "Chat Now" : "Get Started!");

    const faqsData = computed(() => {
      try {
        const faqs = tm('faqs') || {};
        console.log('Raw FAQs:', faqs);

        return Object.entries(faqs).map(([_, value]) => ({
          question: value.question || '',
          answer: value.answer || ''
        })).filter(faq => faq.question && faq.answer);
      } catch (error) {
        console.error('Error loading FAQs:', error);
        return [];
      }
    });

    const toggleExpansion = (index) => {
      if (expandedItem.value === index) {
        expandedItem.value = null;
      } else {
        expandedItem.value = index;
      }
    };

    return {
      isAuthenticated,
      displayText,
      faqsData,
      expandedItem,
      toggleExpansion,
      signInTitle,
      signInDescription,
      startTypingSignInTitle,
      startTypingSignInDescription,
      t
    };
  },
  data() {
    return {
      tutorialSteps: [
        {
          element: '#tutorial-main-button',
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
  methods: {
    learnMore() {
      this.$router.push('/tech');
    },
    chatNow(message) {

      this.$router.push({
        path: '/chat-view',
        query: { autoMessage: message }
      });

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
      threshold: 0.1, // Bao giờ thấy 10% block => animate
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        } else {
          entry.target.classList.remove('animate-visible');
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate');
    animatedElements.forEach((el) => observer.observe(el));

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
/* Animation Base */
.animate {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 1.2s ease, transform 1.2s ease;
}

/* Khi visible */
.animate-visible {
  opacity: 1;
  transform: translateY(0);
}


/* Slide directions */
.slide-left {
  transform: translateX(-40px);
}

.slide-right {
  transform: translateX(40px);
}

.slide-up {
  transform: translateY(40px);
}

.slide-down {
  transform: translateY(-40px);
}

/* Khi xuất hiện */
.animate-visible.slide-left,
.animate-visible.slide-right,
.animate-visible.slide-up,
.animate-visible.slide-down {
  transform: translate(0, 0);
  opacity: 1;
}

/* Delay nếu muốn đẹp hơn */
[data-delay="100"] {
  transition-delay: 0.1s;
}

[data-delay="200"] {
  transition-delay: 0.2s;
}

[data-delay="300"] {
  transition-delay: 0.3s;
}

[data-delay="400"] {
  transition-delay: 0.4s;
}

[data-delay="500"] {
  transition-delay: 0.5s;
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
  width: min(2000px, 95vw);
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
  padding: 10% 10%;  /* Match other sections padding */
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  width: 100%;
}

.question-section header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 0;  /* Remove extra padding */
}

.question-section header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;  /* Remove default margin */
}

.question-container {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding-bottom: 50px;  /* Add padding to match other sections */
}

.faq-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
}

.question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  background-color: var(--bg-secondary);
  transition: background-color 0.3s ease;
}

.question:hover {
  background-color: var(--bg-hover);
}

.question p {
  margin: 0;
  font-size: 1.1rem;
  flex: 1;
  color: var(--text-primary);
}

.expand-icon {
  font-size: 1.5rem;
  color: var(--text-secondary);
  margin-left: 1rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-item.expanded .expand-icon {
  transform: rotate(180deg);
}

.answer {
  padding: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.6;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  width: 100%;
}

.answer p {
  margin: 0;
  font-size: 1rem;
  white-space: normal;  /* Match text wrapping with other sections */
  word-wrap: break-word;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, max-height 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}

.no-faqs {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  border: 1px dashed var(--border-color);
  border-radius: 8px;
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

  .question-section {
    padding: 3rem 5%;
  }

  .question-section header h1 {
    font-size: 2rem;
  }

  .question p {
    font-size: 1rem;
  }

  .answer p {
    font-size: 0.9rem;
  }

  .front-search-bar {
    width: 95vw;
    padding: 10px 5%;
    margin-top: 2rem;
    /* thêm margin cách chữ trên */
  }

  .title {
    font-size: clamp(2.5rem, 5vw, 5rem);
  }

  .description {
    font-size: 1.3rem;
    text-align: center;
    padding: 1rem;
  }

}

/* Large devices (desktops, 992px and up) */
@media (max-width: 992px) {

  .intro-text {
    padding-top: 2vh;
    padding-bottom: 2vh;
    /* thêm khoảng trắng phía dưới nếu muốn */

    /* thay vì 100vh */
    flex-direction: column;
    padding: 0;
    align-items: center;
    text-align: center;
  }

  .intro-text1 {
    padding-left: 0;
    padding-top: 10vh;
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

.debug-info {
  background-color: #f0f0f0;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 800px;
  border-radius: 4px;
  font-family: monospace;
}

.debug-info p {
  margin: 0.5rem 0;
  color: #666;
}

:root.dark-mode .debug-info {
  background-color: #2a2a2a;
  color: #ccc;
}

/* Responsive for technology section */
@media (max-width: 992px) {
  .technology-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    padding: 0;
  }

  .technology-card {
    border: none;
    padding: 1rem;
  }

  .technology-card-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .technology-stat p {
    font-size: 2.2rem;
  }

  .technology-stat-details p {
    font-size: 0.9rem;
  }

  .feature-container {
    padding: 0 5%;
  }

  .feature-row {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
    gap: 2rem;
  }

  .feature-text {
    padding: 1rem;
  }

  .feature-text h2 {
    font-size: 1.5rem;
    padding-bottom: 1rem;
  }

  .feature-text p {
    font-size: 1rem;
    padding-bottom: 1rem;
  }

  .feature-image {
    width: 100%;
    padding: 1rem 0;
    border: none;
  }

  .feature-image img {
    width: 60%;
    height: auto;
  }

  .button {
    width: 100%;
    max-width: 250px;
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .technology-grid {
    grid-template-columns: 1fr;
  }

  .technology-stat p {
    font-size: 2rem;
  }

  .feature-text h2 {
    font-size: 1.3rem;
  }

  .feature-text p {
    font-size: 0.95rem;
  }
}

/* Add responsive styles for FAQ section to match other sections */
@media (max-width: 992px) {
  .question-section {
    padding: 10% 5%;
  }

  .question-section header h1 {
    font-size: 2rem;
  }

  .question p {
    font-size: 1rem;
  }

  .answer p {
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  .question-section {
    padding: 10% 5%;
  }

  .question p {
    font-size: 0.95rem;
  }

  .answer p {
    font-size: 0.9rem;
  }
}
</style>