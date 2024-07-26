<template>
  <div class="quiz-container">
    <header>
      <h1>Keyword-Based Quiz</h1>
      <input type="text" v-model="keywords" placeholder="Enter finance-related keywords" />
      <button @click="generateQuiz">Generate Quiz</button>
    </header>
    <div class="score-timer-box">
      <p>Points: {{ score }}</p>
      <p>Time left: {{ countdown }}s</p>
    </div>
    <div v-if="isQuizStarted">
      <div class="quiz-content">
        <div class="question">
          <p>{{ question.question }}</p>
        </div>
        <div class="answers">
          <button v-for="(answer, index) in question.answers" :key="index" :class="{
        correct: selectedAnswer === index && answer.correct,
        incorrect: selectedAnswer === index && !answer.correct && showIncorrect,
        selected: selectedAnswer === index
      }" @click="checkAnswer(index)">
            {{ answer.text }}
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
        <h2>Next Step</h2>
        <p>You answered correctly!</p>
        <button @click="handlePopupOption('same')">Continue with the same keyword</button>
        <button @click="handlePopupOption('new')">Continue with new keywords</button>
        <button @click="handlePopupOption('end')" class="end-game-btn">End Game</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;

export default {
  name: 'QuizComponent',
  data() {
    return {
      keywords: '',
      question: null,
      selectedAnswer: null,
      countdown: 15,
      timer: null,
      showPopup: false,
      score: 0,
      isQuizStarted: false,
      attempts: 0,
      showIncorrect: false,
    };
  },
  methods: {
    async generateQuiz() {
      // Clear the existing timer before generating a new quiz
      clearInterval(this.timer);

      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: `Generate a finance-related multiple-choice quiz question including the keywords: ${this.keywords}. Provide the question and four answer options. Indicate the correct answer with an asterisk (*). Format: Question: <question>\nA. <option1>\nB. <option2>\nC. <option3>\nD. <option4>` }
          ],
          max_tokens: 150,
          n: 1,
          stop: ["\n\n"]
        }, {
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const completion = response.data.choices[0]?.message?.content?.trim();
        console.log('API Response:', completion); // Debug log

        if (!completion) {
          throw new Error('No completion content returned from OpenAI');
        }

        const quizData = this.parseQuizResponse(completion);
        if (!quizData || !quizData.answers || quizData.answers.length < 4) {
          throw new Error('Incomplete quiz data parsed from API response');
        }

        this.question = quizData;
        this.selectedAnswer = null;
        this.isQuizStarted = true;
        this.attempts = 0;
        this.showIncorrect = false;

        // Start the timer
        this.startTimer();
      } catch (error) {
        console.error('Error generating quiz:', error.message);
      }
    },
    checkAnswer(index) {
      this.selectedAnswer = index;
      clearInterval(this.timer);
      if (this.question.answers[index].correct) {
        this.score += 1;
        setTimeout(() => {
          this.showPopup = true;
        }, 500); // Delay before showing popup
      } else {
        this.attempts += 1;
        if (this.attempts === 2) {
          this.showCorrectAnswer();
          setTimeout(() => {
            this.generateQuiz();
          }, 1500); // Delay before generating new question
        } else {
          this.showIncorrect = true;
          setTimeout(() => {
            this.showIncorrect = false;
            this.startTimer();
          }, 500); // Delay before retrying
        }
      }
    },
    showCorrectAnswer() {
      this.question.answers.forEach((answer, index) => {
        if (answer.correct) {
          this.selectedAnswer = index;
        }
      });
    },
    startTimer() {
      this.countdown = 15;
      this.timer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown === 0) {
          clearInterval(this.timer);
          this.generateQuiz();
        }
      }, 1000);
    },
    handlePopupOption(option) {
      this.showPopup = false;
      if (option === 'same') {
        setTimeout(() => {
          this.generateQuiz();
        }, 500); // Delay before generating new question
      } else if (option === 'new') {
        this.keywords = '';
        this.isQuizStarted = false;
      } else if (option === 'end') {
        alert(`Your final score is: ${this.score}`);
        this.isQuizStarted = false;
        this.score = 0;
      }
    },
    parseQuizResponse(response) {
      const lines = response.split('\n').filter(line => line.trim() !== '');
      console.log('Parsed lines:', lines); // Debug log

      if (lines.length < 5) {
        console.error('Unexpected response format:', response);
        return null;
      }

      const question = lines[0].replace('Question:', '').trim();
      const options = lines.slice(1).map(line => {
        const isCorrect = line.includes('*');
        const cleanedLine = line.replace('*', '').trim();
        return {
          text: cleanedLine,
          correct: isCorrect
        };
      });

      if (options.length < 4) {
        console.error('Incomplete options parsed from response:', response);
        return null;
      }

      return {
        question,
        answers: options
      };
    }
  },
};
</script>

<style scoped>
.quiz-container {
  font-family: 'Roboto', sans-serif;
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

input {
  padding: 10px;
  width: 200px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

input:focus {
  border-color: #007BFF;
  outline: none;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007BFF;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
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
  background-color: #4CAF50;
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
</style>
