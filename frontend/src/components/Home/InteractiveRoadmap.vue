<template>
  <section class="roadmap-section">
    <div class="roadmap-container">
      <!-- Header Section -->
      <header class="roadmap-header">
        <h2 class="section-title">🗺️ Lộ Trình Học Tài Chính Cá Nhân A-Z</h2>
        <p class="section-subtitle">
          Hành trình từ người mới bắt đầu đến chuyên gia tài chính với FinBud
        </p>
      </header>

      <!-- Progress Overview -->
      <div class="progress-overview">
        <div class="overall-progress">
          <span class="progress-label">Tiến độ tổng thể</span>
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{width: overallProgress + '%'}"></div>
          </div>
          <span class="progress-percentage">{{ overallProgress }}%</span>
        </div>
      </div>

      <!-- Interactive Timeline -->
      <div class="timeline-container">
        <div class="timeline-line"></div>
        
        <div 
          v-for="(phase, index) in roadmapPhases" 
          :key="index"
          class="timeline-phase"
          :class="{ 
            'active': activePhase === index,
            'completed': phase.completed,
            'locked': phase.locked
          }"
          @click="selectPhase(index)"
        >
          <!-- Phase Marker -->
          <div class="phase-marker">
            <div class="marker-icon">
              <font-awesome-icon 
                :icon="phase.completed ? 'fa-solid fa-check' : phase.icon" 
                :class="{ 'completed-icon': phase.completed }"
              />
            </div>
            <div class="marker-pulse" v-if="activePhase === index"></div>
          </div>

          <!-- Phase Content -->
          <div class="phase-content">
            <div class="phase-header">
              <h3 class="phase-title">{{ phase.title }}</h3>
              <span class="phase-duration">{{ phase.duration }}</span>
            </div>
            <p class="phase-description">{{ phase.description }}</p>
            
            <!-- Phase Steps -->
            <div class="phase-steps" v-if="activePhase === index">
              <div 
                v-for="(step, stepIndex) in phase.steps" 
                :key="stepIndex"
                class="step-item"
                :class="{ 'completed': step.completed }"
              >
                <div class="step-checkbox">
                  <font-awesome-icon 
                    :icon="step.completed ? 'fa-solid fa-check-circle' : 'fa-regular fa-circle'" 
                    :class="{ 'step-completed': step.completed }"
                  />
                </div>
                <div class="step-content">
                  <span class="step-title">{{ step.title }}</span>
                  <router-link 
                    v-if="step.link" 
                    :to="step.link" 
                    class="step-action"
                  >
                    {{ step.actionText }}
                    <font-awesome-icon icon="fa-solid fa-arrow-right" />
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Phase CTA Button -->
            <div class="phase-cta" v-if="activePhase === index && !phase.completed">
              <button 
                class="cta-button"
                @click="startPhase(phase)"
                :disabled="phase.locked"
              >
                <font-awesome-icon :icon="phase.ctaIcon" />
                {{ phase.ctaText }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievement Badges -->
      <div class="achievements-section">
        <h3 class="achievements-title">🏆 Thành Tựu Đã Đạt Được</h3>
        <div class="badges-grid">
          <div 
            v-for="(badge, index) in achievements" 
            :key="index"
            class="achievement-badge"
            :class="{ 'unlocked': badge.unlocked }"
          >
            <div class="badge-icon">
              <font-awesome-icon :icon="badge.icon" />
            </div>
            <span class="badge-name">{{ badge.name }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Start Guide -->
      <div class="quick-start-guide">
        <h3 class="guide-title">🚀 Bắt Đầu Ngay</h3>
        <div class="quick-actions">
          <router-link 
            v-for="(action, index) in quickActions" 
            :key="index"
            :to="action.link" 
            class="quick-action-card"
          >
            <div class="action-icon">
              <font-awesome-icon :icon="action.icon" />
            </div>
            <div class="action-content">
              <h4>{{ action.title }}</h4>
              <p>{{ action.description }}</p>
            </div>
            <div class="action-arrow">
              <font-awesome-icon icon="fa-solid fa-chevron-right" />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faGraduationCap, faChartLine, faWallet, faShieldAlt, faTrophy,
  faCheck, faCircle, faCheckCircle, faArrowRight, faChevronRight,
  faComments, faCalculator, faQuestionCircle, faUserGraduate,
  faBrain, faLightbulb, faStar, faCrown, faGem, faFire
} from '@fortawesome/free-solid-svg-icons'
import { faCircle as faCircleRegular, faCheckCircle as faCheckCircleRegular } from '@fortawesome/free-regular-svg-icons'

// Add icons to library
library.add(
  faGraduationCap, faChartLine, faWallet, faShieldAlt, faTrophy,
  faCheck, faCircle, faCheckCircle, faArrowRight, faChevronRight,
  faComments, faCalculator, faQuestionCircle, faUserGraduate,
  faBrain, faLightbulb, faStar, faCrown, faGem, faFire,
  faCircleRegular, faCheckCircleRegular
)

export default {
  name: 'InteractiveRoadmap',
  components: {
    FontAwesomeIcon
  },
  setup() {
    const activePhase = ref(0)

    const roadmapPhases = ref([
      {
        title: "Kiến Thức Cơ Bản",
        description: "Học các khái niệm tài chính cơ bản và xây dựng nền tảng vững chắc",
        duration: "2-3 tuần",
        icon: "fa-solid fa-graduation-cap",
        completed: false,
        locked: false,
        ctaText: "Bắt đầu học",
        ctaIcon: "fa-solid fa-graduation-cap",
        steps: [
          {
            title: "Hoàn thành Quiz kiến thức cơ bản",
            completed: false,
            link: "/quizz",
            actionText: "Làm Quiz ngay"
          },
          {
            title: "Chat với FinBud về các khái niệm tài chính",
            completed: false,
            link: "/chat-view",
            actionText: "Chat với FinBud"
          },
          {
            title: "Đọc Blog về tài chính cá nhân",
            completed: false,
            link: "/blog",
            actionText: "Xem Blog"
          }
        ]
      },
      {
        title: "Lập Ngân Sách & Mục Tiêu",
        description: "Thiết lập mục tiêu tài chính và học cách quản lý ngân sách hiệu quả",
        duration: "1-2 tuần",
        icon: "fa-solid fa-wallet",
        completed: false,
        locked: true,
        ctaText: "Thiết lập mục tiêu",
        ctaIcon: "fa-solid fa-wallet",
        steps: [
          {
            title: "Tạo mục tiêu tài chính cá nhân",
            completed: false,
            link: "/goal",
            actionText: "Tạo mục tiêu"
          },
          {
            title: "Sử dụng Investment Calculator",
            completed: false,
            link: "/investment-calculator",
            actionText: "Dùng Calculator"
          },
          {
            title: "Thiết lập budget với Mortgage Calculator",
            completed: false,
            link: "/mortgage-calc",
            actionText: "Tính toán ngân sách"
          }
        ]
      },
      {
        title: "Đầu Tư Cơ Bản",
        description: "Học về thị trường chứng khoán và bắt đầu mô phỏng đầu tư",
        duration: "3-4 tuần",
        icon: "fa-solid fa-chart-line",
        completed: false,
        locked: true,
        ctaText: "Thực hành đầu tư",
        ctaIcon: "fa-solid fa-chart-line",
        steps: [
          {
            title: "Thực hành với Stock Simulator",
            completed: false,
            link: "/stock-simulator",
            actionText: "Mở Simulator"
          },
          {
            title: "Phân tích với Predictive Calculator",
            completed: false,
            link: "/predictive-calculator",
            actionText: "Dự đoán giá cổ phiếu"
          },
          {
            title: "Tìm hiểu về Super Investors",
            completed: false,
            link: "/super-investors",
            actionText: "Học từ chuyên gia"
          }
        ]
      },
      {
        title: "Phân Tích Nâng Cao",
        description: "Sử dụng các công cụ phân tích chuyên nghiệp và AI",
        duration: "4-5 tuần",
        icon: "fa-solid fa-brain",
        completed: false,
        locked: true,
        ctaText: "Phân tích nâng cao",
        ctaIcon: "fa-solid fa-brain",
        steps: [
          {
            title: "Sử dụng Quant Analysis",
            completed: false,
            link: "/quant-analysis",
            actionText: "Phân tích định lượng"
          },
          {
            title: "Thực hành PESTLE Analysis",
            completed: false,
            link: "/pestle",
            actionText: "Phân tích PESTLE"
          },
          {
            title: "Thực hiện SWOT Analysis",
            completed: false,
            link: "/swot-analysis",
            actionText: "Phân tích SWOT"
          }
        ]
      },
      {
        title: "Chuyên Gia Tài Chính",
        description: "Trở thành chuyên gia với các công cụ AutoTrade và AI",
        duration: "Liên tục",
        icon: "fa-solid fa-crown",
        completed: false,
        locked: true,
        ctaText: "Nâng cấp chuyên gia",
        ctaIcon: "fa-solid fa-crown",
        steps: [
          {
            title: "Sử dụng AutoTrade AI",
            completed: false,
            link: "/autotrade-ai",
            actionText: "Giao dịch tự động"
          },
          {
            title: "Truy cập AI Hedge Fund Lab",
            completed: false,
            link: "/ai-hedge-fund-lab",
            actionText: "Premium Lab"
          },
          {
            title: "Gia nhập FinVerse Community",
            completed: false,
            link: "/forum",
            actionText: "Tham gia cộng đồng"
          }
        ]
      }
    ])

    const achievements = ref([
      { name: "Học sinh mới", icon: "fa-solid fa-graduation-cap", unlocked: true },
      { name: "Đầu tư viên", icon: "fa-solid fa-chart-line", unlocked: false },
      { name: "Phân tích gia", icon: "fa-solid fa-brain", unlocked: false },
      { name: "Chuyên gia", icon: "fa-solid fa-crown", unlocked: false },
      { name: "Bậc thầy", icon: "fa-solid fa-gem", unlocked: false },
      { name: "Huyền thoại", icon: "fa-solid fa-fire", unlocked: false }
    ])

    const quickActions = ref([
      {
        title: "Chat với FinBud",
        description: "Hỏi bất kỳ câu hỏi tài chính nào",
        icon: "fa-solid fa-comments",
        link: "/chat-view"
      },
      {
        title: "Làm Quiz",
        description: "Kiểm tra kiến thức của bạn",
        icon: "fa-solid fa-question-circle",
        link: "/quizz"
      },
      {
        title: "Mô phỏng đầu tư",
        description: "Thực hành không rủi ro",
        icon: "fa-solid fa-chart-line",
        link: "/stock-simulator"
      },
      {
        title: "Tạo mục tiêu",
        description: "Lập kế hoạch tài chính",
        icon: "fa-solid fa-wallet",
        link: "/goal"
      }
    ])

    const overallProgress = computed(() => {
      const completedPhases = roadmapPhases.value.filter(phase => phase.completed).length
      return Math.round((completedPhases / roadmapPhases.value.length) * 100)
    })

    const selectPhase = (index) => {
      if (!roadmapPhases.value[index].locked) {
        activePhase.value = index
      }
    }

    const startPhase = (phase) => {
      if (phase.steps && phase.steps.length > 0) {
        // Navigate to first incomplete step
        const firstIncompleteStep = phase.steps.find(step => !step.completed)
        if (firstIncompleteStep && firstIncompleteStep.link) {
          this.$router.push(firstIncompleteStep.link)
        }
      }
    }

    const updateProgress = () => {
      // This would be called from parent component or through store
      // to update progress based on user actions
    }

    onMounted(() => {
      // Simulate unlocking phases based on progress
      setTimeout(() => {
        roadmapPhases.value[1].locked = false
      }, 2000)
    })

    return {
      activePhase,
      roadmapPhases,
      achievements,
      quickActions,
      overallProgress,
      selectPhase,
      startPhase,
      updateProgress
    }
  }
}
</script>

<style scoped>
.roadmap-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8faff 0%, #e3f2fd 100%);
  min-height: 100vh;
}

