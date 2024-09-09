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
          <div class="edit-btn" @click.stop="toggleDropdown(index)">
            <font-awesome-icon icon="fa-solid fa-ellipsis" />
          </div>
        </div>
        <!-- @click.stop="editThread(index) -->
        <!-- <input
          v-else
          v-model="thread.editedName"
          @keyup.enter="saveThreadName(thread, index)"
          @blur="enterPressed? enterPressed = false: cancelEdit(index)"
        /> -->
      </li>
    </ul>
  </aside>
</template>

<script>
import authStore from "@/authStore";
import axios from "axios";
export default {
  name: "SideBar",
  props: ["threads"],
  data() {
    return {
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
    async deleteThread(index) {
      const threadId = this.threads[index].id;
      try {
        // Step 1: delete all chats associated with this threadId
        const deleteChatsApi = `${process.env.VUE_APP_DEPLOY_URL}/chats/t/${threadId}`;
        await axios.delete(deleteChatsApi);

        // Step 2: delete the thread itself
        const deleteThreadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/${threadId}`;
        await axios.delete(deleteThreadApi);

        // Remove the thread from the list in the UI
        this.threads.splice(index, 1);
        
        // If there are still threads left, select the first one; otherwise, clear the chat and thread state
        if (this.threads.length > 0) {
          this.selectThread(0);
        } else {
          this.currentThread = {};
          this.messages = [];
        }
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
      this.$emit("update-thread", this.threadID);
      console.log("selected threadID:", this.threadID);
    },
    cancelEdit(index) {
      this.enterPressed = false;
      this.threads[index].editing = false;
      console.log("cancel edit");
    },
    handleBlur(thread, index) {
      if (!this.enterPressed) {
        this.cancelEdit(index);
      }
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
  async mounted() {
    if (authStore.isAuthenticated) {
      const userId = localStorage.getItem("token");
      console.log("current UserID:",userId);
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      const historyThreads = await axios.get(threadApi);
      const historyThreadsData = historyThreads.data;
      if (historyThreadsData.length === 0) {
        const newThread = {
          name: "New Thread",
          editing: false,
          editedName: "New Chat",
          messages: [],
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
          };
          this.threads.push(thread);
        });
      }
      this.selectThread(0);
      // for(let i= 0; i< historyThreadsData.length; i++){
      //   if(historyThreadsData[i]._id === this.chatBubbleThreadID){
      //     this.selectThread(i)
      //     this.$emit('chatviewSelectingThread', "")
      //     break;
      //   }
      // }
    }
  }
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

.thread.clicked{
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
