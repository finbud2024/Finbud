<template>
  <div class="forum-layout" v-if="ready">
    <!-- Sidebar -->
    <ForumSidebar class="sidebar" />

    <div class="content">
      <!-- Forum Banner -->
      <ForumBanner :forum="activeForumDetails" class="forum-banner" />

      <!-- List of Threads -->
      <div class="thread-list">
        <!-- Skeleton Loader -->
        <div v-if="loadingThreads">
          <div v-for="n in 5" :key="n" class="skeleton-card"></div>
        </div>

        <!-- Actual Threads -->
        <ThreadCard
          v-else
          v-for="thread in visibleThreads"
          :key="thread._id"
          :thread="thread"
          v-memo="[thread]"
        />

        <!-- Load More Button -->
        <button
          v-if="visibleThreads.length < allThreads.length && !loadingThreads"
          @click="loadMore"
          class="load-more"
        >
          Load More
        </button>
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

const INITIAL_LOAD = 10;
const LOAD_STEP = 10;

export default {
  components: { ThreadCard, ForumSidebar, ForumBanner },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const ready = ref(false);
    const loadingThreads = ref(true);

    const activeForum = ref(route.query.forum || "p/general");
    const forums = ref([]);
    const allThreads = ref([]);
    const visibleCount = ref(INITIAL_LOAD);

    const userId = computed(() => store.getters["users/userId"]);
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
        loadingThreads.value = true;
        const response = await api.get(
          `/api/posts/forum/${activeForum.value}?userId=${userId.value}`,
          { withCredentials: true }
        );
        allThreads.value = response.data;
        visibleCount.value = INITIAL_LOAD;
        loadingThreads.value = false;
      } catch (error) {
        console.error("Error fetching threads:", error);
        loadingThreads.value = false;
      }
    };

    const loadMore = () => {
      visibleCount.value += LOAD_STEP;
    };

    const visibleThreads = computed(() =>
      allThreads.value.slice(0, visibleCount.value)
    );

    const activeForumDetails = computed(() => {
      return forums.value.find(f => f.slug === activeForum.value) || {};
    });

    watch(() => route.query.forum, async (newForum, oldForum) => {
      if (newForum !== oldForum) {
        activeForum.value = newForum || "p/general";
        await fetchThreads();
      }
    });

    onMounted(async () => {
      // Show UI immediately
      ready.value = true;
      
      // First check auth
      store.dispatch("users/fetchCurrentUser");
      if (!isAuthenticated.value) {
        router.push("/login");
        return;
      }

      fetchForums();
      fetchThreads();
    });

    return {
      activeForum,
      activeForumDetails,
      visibleThreads,
      allThreads,
      isAuthenticated,
      ready,
      loadMore,
      loadingThreads,
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

.load-more {
  margin: 10px auto 0;
  padding: 10px 20px;
  border: none;
  background-color: var(--primary);
  color: white;
  cursor: pointer;
  border-radius: 8px;
}

/* Inline Skeleton Style */
.skeleton-card {
  height: 120px;
  border-radius: 8px;
  background: linear-gradient(90deg, #eee 25%, #ddd 37%, #eee 63%);
  background-size: 400% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}
</style>