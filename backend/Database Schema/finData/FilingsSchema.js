import mongoose from "mongoose";

const FilingsSchema = new mongoose.Schema({
    cik: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        enum: ["10-K", "10-Q", "8-K"],
        required: true
    },
    acessionNumber: String,
    documentUrl: String
})
const Filings = mongoose.model("Filings", FilingsSchema)
export default Filings