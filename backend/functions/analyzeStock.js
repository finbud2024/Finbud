const axios = require('axios');

exports.handler = async (event, context) => {
    console.log("get into this!")
    const { stockSymbol } = JSON.parse(event.body);
    const ALPHAVANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    try {
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
        return {
            statusCode: 200,
            body: JSON.stringify({ analysis: responseData.choices[0]?.message?.content || "" })
        };
    } catch (error) {
        console.error('Error in fetching or generating response:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error analyzing stock' })
        };
    }
};
