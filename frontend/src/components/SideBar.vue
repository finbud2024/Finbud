<template>
  <aside class="side-bar">
    <div class="sidebar-header">
      <span>Chat Threads</span>
      <button class="add-thread-btn" @click="addThread">+</button>
    </div>
    <ul class="thread-list">
      <li v-for="(thread, index) in threads" :key="index" @click="selectThread(index)">
        <div v-if="!thread.editing" class="thread-item">
          {{ thread.name }}
          <button class="edit-btn" @click.stop="editThread(index)">Edit</button>
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
        editedName: 'New Thread',
        messages: []
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
    },
    selectThread(index) {
      this.$emit('select-thread', index);
    }
  }
};
</script>

<style scoped>
.side-bar {
  width: 300px;
  background-color: #f9f3f3;
  padding: 20px;
  height: 94vh;
  overflow-y: auto;
  color: black;
}

.sidebar-header {
  font-weight: bold;
  padding-bottom: 15px;
  border-bottom: 1px solid #34495e;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.2em;
}

.add-thread-btn,
.edit-btn {
  cursor: pointer;
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-thread-btn:hover,
.edit-btn:hover {
  background-color: #2980b9;
}

.thread-list {
  list-style-type: none;
  padding: 0;
}

.thread-list li {
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.thread-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thread-list li:hover {
  color: white;
  cursor: pointer;
  background-color: #34495e;
}

.thread-list input {
  width: 80%;
  padding: 8px;
  border: 1px solid #34495e;
  border-radius: 5px;
  background-color: #ecf0f1;
  color: #2c3e50;
}
</style>
