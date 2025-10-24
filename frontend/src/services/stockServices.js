import axios from "axios";

const fetchStockPrice = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY;
    const apiUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`;
    console.log(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`
    );
    const response = await axios.get(apiUrl);
    if (response.data.Note) {
      console.error("API Limit hit:", response.data.Note);
      return null;
    }
    console.log("API Response:", response.data);
    const priceData = response.data["Global Quote"];
    const stockPrice = priceData["05. price"];

    console.log(
      `Successfully fetched stock price for ${stockCode}: $${stockPrice}`
    );
    return stockPrice;
  } catch (error) {
    console.error(
      "Error fetching stock price:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

const fetchSimBannerStockData = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY;
    const priceUrl = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockCode}&apikey=${apiKey}`;
    const fundamentalsUrl = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockCode}&apikey=${apiKey}`;

    const [priceResponse, fundamentalsResponse] = await Promise.all([
      axios.get(priceUrl),
      axios.get(fundamentalsUrl),
    ]);

    const priceData = priceResponse.data["Global Quote"];

    const fundamentalsData = fundamentalsResponse.data;

    console.log({ priceData, fundamentalsData });
    return {
      open: priceData["02. open"] || "N/A",
      close: priceData["08. previous close"] || "N/A",
      high: priceData["03. high"] || "N/A",
      low: priceData["04. low"] || "N/A",
      marketCap: fundamentalsData["MarketCapitalization"] || "N/A",
      volume: priceData["06. volume"] || "N/A",
      eps: fundamentalsData["EPS"] || "N/A",
      peRatio: fundamentalsData["PERatio"] || "N/A",
      pbr: fundamentalsData["PriceToBookRatio"] || "N/A",
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
};

const fetchSimBannerStockDatav2 = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY_POLYGON;

    const priceUrl = `https://api.polygon.io/v2/aggs/ticker/${stockCode}/prev?adjusted=true&apiKey=${apiKey}`;

    const fundamentalsUrl = `https://api.polygon.io/vX/reference/financials?ticker=${stockCode}&apiKey=${apiKey}`;

    const tickerDetailsUrl = `https://api.polygon.io/v3/reference/tickers/${stockCode}?apiKey=${apiKey}`;

    const [priceResponse, fundamentalsResponse, tickerDetailsResponse] =
      await Promise.all([
        axios.get(priceUrl),
        axios.get(fundamentalsUrl),
        axios.get(tickerDetailsUrl),
      ]);

    const priceData =
      priceResponse.data.results && priceResponse.data.results.length > 0
        ? priceResponse.data.results[0]
        : {};

    const fundamentalsResults = fundamentalsResponse.data.results;
    const fundamentalsData =
      fundamentalsResults &&
      fundamentalsResults.length > 0 &&
      fundamentalsResults[0].financials
        ? fundamentalsResults[0].financials
        : {};

    const tickerDetails = tickerDetailsResponse.data.results || {};
    console.log({ priceData, fundamentalsData, tickerDetails });
    return {
      open: priceData.o || "N/A",
      close: priceData.c || "N/A",
      high: priceData.h || "N/A",
      low: priceData.l || "N/A",
      volume: priceData.v || "N/A",
      marketCap: tickerDetails.market_cap || "N/A",
      eps: fundamentalsData.eps || "N/A",
      peRatio: fundamentalsData.peRatio || fundamentalsData.pe_ratio || "N/A",
      pbr:
        fundamentalsData.priceToBookRatio ||
        fundamentalsData.price_to_book ||
        "N/A",
    };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return null;
  }
};

const fetchSimBannerStockDatav3 = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY_FINNHUB;
    
    // Skip Finnhub API calls if no API key is available
    if (!apiKey) {
      console.warn('Finnhub API key not available, skipping external API calls');
      return null;
    }

    console.log(`[Finnhub Service] Fetching data for: ${stockCode}`);
    console.log(`[Finnhub Service] API Key present: ${!!apiKey}`);

    if (!apiKey) {
      console.error(
        "[Finnhub Service] Missing API key: VUE_APP_STOCK_API_KEY_FINNHUB"
      );
      return null;
    }

    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${stockCode}&token=${apiKey}`;
    const metricUrl = `https://finnhub.io/api/v1/stock/metric?symbol=${stockCode}&metric=all&token=${apiKey}`;
    const profileUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${stockCode}&token=${apiKey}`;

    console.log(
      `[Finnhub Service] Quote URL: ${quoteUrl.replace(apiKey, "[API_KEY]")}`
    );
    console.log(
      `[Finnhub Service] Metric URL: ${metricUrl.replace(apiKey, "[API_KEY]")}`
    );
    console.log(
      `[Finnhub Service] Profile URL: ${profileUrl.replace(
        apiKey,
        "[API_KEY]"
      )}`
    );

    const [quoteResponse, metricResponse, profileResponse] = await Promise.all([
      axios.get(quoteUrl),
      axios.get(metricUrl),
      axios.get(profileUrl),
    ]);

    console.log(`[Finnhub Service] API responses received for ${stockCode}`);

    const quoteData = quoteResponse.data;
    const metricData =
      (metricResponse.data && metricResponse.data.metric) || {};
    const profileData = profileResponse.data || {};

    console.log(`[Finnhub Service] Quote data:`, quoteData);
    console.log(`[Finnhub Service] Available volume in quote:`, quoteData.v);
    console.log(`[Finnhub Service] Metric data:`, metricData);
    console.log(`[Finnhub Service] Volume metrics available:`, {
      "10DayAvg": metricData["10DayAverageTradingVolume"],
      "3MonthAvg": metricData["3MonthAverageTradingVolume"],
    });
    console.log(`[Finnhub Service] Profile data:`, profileData);

    // Format volume data - Finnhub provides volume metrics in millions
    let volumeDisplay = "N/A";
    if (quoteData.v) {
      // If current volume is available (actual shares traded today)
      volumeDisplay = (quoteData.v / 1000000).toFixed(2) + "M";
    } else if (metricData["10DayAverageTradingVolume"]) {
      // Fallback to 10-day average (already in millions)
      volumeDisplay = metricData["10DayAverageTradingVolume"].toFixed(2) + "M";
    } else if (metricData["3MonthAverageTradingVolume"]) {
      // Fallback to 3-month average (already in millions)
      volumeDisplay = metricData["3MonthAverageTradingVolume"].toFixed(2) + "M";
    }

    const result = {
      livePrice: quoteData.c || "N/A",
      open: quoteData.o || "N/A",
      close: quoteData.pc || "N/A",
      high: quoteData.h || "N/A",
      low: quoteData.l || "N/A",
      volume: volumeDisplay,
      marketCap: profileData.marketCapitalization || "N/A",
      eps: metricData.epsNormalizedAnnual || "N/A",
      peRatio: metricData.peNormalizedAnnual || "N/A",
      pbr: metricData.pb || "N/A",
    };

    console.log(`[Finnhub Service] Final result for ${stockCode}:`, result);
    return result;
  } catch (error) {
    console.error(
      `[Finnhub Service] Error fetching stock data for ${stockCode}:`,
      error
    );
    if (error.response) {
      console.error(
        `[Finnhub Service] Response status:`,
        error.response.status
      );
      console.error(`[Finnhub Service] Response data:`, error.response.data);
    }
    return null;
  }
};

export {
  fetchStockPrice,
  fetchSimBannerStockData,
  fetchSimBannerStockDatav2,
  fetchSimBannerStockDatav3,
};
