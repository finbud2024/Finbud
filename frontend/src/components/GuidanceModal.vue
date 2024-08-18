<template>
  <div class="sidebar-overlay" :class="{ 'show': showModal }" @click.self="close">
    <div class="sidebar-content">
      <button class="close-btn" @click="close">x</button>
      <div class="guidance-text">
        <p>Welcome to <span class="brand-name">FinBud</span>! Here are some <span class="command">commands</span> to help you get started:</p>
        <ol class="guidance-list">
          <!-- guidance for general users -->
          <li v-for="(item, index) in generalGuidanceList" :key="index">
            <span class="header-list">{{ item.header }}</span>
            <div v-if="item.command" class="command-container">
              <span class="command">{{ item.command }}</span>
            </div>
            <div v-if="item.instruction">{{ item.instruction }}.</div>
            <div v-if="item.example">(e.g. "{{ item.example }}").</div>
            <div v-if="item.additionalInfo">{{ item.additionalInfo }}.</div>
          </li>
          <!-- guidance for authenticated users -->
          <div v-if="authStore.isAuthenticated">
            <li v-for="(item, index) in userGuidanceList" :key="index">
              <span class="header-list">{{ item.header }}</span>
              <div v-if="item.command" class="command-container">
                <span class="command">{{ item.command }}</span>
              </div>
              <div v-if="item.instruction">{{ item.instruction }}.</div>
              <div v-if="item.example">(e.g. "{{ item.example }}").</div>
            </li>
          </div>
          <!-- this one always at last regardless of user status -->
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
  data() {
    return {
      generalGuidanceList: [
        {
          header: "Stock Price Inquiry",
          command: null,
          instruction: "Enter the stock code in uppercase",
          example: "TSLA"
        },
        {
          header: "Financial Term Definitions",
          command: "#define term",
          instruction: null,
          example: "#define IPO"
        },
        {
          header: "List of Top 5 Cryptocurrencies",
          command: "#crypto",
          instruction: null,
          example: null
        },
        {
          header: "Show 5 Properties in area",
          command: "#realestate area_name",
          example: "#realestate new york",
          additionalInfo: "If no area is specified, the default location will be San Jose."
        }
      ],
      userGuidanceList: [
        {
          header: "Add a Transaction",
          command: "#add description_amount",
          example: "#add Shopping 125"
        },
        {
          header: "Track Spending",
          command: "#spend description_amount",
          example: "#spend Shopping 125"
        },
        {
          header: "Buy Stock",
          command: "#buy stock_name quantity",
          example: "#buy TSLA 10"
        },
        {
          header: "Sell Stock",
          command: "#sell stock_name quantity",
          example: "#sell TSLA 10"
        }
      ]
    };
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
}

.sidebar-overlay.show {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-content {
  background: white;
  padding: 20px;
  border-radius: 40px 0 0 40px;
  max-width: 500px;
  width: 25%;
  height: 80%;
  margin-top: 7%;
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
  margin-bottom: 30px;
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

.guidance-text ol{
  list-style-type: none;
  counter-reset: guidance-number;
}


.guidance-text ol li::before {
  content: counter(guidance-number) ". ";
  counter-increment: guidance-number;
  font-weight: bold;
}

.guidance-text ol li:hover{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.command {
  background-color: rgb(0, 123, 255, 0.7);
  padding: 2px 5px;
  border-radius: 5px;
  line-height: normal;
  color: white;
  text-align: center;
}

.header-list {
  font-weight: bold;
}

.command-container {
  text-align: center;
  margin: 10px 0;
}

/* ___________________________*/
/* Media queries */
@media (max-width: 768px) {
  .sidebar-content {
    width: 80%;
    position: absolute;
    bottom: 6%;
  }
}
</style>
