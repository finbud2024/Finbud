<template>
  <div class="forum-layout">
    <ForumSidebar @forum-selected="setActiveForum" class="sidebar" />

    <div class="content">
      <ForumBanner :forum="activeForumDetails" class="forum-banner" />

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
      activeForum: "general",
      forums: {
        general: { name: "p/general", description: "Thảo luận tài chính tổng hợp", logo: "/assets/icons/general.svg" },
        investing: { name: "p/investing", description: "Đầu tư chứng khoán, vàng, bất động sản", logo: "/assets/icons/investing.svg" },
        crypto: { name: "p/crypto", description: "Tiền mã hóa & Blockchain", logo: "/assets/icons/crypto.svg" },
        economy: { name: "p/economy", description: "Phân tích thị trường, vĩ mô, lãi suất", logo: "/assets/icons/economy.svg" },
      },
      threads: [
        { id: 1, forum: "general", forumLogo: "/assets/icons/general.svg", author: "John Doe", authorAvatar: "/assets/avatars/john.png", date: "2h ago", title: "Best investment strategies?", content: "Looking for solid investment strategies for 2025.", comments: 12, likes: 360, reposts: 8 },
        { id: 2, forum: "investing", forumLogo: "/assets/icons/investing.svg", author: "Jane Smith", authorAvatar: "/assets/avatars/jane.png", date: "5h ago", title: "How to manage financial risks?", content: "Looking for ways to handle financial risks effectively.", comments: 10, likes: 150, reposts: 4 },
      ],
    };
  },
  computed: {
    activeForumDetails() {
      return this.forums[this.activeForum] || this.forums["general"];
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
