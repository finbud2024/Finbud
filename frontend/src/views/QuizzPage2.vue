<template>
  <div class="quiz-container">
    <header>
      <h1>Keyword-Based Quiz</h1>
      <div>
        <br />
        Put your own keyword
        <br />
        <br />
      </div>
      <div class="search-container">
        <input
          type="text"
          v-model="searchKeyword"
          placeholder="Enter a finance-related keyword"
        />
        <button @click="searchOrGenerateKeyword">Generate Quiz</button>
      </div>
      <div>
        <br class="instruction" />
        OR receive a suggestion
        <br />
        <br />
      </div>
      <div class="dropdown-container">
        <select v-model="selectedQuiz" class="dropdown">
          <option disabled value="">Select a quiz type (optional)</option>
          <option value="saving">Saving vs Investing</option>
          <option value="budgeting">Budgeting</option>
          <option value="assetAllocation">Asset Allocation</option>
        </select>
        <select v-model="selectedDifficulty" class="dropdown">
          <option disabled value="">Select difficulty (optional)</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button @click="searchOrGenerateKeyword">Suggest</button>
      </div>
    </header>
    <div v-if="relatedKeywords.length > 0" class="related-keywords">
      <p>Related Keywords:</p>
      <button
        v-for="keyword in relatedKeywords"
        :key="keyword"
        @click="selectRelatedKeyword(keyword)"
        class="keyword-button"
      >
        {{ keyword }}
      </button>
    </div>
    <div v-if="generatedKeyword" class="keyword-display">
      <p>Current Keyword: {{ generatedKeyword }}</p>
      <button @click="generateQuiz">Generate Quiz</button>
    </div>
    <div v-if="isQuizStarted" class="score-timer-box">
      <p>Points: {{ score }}</p>
      <p>Question {{ currentQuestionIndex + 1 }} of 3</p>
      <p>Time left: {{ countdown }}s</p>
    </div>
    <div v-if="isQuizStarted">
      <div class="quiz-content">
        <div class="question">
          <p>{{ currentQuestion.question }}</p>
        </div>
        <div class="answers">
          <button
            v-for="(answer, index) in currentQuestion.answers"
            :key="index"
            :class="{
              correct: showExplanation && answer.correct,
              incorrect:
                showExplanation && selectedAnswer === index && !answer.correct,
              selected: selectedAnswer === index,
            }"
            @click="checkAnswer(index)"
            :disabled="showExplanation"
          >
            {{ answer.text }}
          </button>
        </div>
        <div v-if="showExplanation" class="explanation-box">
          <h3>Explanation:</h3>
          <p>{{ currentQuestion.explanation }}</p>
          <button @click="nextQuestion" class="next-button">
            {{ currentQuestionIndex < 2 ? "Next Question" : "Finish Quiz" }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="placeholder-content">
      <div class="question">
        <p>Question will appear here.</p>
      </div>
      <div class="answers">
        <button class="placeholder">Answer A</button>
        <button class="placeholder">Answer B</button>
        <button class="placeholder">Answer C</button>
        <button class="placeholder">Answer D</button>
      </div>
    </div>

    <div v-if="showPopup" class="modal-overlay">
      <div class="modal">
        <h2>Quiz Completed</h2>
        <p>Your final score is: {{ score }} out of 3</p>
        <button @click="handlePopupOption('same')">
          Play again with the same settings
        </button>
        <button @click="handlePopupOption('new')">Change settings</button>
        <button @click="handlePopupOption('end')" class="end-game-btn">
          End Game
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { gptServices } from "@/services/gptServices";

const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;

export default {
  name: "QuizComponent",
  data() {
    return {
      searchKeyword: "",
      selectedQuiz: "",
      selectedDifficulty: "",
      generatedKeyword: "",
      relatedKeywords: [],
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      countdown: 15,
      timer: null,
      showPopup: false,
      score: 0,
      isQuizStarted: false,
      showExplanation: false,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || {};
    },
  },
  methods: {
    async searchOrGenerateKeyword() {
      if (this.searchKeyword) {
        this.generatedKeyword = this.searchKeyword;
        await this.generateRelatedKeywords();
      } else {
        await this.generateKeyword();
      }
    },
    async generateKeyword() {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              {
                role: "user",
                content: `Generate a single keyword in finance and is used in CFA${
                  this.selectedQuiz ? ` focusing on ${this.selectedQuiz}` : ""
                }${
                  this.selectedDifficulty
                    ? ` at a ${this.selectedDifficulty} difficulty level`
                    : ""
                }. The keyword should be specific and relevant to create a quiz question about finance.`,
              },
            ],
            max_tokens: 50,
            n: 1,
            stop: ["\n"],
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        this.generatedKeyword =
          response.data.choices[0]?.message?.content?.trim();
        await this.generateRelatedKeywords();
      } catch (error) {
        console.error("Error generating keyword:", error.message);
        alert("Failed to generate keyword. Please try again.");
      }
    },
    async generateRelatedKeywords() {
      gptServices([
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: `Generate 3 related keywords for "${
            this.generatedKeyword
          }" in finance and is used in CFA${
            this.selectedQuiz ? ` focusing on ${this.selectedQuiz}` : ""
          }${
            this.selectedDifficulty
              ? ` at a ${this.selectedDifficulty} difficulty level`
              : ""
          }. Provide the keywords as a comma-separated list.`,
        },
      ]);
      const relatedKeywordsString =
        response.data.choices[0]?.message?.content?.trim();
      this.relatedKeywords = relatedKeywordsString
        .split(",")
        .map((keyword) => keyword.trim());
    },
    selectRelatedKeyword(keyword) {
      this.generatedKeyword = keyword;
      this.relatedKeywords = [];
    },
    async generateQuiz() {
      if (!this.generatedKeyword) {
        alert("Please generate a keyword before creating the quiz.");
        return;
      }

      this.stopTimer();

      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant specializing in finance education.",
              },
              {
                role: "user",
                content: `Generate 3 finance-related multiple-choice quiz questions${
                  this.selectedQuiz ? ` about ${this.selectedQuiz}` : ""
                }${
                  this.selectedDifficulty
                    ? ` at a ${this.selectedDifficulty} difficulty level`
                    : ""
                }, focusing on the keyword: ${this.generatedKeyword}.
                For each question:
                - Provide a clear and concise question, along with four distinct answer options.
                - Clearly mark the correct answer with an asterisk (*) at the end of the correct option text. Only the correct answer should have this asterisk, and no other options should have it.
                - Include a detailed explanation for the answer, which should be factually accurate and relevant to the question.
                - Format each question as follows:

                  Question: <question>
                  A. <option1>
                  B. <option2>
                  C. <option3>
                  D. <option4>
                  Explanation: <explanation>

                  Ensure the response adheres strictly to this format and includes the asterisk only on the correct option for each question.`,
              },
            ],
            max_tokens: 1000,
            n: 1,
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        const completion = response.data.choices[0]?.message?.content?.trim();
        console.log("API Response:", completion);

        if (!completion) {
          throw new Error("No completion content returned from OpenAI");
        }

        this.questions = this.parseQuizResponse(completion);
        if (!this.questions || this.questions.length < 3) {
          throw new Error("Incomplete quiz data parsed from API response");
        }

        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.isQuizStarted = true;
        this.score = 0;
        this.showExplanation = false;

        this.startTimer();
      } catch (error) {
        console.error("Error generating quiz:", error);
        alert("Failed to generate quiz. Please try again.");
      }
    },

    parseQuizResponse(response) {
      const questions = response
        .split(/Question \d+:/)
        .filter((q) => q.trim() !== "");

      return questions.map((questionBlock) => {
        const lines = questionBlock
          .split("\n")
          .filter((line) => line.trim() !== "");

        const question = lines[0].trim();
        const options = lines.slice(1, 5).map((line) => {
          const [letter, ...textParts] = line.split(".");
          const text = textParts.join(".").trim();
          const isCorrect = text.includes("*");
          return {
            text: text.replace("*", "").trim(),
            correct: isCorrect,
          };
        });

        const explanation = lines
          .slice(5)
          .join(" ")
          .replace("Explanation:", "")
          .trim();

        return {
          question,
          answers: options,
          explanation,
        };
      });
    },
    checkAnswer(index) {
      this.selectedAnswer = index;
      this.stopTimer();
      this.showExplanation = true;
      if (this.currentQuestion.answers[index].correct) {
        this.score += 1;
      }
    },

    startTimer() {
      this.countdown = 15;
      this.timer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown === 0) {
          this.stopTimer();
          this.showExplanation = true;
        }
      }, 1000);
    },

    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    nextQuestion() {
      this.showExplanation = false;
      this.selectedAnswer = null;

      if (this.currentQuestionIndex < 2) {
        this.currentQuestionIndex++;
        this.startTimer();
      } else {
        this.showPopup = true;
      }
    },

    handlePopupOption(option) {
      this.showPopup = false;
      if (option === "same") {
        this.generateQuiz();
      } else if (option === "new") {
        this.searchKeyword = "";
        this.generatedKeyword = "";
        this.selectedQuiz = "";
        this.selectedDifficulty = "";
        this.isQuizStarted = false;
        this.relatedKeywords = [];
        this.score = 0;
        this.questions = [];
        this.currentQuestionIndex = 0;
      } else if (option === "end") {
        this.isQuizStarted = false;
        this.score = 0;
        this.questions = [];
        this.currentQuestionIndex = 0;
      }
    },
  },
};
</script>

