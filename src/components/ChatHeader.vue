<template>
  <div class="chat-header">
    <h1>FINBUD - FINANCIAL BUDDY</h1>
  </div>
</template>

<script>
export default {
  props: {
    threadId: {
      type: [String, Number],
      default: ''
    }
  },
  mounted() {
    console.log('ChatHeader mounted with thread ID:', this.threadId);
  },
  watch: {
    threadId(newValue, oldValue) {
      console.log(`threadId changed from ${oldValue} to ${newValue}`);
    }
  }
};
</script>

<style scoped>
.chat-header {
  background-image: linear-gradient(to right, #3541c9, #3340b2);
  color: #ecf0f1;
  padding: 20px;
  text-align: center;
  font-size: 1.5em;
  font-weight: bold;
  border-bottom: 2px solid #2980b9;
}

.chat-header:hover {
  background-image: linear-gradient(to right, #3541c9, #3340b2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

h1, h2 {
  margin: 0;
  padding: 10px 0;
  animation: fadeInDown 1s ease-in-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
