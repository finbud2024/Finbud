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
import api from "@/utils/api";
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
      showShare: false,
    };
  },
  computed: {
    ...mapGetters({
      userId: "users/userId",
      userModel: "users/userModel",
    }),
  },
  watch: {
    thread: {
      immediate: true,
      handler(newThread) {
        if (
          newThread &&
          newThread.reactions &&
          Array.isArray(newThread.reactions.likedUsers)
        ) {
          this.isLiked = newThread.reactions.likedUsers.includes(this.userId);
        }
      },
    },
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
        const response = await api.post(
          `/api/posts/post/${this.thread._id}/like`,
          {
            userId: this.userId,
            userModel: this.userModel, 
            action,
          },
          { withCredentials: true }
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
        console.error("Error liking post:", error);
      }
    },
  },
};
</script>


<style scoped>
.thread-card {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  color: white;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #333333;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.thread-card:hover {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  transform: translateY(-4px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  border-color: #444444;
}

.thread-header {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.forum-logo {
  width: 18px;
  height: 18px;
  border-radius: 4px;
}

.author-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #333333;
}

.forum-name {
  font-weight: 600;
  color: white;
}

.author, .date {
  color: rgba(255, 255, 255, 0.8);
}

.separator {
  color: rgba(255, 255, 255, 0.5);
}

.thread-title {
  font-size: 18px;
  font-weight: 700;
  margin: 8px 0 12px 0;
  color: white;
  line-height: 1.4;
}

.thread-content {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 12px;
  margin-bottom: 16px;
}

.thread-footer {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid #333333;
}

.reaction {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.reaction:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.liked {
  color: #ff4757;
  fill: #ff4757; 
}

.liked-text {
  color: #ff4757;
  font-weight: bold;
}

</style>