import axios from 'axios';

const fetchStockPrice = async (stockCode) => {
  const apiKey = process.env.VUE_APP_STOCK_API_KEY; // Store API key in environment variable
  const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`;
  const response = await axios.get(apiUrl);
  const priceData = response.data['Global Quote'];
  return priceData['05. price'];
}

export {
  fetchStockPrice,
}
