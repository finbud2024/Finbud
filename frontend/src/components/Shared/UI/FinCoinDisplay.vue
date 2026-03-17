<template>
  <div class="fincoin-display" :class="{ 'animate-change': isAnimating }">
    <img src="@/assets/fincoin-icon.svg" alt="FinCoin" class="fincoin-icon" />
    <span class="fincoin-balance">{{ displayBalance }}</span>
  </div>
</template>

<script>
export default {
  name: "FinCoinDisplay",
  props: {
    balance: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      displayBalance: 0,
      previousBalance: 0,
      isAnimating: false,
    };
  },
  watch: {
    balance: {
      handler(newValue, oldValue) {
        if (oldValue !== undefined && newValue !== oldValue) {
          this.previousBalance = oldValue;
          this.animateBalanceChange(newValue);
        } else {
          this.displayBalance = newValue;
        }
      },
      immediate: true,
    },
  },
  methods: {
    animateBalanceChange(newBalance) {
      this.isAnimating = true;

      // Gradually increment or decrement the displayed balance
      const startBalance = this.previousBalance;
      const endBalance = newBalance;
      const difference = endBalance - startBalance;
      const increment = difference > 0 ? 1 : -1;
      const steps = Math.abs(difference);
      let currentStep = 0;

      const interval = setInterval(() => {
        this.displayBalance += increment;
        currentStep++;

        if (currentStep >= steps) {
          clearInterval(interval);
          this.displayBalance = endBalance; // Ensure exact final value
          setTimeout(() => {
            this.isAnimating = false;
          }, 500); // Keep animation class a bit longer
        }
      }, 50); // Speed of counting animation
    },
  },
};
</script>

<style scoped>
.fincoin-display {
  display: flex;
  align-items: center;
  background-color: rgba(255, 215, 0, 0.2);
  border-radius: 20px;
  padding: 5px 10px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.fincoin-display:hover {
  transform: scale(1.05);
}

.fincoin-icon {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.fincoin-balance {
  font-weight: bold;
  color: var(--text-primary);
}

.animate-change {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    background-color: rgba(255, 215, 0, 0.2);
  }
  50% {
    transform: scale(1.1);
    background-color: rgba(255, 215, 0, 0.5);
  }
  100% {
    transform: scale(1);
    background-color: rgba(255, 215, 0, 0.2);
  }
}
</style>
