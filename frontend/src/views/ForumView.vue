<template>
  <div class="forum-layout">
    <!-- Sidebar -->
    <ForumSidebar @forum-selected="setActiveForum" class="sidebar" />

    <div class="content">
      <!-- Forum Banner -->
      <ForumBanner :forum="activeForumDetails" class="forum-banner" />

      <!-- List of Threads -->
      <div class="thread-list">
        <ThreadCard 
          v-for="thread in filteredThreads" 
          :key="thread._id" 
          :thread="thread" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ThreadCard from "@/components/ThreadCard.vue";
import ForumSidebar from "@/components/ForumSidebar.vue";
import ForumBanner from "@/components/ForumBanner.vue";
import { computed, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { ThreadCard, ForumSidebar, ForumBanner },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const activeForum = ref(route.query.forum || "p/general");
    const forums = ref([]);

    const fetchForums = async () => {
      try {
        const response = await axios.get(api);
        forums.value = response.data;
      } catch (error) {
        console.error("Failed to fetch forums:", error);
      }
    };

    const activeForumDetails = computed(() => {
      return forums.value.find(forum => forum.slug === activeForum.value) || {};
    });

    function setActiveForum(forumSlug) {
      activeForum.value = forumSlug;
      router.push({ path: "/forum", query: { forum: forumSlug } });
    }

    onMounted(fetchForums);

    return {
      activeForum,
      activeForumDetails,
      setActiveForum
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

.forum-banner {
  width: 100%;
}

.thread-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