.roadmap-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Styling */
.roadmap-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

/* Progress Overview */
.progress-overview {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.overall-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-label {
  font-weight: 600;
  color: #374151;
  min-width: 150px;
}

.progress-bar-container {
  flex: 1;
  height: 10px;
  background: #e5e7eb;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(45deg, #10b981, #059669);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.progress-percentage {
  font-weight: 700;
  color: #10b981;
  min-width: 50px;
  text-align: right;
}

/* Timeline Styling */
.timeline-container {
  position: relative;
  padding: 2rem 0;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #e5e7eb, #d1d5db);
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-phase {
  position: relative;
  margin-bottom: 4rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timeline-phase:nth-child(odd) .phase-content {
  margin-right: 55%;
  text-align: right;
}

.timeline-phase:nth-child(even) .phase-content {
  margin-left: 55%;
  text-align: left;
}

.timeline-phase.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.timeline-phase.active .phase-content {
  transform: scale(1.05);
}

/* Phase Marker */
.phase-marker {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.marker-icon {
  width: 60px;
  height: 60px;
  background: white;
  border: 4px solid #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #6b7280;
  transition: all 0.3s ease;
}

.timeline-phase.active .marker-icon {
  border-color: #1976d2;
  color: #1976d2;
  box-shadow: 0 0 20px rgba(25, 118, 210, 0.3);
}

.timeline-phase.completed .marker-icon {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.marker-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%, -50%);
  border: 2px solid #1976d2;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

/* Phase Content */
.phase-content {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.timeline-phase.active .phase-content {
  border-color: #1976d2;
  box-shadow: 0 8px 40px rgba(25, 118, 210, 0.15);
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.phase-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.phase-duration {
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.phase-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

/* Phase Steps */
.phase-steps {
  margin-top: 1.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.step-item:hover {
  background: #f8fafc;
}

.step-checkbox {
  color: #6b7280;
  font-size: 1.2rem;
}

.step-item.completed .step-checkbox {
  color: #10b981;
}

.step-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.step-title {
  font-weight: 500;
  color: #374151;
}

.step-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.step-action:hover {
  background: #e3f2fd;
  transform: translateX(4px);
}

/* CTA Button */
.phase-cta {
  margin-top: 1.5rem;
  text-align: center;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #1976d2, #42a5f5);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(25, 118, 210, 0.3);
}

.cta-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Achievements Section */
.achievements-section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.achievements-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.achievement-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.3s ease;
  opacity: 0.4;
}

.achievement-badge.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, #fef3c7, #fbbf24);
}

.badge-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #6b7280;
}

.achievement-badge.unlocked .badge-icon {
  color: #f59e0b;
}

.badge-name {
  font-weight: 500;
  text-align: center;
  color: #374151;
}

/* Quick Start Guide */
.quick-start-guide {
  margin-top: 3rem;
}

.guide-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.quick-action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
}

.quick-action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  border-color: #1976d2;
}

.action-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1976d2, #42a5f5);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.action-content {
  flex: 1;
}

.action-content h4 {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  color: #1f2937;
}

.action-content p {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.action-arrow {
  color: #1976d2;
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.quick-action-card:hover .action-arrow {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .roadmap-section {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .timeline-phase:nth-child(odd) .phase-content,
  .timeline-phase:nth-child(even) .phase-content {
    margin: 0 0 0 4rem;
    text-align: left;
  }

  .phase-marker {
    left: 30px;
  }

  .timeline-line {
    left: 30px;
  }

  .phase-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .step-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .badges-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .quick-actions {
    grid-template-columns: 1fr;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .roadmap-section {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
  }

  .phase-content,
  .progress-overview,
  .achievements-section,
  .quick-action-card {
    background: #2d3748;
    color: #e2e8f0;
  }

  .section-title {
    background: linear-gradient(45deg, #60a5fa, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .phase-title,
  .achievements-title,
  .guide-title {
    color: #e2e8f0;
  }

  .phase-description,
  .section-subtitle {
    color: #a0aec0;
  }
}
</style> 