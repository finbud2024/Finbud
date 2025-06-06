import mongoose from "mongoose";

const FilingsSchema = new mongoose.Schema({
    cik: {
        type: String,
        required: true
    },
    reportType: {
        type: String,
        enum: ["10-K", "10-Q", "8-K", "DEFA14A", "DEF 14A", "4"],
        required: true
    },
    accessionNumber: String,
    documentUrl: String,
    filingDate: String,
    periodDate: String
})
const Filings = mongoose.model("Filings", FilingsSchema)
export default Filings