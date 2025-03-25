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
    /* background-image: linear-gradient(to right,#7BDBBF, #7BDBBF); */
    /* color: #ecf0f1; */
    padding: 20px;
    text-align: center;
    font-size: 1.5rem;
    /* background-image: linear-gradient(to right, #7BDBBF, #7BDBBF); */
    color: white;
    box-shadow: 2 2px 10px rgba(0, 0, 0, 0.1);
    /* border-bottom: 3px solid #86807f; */
    padding: 20px 0;
    transition: background-image 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
  }
  
  .chat-header:hover {
    /* background-image: linear-gradient(to right, #7BDBBF, #7BDBBF); */
    box-shadow: 2 4px 20px rgba(0, 0, 0, 0.2);
    color: #f4f1f1;
    transition: color 0.5s ease-in-out;
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
  
  @media (max-width: 768px) {
    .chat-header {
      font-size: 1rem;
      padding: 10px;
    }
  }
  </style>
  