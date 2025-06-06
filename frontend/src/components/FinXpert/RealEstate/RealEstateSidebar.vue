<template>
  <aside class="real-estate-sidebar">
    <div class="sidebar-header">
      <font-awesome-icon icon="fa-solid fa-building-user" class="logo-icon" />
      <h2 class="sidebar-title">FinXpert</h2>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li 
          v-for="item in navItems" 
          :key="item.id"
          :class="{ active: activeItem === item.id }"
          @click="changeView(item.id)"
        >
          <font-awesome-icon :icon="item.icon" />
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </nav>
    <div class="sidebar-footer">
      <div class="user-profile">
        <img :src="profileImage" alt="User" @error="handleImageError" />
        <div class="user-info">
          <span class="user-name">{{ profileName }}</span>
          <span class="user-status">Premium Member</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faBuildingUser, faChartPie, faMapMarkedAlt, 
  faExchangeAlt, faStickyNote, faClipboardList
} from '@fortawesome/free-solid-svg-icons';
import defaultImage from "@/assets/anonymous.png";
import { mapGetters } from 'vuex';

library.add(
  faBuildingUser, faChartPie, faMapMarkedAlt, 
  faExchangeAlt, faStickyNote, faClipboardList
);

export default {
  name: 'RealEstateSidebar',
  components: { FontAwesomeIcon },
  data() {
    return {
      activeItem: 'overview',
      navItems: [
        { id: 'overview', label: 'Property Overview', icon: 'fa-solid fa-clipboard-list' },
        { id: 'valuation', label: 'Valuation', icon: 'fa-solid fa-chart-pie' },
        { id: 'map', label: 'Asset Map', icon: 'fa-solid fa-map-marked-alt' },
        { id: 'rent-vs-buy', label: 'Rent vs. Buy', icon: 'fa-solid fa-exchange-alt' },
        { id: 'notes', label: 'Notes & Storage', icon: 'fa-solid fa-sticky-note' },
      ],
    };
  },
  computed: {
    ...mapGetters({
      user: 'users/currentUser',
    }),
    profileImage() {
      return this.user?.profilePicture || defaultImage;
    },
    profileName() {
      return this.user?.displayName || 'Guest User';
    }
  },
  methods: {
    changeView(view) {
      this.activeItem = view;
      this.$emit('view-changed', view);
    },
    handleImageError(event) {
      event.target.src = defaultImage;
    }
  }
};
</script>

<style scoped>
.real-estate-sidebar {
  width: 280px;
  background: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-right: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2.5rem;
  padding-left: 0.5rem;
}

.logo-icon {
  font-size: 2rem;
  color: #1a1a1a;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.sidebar-nav {
  flex-grow: 1;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-nav li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s ease;
}

.sidebar-nav li:hover {
  background: #f8f9fa;
  color: #1a1a1a;
}

.sidebar-nav li.active {
  background: linear-gradient(135deg, #000, #333);
  color: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transform: translateX(5px);
}

.sidebar-nav li.active svg {
  color: white;
}

.sidebar-nav li svg {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
  color: #9ca3af;
  transition: color 0.3s ease;
}

.sidebar-nav li:hover svg {
  color: #1a1a1a;
}

.sidebar-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
}

.user-profile img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1a1a1a;
}

.user-status {
  font-size: 0.8rem;
  color: #64748b;
}
</style> 