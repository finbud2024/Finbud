// src/services/marketDataService.js
import axios from 'axios';

const ALPHA_VANTAGE_KEY     = process.env.VUE_APP_ALPHA_VANTAGE_KEY;
const COINRANKING_KEY       = process.env.VUE_APP_COINRANKING_KEY;
const REAL_ESTATE_API_KEY   = process.env.VUE_APP_REAL_ESTATE_KEY;

export async function fetchStockQuote(symbols = [
  "IBM","AAPL","GOOGL","MSFT","AMZN","FB","TSLA","NFLX","NVDA","INTC",
  "CSCO","ORCL","ADBE","CRM","PYPL","AMD","QCOM","TXN","AVGO","SHOP"
]) {
  const requests = symbols.map(symbol =>
    axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
    )
  );
  const responses = await Promise.all(requests);
  return responses
    .map(r => r.data["Global Quote"])
    .filter(q => q && Object.keys(q).length)
    .map(q => ({
      symbol:           q["01. symbol"],
      price:            parseFloat(q["05. price"]),
      volume:           parseFloat(q["06. volume"]),
      previousClose:    parseFloat(q["08. previous close"]),
      change:           parseFloat(q["09. change"]),
      changePercent:    parseFloat(q["10. change percent"])
    }));
}

export async function fetchCryptoList() {
  const res = await axios.get(
    'https://api.coinranking.com/v2/coins?timePeriod=7d',
    { headers: { 'x-access-token': COINRANKING_KEY } }
  );
  return res.data.data.coins.map(c => ({
    uuid:         c.uuid,
    symbol:       c.symbol,
    name:         c.name,
    price:        parseFloat(c.price),
    change:       parseFloat(c.change),
    changeAmount: parseFloat(c.priceChange),
    volume:       parseFloat(c.volume),
    iconUrl:      c.iconUrl
  }));
}

export async function fetchRealEstateList() {
  // if you have a real API, call it; otherwise return your dummy data:
  const list = [
    /* ... */
  ];
  return list.map(e => ({
    id:              e.id,
    propertyType:    e.propertyType,
    formattedAddress:e.formattedAddress,
    lastSalePrice:   parseFloat(e.price.replace(/[^0-9.]/g,''))||0,
    ownerOccupied:   e.status === 'For Sale' ? false : true
  }));
}
