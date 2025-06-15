<template>
  <div class="finverse-layout" v-if="ready">
    <!-- Enhanced Header -->
    <div class="finverse-header">
      <div class="header-content">
        <div class="hero-section">
          <h1 class="finverse-title">
            <font-awesome-icon icon="fa-solid fa-users" class="title-icon" />
            FinVerse Community
          </h1>
          <p class="finverse-subtitle">Connect, Learn, and Grow Together in the Financial World</p>
          <div class="community-stats">
            <div class="stat-item">
              <span class="stat-number">2.5K+</span>
              <span class="stat-label">Active Members</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">150+</span>
              <span class="stat-label">Daily Discussions</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">50+</span>
              <span class="stat-label">Expert Contributors</span>
            </div>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="quick-actions">
          <button class="action-btn primary" @click="createNewThread">
            <font-awesome-icon icon="fa-solid fa-plus" />
            Start Discussion
          </button>
          <button class="action-btn secondary" @click="joinCommunity">
            <font-awesome-icon icon="fa-solid fa-heart" />
            Join Community
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-layout">
      <!-- Enhanced Sidebar -->
      <div class="enhanced-sidebar">
        <ForumSidebar class="sidebar-component" />
        
        <!-- Trending Topics -->
        <div class="trending-section">
          <h3>🔥 Trending Topics</h3>
          <div class="trending-list">
            <div v-for="topic in trendingTopics" :key="topic.id" class="trending-item">
              <span class="topic-tag">#{{ topic.tag }}</span>
              <span class="topic-count">{{ topic.count }} posts</span>
            </div>
          </div>
        </div>
        
        <!-- Online Members -->
        <div class="online-section">
          <h3>🟢 Online Now</h3>
          <div class="online-members">
            <div v-for="member in onlineMembers" :key="member.id" class="member-avatar">
              <img :src="member.avatar" :alt="member.name" />
              <span class="member-name">{{ member.name }}</span>
            </div>
          </div>
        </div>
      </div>

    <div class="content">
        <!-- Enhanced Forum Banner -->
      <ForumBanner :forum="activeForumDetails" class="forum-banner" />

        <!-- Filter and Sort Options -->
        <div class="content-controls">
          <div class="filter-tabs">
            <button 
              v-for="filter in filterOptions" 
              :key="filter.key"
              :class="['filter-tab', { active: activeFilter === filter.key }]"
              @click="setFilter(filter.key)"
            >
              <font-awesome-icon :icon="filter.icon" />
              {{ filter.label }}
            </button>
          </div>
          <div class="sort-dropdown">
            <select v-model="sortBy" @change="sortThreads">
              <option value="latest">Latest Posts</option>
              <option value="popular">Most Popular</option>
              <option value="trending">Trending</option>
              <option value="unanswered">Unanswered</option>
            </select>
          </div>
        </div>

        <!-- Thread List -->
      <div class="thread-list">
        <!-- Skeleton Loader -->
          <div v-if="loadingThreads" class="skeleton-container">
          <div v-for="n in 5" :key="n" class="skeleton-card"></div>
        </div>

          <!-- Enhanced Thread Cards -->
          <div v-else class="threads-grid">
        <ThreadCard
          v-for="thread in visibleThreads"
          :key="thread._id"
          :thread="thread"
          v-memo="[thread]"
              class="enhanced-thread-card"
        />
          </div>

        <!-- Load More Button -->
        <button
          v-if="visibleThreads.length < allThreads.length && !loadingThreads"
          @click="loadMore"
            class="load-more-btn"
        >
            <font-awesome-icon icon="fa-solid fa-chevron-down" />
            {{ $t('forumPage.loadMore', 'Load More Discussions') }}
        </button>
        
        <!-- No threads message -->
        <div v-if="!loadingThreads && allThreads.length === 0" class="no-threads">
            <div class="empty-state">
              <font-awesome-icon icon="fa-solid fa-comments" class="empty-icon" />
              <h3>No discussions yet</h3>
              <p>Be the first to start a conversation!</p>
              <button class="action-btn primary" @click="createNewThread">
                Start First Discussion
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import ThreadCard from "@/components/ThreadCard.vue";
import ForumSidebar from "@/components/FinEdu/Forum/ForumSidebar.vue";
import ForumBanner from "@/components/FinEdu/Forum/ForumBanner.vue";
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faUsers, faPlus, faHeart, faComments, faChevronDown, 
  faFire, faEye, faThumbsUp, faReply, faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';

