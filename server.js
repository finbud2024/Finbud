const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/api/generate-quiz', async (req, res) => {
  const { keywords } = req.body;

  try {
    console.log("this action is active")
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: `Generate a quiz question with 4 multiple-choice answers based on the keywords: ${keywords}. Provide the correct answer in the response.`,
      max_tokens: 150,
      n: 1,
      stop: ["\n"],
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    const completion = response.data.choices[0].text.trim();

    // Assuming the API response is parsed properly
    const question = parseQuizResponse(completion);

    res.json(question);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).send('Error generating quiz');
  }
});

const parseQuizResponse = (response) => {
  // Parse the GPT response into a question object
  // Example format:
  // { text: "What is ...?", answers: [{ text: "Answer 1", correct: false }, { text: "Answer 2", correct: true }, ...] }
  // Parsing logic here...
  return {
    text: "Sample question text",
    answers: [
      { text: "Answer 1", correct: false },
      { text: "Answer 2", correct: true },
      { text: "Answer 3", correct: false },
      { text: "Answer 4", correct: false },
    ],
  };
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
