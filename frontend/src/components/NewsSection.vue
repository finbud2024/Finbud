<template>
  <div class="news-section">
    <div class="news-header">
      <h2>Most Popular</h2>
    </div>
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else class="news-container">
      <div class="news-item" v-for="news in newsList" :key="news.url" @click="openArticle(news.url)">
        <img :src="news.urlToImage" alt="news image" class="news-image">
        <div class="news-title">
          <p>{{ news.title }}</p>
        </div>
      </div>
    </div>
    <Modal v-if="showModal" :show="showModal" :url="currentUrl" @close="showModal = false" />
  </div>
</template>

<script>
import axios from 'axios';
import Modal from './Modal.vue';

export default {
  name: 'NewsSection',
  components: {
    Modal,
  },
  data() {
    return {
      newsList: [],
      loading: true,
      showModal: false,
      currentUrl: '',
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
        // Filter newsList to include only items with both title and urlToImage
        this.newsList = response.data.articles.filter(news => news.title && news.urlToImage);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        this.loading = false;
      }
    },
    openArticle(url) {
      this.currentUrl = url;
      this.showModal = true;
    },
  },
};
</script>

<style scoped>
.news-section {
  margin-top: 20px;
}

.news-container {
  display: flex;
  overflow-x: auto; /* Enable horizontal scrolling */
  gap: 20px;
  padding: 10px;
}

.news-item {
  flex: 0 0 20%; /* Show 5 larger tags initially */
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s, transform 0.3s;
  position: relative;
  background-color: #f8f8f8;
}

.news-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.news-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.news-title {
  background-color: white;
  padding: 10px;
  height: auto;
  position: relative;
  bottom: 0;
  width: auto;
  transition: height 0.3s ease, bottom 0.3s ease;
  font-weight: bold;
}

.news-item:hover .news-title {
  height: 40%; /* Adjust this value to expand over a portion of the news image */
  bottom: 20%;
}

.news-title p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  color: #333;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
}

.news-header {
  text-align: left;
}
</style>
