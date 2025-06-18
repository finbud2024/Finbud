<template>
  <div class="news-detail-container" v-if="article">
    <router-link to="/market-analysis" class="back-button">← Quay lại</router-link>
    <h1 class="news-title">{{ article.title }}</h1>
    <p class="news-description">{{ article.description }}</p>
    <p class="news-meta">
      <span class="news-source">{{ article.sourceId?.name || 'Unknown Source' }}</span>
      -
      {{ new Date(article.createdAt).toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZoneName: 'short'
      }) }}
    </p>
    <div class="news-tags">
      <span v-for="(tag, index) in article.tags" :key="index" class="news-tag">
        {{ tag }}
      </span>
    </div>
    <img :src="article.featuredImage" class="news-image" alt="News Image" v-if="article.featuredImage">
    <p class="news-content" v-html="formattedContent"></p>
  </div>
  <div v-else class="loading">Loading...</div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getNewsById } from '@/services/dailyNewsService';

export default {
  name: 'NewsDetail',
  setup() {
    const route = useRoute();
    const article = ref(null);

    onMounted(async () => {
      const id = route.params.id;
      article.value = await getNewsById(id);
    });

    const formattedContent = computed(() =>
      article.value?.content?.replace(/\n/g, '<br>') || ''
    );

    return {
      article,
      formattedContent,
      route
    };
  }
};
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

.news-description {
  font-size: 18px;
  color: #444;
  margin-bottom: 10px;
  font-style: italic;
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
  background: #222;
  color: #fff;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  margin-right: 6px;
  margin-bottom: 4px;
}

.news-image {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
}

.news-content {
  font-size: 16px;
  line-height: 1.7;
  color: #222;
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #888;
  margin-top: 60px;
}
</style>