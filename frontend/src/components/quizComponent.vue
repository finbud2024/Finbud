<template>
  <div class="section-container">
    <search-input
      v-model="searchQuery"
      @search="createRoadmap"
      placeholder="What do you want to learn today..."
      data-aos="flip-right"
    />

    <div class="goal-form-card" data-aos="zoom-in-up">
      <h1 class="title">What's your goal?</h1>

      <div class="form-group">
        <label for="proficiency">Proficiency level</label>
        <select id="proficiency" v-model="proficiency" class="form-select">
          <option value="" disabled selected>---</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div class="form-group">
        <label for="learning-hours">You will learn</label>
        <div class="input-row">
          <div class="input-group input-half-width">
            <input
              type="number"
              id="hours-per-day"
              v-model="hoursPerDay"
              placeholder="Hours per day"
              min="0"
              class="form-input"
            />
          </div>
          <div class="input-group input-half-width">
            <input
              type="number"
              id="days-per-week"
              v-model="daysPerWeek"
              placeholder="Days per week"
              min="0"
              max="7"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>In period</label>
        <div class="input-row">
          <div class="input-group duration-input">
            <input
              type="number"
              v-model="duration"
              placeholder="Duration"
              min="1"
              class="form-input"
            />
          </div>
          <div class="input-group period-select">
            <select v-model="period" class="form-select">
              <option value="" disabled selected>Select period</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
      </div>

      <button
        class="submit-button"
        @click="createRoadmap"
        :disabled="!searchQuery.trim() || is_generating_roadmap"
      >
        {{
          is_generating_roadmap
            ? "Personalizing your roadmap..."
            : "Create my roadmap"
        }}
      </button>
    </div>
  </div>

  <div class="section-container" data-aos="flip-right">
    <div class="quiz-card">
      <h1 class="title">Keyword-Based Quiz</h1>
      <div class="form-group">
        <label for="search-keyword">Put your own keyword</label>
        <div id="search-keyword" class="search-container">
          <input
            style="height: 100%; margin-bottom: 0"
            type="text"
            v-model="searchKeyword"
            :disabled="isLoading"
            placeholder="Enter a finance-related keyword"
            @keyup.enter="GenerateQuiz"
          />
          <button class="button" @click="GenerateQuiz">Generate Quiz</button>
        </div>
      </div>
      <div class="form-group">
        <label for="suggest-topic">OR recieve a suggestion</label>
        <div id="suggest-topic" class="suggest-keyword-container">
          <select v-model="suggestTopic">
            <option value="">Select a quiz type (optional)</option>
            <option value="Saving Vs Investing">Saving vs Investing</option>
            <option value="Budgeting">Budgeting</option>
            <option value="Asset Allocation">Asset Allocation</option>
          </select>
          <select v-model="suggestDifficulty">
            <option value="">Select difficulty (optional)</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <button
            class="button"
            :disabled="isLoading"
            @click="keywordSuggestion"
          >
            Suggest
          </button>
        </div>
      </div>
      <div class="form-group" v-if="relatedKeyword.length !== 0">
        <label for="related-keyword">Related keyword</label>
        <div id="related-keyword" class="related-keyword-container">
          <button
            v-for="keyword in relatedKeyword"
            :key="keyword"
            :disabled="isLoading"
            class="button"
            @click="handleSuggestedChoice(keyword)"
          >
            {{ keyword }}
          </button>
        </div>
      </div>
      <div v-if="currentKeyword" class="quiz-info">
        <div>Current Keyword: {{ currentKeyword }}</div>
        <div>Points: {{ score }}</div>
        <div>Time Left: {{ timerCountdown }}</div>
      </div>
      <div class="quiz-area">
        <div
          :class="[
            'quizQuestion',
            { quizQuestionEnabled: question.length !== 0 },
          ]"
        >
          {{ currentQuestion === -1 ? "Question will appear here" : question }}
        </div>
        <div class="quizChoices">
          <button
            v-for="index in 4"
            :key="index"
            :disabled="answerButtonDisabled"
            @click="handleUserChoice(index)"
            :class="[
              'answerButton',
              { answerButtonActive: answerOptions.length !== 0 },
            ]"
          >
            {{
              answerOptions.length === 0
                ? `Answer ${String.fromCharCode(64 + index)}`
                : answerOptions[index - 1].replace(/\*$/, "")
            }}
          </button>
        </div>
        <div v-if="showExplaination" class="explanation-container">
          <div class="explanation-text">
            <div class="explanation-title">Explanation:</div>
            <div>{{ explanation }}</div>
          </div>
          <button class="button" @click="handleNextQuestion">
            Next Question
          </button>
        </div>
      </div>
      <div v-if="modalDisplay" class="overlay">
        <div class="modal-container">
          <div class="result-title">Quiz Result</div>
          <div>
            <div>Keyword: {{ currentKeyword }}</div>
            <div>score: {{ score }}/3</div>
          </div>
          <div class="result-button-container">
            <button class="button" @click="handleQuizResult('same')">
              New Game With Same Keyword
            </button>
            <button class="button" @click="handleQuizResult('different')">
              New Game With Different Keyword
            </button>
            <button class="button" @click="handleQuizResult('end')">End</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="section-container" data-aos="fade-right">
    <div class="course-categories-section">
      <span class="category-label">COURSE CATEGORIES</span>
      <h2 class="category-title">Popular Topics To Learn</h2>

      <div class="categories-grid">
        <div
          v-for="(category, index) in categories"
          :key="index"
          :class="['category-card', { active: category.isActive }]"
          @click="setActiveCategory(index)"
        >
          <div class="card-content">
            <div class="icon-wrapper">
              <i :class="category.icon"></i>
            </div>
            <div class="card-text">
              <h3>{{ category.name }}</h3>
              <span>{{ category.courseCount }} Courses</span>
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
        <h4 class="courses-subtitle">POPULAR COURSES</h4>
        <h2 class="courses-title">Our Popular Courses</h2>
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
            <img
              :src="require(`@/assets/${course.image}`)"
              :alt="course.title"
              class="course-image"
            />
          </div>

          <!-- Details Section -->
          <div class="course-card-content">
            <div class="course-meta">
              <div class="course-lessons">
                <i class="fas fa-book"></i>
                <span>{{ course.lessons }} Lessons</span>
              </div>
              <div class="course-duration">
                <i class="fas fa-clock"></i>
                <span>{{ course.duration }}</span>
              </div>
            </div>

            <h3 class="course-title">{{ course.title }}</h3>

            <div class="course-rating">
              <div class="stars">
                <i
                  v-for="n in 5"
                  :key="n"
                  :class="['fas', n <= course.rating ? 'fa-star' : 'fa-star-o']"
                ></i>
              </div>
              <span class="reviews">({{ course.reviews }})</span>
            </div>

            <div class="course-price">
              <template v-if="course.isFree">
                <span class="free-price">Free</span>
              </template>
              <template v-else>
                <span class="current-price">${{ course.price }}</span>
                <span class="original-price" v-if="course.originalPrice"
                  >${{ course.originalPrice }}</span
                >
              </template>
            </div>

            <div class="course-students">
              <i class="fas fa-user"></i>
              <span>{{ course.students }} Students</span>
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
import SearchInput from "@/components/basic/SearchInput.vue";

