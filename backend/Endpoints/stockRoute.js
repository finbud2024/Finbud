import express from 'express';
import StockPrice from '../Database Schema/Stock.js';
import validateRequest from '../utils/validateRequest.js';
import axios from 'axios';

const stockRoute = express.Router();

stockRoute.get("/api/stocks", async (req, res) => {
    try {
        const response = await axios.post(
            "https://scanner.tradingview.com/global/scan?label-product=markets-screener",
            {
                columns: [
                    "name", "description", "logoid", "update_mode", "type", "typespecs",
                    "country.tr", "country_code_fund", "market_cap_basic",
                    "fundamental_currency_code", "close", "pricescale", "minmov",
                    "fractional", "minmove2", "currency", "change", "relative_volume_10d_calc",
                    "price_earnings_ttm", "earnings_per_share_diluted_ttm",
                    "earnings_per_share_diluted_yoy_growth_ttm", "dividends_yield_current",
                    "sector.tr", "market", "sector", "recommendation_mark"
                ],
                ignore_unknown_fields: false,
                options: { lang: "vi" },
                range: [0, 10],
                sort: {
                    sortBy: "market_cap_basic",
                    sortOrder: "desc",
                    nullsFirst: false
                },
                preset: "worlds-largest-employers"
            },
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:135.0) Gecko/20100101 Firefox/135.0",
                    "Accept": "application/json",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Referer": "https://vn.tradingview.com/",
                    "Content-Type": "text/plain;charset=UTF-8",
                    "Origin": "https://vn.tradingview.com",
                    "Connection": "keep-alive"
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data from TradingView:", error.message);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

stockRoute.post("/updateStockDB", validateRequest(StockPrice.schema), async (req, res) => {
    const symbol = req.body.symbol;
    const listOfPrice = req.body.data;
    try {
        await getStockPrice(symbol, listOfPrice);
        return res.status(200).send(`Success saving data for Stock ${symbol}`);
    } catch (error) {
        return res.status(501).send("Internal error: " + error);
    }
});

stockRoute.get("/latestStock", async (req, res) => {
    try {
        const latestEntry = await StockPrice.findOne().sort({ date: -1 }).exec();
        if (latestEntry) {
            console.log(latestEntry.date);
            return res.status(200).json(latestEntry.date);
        } else {
            return res.status(404).send("No latest entry found");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});

async function getLatestDate(symbol) {
    const latestEntry = await StockPrice.findOne({ symbol: symbol }).sort({ date: -1 }).exec();
    if (latestEntry) {
        return latestEntry.date;
    } else {
        return null;
    }
}

async function getStockPrice(symbol, listOfPrice) {
    try {
        const latestDateInDB = await getLatestDate(symbol);
        console.log(`Latest Date for ${symbol}: `, new Date(latestDateInDB));
        for (const data of listOfPrice) {
            const recordDate = data["date"];
            if (!latestDateInDB || new Date(recordDate) > new Date(latestDateInDB)) {
                console.log(`Saving data for ${symbol} for date ${recordDate}`);
                await saveNewStock(symbol, data, recordDate);
            }
        }
        console.log(`Saving Stock ${symbol} complete!`);
    } catch (error) {
        console.log('Error in getStockPrice:', error);
    }
}

async function saveNewStock(symbol, data, recordDate) {
    const newStock = new StockPrice({
        symbol: symbol,
        open: data['open'],
        high: data['high'],
        low: data["low"],
        close: data['close'],
        volume: data['5. volume'],
        date: recordDate,
    });
    try {
        await newStock.save();
        console.log("Stock saved successfully", symbol);
    } catch (error) {
        console.log("Error saving new stock", error);
    }
}

export default stockRoute;
