<!--Agent-->

<template>
  <div class="pestle-page">
    <!-- Title -->
    <h1 class="title">Phân tích PESTLE</h1>

    <!-- Text content, hidden after clicking Continue -->
    <div v-if="!showPestle" class="text-content">
      <p class="description">
        Quy trình AI này hướng dẫn bạn thực hiện phân tích PESTLE chi tiết, giúp bạn đánh giá các yếu tố chính trị, kinh
        tế, xã hội, công nghệ, pháp lý và môi trường ảnh hưởng đến ngành của bạn. Bằng cách cung cấp cái nhìn sâu sắc về
        sáu lĩnh vực quan trọng này, công cụ hỗ trợ đưa ra các quyết định chiến lược kinh doanh dựa trên dữ liệu.
      </p>

      <h2 class="subtitle">Cách sử dụng</h2>
      <p class="description">
        Nhập ngành: Bắt đầu bằng cách nhập ngành mà bạn muốn phân tích.
      </p>

      <h2 class="subtitle">Khi nào nên sử dụng</h2>
      <p class="description">
        Công cụ này lý tưởng cho các nhà chiến lược kinh doanh, nhà phân tích thị trường và người ra quyết định cần hiểu
        rõ các
        yếu tố bên ngoài ảnh hưởng đến ngành của họ. Đặc biệt hữu ích trong quá trình lập kế hoạch chiến lược, phân tích
        gia nhập thị trường,
        và đánh giá rủi ro.
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
      <button @click="resetWorkflow" class="back-button">Quay lại</button>
      <Pestle :industry="industry" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Pestle from "@/components/Pestle/Pestle.vue";

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
    };
  },
  methods: {
    startWorkflow() {
      if (this.inputEmpty) {
        return;
      }
      this.showPestle = true; // Show the Pestle component
    },
    resetWorkflow() {
      this.showPestle = false; // Reset the workflow
      this.industry = ""; // Clear the industry input
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
  font-family: Arial, sans-serif;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.text-content {
  margin-bottom: 2rem;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
}

.description {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.industry-input-container {
  margin-top: 2rem;
}

.industry-input {
  margin-top: 2rem;
  align-items: center;
}

.label {
  font-size: 1rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.required {
  color: red;
}

.input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.start-button {
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
}

.start-button:hover {
  background-color: #0056b3;
}

.start-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pestle-container {
  margin-top: 2rem;
}

.back-button {
  margin-top: 1rem;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #000000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>