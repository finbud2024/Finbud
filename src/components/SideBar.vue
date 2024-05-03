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
        // Handle adding a new thread
        this.threads.push({
          name: 'New Thread',
          editing: false,
          editedName: 'New Thread'
        });
      },
      editThread(index) {
        // Set the thread to editing mode
        this.$set(this.threads[index], 'editing', true);
      },
      saveThreadName(thread, index) {
        if (thread.editedName.trim()) {
          this.$set(this.threads[index], 'name', thread.editedName);
        }
        this.$set(this.threads[index], 'editing', false);
      }
    }
  };
  </script>
  
  <style scoped>
  .side-bar {
    /* styles */
  }
  .add-thread-btn {
    /* styles */
  }
  .edit-btn {
    /* styles */
  }
  .thread-list input {
    /* styles for the input field */
  }
  </style>
  