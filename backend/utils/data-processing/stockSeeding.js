import Stock from "../../Database_Schema/market-data/Stock.js";
import mongoose from "mongoose";
import axios from "axios";
import stockData from '../../frontend/src/views/hardcodeData/StockData.js'

const mongoURI = "YOUR MONGODB URI";
const key = "YOUR KEY";
const limitPerMinute = 5;
const symbols = stockData.map(stock => stock.ticker);

//connect to mongodb
const connectToMongoDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000 // 30 seconds timeout
    })
      .then(() => {
        console.log("Connected to MongoDB");
        resolve();
      })
      .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        reject(err);
        process.exit(1);
      });
  });
};
//connect to mongodb
await connectToMongoDB();

const apiServices = async (symbol) => {
  try {
    //Setting timeframe filter
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    const oneYearAgo = new Date(currentDate);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    //take formatted date for apiccall
    const formattedCurrentDate = currentDate.toISOString().split('T')[0];
    const formattedOneYearAgo = oneYearAgo.toISOString().split('T')[0];
    // console.log("Most recent date: ", formattedCurrentDate);
    // console.log("One year ago: ", formattedOneYearAgo);
    //call api to get stock data
    const api = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${formattedOneYearAgo}/${formattedCurrentDate}?adjusted=true&sort=desc&apiKey=${key}`;
    const response = await axios.get(api);
    const data = response.data.results;
    //filter data to get only the data from the past year
    const filteredData = data.map(dataPoint => ({
      symbol: symbol,
      open: dataPoint.o,
      high: dataPoint.h,
      low: dataPoint.l,
      close: dataPoint.c,
      change: dataPoint.c - dataPoint.o,
      volume: dataPoint.v,
      date: new Date(dataPoint.t)
    }))
    console.log('filteredData length: ', filteredData.length);
    return filteredData;
  } catch (err) {
    console.log('Error while seeding stock data: ', err.response.data);
    return [];
  }
}

//pull stock data from API
const getStockData = async (symbol) => {
  //check to see stock already exist in database ------> skip if already exist
  const stockCheck = await Stock.findOne({ symbol: symbol });
  if (stockCheck) {
    console.log(`Skipping symbol ${symbol}. Already exists in database`);
    return 1;
  }
  console.log(`Working on symbol ${symbol}`)
  //call api to get stock data
  const data = await apiServices(symbol);
  //save filtered stock data within 1 year frame into database
  for (let dataPoint of data) {
    try {
      const newStock = new Stock(dataPoint);
      newStock.save();
    } catch (err) {
      console.log(`Error while saving ${symbol} for date ${Object.keys(dataPoint)}: ${err.message}`)
      //remove all and retry
      Stock
        .deleteMany({ symbol: { $eq: symbol } })
        .then(() => console.log(`successfully removed all ${symbol}`))
        .catch((err) => console.log("Error while Deleting: ", err.message));
      return -1;
    }
  }
  console.log(`Stock data for ${symbol} seeded successfully`);
  return 0;
};

// sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// seed stock data into database
const seedSymbols = async () => {
  console.log("seeding database in progress.....")
  for(let i = 0, j = 0; i < symbols.length; i++){
    const result = await getStockData(symbols[i]);
    if(result === 0){
      j++;
    }else if(result === 1){
      continue;
    }else {
      j++;
      i--;
    }
    if((j+1) % limitPerMinute === 0){
      console.log(`Pausing for a minute after processing ${i+1} symbols...`);
      await sleep(60000);
    }
  }
};
await seedSymbols();

console.log("Database seeding completed!")
process.exit(0);

// const testingData = {
//   ticker: 'AAPL',
//   queryCount: 250,
//   resultsCount: 250,
//   adjusted: true,
//   results: [
//     {
//       v: 50340308,
//       vw: 228.9102,
//       o: 230.19,
//       c: 229,
//       h: 230.4,
//       l: 227.48,
//       t: 1724990400000,
//       n: 594026
//     },
//     {
//       v: 51072782,
//       vw: 231.0131,
//       o: 230.1,
//       c: 229.79,
//       h: 232.92,
//       l: 228.88,
//       t: 1724904000000,
//       n: 723070
//     },
//   ],
//   status: 'OK',
//   request_id: 'ee8c694e2978a7758e97ea3d33d36b9d',
//   count: 250
// }