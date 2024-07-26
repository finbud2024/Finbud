import mongoose from 'mongoose';

const stockTransactionSchema = new mongoose.Schema({
  stockSymbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const StockTransaction = mongoose.model('StockTransaction', stockTransactionSchema);

export default StockTransaction;
