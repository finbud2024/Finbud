<template>
  <aside class="side-bar">
    <div class="sidebar-header">
      <span>Chat Threads</span>
      <button class="add-thread-btn" @click="addThread()">+</button>
    </div>
    <ul class="thread-list">
      <li v-for="(thread, index) in threads" 
          :key="index" 
          :class="['thread', {clicked: thread.clicked}]"
          @click="handleClick(index)">
        <div v-if="!thread.editing" class="thread-item">
          {{ thread.name }}
          <div class="edit-btn" @click.stop="editThread(index)">
            <font-awesome-icon icon="fa-solid fa-ellipsis" />
          </div>
        </div>
        <input
          v-else
          v-model="thread.editedName"
          @keyup.enter="saveThreadName(thread, index)"
          @blur="enterPressed? enterPressed = false: cancelEdit(index)"
        />
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'SideBar',
  props: ['threads'],
  data()  {
    return{
      enterPressed: false
    };
  },
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
      console.log(this.enterPressed);
      this.enterPressed = true;
      if (thread.editedName.trim()) {
        this.$emit('save-thread-name', { newName: thread.editedName, index });
      } else {
        this.$emit('cancel-edit', index);
      }
    },
    selectThread(index) {
      this.$emit('select-thread', index);
      // Reset the clicked property of all threads
      this.threads.forEach(thread => {
        thread.clicked = false;
      });
      this.threads[index].clicked = true;
    },
    cancelEdit(index) {
      this.enterPressed = false;
      this.$emit('cancel-edit', index);
    },
    handleClick(index) {
      if(event.detail == 1){
        this.selectThread(index);
      }

      if(event.detail == 2){
        this.threads.forEach(thread => {
          thread.editing = false;
        });
        this.editThread(index);
      }
    },
  },
};
</script>

<style scoped>
.side-bar {
  width: 200px;
  background-color: rgb(248, 249, 254);
  padding: 20px;
  height: 100%;
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
  font-size: 1rem;
}

.add-thread-btn {
  cursor: pointer;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.add-thread-btn:hover {
  background-color: #2980b9;
}

.edit-btn {
  color: white;
}

.edit-btn:hover {
  cursor: pointer;
  transition: transform 0.3s;
  transform: scale(1.2);
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
  font-size: 0.875rem;
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

.thread.clicked{
  background-color: #34495e;
  color: white;
}
</style>
