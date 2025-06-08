import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    cik: {
        type: String,
        required: true
    },
    form4: {
        type: String
    },
    transactionType: [{
        type: String, 
        enum: ['A', 'P', 'S', 'M', 'G', 'F']
    }],
    numberShares: [{
        type: Number
    }], 
    values: [{
        type: Number
    }],
    filingDate: {
        type: Date
    },
    isProcessed:{
        type: Boolean,
        default: false
    }
})
const InsiderTransaction = mongoose.model("InsiderTransaction", TransactionSchema)
export default InsiderTransaction;