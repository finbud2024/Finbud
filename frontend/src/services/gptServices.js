import axios from "axios";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Environment variables
const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY;
const DEEPSEEK_API_KEY = process.env.VUE_APP_DEEPSEEK_API_KEY;

// Initialize Gemini
const geminiAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Provider order for fallback strategy
const PROVIDER_FALLBACK_ORDER = ["openai", "gemini", "deepseek"];

/**
 * Attempts to call a function with different providers until successful or all providers fail
 * @param {Function} actionFn Function to call with different providers
 * @param {Array} providersToTry Array of provider names to try
 * @param {Object} options Additional options to pass to the function
 */
async function tryWithFallback(actionFn, providersToTry, options = {}) {
  // Create a copy of the provider array to avoid modifying the original
  const providers = [...providersToTry];
  let lastError = null;

  while (providers.length > 0) {
    const currentProvider = providers.shift();
    try {
      console.log(`🤖 TRYING API PROVIDER: ${currentProvider.toUpperCase()} 🤖`);
      const result = await actionFn(currentProvider, options);
      console.log(`✅ SUCCESSFULLY USED ${currentProvider.toUpperCase()} API ✅`);
      return result;
    } catch (err) {
      lastError = err;
      console.warn(`❌ ERROR WITH ${currentProvider.toUpperCase()} API: ${err.message}`);
      
      // Check if this is a rate limit error (429) or token exhaustion
      const isRateLimit = err.response?.status === 429 || err.response?.status === 401; // <-- thêm 401 ở đây
      const isTokenExhaustion = 
        err.message.includes("rate limit") || 
        err.message.includes("quota exceeded") || 
        err.message.includes("token") || 
        err.message.includes("limit") ||
        err.response?.status === 401; 
        
      if (isRateLimit || isTokenExhaustion) {
        if (providers.length > 0) {
          console.log(`⚠️ RATE LIMIT OR TOKEN EXHAUSTION DETECTED. SWITCHING TO NEXT PROVIDER... ⚠️`);
          // Continue to next provider
        } else {
          // All providers exhausted
          console.error(`❌❌ ALL PROVIDERS EXHAUSTED. LAST ERROR: ${err.message} ❌❌`);
          throw new Error(`All providers exhausted. Last error: ${err.message}`);
        }
      } else {
        // For non-rate limit errors, don't try other providers
        console.error(`🛑 NON-RATE LIMIT ERROR WITH ${currentProvider.toUpperCase()}: ${err.message} 🛑`);
        throw err;
      }
    }
  }
  
  // If we get here, all providers failed
  throw lastError || new Error("All providers failed with unknown errors");
}

