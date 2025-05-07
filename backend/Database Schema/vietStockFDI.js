import mongoose from 'mongoose';

const vietStockFDISchema = new mongoose.Schema({
    xem_theo: {type: String, required: true},
    month: {type: String, required: false},
    year: {type: String, required: true},
    value: [{  
        category: {type: String},
        chi_tieu: {type: String},
        don_vi: {type: String},
        gia_tri: {type: String}
    }]
});

const vietStockFDI = mongoose.model("vietStockFDI", vietStockFDISchema);
export default vietStockFDI;