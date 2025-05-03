<script setup>
import { useRouter } from 'vue-router';
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
</script>

<template>
  <div class="investor-card" @click="goToInvestorDetail">
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
  </div>
</template>

<style scoped src="./InvestorCard.css"></style>
