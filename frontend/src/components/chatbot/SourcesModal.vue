<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal">
        <button class="close-btn" @click="close">×</button>
        <h3>All Sources</h3>
        <div v-for="(source, idx) in sources" :key="idx" class="source" @click="openSource(source.link)">
          <p>{{ source.title }}</p>
          <div class="host-container">
            <img :src="source.favicon" alt="favicon" class="favicon"/>
            <p>{{ source.host }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      sources: {
        type: Array,
        required: true
      }
    },
    methods: {
      openSource(link) {
        window.open(link, '_blank');
      },
      close() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure the overlay is on top */
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    max-height: 80%;
    overflow-y: auto;
    z-index: 1001; /* Ensure the modal is on top of the overlay */
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
  
  .source {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    transition: box-shadow 0.3s ease;
  }
  
  .source:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .host-container {
    display: flex;
    align-items: center;
    margin-top: 5px;
  }
  
  .favicon {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
  </style>