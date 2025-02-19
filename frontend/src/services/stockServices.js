import axios from 'axios';

const fetchStockPrice = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY;
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`;
    console.log(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`)
    const response = await axios.get(apiUrl);
    if(response.data.Note) {
      console.error("API Limit hit:", response.data.Note);
      return null;
    }
    console.log('API Response:', response.data);
    const priceData = response.data['Global Quote'];
    const stockPrice = priceData['05. price'];
    
    console.log(`Successfully fetched stock price for ${stockCode}: $${stockPrice}`);
    return stockPrice;
  } catch (error) {
    console.error('Error fetching stock price:', error.response ? error.response.data : error.message);
    throw error;
  }
}


const fetchSimBannerStockData = async (stockCode) => {
  try {
  
    const apiKey = process.env.VUE_APP_STOCK_API_KEY;
    const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`;
    const fundamentalsUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockCode}&apikey=${apiKey}`;

  
    const [priceResponse, fundamentalsResponse] = await Promise.all([
      axios.get(priceUrl),
      axios.get(fundamentalsUrl)
    ]);

  
    const priceData = priceResponse.data["Global Quote"];

    const fundamentalsData = fundamentalsResponse.data;

    console.log({priceData, fundamentalsData})
    return {
      open: priceData["02. open"] || "N/A",
      close: priceData["08. previous close"] || "N/A",
      high: priceData["03. high"] || "N/A",
      low: priceData["04. low"] || "N/A",
      marketCap: fundamentalsData["MarketCapitalization"] || "N/A",
      volume: priceData["06. volume"] || "N/A",
      eps: fundamentalsData["EPS"] || "N/A",
      peRatio: fundamentalsData["PERatio"] || "N/A",
      pbr: fundamentalsData["PriceToBookRatio"] || "N/A"
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null; 
  }
};


const fetchSimBannerStockDatav2 = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY_POLYGON;
    
    const priceUrl = `https://api.polygon.io/v2/aggs/ticker/${stockCode}/prev?adjusted=true&apiKey=${apiKey}`;
    
    const fundamentalsUrl = `https://api.polygon.io/vX/reference/financials?ticker=${stockCode}&apiKey=${apiKey}`;
    
    const tickerDetailsUrl = `https://api.polygon.io/v3/reference/tickers/${stockCode}?apiKey=${apiKey}`;
    
    const [priceResponse, fundamentalsResponse, tickerDetailsResponse] = await Promise.all([
      axios.get(priceUrl),
      axios.get(fundamentalsUrl),
      axios.get(tickerDetailsUrl)
    ]);
    
    const priceData = (priceResponse.data.results && priceResponse.data.results.length > 0)
      ? priceResponse.data.results[0]
      : {};
    
    const fundamentalsResults = fundamentalsResponse.data.results;
    const fundamentalsData = (fundamentalsResults && fundamentalsResults.length > 0 && fundamentalsResults[0].financials)
      ? fundamentalsResults[0].financials
      : {};
    
    const tickerDetails = tickerDetailsResponse.data.results || {};
    console.log({priceData, fundamentalsData, tickerDetails})
    return {
      open: priceData.o || "N/A",
      close: priceData.c || "N/A",
      high: priceData.h || "N/A",
      low: priceData.l || "N/A",
      volume: priceData.v || "N/A",
      marketCap: tickerDetails.market_cap || "N/A", 
      eps: fundamentalsData.eps || "N/A",
      peRatio: fundamentalsData.peRatio || fundamentalsData.pe_ratio || "N/A",
      pbr: fundamentalsData.priceToBookRatio || fundamentalsData.price_to_book || "N/A"
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null; 
  }
};

export {
  fetchStockPrice,
  fetchSimBannerStockData,
  fetchSimBannerStockDatav2
}
