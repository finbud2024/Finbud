<template>
  <div class="streak-container tooltip" aria-label="Your Daily Streak!">
    <div class="streak-flame" :class="{ 'on-fire': streakCount > 0 }">🔥</div>
    <span class="streak-count">{{ streakCount }} {{ streakCount === 1 ? 'day' : 'days' }}</span>
  </div>
</template>

<script>
export default {
  name: 'StreakBar',
  data() {
    return {
      streakCount: 0
    };
  },
  mounted() {
    this.calculateStreak();
  },
  methods: {
    calculateStreak() {
      const today = new Date().toISOString().split('T')[0];
      let lastLogin = localStorage.getItem('finbud_last_login');
      let currentStreak = parseInt(localStorage.getItem('finbud_streak')) || 0;

      if (lastLogin) {
        const lastDate = new Date(lastLogin);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          // Logged in yesterday, increment
          currentStreak++;
        } else if (diffDays > 1) {
          // Missed a day, reset streak
          currentStreak = 1;
        }
        // If diffDays === 0, same day, do nothing.
      } else {
        currentStreak = 1;
      }

      localStorage.setItem('finbud_last_login', today);
      localStorage.setItem('finbud_streak', currentStreak.toString());
      this.streakCount = currentStreak;
    }
  }
}
</script>

<style scoped>
.streak-container {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--card-bg, #fff);
  border: 1px solid var(--error-color, #FF7A7A);
  padding: 4px 10px;
  border-radius: var(--radius-pill, 9999px);
  box-shadow: 0 4px 12px rgba(255, 122, 122, 0.15);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-top: 6px;
}
.streak-container:hover {
  transform: translateY(-2px) scale(1.05);
}
.streak-flame {
  font-size: 1.1rem;
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 0.3s ease;
}
.streak-flame.on-fire {
  filter: grayscale(0%);
  opacity: 1;
  animation: flicker 2s infinite ease-in-out alternate;
}
.streak-count {
  font-weight: 700;
  color: var(--error-color, #FF7A7A);
  font-size: 0.85rem;
}
@keyframes flicker {
  0% { transform: scale(1) rotate(-5deg); }
  50% { transform: scale(1.15) rotate(5deg); }
  100% { transform: scale(1) rotate(-5deg); }
}
</style>
