// src/services/braveSearch.js
import axios from 'axios';

const WEB_URL   = 'https://api.search.brave.com/res/v1/web/search';
const VIDEO_URL = 'https://api.search.brave.com/res/v1/videos/search';
const API_KEY   = import.meta.env.VITE_BRAVE_API_KEY;

export async function searchBrave(query, count = 10) {
  const { data } = await axios.get(WEB_URL, {
    params: { q: query, count },
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': API_KEY
    }
  });
  return data;
}

export async function searchVideos(query, count = 10) {
  const { data } = await axios.get(VIDEO_URL, {
    params: { q: query, count },
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'gzip',
      'X-Subscription-Token': API_KEY
    }
  });
  return data;
}
