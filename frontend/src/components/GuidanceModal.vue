<template>
  <div class="sidebar-overlay" :class="{ 'show': showModal }" @click.self="close">
    <div class="sidebar-content">
      <button class="close-btn" @click="close">X</button>
      <div class="guidance-text">
        <p>Welcome to FinBud! Here are some tips to get started:</p>
        <ul>
          <li>Stock Price Inquiry: Type the stock code in uppercase (e.g., "TSLA").</li>
          <li>Financial Term Definitions: Use "Define" followed by the term (e.g., "define IPO").</li>
          <li>General Financial Concepts & Advices: For general inquiries, use descriptive terms.</li>
          <li>Add your transaction management: Use prompt '#add your_description your_amount' (e.g., "#add Shopping 125")</li>
          <li>Spend your transaction management: Use prompt '#spend your_description your_amount' (e.g., "#spend Shopping 125")</li>
          <li>List of top 5 crypto coins: Use #crypto</li>
          <li>Show 5 random listing of properties: Use #realestate area_name (e.g., "#realestate new york"). If no area is specified, then by default location will be san jose</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GuidanceModal',
  props: {
    showModal: {
      type: Boolean,
      default: false
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
.guidance-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 1s ease;
}

.guidance-btn:hover {
  background-color: #2980b9;
}

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
