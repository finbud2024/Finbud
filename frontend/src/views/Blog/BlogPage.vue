<template>
  <div class="blog-page">
    <div class="container">
      <h1 class="hero-title">FinBud Blog</h1>
      
      <!-- Featured Articles Section -->
      <section class="featured-section">
        <h2 class="section-title">Featured Articles</h2>
        <div class="featured-grid">
          <div v-for="article in featuredArticles" :key="article.id" class="featured-card">
            <img :src="article.image" :alt="article.title" class="featured-image" />
            <div class="featured-content">
              <h3>{{ article.title }}</h3>
              <p>{{ article.excerpt }}</p>
              <router-link :to="'/blog/' + article.slug" class="read-more">Read More</router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories-section">
        <h2 class="section-title">Categories</h2>
        <div class="categories-grid">
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="filterByCategory(category.slug)"
            :class="['category-btn', { active: selectedCategory === category.slug }]"
          >
            <i :class="category.icon"></i>
            <span>{{ category.name }}</span>
            <span class="count">({{ category.count }})</span>
          </button>
        </div>
      </section>

      <!-- Articles Section -->
      <section class="articles-section">
        <div class="articles-header">
          <div class="search-sort">
            <input 
              type="text" 
              v-model="searchQuery" 
              @input="searchArticles"
              placeholder="Search articles..."
              class="search-input"
            />
            <select v-model="sortBy" @change="sortArticles" class="sort-select">
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        <div class="articles-grid">
          <div v-for="article in paginatedArticles" :key="article.id" class="article-card">
            <img :src="article.image" :alt="article.title" class="article-image" />
            <div class="article-content">
              <span class="category-tag">{{ getCategoryName(article.category) }}</span>
              <h3>{{ article.title }}</h3>
              <p>{{ article.excerpt }}</p>
              <div class="article-meta">
                <span class="date">{{ formatDate(article.createdAt) }}</span>
                <span class="views">{{ article.views }} views</span>
              </div>
              <router-link :to="'/blog/' + article.slug" class="read-more">Read More</router-link>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="pagination">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            Previous
          </button>
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="changePage(page)"
            :class="['pagination-btn', { active: currentPage === page }]"
          >
            {{ page }}
          </button>
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Next
          </button>
        </div>
      </section>
    </div>

    <!-- Interactive Robot -->
    <div class="interactive-robot" ref="robot">
      <div class="robot-body">
        <div class="robot-head" :style="headStyle">
          <div class="robot-eyes">
            <div class="robot-eye left-eye" :style="leftEyeStyle">
              <div class="pupil"></div>
            </div>
            <div class="robot-eye right-eye" :style="rightEyeStyle">
              <div class="pupil"></div>
            </div>
          </div>
          <div class="robot-mouth" :class="{ 'talking': isRobotTalking }"></div>
        </div>
        <div class="robot-antenna">
          <div class="antenna-tip"></div>
        </div>
      </div>
      
      <!-- Enhanced Communication Bubble - MAIN FEATURE -->
      <div class="communication-bubble" :class="{ 'visible': showCommunication }" @click="toggleCommunication">
        <div class="bubble-header">
          <h3 class="communication-title">💬 COMMUNICATION</h3>
          <button class="close-btn" @click.stop="hideCommunication">×</button>
        </div>
        <div class="bubble-content">
          <div v-if="isTyping" class="typing-indicator">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
          <div v-else v-html="communicationMessage" class="message-content"></div>
        </div>
        <div class="bubble-footer">
          <small>Click để đóng hoặc đợi tự động ẩn</small>
        </div>
      </div>
      
      <!-- Communication Trigger when hidden -->
      <div class="communication-trigger" v-show="!showCommunication" @click="showRandomCommunication">
        <div class="trigger-icon">💬</div>
        <div class="trigger-text">COMMUNICATION</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'

