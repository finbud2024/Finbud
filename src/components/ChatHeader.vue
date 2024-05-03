<template>
    <div class="chat-header">
      <h1>FINBUD - FINANCIAL BUDDY</h1>
      <h2>Thread ID: {{ threadId }}</h2> <!-- Display the threadId here -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      threadId: {
        type: [String, Number], // Accept both string and number types
        default: '' // Default to an empty string if not provided
      },
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
    text-align: center;
    font-size: 1.5rem;
    font-family: 'Helvetica Neue', sans-serif;
    background-image: linear-gradient(to right, #6dd5ed, #2193b0);
    color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-bottom: 3px solid #1e81b0;
  }
  </style>