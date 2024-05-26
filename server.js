const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const ALPHAVANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log("ALPHAVANTAGE_API_KEY:", ALPHAVANTAGE_API_KEY);
console.log("OPENAI_API_KEY:", OPENAI_API_KEY);

// Define your GPT functions
async function gptAPICall(stockSymbol) {
    try {
        console.log("Get API Call");
        console.log("API KEY:" + OPENAI_API_KEY);
        console.log("API ALPHA KEY:" + ALPHAVANTAGE_API_KEY);

        const stockUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${ALPHAVANTAGE_API_KEY}`;
        const stockResponse = await axios.get(stockUrl);
        const stockData = stockResponse.data;

        const price = stockData['Global Quote']['05. price'];
        const prompt = `Generate a detailed analysis of ${stockSymbol} which currently trades at $${price}.`;

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const responseData = response.data;
        return responseData.choices[0]?.message?.content || "";
    } catch (error) {
        console.error('Error in fetching or generating response:', error);
        throw error;
    }
}
async function gptAPICallNorm(str) {
  try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: str }],
          temperature: 0.7
      }, {
          headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
          }
      });

      const responseData = response.data;
      return responseData.choices[0]?.message?.content || "";
  } catch (error) {
      console.error('Error in fetching or generating response:', error);
      throw error;
  }
}

async function gptAPICallDefine(str) {
    try {
        const prompt = `Explain ${str} to me as if I'm 15.`;
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const responseData = response.data;
        return responseData.choices[0]?.message?.content || "";
    } catch (error) {
        console.error('Error in fetching or generating response:', error);
        throw error;
    }
}

//endpoint that uses gptAPICall
app.post('/api/analyze-stock', async (req, res) => {
    const { stockSymbol } = req.body;

    try {
        const analysis = await gptAPICall(stockSymbol);
        res.json({ analysis });
    } catch (error) {
        res.status(500).send('Error analyzing stock');
    }
});
// endpoint that uses gptAPICall normal answer
app.post('/api/norm-ans', async (req, res) => {
  const { term } = req.body;

  try {
      const definition = await gptAPICallNorm(term);
      res.json({ definition });
  } catch (error) {
      res.status(500).send('Error generate answer');
  }
});

//endpoint that uses gptAPICallDefine
app.post('/api/define-term', async (req, res) => {
    const { term } = req.body;

    try {
        const definition = await gptAPICallDefine(term);
        res.json({ definition });
    } catch (error) {
        res.status(500).send('Error defining term');
    }
});

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
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
