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
  gap: 16px;
  flex-wrap: wrap;
}

.forum-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1 1 60%;
  min-width: 260px;
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
  white-space: nowrap;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .forum-banner {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 16px;
  }

  .forum-info {
    flex: 1 1 100%;
    margin-bottom: 12px;
  }

  .start-thread-btn {
    width: 100%;
    justify-content: center;
    font-size: 14px;
  }

  .forum-text h1 {
    font-size: 18px;
  }

  .forum-text p {
    font-size: 14px;
  }
}
</style>