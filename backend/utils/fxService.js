// backend/services/fxService.js
import axios from "axios";
import FXRate from "../Database Schema/FXRate.js";

const ALPHA_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const BASE_URL  = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE";

async function fetchAndStorePair(from, to) {
  const url = `${BASE_URL}&from_currency=${from}&to_currency=${to}&apikey=${ALPHA_KEY}`;
  const resp = await axios.get(url);
  const data = resp.data["Realtime Currency Exchange Rate"];
  if (!data) throw new Error("Bad FX response");

  const rate         = parseFloat(data["5. Exchange Rate"]);
  const lastRefreshed= new Date(data["6. Last Refreshed"]);

  // upsert into Mongo
  return FXRate.findOneAndUpdate(
    { fromCurrency: from, toCurrency: to },
    { rate, lastRefreshed },
    { upsert: true, new: true }
  );
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Call this from a cron job, or from your server startup,
 * to populate (and re-populate) your FXRate collection.
 */
export async function seedAllFxRates(pairs, pauseMs = 15_000) {
  const results = [];
  for (const { from, to } of pairs) {
    try {
      const doc = await fetchAndStorePair(from, to);
      results.push(doc);
    } catch (err) {
      console.error(`Failed ${from}->${to}:`, err.message);
    }
    await sleep(pauseMs);
  }
  return results;
}
