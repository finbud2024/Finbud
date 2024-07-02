import express from 'express';
import CryptoCurrency from '../Database Schema/Crypto.js';
import moment from 'moment';
const cryptoRoute = express.Router();
cryptoRoute.post("/queryRoute", async (req, res) => {
    console.log("From cryptoRoute.js: ", req.body["symbol"], req.body["startDate"], req.body["endDate"]);
    const symbol = req.body["symbol"];
    try {
        const cryptoData = await CryptoCurrency.find().where({
            symbol: symbol, date: {
                $gte: new Date(req.body["startDate"]),
                $lte: new Date(req.body["endDate"])
            }
        }).sort({ "date": -1 });
        if (cryptoData.length > 0) {
            console.log(`Stock data for ${symbol}:`, cryptoData);
            return res.status(200).json(cryptoData)
        } else {
            console.log(`No Crypto data found for ${symbol}`);
        }
    } catch (err) {
        return res.status(501).send('Internal sever error from js', err);
    }
});
cryptoRoute.post("/updateCryptoDB", async (req, res) => {
    try {
        getCryptoPrice(req.body)
        return res.status(200).send("Success saving all Crypto Prices")
    } catch (error) {
        return res.status(501).send('Internal sever error from js', err);
    }

});
// Function to get the latest entry in database
cryptoRoute.get("/latestCrypto", async (req, res) => {
    try {
        const latestEntry = await CryptoCurrency.findOne().sort({ date: -1 }).exec();
        if (latestEntry) {
            console.log(latestEntry.date)
            return res.status(200).json(latestEntry.date);
        } else {
            return null;
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});
async function getCryptoPrice(listOfCryptos) {
    try {
        console.log('Crypto responses:', listOfCryptos);
        const firstofFebuary = moment("2024-02-01", "YYYY-MM-DD").toDate();
        listOfCryptos.forEach(async response => {
            if (!response) return;
            const metaData = response['Meta Data'];
            const latestDateInDB = await getLatestDate(metaData["2. Digital Currency Code"]);
            const listOfPrice = response['Time Series (Digital Currency Daily)'];
            if (!metaData || !listOfPrice) {
                console.log('Missing metadata or time series data:', response);
                return;
            }
            console.log(`latest Date for ${metaData["2. Digital Currency Code"]}: ` , latestDateInDB);
            console.log("firstofFebuary: ", firstofFebuary);
            for (const [date, data] of Object.entries(listOfPrice)) {
                const recordDate = moment(date, "YYYY-MM-DD").toDate();
                if ((!latestDateInDB || new Date(recordDate) > new Date(latestDateInDB)) && (new Date(recordDate) > new Date(firstofFebuary))) {
                    console.log(`Saving data for ${metaData["2. Digital Currency Code"]} for date ${recordDate}`);
                    saveNewCrypto(metaData, data, recordDate);
                }
            }
            console.log("Saving Crypto complete!")
        });
    } catch (error) {
        console.log('Error in getCryptoPrice:', error);
    }
}
async function getLatestDate(symbol) {
    const latestEntry = await CryptoCurrency.findOne({symbol: symbol}).sort({ date: -1 }).exec();
    if (latestEntry) {
        return latestEntry.date;
    } else {
        return null;
    }
}
async function saveNewCrypto(metaData, data, recordDate) {
    const newCrypto = new CryptoCurrency({
        cryptoName: metaData['3. Digital Currency Name'],
        symbol: metaData["2. Digital Currency Code"],
        open: data['1. open'],
        high: data['2. high'],
        close: data['4. close'],
        volume: data['5. volume'],
        date: recordDate,
    })
    try {
        const savedCrypto = await newCrypto.save();
        console.log("Crypto save succesfully", metaData["2. Digital Currency Code"], "for date", recordDate);
    } catch (error) {
        console.log("Error saving new Crypto", error);
    }
}

export default cryptoRoute;