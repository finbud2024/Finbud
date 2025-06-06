import cron from 'node-cron';
import axios from 'axios';
import mongoose from 'mongoose';
import User from '../database-schema/User.js';
import UserHolding from '../database-schema/UserHolding.js';
import Portfolio from '../database-schema/Portfolio.js';

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://finbud123:finbud123@cluster0.8mbj0ln.mongodb.net/development?retryWrites=true&w=majority&appName=Cluster0";

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
      currentPrice: data.c
    };
  } catch (error) {
    console.error(`Error fetching stock data for ${stockCode}:`, error.message);
    return null;
  }
};

const getAllUserStocks = async () => {
  try {
    const allHoldings = await UserHolding.find({});
    const uniqueStocks = new Set();
    
    allHoldings.forEach(holding => {
      holding.stocks.forEach(stock => {
        uniqueStocks.add(stock.stockSymbol);
      });
    });
    
    return Array.from(uniqueStocks);
  } catch (error) {
    console.error("Error fetching user stocks:", error.message);
    return [];
  }
};

const updateAllUserPortfolios = async (stockPrices) => {
  try {
    console.log("Updating all user portfolios using new stock prices");
    const userHoldings = await UserHolding.find({}).populate("userId");
    console.log(`Found ${userHoldings.length} user holdings`);
    
    for (const holding of userHoldings) {
      const user = holding.userId;
      if (!user) continue;
      
      let totalValue = user.bankingAccountData.cash;
    
      for (const stock of holding.stocks) {
        
        const updatedPrice = stockPrices[stock.stockSymbol];
        totalValue += stock.quantity * updatedPrice;
      }
      
      
      user.bankingAccountData.stockValue = totalValue - user.bankingAccountData.cash;
      user.bankingAccountData.accountBalance = totalValue;
      await user.save();
      console.log(`Updated user ${user.accountData.username}'s portfolio`);
      
      
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
    console.log("All user portfolios updated");
  } catch (error) {
    console.error("Error updating user portfolios:", error.message);
  }
};

const updateStockData = async () => {
  console.log('Starting stock update job');
  
  const isConnected = await connectToMongoDB();
  if (!isConnected) return;
  
  try {
    const stockSymbols = await getAllUserStocks();
    console.log(`Found ${stockSymbols.length} unique stocks to update: ${stockSymbols.join(', ')}`);
    
    if (stockSymbols.length === 0) {
      console.log('No stocks found in user portfolios');
      return;
    }
    
  
    const stockPrices = {};
    for (const symbol of stockSymbols) {
      const stockData = await fetchStockData(symbol);
      if (!stockData) {
        console.error(`No stock data available for ${symbol}`);
        continue;
      }
      stockPrices[symbol] = stockData.currentPrice;

      // Avoid rate limiting by adding a short delay between API requests
      //60 reqs/sec
      await new Promise(resolve => setTimeout(resolve, 1100));
    }
    
    await updateAllUserPortfolios(stockPrices);
    console.log(stockPrices)
    console.log('Completed stock update job for all stocks');
  } catch (error) {
    console.error(`Error in stock update job:`, error.message);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
    }
  }
};

// Schedule the job to run at market close (4:00 PM ET) on weekdays (Monday-Friday)
const scheduleJob = cron.schedule('0 20 * * 1-5', async () => {
  console.log('Running scheduled stock update job');
  await updateStockData();
}, {
  scheduled: true,
  timezone: "America/New_York" 
});

export { updateStockData, scheduleJob };

// For development/testing
updateStockData();
