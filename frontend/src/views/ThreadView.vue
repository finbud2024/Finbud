<template>
  <div class="forum-layout">
    <ForumSidebar class="sidebar" :activeForumSlug="forumDetails?.slug" />
    <div class="content">
      <ForumBanner v-if="forumDetails" :forum="forumDetails" class="forum-banner" />

      <div class="thread-container" v-if="thread">
        <div class="thread-content">
          <div class="thread-header">
            <img :src="thread?.author?.profilePicture || '/default-avatar.png'" alt="Author Avatar" class="author-avatar" />
            <div class="thread-meta">
              <h1 class="thread-title">{{ thread?.title || "Untitled Thread" }}</h1>
              <div class="thread-info">
                <span class="author">{{ thread?.author?.displayName || "Anonymous" }}</span>
                <span class="separator">•</span>
                <span class="thread-date">{{ formatDate(thread?.createdAt) }}</span>
              </div>
            </div>
          </div>

          <p class="thread-body">{{ thread?.body || "No content available." }}</p>

          <div class="thread-footer">
            <span class="reaction like-reaction" @click="toggleLike">
              <Heart class="icon" :class="{ 'liked': isLiked }" />
              <span :class="{ 'liked-text': isLiked }">{{ thread.reactions.likes || 0 }}</span>
            </span>
            <span class="reaction">
              <MessageCircle class="icon" /> {{ thread?.reactions?.comments || 0 }}
            </span>
            <span class="reaction">
              <Repeat class="icon" /> {{ thread?.reactions?.shares || 0 }}
            </span>
            <span class="reaction">
              <Send class="icon" />
            </span>
          </div>

          <div class="comment-box-container">
            <textarea v-model="newComment" class="comment-box" placeholder="Add a comment..."></textarea>
            <button @click="addComment" class="comment-button">Comment</button>
          </div>

          <div class="replies">
            <h2>Replies</h2>
            <div v-for="(comment, index) in thread?.comments" :key="comment?._id" class="reply">
              <img :src="comment?.author?.profilePicture || '/default-avatar.png'" alt="Avatar" class="reply-avatar" />
              <div class="reply-content">
                <div class="reply-header">
                  <strong class="reply-author">{{ comment?.author?.displayName || "Anonymous" }}</strong>
                  <span class="reply-date">• {{ formatDate(comment?.createdAt) }}</span>
                </div>

                <p class="reply-text">{{ comment?.body || "No content available." }}</p>

                <div class="reply-actions">
                  <span class="reaction" @click="toggleCommentLike(index)">
                    <Heart class="icon" :class="{ 'liked': isCommentLiked(comment) }" />
                    <span :class="{ 'liked-text': isCommentLiked(comment) }">{{ comment.reactions.likes || 0 }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div v-else class="error-message">
        <p>Thread not found.</p>
      </div>
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

    // Fetch thread data
    const fetchThread = async () => {
      try {
        const postId = route.params.id;
        const response = await axios.get(`/.netlify/functions/server/api/posts/post/${postId}`, {
          withCredentials: true, // Ensure cookies are sent
        });

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

    // Ensure authentication before fetching thread
    onMounted(() => {
      if (!isAuthenticated.value) {
        router.push("/login"); // Redirect if not logged in
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

.thread-container {
  width: 100%;
  max-width: 800px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.thread-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.thread-meta {
  display: flex;
  flex-direction: column;
}

.thread-title {
  font-size: 18px;
  font-weight: bold;
  margin: 5px; 
}

.thread-info {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: var(--text-secondary);
  margin: 5px; 
}

.author-avatar,
.reply-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 8px;
}

.separator {
  margin: 0 5px;
}

.thread-body {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 32px;
}

.thread-footer,
.reply-actions {
  display: flex;
  gap: 32px;
  font-size: 14px;
  margin-bottom: 20px;
}

.reaction {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--text-secondary);
}

.icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.comment-box-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 10px; 
  display: flex; 
  flex-direction: column;
}

.comment-box {
  width: 100%;
  height: 96px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 16px;
  resize: vertical;
}

.comment-button {
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

.replies {
  margin-top: 10px;
}

.reply {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
}

.reply-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.reply-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

.reply-text {
  font-size: 16px;
  line-height: 1.4;
  margin-top: 4px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.reply-actions {
  display: flex;
  align-items: center;
  gap: 32px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 6px;
}

.reaction {
  display: flex;
  align-items: center;
  gap: 4px;
}

.liked {
  color: red;
  fill: red;
}
.liked-text {
  color: red;
  font-weight: bold;
}

</style>
