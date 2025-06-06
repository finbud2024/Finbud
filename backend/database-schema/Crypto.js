import mongoose from "mongoose";

const CryptoSchema = new mongoose.Schema({
    cryptoName: { type: String, required: true },
    symbol: { type: String, required: true },
    open: { type: Number, required: true },
    low:{type: Number},
    high: { type: Number},
    close: { type: Number, required: true },
    change: { type: Number},
    volume: { type: Number},
    //lastTradingDay: { type: Date }, // Optional field for the last trading day
    date: { type: Date, required: true}
});

const CryptoCurrency = mongoose.model('CryptoCurrency', CryptoSchema);
export default CryptoCurrency;