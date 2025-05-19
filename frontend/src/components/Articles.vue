<template>
    <div class="articles">
      <h1 class="articles-title">Latest News</h1>
  
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <div v-for="article in articles" :key="article._id" class="article-card">
          
          <div class="article-content">
            <img :src="article.featuredImage" alt="Image" v-if="article.featuredImage" class="thumbnail" />
            <div class="text-content">
              <h2>{{ article.title }}</h2>
              <p>{{ article.description }}</p>
              <small>
                Source: {{ article.sourceId?.name || "Unknown" }} | 
                Author: {{ article.authorId?.name || "Unknown" }} | 
                {{ new Date(article.createdAt).toLocaleDateString() }}
              </small>
              <br />
              <a :href="article.url" target="_blank" class="read-more">Read more</a>
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
    max-width: 60%;
    margin: 0 auto;
    padding: 1rem;
  }

  .articles-title {
    color: var(--text-primary);
  }
  .article-content {
    display: flex;
    gap: 1rem; /* Space between the image and text */
    align-items: flex-start; /* Align items at the top */
  }
  
  .article-card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    color: var(--text-primary);
    align-self: center;
  }

  .thumbnail {
    width: 200px; /* Set a fixed width for the image */
    height: 100%; /* Maintain aspect ratio */
    object-fit: cover; /* Ensure the image fits nicely */
    border-radius: 8px; /* Optional: Add rounded corners */

  }
  .text-content {
    flex: 1;
  }
  .read-more {
    color: blue;
    text-decoration: underline;
    margin-left: 10px;
    display: inline-block;
  }
  </style>
  