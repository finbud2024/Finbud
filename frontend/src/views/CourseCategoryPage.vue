<template>
  <div class="course-page">
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
      <p class="error-message">{{ $t('coursePage.errorMessage') }}{{ error }}</p>
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
          <span class="title-text">{{ categoryTitle }}</span>
        </h1>
      </div>

      <!-- Articles Grid -->
      <div class="course-section">
        <template v-if="currentCategoryArticles.length > 0">
          <div 
            class="course-card"
            v-for="(article, index) in currentCategoryArticles"
            :key="article.id || index"
            @click="navigateToArticle(article.url)"
          >
            <div class="card-image" v-if="article.img">
              <img :src="article.img" :alt="article.title">
            </div>
            <div class="card-content">
              <h2 class="course-title">{{ article.title }}</h2>
              <div class="course-meta">
                <span class="views">
                  <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  {{ article.view }} {{ $t('coursePage.courseCard.views') }}
                </span>
              </div>
              <p class="course-description">{{ getFirstParagraph(article.description) }}</p>
            </div>
          </div>
        </template>
        <div v-else class="empty-state">
          <p>{{ $t('coursePage.emptyState') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_DEPLOY_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default {
  name: 'CourseCategory',
  props: {
    categorySlug: {
      type: String,
      required: true,
      validator: value => [
        'cho-nguoi-moi-bat-dau',
        'dau-tu-hieu-qua',
        'phan-tich-co-ban',
        'phan-tich-ky-thuat'
      ].includes(value)
    }
  },
  data() {
    return {
      allArticles: [],
      loading: true,
      error: null,
      viewCounts: {},
      categoryMap: {
        'cho-nguoi-moi-bat-dau': 'beginners',
        'dau-tu-hieu-qua': 'investments',
        'phan-tich-co-ban': 'fundamental',
        'phan-tich-ky-thuat': 'technical'
      }
    };
  },
  computed: {
    effectiveCategorySlug() {
      return this.categorySlug || this.$route.params.categorySlug;
    },
    categoryTitle() {
      const categoryKey = this.categoryMap[this.effectiveCategorySlug];
      return this.$t(`coursePage.categories.${categoryKey}`);
    },
    articlesByCategory() {
      const categories = {
        'cho-nguoi-moi-bat-dau': [],
        'dau-tu-hieu-qua': [],
        'phan-tich-co-ban': [],
        'phan-tich-ky-thuat': []
      };
      
      if (!Array.isArray(this.allArticles)) return categories;
      
      this.allArticles.forEach(article => {
        if (article.category && categories[article.category]) {
          categories[article.category].push(article);
        }
      });
      
      return categories;
    },
    currentCategoryArticles() {
      const articles = this.articlesByCategory[this.effectiveCategorySlug] || [];
      return articles.map(article => ({
        ...article,
        view: this.formatViewCount(article.view || 0)
      }));
    }
  },
  methods: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axiosInstance.get('/api/courses');
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format from API');
        }
        
        this.allArticles = response.data;
        
      } catch (err) {
        console.error('Error fetching articles:', err);
        this.error = err.message || this.$t('coursePage.errorMessage');
      } finally {
        this.loading = false;
      }
    },
    formatViewCount(count) {
      return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
    }
  },
  watch: {
    '$route.params.categorySlug': {
      immediate: true,
      handler(newSlug) {
        if (newSlug) {
          this.fetchArticles();
        }
      }
    }
  },
  created() {
    this.fetchArticles();
  }
};
</script>
  
  <style scoped>
  .course-page {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    color: #2d3748;
    line-height: 1.6;
  }
  
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
  
  .course-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 4rem;
  }
  
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
  
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #718096;
  }
  
  .section-divider {
    margin-bottom: 3rem;
    text-align: center;
    display: flex;
    justify-content: space-between;
  }
  
  .section-title {
    position: relative;
    display: inline-block;
    padding: 0 2rem;
    margin: 0 auto;
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
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
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
  }
  
  @media (max-width: 480px) {
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
  }
  </style>