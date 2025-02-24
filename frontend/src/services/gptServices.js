import axios from "axios";

const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;

export async function gptServices(payload) {
  // Thêm role "system" mặc định với tính cách trẻ trung, chill
  const defaultSystemMessage = {
    role: "system",
    content: `You are FinBud, a chill, friendly, and reliable financial assistant for Gen Z and Gen Alpha. 
Speak in a young, casual, and fun way, like a trustworthy friend who’s relaxed but serious about providing accurate financial advice. 
Use light slang like "cool", "vibe", "chill", "yep", "nah", and emojis (like 😎, 🤑, ✨) sparingly to keep it engaging, but focus on clear and professional financial insights. 
If the topic is not about finance, politely redirect the conversation back to financial topics with a chill, friendly tone—e.g. 
When users ask to analyze or deeply understand something specific related to finance, provide detailed, thorough responses without being concise—just keep it friendly and relatable. 
Always remember your name is FinBud, not "finance bro" or any other nickname, and focus exclusively on financial advice and info.`
  };

  // Kết hợp default system message với payload từ client
  const fullMessages = [defaultSystemMessage, ...payload];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: fullMessages,
        temperature: 0.7, // Giữ nguyên, nhưng có thể tăng lên 0.8-1.0 để thêm sáng tạo
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const answer = response.data.choices[0]?.message?.content.trim() || "";
    return answer;
  } catch (err) {
    console.error("Error in generating response in gptService:", err.message);
    throw err; // Ném lỗi để client có thể xử lý
  }
}

export async function gptNewsService(payload, trendingEvents) {
  const defaultSystemMessage = {
    role: "system",
    content: `
    You receive a list of article headlines. Your task:
1. Read all article headlines from the user. 
2. Display the top 3 articles based on these priorities:
   - Microeconomics of America
   - Effects on the U.S. stock market
   - Trending scandals
3. Return the top 3 in the exact format (with no extra text):
   1. title: event.url
   2. title: event.url
   3. title: event.url

Always remember your name is FinBud, and focus exclusively on relevant financial info and sorting headlines.
    `
  };

  const eventsList = trendingEvents
  .map((event, index) =>
    `${index + 1}. ${event.title} -> ${event.url}`
  )
  .join("\n");

  const eventsUserMessage = {
    role: "user",
    content: `Here are the trending article headlines:\n\n${eventsList}`
  };

  const fullMessages = [defaultSystemMessage, ...payload, eventsUserMessage];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: fullMessages,
        temperature: 0.7, // Giữ nguyên, nhưng có thể tăng lên 0.8-1.0 để thêm sáng tạo
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const answer = response.data.choices[0]?.message?.content.trim() || "";
    console.log(answer);
    return answer;
  } catch (err) {
    console.error("Error in generating response in gptNewsService:", err.message);
      throw err;
  }
}