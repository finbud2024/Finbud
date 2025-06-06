<template>
  <div class="follow-up-questions">
    <h3>Follow-Up Questions</h3>
    <ul>
      <li v-for="(question, index) in followUpQuestions" :key="index">
        <button @click="handleFollowUp(question)">{{ question }}</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "FollowUpComponent",
  props: {
    followUpQuestions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    handleFollowUp(question) {
      this.$emit("sendFollowUp", question);
    },
  },
};
</script>

<style scoped>
.follow-up-questions {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width: 70%;
}
.follow-up-questions h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  font-weight: 600;
}
.follow-up-questions ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.follow-up-questions li {
  margin-bottom: 10px;
}
.follow-up-questions button {
  background-color: #000000;
  border: none;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}
.follow-up-questions button:hover {
  background-color: #333333;
}
.follow-up-questions button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.5);
}
</style>
