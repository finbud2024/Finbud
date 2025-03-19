<template>
  <div class="quizPageContainer">
    <div class="container">
      <quizComponent @messageToBot="$emit('finbudBotResponse', $event)" />
    </div>
  </div>
</template>

<script>
import quizComponent from "../components/quizComponent.vue";
import AOS from 'aos';
import 'aos/dist/aos.css';
//moving quiz into a component in case need to add more later on to Quiz Page
export default {
  name: "QuizzPage",
  components: { quizComponent },
  mounted() {
    AOS.init({ duration: 800, easing: "ease-out" });
  }
};
</script>

<style scoped>
/* Light & Dark Mode Variables */
:root {
  --bg-primary: white;
  --text-primary: black;
  --container-bg: #f8f9fa;
  --container-border: #ddd;
}

:root.dark-mode {
  --bg-primary: #121212;
  --text-primary: #f5f5f5;
  --container-bg: #1e1e1e;
  --container-border: #444;
}

/* Quiz Page Container */
.quizPageContainer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-primary);
  color: var(--text-primary);
}

/* Container for Quiz Component */
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 2rem 0;
  background-color: var(--container-bg);
  border: 1px solid var(--container-border);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive Styles */
@media screen and (max-width: 768px) {
  .container {
    width: 100%;
    padding: 15px;
  }
}
</style>
