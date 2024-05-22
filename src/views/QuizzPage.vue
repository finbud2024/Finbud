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

<template>
  <div class="quiz-container">
    <header>
      <h1>Keyword-Based Quiz</h1>
      <input type="text" v-model="keywords" placeholder="Enter finance-related keywords" />
      <button @click="generateQuiz">Generate Quiz</button>
    </header>
    <div v-if="question" class="quiz-content">
      <div class="question">
        <p>{{ question.question }}</p>
      </div>
      <div class="answers">
        <button
          v-for="(answer, index) in question.answers"
          :key="index"
          :class="{
            correct: selectedAnswer === index && answer.correct,
            incorrect: selectedAnswer === index && !answer.correct,
            selected: selectedAnswer === index
          }"
          @click="checkAnswer(index)"
        >
          {{ answer.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quiz-container {
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

header {
  margin-bottom: 20px;
}

input {
  padding: 10px;
  width: 200px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.quiz-content {
  margin-top: 20px;
}

.question h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.answers button {
  color: black;
  display: block;
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  font-size: 18px;
}

.answers button.correct {
  background-color: #4CAF50; /* Green */
  color: white;
}

.answers button.incorrect {
  background-color: #f44336; /* Red */
  color: white;
}

.answers button.selected:not(.correct):not(.incorrect) {
  background-color: #ddd;
}

</style>
