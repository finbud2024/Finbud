<template>
  <div class="notification-center">
    <div class="notification-sidebar">
      <div class="sidebar-header">
        <h2>{{ $t('notifications') || 'Notifications' }}</h2>
        <button v-if="hasUnreadNotifications" @click="markAllAsRead" class="mark-all-btn">
          {{ $t('markAllAsRead') || 'Mark all as read' }}
        </button>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <span>{{ $t('loading') || 'Loading...' }}</span>
      </div>

      <div v-else-if="notifications.length === 0" class="empty-state">
        <font-awesome-icon icon="bell" size="2x" />
        <p>{{ $t('noNotifications') || 'No notifications yet' }}</p>
      </div>

      <div v-else class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification._id"
          :class="['notification-item', { 'unread': !notification.isRead, 'active': selectedNotification && selectedNotification._id === notification._id }]"
          @click="selectNotification(notification)"
        >
          <div class="notification-preview">
            <h4>{{ notification.title }}</h4>
            <p class="notification-preview-content">{{ truncateContent(notification.content) }}</p>
            <div class="notification-meta">
              <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
              <span v-if="!notification.isRead" class="unread-indicator"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="notification-detail">
      <div v-if="!selectedNotification" class="empty-detail-state">
        <font-awesome-icon icon="bell" size="3x" />
        
      </div>

      <div v-else class="notification-detail-content">
        <div class="detail-header">
          <h2>{{ selectedNotification.title }}</h2>
          <div class="detail-actions">
            <span class="notification-time">{{ formatTime(selectedNotification.createdAt) }}</span>
            <button @click="deleteNotification(selectedNotification._id)" class="delete-btn">
              <font-awesome-icon icon="trash-can" />
            </button>
          </div>
        </div>
        <div class="detail-body">
          <p>{{ selectedNotification.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'NotificationCenter', // Change from 'Notification' to 'NotificationCenter'
  setup() {
    const store = useStore();
    const notifications = ref([]);
    const selectedNotification = ref(null);
    const loading = ref(true);
    const pollingInterval = ref(null);
    
    const userId = computed(() => {
      return store.getters['users/currentUser']?._id;
    });
    
    const isAuthenticated = computed(() => {
      return store.getters['users/isAuthenticated'];
    });
    
    const hasUnreadNotifications = computed(() => {
      return notifications.value.some(notification => !notification.isRead);
    });

    const fetchNotifications = async () => {
      if (!isAuthenticated.value || !userId.value) return;
      
      try {
        loading.value = true;
        const response = await axios.get(
          `${process.env.VUE_APP_DEPLOY_URL}/api/notis/${userId.value}`,
          { withCredentials: true }
        );
        
        if (response.data) {
          notifications.value = response.data.sort((a, b) => {
            // Sort by read status (unread first) then by date (newest first)
            if (a.isRead === b.isRead) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.isRead ? 1 : -1;
          });
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        notifications.value = [];
      } finally {
        loading.value = false;
      }
    };
    
    const selectNotification = async (notification) => {
      selectedNotification.value = notification;
      
      if (!notification.isRead) {
        try {
          // Update the read status on the backend
          await axios.put(
            `${process.env.VUE_APP_DEPLOY_URL}/api/notis/${notification._id}/read`,
            {},
            { withCredentials: true }
          );
          
          // Update local state
          const index = notifications.value.findIndex(n => n._id === notification._id);
          if (index !== -1) {
            notifications.value[index].isRead = true;
          }
        } catch (error) {
          console.error('Failed to mark notification as read:', error);
        }
      }
    };
    
    const markAllAsRead = async () => {
      if (!isAuthenticated.value || !userId.value) return;
      
      try {
        await axios.put(
          `${process.env.VUE_APP_DEPLOY_URL}/api/notis/${userId.value}/read-all`,
          {},
          { withCredentials: true }
        );
        
        // Update local state
        notifications.value = notifications.value.map(notification => ({
          ...notification,
          isRead: true
        }));
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error);
      }
    };
    
    const deleteNotification = async (notificationId) => {
      try {
        await axios.delete(
          `${process.env.VUE_APP_DEPLOY_URL}/api/notis/${notificationId}`,
          { withCredentials: true }
        );
        
        // Remove from local state
        notifications.value = notifications.value.filter(n => n._id !== notificationId);
        
        // Clear selection if needed
        if (selectedNotification.value && selectedNotification.value._id === notificationId) {
          selectedNotification.value = null;
        }
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    };
    
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      if (diffDays === 0) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return days[date.getDay()];
      } else {
        return date.toLocaleDateString();
      }
    };
    
    const truncateContent = (content) => {
      if (!content) return '';
      return content.length > 60 ? `${content.substring(0, 60)}...` : content;
    };

    // Start polling for notifications
    onMounted(() => {
      if (isAuthenticated.value) {
        fetchNotifications();
        pollingInterval.value = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
      }
    });
    
    // Clean up polling interval
    onUnmounted(() => {
      if (pollingInterval.value) {
        clearInterval(pollingInterval.value);
      }
    });
    
    // Watch for authentication changes
    watch(() => isAuthenticated.value, (newValue) => {
      if (newValue) {
        fetchNotifications();
        if (!pollingInterval.value) {
          pollingInterval.value = setInterval(fetchNotifications, 30000);
        }
      } else {
        if (pollingInterval.value) {
          clearInterval(pollingInterval.value);
          pollingInterval.value = null;
        }
        notifications.value = [];
        selectedNotification.value = null;
      }
    });

    return {
      notifications,
      selectedNotification,
      loading,
      hasUnreadNotifications,
      selectNotification,
      markAllAsRead,
      deleteNotification,
      formatTime,
      truncateContent
    };
  }
}
</script>

<style scoped>
.notification-center {
  display: flex;
  height: calc(100vh - 80px); /* Adjust based on your navbar height */
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

.notification-sidebar {
  flex: 0 0 300px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.2rem;
}

.mark-all-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.mark-all-btn:hover {
  background-color: var(--accent-color-light);
}

.notification-list {
  overflow-y: auto;
  flex: 1;
}

.notification-item {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-item:hover {
  background-color: var(--bg-secondary);
}

.notification-item.active {
  background-color: var(--bg-secondary);
  border-left: 3px solid var(--accent-color);
}

.notification-item.unread {
  background-color: rgba(66, 139, 202, 0.1);
}

.notification-preview h4 {
  margin: 0 0 6px;
  font-size: 0.95rem;
  font-weight: 600;
}

.notification-preview-content {
  margin: 0 0 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notification-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
}

.unread-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--accent-color);
}

.notification-detail {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.empty-state, .empty-detail-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--text-tertiary);
  text-align: center;
  padding: 20px;
}

.empty-state p, .empty-detail-state h3 {
  margin-top: 16px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.notification-detail-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.detail-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.detail-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.delete-btn:hover {
  color: #e74c3c;
}

.detail-body {
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .notification-center {
    flex-direction: column;
    height: auto;
  }
  
  .notification-sidebar {
    flex: 0 0 auto;
    max-height: 300px;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .notification-detail {
    padding: 16px;
    min-height: 300px;
  }
}

/* Dark mode adjustments */
:root.dark-mode .loading-spinner {
  border-color: rgba(255, 255, 255, 0.1);
  border-top-color: var(--accent-color);
}

:root.dark-mode .notification-item.unread {
  background-color: rgba(66, 139, 202, 0.15);
}
</style>