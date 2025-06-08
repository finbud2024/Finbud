<template>
    <div class="articles">
      <h1 class="articles-title">Latest News</h1>
  
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <p>Loading articles...</p>
      </div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="articles-grid">
        <div v-for="article in articles" :key="article._id" class="article-card">
          <div class="article-content">
            <img :src="article.featuredImage" alt="Image" v-if="article.featuredImage" class="thumbnail" />
            <div class="text-content">
              <h2 class="article-title">{{ article.title }}</h2>
              <p class="article-description">{{ article.description }}</p>
              <div class="article-meta">
                <span class="meta-item">Source: {{ article.sourceId?.name || "Unknown" }}</span>
                <span class="meta-separator">|</span>
                <span class="meta-item">Author: {{ article.authorId?.name || "Unknown" }}</span>
                <span class="meta-separator">|</span>
                <span class="meta-item">{{ new Date(article.createdAt).toLocaleDateString() }}</span>
              </div>
              <a :href="article.url" target="_blank" class="read-more">
                Read more
                <i class="fas fa-external-link-alt"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import api from '@/utils/api'
  
  const articles = ref([])
  const loading = ref(true)
  const error = ref(null)
  
  onMounted(async () => {
  try {
    const res = await api.get('/api/articles', { withCredentials: true })
    articles.value = res.data
  } catch (err) {
    error.value = err.message || "Failed to load articles"
    
    // Add more detailed error logging
    if (err.response) {
      console.error("Server responded with error:", err.response.status);
      console.error("Error data:", err.response.data);
      error.value = `Error ${err.response.status}: ${err.response.data.error || err.message}`;
    }
  } finally {
    loading.value = false
  }
})
  </script>
  
  <style scoped>
  .articles {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .articles-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 2rem;
    text-align: center;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--bg-secondary);
    border-left-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loading p {
    margin-top: 1rem;
    color: var(--text-secondary);
  }

  .error {
    color: var(--error);
    text-align: center;
    padding: 2rem;
    background: var(--bg-secondary);
    border-radius: 10px;
    margin: 2rem 0;
  }

  .articles-grid {
    display: grid;
    gap: 2rem;
  }

  .article-card {
    background: var(--bg-secondary);
    border-radius: 15px;
    overflow: hidden;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid var(--border-color);
  }

  .article-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  .article-content {
    display: flex;
    gap: 2rem;
    padding: 1.5rem;
  }

  .thumbnail {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 10px;
    flex-shrink: 0;
  }

  .text-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .article-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
  }

  .article-description {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: var(--text-tertiary);
  }

  .meta-item {
    color: var(--text-secondary);
  }

  .meta-separator {
    color: var(--border-color);
  }

  .read-more {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-top: auto;
    width: fit-content;
  }

  .read-more:hover {
    transform: translateX(5px);
  }

  .read-more i {
    font-size: 0.9rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .articles {
      padding: 1rem;
    }

    .articles-title {
      font-size: 2rem;
    }

    .article-content {
      flex-direction: column;
      gap: 1rem;
    }

    .thumbnail {
      width: 100%;
      height: 200px;
    }
  }
  </style>
  