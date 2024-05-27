const axios = require('axios');
require('dotenv').config();

exports.handler = async (event, context) => {
    console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY);
    
    const { term } = JSON.parse(event.body);
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'CORS preflight request success' })
        };
    }
    try {
        const prompt = `Explain ${term} to me as if I'm 15.`;
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
        return {
            statusCode: 200,
            body: JSON.stringify({ definition: responseData.choices[0]?.message?.content || "" })
        };
    } catch (error) {
        console.error('Error in fetching or generating response:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error defining term' })
        };
    }
};
