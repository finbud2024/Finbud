<template>
  <div v-if="hasValidForum" class="forum-banner">
    <div class="forum-info">
      <component 
        :is="LucideIcons[forum.logo] || LucideIcons['HelpCircle']" 
        class="forum-icon" 
      />
      <div class="forum-text">
        <h1>{{ forum.name }}</h1>
        <p>{{ forum.description }}</p>
      </div>
    </div>

    <button @click="navigateToStartThread" class="start-thread-btn">
      Start new thread
    </button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { computed } from "vue";
import * as LucideIcons from "lucide-vue-next";

export default {
  props: {
    forum: Object,
  },
  setup(props) {
    const router = useRouter();

    const hasValidForum = computed(() => {
      return props.forum && props.forum.name && props.forum.description;
    });

    const navigateToStartThread = () => {
      router.push({
        path: "/start-thread",
        query: { forum: props.forum?.slug || "p/general" },
      });
    };

    return { LucideIcons, navigateToStartThread, hasValidForum };
  }
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
  background: black;
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
  background: black;
}

.icon {
  width: 18px;
  height: 18px;
}
</style>
