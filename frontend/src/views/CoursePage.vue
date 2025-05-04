<template>
  <div class="course-page">
    <!-- Bot Chat Component -->
    <div
      class="bot-chat-container"
      :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }"
    >
      <img
        class="bot-image"
        src="@/assets/botrmbg.png"
        alt="Bot"
        @click="toggleChat"
      />
      <div
        class="bot-message"
        :class="{
          'message-visible': showMessage && !chatCollapsed,
          'message-hidden': hidingMessage || chatCollapsed,
        }"
      >
        <div v-if="isTyping" class="typing-animation">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div v-else class="typed-message" v-html="typedContent"></div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">{{ $t('coursePage.loadingText') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <p class="error-message">{{ $t('coursePage.errorMessage') }} {{ error }}</p>
      <button class="retry-btn" @click="fetchArticles">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18-5M22 12.5a10 10 0 0 1-18 5"></path>
        </svg>
        {{ $t('coursePage.retryButton') }}
      </button>
    </div>

    <!-- Content -->
    <div v-else class="course-container">
      <!-- Header -->
      <div class="section-divider">
        <h1 class="section-title">
          <span class="title-text">{{ $t('coursePage.categories.beginners') }}</span>
        </h1>
        <div class="read-more-container">
          <router-link 
            :to="{ name: 'CourseCategory', params: { categorySlug: 'cho-nguoi-moi-bat-dau' } }" 
            class="read-more-btn"
          >       
            {{ $t('coursePage.viewMore') }}
          </router-link>   
        </div>
      </div>

      <!-- For Beginners -->
      <div class="course-section">
        <div 
          class="course-card"
          v-for="(article, index) in forBeginners"
          :key="'main-'+index"
          @click="navigateToArticle(article.url)"
        >
          <div class="card-image" v-if="article.img">
            <img :src="article.img">
          </div>
          <div class="card-content">
            <h2 class="course-title">{{ article.title }}</h2>
            <div class="course-meta">
              <span class="views">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ article.view }} 
              </span>
            </div>
            <p class="course-description">{{ getFirstParagraph(article.description) }}</p>
          </div>
        </div>
      </div>

      <!-- Section Divider -->
      <div class="section-divider">
        <h2 class="section-title">
          <span class="title-text">{{ $t('coursePage.categories.investments') }}</span>
        </h2>
        <div class="read-more-container">
          <router-link 
            :to="{ name: 'CourseCategory', params: { categorySlug: 'dau-tu-hieu-qua' } }" 
            class="read-more-btn"
          >             
            {{ $t('coursePage.viewMore') }}
          </router-link>   
        </div>
      </div>

      <!-- Effective Investments -->
      <div class="course-section">
        <div 
          class="course-card"
          v-for="(article, index) in effectiveInvestments"
          :key="'effective-'+index"
          @click="navigateToArticle(article.url)"
        >
          <div class="card-image" v-if="article.img">
            <img :src="article.img">
          </div>
          <div class="card-content">
            <h2 class="course-title">{{ article.title }}</h2>
            <div class="course-meta">
              <span class="views">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ article.view }}
              </span>
            </div>
            <p class="course-description">{{ getFirstParagraph(article.description) }}</p>
          </div>
        </div>
      </div>

      <!-- Section Divider -->
      <div class="section-divider">
        <h2 class="section-title">
          <span class="title-text">{{ $t('coursePage.categories.fundamental') }}</span>
        </h2>
        <div class="read-more-container">
          <router-link 
            :to="{ name: 'CourseCategory', params: { categorySlug: 'phan-tich-co-ban' } }" 
            class="read-more-btn"
          > 
            {{ $t('coursePage.viewMore') }}
          </router-link>             
        </div>
      </div>

      <!-- Effective Investments -->
      <div class="course-section">
        <div 
          class="course-card"
          v-for="(article, index) in fundamentalAnalysis"
          :key="'effective-'+index"
          @click="navigateToArticle(article.url)"
        >
          <div class="card-image" v-if="article.img">
            <img :src="article.img">
          </div>
          <div class="card-content">
            <h2 class="course-title">{{ article.title }}</h2>
            <div class="course-meta">
              <span class="views">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ article.view }}
              </span>
            </div>
            <p class="course-description">{{ getFirstParagraph(article.description) }}</p>
          </div>
        </div>
      </div>

      <!-- Section Divider -->
      <div class="section-divider">
        <h2 class="section-title">
          <span class="title-text">{{ $t('coursePage.categories.technical') }}</span>
        </h2>
        <div class="read-more-container">
          <router-link 
            :to="{ name: 'CourseCategory', params: { categorySlug: 'phan-tich-ky-thuat' } }" 
            class="read-more-btn"
          >         
            {{ $t('coursePage.viewMore') }}
          </router-link>     
        </div>
      </div>

      <!-- Effective Investments -->
      <div class="course-section">
        <div 
          class="course-card"
          v-for="(article, index) in technicalAnalysis"
          :key="'effective-'+index"
          @click="navigateToArticle(article.url)"
        >
          <div class="card-image" v-if="article.img">
            <img :src="article.img">
          </div>
          <div class="card-content">
            <h2 class="course-title">{{ article.title }}</h2>
            <div class="course-meta">
              <span class="views">
                <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {{ article.view }}
              </span>
            </div>
            <p class="course-description">{{ getFirstParagraph(article.description) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_DEPLOY_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  name: 'CoursePage',
  data() {
    return {
      articlesData: [],
      loading: true,
      error: null,
      viewCounts: {},
      readMoreLinks: {
        'cho-nguoi-moi-bat-dau': '/courses/cho-nguoi-moi-bat-dau',
        'dau-tu-hieu-qua': '/courses/dau-tu-hieu-qua',
        'phan-tich-co-ban': '/courses/phan-tich-co-ban',
        'phan-tich-ky-thuat': '/courses/phan-tich-ky-thuat',
      },
      // Bot Chat data
      showBot: false,
      hidingBot: false,
      showMessage: false,
      hidingMessage: false,
      isTyping: false,
      botMessage: "",
      typedContent: "",
      typingTimer: null,
      botHideTimer: null,
      chatCollapsed: false,
    };
  },
  computed: {
    forBeginners() {
      const articles = this.articlesData['cho-nguoi-moi-bat-dau']
      return articles?.slice(0, 6).map(article => ({
        ...article,
      })) || [];
    },
    effectiveInvestments() {
      const articles = this.articlesData['dau-tu-hieu-qua']
      return articles?.slice(0, 6).map(article => ({
        ...article,
      })) || [];
    },
    fundamentalAnalysis() {
      const articles = this.articlesData['phan-tich-co-ban']
      return articles?.slice(0, 6).map(article => ({
        ...article,
      })) || [];
    },
    technicalAnalysis() {
      const articles = this.articlesData['phan-tich-ky-thuat']
      return articles?.slice(0, 6).map(article => ({
        ...article,
      })) || [];
    }
  },
  methods: {
    formatCourseIntroduction() {
      return 'Hello there! 👋<br><br>This is FinBud financial learning hub. Here you can:<br><br>📚 Learn investment knowledge from basic to advanced<br>💡 Discover effective investment strategies<br>📊 Dive deep into fundamental and technical analysis<br><br>Explore articles by topic or search for content you are interested in!';
    },
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axiosInstance.get('/api/courses');
        this.articlesData = {
          'cho-nguoi-moi-bat-dau': response.data.filter(article => article.category === 'cho-nguoi-moi-bat-dau'),
          'dau-tu-hieu-qua': response.data.filter(article => article.category === 'dau-tu-hieu-qua'),
          'phan-tich-co-ban': response.data.filter(article => article.category === 'phan-tich-co-ban'),
          'phan-tich-ky-thuat': response.data.filter(article => article.category === 'phan-tich-ky-thuat'),
        };
      } catch (err) {
        console.error('Error fetching articles:', err);
        this.error = err.message || 'Không thể tải dữ liệu';
      } finally {
        this.loading = false;
      }
    },
    
    formatViewCount(count) {
      return count?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") || "0";
    },
    getFirstParagraph(content) {
      const limitWords = 80;
      if (!content) return '';
      const firstParagraph = content.split('\n\n')[0];
      return firstParagraph.length > limitWords 
        ? firstParagraph.substring(0, limitWords) + '...' 
        : firstParagraph;
    },
    navigateToArticle(url) {
      if (url.startsWith('http')) {
        window.open(url, '_blank');
      } else {
        this.$router.push(url);
      }
    },
    // Bot Chat Methods
    startBotAnimation() {
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
      }

      this.showBot = true;
      this.hidingBot = false;
      this.showMessage = true;
      this.hidingMessage = false;
      this.typedContent = "";
      this.isTyping = true;

      setTimeout(() => {
        this.isTyping = false;
        this.botMessage = this.formatCourseIntroduction();
        this.startRealisticTyping();
      }, 500);
    },

    startRealisticTyping() {
      this.typedContent = "";
      let charIndex = 0;

      const typeNextChar = () => {
        if (charIndex < this.botMessage.length) {
          const currentChar = this.botMessage.charAt(charIndex);

          if (currentChar === "\n") {
            this.typedContent += "<br>";
          } else {
            this.typedContent += currentChar;
          }

          charIndex++;

          let delay;
          if ([".", "!", "?"].includes(currentChar)) {
            delay = Math.random() * 100 + 80;
          } else if ([",", ":", ";"].includes(currentChar)) {
            delay = Math.random() * 60 + 40;
          } else if (currentChar === " ") {
            delay = Math.random() * 20 + 10;
          } else if (currentChar === "\n") {
            delay = Math.random() * 120 + 80;
          } else if (!isNaN(parseInt(currentChar))) {
            delay = Math.random() * 25 + 15;
          } else {
            delay =
              Math.random() < 0.3
                ? Math.random() * 8 + 5
                : Math.random() * 15 + 10;
          }

          if (Math.random() < 0.02) {
            delay += Math.random() * 150 + 50;
          }

          this.typingTimer = setTimeout(typeNextChar, delay);
        }
      };

      setTimeout(typeNextChar, 300);
    },

    hideMessage() {
      // Only hide the message, not the bot
      this.hidingMessage = true;

      // Reset message after animation completes
      setTimeout(() => {
        this.hidingMessage = false;
        this.showMessage = true;

        // Reset for new message
        this.typedContent = "";
        this.isTyping = true;

        // After typing animation, restart with new message
        setTimeout(() => {
          this.isTyping = false;
          this.botMessage = this.formatQuizIntroduction();
          this.startRealisticTyping();
        }, 500);
      }, 800);
    },

    hideBot() {
      // Start fade-out animations
      this.hidingMessage = true;

      // Wait for message to fade out, then hide bot
      setTimeout(() => {
        this.hidingBot = true;

        // Reset states after animations complete
        setTimeout(() => {
          this.showBot = false;
          this.showMessage = false;
          this.hidingBot = false;
          this.hidingMessage = false;
          this.typedContent = "";
        }, 500);
      }, 300);
    },

    toggleChat() {
      this.chatCollapsed = !this.chatCollapsed;

      // If expanding the chat and it was previously shown, just show it again
      if (!this.chatCollapsed && this.typedContent) {
        this.showMessage = true;
      }
      // If expanding and no content yet, restart the typing animation
      else if (!this.chatCollapsed && !this.typedContent) {
        this.startBotAnimation();
      }
    },
  },
  mounted() {
    this.startBotAnimation();
    this.fetchArticles();
  },
  beforeUnmount() {
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    if (this.botHideTimer) {
      clearTimeout(this.botHideTimer);
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.course-page {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #2d3748;
  line-height: 1.6;
  position: relative;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.loading-spinner {
  border: 4px solid black;
  border-radius: 50%;
  border-top: 4px solid gray;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #4a5568;
  font-size: 1.1rem;
}

/* Error State */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
}

.error-icon {
  margin-bottom: 1.5rem;
}

.error-message {
  color: #e53e3e;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  max-width: 500px;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background-color: #c53030;
  transform: translateY(-2px);
}

/* Course Sections */
.course-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

/* Course Cards */
.course-card {
  background-color: white;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.card-image {
  height: 150px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .card-image img {
  transform: scale(1.05);
}

.card-content {
  padding: 1.5rem;
}

.course-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  height: 80px;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #718096;
}

.course-meta .icon {
  margin-right: 0.25rem;
  vertical-align: middle;
}

.course-description {
  color: #4a5568;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  overflow: hidden;
}

/* Section Divider */
.section-divider {
  margin-bottom: 3rem;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  position: relative;
  display: inline-block;
  padding: 0 2rem;
  margin-left: 100px;
}

.title-text {
  position: relative;
  z-index: 1;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.section-title::before,
.section-title::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 100px;
  height: 2px;
  background-color: #e2e8f0;
}

.section-title::before {
  left: -100px;
}

.section-title::after {
  right: -100px;
}

/* View All Button */
.read-more-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.read-more-btn {
  background-color: black;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.read-more-btn:hover {
  background-color: gray;
}

/* Bot Chat Styles */
.bot-chat-container {
  position: fixed;
  left: 5px;
  top: 30%;
  width: 260px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  z-index: 100;
  opacity: 1;
  pointer-events: auto;
}

.bot-chat-container.bot-visible {
  opacity: 1;
}

.bot-chat-container.bot-hidden {
  opacity: 0;
  transition: opacity 0.6s ease;
}

.bot-image {
  width: 40px;
  height: auto;
  display: block;
  position: relative;
  background: transparent;
  transition: transform 0.3s ease;
  cursor: pointer;
  z-index: 2;
}

.bot-image:hover {
  transform: scale(1.1);
}

.bot-visible .bot-image {
  animation: botBounce 0.6s ease-out;
}

@keyframes botBounce {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  60% {
    transform: translateY(-5px);
  }
  80% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.bot-message {
  margin-top: 10px;
  background: #2196f3;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 18px;
  font-size: 15px;
  max-width: 280px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease, max-height 0.4s ease;
  transition-delay: 0.2s;
  word-wrap: break-word;
  white-space: pre-line;
  max-height: 0;
  overflow: hidden;
}

.bot-message.message-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
  max-height: 1000px;
}

.bot-message.message-hidden {
  opacity: 0;
  transform: scale(0.8) translateY(10px);
  max-height: 0;
  transition: opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}

.typing-animation {
  display: flex;
  gap: 4px;
  padding: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffffff;
  opacity: 0.3;
}

.dot:nth-child(1) {
  animation: typing 1s infinite 0s;
}

.dot:nth-child(2) {
  animation: typing 1s infinite 0.2s;
}

.dot:nth-child(3) {
  animation: typing 1s infinite 0.4s;
}

.typed-message {
  line-height: 1.5;
  word-wrap: break-word;
}

@keyframes typing {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Styles */
@media (max-width: 768px) {
  .course-page {
    padding: 1.5rem;
  }
  
  .course-section {
    grid-template-columns: 1fr;
  }
  
  .section-title::before,
  .section-title::after {
    width: 50px;
  }
  
  .section-title::before {
    left: -50px;
  }
  
  .section-title::after {
    right: -50px;
  }

  .bot-chat-container {
    left: 10px;
    right: auto;
    bottom: 10px;
    top: auto;
  }

  .bot-image {
    width: 60px;
  }
}

@media (max-width: 576px) {
  .course-page {
    padding: 1rem;
  }
  
  .section-title::before,
  .section-title::after {
    display: none;
  }
  
  .course-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .bot-chat-container {
    width: 250px;
  }

  .bot-message {
    max-width: 220px;
  }
}
</style>