export const GPTService = {
  async generateStructuredJson(options) {
    const {
      messages,
      json_schema,
      provider = "auto", // "auto", "openai", "gemini", or "deepseek"
      model,
      temperature = 0.7,
      maxTokens = 1500,
    } = options;

    console.log(`📊 GENERATING STRUCTURED JSON (Provider: ${provider === "auto" ? "AUTO - will try all" : provider.toUpperCase()}) 📊`);

    // If set to auto, try all providers in fallback order
    if (provider === "auto") {
      return await tryWithFallback(
        async (currentProvider) => {
          return await this._generateStructuredJsonWithProvider({
            provider: currentProvider,
            messages,
            json_schema,
            model,
            temperature,
            maxTokens,
          });
        },
        PROVIDER_FALLBACK_ORDER
      );
    } else {
      // Use specified provider
      console.log(`🔍 DIRECTLY USING ${provider.toUpperCase()} FOR JSON GENERATION 🔍`);
      return await this._generateStructuredJsonWithProvider({
        provider,
        messages,
        json_schema,
        model,
        temperature,
        maxTokens,
      });
    }
  },

  async _generateStructuredJsonWithProvider(options) {
    const {
      provider,
      messages,
      json_schema,
      model,
      temperature,
      maxTokens,
    } = options;

    // Get default model based on provider
    const defaultModel = {
      openai: "gpt-3.5-turbo",
      gemini: "gemini-2.0-flash",
      deepseek: "deepseek/deepseek-chat:free"
    }[provider];
    
    const selectedModel = model || defaultModel;
    console.log(`🤖 USING ${provider.toUpperCase()} WITH MODEL: ${selectedModel} 🤖`);

    if (provider === "openai") {
      try {
        console.log(`⏳ SENDING REQUEST TO OPENAI API...`);
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: selectedModel,
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
        console.log(`✅ OPENAI RESPONSE RECEIVED SUCCESSFULLY`);

        const jsonString =
          response.data.choices[0]?.message?.content.trim() || "{}";

        try {
          const jsonData = JSON.parse(jsonString);
          return jsonData;
        } catch (parseError) {
          console.error("Error parsing JSON response from OpenAI:", parseError);
          return {}; // Return empty object on parse error
        }
      } catch (err) {
        console.error(`❌ ERROR GENERATING STRUCTURED JSON WITH OPENAI: ${err.message}`);
        throw err;
      }
    } else if (provider === "gemini") {
      try {
        console.log(`⏳ SENDING REQUEST TO GEMINI API...`);
        // For Gemini, convert chat messages to a format it can understand
        const geminiModel = geminiAI.getGenerativeModel({ model: selectedModel });
        
        // Extract system prompt and user messages
        const systemPrompt = messages.find(msg => msg.role === "system")?.content || "";
        const userMessages = messages
          .filter(msg => msg.role === "user")
          .map(msg => msg.content)
          .join("\n\n");
        
        // Format prompt with schema information
        const formattedPrompt = `
${systemPrompt}

User input: ${userMessages}

Please generate a JSON response that strictly follows this schema:
${JSON.stringify(json_schema, null, 2)}
        `;
        
        const result = await geminiModel.generateContent({
          contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
          generationConfig: { 
            temperature: temperature,
            maxOutputTokens: maxTokens,
          },
        });
        console.log(`✅ GEMINI RESPONSE RECEIVED SUCCESSFULLY`);
        
        const jsonString = result.response.text().trim() || "{}";
        
        try {
          const jsonData = JSON.parse(jsonString);
          return jsonData;
        } catch (parseError) {
          console.error("Error parsing JSON response from Gemini:", parseError);
          return {}; // Return empty object on parse error
        }
      } catch (err) {
        console.error(`❌ ERROR GENERATING STRUCTURED JSON WITH GEMINI: ${err.message}`);
        throw err;
      }
    } else if (provider === "deepseek") {
      try {
        console.log(`⏳ SENDING REQUEST TO DEEPSEEK API...`);
        const response = await axios.post(
          "https://api.deepseek.com/v1/chat/completions",
          {
            model: selectedModel,
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
              Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(`✅ DEEPSEEK RESPONSE RECEIVED SUCCESSFULLY`);

        const jsonString =
          response.data.choices[0]?.message?.content.trim() || "{}";

        try {
          const jsonData = JSON.parse(jsonString);
          return jsonData;
        } catch (parseError) {
          console.error("Error parsing JSON response from DeepSeek:", parseError);
          return {}; // Return empty object on parse error
        }
      } catch (err) {
        console.error(`❌ ERROR GENERATING STRUCTURED JSON WITH DEEPSEEK: ${err.message}`);
        throw err;
      }
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }
};

export async function gptServices(payload, provider = "auto") {
  // Default system message for FinBud
  const defaultSystemMessage = {
    role: "system",
    content: `Bạn là FinBud — một trợ lý tài chính thông minh, thân thiện, chuyên nói chuyện bằng tiếng Việt.
    Tuy nhiên, nếu người dùng dùng ngôn ngữ khác, bạn có thể phản hồi bằng ngôn ngữ đó cho phù hợp.
    Hãy luôn trả lời một cách vui vẻ, dễ hiểu, như một người bạn đáng tin cậy của Gen Z. 😎
    Nếu tin nhắn người dùng không rõ ràng, hãy lịch sự nhắc họ viết lại rõ hơn, và phản hồi bằng **tiếng Việt**.`,
  };

  // Combine default system message with payload from client
  const fullMessages = [defaultSystemMessage, ...payload];

  console.log(`💬 STARTING CHAT SERVICE (Provider: ${provider === "auto" ? "AUTO - will try all" : provider.toUpperCase()}) 💬`);

  // If auto mode, try all providers with fallback
  if (provider === "auto") {
    return await tryWithFallback(
      (currentProvider) => _gptServicesWithProvider(fullMessages, currentProvider),
      PROVIDER_FALLBACK_ORDER
    );
  } else {
    // Use specified provider
    console.log(`🔍 DIRECTLY USING ${provider.toUpperCase()} FOR CHAT 🔍`);
    return await _gptServicesWithProvider(fullMessages, provider);
  }
}

async function _gptServicesWithProvider(messages, provider) {
  console.log(`🤖 PROCESSING CHAT WITH ${provider.toUpperCase()} 🤖`);
  
  if (provider === "openai") {
    try {
      console.log(`⏳ SENDING CHAT REQUEST TO OPENAI API...`);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: messages,
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
      console.log(`✅ OPENAI CHAT RESPONSE RECEIVED SUCCESSFULLY`);
      const answer = response.data.choices[0]?.message?.content.trim() || "";
      return answer;
    } catch (err) {
      console.error(`❌ ERROR IN CHAT WITH OPENAI: ${err.message}`);
      throw err;
    }
  } else if (provider === "gemini") {
    try {
      console.log(`⏳ SENDING CHAT REQUEST TO GEMINI API...`);
      const geminiModel = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Extract system message
      const systemPrompt = messages.find(msg => msg.role === "system")?.content || "";
      
      // Convert user messages
      const userMessages = messages
        .filter(msg => msg.role === "user")
        .map(msg => msg.content)
        .join("\n\n");
      
      // Format prompt with system instructions first
      const formattedPrompt = `${systemPrompt}\n\nUser input: ${userMessages}`;
      
      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
        generationConfig: { 
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });
      console.log(`✅ GEMINI CHAT RESPONSE RECEIVED SUCCESSFULLY`);
      
      const answer = result.response.text().trim() || "";
      return answer;
    } catch (err) {
      console.error(`❌ ERROR IN CHAT WITH GEMINI: ${err.message}`);
      throw err;
    }
  } else if (provider === "deepseek") {
    try {
      console.log(`⏳ SENDING CHAT REQUEST TO DEEPSEEK API...`);
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ DEEPSEEK CHAT RESPONSE RECEIVED SUCCESSFULLY`);
      const answer = response.data.choices[0]?.message?.content.trim() || "";
      return answer;
    } catch (err) {
      console.error(`❌ ERROR IN CHAT WITH DEEPSEEK: ${err.message}`);
      throw err;
    }
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

export async function gptNewsService(payload, trendingEvents, provider = "auto") {
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
  2. <a href="URL" target="_blank">"Indian stock market opens higher, Sensex above 74,600"</a>: <span class="reason">It provides a detailed analysis of India's market movements and their impact on global indices.</span><br>
  `,
  };

  const eventsList = trendingEvents
    .map(
      (event, index) =>
        `${index + 1}. <a href="${event.url}" target="_blank">${event.title}</a>`
    )
    .join("<br>"); // Use <br> to separate articles

  const eventsUserMessage = {
    role: "user",
    content: `Here are the trending article headlines:\n\n${eventsList}`,
  };

  const fullMessages = [defaultSystemMessage, ...payload, eventsUserMessage];

  console.log(`📰 STARTING NEWS SERVICE (Provider: ${provider === "auto" ? "AUTO - will try all" : provider.toUpperCase()}) 📰`);
  console.log(`📋 PROCESSING ${trendingEvents.length} TRENDING EVENTS`);

  // If auto mode, try all providers with fallback
  if (provider === "auto") {
    return await tryWithFallback(
      (currentProvider) => _gptNewsServiceWithProvider(fullMessages, currentProvider),
      PROVIDER_FALLBACK_ORDER
    );
  } else {
    // Use specified provider
    console.log(`🔍 DIRECTLY USING ${provider.toUpperCase()} FOR NEWS SERVICE 🔍`);
    return await _gptNewsServiceWithProvider(fullMessages, provider);
  }
}

async function _gptNewsServiceWithProvider(messages, provider) {
  console.log(`🤖 PROCESSING NEWS WITH ${provider.toUpperCase()} 🤖`);
  
  if (provider === "openai") {
    try {
      console.log(`⏳ SENDING NEWS REQUEST TO OPENAI API...`);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: messages,
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
      console.log(`✅ OPENAI NEWS RESPONSE RECEIVED SUCCESSFULLY`);
      const answer = response.data.choices[0]?.message?.content.trim() || "";
      return answer;
    } catch (err) {
      console.error(`❌ ERROR IN NEWS SERVICE WITH OPENAI: ${err.message}`);
      throw err;
    }
  } else if (provider === "gemini") {
    try {
      console.log(`⏳ SENDING NEWS REQUEST TO GEMINI API...`);
      const geminiModel = geminiAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // For news service, we'll format the prompt differently to maintain the strict output format
      const systemInstructions = messages.find(msg => msg.role === "system")?.content || "";
      const userMessages = messages
        .filter(msg => msg.role === "user")
        .map(msg => msg.content)
        .join("\n\n");
      
      // Create a single prompt with all the necessary information
      const formattedPrompt = `
${systemInstructions}

${userMessages}
      `;
      
      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts: [{ text: formattedPrompt }] }],
        generationConfig: { 
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });
      console.log(`✅ GEMINI NEWS RESPONSE RECEIVED SUCCESSFULLY`);
      
      const answer = result.response.text().trim() || "";
      return answer;
    } catch (err) {
      console.error(`❌ ERROR IN NEWS SERVICE WITH GEMINI: ${err.message}`);
      throw err;
    }
  } else if (provider === "deepseek") {
    try {
      console.log(`⏳ SENDING NEWS REQUEST TO DEEPSEEK API...`);
      const response = await axios.post(
        "https://api.deepseek.com/v1/chat/completions",
        {
          model: "deepseek-chat",
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ DEEPSEEK NEWS RESPONSE RECEIVED SUCCESSFULLY`);
      const answer = response.data.choices[0]?.message?.content.trim() || "";
      return answer;
    } catch (err) {
      console.error(`❌ ERROR IN NEWS SERVICE WITH DEEPSEEK: ${err.message}`);
      throw err;
    }
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}