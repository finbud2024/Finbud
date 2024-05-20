<template>
  <div class="quiz-container">
    <header>
      <h1>Keyword-Based Quiz</h1>
      <input type="text" v-model="keywords" placeholder="Enter keywords" />
      <button @click="generateQuiz">Generate Quiz</button>
    </header>
    <div v-if="question" class="quiz-content">
      <div class="question">
        <h2>{{ question.text }}</h2>
      </div>
      <div class="answers">
        <button
          v-for="(answer, index) in question.answers"
          :key="index"
          :class="{'correct': selectedAnswer === index && answer.correct, 'incorrect': selectedAnswer === index && !answer.correct}"
          @click="checkAnswer(index)"
        >
          {{ answer.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'QuizComponent',
  data() {
    return {
      keywords: '',
      question: null,
      selectedAnswer: null,
    };
  },
  methods: {
    async generateQuiz() {
      try {
        const response = await axios.post('/api/generate-quiz', { keywords: this.keywords });
        this.question = response.data;
        this.selectedAnswer = null;
      } catch (error) {
        console.error('Error generating quiz:', error);
      }
    },
    checkAnswer(index) {
      this.selectedAnswer = index;
    },
  },
};
</script>

<style scoped>
.quiz-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
  font-family: 'Space Grotesk', sans-serif;
}

header {
  margin-bottom: 20px;
}

input {
  padding: 10px;
  width: 200px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
}

.quiz-content {
  margin-top: 20px;
}

.question h2 {
  margin-bottom: 20px;
}

.answers button {
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.answers button.correct {
  background-color: #4CAF50; /* Green */
  color: white;
}

.answers button.incorrect {
  background-color: #f44336; /* Red */
  color: white;
}
</style>
