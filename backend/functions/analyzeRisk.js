import axios from 'axios'
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();
const apiKey = 'CKMO3Q3NLK0OOSZG';//ALPHAVANTAGE
// const genAI = new GoogleGenerativeAI('process.env.API_KEY');
const genAI = new GoogleGenerativeAI('AIzaSyBoqZUePAhe5n5INyoApGlytjx57t8-UYI');
export async function handler(req){
    try{
        const response = await start(req.body);
        return {
            statusCode: 200,
            body:  response
        };
    }catch(error){
        console.error("Error in analyzeRisk:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'From analyzeRisk.js :Internal Server Error' })
        };
    }
}
start("explain stock");
async function start(prompt){
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = await model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "I'm a 10 years old boy, from now on, answer me everything simply!" }],
          },
          {
            role: "model",
            parts: [{ text: "Great to meet you. What would you like to know?" }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 100,
        },
      });
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
    //   console.log(chat.getHistory);
    console.log(text);
    //   return text;
}
export default handler;