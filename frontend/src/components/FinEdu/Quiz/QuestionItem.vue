<template>
  <div class="question-item">
    <h2>{{ question.text }}</h2>
    <div v-for="(answer, index) in question.answers" :key="index">
      <label>
        <input
          type="radio"
          :value="index"
          v-model="selectedAnswerIndex"
          @change="selectAnswer(answer, index)"
        />
        {{ answer.text }}
      </label>
    </div>
    <div v-if="selectedAnswer">
      <p :class="{ correct: isCorrect, wrong: !isCorrect }">
        {{ isCorrect ? "Correct!" : "Wrong!" }}
      </p>
      <p>{{ explanation }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: Object,
  },
  data() {
    return {
      selectedAnswerIndex: null,
      selectedAnswer: null,
      isCorrect: false,
      explanation: "",
    };
  },
  methods: {
    selectAnswer(answer, index) {
      this.selectedAnswer = answer;
      this.isCorrect = answer.correct;
      this.explanation = answer.explanation;
      this.$emit("answer-selected", {
        correct: answer.correct,
        selected: answer.text,
      });
    },
  },
};
</script>

<style scoped>
.question-item {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.question-item label {
  display: block;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.question-item label:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.question-item input[type="radio"] {
  margin-right: 10px;
}

.question-item input[type="radio"]:checked + span {
  color: #000000;
  font-weight: bold;
}

.correct {
  color: #000000;
  font-weight: bold;
}

.wrong {
  color: #ff0000;
  font-weight: bold;
}

.explanation {
  margin-top: 15px;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  color: #000000;
}
</style>
