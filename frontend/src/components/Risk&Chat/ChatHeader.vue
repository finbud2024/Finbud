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
    background: var(--bg-secondary);
    color: var(--text-primary);
    padding: 20px;
    text-align: center;
    font-size: 1.5rem;
    box-shadow: var(--shadow-sm);
    border-bottom: 1px solid var(--border-color);
    transition: all 0.3s ease;
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(8px);
  }
  
  .chat-header:hover {
    background: var(--bg-tertiary);
  }
  
  h1 {
    margin: 0;
    padding: 10px 0;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    animation: fadeInDown 0.5s ease-in-out;
  }
  
  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    .chat-header {
      padding: 16px;
      font-size: 1.2rem;
    }
    
    h1 {
      font-size: 1.2rem;
    }
  }
  </style>
  