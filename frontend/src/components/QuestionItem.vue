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
.correct {
  color: green;
}
.wrong {
  color: red;
}
label {
  display: block;
  size: 300px;
  margin-bottom: 50px;
}
</style>