<style scoped>
.quiz-container {
  padding: 20px;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  margin-bottom: 5%;
  background: #f4f4f4;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  transition: transform 0.3s ease;
}

header {
  margin-bottom: 20px;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.dropdown-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

input,
.dropdown {
  padding: 10px;
  width: 200px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus,
.dropdown:focus {
  border-color: #007bff;
  outline: none;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.related-keywords {
  margin-top: 10px;
}

.keyword-button {
  margin: 5px;
  padding: 5px 10px;
  background-color: #e0e0e0;
  color: #333;
}

.keyword-display {
  margin-top: 20px;
  padding: 10px;
  background-color: #e7f7df;
  border-radius: 8px;
}

.quiz-content {
  margin-top: 20px;
}

.question p {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}

.answers button {
  color: black;
  display: block;
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  font-size: 18px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.answers button:hover {
  transform: translateY(-2px);
  background-color: #e0e0e0;
}

.answers button.correct {
  background-color: #4caf50;
  /* Green */
  color: white;
}

.answers button.incorrect {
  background-color: #f44336;
  /* Red */
  color: white;
}

.answers button.selected:not(.correct):not(.incorrect) {
  background-color: #ddd;
}

.score-timer-box {
  background-color: #e7f7df;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 20px;
}

.score-timer-box p {
  margin: 5px 0;
  font-size: 18px;
  color: #333;
}

.timer {
  margin-top: 20px;
}

.timer p {
  font-size: 18px;
}

.placeholder-content .question p,
.placeholder-content .answers button {
  color: #bbb;
}

.placeholder-content .answers button {
  background-color: #f9f9f9;
  cursor: default;
}

.placeholder-content .answers button.placeholder {
  border: 1px solid #ccc;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.modal h2 {
  margin-bottom: 20px;
}

.modal button {
  margin: 10px;
}

.modal button.end-game-btn {
  background-color: #f44336;
  color: white;
}

@media (max-width: 600px) {
  .quiz-container {
    padding: 10px;
    font-size: 14px;
  }

  input {
    width: 150px;
    padding: 8px;
  }

  button {
    padding: 8px 16px;
    font-size: 14px;
  }

  .score-timer-box p {
    font-size: 16px;
  }

  .question p {
    font-size: 20px;
  }

  .answers button {
    padding: 12px;
    font-size: 16px;
  }

  .modal {
    padding: 15px;
  }

  .modal button {
    padding: 8px 12px;
  }
}

.explanation-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #f0f0f0;
  border-radius: 8px;
  text-align: left;
}

.explanation-box h3 {
  margin-bottom: 10px;
  color: #333;
}

.explanation-box p {
  color: #555;
  line-height: 1.5;
}

.answers button.correct {
  background-color: #4caf50;
  color: white;
}

.answers button.incorrect {
  background-color: #f44336;
  color: white;
}

.next-button {
  margin-top: 20px;
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.next-button:hover {
  background-color: #218838;
}
</style>
