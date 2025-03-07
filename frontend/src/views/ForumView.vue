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

export default {
  components: { ThreadCard, ForumSidebar, ForumBanner },
  data() {
    return {
      activeForum: "p/general", 
      forums: {
        "p/general": { name: "p/general", description: "Thảo luận tài chính tổng hợp", logo: "/assets/icons/general.svg" },
        "p/investing": { name: "p/investing", description: "Đầu tư chứng khoán, vàng, bất động sản", logo: "/assets/icons/investing.svg" },
        "p/crypto": { name: "p/crypto", description: "Tiền mã hóa & Blockchain", logo: "/assets/icons/crypto.svg" },
        "p/economy": { name: "p/economy", description: "Phân tích thị trường, vĩ mô, lãi suất", logo: "/assets/icons/economy.svg" },
      },
      threads: [
        { id: 1, forum: "p/general", forumLogo: "/assets/icons/general.svg", author: "John Doe", authorAvatar: "/assets/avatars/john.png", date: "2h ago", title: "Best investment strategies?", content: "Looking for solid investment strategies for 2025.", comments: 12, likes: 360, reposts: 8 },
        { id: 2, forum: "p/investing", forumLogo: "/assets/icons/investing.svg", author: "Jane Smith", authorAvatar: "/assets/avatars/jane.png", date: "5h ago", title: "How to manage financial risks?", content: "Looking for ways to handle financial risks effectively.", comments: 10, likes: 150, reposts: 4 },
        { id: 3, forum: "p/crypto", forumLogo: "/assets/icons/crypto.svg", author: "Alice Johnson", authorAvatar: "/assets/avatars/alice.png", date: "1h ago", title: "Latest crypto trends?", content: "What do you think about the latest trends in cryptocurrency?", comments: 8, likes: 220, reposts: 5 },
        { id: 4, forum: "p/economy", forumLogo: "/assets/icons/economy.svg", author: "Bob Brown", authorAvatar: "/assets/avatars/bob.png", date: "3h ago", title: "Interest rate hikes", content: "How will interest rate hikes impact the economy?", comments: 7, likes: 90, reposts: 2 },
      ],
    };
  },
  computed: {
    activeForumDetails() {
      return this.forums[this.activeForum] || this.forums["p/general"];
    },
    filteredThreads() {
      return this.threads.filter(thread => thread.forum === this.activeForum);
    }
  },
  methods: {
    setActiveForum(id) {
      this.activeForum = id;
    },
  },
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
