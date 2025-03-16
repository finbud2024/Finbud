<template>
  <div class="forum-layout">
    <!-- Sidebar -->
    <ForumSidebar class="sidebar" />

    <!-- Main Content -->
    <div class="content">
      <h1 class="page-title">Start new thread</h1>

      <!-- Select Forum Dropdown -->
      <div class="selected-forum">
        <select v-model="selectedForum" class="forum-dropdown">
          <option v-for="forum in forums" :key="forum._id" :value="forum._id">
            {{ forum.name }}
          </option>
        </select>
      </div>

      <!-- Thread Form -->
      <form @submit.prevent="submitThread" class="thread-form">
        <input v-model="title" type="text" placeholder="Title*" class="title-input" required />
        <textarea v-model="body" placeholder="Body" class="body-input" required></textarea>
        <button type="submit" class="submit-button">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { Heart, MessageCircle, Repeat, Send } from "lucide-vue-next";
import ForumSidebar from "@/components/ForumSidebar.vue";
import ForumBanner from "@/components/ForumBanner.vue";

export default {
  components: { ForumSidebar, ForumBanner, Heart, MessageCircle, Repeat, Send },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const newComment = ref("");
    const thread = ref(null);
    const forumDetails = ref(null);
    const isLiked = ref(false);

    const userId = computed(() => store.getters["users/userId"]);
    const isAuthenticated = computed(() => store.getters["users/isAuthenticated"]);

    const fetchThread = async () => {
      try {
        const postId = route.params.id;
        const response = await axios.get(`/.netlify/functions/server/api/posts/post/${postId}`);

        thread.value = response.data || null;

        if (thread.value?.forumId) {
          forumDetails.value = {
            name: thread.value.forumId.name,
            logo: thread.value.forumId.logo,
            slug: thread.value.forumId.slug
          };
        }

        thread.value.reactions = thread.value.reactions || { likes: 0, comments: 0, shares: 0, likedUsers: [] };

        if (!Array.isArray(thread.value.reactions.likedUsers)) {
          thread.value.reactions.likedUsers = [];
        }

        isLiked.value = thread.value.reactions.likedUsers.includes(userId.value);

        thread.value.comments.forEach(comment => {
          comment.reactions = comment.reactions || { likes: 0, likedUsers: [] };

          if (!Array.isArray(comment.reactions.likedUsers)) {
            comment.reactions.likedUsers = [];
          }

          comment.isLiked = comment.reactions.likedUsers.includes(userId.value);
        });

      } catch (error) {
        console.error("❌ Error fetching thread:", error);
      }
    };

    onMounted(() => {
      if (!isAuthenticated.value) {
        router.push("/login");
      } else {
        fetchThread();
      }
    });

    const formatDate = (dateString) => {
      if (!dateString) return "Unknown Date";
      const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(dateString).toLocaleString(undefined, options);
    };

    const addComment = async () => {
      if (!newComment.value.trim()) return;

      try {
        const response = await axios.post(
          `/.netlify/functions/server/api/posts/post/${thread.value._id}/add-comment`,
          { body: newComment.value },
          { withCredentials: true }
        );

        const newCommentData = response.data.comment;
        newCommentData.reactions = newCommentData.reactions || { likes: 0, likedUsers: [] };

        if (!Array.isArray(newCommentData.reactions.likedUsers)) {
          newCommentData.reactions.likedUsers = [];
        }

        thread.value.comments.push(newCommentData);
        thread.value.reactions.comments += 1;
        newComment.value = "";
      } catch (error) {
        console.error("❌ Error adding comment:", error);
      }
    };

    const toggleLike = async () => {
      const action = isLiked.value ? "unlike" : "like";

      try {
        const response = await axios.post(
          `/.netlify/functions/server/api/posts/post/${thread.value._id}/like`,
          { action },
          { withCredentials: true }
        );

        thread.value.reactions.likes = response.data.likes;

        if (action === "like") {
          if (!thread.value.reactions.likedUsers.includes(userId.value)) {
            thread.value.reactions.likedUsers.push(userId.value);
          }
        } else {
          thread.value.reactions.likedUsers = thread.value.reactions.likedUsers.filter(id => id !== userId.value);
        }

        isLiked.value = !isLiked.value;

      } catch (error) {
        console.error("❌ Error toggling like:", error);
      }
    };

    const isCommentLiked = (comment) => {
      return Array.isArray(comment.reactions?.likedUsers) && comment.reactions.likedUsers.includes(userId.value);
    };

    const toggleCommentLike = async (index) => {
      const comment = thread.value.comments[index];

      if (!comment.reactions) {
        comment.reactions = { likes: 0, likedUsers: [] };
      }
      if (!Array.isArray(comment.reactions.likedUsers)) {
        comment.reactions.likedUsers = [];
      }

      const isLiked = comment.reactions.likedUsers.includes(userId.value);
      const action = isLiked ? "unlike" : "like";

      try {
        const response = await axios.post(
          `/.netlify/functions/server/api/posts/post/${thread.value._id}/like-comment`,
          { commentId: comment._id, action },
          { withCredentials: true }
        );

        thread.value.comments[index].reactions.likes = response.data.likes;

        if (action === "like") {
          if (!comment.reactions.likedUsers.includes(userId.value)) {
            comment.reactions.likedUsers.push(userId.value);
          }
        } else {
          comment.reactions.likedUsers = comment.reactions.likedUsers.filter(id => id !== userId.value);
        }

        thread.value.comments[index].isLiked = !isLiked;

      } catch (error) {
        console.error("❌ Error toggling comment like:", error);
      }
    };

    return {
      newComment,
      thread,
      forumDetails,
      isLiked,
      userId,
      addComment,
      toggleLike,
      isCommentLiked,
      toggleCommentLike,
      formatDate 
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

.page-title {
  font-size: 24px;
  font-weight: bold;
}

.selected-forum {
  display: flex;
  align-items: center;
}

.forum-dropdown {
  width: 280px;
  padding: 10px;
  border-radius: 6px;
  font-size: 16px;
  border: 1px solid var(--border-color);
}

.thread-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start; 
}

.title-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  box-sizing: border-box;
}

.body-input {
  width: 100%;
  min-height: 200px; 
  padding: 12px;
  font-size: 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  resize: vertical;
  box-sizing: border-box;
  vertical-align: top;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-y: auto;
}

.submit-button {
  background: var(--primary-color) !important;
  color: var(--primary-color) !important;
  border: 2px solid #dddddd !important;
  align-self: flex-end;
  width: 90px;
  height: 44px;
  font-size: 16px;
  border-radius: 25px;
  cursor: pointer;
  text-align: center;
  margin-top: 10px;
}

.submit-button:hover {
  background: #0F1F3D;
}

</style>
