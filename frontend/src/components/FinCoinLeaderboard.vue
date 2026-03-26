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
  padding: 3.25rem 1rem 1.25rem;
  box-sizing: border-box;
}

.border {
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #e2e8f0);
}

.leaderboard-body {
  padding: 0 0.25rem 0.5rem;
  background: transparent;
}

.header-section {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  position: absolute;
  padding: 0.65rem 1.25rem;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--primary-color, #000);
  color: var(--secondary-color, #fff);
  border-radius: 999px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
  max-width: calc(100% - 2rem);
  overflow: hidden;
  text-overflow: ellipsis;
}

.leaderboard-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.filter-btn {
  padding: 0.45rem 1rem;
  min-height: 40px;
  background: var(--bg-secondary, #f1f5f9);
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary, #0f172a);
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.filter-btn.active {
  background: var(--primary-color, #000);
  color: var(--secondary-color, #fff);
  border-color: var(--primary-color, #000);
}

.leaderboard-table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  border: 1px solid var(--border-color, #e2e8f0);
}

.leaderboard-table {
  width: 100%;
  min-width: 520px;
}

.leaderboard-header {
  display: flex;
  padding: 0.65rem 0.5rem;
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-secondary, #64748b);
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  background: var(--bg-secondary, #f8fafc);
}

.leaderboard-row {
  display: flex;
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--border-color, #e2e8f0);
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-primary, #0f172a);
}

.leaderboard-row:last-child {
  border-bottom: none;
}

.current-user {
  background-color: rgba(59, 130, 246, 0.08);
  border-radius: 8px;
}

.current-user-position {
  display: flex;
  padding: 0.65rem 0.5rem;
  margin-top: 0.75rem;
  border: 1px dashed var(--border-color, #cbd5e1);
  background-color: rgba(59, 130, 246, 0.08);
  border-radius: 10px;
  align-items: center;
  font-size: 0.9rem;
}

.rank {
  width: 10%;
  min-width: 3rem;
  text-align: center;
  font-weight: 700;
}

.user {
  width: 40%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quizzes,
.trades {
  width: 15%;
  text-align: center;
}

.fincoins {
  width: 20%;
  text-align: center;
  font-weight: 700;
  color: #ca8a04;
}

.leaderboard-user-image {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--border-color, #e2e8f0);
}

.no-data {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-secondary, #64748b);
  font-size: 0.95rem;
}

.dark-mode .fincoins {
  color: #fbbf24;
}

@media (max-width: 640px) {
  .leaderboard-card {
    padding: 3rem 0.75rem 1rem;
  }

  .header-section {
    font-size: 0.72rem;
    padding: 0.55rem 1rem;
  }
}
</style>
