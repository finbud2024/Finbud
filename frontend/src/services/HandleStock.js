import axios from 'axios';
import { gptServices } from '../services/gptServices.js';

export function extractStockCode(message) {
  const pattern = /\b[A-Z]{3,5}\b/g;
  const matches = message.match(pattern);
  return matches;
}

export async function handleStock(userMessage) {
  try {
    const stockCode = extractStockCode(userMessage)[0];
    const stockResponse = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${process.env.VUE_APP_ALPHA_VANTAGE_API_KEY}`);
    const stockData = stockResponse.data;
    const price = stockData['Global Quote']['05. price'];
    const timeStamp = new Date().toLocaleTimeString();
    const alphavantageResponse = `The current price of ${stockCode} stock is $${price}, as of ${timeStamp}.`;
    const prompt = `Generate a detailed analysis of ${stockCode} which currently trades at $${price}.`;
    const gptResponse = await gptServices(prompt);
    return [alphavantageResponse, gptResponse];
  } catch (err) {
    console.error('Error in stock message:', err);
    return [];
  }
}
