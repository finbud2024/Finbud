<template>
  <div class="vnexpress-articles">
    <h1>VnExpress Articles</h1>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading articles...</p>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-for="category in categories" :key="category.name" class="category">
      <h2>{{ category.name }}</h2>
      <div class="articles-grid">
        <div v-for="(article, index) in category.articles" :key="index" class="article-card">
          <a :href="article.url" target="_blank" rel="noopener" class="article-link">
            <div class="image-container" v-if="article.image">
              <img :src="article.image" :alt="article.title" @error="handleImageError" />
            </div>
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <div class="article-meta">
                <span class="source">VnExpress</span>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VnExpressArticles',
  data() {
    return {
      loading: false,
      error: null,
      categories: [],
      apiUrl: 'https://2adgc662yl.execute-api.us-east-2.amazonaws.com/prod/scrape'
    }
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.success && data.result.categories) {
          this.categories = data.result.categories;
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        this.error = `Failed to load articles: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    handleImageError(event) {
      // Fallback to a placeholder image if the article image fails to load
      event.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
    }
  }
}
</script>

<style scoped>
.vnexpress-articles {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.2rem;
}

.category {
  margin-bottom: 40px;
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

h2 {
  color: #000000; /* VnExpress red color */
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.article-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.article-link {
  display: block;
  color: inherit;
  text-decoration: none;
}

.image-container {
  height: 180px;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .image-container img {
  transform: scale(1.05);
}

.article-content {
  padding: 15px;
}

.article-title {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  line-height: 1.4;
  color: #333;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
}

.source {
  color: #000000; /* VnExpress red color */
  font-weight: bold;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
}

.loading {
  color: #666;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #000000;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #000000;
  background: #fdecea;
}

.refresh-btn {
  display: block;
  margin: 0 auto 30px;
  padding: 12px 25px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s, transform 0.2s;
}

.refresh-btn:hover {
  background: #000000;
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .vnexpress-articles {
    padding: 15px;
  }
  
  h1 {
    font-size: 1.8rem;
  }
  
  h2 {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .image-container {
    height: 150px;
  }
}
</style>