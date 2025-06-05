<template>
  <div class="forum-layout">
    <!-- Sidebar -->
    <ForumSidebar class="sidebar" />

    <!-- Main Content -->
    <div class="content">
      <h1 class="page-title">Start new thread</h1>

      <!-- Select Forum Dropdown -->
      <div class="selected-forum">
        <select v-model="selectedForum" class="forum-dropdown">
          <option v-for="forum in forums" :key="forum._id" :value="forum._id">
            {{ forum.name }}
          </option>
        </select>
      </div>

      <!-- Thread Form -->
      <form @submit.prevent="submitThread" class="thread-form">
        <input v-model="title" type="text" placeholder="Title*" class="title-input" required />
        <textarea v-model="body" placeholder="Body" class="body-input" required></textarea>
        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import ForumSidebar from "@/components/FinEdu/Forum/ForumSidebar.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import api from "@/utils/api";

export default {
  components: { ForumSidebar },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const title = ref("");
    const body = ref("");
    const selectedForum = ref("");
    const forums = ref([]);

    const userId = computed(() => store.getters["users/userId"]);
    const userModel = computed(() => store.getters["users/userModel"] || "User");

    const fetchForums = async () => {
      try {
        const response = await api.get("/api/forums", { withCredentials: true });
        forums.value = response.data;

        const forumFromQuery = response.data.find(f => f.slug === route.query.forum);
        selectedForum.value = forumFromQuery?._id || response.data[0]?._id || "";
      } catch (error) {
        console.error("Failed to fetch forums:", error);
      }
    };

    onMounted(async () => {
      try {
        if (!userId.value) {
          await store.dispatch("users/fetchCurrentUser");
        }
        await fetchForums();
      } catch (error) {
        console.warn("Not authenticated, redirecting...");
        router.push("/login");
      }
    });

    const submitThread = async () => {
      if (!title.value.trim() || !body.value.trim() || !selectedForum.value) {
        alert("Please select a forum and fill in both the title and body.");
        return;
      }

      if (!userId.value || !userModel.value) {
        alert("You must be logged in to post.");
        return;
      }

      const newThread = {
        forumId: selectedForum.value,
        userId: userId.value,
        userModel: userModel.value,
        title: title.value,
        body: body.value,
      };

      try {
        console.log("📤 Submitting Thread Data:", newThread);

        const response = await api.post("/api/posts", newThread, { withCredentials: true });

        console.log("Thread Created:", response.data);
        title.value = "";
        body.value = "";

        const forumSlug = forums.value.find(f => f._id === selectedForum.value)?.slug || "p/general";
        router.push({ path: "/forum", query: { forum: forumSlug } });

      } catch (error) {
        console.error("Failed to submit thread:", error.response?.data || error.message);
        alert("Failed to submit thread. Please try again.");
      }
    };

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

/* Tablet screens */
@media (max-width: 1024px) {
  .forum-layout {
    grid-template-columns: 220px 1fr;
    gap: 32px;
    padding: 16px;
  }
}

/* Mobile screens */
@media (max-width: 768px) {
  .forum-layout {
    display: flex;
    flex-direction: column;
    padding: 16px 12px;
    gap: 24px;
  }

  .sidebar {
    width: 100%;
    padding: 16px;
    border-bottom: 1px solid var(--background-tertiary);
    border-right: none;
  }

  .content {
    width: 100%;
  }

  .forum-dropdown {
    width: 100%;
    font-size: 15px;
  }

  .title-input,
  .body-input {
    font-size: 15px;
  }

  .submit-button {
    width: 100%;
    font-size: 15px;
  }

  .page-title {
    font-size: 20px;
  }
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
  background: var(--primary-color) ;
  color: var(--primary-color);
  border: 2px solid #dddddd ;
  align-self: flex-end;
  width: 90px;
  height: 44px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
  margin-bottom: 80px; /* 👈 Add this */
}


.submit-button:hover {
  background: #0F1F3D;
}


</style>