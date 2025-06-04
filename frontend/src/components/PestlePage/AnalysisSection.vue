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
          <TypeWriter v-if="description" :text="description" :speed="300" @complete="onDescriptionComplete" />

          <div v-if="sections && sections.length > 0 && descriptionComplete">
            <div v-for="(section, sectionIndex) in sections" :key="`section-${sectionIndex}`" class="content-section">
              <TypeWriter v-if="shouldShowSectionHeading(sectionIndex)" :text="section.heading" :speed="200" tag="h3"
                @complete="onSectionHeadingComplete(sectionIndex)" />
              <ul class="analysis-list"
                v-if="section.items && section.items.length > 0 && completedSectionHeadings[sectionIndex]">
                <li v-for="(item, itemIndex) in section.items" :key="`item-${sectionIndex}-${itemIndex}`"
                  class="analysis-item" v-show="shouldShowItem(sectionIndex, itemIndex)">
                  <span class="bullet">•</span>
                  <div class="item-content">
                    <TypeWriter v-if="shouldShowItem(sectionIndex, itemIndex)" :text="getItemText(item)" :speed="200"
                      :delay="0" @complete="onItemComplete(sectionIndex, itemIndex)" />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>

<script>
import TypeWriter from '../TypeWriter.vue';

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
    sections: {
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
      completedSectionHeadings: {}, // Tracks completion of section headings
      currentSectionIndex: -1, // Tracks the current section being processed
      currentItemIndices: {}, // Tracks current item index for each section {sectionIndex: itemIndex}
      allSectionsComplete: false
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
      if (this.sections.length > 0) {
        this.currentSectionIndex = 0; // Start with the first section
      } else {
        this.allSectionsComplete = true;
        this.$emit('section-complete'); // Emit if no sections
      }
    },
    onSectionHeadingComplete(sectionIndex) {
      this.completedSectionHeadings[sectionIndex] = true;
      if (this.sections[sectionIndex] && this.sections[sectionIndex].items && this.sections[sectionIndex].items.length > 0) {
        this.currentItemIndices[sectionIndex] = 0; // Start with the first item of this section
      } else {
        // If section has no items, move to next section or complete
        if (sectionIndex < this.sections.length - 1) {
          this.currentSectionIndex = sectionIndex + 1;
        } else {
          this.allSectionsComplete = true;
          this.$emit('section-complete');
        }
      }
    },
    onItemComplete(sectionIndex, itemIndex) {
      const section = this.sections[sectionIndex];
      if (itemIndex < section.items.length - 1) {
        this.currentItemIndices[sectionIndex] = itemIndex + 1;
      } else {
        // Current section's items are complete, move to next section
        if (sectionIndex < this.sections.length - 1) {
          this.currentSectionIndex = sectionIndex + 1;
        } else {
          this.allSectionsComplete = true;
          this.$emit('section-complete');
        }
      }
    },
    shouldShowSectionHeading(sectionIndex) {
      return sectionIndex <= this.currentSectionIndex;
    },
    shouldShowItem(sectionIndex, itemIndex) {
      // Ensure the section heading itself has completed typing
      if (!this.completedSectionHeadings[sectionIndex]) {
        return false;
      }

      // If the section is before the current processing section, all its items should be visible
      if (sectionIndex < this.currentSectionIndex) {
        return true;
      }

      // If it's the current section being processed
      if (sectionIndex === this.currentSectionIndex) {
        // Show item if its index is less than or equal to the current item being typed in this section
        return itemIndex <= (this.currentItemIndices[sectionIndex] !== undefined ? this.currentItemIndices[sectionIndex] : -1);
      }

      // If sectionIndex > this.currentSectionIndex, it means this section's items haven't started processing yet.
      return false;
    },
    getItemText(item) {
      return item.highlight ? `${item.highlight}: ${item.text}` : item.text;
    },
    resetState() {
      this.descriptionComplete = false;
      this.completedSectionHeadings = {};
      this.currentSectionIndex = -1;
      this.currentItemIndices = {};
      this.allSectionsComplete = false;
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
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: #f8fafc;
  cursor: pointer;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.3s ease;
}

.section-header:hover {
  background: #f1f5f9;
}

.section-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.globe-icon {
  background: #f0fdf4;
  color: #15803d;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

.section-content {
  padding: 2rem;
}

.info-box {
  background: #f0f9ff;
  border-radius: 10px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  animation: slideIn 0.5s ease;
}

.info-icon {
  width: 24px;
  height: 24px;
  color: #0369a1;
  flex-shrink: 0;
}

.info-box span {
  color: #0c4a6e;
  font-size: 0.95rem;
  line-height: 1.6;
}

.action-toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-button:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.tool-icon {
  width: 18px;
  height: 18px;
}

.analysis-content {
  color: #334155;
  font-size: 1rem;
  line-height: 1.7;
}

.analysis-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 1.5rem 0 1rem;
}

.analysis-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.analysis-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.analysis-item:hover {
  background: #f8fafc;
}

.bullet {
  color: #94a3b8;
  font-size: 1.2rem;
  line-height: 1;
}

.item-content {
  flex: 1;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-indicator p {
  color: #64748b;
  font-size: 0.95rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .section-header {
    padding: 1rem;
  }

  .section-content {
    padding: 1.25rem;
  }

  .section-icon {
    width: 32px;
    height: 32px;
  }

  .section-title h2 {
    font-size: 1.1rem;
  }

  .info-box {
    padding: 1rem;
  }

  .tool-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>