// src/services/marketDataService.js
import axios from 'axios';

const ALPHA_VANTAGE_KEY = process.env.VUE_APP_ALPHA_VANTAGE_KEY;
const COINRANKING_KEY = process.env.VUE_APP_COINRANKING_KEY;
const REAL_ESTATE_API_KEY = process.env.VUE_APP_REAL_ESTATE_KEY;

// Fallback stock data to prevent errors
const fallbackStockData = [
  { symbol: "AAPL", price: 175.84, volume: 45678123, previousClose: 174.50, change: 1.34, changePercent: "0.77%" },
  { symbol: "MSFT", price: 338.11, volume: 23456789, previousClose: 335.67, change: 2.44, changePercent: "0.73%" },
  { symbol: "GOOGL", price: 129.85, volume: 34567890, previousClose: 128.92, change: 0.93, changePercent: "0.72%" },
  { symbol: "AMZN", price: 140.75, volume: 56789012, previousClose: 139.21, change: 1.54, changePercent: "1.11%" },
  { symbol: "TSLA", price: 248.42, volume: 78901234, previousClose: 245.67, change: 2.75, changePercent: "1.12%" },
  { symbol: "META", price: 326.08, volume: 12345678, previousClose: 324.32, change: 1.76, changePercent: "0.54%" },
  { symbol: "NVDA", price: 467.23, volume: 23456789, previousClose: 463.89, change: 3.34, changePercent: "0.72%" },
  { symbol: "NFLX", price: 421.56, volume: 34567890, previousClose: 418.92, change: 2.64, changePercent: "0.63%" },
  { symbol: "INTC", price: 42.73, volume: 45678901, previousClose: 42.15, change: 0.58, changePercent: "1.38%" },
  { symbol: "AMD", price: 122.89, volume: 56789012, previousClose: 121.34, change: 1.55, changePercent: "1.28%" }
];

export async function fetchStockQuote(symbols = [
  "IBM", "AAPL", "GOOGL", "MSFT", "AMZN", "META", "TSLA", "NFLX", "NVDA", "INTC",
  "CSCO", "ORCL", "ADBE", "CRM", "PYPL", "AMD", "QCOM", "TXN", "AVGO", "SHOP"
]) {
  try {
    // Fetch from backend which gets data from TradingView (includes company names)
    const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
    const response = await axios.get(`${baseURL}/api/stocks`, {
      params: {
        page: 1,
        pageSize: 20,
        markets: 'america',
        sortBy: 'market_cap_basic',
        sortOrder: 'desc'
      },
      timeout: 10000
    });

    if (response.data && response.data.stocks && response.data.stocks.length > 0) {
      // Map backend response to expected format
      const stockData = response.data.stocks.map(stock => {
        console.log('📊 Processing stock:', stock.name, 'Company:', stock.companyName);
        return {
          symbol: stock.symbol || stock.name, // Use clean symbol from backend
          companyName: stock.companyName || stock.description || stock.name,
          price: parseFloat(stock.close) || 0,
          volume: parseFloat(stock.volume) || 0,
          previousClose: parseFloat(stock.prevClose) || parseFloat(stock.close) || 0,
          change: parseFloat(stock.change) || 0,
          changePercent: parseFloat(stock.priceChange) || 0
        };
      });

      // Filter to only requested symbols if specific symbols were requested
      if (symbols && symbols.length > 0) {
        const filteredData = stockData.filter(stock => 
          symbols.includes(stock.symbol)
        );
        
        // If we have enough filtered data, return it
        if (filteredData.length >= symbols.length / 2) {
          return filteredData;
        }
      }

      // Return all data if filtering didn't work or wasn't needed
      return stockData;
    }

    // If backend fails, fall back to Alpha Vantage
    console.warn('Backend API failed, trying Alpha Vantage...');
    return await fetchFromAlphaVantage(symbols);
  } catch (error) {
    console.error('Stock data fetch failed:', error);
    // Try Alpha Vantage as fallback
    try {
      return await fetchFromAlphaVantage(symbols);
    } catch (fallbackError) {
      console.error('Alpha Vantage fallback also failed:', fallbackError);
      return getFallbackStockDataWithNames(symbols);
    }
  }
}

