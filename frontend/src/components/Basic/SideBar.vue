<template>
  <div>
    <button v-if="showControls" class="toggle-btn" @click="toggleSidebar">
      <svg v-if="!isVisible" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>

    <div v-if="showControls" class="overlay" :class="{ active: isVisible }" @click="closeSidebar"></div>

    <div class="side-bar" :class="{ collapsed: !isVisible }">
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { isToday, isYesterday, subDays, isAfter } from 'date-fns';

export default {
  name: "SideBar",
  props: {
    initialThreadName: String,
    isVisible: {
      type: Boolean,
      required: true,
    },
    showControls: {
      type: Boolean,
      default: true,
    },
    isMobile: {
      type: Boolean,
      default: false,
    }
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
        this.$router.push({ name: 'Chat', params: { threadId: newThread.id } });
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
        if (this.isMobile) {
          this.$emit('update:isVisible', false);
        }
      }
    },
    handleOutsideClick(event) {
      let isClickInside = this.$refs.dropdowns && Array.from(this.$refs.dropdowns).some(ref => ref.contains(event.target));
      if (!isClickInside) this.closeDropdowns();
    },
    closeDropdowns() {
      this.threads.forEach(thread => thread.openDropdown = false);
    },
    toggleSidebar() {
      this.$emit('update:isVisible', !this.isVisible);
    },
    closeSidebar() {
      this.$emit('update:isVisible', false);
    }
  },
  async mounted() {
    if (!this.isAuthenticated) return;

    // if store isn't hydrated yet, wait for it
    if (!this.$store.getters["users/userId"]) {
      await this.$store.dispatch("users/fetchCurrentUser");   // or whatever action loads profile
    }

    const userId = this.$store.getters["users/userId"];
    if (!userId) {
      console.warn("Sidebar: userId still undefined – skip thread fetch");
      return;                         // prevents /threads/u/undefined
    }

    const api = `${process.env.VUE_APP_DEPLOY_URL}/threads/u/${userId}`;
    try {
      const res = await axios.get(api);
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
    } catch (e) {
      console.error("thread fetch failed:", e);
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
  width: 280px;
  background: linear-gradient(to bottom, var(--bg-primary), var(--bg-secondary));
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  color: var(--text-primary);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: fixed;
  left: 70px;
  top: 0;
  z-index: 1050;
}

.side-bar.collapsed {
  transform: translateX(-100%);
}

.toggle-btn {
  position: fixed;
  left: 20px;
  top: 20px;
  z-index: 1001;
  background: var(--bg-primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  transform: scale(1.1);
}

.toggle-btn svg {
  width: 24px;
  height: 24px;
  color: var(--text-primary);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.overlay.active {
  opacity: 1;
  visibility: visible;
}

.sidebar-header {
  font-weight: bold;
  padding-bottom: 20px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.sidebar-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: -20px;
  right: -20px;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--border-color), transparent);
}

.logo-img {
  max-width: 160px;
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.logo-img:hover {
  transform: scale(1.05);
}

.add-thread-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #000, #333);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.add-thread-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #333, #000);
}

.thread-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.group-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 20px 0 10px;
  padding-left: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.thread {
  margin-bottom: 8px;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.thread-item {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-primary);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.thread-item:hover {
  background: var(--hover-bg);
  transform: translateX(5px);
}

.thread.clicked .thread-item {
  background: #000;
  color: white;
  transform: translateX(5px);
}

.thread-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.95rem;
}

.edit-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
}

.thread-item:hover .edit-btn {
  opacity: 1;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  overflow: hidden;
  animation: slideIn 0.3s ease;
}

.dropdown > div {
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown > div:hover {
  background: rgba(0, 0, 0, 0.05);
}

.delete-thread {
  color: #dc2626;
}

.delete-thread:hover {
  background: rgba(220, 38, 38, 0.1) !important;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: var(--bg-primary);
  color: var(--text-primary);
}

input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .side-bar {
    width: 80%;
    max-width: 300px;
  }
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