library.add(
  faUsers, faPlus, faHeart, faComments, faChevronDown, 
  faFire, faEye, faThumbsUp, faReply, faSearch, faFilter
);

const INITIAL_LOAD = 10;
const LOAD_STEP = 10;

export default {
  components: { ThreadCard, ForumSidebar, ForumBanner, FontAwesomeIcon },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const ready = ref(false);
    const loadingThreads = ref(true);

    const activeForum = ref(route.query.forum || "p/general");
    const forums = ref([]);
    const allThreads = ref([]);
    const visibleCount = ref(INITIAL_LOAD);
    const activeFilter = ref('all');
    const sortBy = ref('latest');

    // Enhanced data for community features
    const trendingTopics = ref([
      { id: 1, tag: 'crypto', count: 45 },
      { id: 2, tag: 'stocks', count: 38 },
      { id: 3, tag: 'trading', count: 32 },
      { id: 4, tag: 'investment', count: 28 },
      { id: 5, tag: 'portfolio', count: 24 }
    ]);

    const onlineMembers = ref([
      { id: 1, name: 'Alex', avatar: '/default-avatar.png' },
      { id: 2, name: 'Sarah', avatar: '/default-avatar.png' },
      { id: 3, name: 'Mike', avatar: '/default-avatar.png' },
      { id: 4, name: 'Lisa', avatar: '/default-avatar.png' }
    ]);

    const filterOptions = ref([
      { key: 'all', label: 'All Posts', icon: 'fa-solid fa-comments' },
      { key: 'popular', label: 'Popular', icon: 'fa-solid fa-fire' },
      { key: 'recent', label: 'Recent', icon: 'fa-solid fa-clock' },
      { key: 'unanswered', label: 'Unanswered', icon: 'fa-solid fa-question-circle' }
    ]);

    const userId = computed(() => store.getters["users/userId"]);
    const isAuthenticated = computed(() => store.getters["users/isAuthenticated"]);

    const fetchForums = async () => {
      try {
        const response = await api.get("/api/forums", { withCredentials: true });
        forums.value = response.data;
      } catch (error) {
        console.error("Failed to fetch forums:", error);
      }
    };

    const fetchThreads = async () => {
      try {
        loadingThreads.value = true;
        const response = await api.get(
          `/api/posts/forum/${activeForum.value}?userId=${userId.value}`,
          { withCredentials: true }
        );
        allThreads.value = response.data;
        visibleCount.value = INITIAL_LOAD;
        loadingThreads.value = false;
      } catch (error) {
        console.error("Error fetching threads:", error);
        loadingThreads.value = false;
      }
    };

    const loadMore = () => {
      visibleCount.value += LOAD_STEP;
    };

    const createNewThread = () => {
      router.push('/forum/create');
    };

    const joinCommunity = () => {
      // Add join community logic
      console.log('Joining community...');
    };

    const setFilter = (filterKey) => {
      activeFilter.value = filterKey;
      // Add filtering logic here
    };

    const sortThreads = () => {
      // Add sorting logic here
      console.log('Sorting by:', sortBy.value);
    };

    const visibleThreads = computed(() =>
      allThreads.value.slice(0, visibleCount.value)
    );

    const activeForumDetails = computed(() => {
      return forums.value.find(f => f.slug === activeForum.value) || {};
    });

    watch(() => route.query.forum, async (newForum, oldForum) => {
      if (newForum !== oldForum) {
        activeForum.value = newForum || "p/general";
        await fetchThreads();
      }
    });

    onMounted(async () => {
      // Show UI immediately
      ready.value = true;
      
      // First check auth
      store.dispatch("users/fetchCurrentUser");
      if (!isAuthenticated.value) {
        router.push("/login");
        return;
      }

      fetchForums();
      fetchThreads();
    });

    return {
      activeForum,
      activeForumDetails,
      visibleThreads,
      allThreads,
      isAuthenticated,
      ready,
      loadMore,
      loadingThreads,
      activeFilter,
      sortBy,
      trendingTopics,
      onlineMembers,
      filterOptions,
      createNewThread,
      joinCommunity,
      setFilter,
      sortThreads
    };
  }
};
</script>

