<template>
  <div class="leaderboard-card border">
    <div class="header-section">FinCoin Leaderboard</div>
    <div class="leaderboard-body">
      <div class="leaderboard-filters">
        <button
          v-for="period in timeFrames"
          :key="period.value"
          @click="onTimeFrameChange(period.value)"
          :class="[
            'filter-btn',
            { active: selectedTimeFrame === period.value },
          ]"
        >
          {{ period.label }}
        </button>
      </div>

      <div class="leaderboard-table-wrap">
        <div class="leaderboard-table">
          <div class="leaderboard-header">
          <div class="rank">Rank</div>
          <div class="user">User</div>
          <div class="quizzes">Quizzes</div>
          <div class="trades">Trades</div>
          <div class="fincoins">FinCoins</div>
          </div>

        <div
          v-for="(user, index) in leaderboardData"
          :key="user._id"
          :class="[
            'leaderboard-row',
            { 'current-user': user._id === currentUserId },
          ]"
        >
          <div class="rank">{{ index + 1 }}</div>
          <div class="user">
            <img
              :src="formatImageUrl(user.profilePicture) || defaultImage"
              alt="User"
              class="leaderboard-user-image"
            />
            <span>{{ user.displayName }}</span>
          </div>
          <div class="quizzes">{{ user.quizzesCompleted }}</div>
          <div class="trades">{{ user.tradesExecuted }}</div>
          <div class="fincoins">{{ user.fincoins }}</div>
        </div>

        <div v-if="leaderboardData.length === 0" class="no-data">
          No leaderboard data available
        </div>

        <!-- Current user position if not in top 10 -->
        <div
          v-if="currentUserRank && currentUserRank.rank > 10"
          class="current-user-position"
        >
          <div class="rank">{{ currentUserRank.rank }}</div>
          <div class="user">
            <img
              :src="
                formatImageUrl(currentUserRank.profilePicture) || defaultImage
              "
              alt="User"
              class="leaderboard-user-image"
            />
            <span>{{ currentUserRank.displayName }} (You)</span>
          </div>
          <div class="quizzes">{{ currentUserRank.quizzesCompleted }}</div>
          <div class="trades">{{ currentUserRank.tradesExecuted }}</div>
          <div class="fincoins">{{ currentUserRank.fincoins }}</div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinCoinLeaderboard",
  props: {
    leaderboardData: {
      type: Array,
      required: true,
      default: () => [],
    },
    currentUserRank: {
      type: Object,
      default: null,
    },
    selectedTimeFrame: {
      type: String,
      default: "all-time",
    },
    timeFrames: {
      type: Array,
      default: () => [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "All Time", value: "all-time" },
      ],
    },
    currentUserId: {
      type: String,
      default: null,
    },
    defaultImage: {
      type: String,
      required: true,
    },
  },
  methods: {
    onTimeFrameChange(timeFrame) {
      this.$emit("time-frame-change", timeFrame);
    },
    formatImageUrl(url) {
      if (!url) return this.defaultImage;

      // If it's a base64 string and doesn't start with data:image
      if (url.startsWith("/9j/") || url.startsWith("iVBOR")) {
        return `data:image/jpeg;base64,${url}`;
      }

      // If it's a URL without protocol, add https
      if (url.startsWith("//")) {
        return `https:${url}`;
      }

      // If it's a relative path, make it absolute
      if (url.startsWith("/")) {
        return `${process.env.VUE_APP_DEPLOY_URL}${url}`;
      }

      // For URLs without any protocol
      if (!url.startsWith("http") && !url.startsWith("data:")) {
        return `https://${url}`;
      }

      // Already properly formatted
      return url;
    },
  },
};
</script>

<style scoped>
.leaderboard-card {
  margin: 0 auto;
  position: relative;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
  box-sizing: border-box;
}

