import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_DEPLOY_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API: get all daily news
export const getAllNews = async (options = {}) => {
  try {
    const response = await api.get('/dailyNews', { params: options });
    return response.data;
  } catch (error) {
    console.error('Error fetching news articles:', error);
    throw error;
  }
};

// API: get news by id
export const getNewsById = async (id) => {
  try {
    const response = await api.get('/dailyNews', { params: { id } });
    return response.data;
  } catch (error) {
    console.error('Error fetching news article by ID:', error);
    throw error;
  }
};
