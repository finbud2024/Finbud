import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true }, // Add balance field
  date: { type: Date, default: Date.now },
  transaction: { type: String, required: true }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
