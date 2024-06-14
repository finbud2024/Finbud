// src/services/cryptoService.js
import axios from 'axios';

const API_URL = 'https://rest.coinapi.io/v1';
const API_KEY = process.env.COINAPI_KEY;

export const getCryptoData = async (symbol, period_id) => {
  try {
    const response = await axios.get(`${API_URL}/ohlcv/${symbol}/USD/history`, {
      params: {
        period_id: period_id,
        time_start: '2021-01-01T00:00:00',
        limit: 100,
      },
      headers: {
        'X-CoinAPI-Key': API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    throw error;
  }
};
