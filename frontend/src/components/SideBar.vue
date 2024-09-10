<template>
  <aside class="side-bar">
    <div class="sidebar-header">
      <span>Chat Threads</span>
      <button class="add-thread-btn" @click="addThread()">+</button>
    </div>
    <ul class="thread-list">
      <li v-for="(thread, index) in threads" :key="index" :class="['thread', { clicked: thread.clicked }]"
        @click="handleClick(index)">
        <div v-if="!thread.editing" class="thread-item">
          {{ thread.name }}
          <div class="edit-btn" @click.stop="toggleDropdown(index)">
            <font-awesome-icon icon="fa-solid fa-ellipsis" class="icon" />
          </div>
          <div v-if="thread.openDropdown" class="dropdown" ref="dropdowns">
            <div @click.stop="editThread(index)">
              <font-awesome-icon icon="fa-solid fa-pen" class="icon" />
              <div>Rename</div>
            </div>
            <div @click.stop="deleteThread(index)">
              <font-awesome-icon icon="fa-solid fa-trash-can" class="icon" />
              <div>Delete</div>
            </div>
          </div>
        </div>
        <input v-else v-model="thread.editedName" @keyup.enter="saveThreadName(thread, index)"
          @blur="enterPressed ? enterPressed = false : cancelEdit(index)" />
      </li>
    </ul>
  </aside>
</template>

<script>
import authStore from "@/authStore";
import axios from "axios";
export default {
  name: "SideBar",
  props: [],
  data() {
    return {
      threads: [],
      enterPressed: false,
    };
  },
  computed: {
    authStore() {
      return authStore;
    },
  },
  methods: {
    async addThread() {
      try {
        const newThread = {
          name: "New Thread",
          editing: false,
          editedName: "New Chat",
          messages: [],
          openDropdown: false,
        };
        const api = `${process.env.VUE_APP_DEPLOY_URL}/threads`;
        const userId = localStorage.getItem("token");
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        newThread.id = thread.data._id;
        this.threads.push(newThread);
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
    editThread(index) {
      this.threads[index].editing = true;
    },
    saveThreadName(thread, index) {
      console.log(this.enterPressed);
      this.enterPressed = true;
      if (thread.editedName.trim()) {
        this.$emit("save-thread-name", { newName: thread.editedName, index });
      } else {
        this.$emit("cancel-edit", index);
      }
    },
    selectThread(index) {
      this.threadID = this.threads[index].id;
      this.threads.forEach((thread, i) => {
        thread.clicked = i === index;
      });
      this.$store.dispatch("threads/updateThreadID", this.threadID);
      console.log("selected threadID:", this.threadID);
    },
    cancelEdit(index) {
      this.enterPressed = false;
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
    if (authStore.isAuthenticated) {
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
          this.threads.push(thread);
        });
      }
      if (this.$store.getters['threads/getThreadID'] === null) {
        this.selectThread(0);
      }
      for (let i = 0; i < historyThreadsData.length; i++) {
        if (historyThreadsData[i]._id === this.$store.getters['threads/getThreadID']) {
          this.selectThread(i);
          break;
        }
      }
    }
    // Add event listener to handle click outside of dropdown
    document.addEventListener('click', (event) => {
      let dropdowns = this.$refs.dropdowns;
      let isClickInside = dropdowns.some(ref => ref.contains(event.target));
      if (!isClickInside) {
        this.closeDropdowns();
      }
    });
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
  background-color: #afb4bb;
  border-radius: 10px;
}
</style>
