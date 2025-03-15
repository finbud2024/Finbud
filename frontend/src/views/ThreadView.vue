<template>
  <div class="forum-layout">
    <!-- ✅ Pass forum slug to Sidebar to highlight correct forum -->
    <ForumSidebar class="sidebar" :activeForumSlug="forumDetails?.slug" />

    <div class="content">
      <!-- ✅ Show Forum Banner based on thread's forum -->
      <ForumBanner v-if="forumDetails" :forum="forumDetails" class="forum-banner" />

      <div class="thread-container" v-if="thread">
        <div class="thread-content">
          <!-- Thread Main Content -->
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

          <!-- Reaction Bar -->
          <div class="thread-footer">
            <span class="reaction">
              <Heart class="icon" /> {{ thread?.reactions?.likes || 0 }}
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

          <!-- Comment Input Section -->
          <div class="comment-box-container">
            <textarea v-model="newComment" class="comment-box" placeholder="Add a comment..."></textarea>
            <button @click="addComment" class="comment-button">Comment</button>
          </div>

          <!-- Replies Section -->
          <div class="replies">
            <h2>Replies</h2>
            <div v-for="comment in thread?.comments" :key="comment?._id" class="reply">
              <img :src="comment?.author?.profilePicture || '/default-avatar.png'" alt="Avatar" class="reply-avatar" />
              <div class="reply-content">
                <div class="reply-header">
                  <strong class="reply-author">{{ comment?.author?.displayName || "Anonymous" }}</strong>
                  <span class="reply-date">• {{ formatDate(comment?.createdAt) }}</span>
                </div>

                <p class="reply-text">{{ comment?.body || "No content available." }}</p>

                <div class="reply-actions">
                  <span class="reaction">
                    <Heart class="icon" /> {{ comment?.likes || 0 }}
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
import { Heart, MessageCircle, Repeat, Send } from "lucide-vue-next";
import { useRoute } from "vue-router";
import ForumSidebar from "@/components/ForumSidebar.vue";
import ForumBanner from "@/components/ForumBanner.vue";

export default {
  components: { ForumSidebar, ForumBanner, Heart, MessageCircle, Repeat, Send },
  data() {
    return {
      newComment: "",
      thread: null,
      forumDetails: null
    };
  },
  async created() {
    try {
      console.log("Route Params ID:", this.$route.params.id);

      const postId = this.$route.params.id;
      const response = await axios.get(`/.netlify/functions/server/api/posts/post/${postId}`);

      console.log("API Response:", response.data);
      this.thread = response.data || null;

      if (this.thread?.forumId) {
        this.forumDetails = {
          name: this.thread.forumId.name,
          logo: this.thread.forumId.logo,
          slug: this.thread.forumId.slug
        };
      }
    } catch (error) {
      console.error("❌ Error fetching thread:", error);
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "Unknown Date";
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async addComment() {
      if (!this.newComment.trim()) return;
      
      try {
        console.log("Submitting comment:", this.newComment);

        const response = await axios.post(
          `/.netlify/functions/server/api/posts/post/${this.thread._id}/add-comment`,
          {
            body: this.newComment,
            authorId: "67b3c1f309b3978d12ea0b8f" 
          }
        );

        console.log("✅ Comment added:", response.data);

        this.thread.comments.push(response.data.comment);
        this.newComment = "";
      } catch (error) {
        console.error(
          "❌ Error adding comment:",
          error.response ? error.response.data : error.message
        );
      }
    }
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

</style>
