<template>
  <div class="quiz-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <font-awesome-icon icon="fa-solid fa-brain" class="hero-icon" />
          Financial Knowledge Quiz
        </h1>
        <p class="hero-subtitle">Test your financial knowledge and learn with AI-powered personalized feedback</p>
        <div class="hero-features">
          <div class="feature-tag">
            <font-awesome-icon icon="fa-solid fa-trophy" />
            Earn Points
          </div>
          <div class="feature-tag">
            <font-awesome-icon icon="fa-solid fa-lightbulb" />
            AI Guidance
          </div>
          <div class="feature-tag">
            <font-awesome-icon icon="fa-solid fa-chart-line" />
            Track Progress
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">50+</span>
            <span class="stat-label">Topics</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">1000+</span>
            <span class="stat-label">Questions</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">95%</span>
            <span class="stat-label">Success Rate</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Enhanced Bot Chat Component -->
    <div
      class="bot-chat-container"
      :class="{ 'bot-visible': showBot, 'bot-hidden': hidingBot }"
    >
        <div class="bot-avatar" @click="toggleChat">
      <img
        class="bot-image"
        src="@/assets/botrmbg.png"
            alt="FinBud AI Assistant"
      />
          <div class="bot-status-indicator"></div>
        </div>
      <div
          class="bot-message-container"
        :class="{
          'message-visible': showMessage && !chatCollapsed,
          'message-hidden': hidingMessage || chatCollapsed,
        }"
      >
          <div class="bot-header">
            <span class="bot-name">FinBud AI</span>
            <button class="minimize-btn" @click="toggleChat">
              <font-awesome-icon :icon="chatCollapsed ? 'fa-solid fa-maximize' : 'fa-solid fa-minimize'" />
            </button>
          </div>
          <div class="bot-message">
        <div v-if="isTyping" class="typing-animation">
              <span class="typing-text">FinBud đang soạn tin nhắn</span>
              <div class="typing-dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
              </div>
        </div>
        <div v-else class="typed-message" v-html="typedContent"></div>
      </div>
        </div>
      </div>

      <!-- Quiz Component Container -->
      <div class="quiz-container">
        <div class="quiz-panel">
          <div class="panel-header">
            <h3>
              <font-awesome-icon icon="fa-solid fa-graduation-cap" />
              AI-Powered Quiz Generator
            </h3>
            <p>Enter any financial topic or keyword to generate custom quiz questions instantly</p>
    </div>

      <quizComponent @messageToBot="$emit('finbudBotResponse', $event)" />
        </div>
      </div>

      <!-- Quick Actions Panel -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <router-link to="/predictive-calculator" class="action-card">
            <div class="action-icon">
              <font-awesome-icon icon="fa-solid fa-calculator" />
            </div>
            <h4>Predictive Calculator</h4>
            <p>Calculate financial predictions</p>
          </router-link>
          
          <router-link to="/forum" class="action-card">
            <div class="action-icon">
              <font-awesome-icon icon="fa-solid fa-users" />
            </div>
            <h4>Join Community</h4>
            <p>Connect with other learners</p>
          </router-link>
          
          <div class="action-card" @click="startBotAnimation">
            <div class="action-icon">
              <font-awesome-icon icon="fa-solid fa-robot" />
            </div>
            <h4>Ask FinBud AI</h4>
            <p>Get personalized guidance</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import quizComponent from "@/components/FinEdu/Quiz/quizComponent.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faBrain, faTrophy, faLightbulb, faChartLine, faGraduationCap, 
  faRoute, faMap, faUsers, faRobot, faMaximize, faMinimize, faCalculator
} from '@fortawesome/free-solid-svg-icons';
import AOS from "aos";
import "aos/dist/aos.css";

// Add icons to library
library.add(
  faBrain, faTrophy, faLightbulb, faChartLine, faGraduationCap, 
  faRoute, faMap, faUsers, faRobot, faMaximize, faMinimize, faCalculator
);

