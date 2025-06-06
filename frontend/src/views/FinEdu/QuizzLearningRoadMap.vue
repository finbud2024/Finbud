<template>
  <div class="learning-roadmap-container">
    <!-- Enhanced Header -->
    <header class="roadmap-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="main-title">
            <font-awesome-icon icon="fa-solid fa-route" class="title-icon" />
            Personalized Learning Roadmap
          </h1>
          <p class="subtitle">Your customized path to financial mastery</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-personalize" @click="showPersonalizeModal = true">
            <font-awesome-icon icon="fa-solid fa-magic" />
            Personalize Roadmap
              </button>
          <button class="btn btn-export" @click="exportToPDF">
            <font-awesome-icon icon="fa-solid fa-download" />
            Export PDF
          </button>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="progress-section">
        <div class="progress-info">
          <span class="progress-text">Overall Progress</span>
          <span class="progress-percentage">{{ overallProgress }}%</span>
            </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
        </div>
      </div>
    </header>

    <!-- Main Content Grid -->
    <div class="roadmap-content">
      <!-- Left Panel: Learning Path -->
      <div class="learning-path-panel">
        <div class="panel-header">
          <h2>
            <font-awesome-icon icon="fa-solid fa-map" />
            Learning Journey
          </h2>
          <div class="path-stats">
            <span class="stat">
              <font-awesome-icon icon="fa-solid fa-book" />
              {{ totalTopics }} Topics
            </span>
            <span class="stat">
              <font-awesome-icon icon="fa-solid fa-clock" />
              {{ estimatedTime }}
            </span>
          </div>
        </div>

        <!-- Learning Path Visualization -->
        <div class="learning-path">
          <div v-for="(section, sIdx) in sections" :key="sIdx" class="path-section">
            <div class="section-node" 
                 :class="{ completed: section.completed, active: section.active }"
                 @click="toggleSection(sIdx)">
              <div class="node-icon">
                <font-awesome-icon 
                  :icon="section.completed ? 'fa-solid fa-check' : 'fa-solid fa-book-open'" 
                />
              </div>
              <div class="node-content">
                <h3 class="section-title">{{ section.title }}</h3>
                <div class="section-meta">
                  <span class="topic-count">{{ section.topics.length }} topics</span>
                  <span class="duration">{{ section.estimatedDuration || '2-3 hours' }}</span>
                </div>
                <div class="section-progress">
                  <div class="progress-bar mini">
                    <div class="progress-fill" :style="{ width: getSectionProgress(section) + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ getSectionProgress(section) }}%</span>
                </div>
              </div>
              <div class="expand-icon">
                <font-awesome-icon 
                  :icon="section.collapsed ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-up'" 
                />
              </div>
              </div>

            <!-- Topics in Section -->
            <div v-show="!section.collapsed" class="topics-container">
              <div v-for="(topic, tIdx) in section.topics" :key="topic.id" class="topic-item">
                <div class="topic-header" @click="toggleTopic(sIdx, tIdx)">
                  <div class="topic-status">
                    <div class="status-indicator" 
                         :class="{ completed: topic.completed, 'in-progress': topic.inProgress }">
                      <font-awesome-icon 
                        :icon="topic.completed ? 'fa-solid fa-check' : 
                               topic.inProgress ? 'fa-solid fa-play' : 'fa-solid fa-circle'" 
                      />
                  </div>
                </div>
                  <div class="topic-content">
                    <h4 class="topic-title">{{ topic.title }}</h4>
                    <div class="topic-meta">
                      <span class="difficulty" :class="topic.difficulty || 'beginner'">
                        {{ topic.difficulty || 'Beginner' }}
                      </span>
                      <span class="duration">{{ topic.estimatedTime || '15-20 min' }}</span>
                    </div>
                  </div>
                  <div class="topic-actions">
                    <button class="btn-icon" @click.stop="startTopic(sIdx, tIdx)" 
                            v-if="!topic.completed">
                      <font-awesome-icon icon="fa-solid fa-play" />
                    </button>
                    <button class="btn-icon" @click.stop="deleteTopic(sIdx, tIdx)">
                      <font-awesome-icon icon="fa-solid fa-trash" />
                    </button>
                  </div>
              </div>

                <!-- Expanded Topic Content -->
                <div class="topic-content-panel" v-show="!topic.collapsed">
                  <!-- Learning Materials Tabs -->
                  <div class="materials-tabs">
                    <button 
                      v-for="tab in materialTabs" 
                      :key="tab.key"
                      :class="['tab-btn', { active: activeMaterialTab === tab.key }]"
                      @click="activeMaterialTab = tab.key"
                    >
                      <font-awesome-icon :icon="tab.icon" />
                      {{ tab.label }}
                    </button>
            </div>

                  <!-- Tab Content -->
                  <div class="tab-content">
                    <!-- Definition & Lessons -->
                    <div v-if="activeMaterialTab === 'definition'" class="definition-section">
                      <div v-if="loadingDefinitions[keyFor(sIdx, tIdx)]" class="loading-state">
                        <div class="spinner"></div>
                        <p>Generating personalized content...</p>
                      </div>
                      <div v-else-if="topicDefinitions[keyFor(sIdx, tIdx)]" class="definition-content">
                        <div v-html="topicDefinitions[keyFor(sIdx, tIdx)]"></div>
                        <div class="content-actions">
                          <button class="btn btn-outline" @click="regenerateDefinition(sIdx, tIdx)">
                            <font-awesome-icon icon="fa-solid fa-refresh" />
                            Regenerate
                          </button>
                        </div>
                      </div>
                      <div v-else class="empty-state">
                        <font-awesome-icon icon="fa-solid fa-book" />
                        <p>Click to generate learning content</p>
                        <button class="btn btn-primary" @click="generateDefinition(sIdx, tIdx)">
                          Generate Content
                        </button>
                      </div>
                    </div>

                    <!-- Video Resources -->
                    <div v-if="activeMaterialTab === 'videos'" class="videos-section">
                      <div v-if="loadingVideos[keyFor(sIdx, tIdx)]" class="loading-state">
                        <div class="spinner"></div>
                        <p>Finding best video resources...</p>
                      </div>
                      <div v-else-if="videoResults[keyFor(sIdx, tIdx)]?.length" class="video-grid">
                        <div v-for="video in videoResults[keyFor(sIdx, tIdx)]" :key="video.link" class="video-card">
                          <div class="video-thumbnail">
                            <img :src="video.imageUrl" :alt="video.title" />
                            <div class="play-overlay">
                              <font-awesome-icon icon="fa-solid fa-play" />
                            </div>
                          </div>
                          <div class="video-info">
                            <h5 class="video-title">{{ video.title }}</h5>
                            <a :href="video.link" target="_blank" class="video-link">
                              Watch Video
                              <font-awesome-icon icon="fa-solid fa-external-link-alt" />
                            </a>
                          </div>
                        </div>
                      </div>
                      <div v-else class="empty-state">
                        <font-awesome-icon icon="fa-solid fa-video" />
                        <p>No videos found</p>
                        <button class="btn btn-primary" @click="searchVideos(sIdx, tIdx)">
                          Search Videos
                        </button>
                      </div>
                    </div>

                    <!-- Practice Exercises -->
                    <div v-if="activeMaterialTab === 'practice'" class="practice-section">
                      <div class="practice-placeholder">
                        <font-awesome-icon icon="fa-solid fa-dumbbell" />
                        <h4>Practice Exercises</h4>
                        <p>Interactive exercises and quizzes will be available soon!</p>
                        <button class="btn btn-outline" disabled>
                          Coming Soon
                        </button>
                      </div>
                    </div>

                    <!-- Resources -->
                    <div v-if="activeMaterialTab === 'resources'" class="resources-section">
                      <div class="resources-placeholder">
                        <font-awesome-icon icon="fa-solid fa-link" />
                        <h4>Additional Resources</h4>
                        <p>Curated articles, tools, and references</p>
                        <button class="btn btn-outline" disabled>
                          Coming Soon
                        </button>
          </div>
        </div>
                  </div>
                </div>
              </div>

              <!-- Add Topic Button -->
        <button class="add-topic-btn" @click="addTopic(sIdx)">
                <font-awesome-icon icon="fa-solid fa-plus" />
                Add Custom Topic
        </button>
            </div>
      </div>

          <!-- Add Section Button -->
      <button class="add-section-btn" @click="addSection">
            <font-awesome-icon icon="fa-solid fa-plus" />
            Add Learning Module
      </button>
    </div>
      </div>

      <!-- Right Panel: Course Details & Study Plan -->
      <div class="details-panel">
        <!-- Course Overview Card -->
        <div class="overview-card">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-graduation-cap" />
              Course Overview
            </h3>
        </div>
          <div class="course-image">
            <img :src="require('@/assets/courses/course-01.jpg')" alt="Learning Path" />
            <div class="course-badge">{{ courseDetails.skillLevel }}</div>
        </div>
          <div class="course-details">
            <div class="detail-grid">
              <div class="detail-item">
                <font-awesome-icon icon="fa-solid fa-clock" class="detail-icon" />
                <div class="detail-content">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">{{ courseDetails.duration }}</span>
                </div>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="fa-solid fa-book" class="detail-icon" />
                <div class="detail-content">
                  <span class="detail-label">Modules</span>
                  <span class="detail-value">{{ courseDetails.lectures }}</span>
                </div>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="fa-solid fa-signal" class="detail-icon" />
                <div class="detail-content">
                  <span class="detail-label">Level</span>
                  <span class="detail-value">{{ courseDetails.skillLevel }}</span>
                </div>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="fa-solid fa-language" class="detail-icon" />
                <div class="detail-content">
                  <span class="detail-label">Language</span>
                  <span class="detail-value">{{ courseDetails.language }}</span>
                </div>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="fa-solid fa-calendar" class="detail-icon" />
                <div class="detail-content">
                  <span class="detail-label">Study Plan</span>
                  <span class="detail-value">{{ courseDetails.studyPlan }}</span>
                </div>
              </div>
              <div class="detail-item">
                <font-awesome-icon icon="fa-solid fa-flag-checkered" class="detail-icon" />
                <div class="detail-content">
                  <span class="detail-label">Target Date</span>
                  <span class="detail-value">{{ courseDetails.deadline }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Study Schedule Card -->
        <div class="schedule-card">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-calendar-alt" />
              Study Schedule
            </h3>
          </div>
          <div class="schedule-content">
            <div class="weekly-plan">
              <div v-for="day in weeklySchedule" :key="day.day" class="schedule-day">
                <div class="day-header">
                  <span class="day-name">{{ day.day }}</span>
                  <span class="day-duration">{{ day.duration }}</span>
                </div>
                <div class="day-topics">
                  <div v-for="topic in day.topics" :key="topic" class="schedule-topic">
                    {{ topic }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievement Card -->
        <div class="achievement-card">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-trophy" />
              Achievements
            </h3>
          </div>
          <div class="achievements-grid">
            <div v-for="achievement in achievements" :key="achievement.id" 
                 class="achievement-item" :class="{ unlocked: achievement.unlocked }">
              <div class="achievement-icon">
                <font-awesome-icon :icon="achievement.icon" />
              </div>
              <div class="achievement-info">
                <h4 class="achievement-title">{{ achievement.title }}</h4>
                <p class="achievement-desc">{{ achievement.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn btn-primary btn-large" @click="saveAndCollectMaterials">
            <font-awesome-icon icon="fa-solid fa-save" />
            Save Progress
          </button>
          <button class="btn btn-outline btn-large" @click="shareRoadmap">
            <font-awesome-icon icon="fa-solid fa-share" />
            Share Roadmap
          </button>
        </div>
      </div>
        </div>

    <!-- Personalize Modal -->
    <div v-if="showPersonalizeModal" class="modal-overlay" @click="closePersonalizeModal">
      <div class="personalize-modal" @click.stop>
        <div class="modal-header">
          <h3>
            <font-awesome-icon icon="fa-solid fa-magic" />
            Personalize Your Learning Path
          </h3>
          <button class="close-btn" @click="closePersonalizeModal">
            <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>
        <div class="modal-content">
          <div class="personalize-form">
            <div class="form-group">
              <label>Current Knowledge Level</label>
              <select v-model="personalizeData.level" class="form-control">
                <option value="beginner">Beginner - New to finance</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Experienced</option>
              </select>
            </div>
            <div class="form-group">
              <label>Learning Goals</label>
              <div class="checkbox-group">
                <label v-for="goal in learningGoals" :key="goal.key" class="checkbox-label">
                  <input type="checkbox" v-model="personalizeData.goals" :value="goal.key">
                  <span class="checkmark"></span>
                  {{ goal.label }}
                </label>
              </div>
            </div>
            <div class="form-group">
              <label>Time Commitment (hours per week)</label>
              <input type="range" v-model="personalizeData.timeCommitment" 
                     min="1" max="20" class="range-input">
              <span class="range-value">{{ personalizeData.timeCommitment }} hours/week</span>
            </div>
            <div class="form-group">
              <label>Preferred Learning Style</label>
              <select v-model="personalizeData.learningStyle" class="form-control">
                <option value="visual">Visual - Charts, diagrams, videos</option>
                <option value="auditory">Auditory - Podcasts, lectures</option>
                <option value="reading">Reading - Articles, books</option>
                <option value="kinesthetic">Hands-on - Simulations, practice</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline" @click="closePersonalizeModal">
            Cancel
          </button>
          <button class="btn btn-primary" @click="generatePersonalizedRoadmap" 
                  :disabled="generatingRoadmap">
            <font-awesome-icon v-if="generatingRoadmap" icon="fa-solid fa-spinner" spin />
            {{ generatingRoadmap ? 'Generating...' : 'Generate Roadmap' }}
          </button>
        </div>
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
 *   completed: boolean;
 *   inProgress: boolean;
 *   difficulty: string;
 *   estimatedTime: string;
 * }} Topic
 *
 * @typedef {{ 
 *   title: string;
 *   collapsed: boolean;
 *   completed: boolean;
 *   active: boolean;
 *   topics: Topic[];
 *   estimatedDuration: string;
 * }} Section
 */

import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import html2pdf from "html2pdf.js";
import { getVideos } from '@/services/serperService.js'
import { gptServices } from '@/services/gptServices.js'
import axios from "axios";

const route = useRoute();
const router = useRouter();

// Enhanced reactive refs
const sections = ref([]);
const loadingVideos = ref({});
const loadingDefinitions = ref({});
const videoResults = ref({});
const topicDefinitions = ref({});

// New reactive data for enhanced features
const showPersonalizeModal = ref(false);
const generatingRoadmap = ref(false);
const activeMaterialTab = ref('definition');

// Progress tracking
const overallProgress = computed(() => {
  if (sections.value.length === 0) return 0;
  const totalTopics = sections.value.reduce((sum, section) => sum + section.topics.length, 0);
  const completedTopics = sections.value.reduce((sum, section) => 
    sum + section.topics.filter(topic => topic.completed).length, 0);
  return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
});

const totalTopics = computed(() => 
  sections.value.reduce((sum, section) => sum + section.topics.length, 0)
);

const estimatedTime = computed(() => {
  const totalHours = sections.value.reduce((sum, section) => {
    const sectionHours = section.topics.length * 0.5; // Estimate 30 min per topic
    return sum + sectionHours;
  }, 0);
  return `${Math.round(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`;
});

// Course details with enhanced information
const courseDetails = ref({
  duration: "Not specified",
  lectures: "0 modules",
  skillLevel: "Beginner",
  language: "English",
  studyPlan: "Self-paced",
  deadline: "4 weeks from today",
});

// Material tabs configuration
const materialTabs = ref([
  { key: 'definition', label: 'Learn', icon: 'fa-solid fa-book' },
  { key: 'videos', label: 'Videos', icon: 'fa-solid fa-video' },
  { key: 'practice', label: 'Practice', icon: 'fa-solid fa-dumbbell' },
  { key: 'resources', label: 'Resources', icon: 'fa-solid fa-link' }
]);

// Personalization data
const personalizeData = ref({
  level: 'beginner',
  goals: [],
  timeCommitment: 5,
  learningStyle: 'visual'
});

const learningGoals = ref([
  { key: 'personal-finance', label: 'Personal Financial Planning' },
  { key: 'investing', label: 'Stock Market & Investing' },
  { key: 'real-estate', label: 'Real Estate Investment' },
  { key: 'retirement', label: 'Retirement Planning' },
  { key: 'business-finance', label: 'Business Finance' },
  { key: 'cryptocurrency', label: 'Cryptocurrency & DeFi' }
]);

// Weekly schedule
const weeklySchedule = ref([
  {
    day: 'Monday',
    duration: '1h',
    topics: ['Introduction to Finance', 'Basic Concepts']
  },
  {
    day: 'Wednesday', 
    duration: '1.5h',
    topics: ['Investment Fundamentals', 'Risk Assessment']
  },
  {
    day: 'Friday',
    duration: '1h',
    topics: ['Portfolio Management', 'Review & Practice']
  },
  {
    day: 'Sunday',
    duration: '30m',
    topics: ['Weekly Review', 'Next Week Planning']
  }
]);

// Achievement system
const achievements = ref([
  {
    id: 1,
    title: 'First Steps',
    description: 'Complete your first topic',
    icon: 'fa-solid fa-baby',
    unlocked: false
  },
  {
    id: 2,
    title: 'Knowledge Seeker',
    description: 'Complete 5 topics',
    icon: 'fa-solid fa-search',
    unlocked: false
  },
  {
    id: 3,
    title: 'Consistent Learner',
    description: 'Study for 7 days straight',
    icon: 'fa-solid fa-calendar-check',
    unlocked: false
  },
  {
    id: 4,
    title: 'Module Master',
    description: 'Complete a full module',
    icon: 'fa-solid fa-graduation-cap',
    unlocked: false
  }
]);

const VIDEO_COUNT = 3;

// Utility functions
function keyFor(s, t) { 
  return `${s}-${t}` 
}

function getSectionProgress(section) {
  if (!section.topics.length) return 0;
  const completed = section.topics.filter(topic => topic.completed).length;
  return Math.round((completed / section.topics.length) * 100);
}

// Enhanced roadmap processing
const processRoadmapData = () => {
  console.log("Processing roadmap data");
  const roadmapData = history.state?.roadmapData;

  if (roadmapData?.modules?.length) {
    console.log("Found roadmap data:", roadmapData);

    sections.value = roadmapData.modules.map((module, index) => ({
      title: module.title || `Module ${index + 1}`,
        collapsed: false,
      completed: false,
      active: index === 0,
      estimatedDuration: `${Math.ceil(module.topics?.length * 0.5) || 2}-${Math.ceil(module.topics?.length * 0.75) || 3} hours`,
      topics: module.topics && Array.isArray(module.topics)
            ? module.topics.map((topic, topicIndex) => ({
              id: index * 100 + topicIndex,
              title: topic,
              collapsed: true,
            completed: false,
            inProgress: false,
            difficulty: getDifficultyLevel(topicIndex, module.topics.length),
            estimatedTime: `${15 + Math.random() * 10 | 0}-${20 + Math.random() * 15 | 0} min`
            }))
            : [],
    }));

    // Update course details
    courseDetails.value = {
      duration: roadmapData.duration || `${sections.value.length * 2}-${sections.value.length * 3} weeks`,
      lectures: `${roadmapData.modules?.length || 0} modules`,
      skillLevel: roadmapData.level || "Beginner",
      language: roadmapData.language || "English",
      studyPlan: `${personalizeData.value.timeCommitment} hours/week`,
      deadline: calculateDeadline(roadmapData.modules?.length || 0),
    };
  } else {
    // Default structure if no roadmap data
    initializeDefaultRoadmap();
  }
};

function getDifficultyLevel(topicIndex, totalTopics) {
  const ratio = topicIndex / totalTopics;
  if (ratio < 0.3) return 'beginner';
  if (ratio < 0.7) return 'intermediate';
  return 'advanced';
}

function calculateDeadline(moduleCount) {
  const weeksNeeded = Math.ceil(moduleCount * personalizeData.value.timeCommitment / 4);
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + (weeksNeeded * 7));
  return deadline.toLocaleDateString();
}

function initializeDefaultRoadmap() {
    sections.value = [
      {
      title: "Introduction to Finance",
        collapsed: false,
      completed: false,
      active: true,
      estimatedDuration: "2-3 hours",
      topics: [
        {
          id: 1,
          title: "What is Finance?",
          collapsed: true,
          completed: false,
          inProgress: false,
          difficulty: 'beginner',
          estimatedTime: '15-20 min'
        },
        {
          id: 2,
          title: "Importance of Finance",
          collapsed: true,
          completed: false,
          inProgress: false,
          difficulty: 'beginner',
          estimatedTime: '20-25 min'
        }
      ]
    }
  ];
}

// Enhanced topic management
async function generateDefinition(sIdx, tIdx) {
  const topic = sections.value[sIdx].topics[tIdx];
  const key = keyFor(sIdx, tIdx);
  
  loadingDefinitions.value[key] = true;
  
  try {
    const prompt = `Create a comprehensive and engaging learning content for the topic "${topic.title}" 
    suitable for ${personalizeData.value.level} level. Include:
    1. Clear definition and explanation
    2. Key concepts and principles
    3. Real-world examples
    4. Why it's important in finance
    5. Common misconceptions
    Format as HTML with proper headings and styling.`;
    
    const response = await gptServices.generateResponse(prompt);
    topicDefinitions.value[key] = response;
  } catch (error) {
    console.error("Error generating definition:", error);
    topicDefinitions.value[key] = `<h3>Error generating content</h3><p>Please try again later.</p>`;
  } finally {
    loadingDefinitions.value[key] = false;
  }
}

async function regenerateDefinition(sIdx, tIdx) {
  const key = keyFor(sIdx, tIdx);
  delete topicDefinitions.value[key];
  await generateDefinition(sIdx, tIdx);
}

async function searchVideos(sIdx, tIdx) {
  const topic = sections.value[sIdx].topics[tIdx];
  const key = keyFor(sIdx, tIdx);
  
  loadingVideos.value[key] = true;
  
  try {
    const searchQuery = `${topic.title} finance tutorial explanation`;
    const videos = await getVideos(searchQuery, VIDEO_COUNT);
    videoResults.value[key] = videos;
  } catch (error) {
    console.error("Error searching videos:", error);
    videoResults.value[key] = [];
  } finally {
    loadingVideos.value[key] = false;
  }
}

function startTopic(sIdx, tIdx) {
  const topic = sections.value[sIdx].topics[tIdx];
  topic.inProgress = true;
  
  // Auto-generate content when starting a topic
  const key = keyFor(sIdx, tIdx);
  if (!topicDefinitions.value[key]) {
    generateDefinition(sIdx, tIdx);
  }
  if (!videoResults.value[key]) {
    searchVideos(sIdx, tIdx);
  }
  
  // Expand the topic
  topic.collapsed = false;
  activeMaterialTab.value = 'definition';
  
  checkAchievements();
}

function toggleSection(sIdx) {
  const section = sections.value[sIdx];
  section.collapsed = !section.collapsed;
  
  // Set as active section
  sections.value.forEach((s, i) => {
    s.active = i === sIdx;
  });
}

function toggleTopic(sIdx, tIdx) {
  const topic = sections.value[sIdx].topics[tIdx];
  topic.collapsed = !topic.collapsed;
  
  if (!topic.collapsed && !topic.inProgress && !topic.completed) {
    startTopic(sIdx, tIdx);
  }
}

function deleteTopic(sIdx, tIdx) {
  if (confirm("Are you sure you want to delete this topic?")) {
    sections.value[sIdx].topics.splice(tIdx, 1);
  }
}

function addTopic(sIdx) {
  const newTopic = {
    id: Date.now(),
    title: "New Topic",
    collapsed: true,
    completed: false,
    inProgress: false,
    difficulty: 'beginner',
    estimatedTime: '15-20 min'
  };
  sections.value[sIdx].topics.push(newTopic);
}

function addSection() {
  const newSection = {
    title: "New Learning Module",
    collapsed: false,
    completed: false,
    active: false,
    estimatedDuration: "2-3 hours",
    topics: []
  };
  sections.value.push(newSection);
}

// Achievement system
function checkAchievements() {
  const completedTopics = sections.value.reduce((sum, section) => 
    sum + section.topics.filter(topic => topic.completed).length, 0);
  
  // First Steps
  if (completedTopics >= 1 && !achievements.value[0].unlocked) {
    unlockAchievement(0);
  }
  
  // Knowledge Seeker
  if (completedTopics >= 5 && !achievements.value[1].unlocked) {
    unlockAchievement(1);
  }
  
  // Module Master
  const completedSections = sections.value.filter(section => 
    section.topics.length > 0 && section.topics.every(topic => topic.completed)
  ).length;
  
  if (completedSections >= 1 && !achievements.value[3].unlocked) {
    unlockAchievement(3);
  }
}

function unlockAchievement(index) {
  achievements.value[index].unlocked = true;
  // Show achievement notification
  setTimeout(() => {
    alert(`🎉 Achievement Unlocked: ${achievements.value[index].title}`);
  }, 500);
}

// Personalization features
async function generatePersonalizedRoadmap() {
  generatingRoadmap.value = true;
  
  try {
    const prompt = `Create a personalized learning roadmap for someone with:
    - Knowledge Level: ${personalizeData.value.level}
    - Learning Goals: ${personalizeData.value.goals.join(', ')}
    - Time Commitment: ${personalizeData.value.timeCommitment} hours/week
    - Learning Style: ${personalizeData.value.learningStyle}
    
    Generate a comprehensive roadmap with 4-6 modules, each containing 3-5 topics.
    Format as JSON with structure: 
    {
      "modules": [
        {
          "title": "Module Title",
          "topics": ["Topic 1", "Topic 2", ...]
        }
      ],
      "duration": "X weeks",
      "level": "${personalizeData.value.level}"
    }`;
    
    const response = await gptServices.generateResponse(prompt);
    const roadmapData = JSON.parse(response);
    
    // Update sections with new personalized roadmap
    sections.value = roadmapData.modules.map((module, index) => ({
      title: module.title,
      collapsed: false,
      completed: false,
      active: index === 0,
      estimatedDuration: `${Math.ceil(module.topics.length * 0.5)}-${Math.ceil(module.topics.length * 0.75)} hours`,
      topics: module.topics.map((topic, topicIndex) => ({
        id: Date.now() + index * 100 + topicIndex,
        title: topic,
        collapsed: true,
        completed: false,
        inProgress: false,
        difficulty: getDifficultyLevel(topicIndex, module.topics.length),
        estimatedTime: `${15 + Math.random() * 10 | 0}-${20 + Math.random() * 15 | 0} min`
      }))
    }));
    
    // Update course details
    courseDetails.value = {
      duration: roadmapData.duration || `${sections.value.length * 2} weeks`,
      lectures: `${sections.value.length} modules`,
      skillLevel: personalizeData.value.level,
      language: "English",
      studyPlan: `${personalizeData.value.timeCommitment} hours/week`,
      deadline: calculateDeadline(sections.value.length),
    };
    
    closePersonalizeModal();
  } catch (error) {
    console.error("Error generating personalized roadmap:", error);
    alert("Error generating roadmap. Please try again.");
  } finally {
    generatingRoadmap.value = false;
  }
}

function closePersonalizeModal() {
  showPersonalizeModal.value = false;
}

// Export and sharing
async function exportToPDF() {
  const element = document.querySelector('.learning-roadmap-container');
  const opt = {
    margin: 1,
    filename: 'learning-roadmap.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  
  html2pdf().set(opt).from(element).save();
}

function shareRoadmap() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({
      title: 'My Learning Roadmap',
      text: 'Check out my personalized finance learning roadmap!',
      url: url
    });
  } else {
    // Fallback to copying URL
    navigator.clipboard.writeText(url);
    alert('Roadmap URL copied to clipboard!');
  }
}