<style scoped>
/* FinVerse Enhanced Styling */
.finverse-layout {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Enhanced Header */
.finverse-header {
  background: #fff;
  color: #1a1a1a;
  padding: 4rem 0;
  margin-bottom: 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.finverse-header::before {
  display: none;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3rem;
  position: relative;
  z-index: 2;
}

.hero-section {
  flex: 1;
}

.finverse-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: #1a1a1a;
  background: none;
  -webkit-background-clip: unset;
  -webkit-text-fill-color: unset;
  text-shadow: none;
  line-height: 1.1;
}

.title-icon {
  color: #1a1a1a;
  font-size: 3rem;
  filter: none;
}

.finverse-subtitle {
  font-size: 1.3rem;
  opacity: 0.95;
  margin-bottom: 2.5rem;
  line-height: 1.7;
  max-width: 600px;
  color: #333;
}

.community-stats {
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 16px;
  backdrop-filter: none;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: #e5e7eb;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  text-shadow: none;
}

.stat-label {
  font-size: 0.95rem;
  opacity: 0.9;
  color: #666;
  font-weight: 500;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-btn {
  padding: 1.25rem 2.5rem;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  justify-content: center;
  min-width: 200px;
  font-size: 1.05rem;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn.primary {
  background: linear-gradient(135deg, #000000, #1a1a1a, #000000);
  color: white;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.action-btn.primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
}

.action-btn.secondary {
  background: rgba(0, 0, 0, 0.1);
  color: #1a1a1a;
  border: 2px solid rgba(0, 0, 0, 0.2);
}

.action-btn.secondary:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* Main Layout */
.main-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 4rem;
  align-items: start;
  background: #f8f9fa;
  min-height: calc(100vh - 200px);
}

/* Enhanced Sidebar */
.enhanced-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 2rem;
}

.sidebar-component {
  background: white;
  color: #1a1a1a;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  }

.trending-section, .online-section {
  background: white;
  color: #1a1a1a;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.trending-section:hover, .online-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

.trending-section h3, .online-section h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trending-list {
  display: flex;
    flex-direction: column;
    gap: 1rem;
  }

.trending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
  }

.trending-item:hover {
  background: #e5e7eb;
  transform: translateX(8px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.topic-tag {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 0.95rem;
  }

.topic-count {
  color: #666;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
}

.online-members {
  display: flex;
    flex-direction: column;
  gap: 0.75rem;
}

.member-avatar {
  display: flex;
  align-items: center;
    gap: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.member-avatar:hover {
  background: #f8f9fa;
  transform: translateX(5px);
  border-color: #e5e7eb;
}

.member-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.member-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
}

/* Content Area */
.content {
  display: flex;
    flex-direction: column;
  gap: 2rem;
}

.forum-banner {
  background: white;
  color: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  }

/* Content Controls */
.content-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  background: white;
  color: #1a1a1a;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  }

.filter-tabs {
  display: flex;
  gap: 0.75rem;
    flex-wrap: wrap;
  }

.filter-tab {
  padding: 1rem 1.5rem;
  border: none;
  background: #f8f9fa;
  color: #666;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
    gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid #e5e7eb;
}

.filter-tab:hover {
  background: #e5e7eb;
  color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

.filter-tab.active {
  background: linear-gradient(135deg, #000000, #1a1a1a);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-color: #333;
  }

.sort-dropdown select {
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f8f9fa;
  color: #1a1a1a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  }

.sort-dropdown select:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
}

/* Thread List */
.thread-list {
  background: white;
  color: #1a1a1a;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  }

.skeleton-container {
    padding: 1.5rem;
  display: flex;
  flex-direction: column;
    gap: 1rem;
  }

.skeleton-card {
  height: 120px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f3f4 25%, #e8eaed 50%, #f1f3f4 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.threads-grid {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.enhanced-thread-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.enhanced-thread-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.load-more-btn {
  margin: 2rem;
  padding: 1rem 2rem;
  border: none;
  background: linear-gradient(135deg, #000000, #333333);
  color: white;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Empty State */
.no-threads {
  padding: 4rem 2rem;
}

.empty-state {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: #ccc;
  margin-bottom: 1rem;
  }

.empty-state h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
  margin: 0;
  }

/* Responsive Design */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .enhanced-sidebar {
    order: 2;
    flex-direction: row;
    overflow-x: auto;
    gap: 1rem;
  }

  .trending-section, .online-section {
    min-width: 250px;
    flex-shrink: 0;
  }

  .content {
    order: 1;
  }
}

@media (max-width: 768px) {
  .finverse-header {
    padding: 2rem 0;
  }

  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 2rem;
  }

  .finverse-title {
    font-size: 2rem;
  }

  .community-stats {
    justify-content: center;
  }

  .quick-actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .main-layout {
    padding: 0 1rem;
  }

  .content-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-tabs {
    flex-wrap: wrap;
    justify-content: center;
  }

  .enhanced-sidebar {
    flex-direction: column;
  }

  .trending-section, .online-section {
    min-width: auto;
  }
}

/* Dark mode styles */
.dark-mode .finverse-layout {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #f9fafb;
}

.dark-mode .finverse-header {
  background: #374151;
  color: #f9fafb;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.dark-mode .finverse-title {
  color: #f9fafb;
}

.dark-mode .title-icon {
  color: #f9fafb;
}

.dark-mode .finverse-subtitle {
  color: #d1d5db;
}

.dark-mode .stat-item {
  background: #4b5563;
  border-color: #6b7280;
  color: #f9fafb;
}

.dark-mode .stat-item:hover {
  background: #6b7280;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dark-mode .action-btn {
  background: #1f2937;
  color: #f9fafb;
  border-color: #4b5563;
}

.dark-mode .action-btn:hover {
  background: #374151;
  border-color: #6b7280;
}

.dark-mode .main-container {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
}

.dark-mode .enhanced-sidebar {
  background: #374151;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dark-mode .sidebar-section h3 {
  color: #f9fafb;
}

.dark-mode .trending-topic {
  background: #4b5563;
  color: #f9fafb;
}

.dark-mode .trending-topic:hover {
  background: #6b7280;
}

.dark-mode .member-item {
  background: #4b5563;
  color: #f9fafb;
}

.dark-mode .member-item:hover {
  background: #6b7280;
}

.dark-mode .content-controls {
  background: #374151;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dark-mode .filter-tab {
  background: #4b5563;
  color: #d1d5db;
  border-color: #6b7280;
}

.dark-mode .filter-tab.active {
  background: #1f2937;
  color: #f9fafb;
  border-color: #f9fafb;
}

.dark-mode .filter-tab:hover {
  background: #6b7280;
  color: #f9fafb;
}

.dark-mode .sort-dropdown select {
  background: #4b5563;
  color: #f9fafb;
  border-color: #6b7280;
}

.dark-mode .sort-dropdown select:focus {
  border-color: #9ca3af;
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.1);
}

.dark-mode .thread-list {
  background: #374151;
  color: #f9fafb;
  border-color: #4b5563;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.dark-mode .skeleton-card {
  background: linear-gradient(90deg, #4b5563 25%, #6b7280 50%, #4b5563 75%);
  background-size: 200% 100%;
}

.dark-mode .enhanced-thread-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.dark-mode .load-more-btn {
  background: linear-gradient(135deg, #1f2937, #374151);
  color: #f9fafb;
}

.dark-mode .load-more-btn:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.dark-mode .empty-icon {
  color: #6b7280;
}

.dark-mode .empty-state h3 {
  color: #f9fafb;
}

.dark-mode .empty-state p {
  color: #d1d5db;
}
</style>