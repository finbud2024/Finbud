import axios from 'axios';

const API_URL = process.env.VUE_APP_DEPLOY_URL|| 'http://localhost:8888';

// get thread memory
export const threadService = {
  async getThreadMemory(threadId) {
    try {
      const response = await axios.get(`${API_URL}/threads/${threadId}`);
      return response.data.memory;
    } catch (error) {
      console.error('Error fetching thread memory:', error);
      throw error;
    }
  }
};