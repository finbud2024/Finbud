import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    symbol: { 
        type: String, 
        required: true,
        unique: true
    },
    open: { type: [Number], },
    high: {  type: [Number], },
    low : { type: [Number], },
    close: { type: [Number], },
    change: { type: [Number], },
    volume: { type: [Number], },
    date: { 
        type: [Date], 
        required: true
    }
})

const Stock = mongoose.model('Stock', StockSchema);
export default Stock;