export default {
  name: 'BlogPage',
  data() {
    return {
      // Articles data
      articles: [],
      featuredArticles: [],
      loading: false,
      searchQuery: '',
      selectedCategory: null,
      sortBy: 'latest',
      currentPage: 1,
      itemsPerPage: 9,
      
      // Robot data  
      mouseX: 0,
      mouseY: 0,
      showCommunication: false,
      isTyping: false,
      isRobotTalking: false,
      communicationMessage: '',
      
      // Categories
      categories: [
        { id: 1, name: 'Đầu Tư', slug: 'dau-tu', icon: 'fas fa-chart-line', count: 12 },
        { id: 2, name: 'Phân Tích', slug: 'phan-tich', icon: 'fas fa-analytics', count: 8 },
        { id: 3, name: 'Tin Tức', slug: 'tin-tuc', icon: 'fas fa-newspaper', count: 15 },
        { id: 4, name: 'Hướng Dẫn', slug: 'huong-dan', icon: 'fas fa-book', count: 6 },
        { id: 5, name: 'Xu Hướng', slug: 'xu-huong', icon: 'fas fa-trending-up', count: 10 }
      ]
    }
  },
  computed: {
    headStyle() {
      // Robot ở vị trí cố định: bottom: 150px, right: 100px
      const robotFixedX = window.innerWidth - 100
      const robotFixedY = window.innerHeight - 150
      
      const dx = this.mouseX - robotFixedX
      const dy = this.mouseY - robotFixedY
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      const limitedAngle = Math.max(-30, Math.min(30, angle * 0.3))
      
      return {
        transform: `rotate(${limitedAngle}deg)`
      }
    },
    leftEyeStyle() {
      return this.getEyeStyle(-5)
    },
    rightEyeStyle() {
      return this.getEyeStyle(5)
    },
    filteredArticles() {
      let filtered = [...this.articles]
      
      // Filter by search query
      if (this.searchQuery) {
        filtered = filtered.filter(article => 
          article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(article => article.category === this.selectedCategory)
      }
      
      return filtered
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredArticles.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredArticles.length / this.itemsPerPage)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  mounted() {
    this.fetchBlogArticles()
  },
  methods: {
    async fetchBlogArticles() {
      try {
        this.loading = true
        const response = await api.get('/api/blog/articles')
        this.articles = response.data.articles
        this.featuredArticles = response.data.featuredArticles
      } catch (error) {
        console.error('Error fetching blog articles:', error)
      } finally {
        this.loading = false
      }
    },

    mapCategoryToSlug(category) {
      const categoryMap = {
        'Đầu Tư': 'dau-tu',
        'Phân Tích': 'phan-tich', 
        'Tin Tức': 'tin-tuc',
        'Hướng Dẫn': 'huong-dan',
        'Xu Hướng': 'xu-huong'
      }
      return categoryMap[category] || 'dau-tu'
    },

    initializeData() {
      // Sample articles data
      this.articles = [
        {
          id: 1,
          title: 'Xu Hướng Đầu Tư Cryptocurrency 2024',
          excerpt: 'Phân tích các xu hướng mới nhất trong thị trường tiền điện tử và những cơ hội đầu tư tiềm năng.',
          category: 'dau-tu',
          author: 'Nguyễn Văn A',
          featuredImage: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=250&fit=crop',
          createdAt: new Date('2024-01-15'),
          readTime: 5,
          views: 1250
        },
        {
          id: 2,
          title: 'Phân Tích Kỹ Thuật: Đọc Biểu Đồ Chứng Khoán',
          excerpt: 'Hướng dẫn chi tiết về cách đọc và phân tích biểu đồ chứng khoán cho người mới bắt đầu.',
          category: 'phan-tich',
          author: 'Trần Thị B',
          featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
          createdAt: new Date('2024-01-12'),
          readTime: 8,
          views: 890
        },
        {
          id: 3,
          title: 'Tin Tức Thị Trường: VN-Index Tăng Mạnh',
          excerpt: 'VN-Index đã có phiên tăng mạnh với thanh khoản khủng, tín hiệu tích cực cho thị trường.',
          category: 'tin-tuc',
          author: 'Lê Văn C',
          featuredImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop',
          createdAt: new Date('2024-01-10'),
          readTime: 3,
          views: 2100
        },
        {
          id: 4,
          title: 'Hướng Dẫn Mở Tài Khoản Chứng Khoán',
          excerpt: 'Quy trình mở tài khoản chứng khoán từ A đến Z cho người mới bắt đầu đầu tư.',
          category: 'huong-dan',
          author: 'Phạm Thị D',
          featuredImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
          createdAt: new Date('2024-01-08'),
          readTime: 6,
          views: 1680
        },
        {
          id: 5,
          title: 'Xu Hướng ESG Trong Đầu Tư Hiện Đại',
          excerpt: 'Tìm hiểu về xu hướng đầu tư bền vững ESG và tác động đến thị trường tài chính.',
          category: 'xu-huong',
          author: 'Hoàng Văn E',
          featuredImage: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=250&fit=crop',
          createdAt: new Date('2024-01-05'),
          readTime: 7,
          views: 945
        },
        {
          id: 6,
          title: 'DCA - Chiến Lược Đầu Tư Định Kỳ',
          excerpt: 'Tại sao Dollar Cost Averaging lại là chiến lược đầu tư an toàn cho người mới?',
          category: 'dau-tu',
          author: 'Nguyễn Thị F',
          featuredImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop',
          createdAt: new Date('2024-01-03'),
          readTime: 4,
          views: 1320
        }
      ]
      
      // Featured articles (first 3)
      this.featuredArticles = this.articles.slice(0, 3)
      
      this.sortArticles()
    },
    
    setupMouseTracking() {
      this.trackMouse = (event) => {
        this.mouseX = event.clientX
        this.mouseY = event.clientY
        
        // Robot ở vị trí cố định - chỉ theo dõi mouse để eyes và head theo dõi
      }
      
      document.addEventListener('mousemove', this.trackMouse)
    },
    
    trackMouse(event) {
      this.mouseX = event.clientX
      this.mouseY = event.clientY
      
      // Robot vẫn đứng cố định, không di chuyển theo cursor
      // Chỉ theo dõi mouse để robot eyes có thể nhìn theo
    },
    
    getEyeStyle(eyeOffset) {
      // Robot ở vị trí cố định
      const robotFixedX = window.innerWidth - 100
      const robotFixedY = window.innerHeight - 150
      
      const dx = this.mouseX - (robotFixedX + eyeOffset)
      const dy = this.mouseY - robotFixedY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxMovement = 3
      
      const pupilX = Math.max(-maxMovement, Math.min(maxMovement, (dx / distance) * maxMovement))
      const pupilY = Math.max(-maxMovement, Math.min(maxMovement, (dy / distance) * maxMovement))
      
      return {
        transform: `translate(${pupilX}px, ${pupilY}px)`
      }
    },
    
    startRobotAnimation() {
      // Blinking animation
      setInterval(() => {
        if (!this.isRobotTalking) {
          const eyes = document.querySelectorAll('.robot-eye')
          eyes.forEach(eye => {
            eye.style.animation = 'blink 0.3s ease'
            setTimeout(() => {
              eye.style.animation = ''
            }, 300)
          })
        }
      }, 3000 + Math.random() * 2000)
    },
    
    setupCommunicationCycle() {
      // Auto-show communication every 15 seconds
      setInterval(() => {
        if (!this.showCommunication) {
          this.showRandomCommunication()
        }
      }, 15000)
      
      // Show initial message after delay
      setTimeout(() => {
        this.showRandomCommunication()
      }, 3000)
    },
    
    showRandomCommunication() {
      const messages = [
        '💬 <strong>COMMUNICATION:</strong><br/>Khám phá những bài viết tài chính mới nhất và xu hướng đầu tư!',
        '📈 <strong>MARKET UPDATE:</strong><br/>Theo dõi phân tích thị trường và tin tức chứng khoán mới nhất.',
        '💡 <strong>INVESTMENT TIP:</strong><br/>Đọc hướng dẫn đầu tư từ cơ bản đến nâng cao.',
        '🔍 <strong>ANALYSIS:</strong><br/>Tìm hiểu các phương pháp phân tích kỹ thuật hiệu quả.',
        '🌟 <strong>TRENDING:</strong><br/>Cập nhật xu hướng mới trong thế giới tài chính!',
        '🎯 <strong>FINANCIAL INSIGHTS:</strong><br/>Khám phá những thông tin độc quyền từ chuyên gia tài chính.',
        '⚡ <strong>QUICK TIPS:</strong><br/>Mẹo đầu tư thông minh giúp tối ưu hóa lợi nhuận của bạn.'
      ]
      
      this.isTyping = true
      this.isRobotTalking = true
      this.showCommunication = true
      
      setTimeout(() => {
        this.isTyping = false
        this.communicationMessage = messages[Math.floor(Math.random() * messages.length)]
        
        setTimeout(() => {
          this.isRobotTalking = false
        }, 500)
        
        // Auto hide after 10 seconds
        setTimeout(() => {
          this.hideCommunication()
        }, 10000)
      }, 2500)
    },
    
    toggleCommunication() {
      if (!this.showCommunication) {
        this.showRandomCommunication()
      }
    },
    
    hideCommunication() {
      this.showCommunication = false
      this.isRobotTalking = false
    },
    
    // Article methods
    searchArticles() {
      this.currentPage = 1
    },
    
    filterByCategory(categorySlug) {
      this.selectedCategory = this.selectedCategory === categorySlug ? null : categorySlug
      this.currentPage = 1
    },
    
    getCategoryName(slug) {
      const category = this.categories.find(cat => cat.slug === slug)
      return category ? category.name : 'Tất Cả'
    },
    
    sortArticles() {
      switch (this.sortBy) {
        case 'latest':
          this.articles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          break
        case 'oldest':
          this.articles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          break
        case 'popular':
          this.articles.sort((a, b) => b.views - a.views)
          break
      }
      this.currentPage = 1
    },
    
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.blog-page {
  padding: 2rem 0;
  min-height: 100vh;
  background: var(--bg-primary);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 3rem;
  text-align: center;
  background: linear-gradient(135deg, #000000, #333333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

/* Featured Section */
.featured-section {
  margin-bottom: 4rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.featured-card {
  background: var(--bg-secondary);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.featured-card:hover {
  transform: translateY(-5px);
}

.featured-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.featured-content {
  padding: 1.5rem;
}

.featured-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.featured-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* Categories Section */
.categories-section {
  margin-bottom: 4rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.category-btn:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}

.category-btn.active {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border-color: transparent;
}

.category-btn i {
  font-size: 1.2rem;
}

.count {
  margin-left: auto;
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Articles Section */
.articles-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.search-sort {
  display: flex;
  gap: 1rem;
}

.search-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  min-width: 250px;
}

.sort-select {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.article-card {
  background: var(--bg-secondary);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 1.5rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.article-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.article-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.read-more {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.read-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 3rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-hover);
  transform: translateY(-2px);
}

.pagination-btn.active {
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border-color: transparent;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Interactive Robot */
.interactive-robot {
  position: fixed;
  bottom: 150px;
  right: 100px;
  width: 90px;
  height: 90px;
  z-index: 1000;
  pointer-events: none;
  /* Removed transition to prevent any movement */
}

.robot-body {
  position: relative;
  width: 100%;
  height: 100%;
}

.robot-head {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  border: 3px solid #000000;
  border-radius: 50%;
  position: relative;
  transition: transform 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.robot-eyes {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 12px 0;
}

.robot-eye {
  width: 12px;
  height: 12px;
  background: #000000;
  border-radius: 50%;
  position: relative;
  transition: transform 0.1s ease;
}

.pupil {
  width: 6px;
  height: 6px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform 0.1s ease;
}

.robot-mouth {
  width: 20px;
  height: 3px;
  background: #000000;
  border-radius: 2px;
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.3s ease;
}

.robot-mouth.talking {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #000000;
  animation: talk 0.5s ease-in-out infinite alternate;
}

.robot-antenna {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 15px;
  background: #000000;
}

.antenna-tip {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  animation: blink 2s ease-in-out infinite;
}

/* Communication Bubble - MAIN FEATURE */
.communication-bubble {
  position: absolute;
  top: -140px;
  left: -180px;
  width: 360px;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  color: white;
  border-radius: 20px;
  box-shadow: 
    0 16px 40px rgba(0, 0, 0, 0.4),
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  pointer-events: auto;
  transform: scale(0.7) translateY(30px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 3px solid #ffffff;
  animation: float 3s ease-in-out infinite;
}

.communication-bubble.visible {
  transform: scale(1) translateY(0);
  opacity: 1;
}

.communication-bubble::before {
  content: '';
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  background: linear-gradient(45deg, #ffffff, #cccccc, #ffffff);
  border-radius: 23px;
  z-index: -1;
  animation: glow-pulse 2s ease-in-out infinite alternate;
}

.communication-bubble::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 75%;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid #000000;
  filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.3));
}

.bubble-header {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
  color: #000000;
  padding: 1.2rem 1.5rem;
  border-radius: 17px 17px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #000000;
}

.communication-title {
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: linear-gradient(45deg, #000000, #333333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.close-btn {
  background: linear-gradient(135deg, #000000, #333333);
  border: none;
  color: #ffffff;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.close-btn:hover {
  background: linear-gradient(135deg, #333333, #000000);
  transform: scale(1.1);
}

.bubble-content {
  padding: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
  font-weight: 500;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  border-radius: 0 0 17px 17px;
}

.typing-indicator {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}

.typing-indicator .dot {
  width: 10px;
  height: 10px;
  background: linear-gradient(45deg, #ffffff, #cccccc);
  border-radius: 50%;
  animation: typing 1.4s ease-in-out infinite;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.typing-indicator .dot:nth-child(1) { animation-delay: 0s; }
.typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes talk {
  0% { height: 3px; border-radius: 2px; }
  100% { height: 12px; border-radius: 50%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes typing {
  0%, 80%, 100% { 
    transform: scale(0.8);
    opacity: 0.5; 
  }
  40% { 
    transform: scale(1.3);
    opacity: 1; 
  }
}

@keyframes float {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1) translateY(-5px); }
}

@keyframes glow-pulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .featured-grid,
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .articles-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .search-sort {
    width: 100%;
    flex-direction: column;
  }
  
  .search-input,
  .sort-select {
    width: 100%;
  }
}
</style> 