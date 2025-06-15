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