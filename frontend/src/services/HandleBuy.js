// src/services/HandleBuy.js
export async function handleBuy(userMessage, router) {
  try {
    const buyRegex = /#buy\s+([A-Z]+)\s+(\d+)/i;
    const match = userMessage.match(buyRegex);
    if (match) {
      const stockSymbol = match[1].toUpperCase();
      const quantity = parseInt(match[2], 10);
      if (stockSymbol && !isNaN(quantity)) {
        const url = router.resolve({
          path: '/stock-simulator',
          query: { symbol: stockSymbol, quantity }
        }).href;
        window.open(url, '_blank');
        return [`Redirecting to Simulator: BUY ${quantity} ${stockSymbol}.`];
      } else {
        return ['Invalid stock symbol or quantity'];
      }
    } else {
      return ['Invalid buy command format'];
    }
  } catch (err) {
    console.error('Error in buy message:', err);
    return ['Error processing buy command'];
  }
}
