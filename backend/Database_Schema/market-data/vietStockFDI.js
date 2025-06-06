import mongoose from 'mongoose';

const vietStockFDISchema = new mongoose.Schema({
    xem_theo: {type: String, required: true},
    fromMonth: {type: String},
    toMonth: {type: String},
    fromYear: {type: String, required: true},
    toYear: {type: String, required: true},
    headers: [{ type: String }],
    data: [
        [{ type: String }]
    ]
});

const vietStockFDI = mongoose.model("vietStockFDI", vietStockFDISchema);
export default vietStockFDI;