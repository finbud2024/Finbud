import express from 'express';

const updateStockDB = express.Router();
updateStockDB.post("/updateStockDB", async (req, res) => {
    console.log("From updateStockDB.js: ", req.body);
    return res.status(200)
    // try {
    //     const cryptoData = await CryptoCurrency.find().where({ symbol: symbol, date: {
    //         $gte: new Date(req.body["startDate"]),
    //         $lte: new Date(req.body["endDate"])
    //         }}).sort({"date":-1});
    //     if (cryptoData.length > 0) {
    //         console.log(`Stock data for ${symbol}:`, cryptoData);
    //         return res.status(200).json(cryptoData)
    //     } else {
    //         console.log(`No Crypto data found for ${symbol}`);
    //     }
    // } catch (err) {
    //     return res.status(501).send('Internal sever error from js', err);
    // }
});  

export default updateStockDB;