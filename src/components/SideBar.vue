<template>
    <aside class="side-bar">
      <div class="sidebar-header">
        Chat Threads
        <button class="add-thread-btn" @click="addThread">+</button>
      </div>
      <ul class="thread-list">
        <li v-for="(thread, index) in threads" :key="index">
          <div v-if="!thread.editing">
            {{ thread.name }}
            <button class="edit-btn" @click="editThread(index)">Edit</button>
          </div>
          <input
            v-else
            v-model="thread.editedName"
            @blur="saveThreadName(thread, index)"
            @keyup.enter="saveThreadName(thread, index)"
          />
        </li>
      </ul>
    </aside>
  </template>
  
  <script>
  export default {
    name: 'SideBar',
    props: ['threads'],
    methods: {
      addThread() {
        this.$emit('add-thread', {
          name: 'New Thread',
          editing: false,
          editedName: 'New Thread'
        });
      },
      editThread(index) {
        this.$emit('edit-thread', index);
      },
      saveThreadName(thread, index) {
        if (thread.editedName.trim()) {
          this.$emit('save-thread-name', { newName: thread.editedName, index });
        } else {
          this.$emit('cancel-edit', index);
        }
      }
    }
  };
  </script>
  <style scoped>
  .side-bar {
    width: 250px; /* Fixed width */
    background-color: #f4f4f4; /* Light grey background */
    padding: 10px; /* Padding around the content */
    height: 100vh; /* Full height of the viewport */
    box-shadow: 2px 0 5px rgba(0,0,0,0.1); /* Subtle shadow on the right */
    overflow-y: auto; /* Allows scrolling */
  }
  
  .sidebar-header {
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc; /* Separator */
    margin-bottom: 10px; /* Space below the header */
  }
  
  .add-thread-btn,
  .edit-btn {
    cursor: pointer; /* Pointer cursor on hover */
    padding: 5px 10px; /* Padding around the button text */
    background-color: #007BFF; /* Bootstrap primary blue */
    color: white; /* White text */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    margin-left: 5px; /* Space from the left */
  }
  
  .add-thread-btn:hover,
  .edit-btn:hover {
    background-color: #0056b3; /* Darker blue on hover */
  }
  
  .thread-list {
    list-style-type: none; /* Removes bullets */
    padding: 0; /* Removes padding */
  }
  
  .thread-list li {
    padding: 10px 0; /* Padding above and below each item */
    border-bottom: 1px solid #ccc; /* Separator between items */
  }
  
  .thread-list input {
    width: 100%; /* Full width of the container */
    padding: 5px; /* Padding inside the input box */
    border: 1px solid #ccc; /* Border around the input */
    border-radius: 3px; /* Slightly rounded corners for the input box */
  }
  </style>
  