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
                {{ article.view }} {{ $t('coursePage.views') }}
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
                {{ article.view }} {{ $t('coursePage.views') }}
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
                {{ article.view }} {{ $t('coursePage.views') }}
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
                {{ article.view }} {{ $t('coursePage.views') }}
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
import { useI18n } from 'vue-i18n'

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
      abortTyping: false,
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
    },
    botMessage() {
      return this.$t('coursePage.botMessage');
    }
  },
  watch: {
    '$i18n.locale'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.refreshBotMessage();
      }
    }
  },
  methods: {
    formatCourseIntroduction() {
      return this.$t('coursePage.botMessage');
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
      this.abortTyping = false;
      this.typedContent = "";
      let charIndex = 0;

      const typeNextChar = () => {
        if (this.abortTyping) return;

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
    refreshBotMessage() {
      // 1. Abort any ongoing typing immediately
      this.abortTyping = true;
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      this.botMessage = this.formatCourseIntroduction();
      
      // 2. Quickly fade out current message
      this.hidingMessage = true;
      
      // 3. After fade-out completes, start new message
      setTimeout(() => {
        this.hidingMessage = false;
        this.showMessage = true;
        this.typedContent = "";
        this.isTyping = true;
        
        // 4. Start typing new message
        setTimeout(() => {
          this.isTyping = false;
          this.startRealisticTyping();
        }, 300);
      }, 300);
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
          // this.botMessage = this.formatQuizIntroduction();
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
  color: var(--text-primary);
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
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--link-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: var(--text-secondary);
  font-size: 1.1rem;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
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

/* Course Grid */
.course-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Course Cards */
.course-card {
  background: var(--bg-primary);
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-color);
  position: relative;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.12);
}

.card-image {
  height: 200px;
  overflow: hidden;
  position: relative;
}

.card-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, var(--bg-primary), transparent);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card:hover .card-image img {
  transform: scale(1.1);
}

.card-content {
  padding: 1.5rem;
  position: relative;
}

.course-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.3s ease;
}

.course-card:hover .course-title {
  color: var(--link-color);
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.views {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  color: var(--link-color);
}

.course-description {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Section Headers */
.section-divider {
  margin-bottom: 2rem;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: fadeIn 0.5s ease;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--link-color);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.section-title:hover::after {
  width: 100%;
}

.read-more-btn {
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
}

.read-more-btn:hover {
  background: var(--link-color);
  color: white;
  transform: translateY(-2px);
}

/* Bot Chat */
.bot-chat-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  gap: 1rem;
}

.bot-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.bot-image:hover {
  transform: scale(1.1);
}

.bot-message {
  background: var(--bg-primary);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  max-width: 300px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .course-page {
    padding: 1rem;
  }

  .course-section {
    grid-template-columns: 1fr;
  }

  .course-card {
    height: auto;
    min-height: 350px;
  }

  .card-image {
    height: 150px;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .bot-chat-container {
    bottom: 20px;
    right: 20px;
  }

  .bot-image {
    width: 50px;
    height: 50px;
  }

  .bot-message {
    max-width: 250px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .course-page {
    padding: 0.5rem;
  }

  .section-divider {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .read-more-btn {
    width: 100%;
    text-align: center;
  }

  .course-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .bot-message {
    max-width: 200px;
    font-size: 0.85rem;
  }
}
</style>