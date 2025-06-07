import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
    cik: {
        type: String,
        required: true
    },
    ticker: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    filings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Filings'
        }
    ]
})
const Company = mongoose.model("Company", CompanySchema);
export default Company;