<template>
  <aside class="side-bar">
    <div class="sidebar-header">
      <span>Chat Threads</span>
    </div>
    <button class="add-thread-btn" @click="addThread()">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
    <ul class="thread-list">
      <li v-for="(thread, index) in threads" :key="index" :class="['thread', { clicked: thread.clicked }]"
        @click="handleClick(index)">
        <div v-if="!thread.editing" class="thread-item">
          <div class="thread-name">{{ thread.name }}</div>
          <div class="edit-btn" @click.stop="toggleDropdown(index)">
            <font-awesome-icon icon="fa-solid fa-ellipsis" class="icon" />
          </div>
          <div v-if="thread.openDropdown" class="dropdown" ref="dropdowns">
            <div @click.stop="editThread(index)">
              <font-awesome-icon icon="fa-solid fa-pen" class="icon" />
              <div>Rename</div>
            </div>
            <div @click.stop="promptDelete(index)" class="delete-thread">
              <font-awesome-icon icon="fa-solid fa-trash-can" class="icon" />
              <div>Delete</div>
            </div>
          </div>
        </div>
        <input v-else :ref="`editInput-${index}`" v-model="thread.editedName"
          @keyup.enter="saveThreadName(thread, index)" @blur="cancelEdit(index)" />
      </li>
    </ul>
    <div v-if="showConfirmDeleteModal" class="delete-prompt-overlay">
      <div class="delete-prompt-content">
        <div class="delete-header">Delete chat?</div>
        <div class="delete-body">
          <p>This will delete <strong class="delete-thread-name">{{ threads[deleteIndex].name }}.</strong></p>
          <div class="delete-button-container">
            <button class="cancel-button" @click="cancelDelete">Cancel</button>
            <button class="confirm-button" @click="confirmDelete">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import axios from "axios";
export default {
  name: "SideBar",
  props: {
    initialThreadName: String,
  },
  data() {
    return {
      threads: [],
      deleteIndex: null,
      showConfirmDeleteModal: false,
    };
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['users/isAuthenticated'];
    },
  },
  watch: {
    initialThreadName: {
      immediate: true,
      handler(newName) {
        if (newName.length === 0 || newName === null) return;
        this.threads.forEach( (thread, index) => {
          if (thread.id === this.$store.getters['threads/getThreadID']) {
            thread.editedName = newName;
            this.saveThreadName(thread, index);
          }
        })
      },
    },
  },
  methods: {
    async addThread() {
      try {
        const newThread = {
          name: "New Chat",
          editing: false,
          editedName: null,
          messages: [],
          openDropdown: false,
        };
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const userId = localStorage.getItem("token");
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        newThread.id = thread.data._id;
        this.threads.unshift(newThread);
        this.selectThread(0);
      } catch (err) {
        console.error("Error on adding new thread:", err);
      }
    },
    toggleDropdown(index) {
      this.threads[index].openDropdown = !this.threads[index].openDropdown;
      for (let i = 0; i < this.threads.length; i++) {
        if (i !== index) {
          this.threads[i].openDropdown = false;
        }
      }
    },
    //DELETE THREAD HANDLE
    promptDelete(index) {
      this.deleteIndex = index;
      this.showConfirmDeleteModal = true;
    },
    confirmDelete() {
      this.deleteThread(this.deleteIndex);
      this.showConfirmDeleteModal = false;
    },
    cancelDelete() {
      this.showConfirmDeleteModal = false;
      this.deleteIndex = null;
    },
    async deleteThread(index) {
      const threadId = this.threads[index].id;
      try {
        // Remove the thread from the list in the UI
        this.threads.splice(index, 1);

        // If there are still threads left, select the first one; otherwise, clear the chat and thread state
        if (this.threads.length > 0) {
          this.selectThread(0);
        } else {
          this.currentThread = {};
          this.messages = [];
        }
        // Step 1: delete all chats associated with this threadId
        const deleteChatsApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${threadId}`;
        await axios.delete(deleteChatsApi);

        // Step 2: delete the thread itself
        const deleteThreadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/${threadId}`;
        await axios.delete(deleteThreadApi);
      } catch (err) {
        console.error('Error on deleting thread or its associated chats:', err);
      }
    },
    //EDIT THREAD HANDLE
    editThread(index) {
      this.threads.forEach((thread, idx) => {
        thread.editing = idx === index;
      });
      this.$nextTick(() => {
        this.$nextTick(() => {
          const refKey = `editInput-${index}`;
          if (this.$refs[refKey] && this.$refs[refKey][0]) {
            this.$refs[refKey][0].focus();
          } else {
            console.error(`Failed to find ref: ${refKey}`);
          }
        });
      });
    },
    async saveThreadName(thread, index) {
      if (thread.editedName.trim()) {
        try {
          thread.name = thread.editedName.trim();
          thread.editing = false;
          const threadId = thread.id;
          const api = `${process.env.VUE_APP_DEPLOY_URL}/threads/${threadId}`;
          const threadChanges = await axios.put(api, { title: thread.name });
          console.log("Thread name saved:", threadChanges.data);
          thread.editedName = null;
          thread.openDropdown = false;
        } catch (err) {
          console.error("Error on saving thread name:", err);
        }
      } else {
        this.cancelEdit(index);
      }
    },
    selectThread(index) {
      const threadID = this.threads[index].id;
      this.threads.forEach((thread, i) => {
        thread.clicked = i === index;
      });
      this.$store.dispatch("threads/updateThreadID", threadID);
      console.log("selected threadID:", threadID);
    },
    cancelEdit(index) {
      this.threads[index].editing = false;
      console.log("cancel edit");
    },
    handleClick(index) {
      if (event.detail == 1) {
        this.selectThread(index);
      }

      if (event.detail == 2) {
        //do nothing
      }
    },
    //FUNCTION TO HANDLE CLICK OUTSIDE OF DROPDOWN
    handleOutsideClick(event) {
      let isClickInside = this.$refs.dropdowns && Array.from(this.$refs.dropdowns).some(ref => ref.contains(event.target));
      if (!isClickInside) {
        this.closeDropdowns();
      }
    },
    closeDropdowns() {
      this.threads.forEach(thread => {
        thread.openDropdown = false;
      });
    },
  },
  async mounted() {
    if (this.isAuthenticated) {
      const userId = localStorage.getItem("token");
      console.log("current UserID:", userId);
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (historyThreadsData.length === 0) {
        const newThread = {
          name: "New Thread",
          editing: false,
          editedName: "New Chat",
          messages: [],
          openDropdown: false,
        };
        await this.addThread(newThread);
      } else {
        historyThreadsData.forEach((threadData) => {
          const thread = {
            id: threadData._id,
            name: threadData.title,
            editing: false,
            editedName: threadData.title,
            messages: [],
            openDropdown: false,
          };
          this.threads.unshift(thread);
        });
      }
      console.log(this.threads);
      if (this.$store.getters['threads/getThreadID'] === null) {
        this.selectThread(0);
      } else {
        for (let i = 0; i < historyThreadsData.length; i++) {
          if (historyThreadsData[i]._id === this.$store.getters['threads/getThreadID']) {
            this.selectThread(historyThreadsData.length - i - 1);
            break;
          }
        }
      }
    }
    // Add event listener to handle click outside of dropdown
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick);
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
  justify-content: start;
  align-items: center;
  font-size: 1.5rem;
}

