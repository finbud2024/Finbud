<template>
    <div class="sidebar-overlay" :class="{ 'show': showModal }" @click.self="close">
      <div class="iframe" > 

      </div>
    </div>
  </template>
  
  <script>
  import authStore from '@/authStore';
  export default {
    name: 'ChatViewiFrame',
    props: {
      showModal: {
        type: Boolean,
        default: false
      },
      htmlContent: ''
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
    justify-content: center;
    align-items: center;
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

  .iframe{
    height: 80%;
    width: 80%;
    
    border: 2px solid red;
  }

  
  
  </style>
  