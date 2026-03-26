<template>
  <div class="trivia-container">
    <div class="trivia-card" v-if="!gameOver">
      <div class="trivia-progress">
        Question {{ currentQuestionIndex + 1 }} / {{ questions.length }}
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: ((currentQuestionIndex + 1) / questions.length) * 100 + '%' }"></div>
        </div>
      </div>
      
      <div class="question-text animate-pop">
        {{ currentQuestion.text }}
      </div>

      <div class="options-grid">
        <button 
          v-for="(option, idx) in currentQuestion.options" 
          :key="idx"
          @click="handleAnswer(idx)"
          class="option-btn"
          :class="{ 
            'correct': selectedIdx === idx && idx === currentQuestion.correct,
            'wrong': selectedIdx === idx && idx !== currentQuestion.correct,
            'disabled': selectedIdx !== null
          }"
          :disabled="selectedIdx !== null"
        >
          {{ option }}
          <font-awesome-icon v-if="selectedIdx === idx && idx === currentQuestion.correct" icon="fa-solid fa-check-circle" class="status-icon" />
          <font-awesome-icon v-if="selectedIdx === idx && idx !== currentQuestion.correct" icon="fa-solid fa-times-circle" class="status-icon" />
        </button>
      </div>

      <div v-if="feedback" class="feedback-text animate-slide-up" :class="feedbackType">
        {{ feedback }}
      </div>
    </div>

    <div v-else class="results-view animate-pop">
      <div class="trophy-icon">🏆</div>
      <h2>Finance Master!</h2>
      <p>Your score: <strong>{{ score }}</strong> / {{ questions.length }}</p>
      <div class="reward-pill">
        +{{ score * 50 }} Experience Points
      </div>
      <button @click="resetTrivia" class="play-again-btn">Play Again</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "FinancialTriviaGame",
  data() {
    return {
      currentQuestionIndex: 0,
      score: 0,
      selectedIdx: null,
      gameOver: false,
      feedback: "",
      feedbackType: "",
      questions: [
        {
          text: "What is 'Compound Interest'?",
          options: ["Interest only on principal", "Interest on interest", "A flat banking fee", "A type of loan"],
          correct: 1,
          explanation: "Interest on interest makes your money grow faster over time!"
        },
        {
          text: "Which of these is considered a 'diversified' investment?",
          options: ["Buying only Tesla stock", "Putting all money in Bitcoin", "An Index Fund (S&P 500)", "Keeping cash under a mattress"],
          correct: 2,
          explanation: "Index funds spread your risk across many different companies."
        },
        {
          text: "What does the 'Bear Market' mean?",
          options: ["Market is rising", "Market is falling", "Market is sideways", "Market is opening"],
          correct: 1,
          explanation: "Bears 'swipe down' (falling prices), Bulls 'gore up' (rising prices)!"
        }
      ]
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    }
  },
  methods: {
    handleAnswer(idx) {
      this.selectedIdx = idx;
      if (idx === this.currentQuestion.correct) {
        this.score++;
        this.feedback = "Correct! " + this.currentQuestion.explanation;
        this.feedbackType = "success";
      } else {
        this.feedback = "Oops! " + this.currentQuestion.explanation;
        this.feedbackType = "error";
      }

      setTimeout(() => {
        if (this.currentQuestionIndex < this.questions.length - 1) {
          this.currentQuestionIndex++;
          this.selectedIdx = null;
          this.feedback = "";
        } else {
          this.gameOver = true;
        }
      }, 2500);
    },
    resetTrivia() {
      this.currentQuestionIndex = 0;
      this.score = 0;
      this.selectedIdx = null;
      this.gameOver = false;
      this.feedback = "";
    }
  }
};
</script>

<style scoped>
.trivia-container {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  margin: 1rem auto;
  border: 4px solid #F0F9FF;
}

.trivia-progress {
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 20px;
}

.progress-bar {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: #3B82F6;
  border-radius: 3px;
  transition: width 0.4s ease;
}

.question-text {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 24px;
}

.options-grid {
  display: grid;
  gap: 12px;
}

.option-btn {
  padding: 16px;
  background: #F8FAFC;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.option-btn:hover:not(.disabled) {
  background: #F1F5F9;
  border-color: #3B82F6;
  transform: translateX(4px);
}

.option-btn.correct {
  background: #ECFDF5;
  border-color: #10B981;
  color: #065F46;
}

.option-btn.wrong {
  background: #FEF2F2;
  border-color: #EF4444;
  color: #991B1B;
}

.feedback-text {
  margin-top: 20px;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
}

.feedback-text.success { background: #F0FDF4; color: #166534; border-left: 4px solid #10B981; }
.feedback-text.error { background: #FFF1F2; color: #9F1239; border-left: 4px solid #EF4444; }

.results-view {
  text-align: center;
  padding: 20px;
}

.trophy-icon { font-size: 4rem; margin-bottom: 1rem; }

.reward-pill {
  display: inline-block;
  padding: 8px 24px;
  background: #DBEAFE;
  color: #1E40AF;
  border-radius: 99px;
  font-weight: 700;
  margin: 1rem 0;
}

.play-again-btn {
  width: 100%;
  background: #3B82F6;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 1rem;
}

.animate-pop { animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes pop { from { scale: 0.9; opacity: 0; } to { scale: 1; opacity: 1; } }

.animate-slide-up { animation: slideUp 0.3s ease-out; }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
