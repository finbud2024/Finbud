<template>
  <section class="process">
    <h2>{{ $t("process.title") }}</h2>
    <div class="steps">
      <div
        class="step"
        v-for="(step, index) in steps"
        :key="index"
        @click="openModal(step)"
      >
        <div class="content">
          <h3>{{ $t(`process.steps.${index}.title`) }}</h3>
          <ul>
            <li v-for="(subStep, subIndex) in step.subsSteps" :key="subIndex">
              {{ $t(`process.steps.${index}.subs.${subIndex}`) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <v-dialog v-model="isModalOpen" max-width="600px">
      <v-card>
        <v-card-title class="headline">{{ $t(selectedStep.title)
        }}</v-card-title>
        <v-card-text>
          <ul>
            <li
              v-for="(subStep, subIndex) in selectedStep.subsSteps"
              :key="subIndex"
            >
              {{ $t(selectedStep.subs[subIndex]) }}
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isModalOpen = false">{{
            $t("process.closeButton")
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
export default {
  name: "ProcessInt",
  data() {
    return {
      isModalOpen: false,
      selectedStep: {},
      steps: [
        {
          title: "process.steps.0.title",
          subsSteps: [
            "process.steps.0.subs.0",
            "process.steps.0.subs.1",
            "process.steps.0.subs.2",
          ],
        },
        {
          title: "process.steps.1.title",
          subsSteps: ["process.steps.1.subs.0"],
        },
        {
          title: "process.steps.2.title",
          subsSteps: [
            "process.steps.2.subs.0",
            "process.steps.2.subs.1",
            "process.steps.2.subs.2",
          ],
        },
        {
          title: "process.steps.3.title",
          subsSteps: ["process.steps.3.subs.0", "process.steps.3.subs.1"],
        },
      ],
    };
  },
  methods: {
    openModal(step) {
      this.selectedStep = step;
      this.isModalOpen = true;
    },
  },
};
</script>

<style scoped>
.process {
  background-color: #f3f4f6;
  color: #1c1c4c;
  padding: 3rem 1rem;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}

.process h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.steps {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 0 1rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 45%;
  background-color: #3222c3; /* Dark purple-blue background */
  color: white;
  margin: 0.5rem;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  animation: fadeIn 0.8s ease-in-out;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation-fill-mode: forwards;
  cursor: pointer; /* Add cursor pointer to indicate clickability */
}

.step:nth-child(1) {
  animation-delay: 0s;
}

.step:nth-child(2) {
  animation-delay: 0.2s;
}

.step:nth-child(3) {
  animation-delay: 0.4s;
}

.step:nth-child(4) {
  animation-delay: 0.6s;
}

.step:nth-child(5) {
  animation-delay: 0.8s;
}

.step::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}

.step:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.step:hover::before {
  opacity: 1;
}

.step h3 {
  margin: 0; /* Remove all margins */
  padding: 0; /* Remove all paddings */
  margin-bottom: 0.5rem;
  font-size: 1.4rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  overflow: hidden;
  white-space: nowrap;
  animation: typing 1s steps(30, end) forwards;
}

.step p {
  margin: 0;
  position: relative;
  z-index: 2;
}

.step-number {
  font-size: 2rem;
  color: #3222c3;
  margin-bottom: 0.5rem;
  margin-top: 0;
}

.content li {
  text-align: left; /* Align substep text to the left for better readability */
  margin-bottom: 5px;
  padding: 0 15px; /* Ensure padding inside cards */
}

/* Animation in CSS */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Component-specific media queries */
@media (max-width: 768px) {
  .step {
    flex: 1 1 100%;
    margin: 0.5rem 0;
    padding: 1rem;
  }

  .responsive-step-title {
    font-size: 1rem;
  }

  .responsive-step-text {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .step {
    padding: 0.4rem;
  }

  .responsive-step-title {
    font-size: 0.8rem;
  }

  .responsive-step-text {
    font-size: 0.6rem;
  }
}
</style>
