import { gptServices } from './gptServices.js';

export async function handleGeneral(userMessage) {
  try {
    const prompt = userMessage;
    const gptResponse = await gptServices(prompt);
    return [gptResponse];
  } catch (err) {
    console.error('Error in general message:', err);
    return [];
  }
}
