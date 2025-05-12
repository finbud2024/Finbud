<!-- Super Investors: Investors Details -->
<script setup>
import { computed, ref } from 'vue';
import Holdings from '@/components/finManage/superInvestorsPage/Holdings/Holdings.vue';
import Companies from '@/components/finManage/superInvestorsPage/Companies/Companies.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Extract investor ID, name, and profile picture from the route
const investorId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id);
const investorAvatar = computed(() => {
  const avatar = route.query.avatar;
  return Array.isArray(avatar) ? avatar[0] : avatar || "https://via.placeholder.com/100";
});

const investorName = computed(() => {
  const name = route.query.name;
  return (Array.isArray(name) ? name[0] : name) || "Unknown Investor";
});


// Reactive state variable to track which tab is active
const selectedTab = ref('Holding');
</script>

<template>
  <div class="investor-detail-container">
    <!-- Investor Profile Section -->
    <div class="investor-profile">
      <img v-if="investorAvatar" :src="investorAvatar" :alt="investorName" class="investor-avatar">

      <h2>{{ investorName }}</h2>
    </div>

    <!-- Navigation Buttons -->
    <div class="tab-buttons">
      <button @click="selectedTab = 'Holding'" :class="{ active: selectedTab === 'Holding' }">Holdings</button>
      <button @click="selectedTab = 'Companies'" :class="{ active: selectedTab === 'Companies' }">Companies</button>
    </div>

    <!-- Dynamic Component Rendering -->
    <div class="tab-content">
      <Holdings v-if="selectedTab === 'Holding'" :investorId="investorId"/>
      <Companies v-if="selectedTab === 'Companies'" :investorId="investorId" />
    </div>
  </div>
</template>

<style scoped>
.investor-detail-container {
  text-align: center;
  padding: 20px;
}

.investor-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.investor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.tab-buttons {
  display: flex;
  justify-content: center;
  margin: 1rem auto 2rem;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #f8f9fa;
  width: 600px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.tab-buttons button {
  flex: 1;
  padding: 1rem 0;
  border: none;
  background: none;
  font-size: 1.3rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  margin: 0 0.25rem;
  border-radius: 8px;
}

.tab-buttons button:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.tab-buttons button.active {
  color: white;
  background-color: #007bff;
  font-weight: bold;
}

.tab-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
}

@media screen and (max-width: 768px) {
  .tab-buttons {
    width: 90%;
    padding: 0.4rem;
  }

  .tab-buttons button {
    padding: 0.75rem 0;
    font-size: 1.1rem;
  }
}

@media screen and (max-width: 576px) {
  .tab-buttons {
    width: 95%;
    padding: 0.3rem;
  }

  .tab-buttons button {
    padding: 0.5rem 0;
    font-size: 1rem;
    margin: 0 0.15rem;
  }
}
</style>
