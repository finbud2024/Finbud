/**
 * TradingView Symbol Validator and Mapper
 * Ensures symbols are in the correct format and exist in TradingView
 */

// Common stock symbols with their proper TradingView format
export const SYMBOL_MAPPINGS = {
  // Tech Giants
  AAPL: "NASDAQ:AAPL",
  GOOGL: "NASDAQ:GOOGL",
  GOOG: "NASDAQ:GOOG",
  MSFT: "NASDAQ:MSFT",
  AMZN: "NASDAQ:AMZN",
  META: "NASDAQ:META",
  TSLA: "NASDAQ:TSLA",
  NVDA: "NASDAQ:NVDA",
  NFLX: "NASDAQ:NFLX",

  // Financial
  JPM: "NYSE:JPM",
  BAC: "NYSE:BAC",
  WFC: "NYSE:WFC",
  GS: "NYSE:GS",
  MS: "NYSE:MS",

  // Industrial
  BA: "NYSE:BA",
  CAT: "NYSE:CAT",
  GE: "NYSE:GE",
  MMM: "NYSE:MMM",

  // Healthcare
  JNJ: "NYSE:JNJ",
  UNH: "NYSE:UNH",
  PFE: "NYSE:PFE",
  ABBV: "NYSE:ABBV",

  // Consumer
  KO: "NYSE:KO",
  PEP: "NASDAQ:PEP",
  WMT: "NYSE:WMT",
  HD: "NYSE:HD",

  // Energy
  XOM: "NYSE:XOM",
  CVX: "NYSE:CVX",
  COP: "NYSE:COP",

  // ETFs
  SPY: "AMEX:SPY",
  QQQ: "NASDAQ:QQQ",
  IWM: "AMEX:IWM",
  VTI: "AMEX:VTI",
};

// Exchanges mapping for unknown symbols
export const EXCHANGE_MAPPING = {
  // Default exchanges for different types
  DEFAULT: "NASDAQ",
  ETF: "AMEX",
  CRYPTO: "BINANCE",
};

/**
 * Validate and format symbol for TradingView (without automatic exchange mapping)
 * @param {string} symbol - Raw symbol input
 * @param {boolean} autoMap - Whether to automatically map to exchanges (default: false)
 * @returns {string} - Validated symbol (with exchange prefix only if already present or autoMap=true)
 */
export function validateAndFormatSymbol(symbol, autoMap = false) {
  if (!symbol || typeof symbol !== "string") {
    console.warn("Invalid symbol provided:", symbol);
    return autoMap ? "NASDAQ:AAPL" : "AAPL"; // Safe fallback
  }

  const cleanSymbol = symbol.trim().toUpperCase();

  // If already has exchange prefix, validate format and keep it
  if (cleanSymbol.includes(":")) {
    const [exchange, ticker] = cleanSymbol.split(":");
    if (exchange && ticker && ticker.length > 0) {
      console.log(`✅ Symbol already formatted: ${cleanSymbol}`);
      return cleanSymbol;
    }
  }

  // If autoMap is disabled, return the clean symbol without exchange prefix
  if (!autoMap) {
    console.log(`📝 Using symbol without exchange prefix: ${cleanSymbol}`);
    return cleanSymbol;
  }

  // Only map to exchange if explicitly requested
  if (SYMBOL_MAPPINGS[cleanSymbol]) {
    const mappedSymbol = SYMBOL_MAPPINGS[cleanSymbol];
    console.log(`✅ Mapped ${cleanSymbol} to ${mappedSymbol}`);
    return mappedSymbol;
  }

  // For unknown symbols with autoMap enabled, try NASDAQ
  const formattedSymbol = `NASDAQ:${cleanSymbol}`;
  console.log(`⚠️ Unknown symbol ${cleanSymbol}, trying ${formattedSymbol}`);
  return formattedSymbol;
}

/**
 * Check if symbol exists in our known mappings
 * @param {string} symbol - Symbol to check
 * @returns {boolean} - True if symbol is known to work
 */
export function isKnownSymbol(symbol) {
  const cleanSymbol = symbol.trim().toUpperCase();
  return SYMBOL_MAPPINGS.hasOwnProperty(cleanSymbol);
}

/**
 * Get popular symbols for suggestions
 * @returns {Array} - Array of popular stock objects
 */
export function getPopularSymbols() {
  return Object.entries(SYMBOL_MAPPINGS)
    .slice(0, 10)
    .map(([symbol, fullSymbol]) => ({
      symbol: symbol,
      fullSymbol: fullSymbol,
      name: getCompanyName(symbol),
      exchange: fullSymbol.split(":")[0],
    }));
}

/**
 * Get company name for display
 * @param {string} symbol - Stock symbol
 * @returns {string} - Company name
 */
function getCompanyName(symbol) {
  const names = {
    AAPL: "Apple Inc.",
    GOOGL: "Alphabet Inc.",
    MSFT: "Microsoft Corporation",
    AMZN: "Amazon.com Inc.",
    META: "Meta Platforms Inc.",
    TSLA: "Tesla Inc.",
    NVDA: "NVIDIA Corporation",
    NFLX: "Netflix Inc.",
    JPM: "JPMorgan Chase & Co.",
    BAC: "Bank of America Corp.",
  };
  return names[symbol] || `${symbol} Corporation`;
}
