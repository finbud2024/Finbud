export async function handleSell(userMessage, router) {
    try {
      const sellRegex = /#sell\s+([A-Z]+)\s+(\d+)/i;
      const match = userMessage.match(sellRegex);
      if (match) {
        const stockSymbol = match[1].toUpperCase();
        const quantity = parseInt(match[2], 10);
        if (stockSymbol && !isNaN(quantity)) {
          const url = router.resolve({
            path: '/stock-simulator',
            query: { symbol: stockSymbol, quantity: -quantity }
          }).href;
          window.open(url, '_blank');
          return [`Redirecting to Simulator: SELL ${quantity} ${stockSymbol}.`];
        } else {
          return ['Invalid stock symbol or quantity'];
        }
      } else {
        return ['Invalid sell command format'];
      }
    } catch (err) {
      console.error('Error in sell message:', err);
    }
  }
  