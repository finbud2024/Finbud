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
          <TypeWriter v-if="description" :text="description" :speed="300" :paused="paused" :cancelled="cancelled" @complete="onDescriptionComplete" />

          <div v-if="sections && sections.length > 0 && descriptionComplete">
            <div v-for="(section, sectionIndex) in sections" :key="`section-${sectionIndex}`" class="content-section">
              <TypeWriter v-if="shouldShowSectionHeading(sectionIndex)" :text="section.heading" :speed="200" tag="h3"
                :paused="paused" :cancelled="cancelled" @complete="onSectionHeadingComplete(sectionIndex)" />
              <ul class="analysis-list"
                v-if="section.items && section.items.length > 0 && completedSectionHeadings[sectionIndex]">
                <li v-for="(item, itemIndex) in section.items" :key="`item-${sectionIndex}-${itemIndex}`"
                  class="analysis-item" v-show="shouldShowItem(sectionIndex, itemIndex)">
                  <span class="bullet">•</span>
                  <div class="item-content">
                    <TypeWriter v-if="shouldShowItem(sectionIndex, itemIndex)" :text="getItemText(item)" :speed="200"
                      :delay="0" :paused="paused" :cancelled="cancelled" @complete="onItemComplete(sectionIndex, itemIndex)" />
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
    paused: {
      type: Boolean,
      default: false,
    },
    cancelled: {
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
        "Phân tích Điểm mạnh": "Strengths - Điểm mạnh",
        "Phân tích Điểm yếu": "Weaknesses - Điểm yếu",
        "Phân tích Cơ hội": "Opportunities - Cơ hội",
        "Phân tích Thách thức": "Threats - Thách thức",
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
        return itemIndex <= (this.currentItemIndices[sectionIndex] || 0);
      }

      // If section hasn't been reached yet
      return false;
    },
    getItemText(item) {
      return item.highlight && item.highlight.trim() !== '' 
        ? `${item.highlight}: ${item.text}` 
        : item.text;
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
    description() {
      this.resetState();
    },
    sections() {
      if (this.descriptionComplete) {
        // Reset section-specific states if description is already complete
        this.completedSectionHeadings = {};
        this.currentSectionIndex = this.sections.length > 0 ? 0 : -1;
        this.currentItemIndices = {};
        this.allSectionsComplete = false;
      }
    }
  }
};
</script>

<style scoped>
.analysis-section {
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  list-style: none;
}

.section-header:hover {
  background-color: #f8fafc;
}

.section-title-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f0f9ff;
  color: #0ea5e9;
}

.icon {
  width: 24px;
  height: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.section-title h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.dropdown-arrow {
  width: 20px;
  height: 20px;
  color: #6b7280;
  transition: transform 0.3s ease;
}

.section[open] .dropdown-arrow {
  transform: rotate(180deg);
}

.section-content {
  padding: 0 2rem 2rem 2rem;
  background: #fafafa;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.info-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  color: #0c4a6e;
  font-size: 0.875rem;
}

.info-icon {
  width: 20px;
  height: 20px;
  color: #0ea5e9;
  flex-shrink: 0;
}

.action-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.tool-icon {
  width: 16px;
  height: 16px;
}

.analysis-content {
  line-height: 1.6;
  color: #374151;
}

.content-section {
  margin-bottom: 2rem;
}

.content-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.analysis-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.analysis-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.bullet {
  color: #3b82f6;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.5;
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .section-header {
    padding: 1rem;
  }

  .section-content {
    padding: 0 1rem 1rem 1rem;
  }

  .section-title h2 {
    font-size: 1.125rem;
  }

  .action-toolbar {
    flex-direction: column;
    gap: 0.5rem;
  }

  .tool-button {
    justify-content: center;
  }
}
</style> 