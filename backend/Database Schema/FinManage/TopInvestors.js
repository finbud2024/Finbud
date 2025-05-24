import mongoose from 'mongoose';

const investorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true
    },
    marketValue: {
        type: String,
        required: true
    },
    positions: {
        type: String,
        required: true
    },
    holdingPeriod: {
        type: String,
        required: false
    },
    stocks: [String],
    turnover: {
        type: String,
        required: true
    },
    profileURL: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

investorSchema.index({ name: 1 });
investorSchema.index({ marketValue: -1 });
investorSchema.index({ positions: -1 });

const TopInvestors = mongoose.model('Investor', investorSchema, 'investors');

export default TopInvestors; 