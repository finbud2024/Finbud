<template>
    <div class="dash-embed">
      <iframe :src="dashUrl" frameborder="0" class="dash-iframe"></iframe>
    </div>
  </template>
  
  <script>
  export default {
     name: 'QuantAnalysis',
    data() {
      return {
        dashUrl: "http://127.0.0.1:8051/" // Ensure this URL matches where your Dash app is running
      };
    }
  };
  </script>
  
  <style scoped>
  .dash-embed {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dash-iframe {
    width: 100%;
    height: 100vh; /* Adjust height as needed */
    border: none;
  }
  </style>
  