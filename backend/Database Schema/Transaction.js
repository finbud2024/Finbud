import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  date: { type: Date, default: Date.now, required: true },
  type: {type: String, required: true},
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
