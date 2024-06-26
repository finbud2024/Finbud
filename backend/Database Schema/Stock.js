import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    symbol : {type: String, require: true},
    price : {type:  Number, require: true},
    volume: {type:  Number, require: true},
    change : {type:  Number, require: true},
    percentChange : {type:  Number},
    date : { type: String, require: true},
    timeStamp : {type: Number},
})

const StockPrice = mongoose.model('StockPrice', StockSchema);
export default StockPrice;