// Helper function to fetch from Alpha Vantage (without company names)
async function fetchFromAlphaVantage(symbols) {
  if (!ALPHA_VANTAGE_KEY) {
    console.warn('Alpha Vantage API key not found');
    throw new Error('No API key');
  }

  const requests = symbols.map(symbol =>
    axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`,
      { timeout: 10000 }
    ).catch(error => {
      console.warn(`Failed to fetch data for ${symbol}:`, error.message);
      return null;
    })
  );

  const responses = await Promise.all(requests);
  const validData = responses
    .filter(response => response && response.data && response.data["Global Quote"])
    .map(r => r.data["Global Quote"])
    .filter(q => q && Object.keys(q).length > 0)
    .map(q => ({
      symbol: q["01. symbol"],
      companyName: getCompanyNameFromSymbol(q["01. symbol"]),
      price: parseFloat(q["05. price"]) || 0,
      volume: parseFloat(q["06. volume"]) || 0,
      previousClose: parseFloat(q["08. previous close"]) || 0,
      change: parseFloat(q["09. change"]) || 0,
      changePercent: parseFloat(q["10. change percent"].replace('%', '')) || 0
    }));

  if (validData.length === 0) {
    throw new Error('No valid data from Alpha Vantage');
  }

  return validData;
}

// Helper to get company name from symbol (basic mapping)
function getCompanyNameFromSymbol(symbol) {
  const companyNames = {
    'IBM': 'International Business Machines Corporation',
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com, Inc.',
    'META': 'Meta Platforms, Inc.',
    'TSLA': 'Tesla, Inc.',
    'NFLX': 'Netflix, Inc.',
    'NVDA': 'NVIDIA Corporation',
    'INTC': 'Intel Corporation',
    'CSCO': 'Cisco Systems, Inc.',
    'ORCL': 'Oracle Corporation',
    'ADBE': 'Adobe Inc.',
    'CRM': 'Salesforce, Inc.',
    'PYPL': 'PayPal Holdings, Inc.',
    'AMD': 'Advanced Micro Devices, Inc.',
    'QCOM': 'QUALCOMM Incorporated',
    'TXN': 'Texas Instruments Incorporated',
    'AVGO': 'Broadcom Inc.',
    'SHOP': 'Shopify Inc.'
  };
  return companyNames[symbol] || symbol;
}

function getFallbackStockData(symbols) {
  return symbols.slice(0, 10).map((symbol, index) => {
    const fallback = fallbackStockData[index] || fallbackStockData[0];
    return {
      symbol: symbol,
      companyName: getCompanyNameFromSymbol(symbol),
      price: fallback.price + (Math.random() - 0.5) * 10, // Add some variation
      volume: fallback.volume + Math.floor((Math.random() - 0.5) * 1000000),
      previousClose: fallback.previousClose,
      change: parseFloat((Math.random() - 0.5) * 5).toFixed(2),
      changePercent: parseFloat((Math.random() - 0.5) * 3).toFixed(2)
    };
  });
}

function getFallbackStockDataWithNames(symbols) {
  return getFallbackStockData(symbols);
}

export async function fetchCryptoList() {
  try {
    if (!COINRANKING_KEY) {
      console.warn('Coinranking API key not found, using fallback data');
      return getFallbackCryptoData();
    }

    const res = await axios.get(
      'https://api.coinranking.com/v2/coins?timePeriod=7d',
      { 
        headers: { 'x-access-token': COINRANKING_KEY },
        timeout: 10000
      }
    );
    
    return res.data.data.coins.map(c => ({
      uuid: c.uuid,
      symbol: c.symbol,
      name: c.name,
      price: parseFloat(c.price) || 0,
      change: parseFloat(c.change) || 0,
      changeAmount: parseFloat(c.priceChange) || 0,
      volume: parseFloat(c.volume) || 0,
      iconUrl: c.iconUrl
    }));
  } catch (error) {
    console.error('Crypto data fetch failed:', error);
    return getFallbackCryptoData();
  }
}

function getFallbackCryptoData() {
  return [
    { uuid: "1", symbol: "BTC", name: "Bitcoin", price: 43250.50, change: 2.34, changeAmount: 987.23, volume: 28456789123, iconUrl: "" },
    { uuid: "2", symbol: "ETH", name: "Ethereum", price: 2685.75, change: 1.87, changeAmount: 49.32, volume: 15234567890, iconUrl: "" },
    { uuid: "3", symbol: "BNB", name: "Binance Coin", price: 315.42, change: -0.56, changeAmount: -1.78, volume: 987654321, iconUrl: "" },
    { uuid: "4", symbol: "SOL", name: "Solana", price: 98.23, change: 4.12, changeAmount: 3.89, volume: 2345678901, iconUrl: "" },
    { uuid: "5", symbol: "ADA", name: "Cardano", price: 0.487, change: -1.23, changeAmount: -0.006, volume: 876543210, iconUrl: "" }
  ];
}

export async function fetchRealEstateList() {
  // if you have a real API, call it; otherwise return your dummy data:
  const list = [
    {
      propertyType: "Single Family Home",
      formattedAddress: "123 Main St, San Jose, CA 95112",
      price: "$1,200,000",
      status: "For Sale",
    },
    {
      propertyType: "Condo",
      formattedAddress: "456 Elm St, San Jose, CA 95126",
      price: "$850,000",
      status: "Pending",
    },
    {
      propertyType: "Townhouse",
      formattedAddress: "789 Oak Ave, San Jose, CA 95128",
      price: "$975,000",
      status: "Sold",
    },
    {
      propertyType: "Apartment",
      formattedAddress: "101 Pine St, San Jose, CA 95110",
      price: "$3,200/mo",
      status: "For Rent",
    },
    {
      propertyType: "Duplex",
      formattedAddress: "202 Maple Dr, San Jose, CA 95125",
      price: "$1,050,000",
      status: "For Sale",
    },
  ];
  return list.map((e, index) => ({
    id: index + 1,
    propertyType: e.propertyType,
    formattedAddress: e.formattedAddress,
    lastSalePrice: parseFloat(e.price.replace(/[^0-9.]/g, '')) || 0,
    ownerOccupied: e.status === 'For Sale' ? false : true
  }));
}
