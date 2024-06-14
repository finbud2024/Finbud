const axios = require('axios');
require('dotenv').config();

exports.handler = async (event, context) => {
    console.log("trading Market")
    const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
    console.log(API_KEY)

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
    console.log("yayy");

    try {
        const dailyUrl = `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=EUR&to_symbol=USD&&apikey=${API_KEY}`;
        const exchangeRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=JPY&apikey=${API_KEY}`

        const test1 = 'https://api.currencylayer.com/change?access_key=5553c61653e8f046852468ccfb32d494&currencies=USD,GBP,EUR&start_date=2010-03-01&end_date=2010-04-01'

        const response = await axios.get(dailyUrl);
        const forexData = response.data;
        return {
            statusCode: 200,
            body: JSON.stringify({ forexData })
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error retrieving forex data' })
        };
    }
};
