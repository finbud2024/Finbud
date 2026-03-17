import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema({
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor',
        required: true
    },
    quarter: {
        type: String,
        required: true
    },
    'Basic Stats': {
        'Market Value': {
            type: String,
            required: true
        },
        'Top 10 (%)': {
            type: String,
            required: true
        },
        'Portfolio Size (Change from Prev.)': {
            type: String,
            required: true
        },
        'Avg. Holding Period': {
            type: String,
            required: true
        },
        'Turnover': {
            type: String,
            required: true
        }
    },
    'Industry Breakdown': {
        type: Map,
        of: String,
        default: new Map()
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index for investor and quarter
holdingSchema.index({ investorId: 1, quarter: 1 }, { unique: true });

const Holding = mongoose.model('Holding', holdingSchema, 'holdings');

export default Holding; 