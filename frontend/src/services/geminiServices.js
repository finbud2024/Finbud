const axios = require("axios");
const moment = require('moment');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = 'CKMO3Q3NLK0OOSZG';
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyBoqZUePAhe5n5INyoApGlytjx57t8-UYI');
// Only fetch data from June 1st to reduce the processing time
const firstofJune = moment("2024-06-01", "YYYY-MM-DD").toDate();
generate();
async function generate() {
    await getStockPrice();
    run();
}
var prompt = "";
async function getStockPrice() {
    const response = await fetchStockPrice("IBM");
    // console.log(response);
    const records = response['Time Series (Daily)'];
    const metaData = response['Meta Data']
    for (const [date, data] of Object.entries(records)) {
        const recordDate = moment(date, "YYYY-MM-DD").toDate();
        if (new Date(recordDate) > new Date(firstofJune)) {
            prompt += `${metaData['2. Symbol']}_${date}_${data['2. high']}_${data['5. volume']};\n`
        }
    }
    prompt = "Base on the data given in the format of 'Stock Symbol'_'Stock Date'_'Stock highest pride in that day'_'Stock Volume in that day' analyze the risk and the potential of that Stock, the data are given:" + prompt;
    // console.log(prompt);
}

async function fetchStockPrice(stockSymbol) {
    const urlStock = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;
    try {
        const res = await axios.get(urlStock, {
            headers: { 'User-Agent': 'request' }
        })
        return res.data;
    } catch (error) {
        console.log('Error', error);
    }
}

// Use Gemini AI  
async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}
