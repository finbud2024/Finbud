<template>
  <div class="sidebar-overlay" :class="{ 'show': showModal }" @click.self="close">
    <div class="sidebar-content">
      <button class="close-btn" @click="close">X</button>
      <div class="guidance-text">
        <p>Welcome to FinBud! Here are some tips to help you get started:</p>
        <ol>
          <li>Stock Price Inquiry: Enter the stock code in uppercase (e.g., "TSLA").</li>
          <li>Financial Term Definitions: Type "#define" followed by the term (e.g., "#define IPO").</li>
          <li>General Financial Concepts & Advice: For general inquiries, use descriptive terms.</li>
          <li>List of Top 5 Cryptocurrencies: Use the command "#crypto".</li>
          <li>Show 5 Random Property Listings: Use the command "#realestate area_name" (e.g., "#realestate new york"). If no area is specified, the default location will be San Jose.</li>
          <div v-if="authStore.isAuthenticated">
            <li>Add a Transaction: Use the prompt '#add description amount' (e.g., "#add Shopping 125").</li>
            <li>Track Spending: Use the prompt '#spend description amount' (e.g., "#spend Shopping 125").</li>
            <li>Buy Stock: Use the prompt '#buy stock_name quantity' (e.g., "#buy TSLA 10").</li>
            <li>Sell Stock: Use the prompt '#sell stock_name quantity' (e.g., "#sell TSLA 10").</li>
          </div>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import authStore from '@/authStore';
export default {
  name: 'GuidanceModal',
  props: {
    showModal: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    authStore() {
      return authStore;
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
};
</script>
<style scoped>

.sidebar-overlay {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 1000;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.3s, opacity 0.3s ease-in-out;
}

.sidebar-overlay.show {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-content {
  background: white;
  padding: 20px;
  border-radius: 8px 0 0 8px;
  max-width: 500px;
  width: 80%;
  height: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
}

.sidebar-overlay.show .sidebar-content {
  transform: translateX(0);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.guidance-text {
  margin-top: 20px;
}
</style>
