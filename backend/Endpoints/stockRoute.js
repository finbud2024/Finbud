import express from 'express';
import StockPrice from '../Database Schema/Stock.js';
import validateRequest from '../utils/validateRequest.js';

const stockRoute = express.Router();

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
