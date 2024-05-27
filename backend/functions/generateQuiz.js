const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Use the cors middleware

app.post('/generate-quiz', async (req, res) => {
    const { keywords } = req.body;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Generate a finance-related multiple-choice quiz question including the keywords: ${keywords}. Provide the question and four answer options. Indicate the correct answer with an asterisk (*). Format: Question: <question>\nA. <option1>\nB. <option2>\nC. <option3>\nD. <option4>` }
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

        const completion = response.data.choices[0].message.content.trim();
        const question = parseQuizResponse(completion);
        
        res.status(200).json(question);
    } catch (error) {
        console.error('Error generating quiz:', error);
        
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }

        res.status(500).json({ error: 'Error generating quiz' });
    }
});

const parseQuizResponse = (response) => {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    const question = lines[0].replace('Question:', '').trim();
    const options = lines.slice(1).map(line => {
        const isCorrect = line.includes('*');
        const cleanedLine = line.replace('*', '').trim();
        return {
            text: cleanedLine,
            correct: isCorrect
        };
    });

    return {
        question,
        answers: options
    };
};

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server for Quizz is running on port ${PORT}`);
});
