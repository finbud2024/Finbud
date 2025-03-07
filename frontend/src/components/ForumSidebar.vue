<template>
  <aside class="sidebar">
    <h2>Forums</h2>
    <ul>
      <li v-for="forum in forums" :key="forum.id"
          :class="{ 'selected': activeForum === forum.id }"
          @click="selectForum(forum.id)">
        <img :src="forum.logo" class="forum-icon" />
        <span class="forum-name">{{ forum.name }}</span>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      activeForum: "p/general", 
      forums: [
        { id: "p/general", name: "p/general", logo: "/assets/icons/general.svg" },
        { id: "p/investing", name: "p/investing", logo: "/assets/icons/investing.svg" },
        { id: "p/crypto", name: "p/crypto", logo: "/assets/icons/crypto.svg" },
        { id: "p/economy", name: "p/economy", logo: "/assets/icons/economy.svg" },
        { id: "p/personal-finance", name: "p/personal-finance", logo: "/assets/icons/personal-finance.svg" },
        { id: "p/real-estate", name: "p/real-estate", logo: "/assets/icons/real-estate.svg" },
        { id: "p/startups", name: "p/startups", logo: "/assets/icons/startups.svg" },
        { id: "p/fintech", name: "p/fintech", logo: "/assets/icons/fintech.svg" },
        { id: "p/ama", name: "p/ama", logo: "/assets/icons/ama.svg" },
        { id: "p/self-promotion", name: "p/self-promotion", logo: "/assets/icons/self-promotion.svg" },
        { id: "p/memes", name: "p/memes", logo: "/assets/icons/memes.svg" },
        { id: "p/education", name: "p/education", logo: "/assets/icons/education.svg" }
      ],
    };
  },
  methods: {
    selectForum(forumId) {
      this.activeForum = forumId;
      this.$emit("forum-selected", forumId);
    },
  },
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
  font-size: 16px;
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
  font-size: 14px;
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
