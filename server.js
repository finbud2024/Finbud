const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/api/generate-quiz', async (req, res) => {
  const { keywords } = req.body;

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
        'Authorization': `Bearer ${process.env.GPT_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const completion = response.data.choices[0].message.content.trim();
    const question = parseQuizResponse(completion);
    res.json(question);
  } catch (error) {
    res.status(500).send('Error generating quiz');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