.add-thread-btn {
  cursor: pointer;
  padding: 10px;
  background-color: transparent;
  color: #34495e;
  border: 1px solid #34495e;
  border-radius: 10px;
  transition: background-color 0.3s;
  width: 100%;
  height: 35px;
}

.add-thread-btn:hover {
  background-color: #34495e;
  color: white;
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
}

.thread-name {
  white-space: nowrap;
  overflow: hidden;
  margin-right: 10px;
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

/* Dropdown */
.dropdown {
  display: block;
  position: absolute;
  color: black;
  background-color: rgb(249, 249, 249);
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  left: 190px;
  margin-top: 140px;
  border-radius: 10px;
}

.dropdown>div {
  display: flex;
  flex-direction: row;
  margin: 5px;
  padding: 10px 20px;
  text-align: center;
  transition: background-color 0.3s;
  border-radius: 10px;
  font-size: 0.9rem;
}

.dropdown .icon {
  margin-right: 15px;
}

.dropdown>div:hover {
  background-color: #ddd;
  border-radius: 10px;
}

/* Delete Prompt */
.delete-thread {
  color: red;
}

.delete-prompt-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10000;
}

.delete-prompt-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: fit-content;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.delete-header {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.delete-header::after {
  content: "";
  display: block;
  width: 100%;
  height: 1px;
  background: #ddd;
  margin-top: 20px;
}

.delete-thread-name {
  font-weight: bolder;
}

.delete-button-container {
  display: flex;
  justify-content: end;
  gap: 10px;
  margin-top: 20px;
}

.delete-button-container button {
  padding: .75rem .875rem;
  border: 1px solid #ddd;
  border-radius: 9999px;
  cursor: pointer;
  font-weight: 500;
}

.confirm-button {
  background: red;
  color: white;
}

.confirm-button:hover {
  background: #b30900;
}

.cancel-button {
  color: black;
  background-color: #fff;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background: #ddd;
}
</style>
