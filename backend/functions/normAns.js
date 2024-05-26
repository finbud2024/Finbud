const axios = require('axios');
require('dotenv').config();


exports.handler = async (event, context) => {
    console.log("normAns function called with event:", event.body);
    const { term } = JSON.parse(event.body);
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: term }],
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const responseData = response.data;
        return {
            statusCode: 200,
            body: JSON.stringify({ definition: responseData.choices[0]?.message?.content || "" })
        };
    } catch (error) {
        console.error('Error in fetching or generating response:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error generating answer' })
            
        };
    }
};
