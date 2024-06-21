
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// backend/functions/analyzeRisk.js
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();
var genAI = new GoogleGenerativeAI("AIzaSyBoqZUePAhe5n5INyoApGlytjx57t8-UYI");
async function handler(req) {
  try {
    const response = await start(req.body);
    return {
      statusCode: 200,
      body: response
    };
  } catch (error) {
    console.error("Error in analyzeRisk:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "From analyzeRisk.js :Internal Server Error" })
    };
  }
}
async function start(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = await model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "I'm a 10 years old boy, from now on, answer me everything simply!" }]
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }]
      }
    ],
    generationConfig: {
      maxOutputTokens: 100
    }
  });
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}
var analyzeRisk_default = handler;
export {
  analyzeRisk_default as default,
  handler
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYmFja2VuZC9mdW5jdGlvbnMvYW5hbHl6ZVJpc2suanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCBheGlvcyBmcm9tICdheGlvcydcbmltcG9ydCBkb3RlbnYgZnJvbSAnZG90ZW52JztcbmltcG9ydCB7IEdvb2dsZUdlbmVyYXRpdmVBSSB9IGZyb20gJ0Bnb29nbGUvZ2VuZXJhdGl2ZS1haSc7XG5kb3RlbnYuY29uZmlnKCk7XG5jb25zdCBhcGlLZXkgPSAnQ0tNTzNRM05MSzBPT1NaRyc7Ly9BTFBIQVZBTlRBR0Vcbi8vIGNvbnN0IGdlbkFJID0gbmV3IEdvb2dsZUdlbmVyYXRpdmVBSSgncHJvY2Vzcy5lbnYuQVBJX0tFWScpO1xuY29uc3QgZ2VuQUkgPSBuZXcgR29vZ2xlR2VuZXJhdGl2ZUFJKCdBSXphU3lCb3FaVWVQQWhlNW41SU55b0FwR2x5dGp4NTd0OC1VWUknKTtcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKHJlcSl7XG4gICAgdHJ5e1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHN0YXJ0KHJlcS5ib2R5KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgICAgICAgIGJvZHk6ICByZXNwb25zZVxuICAgICAgICB9O1xuICAgIH1jYXRjaChlcnJvcil7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbiBhbmFseXplUmlzazpcIiwgZXJyb3IpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ0Zyb20gYW5hbHl6ZVJpc2suanMgOkludGVybmFsIFNlcnZlciBFcnJvcicgfSlcbiAgICAgICAgfTtcbiAgICB9XG59XG4vLyBzdGFydChcImV4cGxhaW4gc3RvY2tcIik7XG5hc3luYyBmdW5jdGlvbiBzdGFydChwcm9tcHQpe1xuICAgIGNvbnN0IG1vZGVsID0gZ2VuQUkuZ2V0R2VuZXJhdGl2ZU1vZGVsKHsgbW9kZWw6IFwiZ2VtaW5pLTEuNS1mbGFzaFwiIH0pO1xuICAgIGNvbnN0IGNoYXQgPSBhd2FpdCBtb2RlbC5zdGFydENoYXQoe1xuICAgICAgICBoaXN0b3J5OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogXCJ1c2VyXCIsXG4gICAgICAgICAgICBwYXJ0czogW3sgdGV4dDogXCJJJ20gYSAxMCB5ZWFycyBvbGQgYm95LCBmcm9tIG5vdyBvbiwgYW5zd2VyIG1lIGV2ZXJ5dGhpbmcgc2ltcGx5IVwiIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgcm9sZTogXCJtb2RlbFwiLFxuICAgICAgICAgICAgcGFydHM6IFt7IHRleHQ6IFwiR3JlYXQgdG8gbWVldCB5b3UuIFdoYXQgd291bGQgeW91IGxpa2UgdG8ga25vdz9cIiB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBnZW5lcmF0aW9uQ29uZmlnOiB7XG4gICAgICAgICAgbWF4T3V0cHV0VG9rZW5zOiAxMDAsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNoYXQuc2VuZE1lc3NhZ2UocHJvbXB0KTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcmVzdWx0LnJlc3BvbnNlO1xuICAgICAgY29uc3QgdGV4dCA9IHJlc3BvbnNlLnRleHQoKTtcbiAgICAvLyAgIGNvbnNvbGUubG9nKGNoYXQuZ2V0SGlzdG9yeSk7XG4gICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgLy8gICByZXR1cm4gdGV4dDtcbn1cbmV4cG9ydCBkZWZhdWx0IGhhbmRsZXI7Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7OztBQUFBLE9BQU8sV0FBVztBQUNsQixPQUFPLFlBQVk7QUFDbkIsU0FBUywwQkFBMEI7QUFDbkMsT0FBTyxPQUFPO0FBR2QsSUFBTSxRQUFRLElBQUksbUJBQW1CLHlDQUF5QztBQUM5RSxlQUFzQixRQUFRLEtBQUk7QUFDOUIsTUFBRztBQUNDLFVBQU0sV0FBVyxNQUFNLE1BQU0sSUFBSSxJQUFJO0FBQ3JDLFdBQU87QUFBQSxNQUNILFlBQVk7QUFBQSxNQUNaLE1BQU87QUFBQSxJQUNYO0FBQUEsRUFDSixTQUFPLE9BQU07QUFDVCxZQUFRLE1BQU0seUJBQXlCLEtBQUs7QUFDNUMsV0FBTztBQUFBLE1BQ0gsWUFBWTtBQUFBLE1BQ1osTUFBTSxLQUFLLFVBQVUsRUFBRSxPQUFPLDZDQUE2QyxDQUFDO0FBQUEsSUFDaEY7QUFBQSxFQUNKO0FBQ0o7QUFFQSxlQUFlLE1BQU0sUUFBTztBQUN4QixRQUFNLFFBQVEsTUFBTSxtQkFBbUIsRUFBRSxPQUFPLG1CQUFtQixDQUFDO0FBQ3BFLFFBQU0sT0FBTyxNQUFNLE1BQU0sVUFBVTtBQUFBLElBQy9CLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixPQUFPLENBQUMsRUFBRSxNQUFNLG9FQUFvRSxDQUFDO0FBQUEsTUFDdkY7QUFBQSxNQUNBO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixPQUFPLENBQUMsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQUEsTUFDckU7QUFBQSxJQUNGO0FBQUEsSUFDQSxrQkFBa0I7QUFBQSxNQUNoQixpQkFBaUI7QUFBQSxJQUNuQjtBQUFBLEVBQ0YsQ0FBQztBQUNELFFBQU0sU0FBUyxNQUFNLEtBQUssWUFBWSxNQUFNO0FBQzVDLFFBQU0sV0FBVyxNQUFNLE9BQU87QUFDOUIsUUFBTSxPQUFPLFNBQVMsS0FBSztBQUU3QixVQUFRLElBQUksSUFBSTtBQUVwQjtBQUNBLElBQU8sc0JBQVE7IiwKICAibmFtZXMiOiBbXQp9Cg==
