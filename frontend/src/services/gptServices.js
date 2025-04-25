import axios from "axios";
import { OpenAI } from "openai";
const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;

export const GPTService = {
  async generateStructuredJson(options) {
    const {
      messages,
      json_schema,
      model = "gpt-3.5-turbo",
      temperature = 0.7,
      maxTokens = 1500,
    } = options;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens,
          response_format: {
            type: "json_object",
            json_schema,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const jsonString =
        response.data.choices[0]?.message?.content.trim() || "{}";

      try {
        const jsonData = JSON.parse(jsonString);
        return jsonData;
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        return {}; // Return empty object on parse error
      }
    } catch (err) {
      console.error("Error generating structured JSON:", err.message);
      throw err;
    }
  },
};

export async function gptServices(payload) {
  // Thêm role "system" mặc định với tính cách trẻ trung, chill
  const defaultSystemMessage = {
    role: "system",
    content: `Bạn là FinBud — một trợ lý tài chính thông minh, thân thiện, chuyên nói chuyện bằng tiếng Việt.
    Tuy nhiên, nếu người dùng dùng ngôn ngữ khác, bạn có thể phản hồi bằng ngôn ngữ đó cho phù hợp.
    Hãy luôn trả lời một cách vui vẻ, dễ hiểu, như một người bạn đáng tin cậy của Gen Z. 😎
    Nếu tin nhắn người dùng không rõ ràng, hãy lịch sự nhắc họ viết lại rõ hơn, và phản hồi bằng **tiếng Việt**.`,
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
  Your name is FinBud, and focus exclusively on relevant financial info and sorting headlines of a list of article headlines.
  -------- TASK --------
    1. Read all article headlines from the user. 
    2. Display the top 3 articles based on these priorities:
      - Microeconomics of America
      - Effects on the U.S. stock market
      - Trending scandals
    3. You should read these 3 articles to stay updated on the latest financial trends
    4. Always remember your name is FinBud, and focus exclusively on relevant financial info and sorting headlines.
  --------  FORMAT --------
  - **ONLY** Respond in a list of article titles and the reasons to read them
  - **ONLY** Return the top 3 in the exact format (with no extra text):
    <div style="font-size: 1.2rem;">You need to read these 3 articles:</div>
    1. <a href="ARTICLE_URL" target="_blank">"ARTICLE_TITLE"</a>: <span class="reason">"REASON_TO_READ_THEM"</span><br>
    2. <a href="ARTICLE_URL" target="_blank">"ARTICLE_TITLE"</a>: <span class="reason">"REASON_TO_READ_THEM"</span><br>
    3. <a href="ARTICLE_URL" target="_blank">"ARTICLE_TITLE"</a>: <span class="reason">"REASON_TO_READ_THEM"</span><br>
  -------- SAMPLES --------
  1. <a href="URL" target="_blank">"Stock Market Updates: Sensex, Nifty Flat At Open; Bank, Auto Stocks Gain"</a>: <span class="reason">This article offers stock market updates, helping you grasp short-term investment trends.</span><br>
  2. <a href="URL" target="_blank">"Indian stock market opens higher, Sensex above 74,600"</a>: <span class="reason">It provides a detailed analysis of India’s market movements and their impact on global indices.</span><br>
  `,
  };

  const eventsList = trendingEvents
    .map(
      (event, index) =>
        `${index + 1}. <a href="${event.url}" target="_blank">${event.title
        }</a>`
    )
    .join("<br>"); // Use <br> to separate articles

  const eventsUserMessage = {
    role: "user",
    content: `Here are the trending article headlines:\n\n${eventsList}`,
  };

  const fullMessages = [defaultSystemMessage, ...payload, eventsUserMessage];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: fullMessages,
        temperature: 0.7,
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
    console.error(
      "Error in generating response in gptNewsService:",
      err.message
    );
    throw err;
  }
}
