<template>
    <aside class="side-bar">
      <div class="sidebar-header">Chat Threads</div>
      <ul class="thread-list">
        <!-- Iterate over chat threads -->
        <li v-for="(thread, index) in threads" :key="index" @click="selectThread(thread)">
          {{ thread.name }}
        </li>
      </ul>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'SideBar',
    props: ['threads'],
    methods: {
      selectThread(thread) {
        // Handle thread selection
        this.$emit('thread-selected', thread);
      }
    }
  };
  </script>
  
  <style scoped>
  .side-bar {
    background-color: #333;
    width: 250px;
    height: 100vh;
    padding: 1rem;
    box-shadow: 3px 0px 10px rgba(0, 0, 0, 0.2);
    color: white;
  }
  
  .sidebar-header {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  
  .thread-list {
    list-style: none;
    padding: 0;
  }
  
  .thread-list li {
    padding: 0.8rem 0;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  
  .thread-list li:hover {
    background-color: #555;
  }
  </style>
  