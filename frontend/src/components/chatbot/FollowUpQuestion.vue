<template>
    <div>
      <h2>Follow-up Questions</h2>
      <ul>
        <li v-for="question in questions" :key="question">{{ question }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      questions: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: disc;
    padding-left: 20px;
  }
  </style>
  