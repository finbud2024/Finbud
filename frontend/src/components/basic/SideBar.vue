<template>
  <aside class="side-bar">
    <div class="sidebar-header">
      <router-link to="/">
        <div class="footer-image">
          <img src="@/assets/home-page/FinBudPix.png" class="logo-img" alt="FinBud Logo" />
        </div>
      </router-link>
    </div>
    <button class="add-thread-btn" @click="addThread()">
      <font-awesome-icon icon="fa-solid fa-plus" />
    </button>
    <ul class="thread-list">
      <template v-if="groupedThreads.today.length">
        <div class="group-label">Today</div>
        <li v-for="thread in groupedThreads.today" :key="thread.id" :class="['thread', { clicked: thread.clicked }]" @click="handleClick(threads.findIndex(t => t.id === thread.id))">
          <div v-if="!thread.editing" class="thread-item">
            <div class="thread-name">{{ thread.name }}</div>
            <div class="edit-btn" @click.stop="toggleDropdown(threads.findIndex(t => t.id === thread.id))">
              <font-awesome-icon icon="fa-solid fa-ellipsis" class="icon" />
            </div>
            <div v-if="thread.openDropdown" class="dropdown" ref="dropdowns">
              <div @click.stop="editThread(threads.findIndex(t => t.id === thread.id))">
                <font-awesome-icon icon="fa-solid fa-pen" class="icon" />
                <div>{{ $t('chatComponent.rename') }}</div>
              </div>
              <div @click.stop="promptDelete(threads.findIndex(t => t.id === thread.id))" class="delete-thread">
                <font-awesome-icon icon="fa-solid fa-trash-can" class="icon" />
                <div>{{ $t('chatComponent.delete') }}</div>
              </div>
            </div>
          </div>
          <input v-else :ref="`editInput-${threads.findIndex(t => t.id === thread.id)}`" v-model="thread.editedName" @keyup.enter="saveThreadName(thread, threads.findIndex(t => t.id === thread.id))" @blur="cancelEdit(threads.findIndex(t => t.id === thread.id))" />
        </li>
      </template>

      <template v-if="groupedThreads.yesterday.length">
        <div class="group-label">Yesterday</div>
        <li v-for="thread in groupedThreads.yesterday" :key="thread.id" :class="['thread', { clicked: thread.clicked }]" @click="handleClick(threads.findIndex(t => t.id === thread.id))">
          <div v-if="!thread.editing" class="thread-item">
            <div class="thread-name">{{ thread.name }}</div>
            <div class="edit-btn" @click.stop="toggleDropdown(threads.findIndex(t => t.id === thread.id))">
              <font-awesome-icon icon="fa-solid fa-ellipsis" class="icon" />
            </div>
            <div v-if="thread.openDropdown" class="dropdown" ref="dropdowns">
              <div @click.stop="editThread(threads.findIndex(t => t.id === thread.id))">
                <font-awesome-icon icon="fa-solid fa-pen" class="icon" />
                <div>{{ $t('chatComponent.rename') }}</div>
              </div>
              <div @click.stop="promptDelete(threads.findIndex(t => t.id === thread.id))" class="delete-thread">
                <font-awesome-icon icon="fa-solid fa-trash-can" class="icon" />
                <div>{{ $t('chatComponent.delete') }}</div>
              </div>
            </div>
          </div>
          <input v-else :ref="`editInput-${threads.findIndex(t => t.id === thread.id)}`" v-model="thread.editedName" @keyup.enter="saveThreadName(thread, threads.findIndex(t => t.id === thread.id))" @blur="cancelEdit(threads.findIndex(t => t.id === thread.id))" />
        </li>
      </template>

      <template v-if="groupedThreads.last30Days.length">
        <div class="group-label">Previous 30 Days</div>
        <li v-for="thread in groupedThreads.last30Days" :key="thread.id" :class="['thread', { clicked: thread.clicked }]" @click="handleClick(threads.findIndex(t => t.id === thread.id))">
          <div v-if="!thread.editing" class="thread-item">
            <div class="thread-name">{{ thread.name }}</div>
            <div class="edit-btn" @click.stop="toggleDropdown(threads.findIndex(t => t.id === thread.id))">
              <font-awesome-icon icon="fa-solid fa-ellipsis" class="icon" />
            </div>
            <div v-if="thread.openDropdown" class="dropdown" ref="dropdowns">
              <div @click.stop="editThread(threads.findIndex(t => t.id === thread.id))">
                <font-awesome-icon icon="fa-solid fa-pen" class="icon" />
                <div>{{ $t('chatComponent.rename') }}</div>
              </div>
              <div @click.stop="promptDelete(threads.findIndex(t => t.id === thread.id))" class="delete-thread">
                <font-awesome-icon icon="fa-solid fa-trash-can" class="icon" />
                <div>{{ $t('chatComponent.delete') }}</div>
              </div>
            </div>
          </div>
          <input v-else :ref="`editInput-${threads.findIndex(t => t.id === thread.id)}`" v-model="thread.editedName" @keyup.enter="saveThreadName(thread, threads.findIndex(t => t.id === thread.id))" @blur="cancelEdit(threads.findIndex(t => t.id === thread.id))" />
        </li>
      </template>
    </ul>
    <div v-if="showConfirmDeleteModal" class="delete-prompt-overlay">
      <div class="delete-prompt-content">
        <div class="delete-header">{{ $t('chatComponent.deleteConfirm') }}</div>
        <div class="delete-body">
          <p>{{ $t('chatComponent.deleteConfirmMessage') }} <strong class="delete-thread-name">{{ threads[deleteIndex].name }}.</strong></p>
          <div class="delete-button-container">
            <button class="cancel-button" @click="cancelDelete">{{ $t('chatComponent.cancel') }}</button>
            <button class="confirm-button" @click="confirmDelete">{{ $t('chatComponent.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import axios from "axios";
import { isToday, isYesterday, subDays, isAfter } from 'date-fns';

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
      return this.$store.getters["users/isAuthenticated"];
    },
    groupedThreads() {
      const today = [], yesterday = [], last30Days = [];
      this.threads.forEach(thread => {
        const created = new Date(thread.creationDate);
        if (isToday(created)) today.push(thread);
        else if (isYesterday(created)) yesterday.push(thread);
        else if (isAfter(created, subDays(new Date(), 30))) last30Days.push(thread);
      });
      return { today, yesterday, last30Days };
    }
  },
  watch: {
    initialThreadName: {
      immediate: true,
      handler(newName) {
        if (!newName) return;
        this.threads.forEach((thread, index) => {
          if (thread.id === this.$store.getters["threads/getThreadID"]) {
            thread.editedName = newName;
            this.saveThreadName(thread, index);
          }
        });
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
        const userId = this.$store.getters["users/userId"];
        const reqBody = { userId };
        const thread = await axios.post(api, reqBody);
        newThread.id = thread.data._id;
        newThread.creationDate = new Date();
        this.threads.unshift(newThread);
        this.selectThread(0);
      } catch (err) {
        console.error("Error on adding new thread:", err);
      }
    },
    toggleDropdown(index) {
      this.threads[index].openDropdown = !this.threads[index].openDropdown;
      this.threads.forEach((thread, i) => {
        if (i !== index) thread.openDropdown = false;
      });
    },
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
        this.threads.splice(index, 1);
        if (this.threads.length > 0) {
          this.selectThread(0);
        } else {
          this.currentThread = {};
          this.messages = [];
        }
        await axios.delete(`${process.env.VUE_APP_DEPLOY_URL}/chats/t/${threadId}`);
        await axios.delete(`${process.env.VUE_APP_DEPLOY_URL}/threads/${threadId}`);
      } catch (err) {
        console.error("Error on deleting thread or its associated chats:", err);
      }
    },
    editThread(index) {
      this.threads.forEach((thread, idx) => thread.editing = idx === index);
      this.$nextTick(() => {
        const refKey = `editInput-${index}`;
        if (this.$refs[refKey] && this.$refs[refKey][0]) {
          this.$refs[refKey][0].focus();
        }
      });
    },
    async saveThreadName(thread, index) {
      if (thread.editedName.trim()) {
        try {
          thread.name = thread.editedName.trim();
          thread.editing = false;
          const api = `${process.env.VUE_APP_DEPLOY_URL}/threads/${thread.id}`;
          await axios.put(api, { title: thread.name });
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
    },
    cancelEdit(index) {
      this.threads[index].editing = false;
    },
    handleClick(index) {
      if (event.detail === 1) {
        this.selectThread(index);
      }
    },
    handleOutsideClick(event) {
      let isClickInside = this.$refs.dropdowns && Array.from(this.$refs.dropdowns).some(ref => ref.contains(event.target));
      if (!isClickInside) this.closeDropdowns();
    },
    closeDropdowns() {
      this.threads.forEach(thread => thread.openDropdown = false);
    },
  },
  async mounted() {
    if (this.isAuthenticated) {
      const userId = this.$store.getters["users/userId"];
      const threadApi = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
      const res = await axios.get(threadApi);
      const historyThreadsData = res.data;
      if (historyThreadsData.length === 0) {
        await this.addThread();
      } else {
        historyThreadsData.forEach(threadData => {
          this.threads.unshift({
            id: threadData._id,
            name: threadData.title,
            creationDate: new Date(threadData.creationDate),
            editing: false,
            editedName: threadData.title,
            messages: [],
            openDropdown: false,
          });
        });
      }
      if (this.$store.getters["threads/getThreadID"] === null) {
        this.selectThread(0);
      } else {
        const matchIndex = historyThreadsData.findIndex(t => t._id === this.$store.getters["threads/getThreadID"]);
        if (matchIndex !== -1) {
          this.selectThread(historyThreadsData.length - matchIndex - 1);
        }
      }
    }
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
};
</script>

<style scoped>
.side-bar {
  width: 200px;
  background-color: var(--bg-primary);
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  color: var(--text-primary);
}

.sidebar-header {
  font-weight: bold;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 20px;
  display: flex;
  justify-content: start;
  align-items: center;
  font-size: 1.5rem;
}

.logo-img {
  max-width: 160px;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.add-thread-btn {
  cursor: pointer;
  padding: 10px;
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  transition: background-color 0.3s;
  width: 100%;
  height: 35px;
}

.add-thread-btn:hover {
  background-color: var(--text-primary);
  color: white;
}

.edit-btn {
  color: var(--text-primary);
}

.edit-btn:hover {
  cursor: pointer;
  transition: transform 0.3s;
  transform: scale(1.2);
}

.group-label {
  margin: 0.75rem 0 0.25rem;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  opacity: 0.6;
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
  background-color: var(--text-primary);
}

.thread-list li:hover .edit-btn {
  color: white;
}

.thread-list input {
  width: 80%;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  background-color: white;
  color: black;
}

.thread.clicked {
  background-color: black;
  color: white;
}

.thread.clicked .edit-btn {
  color: white;
}

.dropdown {
  display: block;
  position: absolute;
  color: var(--text-primary);
  background-color: var(--card-bg);
  min-width: 120px;
  box-shadow: 0px 8px 16px 0px var(--shadow-color);
  z-index: 1;
  left: 190px;
  margin-top: 140px;
  border-radius: 10px;
}

.dropdown > div {
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

.dropdown > div:hover {
  background-color: var(--hover-bg);
  border-radius: 10px;
}

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
  background: var(--bg-primary);
  color: var(--text-primary);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0 10px var(--shadow-color);
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
  background: var(--border-color);
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
  padding: 0.75rem 0.875rem;
  border: 1px solid var(--border-color);
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
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.cancel-button:hover {
  background: var(--hover-bg);
}

.footer-image img {
  max-width: 200px;
  height: auto;
  margin-bottom: 0rem;
}
</style>
