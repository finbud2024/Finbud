<template>
  <div class="section-container">
    <QuizRewards v-if="showingReward" :reward-amount="rewardAmount" @close="showingReward = false" />
     
    <div class="quiz-card" data-aos="fade-up">
      <div class="form-group keyword-search-section">
        <label for="search-keyword-input" class="keyword-label">{{ $t('currentKeywordLabel') }}</label>
        <div class="keyword-input-container">
          <div class="keyword-input-group">
            <font-awesome-icon icon="fa-solid fa-search" class="input-icon" />
            <input 
              id="search-keyword-input"
              type="text" 
              v-model="searchKeyword" 
              :disabled="isLoading"
              :placeholder="$t('keywordPlaceholder')" 
              @keyup.enter="GenerateQuiz"
              class="keyword-input"
            />
          </div>
          <button 
            class="btn-generate-quiz" 
            @click="GenerateQuiz" 
            :disabled="isLoading || !searchKeyword.trim()"
          >
            <font-awesome-icon 
              :icon="isLoading ? 'fa-solid fa-spinner' : 'fa-solid fa-arrow-right'" 
              :class="{ 'fa-spin': isLoading }"
              class="btn-icon"
            />
            <span>{{ isLoading ? $t('generatingButton') : $t('generateQuizButton') }}</span>
          </button>
        </div>
      </div>

      <div class="form-group" v-if="relatedKeyword.length !== 0">
        <label for="related-keyword">{{ $t('relatedKeywordsLabel') }}</label>
        <div class="carousel-wrapper">
          <button class="carousel-nav left" @click="scrollLeft" :aria-label="$t('scrollLeft')">
            &lt;
          </button>

          <div class="related-keyword-container" ref="carousel">
            <button v-for="keyword in relatedKeyword" :key="keyword" :disabled="isLoading" class="button"
              @click="handleSuggestedChoice(keyword)">
              {{ keyword }}
            </button>
          </div>

          <button class="carousel-nav right" @click="scrollRight" :aria-label="$t('scrollRight')">
            &gt;
          </button>
        </div>
      </div>
      <div v-if="currentKeyword" class="quiz-info">
        <div>{{ $t('currentKeywordLabel') }} {{ currentKeyword }}</div>
        <div>{{ $t('pointsLabel') }} {{ score }}</div>
        <div>{{ $t('timeLeftLabel') }} {{ timerCountdown }}</div>
      </div>
      <div class="quiz-area">
        <div :class="[
          'quizQuestion',
          { quizQuestionEnabled: question.length !== 0 },
        ]">
          {{ currentQuestion === -1 ? $t('questionPlaceholder') : question }}
        </div>
        <div class="quizChoices">
          <button v-for="index in 4" :key="index" :disabled="answerButtonDisabled" @click="handleUserChoice(index)"
            :class="[
              'answerButton',
              { answerButtonActive: answerOptions.length !== 0 },
            ]">
            {{
              answerOptions.length === 0
                ? $t('answerPlaceholder', { letter: String.fromCharCode(64 + index) })
                : answerOptions[index - 1].replace(/\*$/, "")
            }}
          </button>
        </div>
        <div v-if="showExplaination" class="explanation-container">
          <div class="explanation-text">
            <div class="explanation-title">{{ $t('explanationTitle') }}</div>
            <div>{{ explanation }}</div>
          </div>
          <button class="button" @click="handleNextQuestion">
            {{ $t('nextQuestionButton') }}
          </button>
        </div>
      </div>
      <div v-if="modalDisplay" class="overlay">
        <div class="modal-container">
          <div class="result-title">{{ $t('quizResultTitle') }}</div>
          <div>
            <div>{{ $t('currentKeywordLabel') }} {{ currentKeyword }}</div>
            <div>{{ $t('pointsLabel') }} {{ score }}/3</div>
          </div>
          <div class="result-button-container">
            <button class="button" @click="handleQuizResult('same')">
              {{ $t('sameKeywordButton') }}
            </button>
            <button class="button" @click="handleQuizResult('different')">
              {{ $t('differentKeywordButton') }}
            </button>
            <button class="button" @click="handleQuizResult('end')">
              {{ $t('endQuizButton') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSearch, faArrowRight, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { gptServices } from "@/services/gptServices";
import debounce from "lodash/debounce";
import QuizRewards from "@/components/FinEdu/Quiz/QuizRewards.vue";
import { showReward } from "@/utils/utils";

library.add(faSearch, faArrowRight, faSpinner);

export default {
  name: "quizComponent",
  components: {
    QuizRewards,
    FontAwesomeIcon,
  },
  data() {
    return {
      score: 0,
      timerCountdown: 0,
      searchKeyword: "",
      currentKeyword: "",
      relatedKeyword: [],
      currentQuestion: -1,
      questionList: [],
      question: "",
      answerOptions: [],
      explanation: "",
      timer: null,
      correctAnswer: "",
      showExplaination: false,
      answerButtonDisabled: true,
      isLoading: false,
      modalDisplay: false,
      scrollPosition: 0,
      maxScroll: 0,
      rewardAmount: 1,
      showingReward: false,
    };
  },
  watch: {
    timerCountdown: {
      immedidate: true,
      handler(newTime) {
        if (newTime <= 0) {
          this.stopTimer();
          this.showCorrectAnswer();
        }
      },
    },
  },
  methods: {
    GenerateQuiz: debounce(async function () {
      if (!this.searchKeyword.trim()) return;
      this.isLoading = true;
      this.answerButtonDisabled = true;
      this.currentQuestion = -1;
      this.question = "";
      this.answerOptions = [];
      this.relatedKeyword = [];
      this.resetQuizState(); // Reset all quiz-related variables

      this.currentKeyword = this.searchKeyword.toUpperCase();
      this.searchKeyword = "";

      try {
        const response = await gptServices([
          {
            role: "system",
            content: "You are a finance quiz generator. Return questions in EXACTLY this format:\n\n" +
              "Question: [question]\n" +
              "A. [option1]\n" +
              "B. [option2]\n" +
              "C. [option3]\n" +
              "D. [option4]\n" +
              "Correct Answer: [A/B/C/D]\n" +
              "Explanation: [explanation]\n\n" +
              "[Repeat for 3 questions]"
          },
          {
            role: "user",
            content: `Generate 3 multiple-choice questions about ${this.currentKeyword} in finance.`
          }
        ]);

        // Improved parsing
        this.questionList = this.parseQuizResponse(response);

        if (this.questionList.length === 0) {
          throw new Error("No valid questions found in response");
        }

        this.currentQuestion = 0;
        this.loadCurrentQuestion();
        await this.generateRelatedKeywords();

      } catch (error) {
        console.error("Quiz generation failed:", error);
        this.question = "Failed to generate questions. Please try again.";
      } finally {
        this.isLoading = false;
        this.answerButtonDisabled = false;
        this.startTimer();
      }
    }, 300),

    parseQuizResponse(response) {
      const blocks = response.split(/\n\n+/);
      const questions = [];

      blocks.forEach(block => {
        const lines = block.split('\n').filter(l => l.trim());
        if (lines.length < 7) return; // Skip incomplete questions

        questions.push({
          question: lines[0].replace('Question:', '').trim(),
          options: lines.slice(1, 5).map(opt => opt.replace(/^[A-D]\.\s*/, '').trim()),
          correctAnswer: lines[5].replace('Correct Answer:', '').trim(),
          explanation: lines[6].replace('Explanation:', '').trim()
        });
      });

      return questions;
    },

    loadCurrentQuestion() {
      if (this.currentQuestion >= this.questionList.length) {
        return;
      }

      const q = this.questionList[this.currentQuestion];
      this.question = q.question;
      this.answerOptions = q.options;
      this.correctAnswer = q.correctAnswer;
      this.explanation = q.explanation;
    },

    resetQuizState() {
      this.questionList = [];
      this.currentQuestion = -1;
      this.question = "";
      this.answerOptions = [];
      this.correctAnswer = "";
      this.explanation = "";
      this.showExplaination = false;
      this.score = 0;
      this.stopTimer();
    },

    handleSuggestedChoice: debounce(async function (keyword) {
      this.searchKeyword = keyword;
      this.GenerateQuiz();
    }, 300),

    startTimer() {
      this.timerCountdown = 15;
      this.timer = setInterval(() => {
        this.timerCountdown -= 1;
      }, 1000);
    },

    stopTimer() {
      clearInterval(this.timer);
    },

    stateReset() {
      const initialData = this.$options.data.call(this);
      Object.keys(initialData).forEach((key) => {
        if (key !== "currentKeyword" && key !== "timerCountdown") {
          this[key] = initialData[key];
        }
      });
    },

    async generateRelatedKeywords() {
      const response = await gptServices([
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Generate exactly 10 related keywords for "${this.currentKeyword}" in finance, used in CFA context. Respond with only the keywords, comma-separated. Do not include any introduction, explanation, or additional text.`,
        },
      ]);
      this.relatedKeyword = response.split(",");
    },

    handleUserChoice(index) {
      this.stopTimer();
      const isCorrect = String.fromCharCode(64 + index) === this.correctAnswer;
      if (!isCorrect) {
        const incorrectAnswerBtn = document.querySelector(
          `.quizChoices button:nth-child(${index})`
        );
        if (incorrectAnswerBtn) {
          incorrectAnswerBtn.classList.add("answer-button-incorrect");
        }
      } else {
        this.score += 1;

        this.awardFinCoinsForCorrectAnswer()
          .then(() => {
            showReward(this, 1, "quiz");
          })
          .catch((error) => {
            console.error(
              "Failed to award FinCoins for correct answer:",
              error
            );
          });
      }
      this.showCorrectAnswer();
    },

    showCorrectAnswer() {
      this.$emit("messageToBot", this.explanation);
      this.answerButtonDisabled = true;
      this.showExplaination = true;
      if (this.correctAnswer && /^[A-D]$/.test(this.correctAnswer)) {
        const correctIndex = this.correctAnswer.charCodeAt(0) - 64; // Convert A, B, C, D to 1, 2, 3, 4
        const correctAnsBtn = document.querySelector(
          `.quizChoices button:nth-child(${correctIndex})`
        );
        if (correctAnsBtn) {
          correctAnsBtn.classList.add("answer-button-correct");
        }
      }
    },

    handleNextQuestion() {
      this.showExplaination = false;

      // Reset button styles
      document.querySelectorAll('.quizChoices button').forEach(button => {
        button.classList.remove('answer-button-incorrect', 'answer-button-correct');
      });

      this.currentQuestion += 1;
      if (this.currentQuestion >= this.questionList.length) {
        this.modalDisplay = true;
        this.answerButtonDisabled = true;
        return;
      }
      this.loadCurrentQuestion();
      this.answerButtonDisabled = false;
      this.startTimer();
    },

    handleQuizResult(setting) {
      this.modalDisplay = false;
      if (setting === "same") {
        const temp = this.currentKeyword;
        this.stateReset();
        this.searchKeyword = temp;
        this.GenerateQuiz();
      } else if (setting === "different") {
        const temp = this.currentKeyword;
        this.stateReset();
      } else {
        this.currentKeyword = "";
        this.stateReset();
      }

      // Award FinCoins for completing the quiz if score is good
      if (this.score >= 0) {
        this.awardFinCoinsForQuizCompletion()
          .then(() => {
            showReward(this, 5, "quiz");
          })
          .catch((error) => {
            console.error(
              "Failed to award FinCoins for quiz completion:",
              error
            );
          });
      }
    },

    async awardFinCoinsForCorrectAnswer() {
      return this.$store.dispatch("finCoin/earnFinCoins", {
        amount: 1,
        source: "quiz_correct",
        sourceId: this.currentQuiz?._id,
        description: "Correct quiz answer",
      });
    },

    async awardFinCoinsForQuizCompletion() {
      return this.$store.dispatch("finCoin/earnFinCoins", {
        amount: 5,
        source: "quiz_completion",
        sourceId: this.currentQuiz?._id,
        description: "Completed full quiz session",
      });
    },

    calculateMaxScroll() {
      if (this.$refs.carousel) {
        const container = this.$refs.carousel;
        this.maxScroll = container.scrollWidth - container.clientWidth;
      }
    },

    scrollLeft() {
      this.scrollTo(this.scrollPosition - 200);
    },

    scrollRight() {
      this.scrollTo(this.scrollPosition + 200);
    },

    scrollTo(position) {
      const container = this.$refs.carousel;
      if (!container) return;

      // Smooth scroll animation
      container.scrollTo({
        left: position,
        behavior: 'smooth'
      });

      this.scrollPosition = position;
    },
  },

  computed: {
    isAtStart() {
      return this.scrollPosition <= 0;
    },
    isAtEnd() {
      return this.scrollPosition >= this.maxScroll;
    }
  },

  mounted() {
    this.calculateMaxScroll();
    window.addEventListener('resize', this.calculateMaxScroll);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.calculateMaxScroll);
  },
};
</script>

<style scoped>
/* Base Variables */
:root {
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --link-color: #000000;
  --hover-bg: #000000;
}

/* Quiz Card */
.quiz-card {
  background: var(--background-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  margin-top: 2rem;
}

/* Search Container */
.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-container input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
}

.search-container button {
  padding: 0.75rem 1.5rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-container button:hover {
  background: #1a1a1a;
}

/* Related Keywords */
.related-keyword-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.related-keyword-container::-webkit-scrollbar {
    display: none;
}

.related-keyword-container button {
  padding: 0.5rem 1rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-keyword-container button:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

/* Quiz Area */
.quiz-area {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
}

.quizQuestion {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.quizChoices {
  display: grid;
  gap: 1rem;
}

.answerButton {
  padding: 1rem;
  background: #000000;
  border: 1px solid #000000;
  border-radius: var(--radius-md);
  text-align: left;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.answerButton:hover:not(:disabled) {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.answerButtonActive {
  background: white;
}

.answerButton:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Quiz Info */
.quiz-info {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Explanation Container */
.explanation-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.explanation-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.explanation-text {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

/* Modal */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  max-width: 90%;
  width: 500px;
}

.result-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-align: center;
}

.result-button-container {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Keyword Search Section */
.keyword-search-section {
  margin-bottom: 2rem;
}

.keyword-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.keyword-input-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.keyword-input-group {
  flex: 1;
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.1rem;
}

.keyword-input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #1e293b;
  background-color: #f8fafc;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.keyword-input:focus {
  outline: none;
  border-color: #000000;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.keyword-input::placeholder {
  color: #9ca3af;
}

.btn-generate-quiz {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
  white-space: nowrap;
}

.btn-generate-quiz .btn-icon {
  font-size: 1.1rem;
}

.btn-generate-quiz:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
}

.btn-generate-quiz:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #9ca3af;
  box-shadow: none;
}

.fa-spin {
  animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Ensure other styles in quiz-card are not negatively impacted */
.quiz-card .form-group {
  margin-bottom: 1.5rem;
}

/* Carousel Navigation */
.carousel-wrapper {
  position: relative;
  padding: 0 2rem;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;
}

.carousel-nav.left {
  left: 0;
}

.carousel-nav.right {
  right: 0;
}

.carousel-nav:hover {
  background: var(--surface-color);
  border-color: var(--link-color);
}

/* Answer Button States */
.answer-button-correct {
  background: #10b981 !important;
  border-color: #10b981 !important;
  color: white !important;
}

.answer-button-incorrect {
  background: #ef4444 !important;
  border-color: #ef4444 !important;
  color: white !important;
}

/* Button */
.button {
  padding: 0.75rem 1.5rem;
  background: var(--link-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover:not(:disabled) {
  background: var(--hover-bg);
}

.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .quiz-card {
    padding: 1rem;
  }

  .keyword-input-container {
    flex-direction: column;
  }

  .btn-generate-quiz {
    width: 100%;
  }

  .quiz-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .carousel-wrapper {
    padding: 0 1.5rem;
  }

  .carousel-nav {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.quiz-wrapper:hover {
  border-color: #000000;
}
</style>