<template>
  <div class="pestle-page">
    <!-- Title -->
    <h1 class="title">PESTLE Analysis</h1>

<!-- Text content, hidden after clicking Continue -->
<div v-if="!showPestle" class="text-content">
  <p class="description">
    This AI-driven process guides you through a detailed PESTLE analysis, helping you assess the political, economic,
    social, technological, legal, and environmental factors affecting your industry. By providing deep insights into
    these six critical areas, the tool supports making data-driven strategic business decisions.
  </p>

  <h2 class="subtitle">How to Use</h2>
  <p class="description">
    Enter Industry: Start by entering the industry you want to analyze.
  </p>

  <h2 class="subtitle">When to Use</h2>
  <p class="description">
    This tool is ideal for business strategists, market analysts, and decision-makers who need to clearly understand
    the external factors affecting their industry. Especially useful during strategic planning, market entry analysis,
    and risk assessment.
  </p>


      <div class="industry-input-container">
        <!-- Input field for industry -->
        <div class="industry-input">
          <label for="industry" class="label">Ngành<span class="required">*</span></label>
          <input id="industry" v-model="industry" type="text" placeholder="Nhập ngành bạn muốn phân tích"
            class="input" />
        </div>

        <!-- Start Analysis Button -->
        <button @click="startWorkflow" class="start-button" :disabled="inputEmpty">
          Phân tích →
        </button>
      </div>

    </div>



    <!-- Pestle Component -->
    <div v-if="showPestle" class="pestle-container">
      <div class="control-buttons">
        <button @click="resetWorkflow" class="back-button">Quay lại</button>
        <div class="analysis-controls">
          <button @click="pauseResume" class="control-button" :class="{ 'paused': isPaused }">
            <svg class="button-icon" viewBox="0 0 24 24" fill="currentColor">
              <path v-if="!isPaused" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
              <path v-else d="m7 4 10 6L7 16V4z"></path>
            </svg>
            {{ isPaused ? 'Tiếp tục' : 'Tạm dừng' }}
          </button>
          <button @click="cancelAnalysis" class="control-button cancel-button">
            <svg class="button-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
            </svg>
            Huỷ bỏ
          </button>
        </div>
      </div>
      <Pestle :industry="industry" :paused="isPaused" :cancelled="isCancelled" @analysis-cancelled="onAnalysisCancelled" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Pestle from "@/components/PestlePage/Pestle.vue";

export default defineComponent({
  name: "PestlePage",
  components: {
    Pestle,
  },
  data() {
    return {
      showPestle: false, // Controls whether the Pestle component is shown
      industry: "", // Stores the entered industry
      inputEmpty: true, // Flag to check if the input is empty
      isPaused: false, // Controls pause state
      isCancelled: false, // Controls cancel state
    };
  },
  methods: {
    startWorkflow() {
      if (this.inputEmpty) {
        return;
      }
      this.showPestle = true; // Show the Pestle component
      this.isPaused = false;
      this.isCancelled = false;
    },
    resetWorkflow() {
      this.showPestle = false; // Reset the workflow
      this.industry = ""; // Clear the industry input
      this.isPaused = false;
      this.isCancelled = false;
    },
    pauseResume() {
      this.isPaused = !this.isPaused;
    },
    cancelAnalysis() {
      this.isCancelled = true;
      setTimeout(() => {
        this.resetWorkflow();
      }, 500); // Small delay to allow components to handle cancellation
    },
    onAnalysisCancelled() {
      this.resetWorkflow();
    },
  },
  watch: {
    industry(newValue) {
      this.inputEmpty = newValue.trim() === "";
    },
  },
});
</script>

<style scoped>
.pestle-page {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  padding: 2rem;
  max-width: 1000px;
  margin: 2rem auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  text-align: center;
}

.text-content {
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.subtitle {
  font-size: 1.75rem;
  font-weight: 600;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.description {
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  color: #4a5568;
}

.industry-input-container {
  margin-top: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.industry-input {
  margin-bottom: 1.5rem;
}

.label {
  font-size: 1.1rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

.input {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.start-button {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: #000000;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-button:hover {
  background: #1a1a1a;
  transform: translateY(-2px);
}

.start-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  transform: none;
}

.back-button {
  margin-bottom: 2rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: #2d3748;
  background: #e2e8f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  background: #cbd5e0;
}

.back-button::before {
  content: '←';
  font-size: 1.2rem;
}

.pestle-container {
  margin-top: 2rem;
}

.control-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.analysis-controls {
  display: flex;
  gap: 0.75rem;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  color: #4a5568;
}

.control-button:hover {
  background: #f8fafc;
  border-color: #cbd5e0;
}

.control-button.paused {
  background: #e6fffa;
  border-color: #38b2ac;
  color: #38b2ac;
}

.control-button.paused:hover {
  background: #b2f5ea;
}

.cancel-button {
  background: #fed7d7;
  border-color: #fc8181;
  color: #c53030;
}

.cancel-button:hover {
  background: #feb2b2;
  border-color: #f56565;
}

.button-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .pestle-page {
    padding: 1rem;
    margin: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }

  .industry-input-container {
    padding: 1.5rem;
  }

  .control-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .analysis-controls {
    justify-content: center;
  }

  .control-button {
    flex: 1;
    justify-content: center;
  }
}

/* Dark mode styles */
.dark-mode .pestle-page {
  background: #374151;
  color: #f9fafb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.dark-mode .title {
  color: #f9fafb;
}

.dark-mode .text-content {
  background: #4b5563;
}

.dark-mode .subtitle {
  color: #e5e7eb;
}

.dark-mode .description {
  color: #d1d5db;
}

.dark-mode .industry-input-container {
  background: #4b5563;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.dark-mode .label {
  color: #e5e7eb;
}

.dark-mode .required {
  color: #f87171;
}

.dark-mode .input {
  background: #374151;
  border-color: #6b7280;
  color: #f9fafb;
}

.dark-mode .input:focus {
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
}

.dark-mode .start-button {
  background: #1f2937;
}

.dark-mode .start-button:hover {
  background: #374151;
}

.dark-mode .start-button:disabled {
  background: #6b7280;
}

.dark-mode .back-button {
  background: #6b7280;
  color: #f9fafb;
}

.dark-mode .back-button:hover {
  background: #4b5563;
}
</style>