async function saveAndCollectMaterials() {
  // Simulate saving progress
  const progressData = {
    sections: sections.value,
    courseDetails: courseDetails.value,
    achievements: achievements.value,
    personalizeData: personalizeData.value
  };
  
  try {
    // In a real app, you'd save this to a backend
    localStorage.setItem('learningRoadmapProgress', JSON.stringify(progressData));
    alert('Progress saved successfully!');
  } catch (error) {
    console.error('Error saving progress:', error);
    alert('Error saving progress. Please try again.');
  }
}

// Load saved progress
function loadSavedProgress() {
  try {
    const savedData = localStorage.getItem('learningRoadmapProgress');
    if (savedData) {
      const progressData = JSON.parse(savedData);
      if (progressData.sections && progressData.sections.length > 0) {
        sections.value = progressData.sections;
        courseDetails.value = progressData.courseDetails || courseDetails.value;
        achievements.value = progressData.achievements || achievements.value;
        personalizeData.value = progressData.personalizeData || personalizeData.value;
        return true;
      }
    }
  } catch (error) {
    console.error('Error loading saved progress:', error);
  }
  return false;
}

// Lifecycle hooks
onMounted(async () => {
  // Try to load saved progress first
  if (!loadSavedProgress()) {
    // If no saved progress, process roadmap data from route
    processRoadmapData();
  }
  
  // Auto-expand first topic for better UX
  if (sections.value.length > 0 && sections.value[0].topics.length > 0) {
    const firstTopic = sections.value[0].topics[0];
    if (!firstTopic.inProgress && !firstTopic.completed) {
      startTopic(0, 0);
    }
  }
});

