<template>
  <div class="news-detail-container">
    <router-link to="/market-analysis" class="back-button">← Quay lại</router-link>

    <!-- Title -->
    <h1 class="news-title">{{ article.title }}</h1>

    <!-- Source + Datetime -->
    <p class="news-meta">
      <span class="news-source">{{ article.source }}</span> - {{ article.datetime }}
    </p>

    <!-- Tags -->
    <div class="news-tags">
      <span v-for="(tag, index) in article.tags" :key="index" class="news-tag">
        {{ tag }}
      </span>
    </div>

    <!-- Image -->
    <img :src="article.link" class="news-image" alt="News Image">

    <!-- Content -->
    <p class="news-content" v-html="formattedContent"></p>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import rawData from './marketAnalysis.json'

export default {
  name: 'NewsDetailPage',
  setup() {
    const route = useRoute()
    const articleId = route.params.id

    const newsList = rawData.AI_News.AI_News
    const article = ref(newsList.find(item => item.id === articleId))

    const formattedContent = computed(() =>
      article.value.content.replace(/\n/g, '<br>')
    )

    return {
      article,
      formattedContent
    }
  }
}
</script>

<style scoped>
.news-detail-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 24px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  color: #2c3e50;
}

.back-button {
  text-decoration: none;
  color: #000;
  font-weight: 700;
  font-size: 15px;
  display: inline-block;
  margin-bottom: 20px;
}

.news-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 10px;
}

.news-meta {
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
}

.news-source {
  font-weight: bold;
  color: black;
}

.news-tags {
  margin-bottom: 20px;
}

.news-tag {
  display: inline-block;
  background-color: #000;
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 5px;
  font-style: italic;
}

.news-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 6px;
  margin: 20px 0;
}

.news-content {
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}
</style>