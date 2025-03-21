<template>
  <div class="rewards-container" v-if="showReward">
    <div class="reward-animation" :class="{ 'fade-out': isFading }">
      <img src="@/assets/fincoin-icon.svg" alt="FinCoin" class="reward-icon" />
      <span class="reward-text">+{{ rewardAmount }} FinCoins</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "QuizRewards",
  props: {
    rewardAmount: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      showReward: true,
      isFading: false,
    };
  },
  methods: {
    displayReward() {
      this.showReward = true;
      this.isFading = false;

      // Start fade out after 1 second
      setTimeout(() => {
        this.isFading = true;
      }, 1000);

      // Hide completely after animation finishes
      setTimeout(() => {
        this.showReward = false;
      }, 2000);
    },
  },
};
</script>

<style scoped>
.rewards-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}

.reward-animation {
  display: flex;
  align-items: center;
  background-color: rgba(255, 225, 0, 0.5);
  border-radius: 20px;
  padding: 10px 20px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  animation: pop-in 0.5s ease;
}

.reward-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.reward-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #b8860b;
}

.fade-out {
  animation: fade-out 1s forwards;
}

@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
</style>
