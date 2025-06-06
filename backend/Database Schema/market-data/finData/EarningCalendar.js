import mongoose from "mongoose";

const EarningCalendarSchema = new mongoose.Schema({
    ticker: {
        type: String,
        required: true
    }, 
    name: String, 
    fiscalEndDate: Date, 
    marketCap: Number, 
    revenue: Number
})
const EarningCalendar = mongoose.model("EarningCalendar", EarningCalendarSchema);
export default EarningCalendar