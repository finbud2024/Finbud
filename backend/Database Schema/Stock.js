import mongoose from "mongoose";
//alphavantage API key always have these characteristics
const StockSchema = new mongoose.Schema({
    symbol: String,
    open: Number, 
    high:  Number, 
    low : Number, 
    close: Number, 
    change: Number, 
    volume: Number, 
    date: Date
})

const Stock = mongoose.model('Stock', StockSchema);
export default Stock;