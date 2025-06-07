<template>
  <div class="create-roadmap-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <font-awesome-icon icon="fa-solid fa-route" class="hero-icon" />
          Create Your Learning Roadmap
        </h1>
        <p class="hero-subtitle">AI-powered personalized financial education journey</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">10,000+</span>
            <span class="stat-label">Students Guided</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">95%</span>
            <span class="stat-label">Success Rate</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Topics Covered</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Step Indicator -->
      <div class="step-indicator">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          :class="['step', { active: currentStep === index, completed: currentStep > index }]"
        >
          <div class="step-circle">
            <font-awesome-icon 
              :icon="currentStep > index ? 'fa-solid fa-check' : step.icon" 
            />
          </div>
          <span class="step-label">{{ step.label }}</span>
        </div>
      </div>

      <!-- Form Container -->
      <div class="form-container">
        <!-- Step 1: Goals & Interests -->
        <div v-if="currentStep === 0" class="step-content">
          <div class="step-header">
            <h2>What study plan or course are you looking to create?</h2>
            <p>Tell us about the educational content you want to build.</p>
          </div>
          
          <div class="goals-grid">
            <div 
              v-for="goal in financialGoals" 
              :key="goal.id"
              :class="['goal-card', { selected: selectedGoals.includes(goal.id) } ]"
              @click="toggleGoal(goal.id)"
            >
              <div class="goal-icon">
                <font-awesome-icon :icon="goal.icon" />
              </div>
              <h3>{{ goal.title }}</h3>
              <p>{{ goal.description }}</p>
            </div>
          </div>

          <div class="custom-goal-input">
            <label>Describe Your Topic/Course (Optional)</label>
            <textarea 
              v-model="customGoal" 
              placeholder="E.g., 'Introduction to Cryptocurrency', 'Advanced Options Trading Strategies', 'Family Budgeting Workshop' ..."
              rows="3"
            ></textarea>
          </div>
        </div>

        <!-- Step 2: Experience Level -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="step-header">
            <h2>What's your experience level?</h2>
            <p>This helps us tailor the content difficulty</p>
          </div>
          
          <div class="experience-levels">
            <div 
              v-for="level in experienceLevels" 
              :key="level.id"
              :class="['level-card', { selected: selectedLevel === level.id }]"
              @click="selectedLevel = level.id"
            >
              <div class="level-icon">
                <font-awesome-icon :icon="level.icon" />
              </div>
              <h3>{{ level.title }}</h3>
              <p>{{ level.description }}</p>
              <div class="level-features">
                <span v-for="feature in level.features" :key="feature" class="feature">
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Time Commitment -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="step-header">
            <h2>How much time can you dedicate?</h2>
            <p>We'll create a schedule that fits your lifestyle</p>
          </div>
          
          <div class="time-options">
            <div 
              v-for="option in timeOptions" 
              :key="option.id"
              :class="['time-card', { selected: selectedTime === option.id }]"
              @click="selectedTime = option.id"
            >
              <div class="time-icon">
                <font-awesome-icon :icon="option.icon" />
              </div>
              <h3>{{ option.title }}</h3>
              <p>{{ option.description }}</p>
              <div class="time-estimate">{{ option.estimate }}</div>
            </div>
          </div>
        </div>

        <!-- Step 4: Learning Style -->
        <div v-if="currentStep === 3" class="step-content">
          <div class="step-header">
            <h2>How do you prefer to learn?</h2>
            <p>Select all that apply to customize your experience</p>
          </div>
          
          <div class="learning-styles">
            <div 
              v-for="style in learningStyles" 
              :key="style.id"
              :class="['style-card', { selected: selectedStyles.includes(style.id) }]"
              @click="toggleStyle(style.id)"
            >
              <div class="style-icon">
                <font-awesome-icon :icon="style.icon" />
              </div>
              <h3>{{ style.title }}</h3>
              <p>{{ style.description }}</p>
            </div>
          </div>
        </div>

        <!-- Step 5: Generate Roadmap -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="step-header">
            <h2>Generate Your Roadmap</h2>
            <p>Review your preferences and create your personalized learning path</p>
          </div>
          
          <div class="summary-card">
            <h3>Your Learning Profile</h3>
            <div class="summary-item">
              <strong>Goals:</strong> 
              <span>{{ getSelectedGoalNames().join(', ') }}</span>
            </div>
            <div class="summary-item">
              <strong>Experience:</strong> 
              <span>{{ getSelectedLevelName() }}</span>
            </div>
            <div class="summary-item">
              <strong>Time Commitment:</strong> 
              <span>{{ getSelectedTimeName() }}</span>
            </div>
            <div class="summary-item">
              <strong>Learning Style:</strong> 
              <span>{{ getSelectedStyleNames().join(', ') }}</span>
            </div>
          </div>

          <!-- Generate Button -->
          <div class="generate-section">
            <button 
              class="btn-generate" 
              @click="generateRoadmap"
              :disabled="isGenerating"
            >
              <font-awesome-icon 
                :icon="isGenerating ? 'fa-solid fa-spinner' : 'fa-solid fa-magic'" 
                :class="{ 'fa-spin': isGenerating }"
              />
              {{ isGenerating ? 'Creating Your Roadmap...' : 'Generate Roadmap' }}
            </button>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="nav-buttons">
          <button 
            v-if="currentStep > 0" 
            class="btn btn-secondary" 
            @click="previousStep"
          >
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
            Previous
          </button>
          <button 
            v-if="currentStep < 4" 
            class="btn btn-primary" 
            @click="nextStep"
            :disabled="!canProceed"
          >
            Next
            <font-awesome-icon icon="fa-solid fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Modal -->
    <div v-if="isGenerating" class="loading-modal">
      <div class="loading-content">
        <div class="loading-animation">
          <div class="brain-icon">
            <font-awesome-icon icon="fa-solid fa-brain" />
          </div>
        </div>
        <h3>Creating Your Personalized Roadmap</h3>
        <p>{{ loadingMessage }}</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faRoute, faCheck, faArrowLeft, faArrowRight, faMagic, faSpinner, faBrain,
  faHome, faGraduationCap, faChartLine, faPiggyBank, faShieldAlt, faRocket,
  faSeedling, faGem, faClock, faCalendarDay, faCalendarWeek, faCalendarAlt,
  faBook, faVideo, faMicrophone, faUsers, faGamepad, faChalkboardTeacher, faCalculator
} from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Add icons to library
library.add(
  faRoute, faCheck, faArrowLeft, faArrowRight, faMagic, faSpinner, faBrain,
  faHome, faGraduationCap, faChartLine, faPiggyBank, faShieldAlt, faRocket,
  faSeedling, faGem, faClock, faCalendarDay, faCalendarWeek, faCalendarAlt,
  faBook, faVideo, faMicrophone, faUsers, faGamepad, faChalkboardTeacher, faCalculator
)

