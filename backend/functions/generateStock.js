const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(cors());

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY; // Use the API key from the .env file

app.get('/api/market-data', async (req, res) => {
    try {
        const urls = [
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=DJIA&interval=5min&apikey=${API_KEY}`,
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=COMP&interval=5min&apikey=${API_KEY}`,
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=SPX&interval=5min&apikey=${API_KEY}`,
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=GDOW&interval=5min&apikey=${API_KEY}`,
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=GC00&interval=5min&apikey=${API_KEY}`,
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=CL.1&interval=5min&apikey=${API_KEY}`
        ];

        const requests = urls.map(url => axios.get(url));
        const responses = await Promise.all(requests);

        const marketData = responses.map((response, index) => ({
            symbol: ['DJIA', 'COMP', 'SPX', 'GDOW', 'GC00', 'CL.1'][index],
            data: response.data
        }));

        res.json(marketData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
