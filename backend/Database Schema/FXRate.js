import mongoose from "mongoose";

const FXRateSchema = new mongoose.Schema({
  fromCurrency: { type: String, required: true, index: true },
  toCurrency:   { type: String, required: true, index: true },
  rate:         { type: Number, required: true },
  lastRefreshed:{ type: Date,   required: true },
}, {
  timestamps: false
});

FXRateSchema.index({ fromCurrency: 1, toCurrency: 1 }, { unique: true });

export default mongoose.model("FXRate", FXRateSchema);
