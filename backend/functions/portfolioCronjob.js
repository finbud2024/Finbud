import cron from 'node-cron';
import axios from 'axios';
import mongoose from 'mongoose';
import Stock from '../Database Schema/Stock.js';
import User from '../Database Schema/User.js';
import UserHolding from '../Database Schema/UserHolding.js';
import Portfolio from '../Database Schema/Portfolio.js';

const MONGO_URI =  "mongodb+srv://finbud123:finbud123@cluster0.8mbj0ln.mongodb.net/development?retryWrites=true&w=majority&appName=Cluster0"

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB");
    return true;
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    return false;
  }
};


const fetchStockData = async (stockCode) => {
  try {
    const apiKey = process.env.VUE_APP_STOCK_API_KEY_FINNHUB || "curorapr01qt2ncgdjvgcurorapr01qt2ncgdk00";
    const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${stockCode}&token=${apiKey}`;
    
    console.log(`Fetching stock data for ${stockCode}`);
    const response = await axios.get(quoteUrl);
    const data = response.data;
    
    if (!data || !data.c) {
      console.error(`Failed to fetch data for ${stockCode}`);
      return null;
    }
    
    console.log(`Successfully fetched stock data for ${stockCode}`);
    return {
      symbol: stockCode,
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      change: data.d,
      volume: data.v,
      date: new Date()
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${stockCode}:`, error.message);
    return null;
  }
};


const saveStockData = async (stockData) => {
  try {
    if (!stockData) return null;
    
    console.log(`Saving stock data for ${stockData.symbol}`);
    const stock = new Stock(stockData);
    await stock.save();
    console.log(`Stock data saved for ${stockData.symbol}`);
    return stock;
  } catch (error) {
    console.error(`Error saving stock data:`, error.message);
    return null;
  }
};


const updateUserPortfolios = async (stockSymbol, currentPrice) => {
  try {
    console.log(`Finding users with ${stockSymbol} holdings`);
    

    const userHoldings = await UserHolding.find({
      "stocks.stockSymbol": stockSymbol
    }).populate('userId');
    
    console.log(`Found ${userHoldings.length} users with ${stockSymbol} holdings`);
    
    for (const userHolding of userHoldings) {
      const user = userHolding.userId;
      if (!user) continue;
      
      
      const stockHolding = userHolding.stocks.find(s => s.stockSymbol === stockSymbol);
      if (!stockHolding) continue;
      
     
      const holdingValue = stockHolding.quantity * currentPrice;
      
  
      const totalStockValue = userHolding.stocks.reduce((total, stock) => {
        if (stock.stockSymbol === stockSymbol) {
          return total + holdingValue;
        }
        return total + (stock.quantity * stock.purchasePrice);
      }, 0);
      
    
      user.bankingAccountData.stockValue = totalStockValue;
      user.bankingAccountData.accountBalance = user.bankingAccountData.cash + totalStockValue;
      await user.save();
      
      console.log(`Updated user ${user.accountData.username}'s portfolio with new ${stockSymbol} price`);
      
    
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let portfolio = await Portfolio.findOne({ userId: user._id });
      
      if (!portfolio) {
      
        portfolio = new Portfolio({
          userId: user._id,
          portfolio: [{
            date: new Date(),
            totalValue: user.bankingAccountData.accountBalance
          }]
        });
      } else {
        
        const todayEntry = portfolio.portfolio.find(entry => 
          new Date(entry.date).setHours(0, 0, 0, 0) === today.getTime()
        );
        
        if (todayEntry) {
          
          todayEntry.totalValue = user.bankingAccountData.accountBalance;
        } else {
       
          portfolio.portfolio.push({
            date: new Date(),
            totalValue: user.bankingAccountData.accountBalance
          });
        }
      }
      
      await portfolio.save();
      console.log(`Updated portfolio history for user ${user.accountData.username}`);
    }
    
    console.log(`All user portfolios updated for ${stockSymbol}`);
  } catch (error) {
    console.error(`Error updating user portfolios:`, error.message);
  }
};

/**
 * Main function to fetch stock data and update user portfolios
 */
const updateStockData = async () => {
  const STOCK_SYMBOL = 'AAPL'; //functions to update this list of every stock existed in user portfolio 
  
  console.log(`Starting stock update for ${STOCK_SYMBOL}`);
  
  // Connect to MongoDB
  const isConnected = await connectToMongoDB();
  if (!isConnected) return;
  
  try {
    // Fetch stock data
    const stockData = await fetchStockData(STOCK_SYMBOL);
    if (!stockData) {
      console.error(`No stock data available for ${STOCK_SYMBOL}`);
      return;
    }
    
    // Save stock data to database
    const savedStock = await saveStockData(stockData);
    if (!savedStock) return;
    
    // Update portfolios for users holding this stock
    await updateUserPortfolios(STOCK_SYMBOL, savedStock.close);
    
    console.log(`Completed stock update job for ${STOCK_SYMBOL}`);
  } catch (error) {
    console.error(`Error in stock update job:`, error.message);
  } finally {
    // Disconnect from MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }
};

// Schedule the job to run at market close (4:00 PM ET) on weekdays (Monday-Friday)
const scheduleJob = cron.schedule('0 20 * * 1-5', async () => {
  console.log('Running scheduled stock update job for AAPL');
  await updateStockData();
}, {
  scheduled: true,
  timezone: "America/New_York" 
});


export { updateStockData, scheduleJob };


// scheduleJob.start();
// console.log('AAPL stock update job scheduled to run at 4:00 PM ET on weekdays');

// For development
updateStockData();
