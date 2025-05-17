// import mongoose from "mongoose";

// const FCompareSchema = new mongoose.Schema({
//   bank: { type: String, required: true },
//   rate: { type: String, required: true },
//   issuanceFee: { type: String, required: true },
//   maxLoanTerm: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// // Create index for efficient querying
// FCompareSchema.index({ bank: 1 });
// FCompareSchema.index({ createdAt: -1 });

// const Compare = mongoose.model("Compare", FCompareSchema);
// export default Compare;


import mongoose from "mongoose";

const FCompareSchema = new mongoose.Schema({
  bank: { type: String, required: true },
  rate: { type: String, required: false, default: null },
  issuanceFee: { type: String, required: false, default: null },
  maxLoanTerm: { type: String, required: false, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Create index for efficient querying
FCompareSchema.index({ bank: 1 });
FCompareSchema.index({ createdAt: -1 });

const Compare = mongoose.model("Compare", FCompareSchema);
export default Compare;