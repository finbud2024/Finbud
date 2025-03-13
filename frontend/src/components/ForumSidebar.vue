<template>
  <aside class="sidebar">
    <h2>Forums</h2>
    <ul>
      <li v-for="forum in forums" :key="forum._id"
          :class="{ 'selected': activeForum === forum.slug }"
          @click="selectForum(forum.slug)">
        <img :src="forum.logo || '/assets/icons/general.svg'" class="forum-icon" />
        <span class="forum-name">{{ forum.name }}</span>
      </li>
    </ul>
  </aside>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      activeForum: "p/general",
      forums: [] 
    };
  },
  methods: {
    async fetchForums() {
      try {
        console.log("Fetching forums...");
        const response = await axios.get("http://localhost:8888/.netlify/functions/server/api/forums");
        console.log("✅ Forums fetched:", response.data);
        this.forums = response.data;
      } catch (error) {
        console.error("❌ Failed to fetch forums:", error);
      }
    },
    selectForum(forumSlug) {
      this.activeForum = forumSlug;
      this.$router.push({ path: "/forum", query: { forum: forumSlug } });
      this.$emit("forum-selected", forumSlug);
    }
  },
  mounted() {
    this.fetchForums(); 
    const queryForum = this.$route.query.forum;
    if (queryForum) this.activeForum = queryForum;
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
