import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({ 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //Arrays display user's portfolio overtime
    portfolio: [{
        date: { type: Date, required: true },
        totalValue: { type: Number, required: true }
    }]
})

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;

