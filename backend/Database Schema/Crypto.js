import mongoose from "mongoose";

const CryptoSchema = new mongoose.Schema({
    cryptoName: [String],
    symbol: String,
    open: { type: Number, required: true },
    high: Numbers,
    close: { type: Number, required: true },
    change: Numbers,
    volume: Numbers,
    //lastTradingDay: { type: Date }, // Optional field for the last trading day
    date: { type: Date, required: true}
});

const CryptoCurrency = mongoose.model('CryptoCurrency', CryptoSchema);
export default CryptoCurrency;