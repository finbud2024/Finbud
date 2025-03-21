<template>
    <button class="styled-button">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: 'StyledButton'
  }
  </script>
  
  <style scoped>
  .styled-button {
    background: linear-gradient(135deg, #6a11cb, #2575fc);
    border: none;
    border-radius: 25px;
    padding: 0.75rem 1.5rem;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: inline-block;
  }
  
  .styled-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  </style>
  