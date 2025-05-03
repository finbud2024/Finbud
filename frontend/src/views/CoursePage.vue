<template>
    <div class="course-page">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p class="loading-text">Đang tải dữ liệu...</p>
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
        <p class="error-message">Đã xảy ra lỗi khi tải dữ liệu: {{ error }}</p>
        <button class="retry-btn" @click="fetchArticles">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18-5M22 12.5a10 10 0 0 1-18 5"></path>
          </svg>
          Thử lại
        </button>
      </div>
  
      <!-- Content -->
      <div v-else class="course-container">
        <!-- Header -->
        <div class="header">
          <h1 class="section-title">
            <span class="title-text">CHO NGƯỜI MỚI BẮT ĐẦU</span>
          </h1>
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
            <span class="title-text">ĐẦU TƯ HIỆU QUẢ</span>
          </h2>
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
            <span class="title-text">PHÂN TÍCH CƠ BẢN</span>
          </h2>
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
            <span class="title-text">PHÂN TÍCH KỸ THUẬT</span>
          </h2>
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
  
        <!-- View All Button -->
        <div class="view-all-container">
          <button class="view-all-btn">
            Xem tất cả
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
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
        viewCounts: {}
      };
    },
    computed: {
      forBeginners() {
        const articles = this.articlesData['cho-nguoi-moi-bat-dau']
        return articles.slice(0, 6).map(article => ({
          ...article,
        }));
      },
      effectiveInvestments() {
        const articles = this.articlesData['dau-tu-hieu-qua']
        return articles.slice(0, 6).map(article => ({
          ...article,
        }));
      },
      fundamentalAnalysis() {
        const articles = this.articlesData['phan-tich-co-ban']
        return articles.slice(0, 6).map(article => ({
          ...article,
        }));
      },
      technicalAnalysis() {
        const articles = this.articlesData['phan-tich-ky-thuat']
        return articles.slice(0, 6).map(article => ({
          ...article,
        }));
      }
      // otherArticles() {
      //   return this.articles.slice(6).map(article => ({
      //     ...article,
      //     viewCount: this.viewCounts[article._id] || this.generateRandomViewCount(4000, 10000)
      //   }));
      // }
    },
    methods: {
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
    created() {
      this.fetchArticles();
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
  
  /* Header */
  .header {
    margin-bottom: 2.5rem;
    text-align: center;
  }
  
  .header-title {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin-bottom: 1rem;
  }

  
  .header-divider {
    height: 4px;
    width: 80px;
    background: black;
    margin: 0 auto;
    border-radius: 2px;
  }
  
  /* Course Sections */
  .course-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
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
  
  .course-card:hover .read-more {
    color: black;
    transform: translateX(4px);
  }
  
  /* Section Divider */
  .section-divider {
    margin: 3rem 0;
    text-align: center;
  }
  
  .section-title {
    position: relative;
    display: inline-block;
    padding: 0 2rem;
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
  
  /* Other Articles */
  .other-articles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .small-card {
    background-color: white;
    border-radius: 8px;
    padding: 1.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .small-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .small-card-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .small-card-title {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.75rem;
    flex-grow: 1;
  }
  
  .small-card-meta {
    font-size: 0.75rem;
    color: #718096;
  }
  
  /* View All Button */
  .view-all-container {
    text-align: center;
    margin-top: 2rem;
  }
  
  .view-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.75rem;
    background-color: black;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .view-all-btn:hover {
    background-color: gray;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
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
    
    .header-title {
      font-size: 1.75rem;
    }
    
    .course-section {
      grid-template-columns: 1fr;
    }
    
    .other-articles {
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
    
    .header-title {
      font-size: 1.5rem;
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