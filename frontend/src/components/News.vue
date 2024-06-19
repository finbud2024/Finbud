<template>
    <div class="news-section animate__animated animate__fadeIn" :class="{ 'no-interaction': disableClicks }">
      <div class="news-header">
        <h2>Related News</h2>
      </div>
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else class="news-container">
        <div class="news-item animate__animated animate__zoomIn" v-for="news in newsList" :key="news.url" @click="openArticle(news.url)">
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
    name: 'News',
    components: {
      Modal,
    },
    props: {
      disableClicks: Boolean,
      keyword: String,
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
      this.fetchNews(this.keyword);
    },
    watch:{
        keyword(newKeyword){
          this.fetchNews(newKeyword);
        }
    },
    methods: {
      async fetchNews(keyword) {
        console.log("Hello API NEWS");
        try {
          const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
              //a66d9911a3bf4ed2bd636c5e2959253e
                apiKey: "7eac0646bd5d43d0a4d5d5bfd8a3a95c",
                q: keyword,
            },
        });
          console.log("Fetch complete!")
          // console.log(response.data.articles)
          this.newsList = response.data.articles.filter(news => news.title && news.urlToImage);
        } catch (error) {
          console.error('Error fetching news:', error);
        } finally {
          this.loading = false;
        }
      },
      openArticle(url) {
        if (this.disableClicks) return;
        this.currentUrl = url;
        this.showModal = true;
      },
    },
  };
  </script>
  <style scoped>
  @import 'animate.css';
  
  .news-section {
    margin-top: 20px;
    padding: 10px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 50vw;
    position: absolute;
    right: 10px;
  }
  
  .news-header h2 {
    margin: 0;
    font-size: 2rem;
    color: black;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
  }
  
  .news-container {
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding: 10px;
  }
  
  .news-item {
    flex: 0 0 20%;
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
    height: 40%;
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
    color: #666;
  }
  
  .news-header {
    text-align: left;
    margin-bottom: 20px;
  }
  
  .no-interaction {
    pointer-events: none;
    opacity: 0.5;
  }
</style> 