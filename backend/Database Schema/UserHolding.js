import mongoose from 'mongoose';

const userHoldingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
        unique: true
    },
    stocks: [{
        stockSymbol: { type: String, required: true },
        quantity: { type: Number, required: true },
        purchasePrice: { type: Number, required: true },
    }]   
});

const UserHolding = mongoose.model('UserHolding', userHoldingSchema);   

export default UserHolding;