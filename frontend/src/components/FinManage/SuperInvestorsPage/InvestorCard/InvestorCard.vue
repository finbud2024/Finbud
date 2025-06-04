<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
// import { defineProps } from 'vue';

const props = defineProps({
  _id: String,
  name: String,
  company: String,
  avatar: String,
  marketValue: String,
  holdingPeriod: String,
  positions: String,
  turnover: String,
  stocks: Array
});

const router = useRouter();
const isLoading = ref(true);

// Navigate to investor detail page with query parameters
const goToInvestorDetail = () => {
  router.push({
    path: `/super-investors/${props._id}`,
    query: {
      name: props.name,
      avatar: props.avatar,
    },
  });
};

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    isLoading.value = false;
  }, Math.random() * 1000 + 500); // Random delay between 500-1500ms
});
</script>

<template>
  <div class="investor-card" @click="goToInvestorDetail">
    <!-- Loading State -->
    <template v-if="isLoading">
      <div class="investor-header">
        <div class="loading loading-avatar"></div>
        <div class="loading-content">
          <div class="loading loading-text loading-text-lg"></div>
          <div class="loading loading-text loading-text-sm"></div>
        </div>
      </div>
      <div class="investor-metrics">
        <div v-for="i in 4" :key="i" class="metric">
          <div class="loading loading-text loading-text-sm"></div>
          <div class="loading loading-text loading-text-sm"></div>
        </div>
      </div>
      <div class="investor-stocks">
        <div v-for="i in 3" :key="i" class="loading stock-badge"></div>
      </div>
    </template>

    <!-- Loaded State -->
    <template v-else>
      <!-- Header with Avatar and Name -->
      <div class="investor-header">
        <img 
          :src="props.avatar" 
          :alt="props.name"
          class="investor-avatar"
        >
        <div>
          <h3 class="investor-name">{{ props.name }}</h3>
          <p class="investor-company">{{ props.company }}</p>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="investor-metrics">
        <div class="metric">
          <span class="metric-label">Market Value:</span>
          <span class="metric-value">{{ props.marketValue }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Holding Period:</span>
          <span class="metric-value">{{ props.holdingPeriod || 'N/A' }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Nr. of Positions:</span>
          <span class="metric-value">{{ props.positions }}</span>
        </div>
        <div class="metric">
          <span class="metric-label">Turnover:</span>
          <span class="metric-value">{{ props.turnover !== undefined ? props.turnover : '—' }}</span>
        </div>
      </div>

      <!-- Stock Tickers -->
      <div class="investor-stocks">
        <span 
          v-for="stock in props.stocks" 
          :key="stock"
          class="stock-badge"
        >
          {{ stock }}
        </span>
      </div>
    </template>
  </div>
</template>

<style scoped src="./InvestorCard.css"></style>
