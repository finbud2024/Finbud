<template>
  <section id="main-content">
    <header>
      <h1>Improve your repair efficiency by 25%</h1>
      <p>Detect Auto is an AI-driven analytics platform that makes your shop more profitable.</p>
      <button @click="learnMore">Learn More</button>
    </header>
    <div id="efficiency-chart"></div>
    <div class="feature-icons">
      <div>Compatible with any shop or dealer management software</div>
      <div>Data-driven insights provide actionable steps to improve efficiency</div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MainContent',
  methods: {
    learnMore() {
      // Navigate or scroll to the section
      this.$router.push('/learn-more'); // Make sure you have a route or use a method to scroll to a section
    }
  }
}
</script>

<style scoped>
header {
  background: #f0f0f0;
  text-align: center;
  padding: 50px 20px;
}
h1 {
  color: #333;
}
#main-content {
  display: flex;
  flex-direction: column; /* Changed to column for better vertical alignment */
  padding: 20px;
}
.feature-icons div {
  padding: 10px;
  background: lightblue; /* Example color */
  margin: 10px;
  border-radius: 5px;
}
button {
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: darkgreen;
}
</style>