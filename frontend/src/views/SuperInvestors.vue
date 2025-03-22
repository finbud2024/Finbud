<script setup>
import { ref, onMounted } from 'vue';
import InvestorCard from '@/components/superInvestors/InvestorCard/InvestorCard.vue';
import { getInvestors } from '@/services/investorService';

const investors = ref([]);

onMounted(async () => {
  try {
    const rawInvestors = await getInvestors();
    investors.value = rawInvestors;
  } catch (error) {
    console.error("Failed to fetch investors:", error);
  }
});
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="title">Super Investors</h1>
    </div>

    <!-- Investors Grid -->
    <div class="investors-grid">
      <InvestorCard
        v-for="investor in investors"
        :key="investor._id"
        :_id="investor._id"
        :name="investor.name"
        :company="investor.company"
        :avatar="investor.profileURL"
        :marketValue="investor.marketValue"
        :holdingPeriod="investor.holdingPeriod || 'N/A'"
        :positions="investor.positions"
        :turnover="investor.turnover ? investor.turnover : 'N/A'"
        :stocks="investor.stocks"
      />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
}

.investors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}
</style>
