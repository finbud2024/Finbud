import mongoose from 'mongoose';

const userHoldingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    //Arrays of stocks symbol + quantity
    stocks: [{
        stockSymbol: { type: String, required: true },
        quantity: { type: Number, required: true }
    }]   
});

const UserHolding = mongoose.model('UserHolding', userHoldingSchema);   

export default UserHolding;