<template>
  <div class="game-container" ref="gameContainer">
    <div class="game-header">
      <div class="score">Coins: {{ score }}</div>
      <div class="timer">Time: {{ timeLeft }}s</div>
      <button v-if="!gameActive" @click="startGame" class="start-btn">
        {{ score > 0 ? 'Play Again' : 'Start Game' }}
      </button>
    </div>

    <div class="game-area" @mousemove="handleMouseMove" @touchmove="handleTouchMove">
      <!-- Player -->
      <div 
        class="player" 
        :style="{ left: playerPos + 'px' }"
      >
        <img src="@/assets/finbud_logo.png" alt="FinBud" />
      </div>

      <!-- Falling Coins -->
      <div 
        v-for="coin in coins" 
        :key="coin.id" 
        class="coin"
        :style="{ left: coin.x + 'px', top: coin.y + 'px' }"
      >
        💰
      </div>

      <!-- Effects -->
      <div v-if="showConfetti" class="confetti-overlay">
        <div v-for="n in 20" :key="n" class="confetti-piece"></div>
      </div>
    </div>

    <div v-if="gameOver" class="game-over animate-pop">
      <h2>Game Over!</h2>
      <p>You caught <strong>{{ score }}</strong> FinCoins!</p>
      <div class="reward">
        <font-awesome-icon icon="fa-solid fa-coins" class="coin-icon" />
        <span>+{{ score * 10 }} FinCoins added to your rank!</span>
      </div>
      <button @click="startGame" class="retry-btn">Try Again</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MoneyCatchGame",
  data() {
    return {
      gameActive: false,
      gameOver: false,
      score: 0,
      timeLeft: 30,
      playerPos: 150,
      coins: [],
      nextCoinId: 0,
      gameInterval: null,
      timerInterval: null,
      showConfetti: false,
      containerWidth: 0
    };
  },
  methods: {
    startGame() {
      this.score = 0;
      this.timeLeft = 30;
      this.coins = [];
      this.gameOver = false;
      this.gameActive = true;
      this.showConfetti = false;
      
      this.containerWidth = this.$refs.gameContainer?.clientWidth || 350;

      // Game loop
      this.gameInterval = setInterval(this.updateGame, 1000 / 60);
      
      // Timer loop
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
          this.endGame();
        }
        // Spawn coin every second
        if (this.gameActive) this.spawnCoin();
      }, 1000);
    },
    updateGame() {
      if (!this.gameActive) return;

      // Update coins
      this.coins.forEach(coin => {
        coin.y += coin.speed;
        
        // Collision Detection
        const playerWidth = 60;
        const playerHeight = 60;
        const coinPos = coin.y + 20;

        if (
          coinPos > (this.$refs.gameContainer.clientHeight - 80) &&
          coinPos < (this.$refs.gameContainer.clientHeight - 20) &&
          coin.x + 20 > this.playerPos &&
          coin.x < this.playerPos + playerWidth
        ) {
          this.collectCoin(coin.id);
        }

        // Remove if off screen
        if (coin.y > 500) {
          this.removeCoin(coin.id);
        }
      });
    },
    spawnCoin() {
      const x = Math.random() * (this.containerWidth - 40);
      this.coins.push({
        id: this.nextCoinId++,
        x,
        y: -40,
        speed: 2 + Math.random() * 3
      });
    },
    collectCoin(id) {
      this.score++;
      this.removeCoin(id);
      // Optional: Add haptic or sound
    },
    removeCoin(id) {
      this.coins = this.coins.filter(c => c.id !== id);
    },
    handleMouseMove(e) {
      if (!this.gameActive) return;
      const rect = this.$refs.gameContainer.getBoundingClientRect();
      let pos = e.clientX - rect.left - 30;
      this.playerPos = Math.max(0, Math.min(pos, this.containerWidth - 60));
    },
    handleTouchMove(e) {
      if (!this.gameActive) return;
      const rect = this.$refs.gameContainer.getBoundingClientRect();
      let pos = e.touches[0].clientX - rect.left - 30;
      this.playerPos = Math.max(0, Math.min(pos, this.containerWidth - 60));
    },
    endGame() {
      this.gameActive = false;
      this.gameOver = true;
      clearInterval(this.gameInterval);
      clearInterval(this.timerInterval);
      if (this.score > 10) {
        this.showConfetti = true;
        setTimeout(() => { this.showConfetti = false; }, 3000);
      }
    }
  },
  beforeUnmount() {
    clearInterval(this.gameInterval);
    clearInterval(this.timerInterval);
  }
};
</script>

<style scoped>
.game-container {
  width: 100%;
  max-width: 400px;
  height: 450px;
  background: linear-gradient(180deg, #F8FAFF 0%, #EEF2FF 100%);
  border-radius: 24px;
  border: 4px solid var(--agent-button-bg-color, #A78BFA);
  position: relative;
  overflow: hidden;
  margin: 1rem auto;
  user-select: none;
  touch-action: none;
}

.game-header {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  font-weight: 800;
  color: var(--agent-button-bg-color, #A78BFA);
  z-index: 10;
  position: relative;
}

.game-area {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.player {
  position: absolute;
  bottom: 20px;
  width: 60px;
  height: 60px;
  transition: left 0.1s ease-out;
}

.player img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.coin {
  position: absolute;
  font-size: 2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.start-btn, .retry-btn {
  background: var(--agent-button-bg-color, #A78BFA);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 99px;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(167, 139, 250, 0.3);
  transition: all 0.2s;
}

.start-btn:hover, .retry-btn:hover {
  transform: scale(1.05);
  background: #8B5CF6;
}

.game-over {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  padding: 2rem;
  text-align: center;
}

.reward {
  margin: 1.5rem 0;
  color: var(--fin-speak-accent, #4ADE80);
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2rem;
}

.animate-pop {
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Confetti Implementation */
.confetti-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #A78BFA;
  top: -10px;
  opacity: 0;
  animation: fall 3s linear forwards;
}

@keyframes fall {
  to { transform: translateY(500px) rotate(360deg); opacity: 1; }
}

/* Add random colors and positions to confetti pieces in your component if you like */
</style>
