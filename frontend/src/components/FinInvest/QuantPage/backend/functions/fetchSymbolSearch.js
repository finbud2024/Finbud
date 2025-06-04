
// fetchSymbolSearch.js
export async function searchStockSymbol(keyword) {
    const url = `https://alpha-vantage.p.rapidapi.com/query?function=SYMBOL_SEARCH&keywords=${keyword}&datatype=json`;
  
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.VUE_APP_RAPID_API_KEY,
        'x-rapidapi-host': 'alpha-vantage.p.rapidapi.com',
      },
    };
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API Error ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stock symbol:', error);
      return null;
    }
  }