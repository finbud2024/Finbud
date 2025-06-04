<template>
  <div class="section-container">
    <QuizRewards v-if="showingReward" :reward-amount="rewardAmount" @close="showingReward = false" />

    <search-input v-model="searchQuery" @search="createRoadmap" :placeholder="$t('searchPlaceholder')" />
    <!-- data-aos="flip-right" -->
     
    <div class="goal-form-card" data-aos="zoom-in-up">
      <h1 class="title">{{ $t('goalTitle') }}</h1>

      <div class="form-group">
        <label for="proficiency">{{ $t('proficiencyLabel') }}</label>
        <select id="proficiency" v-model="proficiency" class="form-select">
          <option value="" disabled selected>{{ $t('proficiencyPlaceholder') }}</option>
          <option value="beginner">{{ $t('beginner') }}</option>
          <option value="intermediate">{{ $t('intermediate') }}</option>
          <option value="advanced">{{ $t('advanced') }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="learning-hours">{{ $t('learningLabel') }}</label>
        <div class="input-row">
          <div class="input-group input-half-width">
            <input type="number" id="hours-per-day" v-model="hoursPerDay" :placeholder="$t('hoursPlaceholder')" min="0"
              class="form-input" />
          </div>
          <div class="input-group input-half-width">
            <input type="number" id="days-per-week" v-model="daysPerWeek" :placeholder="$t('daysPlaceholder')" min="0"
              max="7" class="form-input" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>{{ $t('periodLabel') }}</label>
        <div class="input-row">
          <div class="input-group duration-input">
            <input type="number" v-model="duration" :placeholder="$t('durationPlaceholder')" min="1"
              class="form-input" />
          </div>
          <div class="input-group period-select">
            <select v-model="period" class="form-select">
              <option value="" disabled selected>{{ $t('periodPlaceholder') }}</option>
              <option value="days">{{ $t('days') }}</option>
              <option value="weeks">{{ $t('weeks') }}</option>
              <option value="months">{{ $t('months') }}</option>
            </select>
          </div>
        </div>
      </div>

      <button class="submit-button" @click="createRoadmap" :disabled="!searchQuery.trim() || is_generating_roadmap">
        {{
          is_generating_roadmap
            ? $t('generatingButton')
            : $t('generateButton')
        }}
      </button>
    </div>
  </div>

  <div class="section-container" data-aos="flip-right">
    <div class="quiz-card">
      <h1 class="title">{{ $t('quizTitle') }}</h1>
      <div class="form-group">
        <label for="search-keyword">{{ $t('currentKeywordLabel') }}</label>
        <div id="search-keyword" class="search-container">
          <input style="height: 100%; margin-bottom: 0" type="text" v-model="searchKeyword" :disabled="isLoading"
            :placeholder="$t('keywordPlaceholder')" @keyup.enter="GenerateQuiz" />
          <button class="button" @click="GenerateQuiz">{{ $t('generateQuizButton') }}</button>
        </div>
      </div>
      <div class="form-group" v-if="relatedKeyword.length !== 0">
        <label for="related-keyword">{{ $t('relatedKeywordsLabel') }}</label>
        <div class="carousel-wrapper">
          <button class="carousel-nav left" @click="scrollLeft" :aria-label="$t('scrollLeft')">
            &lt;
          </button>

          <div class="related-keyword-container" ref="carousel">
            <button v-for="keyword in relatedKeyword" :key="keyword" :disabled="isLoading" class="button"
              @click="handleSuggestedChoice(keyword)">
              {{ keyword }}
            </button>
          </div>

          <button class="carousel-nav right" @click="scrollRight" :aria-label="$t('scrollRight')">
            &gt;
          </button>
        </div>
      </div>
      <div v-if="currentKeyword" class="quiz-info">
        <div>{{ $t('currentKeywordLabel') }} {{ currentKeyword }}</div>
        <div>{{ $t('pointsLabel') }} {{ score }}</div>
        <div>{{ $t('timeLeftLabel') }} {{ timerCountdown }}</div>
      </div>
      <div class="quiz-area">
        <div :class="[
          'quizQuestion',
          { quizQuestionEnabled: question.length !== 0 },
        ]">
          {{ currentQuestion === -1 ? $t('questionPlaceholder') : question }}
        </div>
        <div class="quizChoices">
          <button v-for="index in 4" :key="index" :disabled="answerButtonDisabled" @click="handleUserChoice(index)"
            :class="[
              'answerButton',
              { answerButtonActive: answerOptions.length !== 0 },
            ]">
            {{
              answerOptions.length === 0
                ? $t('answerPlaceholder', { letter: String.fromCharCode(64 + index) })
                : answerOptions[index - 1].replace(/\*$/, "")
            }}
          </button>
        </div>
        <div v-if="showExplaination" class="explanation-container">
          <div class="explanation-text">
            <div class="explanation-title">{{ $t('explanationTitle') }}</div>
            <div>{{ explanation }}</div>
          </div>
          <button class="button" @click="handleNextQuestion">
            {{ $t('nextQuestionButton') }}
          </button>
        </div>
      </div>
      <div v-if="modalDisplay" class="overlay">
        <div class="modal-container">
          <div class="result-title">{{ $t('quizResultTitle') }}</div>
          <div>
            <div>{{ $t('currentKeywordLabel') }} {{ currentKeyword }}</div>
            <div>{{ $t('pointsLabel') }} {{ score }}/3</div>
          </div>
          <div class="result-button-container">
            <button class="button" @click="handleQuizResult('same')">
              {{ $t('sameKeywordButton') }}
            </button>
            <button class="button" @click="handleQuizResult('different')">
              {{ $t('differentKeywordButton') }}
            </button>
            <button class="button" @click="handleQuizResult('end')">
              {{ $t('endQuizButton') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-container" data-aos="fade-right">
    <div class="course-categories-section">
      <span class="category-label">{{ $t('categoriesLabel') }}</span>
      <h2 class="category-title">{{ $t('popularTopicsTitle') }}</h2>

      <div class="categories-grid">
        <div v-for="(category, index) in categories" :key="index"
          :class="['category-card', { active: category.isActive }]" @click="setActiveCategory(index)">
          <div class="card-content">
            <div class="icon-wrapper">
              <i :class="category.icon"></i>
            </div>
            <div class="card-text">
              <h3>{{ category.name }}</h3>
              <span>{{ category.courseCount }} {{ $t('coursesLabel') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-container" data-aos="fade-left">
    <div class="courses-container">
      <!-- Header Section -->
      <div class="courses-header">
        <h4 class="courses-subtitle">{{ $t('popularCoursesSubtitle') }}</h4>
        <h2 class="courses-title">{{ $t('popularCoursesTitle') }}</h2>
      </div>

      <!-- Courses Grid -->
      <div class="courses-grid">
        <!-- Course Card  -->
        <div v-for="course in courses" :key="course.id" class="course-card">
          <!-- Top Section -->
          <div class="course-card-top">
            <span class="course-level" :class="course.level.toLowerCase()">{{
              course.level
              }}</span>
            <button class="favorite-btn">
              <i class="fas fa-heart"></i>
            </button>
            <img :src="require(`@/assets/${course.image}`)" :alt="course.title" class="course-image" />
          </div>

          <!-- Details Section -->
          <div class="course-card-content">
            <div class="course-meta">
              <div class="course-lessons">
                <i class="fas fa-book"></i>
                <span>{{ course.lessons }} {{ $t('lessonsLabel') }}</span>
              </div>
              <div class="course-duration">
                <i class="fas fa-clock"></i>
                <span>{{ course.duration }}</span>
              </div>
            </div>

            <h3 class="course-title">{{ course.title }}</h3>

            <div class="course-rating">
              <div class="stars">
                <i v-for="n in 5" :key="n" :class="['fas', n <= course.rating ? 'fa-star' : 'fa-star-o']"></i>
              </div>
              <span class="reviews">({{ course.reviews }})</span>
            </div>

            <div class="course-price">
              <template v-if="course.isFree">
                <span class="free-price">{{ $t('freeLabel') }}</span>
              </template>
              <template v-else>
                <span class="current-price">${{ course.price }}</span>
                <span class="original-price" v-if="course.originalPrice">${{ course.originalPrice }}</span>
              </template>
            </div>

            <div class="course-students">
              <i class="fas fa-user"></i>
              <span>{{ course.students }} {{ $t('studentsLabel') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GPTService, gptServices } from "@/services/gptServices";
import debounce from "lodash/debounce";
import SearchInput from "@/components/Basic/SearchInput.vue";
import QuizRewards from "@/components/FinEdu/Quiz/QuizRewards.vue";
import { showReward } from "@/utils/utils";

export default {
  name: "quizComponent",
  components: {
    SearchInput,
    QuizRewards,
  },
  data() {
    return {
      searchQuery: "",
      score: 0,
      timerCountdown: 0,
      searchKeyword: "",
      currentKeyword: "",
      relatedKeyword: [],
      currentQuestion: -1,
      questionList: [],
      question: "",
      answerOptions: [],
      explanation: "",
      timer: null,
      correctAnswer: "",
      showExplaination: false,
      answerButtonDisabled: true,
      isLoading: false,
      modalDisplay: false,
      is_generating_roadmap: false,
      scrollPosition: 0,
      maxScroll: 0,
      categories: [
        {
          name: "Corporate Finance",
          courseCount: 39,
          icon: "fas fa-backpack",
          isActive: false,
        },
        {
          name: "Financial Accounting",
          courseCount: 45,
          icon: "fas fa-microscope",
          isActive: false,
        },
        {
          name: "Stock Market",
          courseCount: 32,
          icon: "fas fa-users",
          isActive: true,
        },
        {
          name: "Investing",
          courseCount: 28,
          icon: "fas fa-chart-line",
          isActive: false,
        },
        {
          name: "Real Estate",
          courseCount: 56,
          icon: "fas fa-code",
          isActive: false,
        },
        {
          name: "Mergers & Acquisitions (M&A)",
          courseCount: 42,
          icon: "fas fa-bullhorn",
          isActive: false,
        },
        {
          name: "Risk Management",
          courseCount: 35,
          icon: "fas fa-palette",
          isActive: false,
        },
        {
          name: "Financial Planning",
          courseCount: 48,
          icon: "fas fa-mobile-alt",
          isActive: false,
        },
        {
          name: "Wealth Management",
          courseCount: 56,
          icon: "fas fa-code",
          isActive: false,
        },
      ],
      courses: [
        {
          id: 1,
          title: "Financial Accounting for Beginners",
          level: "Beginner",
          image: "courses/course-01.jpg",
          lessons: 12,
          duration: " 6h 30m",
          rating: 4.8,
          reviews: 420,
          isFree: false,
          price: 29.99,
          originalPrice: 49.99,
          students: 1234,
        },
        {
          id: 2,
          title: "Corporate Finance Essentials",
          level: "Intermediate",
          image: "courses/course-02.jpg",
          lessons: 15,
          duration: " 8h 45m",
          rating: 4.5,
          reviews: 350,
          isFree: false,
          price: 39.99,
          originalPrice: 59.99,
          students: 987,
        },
        {
          id: 3,
          title: "Stock Market Investing 101",
          level: "Beginner",
          image: "courses/course-03.jpg",
          lessons: 10,
          duration: " 5h 15m",
          rating: 4.9,
          reviews: 530,
          isFree: true,
          price: 0,
          originalPrice: 0,
          students: 2456,
        },
        {
          id: 4,
          title: "Real Estate Investment Strategies",
          level: "Advanced",
          image: "courses/course-04.jpg",
          lessons: 18,
          duration: " 10h 20m",
          rating: 4.7,
          reviews: 280,
          isFree: false,
          price: 49.99,
          originalPrice: 79.99,
          students: 765,
        },
        {
          id: 5,
          title: "Mergers & Acquisitions (M&A) Fundamentals",
          level: "Intermediate",
          image: "courses/course-05.jpg",
          lessons: 14,
          duration: " 9h 10m",
          rating: 4.6,
          reviews: 320,
          isFree: false,
          price: 44.99,
          originalPrice: 69.99,
          students: 1098,
        },
        {
          id: 6,
          title: "Private Equity & Venture Capital",
          level: "Beginner",
          image: "courses/course-06.jpg",
          lessons: 20,
          duration: " 12h 45m",
          rating: 4.8,
          reviews: 475,
          isFree: false,
          price: 34.99,
          originalPrice: 54.99,
          students: 1876,
        },
      ],
      rewardAmount: 1,
      showingReward: false,
    };
  },
  watch: {
    timerCountdown: {
      immedidate: true,
      handler(newTime) {
        if (newTime <= 0) {
          this.stopTimer();
          this.showCorrectAnswer();
        }
      },
    },
  },
  methods: {
    GenerateQuiz: debounce(async function () {
      if (!this.searchKeyword.trim()) return;
      this.isLoading = true;
      this.answerButtonDisabled = true;
      this.currentQuestion = -1;
      this.question = "";
      this.answerOptions = [];
      this.relatedKeyword = [];
      this.resetQuizState(); // Reset all quiz-related variables

      this.currentKeyword = this.searchKeyword.toUpperCase();
      this.searchKeyword = "";

      try {
        const response = await gptServices([
          {
            role: "system",
            content: "You are a finance quiz generator. Return questions in EXACTLY this format:\n\n" +
              "Question: [question]\n" +
              "A. [option1]\n" +
              "B. [option2]\n" +
              "C. [option3]\n" +
              "D. [option4]\n" +
              "Correct Answer: [A/B/C/D]\n" +
              "Explanation: [explanation]\n\n" +
              "[Repeat for 3 questions]"
          },
          {
            role: "user",
            content: `Generate 3 multiple-choice questions about ${this.currentKeyword} in finance.`
          }
        ]);

        // Improved parsing
        this.questionList = this.parseQuizResponse(response);

        if (this.questionList.length === 0) {
          throw new Error("No valid questions found in response");
        }

        this.currentQuestion = 0;
        this.loadCurrentQuestion();
        await this.generateRelatedKeywords();

      } catch (error) {
        console.error("Quiz generation failed:", error);
        this.question = "Failed to generate questions. Please try again.";
      } finally {
        this.isLoading = false;
        this.answerButtonDisabled = false;
        this.startTimer();
      }
    }, 300),

    // New helper method
    parseQuizResponse(response) {
      const blocks = response.split(/\n\n+/);
      const questions = [];

      blocks.forEach(block => {
        const lines = block.split('\n').filter(l => l.trim());
        if (lines.length < 7) return; // Skip incomplete questions

        questions.push({
          question: lines[0].replace('Question:', '').trim(),
          options: lines.slice(1, 5).map(opt => opt.replace(/^[A-D]\.\s*/, '').trim()),
          correctAnswer: lines[5].replace('Correct Answer:', '').trim(),
          explanation: lines[6].replace('Explanation:', '').trim()
        });
      });

      return questions;
    },

    // Improved question loading
    loadCurrentQuestion() {
      if (this.currentQuestion >= this.questionList.length) return;

      const q = this.questionList[this.currentQuestion];
      this.question = q.question;
      this.answerOptions = q.options;
      this.correctAnswer = q.correctAnswer;
      this.explanation = q.explanation;
    },

    // Reset quiz state properly
    resetQuizState() {
      this.questionList = [];
      this.currentQuestion = -1;
      this.question = "";
      this.answerOptions = [];
      this.correctAnswer = "";
      this.explanation = "";
      this.showExplaination = false;
      this.score = 0;
      this.stopTimer();
    },

    generateLearningRoadmap: async function (roadmapData) {
      try {
        const messages = [
          {
            role: "system",
            content:
              "You are a helpful assistant specializing in creating learning roadmaps. Return only valid JSON.",
          },
          {
            role: "user",
            content: `Create a detailed learning roadmap for "${roadmapData.topic}" at a ${roadmapData.proficiency} level.
            The user will study ${roadmapData.hoursPerDay} hour(s) per day, ${roadmapData.daysPerWeek} day(s) per week, for ${roadmapData.duration} ${roadmapData.period}.
            Only relevant result, no additional text.`,
          },
        ];

        // Use the gptServices function with response_format parameter
        const response = await GPTService.generateStructuredJson({
          messages: [
            {
              role: "system",
              content: `You are an experienced finance educator. You will help the user to create a learning roadmap for the topic provided by the user. Return only valid JSON.
                The learning roadmap should be in the following format:
                {
                 modules: [
                    {
                        title: "Section Title",
                        topics: ["Topic 1", "Topic 2", ...]
                    }
                 ]
                }
                `,
            },
            {
              role: "user",
              content: `Create a detailed learning roadmap for "${roadmapData.topic}" at a ${roadmapData.proficiency} level.
            The user will study ${roadmapData.hoursPerDay} hour(s) per day, ${roadmapData.daysPerWeek} day(s) per week, for ${roadmapData.duration} ${roadmapData.period}.
            Only relevant result, no additional text.
            Every answer should related to quant finance, finance, or economics (either in soft or hard skill. Must be related to the topic of finance)
            `,
            },
          ],
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          maxTokens: 1000,
          jsonSchema: {
            name: "roadmap",
            schema: {
              type: "object",
              properties: {
                roadmap: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      section: { type: "string" },
                      topics: {
                        type: "array",
                        items: { type: "string" },
                      },
                    },
                    required: ["section", "topics"],
                  },
                },
              },
              required: ["roadmap"],
            },
          },
        });

        // Parse the response if it's a string, otherwise return it directly
        return typeof response === "string" ? JSON.parse(response) : response;
      } catch (error) {
        console.error("Error generating roadmap JSON:", error);
        return { roadmap: [] };
      }
    },

    createRoadmap: async function () {
      if (!this.searchQuery.trim() || this.is_generating_roadmap) return;

      this.is_generating_roadmap = true;

      // Collect all form data
      const roadmapData = {
        topic: this.searchQuery,
        proficiency: this.proficiency || "beginner",
        hoursPerDay: this.hoursPerDay || 1,
        daysPerWeek: this.daysPerWeek || 3,
        duration: this.duration || 1,
        period: this.period || "weeks",
      };

      try {
        // output the roadmap data to console
        console.log("Roadmap Data:", roadmapData);
        const roadmap = await this.generateLearningRoadmap(roadmapData);
        // Handle the roadmap data - perhaps emit an event or process it

        // Reset search query after creating roadmap
        this.searchQuery = "";

        this.$router.push({
          name: "LearningRoadMap",
          params: { id: Date.now() },
          query: { source: "quizComponent" },
          state: { roadmapData: roadmap },
        });
      } catch (error) {
        console.error("Error creating roadmap:", error);
      } finally {
        this.is_generating_roadmap = false;
      }
    },
    handleSuggestedChoice: debounce(async function (keyword) {
      this.searchKeyword = keyword;
      this.GenerateQuiz();
    }, 300),
    startTimer() {
      this.timerCountdown = 15;
      this.timer = setInterval(() => {
        this.timerCountdown -= 1;
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.timer);
    },
    stateReset() {
      const initialData = this.$options.data.call(this);
      Object.keys(initialData).forEach((key) => {
        if (key !== "currentKeyword" && key !== "timerCountdown") {
          this[key] = initialData[key];
        }
      });
    },
    async generateRelatedKeywords() {
      const response = await gptServices([
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Generate exactly 10 related keywords for "${this.currentKeyword}" in finance, used in CFA context. Respond with only the keywords, comma-separated. Do not include any introduction, explanation, or additional text.`,
        },
      ]);
      this.relatedKeyword = response.split(",");
    },
    loadCurrentQuestion() {
      if (this.currentQuestion >= this.questionList.length) {
        return;
      }

      const q = this.questionList[this.currentQuestion];
      this.question = q.question;
      this.answerOptions = q.options;
      this.correctAnswer = q.correctAnswer;
      this.explanation = q.explanation;

    },
    handleUserChoice(index) {
      this.stopTimer();
      const isCorrect = String.fromCharCode(64 + index) === this.correctAnswer;
      if (!isCorrect) {
        const incorrectAnswerBtn = document.querySelector(
          `.quizChoices button:nth-child(${index})`
        );
        if (incorrectAnswerBtn) {
          incorrectAnswerBtn.classList.add("answer-button-incorrect");
        }
      } else {
        this.score += 1;

        this.awardFinCoinsForCorrectAnswer()
          .then(() => {
            showReward(this, 1, "quiz");
          })
          .catch((error) => {
            console.error(
              "Failed to award FinCoins for correct answer:",
              error
            );
          });
      }
      this.showCorrectAnswer();
    },
    showCorrectAnswer() {
      this.$emit("messageToBot", this.explanation);
      this.answerButtonDisabled = true;
      this.showExplaination = true;
      if (this.correctAnswer && /^[A-D]$/.test(this.correctAnswer)) {
        const correctIndex = this.correctAnswer.charCodeAt(0) - 64; // Convert A, B, C, D to 1, 2, 3, 4
        const correctAnsBtn = document.querySelector(
          `.quizChoices button:nth-child(${correctIndex})`
        );
        if (correctAnsBtn) {
          correctAnsBtn.classList.add("answer-button-correct");
        }
      }
    },
    handleNextQuestion() {
      this.showExplaination = false;

      // Reset button styles
      document.querySelectorAll('.quizChoices button').forEach(button => {
        button.classList.remove('answer-button-incorrect', 'answer-button-correct');
      });

      this.currentQuestion += 1;
      if (this.currentQuestion >= this.questionList.length) {
        this.modalDisplay = true;
        this.answerButtonDisabled = true;
        return;
      }
      this.loadCurrentQuestion(); // Use the new method
      this.answerButtonDisabled = false;
      this.startTimer();
    },
    handleQuizResult(setting) {
      this.modalDisplay = false;
      if (setting === "same") {
        const temp = this.currentKeyword;
        this.stateReset();
        this.searchKeyword = temp;
        this.GenerateQuiz();
      } else if (setting === "different") {
        const temp = this.currentKeyword;
        this.stateReset();
      } else {
        this.currentKeyword = "";
        this.stateReset();
      }

      // Award FinCoins for completing the quiz if score is good
      if (this.score >= 0) {
        this.awardFinCoinsForQuizCompletion()
          .then(() => {
            showReward(this, 5, "quiz");
          })
          .catch((error) => {
            console.error(
              "Failed to award FinCoins for quiz completion:",
              error
            );
          });
      }
    },

    async awardFinCoinsForCorrectAnswer() {
      return this.$store.dispatch("finCoin/earnFinCoins", {
        amount: 1,
        source: "quiz_correct",
        sourceId: this.currentQuiz?._id,
        description: "Correct quiz answer",
      });
    },

    async awardFinCoinsForQuizCompletion() {
      return this.$store.dispatch("finCoin/earnFinCoins", {
        amount: 5,
        source: "quiz_completion",
        sourceId: this.currentQuiz?._id,
        description: "Completed full quiz session",
      });
    },
    calculateMaxScroll() {
      if (this.$refs.carousel) {
        const container = this.$refs.carousel;
        this.maxScroll = container.scrollWidth - container.clientWidth;
      }
    },
    scrollLeft() {
      this.scrollTo(this.scrollPosition - 200);
    },
    scrollRight() {
      this.scrollTo(this.scrollPosition + 200);
    },
    setActiveCategory(index) {
      this.categories = this.categories.map((category, i) => ({
        ...category,
        isActive: i === index
      }));
    },
    scrollTo(position) {
      const container = this.$refs.carousel;
      if (!container) return;

      // Smooth scroll animation
      container.scrollTo({
        left: position,
        behavior: 'smooth'
      });

      this.scrollPosition = position;
    },

  },

  computed: {
    isAtStart() {
      return this.scrollPosition <= 0;
    },
    isAtEnd() {
      return this.scrollPosition >= this.maxScroll;
    }
  },

  mounted() {
    this.calculateMaxScroll();
    window.addEventListener('resize', this.calculateMaxScroll);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateMaxScroll);
  },
};
</script>

<style scoped>
/* Base Variables */
:root {
  --primary-color: #000000;
  --primary-hover: #1a1a1a;
  --secondary-color: #64748b;
  --success-color: #22c55e;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --input-bg: #ffffff;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

/* Section Container */
.section-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 80px; /* Add space for the fixed navbar */
}

.section-container:not(:first-child) {
  margin-top: 3rem;
}

/* Goal Form Card */
.goal-form-card {
  background: var(--background-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.title {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Form Groups */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

/* Input Styling */
.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
  color: var(--text-secondary);
}

/* Input Row Layout */
.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-half-width {
  width: 100%;
}

/* Duration Input Group */
.duration-input {
  flex: 2;
}

.period-select {
  flex: 1;
}

/* Submit Button */
.submit-button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #1a1a1a;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Quiz Card */
.quiz-card {
  background: var(--background-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  margin-top: 2rem;
}

/* Search Container */
.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-container input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
}

.search-container button {
  padding: 0.75rem 1.5rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-container button:hover {
  background: #1a1a1a;
}

/* Related Keywords */
.related-keyword-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.related-keyword-container::-webkit-scrollbar {
    display: none;
}

.related-keyword-container button {
  padding: 0.5rem 1rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-keyword-container button:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

/* Quiz Area */
.quiz-area {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
}

.quizQuestion {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.quizChoices {
  display: grid;
  gap: 1rem;
}

.answerButton {
  padding: 1rem;
  background: #000000;
  border: 1px solid #000000;
  border-radius: var(--radius-md);
  text-align: left;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.answerButton:hover:not(:disabled) {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.answerButtonActive {
  background: white;
}

.answerButton:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Quiz Info */
.quiz-info {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Explanation Container */
.explanation-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.explanation-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.explanation-text {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

/* Modal */
.overlay {
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
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  max-width: 90%;
  width: 500px;
}

.result-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  text-align: center;
}

.result-button-container {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .section-container {
    padding: 1rem;
    margin-top: 60px;
  }

  .goal-form-card,
  .quiz-card {
    padding: 1.5rem;
  }

  .input-row {
    grid-template-columns: 1fr;
  }

  .quiz-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .search-container {
    flex-direction: column;
  }

  .modal-container {
    width: 90%;
    padding: 1.5rem;
  }
}

/* Carousel Navigation */
.carousel-wrapper {
  position: relative;
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2rem;
  height: 2rem;
  background: #000000;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}

.carousel-nav.left {
  left: -1rem;
}

.carousel-nav.right {
  right: -1rem;
}

.carousel-nav:hover {
  background: #1a1a1a;
}

.submit-button,
.button,
.search-container button,
.answerButton,
.carousel-nav {
  background-color: #000000 !important;
  color: white !important;
}

.submit-button:hover:not(:disabled),
.button:hover:not(:disabled),
.search-container button:hover,
.answerButton:hover:not(:disabled),
.carousel-nav:hover {
  background-color: #1a1a1a !important;
}
</style>

<!-- Courses Section -->
<style scoped>
.courses-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
  font-family: "Arial", sans-serif;
}

.courses-header {
  text-align: center;
  margin-bottom: 3rem;
}

.courses-subtitle {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #4299e1;
  text-align: left;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.courses-title {
  font-size: 2.5rem;
  color: #2d3748;
  font-weight: 700;
  margin: 0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.course-card-top {
  position: relative;
}

.course-level {
  position: absolute;
  top: 15px;
  left: 15px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 1;
}

.course-level.beginner {
  background-color: #48bb78;
  color: white;
}

.course-level.intermediate {
  background-color: #4299e1;
  color: white;
}

.course-level.advanced {
  background-color: #ed8936;
  color: white;
}

.favorite-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn i {
  color: #e53e3e;
  font-size: 1rem;
}

.course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.course-card-content {
  padding: 1.5rem;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #718096;
  font-size: 0.875rem;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item i {
  margin-right: 0.5rem;
  color: #4299e1;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  height: 3.5rem;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.course-rating {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  margin-right: 0.5rem;
}

.stars i {
  color: #f6ad55;
  font-size: 0.875rem;
  margin-right: 2px;
}

.review-count {
  color: #718096;
  font-size: 0.875rem;
}

.course-price {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.free-price {
  font-weight: 700;
  color: #48bb78;
  font-size: 1.25rem;
}

.current-price {
  font-weight: 700;
  color: #2d3748;
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.original-price {
  color: #a0aec0;
  text-decoration: line-through;
  font-size: 0.875rem;
}

.course-students {
  display: flex;
  align-items: center;
  color: #718096;
  font-size: 0.875rem;
}

.course-students i {
  margin-right: 0.5rem;
  color: #4299e1;
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .courses-title {
    font-size: 2rem;
  }
}
</style>


<style scoped>
/* Section 1: Quiz and Goal Form Styles */
.section-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 70vw;
  margin: 0 auto;
  padding: 20px;
}

.goal-form-card,
.quiz-card {
  background: var(--background-color);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  width: 100%;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.title {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.input-group {
  flex: 1;
  display: flex;
}

.input-half-width {
  width: 100%;
}

.duration-input {
  flex: 2;
}

.period-select {
  flex: 1;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-input::placeholder {
  color: var(--text-secondary);
}

.submit-button,
.button {
  width: 100%;
  padding: 0.875rem 1.5rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled),
.button:hover:not(:disabled) {
  background: #1a1a1a;
}

.submit-button:disabled,
.button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-container input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
}

.search-container button {
  padding: 0.75rem 1.5rem;
  background: #000000;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-container button:hover {
  background: #1a1a1a;
}

.suggest-keyword-container {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  width: 60vw;
}

.suggest-keyword-container select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--input-bg);
  color: var(--text-primary);
}

.carousel-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.related-keyword-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.related-keyword-container::-webkit-scrollbar {
  display: none;
}

.related-keyword-container button {
  padding: 0.5rem 1rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.related-keyword-container button:hover {
  background: #000000;
  color: white;
  border-color: #000000;
}

.quiz-area {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
}

.quizQuestion {
  font-size: 1.125rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.quizQuestionEnabled {
  color: var(--text-primary);
}

.quizChoices {
  display: grid;
  gap: 1rem;
}

.answerButton {
  padding: 1rem;
  background: #000000;
  border: 1px solid #000000;
  border-radius: var(--radius-md);
  text-align: left;
  font-size: 1rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.answerButton:hover:not(:disabled) {
  background: #1a1a1a;
  border-color: #1a1a1a;
}

.answerButtonActive {
  background: white;
}

.answerButton:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.explanation-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .courses-title {
    font-size: 2rem;
  }
}
</style>

<!-- Course Categories Section -->
<style scoped>
/* Course Categories Section */
.course-categories-section {
  width: 100%;
  margin-top: 3rem;
  padding: 2rem;
  background: var(--background-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.category-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #000000;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.category-title {
  font-size: 2rem;
  color: #000000;
  font-weight: 700;
  margin: 0 0 2rem 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.category-card.active {
  border-color: #000000;
  background: rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: #000000;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 1.5rem;
  color: white;
}

.card-text {
  flex: 1;
}

.card-text h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #000000;
}

.card-text span {
  font-size: 0.875rem;
  color: #000000;
}

@media (max-width: 768px) {
  .course-categories-section {
    padding: 1.5rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .category-title {
    font-size: 1.5rem;
  }
}
</style>