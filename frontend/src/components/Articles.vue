<template>
    <div class="articles">
      <h1>Latest News</h1>
  
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <div v-else>
        <div v-for="article in articles" :key="article._id" class="article-card">
          <img :src="article.featuredImage" alt="Image" v-if="article.featuredImage" class="thumbnail" />
          <h2>{{ article.title }}</h2>
          <p>{{ article.description }}</p>
          <small>
            Source: {{ article.sourceId?.name || "Unknown" }} | 
            Author: {{ article.authorId?.name || "Unknown" }} | 
            {{ new Date(article.createdAt).toLocaleDateString() }}
          </small>
          <a :href="article.url" target="_blank" class="read-more">Read more</a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  const articles = ref([])
  const loading = ref(true)
  const error = ref(null)
  
  onMounted(async () => {
    try {
      const res = await axios.get('/api/articles') // adjust if backend URL is different
      articles.value = res.data
    } catch (err) {
      error.value = err.message || "Failed to load articles"
    } finally {
      loading.value = false
    }
  })
  </script>
  
  <style scoped>
  .articles {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }
  .article-card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
  }
  .thumbnail {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    margin-bottom: 1rem;
  }
  .read-more {
    color: blue;
    text-decoration: underline;
  }
  </style>
  