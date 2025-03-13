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
          :key="thread.id" 
          :thread="thread" 
        />
      </div>
    </div>
  </div>
</template>

<script>
import ThreadCard from "@/components/ThreadCard.vue";
import ForumSidebar from "@/components/ForumSidebar.vue";
import ForumBanner from "@/components/ForumBanner.vue";
import { useStore } from "vuex";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  components: { ThreadCard, ForumSidebar, ForumBanner },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const activeForum = computed(() => route.query.forum || "p/general");

    const activeForumDetails = computed(() => {
      const forums = {
        "p/general": { name: "p/general", description: "General financial discussions", logo: "/assets/icons/general.svg" },
        "p/investing": { name: "p/investing", description: "Stock market and investment strategies", logo: "/assets/icons/investing.svg" },
        "p/crypto": { name: "p/crypto", description: "Cryptocurrency and blockchain", logo: "/assets/icons/crypto.svg" },
        "p/economy": { name: "p/economy", description: "Macroeconomics and financial news", logo: "/assets/icons/economy.svg" },
        "p/personal-finance": { name: "p/personal-finance", description: "Personal finance, budgeting, and saving tips", logo: "/assets/icons/personal-finance.svg" },
        "p/real-estate": { name: "p/real-estate", description: "Discussions about housing, mortgages, and real estate investments", logo: "/assets/icons/real-estate.svg" },
        "p/fintech": { name: "p/fintech", description: "Financial technology innovations and startups", logo: "/assets/icons/fintech.svg" },
        "p/ama": { name: "p/ama", description: "Ask Me Anything sessions with experts", logo: "/assets/icons/ama.svg" },
        "p/self-promotions": { name: "p/self-promotions", description: "Share your projects, blogs, and personal finance content", logo: "/assets/icons/self-promotions.svg" },
        "p/memes": { name: "p/memes", description: "Finance-related memes and humor", logo: "/assets/icons/memes.svg" },
        "p/education": { name: "p/education", description: "Learning resources and financial literacy", logo: "/assets/icons/education.svg" }
      };
      return forums[activeForum.value] || forums["p/general"];
    });

    // ✅ Get threads from Vuex `forum.js`
    const filteredThreads = computed(() => {
      return store.getters["forum/getForumThreads"](activeForum.value);
    });

    function setActiveForum(forumId) {
      router.push({ path: "/forum", query: { forum: forumId } });
    }

    return {
      activeForum,
      activeForumDetails,
      filteredThreads,
      setActiveForum,
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
