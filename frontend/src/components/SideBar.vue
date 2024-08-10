<template>
  <aside class="side-bar">
    <div class="sidebar-header">
      <span>Chat Threads</span>
      <button class="add-thread-btn" @click="addThread()">+</button>
    </div>
    <ul class="thread-list">
      <li v-for="(thread, index) in threads" 
          :key="index" 
          :class="['thread', {clicked: thread.clicked}]">
        <div class="thread-item">
          <span v-if="!thread.editing" @click="selectThread(index)">
            {{ thread.name }}
          </span>
          <input
            v-else
            v-model="thread.editedName"
            :ref="'threadInput-' + index"
            @keyup.enter="saveThreadName(thread, index)"
            @blur="handleBlur(thread, index)"
          />
          <div class="thread-actions">
            <div class="edit-btn" @click.stop="toggleDropdown(index)">
              <font-awesome-icon icon="fa-solid fa-ellipsis" />
            </div>
            <div v-if="isDropdownVisible(index)" class="dropdown-menu" ref="dropdowns">
              <div class="dropdown-item" @click="confirmDelete(index)">Delete</div>
              <div class="dropdown-item" @click="editThread(index)">Rename</div>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <!-- Confirmation Popup -->
    <div v-if="confirmDialogVisible" class="confirmation-popup">
      <div class="popup-content">
        <p>Are you sure you want to delete this thread?</p>
        <button @click="deleteConfirmed">Yes</button>
        <button @click="cancelDelete">No</button>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  name: "SideBar",
  props: ["threads"],
  data() {
    return {
      enterPressed: false,
      visibleDropdownIndex: null,
      confirmDialogVisible: false,
      threadToDelete: null,
    };
  },
  methods: {
    addThread() {
      this.$emit("add-thread", {
        name: "New Thread",
        editing: false,
        editedName: "New Thread",
        messages: [],
      });
    },
    editThread(index) {
      this.threads[index].editing = true;
      this.visibleDropdownIndex = null;
      this.$nextTick(() => {
        const input = this.$refs["threadInput-" + index][0];
        if (input) {
          input.focus();
          const length = input.value.length;
          input.setSelectionRange(length, length);
        }
      });
    },
    saveThreadName(thread, index) {
      this.enterPressed = true;
      if (thread.editedName.trim()) {
        this.$emit("save-thread-name", { newName: thread.editedName, index });
      } else {
        this.$emit("cancel-edit", index);
      }
      thread.editing = false;
    },
    selectThread(index) {
      this.$emit("select-thread", index);
      this.threads.forEach((thread) => {
        thread.clicked = false;
      });
      this.threads[index].clicked = true;
      this.visibleDropdownIndex = null;
    },
    confirmDelete(index) {
      this.threadToDelete = index;
      this.confirmDialogVisible = true;
      this.visibleDropdownIndex = null;
    },
    deleteConfirmed() {
      if (this.threadToDelete !== null) {
        this.$emit("delete-thread", this.threadToDelete);
        this.threadToDelete = null;
      }
      this.confirmDialogVisible = false;
    },
    cancelDelete() {
      this.confirmDialogVisible = false;
      this.threadToDelete = null;
    },
    toggleDropdown(index) {
      this.visibleDropdownIndex =
        this.visibleDropdownIndex === index ? null : index;
    },
    isDropdownVisible(index) {
      return this.visibleDropdownIndex === index;
    },
    closeDropdown() {
      this.visibleDropdownIndex = null;
    },
    cancelEdit(index) {
      this.enterPressed = false;
      this.$emit('cancel-edit', index);
    },
    handleBlur(thread, index) {
      if (!this.enterPressed) {
        this.cancelEdit(index);
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
  font-size: 1.5rem;
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

.thread-actions {
  display: flex;
  align-items: center;
  position: relative;
}

.edit-btn,
.delete-btn {
  color: black;
  margin-left: 5px;
}

.edit-btn:hover,
.delete-btn:hover {
  cursor: pointer;
  transition: transform 0.3s;
  transform: scale(1.2);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  color: black;
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f1f1f1;
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

.thread.clicked {
  background-color: #34495e;
  color: white;
}

/* Confirmation Popup */
.confirmation-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.popup-content p {
  margin-bottom: 20px;
}

.popup-content button {
  margin: 0 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  transition: background-color 0.3s;
}

.popup-content button:hover {
  background-color: #0056b3;
}
</style>