const router = useRouter()

// Reactive data
const currentStep = ref(0)
const selectedGoals = ref([])
const customGoal = ref('')
const selectedLevel = ref('')
const selectedTime = ref('')
const selectedStyles = ref([])
const isGenerating = ref(false)
const progress = ref(0)

const loadingMessages = ref([
  'Analyzing your learning preferences...',
  'Selecting optimal learning materials...',
  'Creating personalized curriculum...',
  'Generating practice exercises...',
  'Finalizing your roadmap...'
])

const currentLoadingMessage = ref(0)

const loadingMessage = computed(() => {
  return loadingMessages.value[currentLoadingMessage.value] || 'Processing...'
})

// Steps configuration
const steps = ref([
  { label: 'Goals', icon: 'fa-solid fa-bullseye' },
  { label: 'Experience', icon: 'fa-solid fa-graduation-cap' },
  { label: 'Time', icon: 'fa-solid fa-clock' },
  { label: 'Style', icon: 'fa-solid fa-book' },
  { label: 'Generate', icon: 'fa-solid fa-magic' }
])

// Financial goals
const financialGoals = ref([
  {
    id: 'homebuying',
    title: 'Home Buying',
    description: 'Learn about mortgages, down payments, and real estate',
    icon: 'fa-solid fa-home'
  },
  {
    id: 'investing',
    title: 'Stock Investing',
    description: 'Master stock analysis, portfolio management, and trading',
    icon: 'fa-solid fa-chart-line'
  },
  {
    id: 'retirement',
    title: 'Retirement Planning',
    description: 'Plan for long-term financial security and independence',
    icon: 'fa-solid fa-piggy-bank'
  },
  {
    id: 'budgeting',
    title: 'Budgeting & Saving',
    description: 'Create effective budgets and build savings habits',
    icon: 'fa-solid fa-calculator'
  },
  {
    id: 'insurance',
    title: 'Insurance & Protection',
    description: 'Understand different insurance types and risk management',
    icon: 'fa-solid fa-shield-alt'
  },
  {
    id: 'entrepreneurship',
    title: 'Business Finance',
    description: 'Learn about business loans, cash flow, and entrepreneurship',
    icon: 'fa-solid fa-rocket'
  }
])

