import express from 'express';
import StockPrice from '../Database Schema/Stock.js';
import validateRequest from '../utils/validateRequest.js';
import axios from 'axios';

const stockRoute = express.Router();

stockRoute.get("/api/stocks", async (req, res) => {
    const { start = 0, end = 9, search } = req.query;

    const filter = search ? [{
        left: "name,description",
        operation: "match",
        right: search
    }] : undefined;



    try {
        const response = await axios.post(
            "https://scanner.tradingview.com/global/scan?label-product=markets-screener",
            {
                columns: [
                    "name", "logoid", "fundamental_currency_code", "close", "currency",
                    "change", "relative_volume_10d_calc", "price_earnings_ttm",
                    "earnings_per_share_diluted_ttm", "dividends_yield_current", "market", "sector"
                ],
                ignore_unknown_fields: false,
                options: { lang: "en" },
                range: [start, end],
                filter,
                sort: {
                    sortBy: "market_cap_basic",
                    sortOrder: "desc",
                    nullsFirst: false
                },
                preset: "worlds_largest_companies"
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
        const formattedData = response.data.data.map(stock => {
            return {
                name: stock.d[0],                   // Mã chứng khoán
                logo: stock.d[1],                     // Logo
                currency: stock.d[2],                 // Loại tiền tệ
                close: stock.d[3],                    // Giá đóng cửa
                priceCurrency: stock.d[4],           // Đơn vị tiền tệ của giá
                priceChange: stock.d[5],             // Tỷ lệ thay đổi giá
                relativeVolume: stock.d[6],          // Khối lượng giao dịch so với trung bình 10 ngày
                PERatio: stock.d[7],                 // Hệ số P/E (Price to Earnings)
                EPS: stock.d[8],                     // Thu nhập trên mỗi cổ phiếu
                dividendYield: stock.d[9],          // Lợi suất cổ tức
                market: stock.d[10],                  // Thị trường
                sector: stock.d[11]                   // Ngành
            };
        });

        res.json({
            totalCount: response.data.totalCount,
            stocks: formattedData
        });
    } catch (error) {
        console.error("Error fetching data from TradingView:", error);
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
