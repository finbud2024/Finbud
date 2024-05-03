import axios from 'axios';

const fetchStockPrice = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY;
    console.log("API Key:", apiKey); // Ensure this logs correctly
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`;
    console.log(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`)
    const response = await axios.get(apiUrl);
    if(response.data.Note) {
      console.error("API Limit hit:", response.data.Note);
      return null; // Handle API limit scenario
    }
    console.log('API Response:', response.data);
    const priceData = response.data['Global Quote'];
    const stockPrice = priceData['05. price'];
    
    console.log(`Successfully fetched stock price for ${stockCode}: $${stockPrice}`);
    return stockPrice;
  } catch (error) {
    console.error('Error fetching stock price:', error.response ? error.response.data : error.message);
    throw error; // Rethrow the error to handle it outside this function if needed
  }
}

export {
  fetchStockPrice,
}
