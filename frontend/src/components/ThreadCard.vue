<template>
  <div v-if="thread" class="thread-card"
       :class="{ 'hovered': isHovered }"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false"
       @click="goToThread">
    
    <div class="thread-header">
      <span class="forum-name">{{ thread?.forumId?.name || "Unknown Forum" }}</span>
      <span class="separator">•</span>
      <img :src="thread?.author?.profilePicture || '/default-avatar.png'" alt="Author" class="author-avatar" />
      <span class="author">{{ thread?.author?.displayName || "Anonymous" }}</span>
      <span class="separator">•</span>
      <span class="date">{{ formatDate(thread?.createdAt) }}</span>
    </div>

    <h2 class="thread-title">{{ thread?.title || "Untitled" }}</h2>

    <p class="thread-content">
      {{ thread?.body?.length > 150 ? thread?.body.substring(0, 150) + "..." : thread?.body || "No content available." }}
    </p>

    <div class="thread-footer">
      <span class="reaction like-reaction" @click.stop="toggleLike">
        <Heart class="icon" :class="{ 'liked': isLiked }" /> 
        <span :class="{ 'liked-text': isLiked }">{{ thread?.reactions?.likes || 0 }}</span>
      </span>
      <span class="reaction">
        <MessageCircle class="icon" /> {{ thread?.reactions?.comments || 0 }}
      </span>

      <!-- Share (Repeat) Button -->
      <span class="reaction" @click.stop="toggleShare">
        <Repeat class="icon" /> {{ thread?.reactions?.shares || 0 }}
      </span>

      <!-- Share Popup Component -->
      <ShareButton v-if="showShare" :postId="thread._id" @close="toggleShare" />

      <span class="reaction">
        <Send class="icon" />
      </span>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Heart, MessageCircle, Repeat, Send } from "lucide-vue-next";
import ShareButton from "@/components/ShareButton.vue";
import { mapGetters } from "vuex";

export default {
  components: { Heart, MessageCircle, Repeat, Send, ShareButton },
  props: {
    thread: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isHovered: false,
      isLiked: false,
      showShare: false,  // <-- Added to track share popup visibility
    };
  },
  computed: {
    ...mapGetters({
      userId: "users/userId"
    })
  },
  watch: {
    thread: {
      immediate: true,
      handler(newThread) {
        if (newThread && newThread.reactions && Array.isArray(newThread.reactions.likedUsers)) {
          this.isLiked = newThread.reactions.likedUsers.includes(this.userId);
        }
      }
    }
  },
  methods: {
    goToThread() {
      if (this.thread && this.thread._id) {
        this.$router.push({ name: "ThreadView", params: { id: this.thread._id } });
      }
    },
    formatDate(dateString) {
      if (!dateString) return "Unknown Date";
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    toggleShare() {
      this.showShare = !this.showShare;
    },
    async toggleLike() {
      this.isLiked = !this.isLiked;
      const action = this.isLiked ? "like" : "unlike";

      try {
        const response = await axios.post(
          `/.netlify/functions/server/api/posts/post/${this.thread._id}/like`,
          { userId: this.userId, action }
        );

        this.thread.reactions.likes = response.data.likes;

        if (!this.thread.reactions.likedUsers) {
          this.$set(this.thread.reactions, "likedUsers", []);
        }

        if (action === "like" && !this.thread.reactions.likedUsers.includes(this.userId)) {
          this.thread.reactions.likedUsers.push(this.userId);
        } else if (action === "unlike") {
          const index = this.thread.reactions.likedUsers.indexOf(this.userId);
          if (index !== -1) {
            this.thread.reactions.likedUsers.splice(index, 1);
          }
        }
      } catch (error) {
        console.error("❌ Error liking post:", error);
      }
    },
  },
};
</script>


<style scoped>
.thread-card {
  background: var(--background-primary);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid var(--background-tertiary);
  margin-bottom: 10px;
  transition: background 0.2s ease-in-out;
  cursor: pointer;
}

.thread-card:hover {
  background-color: #F2F4F7;
}

.thread-header {
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.forum-logo {
  width: 18px;
  height: 18px;
  border-radius: 4px;
}

.author-avatar {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}

.forum-name {
  font-weight: 600;
  color: var(--text-primary);
}

.author, .date {
  color: var(--text-secondary);
}

.separator {
  color: var(--text-tertiary);
}

.thread-title {
  font-size: 18px;
  font-weight: 600;
  margin: 5px 0;
}

.thread-content {
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: var(--text-primary);
  margin-top: 10px;
  margin-bottom: 5px;
}

.thread-footer {
  display: flex;
  align-items: center;
  gap: 32px;
  padding-top: 8px;
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

.liked {
  color: red;
  fill: red; 
}
.liked-text {
  color: red;
  font-weight: bold;
}

</style>
