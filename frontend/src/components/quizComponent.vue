<template>
    <div class="quizContainer">
        <div class="title">Keyword-Based Quiz</div>
        <div> Put your own keyword</div>
        <div class="searchContainer">
            <input type="text" v-model="searchKeyword" placeholder="Enter a finance-related keyword"
                @keyup.enter="GenerateQuiz" />
            <button class="button" @click="GenerateQuiz">Generate Quiz</button>
        </div>
        <div>OR recieve a suggestion</div>
        <div class="suggestKeywordContainer">
            <select v-model="suggestTopic">
                <option disabled value="">Select a quiz type (optional)</option>
                <option value="Saving Vs Investing">Saving vs Investing</option>
                <option value="Budgeting">Budgeting</option>
                <option value="Asset Allocation">Asset Allocation</option>
            </select>
            <select v-model="suggestDifficulty">
                <option disabled value="">Select difficulty (optional)</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
            <button class="button" @click="keywordSuggestion">Suggest</button>
        </div>
        <div v-if="relatedKeyword.length !== 0">
            <div>Related keyword</div>
            <div class="relatedKeywordContainer">
                <button v-for="keyword in relatedKeyword" :key="keyword" class="button" @click="handleSuggestedChoice(keyword)">
                    {{ keyword }}
                </button>
            </div>
        </div>
        <div v-if="currentKeyword" class="quizInfo">
            <div>Current Keyword: {{ currentKeyword }}</div>
            <div>Points: {{ score }}</div>
            <div>Time Left: {{ timerCountdown }}</div>
        </div>
        <div class="quizArea">
            <div :class="['quizQuestion', { 'quizQuestionEnabled': question.length !== 0 }]">
                {{ currentQuestion === -1 ? "Question will appear here" : question }}
            </div>
            <div class="quizChoices">
                <button v-for="index in 4" :key="index" :disabled="answerButtonDisabled" @click="handleUserChoice(index)"
                    :class="['answerButton', { 'answerButtonActive': answerOptions.length !== 0 }]">
                    {{ answerOptions.length === 0 ? `Answer ${String.fromCharCode(64 + index)}` : answerOptions[index - 1].replace(/\*$/, '')}}
                </button>
            </div>
            <div v-if="showExplaination" class="exaplantaionContainer">
                <div class="explanationTitle"> Explanation:</div>
                <div>{{ explanation }}</div>
                <button class="button" @click="handleNextQuestion">Next Question</button>
            </div>
        </div>
    </div>
</template>

