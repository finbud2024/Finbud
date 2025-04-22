<template>
  <div class="notification-container">
    <div 
      class="notification-icon" 
      @click="toggleNotificationPanel"
      ref="notificationIconRef"
    >
      <font-awesome-icon icon="fa-solid fa-bell" />
      <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
    </div>

    <div v-if="isOpen" class="notification-panel" ref="notificationPanelRef">
      <div class="notification-header">
        <h3>{{ $t('notifications') }}</h3>
        <button v-if="hasUnread" @click="markAllAsRead" class="mark-all-read">
          {{ $t('markAllAsRead') }}
        </button>
      </div>
      
      <div class="notification-filters">
        <button 
          class="filter-btn" 
          :class="{ 'active': currentFilter === 'all' }" 
          @click="setFilter('all')"
        >
          {{ $t('all') || 'All' }}
        </button>
        <button 
          class="filter-btn" 
          :class="{ 'active': currentFilter === 'unread' }" 
          @click="setFilter('unread')"
        >
          {{ $t('unread') || 'Unread' }} 
          <span v-if="unreadCount > 0" class="filter-count">{{ unreadCount }}</span>
        </button>
      </div>
      
      <div v-if="loading" class="notification-loading">
        <div class="loading-spinner"></div>
      </div>
      
      <div v-else-if="filteredNotifications.length === 0" class="no-notifications">
        {{ currentFilter === 'unread' ? ($t('noUnreadNotifications') || 'No unread notifications') : ($t('noNotifications') || 'No notifications') }}
      </div>
      
      <div v-else class="notification-list">
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification._id"
          :class="['notification-item', { 'unread': !notification.isRead }]"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <div class="notification-header-row">
              <h4>{{ notification.title }}</h4>
              <div v-if="!notification.isRead" class="unread-dot-indicator"></div>
            </div>
            <p>{{ notification.content }}</p>
            <div class="notification-footer-row">
              <small>{{ formatTime(notification.createdAt) }}</small>
              <span v-if="!notification.isRead" class="unread-label">New</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="notification-footer">
        <router-link to="/notifications" @click="isOpen = false">
          {{ $t('viewAllNotifications') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'NavbarNoti',
  setup() {
    const store = useStore();
    const notifications = ref([]);
    const loading = ref(true);
    const isOpen = ref(false);
    const notificationIconRef = ref(null);
    const notificationPanelRef = ref(null);
    const pollingInterval = ref(null);
    const currentFilter = ref('all'); // Default filter
    
    const userId = computed(() => {
      return store.getters['users/currentUser']?._id;
    });
    
    const isAuthenticated = computed(() => {
      return store.getters['users/isAuthenticated'];
    });
    
    const unreadCount = computed(() => {
      return notifications.value.filter(note => !note.isRead).length;
    });
    
    const hasUnread = computed(() => {
      return unreadCount.value > 0;
    });
    
    const filteredNotifications = computed(() => {
      if (currentFilter.value === 'unread') {
        return notifications.value.filter(note => !note.isRead);
      }
      return notifications.value;
    });
    
    const setFilter = (filter) => {
      currentFilter.value = filter;
    };
    
    const fetchNotifications = async () => {
        if (!isAuthenticated.value || !userId.value) return;
        
        try {
            loading.value = true;
            const response = await axios.get(
            `${process.env.VUE_APP_DEPLOY_URL}/api/notis/${userId.value}`,
            { withCredentials: true }
            );
            
            if (response.data && Array.isArray(response.data)) {
            notifications.value = response.data;
            console.log('Fetched notifications:', notifications.value.length);
            } else {
            console.error('Unexpected response format:', response.data);
            notifications.value = [];
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            notifications.value = [];
        } finally {
            loading.value = false;
        }
        };
    
    const markAllAsRead = async () => {
      if (!isAuthenticated.value || !userId.value) return;
      
      try {
        await axios.put(
          `${process.env.VUE_APP_DEPLOY_URL}/api/notis/${userId.value}`,
          {},
          { withCredentials: true }
        );
        
        notifications.value = notifications.value.map(note => ({
          ...note,
          isRead: true
        }));
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
      }
    };
    
    const handleNotificationClick = async (notification) => {
      if (!notification.isRead) {
        try {
            await axios.put(
            `${process.env.VUE_APP_DEPLOY_URL}/api/notis/${userId.value}/${notification._id}`,
            {},
            { withCredentials: true }
          );
          
          notification.isRead = true;
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      }
    };
    
    const toggleNotificationPanel = () => {
      isOpen.value = !isOpen.value;
      
      if (isOpen.value) {
        fetchNotifications();
      }
    };
    
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
      } else {
        return date.toLocaleDateString();
      }
    };
    
    const handleClickOutside = (event) => {
      if (
        isOpen.value && 
        notificationIconRef.value && 
        !notificationIconRef.value.contains(event.target) &&
        notificationPanelRef.value &&
        !notificationPanelRef.value.contains(event.target)
      ) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      if (isAuthenticated.value) {
        fetchNotifications();
        
        pollingInterval.value = setInterval(() => {
          if (!isOpen.value) {
            fetchNotifications();
          }
        }, 60000);
      }
      
      document.addEventListener('click', handleClickOutside);
    });
    
    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
      }
      document.removeEventListener('click', handleClickOutside);
    });
    
    return {
      notifications,
      filteredNotifications,
      loading,
      isOpen,
      unreadCount,
      hasUnread,
      notificationIconRef,
      notificationPanelRef,
      currentFilter,
      setFilter,
      toggleNotificationPanel,
      markAllAsRead,
      handleNotificationClick,
      formatTime
    };
  }
}
</script>