.border {
  background: var(--card-bg, #fff);
  border: 4px solid #EEF2FF;
  border-radius: 32px;
  box-shadow: 0 10px 30px rgba(167, 139, 250, 0.05);
}

.leaderboard-body {
  padding: 0;
}

.header-section {
  display: inline-block;
  background: var(--agent-button-bg-color, #A78BFA);
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 99px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
  position: relative;
  top: -1rem;
  left: 0;
  transform: none;
}

.leaderboard-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.75rem 1.5rem;
  background: #F8FAFF;
  border: 2px solid #EEF2FF;
  border-radius: 99px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 700;
  color: #6B7280;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.filter-btn:hover {
  background: #EEF2FF;
  color: #4B5563;
}

.filter-btn.active {
  background: var(--agent-button-bg-color, #A78BFA);
  color: #fff;
  border-color: var(--agent-button-bg-color, #A78BFA);
  box-shadow: 0 6px 15px rgba(167, 139, 250, 0.3);
  transform: translateY(-2px);
}

.leaderboard-table-wrap {
  width: 100%;
  overflow-x: auto;
  border-radius: 24px;
  background: #F8FAFF;
  padding: 1rem;
}

.leaderboard-table {
  width: 100%;
  min-width: 600px;
  border-collapse: separate;
  border-spacing: 0 0.75rem;
}

.leaderboard-header {
  display: flex;
  padding: 1rem 1.5rem;
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #94A3B8;
}

.leaderboard-row {
  display: flex;
  padding: 1rem 1.5rem;
  background: #fff;
  border-radius: 20px;
  align-items: center;
  font-size: 1rem;
  color: #1F2937;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.leaderboard-row:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 20px rgba(167, 139, 250, 0.1);
  border-color: #EEF2FF;
}

.current-user {
  background: linear-gradient(90deg, #F5F3FF 0%, #EDE9FE 100%);
  border: 2px solid var(--agent-button-bg-color, #A78BFA) !important;
}

.current-user-position {
  display: flex;
  padding: 1.25rem 1.5rem;
  margin-top: 2rem;
  background: linear-gradient(90deg, #F0FDF4 0%, #DCFCE7 100%);
  border: 2px dashed var(--fin-speak-accent, #4ADE80);
  border-radius: 24px;
  align-items: center;
  font-size: 1rem;
  font-weight: 700;
  color: #065F46;
}

.rank {
  width: 10%;
  min-width: 4rem;
  text-align: center;
  font-weight: 800;
  font-size: 1.2rem;
  color: #64748B;
}

.current-user .rank { color: var(--agent-button-bg-color, #A78BFA); }

.user {
  width: 40%;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user span {
  font-weight: 700;
}

.quizzes,
.trades {
  width: 15%;
  text-align: center;
}

.fincoins {
  width: 20%;
  text-align: center;
  font-weight: 800;
  color: #D97706;
  font-size: 1.1rem;
}

.leaderboard-user-image {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: #94A3B8;
  font-weight: 600;
}

/* Dark Mode Overrides */
:global(.dark-mode) .leaderboard-card {
  /* Inherits from parent or root */
}

:global(.dark-mode) .filter-btn {
  background: #0F172A;
  border-color: #334155;
  color: #94A3B8;
}

:global(.dark-mode) .leaderboard-table-wrap {
  background: #0F172A;
}

:global(.dark-mode) .leaderboard-row {
  background: #1E293B;
  color: #F8FAFC;
  box-shadow: none;
}

:global(.dark-mode) .current-user {
  background: rgba(167, 139, 250, 0.1);
}

:global(.dark-mode) .current-user-position {
  background: rgba(74, 222, 128, 0.1);
  color: #4ADE80;
}

@media (max-width: 640px) {
  .leaderboard-card {
    padding: 1.5rem;
  }
  .header-section {
    font-size: 0.8rem;
    padding: 0.6rem 1.5rem;
  }
  .user span {
    font-size: 0.9rem;
  }
}
</style>
