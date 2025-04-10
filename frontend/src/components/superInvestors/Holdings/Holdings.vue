<template>
  <div class="holdings-container">
    <div class="quarter-selection">
      <span class="quarter-label">Go to:</span>
      <select v-model="selectedQuarter">
        <option v-for="quarter in availableQuarters" :key="quarter" :value="quarter">
          {{ quarter }}
        </option>
      </select>
    </div>
    
    <!-- Pass fetched Basic Stats & Industry Breakdown separately -->
    <InvestorStats 
      v-if="basicStats !== null && industryBreakdown !== null" 
      :basicStats="basicStats" 
      :industryBreakdown="industryBreakdown" 
    />
    
    <!-- Pass stock holdings to StockHoldings -->
    <StockHoldings v-if="stocks.length > 0" :stocks="stocks" />
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch, computed } from 'vue';
import InvestorStats from '../InvestorStats/InvestorStats.vue';
import StockHoldings from '../StockHoldings/StockHoldings.vue';
import { getDistinctQuarters, fetchInvestorData } from '@/services/investorService';

const props = defineProps({
  investorId: String
});

// Reactive states
const selectedQuarter = ref('');
const availableQuarters = ref([]);
const investorData = ref(null);

// Computed properties for child components
const basicStats = computed(() => {
  return investorData.value?.['Basic Stats'] || null;
});

const industryBreakdown = computed(() => {
  return investorData.value?.['Industry Breakdown'] || null;
});

const stocks = computed(() => {
  return investorData.value?.marketValue || [];
});

// Fetch available quarters
const loadAvailableQuarters = async () => {
  if (!props.investorId) return;

  try {
    const data = await getDistinctQuarters(props.investorId);
    availableQuarters.value = data.quarters || [];

    // Set default to the latest quarter
    if (availableQuarters.value.length > 0) {
      selectedQuarter.value = availableQuarters.value[0];
    }
  } catch (error) {
    console.error("Failed to load available quarters", error);
  }
};

// Fetch all investor data
const loadInvestorData = async () => {
  if (!props.investorId || !selectedQuarter.value) return;

  try {
    const data = await fetchInvestorData(props.investorId, selectedQuarter.value);
    console.log("Fetched Investor Data:", data);
    investorData.value = data;
  } catch (error) {
    console.error("Failed to load investor data", error);
  }
};

// Watch for quarter changes and update data
watch(selectedQuarter, async () => {
  await loadInvestorData();
});

// Initial load
onMounted(async () => {
  await loadAvailableQuarters();
  await loadInvestorData();
});
</script>

<style scoped>
.holdings-container {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.05);
}

.quarter-selection {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  gap: 10px;
}

.quarter-label {
  font-size: 1.1rem;
  color: #374151;
  font-weight: 500;
  display: flex;
  align-items: center;
  height: 100%;
  line-height: 1;
}

select {
  padding: 10px 20px;
  font-size: 1.1rem;
  border-radius: 8px;
  background-color: white;
  color: #374151;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 300px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  height: 45px;
  line-height: 1;
}

select:hover {
  border-color: #3b82f6;
}

select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
</style>
