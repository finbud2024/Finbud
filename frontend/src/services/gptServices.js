// Mock gptServices.js - không gọi API trực tiếp
import axios from "axios";

// Mock environment variables
const OPENAI_API_KEY = process.env.VUE_APP_OPENAI_API_KEY || "mock-openai-key";
const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY || "mock-gemini-key";
const DEEPSEEK_API_KEY = process.env.VUE_APP_DEEPSEEK_API_KEY || "mock-deepseek-key";

// Mock API base URL
const API_BASE_URL = process.env.VUE_APP_DEPLOY_URL || "http://localhost:3000";

// Provider order for fallback strategy
const PROVIDER_FALLBACK_ORDER = ["openai", "gemini", "deepseek"];

/**
 * Mock function to attempt calls with different providers
 */
async function tryWithFallback(actionFn, providersToTry, options = {}) {
  // Reduced logging for cleaner console
  try {
    const result = await actionFn("mock", options);
    return result;
  } catch (err) {
    console.warn(`❌ MOCK: Error with mock server: ${err.message}`);
    throw err;
  }
}

/**
 * Mock function to send message through mock server
 */
async function sendMessage(messages, options = {}) {
  try {
    // Send to mock server instead of OpenAI
    const response = await axios.post(`${API_BASE_URL}/threads`, {
      message: messages[messages.length - 1]?.content || "Hello",
      messages: messages,
      options: options
    });
    
    return response.data.message;
  } catch (error) {
    console.error("MOCK: Error sending message:", error);
    throw error;
  }
}

/**
 * Mock function for OpenAI provider
 */
async function _gptServicesWithProvider(provider, options = {}) {
  if (provider === "mock") {
    return await sendMessage(options.messages || [], options);
  }
  
  // Fallback to mock for any provider
  return await sendMessage(options.messages || [], options);
}

/**
 * Mock function for Gemini provider
 */
async function _geminiServicesWithProvider(provider, options = {}) {
  return await sendMessage(options.messages || [], options);
}

/**
 * Mock function for DeepSeek provider
 */
async function _deepseekServicesWithProvider(provider, options = {}) {
  return await sendMessage(options.messages || [], options);
}

// Export mock services
export const gptServices = async (messages, options = {}) => {
  return await tryWithFallback(_gptServicesWithProvider, ["mock"], { messages, ...options });
};

export const geminiServices = async (messages, options = {}) => {
  return await tryWithFallback(_geminiServicesWithProvider, ["mock"], { messages, ...options });
};

export const deepseekServices = async (messages, options = {}) => {
  return await tryWithFallback(_deepseekServicesWithProvider, ["mock"], { messages, ...options });
};

// Additional exports for compatibility
export const gptNewsService = gptServices;
export const GPTService = gptServices;

// Default export
export default gptServices;
