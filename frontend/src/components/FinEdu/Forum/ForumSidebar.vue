<template>
  <aside class="sidebar">
    <h2>Forums</h2>

    <div v-if="loading" class="skeleton-list">
      <div v-for="n in 5" :key="n" class="skeleton-item"></div>
    </div>

    <ul v-else>
      <li 
        v-for="forum in forums" 
        :key="forum._id"
        :class="{ 'selected': forum.slug === activeForumSlug }"
        @click="selectForum(forum.slug)"
      >
        <component 
          :is="LucideIcons[forum.logo] || LucideIcons['HelpCircle']" 
          class="forum-icon" 
        />
        <span class="forum-name">{{ forum.name }}</span>
      </li>
    </ul>
  </aside>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/api"; 
import * as LucideIcons from "lucide-vue-next";

export default {
  props: {
    activeForumSlug: String,
  },
  setup(props) {
    const forums = ref([]);
    const loading = ref(true);
    const router = useRouter();

    const fetchForums = async () => {
      try {
        const response = await api.get("/api/forums", { withCredentials: true });
        forums.value = response.data;
      } catch (err) {
        console.error("❌ Failed to fetch forums:", err);
      } finally {
        loading.value = false;
      }
    };

    const selectForum = (forumSlug) => {
      if (forumSlug !== props.activeForumSlug) {
        router.push({ path: "/forum", query: { forum: forumSlug } });
      }
    };

    onMounted(fetchForums);

    return {
      forums,
      loading,
      LucideIcons,
      activeForumSlug: props.activeForumSlug,
      selectForum
    };
  }
};
</script>

<style scoped>
.sidebar {
  width: 280px;
  background: var(--background-primary);
  padding: 20px;
  border-right: 1px solid var(--background-tertiary);
}

.sidebar h2 {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 8px;
  transition: background 0.2s ease-in-out;
  margin-bottom: 5px;
}

.sidebar li.selected {
  background-color: #F2F4F7;
  font-weight: bold;
}

.forum-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

/* Skeleton loading */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-item {
  height: 36px;
  background-color: #e0e0e0;
  border-radius: 8px;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>
