import mongoose from "mongoose";

// Transaction schema to track all FinCoin movements
const FinCoinTransactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transaction_type: {
    type: String,
    enum: ["earn", "spend"],
    required: true,
  },
  source: {
    type: String,
    enum: [
      "quiz_correct",
      "quiz_completion",
      "trade_execution",
      "daily_login",
      "milestone",
    ],
    required: true,
  },
  source_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: false,
  },
});

const FinCoinTransaction = mongoose.model(
  "FinCoinTransaction",
  FinCoinTransactionSchema
);

export default FinCoinTransaction;