// Watch for route changes
watch(() => route.params, () => {
  processRoadmapData();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* Base Styles */
.learning-roadmap-container {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

/* Header Styles */
.roadmap-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 2rem 3rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.header-text .main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  color: #667eea;
}

.subtitle {
  color: #718096;
  font-size: 1.1rem;
  margin: 0.5rem 0 0 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-personalize {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-personalize:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-export {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-export:hover {
  background: #edf2f7;
  transform: translateY(-2px);
}

/* Progress Section */
.progress-section {
  margin-top: 2rem;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-text {
  font-weight: 600;
  color: #4a5568;
}

.progress-percentage {
  font-weight: 700;
  color: #667eea;
  font-size: 1.2rem;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.8s ease;
}

/* Main Content */
.roadmap-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 3rem;
}

/* Learning Path Panel */
.learning-path-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f7fafc;
}

.panel-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.path-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-weight: 500;
}

/* Section Nodes */
.path-section {
  margin-bottom: 2rem;
}

.section-node {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.section-node:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.section-node.completed {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
}

.section-node.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%);
}

.node-icon {
  background: #667eea;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.node-content {
  flex: 1;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.section-meta {
  display: flex;
  gap: 1rem;
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.section-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar.mini {
  height: 4px;
  width: 100px;
}

/* Topics Container */
.topics-container {
  margin-top: 1rem;
  padding-left: 3rem;
}

.topic-item {
  margin-bottom: 1rem;
}

.topic-header {
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid #e2e8f0;
}

.topic-header:hover {
  background: #edf2f7;
  transform: translateX(5px);
}

.topic-status {
  width: 30px;
  height: 30px;
}

.status-indicator {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2e8f0;
  color: #718096;
  font-size: 0.8rem;
}

.status-indicator.completed {
  background: #48bb78;
  color: white;
}

.status-indicator.in-progress {
  background: #ed8936;
  color: white;
}

.topic-content {
  flex: 1;
}

.topic-title {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #2d3748;
}

.topic-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
}

.difficulty {
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  font-weight: 500;
}

.difficulty.beginner {
  background: #c6f6d5;
  color: #22543d;
}

.difficulty.intermediate {
  background: #ffeaa7;
  color: #744210;
}

.difficulty.advanced {
  background: #fed7d7;
  color: #742a2a;
}

.topic-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
  background: #667eea;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-icon:hover {
  transform: scale(1.1);
}

/* Topic Content Panel */
.topic-content-panel {
  margin-top: 1rem;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.materials-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #718096;
}

.tab-btn.active {
  background: white;
  color: #667eea;
  border-bottom: 2px solid #667eea;
}

.tab-content {
  padding: 1.5rem;
}

/* Loading States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #718096;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Video Grid */
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.video-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  height: 140px;
  overflow: hidden;
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.video-info {
  padding: 1rem;
  background: white;
}

.video-title {
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 0.9rem;
  line-height: 1.3;
}

.video-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Empty States */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
  color: #718096;
  text-align: center;
}

.empty-state svg {
  font-size: 3rem;
  color: #cbd5e0;
}

/* Buttons */
.add-topic-btn, .add-section-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  transition: all 0.3s ease;
}

