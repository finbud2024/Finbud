import { gptServices } from './gptServices.js';

export async function handleDefine(userMessage) {
  try {
    const term = userMessage.substring(userMessage.toLowerCase().indexOf("define") + "define".length).trim();
    const prompt = `Explain ${term} to me as if I'm 15.`;
    const gptResponse = await gptServices(prompt);
    return [gptResponse];
  } catch (err) {
    console.error('Error in define message:', err);
    return [];
  }
}
