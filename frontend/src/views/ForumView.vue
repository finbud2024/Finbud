<template>
  <div class="forum-layout" v-if="ready">
    <!-- Sidebar -->
    <ForumSidebar class="sidebar" />

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
import api from "@/utils/api";
import ThreadCard from "@/components/ThreadCard.vue";
import ForumSidebar from "@/components/ForumSidebar.vue";
import ForumBanner from "@/components/ForumBanner.vue";
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { ThreadCard, ForumSidebar, ForumBanner },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const ready = ref(false);

    const activeForum = ref(route.query.forum || "p/general");
    const forums = ref([]);
    const threads = ref([]);

    const userId = computed(() => store.getters["users/userId"]);
    const userModel = computed(() => store.getters["users/userModel"]);
    const isAuthenticated = computed(() => store.getters["users/isAuthenticated"]);

    const fetchForums = async () => {
      try {
        const response = await api.get("/api/forums", { withCredentials: true });
        forums.value = response.data;
      } catch (error) {
        console.error("Failed to fetch forums:", error);
      }
    };

    const fetchThreads = async () => {
      try {
        console.log(`Fetching threads for: ${activeForum.value}`);
        const response = await api.get(
          `/api/posts/forum/${activeForum.value}?userId=${userId.value}`,
          { withCredentials: true }
        );
        console.log("Fetched threads:", response.data);
        threads.value = response.data;
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    watch(() => route.query.forum, (newForum) => {
      activeForum.value = newForum || "p/general";
      fetchThreads();
    });

    const activeForumDetails = computed(() => {
      return forums.value.find(f => f.slug === activeForum.value) || {};
    });


    onMounted(async () => {
      await store.dispatch("users/fetchCurrentUser");

      if (!isAuthenticated.value) {
        router.push("/login");
        return;
      }

      await fetchForums();
      await fetchThreads();
      ready.value = true;
    });

    return {
      activeForum,
      activeForumDetails,
      filteredThreads: computed(() => threads.value),
      isAuthenticated,
      ready
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