// Experience levels
const experienceLevels = ref([
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to finance and investing',
    icon: 'fa-solid fa-seedling',
    features: ['Basic concepts', 'Step-by-step guides', 'Glossary included']
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Some experience with financial concepts',
    icon: 'fa-solid fa-graduation-cap',
    features: ['Advanced strategies', 'Case studies', 'Market analysis']
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Experienced investor looking to refine skills',
    icon: 'fa-solid fa-gem',
    features: ['Expert techniques', 'Complex scenarios', 'Industry insights']
  }
])

// Time options
const timeOptions = ref([
  {
    id: 'casual',
    title: 'Casual Learner',
    description: '15-30 minutes per day',
    icon: 'fa-solid fa-clock',
    estimate: '2-3 months to complete'
  },
  {
    id: 'regular',
    title: 'Regular Study',
    description: '30-60 minutes per day',
    icon: 'fa-solid fa-calendar-day',
    estimate: '1-2 months to complete'
  },
  {
    id: 'intensive',
    title: 'Intensive Learning',
    description: '1-2 hours per day',
    icon: 'fa-solid fa-calendar-week',
    estimate: '2-4 weeks to complete'
  }
])

// Learning styles
const learningStyles = ref([
  {
    id: 'reading',
    title: 'Reading & Articles',
    description: 'Learn through written content and guides',
    icon: 'fa-solid fa-book'
  },
  {
    id: 'videos',
    title: 'Video Content',
    description: 'Visual learning through videos and tutorials',
    icon: 'fa-solid fa-video'
  },
  {
    id: 'interactive',
    title: 'Interactive Exercises',
    description: 'Hands-on practice with simulations and quizzes',
    icon: 'fa-solid fa-gamepad'
  },
  {
    id: 'mentoring',
    title: 'Guided Learning',
    description: 'Structured lessons with expert guidance',
    icon: 'fa-solid fa-chalkboard-teacher'
  }
])

// Computed properties
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0: return selectedGoals.value.length > 0
    case 1: return selectedLevel.value !== ''
    case 2: return selectedTime.value !== ''
    case 3: return selectedStyles.value.length > 0
    default: return true
  }
})

// Methods
const toggleGoal = (goalId) => {
  const index = selectedGoals.value.indexOf(goalId)
  if (index > -1) {
    selectedGoals.value.splice(index, 1)
  } else {
    selectedGoals.value.push(goalId)
  }
}