<style scoped>
.notification-container {
  position: relative;
}

.notification-icon {
  position: relative;
  cursor: pointer;
  font-size: 1.3rem;
  color: var(--text-primary);
  padding: 8px;
  transition: all 0.2s ease;
}

.notification-icon:hover {
  transform: scale(1.1);
  color: var(--accent-color);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7);
  }
  
  70% {
    transform: scale(1.1);
    box-shadow: 0 0 0 5px rgba(231, 76, 60, 0);
  }
  
  100% {
    transform: scale(1);
  }
}

.notification-panel {
  position: absolute;
  top: 100%;
  right: -100px;
  width: 320px;
  max-height: 400px;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.notification-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.mark-all-read {
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0;
}

.mark-all-read:hover {
  text-decoration: underline;
}

.notification-filters {
  display: flex;
  border-bottom: 1px solid var(--border-color);
}

.filter-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 8px 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.filter-btn.active {
  color: var(--accent-color);
  font-weight: 600;
}

.filter-btn.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 25%;
  width: 50%;
  height: 2px;
  background-color: var(--accent-color);
}

.filter-btn:hover {
  background-color: var(--bg-secondary);
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: var(--bg-secondary);
}

.notification-item.unread {
  background-color: rgba(66, 139, 202, 0.1);
  border-left: 3px solid var(--accent-color);
  position: relative;
  overflow: hidden;
}

.notification-item.unread::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, rgba(231, 76, 60, 0.05), transparent 70%);
  z-index: -1;
}

.notification-content h4 {
  margin: 0 0 5px;
  font-size: 0.9rem;
  font-weight: 600;
}

.notification-content p {
  margin: 0 0 5px;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.notification-content small {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.notification-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unread-dot-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #e74c3c;
  box-shadow: 0 0 4px #e74c3c;
  animation: pulse-dot 1.5s infinite;
}

.unread-label {
  font-size: 0.7rem;
  font-weight: bold;
  color: white;
  background-color: #e74c3c;
  padding: 2px 6px;
  border-radius: 10px;
  animation: pulse-label 1.5s infinite;
}

@keyframes pulse-dot {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@keyframes pulse-label {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.notification-footer {
  padding: 10px 16px;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.notification-footer a {
  color: var(--accent-color);
  font-size: 0.85rem;
  text-decoration: none;
}

.notification-footer a:hover {
  text-decoration: underline;
}

.notification-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.no-notifications {
  padding: 20px;
  text-align: center;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

/* Dark mode adjustments */
:root.dark-mode .notification-badge {
  background-color: #e74c3c;
}

:root.dark-mode .notification-item.unread {
  background-color: rgba(66, 139, 202, 0.15);
}

:root.dark-mode .loading-spinner {
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-color);
}
</style>