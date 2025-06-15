<template>
  <div class="swot-page">
    <!-- Title -->
    <h1 class="title">Phân tích SWOT</h1>

    <!-- Text content, hidden after clicking Continue -->
    <div v-if="!showSwot" class="text-content">
      <p class="description">
        Quy trình AI này hướng dẫn bạn thực hiện phân tích SWOT chi tiết, giúp bạn đánh giá các điểm mạnh, điểm yếu, 
        cơ hội và thách thức ảnh hưởng đến doanh nghiệp của bạn. Bằng cách cung cấp cái nhìn sâu sắc về 
        bốn khía cạnh quan trọng này, công cụ hỗ trợ đưa ra các quyết định chiến lược kinh doanh dựa trên dữ liệu.
      </p>

      <h2 class="subtitle">Cách sử dụng</h2>
      <p class="description">
        Nhập tên công ty hoặc doanh nghiệp: Bắt đầu bằng cách nhập tên công ty hoặc doanh nghiệp mà bạn muốn phân tích.
      </p>

      <h2 class="subtitle">Khi nào nên sử dụng</h2>
      <p class="description">
        Công cụ này lý tưởng cho các nhà quản lý doanh nghiệp, nhà phân tích chiến lược và người ra quyết định cần hiểu
        rõ các yếu tố nội tại và bên ngoài ảnh hưởng đến tổ chức của họ. Đặc biệt hữu ích trong quá trình lập kế hoạch 
        chiến lược, phân tích thị trường, và đánh giá vị thế cạnh tranh.
      </p>

      <div class="company-input-container">
        <!-- Input field for company -->
        <div class="company-input">
          <label for="company" class="label">Công ty<span class="required">*</span></label>
          <input id="company" v-model="company" type="text" placeholder="Nhập tên công ty bạn muốn phân tích"
            class="input" />
        </div>

        <!-- Start Analysis Button -->
        <button @click="startWorkflow" class="start-button" :disabled="inputEmpty">
          Phân tích →
        </button>
      </div>

    </div>

    <!-- Swot Component -->
    <div v-if="showSwot" class="swot-container">
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
      <Swot :company="company" :paused="isPaused" :cancelled="isCancelled" @analysis-cancelled="onAnalysisCancelled" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Swot from "@/components/SwotPage/Swot.vue";

export default defineComponent({
  name: "SwotPage",
  components: {
    Swot,
  },
  data() {
    return {
      showSwot: false, // Controls whether the Swot component is shown
      company: "", // Stores the entered company
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
      this.showSwot = true; // Show the Swot component
      this.isPaused = false;
      this.isCancelled = false;
    },
    resetWorkflow() {
      this.showSwot = false; // Reset the workflow
      this.company = ""; // Clear the company input
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
    company(newValue) {
      this.inputEmpty = newValue.trim() === "";
    },
  },
});
</script>

<style scoped>
.swot-page {
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

.company-input-container {
  margin-top: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.company-input {
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
  color: #4a5568;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #e2e8f0;
  border-color: #cbd5e0;
}

.swot-container {
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
  .swot-page {
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

  .company-input-container {
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
</style> 