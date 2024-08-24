<template>
  <div class="questionnaire">
    <h1>Questionnaire</h1>
    <div v-if="!quizStarted" class="quiz-setup">
      <select v-model="selectedQuiz" class="dropdown">
        <option disabled value="">Select a quiz</option>
        <option value="saving">Saving vs Investing</option>
        <option value="budgeting">Budgeting</option>
        <option value="assetAllocation">Asset Allocation</option>
      </select>
      <select v-model="selectedDifficulty" class="dropdown">
        <option disabled value="">Select difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <button
        @click="startQuiz"
        :disabled="!selectedQuiz || !selectedDifficulty"
      >
        Start Quiz
      </button>
    </div>
    <div v-else-if="currentQuestion && !quizCompleted">
      <div class="question-container">
        <div class="timer">Time left: {{ timeLeft }} seconds</div>
        <div class="question-bar">{{ currentQuestion.text }}</div>
        <div class="explanation" v-if="selectedAnswer !== null">
          Explanation: {{ currentQuestion.answers[selectedAnswer].explanation }}
        </div>
        <div class="answers">
          <div
            v-for="(answer, index) in currentQuestion.answers"
            :key="index"
            class="answer-box"
          >
            <button
              :class="{
                correct: selectedAnswer === index && answer.correct,
                incorrect: selectedAnswer === index && !answer.correct,
              }"
              @click="handleAnswer(index)"
            >
              {{ answer.text }}
            </button>
          </div>
        </div>
      </div>
      <button @click="showNextQuestion" :disabled="selectedAnswer === null">
        {{ currentIndex === questions.length - 1 ? "Finish" : "Next Question" }}
      </button>
    </div>
    <div v-else-if="questions.length === 0">
      <p>Loading questions...</p>
    </div>
    <div v-else-if="quizCompleted">
      <h2>Quiz Completed!</h2>
      <p>Your Score: {{ score }} / {{ questions.length }}</p>
      <button @click="resetQuiz">Start New Quiz</button>
    </div>
  </div>
</template>

<script>
import QuestionItem from "@/components/QuestionItem.vue";
import SavingEasy from "./assets/data/QuestionSavingVInvestingEasy.json";
import SavingMedium from "./assets/data/QuestionSavingVInvestingMedium.json";
import SavingHard from "./assets/data/QuestionSavingVInvestingHard.json";
import BudgetingEasy from "./assets/data/QuestionBudgetingEasy.json";
import BudgetingMedium from "./assets/data/QuestionBudgetingMedium.json";
import BudgetingHard from "./assets/data/QuestionBudgetingHard.json";
import AssetEasy from "./assets/data/QuestionAssetAllocationEasy.json";
import AssetMedium from "./assets/data/QuestionAssetAllocationMedium.json";
import AssetHard from "./assets/data/QuestionAssetAllocationHard.json";

export default {
  components: {
    QuestionItem,
  },
  data() {
    return {
      questions: [],
      currentIndex: 0,
      timeLeft: 60,
      timer: null,
      answered: false,
      selectedAnswer: null,
      quizStarted: false,
      quizCompleted: false,
      selectedQuiz: "",
      selectedDifficulty: "",
      score: 0,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
  },
  methods: {
    loadQuestions(quizData) {
      this.questions = quizData.map((item) => ({
        text: `Question: ${item.Question}`,
        answers: this.shuffleAnswers(
          item.Answers.map((answer) => ({
            text: answer.Answer,
            correct: answer.Correct,
            explanation: answer.Explanation,
          }))
        ),
      }));
      this.startTimer();
    },
    shuffleAnswers(answers) {
      const answersCopy = [...answers];
      for (let i = answersCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answersCopy[i], answersCopy[j]] = [answersCopy[j], answersCopy[i]];
      }
      return answersCopy;
    },
    startQuiz() {
      this.quizStarted = true;
      this.selectedAnswer = null;
      let quizData;

      if (this.selectedQuiz === "saving") {
        switch (this.selectedDifficulty) {
          case "easy":
            quizData = SavingEasy;
            break;
          case "medium":
            quizData = SavingMedium;
            break;
          case "hard":
            quizData = SavingHard;
            break;
        }
      } else if (this.selectedQuiz === "budgeting") {
        switch (this.selectedDifficulty) {
          case "easy":
            quizData = BudgetingEasy;
            break;
          case "medium":
            quizData = BudgetingMedium;
            break;
          case "hard":
            quizData = BudgetingHard;
            break;
        }
      } else if (this.selectedQuiz === "assetAllocation") {
        switch (this.selectedDifficulty) {
          case "easy":
            quizData = AssetEasy;
            break;
          case "medium":
            quizData = AssetMedium;
            break;
          case "hard":
            quizData = AssetHard;
            break;
        }
      }
      this.loadQuestions(quizData);
    },
    startTimer() {
      this.timeLeft = 60;
      this.timer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.showNextQuestion();
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    showNextQuestion() {
      this.stopTimer();
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++;
        this.selectedAnswer = null;
        this.answered = false;
        this.startTimer();
      } else {
        this.quizCompleted = true;
      }
    },
    handleAnswer(index) {
      if (this.selectedAnswer === null) {
        this.selectedAnswer = index;
        this.answered = true;
        if (this.currentQuestion.answers[index].correct) {
          this.score++;
        }
        this.stopTimer();
      }
    },
    resetQuiz() {
      this.currentIndex = 0;
      this.score = 0;
      this.selectedAnswer = null;
      this.quizStarted = false;
      this.quizCompleted = false;
      this.selectedQuiz = "";
      this.selectedDifficulty = "";
      this.stopTimer();
    },
  },
  beforeUnmount() {
    this.stopTimer();
  },
};
</script>

<style scoped>
.questionnaire {
  padding: 20px;
  text-align: center;
  font-family: "Space Grotesk", sans-serif;
}
.quiz-setup {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.dropdown {
  width: 200px;
  padding: 5px;
  font-size: 16px;
}
.question-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.timer {
  font-size: 18px;
  margin-bottom: 10px;
}
.question-bar {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}
.explanation {
  margin: 10px 0;
  font-style: italic;
}
.answers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 30px;
}
.answer-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  width: 100%;
  padding: 20px; /* Increased padding for better visibility */
  font-size: 18px;
  cursor: pointer;
  background-color: #145aff;
  color: white;
  border: none;
  border-radius: 5px;
}
button.correct {
  background-color: green;
}
button.incorrect {
  background-color: red;
}
</style>
