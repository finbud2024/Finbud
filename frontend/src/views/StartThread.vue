<template>
  <div class="forum-layout">
    <!-- Sidebar -->
    <ForumSidebar @forum-selected="changeForum" :selectedForum="selectedForum" class="sidebar" />

    <!-- Main Content -->
    <div class="content">
      <h1 class="page-title">Start new thread</h1>

      <!-- Select Forum Dropdown -->
      <div class="selected-forum">
        <select v-model="selectedForum" class="forum-dropdown">
          <option v-for="forum in forums" :key="forum.id" :value="forum.id">
            {{ forum.name }}
          </option>
        </select>
      </div>

      <!-- Thread Form -->
      <form @submit.prevent="submitThread" class="thread-form">
        <input v-model="title" type="text" placeholder="Title*" class="title-input" required />
        <textarea v-model="body" ref="bodyInput" placeholder="Body" class="body-input" required></textarea>
        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import ForumSidebar from "@/components/ForumSidebar.vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";

export default {
  components: { ForumSidebar },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const title = ref("");
    const body = ref("");
    const selectedForum = ref(route.query.forum || "p/general");

    const forums = [
      { id: "p/general", name: "p/general" },
      { id: "p/investing", name: "p/investing" },
      { id: "p/crypto", name: "p/crypto" },
      { id: "p/economy", name: "p/economy" },
      { id: "p/personal-finance", name: "p/personal-finance" },
      { id: "p/real-estate", name: "p/real-estate" },
      { id: "p/fintech", name: "p/fintech" },
      { id: "p/ama", name: "p/ama" },
      { id: "p/self-promotions", name: "p/self-promotions" },
      { id: "p/memes", name: "p/memes" },
      { id: "p/education", name: "p/education" },
    ];

    function submitThread() {
      if (!title.value.trim() || !body.value.trim() || !selectedForum.value) {
        alert("Please select a forum and fill in both the title and body.");
        return;
      }

      const newThread = {
        id: Date.now(),
        forum: selectedForum.value,
        author: "You",
        title: title.value,
        content: body.value,
        date: "Just now",
        comments: 0,
        likes: 0,
      };

      store.dispatch("forum/addNewThread", { forum: selectedForum.value, thread: newThread });

      title.value = "";
      body.value = "";

      router.push({ path: "/forum", query: { forum: selectedForum.value } });
    }

    return {
      title,
      body,
      selectedForum,
      forums,
      submitThread,
    };
  }
};
</script>

<style scoped>

.forum-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  gap: 64px;
}

.sidebar {
  background: var(--background-primary);
  padding: 20px;
  border-right: 1px solid var(--background-tertiary);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
}

.selected-forum {
  display: flex;
  align-items: center;
}

.forum-dropdown {
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  font-size: 16px;
  border: 1px solid var(--border-color);
}

.thread-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start; 
}

.title-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-sizing: border-box;
}

.body-input {
  width: 100%;
  min-height: 200px; 
  padding: 12px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  resize: vertical;
  box-sizing: border-box;
  vertical-align: top;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-y: auto;
}

.submit-button {
  background: var(--primary-color) !important;
  color: var(--primary-color) !important;
  border: 2px solid #dddddd !important;
  align-self: flex-end;
  width: 90px;
  height: 44px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
}

.submit-button:hover {
  background: #0F1F3D;
}

</style>
