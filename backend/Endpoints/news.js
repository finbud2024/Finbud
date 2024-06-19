import axios from 'axios'
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const genAI = new GoogleGenerativeAI('AIzaSyBoqZUePAhe5n5INyoApGlytjx57t8-UYI');

const userRoute = express.Router();
userRoute.post("/getNews", async (req, res) => {
    console.log(req.body);
    try {
        const keyword = await getGeminiKeyword(req.body);
        console.log(keyword);
        const response = await fetchNews(keyword);
        const news = response.data.articles
        console.log(news);
        return news;
    } catch (err) {
        console.log("Error from news.js:", err);
        return res.status(500).send("Unexpected error" + err);
    }
})

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
    // console.log(text);
    return text;
}
async function fetchNews(keyword) {
    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                apiKey: "7eac0646bd5d43d0a4d5d5bfd8a3a95c",
                q: keyword,
            },
        });
        return response;
        // console.log(response.data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}
async function run() {
    const keyword = await getGeminiKeyword("I need information on climate change or global warming and renewable energy.");
    console.log(keyword);
    const response = await fetchNews(keyword);
    console.log(response.data.articles);
}
// run();