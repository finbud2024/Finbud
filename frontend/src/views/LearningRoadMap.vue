<template>
  <div class="course-details-container" id="element-to-convert">
    <!-- Left Column: Course Topics -->
    <div class="course-topics-panel">
      <h2>Course Topics</h2>

      <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="topic-section">
        <div class="section-header" @click="toggleSection(sectionIndex)">
          <i :class="section.collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down'
            "></i>
          <span class="section-title">{{ section.title }}</span>
        </div>

        <div v-show="!section.collapsed" class="section-content">
          <!-- <div v-for="(topic, topicIndex) in section.topics" :key="topic.id" class="topic-item"
            @click="toggleTopic(sectionIndex, topicIndex)">
            <i :class="topic.collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down'
              "></i>
            <div class="topic-title">{{ topic.title }}</div>
            <button class="delete-btn" @click="deleteTopic(sectionIndex, topicIndex)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div> -->

          <div v-for="(topic, topicIndex) in section.topics" :key="topic.id">
            <!-- 1) Topic header (always visible) -->
            <div class="topic-item" @click="toggleTopic(sectionIndex, topicIndex)">
              <i :class="topic.collapsed
                ? 'fas fa-chevron-right'
                : 'fas fa-chevron-down'"></i>
              <span class="topic-title">{{ topic.title }}</span>
              <button class="delete-btn" @click.stop="deleteTopic(sectionIndex, topicIndex)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>

            <!-- 2) Topic content (visible only when NOT collapsed) -->
            <div class="topic-content-container" v-show="!topic.collapsed">
              <div v-if="videoResults[`${sectionIndex}-${topicIndex}`]?.length" class="video-results-container">
                <div v-for="video in videoResults[`${sectionIndex}-${topicIndex}`]" :key="video.url" class="video-card">
                  <a :href="video.url" target="_blank" rel="noopener">
                    ▶ {{ video.title }}
                  </a>
                </div>
              </div>
              <div v-else>
                <p>Loading video for “{{ topic.title }}”…</p>
              </div>
            </div>
          </div>


          <button class="add-topic-btn" @click="addTopic(sectionIndex)">
            <i class="fas fa-plus"></i> Add topic
          </button>
        </div>
      </div>

      <button class="add-section-btn" @click="addSection">
        <i class="fas fa-plus"></i> Add section
      </button>
    </div>

    <!-- Right Column: Course Details -->
    <div class="course-details-panel">
      <div class="course-image-card">
        <img :src="require('@/assets/courses/course-01.jpg')" alt="Students learning" class="course-image" />
      </div>

      <div class="course-info">
        <h2>Course Details</h2>

        <div class="info-item">
          <span class="info-label">Duration:</span>
          <span class="info-value">{{ courseDetails.duration }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Number of Lectures:</span>
          <span class="info-value">{{ courseDetails.lectures }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Skill Level:</span>
          <span class="info-value">{{ courseDetails.skillLevel }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Language:</span>
          <span class="info-value">{{ courseDetails.language }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Study Plan:</span>
          <span class="info-value">{{ courseDetails.studyPlan }}</span>
        </div>

        <div class="info-item">
          <span class="info-label">Deadline:</span>
          <span class="info-value">{{ courseDetails.deadline }}</span>
        </div>

        <button class="save-btn" @click="saveAndCollectMaterials">
          Save & Collect Materials
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { searchBraveVideos } from "@/services/videoSearch.js";
import html2pdf from "html2pdf.js";

const route = useRoute();
const router = useRouter();

// Initialize reactive refs
const sections = ref([]);
const courseDetails = ref({
  duration: "Not specified",
  lectures: "0 modules",
  skillLevel: "Beginner",
  language: "English",
  studyPlan: "Not specified",
  deadline: "4 weeks from today",
});

// Function to process roadmap data
const processRoadmapData = () => {
  console.log("Processing roadmap data");
  const roadmapData = history.state?.roadmapData;

  if (roadmapData) {
    console.log("Found roadmap data:", roadmapData);

    // Process the modules structure with proper null checking
    // Adapting to the actual data structure (title and subtopics)
    if (roadmapData.modules && Array.isArray(roadmapData.modules)) {
      sections.value = roadmapData.modules.map((module, index) => {
        console.log("Module:", module.topics);
        return {
          title: module.title || `Section ${index + 1}`,
          collapsed: false,
          topics:
            module.topics && Array.isArray(module.topics)
              ? module.topics.map((topic, topicIndex) => ({
                id: index * 100 + topicIndex,
                title: topic,
                collapsed: true,
              }))
              : [],
        };
      });

      console.log("Sections:", sections.value);
    } else {
      // If no modules, create a default section
      sections.value = [
        {
          title: "Generated Content",
          collapsed: false,
          topics: [{ id: 1, title: "No specific topics found" }],
        },
      ];
      console.warn("No modules array found in roadmap data");
    }

    // Update course details with safe fallbacks, matching actual data structure
    courseDetails.value = {
      duration: roadmapData.duration || "Not specified",
      lectures: `${roadmapData.modules?.length || 0} modules`,
      skillLevel: roadmapData.level || "Beginner",
      language: "English",
      studyPlan: `${roadmapData.days_per_week || 0} days/week, ${roadmapData.time_per_day || "Not specified"
        }`,
      deadline: "4 weeks from today",
    };
  } else {
    console.warn("No roadmap data found in history state");
    // Set default empty sections
    sections.value = [];
  }
};

const doVideoSearch = async () => {
  const resp = await searchVideos('Vue tutorial', 1);
  console.log(resp.results[0]);
};

/// Store an array of videos per topic:
const videoResults = ref({});

// How many videos to fetch per topic (we’ll keep this at 1 for now)
const VIDEO_COUNT = 1;

// Process data on initial mount
onMounted(() => {
  processRoadmapData();
});

// Watch for route changes to handle navigation to the same route
watch(
  () => route.fullPath,
  () => {
    console.log("Route changed, reprocessing data");
    processRoadmapData();
  }
);

// Toggle section collapse/expand
const toggleSection = (sectionIndex) => {
  sections.value[sectionIndex].collapsed =
    !sections.value[sectionIndex].collapsed;
};

// Add a new topic to a section
const addTopic = (sectionIndex) => {
  const newId =
    Math.max(0, ...sections.value.flatMap((s) => s.topics.map((t) => t.id))) +
    1;
  sections.value[sectionIndex].topics.push({
    id: newId,
    title: `New Topic ${newId}`,
    collapsed: true,
  });
};

// Toggle topic collapse/expand
const toggleTopic = async (sectionIndex, topicIndex) => {
  const topic = sections.value[sectionIndex].topics[topicIndex];
  topic.collapsed = !topic.collapsed;

  // Only fetch when opening, and if we haven’t fetched yet:
  if (!topic.collapsed) {
    const key = `${sectionIndex}-${topicIndex}`;
    if (!videoResults.value[key]) {
      try {
        const resp = await searchBraveVideos(topic.title, VIDEO_COUNT);
        // Always store as an array, even if count = 1
        videoResults.value[key] = resp.results ?? [];
      } catch (err) {
        console.error('Video fetch error for', topic.title, err);
        videoResults.value[key] = [];
      }
    }
  }
};

// Delete a topic from a section
const deleteTopic = (sectionIndex, topicIndex) => {
  sections.value[sectionIndex].topics.splice(topicIndex, 1);
};

// Add a new section
const addSection = () => {
  sections.value.push({
    title: `New Section ${sections.value.length + 1}`,
    collapsed: false,
    topics: [],
  });
};

// Save and collect materials
const saveAndCollectMaterials = () => {
  const element = document.getElementById("element-to-convert");
  // Measure the element on screen
  const { width, height } = element.getBoundingClientRect();

  // Decide orientation based on aspect ratio
  const orientation = width > height ? "landscape" : "portrait";

  html2pdf()
    .set({
      margin:       0,
      filename:     "generated-pdf.pdf",
      html2canvas:  { scale: 2 },        // bump resolution if you like
      jsPDF: {
        unit:        "px",
        format:      [width, height],     // match the element’s dimensions
        orientation,                      // "portrait" or "landscape"
      },
    })
    .from(element)
    .save();
};

</script>

<style scoped>
.course-details-container {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: Arial, sans-serif;
}

/* Left Column Styles */
.course-topics-panel {
  flex: 2;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.topic-section {
  margin-bottom: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #e9ecef;
  cursor: pointer;
}

.section-header i {
  margin-right: 0.5rem;
  font-size: 0.8rem;
}

.section-title {
  font-weight: bold;
  font-size: 1rem;
}

.section-content {
  padding: 1rem;
  background-color: white;
}

.topic-content-container {
  padding: 0.75rem 1rem;
}

.topic-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: white;
}

.topic-title {
  padding-left: 0.75rem;
  flex-grow: 1;
}

.video-results-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  /* optional: hide scrollbar in some browsers */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;     /* Firefox */
}
.video-results-container::-webkit-scrollbar {
  display: none;             /* Chrome, Safari, Opera */
}

.video-card {
  flex: 0 0 auto;
  min-width: 200px; 
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.video-card a {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
}
.video-card a:hover {
  text-decoration: underline;
}

.delete-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.25rem;
}

.delete-btn:hover {
  color: #bd2130;
}

.add-topic-btn,
.add-section-btn {
  background-color: #f8f9fa;
  border: 1px dashed #ced4da;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  width: 100%;
  text-align: left;
  margin-top: 0.5rem;
  cursor: pointer;
  color: #495057;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.add-topic-btn i,
.add-section-btn i {
  margin-right: 0.5rem;
}

.add-topic-btn:hover,
.add-section-btn:hover {
  background-color: #e9ecef;
}

.add-section-btn {
  margin-top: 1.5rem;
}

/* Right Column Styles */
.course-details-panel {
  flex: 1;
  height: fit-content;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  width: 1/3;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.course-image-card {
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 100%;
  height: auto;
  display: block;
}

.course-info h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.info-item {
  display: flex;
  margin-bottom: 1rem;
}

.info-label {
  font-weight: bold;
  width: 40%;
  color: #555;
}

.info-value {
  color: #333;
}

.save-btn {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1.5rem;
  width: 100%;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background-color: #218838;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .course-details-container {
    flex-direction: column;
  }

  .course-topics-panel,
  .course-details-panel {
    width: 100%;
  }
}
</style>
