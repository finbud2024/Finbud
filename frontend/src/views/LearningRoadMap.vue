<template>
  <div class="course-details-container" id="element-to-convert">
    <!-- Left Column: Course Topics -->
    <div class="course-topics-panel">
      <h2>Course Topics</h2>

      <div v-for="(section, sIdx) in sections" :key="sIdx">
        <div class="section-header" @click="toggleSection(sIdx)">
          <i :class="section.collapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-down'
            "></i>
          <span class="section-title">{{ section.title }}</span>
        </div>
        <div v-show="!section.collapsed">
          <div v-for="(topic, tIdx) in section.topics" :key="topic.id">
            <!-- Header -->
            <div class="topic-item" @click="toggleTopic(sIdx, tIdx)">
              <i :class="topic.collapsed
                ? 'fas fa-chevron-right'
                : 'fas fa-chevron-down'"></i>
              <span class="topic-title">{{ topic.title }}</span>
              <!-- DELETE BUTTON -->
              <button class="icon-btn delete-btn" @click.stop="deleteTopic(sIdx, tIdx)" title="Delete topic">
                <i class="fas fa-trash-alt"></i>
              </button>

            </div>
            <!-- Expanded Panel -->
            <div class="topic-content-container" v-show="!topic.collapsed">


              <!-- 1) Definition Section -->
              <div class="definition-block" v-if="topicDefinitions[keyFor(sIdx, tIdx)]">
                <h3>Definition &amp; Key Lessons</h3>
                <div v-html="topicDefinitions[keyFor(sIdx,tIdx)]"></div>
              </div>

              <!-- 2) Video Section -->
              <!-- 2.1) Searching -->
              <p v-if="loadingVideos[keyFor(sIdx, tIdx)]" class="loading-videos">
                🔍 Searching for “{{ topic.title }}”…
              </p>
              <!-- 2.2) Results -->
              <div v-else-if="videoResults[keyFor(sIdx, tIdx)]?.length" class="video-results-container">
                <div v-for="video in videoResults[keyFor(sIdx, tIdx)]" :key="video.link" class="video-card">
                  <a :href="video.link" target="_blank" rel="noopener">
                    <img :src="video.imageUrl" :alt="video.title" class="video-thumb" />
                  </a>
                  <div class="video-caption">
                    <a :href="video.link" target="_blank">{{ video.title }}</a>
                  </div>
                </div>
              </div>

              <!-- 2.3) No results -->
              <p v-else class="no-videos">
                No videos found for “{{ topic.title }}.”
              </p>
            </div>




          </div>
        </div>
        <button class="add-topic-btn" @click="addTopic(sIdx)">
          <i class="fas fa-plus"></i> Add Topic
        </button>
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

/**
 * @typedef {{ 
 *   id: number;
 *   title: string;
 *   collapsed: boolean;
 * }} Topic
 *
 * @typedef {{ 
 *   title: string;
 *   collapsed: boolean;
 *   topics: Topic[];
 * }} Section
 */

import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import html2pdf from "html2pdf.js";
import { getVideos } from '@/services/serperService.js'
import { gptServices } from '@/services/gptServices.js'
import axios from "axios";

const route = useRoute();
const router = useRouter();
const loadingVideos = ref({});


// Initialize reactive refs
/** @type {import('vue').Ref<Section[]>} */
const sections = ref([]);
const courseDetails = ref({
  duration: "Not specified",
  lectures: "0 modules",
  skillLevel: "Beginner",
  language: "English",
  studyPlan: "Not specified",
  deadline: "4 weeks from today",
});

const VIDEO_COUNT = 1
const videoResults = ref({})
const topicDefinitions = ref({})

function keyFor(s, t) { return `${s}-${t}` }

// Function to process roadmap data
const processRoadmapData = () => {
  console.log("Processing roadmap data");
  const roadmapData = history.state?.roadmapData;

  if (roadmapData?.modules?.length) {
    console.log("Found roadmap data:", roadmapData);

    // Process the modules structure with proper null checking
    // Adapting to the actual data structure (title and subtopics)
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
    sections.value = [
      {
        title: "Generated Content",
        collapsed: false,
        topics: [{ id: 1, collapsed: true, title: "No specific topics found" }],
      },
    ];
    console.warn("No modules array found in roadmap data");
  }
};

/**
 * @param {string} rawText 
 * @param {number} count 
 * @returns {string[]} 
 */
