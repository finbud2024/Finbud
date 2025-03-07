<template>
  <div class="forum-banner">
    <div class="forum-info">
      <img :src="forum.logo" class="forum-icon" alt="Forum Logo" />
      <div class="forum-text">
        <h1>{{ forum.name }}</h1>
        <p>{{ forum.description }}</p>
      </div>
    </div>
    
    <!-- Start New Thread Button -->
    <button @click="navigateToStartThread" class="start-thread-btn">
      <MessageSquarePlus class="icon" />
      Start new thread
    </button>
  </div>
</template>

<script>
import { MessageSquarePlus } from "lucide-vue-next";
import { useRouter } from "vue-router";

export default {
  components: { MessageSquarePlus },
  props: {
    forum: Object,
  },
  setup() {
    const router = useRouter();

    const navigateToStartThread = () => {
      router.push("/start-thread"); 
    };

    return { navigateToStartThread };
  },
};
</script>

<style scoped>
.forum-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  border: 1px solid #e0e0e0; 
  border-radius: 12px;
  padding: 32px 24px; 
  margin-bottom: 20px;
  min-height: 96px; 
}

.forum-info {
  display: flex;
  align-items: center;
  gap: 16px; 
}

.forum-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #ffffff;
  padding: 8px;
  border: 1px solid #dcdcdc; 
}

.forum-text h1 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.forum-text p {
  font-size: 16px; 
  color: #6c757d;
  margin: 4px 0 0;
  max-width: 500px;
}

.start-thread-btn {
  background: #007bff;
  color: white;
  padding: 12px 22px; 
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.2s ease-in-out;
}

.start-thread-btn:hover {
  background: #0056b3;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
