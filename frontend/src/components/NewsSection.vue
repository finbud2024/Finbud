<template>
    <div class="news-section">
      <h2>Most Popular</h2>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else>
        <div class="news-item" v-for="news in newsList" :key="news.url">
          <img :src="news.urlToImage" alt="news image" class="news-image" v-if="news.urlToImage">
          <p>{{ news.title }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'NewsSection',
    data() {
      return {
        newsList: [],
        loading: true,
      };
    },
    mounted() {
      this.fetchNews();
    },
    methods: {
      async fetchNews() {
        try {
          const response = await axios.get('https://newsapi.org/v2/top-headlines', {
            params: {
              apiKey: process.env.VUE_APP_NEWS_API_KEY, // Use environment variable
              category: 'business',
              country: 'us',
            },
          });
          this.newsList = response.data.articles;
        } catch (error) {
          console.error('Error fetching news:', error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .news-section {
    margin-top: 20px;
  }
  
  .news-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .news-image {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
  
  .loading {
    text-align: center;
    font-size: 1.5rem;
  }
  </style>
  