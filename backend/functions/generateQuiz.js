const axios = require('axios');

exports.handler = async (event, context) => {
    const { keywords } = JSON.parse(event.body);
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
        res.json(question);
    } catch (error) {
        console.error('Error generating quiz:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error generating quiz' })
        };
    }
};

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
