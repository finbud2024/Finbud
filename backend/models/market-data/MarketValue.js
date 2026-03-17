import mongoose from 'mongoose';

const stockHoldingSchema = new mongoose.Schema({
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
    }
});

const combinedSchema = new mongoose.Schema({
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
    'Basic Stats': {
        type: Map,
        of: String,
        default: new Map()
    },
    'Industry Breakdown': {
        type: Map,
        of: String,
        default: new Map()
    },
    marketValue: [stockHoldingSchema],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for unique entries per investor and quarter
combinedSchema.index({ 
    investorId: 1, 
    quarter: 1
}, { unique: true });

const InvestorData = mongoose.model('InvestorData', combinedSchema, 'investorData');

export default InvestorData; 