export default {
  name: "QuizzPage",
  components: { 
    quizComponent,
    FontAwesomeIcon
  },
  data() {
    return {
      // Bot Chat data
      showBot: false,
      hidingBot: false,
      showMessage: false,
      hidingMessage: false,
      isTyping: false,
      botMessage: "",
      typedContent: "",
      typingTimer: null,
      botHideTimer: null,
      chatCollapsed: false,
    };
  },
  mounted() {
    AOS.init({ duration: 800, easing: "ease-out" });
    // Start bot animation when the component is mounted
    this.startBotAnimation();
  },
  beforeUnmount() {
    // Clean up timers when the component is destroyed
    if (this.typingTimer) {
      clearTimeout(this.typingTimer);
    }
    if (this.botHideTimer) {
      clearTimeout(this.botHideTimer);
    }
  },
  methods: {
    formatQuizIntroduction() {
      return 'Chào mừng bạn đến với FinBud Quiz! 🎯\n\n📚 Hãy khám phá:\n\n🧠 Tạo câu hỏi tùy chỉnh từ bất kỳ chủ đề tài chính nào\n\n🏆 Tích lũy điểm và phần thưởng khi học\n\n📈 Theo dõi tiến trình học tập của bạn\n\n💡 Nhận phản hồi chi tiết từ AI\n\nHãy nhập một chủ đề hoặc từ khóa tài chính bạn muốn học, ví dụ: "chứng khoán", "ngân sách", "đầu tư", "cryptocurrency", "bảo hiểm"!';
    },

    startBotAnimation() {
      // Reset any existing timers
      if (this.typingTimer) {
        clearTimeout(this.typingTimer);
      }
      if (this.botHideTimer) {
        clearTimeout(this.botHideTimer);
      }

      // Always show the bot
      this.showBot = true;
      this.hidingBot = false;
      this.showMessage = true;
      this.hidingMessage = false;
      this.typedContent = "";
      this.chatCollapsed = false;

      // Show typing animation immediately
      this.isTyping = true;

      // After short typing animation, start character-by-character typing
      setTimeout(() => {
        this.isTyping = false;
        this.botMessage = this.formatQuizIntroduction();
        this.startRealisticTyping();
      }, 1500);
    },

    startRealisticTyping() {
      // Use character-by-character typing for more realistic effect
      this.typedContent = "";
      let charIndex = 0;

      const typeNextChar = () => {
        if (charIndex < this.botMessage.length) {
          const currentChar = this.botMessage.charAt(charIndex);

          // Add character to typed content with HTML handling
          if (currentChar === "\n") {
            this.typedContent += "<br>";
          } else {
            this.typedContent += currentChar;
          }

          charIndex++;

          // Calculate typing speed based on character type
          let delay;
          if ([".", "!", "?"].includes(currentChar)) {
            delay = Math.random() * 100 + 80;
          } else if ([",", ":", ";"].includes(currentChar)) {
            delay = Math.random() * 60 + 40;
          } else if (currentChar === " ") {
            delay = Math.random() * 20 + 10;
          } else if (currentChar === "\n") {
            delay = Math.random() * 120 + 80;
          } else {
            delay = Math.random() * 25 + 15;
          }

          // Add occasional thinking pause
          if (Math.random() < 0.02) {
            delay += Math.random() * 150 + 50;
          }

          this.typingTimer = setTimeout(typeNextChar, delay);
        }
      };

      setTimeout(typeNextChar, 300);
    },

    toggleChat() {
      this.chatCollapsed = !this.chatCollapsed;

      if (!this.chatCollapsed && this.typedContent) {
        this.showMessage = true;
      } else if (!this.chatCollapsed && !this.typedContent) {
        this.startBotAnimation();
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.quiz-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  font-family: 'Inter', sans-serif;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 4rem 2rem;
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
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.hero-icon {
  background: linear-gradient(45deg, #000000, #333333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: 2rem;
}

.hero-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.feature-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease;
}

.feature-tag:hover {
  transform: translateY(-2px);
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #000000;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

/* Main Content */
.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

/* Enhanced Bot Chat */
.bot-chat-container {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 350px;
  z-index: 1000;
  transition: all 0.3s ease;
}

.bot-avatar {
  position: relative;
  cursor: pointer;
  margin-bottom: 1rem;
}

.bot-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  border: 3px solid #000000;
}

.bot-image:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.bot-status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 16px;
  height: 16px;
  background: #10b981;
  border-radius: 50%;
  border: 3px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.bot-message-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.message-visible {
  opacity: 1;
  transform: translateY(0);
}

.message-hidden {
  opacity: 0;
  transform: translateY(-20px);
}

.bot-header {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bot-name {
  font-weight: 600;
  font-size: 1rem;
}

.minimize-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.minimize-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.bot-message {
  padding: 1.5rem;
  line-height: 1.6;
  color: #374151;
}

.typing-animation {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
}

.typing-text {
  font-style: italic;
  font-size: 0.9rem;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.dot {
  width: 6px;
  height: 6px;
  background: #000000;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Quiz Container */
.quiz-container {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.quiz-panel {
  width: 100%;
}

.panel-header {
  text-align: center;
  margin-bottom: 2rem;
}

.panel-header h3 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.panel-header p {
  color: #64748b;
  font-size: 1rem;
}

/* Quick Actions */
.quick-actions {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.quick-actions h3 {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}

.action-card:hover {
  border-color: #000000;
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: inherit;
}

.action-icon {
  font-size: 3rem;
  color: #000000;
  margin-bottom: 1rem;
}

.action-card h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #64748b;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .bot-chat-container {
    position: static;
    width: 100%;
    margin-bottom: 2rem;
    transform: none;
    top: auto;
    left: auto;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .hero-features {
    gap: 1rem;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .quiz-container,
  .quick-actions {
    padding: 1.5rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .bot-message-container {
    width: 100%;
  }
}

.quiz-header h1 {
  background: linear-gradient(45deg, #000000, #333333);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-align: center;
}

.start-quiz-btn {
  background: linear-gradient(135deg, #000000 0%, #333333 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.quiz-progress-bar {
  background: #000000;
  height: 6px;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.option:hover {
  border-color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.quiz-nav a:hover {
  color: #000000;
}

/* Dark mode styles */
.dark-mode .quiz-page {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  color: #f9fafb;
}

.dark-mode .hero-title {
  color: #f9fafb;
}

.dark-mode .hero-subtitle {
  color: #d1d5db;
}

.dark-mode .hero-features li {
  color: #d1d5db;
}

.dark-mode .stat-item {
  background: rgba(55, 65, 81, 0.5);
  border-color: #4b5563;
  color: #f9fafb;
}

.dark-mode .bot-message-container {
  background: #374151;
  border-color: #4b5563;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dark-mode .bot-header {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
}

.dark-mode .bot-message {
  color: #d1d5db;
}

.dark-mode .typing-animation {
  color: #9ca3af;
}

.dark-mode .dot {
  background: #f9fafb;
}

.dark-mode .quiz-container {
  background: #374151;
  border-color: #4b5563;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dark-mode .panel-header h3 {
  color: #f9fafb;
}

.dark-mode .panel-header p {
  color: #d1d5db;
}

.dark-mode .quick-actions {
  background: #374151;
  border-color: #4b5563;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.dark-mode .quick-actions h3 {
  color: #f9fafb;
}

.dark-mode .action-card {
  background: #4b5563;
  border-color: #6b7280;
  color: #f9fafb;
}

.dark-mode .action-card:hover {
  border-color: #9ca3af;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}

.dark-mode .action-icon {
  color: #f9fafb;
}

.dark-mode .action-card h4 {
  color: #f9fafb;
}

.dark-mode .action-card p {
  color: #d1d5db;
}

.dark-mode .quiz-header h1 {
  background: linear-gradient(45deg, #f9fafb, #d1d5db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dark-mode .start-quiz-btn {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
}

.dark-mode .quiz-progress-bar {
  background: #f9fafb;
}
</style>
