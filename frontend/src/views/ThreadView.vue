<template>
  <div class="forum-layout">
    <!-- Sidebar -->
    <ForumSidebar class="sidebar" />

    <div class="content">
      <!-- Forum Banner -->
      <ForumBanner :forum="forumDetails" class="forum-banner" />

      <div class="thread-container">
        <div class="thread-content">

          <!-- Thread Main Content -->
          <div class="thread-header">
            <img :src="thread.authorAvatar" alt="Author Avatar" class="author-avatar" />

            <div class="thread-meta">
              <h1 class="thread-title">{{ thread.title }}</h1>
              <div class="thread-info">
                <span class="author-name">{{ thread.author }}</span>
                <span class="separator">•</span>
                <span class="thread-date">{{ thread.date }}</span>
              </div>
            </div>
          </div>

          <p class="thread-body">{{ thread.content }}</p>

          <!-- Reaction Bar (Same as ThreadCard) -->
          <div class="thread-footer">
            <span class="reaction">
              <Heart class="icon" /> {{ thread.likes }}
            </span>
            <span class="reaction">
              <MessageCircle class="icon" /> {{ thread.comments }}
            </span>
            <span class="reaction">
              <Repeat class="icon" /> {{ thread.reposts }}
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
            <div v-for="reply in thread.replies" :key="reply.id" class="reply">
              
              <img :src="reply.authorAvatar" alt="Avatar" class="reply-avatar" />
              <div class="reply-content">
                
                <!-- Author & Date -->
                <div class="reply-header">
                  <strong class="reply-author">{{ reply.author }}</strong>
                  <span class="reply-date">• {{ reply.date }}</span>
                </div>

                <!-- Reply Body -->
                <p class="reply-text">{{ reply.text }}</p>

                <div class="reply-actions">
                  <span class="reaction">
                    <Heart class="icon" /> {{ reply.likes }}
                  </span>
                  <span class="reaction">
                    <MessageCircle class="icon" /> {{ reply.replies }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Heart, MessageCircle, Repeat, Send, AlertTriangle } from "lucide-vue-next";
import ForumSidebar from "@/components/ForumSidebar.vue";
import ForumBanner from "@/components/ForumBanner.vue";

export default {
  components: { ForumSidebar, ForumBanner, Heart, MessageCircle, Repeat, Send, AlertTriangle },
  data() {
    return {
      newComment: "",
      forumDetails: {
        name: "p/general",
        description: "Thảo luận tài chính tổng hợp",
        logo: "/assets/icons/general.svg",
      },
      thread: {
        id: "1",
        forum: "p/general",
        forumLogo: "/assets/icons/general.svg",
        author: "Matt Carroll",
        authorAvatar: "/assets/avatars/matt.png",
        date: "9h ago",
        title: "Cal Vs Calendly",
        content:
          "Is there any reason to prefer one over the other? Have you used both or either?\n\nMy needs are simple. I want to be able to add two accounts and let someone put a meeting on my calendar from a link. I think both cover the use case -- which should I use?",
        comments: 6,
        likes: 7,
        reposts: 2,
        replies: [
          {
            id: 1,
            author: "Steve Beyatte",
            authorAvatar: "/assets/avatars/steve.png",
            date: "8h ago",
            text: "@Cal.com has a more generous free plan, is open-source, and is bootstrapped. Those 3 make it my pick!",
            likes: 5,
            replies: 5,
          },
          {
            id: 2,
            author: "Eithiriel DeMerè",
            authorAvatar: "/assets/avatars/eithiriel.png",
            date: "4h ago",
            text: "@steveb Solid reasons.",
            likes: 3,
            replies: 5,
          },
          {
            id: 3,
            author: "David Leuliette",
            authorAvatar: "/assets/avatars/david.png",
            date: "8h ago",
            text: "cal.com because your needs are simple — now. But your usage will evolve over the years, and I personally found cal.com more flexible.",
            likes: 3,
            replies: 5,
          },
        ],
      },
    };
  },
  methods: {
    goBack() {
      this.$router.push("/"); 
    },
    addComment() {
      if (this.newComment.trim()) {
        this.thread.replies.push({
          id: this.thread.replies.length + 1,
          author: "You",
          authorAvatar: "/assets/avatars/your-avatar.png",
          date: "Just now",
          text: this.newComment,
          likes: 0,
        });
        this.newComment = "";
      }
    },
  },
};
</script>

<style scoped>
/* Layout */
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

/* Thread Content */
.thread-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.thread-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 32px;
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
  font-size: 14px;
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
  margin-bottom: 48px;
}

/* Reaction Bar */
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

/* Comment Section */
.comment-box-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 10px; 
  display: flex; 
  flex-direction: column;
}

/* Textbox */
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

/* Button */
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

/* Replies Section */
.replies {
  margin-top: 20px;
}

/* Individual Reply */
.reply {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
}

/* Avatar */
.reply-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

/* Reply Content */
.reply-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Author & Date */
.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 5px;
}

/* Reply Text */
.reply-text {
  font-size: 16px;
  line-height: 1.4;
  margin-top: 4px;
  color: var(--text-primary);
}

/* Reply Actions */
.reply-actions {
  display: flex;
  align-items: center;
  gap: 32px;
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 6px;
}

/* Reactions */
.reaction {
  display: flex;
  align-items: center;
  gap: 4px;
}

</style>