const toggleStyle = (styleId) => {
  const index = selectedStyles.value.indexOf(styleId)
  if (index > -1) {
    selectedStyles.value.splice(index, 1)
  } else {
    selectedStyles.value.push(styleId)
  }
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const getSelectedGoalNames = () => {
  return selectedGoals.value.map(id => 
    financialGoals.value.find(goal => goal.id === id)?.title || id
  )
}

const getSelectedLevelName = () => {
  return experienceLevels.value.find(level => level.id === selectedLevel.value)?.title || ''
}

const getSelectedTimeName = () => {
  return timeOptions.value.find(option => option.id === selectedTime.value)?.title || ''
}

const getSelectedStyleNames = () => {
  return selectedStyles.value.map(id => 
    learningStyles.value.find(style => style.id === id)?.title || id
  )
}

const simulateProgress = () => {
  progress.value = 0
  currentLoadingMessage.value = 0
  
  const interval = setInterval(() => {
    progress.value += 20
    currentLoadingMessage.value = Math.min(
      Math.floor(progress.value / 20), 
      loadingMessages.value.length - 1
    )
    
    if (progress.value >= 100) {
      clearInterval(interval)
    }
  }, 1000)
  
  return 5000 // 5 seconds total
}

const generateRoadmap = async () => {
  try {
    isGenerating.value = true
    
    // Simulate loading progress
    const totalTime = simulateProgress()
    
    // Prepare request data
    const requestData = {
      goals: selectedGoals.value,
      customGoal: customGoal.value,
      experience: selectedLevel.value,
      timeCommitment: selectedTime.value,
      learningStyles: selectedStyles.value
    }
    
    // Generate mock roadmap data based on selections
    const mockRoadmapData = {
      title: `Personalized ${getSelectedGoalNames().join(' & ')} Learning Path`,
      level: getSelectedLevelName(),
      timeCommitment: getSelectedTimeName(),
      styles: getSelectedStyleNames(),
      modules: [
        {
          id: 1,
          title: 'Foundation Building',
          description: 'Master the fundamental concepts',
          duration: '1-2 weeks',
          lessons: ['Basic terminology', 'Core principles', 'Getting started']
        },
        {
          id: 2,
          title: 'Practical Application',
          description: 'Apply concepts to real scenarios',
          duration: '2-3 weeks', 
          lessons: ['Case studies', 'Hands-on exercises', 'Tools & platforms']
        },
        {
          id: 3,
          title: 'Advanced Strategies',
          description: 'Develop expert-level skills',
          duration: '2-4 weeks',
          lessons: ['Advanced techniques', 'Risk management', 'Optimization']
        }
      ],
      progress: 0,
      createdAt: new Date().toISOString()
    }
    
    // Wait for animation to complete
    setTimeout(() => {
      isGenerating.value = false
      // Navigate to roadmap view with generated data
      router.push({
        name: 'LearningRoadMap',
        query: { 
          generated: 'true',
          data: JSON.stringify(mockRoadmapData)
        }
      })
    }, totalTime)
    
  } catch (error) {
    console.error('Error generating roadmap:', error)
    isGenerating.value = false
    alert('There was an error generating your roadmap. Please try again.')
  }
}

onMounted(() => {
  // Initialize any necessary data
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.create-roadmap-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  font-family: 'Inter', sans-serif;
  color: #000000;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 6rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-icon {
  font-size: 3rem;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 3rem;
  font-weight: 400;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Main Content */
.main-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 2rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active,
.step.completed {
  opacity: 1;
}

.step-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.step.active .step-circle {
  background: #000000;
  color: white;
}

.step.completed .step-circle {
  background: #4caf50;
  color: white;
}

.step-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

/* Form Container */
.form-container {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.step-content {
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.step-header {
  text-align: center;
  margin-bottom: 3rem;
}

.step-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.step-header p {
  color: #64748b;
  font-size: 1.1rem;
}

/* Goals Grid */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.goal-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.goal-card:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.goal-card.selected {
  border-color: #000000;
  background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
}

.goal-icon {
  font-size: 3rem;
  color: #000000;
  margin-bottom: 1rem;
}

.goal-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.goal-card p {
  color: #64748b;
  font-size: 0.9rem;
}

/* Experience Levels */
.experience-levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.level-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.level-card:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.level-card.selected {
  border-color: #000000;
  background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
}

.level-icon {
  font-size: 3rem;
  color: #000000;
  margin-bottom: 1rem;
}

.level-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.level-card p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.level-features {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature {
  background: rgba(59, 130, 246, 0.1);
  color: #000000;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Time Options */
.time-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.time-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-card:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.time-card.selected {
  border-color: #000000;
  background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
}

.time-icon {
  font-size: 3rem;
  color: #000000;
  margin-bottom: 1rem;
}

.time-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.time-card p {
  color: #64748b;
  margin-bottom: 1rem;
}

.time-estimate {
  background: rgba(0, 0, 0, 0.1);
  color: #000000;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-block;
}

/* Learning Styles */
.learning-styles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.style-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.style-card:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.style-card.selected {
  border-color: #000000;
  background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
}

.style-icon {
  font-size: 3rem;
  color: #000000;
  margin-bottom: 1rem;
}

.style-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.style-card p {
  color: #64748b;
  font-size: 0.9rem;
}

/* Custom Goal Input */
.custom-goal-input {
  margin-top: 2rem;
}

.custom-goal-input label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.custom-goal-input textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.2s ease;
}

.custom-goal-input textarea:focus {
  outline: none;
  border-color: #000000;
}

/* Summary Card */
.summary-card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
}

.summary-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.summary-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.summary-item strong {
  color: #374151;
  font-weight: 600;
}

.summary-item span {
  color: #64748b;
  text-align: right;
  max-width: 60%;
}

/* Generate Section */
.generate-section {
  text-align: center;
}

.btn-generate {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border: none;
  padding: 1.25rem 3rem;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.btn-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Navigation Buttons */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  margin-left: auto;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.btn-secondary {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

/* Loading Modal */
.loading-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.loading-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.loading-animation {
  margin-bottom: 2rem;
}

.brain-icon {
  font-size: 4rem;
  color: #000000;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.1); opacity: 1; }
}

.loading-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.loading-content p {
  color: #64748b;
  margin-bottom: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #000000, #333333);
  border-radius: 4px;
  transition: width 0.5s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .main-content {
    padding: 2rem 1rem;
  }
  
  .form-container {
    padding: 2rem;
  }
  
  .step-indicator {
    gap: 1rem;
  }
  
  .step-circle {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .goals-grid,
  .experience-levels,
  .time-options,
  .learning-styles {
    grid-template-columns: 1fr;
  }
  
  .nav-buttons {
    flex-direction: column;
  }
  
  .btn-primary {
    margin-left: 0;
  }
}
</style> 