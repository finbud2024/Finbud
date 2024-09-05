import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    open: { type: Number, required: true },
    high: { type: Number},
    low : {type: Number},
    close: { type: Number, },
    change: { type: Number},
    volume: { type: Number},
    date: { type: Date, required: true}
})

const StockPrice = mongoose.model('StockPrice', StockSchema);
export default StockPrice;