.add-topic-btn:hover, .add-section-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

/* Right Panel */
.details-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.overview-card, .schedule-card, .achievement-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
}

.card-header h3 {
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.course-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.8rem;
}

.course-details {
  padding: 2rem;
}

.detail-grid {
  display: grid;
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-icon {
  color: #667eea;
  font-size: 1.2rem;
  width: 20px;
}

.detail-content {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

.detail-value {
  font-weight: 600;
  color: #2d3748;
}

/* Schedule Card */
.schedule-content {
  padding: 2rem;
}

.weekly-plan {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.schedule-day {
  border-left: 3px solid #667eea;
  padding-left: 1rem;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.day-name {
  font-weight: 600;
  color: #2d3748;
}

.day-duration {
  font-size: 0.8rem;
  color: #718096;
  background: #f7fafc;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
}

.day-topics {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.schedule-topic {
  font-size: 0.8rem;
  color: #718096;
  padding-left: 1rem;
}

/* Achievements */
.achievements-grid {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: #f8fafc;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.achievement-item.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: white;
}

.achievement-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.achievement-info {
  flex: 1;
}

.achievement-title {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.achievement-desc {
  font-size: 0.8rem;
  margin: 0;
  opacity: 0.8;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.personalize-modal {
  background: white;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  padding: 2rem;
}

.personalize-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
}

.form-control {
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.checkbox-label:hover {
  background: #f7fafc;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-label input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-weight: bold;
}

.range-input {
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #667eea;
  border-radius: 50%;
  cursor: pointer;
}

.range-value {
  font-weight: 600;
  color: #667eea;
  margin-top: 0.5rem;
}

.modal-footer {
  padding: 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .roadmap-content {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .path-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .section-node {
    flex-direction: column;
    text-align: center;
  }
  
  .topic-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .materials-tabs {
    flex-wrap: wrap;
  }
  
  .tab-btn {
    min-width: 120px;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.path-section {
  animation: fadeInUp 0.6s ease forwards;
}

.path-section:nth-child(1) { animation-delay: 0.1s; }
.path-section:nth-child(2) { animation-delay: 0.2s; }
.path-section:nth-child(3) { animation-delay: 0.3s; }
.path-section:nth-child(4) { animation-delay: 0.4s; }

/* Hover Effects */
.btn:hover {
  transform: translateY(-2px);
}

.video-card:hover .play-overlay {
  background: rgba(102, 126, 234, 0.9);
}

/* Focus States */
.btn:focus, .form-control:focus, .btn-icon:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>
