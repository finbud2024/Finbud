<template>
  <details class="section analysis-section" open="">
    <summary class="section-header">
      <div class="section-title-container">
        <div class="section-icon" :class="iconClass">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path :d="iconPath"></path>
          </svg>
        </div>
        <div class="section-title">
          <div class="status-indicator"></div>
          <h2>{{ translatedTitle }}</h2>
        </div>
      </div>
      <svg class="dropdown-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </summary>
    <div class="section-content">
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>Đang tải phân tích...</p>
      </div>
      <div v-else>
        <div class="info-box">
          <svg class="info-icon" viewBox="0 0 24 24" fill="currentColor">
            <path :d="infoIconPath"></path>
          </svg>
          <span>{{ infoText }}</span>
        </div>
        <div class="action-toolbar">
          <button class="tool-button" @click="onRegenerate">
            <svg class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
              </path>
            </svg>
            Tạo lại
          </button>
          <button class="tool-button" @click="onCopy">
            <svg class="tool-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z">
              </path>
            </svg>
            Sao chép
          </button>
        </div>
        <div class="analysis-content">
          <TypeWriter v-if="description" :text="description" :speed="200" @complete="onDescriptionComplete" />

          <div v-if="headings && headings.length > 0 && descriptionComplete">
            <TypeWriter v-for="(heading, index) in headings" :key="`heading-${index}`" :text="heading" :speed="200"
              :delay="index * 100" tag="h3" @complete="onHeadingComplete(index)"
              v-show="index <= completedHeadings.length" />
          </div>

          <ul class="analysis-list" v-if="items && items.length > 0 && headingsComplete">
            <li v-for="(item, index) in items" :key="`item-${index}`" class="analysis-item"
              v-show="shouldShowItem(index)">
              <span class="bullet">•</span>
              <div class="item-content">
                <TypeWriter v-if="shouldShowItem(index)" :text="getItemText(item)" :speed="200" :delay="0"
                  @complete="onItemComplete(index)" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </details>
</template>

<script>
import TypeWriter from './TypeWriter.vue';

export default {
  name: "AnalysisSection",
  components: {
    TypeWriter
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    iconClass: {
      type: String,
      default: "globe-icon",
    },
    iconPath: {
      type: String,
      required: true,
    },
    infoIconPath: {
      type: String,
      required: true,
    },
    infoText: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    headings: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      descriptionComplete: false,
      completedHeadings: [],
      completedItems: [],
      headingsComplete: false,
      currentItemIndex: -1
    };
  },
  computed: {
    translatedTitle() {
      const translations = {
        "Political Analysis": "Political - Chính trị",
        "Economic Analysis": "Economic - Kinh tế",
        "Social Analysis": "Social - Xã hội",
        "Technological Analysis": "Technological - Công nghệ",
        "Legal Analysis": "Legal - Pháp lý",
        "Environmental Analysis": "Environmental - Môi trường",
      };
      return translations[this.title] || this.title;
    },
  },
  methods: {
    onRegenerate() {
      this.resetState();
      this.$emit("regenerate");
    },
    onCopy() {
      this.$emit("copy");
    },
    onDescriptionComplete() {
      this.descriptionComplete = true;
    },
    onHeadingComplete(index) {
      this.completedHeadings.push(index);
      if (this.completedHeadings.length === this.headings.length) {
        this.headingsComplete = true;
        if (this.items.length > 0) {
          this.currentItemIndex = 0;
        }
      }
    },
    onItemComplete(index) {
      this.completedItems.push(index);
      if (index < this.items.length - 1) {
        this.currentItemIndex = index + 1;
      } else if (index === this.items.length - 1) {
        this.$emit('section-complete');
      }
    },
    shouldShowItem(index) {
      return index <= this.currentItemIndex;
    },
    getItemText(item) {
      return item.highlight ? `${item.highlight}: ${item.text}` : item.text;
    },
    resetState() {
      this.descriptionComplete = false;
      this.completedHeadings = [];
      this.completedItems = [];
      this.headingsComplete = false;
      this.currentItemIndex = -1;
    }
  },
  watch: {
    loading(newVal) {
      if (newVal) {
        this.resetState();
      }
    }
  }
};
</script>

<style scoped>
.section {
  margin-bottom: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.section-title-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  padding: 8px;
  border-radius: 9999px;
}

.user-icon {
  background-color: rgb(243, 244, 246);
}

.globe-icon {
  background-color: rgb(220, 252, 231);
  color: rgb(22, 163, 74);
}

.section-title {
  display: flex;
  align-items: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background-color: rgb(34, 197, 94);
  border-radius: 9999px;
  margin-right: 8px;
}

.section-title h2 {
  font-size: 20px;
  font-weight: 600;
}

.dropdown-arrow {
  width: 20px;
  height: 20px;
  transform: rotate(0);
  transition: transform 0.2s;
}

details[open] .dropdown-arrow {
  transform: rotate(180deg);
}

.section-content {
  margin-top: 24px;
  margin-left: 40px;
}

/* Form Elements */
.form-group {
  margin-bottom: 16px;
}

.required {
  color: rgb(239, 68, 68);
}

.form-input {
  width: 100%;
  padding: 12px;
  background-color: rgb(243, 244, 246);
  border-radius: 24px;
  transition: all 0.15s;
}

.form-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgb(183, 169, 255);
}

/* Info Box */
.info-box {
  background-color: rgb(239, 246, 255);
  border-radius: 24px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  width: 24px;
  height: 24px;
  color: rgb(59, 130, 246);
}

.info-box span {
  color: rgb(29, 78, 216);
}

/* Action Toolbar */
.action-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: rgb(243, 244, 246);
  padding: 8px 12px;
  border-radius: 18px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.tool-button:hover {
  background-color: rgb(229, 231, 235);
}

.tool-icon {
  width: 16px;
  height: 16px;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  /* Stack spinner and text vertically */
  justify-content: center;
  align-items: center;
  min-height: 100px;
  color: #6b7280;
  font-style: italic;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4f46e5;
  /* Use a theme color */
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
  /* Add space between spinner and text */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Analysis Content */
.analysis-section {
  padding-bottom: 32px;
  border-bottom: 1px solid #e5e7eb;
}

.analysis-content {
  color: rgb(55, 65, 81);
  font-size: 0.9rem;
  line-height: 1.4;
}

.analysis-content p {
  margin-bottom: 16px;
}

.analysis-content h3 {
  font-weight: 600;
  font-size: 1.1rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1rem;
}

.analysis-item {
  display: flex;
  align-items: flex-start;
  animation: fadeIn 0.3s ease-out;
}

.bullet {
  color: rgb(156, 163, 175);
  margin-right: 8px;
  line-height: 1.4;
}

.highlight {
  font-weight: 600;
  margin-right: 4px;
}

.icon {
  width: 20px;
  height: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>