<template>
  <aside class="sidebar">
    <h2>Forums</h2>
    <ul>
      <li 
        v-for="forum in forums" 
        :key="forum._id"
        :class="{ 'selected': activeForumSlug === forum.slug }"
        @click="selectForum(forum.slug)">
        
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
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "@/utils/api"; 
import * as LucideIcons from "lucide-vue-next";

export default {
  props: {
    activeForumSlug: String, 
  },
  setup(props) {
    const forums = ref([]);
    const route = useRoute();
    const router = useRouter();
    const activeForum = ref(route.query.forum || "p/general");

    const fetchForums = async () => {
      try {
        const response = await api.get("/api/forums", { withCredentials: true });
        forums.value = response.data;
      } catch (error) {
        console.error("❌ Failed to fetch forums:", error);
      }
    };

    watch(() => route.query.forum, (newForum) => {
      if (newForum) {
        activeForum.value = newForum;
      }
    });

    watch(() => props.activeForumSlug, (newSlug) => {
      if (newSlug) {
        activeForum.value = newSlug;
      }
    });

    const selectForum = (forumSlug) => {
      activeForum.value = forumSlug;
      router.push({ path: "/forum", query: { forum: forumSlug } }); 
    };

    onMounted(fetchForums);

    return { forums, activeForumSlug: activeForum, LucideIcons, selectForum };
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
</style>
