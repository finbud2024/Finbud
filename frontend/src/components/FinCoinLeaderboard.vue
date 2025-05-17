<template>
  <div class="leaderboard-card border">
    <div class="header-section border">FinCoin Leaderboard</div>
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
/* Leaderboard Styles */
.leaderboard-card {
  margin: 20px auto 50px;
  position: relative;
  width: 90%;
  max-width: 1200px;
  padding: 30px;
}

.border {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  background: rgb(248, 249, 254);
}

.leaderboard-body {
  padding: 70px 15px 15px;
  background-color: rgb(248, 249, 254);
}

.header-section {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: bold;
  position: absolute;
  padding: 20px;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #000000;
  color: white;
}

.leaderboard-filters {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 8px 16px;
  margin: 0 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background-color: #000408;
  color: white;
  border-color: #000000;
}

.leaderboard-table {
  width: 100%;
}

.leaderboard-header {
  display: flex;
  padding: 10px 0;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.leaderboard-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.current-user {
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
}

.current-user-position {
  display: flex;
  padding: 15px 0;
  margin-top: 20px;
  border-top: 2px dashed #000000;
  border-bottom: 2px dashed #000000;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
  align-items: center;
}

.rank {
  width: 10%;
  text-align: center;
  font-weight: bold;
}

.user {
  width: 40%;
  display: flex;
  align-items: center;
}

.quizzes,
.trades {
  width: 15%;
  text-align: center;
}

.fincoins {
  width: 20%;
  text-align: center;
  font-weight: bold;
  color: #fbc900;
}

.leaderboard-user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
