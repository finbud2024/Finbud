import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    cusip: {
        type: String,
        required: true
    },
    ownershipHistory: {
        type: Map,
        of: String,
        required: true
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create a compound index for investorId and companyName
portfolioSchema.index({ investorId: 1, companyName: 1 }, { unique: true });

const CompanyPortfolio = mongoose.model('CompanyPortfolio', portfolioSchema);

export default CompanyPortfolio; 