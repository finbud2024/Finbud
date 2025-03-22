import mongoose from 'mongoose';

const marketValueSchema = new mongoose.Schema({
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    quarter: {
        type: String,
        required: true
    },
    Ticker: {
        type: String,
        required: true
    },
    "Company Name": {
        type: String,
        required: true
    },
    "Market Value": {
        type: String,
        required: true
    },
    "Weight": {
        type: String,
        required: true
    },
    "Shares": {
        type: String,
        required: true
    },
    "Change": {
        type: String,
        required: true
    },
    "Change in Shares": {
        type: String,
        required: true
    },
    "Quarter End Price": {
        type: String,
        required: true
    },
    "Percentage Owned": {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for unique entries
marketValueSchema.index({ 
    investorId: 1, 
    quarter: 1, 
    Ticker: 1 
}, { unique: true });

const MarketValue = mongoose.model('MarketValue', marketValueSchema, 'marketValues');

export default MarketValue; 