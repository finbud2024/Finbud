import cron from "node-cron";
import { seedAllFxRates } from "../utils/fxService.js";

// define the currency pairs you want to keep up-to-date:
const PAIRS = [
  { from: "USD", to: "EUR" },
  { from: "USD", to: "JPY" },
  { from: "EUR", to: "GBP" },
  // …add as many as you need
];

// Schedule the job to run once per day at 2:00 AM CST
const fxSchedule = cron.schedule(
  "0 2 * * *",            // minute (0), hour (2), every day 
  async () => {
    console.log("🔄 Starting FX seedAllFxRates job");
    try {
      const results = await seedAllFxRates(PAIRS, /* pauseMs = */ 15_000);
      console.log(
        `✅ FX rates updated for ${results.length} pairs on ${new Date().toLocaleString()}`
      );
    } catch (err) {
      console.error("❌ FX seed job failed:", err);
    }
  },
  {
    scheduled: true,
    timezone: "America/Chicago",
  }
);

// kick it off
fxSchedule.start();

// for Netlify/AWS‐Lambda invocation
export const handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log("Lambda FX handler invoked");
  try {
    const results = await seedAllFxRates(PAIRS, 15_000);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "FX seed completed",
        updated: results.length,
      }),
    };
  } catch (error) {
    console.error("Lambda FX seed error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "FX seed failed", error: error.message }),
    };
  }
};