<script>
import { gptServices } from '@/services/gptServices';
import debounce from 'lodash/debounce';
export default {
    name: 'quizComponent',
    data() {
        return {
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
            answerButtonDisabled: true
        }
    },
    watch: {
        timerCountdown: {
            immedidate: true,
            handler(newTime) {
                if (newTime <= 0) {
                    this.stopTimer();
                    this.showCorrectAnswer()
                }
            }
        }
    },
    methods: {
        GenerateQuiz: debounce(async function () {
            if (this.searchKeyword.length === 0) return;
            this.currentKeyword = this.searchKeyword;
            this.searchKeyword = "";
            this.stopTimer();
            const response = await gptServices([
                {
                    role: "system",
                    content: "You are a helpful assistant specializing in finance education.",
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
                        Explanation: <explanation>`
                }
            ])
            this.questionList = response.split(/\n\n+/);
            this.currentQuestion = 0;
            this.parseCurrentQuestion();
            await this.generateRelatedKeywords();
            this.answerButtonDisabled = false;
            this.startTimer();
        }, 300),
        keywordSuggestion: debounce(async function () {
            if ((this.suggestTopic.length === 0 || this.suggestDifficulty.length === 0) && this.searchKeyword.length == 0) return;
            this.searchKeyword = this.searchKeyword.length === 0 ?
            await gptServices([
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: `Generate a single keyword in finance about ${this.selectedQuiz} at a ${this.suggestDifficulty} difficulty level. The keyword should be specific and relevant to create a quiz question about finance.`
                }
            ]): this.searchKeyword;
            this.suggestTopic = "";
            this.suggestDifficulty = "";
            await this.GenerateQuiz();
        }, 300),
        handleSuggestedChoice: debounce(async function(keyword){
            this.searchKeyword = keyword;
            await this.keywordSuggestion();
        }, 300),
        startTimer() {
            this.timerCountdown = 15;
            this.timer = setInterval(() => { this.timerCountdown -= 1 }, 1000);
        },
        stopTimer() {
            clearInterval(this.timer);
        },
        stateReset() {
            this.score= 0;
            this.thitimerCountdown = 0;
            this.searchKeyword = "";
            this.currentKeyword = "";
            this.relatedKeyword = [];
            this.suggestTopic = "";
            this.suggestDifficulty = "";
            this.currentQuestion = -1;
            this.questionList = [];
            this.question = "";
            this.answerOptions = [];
            this.explanation = "";
            this.timer = null;
            this.correctAnswer = "";
            this.showExplaination = false;
            this.answerButtonDisabled = true;
        },
        async generateRelatedKeywords() {
            const response = await gptServices([
                { role: "system", content: "You are a helpful assistant." },
                {
                    role: "user",
                    content: `Generate 3 related keywords for "${this.currentKeyword}" in finance and is used in CFA. Provide the keywords as a comma-separated list.`,
                },
            ]);
            this.relatedKeyword = response.split(',')
        },
        parseCurrentQuestion() {
            if (this.currentQuestion >= this.questionList.length) {
                console.log("No more questions");
                return;
            }

            const questionBlock = this.questionList[this.currentQuestion].trim().split('\n');

            this.question = questionBlock[0].toLowerCase().startsWith('question')
                ? questionBlock[0].substring(10)
                : questionBlock[0];

            this.answerOptions = questionBlock.slice(1, 5).map(option => option.trim());

            const correctAnswerLine = questionBlock.find(line => line.startsWith('Correct Answer:'));
            this.correctAnswer = correctAnswerLine
                ? correctAnswerLine.split(':')[1].trim()
                : '';

            this.explanation = questionBlock.find(line => line.startsWith('Explanation:'))
                ?.substring('Explanation:'.length).trim() || '';
        },
        handleUserChoice(index) {
            this.showCorrectAnswer();
            this.stopTimer();
            const isCorrect = String.fromCharCode(64 + index) === this.correctAnswer;
            if (!isCorrect) {
                const incorrectAnswerBtn = document.querySelector(`.quizChoices button:nth-child(${index})`);
                if (incorrectAnswerBtn) {
                    incorrectAnswerBtn.classList.add('answerButtonIncorrect');
                }
            }else{
                this.score += 1;
            }
        },
        showCorrectAnswer() {
            this.answerButtonDisabled = true;
            this.showExplaination = true;
            const correctIndex = this.correctAnswer.charCodeAt(0) - 64; // Convert A, B, C, D to 1, 2, 3, 4
            const correctAnsBtn = document.querySelector(`.quizChoices button:nth-child(${correctIndex})`);
            if (correctAnsBtn) {
                correctAnsBtn.classList.add('answerButtonCorrect');
            }
        },
        handleNextQuestion(){
            //reset buton style;
            const buttons = document.querySelectorAll('.quizChoices button');
            buttons.forEach(button => {
                button.classList.remove("answerButtonIncorrect");
                button.classList.remove("answerButtonCorrect");
            });
            this.currentQuestion = this.currentQuestion + 1;
            if(this.currentQuestion >= this.questionList.length) {
                this.stateReset();
                return;
            }
            this.parseCurrentQuestion();
            this.showExplaination = false;
            this.answerButtonDisabled = false;
            this.startTimer();
        }
    }
};
</script>

<style scoped>
.quizContainer {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    flex: 1;
    background-color: #f4f4f4;
    padding: 20px;
    gap: 15px
}

.title {
    margin-top: 20px;
    font-weight: 900;
    font-size: 40px;
}

.searchContainer {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 5px
}

.searchContainer>input {
    height: 35px;
    width: 40%;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding-left: 10px;
}

.button {
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    padding: 10px 20px;
    display: grid;
    place-items: center;
    font-size: 16px;
    transition: transform 300ms ease-in;
    border: none;
}

.button:hover {
    cursor: pointer;
    transform: translateY(-2px);
    background-color: #0d4178;
}

.suggestKeywordContainer {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.suggestKeywordContainer>select {
    height: 35px;
    border-radius: 5px;
    border: 1px solid #ccc;
    padding-left: 10px;
}

.relatedKeywordContainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px
}

.quizArea {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.quizQuestion {
    color: #bbb;
    font-weight: 600;
    font-size: 24px;
}

.quizQuestionEnabled {
    color: black
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
    height: 45px;
    border-radius: 5px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    color: #bbb;
}

.answerButtonCorrect{
    background-color: #4caf50 !important;
    color: white !important;
}

.answerButtonIncorrect{
    background-color: red !important;
    color: white !important;
}

.answerButtonActive {
    color: black
}

.answerButton:hover {
    cursor: pointer;
}

.exaplantaionContainer {
    width: 100%;
    height: 40%;
    background-color: #f0f0f0;
    padding: 10px;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
    border-radius: 10px;
}

.explanationTitle {
    font-size: 1.17em;
    font-weight: bold;
}

.quizInfo {
    background-color: #e7f7df;
    width: 100%;
    height: 40%;
    padding: 10px;
    border-radius: 10px;
}
</style>