export default {
  name: "quizComponent",
  components: {
    SearchInput,
  },
  data() {
    return {
      searchQuery: "",
      score: 0,
      timerCountdown: 0,
      searchKeyword: "",
      currentKeyword: "",
      relatedKeyword: [],
      suggestTopic: "",
      suggestDifficulty: "",
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
      if (this.searchKeyword.length === 0) return;
      this.isLoading = true;
      this.answerButtonDisabled = true;
      this.currentQuestion = -1;
      this.question = "";
      this.answerOptions = [];
      this.relatedKeyword = [];
      //this part below setup to start the quiz
      this.currentKeyword = this.searchKeyword.toUpperCase();
      this.searchKeyword = "";
      const buttons = document.querySelectorAll(".quizChoices button");
      buttons.forEach((button) => {
        button.classList.remove("answer-button-incorrect");
        button.classList.remove("answer-button-correct");
      });
      this.showExplaination = false;
      this.score = 0;
      this.stopTimer();
      // ------------------------------------------------------
      const response = await gptServices([
        {
          role: "system",
          content:
            "You are a helpful assistant specializing in finance education.",
        },
        {
          role: "user",
          content: `Generate 3 finance-related multiple-choice quiz focusing on the keyword: ${this.currentKeyword}.
                        For each question:
                        - Provide a clear and concise question, along with four distinct answer options.
                        - Include a detailed explanation for the answer, which should be factually accurate and relevant to the question.
                        - The question genereated should be generated right behind the word "question"
                        - There should be not extra space in between the question, the options, and the exaplinataion
                        - Provide the Correct Answer in the field Called Correct Answer, and it should either be A,B, C, or D
                        - It should follow exactly how the format is as below:
                        Question: <question>
                        A. <option1>
                        B. <option2>
                        C. <option3>
                        D. <option4>
                        Correct Answer: <A,B,C,D>
                        Explanation: <explanation>`,
        },
      ]);
      this.questionList = response.split(/\n\n+/);
      this.currentQuestion = 0;
      this.parseCurrentQuestion();
      await this.generateRelatedKeywords();
      this.isLoading = false;
      this.answerButtonDisabled = false;
      this.startTimer();
    }, 300),

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

    keywordSuggestion: debounce(async function () {
      if (this.suggestTopic.length === 0 || this.suggestDifficulty.length === 0)
        return;
      this.searchKeyword = await gptServices([
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Generate a single keyword in finance about 
                        ${
                          this.selectedQuiz
                            ? this.selectedQuiz
                            : "Saving Vs Investing"
                        } 
                        at a 
                        ${
                          this.suggestDifficulty
                            ? this.suggestDifficulty
                            : "hard"
                        }
                        difficulty level. The keyword should be specific and relevant to create a quiz question about finance.
                        - no need to add extra question, only the keyword is needed for the response. Please strictly follow the requirement`,
        },
      ]);
      this.suggestTopic = "";
      this.suggestDifficulty = "";

      await this.GenerateQuiz();
    }, 300),
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
          content: `Generate 3 related keywords for "${this.currentKeyword}" in finance and is used in CFA. Provide the keywords as a comma-separated list.`,
        },
      ]);
      this.relatedKeyword = response.split(",");
    },
    parseCurrentQuestion() {
      if (this.currentQuestion >= this.questionList.length) {
        return;
      }

      const questionBlock = this.questionList[this.currentQuestion]
        .trim()
        .split("\n");

      this.question = questionBlock[0].toLowerCase().startsWith("question")
        ? questionBlock[0].substring(10)
        : questionBlock[0];

      this.answerOptions = questionBlock
        .slice(1, 5)
        .map((option) => option.trim());

      const correctAnswerLine = questionBlock.find((line) =>
        line.startsWith("Correct Answer:")
      );
      this.correctAnswer = correctAnswerLine
        ? correctAnswerLine.split(":")[1].trim()
        : "";

      this.explanation =
        questionBlock
          .find((line) => line.startsWith("Explanation:"))
          ?.substring("Explanation:".length)
          .trim() || "";
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
      //reset buton style;
      const buttons = document.querySelectorAll(".quizChoices button");
      buttons.forEach((button) => {
        button.classList.remove("answer-button-incorrect");
        button.classList.remove("answer-button-correct");
      });
      this.currentQuestion += 1;
      if (this.currentQuestion >= this.questionList.length) {
        this.modalDisplay = true;
        this.answerButtonDisabled = true;
        return;
      }
      this.parseCurrentQuestion();
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
        this.suggestTopic = "random";
        this.suggestDifficulty = "random";
        this.keywordSuggestion();
      } else {
        this.currentKeyword = "";
        this.stateReset();
      }
    },
  },
};
</script>

<style scoped>
.quiz-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-family: sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: left;
}

.search-container {
  margin-bottom: 1.5rem;
  width: 60vw;
  display: flex;
  gap: 0.75rem;
}

.search-container > input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  margin-bottom: 0.75rem;
}

.search-container > input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.button {
  width: 100%;
  padding: 0.875rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.button:hover {
  background: #2c5282;
  transform: none;
}

.suggest-keyword-container {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  width: 60vw;
}

.suggest-keyword-container > select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.related-keyword-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.quiz-area {
  background: white;
  border-radius: 12px;
  width: 60vw;
  max-width: 60vw;
}

.quizQuestion {
  font-family: sans-serif;
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.quizQuestionEnabled {
  color: black;
}

.quizChoices {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.answerButton {
  width: 100%;
  padding: 0.875rem;
  background: white;
  color: #2c3e50;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.answerButton:hover {
  background: #f7fafc;
}

.answer-button-correct {
  background-color: #4caf50 !important;
  color: white !important;
}

.answer-button-incorrect {
  background-color: red !important;
  color: white !important;
}

.answerButtonActive {
  color: black;
}

.answerButton:hover {
  cursor: pointer;
}

.explanation-container {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.explanation-title {
  font-size: 1.17em;
  font-weight: bold;
}

.explanation-text {
  margin-bottom: 1.5rem;
}

.quiz-info {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.overlay {
  z-index: 100;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: fit-content;
  height: fit-content;
  transform: translate(-50%, -50%);
  background: white;
  border: 2px solid red;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
}

.result-title {
  font-size: 40px;
  font-weight: 600;
}

.result-button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

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

.goal-form-card {
  background: white;
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  font-family: sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-family: sans-serif;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.input-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.input-group {
  flex: 1;
  display: flex;
}

.input-half-width {
  flex: 1;
}

.duration-input {
  flex: 7;
}

.period-select {
  flex: 3;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input::placeholder {
  font-style: italic;
  color: #a0aec0;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%234A5568' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.duration-input {
  flex: 2;
}

.period-select {
  flex: 1;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}

.submit-button:hover {
  background: #2c5282;
}

.course-categories-section {
  width: 100%;
  margin: 0 auto;
}

.category-label {
  display: block;
  color: #4299e1;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.category-title {
  font-size: 2.5rem;
  color: #1a365d;
  font-weight: 700;
  text-align: center;
  margin: 1.5rem 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-card {
  background: #f7fafc;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover:not(.active) {
  background: #edf2f7;
}

.category-card.active {
  background: #4299e1;
  color: white;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.active .icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-text h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
}

.card-text span {
  font-size: 0.875rem;
  color: #718096;
}

.active .card-text span {
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive Styles */
@media (max-width: 640px) {
  .goal-form-card {
    padding: 1.5rem;
  }

  .input-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .title {
    font-size: 1.5rem;
  }
}

@container quizComponent (max-width: 400px) {
  .title {
    font-size: clamp(2rem, 10%, 3rem);
  }

  .quiz-container {
    width: calc(100% - 40px);
  }

  .search-container {
    flex-direction: column;
    gap: 10px;
  }

  .search-container > input {
    width: 100%;
  }

  .suggest-keyword-container {
    flex-direction: column;
  }

  .suggest-keyword-container > select {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .course-categories-section {
    padding: 2rem 1rem;
  }

  .category-title {
    font-size: 1.75rem;
  }
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
  background: var(--card-bg); /* Thay màu trắng tĩnh bằng biến */
  border-radius: 12px;
  padding: 2.5rem;
  width: 100%;
  box-shadow: 0 4px 6px var(--shadow-color); /* Dùng biến cho shadow */
}

.title {
  font-family: sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary); /* Thay #2c3e50 bằng biến */
  margin-bottom: 2rem;
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-family: sans-serif;
  font-weight: 500;
  color: var(--text-primary); /* Thay #2c3e50 bằng biến */
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.input-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.input-group {
  flex: 1;
  display: flex;
}

.input-half-width {
  flex: 1;
}

.duration-input {
  flex: 7;
}

.period-select {
  flex: 3;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color); /* Thay #e2e8f0 bằng biến */
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--card-bg); /* Thay trắng bằng biến */
  color: var(--text-primary); /* Thêm màu chữ */
}

.form-input::placeholder {
  font-style: italic;
  color: #a0aec0; /* Giữ màu này hoặc thay bằng biến nếu muốn */
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%234A5568' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.submit-button,
.button {
  width: 100%;
  padding: 0.875rem;
  background: #3182ce; /* Giữ màu này hoặc dùng biến nếu muốn */
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover,
.button:hover {
  background: #2c5282;
}

.search-container {
  margin-bottom: 1.5rem;
  width: 60vw;
  display: flex;
  gap: 0.75rem;
}

.search-container > input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color); /* Thay #e2e8f0 */
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--card-bg); /* Thay trắng */
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.search-container > input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.suggest-keyword-container {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  width: 60vw;
}

.suggest-keyword-container > select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color); /* Thay #e2e8f0 */
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: var(--card-bg); /* Thay trắng */
  color: var(--text-primary);
}

.related-keyword-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.quiz-area {
  background: var(--card-bg); /* Thay trắng */
  border-radius: 12px;
  width: 60vw;
  max-width: 60vw;
}

.quizQuestion {
  font-family: sans-serif;
  font-size: 1.2rem;
  color: var(--text-primary); /* Thay #2c3e50 */
  margin-bottom: 1.5rem;
}

.quizQuestionEnabled {
  color: var(--text-primary); /* Đảm bảo màu chữ thay đổi */
}

.quizChoices {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.answerButton {
  width: 100%;
  padding: 0.875rem;
  background: var(--card-bg); /* Thay trắng */
  color: var(--text-primary); /* Thay #2c3e50 */
  border: 1px solid var(--border-color); /* Thay #e2e8f0 */
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.answerButton:hover {
  background: var(--hover-bg); /* Thay #f7fafc */
}

.answer-button-correct {
  background-color: #4caf50 !important;
  color: white !important;
}

.answer-button-incorrect {
  background-color: red !important;
  color: white !important;
}

.answerButtonActive {
  color: var(--text-primary); /* Đảm bảo màu chữ thay đổi */
}

.explanation-container {
  background: var(--content-bg); /* Thay #f8fafc */
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  color: var(--text-primary); /* Thêm màu chữ */
}

.explanation-title {
  font-size: 1.17em;
  font-weight: bold;
  color: var(--text-primary); /* Đảm bảo màu chữ thay đổi */
}

.quiz-info {
  background: var(--content-bg); /* Thay #f8fafc */
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: var(--text-primary); /* Thay #2c3e50 */
}

.overlay {
  z-index: 100;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(0, 0, 0, 0.5); /* Giữ nguyên vì là overlay */
}

.modal-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: fit-content;
  height: fit-content;
  transform: translate(-50%, -50%);
  background: var(--card-bg); /* Thay trắng */
  border: 2px solid red;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 10px;
  color: var(--text-primary); /* Thêm màu chữ */
}

.result-title {
  font-size: 40px;
  font-weight: 600;
  color: var(--text-primary); /* Đảm bảo màu chữ thay đổi */
}

.result-button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.course-categories-section {
  width: 100%;
  margin: 0 auto;
}

.category-label {
  display: block;
  color: #4299e1; /* Giữ màu này hoặc dùng biến nếu muốn */
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.category-title {
  font-size: 2.5rem;
  color: var(--text-primary); /* Thay #1a365d */
  font-weight: 700;
  text-align: center;
  margin: 1.5rem 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-card {
  background: var(--content-bg); /* Thay #f7fafc */
  border-radius: 12px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card:hover:not(.active) {
  background: var(--hover-bg); /* Thay #edf2f7 */
}

.category-card.active {
  background: #4299e1; /* Giữ màu này hoặc dùng biến */
  color: white;
}

.card-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(66, 153, 225, 0.1);
  color: #4299e1;
}

.active .icon-wrapper {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.card-text h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
  color: var(--text-primary); /* Thêm màu chữ */
}

.card-text span {
  font-size: 0.875rem;
  color: #718096; /* Giữ màu này hoặc dùng biến */
}

.active .card-text span {
  color: rgba(255, 255, 255, 0.8);
}

/* Responsive Styles */
@media (max-width: 640px) {
  .goal-form-card,
  .quiz-card {
    padding: 1.5rem;
  }

  .input-row {
    flex-direction: column;
    gap: 0.75rem;
  }

  .title {
    font-size: 1.5rem;
  }
}

@container quizComponent (max-width: 400px) {
  .title {
    font-size: clamp(2rem, 10%, 3rem);
  }

  .search-container {
    flex-direction: column;
    gap: 10px;
  }

  .search-container > input {
    width: 100%;
  }

  .suggest-keyword-container {
    flex-direction: column;
  }

  .suggest-keyword-container > select {
    width: 100%;
  }
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .category-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style scoped>
/* Section 2: Courses Section */
.courses-container {
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
  color: var(--text-primary); /* Thay #2d3748 */
  font-weight: 700;
  margin: 0;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.course-card {
  background: var(--card-bg); /* Thay trắng */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px var(--shadow-color); /* Dùng biến shadow */
  transition: all 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px var(--shadow-color);
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
  background: var(--card-bg); /* Thay trắng */
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 2px 5px var(--shadow-color);
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
  color: #718096; /* Giữ màu này hoặc dùng biến */
  font-size: 0.875rem;
}

.course-meta i {
  margin-right: 0.5rem;
  color: #4299e1;
}

.course-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary); /* Thay #2d3748 */
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

.reviews {
  color: #718096; /* Giữ màu này hoặc dùng biến */
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
  color: var(--text-primary); /* Thay #2d3748 */
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.original-price {
  color: #a0aec0; /* Giữ màu này hoặc dùng biến */
  text-decoration: line-through;
  font-size: 0.875rem;
}

.course-students {
  display: flex;
  align-items: center;
  color: #718096; /* Giữ màu này hoặc dùng biến */
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