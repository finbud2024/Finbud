/**
 * TradingView-compatible Stock Search Service
 * Maps Alpha Vantage data to TradingView format for consistency
 */

export class TradingViewSearchService {
  /**
   * Map Alpha Vantage region to proper TradingView exchange
   */
  static mapRegionToExchange(region, symbol, type) {
    // Handle US stocks
    if (region === "United States") {
      // Tech companies usually on NASDAQ
      const nasdaqPatterns = [
        /^(AAPL|GOOGL|GOOG|MSFT|AMZN|TSLA|NVDA|META|NFLX|ADBE|CRM|INTC|AMD|QCOM|ORCL|CSCO|AVGO)$/,
        /^[A-Z]{2,5}$/, // Most tech stocks have 2-5 letter symbols
      ];

      // Large corporations usually on NYSE
      const nysePatterns = [
        /^(JPM|BAC|WFC|GS|MS|JNJ|UNH|PFE|KO|WMT|HD|XOM|CVX|BA|CAT|GE|MMM)$/,
        /^[A-Z]{1,3}$/, // Traditional companies often have 1-3 letter symbols
      ];

      // Check patterns
      if (nasdaqPatterns.some((pattern) => pattern.test(symbol))) {
        return "NASDAQ";
      }
      if (nysePatterns.some((pattern) => pattern.test(symbol))) {
        return "NYSE";
      }

      // Default based on type
      if (type && type.toLowerCase().includes("etf")) {
        return "AMEX";
      }

      // Default fallback for US stocks
      return "NASDAQ";
    }

    // Handle other regions
    const regionMap = {
      Canada: "TSX",
      "United Kingdom": "LSE",
      Germany: "XETRA",
      Japan: "TSE",
      "Hong Kong": "HKEX",
      Australia: "ASX",
      France: "EURONEXT",
      Netherlands: "EURONEXT",
      Switzerland: "SIX",
      Italy: "BORSA",
      Spain: "BME",
    };

    return regionMap[region] || region;
  }

  /**
   * Search stocks using Alpha Vantage but format for TradingView
   */
  static async searchStocks(query) {
    try {
      // Try Alpha Vantage with proper exchange mapping
      const alphaVantageKey = process.env.VUE_APP_ALPHA_VANTAGE_API_KEY;
      if (alphaVantageKey) {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
            query
          )}&apikey=${alphaVantageKey}`
        );

        if (response.ok) {
          const data = await response.json();

          if (data.bestMatches) {
            return data.bestMatches.map((match) => {
              const symbol = match["1. symbol"];
              const region = match["4. region"];
              const type = match["3. type"];
              const exchange = this.mapRegionToExchange(region, symbol, type);

              return {
                symbol: symbol,
                name: match["2. name"],
                exchange: exchange,
                type: type,
                region: region, // Keep original region for reference
                fullSymbol: `${exchange}:${symbol}`,
                source: "alphavantage",
              };
            });
          }
        }
      }
    } catch (error) {
      console.warn("Alpha Vantage search failed:", error);
    }

    // Fallback to local stock database
    return this.searchLocalDatabase(query);
  }

  /**
   * Enhanced local stock database with proper TradingView exchanges
   */
  static searchLocalDatabase(query) {
    const stockDatabase = [
      // NASDAQ Tech Giants
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc. Class A",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "GOOG",
        name: "Alphabet Inc. Class C",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "TSLA",
        name: "Tesla Inc.",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "META",
        name: "Meta Platforms Inc.",
        exchange: "NASDAQ",
        type: "Common Stock",
      },
      {
        symbol: "NFLX",
        name: "Netflix Inc.",
        exchange: "NASDAQ",
        type: "Common Stock",
      },

      // NYSE Stocks
      {
        symbol: "JPM",
        name: "JPMorgan Chase & Co.",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "BAC",
        name: "Bank of America Corporation",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "WFC",
        name: "Wells Fargo & Company",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "JNJ",
        name: "Johnson & Johnson",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "UNH",
        name: "UnitedHealth Group Incorporated",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "PFE",
        name: "Pfizer Inc.",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "KO",
        name: "The Coca-Cola Company",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "WMT",
        name: "Walmart Inc.",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "HD",
        name: "The Home Depot Inc.",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "XOM",
        name: "Exxon Mobil Corporation",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "CVX",
        name: "Chevron Corporation",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "BA",
        name: "The Boeing Company",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "CAT",
        name: "Caterpillar Inc.",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "GE",
        name: "General Electric Company",
        exchange: "NYSE",
        type: "Common Stock",
      },
      {
        symbol: "MMM",
        name: "3M Company",
        exchange: "NYSE",
        type: "Common Stock",
      },

      // AMEX ETFs
      {
        symbol: "SPY",
        name: "SPDR S&P 500 ETF Trust",
        exchange: "AMEX",
        type: "ETF",
      },
      {
        symbol: "QQQ",
        name: "Invesco QQQ Trust",
        exchange: "NASDAQ",
        type: "ETF",
      },
      {
        symbol: "IWM",
        name: "iShares Russell 2000 ETF",
        exchange: "AMEX",
        type: "ETF",
      },

      // NYSE Examples like MUA
      {
        symbol: "MUA",
        name: "BlackRock MuniAssets Fund Inc",
        exchange: "NYSE",
        type: "Closed-End Fund",
      },
      {
        symbol: "MUE",
        name: "BlackRock Municipal Income Trust",
        exchange: "NYSE",
        type: "Closed-End Fund",
      },
      {
        symbol: "MUI",
        name: "BlackRock Municipal Income Trust II",
        exchange: "NYSE",
        type: "Closed-End Fund",
      },
    ];

    const queryLower = query.toLowerCase();

    return stockDatabase
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(queryLower) ||
          stock.name.toLowerCase().includes(queryLower)
      )
      .map((stock) => ({
        ...stock,
        fullSymbol: `${stock.exchange}:${stock.symbol}`,
        source: "local",
      }))
      .slice(0, 10);
  }
}

export default TradingViewSearchService;