function parseDefs(rawText, count) {
  const regex = /(?:^|\n)(\d+)\.\s*([\s\S]*?)(?=(?:\n\d+\.|$))/g;
  const defs = [];
  let match;

  while ((match = regex.exec(rawText)) !== null) {
    const idx = Number(match[1]) - 1;
    const text = match[2].trim();
    defs[idx] = text;
  }

  // Ensure we return exactly `count` entries (fill missing with empty string)
  return Array.from({ length: count }, (_, i) => defs[i] || "");
}

// Process data on initial mount
onMounted(async () => {
  processRoadmapData();

  // Attempt to fetch all at once, but logistically unfeasible, since users can add topics at any time
  //   // 1) gather titles
  //   const allTitles = sections.value.flatMap((sec) =>
  //     sec.topics.map((t) => t.title.trim())
  //   );

  //   // 2) fetch definitions in one go
  //   const defsPrompt = `
  // For each of the following topics, provide:
  //   1) A one-sentence definition.
  //   2) Three key beginner lessons.

  // Topics:
  // ${allTitles.map((t, i) => `${i + 1}. ${t}`).join("\n")}
  // `;

  //   const defsResponse = await gptServices([
  //     { role: "user", content: defsPrompt }
  //   ]);
  //   const rawDefs = await gptServices([{ role: "user", content: defsPrompt }]);
  //   const parsedDefs = parseDefs(rawDefs, allTitles.length);

  //   const videoLists = await Promise.all(
  //     allTitles.map((t) => getVideos(t, VIDEO_COUNT))
  //   );

  //   let idx = 0;
  //   sections.value.forEach((sec, sIdx) => {
  //     sec.topics.forEach((t, tIdx) => {
  //       const key = `${sIdx}-${tIdx}`;
  //       topicDefinitions.value[key] = parsedDefs[idx];
  //       videoResults.value[key] = videoLists[idx];
  //       idx++;
  //     });
  //   });
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
  const topic = sections.value[sectionIndex].topics[topicIndex]

  // Uncomment these so that the searches only happen when some topic was found
  const title = topic.title?.trim();
  topic.collapsed = !topic.collapsed;

  if (!title || title === "No specific topics found") return;


  const key = keyFor(sectionIndex, topicIndex)

  if (!topic.collapsed) {
    // 1) Fetch video (as before)
    if (!videoResults.value[key]) {
      loadingVideos.value[key] = true;
      const vids = await getVideos(topic.title, VIDEO_COUNT)
      videoResults.value[key] = vids
      loadingVideos.value[key] = false;
    }

    // 2) Fetch definition only once
    if (!topicDefinitions.value[key]) {
      topicDefinitions.value[key] = 'Loading definition…'
      try {
        const definition = await gptServices([{
          role: 'user',
          content: `
Please give me a very concise definition of "${topic.title}", and then list 3 basic lessons or things a beginner should know.  
**Return the entire response as a single HTML unordered list**, where:

- the first <li> is the one-sentence definition  
- the next three <li>​s are each lesson  

Do **not** wrap it in any other tags or prose—just the <ul> with four <li> elements. _Do not_ include any markdown or code fences.

Use HTML tags—**do not** use Markdown.  
For example:
<ul>
  <li><strong>Definition text…</strong></li>
  <li>Lesson 1</li>
  <li>Lesson 2</li>
  <li>Lesson 3</li>
</ul>
And only those bullet points—nothing else.  
`
        }])
        topicDefinitions.value[key] = definition.trim()
      }
      catch (err) {
        console.error('Error fetching definition:', err)
        topicDefinitions.value[key] = 'Definition unavailable.'
      }
    }
  }
}


// Delete a topic from a section
const deleteTopic = (sectionIndex, topicIndex) => {
  sections.value[sectionIndex].topics.splice(topicIndex, 1);
};

// Add a new section
const addSection = () => {
  sections.value.push({
    title: `New Section ${sections.value.length + 1}`,
    collapsed: true,
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
      margin: 0,
      filename: "generated-pdf.pdf",
      html2canvas: { scale: 2 },        // bump resolution if you like
      jsPDF: {
        unit: "px",
        format: [width, height],     // match the element’s dimensions
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

.definition-block {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-left: 4px solid #007bff;
}

.definition-block h3 {
  margin: 0 0 0.5rem 0;
}

.definition-block p {
  margin: 0;
}

.video-results-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.video-card {
  flex: 0 0 auto;
  width: 200px;
  /* or whatever fixed/card width you like */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-thumb {
  width: 100%;
  height: 120px;
  /* adjust to your desired thumbnail height */
  object-fit: cover;
  border-radius: 4px;
}

.video-caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
  color: #333;
  line-height: 1.2;
}

.loading-videos {
  font-style: italic;
  color: #555;
  padding: 0.75rem 1rem;
}

.no-videos {
  font-style: italic;
  color: #666;
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
