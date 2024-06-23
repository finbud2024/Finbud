import mongoose from 'mongoose';
import axios from 'axios';
import moment from 'moment';
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.VUE_APP_GEMINI_API_KEY);
import StockPrice from '../Database Schema/Stock.js';
// const StockPrice = import('../../../backend/Database Schema/Stock');
const mongoURI = 'mongodb+srv://finbud123:finbud123@cluster0.8mbj0ln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(mongoURI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
async function getStockData() {
    try {
        const stockData = await StockPrice.find({ symbol: 'IBM' });
        if (stockData.length > 0) {
            console.log("Stock data for IBM:", stockData);
        } else {
            console.log("No stock data found for IBM");
        }
    } catch (error) {
        console.error("Error fetching stock data:", error);
    }
}
getStockData();
async function getGeminiKeyword(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = await model.startChat({
        history: [
            {
                role: "user",
                parts: [{
                    text: `Given a sentence, extract and format the relevant keywords or phrases according to the following criteria: Must include: Keywords or phrases prepended with a + symbol. Exact match: Keywords or phrases surrounded by quotes ("). Logical operators: Use AND, OR, NOT to connect keywords or phrases. Group: Use parentheses to group logical operations if necessary.`
                }],
            },
            {
                role: "user",
                parts: [{ text: `Examples: My input: "Look up data on electric vehicles or hybrid cars and clean energy." Output: +electric vehicles OR +hybrid cars AND "clean energy"` }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 100,
        },
    });
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}