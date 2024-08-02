<template>
  <div class="sidebar-overlay" :class="{ 'show': showModal }" @click.self="close">
    <div class="sidebar-content">
      <button class="close-btn" @click="close">x</button>
      <div class="guidance-text">
        <p>Welcome to <span class="brand-name">FinBud</span>! Here are some <span class="command">commands</span> to help you get started:</p>
        <ol class="guidance-list">
          <li> <span class="header-list"> Stock Price Inquiry: </span>
            <br> Enter the stock code in uppercase (e.g., "TSLA").</li>
          <li> <span class="header-list"> Financial Term Definitions: </span>
            <br> <span class="command"> #define term </span> 
            <br> (e.g., "#define IPO")</li>
          <li> <span class="header-list"> List of Top 5 Cryptocurrencies: </span>
            <br> <span class="command">#crypto</span></li>
          <li> <span class="header-list"> Show 5 Properties in area: </span>
              <br> <span class="command">#realestate area_name</span> 
              <br> (e.g., "#realestate new york")
              <br> If no area is specified, the default location will be San Jose.</li>
          <div v-if="authStore.isAuthenticated">
            <li> <span class="header-list"> Add a Transaction: </span>
              <br> <span class="command">#add description_amount</span> 
              <br> (e.g., "#add Shopping 125")</li>
            <li> <span class="header-list"> Track Spending: </span>
              <br> <span class="command">#spend description_amount</span> 
              <br> (e.g. "#spend Shopping 125")</li>
            <li><span class="header-list"> Buy Stock: </span>
              <br> <span class="command">#buy stock_name quantity</span> 
              <br> (e.g., "#buy TSLA 10")</li>
            <li> <span class="header-list"> Sell Stock: </span>
              <br> <span class="command">#sell stock_name quantity</span> 
              <br> (e.g., "#sell TSLA 10")</li>
          </div>
          <li> <span class="header-list">General Financial Concepts & Advice:</span>
            <br> For general inquiries, use descriptive terms.</li>
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
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');
/* ___________________________*/
/* guidance appreance */
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
  font-family: 'Space Grotesk', sans-serif;
}

.sidebar-overlay.show {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-content {
  background: white;
  padding: 20px;
  border-radius: 40px 0 0 15px;
  max-width: 500px;
  width: 25%;
  height: 100%;
  border: 3px solid #007bff;
  overflow: auto;
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
/* ___________________________*/
/* text inside the guidance */

.guidance-text {
  background-color: white;
  margin-bottom: 50px;
  font-size: 0.875rem;
}

.guidance-list{
  margin-left: -40px;
}

.guidance-text ol li {
  padding: 10px;
  border: 2px solid black;
  border-radius: 15px;
  margin: 10px;
}

.guidance-text p {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 10px;
}

.brand-name {
  font-weight: bolder;
  color: #007bff;
}

/*
.guidance-text ol{
  list-style-type: string;
  counter-reset: guidance-number;
}


.guidance-text ol li::before {
  content: counter(guidance-number) ".";
  counter-increment: guidance-number;
}
*/

.command {
  background-color: rgb(0, 123, 255, 0.7);
  padding: 2px 5px;
  border-radius: 5px;
  line-height: 2;
  color: white;
}

.header-list {
  font-weight: bold;
}
/* ___________________________*/
/* rgb 22 27 33 */
</style>
