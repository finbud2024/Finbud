
import mongoose from 'mongoose';
import moment from 'moment';
import axios from 'axios';
// import dotenv from 'dotenv';
import StockPrice from '..//Database Schema/Stock.js';
import CryptoCurrency from '../Database Schema/Crypto.js'
//MongoDB connect
const apiKey = 'CKMO3Q3NLK0OOSZG';

// console.log(todayDate);
// autoGetPrice();
async function autoGetPrice(){
    var todayDate = await resetToMidNight(new Date());
    const latestDateInStockDB = await getLatestDate(StockPrice);
    const latestDateInCryptoDB = await getLatestDate(CryptoCurrency);
    console.log("Latest date in Stock DB:",new Date(latestDateInStockDB));
    console.log("Latest date :",new Date(todayDate));
    if(new Date(todayDate) > new Date(latestDateInStockDB)){
        getStockPrice();
    }else{
        console.log("Today Date is equal to the latest Date in Stock, so no need to update DB");
    }
    console.log("Latest date in Crypto DB:", new Date(latestDateInCryptoDB));
    console.log("today Date:", new Date(todayDate));
    if(new Date(todayDate) > new Date(latestDateInCryptoDB)){
        getCryptoPrice();
    }else{
        console.log("Today Date is equal to the latest Date in Crypto, so no need to update DB");
    }
}
const firstofFebuary = moment("2024-02-01", "YYYY-MM-DD").toDate();
async function resetToMidNight(date){
     date.setUTCDate(date.getUTCDate()-1);
    date.setUTCHours(0, 0, 0, 0);
    return  date;
}

// 'mongodb+srv://kat46:kat46@cluster0.ntsqlct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));
// Get Crypto Price to MongoDB 
async function getStockPrice() {
    const listOfStocks = ['IBM','AAPL', 'MSFT', 'GOOGL', 'AMZN', 'FB', 'TSLA', 'BRK.B', 'NVDA', 'JNJ', 'WMT', 'JPM', 'PG', 'DIS', 'MA', 'NFLX', 'ADBE', 'PYPL', 'INTC', 'CSCO'];
    try {
        const requests = listOfStocks.map(symbol => fetchStockPrice(symbol));
        const responses = await Promise.all(requests);
        console.log('Stock responses:', responses);
        const latestDateInDB = await getLatestDate(StockPrice);
        responses.forEach(response => {
            if (!response) return;
            const metaData = response['Meta Data'];
            const listOfPrice = response['Time Series (Daily)'];
            if (!metaData || !listOfPrice) {
                console.log('Missing metadata or time series data:', response);
                return;
            }
            // console.log("latestDateInDB: ", latestDateInDB);
            // console.log("firstofFebuary: ", firstofFebuary);
            for (const [date, data] of Object.entries(listOfPrice)) {
                const recordDate = moment(date, "YYYY-MM-DD").toDate();
                // console.log("recordDate:",recordDate);
                if ((!latestDateInDB || new Date(recordDate) > new Date(latestDateInDB)) && (new Date(recordDate) > new Date(firstofFebuary))) {
                    console.log(`Saving Stock data for ${metaData["2. Symbol"]} for date ${recordDate}`);
                    saveNewStock(metaData, data, recordDate);
                }
            }
            
            console.log("Saving Stock complete!")
        });
    } catch (error) {
        console.log('Error in getStockPrice:', error);
    }
}
async function fetchStockPrice(stockSymbol) {
    const urlStock = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`;
    try {
        const res = await axios.get(urlStock, {
            headers: { 'User-Agent': 'request' }
        })
        return res.data;
    } catch (error) {
        console.log('Error', error);
    }
}
async function saveNewStock(metaData, data, recordDate) {
    const newStock = new StockPrice({
        symbol: metaData['2. Symbol'],
        open: data['1. open'],
        high: data['2. high'],
        close: data['4. close'],
        volume: data['5. volume'],
        date: recordDate,
    })
    try {
        const savedCrypto = newStock.save();
        console.log("Stock saved Successfully", metaData['2. Symbol']);
    } catch (error) {
        console.log("Error saving new stock", error);
    }
}

// Get Crypto Price to MongoDB 
async function getCryptoPrice() {
    const listOfCryptos = ['BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'SOL', 'DOT', 'DOGE', 'LUNA', 'LINK', 'AVAX', 'MATIC', 'ALGO', 'ATOM', 'UNI', 'ICP', 'FTT', 'VET', 'AAVE', 'XTZ'];
    try {
        const requests = listOfCryptos.map(symbol => fetchCryptoPrice(symbol));
        const responses = await Promise.all(requests);
        console.log('Crypto responses:', responses);
        const latestDateInDB = await getLatestDate(CryptoCurrency);
        responses.forEach(response => {
            if (!response) return;
            const metaData = response['Meta Data'];
            const listOfPrice = response['Time Series (Digital Currency Daily)'];
            if (!metaData || !listOfPrice) {
                console.log('Missing metadata or time series data:', response);
                return;
            }
            console.log("latestDateInDB: ", latestDateInDB);
            console.log("firstofFebuary: ", firstofFebuary);
            for (const [date, data] of Object.entries(listOfPrice)) {
                const recordDate = moment(date, "YYYY-MM-DD").toDate();
                console.log("recordDate:", recordDate);
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
async function fetchCryptoPrice(cryptoSymbol) {
    const urlCrypto = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${cryptoSymbol}&market=EUR&apikey=${apiKey}`;
    try {
        const res = await axios.get(urlCrypto, {
            headers: { 'User-Agent': 'request' }
        })
        return res.data
    } catch (error) {
        console.error('Error:', error);
    }
};
async function getLatestDate(dataBaseName) {
    const latestEntry = await dataBaseName.findOne().sort({ date: -1 }).exec();
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
        console.log("Crypto dave succesfully", metaData["2. Digital Currency Code"]);
    } catch (error) {
        console.log("Error saving new Crypto", error);
    }
}